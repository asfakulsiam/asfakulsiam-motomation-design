// Content-addressed cache for the benchmark's generate phase (v2.5.0, C8).
//
// A generated run is a pure function of five things: the brief as sent, the seed, the arm, the skill tree under test
// and the model. The cache key is sha256 over exactly those five, so a rerun that changes none of them reuses the
// stored output instead of calling the agent again, and a change to any one of them (one edited skill file, another
// model, a matched arm with a different turn budget) misses. Nothing else is read: no timestamps, no paths.
//
//   key = sha256(JSON.stringify(["motomation-bench-cache/1", brief, seed, arm, skillTreeHash, model]))
//   <cacheDir>/<key[0..2]>/<key>/   the run folder as the agent left it (index.html, run.json, transcript.jsonl, prompt.txt, …)
//                                   plus cache.json { key, parts } so an entry says what produced it
//
// The runner only caches runs that finished (exit 0 and an index.html) and only when the model is pinned: an unpinned
// model is whatever the adapter defaults to that day, so it cannot be part of a key (pass --cache-unpinned to accept that).
import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

export const CACHE_SCHEMA = "motomation-bench-cache/1";
const SKIP = new Set(["node_modules", ".motomation", ".git", ".DS_Store"]);

/** sha256 of a folder: every file's relative path (forward slashes) and bytes, in sorted order. */
export function skillTreeHash(dir) {
  const files = [];
  const walk = (d) => { for (const e of readdirSync(d, { withFileTypes: true })) { if (SKIP.has(e.name)) continue; const p = join(d, e.name); e.isDirectory() ? walk(p) : e.isFile() && files.push(p); } };
  walk(dir);
  const h = createHash("sha256");
  for (const f of files.map((f) => [relative(dir, f).split(sep).join("/"), f]).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) {
    h.update(f[0]); h.update("\0"); h.update(readFileSync(f[1])); h.update("\0");
  }
  return h.digest("hex");
}

/** The cache key. All five parts are required; a missing one is an error, not a silent wildcard. */
export function cacheKey({ brief, seed, arm, skillHash, model }) {
  for (const [k, v] of Object.entries({ brief, seed, arm, skillHash, model })) if (v === undefined || v === null || v === "") throw new Error(`cacheKey: ${k} is required`);
  return createHash("sha256").update(JSON.stringify([CACHE_SCHEMA, String(brief), Number(seed), String(arm), String(skillHash), String(model)])).digest("hex");
}

export const entryDir = (cacheDir, key) => join(cacheDir, key.slice(0, 2), key);

/** Restore a cached run into `dest` (replacing it). Returns the entry's cache.json, or null on a miss. */
export function cacheLookup(cacheDir, key, dest) {
  const e = entryDir(cacheDir, key);
  if (!existsSync(join(e, "cache.json")) || !existsSync(join(e, "run.json"))) return null;
  rmSync(dest, { recursive: true, force: true }); mkdirSync(dest, { recursive: true });
  for (const f of readdirSync(e)) if (f !== "cache.json") cpSync(join(e, f), join(dest, f), { recursive: true });
  return JSON.parse(readFileSync(join(e, "cache.json"), "utf8"));
}

/** Store a finished run folder under its key. Written to a temp folder and renamed, so a half-written entry is never read. */
export function cacheStore(cacheDir, key, src, parts = {}) {
  const e = entryDir(cacheDir, key); if (existsSync(join(e, "cache.json"))) return false;
  const tmp = `${e}.tmp-${process.pid}`; rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp, { recursive: true });
  for (const f of readdirSync(src)) if (statSync(join(src, f)).isFile() || statSync(join(src, f)).isDirectory()) cpSync(join(src, f), join(tmp, f), { recursive: true });
  const { brief, ...rest } = parts; // the brief is long; store its hash, the key already depends on the full text
  writeFileSync(join(tmp, "cache.json"), JSON.stringify({ schema: CACHE_SCHEMA, key, stored: new Date().toISOString(), parts: { ...rest, brief_sha256: brief ? createHash("sha256").update(String(brief)).digest("hex") : null } }, null, 1));
  mkdirSync(join(e, ".."), { recursive: true }); rmSync(e, { recursive: true, force: true }); renameSync(tmp, e); return true;
}
