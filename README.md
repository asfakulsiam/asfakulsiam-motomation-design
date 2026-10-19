<div align="center">

# Motomation Design

**An agent skill that guides a coding agent through research, art direction, build and validation of a website.**
It aims for original, typography-led sites that fit the product, with motion as a deliberate choice. At the top tier, scrolling plays like a film.
The result still depends on the agent, the brief and a human review; the skill does not guarantee award-level output.

**New here? [Start here → what it is, who it's for, and what a session looks like](ABOUT.md)** · **[See it in action → worked examples](#see-it-in-action)** · **[Cheatsheet → every command, flag and tier, with example prompts](docs/CHEATSHEET.md)**

[![License: MIT](https://img.shields.io/badge/license-MIT-111111?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/version-3.0.2-E0442B?style=flat-square)](CHANGELOG.md)
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

**Small context?** Custom instructions, rules files and prompt boxes often cap out at a few thousand tokens. Use **[`dist/motomation-lite.md`](dist/motomation-lite.md)** there: <!-- lite-tokens -->about 8.0k tokens<!-- /lite-tokens --> (estimated by the build script) with the five laws, when the light route applies, the research, scope and media rules, the delivery modes, tiers, bans, the Thinking Sequence (stack, product contract, research, directions, memory, restraint), the AI-default scan, the craft checklist and short lists of archetypes, mutations and signatures. Sections it drops to fit are named at its top. `node scripts/build-lite.mjs` regenerates it, and `check-repo` fails if it goes stale, over 8k tokens, or loses one of those rules.

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

Every command, flag, tier and script with a use case and a copy-paste prompt, plus full-potential recipes: **[docs/CHEATSHEET.md](docs/CHEATSHEET.md)**.


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
- **Check while building, validate at handoff:** `completeness.mjs`, `gate.mjs --rules` and `gate.mjs --journey` during the build; the full `gate.mjs <site>` on the approved files, then `handoff.mjs <site> --report GATE.md` ([gates/handoff.md](skills/asfakulsiam-motomation-design/gates/handoff.md))


---

## Features

### What's inside

- **The Thinking Sequence (v3, research-first):** stack → **product contract** (jobs, journeys, IA, density, states, approved before any concept) → **design research** (questions, sources chosen by what they prove, evidence with limitations) → **directions and synthesis** (2–3 directions compared against the contract; archetypes, mutation, collision and signature are optional tools) → memory and sameness → restraint. An explicit authority order (`principles/authority.md`) keeps opinions advisory and the product intact.
- **Mad Artist Mode:** ten invention techniques plus a collision engine (`collide.mjs`) that draws constraints with a cryptographic random number generator instead of the model's most likely choice, without repeats inside a run. It pushes ideas away from the default; it can't promise an idea nobody has had.
- **Five motion tiers:** CSS → GSAP/ScrollTrigger/SplitText/Lenis → View Transitions, Flip, Lottie, Rive → WebGL, shaders, WebGPU → **Motomation**.
- **Motomation (Tier 5):** scroll-as-film. Storyboards with timecodes, image-sequence, video-scrub and DOM-timeline techniques, ffmpeg pipelines, frame budgets, and a designed reduced-motion storyboard.
- **22 signature moves**, each with idea, reason, code, the detail that matters, an off-switch, and a **paste-ready prompt** for any AI tool.
- **A house style, with its reasons:** minimal canvas, maximal type, one accent, editorial grid, motion with weight, for brand and editorial surfaces; every opinion is in `principles/heuristics.md` with the problem it solves and when to ignore it.
- **3 dials** (Energy, Rhythm, Motion, each 1–3), set from the brief; no presets.
- **12 site categories** and **10 visual styles**, each with its own guidance.
- **Searchable data:** 68 components, 80 fonts (with axes, licences and script coverage, 15 of them Bangla, Devanagari or Arabic), 40 contrast-verified palettes (light and dark pairs), 50 motion recipes with timings, 12 imagery directions (one per category), 23 archetypes, 12 mutations, 40 collision sources.
- **A Delivery Gate:** a self-critique score, a 25-point AI-default scan and a craft checklist.
- **A component library:** 68 original effect components in 8 families (type, text, scroll, cursor, backgrounds, layout, ui, micro-interactions), each one file with props, a reduced-motion path and touch behaviour, a live gallery and a shadcn-style registry. See [Component library](#component-library).
- **Production examples:** 9 strict-TypeScript React components, a shared GSAP setup module (`lib/gsap.ts`) and a single-file HTML Motomation demo.
- **Evals:** 8 test briefs, a weighted rubric and a release gate against a no-skill baseline.


### How it thinks

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


### Motion tiers

| Tier | Name | Tools | Use it for |
|---|---|---|---|
| 1 | Basic | CSS transitions, keyframes, same-page View Transitions | Every site: hover, focus, press, small reveals |
| 2 | Intermediate | GSAP, ScrollTrigger, SplitText, Lenis | Kinetic type, line reveals, pinned moments |
| 3 | Pro | Cross-page View Transitions, Flip, Lottie, Rive, MorphSVG | Page continuity, illustrated and interactive motion |
| 4 | Max | Three.js, OGL, GLSL, WebGPU | When the concept is spatial, material or lit |
| 5 | **Motomation** | Scrubbed timelines + image sequences / video + optional WebGL, synced by Lenis | Scroll that plays like After Effects |

The rule: **use the lowest tier that delivers the concept.** Tier 5 is the signature, not the default.


### Tools inside the skill

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

#### Delivery Gate: `gate.mjs` (optional: needs Playwright)

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
node scripts/handoff.mjs site/ --report site/GATE.md        # the handoff status, computed from the gate's record
```

Every gate run leaves a record in `<project>/.motomation/gate-record.json`. `handoff.mjs` turns it into the handoff status: **VALIDATED** only when the full gate passed on the current files with nothing left unverified, **CONDITIONAL** when a journey could not be verified, **NOT VALIDATED** when the full gate did not run, failed, or ran on older files. `--report` rejects a handoff note that claims more than that ([gates/handoff.md](skills/asfakulsiam-motomation-design/gates/handoff.md)).

The memory log is per project. `memory.mjs` walks up from the folder you run it in to the nearest `package.json` or `.git`, skips the skill's own folder, and writes `<project>/.motomation/log.json`. So running it from inside `.claude/skills/…` still records the project that installed the skill. `--project <dir>` overrides the lookup.


### Categories and styles

**Categories:** portfolio · studio/agency · e-commerce · SaaS · hotel · restaurant · organisation/non-profit · event · architecture/real estate · personal brand · product launch · education

**Styles:** minimal · editorial · swiss · neobrutalism · glass · soft/neumorphism · flat/illustrative · kinetic type · organic · dark luxe

Each has its own optional recipe file (starting dials, archetypes that can fit, one possible section order, optional treatments, expected conventions, pitfalls) and a recipe contract saying what it assumes, what it doesn't cover and when to reject it. Types without a file (marketplaces, B2B, publications, dashboards, booking) are researched as themselves. A category file is optional design guidance, never the scope: the scope comes from researching real sites of the exact type (Step 1), and a type with no file is researched as itself.


### Component library

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

## Validation and release status

**Current version: 3.0.2** ([CHANGELOG](CHANGELOG.md)). Validation report: [docs/VALIDATION-v3.0.2.md](docs/VALIDATION-v3.0.2.md), what each fix addresses, its regression test, and what is still unverified.

- **3.0.2** came out of an independent evaluation of 3.0.1 ([v3.0.1 evaluation](evals/results/2026-10-18-v3.0.1-independent/README.md)). The handoff status is now computed from what the gate actually ran (`scripts/handoff.mjs`: VALIDATED, CONDITIONAL or NOT VALIDATED), never typed. Forms that send nothing are judged by what they really did (browser-only save, labelled simulation, unavailable) and fail when they claim to have sent or booked something. Layout overflow is checked at 320, 375, 768 and 1440px and reported once per root cause. Confirmation pages reached by a form, and declared deep links, no longer read as broken navigation.
- **What "validated" means here:** the full Delivery Gate (`gate.mjs`, every axis including the journey check J) passed on the current files, and nothing it could not verify is left. Development checks (`--journey`, `--rules`, `completeness.mjs`) guide a build and never validate it ([gates/handoff.md](skills/asfakulsiam-motomation-design/gates/handoff.md)).
- **Works best with** a coding agent that can run Node 18+ scripts; the Delivery Gate also needs Playwright. In chat-only builders the agent follows the same protocol but cannot run the checks, so nothing it reports is measured.
- **Still needs a person:** brief fit, copy truth (real statistics, logos, certifications), taste, and any real backend.
- **Not verified by this repository:** screen-reader use (NVDA, VoiceOver, TalkBack), real devices, and real payment, email or booking backends. Keyboard checks are automated (Playwright keyboard input and axe-core), not a person at a keyboard.

---

## Evaluation summary

What has been measured, by whom, and on which version. A passing automated check means the measured rules passed; it is not evidence of award-level design.

| Evidence | Skill version | What it shows | Limits |
|---|---|---|---|
| Scored benchmark v3 (2026-10-12): 5 briefs × 3 seeds, blind pairwise judging by two models from other families | **v2.3.0** (`6f2724f`), before the v3 product-first architecture | beat a no-skill baseline 12–2–1 and a matched-effort baseline 10–5–0 (sign test p≈0.30, not significant); lost on Tier 4 motion 3–6 | one agent, 15 pairs; says nothing directly about 3.x |
| Independent builds (2026-10-18): 4 builds of 3 v6 briefs by agents that did not write the skill | v3.0.0 (`226085d`) and the v3.0.1 working tree | completeness and realism passed on all 4; the journey check failed on 3 of 4 ([report](docs/VALIDATION-v3.0.1.md)) | 3 product types (B2B, booking, boutique commerce) |
| Independent scoring of those 4 builds (2026-10-19) by a separate evaluator model | same builds, rescored with v3.0.2 checkers | B2B failed the gates; the others scored 70, 81 and 84/100; the paired builds failed the strict originality test ([scores](evals/results/2026-10-19-v3.0.2-validation/independent/SCORES.md), [report](docs/VALIDATION-v3.0.2.md)) | one evaluator, no human judging, no new 3.0.2 builds |

No scored benchmark has been run on 3.x yet. Full history (v1–v4, competitor skills, the Codex run, screenshots including losses): **[docs/benchmark-summary.md](docs/benchmark-summary.md)**. Builds and screenshots live on the evidence branches [`benchmarks/v3.0.1-runs`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.1-runs) and [`benchmarks/v3.0.2-scoring`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.2-scoring), not on `main`.

---

## Documentation

| Read | For |
|---|---|
| [ABOUT.md](ABOUT.md) | what the skill is, who it is for, what a session looks like |
| [docs/CHEATSHEET.md](docs/CHEATSHEET.md) | every command, flag, tier and script, with prompts |
| [SKILL.md](skills/asfakulsiam-motomation-design/SKILL.md) | the protocol the agent follows |
| [gates/delivery-gate.md](skills/asfakulsiam-motomation-design/gates/delivery-gate.md) · [gates/handoff.md](skills/asfakulsiam-motomation-design/gates/handoff.md) | what the gate measures; development checks versus handoff validation |
| [thinking/product-contract.md](skills/asfakulsiam-motomation-design/thinking/product-contract.md) | capability levels and honest form states |
| [docs/VALIDATION-v3.0.2.md](docs/VALIDATION-v3.0.2.md) · [docs/VALIDATION-v3.0.1.md](docs/VALIDATION-v3.0.1.md) | release validation reports |
| [docs/benchmark-summary.md](docs/benchmark-summary.md) · [evals/README.md](evals/README.md) | benchmarks, rubric, how to run them |
| [CHANGELOG.md](CHANGELOG.md) | every version |

### Repository layout

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

See [CONTRIBUTING.md](CONTRIBUTING.md). In short: original work only, short single-purpose files, run `npm test` (the fast, no-browser checks; browser and component tiers run in CI, see the table in CONTRIBUTING.md), and add an eval brief for new behaviour. To add a gate rule set (a new axis next to copy, SEO, performance and security), follow [docs/adding-a-rule-set.md](docs/adding-a-rule-set.md).

## License

[MIT](LICENSE) © asfakulsiam. Every component, script and document is MIT and original: the repository contains no third-party component code. One exception, not covered by the MIT licence: the runtime files self-hosted for the offline demo in [`examples/html/lib/`](skills/asfakulsiam-motomation-design/examples/html/lib/LICENSES.md) (GSAP under its Standard License, Lenis under MIT, fonts under the SIL OFL), copied unmodified with their notices.
