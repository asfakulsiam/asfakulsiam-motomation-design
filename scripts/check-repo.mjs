#!/usr/bin/env node
// Repository linter: structure, front-matter, references, data integrity, versions, dist freshness.
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, basename } from "node:path";
import { execFileSync } from "node:child_process";
import { parseCSV } from "../skills/asfakulsiam-motomation-design/scripts/lib.mjs";

const ROOT = new URL("..", import.meta.url).pathname;
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

warn.forEach((w) => console.warn(`warn: ${w}`));
if (errors.length) { errors.forEach((e) => console.error(`✗ ${e}`)); console.error(`\n${errors.length} problem(s).`); process.exit(1); }
console.log(`✓ repository OK (skill v${v}, ${mdFiles.length} docs, ${Object.keys(ids).length} data sets)`);
