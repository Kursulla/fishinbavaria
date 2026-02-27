const fs = require('fs');
const path = require('path');

const pathToAllQuestions = path.resolve(__dirname, '../src/common/data/allRequiredQuestion.js');
const content = fs.readFileSync(pathToAllQuestions, 'utf-8');
const match = content.match(/const allRequiredQuestions = (\[[\s\S]*\]);\s*export default/);
if (!match) throw new Error('Could not parse allRequiredQuestions');
const allQuestions = JSON.parse(match[1]);

const fischkunde = allQuestions.filter((q) => q.category === 'Fischkunde');
const outputPath = path.resolve(__dirname, 'fischkunde-questions.json');
fs.writeFileSync(outputPath, JSON.stringify(fischkunde, null, 2), 'utf-8');
console.log('Written', fischkunde.length, 'Fischkunde questions to', outputPath);
