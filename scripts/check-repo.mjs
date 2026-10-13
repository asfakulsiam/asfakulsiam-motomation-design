#!/usr/bin/env node
// Repository linter: structure, front-matter, references, data integrity, versions, dist freshness.
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, basename } from "node:path";
import { execFileSync } from "node:child_process";
import { parseCSV } from "../skills/asfakulsiam-motomation-design/scripts/lib.mjs";
import { renderRule, rules as loadRules, bannedDisplayFonts } from "../skills/asfakulsiam-motomation-design/scripts/rules.mjs";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url)); // decoded and OS-native (Windows drive letters, spaces)
const SKILL = join(ROOT, "skills/asfakulsiam-motomation-design");
const errors = []; const warn = [];
const fail = (m) => errors.push(m);

// 1. Structure
if (existsSync(join(ROOT, "SKILL.md"))) fail("Root SKILL.md exists: it would shadow the nested skill for `npx skills add`.");
const skillMd = readFileSync(join(SKILL, "SKILL.md"), "utf8");
const fm = skillMd.match(/^---\n([\s\S]*?)\n---/);
if (!fm) fail("SKILL.md has no front-matter");
else {
  const name = fm[1].match(/^name:\s*(.+)$/m)?.[1].trim();
  const desc = fm[1].match(/^description:\s*(.+)$/m)?.[1].trim() || "";
  if (name !== basename(SKILL)) fail(`front-matter name "${name}" must equal folder "${basename(SKILL)}"`);
  if (!/^[a-z0-9-]+$/.test(name || "")) fail("name must be kebab-case");
  if (!desc) fail("description missing");
  if (desc.length > 1024) fail(`description is ${desc.length} chars (max 1024)`);
  if (!/^Use when/i.test(desc)) warn.push("description should start with 'Use when' (trigger-first)");
}
const lines = skillMd.split("\n").length;
if (lines > 500) fail(`SKILL.md is ${lines} lines (keep it under 500; move detail into topic files)`);

// 2. Referenced paths inside the skill exist
const walk = (p) => statSync(p).isDirectory() ? readdirSync(p).flatMap((f) => walk(join(p, f))) : [p];
const mdFiles = walk(SKILL).filter((f) => f.endsWith(".md"));
const refRe = /`((?:thinking|invention|structures|principles|motion|signatures|styles|categories|craft|gates|commands|adapters|references|templates|examples|data|scripts)\/[A-Za-z0-9._\/-]+)`/g;
for (const f of mdFiles) {
  const text = readFileSync(f, "utf8");
  for (const [, ref] of text.matchAll(refRe)) {
    const clean = ref.replace(/[.,:;]+$/, "");
    if (clean.includes("*") || clean.endsWith("/")) { if (!existsSync(join(SKILL, clean.replace(/\*.*$/, "")))) fail(`${relative(ROOT, f)} → missing ${clean}`); continue; }
    if (!existsSync(join(SKILL, clean))) fail(`${relative(ROOT, f)} → missing ${clean}`);
  }
}

// 3. Data integrity
const ids = {};
for (const f of readdirSync(join(SKILL, "data"))) {
  const text = readFileSync(join(SKILL, "data", f), "utf8");
  const rows = parseCSV(text);
  const header = Object.keys(rows[0] || {});
  if (!rows.length) fail(`data/${f} is empty`);
  rows.forEach((r, i) => { if (Object.values(r).some((v) => v === undefined)) fail(`data/${f} row ${i + 2} has missing columns`); });
  const key = header.includes("id") ? "id" : header[0];
  const seen = new Set();
  for (const r of rows) { if (seen.has(r[key])) fail(`data/${f}: duplicate ${key} "${r[key]}"`); seen.add(r[key]); }
  ids[f.replace(".csv", "")] = seen;
}
for (const r of parseCSV(readFileSync(join(SKILL, "data/signatures.csv"), "utf8"))) if (!existsSync(join(SKILL, r.file))) fail(`signatures.csv: ${r.id} → missing ${r.file}`);
for (const r of parseCSV(readFileSync(join(SKILL, "data/styles.csv"), "utf8"))) if (!existsSync(join(SKILL, r.file))) fail(`styles.csv: ${r.id} → missing ${r.file}`);
for (const r of parseCSV(readFileSync(join(SKILL, "data/categories.csv"), "utf8"))) {
  if (!existsSync(join(SKILL, r.file))) fail(`categories.csv: ${r.id} → missing ${r.file}`);
  for (const a of r.archetypes.split(" ")) if (!ids.archetypes.has(a)) fail(`categories.csv: ${r.id} → unknown archetype ${a}`);
}

// 4. Versions agree
const v = readFileSync(join(SKILL, "VERSION"), "utf8").trim();
const versions = {
  "package.json": JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).version,
  "SKILL.md metadata": skillMd.match(/version:\s*([\d.]+)/)?.[1],
  ".claude-plugin/plugin.json": JSON.parse(readFileSync(join(ROOT, ".claude-plugin/plugin.json"), "utf8")).version,
  ".cursor-plugin/plugin.json": JSON.parse(readFileSync(join(ROOT, ".cursor-plugin/plugin.json"), "utf8")).version,
  ".codex-plugin/plugin.json": JSON.parse(readFileSync(join(ROOT, ".codex-plugin/plugin.json"), "utf8")).version,
  "gemini-extension.json": JSON.parse(readFileSync(join(ROOT, "gemini-extension.json"), "utf8")).version,
  ".claude-plugin/marketplace.json (metadata)": JSON.parse(readFileSync(join(ROOT, ".claude-plugin/marketplace.json"), "utf8")).metadata?.version,
  ...Object.fromEntries((JSON.parse(readFileSync(join(ROOT, ".claude-plugin/marketplace.json"), "utf8")).plugins || []).map((p, i) => [`.claude-plugin/marketplace.json plugins[${i}]`, p.version])),
  "README version badge": readFileSync(join(ROOT, "README.md"), "utf8").match(/badge\/version-([\d.]+)-/)?.[1],
};
for (const [k, val] of Object.entries(versions)) if (val !== v) fail(`${k} version ${val} ≠ VERSION ${v}`);
if (!readFileSync(join(ROOT, "CHANGELOG.md"), "utf8").includes(`## [${v}]`)) fail(`CHANGELOG.md has no entry for ${v}`);

// 5. Scripts run and palettes pass contrast
const node = process.execPath; const S = join(SKILL, "scripts");
const run = (args) => { try { execFileSync(node, args, { stdio: "pipe", cwd: ROOT }); return true; } catch { return false; } };
if (!run([join(S, "search.mjs"), "fonts", "serif"])) fail("search.mjs failed");
if (!run([join(S, "collide.mjs"), "--n", "3", "--seed", "1", "--spread"])) fail("collide.mjs failed");
if (!run([join(S, "contrast.mjs"), "--palettes"])) fail("a palette in data/palettes.csv fails contrast (run: node scripts/contrast.mjs --palettes)");

// 6. dist is fresh
if (!run([join(ROOT, "scripts/build-dist.mjs"), "--check"])) fail("dist/motomation-design.md is out of date (run: node scripts/build-dist.mjs)");
if (!run([join(ROOT, "scripts/build-lite.mjs"), "--check"])) fail("dist/motomation-lite.md is out of date or over its 8k-token budget (run: node scripts/build-lite.mjs)");

// 7. Shared rules (data/rules.csv) are spelled the same everywhere
{
  const R = loadRules();
  const markerRe = /<!--rule:([a-z_]+)-->([\s\S]*?)<!--\/rule-->/g;
  // every file that states a shared rule, and the rules it must carry as markers
  const required = {
    "SKILL.md": ["banned_display_fonts", "caution_fonts", "ui_feedback_max_ms"],
    "principles/typography.md": ["banned_display_fonts", "caution_fonts"],
    "principles/restraint.md": ["ui_feedback_max_ms"],
    "principles/house-style.md": ["ui_feedback_max_ms"],
    "motion/tier-1-basic.md": ["ui_feedback_max_ms"],
    "gates/delivery-gate.md": ["banned_display_fonts", "caution_fonts", "ui_feedback_max_ms"],
  };
  for (const [file, keys] of Object.entries(required)) {
    const text = readFileSync(join(SKILL, file), "utf8");
    const found = new Set([...text.matchAll(markerRe)].map((m) => m[1]));
    for (const k of keys) if (!found.has(k)) fail(`${file}: missing <!--rule:${k}--> marker (value from data/rules.csv)`);
  }
  const banned = bannedDisplayFonts().filter((f) => f !== "system-ui");
  const scan = [...mdFiles, join(SKILL, "scripts/gate.mjs"), join(ROOT, "README.md"), join(ROOT, "AGENTS.md"), join(ROOT, "rules/motomation.md"), join(ROOT, "rules/motomation.mdc")].filter((f) => existsSync(f));
  for (const f of scan) {
    const text = readFileSync(f, "utf8");
    for (const [, k, inner] of text.matchAll(markerRe)) {
      if (!R[k]) { fail(`${relative(ROOT, f)}: unknown rule marker ${k}`); continue; }
      const want = renderRule(k, R);
      if (inner !== want) fail(`${relative(ROOT, f)}: rule ${k} says "${inner}", data/rules.csv says "${want}"`);
    }
    // restated without a marker: a UI-feedback duration, or a list of three or more banned display fonts
    text.replace(markerRe, "").split("\n").forEach((line, i) => {
      if (/UI feedback[^.;|]{0,60}?\b\d{2,4}\s?ms\b/i.test(line)) fail(`${relative(ROOT, f)}:${i + 1}: UI-feedback duration written by hand; use <!--rule:ui_feedback_max_ms-->`);
      if (banned.filter((b) => new RegExp(`\\b${b}\\b`).test(line)).length >= 3) fail(`${relative(ROOT, f)}:${i + 1}: banned-font list written by hand; use <!--rule:banned_display_fonts-->`);
    });
  }
}

// 8. Original work only: no vendored or copied third-party component code anywhere in the repository.
//    vendor/ may hold only vendor/plain/: this project's own CSS + HTML and Tailwind variants of its own components.
{
  if (existsSync(join(SKILL, "vendor"))) fail("skills/…/vendor/ exists: this repository ships only its own code");
  const V = join(ROOT, "vendor");
  if (existsSync(V)) {
    for (const f of readdirSync(V)) if (f !== "plain") fail(`vendor/${f}: only vendor/plain/ (our own framework-free variants) may live in vendor/`);
    const P = join(V, "plain"), walkV = (p) => statSync(p).isDirectory() ? readdirSync(p).flatMap((f) => walkV(join(p, f))) : [p];
    if (existsSync(P)) {
      for (const f of walkV(P)) {
        const rel = relative(ROOT, f), src = readFileSync(f, "utf8");
        if (!/\.(js|css|html|json|md)$/.test(f)) { fail(`${rel}: unexpected file type in vendor/plain`); continue; }
        if (!src.includes("@motomation-variant")) fail(`${rel}: missing the @motomation-variant header`);
        const react = src.match(/react: (\S+\.tsx)/); if (react && !existsSync(join(ROOT, react[1]))) fail(`${rel}: react source ${react[1]} does not exist`);
        if (/\.js$/.test(f)) for (const m of src.matchAll(/^\s*import\b[^"']*["']([^"']+)["']/gm)) if (!m[1].startsWith("./") && !m[1].startsWith("../")) fail(`${rel}: imports "${m[1]}"; vendor/plain has no dependencies (relative imports only)`);
        if (/\.html$/.test(f)) for (const m of src.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="(https?:)?\/\//g)) fail(`${rel}: loads a remote script or stylesheet; the variants are self-contained`);
      }
      // the top 5 by usage (v2.5.0: the library is React-first; plain variants only for the 5 most-used): how many D5 sections import the component, then how many D6 templates reach it, then name
      const secDir = join(SKILL, "examples/sections"), tplDir = join(SKILL, "examples/templates");
      const compOf = (src) => new Set([...src.matchAll(/from "\.\.\/components\/[a-z]+\/([a-z0-9-]+)"/g)].map((m) => m[1]));
      const secComps = Object.fromEntries(readdirSync(secDir).filter((f) => f.endsWith(".tsx") && !f.startsWith("_")).map((f) => [f.replace(/\.tsx$/, ""), compOf(readFileSync(join(secDir, f), "utf8"))]));
      const use = {}; const bump = (c, k) => { use[c] ??= { s: 0, t: 0 }; use[c][k]++; };
      for (const cs of Object.values(secComps)) for (const c of cs) bump(c, "s");
      for (const d of readdirSync(tplDir).filter((d) => existsSync(join(tplDir, d, "page.tsx")))) {
        const secs = [...readFileSync(join(tplDir, d, "page.tsx"), "utf8").matchAll(/from "\.\.\/\.\.\/sections\/([a-z0-9-]+)"/g)].map((m) => m[1]);
        for (const c of new Set(secs.flatMap((s) => [...(secComps[s] || [])]))) bump(c, "t"); }
      const want = Object.keys(use).sort((a, b) => use[b].s - use[a].s || use[b].t - use[a].t || a.localeCompare(b)).slice(0, 5);
      const listed = JSON.parse(readFileSync(join(P, "top5.json"), "utf8")).components.map((c) => c.id);
      if (JSON.stringify([...listed].sort()) !== JSON.stringify([...want].sort())) fail(`vendor/plain/top5.json lists ${listed.join(", ")}; the top 5 by usage are now ${want.join(", ")}`);
      for (const id of listed) for (const f of [`${id}.js`, `${id}.css`, "plain.html", "tailwind.html"]) if (!existsSync(join(P, id, f))) fail(`vendor/plain/${id}/${f} missing: each top-5 component ships React + CSS/HTML + Tailwind`);
      for (const d of readdirSync(P).filter((d) => d !== "_lib" && statSync(join(P, d)).isDirectory())) if (!listed.includes(d)) fail(`vendor/plain/${d}/: only the top 5 by usage keep plain variants (React-first); use the React version of ${d}`);
      if (!existsSync(join(P, "README.md"))) fail("vendor/plain/README.md missing");
    }
  }
  const skipDirs = new Set([".git", "node_modules", "evals", "dist"]);
  const walkCode = (p) => statSync(p).isDirectory() ? (skipDirs.has(basename(p)) ? [] : readdirSync(p).flatMap((f) => walkCode(join(p, f)))) : [p];
  for (const f of walkCode(ROOT)) {
    if (!/\.(tsx?|jsx?|mjs|css|vue|svelte)$/.test(f)) continue;
    const src = readFileSync(f, "utf8");
    const notice = src.match(/Copyright \(c\) \d{4}\s+([^\n*]+)/i);
    if (notice && !/asfakulsiam/i.test(notice[1])) fail(`${relative(ROOT, f)}: carries a third-party copyright notice ("${notice[0].trim()}"); write the idea in your own code instead`);
  }
}

// 9. Component library: headers valid, generated files fresh, gallery built from the current sources
{
  const { collect, render } = await import("./build-components.mjs");
  const { components: comps, problems } = collect();
  problems.forEach((p) => fail(`components: ${p}`));
  if (comps.length) {
    const files = render(comps);
    for (const [rel, body] of Object.entries(files)) {
      const at = join(ROOT, rel);
      if (!existsSync(at) || readFileSync(at, "utf8") !== body) fail(`${rel} is stale; run node scripts/build-components.mjs`);
    }
    const reg = join(ROOT, "registry");
    if (existsSync(reg)) for (const f of readdirSync(reg)) if (!files[`registry/${f}`]) fail(`registry/${f} has no component; run node scripts/build-components.mjs`);
    const { sourceHash } = await import("./build-gallery.mjs");
    const html = join(SKILL, "examples/gallery/index.html");
    const meta = existsSync(html) ? readFileSync(html, "utf8").match(/<meta name="motomation-gallery" content="source:([0-9a-f]+) components:(\d+)">/) : null;
    if (!meta) fail("examples/gallery/index.html is missing or has no build stamp; run node scripts/build-gallery.mjs");
    else if (meta[1] !== sourceHash() || Number(meta[2]) !== comps.length) fail(`examples/gallery/index.html is stale (built from ${meta[1]}, ${meta[2]} components; sources are ${sourceHash()}, ${comps.length}); run node scripts/build-gallery.mjs`);
  }
}

// 9b. Page sections: headers valid (kind, archetype, listed components exist and are imported), README fresh
{
  const { collect, renderReadme } = await import("./build-sections.mjs");
  const { sections, problems } = collect();
  problems.forEach((p) => fail(`sections: ${p}`));
  const readme = join(SKILL, "examples/sections/README.md");
  if (sections.length && (!existsSync(readme) || readFileSync(readme, "utf8") !== renderReadme(sections))) fail("examples/sections/README.md is stale; run node scripts/build-sections.mjs");
}

// 9c. Page templates: import only sections, built from their current sources, README fresh, stamped by the gate
{
  const { collect, renderReadme, sourceHash } = await import("./build-templates.mjs");
  const rules = await import("./template-rules.mjs");
  const { templates, problems } = await collect();
  problems.forEach((p) => fail(`templates: ${p}`));
  for (const t of templates) {
    const at = join(SKILL, t.html);
    const own = join(SKILL, "examples/templates", t.id); const read = (f) => (existsSync(join(own, f)) ? readFileSync(join(own, f), "utf8") : null);
    rules.timingSheet(t.tier, read("MOTION.md")).forEach((p) => fail(`examples/templates/${t.id}: ${p}`));
    if (!existsSync(at)) { fail(`${t.html} is missing; run node scripts/build-templates.mjs`); continue; }
    const html = readFileSync(at, "utf8"); const meta = html.match(/<meta name="motomation-template" content="source:([0-9a-f]+)/);
    if (!meta || meta[1] !== sourceHash(t)) fail(`${t.html} is stale (its sections or components changed); run node scripts/build-templates.mjs, then gate and stamp it again`);
    if (!/motomation · [^*]*critique: [^*]+ · gate: c\d+ o\d+ w\d+ rm\d+ a\d+ n\d+(?: q\d+ k\d+)? · gate\/\d+ · [0-9a-f]{10}/.test(html)) fail(`${t.html} has no measured gate stamp; run scripts/gate.mjs on it and paste the stamp with build-templates.mjs --stamp`);
  }
  const readme = join(SKILL, "examples/templates/README.md");
  if (templates.length && (!existsSync(readme) || readFileSync(readme, "utf8") !== renderReadme(templates))) fail("examples/templates/README.md is stale; run node scripts/build-templates.mjs");
}

// 9d. Docs site: one page per component, built from the current sources (scripts/build-docs-site.mjs)
{
  const idx = join(ROOT, "docs/site/index.html");
  if (existsSync(idx)) {
    const { sourceHash } = await import("./build-docs-site.mjs");
    const meta = readFileSync(idx, "utf8").match(/<meta name="motomation-docs" content="source:([0-9a-f]+) components:(\d+)">/);
    const want = sourceHash();
    if (!meta) fail("docs/site/index.html has no build stamp; run node scripts/build-docs-site.mjs");
    else if (meta[1] !== want) fail(`docs/site is stale (built from ${meta[1]}, sources are ${want}); run node scripts/build-docs-site.mjs`);
    const { components } = (await import("./build-components.mjs")).collect();
    for (const c of components) if (!existsSync(join(ROOT, "docs/site/c", `${c.id}.html`))) fail(`docs/site/c/${c.id}.html missing: every component has a docs page`);
    for (const f of ["assets/site.js", "assets/site.css"]) if (!existsSync(join(ROOT, "docs/site", f))) fail(`docs/site/${f} missing`);
  }
}

// 10. Every worked example is discoverable from the top of the README (before "Why this exists")
{
  const readme = readFileSync(join(ROOT, "README.md"), "utf8");
  const top = readme.split(/^## Why this exists/m)[0];
  const dir = join(SKILL, "examples/prompts");
  if (existsSync(dir)) for (const f of readdirSync(dir).filter((x) => x.endsWith(".md"))) {
    if (!top.includes(`examples/prompts/${f}`)) fail(`README.md: examples/prompts/${f} is not linked in "See it in action" (above "Why this exists")`);
  }
}

// 11. One rule for what to animate (motion/tokens.md "What to animate"), and the library agrees with it.
//     Prefer transform/opacity; clip-path when it is the concept; paint-heavy only with a perf check + static fallback.
//     No doc may state the old "transform/opacity only" rule, every motion doc points to the one rule, and the
//     components that animate clip-path (Aperture, PinnedChapter) are named by the rule and open fully under reduced motion.
{
  const tokens = readFileSync(join(SKILL, "motion/tokens.md"), "utf8");
  if (!/^#+ What to animate/m.test(tokens)) fail("motion/tokens.md: the \"What to animate\" rule is missing");
  for (const want of [/transform.{0,12}opacity[^\n]*Prefer/i, /clip-path[^\n]*serves the concept/i, /Paint-heavy[^\n]*performance check[^\n]*static fallback/i])
    if (!want.test(tokens)) fail(`motion/tokens.md "What to animate": missing ${want}`);
  const docs = ["principles/restraint.md", ...readdirSync(join(SKILL, "motion")).filter((f) => /^tier-\d/.test(f)).map((f) => `motion/${f}`)];
  for (const d of docs) { const s = readFileSync(join(SKILL, d), "utf8");
    if (!s.includes("motion/tokens.md") || !/clip-path/.test(s)) fail(`${d}: must point to motion/tokens.md ("What to animate") and say when clip-path is allowed`); }
  const banned = /(animate|animating|motion uses?)\s+(only\s+)?transform\s*(\/|and|&)\s*opacity\s+only|only\s+(ever\s+)?animate\s+transform\s*(\/|and|&)\s*opacity|never animate clip-?path/i;
  for (const f of mdFiles) { const s = readFileSync(f, "utf8"); if (banned.test(s)) fail(`${relative(ROOT, f)}: states the old "transform/opacity only" rule; use motion/tokens.md "What to animate"`); }
  for (const [file, name, rm] of [["examples/components/scroll/aperture.tsx", "aperture", /clipPath:\s*reduce\s*\?\s*"none"/], ["examples/scroll/pinned-chapter.tsx", "pinned-chapter", /if \(!motion\) return;/]]) {
    const s = readFileSync(join(SKILL, file), "utf8");
    if (!/clip-?path/i.test(s)) fail(`${file}: expected to animate clip-path (named in motion/tokens.md)`);
    if (!rm.test(s)) fail(`${file}: animates clip-path but has no unclipped reduced-motion path`);
    if (!tokens.includes(file)) fail(`motion/tokens.md: names the clip-path components; ${file} (${name}) is missing`);
  }
}

// 12. Component counts in prose agree with data/components.csv (rows = components, distinct `family` = families).
//     Every "<n> components", "<n>-component", "<n> families" / "<word> families" in the current docs must match.
//     CHANGELOG.md is history (each entry is true for its version) and is not scanned.
{
  const comps = parseCSV(readFileSync(join(SKILL, "data/components.csv"), "utf8"));
  const nComp = comps.length, nFam = new Set(comps.map((r) => r.family)).size;
  const WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
  const docs = ["README.md", "ABOUT.md", "llms.txt", "AGENTS.md", "mcp/README.md", "dist/motomation-design.md", "dist/motomation-lite.md",
    "skills/asfakulsiam-motomation-design/SKILL.md", "skills/asfakulsiam-motomation-design/examples/README.md",
    "skills/asfakulsiam-motomation-design/examples/components/README.md"];
  for (const d of docs) {
    const f = join(ROOT, d); if (!existsSync(f)) continue;
    readFileSync(f, "utf8").split("\n").forEach((line, i) => {
      for (const m of line.matchAll(/\b(\d+)(?:-component\b| (?:original |effect |more original |motion )*components\b)/g))
        if (+m[1] !== nComp) fail(`${d}:${i + 1} says "${m[0]}" but data/components.csv has ${nComp} components`);
      if (/component/i.test(line)) for (const m of line.matchAll(/\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten) families\b/gi)) { // font "families" lines are not about the library
        const n = /\d/.test(m[1]) ? +m[1] : WORDS[m[1].toLowerCase()];
        if (n !== nFam) fail(`${d}:${i + 1} says "${m[0]}" but data/components.csv has ${nFam} families`);
      }
    });
  }
}

// 13. docs/benchmark-summary.md names the newest main benchmark report as current.
//     Main reports are evals/results/<date>-benchmark[-v<N>].md (companion reports have a suffix after the version).
{
  const files = readdirSync(join(ROOT, "evals/results")).filter((f) => /^\d{4}-\d{2}-\d{2}-benchmark(-v\d+)?\.md$/.test(f));
  const ver = (f) => +((f.match(/-v(\d+)\.md$/) || [0, 1])[1]);
  const newest = files.sort((a, b) => ver(a) - ver(b) || a.localeCompare(b)).at(-1);
  const sum = readFileSync(join(ROOT, "docs/benchmark-summary.md"), "utf8");
  const m = sum.match(/<!-- current-report -->[\s\S]*?evals\/results\/([^)`\]\s]+\.md)[\s\S]*?<!-- \/current-report -->/);
  if (!m) fail("docs/benchmark-summary.md has no <!-- current-report --> marker naming the current report");
  else if (m[1] !== newest) fail(`docs/benchmark-summary.md names ${m[1]} as current, but the newest main report is ${newest}`);
  if (/v2 is the current result/i.test(sum)) fail("docs/benchmark-summary.md still says v2 is the current result");
}

warn.forEach((w) => console.warn(`warn: ${w}`));
if (errors.length) { errors.forEach((e) => console.error(`✗ ${e}`)); console.error(`\n${errors.length} problem(s).`); process.exit(1); }
console.log(`✓ repository OK (skill v${v}, ${mdFiles.length} docs, ${Object.keys(ids).length} data sets)`);
