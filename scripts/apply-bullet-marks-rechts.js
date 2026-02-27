/**
 * Apply ★ to each bullet in Rechtsvorschriften doc whose line index is in markedLineIndices.
 * Add legend if not present.
 */
const fs = require('fs');
const path = require('path');

const docPath = path.resolve(__dirname, '../docs/Rechtsvorschriften_Priprema_za_ispit.md');
const marksPath = path.resolve(__dirname, 'rechts-bullets-to-mark.json');

const doc = fs.readFileSync(docPath, 'utf-8');
const { markedLineIndices } = JSON.parse(fs.readFileSync(marksPath, 'utf-8'));
const markSet = new Set(markedLineIndices);

const lines = doc.split('\n');

const newLegend =
  '**★** = ova stavka (informacija) se pojavila na testu u **questionsFromTests.json** u nekoj formi.';

// Add legend after intro (line 3, 0-based index 3) if not already there
if (!doc.includes('**★** =')) {
  lines.splice(4, 0, newLegend);
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (markSet.has(i)) {
    if (line.startsWith('- ') && !line.startsWith('- ★ ')) {
      lines[i] = '- ★ ' + line.slice(2);
    }
  }
}

fs.writeFileSync(docPath, lines.join('\n'), 'utf-8');
console.log('Rechts: applied ★ to', markedLineIndices.length, 'bullets; legend added.');
