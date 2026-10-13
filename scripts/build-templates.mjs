#!/usr/bin/env node
// Page templates: whole pages composed only from examples/sections/, built to standalone HTML for the Delivery Gate.
//   node scripts/build-templates.mjs                       validate, build every examples/templates/<id>.html, write the README
//   node scripts/build-templates.mjs --only saas-landing   build one
//   node scripts/build-templates.mjs --stamp <id> "<critique: … · gate: …>"   paste the line gate.mjs printed into the page's stamp
//                                                          (also for a Tier 5 film template: examples/templates/<id>/index.html)
// Each page is server-rendered (react-dom/server) and hydrated, so the HTML is complete before any script runs.
// A rebuild that produces the same page (stamp aside) keeps the existing file, and with it the measured stamp.
// Source of a template: examples/templates/<id>/page.tsx with a "// @motomation-template" header (see the README).
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { createHash } from "node:crypto";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKILL = join(ROOT, "skills/asfakulsiam-motomation-design");
const DIR = join(SKILL, "examples/templates");
const FIELDS = ["id", "name", "kind", "archetype", "mutation", "signature", "sections", "fonts", "theme", "what"];
const STAMP_RE = /<!--[^>]*?motomation ·[\s\S]*?-->|\/\*[^*]*?motomation ·[\s\S]*?\*\//g;
const strip = (html) => html.replace(STAMP_RE, "");

function csv(file) {
  const [head, ...lines] = readFileSync(file, "utf8").replace(/\r/g, "").trim().split("\n");
  const parse = (l) => { const r = []; let cur = "", q = false; for (const ch of l) { if (ch === '"') q = !q; else if (ch === "," && !q) { r.push(cur); cur = ""; } else cur += ch; } r.push(cur); return r; };
  const cols = parse(head); return lines.map((l) => Object.fromEntries(parse(l).map((v, i) => [cols[i], v])));
}
const pascal = (id) => id.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join("");

export async function collect() {
  const problems = [];
  const { collect: sectionsOf } = await import("./build-sections.mjs");
  const sections = new Map(sectionsOf().sections.map((s) => [s.id, s]));
  const ids = (f) => new Set(csv(join(SKILL, "data", f)).map((r) => r.id));
  const archetypes = ids("archetypes.csv"), mutations = ids("mutations.csv"), signatures = ids("signatures.csv");
  const tierOf = new Map(csv(join(SKILL, "data/components.csv")).map((r) => [r.export, +r.tier]));
  const families = new Set(JSON.parse(readFileSync(join(DIR, "fonts/fonts.json"), "utf8")).map((f) => f.family));
  const templates = [];
  if (!existsSync(DIR)) return { templates, problems };
  for (const id of readdirSync(DIR).filter((d) => existsSync(join(DIR, d, "page.tsx"))).sort()) {
    const rel = `examples/templates/${id}/page.tsx`, src = readFileSync(join(DIR, id, "page.tsx"), "utf8");
    if (!src.includes("// @motomation-template")) { problems.push(`${rel}: missing // @motomation-template header`); continue; }
    const m = {}; for (const x of src.matchAll(/^\/\/ ([a-z-]+): (.+)$/gm)) if (!(x[1] in m)) m[x[1]] = x[2].trim();
    for (const k of FIELDS) if (!m[k]) problems.push(`${rel}: header is missing "${k}"`);
    if (m.id && m.id !== id) problems.push(`${rel}: id "${m.id}" doesn't match its folder`);
    if (m.archetype && !archetypes.has(m.archetype)) problems.push(`${rel}: unknown archetype ${m.archetype}`);
    if (m.mutation && !mutations.has(m.mutation)) problems.push(`${rel}: unknown mutation ${m.mutation}`);
    if (m.signature && !signatures.has(m.signature)) problems.push(`${rel}: unknown signature ${m.signature}`);
    const list = (m.sections || "").split(/,\s*/).filter(Boolean);
    const imports = [...src.matchAll(/^import .+ from "([^"]+)";$/gm)].map((x) => x[1]);
    for (const p of imports) if (!/^react(-dom)?(\/|$)/.test(p) && !/^\.\.\/\.\.\/sections\/[a-z0-9-]+$/.test(p)) problems.push(`${rel}: imports ${p}; a template may import only sections (no components, no new sections)`);
    for (const s of list) {
      if (!sections.has(s)) problems.push(`${rel}: section ${s} does not exist in examples/sections/`);
      else if (!imports.includes(`../../sections/${s}`) || !new RegExp(`<${pascal(s)}\\b`).test(src)) problems.push(`${rel}: lists ${s} but doesn't import and render it`);
    }
    for (const p of imports.filter((p) => p.startsWith("../../sections/"))) if (!list.includes(p.split("/").pop())) problems.push(`${rel}: imports ${p} but doesn't list it in "sections"`);
    const fonts = {}; for (const x of (m.fonts || "").matchAll(/(display|text|mono) "([^"]+)"/g)) fonts[x[1]] = x[2];
    for (const role of ["display", "text", "mono"]) if (!fonts[role]) problems.push(`${rel}: fonts must name display, text and mono`); else if (!families.has(fonts[role])) problems.push(`${rel}: font ${fonts[role]} is not in templates/fonts/fonts.json`);
    const used = list.flatMap((s) => sections.get(s)?.list || []);
    const tier = Math.max(1, ...used.map((c) => tierOf.get(c) || 1));
    const archetypeOfHero = sections.get(list[0])?.archetype;
    if (archetypeOfHero && m.archetype && archetypeOfHero !== m.archetype) problems.push(`${rel}: page archetype ${m.archetype} ≠ its hero's archetype ${archetypeOfHero}`);
    templates.push({ ...m, list, fonts, tier, components: [...new Set(used)].sort(), file: rel, html: `examples/templates/${id}.html` });
  }
  return { templates, problems };
}

// everything a page is built from: its source and every file it reaches through relative imports (sections,
// components, _lib), plus the font list and this script. An edit elsewhere in the library doesn't invalidate the page.
export function inputsOf(t) {
  const seen = new Set(), todo = [join(DIR, t.id, "page.tsx")];
  while (todo.length) {
    const f = todo.pop(); if (seen.has(f)) continue; seen.add(f);
    for (const m of readFileSync(f, "utf8").matchAll(/^import [^;]*? from "(\.{1,2}\/[^"]+)";/gm)) {
      const base = join(dirname(f), m[1]); const hit = [base, `${base}.tsx`, `${base}.ts`, join(base, "index.ts")].find((p) => existsSync(p) && !p.endsWith("/"));
      if (hit && !seen.has(hit)) todo.push(hit);
    }
  }
  return [...seen].sort();
}
export function sourceHash(t) {
  const h = createHash("sha256");
  for (const f of inputsOf(t)) h.update(f.slice(SKILL.length)).update(readFileSync(f));
  h.update(readFileSync(join(DIR, "fonts/fonts.json"))); h.update(BASE);
  return h.digest("hex").slice(0, 16);
}

const BASE = `*,*::before,*::after{box-sizing:border-box}html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
body{margin:0;background:var(--ground);color:var(--ink);font-family:var(--font-text);font-size:17px;line-height:1.55;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
img,svg,canvas{max-width:100%}a{color:inherit}:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.skip{position:absolute;left:12px;top:-60px;z-index:100;padding:10px 16px;background:var(--ink);color:var(--ground);border-radius:6px;text-decoration:none}.skip:focus{top:12px}`;

async function build(t) {
  const req = createRequire(join(ROOT, "noop.js")); const esbuild = req("esbuild");
  const nodePaths = [join(ROOT, "node_modules"), ...(process.env.NODE_PATH || "").split(":").filter(Boolean)];
  const tmp = join(DIR, t.id, ".build"); mkdirSync(tmp, { recursive: true });
  try {
    writeFileSync(join(tmp, "ssr.tsx"), `import { renderToString } from "react-dom/server";\nimport { Page } from "../page";\nexport const html = () => renderToString(<Page />);\n`);
    writeFileSync(join(tmp, "client.tsx"), `import { hydrateRoot } from "react-dom/client";\nimport { Page } from "../page";\nhydrateRoot(document.getElementById("root")!, <Page />);\n`);
    const common = { bundle: true, jsx: "automatic", nodePaths, define: { "process.env.NODE_ENV": '"production"' }, legalComments: "none", logLevel: "error" };
    await esbuild.build({ ...common, entryPoints: [join(tmp, "ssr.tsx")], outfile: join(tmp, "ssr.mjs"), platform: "node", format: "esm", banner: { js: "import { createRequire as __cr } from 'module'; const require = __cr(import.meta.url);" } });
    const client = await esbuild.build({ ...common, entryPoints: [join(tmp, "client.tsx")], write: false, minify: true, format: "iife", target: "es2020" });
    const body = (await import(pathToFileURL(join(tmp, "ssr.mjs")).href + `?${Date.now()}`)).html();
    const fontRows = JSON.parse(readFileSync(join(DIR, "fonts/fonts.json"), "utf8"));
    const want = new Set([...Object.values(t.fonts), "Hind Siliguri"]);
    const faces = fontRows.filter((f) => want.has(f.family)).map((f) => `@font-face{font-family:"${f.family}";font-style:${f.style};font-weight:${f.weight};${f.stretch ? `font-stretch:${f.stretch};` : ""}font-display:swap;src:url(fonts/${f.file}) format("woff2");unicode-range:${f.unicodeRange}}`).join("\n");
    const preload = fontRows.filter((f) => f.style === "normal" && (f.family === t.fonts.display || f.family === t.fonts.text)).map((f) => `<link rel="preload" href="fonts/${f.file}" as="font" type="font/woff2" crossorigin>`).join("");
    const stack = (fam, fallback) => `"${fam}","Hind Siliguri",${fallback}`;
    const root = `:root{${t.theme};--font-display:${stack(t.fonts.display, "Georgia,serif")};--font-text:${stack(t.fonts.text, "sans-serif")};--font-mono:${stack(t.fonts.mono, "ui-monospace,monospace")}}`;
    const stamp = `/* motomation · archetype: ${t.archetype} · mutation: ${t.mutation} · signature: ${t.signature} · tier: ${t.tier} */`;
    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t.name}</title>
<link rel="icon" href="data:,">
<meta name="description" content="${t.what.replace(/"/g, "&quot;")}">
<meta name="motomation-template" content="source:${sourceHash(t)} sections:${t.list.join(",")}">
${preload}
<style>
${stamp}
${faces}
${root}
${BASE}
</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div id="root">${body}</div>
<script>${client.outputFiles[0].text.replace(/<\/script/gi, "<\\/script")}</script>
</body>
</html>
`;
    const out = join(SKILL, t.html);
    if (existsSync(out) && strip(readFileSync(out, "utf8")) === strip(html)) return { kept: true, kb: Math.round(Buffer.byteLength(html) / 1024) };
    writeFileSync(out, html); return { kept: false, kb: Math.round(Buffer.byteLength(html) / 1024), jsKB: Math.round(client.outputFiles[0].contents.length / 1024) };
  } finally { rmSync(tmp, { recursive: true, force: true }); }
}

// Tier 5 film templates: standalone folders (examples/templates/<id>/index.html, no page.tsx) whose film is a frame
// sequence from scripts/build-frames.mjs. They are not built from sections; the README lists them from their stamp
// comment, <title>, meta description and frames.json, and check-repo holds them to the same rules (tier5Assets etc.).
export function collectFilms() {
  const films = [];
  if (!existsSync(DIR)) return films;
  const walk = (d, base = "") => readdirSync(join(d, base), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(d, `${base}${e.name}/`) : [`${base}${e.name}`]));
  for (const id of readdirSync(DIR).filter((d) => existsSync(join(DIR, d, "index.html")) && !existsSync(join(DIR, d, "page.tsx"))).sort()) {
    const html = readFileSync(join(DIR, id, "index.html"), "utf8");
    const st = html.match(/motomation · archetype: ([a-z-]+) · mutation: ([a-z-]+) · signature: ([a-z-]+) · tier: (\d)/);
    const man = existsSync(join(DIR, id, "frames.json")) ? readFileSync(join(DIR, id, "frames.json"), "utf8") : null;
    let frames = null; try { frames = man && JSON.parse(man); } catch {}
    films.push({ id, html: `examples/templates/${id}/index.html`, name: (html.match(/<title>([^<]+)<\/title>/) || [])[1] || id,
      what: (html.match(/<meta name="description" content="([^"]+)"/) || [])[1] || "", archetype: st?.[1], mutation: st?.[2], signature: st?.[3], tier: st ? +st[4] : null,
      families: [...new Set([...html.matchAll(/font-family:"([^"]+)"/g)].map((m) => m[1]))], frames, manifest: man, files: walk(join(DIR, id)) });
  }
  return films;
}

export function renderReadme(templates, films = collectFilms()) {
  const L = ["# Page templates", "",
    `${templates.length} whole pages, each composed only from the sections in \`examples/sections/\` (a template imports sections and nothing else; \`node scripts/build-templates.mjs\` checks this). Each sets its brand once: colours and fonts as CSS variables, so the same sections change voice per page. Each built page is server-rendered HTML with its own stamp, measured by the Delivery Gate (\`scripts/gate.mjs\`) and checked with \`gate.mjs --verify\`.`, "",
    "| Page | Kind | Archetype · mutation · signature | Tier | Sections (in order) | Fonts |", "|---|---|---|---|---|---|"];
  for (const t of templates) L.push(`| [${t.name}](${t.id}.html) ([source](${t.id}/page.tsx)) | ${t.kind} | ${t.archetype} · ${t.mutation} · ${t.signature} | ${t.tier} | ${t.list.map((s) => `\`${s}\``).join(" → ")} | ${t.fonts.display} / ${t.fonts.text} / ${t.fonts.mono} |`);
  L.push("", "**What each page is**", "");
  for (const t of templates) L.push(`- **${t.name}** (${t.kind}): ${t.what}`);
  if (films.length) {
    L.push("", "**Tier 5 film templates** (standalone: `index.html` + a frame sequence, not built from sections)", "",
      `${films.length} scroll-as-film pages. Each folder holds the page, its \`scene.mjs\`, the frames rendered from it by \`scripts/build-frames.mjs\` (\`poster.webp\`, \`storyboard/\`, \`frames.json\`; \`frames/\`, \`frames-mobile/\` and \`film.mp4\` are not on main: \`node scripts/fetch-frames.mjs\` restores them from the tarball named in \`frames.lock.json\`, sha256-checked), \`DESIGN.md\`, \`MOTION.md\` and \`log.json\`. Reduced motion is the storyboard: stills in normal flow, no canvas mounted.`, "",
      "| Page | Archetype · mutation · signature | Tier | Frames (desktop · mobile) | Fonts | Motion |", "|---|---|---|---|---|---|");
    for (const f of films) L.push(`| [${f.name}](${f.id}/index.html) | ${f.archetype} · ${f.mutation} · ${f.signature} | ${f.tier} | ${f.frames ? `${f.frames.desktop.frames} × ${f.frames.desktop.width}×${f.frames.desktop.height} · ${f.frames.mobile.frames} × ${f.frames.mobile.width}×${f.frames.mobile.height}` : "none"} | ${f.families.filter((x) => x !== "Hind Siliguri").join(" / ")} | [MOTION.md](${f.id}/MOTION.md) |`);
    L.push("");
    for (const f of films) L.push(`- **${f.id}**: ${f.what}`);
    L.push("", "Rebuild a film's frames and check they are byte-identical (from the skill folder):", "", "```sh", "node scripts/build-frames.mjs --scene examples/templates/<id>/scene.mjs --out examples/templates/<id>", "node scripts/build-frames.mjs --scene examples/templates/<id>/scene.mjs --out examples/templates/<id> --check", "node scripts/gate.mjs examples/templates/<id>/index.html", "```");
  }
  L.push("", "**Build and check one**", "", "```sh", "node scripts/build-templates.mjs --only <id>          # from the repository root", "node skills/asfakulsiam-motomation-design/scripts/gate.mjs skills/asfakulsiam-motomation-design/examples/templates/<id>.html", "node scripts/build-templates.mjs --stamp <id> \"critique: … · gate: …\"   # paste the line the gate printed", "node skills/asfakulsiam-motomation-design/scripts/gate.mjs --verify skills/asfakulsiam-motomation-design/examples/templates/<id>.html", "```", "",
    "Fonts are self-hosted from `fonts/` (SIL Open Font License 1.1; see `fonts/LICENSES.md`). Every page also loads Hind Siliguri for Bangla text and the taka sign, limited by `unicode-range` so it downloads only when Bengali characters are on the page.", "");
  return L.join("\n");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { templates, problems } = await collect();
  if (problems.length) { for (const p of problems) console.error(`✗ ${p}`); process.exit(1); }
  const si = process.argv.indexOf("--stamp");
  if (si > 0) {
    const id = process.argv[si + 1], line = (process.argv[si + 2] || "").trim().replace(/^PASS\s+stamp →\s*/, "");
    if (!/^critique: .+ · gate: c\d+ o\d+ w\d+ rm\d+ a\d+ n\d+ q\d+ k\d+ · gate\/\d+ · [0-9a-f]{10}(?: · skipped \d+\/\d+@\d+)?$/.test(line)) { console.error(`✗ paste the whole "critique: … · gate: …" line gate.mjs printed (got: ${line})`); process.exit(1); }
    const f = existsSync(join(DIR, id, "index.html")) && !existsSync(join(DIR, id, "page.tsx")) ? join(DIR, id, "index.html") : join(DIR, `${id}.html`), html = readFileSync(f, "utf8");
    writeFileSync(f, html.replace(/\/\* motomation · ([\s\S]*?) \*\//, (_, inner) => `/* motomation · ${inner.split(" · critique:")[0]} · ${line} */`));
    console.log(`Stamped ${f.slice(DIR.length + 1)}: ${line}`); process.exit(0);
  }
  const oi = process.argv.indexOf("--only"); const only = oi > 0 ? process.argv[oi + 1].split(",") : null;
  for (const t of templates.filter((t) => !only || only.includes(t.id))) { const r = await build(t); console.log(`${r.kept ? "kept " : "wrote"} examples/templates/${t.id}.html (${r.kb} KB${r.jsKB ? `, script ${r.jsKB} KB` : ""}, tier ${t.tier}, ${t.list.length} sections)`); }
  writeFileSync(join(DIR, "README.md"), renderReadme(templates));
  console.log(`Wrote examples/templates/README.md (${templates.length} templates + ${collectFilms().length} Tier 5 film templates)`);
}
