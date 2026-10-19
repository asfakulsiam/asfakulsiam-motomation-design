# The Thinking Sequence

This is how Motomation thinks like a designer instead of a template engine: **understand the product, research the landscape, synthesise a direction, then build and validate it.** Product first, art direction second, and neither may compensate for failure in the other. A beautiful site missing its journeys fails; a complete site that looks generic fails too.

**Authority.** When instructions disagree, `principles/authority.md` decides: user requirements, then safety and accessibility, then project constraints, then the product contract, then research evidence, then heuristics, then recipes and examples. Recipes, archetypes, components and draws are starting material at the bottom of that list. The agent is expected to look beyond them and may find something better than anything in the library.

**Data is fuel, not a menu.** The files in `data/` (archetypes, palettes, fonts, mutations, collisions, motion, signatures, styles) are reference and constraint. A draw from `scripts/collide.mjs` is an optional prompt, never an answer. Each step has a test; if the test fails, redo the step.

**Six checkpoints.** The user decides at every meaningful step. The skill drafts, shows its reasoning, and waits.

| Checkpoint | Comes after | The skill shows | The user |
|---|---|---|---|
| **1 Stack** | Step 0 | the proposed stack, why, and the alternatives | approves or overrides |
| **2 Product contract** | Step 1 | the product contract (jobs, journeys, IA, density, responsive expectations, exclusions) and the Scope table derived from it: routes, states, legal pages, admin surface, edge cases, each marked requested / required / optional, each deferral with its reason and the interface that still ships | approves, cuts or adds |
| **3 Research and direction** | Steps 2–5, dials, type and colour | the research questions and record (sources, findings, applicability, limitations); the 2–3 directions compared against the contract; the chosen synthesis with tension, concept, structure, motion language, type, palette, signature (or "none: identity from <system>"); which recipes and components were used, adapted or rejected, and why | approves, redirects or picks another direction |
| **4 Build plan** | the motion plan (`MOTION.md`) | route-by-route section order, the components it will reuse, adapt, adopt or build, the motion per section with its purpose, page transitions, and the mobile layout for each journey | approves or redirects |
| **5 Design review** | the build and its preview (Path A or B, below) | the preview, screenshots at 375, 768 and 1440 **for every core journey**, not just the home page, `DESIGN.md`, `MOTION.md`, `MEDIA.md`, `SCHEMA.md` and `DATA.md` (when the delivery mode has them) and a one-line summary | approves, or requests changes (a new preview, then Checkpoint 5 again) |
| **6 Gate and ship** | the gate and `/critique` on the **approved** design | the gate output (pasted), the critique (pasted), `GATE.md` and `CRITIQUE.md`, and where the handoff push went | accepts; a gate failure is fixed and the design re-presented first |

**Order:** Step 0 → **Checkpoint 1** → Step 1 (product contract and scope) → **Checkpoint 2** → Steps 2–5 (research, directions and synthesis, memory, restraint), the dials, type and colour → **Checkpoint 3** → the motion plan and build plan → **Checkpoint 4** → build → preview → **Checkpoint 5** (loops until approved) → gate and `/critique` on the approved design → handoff push → **Checkpoint 6**. The contract is approved before a concept exists, so a concept can never quietly shrink the product.

Rules at every checkpoint:

- **"Show me alternatives" is a valid answer.** The skill shows 2–3 options, each with its reasoning, and waits again.
- **The user can override any decision** the skill made, at this checkpoint or an earlier one. An override replaces the decision; the skill redoes only what depends on it and shows the affected checkpoint again. A concept that needs a contract change goes back to Checkpoint 2 with the change proposed, not applied.
- **The skill never proceeds without an explicit answer.** Silence, "hmm" or a question is not approval; answer the question and wait.
- **The skill never asks the same question twice.** An answered question stays answered (record it in `DESIGN.md` under `Decision trace`); a later checkpoint states it, it does not re-ask it.
- **If the brief already answers a checkpoint** (e.g. "use Next.js"), the skill states the answer and skips the question, but the user can still override. A brief that answers every checkpoint in advance (for example a benchmark or CI brief that says "approve every checkpoint") counts as the brief answering; without that, a run with no one to answer stops at the checkpoint.

Each checkpoint message ends with what the skill is waiting for: `Checkpoint <n> of 6: approve, redirect, or ask for alternatives.`

**Rules come first, the gate comes last.** Before Step 0, read `gates/rules.md`: every limit the gate measures (contrast, overflow, reduced motion, accessibility, SEO, security, performance budgets). It is design input. Design inside it from the first step; `gates/delivery-gate.md` only verifies it at the end. A design that passes the gate by patching (an invented link, domain or page added to satisfy a check) was not designed within the rules.

**Components are leverage, not a ceiling.** `examples/components/` is a toolkit. Reuse a component when it fits the concept, the contract and the stack; adapt it when it is close; adopt a well-maintained external one when it is better (`craft/components.md`); build a custom one when nothing fits. Never force a library component into a design because it exists, and never rebuild a solved accessible component for no reason.

---

## Which route (before Step 0)

The sequence below is the **full route**. Say the route in your first line (`SKILL.md`, "Routes"); `/build --route=light|full` forces it.

- **Full route** (all new design work, whatever its size: a new site even of one page, a new brand, art direction or product experience, a distinctive redesign, Tier 3+, forms, data): every step below, six checkpoints, the Delivery Gate with a stamp. Depth is proportional (`craft/research.md` → Depth): a one-page site gets a short contract, a short research pass and a small Scope table, never none.
- **Light route** (narrow maintenance in an established design: a broken state, a spacing or responsive defect, contrast, a component adjusted inside its visual system, a page added to an existing system with no new direction): skip Steps 1 to 5. Keep only Step 0 (the project's stack) and read the existing design first; no direction work, no scope derivation. Two checkpoints, Plan and Ship (a fix: Ship only). Change only what the cause needs, inside the existing design; media added, replaced or removed updates the project's `MEDIA.md` (`craft/media.md`). **The Delivery Gate still runs, every axis**, including J. Needs a new direction, structure, signature or concept: switch to full and say so.
- **Page count never decides the route.** If the work introduces a design direction or needs new product or site research, it is full.

## 0. Stack

Before any design step, know what you are building in. The stack changes what the design can be (server rendering, a single file, a build step), so it is decided first and never guessed. Default and dependency rule: `craft/stack.md`.

1. **The brief names a stack** ("Next.js", "Astro", "a single HTML file", `--stack=<x>`), or the project already has one (read `package.json` and the framework config, say what you found): use it. The existing project's architecture, component system and package policy are authority level 3; respect them.
2. **The brief says "ask me":** propose at Checkpoint 1, with Next.js as the default and the alternatives.
3. **The brief says "you choose", or names none:** choose for the project. **Next.js (App Router, TypeScript, Tailwind)** is the default for anything with routes or data. A single static page may be plain HTML/CSS/JS. Astro suits content-heavy, mostly static sites; React + Vite suits a client-only embed or prototype. Say why the choice fits.

   | Stack | When | Adapter |
   |---|---|---|
   | **Next.js (App Router, TS, Tailwind): the default** | anything with routes or data, including most commerce (alternatives: `craft/stack.md`) | `adapters/next.md` |
   | Plain HTML/CSS/JS | a single static page | `adapters/vanilla.md` |
   | Astro | content-heavy, mostly static sites, or when the brief asks | `adapters/astro.md` |
   | React + Vite | a client-only embed or prototype | `adapters/react-vite.md` |

4. **Every dependency passes the three checks** in `craft/stack.md` (active, not deprecated, licence free for commercial use) before it is added, plus the fit checks in `craft/components.md` (compatibility, accessibility, bundle cost, security, whether the benefit justifies it). Platform first; no heavy package for a small feature; never a dependency added only to reproduce a reference.
5. **Record it** in `DESIGN.md` under `Stack` and `Dependencies`: the stack, who chose it, the reason, and each dependency's checks.
6. **Load the adapter** for that stack. The adapter is chosen here, not at build time, and it is never skipped.

**Test:** can you point to where the stack came from (the brief, the project, or the default with its reason), and does every dependency in `DESIGN.md` show its checks passed? If not, fix it before Step 1.

**Checkpoint 1: Stack.** Show the proposed stack, why, and the alternatives, each with its trade-off. If the brief or project named the stack, state it and skip the question; the user can still override. Stop and wait.

---

## 1. Product contract and scope

Before any art direction, define the ideal product. Method: `thinking/product-contract.md`. This step is where "what are we building" is settled; nothing in Steps 2–5 may silently change it.

1. **Write the product contract** in `DESIGN.md` under `Product contract`: product and exact subtype, audience, jobs, business model, core journeys (each as a route sequence), information architecture, content and density, essential interactions and states, responsive expectations, constraints, explicit exclusions with reasons, success criteria.
2. **Look at real sites of this exact type** (`craft/research.md` → Type research): a proportionate number of real sites of the same job, not the same look, for their routes, functions, states, flows, admin surfaces, legal pages, navigation and mobile behaviour. Mark each finding observed, inferred or unverified; never claim to have seen hidden or authenticated routes. A competitor's feature is evidence, not a requirement. A hybrid brief researches each type. A type with no category file is researched as itself.
3. **Derive the scope** from the contract, the brief, the type research, industry and legal expectations, the delivery mode and judgment, never from a fixed list. A category file (`categories/<type>.md`) is a recipe at authority level 7: it can remind you of conventions; the derived scope wins.

Answer, and write in `DESIGN.md` under `Scope` with the **Delivery mode** line (Required output, below):

- What routes does a complete product of this type serve, and which journeys run through them?
- What functionality exists on each route, and at which capability level (`interface`, `interaction`, `persisted`, `backend`, `integration`)?
- What states does each route need?
- What legal, policy and support pages are required in this region?
- What edge cases must be handled?
- What admin surface does this type need?
- What skeleton states exist (one for every async surface)?

Write each as a row of the Scope table (`| Kind | Item | Mark | Evidence | Level |`; kinds: route, journey, function, state, legal, edge, admin, skeleton, template; `Level` is optional) and mark it:

- **requested**: the brief asks for it
- **required**: the product type needs it, though the brief didn't ask
- **optional**: nice to have; not checked
- **not required for this brief, reason: <why>**: excused, with the reason. A deferred backend or integration also names the interface that still ships (`…; interface: /checkout`).

A `journey` row's evidence is its route sequence (`/ → /shop → /product/[slug] → /cart → /checkout`); axis X checks that every route in it exists.

A **production template** build that has a server also requires (each one excused with a reason when it doesn't apply):

- `middleware.ts` with the auth gate, locale routing, redirects, rate limiting and security headers
- a skeleton for every async surface
- a `data/` folder of JSON mock data, typed by a `schema.json` inside that folder (the build's own `data/`, not this skill's)
- comments in every non-trivial file
- a sellable template: `README.md`, `DESIGN.md`, `MOTION.md`, `SCHEMA.md`, `CRITIQUE.md`, `GATE.md`, `LICENSE`, `CHANGELOG.md`, `.env.example`
- component headers (tier, use-when, avoid-when, reduced-motion, touch)

**Test:** does the contract name the jobs, the core journeys as route sequences, the IA, the density and the exclusions? Is every route, journey, state, legal page, edge case, admin surface and skeleton the type needs in the Scope table, each marked, each excuse with a reason, each deferred backend paired with its interface? `node scripts/completeness.mjs <project>` (gate axis X) checks them after the build; a missing item fails the gate.

**Checkpoint 2: Product contract.** Show the contract and the Scope table, with the admin panel (included / not included) and what is deferred and why. Raise consequential ambiguities here as questions. Stop and wait: the user approves, cuts or adds. After this, the contract is level 4 authority.

---

## 2. Design research

Leave the skill before designing. Its own recipes, components and draws are one source; used alone, every build looks like the skill made it. Method: `craft/research.md`.

1. **Write the research questions** this project needs answered (3–6, from the contract): "How do premium grocery apps keep a 2,000-item catalogue browsable on mobile?" "What makes procurement tables scannable without looking like a spreadsheet?" "How do award-level hospitality sites hand off from story to booking?" Questions, not sources, decide where you look.
2. **Pick sources by what they can prove** (`craft/research.md` → What each source proves): award galleries for art direction and motion; case studies for whole systems; shot galleries for component treatments; **real production sites** for navigation, IA, journeys and responsive behaviour; UI and component libraries for accessible patterns; GitHub and official docs for implementation. A concept shot is not proof a pattern works in a product; a popular production site is not automatically a good visual reference.
3. **Extract evidence, not screenshots.** For each important reference: the problem it solves, how its hierarchy and IA work, how it handles navigation, content, interaction and responsive layout, what makes the composition distinctive, what its motion communicates, what applies here, and what would fail here.
4. **Record it** in `DESIGN.md` under `Research record`: source (name and URL), observation, intended use, limitation. Fill the `Decision trace` as you go: every consequential decision traces to the brief, the contract or a research finding; "the skill's defaults" alone is never a source.

Depth scales with the project (`craft/research.md` → Depth): a one-page site asks two or three questions and looks at a handful of references; a marketplace or an immersive launch looks harder. Research that doesn't change a decision is skipped, not padded. No web access: say so, set `Access: no web access`, work from what you know, mark every finding unverified and invent no URLs.

**Test:** are there research questions, a research record with sources, applicability and limitations, and at least one finding that changed a decision? If research changed nothing, either the questions were wrong or the record is decoration; fix one.

---

## 3. Directions and synthesis

Find the tension, then explore a small number of meaningfully different directions, then choose or synthesise the one that serves the contract best.

**Tension.** Every good brief hides a conflict, and design lives in it. Ask: what two true things about this product pull against each other? (Centuries-old lanes ↔ a hotel that wants to feel new; huge volumes of noise ↔ finding one line; a 2,000-SKU catalogue ↔ a premium feel.) **Test:** could this tension belong to a different brief? If yes, make it specific.

**Directions.** Sketch 2–3 directions that differ in kind, not in colour: different structure, different type role, different motion language, different relationship between story and task. Each direction is a few lines: the concept sentence, the structural idea per route family, the type mode, the motion language, what it borrows from research, and how every core journey survives in it. One direction may be deliberately conventional-done-excellently; for many products that is the strongest answer.

**Compare them against the contract**, not against each other's novelty:

| Criterion | Question |
|---|---|
| Product suitability | Does every core journey stay discoverable and fast? Does the IA survive? |
| Audience and brand fit | Would this audience trust it and find their way? |
| Usability and accessibility | Keyboard, contrast, reading order, touch, reduced motion |
| Visual distinction | Could it be mistaken for a template or for the last build? |
| Motion and interaction potential | Does motion have something to communicate here? |
| Responsive feasibility | Does it work at 375px as a designed layout, not a squeezed one? |
| Technical feasibility | Within the stack, budget and performance limits? |
| Originality beyond references | Is it a synthesis, or one reference with a new logo? |

Choose the direction with the best balance, or merge the best parts of two. Write the comparison in `DESIGN.md` under `Directions`.

**Concept.** Resolve the tension in one sentence a client would repeat: "A site that [does something unexpected] so that [the tension resolves]." It is an idea, not a layout or a colour, and it is expressed through the product's routes, not instead of them.

**Exploration tools (optional, authority level 7).** Use them when they help; skip them when the contract and research already point somewhere better. Say in the plan which you used, adapted or rejected, and why.

- **Structures** (`structures/archetypes.md`, `data/archetypes.csv`): page metaphors with what each demands and when it fails. An archetype may shape the whole site, one route family, one storytelling surface, or nothing. A product with conventional IA (marketplace, dashboard, B2B, publication) gets its structure from the contract; an archetype at most shapes a narrative surface.
- **Mutation**: break one rule of the chosen structure, never a rule that protects a journey, the nav, a required state or accessibility (`principles/heuristics.md` → H-mutation).
- **Collision** (`scripts/collide.mjs`, `data/collisions.csv`, `invention/mad-artist.md`): steal one property from an unrelated world when exploration stalls. A draw is a prompt; if it doesn't fit, discard it and say why. You may choose freely after discarding it.
- **Signature move** (`signatures/`, `references/effects-vocabulary.md`): at most one interaction people remember, tied to the concept, used where the product has room for it. "No signature; identity from <the system>" is a valid answer for a product whose strength is calm, speed or density (`principles/heuristics.md` → H-signature).
- **Category recipes and styles** (`categories/`, `styles/`): checklists of conventions and treatments for a type; each says when to reject or adapt it.

**WRONG / RIGHT** (brief: "a B2B fastener supplier: 12,000 SKUs, account pricing, reorders"):

- **WRONG:** `Archetype: The Letter. Signature: letter-relay. Nav: wordmark plus three links.` A drawn metaphor overrode the product: no search, no catalogue IA, no reorder path.
- **RIGHT:** `Structure: from the contract (search-first header, category rail, spec tables, quick-reorder). Concept: "the catalogue reads like an engineer's datasheet: exact, dense, calm". Archetype: none site-wide; Spec Sheet (adapted) for product detail. Signature: none; identity from the datasheet type system and the tolerance-ruler spacing scale.`

**Test:** are 2–3 directions compared against the contract? Does the chosen one keep every core journey? Can you name what it took from research, and what it adds beyond any single reference? If a recipe or draw shaped it, is the fit argued?

---

**Several directions, one contract** (paired brief, A/B): share data, logic, validation, accessibility primitives, routes and form fields; compose each direction's pages, markup, layout, type, colour, imagery and motion separately. A theme swap over one template set is a reskin. Check: `node scripts/pair.mjs <dirA> <dirB>`, output under `Directions`.

## 4. Memory and sameness check

Compare the chosen direction against what was built before, so similar briefs don't collapse into the same site.

1. **Memory** lives at the user level (`~/.motomation/log.json`). Run `node scripts/memory.mjs similar --brief "<one line>" --category <category>`. No log or no similar brief: say so under `Divergence`. A similar prior build: diverge on the dimensions the brief doesn't justify (structure, palette family, type pairing, motion language, signature), and name any similarity the brief does justify (`Same : SERVICE STYLE again; both are dense dashboards`). Never diverge into a worse fit. Confirm with `node scripts/memory.mjs check …` (exit 2 = an unjustified repeat to look at); `--justified fonts,motion` makes a justified repeat a warning. `none` is never a repeat.
2. **The AI-default list** in `gates/delivery-gate.md`, Part 2: each "yes" needs a product or concept reason, or a change.
3. **Earlier builds, measured (after the build):** `node scripts/originality.mjs <this build> <earlier builds for unrelated briefs>` (axis O). An axis at or above **0.4** against an unrelated brief means it came out in the same shape: change that axis or justify it.
4. **The obvious version:** write what a template would do. Where you match it, it is because the product needs it, and you say so.

**Test:** if a stranger saw this site next to the last one, would they think it was made on autopilot? If yes, the direction needs more work, not a palette swap.

---

## 5. Restraint gate

Test every element (section, ornament, texture, colour moment, animation) with two questions:

1. **Does this serve hierarchy, feedback, or storytelling?**
2. **Does the product or brand need this to feel like itself?**

**Cut only what fails both.** Passing question 2 needs a reason traceable to the brief, the audience or the concept. Restraint never cuts a required capability: a contract item is not an "element" here. Advisory budgets (one signature at most, one display face, a disciplined accent) are in `principles/heuristics.md`; every animation passes the four questions in `motion/tokens.md`. Log `- Cut:` and `- Kept:` in `DESIGN.md`. Example and counter-example: `principles/restraint.md`.

**Test:** for every element, can you name the question it passes? If neither, cut it.

**Checkpoint 3: Research and direction** (after the dials, type and colour). Show the research questions and record, the directions compared, the chosen synthesis (tension, concept, structure per route family, motion language, type mode, type, palette, signature or none), what recipes and components it uses, adapts or rejects, and how each core journey survives. Stop and wait.

**Checkpoint 4: Build plan** (after `MOTION.md`). Show, per route family: the section order, the components to reuse, adapt, adopt or build (`craft/components.md`), the motion per section with its purpose (`motion/selection.md`), page transitions, and the mobile layout of each core journey. Stop and wait.

**Checkpoint 5: Design review**: the preview and review pack, with 375 / 768 / 1440 screenshots of each core journey; approve, or changes and a new preview.

**Checkpoint 6: Gate and ship**: the gate and `/critique` on the approved design, pasted, and the handoff. Nothing is pushed before the gate passes.

## Delivery flow: design review, then gate, then ship

Two paths. Both run the same six steps; only step 2 differs, by whether the agent can produce a preview the author can open.

**Path A: preview possible** (the agent can run a dev server or deploy and give the author a URL):

1. The agent designs and builds in its own environment.
2. It produces a **live preview** (a URL the author opens).
3. **Checkpoint 5:** it shows the preview plus the review pack: screenshots at 375, 768 and 1440, `DESIGN.md`, `MOTION.md`, `MEDIA.md`, `SCHEMA.md` and `DATA.md` (when the delivery mode has them), and a one-line summary.
4. The author reviews: **approve**, or **request changes**, which loop back to step 1 and a new preview.
5. The gate (`gates/delivery-gate.md`) and `/critique` run on the approved design. **Pass:** the handoff push to the connected repo. **Fail:** fix, and re-present (step 3).
6. **Checkpoint 6:** the handoff (the `handoff:` status line from `scripts/handoff.mjs`, the gate output, the critique, `GATE.md`, `CRITIQUE.md`, where the push went). A status other than `VALIDATED` is shown as it is, with its exceptions (`gates/handoff.md`).

**Path B: preview not possible** (no server, no deploy target, no network): the same six steps, except step 2. The agent produces a **build zip**, or pushes to a **temporary preview location** the author can open or deploy themselves. Steps 3–6 are unchanged.

**Preview push and handoff push are different things. Do not confuse the two.**

| | Preview push | Handoff push |
|---|---|---|
| When | step 2, before approval, as often as each review round needs | step 5, once, after approval **and** a passing gate |
| Where | any temporary location that is **not main**: a preview deploy, a `preview/<name>` branch, a zip | a real project: a feature branch `design/<name>`. A skill demo: heavy files (screenshots, frames, video) to the `evals` branch, the code to a `design/<name>` branch |
| Afterwards | deleted or ignored after approval; never merged | final; merged to main only by the owner, after review |
| Gate | not required (it is a draft) | required: the gate has passed on exactly what is pushed |

**Main is the shipping truth.** Nothing reaches main until the design is approved and the gate passes, and then only by merging the handoff branch.

---

## Micro-states: every one ships

The happy path is not the build. Every interactive or async thing ships all of its states, designed, not left to the browser default:

| Thing | States it ships |
|---|---|
| Every button | default, hover, focus, active, disabled, loading |
| Every form | default, validation error, submit loading, success, server error |
| Every list | empty, loading, error, filled |
| Every image | loading, loaded, error |
| Every async action | idle, pending, success, error |

Each state is in the section contract of `SCHEMA.md` and in the code (a CSS rule, an attribute such as `aria-busy`, `aria-invalid`, `disabled` or `data-state`, and the script that sets it). Mark data-driven lists with `data-entity` so their states can be checked. The gate reads the page's CSS, markup and scripts and **warns** on missing micro-states; it is advisory and never fails the gate.

**Test:** pick any button, form, list, image and async action on the page: can you show each state, and does `SCHEMA.md` name it?

## Required output: by delivery mode

The user's request sets the **delivery mode**; write it in `DESIGN.md` under `Scope` (`**Delivery mode:** …`). Respect an explicit request. "Design first, backend after approval" is **design exploration**; "a working UI on mock data, no backend" is **functional frontend**; "a complete implementation" is **production template**. Otherwise infer the most proportionate mode from the brief, and ask one focused question only when the difference matters and can't be inferred. The files each mode requires are in `templates/TEMPLATE.md` (axis X checks them):

- **Design exploration:** the researched concept, the derived route map and states, the design system, the motion direction with representative motion, a credible responsive prototype and a preview; `README.md`, `DESIGN.md`, `MOTION.md`, `MEDIA.md`, then `GATE.md` and `CRITIQUE.md`. No database, auth, payments or unrequested infrastructure, and not a generic static mockup either.
- **Functional frontend:** the approved design as working routes, navigation, interactions and every relevant UI state (loading, empty, success, validation, error) on demo-labelled mock data, with the integration boundaries named; adds `SCHEMA.md`, `DATA.md` and `data/` with its `schema.json`. Never claim persistence, auth, payment or another integration that doesn't exist.
- **Production template:** a complete, runnable template a designer can sell, not a folder of pages (below).

No mode lowers the bar: research for new design work, the concept, accessibility, responsiveness, reduced motion, originality and the gate apply to all three. A prototype that is complete is not production-ready; say which one you delivered.

The **production template** shape is `templates/TEMPLATE.md`:

- `README.md` (what it is, what is real, what is demo, how to run, how to deploy; it states "All data in data/ is demo. Replace with real data before launch."), `DESIGN.md`, `MOTION.md`, `SCHEMA.md`, `DATA.md`, `CRITIQUE.md`, `GATE.md` (the gate output per page, pasted), `LICENSE` (MIT by default), `CHANGELOG.md` (from v0.1.0), `.env.example` (every variable, with a placeholder)
- `data/`: mock JSON typed by its `schema.json`, every entry labelled demo (`templates/DATA.md`)
- `middleware.ts`, and a comment at the top of every non-trivial file
- `MEDIA.md` in the project root, in every build (`craft/media.md`)

For every image, video, icon, illustration, or other externally sourced visual asset, follow `craft/media.md`. Select media appropriate to the project, verify and record its provenance and applicable usage terms, identify temporary or unverified assets as placeholders, and document the assets and replacement requirements in the website project's root `MEDIA.md`.

It runs with zero configuration after `npm install && npm run dev`: mock data committed, no external services required.

`DESIGN.md` and `SCHEMA.md` are written together while the design system is set (default flow, step 3), never after the build; `DATA.md` with `SCHEMA.md`. `SCHEMA.md` (`templates/SCHEMA.md`) holds every entity and its data file, every route, every state, the environment variables, the API surface (or "none: static") and the handoff notes. A section added to the page gets its row in `SCHEMA.md` in the same edit.

**Test:** could a backend developer build the backend from `SCHEMA.md` alone, without asking a question? Does `npm install && npm run dev` start with no `.env`? Does `node scripts/completeness.mjs <project>` show `Template: n/n present` (excused items with their reasons)? If not, the build isn't finished.

---

---

## Worked example: "Portfolio for a motion designer in Dhaka"

```
Stack      : none named → Next.js (App Router, TS, Tailwind): routes (case studies) and data (the reel list); approved at Checkpoint 1
Contract   : jobs: clients judge range and craft in under a minute, then make contact · journeys: / → /work/[slug] → /contact; / → /about · IA: wordmark + Work, About, Contact · density: low · mobile: reel becomes a vertical list, contact one tap away
Research   : Q1 how do award-level motion portfolios show range without a grid of thumbnails? Q2 how do they keep case studies fast on mobile? (record: 6 sources, 2 changed decisions)
Directions : A film reel (scrubbed horizontally) · B index of credits (typographic, quiet) · C conventional grid done excellently → A chosen: best motion potential, journeys intact; B's credit list kept for /about
Tension    : 10 years of varied work ↔ clients remember one thing
Concept    : The site is a single film reel; each project is a frame you scrub through
Structure  : Film Reel (archetype used, adapted) mutated by "invert the axis": the reel runs horizontally while the page scrolls vertically; case-study pages stay conventional long-reads
Collision  : 35mm contact sheet → frame numbers, sprocket holes as a progress rail
Signature  : Hovering a project draws a grease-pencil circle around it (desktop); on touch, the frame number lights instead
Dials      : ENERGY 3 · RHYTHM 2 · MOTION 3 → Tier 5 on the home reel only; Tier 1–2 elsewhere
Type mode  : HOUSE STYLE (a portfolio: the work and the name are the impression)
Type       : Big Shoulders Display (condensed, cinematic) / Switzer (neutral text)
Palette    : Darkroom: #0E0D0B, #F2EEE6, accent safelight red #E0442B
Not doing  : Bento grid of thumbnails with a centred "Hi, I'm…" hero
```

Contrast it with a dense product: for "a B2B fastener supplier", the contract decides a search-first header, a category rail and spec tables; the directions explore how a datasheet type system and a calm tolerance-ruler grid can make that density feel premium; no archetype is used site-wide and there is no signature move. Both are full-route builds; they share a process, not a shape.
