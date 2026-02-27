/**
 * Converts docs/*.md to public/docs/*.html with slug ids on headings for TOC/anchor links.
 * Run: node scripts/md-to-html.js
 */
const fs = require("fs");
const path = require("path");

const DOCS_DIR = path.resolve(__dirname, "../docs");
const OUT_DIR = path.resolve(__dirname, "../public/docs");

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u00C0-\u024F-]/g, "");
}

function addHeadingIds(html) {
  const seen = new Map();
  return html.replace(/<h([123])>([\s\S]*?)<\/h\1>/gi, (_, level, inner) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    let slug = slugify(text);
    if (slug) {
      const count = seen.get(slug) ?? 0;
      seen.set(slug, count + 1);
      if (count > 0) slug = `${slug}-${count}`;
    } else {
      slug = `heading-${seen.size}`;
    }
    return `<h${level} id="${slug}">${inner}</h${level}>`;
  });
}

async function run() {
  const { marked } = await import("marked");
  const mdFiles = fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith(".md"));
  if (mdFiles.length === 0) {
    console.warn("No .md files in docs/");
    return;
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const file of mdFiles) {
    const base = file.replace(/\.md$/i, "");
    const mdPath = path.join(DOCS_DIR, file);
    const outPath = path.join(OUT_DIR, `${base}.html`);
    const md = fs.readFileSync(mdPath, "utf-8");
    const rawHtml = await marked.parse(md);
    const withIds = addHeadingIds(rawHtml);
    const wrapped = `<div class="docs-markdown">\n${withIds.trim()}\n</div>`;
    fs.writeFileSync(outPath, wrapped, "utf-8");
    console.log("Written:", path.relative(process.cwd(), outPath));
  }
  console.log("Done. Converted", mdFiles.length, "file(s).");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
