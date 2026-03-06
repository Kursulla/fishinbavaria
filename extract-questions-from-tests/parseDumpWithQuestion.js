const pathToAllQuestions = '../src/common/data/allRequiredQuestion.js';
const pathToHtmlDump = 'html-dump.txt';

const now = new Date();
const day = String(now.getDate()).padStart(2, '0');
const month = String(now.getMonth() + 1).padStart(2, '0');
const year = now.getFullYear();
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const pathToOutputFile = `questionsFromTests_${day}-${month}-${year}_${hours}-${minutes}.json`;



const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

function normalizeText(text) {
    if (typeof text !== 'string') return '';
    return text.replace(/\s+/g, ' ').trim();
}

// 1. Učitaj HTML iz txt fajla
const htmlPath = path.resolve(__dirname, pathToHtmlDump);
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

// 2. Parsiraj HTML
const dom = new JSDOM(htmlContent);
const document = dom.window.document;

// 3. Izvuci sve redove rezultata (svaki red = jedna pojava pitanja; pitanje + tačan odgovor)
const resultRows = document.querySelectorAll('table.rf-dt tbody tr');
const COL_QUESTION = 0;
const COL_CORRECT_ANSWER = 3;

const occurrencesFromDump = [];
for (const row of resultRows) {
    const cells = row.querySelectorAll('td');
    if (cells.length < 4) continue;
    const strongEl = cells[COL_QUESTION].querySelector('strong');
    const questionText = strongEl ? normalizeText(strongEl.textContent) : '';
    const correctAnswerText = normalizeText(cells[COL_CORRECT_ANSWER].textContent);
    if (!questionText) continue;
    occurrencesFromDump.push({ questionText, correctAnswerText });
}

// 4. Učitaj allQuestions (referenca za number)
const allQuestionsPath = path.resolve(__dirname, pathToAllQuestions);
const content = fs.readFileSync(allQuestionsPath, 'utf-8');
const match = content.match(/const allRequiredQuestions = (\[[\s\S]*\]);\s*export default/);
const allQuestions = JSON.parse(match[1]);

function findQuestionNumber(questionText, correctAnswerText) {
    const qNorm = normalizeText(questionText);
    const aNorm = normalizeText(correctAnswerText);
    const found = allQuestions.find((q) => {
        if (normalizeText(q.question) !== qNorm) return false;
        const refAnswerText = q.options && q.options[q.answer];
        return refAnswerText && normalizeText(refAnswerText) === aNorm;
    });
    return found ? found.number : null;
}

// 5. Za svaku pojavu iz dump-a nađi number; null ako nema matcha
const numbersFromDump = occurrencesFromDump.map((occ) =>
    findQuestionNumber(occ.questionText, occ.correctAnswerText)
);

// 6. Brojanje ponavljanja po number
const occurrenceCountByNumber = {};
numbersFromDump.forEach((num) => {
    if (num == null) return;
    occurrenceCountByNumber[num] = (occurrenceCountByNumber[num] || 0) + 1;
});

const unmatchedCount = numbersFromDump.filter((n) => n == null).length;
if (unmatchedCount > 0) {
    console.log(`⚠️  Redova bez matcha (preskočeno): ${unmatchedCount}`);
}

// 7. Izlaz: jedinstvena pitanja po number, sa numberOfOccurrences iz brojanja po number
const numbersSeenInDump = new Set(Object.keys(occurrenceCountByNumber));
const matchedQuestions = allQuestions
    .filter((q) => numbersSeenInDump.has(q.number))
    .map((q) => ({
        ...q,
        numberOfOccurrences: occurrenceCountByNumber[q.number] ?? 0,
    }));

// 8. Upis u novi fajl
const outputPath = path.resolve(__dirname, pathToOutputFile);
fs.writeFileSync(outputPath, JSON.stringify(matchedQuestions, null, 2), 'utf-8');

console.log(`\n💾 Sačuvano u ${pathToOutputFile}`);
console.log(`📊 Jedinstvenih pitanja (po number): ${matchedQuestions.length}`);
console.log(`📊 Ukupno pojavljivanja u dump-u: ${numbersFromDump.filter(Boolean).length}`);
// const fs = require('fs');
// const path = require('path');
// const { JSDOM } = require('jsdom');
//
// // 1. Učitaj HTML iz txt fajla
// const htmlPath = path.resolve(__dirname, 'html-dump.txt');
// const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
//
// // 2. Parsiraj HTML
// const dom = new JSDOM(htmlContent);
// const document = dom.window.document;
//
// // 3. Izvuci sve <strong> tagove
// const strongElements = document.querySelectorAll('strong');
// const rawSentences = Array.from(strongElements)
//     .map(el => el.textContent.trim())
//     .filter(text => text.length > 0);
//
// // 4. Kategorije po grupama od 12 pitanja
// const categories = ["Fischkunde", "Gewässerkunde", "Schutz und Pflege", "Fanggeräte", "Rechtsvorschriften"];
// const categorizedMap = {};
// categories.forEach(cat => categorizedMap[cat] = []);
//
// rawSentences.forEach((question, index) => {
//     const categoryIndex = Math.floor(index / 12) % categories.length;
//     const category = categories[categoryIndex];
//     categorizedMap[category].push(question);
// });
//
// // 5. Ukloni duplikate unutar svake kategorije
// Object.keys(categorizedMap).forEach(cat => {
//     categorizedMap[cat] = [...new Set(categorizedMap[cat])];
// });
//
// // 6. Prikaz rezultata
// console.log('✅ Pronađene rečenice po kategorijama:\n');
// Object.entries(categorizedMap).forEach(([cat, questions]) => {
//     console.log(`\n📁 ${cat}`);
//     questions.forEach((q, i) => console.log(`${i + 1}. ${q}`));
// });
//
// // 7. Upis u JSON fajl po kategorijama
// fs.writeFileSync('strong-sentences.json', JSON.stringify(categorizedMap, null, 2), 'utf-8');
// console.log('\n💾 Sačuvano u strong-sentences.json kao objekat sa kategorijama.');
