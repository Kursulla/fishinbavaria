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

// 1. Učitaj HTML iz txt fajla

const htmlPath = path.resolve(__dirname, pathToHtmlDump);
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

// 2. Parsiraj HTML
const dom = new JSDOM(htmlContent);
const document = dom.window.document;

// 3. Izvuci sve <strong> tagove
const strongElements = document.querySelectorAll('strong');
const rawSentences = Array.from(strongElements)
    .map(el => el.textContent.trim())
    .filter(text => text.length > 0);

// 4. Ukloni duplikate
const topQuestions = [...new Set(rawSentences)];

// 5. Prikaz rezultata
console.log('✅ Pronađene jedinstvene rečenice u <strong> tagovima:\n');
topQuestions.forEach((s, i) => console.log(`${i + 1}. ${s}`));

// 6. Učitaj allQuestions (ESM fajl – čitamo kao tekst i izvlačimo niz)
const allQuestionsPath = path.resolve(__dirname, pathToAllQuestions);
const content = fs.readFileSync(allQuestionsPath, 'utf-8');
const match = content.match(/const allRequiredQuestions = (\[[\s\S]*\]);\s*export default/);
const allQuestions = JSON.parse(match[1]);

// 7. Pronađi objekte čija se pitanja poklapaju sa topQuestions
const matchedQuestions = allQuestions.filter(q => topQuestions.includes(q.question));

// 8. Upis u novi fajl
const outputPath = path.resolve(__dirname, pathToOutputFile);
fs.writeFileSync(outputPath, JSON.stringify(matchedQuestions, null, 2), 'utf-8');
console.log(`\n💾 Sačuvano u ${pathToOutputFile} (filtrirani objekti sa punim podacima).`);
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
