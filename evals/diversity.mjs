#!/usr/bin/env node
// Diversity arm (permanent benchmark arm since v2.11; every version re-runs it).
//
// Five deliberately unrelated briefs (evals/briefs/diversity/*.md: funeral home, children's dentistry, hardcore metal
// band, luxury perfume, municipal water authority) are each built through the skill, and the five builds are compared
// on the six originality axes of scripts/originality.mjs (structure, composition, image, typography, interaction,
// signature). Unrelated briefs must not come out as the same site: every pair must stay below 0.4 on every axis.
//
//   node evals/diversity.mjs [compare] [--results <dir>] [--gate] [--threshold 0.4]
//       compare the builds in <dir>/<brief slug>/ (default evals/results/diversity); writes <dir>/matrix.json and
//       <dir>/matrix.md (Measured / Judged / Not verified). --gate also runs scripts/gate.mjs on every build and
//       saves <dir>/<slug>/gate.txt (3 to 6 minutes per build).
//   node evals/diversity.mjs generate --out <run dir> [--claude <path>] [--route light|full] [--max-turns 120]
//       the full arm: a fresh agent (Claude Code, -p, stream-json) builds every brief with the skill installed, in
//       <run dir>/<slug>/work/; transcript.jsonl and cost.json (scripts/cost.mjs) per build; then compare on <run dir>.
//       This spends model tokens. It is never run by CI or by compare.
//
// Exit codes: 0 every pair below the threshold on every axis · 1 at least one repeat · 2 usage · 3 not verified
// (no browser, or fewer than two builds found).
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, cpSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SKILL = join(ROOT, "skills/asfakulsiam-motomation-design");
const BRIEFS_DIR = join(ROOT, "evals/briefs/diversity");
const AXES = ["structure", "composition", "image", "typography", "interaction", "signature"];
const argv = process.argv.slice(2); const cmd = argv[0] && !argv[0].startsWith("--") ? argv.shift() : "compare";
const flags = {}; for (let i = 0; i < argv.length; i++) { const a = argv[i]; if (!a.startsWith("--")) continue; const k = a.slice(2); const v = argv[i + 1]; if (v === undefined || v.startsWith("--")) flags[k] = true; else { flags[k] = v; i++; } }
const THRESHOLD = Number(flags.threshold || 0.4);

export const briefs = () => readdirSync(BRIEFS_DIR).filter((f) => /^\d+-.*\.md$/.test(f)).sort().map((f) => {
  const text = readFileSync(join(BRIEFS_DIR, f), "utf8");
  return { slug: f.slice(0, -3), file: f, text, title: (text.match(/^# Diversity brief \d+: (.+)$/m) || [])[1] || f, seed: Number((text.match(/Seed: (\d+)/) || [])[1]) || null, category: ((text.match(/^Category: ([a-z-]+)/m) || [])[1]) || null };
});
const label = (b) => b.slug.replace(/^\d+-/, "");

function compare(dir) {
  const all = briefs(); const found = all.filter((b) => existsSync(join(dir, b.slug, "index.html"))); const missing = all.filter((b) => !found.includes(b));
  const nv = missing.map((b) => `- ${b.slug}: no build at ${join(dir, b.slug)}/index.html`);
  if (found.length < 2) { console.log(`not verified: ${found.length} build(s) found in ${dir}; need at least two`); return finish(dir, null, found, nv, 3); }
  const t0 = Date.now();
  const r = spawnSync(process.execPath, [join(SKILL, "scripts/originality.mjs"), ...found.map((b) => join(dir, b.slug)), "--json", "--labels", found.map(label).join(","), "--threshold", String(THRESHOLD)], { cwd: ROOT, encoding: "utf8", maxBuffer: 64 << 20, timeout: 20 * 60e3 });
  let rep = null; try { rep = JSON.parse(r.stdout); } catch {}
  if (!rep) { nv.push(`- originality.mjs printed no report (exit ${r.status}): ${(r.stdout || r.stderr || "").trim().split("\n")[0]}`); return finish(dir, null, found, nv, 3); }
  rep.seconds = Math.round((Date.now() - t0) / 1000);
  if (flags.gate) for (const b of found) {
    const g = spawnSync(process.execPath, [join(SKILL, "scripts/gate.mjs"), join(dir, b.slug)], { cwd: ROOT, encoding: "utf8", maxBuffer: 64 << 20, timeout: 15 * 60e3 });
    writeFileSync(join(dir, b.slug, "gate.txt"), `$ node skills/asfakulsiam-motomation-design/scripts/gate.mjs ${join(dir, b.slug)}\n${g.stdout}${g.stderr}\n(exit ${g.status})\n`);
    console.log(`gate ${b.slug}: exit ${g.status}`);
  }
  return finish(dir, rep, found, nv, rep.pass ? 0 : 1);
}

function finish(dir, rep, found, nv, code) {
  mkdirSync(dir, { recursive: true });
  const json = { schema: "motomation-diversity/1", threshold: THRESHOLD, briefs: briefs().map(({ text, ...b }) => ({ ...b, built: found.some((f) => f.slug === b.slug) })), report: rep, not_verified: nv, exit: code };
  writeFileSync(join(dir, "matrix.json"), JSON.stringify(json, null, 1) + "\n");
  const f = (x) => (x == null ? "n/a" : x.toFixed(2)); // n/a: the axis does not apply to that pair (originality.mjs)
  const md = ["# Diversity arm: similarity matrix", "", `Five unrelated briefs (evals/briefs/diversity/), one build each, compared by scripts/originality.mjs at 1440×900 on six axes. 0 = nothing shared, 1 = the same. Every axis of every pair must stay below ${THRESHOLD}; ✗ marks a repeat. Written by \`node evals/diversity.mjs\`.`, "", "## Measured", ""];
  if (rep) {
    md.push(`Tool: scripts/originality.mjs (${rep.seconds}s). Result: ${rep.pass ? "PASS, no pair repeats on any axis" : `FAIL, ${rep.pairs.filter((p) => p.over.length).length} of ${rep.pairs.length} pairs repeat on at least one axis`}.`, "");
    md.push(`| Pair | ${AXES.join(" | ")} | overall |`, `|---|${AXES.map(() => "---:").join("|")}|---:|`);
    for (const p of rep.pairs) md.push(`| ${p.a} × ${p.b} | ${AXES.map((a) => f(p.score[a]) + (p.score[a] >= THRESHOLD ? " ✗" : "")).join(" | ")} | ${f(p.score.overall)} |`);
    md.push("", "Per axis, the five builds against each other (rows × columns):", "");
    for (const ax of [...AXES, "overall"]) {
      const L = rep.labels; md.push(`**${ax}** (max ${f(rep.max[ax])})`, "", `| | ${L.join(" | ")} |`, `|---|${L.map(() => "---:").join("|")}|`);
      for (const a of L) md.push(`| ${a} | ${L.map((b) => { if (a === b) return "1.00"; const p = rep.pairs.find((q) => (q.a === a && q.b === b) || (q.a === b && q.b === a)); return f(p?.score[ax]) + (p && p.score[ax] >= THRESHOLD ? " ✗" : ""); }).join(" | ")} |`);
      md.push("");
    }
  } else md.push("No measurement (see Not verified).", "");
  md.push("## Judged", "", "none in this file: it is measurement only. The judged reading of these numbers, where the system avoids repetition and where it fails, is REPORT.md.", "", "## Not verified", "", ...(nv.length ? nv : ["none"]), "");
  writeFileSync(join(dir, "matrix.md"), md.join("\n"));
  console.log(`wrote ${join(dir, "matrix.json")} and matrix.md · exit ${code}`);
  return code;
}

async function generate(out) {
  // a fresh agent per brief, the skill installed as a Claude Code skill in its working folder; nothing is shared between briefs
  const { costRecord } = await import(join(SKILL, "scripts/cost.mjs"));
  const route = flags.route ? `--route=${flags.route} ` : "";
  for (const b of briefs()) {
    const dir = join(out, b.slug), work = join(dir, "work"); mkdirSync(join(work, ".claude/skills"), { recursive: true });
    cpSync(SKILL, join(work, ".claude/skills/asfakulsiam-motomation-design"), { recursive: true });
    writeFileSync(join(work, "BRIEF.md"), b.text.replace(/^\*\*Expect:\*\*.*$\n?/m, ""));
    const prompt = `Use the asfakulsiam-motomation-design skill: /build ${route}this brief. Approve every checkpoint. When you run the collision engine, use --seed ${b.seed}. The brief is in BRIEF.md. Build the site in this folder, with index.html at its root, and run the Delivery Gate before you finish.`;
    writeFileSync(join(dir, "prompt.txt"), prompt); const t0 = Date.now();
    const chunks = []; const code = await new Promise((res) => { const p = spawn(flags.claude || "claude", ["-p", prompt, "--output-format", "stream-json", "--verbose", "--max-turns", String(flags["max-turns"] || 120), "--permission-mode", "acceptEdits"], { cwd: work });
      p.stdout.on("data", (d) => chunks.push(d)); p.stderr.on("data", (d) => process.stderr.write(d)); p.on("close", res); p.on("error", () => res(127)); });
    writeFileSync(join(dir, "transcript.jsonl"), Buffer.concat(chunks)); writeFileSync(join(dir, "run.json"), JSON.stringify({ brief: b.slug, seed: b.seed, exit: code, elapsed_ms: Date.now() - t0, route: flags.route || null }, null, 1));
    writeFileSync(join(dir, "cost.json"), JSON.stringify(costRecord(dir), null, 1));
    if (existsSync(join(work, "index.html"))) cpSync(work, dir, { recursive: true, filter: (s) => !s.includes("/.claude/") && !s.includes("node_modules") });
    console.log(`${b.slug}: agent exit ${code}, ${Math.round((Date.now() - t0) / 1000)}s`);
  }
  return compare(out);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (flags.help || !["compare", "generate"].includes(cmd)) { console.log(readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").slice(1, 19).map((l) => l.replace(/^\/\/ ?/, "")).join("\n")); process.exit(flags.help ? 0 : 2); }
  if (cmd === "generate") { if (!flags.out) { console.log("generate needs --out <run dir> (it spends model tokens; never pointed at the published arm)"); process.exit(2); } process.exit(await generate(resolve(flags.out))); }
  process.exit(compare(resolve(flags.results || join(ROOT, "evals/results/diversity"))));
}
