# Changelog

All notable changes to this skill. Versions follow [Semantic Versioning](https://semver.org).

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
