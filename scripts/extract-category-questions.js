/**
 * Extract questions for given categories from allRequiredQuestion.js.
 * Usage: node scripts/extract-category-questions.js
 */
const fs = require("fs");
const path = require("path");

const pathToAllQuestions = path.resolve(__dirname, "../src/common/data/allRequiredQuestion.js");
const content = fs.readFileSync(pathToAllQuestions, "utf-8");
const match = content.match(/const allRequiredQuestions = (\[[\s\S]*\]);\s*export default/);
if (!match) throw new Error("Could not parse allRequiredQuestions");
const allQuestions = JSON.parse(match[1]);

const CATEGORIES = ["Gewässerkunde", "Schutz und Pflege", "Fanggeräte"];
const outDir = path.resolve(__dirname);

for (const category of CATEGORIES) {
  const questions = allQuestions.filter((q) => q.category === category);
  const safeName = category.replace(/\s+/g, "-").toLowerCase();
  const outputPath = path.join(outDir, `${safeName}-questions.json`);
  fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2), "utf-8");
  console.log(category, ":", questions.length, "questions ->", outputPath);
}
