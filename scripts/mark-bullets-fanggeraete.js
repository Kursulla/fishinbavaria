/**
 * Mark bullets in Fanggeräte HTML that overlap with test questions (questionsFromTests.json).
 * Output: HTML with ★ prepended to matching <li> content.
 */
const fs = require("fs");
const path = require("path");

const htmlPath = path.resolve(__dirname, "../public/docs/Fanggeräte_Priprema_za_ispit.html");
const questionsPath = path.resolve(__dirname, "fanggeräte-questions.json");
const testPath = path.resolve(__dirname, "../src/pages/tests/data/questionsFromTests.json");

let html = fs.readFileSync(htmlPath, "utf-8");
const allQuestions = JSON.parse(fs.readFileSync(questionsPath, "utf-8"));
const testQuestions = JSON.parse(fs.readFileSync(testPath, "utf-8"));

const testNumbers = [...new Set(
  testQuestions.filter((q) => q.category === "Fanggeräte").map((q) => q.number)
)];
const questionByNumber = new Map(allQuestions.map((q) => [q.number, q]));

const STOP = new Set(
  "die der das den dem des ein eine einer und ist sind hat haben wird werden kann können zur zum vom von auf aus bei nach mit für dass wenn als nur nicht ja nein".split(" ")
);
const MIN_LEN = 3;

const KEY_TERMS = new Set([
  "ruten", "schnur", "kohlefaser", "glasfaser", "endring", "fliegenrute", "spinnrute",
  "teleskoprute", "aktion", "aftma", "feederrute", "kopfschnur", "vorfach", "stahlvorfach",
  "schnurstärke", "knoten", "öhrhaken", "schonhaken", "wurmhaken", "drilling", "setzkescher",
  "wirbel", "schwimmer", "pose", "blinker", "spinner", "wobbler", "twister", "gumminetz",
  "trockenfliege", "nassfischen", "streamer", "leerwürfe", "keulenschnur", "multirolle",
  "stationärrolle", "schnurbremse", "stippangeln", "paternoster", "fliegenfischerei",
  "schnurführungsringe", "rollenhalterung", "hecht", "huchen", "karpfen", "forelle",
  "nase", "rotauge", "ängsche", "äschen", "griffteil", "freileitungen", "gewitter",
  "polyamid", "uv", "sonnenbestrahlung", "geflochten", "tragkraft", "hakengröße",
  "tauchschaufel", "neunaugenzopf", "wurfgewicht", "salmonide", "barsch", "schied",
  "rapfen", "fischschonend", "hecheln", "nymphe", "renken", "seesaibling", "rückschlag",
  "fliegenrolle", "friedfische", "bissanzeiger", "knicklicht", "beschwerung", "ansitzfischen",
  "naturköder", "weichplastik", "führungsring", "fischwaidgerechtigkeit",
]);

function tokenize(text) {
  if (!text || typeof text !== "string") return [];
  const normalized = text
    .toLowerCase()
    .replace(/[^\wäöüß\s]/g, " ")
    .replace(/\s+/g, " ");
  return normalized
    .split(" ")
    .filter((w) => w.length >= MIN_LEN && !STOP.has(w));
}

function getCorrectAnswerText(q) {
  if (!q || !q.options || !q.answer) return "";
  return q.options[q.answer] || "";
}

function stripHtml(str) {
  return str.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function tokensWithKeyTerms(text) {
  const tokens = tokenize(text);
  const keyFound = tokens.filter((t) => KEY_TERMS.has(t));
  const rest = tokens.filter((t) => !STOP.has(t) && t.length >= 4);
  return { keyFound, rest: [...new Set(rest)] };
}

function overlapEnough(bulletText, questionText, answerText) {
  const bullet = tokensWithKeyTerms(bulletText);
  const combined = questionText + " " + answerText;
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

// Find all <li>...</li> and check each against test questions
const liRegex = /<li>(.*?)<\/li>/gs;
const bullets = [];
let match;
while ((match = liRegex.exec(html)) !== null) {
  const fullMatch = match[0];
  const inner = match[1].trim();
  const bulletText = stripHtml(inner).replace(/^\★\s*/, "").trim();
  bullets.push({
    fullMatch,
    inner,
    bulletText,
    index: match.index,
  });
}

let markedCount = 0;
for (const b of bullets) {
  let matched = false;
  for (const num of testNumbers) {
    const q = questionByNumber.get(num);
    if (!q) continue;
    const answerText = getCorrectAnswerText(q);
    const questionText = q.question || "";
    if (overlapEnough(b.bulletText, questionText, answerText)) {
      matched = true;
      break;
    }
  }
  if (matched) {
    const newLi = "<li>★ " + b.inner + "</li>";
    html = html.replace(b.fullMatch, newLi);
    markedCount++;
  }
}

// Add legend after first <p> if not already present
if (!html.includes("★")) {
  // no star in doc yet - we just added some, so this would be wrong
}
if (!html.includes("ova stavka (informacija) se pojavila na testu")) {
  const legend =
    '<p><strong>★</strong> = ova stavka (informacija) se pojavila na testu u <strong>questionsFromTests.json</strong> u nekoj formi.</p>';
  html = html.replace(
    "</p>\n<hr>",
    `</p>\n${legend}\n<hr>`
  );
}

fs.writeFileSync(htmlPath, html, "utf-8");
console.log("Fanggeräte: marked", markedCount, "of", bullets.length, "bullets.");
console.log("Written to", htmlPath);
