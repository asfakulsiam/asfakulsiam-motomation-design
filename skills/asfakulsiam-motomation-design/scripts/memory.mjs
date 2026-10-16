#!/usr/bin/env node
// Memory across projects: remembers what every build already used, in every project, so the next design diverges.
// Stored at the USER level: $MOTOMATION_HOME/log.json, default ~/.motomation/log.json. Every build in every project
// is recorded there, with the project it came from and a short brief. `--project <dir>` keeps the old per-project log
// (<dir>/.motomation/log.json) for tests and isolated runs. A project's own legacy .motomation/log.json is still read.
// Usage:
//   node scripts/memory.mjs log --brief "bakery in Dhaka, preorders" --category restaurant --archetype ledger --palette "Paper & Vermilion"
//        --fonts "Fraunces/Switzer" --motion "scrubbed reveals" --signature letter-relay --tier 2 --page home
//   node scripts/memory.mjs recent [--n 5]
//   node scripts/memory.mjs similar --brief "<brief>" [--category c]       → prior builds with a similar brief, and what to diverge from
//   node scripts/memory.mjs check --brief "<brief>" [--category c] --archetype x --palette p --fonts a/b --motion m --signature s [--tier n --sections a,b]
//   node scripts/memory.mjs fingerprint --archetype ledger --sections hero,work,contact --type-scale 1.333 --tier 2 --signature letter-relay
// Three checks: (1) exact IDs used in the last N runs (any project), (2) structural fingerprint similarity, and
// (3) forced divergence: a prior build with a similar brief (same category, or shared brief words) must differ on all five
// of archetype, palette family, type pairing, motion language and signature move. No log yet: nothing to diverge from.
// Deterministic and offline: no network, no models, no embeddings.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve, dirname, sep, basename } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";
import { args, cli, load, fingerprint, similarity, mutationFor, fpText } from "./lib.mjs";

const SKILL_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
/** The project that owns the memory log: nearest ancestor of `start` with package.json or .git, outside the skill folder. */
export function projectRoot(start = process.cwd()) {
  let dir = resolve(start);
  if (dir === SKILL_DIR || dir.startsWith(SKILL_DIR + sep)) dir = dirname(SKILL_DIR); // never inside the skill itself
  const first = dir;
  for (;;) {
    if (existsSync(join(dir, "package.json")) || existsSync(join(dir, ".git"))) return dir;
    const up = dirname(dir);
    if (up === dir) return first; // no marker anywhere: fall back to where the walk started
    dir = up;
  }
}
const cliProject = (() => { const i = process.argv.indexOf("--project"); const eq = process.argv.find((x) => x.startsWith("--project=")); return eq ? eq.slice(10) : i > -1 ? process.argv[i + 1] : undefined; })();
/** The user-level memory folder: $MOTOMATION_HOME, else ~/.motomation. Shared by every project. */
export const userDir = () => resolve(process.env.MOTOMATION_HOME || join(homedir(), ".motomation"));
const PROJECT = projectRoot();
const DIR = cliProject ? join(resolve(cliProject), ".motomation") : userDir();
const FILE = join(DIR, "log.json");
const LEGACY = cliProject ? null : join(PROJECT, ".motomation", "log.json"); // a pre-2.9 per-project log, read but never written
export const logPath = () => FILE;
const FIELDS = ["page", "category", "archetype", "mutation", "signature", "fonts", "palette", "palette_family", "motion", "tier", "nav", "footer", "notes"];
// the five dimensions a similar brief must diverge on
export const DIVERGE = [["archetype", "archetype"], ["palette_family", "palette family"], ["fonts", "type pairing"], ["motion", "motion language"], ["signature", "signature move"]];
const FP_FLAGS = { layout: "layout", "type-scale": "type_scale", sections: "sections", "signature-type": "signature_type" }; // extra structural inputs
const THRESHOLD = 0.7;
const flagVal = (v) => (v === undefined || v === true ? undefined : String(v));
function fpFrom(src) { // works for CLI flags and for logged entries (v1 entries have no fingerprint: derive it from their IDs)
  if (src.fingerprint) return src.fingerprint;
  const o = { archetype: flagVal(src.archetype), signature: flagVal(src.signature), tier: flagVal(src.tier) };
  for (const [flag, key] of Object.entries(FP_FLAGS)) o[key] = flagVal(src[flag] ?? src[key]);
  return fingerprint(o, load("signatures"));
}

const readRuns = (f) => { if (!f || !existsSync(f)) return []; try { return JSON.parse(readFileSync(f, "utf8")).runs || []; } catch { return []; } };
export function readLog() {
  const own = readRuns(FILE);
  if (!LEGACY || resolve(LEGACY) === resolve(FILE)) return own;
  const seen = new Set(own.map((r) => r.date + (r.signature || "")));
  const legacy = readRuns(LEGACY).filter((r) => !seen.has(r.date + (r.signature || ""))).map((r) => ({ project: PROJECT, ...r }));
  return [...legacy, ...own].sort((x, y) => String(x.date).localeCompare(String(y.date)));
}

// palette family: light/dark ground × accent hue bucket (or neutral). From --palette-family, or a palettes.csv name, or --ground/--accent hexes.
const hex = (h) => { const m = /^#?([0-9a-f]{6})$/i.exec(String(h || "").trim()); if (!m) return null; const n = parseInt(m[1], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255); };
function hueBucket(rgb) {
  const [r, g, b] = rgb, mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, l = (mx + mn) / 2;
  const sat = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1)); if (sat < 0.15 || d < 0.06) return "neutral";
  let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h = (h * 60 + 360) % 360;
  return [[15, "red"], [45, "orange"], [70, "yellow"], [160, "green"], [195, "teal"], [255, "blue"], [290, "purple"], [345, "pink"], [360, "red"]].find(([e]) => h < e)[1];
}
export function paletteFamily({ palette_family, "palette-family": pf, palette, ground, accent } = {}) {
  const given = flagVal(palette_family ?? pf); if (given) return given.toLowerCase();
  let g = hex(ground), a = hex(accent);
  if ((!g || !a) && palette) { const row = load("palettes").find((p) => p.name && p.name.toLowerCase() === String(palette).toLowerCase()); if (row) { g = g || hex(row.ground); a = a || hex(row.accent); } }
  if (!g || !a) return undefined;
  const lum = 0.2126 * g[0] + 0.7152 * g[1] + 0.0722 * g[2];
  return `${lum < 0.5 ? "dark" : "light"}-${hueBucket(a)}`;
}
// brief similarity: same category, or ≥ 30% shared content words (Jaccard). Deterministic.
const STOP = new Set("the and for with from that this into your our you are was were will site page website build make design new one two a an of to in on at by is it be as or we us me my".split(" "));
const words = (t) => new Set(String(t || "").toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((w) => w.length > 2 && !STOP.has(w)));
export function briefSimilarity(a, b) {
  const A = words(a.brief), B = words(b.brief); const inter = [...A].filter((w) => B.has(w)).length; const uni = new Set([...A, ...B]).size;
  const jac = uni ? inter / uni : 0; const cat = !!(a.category && b.category && String(a.category).toLowerCase() === String(b.category).toLowerCase());
  return { jac, cat, similar: cat || jac >= 0.3, shared: [...A].filter((w) => B.has(w)).slice(0, 6) };
}
export function similarRuns(q, runs = readLog()) { return runs.map((r, i) => ({ n: i + 1, r, ...briefSimilarity(q, r) })).filter((x) => x.similar && (q.brief || q.category)); }
export function recent(n = 5) { return readLog().slice(-n); }

function write(runs) { mkdirSync(DIR, { recursive: true }); writeFileSync(FILE, JSON.stringify({ version: 2, runs }, null, 2) + "\n"); }

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const a = cli("memory", "Usage: node scripts/memory.mjs <log|recent|similar|check|fingerprint> [--brief \"…\"] [--category c] [--motion m] [--archetype x] [--signature y] [--fonts a/b] [--palette p] [--tier n] [--page p] [--sections a,b,c] [--type-scale 1.333] [--layout family] [--threshold 0.7] [--project <dir>]",
    Object.fromEntries([...FIELDS, "sections", "type-scale", "layout", "threshold", "project", "n", "url"].concat(["brief", "palette-family", "ground", "accent"]).map((k) => [k, "value"]).concat([["json", "bool"]])), null, { pos: [0, 1] }); const cmd = a._[0];
  if (cmd === "log") {
    const entry = { date: new Date().toISOString() };
    for (const f of FIELDS) if (a[f] !== undefined && a[f] !== true) entry[f] = String(a[f]);
    if (Object.keys(entry).length === 1) { console.error("Nothing to log. Pass at least --archetype or --signature."); process.exit(1); }
    entry.project = cliProject ? resolve(cliProject) : PROJECT;
    if (flagVal(a.brief)) entry.brief = String(a.brief).slice(0, 400);
    const fam = paletteFamily(a); if (fam) entry.palette_family = fam;
    entry.fingerprint = fpFrom(a);
    const runs = readLog(); runs.push(entry); write(runs);
    console.log(`Logged run #${runs.length} to ${FILE}`);
    console.log(`  fingerprint: ${fpText(entry.fingerprint)}`);
  } else if (cmd === "recent") {
    const runs = recent(Number(a.n || 5));
    if (!runs.length) { console.log(`No runs logged yet (${FILE}).`); process.exit(0); }
    console.log(`Log: ${FILE}`);
    runs.forEach((r, i) => console.log(`${i + 1}. ${r.date.slice(0, 10)}${r.project ? ` · project: ${basename(r.project)}` : ""} · ${FIELDS.filter((f) => r[f]).map((f) => `${f}: ${r[f]}`).join(" · ")}\n   fingerprint: ${fpText(fpFrom(r))}`));
  } else if (cmd === "similar") {
    const all = readLog();
    if (!all.length) { console.log(`No log yet (${FILE}): first build, no divergence required.`); process.exit(0); }
    if (!flagVal(a.brief) && !flagVal(a.category)) { console.error("Pass --brief \"<the brief>\" and/or --category <c>."); process.exit(2); }
    const hits = similarRuns({ brief: a.brief, category: a.category }, all);
    console.log(`Log: ${FILE} (${all.length} runs, all projects)`);
    if (!hits.length) { console.log("✓ no prior build with a similar brief: no forced divergence"); process.exit(0); }
    for (const h of hits) {
      console.log(`✗ similar to run #${h.n} (${h.r.date?.slice(0, 10)}${h.r.project ? `, ${basename(h.r.project)}` : ""}): ${h.cat ? "same category" : ""}${h.cat && h.shared.length ? "; " : ""}${h.shared.length ? `shared: ${h.shared.join(", ")} (${Math.round(h.jac * 100)}%)` : ""}`);
      for (const [k, label] of DIVERGE) console.log(`    diverge from ${label}: ${h.r[k] || "(not logged)"}`);
    }
    console.log("  → every one of the five must differ; write what you are diverging from in DESIGN.md under Divergence");
  } else if (cmd === "check") {
    const runs = recent(Number(a.n || 5)); let clash = 0;
    console.log("IDs");
    for (const f of FIELDS) {
      if (f === "category" || !a[f] || a[f] === true) continue; // the category is context, not a choice to avoid
      const hit = runs.filter((r) => r[f] && r[f].toLowerCase() === String(a[f]).toLowerCase());
      if (hit.length) { clash++; console.log(`✗ ${f} "${a[f]}" was used in ${hit.length} of the last ${runs.length} runs → choose another`); }
      else console.log(`✓ ${f} "${a[f]}" is fresh`);
    }
    // Forced divergence: a prior build with a similar brief must differ on all five dimensions
    if (flagVal(a.brief) || flagVal(a.category)) {
      const hits = similarRuns({ brief: a.brief, category: a.category }); const mineD = { archetype: flagVal(a.archetype), palette_family: paletteFamily(a), fonts: flagVal(a.fonts), motion: flagVal(a.motion), signature: flagVal(a.signature) };
      console.log("Divergence (similar briefs, all projects)");
      if (!readLog().length) console.log("  · no log yet: first build, no divergence required");
      else if (!hits.length) console.log("  ✓ no prior build with a similar brief");
      for (const h of hits) for (const [k, label] of DIVERGE) {
        if (!mineD[k]) { console.log(`  · ${label}: not given (pass --${k === "palette_family" ? "palette or --palette-family" : k}) · run #${h.n} used ${h.r[k] || "?"}`); continue; }
        if (h.r[k] && h.r[k].toLowerCase() === mineD[k].toLowerCase()) { clash++; console.log(`  ✗ ${label} "${mineD[k]}" repeats run #${h.n} (similar brief) → diverge`); }
        else console.log(`  ✓ ${label} "${mineD[k]}" differs from run #${h.n}${h.r[k] ? ` (${h.r[k]})` : ""}`);
      }
    }
    // Structural check: same page in different words still counts as a repeat
    const mine = fpFrom(a), limit = Number(a.threshold || THRESHOLD);
    console.log(`Structure  (fingerprint: ${fpText(mine)})`);
    const offset = readLog().length - runs.length;
    const scored = runs.map((r, i) => ({ n: offset + i + 1, r, ...similarity(mine, fpFrom(r)) })).filter((x) => x.compared >= 2);
    if (Object.keys(mine).length < 2) console.log("  · not enough structure to compare: pass at least two of --archetype/--layout, --sections, --type-scale, --tier, --signature");
    else if (!scored.length) console.log("  · no logged run to compare with");
    else {
      const worst = scored.sort((x, y) => y.score - x.score)[0];
      const same = Object.entries(worst.dims).filter(([, s]) => s >= 0.75).map(([k]) => k);
      if (worst.score >= limit) {
        clash++;
        const fix = mutationFor(worst.dims, [String(a.mutation || ""), String(worst.r.mutation || "")]);
        const m = fix && load("mutations").find((x) => x.id === fix.mutation);
        console.log(`✗ ${Math.round(worst.score * 100)}% structural overlap with run #${worst.n} (${worst.r.archetype || "?"}${worst.r.page ? ", " + worst.r.page : ""}) ≥ ${Math.round(limit * 100)}%. Same: ${same.join(", ")}`);
        if (m) console.log(`  → offer a mutation on ${fix.dimension}: ${m.name} (${m.id}): ${m.operator}`);
      } else console.log(`✓ closest logged run is #${worst.n} at ${Math.round(worst.score * 100)}% (< ${Math.round(limit * 100)}%)${same.length ? `; shared: ${same.join(", ")}` : ""}`);
    }
    process.exit(clash ? 2 : 0);
  } else if (cmd === "fingerprint") {
    const fp = fpFrom(a); console.log(fpText(fp)); if (a.json) console.log(JSON.stringify(fp));
  } else {
    console.log("Usage: node scripts/memory.mjs <log|recent|similar|check|fingerprint> [--brief \"…\"] [--category c] [--motion m] [--archetype x] [--signature y] [--fonts a/b] [--palette p] [--tier n] [--page p] [--sections a,b,c] [--type-scale 1.333] [--layout family] [--threshold 0.7] [--project <dir>]");
    process.exit(cmd ? 1 : 0);
  }
}
