#!/usr/bin/env node
// Page sections: validate every examples/sections/*.tsx header and write examples/sections/README.md.
//   node scripts/build-sections.mjs                  validate + write the README
//   node scripts/build-sections.mjs --preview out/   also bundle a preview page (all sections, in order) for screenshots
// A section must: name its kind and one of the 20 archetypes (data/archetypes.csv); list the library components it
// uses, each of which must exist in data/components.csv and be imported from ../components/ (and nothing else
// imported from there); and carry what / signature / mobile / reduced-motion notes. check-repo runs collect().
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { cli } from "../skills/asfakulsiam-motomation-design/scripts/lib.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKILL = join(ROOT, "skills/asfakulsiam-motomation-design");
const DIR = join(SKILL, "examples/sections");
export const KINDS = { hero: "Heroes", features: "Features", gallery: "Galleries", pricing: "Pricing", testimonial: "Testimonials", team: "Team", cta: "Calls to action", contact: "Contact", footer: "Footers" };
const FIELDS = ["id", "kind", "archetype", "components", "what", "signature", "mobile", "reduced-motion"];
const pascal = (id) => id.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join("");

function csvRows(file) {
  const [head, ...lines] = readFileSync(file, "utf8").replace(/\r/g, "").trim().split("\n").filter((l) => !l.startsWith("#"));
  const parse = (l) => { const r = []; let cur = "", q = false; for (const ch of l) { if (ch === '"') q = !q; else if (ch === "," && !q) { r.push(cur); cur = ""; } else cur += ch; } r.push(cur); return r; };
  const cols = parse(head); return lines.map((l) => Object.fromEntries(parse(l).map((v, i) => [cols[i], v])));
}

export function collect() {
  const problems = [];
  const archetypes = new Set(csvRows(join(SKILL, "data/archetypes.csv")).map((r) => r.id));
  const exportsToFile = new Map(csvRows(join(SKILL, "data/components.csv")).map((r) => [r.export, r.file]));
  const sections = [];
  if (!existsSync(DIR)) return { sections, problems };
  for (const f of readdirSync(DIR).filter((f) => f.endsWith(".tsx") && !f.startsWith("_")).sort()) {
    const src = readFileSync(join(DIR, f), "utf8");
    if (!src.includes("// @motomation-section")) { problems.push(`${f}: missing // @motomation-section header`); continue; }
    const meta = {}; for (const m of src.matchAll(/^\/\/ ([a-z-]+): (.+)$/gm)) if (!(m[1] in meta)) meta[m[1]] = m[2].trim();
    for (const k of FIELDS) if (!meta[k]) problems.push(`${f}: header is missing "${k}"`);
    if (meta.id && `${meta.id}.tsx` !== f) problems.push(`${f}: id "${meta.id}" doesn't match the file name`);
    if (meta.kind && !KINDS[meta.kind]) problems.push(`${f}: kind "${meta.kind}" is not one of ${Object.keys(KINDS).join(", ")}`);
    if (meta.archetype && !archetypes.has(meta.archetype)) problems.push(`${f}: archetype "${meta.archetype}" is not in data/archetypes.csv`);
    if (meta.id && !new RegExp(`export function ${pascal(meta.id)}\\(`).test(src)) problems.push(`${f}: should export function ${pascal(meta.id)}`);
    const listed = (meta.components || "").split(/,\s*/).filter(Boolean);
    const imported = [...src.matchAll(/import \{([^}]+)\} from "\.\.\/components\/([^"]+)"/g)].flatMap((m) => m[1].split(",").map((s) => s.trim().replace(/^type /, "")).filter(Boolean).map((name) => ({ name, from: m[2] })));
    for (const c of listed) {
      if (!exportsToFile.has(c)) problems.push(`${f}: "${c}" is not a library component (data/components.csv export)`);
      else if (!imported.some((i) => i.name === c)) problems.push(`${f}: lists ${c} but doesn't import it from ../components/`);
    }
    for (const i of imported) if (!listed.includes(i.name)) problems.push(`${f}: imports ${i.name} from ../components/${i.from} but doesn't list it in "components"`);
    if (!listed.length) problems.push(`${f}: uses no library component`);
    sections.push({ ...meta, file: `examples/sections/${f}`, export: pascal(meta.id || f.replace(/\.tsx$/, "")), list: listed });
  }
  return { sections, problems };
}

export function renderReadme(sections) {
  const count = (k) => sections.filter((s) => s.kind === k).length;
  const archetypes = [...new Set(sections.map((s) => s.archetype))].sort();
  const L = ["# Page sections", "",
    `${sections.length} sections composed from the library in \`examples/components/\`, as references: a new build composes, extends, or invents its own sections and effects, and is not limited to these. Each is tied to one of the 20 archetypes (\`structures/archetypes.md\`), and its header records what it is, which components it uses, why it earns its place (signature), its mobile layout and its reduced-motion behaviour. \`node scripts/build-sections.mjs\` (run from the repository root) checks every header and that each listed component exists and is imported, and writes this file.`, "",
    `By kind: ${Object.entries(KINDS).filter(([k]) => count(k)).map(([k, t]) => `${t.toLowerCase()} ${count(k)}`).join(" · ")}. Archetypes used: ${archetypes.length} of 20 (${archetypes.join(", ")}).`, "",
    "**Theme.** Sections read colours and fonts from CSS variables, so a page restyles all of them at once: `--ground --surface --ink --muted --line --accent` and `--font-display --font-text --font-mono` (see `_shared.tsx` for the fallbacks). Each page template sets them once for its brand.", "",
    "**Use one.** Copy the section file and `_shared.tsx`, plus the components it imports (and their `_lib` helpers). Replace the copy: every section ships with a specific, believable brand, which is the point; don't ship the sample words.", ""];
  for (const [k, title] of Object.entries(KINDS)) {
    const rows = sections.filter((s) => s.kind === k); if (!rows.length) continue;
    L.push(`## ${title}`, "", "| Section | Archetype | Components | Signature (why it earns its place) | Mobile | Reduced motion |", "|---|---|---|---|---|---|");
    for (const s of rows) L.push(`| [\`${s.id}\`](${s.id}.tsx) | ${s.archetype} | ${s.list.join(", ")} | ${s.signature.replace(/\|/g, "\\|")} | ${s.mobile.replace(/\|/g, "\\|")} | ${s["reduced-motion"].replace(/\|/g, "\\|")} |`);
    L.push("");
  }
  return L.join("\n");
}

async function preview(out, order) {
  const req = createRequire(join(process.cwd(), "noop.js"));
  const esbuild = req("esbuild");
  mkdirSync(out, { recursive: true });
  const list = order.length ? order : collect().sections.map((s) => s.id);
  const entry = join(DIR, "_preview-entry.tsx");
  writeFileSync(entry, [`import { createRoot } from "react-dom/client";`, ...list.map((id) => `import { ${pascal(id)} } from "./${id}";`),
    `createRoot(document.getElementById("root")!).render(<>{[${list.map((id) => `<div key="${id}" data-section="${id}"><${pascal(id)} /></div>`).join(",")}]}</>);`].join("\n"));
  try {
    const res = await esbuild.build({ entryPoints: [entry], bundle: true, minify: true, format: "iife", write: false, target: "es2020", jsx: "automatic",
      nodePaths: [join(process.cwd(), "node_modules"), ...(process.env.NODE_PATH || "").split(":").filter(Boolean)], define: { "process.env.NODE_ENV": '"production"' }, legalComments: "none" });
    const fonts = readFileSync(join(SKILL, "examples/html/lib/fonts.css"), "utf8");
    writeFileSync(join(out, "index.html"), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Sections preview</title><style>${fonts}
:root{--ground:#f4efe6;--surface:#fbf8f2;--ink:#1d1a16;--muted:#5f574b;--line:rgba(29,26,22,.14);--accent:#b5401f;--font-display:Georgia,"Times New Roman",serif;--font-text:"Instrument Sans",system-ui,sans-serif;--font-mono:"JetBrains Mono",ui-monospace,monospace}
*{box-sizing:border-box}body{margin:0;background:var(--ground);color:var(--ink);font-family:var(--font-text)}[data-section]{border-bottom:1px dashed rgba(0,0,0,.18)}</style></head><body><div id="root"></div><script>${res.outputFiles[0].text.replace(/<\/script/gi, "<\\/script")}</script></body></html>`);
    // the self-hosted fonts fonts.css points at (fonts/*.woff2)
    const fontDir = join(out, "fonts"); mkdirSync(fontDir, { recursive: true });
    for (const f of readdirSync(join(SKILL, "examples/html/lib/fonts"))) writeFileSync(join(fontDir, f), readFileSync(join(SKILL, "examples/html/lib/fonts", f)));
    console.log(`Wrote ${join(out, "index.html")} (${list.length} sections)`);
  } finally { (await import("node:fs")).rmSync(entry, { force: true }); }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  cli("build-sections", "Usage: node scripts/build-sections.mjs [--preview <out-dir> [<id,id,…>]]", { preview: "value" }, null, { pos: [0, 1] });
  const { sections, problems } = collect();
  if (problems.length) { for (const p of problems) console.error(`✗ ${p}`); process.exit(1); }
  writeFileSync(join(DIR, "README.md"), renderReadme(sections));
  console.log(`Wrote examples/sections/README.md (${sections.length} sections, ${new Set(sections.map((s) => s.archetype)).size} archetypes)`);
  const i = process.argv.indexOf("--preview"); if (i > 0) await preview(process.argv[i + 1], (process.argv[i + 2] || "").split(",").filter(Boolean));
}
