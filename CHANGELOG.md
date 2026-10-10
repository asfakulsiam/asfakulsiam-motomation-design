# Changelog

All notable changes to this skill. Versions follow [Semantic Versioning](https://semver.org).

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
