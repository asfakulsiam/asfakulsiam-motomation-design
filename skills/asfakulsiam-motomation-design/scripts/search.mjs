#!/usr/bin/env node
// Search the curated design data with BM25 ranking.
// Usage: node scripts/search.mjs <dataset> "<query>" [--n 5] [--tier 2] [--json]
// Datasets: fonts palettes motion signatures archetypes mutations collisions styles categories kinetics
import { load, args } from "./lib.mjs";

const a = args();
const [dataset, ...rest] = a._;
const query = rest.join(" ").trim();
if (!dataset || dataset === "help") {
  console.log(`Usage: node scripts/search.mjs <dataset> "<query>" [--n 5] [--tier N] [--json]
Datasets: fonts palettes motion signatures archetypes mutations collisions styles categories kinetics`);
  process.exit(dataset ? 0 : 1);
}

let rows = load(dataset);
if (a.tier) rows = rows.filter((r) => !r.tier || r.tier.split(/[^0-9]/).includes(String(a.tier)));

const tok = (s) => s.toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N}]+/gu, " ").split(" ").filter((w) => w.length > 1);
const docs = rows.map((r) => tok(Object.values(r).join(" ")));
const N = docs.length || 1;
const avg = docs.reduce((s, d) => s + d.length, 0) / N;
const df = new Map();
docs.forEach((d) => new Set(d).forEach((t) => df.set(t, (df.get(t) || 0) + 1)));
const k1 = 1.4, b = 0.75;
const q = tok(query);

const scored = rows.map((row, i) => {
  if (!q.length) return { row, score: 0 };
  const d = docs[i]; let score = 0;
  for (const t of q) {
    const tf = d.filter((w) => w === t || (t.length > 3 && w.startsWith(t))).length;
    if (!tf) continue;
    const idf = Math.log(1 + (N - (df.get(t) || 0) + 0.5) / ((df.get(t) || 0) + 0.5));
    score += idf * ((tf * (k1 + 1)) / (tf + k1 * (1 - b + (b * d.length) / avg)));
  }
  return { row, score };
});

const n = Number(a.n || 5);
const results = (q.length ? scored.filter((s) => s.score > 0).sort((x, y) => y.score - x.score) : scored).slice(0, n);

if (a.json) { console.log(JSON.stringify(results.map((r) => r.row), null, 2)); process.exit(0); }
if (!results.length) { console.log(`No match in "${dataset}" for "${query}". Try fewer or broader words.`); process.exit(0); }
console.log(`${dataset}: top ${results.length} for "${query || "(all)"}"\n`);
for (const { row, score } of results) {
  const [first, ...others] = Object.entries(row);
  console.log(`■ ${first[1]}${score ? `  (score ${score.toFixed(2)})` : ""}`);
  for (const [k, v] of others) if (v) console.log(`  ${k.padEnd(14)} ${v}`);
  console.log("");
}
