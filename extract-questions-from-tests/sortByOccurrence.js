/**
 * Sortira JSON niz pitanja po numberOfOccurrences opadajuće (najveći broj prvi).
 * Prepisuje isti fajl.
 *
 * Usage:
 *   node extract-questions-from-tests/sortByOccurrence.js <path-to-json>
 *
 * Primer:
 *   node extract-questions-from-tests/sortByOccurrence.js extract-questions-from-tests/merged-questionsFromTests.json
 */

const fs = require("fs");
const path = require("path");

const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: node sortByOccurrence.js <path-to-json>");
  process.exit(1);
}

const resolved = path.resolve(process.cwd(), filePath);
const data = JSON.parse(fs.readFileSync(resolved, "utf8"));
data.sort((a, b) => (b.numberOfOccurrences || 0) - (a.numberOfOccurrences || 0));
fs.writeFileSync(resolved, JSON.stringify(data, null, 2), "utf8");
console.log("Sorted by numberOfOccurrences descending.");
