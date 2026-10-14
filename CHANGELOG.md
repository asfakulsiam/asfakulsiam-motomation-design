# Changelog

All notable changes to this skill. Versions follow [Semantic Versioning](https://semver.org).

## [Unreleased] (2.6.0 concept fix, in progress)

- **T1 Step 0: Stack:** `thinking/sequence.md` starts with Step 0. Use the stack the brief or the project names; if none, ask the user (never assume); on "you choose", pick from Next.js / Astro / React + Vite / plain HTML and say why. The stack is recorded in `DESIGN.md` (`templates/DESIGN.md` gains a `Stack` section) and picks the adapter. `SKILL.md` and `AGENTS.md` route through it; `brief-inference.md` and `--stack` no longer default to a stack. Traces: `docs/examples/step0-traces.md`.
- **T2 Moods removed:** Removed the Quiet / Editorial / Play mood system. It came from one portfolio project and did not belong in a general skill. Style is now derived from the brief, informed by styles/. The `--mood` flag, the dial-preset table in `principles/dials.md`, the "Default mood" line in every `categories/*.md` (now "Starting dials", the brief overrides) and the `mood` column of `data/categories.csv`, `data/palettes.csv` and `data/signatures.csv` are gone; mood wording in references, components and eval briefs is rewritten.
- **T3 Restraint Gate fixed:** Step 7 asks two questions of every element: (1) does it serve hierarchy, feedback or storytelling? (2) does the brief need it to feel like itself? An element is cut only if it fails both. `principles/restraint.md` gains the rule, a worked example (bakery wheat sprigs: fail Q1, pass Q2, kept) and a counter-example (gradient blobs on an API page: fail both, cut). `commands/critique-format.md` reports Q1/Q2 per element and forbids recommending a cut on Q1 alone; `templates/DESIGN.md` adds a `- Kept:` record line (the gate's C/R parsing is unchanged).
- **T4 Richness advisory:** `scripts/gate.mjs` prints a `richness (advisory …)` block that catches "too little": fewer than 3 meaningful sections above the fold, a homepage with no hero or opening statement, a category grid with no title or count, an about page with fewer than 2 content blocks. Page kind from the path or `--page home|category|about|page`. It only warns: never in pass/fail, the counts, the stamp or its id. Documented in `gates/delivery-gate.md` (Part 0) and `principles/restraint.md` ("Too little"); `tests/gate/richness.test.mjs` (wired into `ci.yml` next to the composition test).

## [2.5.0] - 2026-10-12

Release of the v2.5.0 fixes already on `main` (the three known gaps listed under 2.4.0), plus the cut of the plain variants. Newest work first; each bullet names its task and files. The benchmark was not run for this release; its measurement runs on GitHub Actions (`.github/workflows/bench-measure-v4.yml`).

### Master run (2026-10-13): size control, rule sets, depth

The version stays 2.5.0. The benchmark was not run, and no fps figure was added.

- **Repository size (A1–A7):** audit (163 MB working tree, 150.2 MB tracked) in `docs/maintenance/repo-size-audit.md`. Benchmark screenshots and outputs moved to the `evals` branch, and Tier 5 frames moved to tarballs on `evals` (`frames.lock.json` + `scripts/fetch-frames.mjs`). The GitHub Release upload was refused (HTTP 400), so the tarballs are on the branch, not a release. Links were repointed. A size guard in `check-repo` blocks a tracked evals artifact, an unlisted file over 1 MB, and main over 15 MB. Main is now about 13.3 MB of tracked bytes.
- **Rule sets (B1–B11):** `craft/copy.md`, `seo.md`, `performance.md`, `security.md` (twenty items each). The router loads all four, and Part 4 of the Delivery Gate gives one line per item. Gate `gate/4` adds a stamp segment `rules: C S P K` (pure checks in `scripts/rulesets.mjs`). Every template was re-gated, and there are 8 good/bad rule fixtures. `docs/adding-a-rule-set.md` covers adding a set.
- **C1:** fixed the failing Components workflow (measuring swipe-row text, infinite WAAPI animations held at frame 0, the forced-colors clip). Thresholds are unchanged.
- **C2:** every template folder must be registered. The Tier 5 rule requires `MOTION.md`, `poster.webp` and a fetch script.
- **C3:** data depth. 80 fonts with a `scripts` column (Bengali, Devanagari, Arabic), 40 palettes in light/dark pairs, 50 motion recipes with timings, and a new `imagery.csv`.
- **C4:** advisory composition heuristics in the gate: pin fill below 60%, a focal point per screen by text mass, and display:body below 1:6. They never fail the gate and are not in the stamp. `tests/gate/composition.test.mjs`.
- **C5 / C6:** 11 award-site teardowns (principles only, sources linked) and 10 brief-to-concept examples, one per category, from real collision draws.
- **C7:** `examples/prompts/showcase-tier5.md`, the product-launch film from storyboard to verified stamp. Writing it exposed a bug: `build-frames --check` ignored the manifest's quality. It now reads its settings from `frames.json`.
- **C8:** content-addressed generate cache in the benchmark runner (`evals/bench-cache.mjs`), keyed on brief, seed, arm, skill tree hash and model. It is tested with a mock agent.
- **C9:** every CLI prints one line plus usage on unknown flags or missing arguments (exit 2), not a stack trace. Helper: `cli()` in `scripts/lib.mjs`.
- **C10:** every workflow job has `timeout-minutes`. Jobs that run npm get the setup-node npm cache, and jobs that install Playwright get a browser cache. `check-repo` enforces all three.
- **C11:** `docs/templates/index.html` and `docs/plain/index.html` (`scripts/build-index-pages.mjs`), so `/templates/` and `/plain/` no longer 404.
- **C12:** `llms.txt` states the version and links the newest benchmark report. `check-repo` fails on drift.

### Release

- **Release:** version 2.5.0 in `skills/asfakulsiam-motomation-design/VERSION`, `SKILL.md`, `package.json`, every plugin manifest (`.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `.cursor-plugin/plugin.json`, `.codex-plugin/plugin.json`, `gemini-extension.json`) and the README badge, enforced by `scripts/check-repo.mjs`; `dist/` rebuilt; tag `v2.5.0`.
- **Plain HTML variants cut to the top 5:** `vendor/plain/` keeps CSS + HTML and Tailwind variants only for the five components the most sections and templates import: count-up, split-flap (4 sections, 3 templates each), copy-button, ink-fill, typewriter (3 sections, 3 templates each). The other 15 are removed (animated-list, contour-lines, glow-border, rotating-words, squish-switch, tilt-card, velocity-marquee, flowing-menu, grain, scramble-on-hover, shimmer-button, aperture, beams, bento-reveal, blur-focus); their React versions are unchanged. `vendor/plain/top20.json` → `vendor/plain/top5.json`; `scripts/check-repo.mjs` recomputes the top 5 and fails on any other plain folder; `mcp/server.mjs`, `scripts/build-docs-site.mjs` and `tests/variants/compare.mjs` read the new list; docs site rebuilt. README and `vendor/plain/README.md`: the library is React-first. `tests/variants/compare.mjs`: 5/5 match across React, CSS + HTML and Tailwind.
- **Extended matched-effort arm (60 runs) in the v4 workflow:** `.github/workflows/bench-measure-v4.yml` measures the skill and matched-effort arms at six seeds per brief (5 briefs × 2 arms × 6 = 60 builds), plus the three Tier 4 motion briefs (baseline and skill, 3 seeds each, 18 builds, with `gate.mjs --report` motion reports). The matched arm has an enforced per-pair turn budget (cap + 90% floor via `--resume`) and the score step reports a sign test (`evals/run-agent-benchmark.mjs`, d614161). Builds generated at 6f15d45 are in `evals/results/2026-10-12-benchmark-v4/` and `evals/results/2026-10-12-benchmark-v4-motion/` (a443b99).
- **Benchmark measurement moved to GitHub Actions:** `.github/workflows/bench-measure-v4.yml` (on push to `bench-v4`): one shard per output × brief × arm, 16 shards, `max-parallel: 20`, `timeout-minutes: 90`, Playwright Chromium + axe-core + `scripts/gate.mjs` from the tested skill folder; uploads `checks.json`, screenshots and motion reports. The generation sandbox (2 CPUs) no longer measures.
- **Tier 4 backgrounds: designed reduced-motion stills:** aurora (a long-exposure plate: ribbons and star trails), beams (noon held: hard shafts and floor pools), globe (a line chart plate with the markers joined in order), and likewise liquid-field, mesh-gradient, meteors and particle-field, each render an SVG still under reduced motion with no canvas mounted, not the animation's frozen frame (`examples/components/backgrounds/*.tsx`). `craft/mobile-motion-matrix.md`, `motion/tier-4-max.md`, `principles/restraint.md`, `data/components.csv`, the gallery, the `event` template and `tests/components/baselines.json` updated (aa616a3). Review rule in `craft/scroll-sequences.md` and the Delivery Gate checklist (`gates/delivery-gate.md`) (dbe6ff0).
- **gate.mjs: constrained-sandbox light footprint:** `scripts/gate.mjs` probes the machine first (CPUs, load, free memory, cgroup limit, `/dev/shm`, address-space cap, `MOTOMATION_SANDBOX` / `CODEX_*`), and when the browser (not the page) fails it retries once in a light footprint (one renderer, no GPU, no `/dev/shm`, timeouts ×3; `--light` starts there). Every exit path prints one verdict, including `not verified — sandbox too constrained: <reason>`; `--timeout` / `--timeout-ms` set the budget. `docs/adapters/codex.md` documents the v3 Codex failure modes and how to run the gate in a sandbox; `AGENTS.md` points to it (07adea8, b98ac04).
- **gate.mjs: inactive scroll step sampling:** `scripts/gate.mjs` measures every element at every sampled scroll position (every 0.7 viewport, every 0.15 viewport inside pinned/sticky zones, plus 0/25/50/75/100% of the page and of each zone). An element that settles at more than one opacity is a sequence step, and each inactive state it rests in must meet AA: a dimmed inactive step now fails (the ceramics s3103 miss in v3). Fixtures `fixtures/synthetic/scroll-steps-dimmed.html` (must fail) and `fixtures/synthetic/scroll-steps-legible.html` (must pass) in `scripts/check-fixtures.mjs` (07adea8).

## [2.4.0] - 2026-10-12

Development run v2.4.0, in two passes: the first pass built the front door, the reliability fixes, the breadth (components, sections, templates), distribution (docs site, MCP server, Pages) and the multi-agent benchmark infrastructure; the completion run (this release) verified the partials, ran and published benchmark v3, added per-component CI and the marketplace listings, and shipped. Newest work first; each bullet names its task and files.

### Completion run (2026-10-12)
- **D1–D4 · Release:** version 2.4.0 in `VERSION`, `SKILL.md`, `package.json`, every plugin manifest (`.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `.cursor-plugin/plugin.json`, `.codex-plugin/plugin.json`, `gemini-extension.json`) and the README badge, enforced by `scripts/check-repo.mjs`; README Results shows v3 next to v2; tag `v2.4.0`.
- **C2 · Listings:** tracked in `RELEASE-NOTES.md`. Live: the repository's own Claude Code marketplace (`.claude-plugin/marketplace.json`, validated and installed from GitHub with `claude plugin marketplace add`) and Codex marketplace (`codex plugin marketplace add`), `npx skills add` (skills.sh CLI). Submitted through the directories' own discovery: Gemini CLI extension gallery (`gemini-extension.json` at the root + `gemini-cli-extension` topic), SkillsMP (`claude-skills` / `claude-code-skill` topics), claudemarketplaces.com (valid marketplace schema). Not submitted, with the reason: the official Claude, Cursor and OpenAI plugin directories (account-holder web forms), and two awesome lists whose rules exclude new, low-star or AI-submitted entries.
- **C1 · Per-component CI:** `.github/workflows/components.yml` + `tests/components/per-component.mjs` + `tests/components/fixtures/per-component.fixture.tsx` + `tests/components/baselines.json`. Every component in `data/components.csv`, sharded by family: screenshot fingerprint against a committed baseline at 1440 and 375, the Delivery Gate on its own demo page, a 4 KB gzipped size budget, reduced-motion stillness, and mount/unmount with no console errors and no animation frames left pending. A coverage job fails if a component has no baseline or a family has no shard. The interaction suites (hold-to-commit, reduced-motion first render, confetti) and the whole-gallery harness run in the same workflow. Proven to fail on purpose-made regressions (reduced-motion path removed; a leaked rAF loop + console error).
- **C1 fixes (found by the new CI):** `Lens` cancels its easing frame on unmount; `StackedDeck` card numbers 0.55 → 0.75 opacity (3.81:1 → 7.1:1 at 20px); gallery demos: the glare-card hint and the device-mockup's small text reach AA on their tinted surfaces, the orbiting-circles label sits in its own box. Registry, gallery, docs site and the `shop-product` / `studio-portfolio` templates rebuilt; both templates re-gated and re-stamped (`gate.mjs --verify`: verified).
- **B1–B5 · Benchmark v3:** 133 builds at commit `6f2724f` (Claude Code 2.1.286 + `claude_sonnet_5_5`; judges GPT-5.4 and Gemini 3.1 Pro; measured on GitHub Actions, Chromium 147.0.7727.15, axe-core 4.14.0). Reports: `evals/results/2026-10-12-benchmark-v3.md` (baseline, gated baseline, skill, matched effort), `evals/results/2026-10-12-benchmark-v3-motion.md` (briefs 01/06/08 at Tier 4, judged from `gate.mjs --report` strips by the new `evals/judge-motion-strips.py`), `evals/results/2026-10-12-benchmark-v3-competitors.md` (taste-skill, ui-ux-pro-max, frontend-design), `evals/results/2026-10-12-benchmark-v3-codex.md` (Codex CLI + `gpt_5_4`). Results: skill vs baseline 12–2–1, vs gated baseline 14–1–0, vs matched effort 10–5–0, vs the three competitors 14–1, 14–1, 11–3–1; Tier 4 full rubric 7–2 but **motion-only 3–6**; Codex 3–2. The losses, the hard-gate failures and the pipeline problems are listed in each report. Screenshots and motion reports on the `evals` branch; before/after images `docs/benchmark-images/v3-*.webp`. Runner fixes: the judge step now runs judgments in parallel (async spawn), and one page whose measurement throws no longer ends the measure pool. Measurement workflow kept on branch `bench-v3`.
- **Known gaps found by v3 (not fixed in this release):** `gate.mjs` measures a scroll sequence's steps only in their active state, so dimmed inactive steps can fail axe contrast unseen (ceramics s3103); at Tier 4 the skill's reduced-motion fallback and choreography lost to plain baselines when judged from strips; in a CPU-starved sandbox `gate.mjs` crashes or times out and the skill moves on unverified (Codex run).
- **A1–A4 · Partials verified, no change needed:** hold-to-commit (13/13 interaction tests), reduced-motion first render (5/5, video under `/tmp/agent-browser/`), lite token count (README and `build-lite.mjs --check` agree, ~7.8k ≤ 8k), byte-identical gallery rebuilds with the pinned toolchain. Marked SKIP with gate output in the run log.

### First pass (2026-10-11 → 2026-10-12)
#### Multi-agent bridges
- **Codex agent** for the benchmark (`--agent codex`, skills installed into the run folder at `.agents/skills`), Responses-API bridge (`evals/adapters/responses-bridge.py`); the Anthropic bridge takes system-role messages and JSON-string tool arguments (6f2724f).
- **Anthropic-Messages bridge** for running Claude Code on the benchmark (`evals/adapters/anthropic-bridge.py`); runner competitor arms (`--competitors name=dir:skill`), installed like ours and judged blind (f9325fc).
- **Raw-API agent** (`--agent raw-api --model-cmd`), matched-effort arm, model adapter (`evals/adapters/pplx-llm.py`), transcript per turn (5d4aef5).

#### Inspiration review
- **Step 0:** `docs/INSPIRATION-REVIEW.md` — 39 repositories reviewed for concepts only, no code copied; CreativeAgencyStyle treated as malware (file list only) (8fe7b54).

#### Distribution
- **E2 · MCP server:** `mcp/server.mjs`, no dependencies: search, get, preview, install components; query data; resources for the catalogue, sources and data CSVs (500c0fd).
- **E3 · GitHub Pages:** `.github/workflows/pages.yml` publishes the docs site, the full gallery, the templates and the plain variants; gallery toolbar with search, reduced-motion toggle and a 375 view (8599ccc).
- **E1 · Docs site:** `docs/site/` — a page per component with live demo, prop playground, mobile preview, copy + install; search; reduced-motion toggle (ee5f36d).

#### Breadth
- **D6 + D7:** 8 gated page templates (`examples/templates/`); CSS + HTML and Tailwind variants of the top 20 components (68bad7a).
- **D5:** 38 page sections (`examples/sections/`), header validator and index (`scripts/build-sections.mjs`, check-repo 9b), section harness (`tests/sections/harness.mjs`) (072b8a4).
- **D1–D4:** the component library grows from 43 to 68 components in 8 families: six text components, five ui components, six heavy backgrounds on a shared `examples/components/_lib/ambient.ts` (capability probe, poster, DPR ≤ 1.5, pause off-screen), eight ui pieces; component and gallery harnesses (`tests/components/harness.mjs`, `tests/components/gallery-harness.mjs`), confetti test (5ecb4eb, 2ae93eb, 747e1c3, 841b8c0).

#### Reliability fixes
- **A4 (T3.2) / C5:** one rule for what to animate (`motion/tokens.md`): prefer transform/opacity, clip-path when it is the concept, paint-heavy with a perf check and static fallback; check-repo 11 keeps every doc consistent (a410e33, 755a89a).
- **C4:** esbuild 0.28.2 / react 19.2.6 / react-dom 19.2.6 pinned for the gallery; byte-identical rebuilds (ecae128).
- **C3:** `scripts/build-lite.mjs` writes the lite token count into README; `--check` (run by check-repo) fails when they disagree (c9b6cd6).
- **C2:** `useMedia` / `useReducedMotion` read the media query on the first client render (`useSyncExternalStore`); `tests/components/reduced-motion.test.mjs` proves no blurred painted frame (ee65036).
- **C1:** `examples/html/motomation-film.html` self-hosts GSAP, Lenis and fonts; its gate/2 stamp verifies offline (19b1297).
- **C6:** short-route evidence: full vs short prompt, route stated, standards kept (dff209a).
- **A5 (T3.3):** SaaS variety collision fixed: evaluator notes stripped from generator prompts, seeded fallback archetype, controlled-reuse rule (46f2aa0).
- **A4 (T3.1):** Law 2 is an explicit fork: house style (typography-led) vs service style (information-led) (2ad19fb).
- **A3 (T2.3):** hold-to-commit assistive-tech click path (arm, then confirm), unmount/blur cleanup, 13 interaction tests (`tests/components/hold-to-commit.test.mjs`) (83da5a9).
- **T2.4:** gate numbers check: values shown wrong before they settle (f74996b). **T2.2:** gate contrast at 375/390/768/1440, per viewport (gate/2) (54ffdb6). **T2.1:** CI gate-fixtures job with Playwright, `fixtures/good` + `fixtures/bad`, gate `--timeout` (34fd248). Gate fixes found by the worked examples (fc77175, 8cf39a8).

#### Front door and proof
- **A2 (T2.5):** `craft/performance.md` and `craft/responsiveness.md`, next to `craft/accessibility.md` (6e25a6d).
- **B10:** README "Before and after" with six comparisons from `docs/benchmark-images/`, including the v1 hotel loss and the v2 SaaS sameness (8a4d280).
- **B1–B4 / T0.2–T0.4:** worked examples in `examples/prompts/` (hero, full-site, component, fix-existing, showcase) with prompts index; SKILL.md short route (69ac301, a868174, 74e46f1, ab75b23).
- **A1 (T0.7):** README "See it in action" links every worked example; check-repo enforces it (865127d).
- **T0.1:** `ABOUT.md`, a plain-language introduction linked above the fold (f6c7627).

## [2.3.0] - 2026-10-11

### Added
- **Component library:** 43 original components in `examples/components/` across six families: type (10), scroll (7), cursor (6), backgrounds (6), layout (6) and micro-interactions (8). Each is one strict-TypeScript React file with props and defaults, a reduced-motion path, touch behaviour and a `// @motomation-component` header (tier, use when, avoid when, accessibility). They share `_lib/motion.ts` (reduced motion, pointer type, in-view, scroll progress, velocity, one frame loop, easing and duration tokens).
- `scripts/build-components.mjs` generates the catalogue (`examples/components/README.md`), `data/components.csv` (searchable: `search.mjs components "<query>"`) and a shadcn-format registry (`registry/<id>.json`, `registry.json`) from the headers.
- `examples/gallery/index.html`: one self-contained page with a live demo of every component, built by `scripts/build-gallery.mjs`. It passes the Delivery Gate (contrast, overflow, words, reduced motion, names: all 0).
- check-repo: component headers validated, catalogue, data and registry freshness, gallery build stamp checked against the sources.

### Changed
- Effects vocabulary: every concept now points to this skill's own component, signature or tier file, with new rows for the new concepts and a Scroll section.
- Find before build points to the component library.
- check-repo section 8 is now a general rule: no `vendor/` folder and no third-party copyright notices in code.

### Fixed
- Delivery Gate: letters were paired as one split word even when other letters sat between them ("a" and "t" in E·l·a·s·t·i·c); a split word's letters each counted as a separate focal point; a marquee's hidden, clipped track was reported as leaving the viewport. Real split words and visible text running off the edge are still caught (fixture checked before and after).

### Removed
- `references/react-bits/` and every pointer to outside effect libraries. The skill contains only its own work.

## [2.2.0] - 2026-10-11

Development run v2.2.0: tasks in Phases 0–7, applied in order. Each bullet names the task and the files it touched. Pre-flight: the four tasks of the prior plan (measured gate, cheap code-readable rules, typography as house default, traced stamp) were already in 2.1.0 (commits 2ab97d3, 6a4665f, 0b39dc5, 8a76c06), so they were verified and skipped.

### Added
- **Benchmark v2 (run on 2.1.0, recorded here):** inside Claude Code, 5 briefs × 3 seeds × 2 conditions, blind GPT-5.4 + Gemini judges. The skill won 15 of 15 pairs; gated mean 45.9 → 92.4, raw 67.1 → 92.4. Report: `evals/results/2026-10-11-benchmark-v2.md`.
- **T2.1 · Shared rules:** `data/rules.csv` is the single source for the UI-feedback limit (250ms), the banned display fonts and the caution fonts. `scripts/rules.mjs` renders them.
- **T3.1 · React Bits selection:** `references/react-bits/SELECTION.md` covers 19 components mapped to tiers. 8 were skipped because a signature already covers them.
- **T3.3 · React Bits index:** `references/react-bits/INDEX.md` gives the concept, tier, cost, when it earns its place, when it's slop, reduced-motion behaviour and a reactbits.dev link, one row per component.
- **T3.7 · Licence guard:** `scripts/check-repo.mjs` checks that SELECTION and INDEX agree, and fails on React Bits source or a `vendor/react-bits/` folder.
- **T4.5 · Lite edition:** `dist/motomation-lite.md` (about 5.3k tokens by tiktoken cl100k) holds the five laws, flow, tiers, bans, the seven-step Thinking Sequence, the AI-default scan, the craft checklist and short lists of archetypes, mutations and signatures. It's built by `scripts/build-lite.mjs`, reproducible byte for byte, and checked by `check-repo` for freshness and an 8k-token budget.
- **T5.1 · `/study`:** `commands/study.md` turns the one-paragraph stub into a full command that writes a five-part Studied direction (type, palette, layout, motion, signature, plus take/leave) into `DESIGN.md`. It's agent-driven, so no script fetches the URL.
- **T5.3 · Find before build:** `SKILL.md` step 6 says standard UI is found first (the project's own components, then this skill's examples and React Bits index, then a registry). Signature moments are always designed. `references/effects-vocabulary.md` points to it.
- **T5.4 · Motion report:** `gate.mjs --report` writes a self-contained HTML file with scroll-frame strips (1440, 375, reduced motion). It's off by default, and the text output is unchanged.
- **T6.1 · Third benchmark arm:** `evals/run-agent-benchmark.mjs --arms baseline,gated,skill`. The gated arm gets the baseline prompt plus `gate.mjs` only. `--pairs` picks which arms are judged against each other, and the defaults reproduce v2 exactly.
- **T6.2 · Motion briefs:** briefs 01, 06 and 08 are in the runner (`--only portfolio,launch,festival --tier 4|5`).
- **T6.4 · Motion evidence for judges:** `measure` writes `shot-1440-strip.png` (8 frames at even scroll steps), and the judge prompt scores Motion from the strips when both sites have one. `evals/rubric.md` explains the evidence, with axes and weights unchanged.
- **T6.5 · Variety test:** `evals/variety.mjs` and `evals/results/2026-10-11-variety.md`. 5 seeds gave 5 archetypes and 4 signatures (mean similarity 0.28). The published builds use 12 archetypes across 15 runs. SaaS reuses `console`, which fails the variety rule on archetype.

### Changed
- **T2.2 · One value everywhere:** `SKILL.md`, `principles/typography.md`, `principles/restraint.md`, `principles/house-style.md`, `motion/tier-1-basic.md` and `gates/delivery-gate.md` now spell the shared rules through `<!--rule:KEY-->` markers. Before, the UI-feedback limit was 500, 300 or 250ms depending on the file, and SKILL.md's font list was shorter. `check-repo.mjs` fails when a marker differs from the CSV or a rule is restated by hand. `gate.mjs` holds no copy of these rules.
- **T3.5 · Effects vocabulary:** `references/effects-vocabulary.md` has a Reference column on all 40 concepts. The "never paste React Bits source" rule now states its reason: the licence forbids redistributing the components.
- **T3.6 · Licensing notes:** the `README.md` License section explains that React Bits is referenced, not vendored. `ACKNOWLEDGEMENTS.md` credits React Bits and David Haz.
- **T4.1 · README results:** v2 replaces v1 in `README.md`, with two v2 before/after images (`docs/benchmark-images/v2-*.webp`). v1 stays in this changelog (2.1.0, Task 9) and in its report.
- **T4.2 · README tools:** `gate.mjs` is documented with its Playwright install steps. The badge now reads "zero dependencies (gate: Playwright, optional)", and the `SKILL.md` tools line matches.
- **T4.3 · Benchmark summary:** `docs/benchmark-summary.md` leads with v2 and keeps v1 below it.
- **T4.4 · Acknowledgements:** `ACKNOWLEDGEMENTS.md` names what was borrowed (i-have-adhd, Anthropic skill-creator, Hallmark, anti-slop, Impeccable) and the studied lineage (taste-skill, Emil Kowalski, design-motion-principles, ui-ux-pro-max, awesome-claude-design, Miguel Clavel, GSAP under its own license, React Bits).
- **T5.2 · Copy pass:** `craft/copy.md` (which already existed) gains headline rules and an original copy pass for rhythm-and-filler tells. It shares 0 seven-word sequences with Humanizer. `gates/delivery-gate.md` Part 2 gains items 26–29, and its Part 3 copy line points to the pass.
- **T6.3 · Agents tested:** `evals/README.md` lists what's actually benchmarked. Only Claude Code is. Codex was unauthenticated, and Cursor, Gemini CLI and Aider weren't installed.
- **T6.6 · Repo size:** the 320 benchmark screenshots (about 15 MB) moved to the `evals` branch. Report images link there (50 of 50 links checked), and `evals/` in main went from 21 MB to 5.9 MB.
- **T7.2 · Release gates:** `check-repo`, `build-dist --check`, `build-lite --check`, a strict typecheck of 10 example files (0 errors on Node 18 and 20), `gate.mjs` + `--verify` on `examples/html/motomation-film.html` (PASS, STAMP VERIFIED, stamp id unchanged) and a local replay of the CI check job on Node 18.20.8 and 20 all pass. GitHub CI is green on all 4 jobs. Tagged `v2.2.0`.
- **T7.1 · Version 2.2.0:** bumped in `VERSION`, `SKILL.md`, `package.json`, the three plugin manifests, `.claude-plugin/marketplace.json`, `gemini-extension.json` and the README badge. `check-repo.mjs` now also checks the marketplace file and the badge.

### Fixed
- **T0.1 · Unsafe source:** verified that no file names CreativeAgencyStyle (0 hits), so nothing needed removing.
- **T1.1 · Lenis provider:** `examples/providers/smooth-scroll.tsx` read the Lenis instance once at mount, before it existed, so the page didn't scroll at all (scrollY 0 after 6 wheel events in a Next 15 app). It now reads the ref inside the ticker callback and connects ScrollTrigger through `lenis.on('scroll')` once `useLenis()` publishes the instance (scrollY 3600, 76 ScrollTrigger updates).
- **T1.2 · Memory location:** `scripts/memory.mjs` writes `.motomation/` at the project root. It walks up to the nearest `package.json`/`.git`, never uses the skill's own folder, and accepts `--project <dir>`. `gate.mjs` reads the log from the same root. Documented in `SKILL.md` and `README.md`.
- **T1.3 · Demo stamp:** `examples/html/motomation-film.html` has one signature (timecode-rail) and a gate-generated stamp that passes `gate.mjs --verify`. Proximity Weight is recorded as a supporting detail in the new `examples/html/DESIGN.md`.
- **T1.4 · Args parser:** `scripts/lib.mjs` splits `--key=value` at the first `=` only.
- **T1.5 · Contrast:** `scripts/contrast.mjs` prints floor-rounded ratios (4.4988 used to print as "4.50 FAIL"), checks the accent as text at 4.5:1, and is importable. `data/palettes.csv` has an `accent_text` column (body | large-only); 6 of 22 palettes are large-only.
- **T1.6 · Gate contrast:** `scripts/gate.mjs` judges each text element by its 10th-percentile background sample instead of the median. It warns when more than 30% of text elements were skipped. The studio v1 4.45:1 captions are still flagged.
- **T1.7 · Examples:**
  - `typography/proximity-weight.tsx` caches letter positions, re-measures on resize only, and follows live reduced-motion changes.
  - `scroll/pinned-chapter.tsx` has no beat fades below md.
  - `motomation/image-sequence-film.tsx` clears the canvas before each frame.
  - `scripts/check-repo.mjs` and `scripts/build-dist.mjs` use `fileURLToPath`.
- **T2.3 · Diptych fingerprint:** `scripts/lib.mjs` gives Diptych its own layout family (`split`), so it's no longer grouped with Stage.

### Not done
- **T3.2 · Vendoring React Bits: blocked.** React Bits' LICENSE.md forbids redistributing "the components themselves-whether alone, in a bundle, or as a ported version", so no React Bits code was copied. T3.4 (wrappers) and T3.8 (typecheck of vendored code) have nothing to act on.
- **T6.1 / T6.2 / T6.3 runs: blocked.** Claude Code in the run's environment was not logged in, and Codex returned 401, so no new generations exist: none for the three-arm brief, briefs 01/06/08 at Tiers 4–5, or other agents. The code is in place, and plumbing was checked with a stub agent.
- **T6.4 judge run: blocked.** No cross-family judge model was available. Strips were rendered for studio s7101 (both arms), and the prompt was checked dry.

## [2.1.0] - 2026-10-11

Fix run: fourteen tasks, applied in order. Listed newest first; each bullet names the task and the files it touched.

### Changed
- **Task 14 · Single-file edition rebuilt:** `dist/motomation-design.md` regenerated with `node scripts/build-dist.mjs` from the sources below; no manual edits.
- **Task 13 · Version 2.1.0:** this entry; version bumped in `skills/asfakulsiam-motomation-design/VERSION`, `SKILL.md`, `package.json`, `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `.cursor-plugin/plugin.json`, `.codex-plugin/plugin.json`, `gemini-extension.json` and the README badge.
- **Task 12 · Standards vs house style:** `principles/restraint.md` separates universal standards (accessibility, restraint, motion discipline, real content, reduced-motion fallback, performance budgets) from house-style defaults a brief can override (minimal canvas, maximal type, editorial grid, monochrome + one accent, typography as hero). There's a new section in `SKILL.md`, one sentence in `principles/house-style.md`, and a one-line note in every `styles/*.md` and `categories/*.md`. The Restraint Gate is unchanged.

### Added
- **Task 11 · Structural fingerprints:** `scripts/lib.mjs` gains `fingerprint()`, `similarity()` and `mutationFor()` (layout family, type-scale bucket, section order, motion tier, signature type; deterministic, offline). `scripts/memory.mjs check` flags ≥ 70% structural overlap, names the matching run and dimensions, and offers a mutation; `log` stores the fingerprint (log schema v2; v1 logs still read); a new `fingerprint` command. `scripts/collide.mjs` prints each draw's fingerprint and closest-logged score. `thinking/sequence.md` step 6 is updated.
- **Task 10 · Published results:** a "Results" section in `README.md`, `docs/benchmark-summary.md`, and before/after images in `docs/benchmark-images/` (one shows a loss).
- **Task 9 · First benchmark:** five briefs expanded in `evals/briefs/` (02, 03, 04, 05, 07). The blind run, with and without the skill (two cross-family judges, measured hard gates), is in `evals/results/2026-10-11-benchmark.md`, with all outputs, screenshots and judge files in `evals/results/2026-10-11-benchmark/`. The skill won 3 of 5 briefs; the release gate is **not** met; failures are listed.

### Fixed
- **Task 8 · Tier 5 frame loading:** `examples/motomation/image-sequence-film.tsx` and the master pattern in `motion/tier-5-motomation.md` now load frames with bounded concurrency (6 desktop / 4 mobile), nearest-to-playhead first, and cancel and pause in hidden tabs and off-screen. There's a new "Loading strategy" section. Measured under Fast 3G + 6× CPU: peak in-flight requests fell from 180 to 6.
- **Task 7 · Counts:** `README.md` now says 9 React components plus a shared GSAP module, not "10 components"; every other count was verified by command.
- **Task 6 · Honest repetition claims:** "Never the same twice" and similar guarantees were replaced in `SKILL.md`, `README.md`, `scripts/collide.mjs` and `scripts/memory.mjs` with claims that map to real mechanisms and state their limits.
- **Task 5 · `/invent` diversity:** `scripts/collide.mjs` draws without replacement, so archetypes and signature seeds never repeat inside a run. Mutations and collision worlds repeat only once their pool is exhausted, and the output says so. A "Diversity (measured)" report and a `--count` alias were added. `commands/overview.md` documents the guarantees.
- **Task 4 · Node 18 in CI:** `.github/workflows/ci.yml` runs both jobs on Node 18 and 20 and smoke-tests the skill scripts.
- **Task 3 · Doc ↔ example parity:** the master pattern in `motion/tier-5-motomation.md` matches `examples/motomation/image-sequence-film.tsx` (canvas sizing, nearest-frame draw, pin length, accessible fallback CSS).
- **Task 2 · Accessible Tier 5 storyboard:** in `examples/motomation/image-sequence-film.tsx` and `examples/html/motomation-film.html`, the storyboard is never `display: none`; each scene is a keyboard-reachable link that scrubs the film, and the stage overlay is `aria-hidden`.
- **Task 1 · Node 18 crash:** `scripts/lib.mjs` imports `webcrypto` from `node:crypto`, so `scripts/collide.mjs` runs on Node 18; seeded output is byte-identical on Node 18 and 20.

## [2.0.0] - 2026-10-10

A full rebuild. Every file was rewritten from scratch.

### Added
- **Installable layout:** the skill now lives in `skills/asfakulsiam-motomation-design/`, as `npx skills add` expects. Plugin manifests for Claude Code, Cursor and Codex, a Gemini CLI extension, Cursor rules, and `AGENTS.md` / `GEMINI.md`.
- **Single-file edition** `dist/motomation-design.md` for ChatGPT, Claude.ai, Grok, Google AI Studio, v0, Lovable and Bolt.
- **Brief inference** (step 0) with `[NEEDS CLARIFICATION]` markers.
- **Thinking Sequence** rewritten, with a test per step and a worked example.
- **Mad Artist Mode:** ten invention techniques, a combination grid and taste filters.
- **Collision engine** `scripts/collide.mjs`: real randomness, seeds, `--spread`, category bias, `--exclude-recent`.
- **Project memory** `scripts/memory.mjs` (`.motomation/log.json`) and stamp comments, so designs don't repeat.
- **Search** `scripts/search.mjs` (BM25) over 10 curated data sets: fonts, palettes, motion, signatures, archetypes, mutations, collisions, styles, categories, kinetics.
- **Contrast checker** `scripts/contrast.mjs`, with every palette verified.
- **20 page archetypes** with section purposes, and nav and footer as structure.
- **Three dials** (Energy, Rhythm, Motion at 1–3) and defined moods (Quiet, Editorial, Play).
- **House style** document.
- **Motion tokens** and the four questions; tiers 1–5 rewritten with working code.
- **Motomation (Tier 5):** storyboard-to-timecode method, four techniques, ffmpeg pipelines, frame budgets, fallbacks, checklist.
- **22 signature moves** in recipe format with paste-ready prompts.
- **Effects vocabulary:** a shared language for text, background, cursor, layout and micro effects.
- **10 styles** (adds editorial, swiss, kinetic type, organic, dark luxe) and **12 categories** (adds restaurant, organisation, event, architecture, personal brand, product launch, education).
- **Craft:** copy and microcopy, plus rewritten accessibility (WCAG 2.2), performance budgets, responsiveness, mobile motion matrix and SEO.
- **Delivery Gate:** six-axis self-critique, a 25-point AI-default scan, craft checklist and handoff note.
- **Commands:** `/build`, `/invent`, `/type`, `/audit`, `/study`, `/dials`, `/help`; every command documented with what, when and where.
- **Templates:** `DESIGN.md` and `MOTION.md`.
- **Examples:** 10 strict-TypeScript React components (shared GSAP setup, Lenis provider, hero, line curtain, proximity weight, magnetic button, atmospheric, feature demo, pinned chapter, image-sequence film) and a single-file HTML Motomation demo.
- **Evals:** 8 briefs, a weighted rubric, hard gates and a release gate against a no-skill baseline.
- **CI:** repository linter and strict type-check of examples.

### Fixed
- Content lost in 1.3.0 (one-line placeholders in styles, categories, craft and motion tiers) is replaced with complete guidance.
- Literal `\n` characters in craft files.
- Examples missing reduced-motion and touch handling; text reveal not splitting by lines; magnetic button without click or props passthrough; canvas not DPR-aware or paused off-screen.
- Undefined "mood" references; README and AGENTS.md out of sync with the commands; missing `examples/typography/`.

### Removed
- Root `SKILL.md` (it shadowed the nested skill for the installer).
- Third-party wording and attributions inside skill files. All content is original.

## [1.3.0] - 2026-10-10
- Added anti-slop, inspiration libraries, React Bits overview, critique format, mobile motion matrix, SEO notes and examples. Replaced several guidance files with placeholders (fixed in 2.0.0).

## [1.0.0] - 2026-10-09
- Initial project setup.
