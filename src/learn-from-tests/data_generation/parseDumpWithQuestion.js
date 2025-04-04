const pathToAllQuestions = '../../common/data/pitanja.json';
const pathToHtmlDump = 'html-dump.txt';
const pathToOutputFile = 'topQuestionsFull.json';



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

// 6. Učitaj allQuestions.json

const allQuestionsPath = path.resolve(__dirname, pathToAllQuestions);
const allQuestions = JSON.parse(fs.readFileSync(allQuestionsPath, 'utf-8'));

// 7. Pronađi objekte čija se pitanja poklapaju sa topQuestions
const matchedQuestions = allQuestions.filter(q => topQuestions.includes(q.question));

// 8. Upis u novi fajl
fs.writeFileSync(pathToOutputFile, JSON.stringify(matchedQuestions, null, 2), 'utf-8');
console.log('\n💾 Sačuvano u topQuestionsFull.json (filtrirani objekti sa punim podacima).');
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