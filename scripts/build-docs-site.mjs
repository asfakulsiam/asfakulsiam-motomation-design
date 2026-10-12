#!/usr/bin/env node
// Builds the docs site into docs/site/: index.html (search across every component), c/<id>.html (one page per
// component: live demo from the gallery's demos.tsx, prop playground, mobile preview, copy and install, notes, props
// table), assets/site.js + assets/site.css. Same pinned esbuild/React as the gallery (scripts/build-gallery.mjs).
//   node scripts/build-docs-site.mjs           build
//   node scripts/build-docs-site.mjs --props   print the parsed props per component (no build)
// The props table and playground controls are read from each component's `type Props = { … }` and the defaults in its
// signature. check-repo verifies that every component has a page and that the site was built from the current sources.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, existsSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { collect } from "./build-components.mjs";
import { PINNED, sourceHash as gallerySourceHash } from "./build-gallery.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SKILL = join(ROOT, "skills/asfakulsiam-motomation-design");
const SITE = join(ROOT, "docs/site"), SRC = join(SITE, "src");
const REPO = "https://github.com/asfakulsiam/asfakulsiam-motomation-design";

/** Split at top-level separators (outside (), [], {}, <>, quotes). */
function splitTop(s, sep) {
  const out = []; let d = 0, q = null, cur = "";
  for (let i = 0; i < s.length; i++) { const ch = s[i];
    if (q) { cur += ch; if (ch === q && s[i - 1] !== "\\") q = null; continue; }
    if (ch === '"' || ch === "'" || ch === "`") { q = ch; cur += ch; continue; }
    if ("([{<".includes(ch)) d++; else if (")]}>".includes(ch) && !(ch === ">" && s[i - 1] === "=")) d--;
    if (ch === sep && d === 0) { out.push(cur); cur = ""; } else cur += ch; }
  if (cur.trim()) out.push(cur); return out.map((x) => x.trim()).filter(Boolean);
}
function braceBody(src, at) { let d = 0; for (let i = at; i < src.length; i++) { if (src[i] === "{") d++; else if (src[i] === "}" && --d === 0) return src.slice(at + 1, i); } return ""; }

/** Props of one component: name, type, optional, default, and which playground control fits. */
export function parseProps(src, exportName) {
  const t = src.indexOf("type Props = {"); if (t < 0) return [];
  const body = braceBody(src, src.indexOf("{", t));
  const sig = src.indexOf(`export function ${exportName}(`); const defs = {};
  if (sig >= 0) { const open = src.indexOf("{", sig); if (open > 0 && open < src.indexOf(")", sig) + 1e4) for (const part of splitTop(braceBody(src, open), ",")) {
    const m = part.match(/^(\w+)(?:\s*:\s*\w+)?\s*=\s*([\s\S]+)$/); if (m) defs[m[1]] = m[2].trim(); } }
  return splitTop(body, ";").flatMap((line) => line.includes("\n") && !line.includes(":") ? [] : [line]).map((line) => {
    const m = line.replace(/\s+/g, " ").match(/^(\w+)(\?)?: ([\s\S]+)$/); if (!m) return null;
    const [, name, opt, type] = m; const def = defs[name] ?? null;
    const lits = type.split("|").map((x) => x.trim()); const isLits = lits.length > 1 && lits.every((x) => /^"[^"]*"$/.test(x));
    const control = name === "className" ? null : type === "number" ? "number" : type === "boolean" ? "boolean" : type === "string" ? "string" : isLits ? "select" : null;
    return { name, type, optional: !!opt, def, control, ...(isLits ? { options: lits.map((x) => x.slice(1, -1)) } : {}) };
  }).filter(Boolean);
}

export function sourceHash() {
  const h = createHash("sha256"); h.update(gallerySourceHash());
  for (const f of readdirSync(SRC).sort()) { h.update(f); h.update(readFileSync(join(SRC, f))); }
  h.update(readFileSync(fileURLToPath(import.meta.url)));
  const plain = join(ROOT, "vendor/plain/top5.json"); if (existsSync(plain)) h.update(readFileSync(plain));
  return h.digest("hex").slice(0, 16);
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anybody:wdth,wght@50..150,100..900&family=Fraunces:opsz,wght@9..144,300..800&family=Hanken+Grotesk:wght@400..700&family=JetBrains+Mono:wght@400;600&display=swap">`;
function shell({ title, desc, base, page, id = "", source = null, hash, count }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="motomation-docs" content="source:${hash} components:${count}">
<link rel="icon" href="data:,">
${FONTS}
<link rel="stylesheet" href="${base}assets/site.css">
</head>
<body data-page="${page}"${id ? ` data-id="${id}"` : ""}>
<div id="root"><noscript><p style="padding:24px">These docs need JavaScript for the live demos. The catalogue is in skills/asfakulsiam-motomation-design/examples/components/README.md.</p></noscript></div>
${source !== null ? `<script type="application/json" id="source">${JSON.stringify(source).replace(/</g, "\\u003c")}</script>\n` : ""}<script src="${base}assets/site.js"></script>
</body>
</html>
`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { components } = collect();
  const plain = existsSync(join(ROOT, "vendor/plain/top5.json")) ? new Set(JSON.parse(readFileSync(join(ROOT, "vendor/plain/top5.json"), "utf8")).components.map((c) => c.id)) : new Set();
  const entries = components.map((c) => ({ id: c.id, name: c.name, family: c.family, tier: c.tier, what: c.what, use_when: c["use-when"], avoid_when: c["avoid-when"], reduced_motion: c["reduced-motion"], touch: c.touch || "", a11y: c.a11y || "", file: c.file, props: parseProps(c.src, c.export), plain: plain.has(c.id) }));
  if (process.argv.includes("--props")) { for (const e of entries) console.log(`${e.id.padEnd(20)} ${e.props.map((p) => `${p.name}${p.control ? `[${p.control}]` : ""}${p.def ? `=${p.def}` : ""}`).join(" ")}`); process.exit(0); }
  const req = createRequire(join(process.cwd(), "noop.js")); let esbuild;
  try { esbuild = req("esbuild"); } catch { console.error(`esbuild not found. Run: npm i --no-save ${Object.entries(PINNED).map(([m, v]) => `${m}@${v}`).join(" ")}`); process.exit(1); }
  if (esbuild.version !== PINNED.esbuild) { console.error(`build-docs-site needs esbuild ${PINNED.esbuild} (found ${esbuild.version}); nothing written`); process.exit(1); }
  const res = await esbuild.build({ entryPoints: [join(SRC, "site.tsx")], bundle: true, minify: true, format: "iife", write: false, target: "es2020", jsx: "automatic", legalComments: "none", metafile: true,
    nodePaths: [join(process.cwd(), "node_modules"), ...(process.env.NODE_PATH || "").split(":").filter(Boolean)], define: { SITE: JSON.stringify({ components: entries, repo: REPO }), "process.env.NODE_ENV": '"production"' } });
  for (const m of ["react", "react-dom"]) { const hit = Object.keys(res.metafile.inputs).map((f) => f.match(new RegExp(`^(.*node_modules/${m})/`))).find(Boolean);
    const v = hit ? JSON.parse(readFileSync(join(hit[1].startsWith("/") ? "" : process.cwd(), hit[1], "package.json"), "utf8")).version : null;
    if (v !== PINNED[m]) { console.error(`build-docs-site needs ${m} ${PINNED[m]} (bundled ${v}); nothing written`); process.exit(1); } }
  const hash = sourceHash(), n = entries.length;
  for (const d of ["c", "assets"]) { rmSync(join(SITE, d), { recursive: true, force: true }); mkdirSync(join(SITE, d), { recursive: true }); }
  writeFileSync(join(SITE, "assets/site.js"), res.outputFiles[0].text);
  writeFileSync(join(SITE, "assets/site.css"), `/* built by scripts/build-docs-site.mjs: examples/gallery/gallery.css (the demos' own styles) + docs/site/src/site.css */\n${readFileSync(join(SKILL, "examples/gallery/gallery.css"), "utf8")}\n${readFileSync(join(SRC, "site.css"), "utf8")}`);
  writeFileSync(join(SITE, "index.html"), shell({ title: `Motomation docs · ${n} motion components`, desc: `Search ${n} original motion components; each page has a live demo, prop playground, mobile preview and install command.`, base: "", page: "index", hash, count: n }));
  for (const e of entries) writeFileSync(join(SITE, "c", `${e.id}.html`), shell({ title: `${e.name} · Motomation docs`, desc: e.what, base: "../", page: "component", id: e.id, source: components.find((c) => c.id === e.id).src, hash, count: n }));
  // gallery/ is the real gallery on GitHub Pages (the workflow copies it in); in the repository it forwards to it
  mkdirSync(join(SITE, "gallery"), { recursive: true });
  writeFileSync(join(SITE, "gallery/index.html"), `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Gallery</title><meta http-equiv="refresh" content="0; url=../../../skills/asfakulsiam-motomation-design/examples/gallery/index.html"></head><body><a href="../../../skills/asfakulsiam-motomation-design/examples/gallery/index.html">Open the gallery</a></body></html>\n`);
  const size = statSync(join(SITE, "assets/site.js")).size;
  console.log(`Wrote docs/site (${n} component pages + index, site.js ${(size / 1024).toFixed(0)} KB, source ${hash})`);
}
