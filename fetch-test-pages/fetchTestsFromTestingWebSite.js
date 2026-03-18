/**
 * Opens the Bavaria practice exam page, logs in with 000000, ends the exam
 * (Prüfung beenden + confirm), then appends the result page HTML to a dump file.
 * Repeats N times with a debounce between runs.
 *
 * Usage (from project root):
 *   npx playwright install chromium   # once, if not already installed
 *   node fetch-test-pages/fetchTestsFromTestingWebSite.js <numberOfRuns>
 *
 * Example: node fetch-test-pages/fetchTestsFromTestingWebSite.js 5
 */

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const URL = "https://fischerpruefung-online.bayern.de/fprApp/Uebungspruefung/AnmeldungUebungspruefung.xhtml";
const CODE = "000000";
const DEBOUNCE_MIN_MS = 1000;
const DEBOUNCE_MAX_MS = 10000;

function timestampForFilename() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const h = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${d}_${h}-${min}-${s}`;
}

function randomDebounceMs() {
  return DEBOUNCE_MIN_MS + Math.floor(Math.random() * (DEBOUNCE_MAX_MS - DEBOUNCE_MIN_MS + 1));
}

async function runOne(browser) {
  const page = await browser.newPage();

  try {
    await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });

    const codeInput = page.locator('[id="pruefungsfrage:anmeldungscode"]');
    await codeInput.fill(CODE);

    const anmeldenBtn = page.locator('[id="pruefungsfrage:anmelden"]');
    await anmeldenBtn.click();

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);

    const endExamBtn = page.locator('input[value="Prüfung beenden"], button[value="Prüfung beenden"]').first();
    await endExamBtn.click();

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    const confirmBtn = page.locator('input[value="Prüfung beenden"], button[value="Prüfung beenden"]').first();
    await confirmBtn.click();

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    const html = await page.content();
    return html;
  } finally {
    await page.close();
  }
}

async function main() {
  const runs = parseInt(process.argv[2], 10);
  if (!Number.isInteger(runs) || runs < 1) {
    console.error("Usage: node fetchTestsFromTestingWebSite.js <numberOfRuns>");
    process.exit(1);
  }

  const timestamp = timestampForFilename();
  const outputFile = path.join(__dirname, `html-dump-${timestamp}.txt`);

  const browser = await chromium.launch({ headless: true });

  try {
    for (let i = 0; i < runs; i++) {
      console.log(`Run ${i + 1}/${runs}...`);
      try {
        const html = await runOne(browser);
        const separator = `\n\n<!-- ========== DUMP RUN ${i + 1} @ ${new Date().toISOString()} ========== -->\n\n`;
        fs.appendFileSync(outputFile, separator + html, "utf8");
        console.log(`  Appended HTML to ${outputFile}`);
      } catch (err) {
        console.error(`  Run ${i + 1} failed:`, err.message);
      }
      if (i < runs - 1) {
        const waitMs = randomDebounceMs();
        console.log(`  Waiting ${(waitMs / 1000).toFixed(1)}s before next run...`);
        await new Promise((r) => setTimeout(r, waitMs));
      }
    }
  } finally {
    await browser.close();
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
