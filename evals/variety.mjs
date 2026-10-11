#!/usr/bin/env node
// Variety test: do different seeds give structurally different designs?
//   node evals/variety.mjs [--category ecommerce] [--seeds 3101,3102,3103,3104,3105] [--results evals/results/2026-10-11-benchmark-v2]
// Part A: collision-engine draws for each seed (what the skill is told to build), fingerprinted with scripts/lib.mjs.
// Part B: the skill builds already published in a benchmark folder, fingerprinted from the stamp each page carries.
// Both print a pairwise similarity matrix (lib.mjs similarity(): 0 = nothing shared, 1 = same fingerprint).
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { load, fingerprint, similarity } from "../skills/asfakulsiam-motomation-design/scripts/lib.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SKILL = join(ROOT, "skills/asfakulsiam-motomation-design");
const argv = process.argv.slice(2); const flag = (k, d) => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1] : d; };
const category = flag("category", "ecommerce");
const seeds = String(flag("seeds", "3101,3102,3103,3104,3105")).split(",").map(Number);
const results = resolve(ROOT, flag("results", "evals/results/2026-10-11-benchmark-v2"));
const sigs = load("signatures");

function matrix(labels, fps) {
  const rows = [`| | ${labels.join(" | ")} |`, `|---|${labels.map(() => "---").join("|")}|`]; const off = [];
  for (let i = 0; i < fps.length; i++) rows.push(`| ${labels[i]} | ${fps.map((b, j) => { const s = similarity(fps[i], b).score; if (j > i) off.push(s); return i === j ? "—" : s.toFixed(2); }).join(" | ")} |`);
  const max = Math.max(...off), mean = off.reduce((a, b) => a + b, 0) / off.length;
  return { table: rows.join("\n"), max, mean, pairs: off.length, over70: off.filter((s) => s >= 0.7).length };
}
const fpText = (f) => Object.entries(f).map(([k, v]) => `${k}=${Array.isArray(v) ? v.join(">") : v}`).join(", ");

const out = [];
// Part A
const draws = seeds.map((seed) => {
  const r = spawnSync(process.execPath, [join(SKILL, "scripts/collide.mjs"), "--seed", String(seed), "--n", "1", "--category", category, "--json"], { encoding: "utf8" });
  const d = JSON.parse(r.stdout).draws[0];
  return { seed, archetype: d.archetype, mutation: d.mutation.id, signature: d.signature_seed.id, fp: d.fingerprint };
});
out.push(`## A. Collision-engine draws (category \`${category}\`, seeds ${seeds.join(", ")})`, "");
out.push("| Seed | Archetype | Mutation | Signature | Fingerprint |", "|---|---|---|---|---|");
for (const d of draws) out.push(`| ${d.seed} | ${d.archetype} | ${d.mutation} | ${d.signature} | ${fpText(d.fp)} |`);
const mA = matrix(draws.map((d) => String(d.seed)), draws.map((d) => d.fp));
out.push("", mA.table, "", `Distinct: ${new Set(draws.map((d) => d.archetype)).size}/${draws.length} archetypes, ${new Set(draws.map((d) => d.signature)).size}/${draws.length} signatures, ${new Set(draws.map((d) => d.mutation)).size}/${draws.length} mutations. Pairwise similarity: mean ${mA.mean.toFixed(2)}, max ${mA.max.toFixed(2)}, ${mA.over70}/${mA.pairs} pairs at or above memory's 0.70 warning.`, "");

// Part B
out.push(`## B. Published skill builds (\`${results.replace(ROOT, "")}\`)`, "");
if (!existsSync(results)) out.push("not found");
else for (const brief of readdirSync(results, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).filter((b) => readdirSync(join(results, b)).some((d) => d.startsWith("skill-s")))) {
  const builds = readdirSync(join(results, brief)).filter((d) => d.startsWith("skill-s")).sort().map((d) => {
    const c = JSON.parse(readFileSync(join(results, brief, d, "checks.json"), "utf8")); const st = c["1440"]?.source?.stamp || "";
    const field = (k) => (st.match(new RegExp(`${k}:\\s*([^·]+?)\\s*·`)) || [])[1];
    const f = { archetype: field("archetype"), signature: field("signature"), tier: field("tier"), mutation: field("mutation") };
    return { seed: d.replace("skill-s", ""), ...f, fp: fingerprint({ archetype: f.archetype, signature: f.signature, tier: f.tier }, sigs) };
  });
  const m = matrix(builds.map((b) => b.seed), builds.map((b) => b.fp));
  out.push(`### ${brief}`, "", "| Seed | Archetype | Mutation | Signature | Tier | Fingerprint |", "|---|---|---|---|---|---|");
  for (const b of builds) out.push(`| ${b.seed} | ${b.archetype} | ${b.mutation} | ${b.signature} | ${b.tier} | ${fpText(b.fp)} |`);
  out.push("", m.table, "", `Distinct: ${new Set(builds.map((b) => b.archetype)).size}/${builds.length} archetypes, ${new Set(builds.map((b) => b.signature)).size}/${builds.length} signatures. Mean ${m.mean.toFixed(2)}, max ${m.max.toFixed(2)}.`, "");
}
console.log(out.join("\n"));
