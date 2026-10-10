#!/usr/bin/env node
// The collision engine: real random creative constraints so no two designs start the same way.
// Usage: node scripts/collide.mjs [--n 3] [--spread] [--category hotel] [--seed 42] [--exclude-recent] [--json]
import { load, args, rng, pick } from "./lib.mjs";
import { recent } from "./memory.mjs";

const a = args();
const n = Math.max(1, Math.min(10, Number(a.n || 1)));
const r = rng(a.seed === undefined ? undefined : Number.isNaN(Number(a.seed)) ? a.seed : Number(a.seed));

let archetypes = load("archetypes");
const mutations = load("mutations");
let collisions = load("collisions");
const kinetics = load("kinetics");
let signatures = load("signatures");
const categories = load("categories");

let cat;
if (a.category) {
  cat = categories.find((c) => c.id === a.category || c.name.toLowerCase().includes(String(a.category).toLowerCase()));
  if (!cat) { console.error(`Unknown category "${a.category}". Options: ${categories.map((c) => c.id).join(", ")}`); process.exit(1); }
}

if (a["exclude-recent"]) {
  const log = recent(5);
  const usedA = new Set(log.map((e) => e.archetype)), usedS = new Set(log.map((e) => e.signature));
  const fa = archetypes.filter((x) => !usedA.has(x.id)); if (fa.length) archetypes = fa;
  const fs = signatures.filter((x) => !usedS.has(x.id)); if (fs.length) signatures = fs;
}

// Category bias: 60% chance to draw from the category's suggested archetypes, 40% from anywhere (keeps surprise).
const catArch = cat ? archetypes.filter((x) => cat.archetypes.split(" ").includes(x.id)) : [];
const usedWorlds = new Set();
const draws = [];
for (let i = 0; i < n; i++) {
  const arch = catArch.length && r() < 0.6 ? pick(catArch, r) : pick(archetypes, r);
  let pool = collisions;
  if (a.spread) { const fresh = collisions.filter((c) => !usedWorlds.has(c.world)); if (fresh.length) pool = fresh; }
  const col = pick(pool, r); usedWorlds.add(col.world);
  draws.push({
    archetype: arch.id, archetype_name: arch.name, shape: arch.shape,
    mutation: pick(mutations, r),
    collision: col,
    kinetic: `${pick(kinetics, r).subject} ${pick(kinetics, r).verb}, driven by ${pick(kinetics, r).driver}`,
    signature_seed: pick(signatures, r),
  });
}

if (a.json) { console.log(JSON.stringify({ category: cat?.id || null, draws }, null, 2)); process.exit(0); }

console.log(`COLLISION ENGINE${cat ? ` · category: ${cat.name}` : ""}${a.seed !== undefined ? ` · seed ${a.seed}` : ""}\n`);
draws.forEach((d, i) => {
  console.log(`Draw ${i + 1}`);
  console.log(`  Archetype  : ${d.archetype_name} (${d.archetype}): ${d.shape}`);
  console.log(`  Mutation   : ${d.mutation.name}: ${d.mutation.operator}`);
  console.log(`  Collision  : ${d.collision.source} (${d.collision.world}) → steal "${d.collision.property}"`);
  console.log(`               e.g. ${d.collision.becomes}`);
  console.log(`  Kinetic    : ${d.kinetic}`);
  console.log(`  Seed move  : ${d.signature_seed.name}: ${d.signature_seed.one_line}`);
  console.log("");
});
console.log("Treat these as constraints, not answers. Combine, bend or reject them, but start from them.");
console.log("Next: write Tension → Concept with one draw, then run the Thinking Sequence (thinking/sequence.md).");
