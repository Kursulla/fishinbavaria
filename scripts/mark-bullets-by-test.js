/**
 * For each bullet in Fischkunde doc, check if any test question (question + correct answer)
 * overlaps with that bullet's content. Output: list of bullet line indices or unique
 * bullet signatures to mark with ★.
 */
const fs = require('fs');
const path = require('path');

const docPath = path.resolve(__dirname, '../docs/Fischkunde_Priprema_za_ispit.md');
const questionsPath = path.resolve(__dirname, 'fischkunde-questions.json');
const mappingPath = path.resolve(__dirname, 'fischkunde-test-mapping.json');

const doc = fs.readFileSync(docPath, 'utf-8');
const allQuestions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));

const questionByNumber = new Map(allQuestions.map((q) => [q.number, q]));

// Stopwords and min length to avoid noise
const STOP = new Set(
  'die der das den dem des ein eine einer und ist sind hat haben wird werden kann können zur zum zur vom von auf aus bei nach mit für dass wenn als'.split(
    ' '
  )
);
const MIN_LEN = 3;
const KEY_TERMS = new Set([
  'kieslaicher',
  'krautlaicher',
  'barteln',
  'schonzeit',
  'schonmaß',
  'rundschuppen',
  'kammschuppen',
  'schmelzschuppen',
  'fettflosse',
  'unterständig',
  'oberständig',
  'endständig',
  'salmoniden',
  'cypriniden',
  'perciden',
  'hecht',
  'aal',
  'äsche',
  'karpfen',
  'barbe',
  'zander',
  'waller',
  'wels',
  'rutte',
  'quappe',
  'forelle',
  'huchen',
  'schleie',
  'rotfeder',
  'rotauge',
  'nerfling',
  'aland',
  'schied',
  'rapfen',
  'gründling',
  'brachse',
  'güster',
  'stichling',
  'sterlet',
  'stör',
  'neunauge',
  'schwimmblase',
  'schlundzähne',
  'laich',
  'milchner',
  'rogner',
  'laichhaken',
  'brutpflege',
  'glockidien',
  'querder',
  'wechselwarm',
  'kiemen',
  'seitenlinie',
  'hege',
  'flossensaum',
  'winterruhe',
  'gelbaal',
  'blankaal',
  'glasaal',
  'thymian',
  'maul',
  'maulspalte',
  'schuppen',
  'schlammpeitzger',
  'mühlkoppe',
  'flussbarsch',
  'kaulbarsch',
  'zingel',
  'schrätzer',
  'streber',
  'zwergwels',
  'blaufelchen',
  'seesaibling',
  'bachsaibling',
  'tigerfisch',
  'elsässer',
  'edelkrebs',
  'steinkrebs',
  'bitterling',
  'teichmuschel',
  'perlfisch',
  'nase',
  'zope',
  'zobel',
  'zährte',
  'schneider',
  'strömer',
  'moderlieschen',
  'karausche',
  'hasel',
  'aitel',
  'döbel',
  'renke',
  'felchen',
  'mairenke',
  'seelaube',
  'steinbeißer',
  'dorngrundel',
  'frauennerfling',
  'grundel',
  'lachs',
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

  const keyOverlap = bullet.keyFound.some((k) => qa.keyFound.includes(k) || combined.toLowerCase().includes(k));
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

// Parse document: lines, current section, bullets
const lines = doc.split('\n');
let currentSection = null;
const bullets = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();

  if (trimmed.startsWith('## 1. Opšta')) {
    currentSection = 'general';
    continue;
  }
  if (trimmed.startsWith('## 2. Po vrstama')) {
    currentSection = null;
    continue;
  }
  const m2 = trimmed.match(/^### 2\.\d+\s+(.+?)(?:\s+★)?\s*$/);
  if (m2) {
    const title = m2[1];
    if (title.startsWith('Aal ')) currentSection = 'Aal';
    else if (title.startsWith('Äsche ')) currentSection = 'Äsche';
    else if (title.startsWith('Bachforelle ')) currentSection = 'Bachforelle';
    else if (title.startsWith('Bachsaibling ')) currentSection = 'Bachsaibling';
    else if (title.startsWith('Barbe ')) currentSection = 'Barbe';
    else if (title.startsWith('Bitterling ')) currentSection = 'Bitterling';
    else if (title.startsWith('Blaufelchen ')) currentSection = 'Blaufelchen';
    else if (title.startsWith('Brachse ')) currentSection = 'Brachse';
    else if (title.startsWith('Edelkrebs') || title.includes('Steinkrebs')) currentSection = 'Edelkrebs';
    else if (title.startsWith('Elritze ')) currentSection = 'Elritze';
    else if (title.startsWith('Flussbarsch ')) currentSection = 'Flussbarsch';
    else if (title.startsWith('Gründling ')) currentSection = 'Gründling';
    else if (title.startsWith('Güster ')) currentSection = 'Güster';
    else if (title.startsWith('Hasel ')) currentSection = 'Hasel';
    else if (title.startsWith('Hecht ')) currentSection = 'Hecht';
    else if (title.startsWith('Huchen ')) currentSection = 'Huchen';
    else if (title.startsWith('Karpfen ')) currentSection = 'Karpfen';
    else if (title.startsWith('Karausche ')) currentSection = 'Karausche';
    else if (title.startsWith('Kaulbarsch ')) currentSection = 'Kaulbarsch';
    else if (title.startsWith('Laube')) currentSection = 'Laube';
    else if (title.startsWith('Mairenke')) currentSection = 'Mairenke';
    else if (title.startsWith('Moderlieschen ')) currentSection = 'Moderlieschen';
    else if (title.startsWith('Mühlkoppe ')) currentSection = 'Mühlkoppe';
    else if (title.startsWith('Nase ')) currentSection = 'Nase';
    else if (title.startsWith('Neunauge')) currentSection = 'Neunauge';
    else if (title.startsWith('Nerfling')) currentSection = 'Nerfling';
    else if (title.startsWith('Perlfisch ')) currentSection = 'Perlfisch';
    else if (title.startsWith('Regenbogenforelle ')) currentSection = 'Regenbogenforelle';
    else if (title.startsWith('Renke')) currentSection = 'Renke';
    else if (title.startsWith('Rotfeder ')) currentSection = 'Rotfeder';
    else if (title.startsWith('Rotauge ')) currentSection = 'Rotauge';
    else if (title.startsWith('Rutte')) currentSection = 'Rutte';
    else if (title.startsWith('Schied')) currentSection = 'Schied';
    else if (title.startsWith('Schleie ')) currentSection = 'Schleie';
    else if (title.startsWith('Schlammpeitzger ')) currentSection = 'Schlammpeitzger';
    else if (title.startsWith('Schneider ')) currentSection = 'Schneider';
    else if (title.startsWith('Schrätzer ')) currentSection = 'Schrätzer';
    else if (title.startsWith('Seeforelle ')) currentSection = 'Seeforelle';
    else if (title.startsWith('Seesaibling ')) currentSection = 'Seesaibling';
    else if (title.startsWith('Steinbeißer')) currentSection = 'Steinbeißer';
    else if (title.startsWith('Sterlet ')) currentSection = 'Sterlet';
    else if (title.startsWith('Stichling')) currentSection = 'Stichling';
    else if (title.startsWith('Stör ')) currentSection = 'Stör';
    else if (title.startsWith('Strömer ')) currentSection = 'Strömer';
    else if (title.startsWith('Streber ')) currentSection = 'Streber';
    else if (title.startsWith('Waller')) currentSection = 'Waller';
    else if (title.startsWith('Zander ')) currentSection = 'Zander';
    else if (title.startsWith('Zährte')) currentSection = 'Zährte';
    else if (title.startsWith('Zingel ')) currentSection = 'Zingel';
    else if (title.startsWith('Zobel ')) currentSection = 'Zobel';
    else if (title.startsWith('Zope ')) currentSection = 'Zope';
    else if (title.startsWith('Zwergwels ')) currentSection = 'Zwergwels';
    else if (title.startsWith('Giebel ')) currentSection = 'Giebel';
    else if (title.startsWith('Grundeln')) currentSection = 'Grundeln';
    else if (title.startsWith('Lachs ')) currentSection = 'Lachs';
    else currentSection = null;
    continue;
  }

  // Bullet: starts with "- " and is not "**★ Pitanja iz testa**"
  if (line.startsWith('- ') && !trimmed.startsWith('- **★ Pitanja iz testa**') && currentSection) {
    const bulletText = trimmed.slice(2).replace(/^\★\s*/, '').trim();
    bullets.push({ lineIndex: i, section: currentSection, bulletText, rawLine: line });
  }
}

// For each section, get test question numbers
function getTestQuestionsForSection(section) {
  if (section === 'general') return mapping.generalInTest || [];
  let list = mapping.byFishInTest[section] || [];
  if (section === 'Edelkrebs') {
    const steinkrebs = mapping.byFishInTest['Steinkrebs'] || [];
    list = [...new Set([...list, ...steinkrebs])];
  }
  return list;
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

// Output: array of line indices to mark
const result = {
  totalBullets: bullets.length,
  markedCount: markedLineIndices.size,
  markedLineIndices: [...markedLineIndices].sort((a, b) => a - b),
};
fs.writeFileSync(
  path.resolve(__dirname, 'fischkunde-bullets-to-mark.json'),
  JSON.stringify(result, null, 2),
  'utf-8'
);
console.log('Bullets to mark:', result.markedCount, 'of', result.totalBullets);
