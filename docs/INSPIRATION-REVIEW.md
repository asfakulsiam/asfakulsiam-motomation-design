# Inspiration review (v2.4.0)

Reviewed 2026-10-12 for the v2.4.0 run. 39 repositories, read through the GitHub API (metadata, file tree, README, licence). Nothing was cloned into this repository, vendored, pasted or adapted. Nothing from any of them was executed while writing this review.

**The rule.** We borrow concepts, never code. Every idea in the table at the end is rebuilt in Motomation's own words and code. `scripts/check-repo.mjs` section 8 ("Original work only") already fails the build on vendored third-party component code; that guard stays.

**CreativeAgencyStyle (`Deuxz32/CreativeAgencyStyle`) is treated as malware.** Its README sends readers to download `src/Style-Agency-Creative-3.8-alpha.1.zip` and "open" it: a binary payload dressed as a website template, the common pattern for malware distributed through GitHub. It was looked at as a file list only. The zip was not downloaded, no file was opened or run, and nothing is borrowed from it, not even structure.

What Motomation already is, for the "Gap" lines: a single skill with a seven-step Thinking Sequence, a seeded collision engine (`collide.mjs`) that forces an unrelated metaphor, a per-project memory log so consecutive pages differ, five motion tiers up to scroll-as-film, 68 original components plus 38 sections and 8 templates, and a measured Delivery Gate (`gate.mjs`) that opens the page in a real browser at four widths and writes a verifiable stamp into the code.

---

## Group A — Core / skill related

### emilkowalski/skills
- **Repo:** https://github.com/emilkowalski/skills (MIT)
- **Purpose:** Taste for UI and animation, from a practitioner (Vercel, Linear): the small mistakes agents make, and the fix.
- **Structure:** ~20 narrow skills (`animate`, `animation-performance`, `animation-vocabulary`, `improve-animations`, `find-animation-opportunities`, `break-ui`…), each a short `SKILL.md`; a performance cheatsheet.
- **Best idea:** Narrow verbs. A skill that does one thing (`find-animation-opportunities`, `break-ui`) is easier for an agent to pick and to follow than one large manual.
- **Gap:** No measurement. Advice is correct but nothing checks the output in a browser; no concept stage, no variety mechanism.
- **Borrow:** A "break it" pass in our critique: deliberately try the page at hostile inputs (long names, 320px, zoom 200%, no fonts) before the gate. We already have the gate; the concept is the adversarial stance.
- **Do not borrow:** His specific easing values and wording; Motomation's motion tokens stay our own.

### obra/superpowers
- **Repo:** https://github.com/obra/superpowers (MIT)
- **Purpose:** A full development methodology for agents: brainstorm → spec → plan → TDD → review.
- **Structure:** `skills/` (brainstorming, writing-plans, executing-plans, systematic-debugging, test-driven-development…), a bootstrap skill (`using-superpowers`) that tells the agent when each applies; hooks; installs in ~15 harnesses.
- **Best idea:** The plan is written for "an enthusiastic junior with poor taste and no context": a plan good enough that a weaker executor still succeeds.
- **Gap:** Process only. No design knowledge, no visual verification.
- **Borrow:** Write the Motomation build plan (Thinking Sequence output) so a different agent could build it without the conversation. Our DESIGN.md/MOTION.md already point that way; make "could another agent build from this?" an explicit check.
- **Do not borrow:** The mandatory TDD loop for visual work; a page is verified by measurement, not unit tests.

### DietrichGebert/ponytail
- **Repo:** https://github.com/DietrichGebert/ponytail (MIT)
- **Purpose:** Make agents write less code without cutting validation, security or accessibility.
- **Structure:** Skills (`ponytail`, `-review`, `-audit`, `-debt`), `benchmarks/` with arms and dated results, hooks, i18n READMEs.
- **Best idea:** The benchmark is the product page: same agent with/without, 39 tasks, 5 runs, and a blind comparison against its own previous version.
- **Gap:** Not a design tool; nothing about type, motion or originality.
- **Borrow:** A "previous version" arm in our benchmark: v3 of the skill against v2 of the skill, judged blind. Also "the rule was never fewest X": our restraint rule is about necessity, not minimalism.
- **Do not borrow:** Persona-led marketing (a character in the README). Motomation's voice stays plain.

### ayghri/i-have-adhd
- **Repo:** https://github.com/ayghri/i-have-adhd (MIT)
- **Purpose:** Output format: lead with the action, number steps, end with one next step.
- **Structure:** One skill, 10 rules, `evals/`, tests, many harness manifests.
- **Best idea:** "End with one concrete next step."
- **Gap:** Not about design.
- **Borrow:** Our handoff already ends with "one thing to try next"; adopt the "lead with the answer" order for the handoff: the URL/file and the gate result first, the story after.
- **Do not borrow:** The emoji language index and tone.

### browser-use/browser-use
- **Repo:** https://github.com/browser-use/browser-use (MIT)
- **Purpose:** Agents that operate a real browser.
- **Structure:** Python library (`browser_use/`), CLI, cloud service, skills.
- **Best idea:** Let the agent *look* at and *act* on the page it built, not only read the source.
- **Gap:** No design judgement.
- **Borrow:** The benchmark's `<look>` tool and the gate's scroll-frame strips are the same idea in our own code: the agent sees screenshots at 1440 and 375 during the build. Keep extending "look, then fix".
- **Do not borrow:** A Python dependency or a cloud browser; the gate stays Playwright-optional and local.

### nextlevelbuilder/ui-ux-pro-max-skill
- **Repo:** https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT)
- **Purpose:** Design intelligence as searchable data: styles, palettes, font pairings, product types, stack guides.
- **Structure:** `.claude/skills/ui-ux-pro-max/` with `data/*.csv` (colors, google-fonts, landing, motion, products, stacks/…) and Python search scripts; a "design system generator" that recommends a pattern per product type.
- **Best idea:** Data you search, not prose you read: the agent queries a CSV for the brief's industry and gets a reasoned recommendation.
- **Gap:** Recommends the *likely* answer per category, which is exactly the sameness Motomation's collision engine fights; no browser verification; no memory between pages.
- **Borrow:** We already have `data/*.csv` + `search.mjs`. Borrow the "provenance" idea: each data row says where it came from and why it is there (their `data-provenance.json`), as a column in our own CSVs.
- **Do not borrow:** Category → recommended style mapping as a default. It produces the on-distribution page.

### blader/humanizer
- **Repo:** https://github.com/blader/humanizer (MIT)
- **Purpose:** Remove signs of AI writing from text.
- **Structure:** One `SKILL.md`, an agent, plugin manifests.
- **Best idea:** A named list of tells ("not X but Y", one-line closers, sayings that sound deep), each with the rewrite.
- **Gap:** Text only.
- **Borrow:** `craft/copy.md` gets a short tells list in Motomation's words for page copy (hero lines, CTAs) and the gate's critique can flag "not X, but Y" headlines.
- **Do not borrow:** Wikipedia-derived wording verbatim.

### affaan-m/ECC
- **Repo:** https://github.com/affaan-m/ECC (MIT)
- **Purpose:** A large harness: skills, memory, security, research-first development across 7 agents.
- **Structure:** Thousands of files: `skills/`, `rules/`, `agents/`, `commands/`, per-harness folders, docker, tests.
- **Best idea:** "Official sources only" warning: the README names the exact channels it ships through.
- **Gap:** No design focus; scale makes it hard to audit.
- **Borrow:** A short "where Motomation is published" list in RELEASE-NOTES.md, so users can spot re-uploads.
- **Do not borrow:** Breadth for its own sake; one skill that does one job.

### sherlock-project/sherlock
- **Repo:** https://github.com/sherlock-project/sherlock (MIT)
- **Purpose:** Find accounts for a username across 400+ sites (OSINT).
- **Structure:** Python package, site data JSON, tests, docker.
- **Best idea:** One data file of targets with a test per target, so a broken target is caught.
- **Gap:** Unrelated to design.
- **Borrow:** The "one test per entry" idea, which D2 applies to components: every component in `data/components.csv` gets a CI test, and CI fails when one regresses.
- **Do not borrow:** Anything about people search. Out of scope.

## Group B — Animation / motion / components

### greensock/GSAP
- **Repo:** https://github.com/greensock/GSAP (GSAP Standard License, not MIT)
- **Purpose:** The animation engine Motomation's tiers 2–5 build on.
- **Structure:** `src/`, `dist/`, `esm/`, `types/`.
- **Best idea:** `gsap.matchMedia()`: motion and reduced-motion branches declared side by side and reverted automatically.
- **Gap:** An engine, not a design method.
- **Borrow:** Keep `MQ.motion`/`MQ.reduce` as the only way our examples branch.
- **Do not borrow:** GSAP's own source. The film demo self-hosts the published GSAP build under its own licence (`examples/html/lib/LICENSES.md`); nothing is copied into our code.

### CloudAI-X/threejs-skills
- **Repo:** https://github.com/CloudAI-X/threejs-skills (no licence file)
- **Purpose:** Three.js API knowledge for Claude Code.
- **Structure:** 10 skills by topic (fundamentals, geometry, materials, shaders, postprocessing…).
- **Best idea:** Split a big API into topic skills an agent loads only when needed.
- **Gap:** API reference only: when *not* to use WebGL is not covered; no budget or fallback rules.
- **Borrow:** Our tier-5 WebGL guidance stays decision-first (should this be WebGL at all?), with a per-topic appendix loaded on demand.
- **Do not borrow:** Any snippet: no licence, so nothing may be reused even if we wanted to.

### darkroomengineering/lenis
- **Repo:** https://github.com/darkroomengineering/lenis (MIT)
- **Purpose:** Smooth scroll that runs on native scroll.
- **Structure:** Monorepo `packages/` (core, react, vue, snap), playground, a MANIFESTO.
- **Best idea:** "Runs on native scroll": sticky, anchors and accessibility keep working.
- **Gap:** A primitive; no guidance on when smooth scroll hurts.
- **Borrow:** The manifesto form: a one-page "why" for Motomation's restraint that a client can read. ABOUT.md covers most of it.
- **Do not borrow:** Library source; the demo self-hosts the published build (MIT, credited).

### DavidHDev/react-bits
- **Repo:** https://github.com/DavidHDev/react-bits (MIT + Commons Clause, NOASSERTION on GitHub)
- **Purpose:** 200+ animated React components, four variants each.
- **Structure:** `src/` per component in JS-CSS / JS-TW / TS-CSS / TS-TW; a site with tools.
- **Best idea:** Variants per component (plain CSS and Tailwind) so it fits any stack.
- **Gap:** Components without a concept stage: pasting them is how pages start looking alike; no reduced-motion contract per component.
- **Borrow:** Already done in our own code (D7: CSS + HTML and Tailwind variants of the top 20). Nothing more.
- **Do not borrow:** Any code. v2.3.0 removed React Bits entirely and check-repo guards against it returning; the Commons Clause is not compatible with how Motomation is distributed.

### 21st-dev/skill
- **Repo:** https://github.com/21st-dev/skill (Apache-2.0)
- **Purpose:** Teach agents the 21st.dev CLI: search, install, publish components.
- **Structure:** Seven small skills under `skills/`.
- **Best idea:** Search → get → install as three explicit verbs an agent can chain.
- **Gap:** A marketplace client; no design judgement.
- **Borrow:** Our MCP server already has search/get/preview/install. Borrow the "publish your design as a theme" concept as a future idea: export a project's DESIGN.md as a portable theme.
- **Do not borrow:** Dependency on a hosted registry.

### Deuxz32/CreativeAgencyStyle — malware, read only
- **Repo:** https://github.com/Deuxz32/CreativeAgencyStyle (no licence)
- **Purpose:** Claims to be a creative-agency site with custom cursor and parallax. In practice the README's only instruction is to download and open a zip in `src/`.
- **Structure:** A small Vite/React skeleton (`src/sections/Hero.jsx`, `CustomCursor.jsx`, `SmoothScroll.jsx`…) plus `src/Style-Agency-Creative-3.8-alpha.1.zip`.
- **Best idea:** None taken.
- **Gap:** Not applicable.
- **Borrow:** Nothing. The only lesson is defensive: Motomation never asks users to download archives, and check-repo could refuse committed archives (`.zip`, `.exe`) in the repository.
- **Do not borrow:** Anything. Not code, not files, not structure. The zip was not downloaded.

### flohoeller/affectui
- **Repo:** https://github.com/flohoeller/affectui (MIT)
- **Purpose:** Handcrafted React components and motion for AI products: one `.tsx` file each, styles inside.
- **Structure:** `components/`, `illustrations/`, `motion/`, `blocks/`; shadcn install.
- **Best idea:** "One file each, source you own": no Tailwind, no animation library.
- **Gap:** SaaS-AI aesthetic only; no reduced-motion contract stated per item in a machine-readable way.
- **Borrow:** Our components already follow one-file + header contract. Borrow the "calm motion" phrasing as a test: does the motion still read at half speed?
- **Do not borrow:** Their illustrations and visual style.

## Group C — Miguel Clavel experiments

The nine repos share one form: a single `index.html` with no libraries, a README that explains the one idea behind the interaction in plain words (what went wrong the first two times, what fixed it), the exact prompt to rebuild it, and a reduced-motion line. That form is the strongest thing in the group.

### miguelclavel/wave-line
- **Repo:** https://github.com/miguelclavel/wave-line (MIT)
- **Purpose:** A divider that bends toward the cursor and wobbles back like a string.
- **Structure:** `index.html`, README, recordings.
- **Best idea:** No overlay to catch the pointer, so the effect never steals clicks from links beside it.
- **Gap:** One effect; no system around it.
- **Borrow:** A rule for cursor components: listen on the document, never place a hit area over content. Add to our cursor family's header contract.
- **Do not borrow:** The spring constant and the curve code.

### miguelclavel/sticker-burst
- **Repo:** https://github.com/miguelclavel/sticker-burst (MIT)
- **Purpose:** Click a heading, it bursts into stickers.
- **Structure:** `index.html`, README.
- **Best idea:** Keyboard (Enter/Space) triggers the same burst; reduced motion gets fewer pieces, not none.
- **Gap:** Decorative only.
- **Borrow:** "Reduce, don't remove" when the motion is the feedback. Our `sticker-scatter` already does this; keep it a rule.
- **Do not borrow:** The particle code.

### miguelclavel/scroll-into-header
- **Repo:** https://github.com/miguelclavel/scroll-into-header (MIT)
- **Purpose:** A big name that travels into the header as one object.
- **Structure:** `index.html`, README.
- **Best idea:** One progress number (0→1) drives every property, bent through one easing curve.
- **Gap:** One effect.
- **Borrow:** Write "one progress value, one curve" into `motion/tokens.md` as the default shape of a scrubbed scene.
- **Do not borrow:** The layout and code.

### miguelclavel/portfolio-details
- **Repo:** https://github.com/miguelclavel/portfolio-details (MIT)
- **Purpose:** A "viewed" mark, "the short version" block, a brand selection colour.
- **Structure:** `index.html`, README.
- **Best idea:** "The short version": problem / what I did / what changed, two lines each, and say when an outcome was never verified.
- **Gap:** Portfolio only.
- **Borrow:** The honesty rule for our benchmark reports and case-study sections: state when a number was not verified. Our `remembered-list` and `brand-selection` components are our own takes on the other two.
- **Do not borrow:** Copy or markup.

### miguelclavel/pixel-trail
- **Repo:** https://github.com/miguelclavel/pixel-trail (MIT)
- **Purpose:** A pointer-charged grid behind the hero.
- **Structure:** `index.html`, README.
- **Best idea:** "Stop drawing there, not stop charging": the fix for effects bleeding under text is to exclude the text area from rendering.
- **Gap:** One effect.
- **Borrow:** A gate idea: measure contrast on the pixels *under* text after a pointer sweep, not only at rest. The component harness already sweeps the pointer.
- **Do not borrow:** Code.

### miguelclavel/name-hover
- **Repo:** https://github.com/miguelclavel/name-hover (MIT)
- **Purpose:** Each letter of a name gets its own hover animation; neighbours never share one.
- **Structure:** `index.html`, README.
- **Best idea:** A constraint (neighbours differ) produces variety without randomness.
- **Gap:** One effect.
- **Borrow:** Same constraint for our section variety: adjacent sections never share an entrance (the gate's "entrance repeats" already counts this).
- **Do not borrow:** The eight keyframes.

### miguelclavel/interaction-recipes
- **Repo:** https://github.com/miguelclavel/interaction-recipes (MIT)
- **Purpose:** Twenty small interactions, each with a recording and the prompt.
- **Structure:** One folder per recipe (`03-wave-line/`, `04-scroll-into-header/`…).
- **Best idea:** Each recipe tells the story of the failed attempts. The failures teach more than the result.
- **Gap:** Recipes, not a method.
- **Borrow:** Our worked examples (`examples/prompts/`) gain a "what went wrong first" line where it is true.
- **Do not borrow:** Any recipe.

### miguelclavel/curve-carousel
- **Repo:** https://github.com/miguelclavel/curve-carousel (MIT)
- **Purpose:** Case-study cards riding the crown of a huge circle.
- **Structure:** `index.html`, README.
- **Best idea:** One number (distance from focus) sets size, fade and stacking; only the front card takes clicks and focus.
- **Gap:** One effect.
- **Borrow:** "Only the focused item is interactive" as an accessibility rule for carousels in `craft/accessibility.md`.
- **Do not borrow:** Code or geometry constants.

### miguelclavel/miguelclavel.com
- **Repo:** https://github.com/miguelclavel/miguelclavel.com (no licence)
- **Purpose:** The portfolio that the experiments come from.
- **Structure:** README and assets only.
- **Best idea:** A page that "notices you're there" with a few small moments, not a big effect.
- **Gap:** Not a tool.
- **Borrow:** Nothing new beyond the recipes above.
- **Do not borrow:** Anything; no licence.

## Group D — Anti-slop / design taste / process

### Nutlope/hallmark
- **Repo:** https://github.com/Nutlope/hallmark (MIT)
- **Purpose:** An anti-slop design skill: macrostructure + one of 21 themes + 57 slop-test gates + self-critique.
- **Structure:** `skills/hallmark/` (SKILL.md, themes, gates), `site/` live demo, `docs/`.
- **Best idea:** Four verbs (build, audit, redesign, study), and `study` refuses pixel-clones and extracts only the "DNA".
- **Gap:** Gates are self-assessed by the model; no browser measurement, no seeded variety, no memory across pages.
- **Borrow:** Our `commands/study.md` gets the explicit refusal: extract structure, type pairing and colour anchor, never reproduce the page.
- **Do not borrow:** Its theme list or gate wording.

### miqdadbadjuber/anti-slop
- **Repo:** https://github.com/miqdadbadjuber/anti-slop (MIT)
- **Purpose:** A filter, not a style guide: removes generic UI, filler copy, AI-shaped code.
- **Structure:** Skills per surface (`antislop-ui`, `-copywriting`, `-code`, `-layoutmobile`), CLI installer.
- **Best idea:** "Filter vs direction": a filter removes what should not be there; DESIGN.md supplies direction; you need both.
- **Gap:** Deliberately gives no direction.
- **Borrow:** Name our two halves the same way in README: the Thinking Sequence directs, the gate filters.
- **Do not borrow:** Their rule text.

### Leonxlnx/taste-skill
- **Repo:** https://github.com/Leonxlnx/taste-skill (MIT)
- **Purpose:** "Gives your AI good taste": layout, type, motion and spacing that avoid boilerplate.
- **Structure:** `skills/taste-skill/SKILL.md` (v2: brief inference, three dials VARIANCE/MOTION/DENSITY, GSAP skeletons, pre-flight check) plus style skills (minimalist, brutalist, soft) and image-gen skills.
- **Best idea:** Three dials that the user can name: a shared vocabulary for "more/less".
- **Gap:** No measured gate, no seeded collision, no memory, no component library with reduced-motion contracts.
- **Borrow:** Our motion tiers are one dial; consider naming density as a second, user-facing dial in `/build` options.
- **Do not borrow:** Their skeleton code. Benchmarked as a competitor in B6.

### github/spec-kit
- **Repo:** https://github.com/github/spec-kit (MIT)
- **Purpose:** Spec-driven development for agents.
- **Structure:** Python CLI, templates, presets, extensions, workflows.
- **Best idea:** Processes are independent entry points (build, fix, assess), not mandatory phases.
- **Gap:** No design layer.
- **Borrow:** Our full route vs short route already works this way; add "assess" as a third entry: should this page be redesigned at all?
- **Do not borrow:** The Python toolchain.

### bmad-code-org/BMAD-METHOD
- **Repo:** https://github.com/bmad-code-org/BMAD-METHOD (custom licence + trademark)
- **Purpose:** Agile AI-driven development: roles, briefs, architecture, stories.
- **Structure:** Hundreds of skills, docs site, tools.
- **Best idea:** "The process sizes itself to the work": small changes go straight to build.
- **Gap:** No design.
- **Borrow:** Confirms our short route; nothing new.
- **Do not borrow:** Anything; licence and trademark terms are restrictive.

### pbakaus/impeccable
- **Repo:** https://github.com/pbakaus/impeccable (Apache-2.0)
- **Purpose:** Design guidance plus 59 deterministic detector rules for AI-generated frontends.
- **Structure:** One skill, 24 commands, a Rust detector (`crates/`), a browser extension, per-harness folders, ~2,000 tests.
- **Best idea:** Deterministic detectors that need no LLM and no API key, and `PRODUCT.md` that separates product truth from visual direction.
- **Gap:** Detects tells in code; does not measure rendered pixels (contrast behind text, reduced-motion hiding), and has no concept or variety engine.
- **Borrow:** Split durable product facts from visual direction: our DESIGN.md holds visual direction; a short `BRIEF.md` section could hold audience, purpose and constraints so redesigns keep them.
- **Do not borrow:** Detector rules or command names.

### anthropics/skills
- **Repo:** https://github.com/anthropics/skills (mixed: Apache-2.0 for many skills, source-available for others)
- **Purpose:** Reference skills, including `frontend-design`.
- **Structure:** `skills/<name>/SKILL.md` + resources, a `template/`, the spec.
- **Best idea:** Progressive disclosure: a short SKILL.md that routes to files read on demand.
- **Gap:** `frontend-design` is a short prompt: no measurement, no variety, no library.
- **Borrow:** Our SKILL.md is already a router. Keep it under the size budget.
- **Do not borrow:** Their text. `frontend-design` is benchmarked as a competitor in B6.

### greensock/gsap-skills
- **Repo:** https://github.com/greensock/gsap-skills (MIT)
- **Purpose:** Official GSAP usage skills.
- **Structure:** 8 skills (core, timeline, scrolltrigger, plugins, react, frameworks, performance, utils), examples.
- **Best idea:** The library's authors state the correct patterns (cleanup, matchMedia, `useGSAP`).
- **Gap:** No design judgement.
- **Borrow:** Point our adapters to "use the official GSAP skill for API details" instead of restating API docs.
- **Do not borrow:** Snippets.

### ruucm/shadergradient
- **Repo:** https://github.com/ruucm/shadergradient (no licence file at root)
- **Purpose:** Moving 3D gradients for React, Framer, Figma.
- **Structure:** Monorepo `apps/` + `packages/`.
- **Best idea:** A compatibility matrix in the README (React × R3F × Next versions).
- **Gap:** One effect; heavy dependency chain.
- **Borrow:** A compatibility table for our components' peer versions (React 19, GSAP 3, Lenis 1) in the components README.
- **Do not borrow:** Shader code; no clear licence.

### dashersw/liquid-glass-js
- **Repo:** https://github.com/dashersw/liquid-glass-js (MIT)
- **Purpose:** Apple-style liquid glass in WebGL.
- **Structure:** A few JS files and a demo.
- **Best idea:** Nested glass samples its parent's output.
- **Gap:** Paint-heavy by design; html2canvas page sampling; no fallback rule.
- **Borrow:** Nothing technical. It is a clear example for `motion/tokens.md` of a paint-heavy effect that needs a perf check and a static fallback.
- **Do not borrow:** The effect as a default.

### pmndrs/react-three-fiber
- **Repo:** https://github.com/pmndrs/react-three-fiber (MIT)
- **Purpose:** React renderer for three.js.
- **Structure:** Monorepo packages, docs, examples.
- **Best idea:** Version pairing stated up front (R3F 8 ↔ React 18, 9 ↔ 19).
- **Gap:** Engine only.
- **Borrow:** State React pairing for our WebGL backgrounds in the same direct way.
- **Do not borrow:** Code. Our WebGL backgrounds stay raw WebGL, no R3F dependency.

## Group E — Additional design references

### kylezantos/design-motion-principles
- **Repo:** https://github.com/kylezantos/design-motion-principles (MIT)
- **Purpose:** Motion skill with build and audit modes, weighting three designers' lenses by context.
- **Structure:** One skill with lens files and recipes.
- **Best idea:** Lenses that disagree (restraint vs polish vs play), weighted by the project.
- **Gap:** No measurement; lenses are borrowed personalities.
- **Borrow:** An audit mode for motion in `/critique`: list each animation, its purpose, and whether it survives the four questions.
- **Do not borrow:** Named-person lenses.

### VoltAgent/awesome-claude-design
- **Repo:** https://github.com/VoltAgent/awesome-claude-design (MIT)
- **Purpose:** 68 DESIGN.md inspirations for Claude Design.
- **Structure:** README only.
- **Best idea:** "Token, rule and rationale in the same file."
- **Gap:** Brand clones as starting points.
- **Borrow:** Every token in our DESIGN.md template carries its reason (already the case for type; extend to colour and spacing).
- **Do not borrow:** Brand DESIGN.md files; imitating a named brand is what Motomation avoids.

### rohitg00/awesome-claude-design
- **Repo:** https://github.com/rohitg00/awesome-claude-design (MIT)
- **Purpose:** DESIGN.md prompts by aesthetic family, remix recipes, community takes.
- **Structure:** `design-md/`, `recipes/`, `prompts/`, `showcase/`.
- **Best idea:** "Remix recipes": combine two families deliberately.
- **Gap:** Starts from existing brands.
- **Borrow:** Our collision engine already combines on purpose; nothing new.
- **Do not borrow:** Brand files or screenshots.

---

## Summary: the contract

| Concept borrowed | From repo | Motomation's own implementation |
|------------------|-----------|---------------------------------|
| Adversarial "break it" pass before the gate | emilkowalski/skills | Critique step tries hostile inputs (long strings, 320px, 200% zoom, no web fonts) in our own words |
| A plan another agent could build from | obra/superpowers | Thinking Sequence output checked with "could another agent build from DESIGN.md + MOTION.md alone?" |
| Benchmark against the skill's previous version | DietrichGebert/ponytail | Benchmark v3 compares against v2's published numbers; a v2-vs-v3 skill arm is the next step |
| Answer first in the handoff | ayghri/i-have-adhd | Handoff opens with the file and gate result, ends with one next step |
| Look at the rendered page while building | browser-use/browser-use | `<look>` tool in our benchmark runner; gate scroll-frame strips |
| Provenance per data row | nextlevelbuilder/ui-ux-pro-max-skill | A source/why column in our own `data/*.csv` |
| Named copy tells | blader/humanizer | A short tells list in `craft/copy.md`, written by us |
| Published channels list | affaan-m/ECC | "Where Motomation is published" in RELEASE-NOTES.md |
| One test per catalogue entry | sherlock-project/sherlock | D2: one CI test per component in `data/components.csv` |
| Motion/reduced branches side by side | greensock/GSAP | `MQ.motion` / `MQ.reduce` in `examples/lib/gsap.ts` (already ours) |
| Topic appendices loaded on demand | CloudAI-X/threejs-skills | Tier-5 WebGL guidance stays decision-first with on-demand detail |
| A one-page "why" | darkroomengineering/lenis | ABOUT.md (already ours) |
| Plain CSS and Tailwind variants | DavidHDev/react-bits | D7 variants, written from our own components (already shipped) |
| Export a project's design as a theme | 21st-dev/skill | Future: DESIGN.md → portable theme from our MCP server |
| Never ask users to open archives | (lesson from) Deuxz32/CreativeAgencyStyle | Defensive only: no archives in the repo; nothing borrowed from that repo |
| Calm motion test (does it read at half speed?) | flohoeller/affectui | A line in the motion critique |
| No hit area over content for cursor effects | miguelclavel/wave-line | Header rule for the cursor family |
| Reduce, don't remove, when motion is feedback | miguelclavel/sticker-burst | Rule in `craft/accessibility.md` |
| One progress value, one curve | miguelclavel/scroll-into-header | Default shape of a scrubbed scene in `motion/tokens.md` |
| Say when an outcome was not verified | miguelclavel/portfolio-details | Benchmark reports and case-study sections state unverified numbers |
| Exclude text areas from effect rendering | miguelclavel/pixel-trail | Gate idea: contrast after a pointer sweep |
| Neighbours never share a move | miguelclavel/name-hover | Gate "entrance repeats" (already ours) |
| Tell the failed attempts | miguelclavel/interaction-recipes | "What went wrong first" line in worked examples |
| Only the focused item is interactive | miguelclavel/curve-carousel | Carousel rule in `craft/accessibility.md` |
| Study extracts DNA, refuses clones | Nutlope/hallmark | Explicit refusal in `commands/study.md` |
| Filter vs direction | miqdadbadjuber/anti-slop | README names the Thinking Sequence (direction) and the gate (filter) |
| User-facing dials | Leonxlnx/taste-skill | Motion tier is one dial; density as a possible second |
| Independent entry points | github/spec-kit | Full route, short route, and a future "assess" route |
| Product truth separate from visual direction | pbakaus/impeccable | A brief section kept apart from DESIGN.md |
| Progressive disclosure | anthropics/skills | SKILL.md stays a router (already ours) |
| Defer API detail to the official skill | greensock/gsap-skills | Adapters point to GSAP's own skill for API specifics |
| Version compatibility table | ruucm/shadergradient, pmndrs/react-three-fiber | Peer-version table in the components README |
| Paint-heavy example for the rule | dashersw/liquid-glass-js | Named as an example in `motion/tokens.md` discussion only |
| Motion audit mode | kylezantos/design-motion-principles | `/critique` lists each animation against the four questions |
| Token + rule + rationale together | VoltAgent/awesome-claude-design | Reasons for every DESIGN.md token |

Counted: 39 repositories reviewed. 35 concepts borrowed (the rows above, CreativeAgencyStyle's row is a defensive lesson, not a borrowed concept, so 34 are design or process concepts). Concepts rejected (the "Do not borrow" lines): 39, one per repository, plus everything from CreativeAgencyStyle. Code copied: none.

Most rows are ideas for later releases. v2.4.0 itself lands only the tasks in its own list; where a v2.4.0 task already implements a borrowed concept (one test per component in D2, the v2 → v3 comparison in the benchmark reports, the unverified-number rule in the reports), that is noted above.
