const fs = require('fs');
const path = require('path');

const raw = fs.readFileSync(path.resolve(__dirname, 'fischkunde-questions.json'), 'utf-8');
const questions = JSON.parse(raw);

// Fish names in German (as they appear in questions) -> key for grouping
const FISH_PATTERNS = [
  { key: 'Aal', patterns: [/Aal\b/, /Gelbaal/, /Blankaal/, /Glasaal/] },
  { key: 'Äsche', patterns: [/Äsche\b/] },
  { key: 'Bachforelle', patterns: [/Bachforelle/, /Steinforelle/] },
  { key: 'Bachsaibling', patterns: [/Bachsaibling/] },
  { key: 'Barbe', patterns: [/Barbe\b/, /Jungbarbe/] },
  { key: 'Bitterling', patterns: [/Bitterling/] },
  { key: 'Blaufelchen', patterns: [/Blaufelchen/] },
  { key: 'Brachse', patterns: [/Brachse\b/] },
  { key: 'Edelkrebs', patterns: [/Edelkrebs/, /Edel- und Steinkrebs/] },
  { key: 'Steinkrebs', patterns: [/Steinkrebs/] },
  { key: 'Elritze', patterns: [/Elritze/] },
  { key: 'Flussbarsch', patterns: [/Flussbarsch/] },
  { key: 'Frauennerfling', patterns: [/Frauennerfling/] },
  { key: 'Goldorfe', patterns: [/Goldorfe/] },
  { key: 'Gründling', patterns: [/Gründling/] },
  { key: 'Güster', patterns: [/Güster/] },
  { key: 'Hasel', patterns: [/Hasel\b/] },
  { key: 'Hecht', patterns: [/Hecht\b/] },
  { key: 'Huchen', patterns: [/Huchen/] },
  { key: 'Karpfen', patterns: [/Karpfen\b/, /Schuppenkarpfen/, /Spiegelkarpfen/] },
  { key: 'Karausche', patterns: [/Karausche/] },
  { key: 'Kaulbarsch', patterns: [/Kaulbarsch/] },
  { key: 'Laube', patterns: [/Laube/, /Ukelei/] },
  { key: 'Mairenke', patterns: [/Mairenke/, /Seelaube/] },
  { key: 'Moderlieschen', patterns: [/Moderlieschen/] },
  { key: 'Mühlkoppe', patterns: [/Mühlkoppe/] },
  { key: 'Nase', patterns: [/\bNase\b/] },
  { key: 'Nerfling', patterns: [/Nerfling/, /Aland/] },
  { key: 'Neunauge', patterns: [/Neunauge/, /Bachneunauge/, /Querder/] },
  { key: 'Perlfisch', patterns: [/Perlfisch/] },
  { key: 'Regenbogenforelle', patterns: [/Regenbogenforelle/] },
  { key: 'Renke', patterns: [/Renke/, /Felchen/, /Coregonen/, /Schwebrenken/] },
  { key: 'Rotfeder', patterns: [/Rotfeder/] },
  { key: 'Rotauge', patterns: [/Rotauge/] },
  { key: 'Rutte', patterns: [/Rutte/, /Quappe/, /Trüsche/] },
  { key: 'Schied', patterns: [/Schied/, /Rapfen/] },
  { key: 'Schleie', patterns: [/Schleie/] },
  { key: 'Schlammpeitzger', patterns: [/Schlammpeitzger/] },
  { key: 'Schrätzer', patterns: [/Schrätzer/] },
  { key: 'Seeforelle', patterns: [/Seeforelle/] },
  { key: 'Seesaibling', patterns: [/Seesaibling/, /Schwarzreuter/] },
  { key: 'Steinbeißer', patterns: [/Steinbeißer/, /Dorngrundel/] },
  { key: 'Sterlet', patterns: [/Sterlet/] },
  { key: 'Stichling', patterns: [/Stichling/, /Dreistachliger/, /Neunstachliger/] },
  { key: 'Stör', patterns: [/Stör\b/] },
  { key: 'Strömer', patterns: [/Strömer/] },
  { key: 'Streber', patterns: [/Streber/] },
  { key: 'Zander', patterns: [/Zander/] },
  { key: 'Zährte', patterns: [/Zährte/, /Seerüßling/] },
  { key: 'Zingel', patterns: [/Zingel/] },
  { key: 'Zobel', patterns: [/Zobel/] },
  { key: 'Zope', patterns: [/Zope/] },
  { key: 'Waller', patterns: [/Waller/, /Wels\b/] },
  { key: 'Zwergwels', patterns: [/Zwergwels/] },
  { key: 'Giebel', patterns: [/Giebel/] },
  { key: 'Schneider', patterns: [/Schneider\b/] },
  { key: 'Lachs', patterns: [/Lachs/] },
  { key: 'Grundeln', patterns: [/Grundel/, /Schwarzmund/, /Kessler/, /Marmorierte/] },
  { key: 'Kamberkrebs', patterns: [/Kamberkrebs/] },
];

function findFishInText(text) {
  if (!text) return [];
  const found = new Set();
  for (const { key, patterns } of FISH_PATTERNS) {
    if (patterns.some((p) => p.test(text))) found.add(key);
  }
  return [...found];
}

const byFish = {};
const general = [];

for (const q of questions) {
  const fullText = [q.question, ...Object.values(q.options || {})].join(' ');
  const fishList = findFishInText(fullText);

  if (fishList.length === 0) {
    general.push(q);
    continue;
  }
  if (fishList.length === 1) {
    const key = fishList[0];
    if (!byFish[key]) byFish[key] = [];
    byFish[key].push(q);
    continue;
  }
  // Question mentions multiple fish - add to each (for learning points)
  for (const key of fishList) {
    if (!byFish[key]) byFish[key] = [];
    byFish[key].push(q);
  }
}

const report = {
  generalCount: general.length,
  byFish: Object.fromEntries(
    Object.entries(byFish)
      .sort((a, b) => b[1].length - a[1].length)
      .map(([k, v]) => [k, v.length])
  ),
  generalSample: general.slice(0, 3).map((q) => ({ number: q.number, question: q.question })),
};

fs.writeFileSync(
  path.resolve(__dirname, 'fischkunde-by-fish.json'),
  JSON.stringify({ byFish: Object.keys(byFish).sort(), generalCount: general.length, report }, null, 2)
);

// Output question numbers per fish for document
const summary = {
  general: general.map((q) => q.number),
  byFish: Object.fromEntries(
    Object.entries(byFish)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([fish, list]) => [fish, list.map((q) => q.number)])
  ),
};
fs.writeFileSync(path.resolve(__dirname, 'fischkunde-grouped.json'), JSON.stringify(summary, null, 2), 'utf-8');

console.log('General questions:', general.length);
console.log('Fish with questions:', Object.keys(byFish).length);
console.log(JSON.stringify(report, null, 2));
