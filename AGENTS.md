# AGENTS.md

Instructions for AI coding agents, in two parts: **using** the skill, and **working on** this repository.

## Using the skill

For any website, landing page, web UI, animation or design-critique task, follow
[`skills/asfakulsiam-motomation-design/SKILL.md`](skills/asfakulsiam-motomation-design/SKILL.md). In short:

0. Read `gates/rules.md` first (the limits the gate measures; design input) and say so in one line before the Thinking Sequence.
1. Read the room (`thinking/brief-inference.md`), then run the **Thinking Sequence** (`thinking/sequence.md`) before writing UI code. It starts with **Step 0: Stack**: use the stack the brief or project names; if none is named, use **Next.js (App Router, TypeScript, Tailwind)** for anything with routes or data, plain HTML for a single static page (never Astro or Vite for e-commerce unless the brief demands it); every dependency passes the three checks in `craft/stack.md`. Record the stack in `DESIGN.md` and load `adapters/<stack>.md`. **One confirmation:** present the plan once (stack, scope, references, deferred items) and ask only "Proceed?"; after yes, build, gate and ship without further questions.
   After Step 0, **Step 0.5: current design research** (`craft/research.md`) is required: three current references and the overused pattern to avoid, written in `DESIGN.md` under `References`.
2. For new ideas, run `node skills/asfakulsiam-motomation-design/scripts/collide.mjs --n 3 --spread`. It gives real randomness, not imagined randomness.
3. Set the dials (ENERGY / RHYTHM / MOTION, each 1–3). Choose the **lowest** motion tier that delivers the concept.
4. Show the preview block, build complete code (compose, extend, or invent: `examples/components/` is a reference, not a limit), ship `DESIGN.md` + `SCHEMA.md` (`templates/SCHEMA.md`, the backend data contract), then pass `gates/delivery-gate.md`.
   In a sandbox (Codex CLI, small containers), give `scripts/gate.mjs` its default 600 s and don't wrap it in a shorter `timeout`; if it prints `not verified — sandbox too constrained: …`, report that line verbatim. See `docs/adapters/codex.md`.
5. Stamp the stylesheet and log the run with `scripts/memory.mjs log …`, so the next design differs.

Commands: `/shape /build /invent /signature /motomate /animate /type /bolder /quieter /distill /mutate /overdrive /critique /audit /study /polish /dials /help /version /check-update /update-skill`. See `commands/overview.md`.

## Working on this repository

- **Layout:** the installable skill lives entirely in `skills/asfakulsiam-motomation-design/`. Everything outside it (README, evals, manifests, scripts) is repository tooling.
- **Do not add a root `SKILL.md`.** It would shadow the nested skill for `npx skills add`.
- **The folder name must equal the `name` in SKILL.md front-matter.**
- **Keep files short and single-purpose.** SKILL.md is a router; detail lives in the topic files it points to.
- **Description = when to use.** The SKILL.md `description` says when to trigger, not a feature list.
- **Original work only.** Don't paste text or code from other projects, component libraries or repositories. Learn the idea, then write it in your own words and code.
- **Scripts are zero-dependency Node 18+ ES modules.** No `npm install` should ever be needed to use the skill.
- **Data files are CSV** with a header row. Keep IDs kebab-case and unique. Run `node scripts/check-repo.mjs` after edits.
- **Examples** must type-check in strict mode, clean up (`useGSAP` / `gsap.context`), and include reduced-motion and touch paths.
- **After changing skill content**, run `node scripts/build-dist.mjs` to regenerate `dist/motomation-design.md`, bump `VERSION` (in the skill folder), `package.json` and the plugin manifests together, and add a `CHANGELOG.md` entry.
- **Evals:** new behaviour needs a brief in `evals/briefs/` and must not lower rubric scores (`evals/rubric.md`).
