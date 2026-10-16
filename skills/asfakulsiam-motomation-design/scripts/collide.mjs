#!/usr/bin/env node
// The collision engine: random creative constraints, so designs don't all start from the model's most likely choice.
// Usage: node scripts/collide.mjs [--n 3 | --count 3] [--spread] [--category hotel] [--seed 42] [--exclude-recent] [--json]
// Diversity: draws are taken WITHOUT replacement. Archetypes and signature seeds never repeat inside one run;
// mutations and collision worlds (with --spread) don't repeat either until their pool runs out, and the output
// says exactly when that happened. Nothing overlaps silently.
import { load, args, cli, rng, pick, fingerprint, similarity, fpText, LAYOUT_FAMILY } from "./lib.mjs";
const layoutFamily = (id) => LAYOUT_FAMILY[id] || id;
import { recent } from "./memory.mjs";

const a = cli("collide", "Usage: node scripts/collide.mjs [--n 3 | --count 3] [--spread] [--category hotel] [--seed 42] [--exclude-recent] [--json]",
  { n: "value", count: "value", spread: "bool", category: "value", seed: "value", "exclude-recent": "bool", json: "bool" }, null, { pos: [0, 0] });
if ([a.n, a.count].some((v) => v !== undefined && !(Number(v) >= 1))) { console.error(`collide: --n must be a number from 1 to 50, got "${a.n ?? a.count}"\nUsage: node scripts/collide.mjs [--n 3 | --count 3] [--spread] [--category hotel] [--seed 42] [--exclude-recent] [--json]`); process.exit(2); }
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

// Layout spread: a draw prefers an archetype whose layout family (lib.mjs LAYOUT_FAMILY) is the least used so far, so
// ten draws over eight families repeat a family at most twice. Without it, four "sequence" archetypes and the
// categories that list `timeline` gave 4 of 5 diversity draws layout=sequence (evals/results/diversity/REPORT.md).
// With --exclude-recent, the layout families of the last 3 logged runs count as already used once.
const famUse = {};
if (a["exclude-recent"]) for (const e of recent(3)) { const f = (e.fingerprint && e.fingerprint.layout) || layoutFamily(e.archetype); if (f) famUse[f] = (famUse[f] || 0) + 1; }
if (a["exclude-recent"]) {
  const log = recent(5);
  const usedA = new Set(log.map((e) => e.archetype)), usedS = new Set(log.map((e) => e.signature));
  const fa = archetypes.filter((x) => !usedA.has(x.id)); if (fa.length) archetypes = fa;
  const fs = signatures.filter((x) => !usedS.has(x.id)); if (fs.length) signatures = fs;
  // collision sources logged with memory.mjs log --collision "<source>" in the last 5 runs are not drawn again
  const usedC = new Set(log.map((e) => String(e.collision || "").toLowerCase()).filter(Boolean));
  const fc = collisions.filter((c) => !usedC.has(c.source.toLowerCase())); if (fc.length) collisions = fc;
}

// Without-replacement picker. `key` decides what counts as "the same"; when every item is used the pool
// resets (repeats become possible) and the exhaustion is recorded so the output can say so.
const exhausted = {};
function drawer(name, all, key = (x) => x.id) {
  const used = new Set();
  return (filter = () => true) => {
    let fresh = all.filter((x) => !used.has(key(x)));
    if (!fresh.length) { (exhausted[name] ??= { pool: new Set(all.map(key)).size, at: draws.length + 1 }); used.clear(); fresh = all; }
    // filter: one predicate, or a list in priority order (the first that leaves any candidate wins)
    const prefer = (Array.isArray(filter) ? filter : [filter]).map((f) => fresh.filter((x) => f(x, fresh))).find((p) => p.length) || []; // f(x, pool)
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
  const useCat = catIds.length && r() < 0.6;
  const famOf = (x) => layoutFamily(x.id), use = (x) => famUse[famOf(x)] || 0, inCat = (x) => catIds.includes(x.id);
  const balanced = (x, pool) => use(x) === Math.min(...pool.map(use)); // least-used family among the archetypes still undrawn
  const arch = nextArch(useCat ? [(x, p) => inCat(x) && balanced(x, p), balanced] : [balanced]);
  famUse[famOf(arch)] = (famUse[famOf(arch)] || 0) + 1;
  draws.push({
    archetype: arch.id, archetype_name: arch.name, shape: arch.shape,
    mutation: nextMut(),
    collision: nextCol(),
    kinetic: `${pick(kinetics, r).subject} ${pick(kinetics, r).verb}, driven by ${pick(kinetics, r).driver}`,
    signature_seed: nextSig(),
  });
}

// Fallback archetype per draw: if the drawn archetype can't serve the brief, the agent takes this one instead of
// picking a favourite by hand (hand-picked overrides converge: v2 SaaS runs replaced two different draws with
// `console`). It comes from its own seeded stream, so adding it changed no existing draw. It fits the category when
// one is given, is never an archetype drawn in this run, and prefers a different layout family from its draw.
{
  const rf = rng(a.seed === undefined ? undefined : `${a.seed}:fallback`);
  const drawn = new Set(draws.map((d) => d.archetype)), allArch = load("archetypes");
  for (const d of draws) {
    const fam = layoutFamily(d.archetype);
    const pool = allArch.filter((x) => !drawn.has(x.id) && (!catIds.length || catIds.includes(x.id)));
    const other = pool.filter((x) => layoutFamily(x.id) !== fam);
    const f = (other.length ? other : pool.length ? pool : allArch.filter((x) => x.id !== d.archetype));
    const pickd = f.length ? pick(f, rf) : null;
    d.fallback = pickd ? { archetype: pickd.id, archetype_name: pickd.name, shape: pickd.shape } : null;
  }
}

// Each draw's structural fingerprint (layout family, signature type, tier). Sections and type scale come later, in
// the plan, so this is partial; it's compared against the project log so a draw that rebuilds a recent page is flagged.
const logged = recent(5), allSignatures = load("signatures");
for (const d of draws) {
  d.fingerprint = fingerprint({ archetype: d.archetype, signature: d.signature_seed.id, tier: d.signature_seed.tier }, allSignatures);
  const best = logged.map((r) => similarity(d.fingerprint, r.fingerprint || fingerprint({ archetype: r.archetype, signature: r.signature, tier: r.tier }, allSignatures)))
    .filter((x) => x.compared >= 2).sort((x, y) => y.score - x.score)[0];
  d.closest_logged = best ? best.score : null;
}

// What diversity this run actually achieved (counted, not promised)
const uniq = (f) => new Set(draws.map(f)).size;
const diversity = {
  draws: n,
  archetypes: uniq((d) => d.archetype),
  signature_seeds: uniq((d) => d.signature_seed.id),
  mutations: uniq((d) => d.mutation.id),
  collision_worlds: uniq((d) => d.collision.world),
  layouts: uniq((d) => layoutFamily(d.archetype)),
  layout_max_repeat: Math.max(0, ...Object.values(draws.reduce((m, d) => { const f = layoutFamily(d.archetype); m[f] = (m[f] || 0) + 1; return m; }, {}))),
  exhausted: Object.fromEntries(Object.entries(exhausted).map(([k, v]) => [k, { pool: v.pool, repeats_from_draw: v.at }])),
};

if (a.json) { console.log(JSON.stringify({ category: cat?.id || null, diversity, draws }, null, 2)); process.exit(0); }

console.log(`COLLISION ENGINE${cat ? ` · category: ${cat.name}` : ""}${a.seed !== undefined ? ` · seed ${a.seed}` : ""}\n`);
draws.forEach((d, i) => {
  console.log(`Draw ${i + 1}`);
  console.log(`  Archetype  : ${d.archetype_name} (${d.archetype}): ${d.shape}`);
  if (d.fallback) console.log(`  If it can't serve the brief, take: ${d.fallback.archetype_name} (${d.fallback.archetype}), not a favourite`);
  console.log(`  Mutation   : ${d.mutation.name}: ${d.mutation.operator}`);
  console.log(`  Collision  : ${d.collision.source} (${d.collision.world}) → steal "${d.collision.property}"`);
  console.log(`               e.g. ${d.collision.becomes}`);
  console.log(`               log it: memory.mjs log … --collision "${d.collision.source}"`);
  console.log(`  Kinetic    : ${d.kinetic}`);
  console.log(`  Seed move  : ${d.signature_seed.name}: ${d.signature_seed.one_line}`);
  console.log(`  Fingerprint: ${fpText(d.fingerprint)}${d.closest_logged == null ? "" : `  (closest logged run: ${Math.round(d.closest_logged * 100)}%${d.closest_logged >= 0.7 ? " ⚠ rebuilds a recent page" : ""})`}`);
  console.log("");
});
const line = (label, got, poolName) => {
  const ex = diversity.exhausted[poolName];
  return `  ${label.padEnd(17)}: ${got}/${n} unique${ex ? `  ⚠ pool of ${ex.pool} exhausted, repeats from draw ${ex.repeats_from_draw}` : got === n ? "  ✓" : ""}`;
};
console.log("Diversity (measured)");
console.log(line("archetypes", diversity.archetypes, "archetypes"));
console.log(`  layout families  : ${diversity.layouts} distinct over ${n} draw(s), at most ${diversity.layout_max_repeat} of any one  ${diversity.layout_max_repeat <= Math.ceil(n / 8) ? "✓" : "✗"}`);
console.log(line("signature seeds", diversity.signature_seeds, "signature seeds"));
console.log(line("mutations", diversity.mutations, "mutations"));
console.log(line(a.spread ? "collision worlds" : "collision sources", a.spread ? diversity.collision_worlds : uniq((d) => d.collision.source), a.spread ? "collision worlds" : "collision sources"));
if (a["exclude-recent"]) console.log("  (recently used archetypes and signatures were removed from the pools first)");
console.log("");
console.log("Treat these as constraints, not answers. Combine, bend or reject them, but start from them.");
console.log("Next: write Tension → Concept with one draw, then run the Thinking Sequence (thinking/sequence.md).");
