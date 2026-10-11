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

// 8. Original work only: no vendored or copied third-party component code anywhere in the repository
{
  if (existsSync(join(ROOT, "vendor")) || existsSync(join(SKILL, "vendor"))) fail("vendor/ exists: this repository ships only its own code");
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

// 10. Every worked example is discoverable from the top of the README (before "Why this exists")
{
  const readme = readFileSync(join(ROOT, "README.md"), "utf8");
  const top = readme.split(/^## Why this exists/m)[0];
  const dir = join(SKILL, "examples/prompts");
  if (existsSync(dir)) for (const f of readdirSync(dir).filter((x) => x.endsWith(".md"))) {
    if (!top.includes(`examples/prompts/${f}`)) fail(`README.md: examples/prompts/${f} is not linked in "See it in action" (above "Why this exists")`);
  }
}

warn.forEach((w) => console.warn(`warn: ${w}`));
if (errors.length) { errors.forEach((e) => console.error(`✗ ${e}`)); console.error(`\n${errors.length} problem(s).`); process.exit(1); }
console.log(`✓ repository OK (skill v${v}, ${mdFiles.length} docs, ${Object.keys(ids).length} data sets)`);
