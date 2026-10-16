#!/usr/bin/env node
// v5 uses --tier <n> and --one <slug> to build one site per
// session. See evals/results/benchmark-v5/HOW-TO-RUN.md.
//
// Agent benchmark: the five benchmark briefs, run inside a real coding agent (Claude Code CLI), with and without
// the skill, n seeds per brief, blind-judged by a model from another family, hard gates applied from measurements.
//
//   node evals/run-agent-benchmark.mjs generate --out evals/results/<date>-benchmark-v2 [--n 3] [--parallel 4] [--only studio]
//   node evals/run-agent-benchmark.mjs measure  --out …        screenshots, axe-core, keyboard, scripts/gate.mjs → checks.json
//   node evals/run-agent-benchmark.mjs judge    --out … --judge-cmd "<cmd {model} {prompt} {images}>" [--models gpt_5_4,gemini_3_1_pro]
//   node evals/run-agent-benchmark.mjs score    --out …        summary.json (+ per-brief verdicts)
//   node evals/run-agent-benchmark.mjs cost     --out …        cost.json from the transcripts on disk (generate writes it too)
//   --route light|full   the skill arm runs /build --route=… (unset: the agent picks and states its route)
//   node evals/run-agent-benchmark.mjs originality --out …     the originality arm: per arm and seed, every build compared
//           with the builds of the other briefs on the six axes of scripts/originality.mjs → originality.json (+ .md).
//           Unrelated briefs must score below 0.4 on every axis; score folds the result into summary.json.
//   --cache-dir <dir> | --no-cache | --cache-unpinned   generate reuses finished runs keyed by (brief, seed, arm, skill tree
//           hash, model): evals/bench-cache.mjs. Default dir evals/.cache/runs/ (gitignored). Off unless the model is pinned.
//   --arms baseline,gated,skill   third arm "gated": the baseline prompt + scripts/gate.mjs (tool only, no skill docs)
//   --pairs baseline:skill,gated:skill,baseline:gated   which pairs judge/score compare (default baseline:skill)
//   --only portfolio,launch,festival --tier 4|5          the motion-heavy briefs at a forced tier
//   --one <slug>   (v5) build only that brief; no other brief's folders are read or written. A v5 brief is
//           evals/briefs/v5/<slug>.md (e.g. tier-3-product-tour) and needs --tier <n> to match its file name: with --one,
//           --tier loads evals/briefs/v5/tier-<n>-<slug>.md and every arm's prompt states that tier (never inferred).
//           --one studio (a v2-v4 slug) is the same as --only studio. --tier without --one keeps its old meaning.
//   --dry-run      print the run list (brief file, tier, arms, seeds, folders) and the first prompt line; write nothing
//   --n 6   (v2.5.0) six seeds per brief for the five main briefs; seeds 4-6 were added for the extended matched-effort
//           arm (benchmark v4, 30 pairs). The first three seeds are v3's, so --n 3 reproduces v3's run list.
//   matched arm (v2.5.0): the turn budget is enforced, per pair. Budget = the turns the skill run of the same brief and
//           seed used (skill-s<seed>/run.json; generate the skill arm first), else --match-turns. Claude Code gets
//           --max-turns <budget> as a hard cap; if it stops before 90% of the budget, the same session is resumed
//           (--resume <session>) with a "look, critique, revise" turn until it reaches 90% or 4 resumes. run.json
//           records { effort: { budget, used, resumes, floor, enforced } }. The raw-API agent gets the same cap and floor.
//
// generate: each run gets a fresh folder. Skill runs get the skill copied into .claude/skills/ (how Claude Code installs
// project skills) and are asked to use it with a per-brief seed for the collision engine. Baseline runs get the same
// tools, permissions and brief, without the skill. Claude Code is run with --output-format stream-json; the full
// transcript is kept next to the output. Point Claude Code at any Anthropic-compatible endpoint with ANTHROPIC_BASE_URL.
// Permissions are an explicit allowlist (file tools + node/ls/cat/mkdir/wc), never --dangerously-skip-permissions.
// measure needs Playwright (+ axe-core for the axe numbers). judge shells out to --judge-cmd, which must print the
// judge's JSON reply; the prompt and image list are written to files so any model or provider can be plugged in.
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, cpSync, rmSync, readdirSync, statSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { aggregate as costAggregate } from "../skills/asfakulsiam-motomation-design/scripts/cost.mjs";
import { skillTreeHash, cacheKey, cacheLookup, cacheStore } from "./bench-cache.mjs";

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), "..");
const SKILL = join(ROOT, "skills/asfakulsiam-motomation-design");
export const generatorBrief = (slug) => readFileSync(join(ROOT, "evals/briefs", BRIEFS[slug].file), "utf8").replace(/^\*\*Expect:\*\*.*$\n?/m, "").trimEnd() + "\n";
export const BRIEFS = {
  studio: { file: "07-architecture-studio.md", seeds: [7101, 7102, 7103, 7104, 7105, 7106], primary: /contact|enquir|email|studio@/i },
  hotel: { file: "04-boutique-hotel.md", seeds: [4101, 4102, 4103, 4104, 4105, 4106], primary: /availab|book/i },
  ecommerce: { file: "03-ceramics-shop.md", seeds: [3101, 3102, 3103, 3104, 3105, 3106], primary: /\badd\b|buy/i },
  saas: { file: "02-dev-tool-landing.md", seeds: [2101, 2102, 2103, 2104, 2105, 2106], primary: /install|get started|start free|try|pricing/i },
  public: { file: "05-climate-nonprofit.md", seeds: [5101, 5102, 5103, 5104, 5105, 5106], primary: /donat|দান/i },
  // motion-heavy briefs, run with --tier 4 or 5 (never run before v2.2.0)
  portfolio: { file: "01-motion-designer-portfolio.md", seeds: [1101, 1102, 1103], primary: /contact|email|mailto|hire/i, motion: true },
  launch: { file: "06-product-launch.md", seeds: [6101, 6102, 6103], primary: /pre-?order|buy|reserve/i, motion: true },
  festival: { file: "08-music-festival.md", seeds: [8101, 8102, 8103], primary: /ticket|buy/i, motion: true },
};
const AX = ["Concept", "Originality", "Typography", "Motion", "Craft", "Access & performance"];
const W = { Concept: 20, Originality: 20, Typography: 15, Motion: 15, Craft: 15, "Access & performance": 15 }; // evals/rubric.md

const argv = process.argv.slice(2); const phase = argv[0]; const flags = {};
for (let i = 1; i < argv.length; i++) if (argv[i].startsWith("--")) flags[argv[i].slice(2)] = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true;
// v2.5.0 (C9): unknown phases and flags are one friendly line plus the usage, exit 2, before anything runs
const BENCH_USAGE = "usage: node evals/run-agent-benchmark.mjs <generate|measure|judge|score|originality|cost> --out <dir> [--n 3] [--only studio,hotel | --one <slug>] [--arms baseline,gated,skill] [--pairs baseline:skill,gated:skill] [--tier 4] [--parallel 4] [--judge-cmd …] [--model m] [--cache-dir d | --no-cache] [--dry-run]";
const BENCH_HELP = `${BENCH_USAGE}

  --only a,b        briefs to run (default: the five v2-v4 category briefs)
  --tier <n>        force motion tier n; every arm is told the same tier. Alone or with --only: the old behaviour
  --one <slug>      (v5) build only this brief and touch no other brief's folders
                    v5: --tier <n> --one tier-<n>-<name> (or --one <name>) loads evals/briefs/v5/tier-<n>-<name>.md
                    and states "Tier <n> — <tier name>" in every arm's prompt; one seed per brief
  --dry-run         list what would run (brief file, tier, arms, seeds, folders) and exit; nothing is written
  v5 briefs: ${(() => { try { return readdirSync(join(ROOT, "evals/briefs/v5")).filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -3)).join(", "); } catch { return "none"; } })()}
  v5 process: evals/results/benchmark-v5/HOW-TO-RUN.md`;
const BENCH_FLAGS = new Set(["agent", "arms", "claude", "codex", "competitors", "force", "model", "models", "n", "only", "out", "pairs", "parallel", "reasoning", "tier", "timeout", "cache-dir", "cache-unpinned", "claude-model", "codex-home", "judge-cmd", "match-turns", "max-turns", "model-cmd", "no-cache", "node-path", "help", "one", "dry-run", "route"]);
const benchDie = (m) => { console.error(`run-agent-benchmark: ${m}\n${BENCH_USAGE}`); process.exit(2); };
if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  if (flags.help || phase === "--help" || phase === "-h") { console.log(BENCH_HELP); process.exit(0); }
  for (const k of Object.keys(flags)) if (!BENCH_FLAGS.has(k)) benchDie(`unknown flag --${k}`);
  if (flags.route !== undefined && !["light", "full"].includes(String(flags.route))) benchDie(`--route must be light or full (got "${flags.route}")`);
  if (phase && !["generate", "measure", "judge", "score", "originality", "cost"].includes(phase)) benchDie(`unknown phase "${phase}"`);
  for (const k of ["out", "n", "only", "one", "arms", "pairs", "tier", "parallel", "judge-cmd", "model", "cache-dir", "match-turns", "max-turns", "timeout"]) if (flags[k] === true) benchDie(`--${k} needs a value`);
}
const OUT = resolve(flags.out || join(ROOT, `evals/results/${new Date().toISOString().slice(0, 10)}-benchmark-v2`));
const N = +(flags.n || 3);
// Arms: baseline (no skill), gated (baseline + the measured gate script only, no skill docs), skill. Default keeps v2's two arms.
export const ARMS = ["baseline", "matched", "gated", "skill"];
// Competitor arms (v2.4.0, benchmark v3): --competitors taste=<dir>:<skill-name>,uiux=<dir>:<skill-name>. Arm "c-taste" gets that
// skill installed the way ours is (.claude/skills/<skill-name>) and the same brief, tools and turn cap. Judged blind like any pair.
export const COMPETITORS = Object.fromEntries(String(flags.competitors || "").split(",").filter(Boolean).map((x) => { const [k, v] = x.split("="); const i = v.lastIndexOf(":"); return [`c-${k}`, { dir: v.slice(0, i), name: v.slice(i + 1) }]; }));
const arms = String(flags.arms || "baseline,skill").split(",").filter((a) => ARMS.includes(a) || COMPETITORS[a]);
const TIER = flags.tier !== undefined ? +flags.tier : null; // force a motion tier (all arms are told the same tier)
// v5 (benchmark v5): one brief per session, the tier stated in every arm's prompt. See evals/results/benchmark-v5/HOW-TO-RUN.md.
export const V5_TIERS = { 1: "Basic", 2: "Intermediate", 3: "Pro", 4: "Max", 5: "Motomation" };
const V5_MOTION = {
  1: "CSS only: hover, focus and press feedback; nothing scroll-driven",
  2: "GSAP-class section entrances and scroll choreography; no pinned film, no WebGL",
  3: "transitions between pages (shared elements carried across pages) and Lottie or Rive animation",
  4: "a real-time WebGL scene and spatial sections, with a static poster fallback on mobile and under reduced motion",
  5: "scroll as the playhead: a pinned canvas scrubbing frame sequences with a timecode rail",
};
const V5_PRIMARY = { 1: /portfolio|prints|workshop|contact|mailto/i, 2: /subscribe|next issue/i, 3: /start|google play|get it/i, 4: /contact|enquir|hello@|mailto/i, 5: /pitch pack|book a call|mailto/i };
const V5_DIR = join(ROOT, "evals/briefs/v5");
if (flags.one !== undefined && flags.one !== true) {
  if (flags.only) benchDie("--one and --only can't be combined: --one builds a single brief");
  const one = String(flags.one);
  const named = [one, TIER !== null ? `tier-${TIER}-${one}` : null].filter(Boolean).find((n) => existsSync(join(V5_DIR, `${n}.md`)));
  if (named) {
    const fileTier = +(named.match(/^tier-(\d)-/) || [])[1];
    if (TIER === null) benchDie(`--one ${one} is a v5 brief: pass --tier ${fileTier || "<n>"} as well (the tier is stated, not inferred)`);
    if (fileTier !== TIER) benchDie(`--tier ${TIER} doesn't match ${named}.md (a Tier ${fileTier} brief)`);
    BRIEFS[named] = { file: `v5/${named}.md`, seeds: [9001 + TIER * 100], primary: V5_PRIMARY[TIER] || /contact|mailto/i, v5: true, tier: TIER };
    flags.one = named;
  } else if (!BRIEFS[one]) benchDie(`--one ${one}: no brief evals/briefs/v5/${TIER !== null ? `tier-${TIER}-${one}` : one}.md and no v2-v4 slug "${one}"`);
}
const only = flags.one && flags.one !== true ? [String(flags.one)] : flags.only ? String(flags.only).split(",") : Object.keys(BRIEFS).filter((k) => !BRIEFS[k].motion && !BRIEFS[k].v5); // the v2 set by default; --one: exactly one brief
const MATCH_TURNS = +(flags["match-turns"] || 24); // matched arm fallback budget, when the paired skill run has no run.json
// matched arm (v2.5.0): the budget is the paired skill run's turn count (same brief, same seed), enforced as a cap and a floor
// Run provenance (v2.5.0, P1 T13): generate writes <out>/meta.json before any run starts, so every result folder says
// exactly what produced it: the repo commit (and whether the tree was dirty), the skill version, the adapter and its
// version, the model, the browser the measure phase will use, the runner's own hash, the run list and the time.
export async function runMeta(todo = []) {
  const git = (...a) => { const r = spawnSync("git", a, { cwd: ROOT, encoding: "utf8" }); return r.status === 0 ? r.stdout.trim() : null; };
  const ver = (cmd, args = ["--version"]) => { try { const r = spawnSync(cmd, args, { encoding: "utf8", timeout: 20000 }); return r.status === 0 ? (r.stdout || r.stderr).trim().split("\n")[0] : null; } catch { return null; } };
  const adapter = flags.agent === "raw-api" ? "raw-api" : flags.agent === "codex" ? "codex" : "claude-code";
  const cli = adapter === "codex" ? flags.codex || "codex" : adapter === "claude-code" ? flags.claude || "claude" : null;
  let browser = null;
  try { const req = createRequire(join(process.cwd(), "noop.js")); let pw = await import(req.resolve("playwright")); pw = pw.chromium ? pw : pw.default; const b = await pw.chromium.launch(); browser = { name: "chromium", version: b.version(), playwright: JSON.parse(readFileSync(req.resolve("playwright/package.json"), "utf8")).version }; await b.close(); }
  catch (e) { browser = { name: "chromium", version: null, note: `not available at generate (${String(e.message || e).split("\n")[0].slice(0, 120)}); the measure phase records its own` }; }
  return {
    schema: "motomation-run-meta/1", phase: "generate", started: new Date().toISOString(),
    repo: { sha: git("rev-parse", "HEAD"), short: git("rev-parse", "--short", "HEAD"), branch: git("rev-parse", "--abbrev-ref", "HEAD"), dirty: (git("status", "--porcelain") ?? "") !== "", remote: git("config", "--get", "remote.origin.url") },
    skill_version: JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).version,
    adapter: { name: adapter, cli, version: cli ? ver(cli) : null },
    model: { pinned: flags.model || flags["claude-model"] || null, note: flags.model || flags["claude-model"] ? undefined : "not pinned by flag: the adapter's default; models_reported (filled in after the runs) lists what the agents said they were" },
    browser, node: process.version, platform: `${process.platform}-${process.arch}`,
    runner: { file: "evals/run-agent-benchmark.mjs", sha256: createHash("sha256").update(readFileSync(new URL(import.meta.url))).digest("hex").slice(0, 16) },
    argv: process.argv.slice(2), ci: process.env.GITHUB_ACTIONS ? { run_id: process.env.GITHUB_RUN_ID, run_attempt: process.env.GITHUB_RUN_ATTEMPT, workflow: process.env.GITHUB_WORKFLOW, url: `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}` } : null,
    runs: todo.map((r) => `${r.slug}/${r.cond}-s${r.seed}`),
  };
}

export function matchBudget(r) {
  try { const t = JSON.parse(readFileSync(join(OUT, r.slug, `skill-s${r.seed}`, "run.json"), "utf8")).turns; if (t > 0) return { budget: t, from: `skill-s${r.seed}/run.json` }; } catch {}
  return { budget: MATCH_TURNS, from: "--match-turns" };
}
const FLOOR = 0.9, MAX_RESUMES = 4;
// Claude Code's --max-turns N lets the agent take N turns and then reports num_turns N + 1 on error_max_turns (it
// counts the turn it refused); on success num_turns is also one more than the model calls made. Budgets come from the
// skill run's num_turns, so passing the budget straight through allowed budget + 1 (benchmark v4: 19 of 30 matched runs
// over by one). The flag for `remaining` turns of num_turns is therefore remaining - 1; with fewer than 2 left there is
// no room for another session.
export const claudeMaxTurns = (remaining) => remaining - 1;
export const canResume = (remaining) => remaining >= 2;
const CONTINUE = (used, budget) => `You have used ${used} of your ${budget} turns; keep working, the budget is there to be used. Look at index.html again at 1440px and 375px, write a short critique of what is still weak, generic or broken (concept, type, layout, motion, contrast, keyboard, reduced motion), and revise the file. Stop only when the critique finds nothing worth fixing.`;
const runs = () => only.flatMap((slug) => BRIEFS[slug].seeds.slice(0, N).flatMap((seed) => arms.map((cond) => ({ slug, seed, cond, dir: join(OUT, slug, `${cond}-s${seed}`) }))));

const TASK = "Build the website described in the brief below as a single self-contained index.html in the current folder (inline CSS and JS, no build step; Google Fonts/Fontshare and the GSAP CDN are allowed, no image URLs). Use only facts from the brief.";
export function promptFor({ slug, seed, cond, budget }) {
  // The **Expect:** line is the evaluator's note, not part of the client's brief. Before v2.4.0 it was sent to the
  // agent too ("Console or Workbench thinking", "a signature tied to doors"), which steered every arm toward the
  // same archetype and signature: the cause of the v2 SaaS console collision. Generators never see it now.
  const brief = generatorBrief(slug);
  if (BRIEFS[slug].v5) return promptV5({ slug, seed, cond, budget }, brief);
  const tier = TIER === null ? "" : ` Build it at motion Tier ${TIER} (${TIER >= 5 ? "scroll-driven film: pinned, scrubbed sequences; WebGL allowed" : "signature scroll motion: pinned or scrubbed sections"}), with a reduced-motion version that keeps all content.`;
  if (COMPETITORS[cond]) return `Use the ${COMPETITORS[cond].name} skill to build this brief. ${TASK}${tier} Follow the skill end to end and check your work before you finish.\n\n${brief}`;
  if (cond === "baseline") return `You are an expert web designer and front-end developer. ${TASK}${tier} Check your work before you finish.\n\n${brief}`;
  // matched = the baseline prompt with the skill arm's effort: the same turn budget, told to plan, look, critique and revise.
  // If the skill only wins because it works longer, this arm closes the gap (v2.4.0, benchmark v3).
  if (cond === "matched") return `You are an expert web designer and front-end developer. ${TASK}${tier} Take the time a careful designer would: you have ${budget ?? MATCH_TURNS} turns, and you should use most of them. Work in stages: (1) write down the concept and the design system (type, colour, layout, motion) before any code; (2) build; (3) look at the page at 1440px and 375px; (4) write a critique of what is weak, generic or broken; (5) revise; repeat looking, critiquing and revising at least twice. Check accessibility (contrast, keyboard, reduced motion) yourself before you finish.\n\n${brief}`;
  // gated = the baseline prompt plus the same measured gate the skill uses, without any of the skill's knowledge
  if (cond === "gated") return `You are an expert web designer and front-end developer. ${TASK}${tier} Before you finish, run \`node gate/gate.mjs index.html\` and fix every failure it reports until it prints PASS (if it prints "not verified", say so).\n\n${brief}`;
  return `Use the asfakulsiam-motomation-design skill: /build${ROUTE_ARG} this brief. Approve every checkpoint. When you run the collision engine, use --seed ${seed}.${tier ? ` Force the motion tier: --tier=${TIER}.` : ""} ${TASK} Follow the skill end to end, including its Delivery Gate, and finish with the handoff.\n\n${brief}`;
}
// Every brief ends with "Approve every checkpoint." (v2.10.0) and the skill arm's prompt says it too: the skill stops at
// five checkpoints for an explicit answer, and nobody can answer inside a benchmark run.
// v5 prompts: the tier is stated, never inferred, and no stack is imposed (Step 0 of the skill would ask; nobody can
// answer inside a benchmark run, so every arm gets the client's answer "you choose" and must say what it chose and why).
const V5_TASK = "Build the website described in the brief below in the current folder. The brief names no stack; the client's answer to \"which stack?\" is \"you choose\": choose one, say which and why in one line at the end, and leave the result where a browser can open it (an index.html in this folder, or a built output folder such as out/, dist/ or build/ with its index.html). Use only facts from the brief.";
// --route light|full (v2.11): passed to the skill arm as /build --route=…; unset, the agent chooses and states its route
const ROUTE_ARG = flags.route ? ` --route=${flags.route}` : "";
export function promptV5({ slug, seed, cond, budget }, brief) {
  const t = BRIEFS[slug].tier, tier = ` Build it at motion Tier ${t} — ${V5_TIERS[t]} (${V5_MOTION[t]}), with a reduced-motion version that keeps all content. The tier is a requirement, not a suggestion.`;
  if (COMPETITORS[cond]) return `Use the ${COMPETITORS[cond].name} skill to build this brief. ${V5_TASK}${tier} Follow the skill end to end and check your work before you finish.\n\n${brief}`;
  if (cond === "baseline") return `You are an expert web designer and front-end developer. ${V5_TASK}${tier} Check your work before you finish.\n\n${brief}`;
  if (cond === "matched") return `You are an expert web designer and front-end developer. ${V5_TASK}${tier} Take the time a careful designer would: you have ${budget ?? MATCH_TURNS} turns, and you should use most of them: plan, build, look at the result at 1440px and 375px, critique it and revise.\n\n${brief}`;
  if (cond === "gated") return `You are an expert web designer and front-end developer. ${V5_TASK}${tier} Before you finish, run \`node gate/gate.mjs <your page, folder or URL>\` and fix every failure it reports until it prints PASS (if it prints "not verified", say so).\n\n${brief}`;
  return `Use the asfakulsiam-motomation-design skill: /build${ROUTE_ARG} this brief. Approve every checkpoint. When you run the collision engine, use --seed ${seed}. Force the motion tier: --tier=${t}. ${V5_TASK}${tier} Follow the skill end to end, including its Delivery Gate, and finish with the handoff.\n\n${brief}`;
}
const ALLOWED = ["Skill", "Read", "Write", "Edit", "Glob", "Grep", "TodoWrite", "Bash(node:*)", "Bash(ls:*)", "Bash(cat:*)", "Bash(mkdir:*)", "Bash(wc:*)"];

// Codex CLI agent (v2.4.0, benchmark v3 multi-agent): --agent codex [--codex-home dir]. Skills are installed where Codex
// discovers project skills (.agents/skills/<name>, as the open `skills` CLI does). Codex has no turn cap flag; the
// timeout is the cap, and "turns" counts its tool calls (commands + patches). Runs with --sandbox danger-full-access
// because the gate starts Chromium and a localhost server, which Codex's workspace sandbox blocks; the run folder is
// disposable and outside the repository.
function runCodex(r) {
  return new Promise((ok) => {
    rmSync(r.dir, { recursive: true, force: true }); mkdirSync(r.dir, { recursive: true });
    if (r.cond === "skill") cpSync(SKILL, join(r.dir, ".agents/skills/asfakulsiam-motomation-design"), { recursive: true });
    if (r.cond === "gated") { mkdirSync(join(r.dir, "gate")); for (const f of ["gate.mjs", "memory.mjs", "lib.mjs"]) cpSync(join(SKILL, "scripts", f), join(r.dir, "gate", f)); }
    if (COMPETITORS[r.cond]) cpSync(COMPETITORS[r.cond].dir, join(r.dir, ".agents/skills", COMPETITORS[r.cond].name), { recursive: true });
    const prompt = promptFor(r); writeFileSync(join(r.dir, "prompt.txt"), prompt);
    // MOTOMATION_SANDBOX tells gate.mjs it runs inside Codex's sandbox, so it reports the machine it found and retries in
    // its light footprint if Chromium fails (v2.5.0, task A3). Nothing else about the run changes.
    const t0 = Date.now(); const env = { ...process.env, MOTOMATION_SANDBOX: "codex", ...(flags["codex-home"] ? { CODEX_HOME: flags["codex-home"] } : {}) };
    const p = spawn(flags.codex || "codex", ["exec", "--skip-git-repo-check", "--sandbox", "danger-full-access", "--json", "-C", r.dir, prompt], { cwd: r.dir, env, stdio: ["ignore", "pipe", "pipe"] });
    const chunks = []; p.stdout.on("data", (d) => chunks.push(d)); let err = ""; p.stderr.on("data", (d) => (err += d));
    const kill = setTimeout(() => p.kill("SIGTERM"), +(flags.timeout || 3000) * 1000);
    p.on("close", (code) => {
      clearTimeout(kill); const tr = Buffer.concat(chunks).toString(); writeFileSync(join(r.dir, "transcript.jsonl"), tr);
      let calls = 0; for (const l of tr.split("\n")) { try { const j = JSON.parse(l); if (j.type === "item.completed" && /command_execution|file_change|mcp_tool_call/.test(j.item?.type || "")) calls++; } catch {} }
      const meta = { ...r, exit: code, seconds: Math.round((Date.now() - t0) / 1000), elapsed_ms: Date.now() - t0, route: flags.route || null, turns: calls, agent: (spawnSync(flags.codex || "codex", ["--version"]).stdout?.toString().trim() || "codex ?"),
        output: existsSync(join(r.dir, "index.html")), stderr: err.slice(-400) };
      rmSync(join(r.dir, ".agents"), { recursive: true, force: true }); if (r.cond === "gated") rmSync(join(r.dir, "gate"), { recursive: true, force: true });
      writeFileSync(join(r.dir, "run.json"), JSON.stringify(meta, null, 1)); console.log(`${r.slug} ${r.cond} s${r.seed} [codex]: exit ${code}, ${calls} tool calls, ${meta.seconds}s, index.html ${meta.output ? "yes" : "MISSING"}`); ok(meta);
    });
  });
}

function runAgent(r) {
  if (flags.agent === "codex") return runCodex(r);
  return new Promise((ok) => {
    rmSync(r.dir, { recursive: true, force: true }); mkdirSync(r.dir, { recursive: true });
    if (r.cond === "skill") cpSync(SKILL, join(r.dir, ".claude/skills/asfakulsiam-motomation-design"), { recursive: true });
    if (r.cond === "gated") { mkdirSync(join(r.dir, "gate")); for (const f of ["gate.mjs", "memory.mjs", "lib.mjs"]) cpSync(join(SKILL, "scripts", f), join(r.dir, "gate", f)); } // the tool, not the docs
    if (COMPETITORS[r.cond]) cpSync(COMPETITORS[r.cond].dir, join(r.dir, ".claude/skills", COMPETITORS[r.cond].name), { recursive: true });
    const eff = r.cond === "matched" ? matchBudget(r) : null; if (eff) r = { ...r, budget: eff.budget };
    const prompt = promptFor(r); writeFileSync(join(r.dir, "prompt.txt"), prompt);
    const t0 = Date.now();
    const p = spawn(flags.claude || "claude", ["-p", prompt, "--output-format", "stream-json", "--verbose", "--max-turns", String(eff ? claudeMaxTurns(eff.budget) : flags["max-turns"] || 80), "--permission-mode", "acceptEdits", "--allowedTools", ...ALLOWED, ...(COMPETITORS[r.cond] ? ["Bash(python3:*)"] : [])], // ui-ux-pro-max searches its data with python3
      { cwd: r.dir, env: { ...process.env, CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1", DISABLE_TELEMETRY: "1" }, stdio: ["ignore", "pipe", "pipe"] });
    const chunks = []; p.stdout.on("data", (d) => chunks.push(d)); let err = ""; p.stderr.on("data", (d) => (err += d));
    const kill = setTimeout(() => p.kill("SIGTERM"), +(flags.timeout || 3000) * 1000);
    p.on("close", async (code) => {
      clearTimeout(kill); let tr = Buffer.concat(chunks).toString(); writeFileSync(join(r.dir, "transcript.jsonl"), tr);
      let result = null; for (const l of tr.split("\n")) { try { const j = JSON.parse(l); if (j.type === "result") result = j; } catch {} }
      let effort = null;
      if (eff) { // enforce the floor: resume the same session until 90% of the budget is used (the cap is --max-turns)
        let used = result?.num_turns ?? 0, resumes = 0; const floor = Math.ceil(eff.budget * FLOOR);
        while (used < floor && canResume(eff.budget - used) && resumes < MAX_RESUMES && result?.session_id && Date.now() - t0 < +(flags.timeout || 3000) * 1000) {
          resumes++; const more = await claudeResume(r, result.session_id, CONTINUE(used, eff.budget), eff.budget - used);
          tr += more.tr; writeFileSync(join(r.dir, "transcript.jsonl"), tr); if (!more.result) break; result = { ...more.result, session_id: more.result.session_id || result.session_id }; used += more.result.num_turns ?? 0;
        }
        effort = { budget: eff.budget, budgetFrom: eff.from, floor, used, resumes, enforced: used >= floor && used <= eff.budget };
        result = { ...(result || {}), num_turns: used };
      }
      const meta = { ...r, exit: code, seconds: Math.round((Date.now() - t0) / 1000), elapsed_ms: Date.now() - t0, route: flags.route || null, turns: result?.num_turns ?? null, ...(effort ? { effort } : {}), agent: "claude-code " + (spawnSync(flags.claude || "claude", ["--version"]).stdout?.toString().trim() || "?"),
        output: existsSync(join(r.dir, "index.html")), stderr: err.slice(-400) };
      if (r.cond === "skill" || COMPETITORS[r.cond]) rmSync(join(r.dir, ".claude"), { recursive: true, force: true }); // keep the output folder small; the skill copy is the commit under test
      if (r.cond === "gated") rmSync(join(r.dir, "gate"), { recursive: true, force: true });
      writeFileSync(join(r.dir, "run.json"), JSON.stringify(meta, null, 1)); console.log(`${r.slug} ${r.cond} s${r.seed}: exit ${code}, ${meta.turns} turns, ${meta.seconds}s, index.html ${meta.output ? "yes" : "MISSING"}`); ok(meta);
    });
  });
}
// one more `claude -p` turn group in an existing session (matched arm floor)
function claudeResume(r, session, text, maxTurns) {
  return new Promise((ok) => {
    const p = spawn(flags.claude || "claude", ["-p", text, "--resume", session, "--output-format", "stream-json", "--verbose", "--max-turns", String(claudeMaxTurns(maxTurns)), "--permission-mode", "acceptEdits", "--allowedTools", ...ALLOWED],
      { cwd: r.dir, env: { ...process.env, CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1", DISABLE_TELEMETRY: "1" }, stdio: ["ignore", "pipe", "pipe"] });
    const chunks = []; p.stdout.on("data", (d) => chunks.push(d)); p.stderr.on("data", () => {});
    const kill = setTimeout(() => p.kill("SIGTERM"), 1800 * 1000);
    p.on("close", () => { clearTimeout(kill); const tr = Buffer.concat(chunks).toString(); let result = null; for (const l of tr.split("\n")) { try { const j = JSON.parse(l); if (j.type === "result") result = j; } catch {} } ok({ tr, result }); });
  });
}
// ── raw-API agent (v2.4.0) ────────────────────────────────────────────────────────────────────────────────────────
// For machines where no coding-agent CLI can run (benchmark v3 had Claude Code installed but could not launch it with
// file permissions). A small, scripted tool loop around one model: every arm gets the same tools and the same turn cap.
// Tools: <read path/>, <run>cmd</run> (node, ls, cat, wc, mkdir only; cwd = the run folder), <write path>…</write>,
// <look path/> (screenshots at 1440 and 375, returned as images), <done/>. Skill arm: the system prompt is the skill's
// SKILL.md and the skill folder is at
// ./skill so its scripts run. Labelled "raw API" everywhere it is reported; it is not Claude Code.
// Skill arm system prompt = SKILL.md (the router), as Claude Code loads a skill; every other file is read on demand.
const TOOLS_DOC = `You work in a folder on a Linux machine through these tools. Use them by writing the tags in your reply; you may use several per reply, they run in order, and you get every result in the next message.
<read path="relative/path"/>                     read a text file (or list a folder)
<run>ls -la</run>                                  run a command in the folder. Allowed: node, ls, cat, wc, mkdir. No network installs.
<write path="index.html">…full file content…</write>   create or overwrite a file (always the whole file)
<look path="index.html"/>                        screenshots of the page at 1440px and 375px wide, returned as images
<done/>                                          you are finished (only after index.html is written)
Keep prose short; the work is in the files.`;
function rawTools(reply) {
  // models trained on function calling sometimes answer in <invoke name><parameter …> form: accept it as the same tools
  reply = reply.replace(/<invoke name="(\w+)">([\s\S]*?)<\/invoke>/g, (m, name, body) => { const q = {}; body.replace(/<parameter name="(\w+)">([\s\S]*?)<\/parameter>/g, (_, k, v) => (q[k] = v));
    const path = (q.path || q.file || "").trim(); if (name === "write") return `<write path="${path}">${q.content ?? ""}</write>`; if (name === "read") return `<read path="${path}"/>`;
    if (name === "run" || name === "bash") return `<run>${q.cmd || q.command || ""}</run>`; if (name === "look") return `<look path="${path}"/>`; if (name === "done") return "<done/>"; return m; });
  const acts = []; const re = /<read\s+path="([^"]+)"\s*\/>|<run>([\s\S]*?)<\/run>|<write\s+path="([^"]+)">([\s\S]*?)<\/write>|<look\s+path="([^"]+)"\s*\/>|<done\s*\/>/g; let m;
  while ((m = re.exec(reply))) acts.push(m[1] ? { t: "read", path: m[1] } : m[2] !== undefined ? { t: "run", cmd: m[2].trim() } : m[3] ? { t: "write", path: m[3], body: m[4].replace(/^\n/, "") } : m[5] ? { t: "look", path: m[5] } : { t: "done" });
  return acts;
}
const inside = (dir, p) => { const f = resolve(dir, p); if (f !== dir && !f.startsWith(dir + "/")) throw new Error("path outside the folder"); return f; };
const callModel = (req) => new Promise((ok) => {
  const p = spawn("bash", ["-c", flags["model-cmd"]], { stdio: ["pipe", "pipe", "pipe"] }); let out = "", err = "";
  p.stdout.on("data", (d) => (out += d)); p.stderr.on("data", (d) => (err += d)); p.on("close", (code) => { let usage = null; try { usage = JSON.parse(err.trim().split("\n").pop()); } catch {} ok({ code, text: out, usage, err: err.slice(-400) }); });
  p.stdin.end(JSON.stringify(req));
});
async function lookAt(dir, path, n) {
  const req = createRequire(join(process.cwd(), "noop.js")); let pw = await import(req.resolve("playwright")); pw = pw.chromium ? pw : pw.default;
  const b = await pw.chromium.launch(); const shots = [];
  try { for (const [w, h] of [[1440, 900], [375, 812]]) { const pg = await b.newPage({ viewport: { width: w, height: h } }); const errs = []; pg.on("pageerror", (e) => errs.push(e.message));
    await pg.goto("file://" + inside(dir, path), { waitUntil: "networkidle", timeout: 45000 }).catch(() => {}); await pg.waitForTimeout(1200);
    const f = join(dir, ".look", `t${n}-${w}.png`); mkdirSync(dirname(f), { recursive: true }); await pg.screenshot({ path: f, fullPage: true, clip: { x: 0, y: 0, width: w, height: Math.min(h * 3, await pg.evaluate(() => document.documentElement.scrollHeight)) } });
    shots.push({ f, w, errs }); await pg.close(); } } finally { await b.close(); }
  return shots;
}
async function runRawAgent(r) {
  rmSync(r.dir, { recursive: true, force: true }); mkdirSync(r.dir, { recursive: true });
  if (r.cond === "skill") cpSync(SKILL, join(r.dir, "skill"), { recursive: true });
  if (r.cond === "gated") { mkdirSync(join(r.dir, "gate")); for (const f of ["gate.mjs", "memory.mjs", "lib.mjs"]) cpSync(join(SKILL, "scripts", f), join(r.dir, "gate", f)); }
  writeFileSync(join(r.dir, "package.json"), JSON.stringify({ name: "run", private: true })); // a project root, so the skill's memory log lands here
  const eff = r.cond === "matched" ? matchBudget(r) : null; if (eff) r = { ...r, budget: eff.budget };
  let prompt = promptFor(r); if (r.cond === "skill") prompt = prompt.replace("Use the asfakulsiam-motomation-design skill:", "Use the asfakulsiam-motomation-design skill (it is your system prompt; its files are in ./skill, its scripts in ./skill/scripts):");
  writeFileSync(join(r.dir, "prompt.txt"), prompt);
  const system = (r.cond === "skill" ? "The asfakulsiam-motomation-design skill is installed. Its SKILL.md follows; every path it names is inside ./skill (e.g. ./skill/thinking/sequence.md, ./skill/scripts/gate.mjs). Read the files it routes you to.\n\n" + readFileSync(join(SKILL, "SKILL.md"), "utf8") + "\n\n---\n\n" : "") + TOOLS_DOC;
  const msgs = [{ role: "user", content: prompt }]; const tr = []; const t0 = Date.now(); let turns = 0, done = false, tin = 0, tout = 0, served = new Set(), fail = null;
  const cap = eff ? eff.budget : +(flags["max-turns"] || 40); const floor = eff ? Math.ceil(eff.budget * FLOOR) : 0;
  while (turns < cap && !done) {
    // keep the context bounded without making the agent re-read: documents it read stay whole; only file bodies it wrote
    // more than 4 turns ago shrink to their size (the file is on disk), and only the latest screenshots stay
    const lastImg = msgs.map((m, i) => (Array.isArray(m.content) && m.content.some((b) => b.type === "image") ? i : -1)).filter((i) => i >= 0).pop();
    const view = msgs.map((m, i) => {
      if (m.role === "assistant") return i < msgs.length - 8 ? { ...m, content: m.content.replace(/(<write\s+path="[^"]+">)([\s\S]*?)(<\/write>)/g, (_, a, b, c) => `${a}[${b.length} bytes, on disk]${c}`).replace(/(<parameter name="content">)([\s\S]*?)(<\/parameter>)/g, (_, a, b, c) => `${a}[${b.length} bytes, on disk]${c}`) } : m;
      if (i === 0 || !Array.isArray(m.content) || i === lastImg) return m;
      const c = m.content.filter((b) => b.type !== "image"); return { ...m, content: c.length ? c : "[screenshots shown earlier]" }; });
    const res = await callModel({ model: flags.model || "claude_sonnet_5_5", system, messages: view, max_tokens: 48000, reasoning: flags.reasoning || "medium" }); turns++;
    if (res.code !== 0 || !res.text.trim()) { fail = `model call failed (exit ${res.code}): ${res.err}`; tr.push({ turn: turns, error: fail }); break; }
    if (res.usage) { tin += res.usage.in || 0; tout += res.usage.out || 0; if (res.usage.served) served.add(res.usage.served); }
    msgs.push({ role: "assistant", content: res.text }); const acts = rawTools(res.text); const outs = []; const imgs = [];
    for (const a of acts) {
      try {
        if (a.t === "done") { if (turns < floor) { outs.push(CONTINUE(turns, cap)); continue; } done = true; break; }
        if (a.t === "read") { const f = inside(r.dir, a.path); outs.push(`<read ${a.path}>\n` + (existsSync(f) && statSync(f).isDirectory() ? readdirSync(f).join("\n") : readFileSync(f, "utf8").slice(0, 60000))); }
        if (a.t === "write") { const f = inside(r.dir, a.path); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, a.body); outs.push(`<write ${a.path}> ${a.body.length} bytes written`); }
        if (a.t === "run") { if (!/^(node|ls|cat|wc|mkdir)\b/.test(a.cmd) || /[;&|`$<>]/.test(a.cmd.replace(/"[^"]*"|'[^']*'/g, ""))) { outs.push(`<run> refused: only node, ls, cat, wc, mkdir, one command, no shell operators`); continue; }
          const x = spawnSync("bash", ["-c", a.cmd], { cwd: r.dir, encoding: "utf8", timeout: 300000, maxBuffer: 32 << 20, env: { ...process.env, NODE_PATH: flags["node-path"] || process.env.NODE_PATH || "" } }); outs.push(`<run ${a.cmd}> exit ${x.status}\n` + ((x.stdout || "") + (x.stderr || "")).slice(-20000)); }
        if (a.t === "look") { const sh = await lookAt(r.dir, a.path, turns); outs.push(`<look ${a.path}> ` + sh.map((s) => `${s.w}px${s.errs.length ? ` (JS errors: ${s.errs.slice(0, 3).join(" | ")})` : ""}`).join(", ")); for (const s of sh) imgs.push({ type: "image", path: s.f }); }
      } catch (e) { outs.push(`<${a.t}> error: ${String(e.message || e).slice(0, 300)}`); }
    }
    tr.push({ turn: turns, reply: res.text, actions: acts.map((a) => ({ ...a, body: a.body ? `[${a.body.length} bytes]` : undefined })), results: outs.map((o) => o.slice(0, 4000)), usage: res.usage });
    writeFileSync(join(r.dir, "transcript.jsonl"), tr.map((x) => JSON.stringify(x)).join("\n") + "\n"); // per turn, so a long run can be watched
    if (done) break;
    const fb = outs.length ? outs.join("\n\n") : "No tool tags found in your reply. Use the tools, or <done/> if index.html is written.";
    msgs.push({ role: "user", content: imgs.length ? [{ type: "text", text: fb }, ...imgs] : fb });
  }
  writeFileSync(join(r.dir, "transcript.jsonl"), tr.map((x) => JSON.stringify(x)).join("\n") + "\n");
  const meta = { ...r, exit: fail ? 1 : 0, seconds: Math.round((Date.now() - t0) / 1000), elapsed_ms: Date.now() - t0, route: flags.route || null, turns, finished: done ? "done" : fail ? "error" : "turn cap", agent: `raw API (scripted tool loop in run-agent-benchmark.mjs), model ${flags.model || "claude_sonnet_5_5"}`,
    served: [...served], tokens: { in: tin, out: tout }, output: existsSync(join(r.dir, "index.html")), error: fail,
    ...(eff ? { effort: { budget: cap, budgetFrom: eff.from, floor, used: turns, resumes: 0, enforced: turns >= floor && turns <= cap } } : {}) };
  for (const d of ["skill", "gate", ".look"]) rmSync(join(r.dir, d), { recursive: true, force: true });
  writeFileSync(join(r.dir, "run.json"), JSON.stringify(meta, null, 1)); console.log(`${r.slug} ${r.cond} s${r.seed}: ${meta.finished}, ${turns} turns, ${meta.seconds}s, index.html ${meta.output ? "yes" : "MISSING"}`); return meta;
}
// exact two-sided sign test: P(X ≤ min(w,l)) * 2 for X ~ Binomial(w + l, 0.5), capped at 1
export function signTest(w, l) { const n = w + l; if (!n) return 1; const k = Math.min(w, l); let c = 1, s = 0; for (let i = 0; i <= k; i++) { s += c; c = (c * (n - i)) / (i + 1); } return Math.min(1, (2 * s) / 2 ** n); }
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
    res[tag] = o;
    // scroll-frame strip (1440, full motion): 8 viewport frames after wheel-scrolling to even steps, tiled 4×2, so judges see motion states, not one still
    if (w === 1440 && !rm) {
      await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(400);
      const max = await p.evaluate(() => Math.max(0, document.documentElement.scrollHeight - innerHeight)); const frames = []; let at = 0;
      for (let i = 0; i < 8; i++) { const t = Math.round((max * i) / 7); while (at < t) { const d = Math.min(240, t - at); await p.mouse.wheel(0, d); at += d; await p.waitForTimeout(16); }
        await p.waitForTimeout(450); frames.push({ y: await p.evaluate(() => Math.round(scrollY)), b64: (await p.screenshot({ type: "jpeg", quality: 60 })).toString("base64") }); }
      const sp = await c.newPage(); await sp.setViewportSize({ width: 1440, height: 520 });
      await sp.setContent(`<body style="margin:0;background:#000;display:grid;grid-template-columns:repeat(4,360px);grid-auto-rows:225px;gap:0;line-height:0">${frames.map((f, i) => `<div style="position:relative"><img src="data:image/jpeg;base64,${f.b64}" style="width:360px;height:225px;display:block"><span style="position:absolute;left:4px;top:4px;background:#000;color:#fff;font:12px monospace;padding:1px 4px">${i + 1} · ${f.y}px</span></div>`).join("")}</body>`);
      await sp.waitForTimeout(200); await sp.screenshot({ path: join(r.dir, "shot-1440-strip.png"), clip: { x: 0, y: 0, width: 1440, height: 450 } }); await sp.close();
      o.strip = { frames: frames.map((f) => f.y), maxScroll: max };
    }
    await c.close();
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
const sh = (cmd) => new Promise((ok) => { const p = spawn("bash", ["-c", cmd], { stdio: ["ignore", "pipe", "pipe"] }); let stdout = "", stderr = ""; p.stdout.on("data", (d) => (stdout += d)); p.stderr.on("data", (d) => (stderr += d)); p.on("close", () => ok({ stdout, stderr })); });
async function judgePair(slug, seed, model, pair = ["baseline", "skill"]) {
  const dirs = { [pair[0]]: join(OUT, slug, `${pair[0]}-s${seed}`), [pair[1]]: join(OUT, slug, `${pair[1]}-s${seed}`) };
  const order = [...pair]; if (parseInt(createHash("sha256").update(`${slug}-${seed}${pairTag(pair)}`).digest("hex").slice(0, 8), 16) % 2) order.reverse();
  const imgs = [], desc = [];
  const shot = (d, tag) => [`shot-${tag}.png`, `shot-${tag}.webp`].map((f) => join(d, f)).find(existsSync); /* results are committed as .webp */
  const strips = pair.every((c) => shot(dirs[c], "1440-strip")); // only when both sites have one, so A and B are judged on the same evidence
  const VIEWS = [["1440-fold", "1440px, first screen"], ["1440-full", "1440px, page (up to 6 screens)"], ["375-full", "375px phone, page"], ["1440-reduced-full", "1440px with prefers-reduced-motion"], ...(strips ? [["1440-strip", "1440px scroll-frame strip: 8 viewport frames at even scroll steps, read left to right then the second row; each frame is labelled with its scroll position"]] : [])];
  for (const [L, cond] of [["A", order[0]], ["B", order[1]]]) for (const [tag, cap] of VIEWS) { imgs.push(shot(dirs[cond], tag) || join(dirs[cond], `shot-${tag}.webp`)); desc.push(`Image ${imgs.length}: Site ${L}, ${cap}`); }
  const motionNote = strips
    ? "Score Motion mainly from the scroll-frame strips: compare consecutive frames for what moves (pinning, scrubbing, reveals, a sequence that progresses) and whether it serves the brief, then use the reduced-motion screenshot and the checks for the fallback. Stills can't show easing or timing; say when you're unsure."
    : "Motion can't be seen in stills: score Motion from what the reduced-motion and normal screenshots imply plus the checks, and say when you're unsure.";
  const checks = { A: summarize(JSON.parse(readFileSync(join(dirs[order[0]], "checks.json")))), B: summarize(JSON.parse(readFileSync(join(dirs[order[1]], "checks.json")))) };
  const prompt = `You are a strict, blind design reviewer. Two websites (Site A and Site B) were built for the same brief by different processes. You don't know how either was made; judge only what you see and the measured checks.\n\nBRIEF:\n${readFileSync(join(ROOT, "evals/briefs", BRIEFS[slug].file), "utf8")}\n\nRUBRIC (score each axis 1-5 using its anchors; use the whole scale):\n${readFileSync(join(ROOT, "evals/rubric.md"), "utf8")}\n\nIMAGES: ${desc.join("; ")}. ${motionNote}\n\nMEASURED CHECKS (automated, Playwright + axe-core):\n${JSON.stringify(checks, null, 1)}\n\nReturn ONLY JSON:\n{"A": {"scores": {${AX.map((a) => `"${a}": n`).join(", ")}}, "hard_gate_failures": ["..."], "notes": "2-3 sentences"}, "B": {...same...}, "better": "A|B|tie", "why": "one sentence"}`;
  const jd = join(OUT, slug, "judge"); mkdirSync(jd, { recursive: true });
  const base = `s${seed}-${pairTag(pair)}${model}`; const pf = join(jd, `${base}.prompt.txt`), imf = join(jd, `${base}.images.txt`); writeFileSync(pf, prompt); writeFileSync(imf, imgs.join("\n"));
  const cmd = String(flags["judge-cmd"]).replaceAll("{model}", model).replaceAll("{prompt}", pf).replaceAll("{images}", imf);
  for (let a = 0; a < 3; a++) {
    const r = await sh(cmd); // async: --parallel judges really run side by side (v2.4.0; spawnSync serialised them)
    try { const j = JSON.parse(r.stdout.match(/\{[\s\S]*\}/)[0]); const res = { model, seed, pair, order: { A: order[0], B: order[1] }, raw: j, [pair[0]]: j[order.indexOf(pair[0]) ? "B" : "A"], [pair[1]]: j[order.indexOf(pair[1]) ? "B" : "A"] };
      writeFileSync(join(jd, `${base}.json`), JSON.stringify(res, null, 1)); console.log(`judged ${slug} s${seed} ${pair.join(" vs ")} ${model}`); return res; } catch { console.log(`judge retry ${slug} s${seed} ${model}: ${(r.stderr || r.stdout).slice(0, 200)}`); }
  }
  return null;
}
const total = (s) => AX.reduce((a, k) => a + (s[k] || 0) * W[k], 0) / 5;

// Cost (v2.11, scripts/cost.mjs): per build, tokens in/out, wall-clock time, tool calls by type, retries with reasons,
// completed or not, and the route the agent stated. Written to <out>/cost.json after every generate call, and by the
// `cost` phase from the transcripts already on disk.
function writeCost() {
  if (!existsSync(OUT)) { console.log("cost: no run folder"); return; }
  const c = costAggregate(OUT); const t = c.totals;
  console.log(`cost: ${t.builds} build(s), ${t.completed} completed · ${t.tokens_in} in / ${t.tokens_out} out tokens · ${Math.round(t.elapsed_ms / 1000)}s · ${t.tool_calls} tool calls · ${t.retries} retries → ${join(OUT, "cost.json").replace(ROOT + "/", "")}`);
}

// The originality arm (v2.11): the gate checks one page; this checks that different briefs did not come out as the same
// shape. For each arm and each seed index, the builds of every brief in the run are compared pairwise on the six axes of
// scripts/originality.mjs (structure, composition, image, typography, interaction, signature). Writes originality.json
// and originality.md in --out. Returns null when not verified (no browser), else { pass }.
export const ORIGINALITY_THRESHOLD = 0.4;
function originalityArm() {
  const script = join(SKILL, "scripts/originality.mjs"); const result = { threshold: ORIGINALITY_THRESHOLD, generated: new Date().toISOString(), arms: {} };
  const md = [`# Originality arm`, "", `Builds for different briefs, same arm and seed, compared on six axes (0 = nothing shared, 1 = the same). Every axis must stay below ${ORIGINALITY_THRESHOLD}.`, ""];
  const built = (d) => existsSync(join(d, "index.html")) || ["out", "dist", "build", ".output/public", "_site", "public"].some((x) => existsSync(join(d, x, "index.html")));
  let notVerified = false;
  for (const cond of arms) {
    const arm = { sets: [], repeats: [], max: {}, pass: true };
    for (let k = 0; k < N; k++) {
      const set = only.map((slug) => ({ slug, seed: BRIEFS[slug].seeds[k], dir: join(OUT, slug, `${cond}-s${BRIEFS[slug].seeds[k]}`) })).filter((x) => x.seed && built(x.dir));
      if (set.length < 2) continue;
      const g = spawnSync(process.execPath, [script, ...set.map((x) => x.dir), "--json", "--labels", set.map((x) => x.slug).join(",")], { encoding: "utf8", maxBuffer: 64 << 20 });
      if (g.status === 3) { console.log(`originality ${cond} seed#${k + 1}: ${(g.stdout || g.stderr).trim().split("\n")[0]}`); notVerified = true; continue; }
      let rep; try { rep = JSON.parse(g.stdout); } catch { console.log(`originality ${cond} seed#${k + 1}: no report (${(g.stderr || g.stdout).slice(0, 200)})`); notVerified = true; continue; }
      arm.sets.push({ seedIndex: k + 1, builds: set.map((x) => x.dir.replace(ROOT + "/", "")), pairs: rep.pairs.map(({ a, b, score, over }) => ({ a, b, score, over })), max: rep.max, pass: rep.pass });
      for (const p of rep.pairs) if (p.over.length) arm.repeats.push({ seedIndex: k + 1, a: p.a, b: p.b, axes: p.over });
      for (const [ax, v] of Object.entries(rep.max)) arm.max[ax] = Math.max(arm.max[ax] ?? 0, v ?? 0);
      arm.pass &&= rep.pass;
      md.push(`## ${cond}, seed #${k + 1}`, "", `| Pair | structure | composition | image | typography | interaction | signature | overall |`, `|---|---:|---:|---:|---:|---:|---:|---:|`, ...rep.pairs.map((p) => `| ${p.a} × ${p.b} | ${["structure", "composition", "image", "typography", "interaction", "signature", "overall"].map((ax) => `${p.score[ax].toFixed(2)}${ax !== "overall" && p.score[ax] >= ORIGINALITY_THRESHOLD ? " ✗" : ""}`).join(" | ")} |`), "");
      console.log(`originality ${cond} seed#${k + 1}: ${set.length} builds, ${rep.pairs.length} pairs, ${rep.pass ? "PASS" : `FAIL (${rep.pairs.filter((p) => p.over.length).length} repeat pair(s))`}`);
    }
    if (arm.sets.length) result.arms[cond] = arm; else console.log(`originality ${cond}: fewer than two built briefs per seed, nothing to compare`);
  }
  if (!Object.keys(result.arms).length) { if (notVerified) { console.log("originality: not verified"); return null; } console.log("originality: nothing to compare (needs at least two briefs built in one arm)"); return { pass: true }; }
  mkdirSync(OUT, { recursive: true }); writeFileSync(join(OUT, "originality.json"), JSON.stringify(result, null, 1)); writeFileSync(join(OUT, "originality.md"), md.join("\n") + "\n");
  return { pass: Object.values(result.arms).every((a) => a.pass) && !notVerified };
}

async function main() {
  if (flags["dry-run"]) { // list, write nothing
    const list = runs(); const b = only.map((s) => BRIEFS[s]);
    console.log(`dry run · phase ${phase || "(none)"} · out ${OUT} · nothing written`);
    for (const s of only) console.log(`brief ${s}: evals/briefs/${BRIEFS[s].file}${BRIEFS[s].v5 ? ` · v5 · Tier ${BRIEFS[s].tier} — ${V5_TIERS[BRIEFS[s].tier]} (stated in every prompt)` : TIER !== null ? ` · forced Tier ${TIER}` : ""}`);
    console.log(`arms ${arms.join(",")} · seeds per brief ${Math.min(N, ...b.map((x) => x.seeds.length))} · ${list.length} run(s):`);
    for (const r of list) console.log(`  ${r.slug} ${r.cond} s${r.seed} → ${r.dir}`);
    if (list[0]) console.log(`first prompt (${list[0].cond}): ${promptFor(list[0]).split("\n")[0].slice(0, 400)}`);
    return;
  }
  if (phase === "generate") {
    mkdirSync(OUT, { recursive: true }); const todo = runs().filter((r) => flags.force || !existsSync(join(r.dir, "run.json")));
    const meta = await runMeta(todo); const mf = join(OUT, "meta.json");
    if (existsSync(mf)) { try { const old = JSON.parse(readFileSync(mf, "utf8")); const { previous = [], ...last } = old; meta.previous = [...previous, last]; } catch {} } // one folder, several generate calls (skill, then matched): keep each
    writeFileSync(mf, JSON.stringify(meta, null, 1));
    // content-addressed cache (v2.5.0, C8): key = (brief, seed, arm, skill tree hash, model); see evals/bench-cache.mjs
    const run1 = flags.agent === "raw-api" ? runRawAgent : runAgent;
    const cacheDir = flags["no-cache"] ? null : resolve(flags["cache-dir"] || join(ROOT, "evals/.cache/runs"));
    const model = flags.model || flags["claude-model"] || (flags["cache-unpinned"] ? `unpinned:${meta.adapter?.name}:${meta.adapter?.version}` : null);
    if (cacheDir && !model) console.log("cache: off for this call (model not pinned; pass --model, or --cache-unpinned to key on the adapter's default)");
    const skillHash = cacheDir && model ? skillTreeHash(SKILL) : null; const cacheStats = { hits: 0, misses: 0, stored: 0 };
    const cached = async (r) => {
      if (!skillHash) return run1(r);
      const arm = r.cond === "matched" ? `matched:budget=${matchBudget(r).budget}` : COMPETITORS[r.cond] ? `${r.cond}:${skillTreeHash(COMPETITORS[r.cond].dir)}` : r.cond;
      const parts = { brief: generatorBrief(r.slug) + (TIER === null ? "" : `\n[tier ${TIER}]`), seed: r.seed, arm, skillHash, model };
      const key = cacheKey(parts);
      const hit = cacheLookup(cacheDir, key, r.dir);
      if (hit) { cacheStats.hits++; const rj = join(r.dir, "run.json"); const m = JSON.parse(readFileSync(rj, "utf8")); writeFileSync(rj, JSON.stringify({ ...m, cache: { hit: true, key, stored: hit.stored } }, null, 1)); console.log(`${r.slug} ${r.cond} s${r.seed}: cache hit ${key.slice(0, 12)}`); return; }
      cacheStats.misses++; await run1(r);
      try { const m = JSON.parse(readFileSync(join(r.dir, "run.json"), "utf8")); if (m.exit === 0 && m.output) { const { brief, ...rest } = parts; if (cacheStore(cacheDir, key, r.dir, parts)) cacheStats.stored++; writeFileSync(join(r.dir, "run.json"), JSON.stringify({ ...m, cache: { hit: false, key, ...rest } }, null, 1)); } } catch {}
    };
    await pool(todo, +(flags.parallel || 4), cached);
    if (skillHash) { meta.cache = { dir: cacheDir.replace(ROOT + "/", ""), skill_tree_sha256: skillHash, model, ...cacheStats }; console.log(`cache: ${cacheStats.hits} hit(s), ${cacheStats.misses} miss(es), ${cacheStats.stored} stored`); }
    // after the runs: the models the agents actually reported (Claude Code's stream-json init event), next to the pinned one
    meta.finished = new Date().toISOString(); meta.models_reported = [...new Set(todo.flatMap((r) => { try { return readFileSync(join(r.dir, "transcript.jsonl"), "utf8").split("\n").filter((l) => l.includes('"model"')).map((l) => { try { const j = JSON.parse(l); return j.model || j.message?.model; } catch { return null; } }).filter(Boolean); } catch { return []; } }))];
    writeFileSync(join(OUT, "meta.json"), JSON.stringify(meta, null, 1));
    writeCost(); return;
  }
  if (phase === "cost") { writeCost(); return; }
  if (phase === "measure") {
    const req = createRequire(join(process.cwd(), "noop.js")); let pw; try { pw = await import(req.resolve("playwright")); pw = pw.chromium ? pw : pw.default; } catch { console.log("not verified — no browser (Playwright not found from the current folder)"); process.exit(3); }
    await pool(runs().filter((r) => existsSync(join(r.dir, "run.json")) && (flags.force || !existsSync(join(r.dir, "checks.json")))), +(flags.parallel || 3), async (r) => { try { await measure(r, pw); console.log(`measured ${r.slug} ${r.cond} s${r.seed}`); } catch (e) { console.log(`MEASURE FAILED ${r.slug} ${r.cond} s${r.seed}: ${String(e).split("\n")[0]} (no checks.json; the pair stays not scored)`); process.exitCode = 1; } }); return;
  }
  if (phase === "judge") {
    if (!flags["judge-cmd"]) { console.error("--judge-cmd is required"); process.exit(1); }
    const models = String(flags.models || "gpt_5_4,gemini_3_1_pro").split(",");
    const jobs = only.flatMap((slug) => BRIEFS[slug].seeds.slice(0, N).flatMap((seed) => PAIRS.flatMap((pair) => models.map((m) => ({ slug, seed, m, pair })))))
      .filter((j) => flags.force || !existsSync(join(OUT, j.slug, "judge", `s${j.seed}-${pairTag(j.pair)}${j.m}.json`)))
      .filter((j) => j.pair.every((c) => existsSync(join(OUT, j.slug, `${c}-s${j.seed}`, "checks.json")) && !JSON.parse(readFileSync(join(OUT, j.slug, `${c}-s${j.seed}`, "checks.json"))).missing));
    await pool(jobs, +(flags.parallel || 4), (j) => new Promise((ok) => setImmediate(async () => ok(await judgePair(j.slug, j.seed, j.m, j.pair))))); return;
  }
  if (phase === "originality") {
    const res = originalityArm(); if (res === null) process.exit(3); process.exitCode = res.pass ? 0 : 1; return;
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
    // totals per pair across briefs, with an exact two-sided sign test on wins vs losses (ties dropped) (v2.5.0, A4)
    out.totals = {};
    for (const pair of PAIRS) { const k = pair.join("-vs-"); const es = Object.values(out.briefs).map((b) => (pairTag(pair) ? b[k] : b)).filter((e) => e && e.pair && e.pair.join() === pair.join());
      const w = es.reduce((n, e) => n + e.wins, 0), l = es.reduce((n, e) => n + e.losses, 0), t = es.reduce((n, e) => n + e.ties, 0), ns = es.reduce((n, e) => n + e.notScored, 0);
      out.totals[k] = { pair, pairs: w + l + t + ns, wins: w, losses: l, ties: t, notScored: ns, signTestP: signTest(w, l) };
      console.log(`TOTAL ${k}: ${pair[1]} ${w}–${l}–${t} (wins–losses–ties), not scored ${ns}, sign test p=${signTest(w, l).toPrecision(3)}`); }
    // cost per arm (scripts/cost.mjs), when cost.json exists
    if (existsSync(join(OUT, "cost.json"))) { try { const c = JSON.parse(readFileSync(join(OUT, "cost.json"), "utf8")); out.cost = { totals: c.totals, by_arm: c.by_arm, by_route: c.by_route }; } catch {} }
    // the originality arm (scripts/originality.mjs), when it ran: per arm, the worst score per axis and the repeats
    const of = join(OUT, "originality.json");
    if (existsSync(of)) { try { const o = JSON.parse(readFileSync(of, "utf8")); out.originality = Object.fromEntries(Object.entries(o.arms).map(([arm, a]) => [arm, { pass: a.pass, max: a.max, repeats: a.repeats }])); for (const [arm, a] of Object.entries(out.originality)) console.log(`ORIGINALITY ${arm}: ${a.pass ? "every cross-brief pair below" : `${a.repeats.length} repeat(s) at or above`} ${o.threshold} · max ${Object.entries(a.max).map(([k, v]) => `${k} ${v ?? "–"}`).join(" ")}`); } catch (e) { out.originality = { error: String(e.message || e) }; } }
    writeFileSync(join(OUT, "summary.json"), JSON.stringify(out, null, 1));
    for (const [s, b] of Object.entries(out.briefs)) for (const e of [b, ...Object.values(b).filter((x) => x && x.pair)]) if (e.pair) console.log(`${s.padEnd(10)} ${e.pair.join(" vs ").padEnd(18)} ${e.outcome.padEnd(16)} ${e.pair[1]} wins ${e.wins}, losses ${e.losses}, ties ${e.ties}, not scored ${e.notScored} · ` + e.pairs.map((p) => `s${p.seed}: ${p[e.pair[0]].gated?.toFixed(1)} vs ${p[e.pair[1]].gated?.toFixed(1)}`).join(" · "));
    return;
  }
  console.log("usage: node evals/run-agent-benchmark.mjs <generate|measure|judge|score|originality|cost> --out <dir> [--n 3] [--only studio,hotel] [--arms baseline,gated,skill] [--pairs baseline:skill,gated:skill] [--tier 4] [--parallel 4] [--judge-cmd …]");
  process.exit(phase ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
