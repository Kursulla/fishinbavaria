/**
 * Prolazi kroz sva Fischkunde pitanja sa 4+ pojavljivanja u questionsFromTests.json,
 * izvlači ribe (nemačko + srpsko ime) i gradi informacije za učenje iz teksta pitanja i tačnih odgovora.
 * Ispod svake nemačke rečenice dodaje prevod na srpski (manji font).
 * Izlaz: docs/Fischkunde_Ribe_iz_pitanja.md
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

const MIN_OCCURRENCES = 4;
const QUESTIONS_PATH = path.resolve(__dirname, "../src/pages/tests/data/questionsFromTests.json");
const OUTPUT_PATH = path.resolve(__dirname, "../docs/Fischkunde_Ribe_iz_pitanja.md");
const CACHE_PATH = path.resolve(__dirname, "fischkunde-translations-cache.json");

function loadCache() {
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), "utf-8");
}

function fetchTranslation(text) {
  return new Promise((resolve, reject) => {
    const encoded = encodeURIComponent(text);
    const url = `https://api.mymemory.translated.net/get?q=${encoded}&langpair=de|sr`;
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const j = JSON.parse(data);
            const translated = j.responseData?.translatedText || text;
            resolve(translated);
          } catch (e) {
            resolve(text);
          }
        });
      })
      .on("error", reject);
  });
}

async function ensureTranslations(uniqueTexts, cache) {
  const missing = uniqueTexts.filter((t) => t && !cache[t]);
  for (let i = 0; i < missing.length; i++) {
    const text = missing[i];
    try {
      const translated = await fetchTranslation(text);
      cache[text] = translated;
      if ((i + 1) % 10 === 0) {
        saveCache(cache);
        console.log(`  Prevedeno ${i + 1}/${missing.length}...`);
      }
      await new Promise((r) => setTimeout(r, 250));
    } catch (e) {
      cache[text] = text;
    }
  }
  saveCache(cache);
}

// Nemačko ime -> srpsko (iz postojećeg dokumenta)
const FISH_DE_SRB = {
  Aal: "jegulja",
  Äsche: "lipljen",
  Bachforelle: "potočna pastrmka",
  Bachsaibling: "potočna zlatovčica",
  Barbe: "mrena",
  Bitterling: "gorčica",
  Blaufelchen: "plava pastrva / sivi sig",
  Brachse: "deverika",
  Edelkrebs: "rečni rak",
  Steinkrebs: "kameni rak",
  Elritze: "pčelica",
  Flussbarsch: "rečni grgeč",
  Frauennerfling: "ženski podbradak",
  Goldorfe: "zlata orfina",
  Gründling: "klin",
  Güster: "bjelica / crvenperka",
  Hasel: "klenić / bucov",
  Hecht: "štuka",
  Huchen: "dunavska pastrmka",
  Karpfen: "šaran",
  Karausche: "krupan",
  Kaulbarsch: "bodljikavi grgeč",
  Laube: "uklja",
  Ukelei: "uklja",
  Mairenke: "morski cipelj / lauka",
  Seelaube: "lauka",
  Moderlieschen: "ostrušica",
  Mühlkoppe: "glavoč",
  Nase: "podust",
  Neunauge: "petljaš / paklar",
  Bachneunauge: "paklar",
  Nerfling: "smuđar / vijun",
  Aland: "vijun",
  Perlfisch: "biserna riba",
  Regenbogenforelle: "duga pastrmka",
  Renke: "siva pastrva / sig",
  Felchen: "sig",
  Rotfeder: "crvenperka",
  Rotauge: "crvenooka",
  Rutte: "menka / gunđ",
  Quappe: "gunđ",
  Schied: "šaran-bucov / rapfen",
  Rapfen: "rapfen",
  Schleie: "linjak",
  Schlammpeitzger: "šljunkar / pipavac",
  Schneider: "sabljar",
  Schrätzer: "sabľa",
  Seeforelle: "jezerska pastrmka",
  Seesaibling: "jezerska zlatovčica",
  Steinbeißer: "bodljikava glavočica",
  Sterlet: "kečiga",
  Stichling: "bodljorep",
  Stör: "jesetra",
  Strömer: "mladica / strimer",
  Streber: "mali zingel",
  Waller: "somn",
  Wels: "somn",
  Zander: "smuđ",
  Zährte: "badem",
  Zingel: "krupati zingel",
  Zobel: "sabljarka",
  Zope: "sivuša",
  Zwergwels: "patuljasti som",
  Giebel: "gibelj",
  Aitel: "klen",
  Döbel: "klen",
  Lachs: "losos",
  Schwarzmundgrundel: "crnousta glavočica",
  Kesslergrundel: "Kessler glavoč",
  Marmorierte: "mramorasta glavočica",
  Kamberkrebs: "kameni američki rak",
};

// Redosled za izlaz: duže ime pre kraćeg da se ne bi "Rotauge" match-ovalo unutar "Rotfeder"
const FISH_NAMES_SORTED = Object.keys(FISH_DE_SRB).sort((a, b) => b.length - a.length);

function normalizeText(s) {
  return (s || "").replace(/\s+/g, " ").trim();
}

function findMentionedFish(text) {
  const normalized = normalizeText(text);
  const mentioned = new Set();
  for (const name of FISH_NAMES_SORTED) {
    const re = new RegExp("\\b" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
    if (re.test(normalized)) mentioned.add(name);
  }
  return [...mentioned];
}

const questions = JSON.parse(fs.readFileSync(QUESTIONS_PATH, "utf-8"));
const fischkunde = questions.filter(
  (q) => q.category === "Fischkunde" && (q.numberOfOccurrences || 0) >= MIN_OCCURRENCES
);

// Povezuj činjenicu samo sa ribama koje se pojavljuju u pitanju ili u tačnom odgovoru (ne u pogrešnim opcijama).
const fishToFacts = {};
for (const q of fischkunde) {
  const questionText = normalizeText(q.question);
  const correctAnswer = (q.options && q.options[q.answer]) ? normalizeText(q.options[q.answer]) : "";
  const questionAndCorrect = questionText + " " + correctAnswer;
  const mentioned = findMentionedFish(questionAndCorrect);
  for (const fish of mentioned) {
    if (!fishToFacts[fish]) fishToFacts[fish] = [];
    fishToFacts[fish].push({
      number: q.number,
      question: questionText,
      correctAnswer,
    });
  }
}

// Jedinstvene ribe po srpskom imenu (da ne dupliramo Aland/Nerfling)
const seenSerbian = new Set();
const orderedFish = [];
for (const name of FISH_NAMES_SORTED) {
  if (!fishToFacts[name]) continue;
  const serbian = FISH_DE_SRB[name];
  if (seenSerbian.has(serbian)) continue;
  seenSerbian.add(serbian);
  orderedFish.push({ de: name, sr: serbian, facts: fishToFacts[name] });
}

async function run() {
  const uniqueQuestions = [...new Set(orderedFish.flatMap(({ facts }) => facts.map((f) => f.question)))];
  const uniqueAnswers = [...new Set(orderedFish.flatMap(({ facts }) => facts.map((f) => f.correctAnswer)))];
  const allUnique = [...new Set([...uniqueQuestions, ...uniqueAnswers])].filter(Boolean);

  const cache = loadCache();
  console.log("Keš prevoda: " + Object.keys(cache).length + " rečenica. Nedostaje: " + allUnique.filter((t) => !cache[t]).length);
  if (allUnique.some((t) => !cache[t])) {
    console.log("Prevođenje nedostajućih rečenica (DE → SR)...");
    await ensureTranslations(allUnique, cache);
  }

  function translated(text) {
    return cache[text] || text;
  }

  const lines = [
    "# Fischkunde – Ribe iz pitanja (4+ pojavljivanja na ispitima)",
    "",
    "Dokument sadrži **spisak riba** sa imenima na **nemačkom i srpskom** i **informacije za učenje** koje potiču isključivo iz pitanja kategorije Fischkunde koja imaju **najmanje 4 pojavljivanja** u skupu testnih pitanja (`questionsFromTests.json`). Ispod nemačkog teksta dat je prevod na srpski manjim fontom.",
    "",
    "## Spisak riba (nemački – srpski)",
    "",
  ];

  for (const { de, sr } of orderedFish) {
    lines.push(`- **${de}** – ${sr}`);
  }
  lines.push("");
  lines.push("---");
  lines.push("");

  lines.push("## Informacije za učenje (iz pitanja i tačnih odgovora)");
  lines.push("");

  for (const { de, sr, facts } of orderedFish) {
    const displayName = sr.includes("/") ? `${de} (${sr})` : `${de} – ${sr}`;
    lines.push(`### ${displayName}`);
    lines.push("");
    for (const f of facts) {
      lines.push(`- **Pitanje:** ${f.question}`);
      lines.push(`  <small>(${translated(f.question)})</small>  `);
      lines.push(`  **Odgovor:** ${f.correctAnswer}`);
      lines.push(`  <small>(${translated(f.correctAnswer)})</small>`);
      lines.push("");
    }
    lines.push("---");
    lines.push("");
  }

  fs.writeFileSync(OUTPUT_PATH, lines.join("\n"), "utf-8");
  console.log(`Fischkunde pitanja sa ≥${MIN_OCCURRENCES} pojave: ${fischkunde.length}`);
  console.log(`Riba u dokumentu: ${orderedFish.length}`);
  console.log(`Izlaz: ${OUTPUT_PATH}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
