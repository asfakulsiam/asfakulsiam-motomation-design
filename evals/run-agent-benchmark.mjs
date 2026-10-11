#!/usr/bin/env node
// Agent benchmark: the five benchmark briefs, run inside a real coding agent (Claude Code CLI), with and without
// the skill, n seeds per brief, blind-judged by a model from another family, hard gates applied from measurements.
//
//   node evals/run-agent-benchmark.mjs generate --out evals/results/<date>-benchmark-v2 [--n 3] [--parallel 4] [--only studio]
//   node evals/run-agent-benchmark.mjs measure  --out …        screenshots, axe-core, keyboard, scripts/gate.mjs → checks.json
//   node evals/run-agent-benchmark.mjs judge    --out … --judge-cmd "<cmd {model} {prompt} {images}>" [--models gpt_5_4,gemini_3_1_pro]
//   node evals/run-agent-benchmark.mjs score    --out …        summary.json (+ per-brief verdicts)
//   --arms baseline,gated,skill   third arm "gated": the baseline prompt + scripts/gate.mjs (tool only, no skill docs)
//   --pairs baseline:skill,gated:skill,baseline:gated   which pairs judge/score compare (default baseline:skill)
//   --only portfolio,launch,festival --tier 4|5          the motion-heavy briefs at a forced tier
//
// generate: each run gets a fresh folder. Skill runs get the skill copied into .claude/skills/ (how Claude Code installs
// project skills) and are asked to use it with a per-brief seed for the collision engine. Baseline runs get the same
// tools, permissions and brief, without the skill. Claude Code is run with --output-format stream-json; the full
// transcript is kept next to the output. Point Claude Code at any Anthropic-compatible endpoint with ANTHROPIC_BASE_URL.
// Permissions are an explicit allowlist (file tools + node/ls/cat/mkdir/wc), never --dangerously-skip-permissions.
// measure needs Playwright (+ axe-core for the axe numbers). judge shells out to --judge-cmd, which must print the
// judge's JSON reply; the prompt and image list are written to files so any model or provider can be plugged in.
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, cpSync, rmSync, readdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), "..");
const SKILL = join(ROOT, "skills/asfakulsiam-motomation-design");
export const BRIEFS = {
  studio: { file: "07-architecture-studio.md", seeds: [7101, 7102, 7103], primary: /contact|enquir|email|studio@/i },
  hotel: { file: "04-boutique-hotel.md", seeds: [4101, 4102, 4103], primary: /availab|book/i },
  ecommerce: { file: "03-ceramics-shop.md", seeds: [3101, 3102, 3103], primary: /\badd\b|buy/i },
  saas: { file: "02-dev-tool-landing.md", seeds: [2101, 2102, 2103], primary: /install|get started|start free|try|pricing/i },
  public: { file: "05-climate-nonprofit.md", seeds: [5101, 5102, 5103], primary: /donat|দান/i },
  // motion-heavy briefs, run with --tier 4 or 5 (never run before v2.2.0)
  portfolio: { file: "01-motion-designer-portfolio.md", seeds: [1101, 1102, 1103], primary: /contact|email|mailto|hire/i, motion: true },
  launch: { file: "06-product-launch.md", seeds: [6101, 6102, 6103], primary: /pre-?order|buy|reserve/i, motion: true },
  festival: { file: "08-music-festival.md", seeds: [8101, 8102, 8103], primary: /ticket|buy/i, motion: true },
};
const AX = ["Concept", "Originality", "Typography", "Motion", "Craft", "Access & performance"];
const W = { Concept: 20, Originality: 20, Typography: 15, Motion: 15, Craft: 15, "Access & performance": 15 }; // evals/rubric.md

const argv = process.argv.slice(2); const phase = argv[0]; const flags = {};
for (let i = 1; i < argv.length; i++) if (argv[i].startsWith("--")) flags[argv[i].slice(2)] = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true;
const OUT = resolve(flags.out || join(ROOT, `evals/results/${new Date().toISOString().slice(0, 10)}-benchmark-v2`));
const N = +(flags.n || 3);
const only = flags.only ? String(flags.only).split(",") : Object.keys(BRIEFS).filter((k) => !BRIEFS[k].motion); // the v2 set by default
// Arms: baseline (no skill), gated (baseline + the measured gate script only, no skill docs), skill. Default keeps v2's two arms.
export const ARMS = ["baseline", "gated", "skill"];
const arms = String(flags.arms || "baseline,skill").split(",").filter((a) => ARMS.includes(a));
const TIER = flags.tier !== undefined ? +flags.tier : null; // force a motion tier (all arms are told the same tier)
const runs = () => only.flatMap((slug) => BRIEFS[slug].seeds.slice(0, N).flatMap((seed) => arms.map((cond) => ({ slug, seed, cond, dir: join(OUT, slug, `${cond}-s${seed}`) }))));

const TASK = "Build the website described in the brief below as a single self-contained index.html in the current folder (inline CSS and JS, no build step; Google Fonts/Fontshare and the GSAP CDN are allowed, no image URLs). Use only facts from the brief.";
export function promptFor({ slug, seed, cond }) {
  const brief = readFileSync(join(ROOT, "evals/briefs", BRIEFS[slug].file), "utf8");
  const tier = TIER === null ? "" : ` Build it at motion Tier ${TIER} (${TIER >= 5 ? "scroll-driven film: pinned, scrubbed sequences; WebGL allowed" : "signature scroll motion: pinned or scrubbed sections"}), with a reduced-motion version that keeps all content.`;
  if (cond === "baseline") return `You are an expert web designer and front-end developer. ${TASK}${tier} Check your work before you finish.\n\n${brief}`;
  // gated = the baseline prompt plus the same measured gate the skill uses, without any of the skill's knowledge
  if (cond === "gated") return `You are an expert web designer and front-end developer. ${TASK}${tier} Before you finish, run \`node gate/gate.mjs index.html\` and fix every failure it reports until it prints PASS (if it prints "not verified", say so).\n\n${brief}`;
  return `Use the asfakulsiam-motomation-design skill: /build this brief. When you run the collision engine, use --seed ${seed}.${tier ? ` Force the motion tier: --tier=${TIER}.` : ""} ${TASK} Follow the skill end to end, including its Delivery Gate, and finish with the handoff.\n\n${brief}`;
}
const ALLOWED = ["Skill", "Read", "Write", "Edit", "Glob", "Grep", "TodoWrite", "Bash(node:*)", "Bash(ls:*)", "Bash(cat:*)", "Bash(mkdir:*)", "Bash(wc:*)"];

function runAgent(r) {
  return new Promise((ok) => {
    rmSync(r.dir, { recursive: true, force: true }); mkdirSync(r.dir, { recursive: true });
    if (r.cond === "skill") cpSync(SKILL, join(r.dir, ".claude/skills/asfakulsiam-motomation-design"), { recursive: true });
    if (r.cond === "gated") { mkdirSync(join(r.dir, "gate")); for (const f of ["gate.mjs", "memory.mjs", "lib.mjs"]) cpSync(join(SKILL, "scripts", f), join(r.dir, "gate", f)); } // the tool, not the docs
    const prompt = promptFor(r); writeFileSync(join(r.dir, "prompt.txt"), prompt);
    const t0 = Date.now();
    const p = spawn(flags.claude || "claude", ["-p", prompt, "--output-format", "stream-json", "--verbose", "--max-turns", String(flags["max-turns"] || 80), "--permission-mode", "acceptEdits", "--allowedTools", ...ALLOWED],
      { cwd: r.dir, env: { ...process.env, CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1", DISABLE_TELEMETRY: "1" }, stdio: ["ignore", "pipe", "pipe"] });
    const chunks = []; p.stdout.on("data", (d) => chunks.push(d)); let err = ""; p.stderr.on("data", (d) => (err += d));
    const kill = setTimeout(() => p.kill("SIGTERM"), +(flags.timeout || 3000) * 1000);
    p.on("close", (code) => {
      clearTimeout(kill); const tr = Buffer.concat(chunks).toString(); writeFileSync(join(r.dir, "transcript.jsonl"), tr);
      let result = null; for (const l of tr.split("\n")) { try { const j = JSON.parse(l); if (j.type === "result") result = j; } catch {} }
      const meta = { ...r, exit: code, seconds: Math.round((Date.now() - t0) / 1000), turns: result?.num_turns ?? null, agent: "claude-code " + (spawnSync(flags.claude || "claude", ["--version"]).stdout?.toString().trim() || "?"),
        output: existsSync(join(r.dir, "index.html")), stderr: err.slice(-400) };
      if (r.cond === "skill") rmSync(join(r.dir, ".claude"), { recursive: true, force: true }); // keep the output folder small; the skill copy is the commit under test
      if (r.cond === "gated") rmSync(join(r.dir, "gate"), { recursive: true, force: true });
      writeFileSync(join(r.dir, "run.json"), JSON.stringify(meta, null, 1)); console.log(`${r.slug} ${r.cond} s${r.seed}: exit ${code}, ${meta.turns} turns, ${meta.seconds}s, index.html ${meta.output ? "yes" : "MISSING"}`); ok(meta);
    });
  });
}
async function pool(items, n, fn) { const out = []; let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k]); } })); return out; }

async function measure(r, pw) {
  const html = join(r.dir, "index.html"); if (!existsSync(html)) return { missing: true };
  const req = createRequire(join(process.cwd(), "noop.js")); let axe = null; try { axe = readFileSync(req.resolve("axe-core/axe.min.js"), "utf8"); } catch {}
  const b = await pw.chromium.launch(); const url = "file://" + html; const res = {};
  const scrollThrough = async (p) => { const h = await p.evaluate(() => document.documentElement.scrollHeight); for (let y = 0; y < h; y += 400) { await p.evaluate((v) => scrollTo(0, v), y); await p.waitForTimeout(60); } await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(600); };
  for (const [w, h] of [[1440, 900], [375, 812]]) for (const rm of [false, true]) {
    const c = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: rm ? "reduce" : "no-preference", deviceScaleFactor: 1 }); const p = await c.newPage();
    const errs = []; p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
    await p.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {}); await p.waitForTimeout(1500);
    const tag = `${w}${rm ? "-reduced" : ""}`; await p.screenshot({ path: join(r.dir, `shot-${tag}-fold.png`), timeout: 90000 }); await scrollThrough(p);
    const full = await p.evaluate(() => document.documentElement.scrollHeight);
    await p.screenshot({ path: join(r.dir, `shot-${tag}-full.png`), fullPage: true, clip: { x: 0, y: 0, width: w, height: Math.min(full, h * 6) }, timeout: 90000 });
    const o = { pageHeight: full, errors: errs.slice(0, 5), hOverflow: await p.evaluate(() => document.documentElement.scrollWidth - innerWidth) };
    if (!rm && axe) { await p.addScriptTag({ content: axe }); o.axe = await p.evaluate(async () => (await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] } })).violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }))); o.contrastViolations = o.axe.find((v) => v.id === "color-contrast")?.nodes || 0; }
    if (w === 1440 && !rm) {
      let reached = null, ring = 0;
      for (let s = 0; s < 40; s++) { await p.keyboard.press("Tab"); const f = await p.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const cs = getComputedStyle(e); return { text: (e.innerText || e.getAttribute("aria-label") || e.value || "").trim().slice(0, 60), href: e.getAttribute("href") || "", ring: (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== "none" }; });
        if (f?.ring) ring++; if (f && !reached && BRIEFS[r.slug].primary.test(f.text + " " + f.href)) reached = { step: s + 1, ...f }; }
      o.keyboard = { primaryReached: reached, focusStepsWithVisibleRing: `${ring}/40` };
      const src = readFileSync(html, "utf8"); o.source = { bytes: src.length, reducedMotionQuery: /prefers-reduced-motion/.test(src), placeholders: (src.match(/lorem ipsum|TODO|placeholder\.com|via\.placeholder/gi) || []).length, stamp: (src.match(/motomation ·[^*>]*/) || [""])[0].slice(0, 300) };
    }
    res[tag] = o; await c.close();
  }
  await b.close();
  const g = spawnSync(process.execPath, [join(SKILL, "scripts/gate.mjs"), html, "--json"], { cwd: process.cwd(), encoding: "utf8", maxBuffer: 64 << 20 });
  try { const j = JSON.parse(g.stdout); res.gate = { counts: j.counts, stamp: j.stamp, critique: j.critique, contrast: j.contrast.fails, overflow: j.overflow.fails.slice(0, 12), words: j.words.fails, motion: j.motion.hiddenUnderReducedMotion, names: j.names.fails }; } catch { res.gate = { error: (g.stdout || g.stderr).slice(0, 300) }; }
  writeFileSync(join(r.dir, "checks.json"), JSON.stringify(res, null, 1)); return res;
}
const summarize = (c) => ({ axe_wcag_violations_1440: (c["1440"].axe || []).map((v) => `${v.id}(${v.impact},${v.nodes})`), contrast_failing_nodes: c["1440"].contrastViolations, keyboard_primary_action: c["1440"].keyboard.primaryReached, focus_ring_visible_steps: c["1440"].keyboard.focusStepsWithVisibleRing,
  text_hidden_under_reduced_motion: c.gate?.motion?.length ?? null, horizontal_overflow_px_375: c["375"].hOverflow, js_errors: c["1440"].errors.filter((e) => !/404/.test(e)), has_reduced_motion_query: c["1440"].source.reducedMotionQuery, placeholder_strings: c["1440"].source.placeholders, html_bytes: c["1440"].source.bytes });
// Hard gates (evals/rubric.md), applied from measurements only
export function hardGates(c) {
  if (!c || c.missing) return ["no index.html produced"];
  const f = [];
  if (c["1440"].source.placeholders > 0) f.push(`placeholders: ${c["1440"].source.placeholders}`);
  if ((c["1440"].contrastViolations || 0) > 0) f.push(`contrast: ${c["1440"].contrastViolations} axe color-contrast node(s)`);
  if ((c.gate?.motion?.length || 0) > 0) f.push(`reduced motion: ${c.gate.motion.length} text element(s) hidden`);
  if (!c["1440"].keyboard.primaryReached) f.push("keyboard: primary action not reached in 40 Tabs");
  return f;
}

// A judged pair is two arms. baseline-vs-skill keeps v2's file names (s<seed>-<model>.json); other pairs add the pair.
const PAIRS = String(flags.pairs || "baseline:skill").split(",").map((p) => p.split(":"));
const pairTag = ([a, b]) => (a === "baseline" && b === "skill" ? "" : `${a}-vs-${b}-`);
async function judgePair(slug, seed, model, pair = ["baseline", "skill"]) {
  const dirs = { [pair[0]]: join(OUT, slug, `${pair[0]}-s${seed}`), [pair[1]]: join(OUT, slug, `${pair[1]}-s${seed}`) };
  const order = [...pair]; if (parseInt(createHash("sha256").update(`${slug}-${seed}${pairTag(pair)}`).digest("hex").slice(0, 8), 16) % 2) order.reverse();
  const imgs = [], desc = [];
  for (const [L, cond] of [["A", order[0]], ["B", order[1]]]) for (const [tag, cap] of [["1440-fold", "1440px, first screen"], ["1440-full", "1440px, page (up to 6 screens)"], ["375-full", "375px phone, page"], ["1440-reduced-full", "1440px with prefers-reduced-motion"]]) {
    imgs.push(join(dirs[cond], existsSync(join(dirs[cond], `shot-${tag}.png`)) ? `shot-${tag}.png` : `shot-${tag}.webp`)); /* results are committed as .webp */ desc.push(`Image ${imgs.length}: Site ${L}, ${cap}`); }
  const checks = { A: summarize(JSON.parse(readFileSync(join(dirs[order[0]], "checks.json")))), B: summarize(JSON.parse(readFileSync(join(dirs[order[1]], "checks.json")))) };
  const prompt = `You are a strict, blind design reviewer. Two websites (Site A and Site B) were built for the same brief by different processes. You don't know how either was made; judge only what you see and the measured checks.\n\nBRIEF:\n${readFileSync(join(ROOT, "evals/briefs", BRIEFS[slug].file), "utf8")}\n\nRUBRIC (score each axis 1-5 using its anchors; use the whole scale):\n${readFileSync(join(ROOT, "evals/rubric.md"), "utf8")}\n\nIMAGES: ${desc.join("; ")}. Motion can't be seen in stills: score Motion from what the reduced-motion and normal screenshots imply plus the checks, and say when you're unsure.\n\nMEASURED CHECKS (automated, Playwright + axe-core):\n${JSON.stringify(checks, null, 1)}\n\nReturn ONLY JSON:\n{"A": {"scores": {${AX.map((a) => `"${a}": n`).join(", ")}}, "hard_gate_failures": ["..."], "notes": "2-3 sentences"}, "B": {...same...}, "better": "A|B|tie", "why": "one sentence"}`;
  const jd = join(OUT, slug, "judge"); mkdirSync(jd, { recursive: true });
  const base = `s${seed}-${pairTag(pair)}${model}`; const pf = join(jd, `${base}.prompt.txt`), imf = join(jd, `${base}.images.txt`); writeFileSync(pf, prompt); writeFileSync(imf, imgs.join("\n"));
  const cmd = String(flags["judge-cmd"]).replaceAll("{model}", model).replaceAll("{prompt}", pf).replaceAll("{images}", imf);
  for (let a = 0; a < 3; a++) {
    const r = spawnSync("bash", ["-c", cmd], { encoding: "utf8", maxBuffer: 64 << 20 });
    try { const j = JSON.parse(r.stdout.match(/\{[\s\S]*\}/)[0]); const res = { model, seed, pair, order: { A: order[0], B: order[1] }, raw: j, [pair[0]]: j[order.indexOf(pair[0]) ? "B" : "A"], [pair[1]]: j[order.indexOf(pair[1]) ? "B" : "A"] };
      writeFileSync(join(jd, `${base}.json`), JSON.stringify(res, null, 1)); console.log(`judged ${slug} s${seed} ${pair.join(" vs ")} ${model}`); return res; } catch { console.log(`judge retry ${slug} s${seed} ${model}: ${(r.stderr || r.stdout).slice(0, 200)}`); }
  }
  return null;
}
const total = (s) => AX.reduce((a, k) => a + (s[k] || 0) * W[k], 0) / 5;

async function main() {
  if (phase === "generate") { mkdirSync(OUT, { recursive: true }); const todo = runs().filter((r) => flags.force || !existsSync(join(r.dir, "run.json"))); await pool(todo, +(flags.parallel || 4), runAgent); return; }
  if (phase === "measure") {
    const req = createRequire(join(process.cwd(), "noop.js")); let pw; try { pw = await import(req.resolve("playwright")); pw = pw.chromium ? pw : pw.default; } catch { console.log("not verified — no browser (Playwright not found from the current folder)"); process.exit(3); }
    await pool(runs().filter((r) => existsSync(join(r.dir, "run.json")) && (flags.force || !existsSync(join(r.dir, "checks.json")))), +(flags.parallel || 3), async (r) => { await measure(r, pw); console.log(`measured ${r.slug} ${r.cond} s${r.seed}`); }); return;
  }
  if (phase === "judge") {
    if (!flags["judge-cmd"]) { console.error("--judge-cmd is required"); process.exit(1); }
    const models = String(flags.models || "gpt_5_4,gemini_3_1_pro").split(",");
    const jobs = only.flatMap((slug) => BRIEFS[slug].seeds.slice(0, N).flatMap((seed) => PAIRS.flatMap((pair) => models.map((m) => ({ slug, seed, m, pair })))))
      .filter((j) => flags.force || !existsSync(join(OUT, j.slug, "judge", `s${j.seed}-${pairTag(j.pair)}${j.m}.json`)))
      .filter((j) => j.pair.every((c) => existsSync(join(OUT, j.slug, `${c}-s${j.seed}`, "checks.json")) && !JSON.parse(readFileSync(join(OUT, j.slug, `${c}-s${j.seed}`, "checks.json"))).missing));
    await pool(jobs, +(flags.parallel || 4), (j) => new Promise((ok) => setImmediate(async () => ok(await judgePair(j.slug, j.seed, j.m, j.pair))))); return;
  }
  if (phase === "score") {
    const models = String(flags.models || "gpt_5_4,gemini_3_1_pro").split(","); const out = { generated: new Date().toISOString(), briefs: {} };
    for (const slug of only) {
      for (const pair of PAIRS) {
      const [lo, hi] = pair; const key = pairTag(pair) ? pair.join("-vs-") : null;
      const pairs = [];
      for (const seed of BRIEFS[slug].seeds.slice(0, N)) {
        const row = { seed };
        for (const cond of pair) {
          const d = join(OUT, slug, `${cond}-s${seed}`); const meta = existsSync(join(d, "run.json")) ? JSON.parse(readFileSync(join(d, "run.json"))) : null;
          const checks = existsSync(join(d, "checks.json")) ? JSON.parse(readFileSync(join(d, "checks.json"))) : { missing: true };
          const js = models.map((m) => join(OUT, slug, "judge", `s${seed}-${pairTag(pair)}${m}.json`)).filter(existsSync).map((f) => JSON.parse(readFileSync(f)));
          const per = js.map((j) => ({ model: j.model, scores: j[cond].scores, total: total(j[cond].scores), claimedGates: j[cond].hard_gate_failures }));
          const raw = per.length ? per.reduce((a, p) => a + p.total, 0) / per.length : null; const gates = hardGates(checks);
          row[cond] = { dir: d.replace(ROOT + "/", ""), turns: meta?.turns, seconds: meta?.seconds, exit: meta?.exit, judges: per, raw, gated: raw === null ? null : gates.length ? 0 : raw, gates, gate: checks.gate?.counts || null, stamp: checks["1440"]?.source?.stamp || "" };
        }
        row.delta = row[hi].gated !== null && row[lo].gated !== null ? row[hi].gated - row[lo].gated : null;
        row.verdict = row.delta === null ? "not scored" : row.delta > 0 ? hi : row.delta < 0 ? lo : "tie"; pairs.push(row);
      }
      const v = pairs.map((p) => p.verdict); const wins = v.filter((x) => x === hi).length, losses = v.filter((x) => x === lo).length;
      const entry = { pair, pairs, wins, losses, ties: v.filter((x) => x === "tie").length, notScored: v.filter((x) => x === "not scored").length, outcome: wins === pairs.length ? "consistent win" : losses === pairs.length ? "consistent loss" : "mixed" };
      if (key) (out.briefs[slug] ||= {})[key] = entry; else out.briefs[slug] = { ...(out.briefs[slug] || {}), ...entry }; // v2 shape for baseline:skill
      }
    }
    writeFileSync(join(OUT, "summary.json"), JSON.stringify(out, null, 1));
    for (const [s, b] of Object.entries(out.briefs)) for (const e of [b, ...Object.values(b).filter((x) => x && x.pair)]) if (e.pair) console.log(`${s.padEnd(10)} ${e.pair.join(" vs ").padEnd(18)} ${e.outcome.padEnd(16)} ${e.pair[1]} wins ${e.wins}, losses ${e.losses}, ties ${e.ties}, not scored ${e.notScored} · ` + e.pairs.map((p) => `s${p.seed}: ${p[e.pair[0]].gated?.toFixed(1)} vs ${p[e.pair[1]].gated?.toFixed(1)}`).join(" · "));
    return;
  }
  console.log("usage: node evals/run-agent-benchmark.mjs <generate|measure|judge|score> --out <dir> [--n 3] [--only studio,hotel] [--arms baseline,gated,skill] [--pairs baseline:skill,gated:skill] [--tier 4] [--parallel 4] [--judge-cmd …]");
  process.exit(phase ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
