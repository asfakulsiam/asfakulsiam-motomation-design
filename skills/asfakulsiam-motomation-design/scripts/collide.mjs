#!/usr/bin/env node
// The collision engine: real random creative constraints so no two designs start the same way.
// Usage: node scripts/collide.mjs [--n 3 | --count 3] [--spread] [--category hotel] [--seed 42] [--exclude-recent] [--json]
// Diversity: draws are taken WITHOUT replacement. Archetypes and signature seeds never repeat inside one run;
// mutations and collision worlds (with --spread) don't repeat either until their pool runs out, and the output
// says exactly when that happened. Nothing overlaps silently.
import { load, args, rng, pick } from "./lib.mjs";
import { recent } from "./memory.mjs";

const a = args();
const n = Math.max(1, Math.min(50, Number(a.count || a.n || 1)));
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

// Without-replacement picker. `key` decides what counts as "the same"; when every item is used the pool
// resets (repeats become possible) and the exhaustion is recorded so the output can say so.
const exhausted = {};
function drawer(name, all, key = (x) => x.id) {
  const used = new Set();
  return (filter = () => true) => {
    let fresh = all.filter((x) => !used.has(key(x)));
    if (!fresh.length) { (exhausted[name] ??= { pool: new Set(all.map(key)).size, at: draws.length + 1 }); used.clear(); fresh = all; }
    const prefer = fresh.filter(filter);
    const item = pick(prefer.length ? prefer : fresh, r);
    used.add(key(item));
    return item;
  };
}

// Category bias: 60% chance to draw from the category's suggested archetypes, 40% from anywhere (keeps surprise).
const catIds = cat ? cat.archetypes.split(" ") : [];
const draws = [];
const nextArch = drawer("archetypes", archetypes);
const nextSig = drawer("signature seeds", signatures);
const nextMut = drawer("mutations", mutations);
const nextCol = a.spread ? drawer("collision worlds", collisions, (c) => c.world) : drawer("collision sources", collisions, (c) => c.source);
for (let i = 0; i < n; i++) {
  const arch = nextArch(catIds.length && r() < 0.6 ? (x) => catIds.includes(x.id) : undefined);
  draws.push({
    archetype: arch.id, archetype_name: arch.name, shape: arch.shape,
    mutation: nextMut(),
    collision: nextCol(),
    kinetic: `${pick(kinetics, r).subject} ${pick(kinetics, r).verb}, driven by ${pick(kinetics, r).driver}`,
    signature_seed: nextSig(),
  });
}

// What diversity this run actually achieved (counted, not promised)
const uniq = (f) => new Set(draws.map(f)).size;
const diversity = {
  draws: n,
  archetypes: uniq((d) => d.archetype),
  signature_seeds: uniq((d) => d.signature_seed.id),
  mutations: uniq((d) => d.mutation.id),
  collision_worlds: uniq((d) => d.collision.world),
  exhausted: Object.fromEntries(Object.entries(exhausted).map(([k, v]) => [k, { pool: v.pool, repeats_from_draw: v.at }])),
};

if (a.json) { console.log(JSON.stringify({ category: cat?.id || null, diversity, draws }, null, 2)); process.exit(0); }

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
const line = (label, got, poolName) => {
  const ex = diversity.exhausted[poolName];
  return `  ${label.padEnd(17)}: ${got}/${n} unique${ex ? `  ⚠ pool of ${ex.pool} exhausted, repeats from draw ${ex.repeats_from_draw}` : got === n ? "  ✓" : ""}`;
};
console.log("Diversity (measured)");
console.log(line("archetypes", diversity.archetypes, "archetypes"));
console.log(line("signature seeds", diversity.signature_seeds, "signature seeds"));
console.log(line("mutations", diversity.mutations, "mutations"));
console.log(line(a.spread ? "collision worlds" : "collision sources", a.spread ? diversity.collision_worlds : uniq((d) => d.collision.source), a.spread ? "collision worlds" : "collision sources"));
if (a["exclude-recent"]) console.log("  (recently used archetypes and signatures were removed from the pools first)");
console.log("");
console.log("Treat these as constraints, not answers. Combine, bend or reject them, but start from them.");
console.log("Next: write Tension → Concept with one draw, then run the Thinking Sequence (thinking/sequence.md).");
