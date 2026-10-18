# AGENTS.md

Instructions for AI coding agents, in two parts: **using** the skill, and **working on** this repository.

## Using the skill

For any website, landing page, web UI, animation or design-critique task, follow
[`skills/asfakulsiam-motomation-design/SKILL.md`](skills/asfakulsiam-motomation-design/SKILL.md). In short:

0. Read `gates/rules.md` first (the limits the gate measures; design input) and say so in one line before the Thinking Sequence.
1. Read the room (`thinking/brief-inference.md`), then run the **Thinking Sequence** (`thinking/sequence.md`) before writing UI code for any new design work, even one page. Only narrow maintenance inside an established design takes the light route (`SKILL.md` → Routes); page count never decides. It starts with **Step 0: Stack**: use the stack the brief or project names; if none is named, use **Next.js (App Router, TypeScript, Tailwind)** for anything with routes or data, plain HTML for a single static page (never Astro or Vite for e-commerce unless the brief demands it); every dependency passes the three checks in `craft/stack.md`. Record the stack in `DESIGN.md` and load `adapters/<stack>.md`. **Six checkpoints** (`thinking/sequence.md`): 1 Stack (proposal, why, alternatives) · 2 Product contract (jobs, journeys as route sequences, IA, density, responsive expectations, exclusions, and the Scope table derived from it: routes, states, legal, admin, edge cases; requested / required / optional; deferred and why, with the interface that still ships) · 3 Research and direction (research questions and record, 2–3 directions compared against the contract, the chosen synthesis: tension, concept, structure, motion language, type, palette, signature or none, recipes and components used or rejected) · 4 Build plan (per route family: section order, components to reuse / adapt / adopt / build, motion with its purpose, transitions, mobile layout of each journey) · 5 Design review (preview, screenshots at 375 / 768 / 1440 of every core journey, DESIGN.md, MOTION.md, SCHEMA.md, DATA.md, one-line summary) · 6 Gate and ship (gate output, critique, the handoff push). The product contract is approved before any concept exists. After each, stop and wait for an explicit answer: approve, redirect, or more information. "Show me alternatives" gets 2–3 options and another wait; the user can override any decision; never ask the same question twice; if the brief answers a checkpoint, state it and skip the question.
   **Authority** (`principles/authority.md`): user requirements → safety, accessibility, correctness → project architecture → the product contract → research evidence → heuristics (`principles/heuristics.md`, advisory) → recipes, archetypes, components, draws (optional starting material). **Step 1** writes the product contract (`thinking/product-contract.md`) from the brief and real sites of the exact type (each finding observed / inferred / unverified) and derives the Scope table; a category recipe (`categories/`) is optional and the derived scope wins; deferring a backend never removes its interface. **Step 2** researches the design (`craft/research.md`): questions first, sources chosen by what they prove, evidence extracted with applicability and limitations, a research record with URLs. **Step 3** compares 2–3 directions against the contract and synthesises one.
2. When exploration stalls, `node skills/asfakulsiam-motomation-design/scripts/collide.mjs --n 3 --spread` gives real random prompts (optional; discard what doesn't fit the contract).
3. Set the dials (ENERGY / RHYTHM / MOTION, each 1–3). Choose the **lowest** motion tier that delivers the concept.
4. Stop at each of the **six checkpoints** (`thinking/sequence.md`) and wait for an explicit answer:
   1 Stack · 2 Product contract · 3 Research and direction · 4 Build plan · **5 Design review** · **6 Gate and ship**.
   Build complete code (reuse, adapt, adopt or build: `examples/components/` is a toolkit, not a limit; `craft/components.md`) in the **delivery mode** the request asks for (`templates/TEMPLATE.md`: design exploration · functional frontend · production template; written in `DESIGN.md` under `Scope`), with `DESIGN.md`, `MOTION.md`, a root `MEDIA.md` (`craft/media.md`: source, licence status and placeholder status of every asset) and, when the mode has them, `SCHEMA.md` (`templates/SCHEMA.md`, the backend data contract) and `DATA.md`. No mode skips research or lowers the design and accessibility bar; gate axis X (`scripts/completeness.mjs`) checks the mode's files and `MEDIA.md`.
   - **Checkpoint 5, Design review.** Show a preview, plus screenshots at 375, 768 and 1440, the docs the delivery mode has and a one-line summary. The author approves, or requests changes; each change gets a new preview.
     - **Path A** (preview possible): a live preview URL.
     - **Path B** (not possible): a build zip, or a push to a temporary preview location the author can open or deploy.
   - **Checkpoint 6, Gate and ship.** Run `gates/delivery-gate.md` on the **approved** design, then write `GATE.md` and `CRITIQUE.md`.
     - Pass: the handoff push.
     - Fail: fix and re-present.
     - **Nothing is pushed until the gate passes.**
   - **Preview push ≠ handoff push.**
     - The preview push is temporary: any location except main, deleted or ignored after approval.
     - The handoff push is final. A real project goes to `design/<name>`; a skill demo puts heavy files on `evals` and code on `design/<name>`.
     - Never main until the design is approved and the gate passes: main is the shipping truth.
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
- **After changing skill content**, run `node scripts/build-dist.mjs` and `node scripts/build-lite.mjs` to regenerate `dist/motomation-design.md` and `dist/motomation-lite.md` (`check-repo` also checks that both keep the routing, research, scope and media rules), bump `VERSION` (in the skill folder), `package.json` and the plugin manifests together, and add a `CHANGELOG.md` entry.
- **Evals:** new behaviour needs a brief in `evals/briefs/` and must not lower rubric scores (`evals/rubric.md`).
