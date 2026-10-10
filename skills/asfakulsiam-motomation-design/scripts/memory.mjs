#!/usr/bin/env node
// Project memory: remembers what this project already used, so the next design can avoid repeating it.
// Stored in <project>/.motomation/log.json (the current working directory).
// Usage:
//   node scripts/memory.mjs log --archetype ledger --mutation invert-axis --signature letter-relay --fonts "Fraunces/Switzer" --palette "Darkroom" --tier 5 --page home
//   node scripts/memory.mjs recent [--n 5]
//   node scripts/memory.mjs check --archetype ledger --signature letter-relay [--sections hero,work,contact --type-scale 1.333 --tier 2] [--threshold 0.7]
//   node scripts/memory.mjs fingerprint --archetype ledger --sections hero,work,contact --type-scale 1.333 --tier 2 --signature letter-relay
// Two checks: (1) exact IDs used in the last N runs, (2) structural fingerprint similarity (layout family, type scale,
// section order, motion tier, signature type). Deterministic and offline: no network, no models, no embeddings.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { args, load, fingerprint, similarity, mutationFor, fpText } from "./lib.mjs";

const DIR = join(process.cwd(), ".motomation");
const FILE = join(DIR, "log.json");
const FIELDS = ["page", "archetype", "mutation", "signature", "fonts", "palette", "tier", "nav", "footer", "notes"];
const FP_FLAGS = { layout: "layout", "type-scale": "type_scale", sections: "sections", "signature-type": "signature_type" }; // extra structural inputs
const THRESHOLD = 0.7;
const flagVal = (v) => (v === undefined || v === true ? undefined : String(v));
function fpFrom(src) { // works for CLI flags and for logged entries (v1 entries have no fingerprint: derive it from their IDs)
  if (src.fingerprint) return src.fingerprint;
  const o = { archetype: flagVal(src.archetype), signature: flagVal(src.signature), tier: flagVal(src.tier) };
  for (const [flag, key] of Object.entries(FP_FLAGS)) o[key] = flagVal(src[flag] ?? src[key]);
  return fingerprint(o, load("signatures"));
}

export function readLog() {
  if (!existsSync(FILE)) return [];
  try { return JSON.parse(readFileSync(FILE, "utf8")).runs || []; } catch { return []; }
}
export function recent(n = 5) { return readLog().slice(-n); }

function write(runs) { mkdirSync(DIR, { recursive: true }); writeFileSync(FILE, JSON.stringify({ version: 2, runs }, null, 2) + "\n"); }

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const a = args(); const cmd = a._[0];
  if (cmd === "log") {
    const entry = { date: new Date().toISOString() };
    for (const f of FIELDS) if (a[f] !== undefined && a[f] !== true) entry[f] = String(a[f]);
    if (Object.keys(entry).length === 1) { console.error("Nothing to log. Pass at least --archetype or --signature."); process.exit(1); }
    entry.fingerprint = fpFrom(a);
    const runs = readLog(); runs.push(entry); write(runs);
    console.log(`Logged run #${runs.length} to ${FILE}`);
    console.log(`  fingerprint: ${fpText(entry.fingerprint)}`);
  } else if (cmd === "recent") {
    const runs = recent(Number(a.n || 5));
    if (!runs.length) { console.log("No runs logged yet in this project."); process.exit(0); }
    runs.forEach((r, i) => console.log(`${i + 1}. ${r.date.slice(0, 10)} · ${FIELDS.filter((f) => r[f]).map((f) => `${f}: ${r[f]}`).join(" · ")}\n   fingerprint: ${fpText(fpFrom(r))}`));
  } else if (cmd === "check") {
    const runs = recent(Number(a.n || 5)); let clash = 0;
    console.log("IDs");
    for (const f of FIELDS) {
      if (!a[f] || a[f] === true) continue;
      const hit = runs.filter((r) => r[f] && r[f].toLowerCase() === String(a[f]).toLowerCase());
      if (hit.length) { clash++; console.log(`✗ ${f} "${a[f]}" was used in ${hit.length} of the last ${runs.length} runs → choose another`); }
      else console.log(`✓ ${f} "${a[f]}" is fresh`);
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
    console.log("Usage: node scripts/memory.mjs <log|recent|check|fingerprint> [--archetype x] [--signature y] [--fonts a/b] [--palette p] [--tier n] [--page p] [--sections a,b,c] [--type-scale 1.333] [--layout family] [--threshold 0.7]");
    process.exit(cmd ? 1 : 0);
  }
}
