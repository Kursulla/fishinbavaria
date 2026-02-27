/**
 * Apply ★ to each bullet whose line index is in markedLineIndices.
 * Update legend and remove ★ from section headers and "Pitanja iz testa" lines.
 */
const fs = require('fs');
const path = require('path');

const docPath = path.resolve(__dirname, '../docs/Fischkunde_Priprema_za_ispit.md');
const marksPath = path.resolve(__dirname, 'fischkunde-bullets-to-mark.json');

const doc = fs.readFileSync(docPath, 'utf-8');
const { markedLineIndices } = JSON.parse(fs.readFileSync(marksPath, 'utf-8'));
const markSet = new Set(markedLineIndices);

const lines = doc.split('\n');

const newLegend =
  '**★** = ova stavka (informacija) se pojavila na testu u **questionsFromTests.json** u nekoj formi. Zvezdica je pored svake stavke koja je pokrivena pitanjem iz stvarnog testa.';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (i === 4 && line.includes('**★** =')) {
    lines[i] = newLegend;
    continue;
  }
  if (markSet.has(i)) {
    if (line.startsWith('- ') && !line.startsWith('- ★ ')) {
      lines[i] = '- ★ ' + line.slice(2);
    }
    continue;
  }
  // Remove ★ from ### section headers (e.g. "### 2.1 Aal (jegulja) ★" -> "### 2.1 Aal (jegulja)")
  if (line.match(/^### .+ ★\s*$/)) {
    lines[i] = line.replace(/\s+★\s*$/, '');
  }
  // Remove ★ from "**★ Pitanja iz testa**" -> "**Pitanja iz testa**"
  if (line.includes('**★ Pitanja iz testa**')) {
    lines[i] = line.replace(/\*\*★ Pitanja iz testa\*\*/, '**Pitanja iz testa**');
  }
  if (line.includes('**★ Pitanja iz testa (opšta)**')) {
    lines[i] = line.replace(/\*\*★ Pitanja iz testa \(opšta\)\*\*/, '**Pitanja iz testa (opšta)**');
  }
}

fs.writeFileSync(docPath, lines.join('\n'), 'utf-8');
console.log('Applied ★ to', markedLineIndices.length, 'bullets; updated legend and cleaned section markers.');
