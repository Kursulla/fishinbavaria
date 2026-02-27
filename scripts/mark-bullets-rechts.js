/**
 * For each bullet in Rechtsvorschriften doc, check if any test question
 * (question + correct answer) overlaps with that bullet. Sections are
 * determined by ## and ### headers; test questions are assigned to sections
 * by keyword overlap.
 */
const fs = require('fs');
const path = require('path');

const docPath = path.resolve(__dirname, '../docs/Rechtsvorschriften_Priprema_za_ispit.md');
const questionsPath = path.resolve(__dirname, 'rechtsvorschriften-questions.json');
const testPath = path.resolve(__dirname, '../src/pages/tests/data/questionsFromTests.json');

const doc = fs.readFileSync(docPath, 'utf-8');
const allQuestions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));
const testQuestions = JSON.parse(fs.readFileSync(testPath, 'utf-8'));

const rechtsTestNumbers = [...new Set(
  testQuestions.filter((q) => q.category === 'Rechtsvorschriften').map((q) => q.number)
)];
const questionByNumber = new Map(allQuestions.map((q) => [q.number, q]));

const STOP = new Set(
  'die der das den dem des ein eine einer und ist sind hat haben wird werden kann können zur zum vom von auf aus bei nach mit für dass wenn als nur nicht ja nein'.split(' ')
);
const MIN_LEN = 3;

const KEY_TERMS = new Set([
  'fischereirecht', 'hegen', 'fangen', 'aneignen', 'herrenlos', 'fischfang', 'fischlaich',
  'fischnährtiere', 'krebse', 'fluss', 'teich', 'perlmuschel', 'hege', 'hegepflicht',
  'hegeziel', 'gewässer', 'geschlossen', 'fischteich', 'hochwasser', 'eigentümer',
  'fischereiberechtigt', 'unbefugt', 'diebstahl', 'fischwilderei', 'ordnungswidrigkeit',
  'fischereipacht', 'pächter', 'verpachtung', 'schriftform', 'erlaubnisschein',
  'fischereischein', 'kreisverwaltungsbehörde', 'gemeindeverwaltung', 'jugendfischereischein',
  'uferbetretungsrecht', 'schonbezirk', 'laichschonbezirk', 'fischereiaufseher',
  'schonmaß', 'schonzeit', 'avbayfig', 'bayfig', 'setzkescher', 'ganzjährig',
  'geschont', 'forellenregion', 'äschenregion', 'gemeinschaftsfischen', 'besatz',
  'aussetzen', 'handangel', 'tierschutz', 'betäubung', 'naturschutz', 'gemeingebrauch',
  'fischereiabgabe', 'unterverpachtung', 'dienstabzeichen', 'dienstausweis',
  'schwarzfischer', 'schonbestimmungen', 'volljährig', 'begleitung', 'helfer',
  'fischpässe', 'bodensee', 'bundeswasserstraßen', 'fischwasser', 'eigenverbrauch',
  'rückzusetzen', 'lebensfähig', 'fischbesatz', 'verordnung', 'artenschutz',
]);

function tokenize(text) {
  if (!text || typeof text !== 'string') return [];
  const normalized = text
    .toLowerCase()
    .replace(/[^\wäöüß\s]/g, ' ')
    .replace(/\s+/g, ' ');
  return normalized
    .split(' ')
    .filter((w) => w.length >= MIN_LEN && !STOP.has(w));
}

function getCorrectAnswerText(q) {
  if (!q || !q.options || !q.answer) return '';
  return q.options[q.answer] || '';
}

function tokensWithKeyTerms(text) {
  const tokens = tokenize(text);
  const keyFound = tokens.filter((t) => KEY_TERMS.has(t));
  const rest = tokens.filter((t) => !STOP.has(t) && t.length >= 4);
  return { keyFound, rest: [...new Set(rest)] };
}

function overlapEnough(bulletText, questionText, answerText) {
  const bullet = tokensWithKeyTerms(bulletText);
  const combined = questionText + ' ' + answerText;
  const qa = tokensWithKeyTerms(combined);

  const keyOverlap = bullet.keyFound.some(
    (k) => qa.keyFound.includes(k) || combined.toLowerCase().includes(k)
  );
  if (keyOverlap) return true;

  const restBullet = new Set(bullet.rest);
  const restQa = new Set(qa.rest);
  let count = 0;
  for (const w of restBullet) {
    if (restQa.has(w)) count++;
    if (count >= 2) return true;
  }
  return count >= 2;
}

// Parse document: sections (## or ###) and bullets
const lines = doc.split('\n');
let currentSection = null;
const bullets = [];
const sectionTexts = {}; // sectionId -> concatenated title + bullet texts for keyword assignment

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();

  const headerMain = trimmed.match(/^##\s+(\d+)\.\s+/);
  const headerSub = trimmed.match(/^###\s+(\d+)\.(\d+)\s+/);
  if (headerMain) {
    currentSection = headerMain[1];
    if (!sectionTexts[currentSection]) sectionTexts[currentSection] = [];
    sectionTexts[currentSection].push(trimmed);
    continue;
  }
  if (headerSub) {
    currentSection = headerSub[1] + '.' + headerSub[2];
    if (!sectionTexts[currentSection]) sectionTexts[currentSection] = [];
    sectionTexts[currentSection].push(trimmed);
    continue;
  }

  if (line.startsWith('- ') && currentSection) {
    const bulletText = trimmed.slice(2).replace(/^\★\s*/, '').trim();
    bullets.push({ lineIndex: i, section: currentSection, bulletText, rawLine: line });
    if (sectionTexts[currentSection]) sectionTexts[currentSection].push(bulletText);
  }
}

// Assign each test question to section(s) by keyword overlap (question+answer vs section text)
const sectionToTestNumbers = {};
for (const secId of Object.keys(sectionTexts)) {
  sectionToTestNumbers[secId] = [];
}
for (const num of rechtsTestNumbers) {
  const q = questionByNumber.get(num);
  if (!q) continue;
  const qaText = (q.question || '') + ' ' + getCorrectAnswerText(q);
  const qaTokens = new Set(tokenize(qaText));
  const qaKey = new Set(tokensWithKeyTerms(qaText).keyFound);

  for (const [secId, texts] of Object.entries(sectionTexts)) {
    const secText = texts.join(' ').toLowerCase();
    const secTokens = new Set(tokenize(secText));
    const secKey = new Set(tokensWithKeyTerms(secText).keyFound);
    let overlap = 0;
    for (const t of qaTokens) {
      if (secTokens.has(t)) overlap++;
    }
    const keyOverlap = [...qaKey].some((k) => secKey.has(k) || secText.includes(k));
    if (keyOverlap || overlap >= 2) {
      sectionToTestNumbers[secId].push(num);
    }
  }
}

function getTestQuestionsForSection(section) {
  const list = sectionToTestNumbers[section] || [];
  return [...new Set(list)];
}

const markedLineIndices = new Set();
for (const b of bullets) {
  const testNumbers = getTestQuestionsForSection(b.section);
  let matched = false;
  for (const num of testNumbers) {
    const q = questionByNumber.get(num);
    if (!q) continue;
    const answerText = getCorrectAnswerText(q);
    const questionText = q.question || '';
    if (overlapEnough(b.bulletText, questionText, answerText)) {
      matched = true;
      break;
    }
  }
  if (matched) markedLineIndices.add(b.lineIndex);
}

const result = {
  totalBullets: bullets.length,
  markedCount: markedLineIndices.size,
  markedLineIndices: [...markedLineIndices].sort((a, b) => a - b),
};
fs.writeFileSync(
  path.resolve(__dirname, 'rechts-bullets-to-mark.json'),
  JSON.stringify(result, null, 2),
  'utf-8'
);
console.log('Rechts: bullets to mark:', result.markedCount, 'of', result.totalBullets);
