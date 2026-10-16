<div align="center">

# Motomation Design

**An agent skill that designs like a person with taste.**
Original, award-level websites that are minimal, modern and typography-led, with motion as the signature.
At the top tier, scrolling plays like a film.

**New here? [Start here → what it is, who it's for, and what a session looks like](ABOUT.md)** · **[See it in action → worked examples](#see-it-in-action)**

[![License: MIT](https://img.shields.io/badge/license-MIT-111111?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.7.0-E0442B?style=flat-square)](CHANGELOG.md)
[![Agent Skill](https://img.shields.io/badge/agent%20skill-npx%20skills%20add-111111?style=flat-square)](#install)
[![Zero dependencies (gate: Playwright, optional)](https://img.shields.io/badge/scripts-zero%20dependencies%20%28gate%3A%20Playwright%2C%20optional%29-111111?style=flat-square)](skills/asfakulsiam-motomation-design/scripts)

```bash
npx skills add asfakulsiam/asfakulsiam-motomation-design
```

<img src="https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/demo-hook.png?raw=true" alt="Demo page: the words SCROLL IS THE PLAYHEAD in a huge condensed typeface on near-black, letters thinning where the cursor passes" width="100%">
<img src="https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/demo-film.png?raw=true" alt="Demo page mid-scroll: a ring of strands orbiting in 3D beside the word ORBIT, with a timecode rail reading 00:10:19 of 00:24:00" width="100%">

<sub>Above: <a href="skills/asfakulsiam-motomation-design/examples/html/motomation-film.html">examples/html/motomation-film.html</a>, a complete Tier 5 Motomation page in one HTML file with no build step.</sub>

</div>

## See it in action

Real sessions, copied with their commands, outputs, screenshots and gate results. Open one before reading the rest. All of them, with the agent, tier and result of each: [examples/prompts/README.md](skills/asfakulsiam-motomation-design/examples/prompts/README.md).

| Example | What it shows |
|---|---|
| [**Flagship: one prompt, the whole skill**](skills/asfakulsiam-motomation-design/examples/prompts/showcase.md) | Every step of the full route on one page: collision draw, CSV choices, an Anti-Sameness Check that fails the first plan, Restraint Gate record, Tier 2 tide rail, gate and a stamp traced field by field |
| [Tier 5 showcase: one film page, every step](skills/asfakulsiam-motomation-design/examples/prompts/showcase-tier5.md) | A scroll-as-film page through its pipeline: storyboard, timing sheet, 270 reproducible frames, the gate with its Q and A axes, the stamp and `--verify` |
| [Hero section](skills/asfakulsiam-motomation-design/examples/prompts/hero.md) | One viewport for a real craft: collision draw, memory check, build, gate, stamp, Restraint Gate log |
| [Four-page site](skills/asfakulsiam-motomation-design/examples/prompts/full-site.md) | A whole small site from one prompt: Thinking Sequence, data-file choices, one signature across pages, a gate and verified stamp per page |
| [Fix an existing page](skills/asfakulsiam-motomation-design/examples/prompts/fix-existing.md) | The short route on a real failing page: route stated, cause named, a 3-line fix, gate before (32 failures) and after (0) |
| [Component swap](skills/asfakulsiam-motomation-design/examples/prompts/component.md) | `HoldToCommit` dropped into an existing React app: search, choice, diff, typecheck, gate, interaction test |

---

## Why this exists

Ask any AI for a website and you get the same page: a centred headline, two buttons, a logo wall, three icon features, a purple gradient. The page looks the same because the **thinking** is the same.

Motomation Design changes the thinking:

| | Typical AI output | With Motomation Design |
|---|---|---|
| **Starts with** | A layout template | A **tension** in the brief, resolved into a **concept** |
| **Structure** | Hero → logos → features → pricing | One of 20 **archetypes** (Ledger, Film Reel, Letter, Atlas…), deliberately **mutated** |
| **Ideas** | The most likely next token | A **collision** with an unrelated world, drawn by a real random engine |
| **Memory** | None. It repeats itself | A project log the agent checks, so the next design **actively avoids** recent structural choices |
| **Type** | Inter at 48px | Type is the image, chosen with a reason and set at 8–28vw |
| **Motion** | Fade-up on everything | Five tiers, four questions, reduced motion designed in, and **Motomation** at the top |
| **Delivery** | "Here's your page!" | A six-axis critique score, a 25-point AI-default scan, and a handoff note |

---

## What's inside

- **The Thinking Sequence:** seven steps that make an agent think like a designer: tension → concept → archetype + mutation → forced collision → signature move → anti-sameness check → restraint gate.
- **Mad Artist Mode:** ten invention techniques plus a collision engine (`collide.mjs`) that draws constraints with a cryptographic random number generator instead of the model's most likely choice, without repeats inside a run. It pushes ideas away from the default; it can't promise an idea nobody has had.
- **Five motion tiers:** CSS → GSAP/ScrollTrigger/SplitText/Lenis → View Transitions, Flip, Lottie, Rive → WebGL, shaders, WebGPU → **Motomation**.
- **Motomation (Tier 5):** scroll-as-film. Storyboards with timecodes, image-sequence, video-scrub and DOM-timeline techniques, ffmpeg pipelines, frame budgets, and a designed reduced-motion storyboard.
- **22 signature moves**, each with idea, reason, code, the detail that matters, an off-switch, and a **paste-ready prompt** for any AI tool.
- **A house style:** minimal canvas, maximal type, one accent, editorial grid, motion with weight.
- **3 dials** (Energy, Rhythm, Motion, each 1–3), set from the brief; no presets.
- **12 site categories** and **10 visual styles**, each with its own guidance.
- **Searchable data:** 68 components, 80 fonts (with axes, licences and script coverage, 15 of them Bangla, Devanagari or Arabic), 40 contrast-verified palettes (light and dark pairs), 50 motion recipes with timings, 12 imagery directions (one per category), 20 archetypes, 12 mutations, 40 collision sources.
- **A Delivery Gate:** a self-critique score, a 25-point AI-default scan and a craft checklist.
- **A component library:** 68 original effect components in 8 families (type, text, scroll, cursor, backgrounds, layout, ui, micro-interactions), each one file with props, a reduced-motion path and touch behaviour, a live gallery and a shadcn-style registry. See [Component library](#component-library).
- **Production examples:** 9 strict-TypeScript React components, a shared GSAP setup module (`lib/gsap.ts`) and a single-file HTML Motomation demo.
- **Evals:** 8 test briefs, a weighted rubric and a release gate against a no-skill baseline.

---

## Results

### Benchmark v4 (2026-10-12) — builds only, not scored

78 builds were generated at `6f15d45` in Claude Code 2.1.286: 30 matched-effort-vs-skill pairs (5 briefs × 6 seeds) and 9 Tier 4 motion pairs (baseline vs skill). The measurement step ran on GitHub Actions, but its output was never committed. **No v4 pair has been measured or judged, so there are no v4 scores, wins or p-values.** The table below is still v3. Build data that v4 does support: matched-effort enforcement held in 10 of 30 pairs, and 17 of 30 matched runs ended on the turn cap. Report: [`evals/results/2026-10-12-benchmark-v4.md`](evals/results/2026-10-12-benchmark-v4.md).

### Benchmark v3 (2026-10-12)

**Commit tested: [`6f2724f`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/commit/6f2724f5299a19cd55cb94cbad886c1c6af38fd6)** (`6f2724f5299a19cd55cb94cbad886c1c6af38fd6`). Five briefs × three seeds, built in Claude Code 2.1.286 by `claude_sonnet_5_5` in four arms (baseline, baseline + `gate.mjs`, skill, matched-effort baseline) plus three competitor skills, a Tier 4 motion run and a Codex CLI run: 133 builds. Measured on GitHub Actions (Chromium 147, axe-core 4.14.0), judged blind in pairs by GPT-5.4 and Gemini 3.1 Pro. Reports: [main](evals/results/2026-10-12-benchmark-v3.md) · [motion](evals/results/2026-10-12-benchmark-v3-motion.md) · [competitors](evals/results/2026-10-12-benchmark-v3-competitors.md) · [Codex](evals/results/2026-10-12-benchmark-v3-codex.md).

| Skill vs… (15 blind pairs each) | Skill W–L–T | Mean gated (other → skill) | Mean raw (other → skill) |
|---|---|---|---|
| Baseline (no skill) | **12–2–1** | 43.4 → 83.7 | 62.8 → 88.9 |
| Baseline + `gate.mjs` | **14–1–0** | 65.5 → 86.4 | 65.5 → 91.4 |
| Matched-effort baseline | **10–5–0** | 63.7 → 80.4 | 77.3 → 85.5 |
| taste-skill | **14–1–0** | 47.2 → 87.2 | 56.1 → 92.2 |
| ui-ux-pro-max | **14–1–0** | 66.1 → 86.2 | 66.1 → 90.8 |
| frontend-design (Anthropic) | **11–3–1** | 55.5 → 81.6 | 72.4 → 87.0 |
| Tier 4 motion, full rubric (9 pairs) | 7–2–0 | 53.1 → 83.4 | 74.8 → 83.4 |
| Tier 4 motion, motion only from `gate.mjs --report` strips (9) | **3–6–0** | 77.3 → 64.4 | — |
| Codex CLI + `gpt_5_4` (5 pairs, 1 seed) | 3–2–0 | 77.0 → 76.2 | 77.0 → 76.2 |

| Brief (mean gated of 3 seeds) | Baseline → skill | Gated baseline → skill | Matched → skill |
|---|---|---|---|
| 07 Architecture studio | 83.8 → 78.7 | 67.0 → 90.8 | 84.7 → 84.0 |
| 04 Boutique hotel | 49.0 → 96.3 | 73.2 → 95.5 | 53.8 → 82.2 |
| 03 Ceramics shop | 49.5 → 61.5 | 67.7 → 61.5 | 86.0 → 56.2 |
| 02 Developer tool (SaaS) | 34.7 → 90.3 | 57.5 → 92.7 | 44.8 → 91.8 |
| 05 Climate non-profit | 0.0 → 91.7 | 62.2 → 91.3 | 49.0 → 87.8 |

What v3 found, including where the skill lost:
- **The gate is about half the win.** A baseline that only runs `gate.mjs` has no hard-gate failures (0 of 15, against 6 for the plain baseline) but isn't better designed (raw 73.0 → 68.3 against the plain baseline), and the skill still beats it 14–1.
- **Effort explains part of v2's 15–0.** A baseline told to work about as long as the skill beats the plain baseline 12–0–3 and takes 5 of 15 pairs from the skill, including all three ceramics-shop seeds. 10–5 is not significant with 15 pairs (sign test p≈0.30).
- **On motion alone the skill lost.** At Tier 4, judged only from the gate's scroll-frame strips, the baseline won 6 of 9 seeds. The weakest axis was the reduced-motion fallback (2.50 vs 4.39 of 5). Every skill page reached for WebGL.
- **In Codex the gate often couldn't run** (the headless browser crashed or timed out in a loaded sandbox). 3 of 5 skill runs shipped without a verified pass, and the SaaS page broke.
- **One skill page failed a hard gate** (ceramics s3103: dimmed scroll-sequence steps at 2.1:1 that `gate.mjs` measured only in their active state).

#### Before and after (v3)

**Public interest (brief 05), s5102: won, 0 vs 98.5.** The baseline fails axe contrast; the skill sets the Bangla line as the headline.
<img src="https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/benchmark-images/v3-public-5102.webp?raw=true" alt="Public-interest brief, v3 seed 5102: without the skill a two-colour hero that fails contrast (gated 0, raw 47.0); with the skill a large Bangla headline on cream with a mangrove-root drawing (98.5)" width="100%">

**Ceramics shop (brief 03), s3102: lost to the matched-effort baseline, 89.5 vs 77.5.** A baseline told to keep refining built a clearer product page.
<img src="https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/benchmark-images/v3-ecommerce-3102-matched.webp?raw=true" alt="Ceramics brief, v3 seed 3102: the matched-effort baseline with a large serif headline and a cup card (89.5); the skill with a product-sheet layout (77.5)" width="100%">

**Studio (brief 07), s7101: lost to Anthropic's frontend-design skill, 89.0 vs 65.0.**
<img src="https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/benchmark-images/v3-studio-7101-frontend-design.webp?raw=true" alt="Studio brief, v3 seed 7101: the frontend-design skill's page (89.0) and the Motomation skill's page (65.0)" width="100%">

**Festival (brief 08), s8102, Tier 4 runner strip: won on the full rubric (0 vs 87.0) and on motion alone (64 vs 94).**
<img src="https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/benchmark-images/v3-festival-8102-strip.webp?raw=true" alt="Festival brief, v3 seed 8102: eight scroll frames for each site at Tier 4" width="100%">

**Launch (brief 06), s6102, Tier 4 runner strip: lost on both (96.5 vs 62.0; motion only 96 vs 40).** The skill's frames overlap mid-transition, and its reduced-motion strip barely differs from full motion.
<img src="https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/benchmark-images/v3-launch-6102-strip.webp?raw=true" alt="Launch brief, v3 seed 6102: eight scroll frames for each site at Tier 4; the baseline's ring changes colour per section, the skill's pinned lamp stays while text overlaps" width="100%">

### Benchmark v2 (2026-10-11)

Run inside a real coding agent ([full report](evals/results/2026-10-11-benchmark-v2.md) · [summary](docs/benchmark-summary.md)). Five briefs, three seeds each, built in Claude Code by the same model (`claude_sonnet_5_5`) with and without the skill: 30 runs, 15 blind pairs. Two judges from other model families (GPT-5.4, Gemini 3.1 Pro) scored every pair against [`evals/rubric.md`](evals/rubric.md) without knowing which was which. Hard gates (contrast, keyboard, reduced motion, placeholders) come from Playwright + axe-core and `gate.mjs` measurements.

| | Without skill | With skill |
|---|---|---|
| Pairs won | 0 of 15 | **15 of 15** |
| Mean gated score | 45.9 | **92.4** |
| Mean raw score (no gates) | 67.1 | **92.4** |
| Pages failing a measured hard gate | 5 of 15 (contrast) | 0 of 15 |

| Brief | Seeds | Baseline gated (mean) | Skill gated (mean) |
|---|---|---|---|
| 07 Architecture studio | 7101–7103 | 74.8 | 96.0 |
| 04 Boutique hotel | 4101–4103 | 0.0 (all three fail contrast) | 91.7 |
| 03 Ceramics shop | 3101–3103 | 47.3 | 93.2 |
| 02 Developer tool (SaaS) | 2101–2103 | 40.0 | 93.2 |
| 05 Climate non-profit | 5101–5103 | 67.3 | 88.0 |

The skill won every v2 pair before the gates too. v3 tested what v2 couldn't (matched effort, a gate-only baseline, motion from strips, competitors, a second agent), and the margin shrank on each of those tests.

#### Before and after (v1, v2)

Same brief, same model, same seed: without the skill on the left, with it on the right. Losses are included.

**Hotel (brief 04), v2: won.** Without the skill the page fails contrast (gated 0); with it, a full-height door with the name set large (98.5).
<img src="https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/benchmark-images/v2-hotel-4102.webp?raw=true" alt="Hotel brief, seed 4102: without the skill a conventional page that fails contrast (gated 0); with the skill a full-height door with the name set large (98.5)" width="100%">

**Hotel (brief 04), v1: lost, 54.5 vs 88.5.** The door-split hero breaks the name into "Have li", the page overflows a phone by 105px, and room prices flip through wrong digits. The gate that now catches all three (`words`, `overflow`, `numbers`) was built because of this page.
<img src="https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/benchmark-images/hotel-before-after.webp?raw=true" alt="Hotel brief, v1: without the skill a clean cream page with a small door (88.5); with the skill a dark riveted door filling the screen with the name split as 'Have li' (54.5)" width="100%">

**SaaS (brief 02), v2: won every pair, lost on variety.** Three seeds, three wins (94, 93.5, 92), and three versions of the same page: a big serif headline on the left, a log panel on the right. The cause (the evaluator's note leaking into the prompt) is fixed in v2.4.0; see the [variety report](evals/results/2026-10-11-variety.md).
<img src="https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/benchmark-images/v2-saas-sameness.webp?raw=true" alt="SaaS brief, v2: the three skill pages for seeds 2101, 2102 and 2103 side by side, each a large headline left and a log panel right" width="100%">

**SaaS (brief 02), v1: won, 95.5 vs 44.5.** A generic dark template that overflows a phone, against a page where the log stream is the hero.
<img src="https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/benchmark-images/saas-before-after.webp?raw=true" alt="SaaS brief, v1: without the skill a generic dark landing page (44.5); with the skill a serif headline over a scrolling log stream (95.5)" width="100%">

**Studio (brief 07), v2: won, 74.5 vs 96.5.**
<img src="https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/benchmark-images/v2-studio-7101.webp?raw=true" alt="Studio brief, seed 7101: without the skill 74.5, with the skill 96.5" width="100%">

**Public interest (brief 05), v1: won.** A conventional layout against a bilingual manifesto that keeps the one real figure with its source.
<img src="https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/benchmark-images/public-before-after.webp?raw=true" alt="Public-interest brief, v1: a conventional layout without the skill; a bilingual manifesto with the skill" width="100%">

**What v2 didn't show, and what v3 did about it:** effort wasn't matched (v3: matched-effort arm, skill 10–5); the judges saw the measured checks (still true in v3); motion was judged from stills (v3: motion-only judging from strips, skill 3–6); one agent and one model (v3: a one-seed Codex run, 3–2). The v1 single-prompt benchmark (3 of 5 won) is kept in the [CHANGELOG](CHANGELOG.md) and its [report](evals/results/2026-10-11-benchmark.md).

## Install

### Coding agents (recommended)

```bash
npx skills add asfakulsiam/asfakulsiam-motomation-design          # this project
npx skills add asfakulsiam/asfakulsiam-motomation-design -g       # all your projects
npx skills add asfakulsiam/asfakulsiam-motomation-design -a claude-code -a cursor   # specific agents
```

This works with the agents supported by the open [`skills`](https://github.com/vercel-labs/skills) CLI, including **Claude Code, Codex, Cursor, Windsurf, Gemini CLI, GitHub Copilot, Antigravity, Cline, Roo Code, Kiro, OpenCode, Goose, Junie, Amp, Zed** and more.

### Claude Code plugin

```
/plugin marketplace add asfakulsiam/asfakulsiam-motomation-design
/plugin install asfakulsiam-motomation-design@asfakulsiam-motomation-design
```

### Gemini CLI extension

```bash
gemini extensions install https://github.com/asfakulsiam/asfakulsiam-motomation-design
```

### Chat and app builders (ChatGPT, Claude.ai, Grok, Google AI Studio, v0, Lovable, Bolt)

These tools can't run `npx`, so use the single-file edition: **[`dist/motomation-design.md`](dist/motomation-design.md)**.

| Tool | Where to put it |
|---|---|
| **ChatGPT** | Project files or a custom GPT's knowledge, plus the instruction *"Follow motomation-design.md for every web design task."* |
| **Claude.ai** | Project knowledge, or upload the `skills/asfakulsiam-motomation-design` folder as a skill where your plan supports it |
| **Grok / Google AI Studio / Gemini** | Paste it into the system instructions, or attach it to the chat |
| **v0 / Lovable / Bolt / Replit** | Project knowledge, rules or custom instructions |

Without a shell, the skill uses the data tables included at the end of the file instead of its scripts.

**Small context?** Custom instructions, rules files and prompt boxes often cap out at a few thousand tokens. Use **[`dist/motomation-lite.md`](dist/motomation-lite.md)** there: <!-- lite-tokens -->about 7.7k tokens<!-- /lite-tokens --> (estimated by the build script) with the five laws, flow, tiers, bans, the seven-step Thinking Sequence, the AI-default scan, the craft checklist and short lists of archetypes, mutations and signatures. `node scripts/build-lite.mjs` regenerates it, and `check-repo` fails if it goes stale or over 8k tokens.

### Update

```bash
npx skills update asfakulsiam-motomation-design
```

---

## Quick start

```text
/build portfolio for a motion designer in Dhaka who wants title-sequence work
/shape boutique hotel in a restored 1890s house in Puran Dhaka --energy=1 --rhythm=2
/invent ceramics shop
/motomate the product chapter --tier=5
/critique https://your-site.com
```

Or just ask in plain words ("design a landing page for my app"). The skill triggers on any web design task and runs `/build` by default.

---

## Commands

Each command lists **what** it does, **when** to use it and **where** it applies.

### Create

| Command | What it does | When to use it | Where it applies |
|---|---|---|---|
| `/shape [brief]` | Turns a brief into a direction **without code**: brief inference, Thinking Sequence, dials, `DESIGN.md` + `MOTION.md` | At the very start, or when a client must approve the direction | A new project or page |
| `/build [brief]` | The full flow: plan → preview block → complete code → Delivery Gate → handoff | You want a finished page or site | New pages, whole sites |
| `/invent [topic]` | Runs the collision engine and proposes **3 different concepts** | You're stuck, or the first idea feels familiar | Before `/build`, or to rethink a section |
| `/signature [section]` | Invents **one** memorable move tied to the concept | The page works but nobody will remember it | A hero, a section or a whole site |
| `/motomate [section]` | Turns a section into a **Tier 5 scroll-film**: storyboard, technique, assets, code, fallback | A product, place or story should play like a film | Product launches, hero chapters, case studies |
| `/animate [target] --tier=n` | Adds motion at a given tier, following the four questions | The design is done but static | Any existing component or page |
| `/type [target]` | Typography pass: face, scale, tracking, wrapping, numerals, variable axes | The page feels generic (it's usually the type) | Any page |

### Tune

| Command | What it does | When to use it | Where it applies |
|---|---|---|---|
| `/bolder [target]` | Raises ENERGY one step: bigger type jumps, braver accent, one more grid break | It's correct but timid | Heroes, landing pages |
| `/quieter [target]` | Lowers ENERGY/MOTION one step: more air, fewer moving parts | It's busy or tiring | Content pages, organisations |
| `/distill [target]` | Cuts to the essential: one signature, one accent, fewer sections | It tries to do too much | Anywhere |
| `/mutate [target]` | Keeps the content, changes the **structure** (new archetype or mutation) | The layout feels like a template | Homepages, landing pages |
| `/overdrive [target]` | Generate → critique → improve loop, up to 3 rounds, until every axis scores 4+ | Flagship pages that must be excellent | Homepages, launch pages |

### Evaluate and ship

| Command | What it does | When to use it | Where it applies |
|---|---|---|---|
| `/critique [target or URL]` | A scored design review: top 3 problems, fixes, what to keep | Before revisions, or to review any site | Your work or a reference |
| `/audit [target]` | A technical gate: accessibility, performance, reduced motion, mobile matrix, SEO, AI-default scan | Before launch | Any codebase |
| `/study [URL or screenshot]` | Extracts the **design DNA** of a reference into `DESIGN.md` (type, palette, layout, motion, signature) without copying it | You love a site and want its principles, not its layout | References and competitors |
| `/polish [target]` | The last pass: spacing, details, states, OG image, stamp and memory log | Right before shipping | Finished pages |

### Meta

| Command | What it does |
|---|---|
| `/dials` | Shows or sets the dials: `/dials energy=3 motion=2` |
| `/help` | Lists commands and suggests your next step |
| `/version` · `/check-update` · `/update-skill` | Version info and update instructions |

### Flags

`--tier=1..5` · `--energy=1..3` · `--rhythm=1..3` · `--motion=1..3` · `--style=<name>` · `--stack=next|react|vanilla|astro` · `--seed=<n>` · `--review` (stop after the plan)

### Typical sequences

- **New site:** `/shape` → approve → `/build` → `/critique` → `/polish`
- **Stuck:** `/invent` → pick one → `/build --review`
- **Existing site feels generic:** `/critique` → `/mutate` → `/type` → `/signature`
- **Product launch:** `/shape --energy=3 --rhythm=3` → `/motomate hero-product` → `/audit`

---

## How it thinks

```
MOTOMATION PLAN
Tension     : 10 years of varied work ↔ clients remember one thing
Concept     : The site is a single film reel; each project is a frame you scrub through
Archetype   : Film Reel, mutated by "invert the axis" (the reel runs sideways while the page scrolls down)
Collision   : 35mm contact sheet → frame numbers, sprocket rail, grease-pencil hover circles
Signature   : Hovering a project circles it in grease pencil; the reel rewinds with a film-leader countdown
Dials       : ENERGY 3 · RHYTHM 2 · MOTION 3 → Tier 5
Type        : Big Shoulders Display / Switzer (cinematic condensed + quiet text)
Palette     : Darkroom: #0E0D0B · #F2EEE6 · safelight #E0442B
Not doing   : A bento grid of thumbnails under "Hi, I'm Rafi"
```

The agent shows this block before it writes any code. Every line comes from a step of the [Thinking Sequence](skills/asfakulsiam-motomation-design/thinking/sequence.md).

---

## Motion tiers

| Tier | Name | Tools | Use it for |
|---|---|---|---|
| 1 | Basic | CSS transitions, keyframes, same-page View Transitions | Every site: hover, focus, press, small reveals |
| 2 | Intermediate | GSAP, ScrollTrigger, SplitText, Lenis | Kinetic type, line reveals, pinned moments |
| 3 | Pro | Cross-page View Transitions, Flip, Lottie, Rive, MorphSVG | Page continuity, illustrated and interactive motion |
| 4 | Max | Three.js, OGL, GLSL, WebGPU | When the concept is spatial, material or lit |
| 5 | **Motomation** | Scrubbed timelines + image sequences / video + optional WebGL, synced by Lenis | Scroll that plays like After Effects |

The rule: **use the lowest tier that delivers the concept.** Tier 5 is the signature, not the default.

---

## Tools inside the skill

Node.js scripts (Node 18+). Everything except the Delivery Gate is zero-dependency: no `npm install` needed.

```bash
cd skills/asfakulsiam-motomation-design      # or your agent's skills folder, e.g. .claude/skills/…
node scripts/collide.mjs --n 3 --spread --category hotel     # real random creative constraints
node scripts/search.mjs fonts "condensed cinematic"          # BM25 search over curated data
node scripts/search.mjs motion "pinned scrub" --tier 5
node scripts/memory.mjs recent                               # what this project already used
node scripts/memory.mjs check --archetype ledger             # exits 2 if it was used recently
node scripts/memory.mjs recent --project /path/to/project    # explicit project folder
node scripts/contrast.mjs "#151412" "#F3F0EA"                # WCAG contrast
```

### Delivery Gate: `gate.mjs` (optional: needs Playwright)

`gate.mjs` renders the page in a real browser and measures what the Delivery Gate asks for:
- contrast against the pixels actually behind each text element (judged by the 10th-percentile sample, with a warning when more than 30% of text can't be measured);
- overflow at 375, 390, 768 and 1440px;
- display words that break at 375px;
- text hidden only under reduced motion;
- missing accessible names;
- heading hierarchy, entrance repetition and JS weight.

It then writes a stamp whose numbers `--verify` can re-check. Playwright is the only dependency in the repo, and it's optional. Without it, the gate prints "not verified — no browser" and exits 3, and every other script works as before.

```bash
npm i -D playwright && npx playwright install chromium       # once, in your project (or globally)
node scripts/gate.mjs path/to/index.html                     # or a URL, or a folder of pages
node scripts/gate.mjs --verify path/to/index.html            # re-scan and check the stamp written in the file
node scripts/gate.mjs site/ --json --out gate-report.json    # machine-readable report
```

The memory log is per project. `memory.mjs` walks up from the folder you run it in to the nearest `package.json` or `.git`, skips the skill's own folder, and writes `<project>/.motomation/log.json`. So running it from inside `.claude/skills/…` still records the project that installed the skill. `--project <dir>` overrides the lookup.

---

## Categories and styles

**Categories:** portfolio · studio/agency · e-commerce · SaaS · hotel · restaurant · organisation/non-profit · event · architecture/real estate · personal brand · product launch · education

**Styles:** minimal · editorial · swiss · neobrutalism · glass · soft/neumorphism · flat/illustrative · kinetic type · organic · dark luxe

Each has its own file with default dials, archetypes, section order, a signature menu, must-haves and pitfalls.

---

## Component library

68 components, all written for this skill, in 8 families:

| Family | Components |
|---|---|
| Type (10) | Blur Focus, Curved Text, Decode, Ink Fill, Letter Relay, Neighbour Moves, Pressure Type, Scroll Float, Split Flap, Width Sprint |
| Text (6) | ASCII Text, Glitch, Rotating Words, Scramble on Hover, Shiny Text, Typewriter |
| Scroll (7) | Aperture, Darkroom Develop, Horizontal Reel, Reading Rail, Stacked Deck, Thread, Velocity Marquee |
| Cursor (6) | Image Trail, Lens, Pixel Wake, Seismograph Line, Target Cursor, Tilt Card |
| Backgrounds (12) | Aurora, Beams, Contour Lines, Dot Field, Globe, Grain, Halftone, Light Sweep, Liquid Field, Mesh Gradient, Meteors, Particle Field |
| Layout (6) | Bento Reveal, Curve Carousel, Dock, Flowing Menu, Infinite Canvas, Sticky Index |
| UI (13) | Animated List, Confetti, Device Mockup, Glare Card, Glow Border, Icon Cloud, Loader Skeleton, Loader Spinner, Orbiting Circles, Rainbow Border, Shimmer Button, Spotlight Card, Terminal |
| Micro-interactions (8) | Brand Selection, Click Spark, Copy Confirm, Count Up, Hold to Commit, Remembered List, Squish Switch, Sticker Scatter |

Each component is one strict-TypeScript React file with no dependencies beyond React and a small shared helper (`_lib/motion.ts`). Its header records the tier, when to use it, when it's slop, and its reduced-motion, touch and accessibility behaviour. The catalogue in [`examples/components/README.md`](skills/asfakulsiam-motomation-design/examples/components/README.md) and `data/components.csv` are generated from those headers, so agents can search them:

```bash
node skills/asfakulsiam-motomation-design/scripts/search.mjs components "photo reveal on scroll"
```

**React-first.** The library is React-first. Plain variants exist for the 5 most-used components. For other components, use the React version. The five ([`vendor/plain/`](vendor/plain/): count-up, split-flap, copy-button, ink-fill, typewriter) each ship a CSS + HTML and a Tailwind variant; they are the components the most page sections and templates import, and a variant that every component carries is a second library to keep in step with the first.

Install one into a project (the file plus the shared helper):

```bash
npx shadcn@latest add https://raw.githubusercontent.com/asfakulsiam/asfakulsiam-motomation-design/main/registry/<id>.json
```

See them all live: open [`examples/gallery/index.html`](skills/asfakulsiam-motomation-design/examples/gallery/index.html) in a browser. It's one self-contained file, passes the skill's own Delivery Gate, and shows every fallback when your OS has reduced motion turned on.

---

## Repository layout

```
skills/asfakulsiam-motomation-design/   ← the installable skill
  SKILL.md            router + core protocol
  thinking/           brief inference, the Thinking Sequence
  invention/          Mad Artist Mode
  structures/         20 page archetypes, section purposes
  principles/         house style, dials, typography, colour, layout, restraint
  motion/             tokens + tiers 1–5 (Motomation)
  signatures/         22 signature-move recipes with prompts
  styles/ categories/ visual languages and site types
  craft/              accessibility, performance, responsive, mobile matrix, SEO, copy
  gates/              the Delivery Gate
  commands/           every command, critique format, updating
  adapters/           Next.js, React + Vite, vanilla, Astro, platform notes
  references/         GSAP + Lenis, effects vocabulary, inspiration libraries
  templates/          DESIGN.md, MOTION.md
  data/               searchable CSVs (fuel, not a menu)
  scripts/            collide, search, memory, contrast
  examples/           React components + single-file HTML demo
    components/       68-component library (catalogue README, one file each)
    gallery/          live demo page for every component
    templates/        page templates as design references (DESIGN.md, structure.md, screenshot; no code)
    builds/           one React build per template, gated as templates/<id>.html (evidence, not a layout)
registry/                    ← one JSON per component for `npx shadcn add`
vendor/plain/                ← CSS + HTML and Tailwind variants of the 5 most-used components (React-first)
dist/motomation-design.md   ← single-file edition for chat tools
evals/                       ← test briefs, rubric, release gate
.claude-plugin/ .cursor-plugin/ .codex-plugin/ gemini-extension.json rules/
```

---

## FAQ

**Will it always use heavy animation?**
No. It picks the lowest tier that delivers the concept. A government service gets Tier 1. Motomation is reserved for stories that should play like a film.

**Does it work without a terminal?**
Yes. Use `dist/motomation-design.md`. The agent picks from the included data tables instead of running scripts.

**Will two sites made with it look the same?**
It actively detects and reduces repetition, but it can't guarantee two sites will never look alike. What exists: the collision engine never repeats an archetype or signature inside one run and reports when a pool runs out; `memory.mjs check` flags archetypes, signatures, fonts, palettes and tiers already used in this project's last five runs; and the Thinking Sequence's anti-sameness step compares structure, type, colour, motion, signature and imagery against the obvious version. Limits: memory only sees the project it lives in, and the no-terminal edition relies on the agent following the rules. The 5-brief benchmark has been run three times ([v3 results](evals/results/2026-10-12-benchmark-v3.md), [v2](evals/results/2026-10-11-benchmark-v2.md), [v1](evals/results/2026-10-11-benchmark.md)); the 3-run variety test in `evals/` has not.

**Which stack does it target?**
It detects your stack, and defaults to Next.js App Router + Tailwind. Adapters cover React + Vite, plain HTML and Astro.

**Is GSAP free?**
Yes. GSAP and all its plugins (SplitText, ScrollTrigger, MorphSVG and more) are free, including for commercial use, under GSAP's own Standard License.

**Can I use effects from component libraries?**
You don't need one. The skill ships its own library of 68 components (see [Component library](#component-library)), all written for this project. If your project already uses another library, the skill checks it first and uses it under that library's licence.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). In short: original work only, short single-purpose files, run `node scripts/check-repo.mjs`, and add an eval brief for new behaviour. To add a gate rule set (a new axis next to copy, SEO, performance and security), follow [docs/adding-a-rule-set.md](docs/adding-a-rule-set.md).

## License

[MIT](LICENSE) © asfakulsiam. Every component, script and document is MIT and original: the repository contains no third-party component code. One exception, not covered by the MIT licence: the runtime files self-hosted for the offline demo in [`examples/html/lib/`](skills/asfakulsiam-motomation-design/examples/html/lib/LICENSES.md) (GSAP under its Standard License, Lenis under MIT, fonts under the SIL OFL), copied unmodified with their notices.

