#!/usr/bin/env node
// Restores the frame sequences of the Tier 5 templates. The sequences (frames/, frames-mobile/) and film.mp4 are not
// on main, so the skill installs in seconds: each Tier 5 template ships poster.webp (first paint, no-JS image),
// storyboard/ (reduced motion), frames.json (the manifest) and frames.lock.json (where the sequence lives and its
// sha256). This script downloads the tarball named in the lock, checks the sha256, and unpacks it into the template.
//
//   node scripts/fetch-frames.mjs                    every Tier 5 template that has a frames.lock.json
//   node scripts/fetch-frames.mjs <id> [<id> …]      only these templates (folder names under examples/templates/)
//   node scripts/fetch-frames.mjs --check            no network: report which templates have their frames locally
//   node scripts/fetch-frames.mjs --force            download again even when frames/ already matches frames.json
//
// Run from the skill folder or the repository root. Zero dependencies: Node 18+ fetch, and the system `tar`
// (present on Linux, macOS and Windows 10+). Offline, rebuild the frames instead with scripts/build-frames.mjs.
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const USAGE = "Usage: node scripts/fetch-frames.mjs [<template-id> …] [--check] [--force]";
const die = (msg, code = 2) => { console.error(`fetch-frames: ${msg}\n${USAGE}`); process.exit(code); };
const TPL = fileURLToPath(new URL("../examples/templates/", import.meta.url));

export function lockedTemplates(dir = TPL) {
  return readdirSync(dir).filter((d) => existsSync(join(dir, d, "frames.lock.json"))).sort();
}
// how many desktop frames are on disk, and does that match frames.json
export function localState(id, dir = TPL) {
  const own = join(dir, id); const count = (d) => (existsSync(join(own, d)) ? readdirSync(join(own, d)).filter((f) => /\.(webp|avif|jpe?g|png)$/.test(f)).length : 0);
  let want = null; try { want = JSON.parse(readFileSync(join(own, "frames.json"), "utf8")).desktop.frames; } catch {}
  const desktop = count("frames"), mobile = count("frames-mobile");
  return { desktop, mobile, want, complete: want !== null && desktop === want };
}

async function fetchOne(id, force) {
  const own = join(TPL, id); const lock = JSON.parse(readFileSync(join(own, "frames.lock.json"), "utf8"));
  const st = localState(id);
  if (st.complete && !force) { console.log(`· ${id}: frames/ already has ${st.desktop} frames (frames.json: ${st.want}); --force to fetch again`); return true; }
  process.stdout.write(`↓ ${id}: ${lock.url} … `);
  let res; try { res = await fetch(lock.url); } catch (e) { console.log("failed"); console.error(`  network error: ${e.message}. Offline? Rebuild with scripts/build-frames.mjs (see ${id}/DESIGN.md).`); return false; }
  if (!res.ok) { console.log(`HTTP ${res.status}`); return false; }
  const buf = Buffer.from(await res.arrayBuffer()); const sha = createHash("sha256").update(buf).digest("hex");
  if (sha !== lock.sha256) { console.log("sha256 mismatch"); console.error(`  expected ${lock.sha256}\n  received ${sha}\n  nothing was unpacked`); return false; }
  const tmp = mkdtempSync(join(tmpdir(), "frames-")); const tgz = join(tmp, "frames.tar.gz"); writeFileSync(tgz, buf);
  const t = spawnSync("tar", ["-xzf", tgz, "-C", own], { stdio: "pipe" }); rmSync(tmp, { recursive: true, force: true });
  if (t.status !== 0) { console.log("tar failed"); console.error(`  ${String(t.stderr || t.error).trim()}`); return false; }
  const after = localState(id);
  console.log(`${(buf.length / 1048576).toFixed(1)} MB, sha256 ok, ${after.desktop} + ${after.mobile} frames`);
  if (!after.complete) { console.error(`  frames/ has ${after.desktop} frames but frames.json says ${after.want}`); return false; }
  return true;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const argv = process.argv.slice(2); const flags = new Set(argv.filter((a) => a.startsWith("-")));
  for (const f of flags) if (!["--check", "--force", "--help", "-h"].includes(f)) die(`unknown flag ${f}`);
  if (flags.has("--help") || flags.has("-h")) { console.log(USAGE); process.exit(0); }
  const all = lockedTemplates(); const ids = argv.filter((a) => !a.startsWith("-"));
  for (const id of ids) if (!all.includes(id)) die(`"${id}" is not a Tier 5 template with a frames.lock.json (have: ${all.join(", ") || "none"})`);
  const pick = ids.length ? ids : all;
  if (flags.has("--check")) {
    let ok = true; for (const id of pick) { const s = localState(id); ok &&= s.complete; console.log(`${s.complete ? "✓" : "✗"} ${id}: ${s.desktop}/${s.want} desktop, ${s.mobile} mobile frames on disk`); }
    process.exit(ok ? 0 : 1);
  }
  let ok = true; for (const id of pick) ok = (await fetchOne(id, flags.has("--force"))) && ok;
  process.exit(ok ? 0 : 1);
}
