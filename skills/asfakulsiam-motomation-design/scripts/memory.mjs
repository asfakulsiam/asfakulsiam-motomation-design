#!/usr/bin/env node
// Project memory: remembers what this project already used, so the next design differs.
// Stored in <project>/.motomation/log.json (the current working directory).
// Usage:
//   node scripts/memory.mjs log --archetype ledger --mutation invert-axis --signature letter-relay --fonts "Fraunces/Switzer" --palette "Darkroom" --tier 5 --page home
//   node scripts/memory.mjs recent [--n 5]
//   node scripts/memory.mjs check --archetype ledger --signature letter-relay
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { args } from "./lib.mjs";

const DIR = join(process.cwd(), ".motomation");
const FILE = join(DIR, "log.json");
const FIELDS = ["page", "archetype", "mutation", "signature", "fonts", "palette", "tier", "nav", "footer", "notes"];

export function readLog() {
  if (!existsSync(FILE)) return [];
  try { return JSON.parse(readFileSync(FILE, "utf8")).runs || []; } catch { return []; }
}
export function recent(n = 5) { return readLog().slice(-n); }

function write(runs) { mkdirSync(DIR, { recursive: true }); writeFileSync(FILE, JSON.stringify({ version: 1, runs }, null, 2) + "\n"); }

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const a = args(); const cmd = a._[0];
  if (cmd === "log") {
    const entry = { date: new Date().toISOString() };
    for (const f of FIELDS) if (a[f] !== undefined && a[f] !== true) entry[f] = String(a[f]);
    if (Object.keys(entry).length === 1) { console.error("Nothing to log. Pass at least --archetype or --signature."); process.exit(1); }
    const runs = readLog(); runs.push(entry); write(runs);
    console.log(`Logged run #${runs.length} to ${FILE}`);
  } else if (cmd === "recent") {
    const runs = recent(Number(a.n || 5));
    if (!runs.length) { console.log("No runs logged yet in this project."); process.exit(0); }
    runs.forEach((r, i) => console.log(`${i + 1}. ${r.date.slice(0, 10)} · ${FIELDS.filter((f) => r[f]).map((f) => `${f}: ${r[f]}`).join(" · ")}`));
  } else if (cmd === "check") {
    const runs = recent(Number(a.n || 5)); let clash = 0;
    for (const f of FIELDS) {
      if (!a[f] || a[f] === true) continue;
      const hit = runs.filter((r) => r[f] && r[f].toLowerCase() === String(a[f]).toLowerCase());
      if (hit.length) { clash++; console.log(`✗ ${f} "${a[f]}" was used in ${hit.length} of the last ${runs.length} runs → choose another`); }
      else console.log(`✓ ${f} "${a[f]}" is fresh`);
    }
    process.exit(clash ? 2 : 0);
  } else {
    console.log("Usage: node scripts/memory.mjs <log|recent|check> [--archetype x] [--signature y] [--fonts a/b] [--palette p] [--tier n] [--page p]");
    process.exit(cmd ? 1 : 0);
  }
}
