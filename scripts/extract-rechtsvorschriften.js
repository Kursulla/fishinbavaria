const fs = require('fs');
const path = require('path');

const pathToAllQuestions = path.resolve(__dirname, '../src/common/data/allRequiredQuestion.js');
const content = fs.readFileSync(pathToAllQuestions, 'utf-8');
const match = content.match(/const allRequiredQuestions = (\[[\s\S]*\]);\s*export default/);
if (!match) throw new Error('Could not parse allRequiredQuestions');
const allQuestions = JSON.parse(match[1]);

const rechtsvorschriften = allQuestions.filter((q) => q.category === 'Rechtsvorschriften');
const outputPath = path.resolve(__dirname, 'rechtsvorschriften-questions.json');
fs.writeFileSync(outputPath, JSON.stringify(rechtsvorschriften, null, 2), 'utf-8');
console.log('Written', rechtsvorschriften.length, 'Rechtsvorschriften questions to', outputPath);
