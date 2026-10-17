# The Thinking Sequence

This is the missing key: it makes an agent think like a designer instead of a template engine. Run Step 0 and all seven design steps for every page.

**Data is fuel, not a menu.** The files in `data/` (archetypes, palettes, fonts, mutations, collisions, motion, signatures, styles) inform the brief. Do not pick from a list; derive from the brief, using the list as reference and constraint. A draw from `scripts/collide.mjs` is a constraint to design inside, not a finished answer. Write the results into the preview block. Each step has a test. If the test fails, redo the step.

**Six checkpoints.** The user decides at every meaningful step. The skill drafts, shows its reasoning, and waits. After each checkpoint the skill **stops** and waits for the user's answer: approve, redirect, or ask for more information.

| Checkpoint | Comes after | The skill shows | The user |
|---|---|---|---|
| **1 Stack** | Step 0 | the proposed stack, why, and the alternatives | approves or overrides |
| **2 Research and concept** | Step 0.5, Steps 1–7, dials, type and colour | the 3 references looked at and what it took from each; the pattern it is avoiding; the tension, concept, archetype and mutation; the collision draw output (`scripts/collide.mjs`, pasted); the palette, typography, motion tier and signature move; its reasoning for each | approves or redirects |
| **3 Scope** | Step 0.7 | the derived route list, states, legal pages, admin surface and edge cases, each marked requested / required / optional; what it is deferring and why | approves, cuts or adds |
| **4 Build plan** | the motion plan (`MOTION.md`) | the section order, the components it will create (compose, extend or invent), the animation language per section, the page-to-page transitions | approves or redirects |
| **5 Design review** | the build and its preview (Path A or B, below) | the preview (a live URL, or a build zip / temporary preview location), screenshots at 375, 768 and 1440, `DESIGN.md`, `MOTION.md`, `MEDIA.md`, `SCHEMA.md` and `DATA.md` (when the delivery mode has them) and a one-line summary | approves, or requests changes (a new preview, then Checkpoint 5 again) |
| **6 Gate and ship** | the gate and `/critique` on the **approved** design | the gate output (pasted), the critique (pasted), `GATE.md` and `CRITIQUE.md`, and where the handoff push went | accepts; a gate failure is fixed and the design re-presented first |

**Order:** Step 0 → **Checkpoint 1** → Step 0.5, the memory check, Steps 1–7, the dials, type and colour → **Checkpoint 2** → Step 0.7 → **Checkpoint 3** → the motion plan and section order → **Checkpoint 4** → build → preview → **Checkpoint 5** (loops until approved) → gate and `/critique` on the approved design → handoff push → **Checkpoint 6**. (Step 0.7 is written below Step 0.5 because its research overlaps; it is shown at Checkpoint 3, after the concept is approved.)

Rules at every checkpoint:

- **"Show me alternatives" is a valid answer.** The skill shows 2–3 options, each with its reasoning, and waits again.
- **The user can override any decision** the skill made, at this checkpoint or an earlier one. An override replaces the decision; the skill redoes only what depends on it and shows the affected checkpoint again.
- **The skill never proceeds without an explicit answer.** Silence, "hmm" or a question is not approval; answer the question and wait.
- **The skill never asks the same question twice.** An answered question stays answered (record it in `DESIGN.md` under `Decision trace`); a later checkpoint states it, it does not re-ask it.
- **If the brief already answers a checkpoint** (e.g. "use Next.js"), the skill states the answer and skips the question, but the user can still override. A brief that answers every checkpoint in advance (for example a benchmark or CI brief that says "approve every checkpoint") counts as the brief answering; without that, a run with no one to answer stops at the checkpoint.

Each checkpoint message ends with what the skill is waiting for: `Checkpoint <n> of 6: approve, redirect, or ask for alternatives.`

**Rules come first, the gate comes last.** Before Step 0, read `gates/rules.md`: every limit the gate measures (contrast, overflow, reduced motion, accessibility, SEO, security, performance budgets). It is design input. Design inside it from the first step; `gates/delivery-gate.md` only verifies it at the end. A design that passes the gate by patching (an invented link, domain or page added to satisfy a check) was not designed within the rules.

**No component limits.** The components in examples/components/ are references and starting points. They are not a menu. They are not a limit. If the brief needs something that does not exist in the library, build it. Write it as one file, with a header that records tier, use-when, avoid-when, reduced-motion, and touch behaviour, following the same pattern as the library. The skill grows when the agent builds something new. Every step below composes, extends, or invents; none of them chooses from the library.

---

## Which route (before Step 0)

The sequence below is the **full route**. Say the route in your first line (`SKILL.md`, "Routes"); `/build --route=light|full` forces it.

- **Full route** (all new design work, whatever its size: a new site even of one page, a new brand, art direction or product experience, a distinctive redesign, Tier 3+, forms, data): every step below, the collision engine in Step 4, the scope in Step 0.7, six checkpoints, the Delivery Gate with a stamp. Depth is proportional: a one-page site gets a shorter Step 0.5 and a smaller Scope table, never none.
- **Light route** (narrow maintenance in an established design: a broken state, a spacing or responsive defect, contrast, a component adjusted inside its visual system, a page added to an existing system with no new direction): skip Steps 0.5 to 7. Keep only Step 0 (the project's stack) and read the existing design first; no collision draw, no scope derivation. Two checkpoints, Plan and Ship (a fix: Ship only). Change only what the cause needs, inside the existing design. **The Delivery Gate still runs, every axis**, including J. Needs a new direction, structure, signature or concept: switch to full and say so.
- **Page count never decides the route.** If the work introduces a design direction or needs new product or site research, it is full.

## 0. Stack

Before any design step, know what you are building in. The stack changes what the design can be (server rendering, a single file, a build step), so it is decided first and never guessed. Default and dependency rule: `craft/stack.md`.

1. **The brief names a stack** ("Next.js", "Astro", "a single HTML file", `--stack=<x>`), or the project already has one (read `package.json` and the framework config, say what you found): use it.
2. **The brief says "ask me":** propose at Checkpoint 1, with Next.js as the default and the alternatives.
3. **The brief says "you choose", or names none:** choose **Next.js (App Router, TypeScript, Tailwind)** for anything with routes or data. A single static page may be plain HTML/CSS/JS. Never pick Astro or React + Vite for e-commerce unless the brief demands it. Never pick the stack you used last.

   | Stack | When | Adapter |
   |---|---|---|
   | **Next.js (App Router, TS, Tailwind): the default** | anything with routes or data; every e-commerce | `adapters/next.md` |
   | Plain HTML/CSS/JS | a single static page | `adapters/vanilla.md` |
   | Astro | only when the brief asks for it | `adapters/astro.md` |
   | React + Vite | only when the brief asks for a client-only embed or prototype | `adapters/react-vite.md` |

4. **Every dependency passes the three checks** in `craft/stack.md` (active, not deprecated, licence free for commercial use) before it is added: npm and the repo for the deprecation notice, the last release date and the licence. A failure means an alternative or building it from scratch. Platform first; no heavy package for a small feature.
5. **Record it** in `DESIGN.md` under `Stack` and `Dependencies` (from `templates/DESIGN.md`): the stack, who chose it (brief, project, or you, approved at Checkpoint 1), the reason, and each dependency's three checks.
6. **Load the adapter** for that stack. The adapter is chosen here, not at build time, and it is never skipped.

**Test:** can you point to where the stack came from (the brief, the project, or the default with its reason, shown in the plan), and does every dependency in `DESIGN.md` show three passed checks? If not, fix it before Step 0.5.

**Checkpoint 1: Stack.** Show the proposed stack, why, and the alternatives (e.g. Next.js · plain HTML · Astro, each with its trade-off). If the brief or project named the stack, state it and skip the question; the user can still override. Stop and wait.

---

## 0.5 Research (mandatory)

Before designing anything, leave the skill. Its own components, data, archetypes and collision engine are one source; used alone, every build looks like the skill made it. This step is not optional. Protocol: `craft/research.md`.

**First, the exact type.** Find 3–5 real websites that are exactly the type you are building. Not merely visually similar: a banking site for a banking brief, a model portfolio for a model brief, a B2B portal for a B2B brief, an e-commerce marketplace for a marketplace brief, and so on. If fewer than three credible ones exist, use the closest genuinely comparable products and state the limitation; never invent one. A striking site from another industry is design inspiration (below), not a type reference. For each, record in `DESIGN.md` under `Type research`, as far as it is publicly observable:

- identity, purpose, audience and business model
- the discoverable route or page inventory, including nested pages and important route variants
- the functionality on each relevant route, and its flows: forms, search, filters, sorting, pagination; account, sign-in and onboarding; cart, checkout, payment and orders, or the type's equivalent
- important states: empty, loading, error, success, disabled, validation, authentication and permission-dependent, where they apply
- responsive behaviour and mobile navigation
- visible admin or seller-facing surfaces, if public or documented
- legal, privacy, policy and compliance pages
- navigation, information architecture, content hierarchy and user journeys worth noting

Mark each finding **observed**, **inferred**, or **unverified**. Never claim to have inspected hidden routes, private admin panels, authenticated flows or anything you could not reach; label it unverified and fall back on other evidence or a stated assumption. A hybrid brief (two business models or site types) researches each type separately. A type with no category file is researched as itself, never forced into an unrelated category. These findings feed Step 0.7: the scope is derived from the brief, this evidence, industry conventions, legal or regulatory requirements, the delivery mode and design judgment. Neither a competitor's feature nor a category recipe becomes a requirement automatically; a recipe, if one exists, is a starting point for design exploration. Proportion the depth to the build: the goal is a justified scope, not an audit of every competitor.

**Then, design inspiration, separately:**

- Search the live sources for the brief's category, last 6 months: Awwwards, FWA, CSSDA, Godly, Land-book, SiteInspire, Dribbble, Behance, Codrops, X and recent design publications (`references/sources/inspiration.md`).
- Read wide in `references/sources/` (at least two of `skills.md`, `components.md`, `motion.md`, `3d.md`, `foundation.md`, `future.md`) for method and technique. Concepts only: copy no code from any repository.
- Write in `DESIGN.md` under `References`: **References looked at** (three: name — what it is — what you took from it), **Techniques considered** (three, sources named), **Pattern being avoided** (the overused pattern in this category, and why).
- Fill the **Decision trace** in `DESIGN.md` as you go: every design decision traces to the brief or a named reference. "The skill's defaults" alone is never a source.

If you cannot access the web, say so explicitly, work from training data, and state the limitation in `DESIGN.md` (`Access: no web access: working from training data`).

**Test:** 3–5 exact-type websites (or the closest, with the gap stated) with their findings marked observed / inferred / unverified, three references, three techniques with sources, the avoided pattern with why, the access line, and no decision traced only to the skill's defaults. If not, Step 1 doesn't start.

---

## 0.7 Derive the scope

The brief names a few pages; a complete site of its type needs more. "Build an e-commerce" means the whole e-commerce, not a homepage and some pages. Derive the scope yourself, from the brief and its explicit requirements, the Step 0.5 type research, the functionality and journeys the type needs, industry and legal expectations, technical constraints, the delivery mode, and reasoned judgment where evidence is missing (marked as such). **Do not pick from a hardcoded list**: there is none in this skill, and `scripts/completeness.mjs` only checks what you derive.

A category recipe (`categories/<type>.md`) is design opinion, not scope. The scope is derived from research, not read from a file. This applies to every site type, not just the ones with a category file. If the requested type has no category file, the scope is derived entirely from research. If the recipe and the derived scope disagree, the derived scope wins.

Answer, and write in `DESIGN.md` under `Scope` (from `templates/DESIGN.md`), with the **Delivery mode** line (Required output, below):

- What routes does a complete <site type> serve, and which user journeys run through them?
- What functionality exists on each page?
- What states does each page need?
- What legal, policy and support pages are required in this region?
- What edge cases must be handled?
- What admin surface does this type need?
- What skeleton states exist (one for every async surface: lists, grids, search, detail pages, cart, checkout, account, admin, whatever this type has)?

Write each as a row of the Scope table (`| Kind | Item | Mark | Evidence |`; kinds: route, function, state, legal, edge, admin, skeleton, template) and mark it:

- **requested**: the brief asks for it
- **required**: the site type needs it, though the brief didn't ask
- **optional**: nice to have; not checked
- **not required for this brief, reason: <why>**: excused, with the reason

Show the Scope table at **Checkpoint 3**, with the admin panel (included / not included) and what is deferred, each with its reason. The user approves, cuts or adds; then the scope is settled.

A **production template** build that has a server also requires (each one excused in the table with a reason when it doesn't apply, e.g. a single static page; the other delivery modes need only what `templates/TEMPLATE.md` lists for them):

- `middleware.ts` with the auth gate, locale routing, redirects, rate limiting and security headers
- a skeleton for every async surface
- a `data/` folder of JSON mock data, typed by a `schema.json` inside that folder (the build's own `data/`, not this skill's)
- comments in every non-trivial file
- a sellable template: `README.md`, `DESIGN.md`, `MOTION.md`, `SCHEMA.md`, `CRITIQUE.md`, `GATE.md`, `LICENSE`, `CHANGELOG.md`, `.env.example`
- component headers (tier, use-when, avoid-when, reduced-motion, touch)

**Test:** is every route, state, legal page, edge case, admin surface and skeleton the site type needs in the Scope table, each marked, each excuse with a reason? `node scripts/completeness.mjs <project>` (gate axis X) will check them after the build; a missing item fails the gate.

**Checkpoint 3: Scope** (after Checkpoint 2). Show the route list, states, legal pages, admin surface and edge cases, each marked requested / required / optional, and what is deferred and why. Stop and wait: the user approves, cuts or adds.

## Memory check (mandatory, before Step 1)

Memory lives at the user level (`~/.motomation/log.json`, every project), not in the project. Before designing, check it for similar briefs:

`node scripts/memory.mjs similar --brief "<the brief, one line>" --category <category>`

- **No log yet** (first build ever): no divergence required. Say so in `DESIGN.md` under `Divergence`.
- **No similar brief:** say so, and continue.
- **A similar prior build** (same category, or shared brief words): the new build must differ on **all five**: archetype, palette family, type pairing, motion language, signature move. Write in `DESIGN.md` under `Divergence` what you are diverging from (run, project, and the five values) and what you chose instead. Confirm with `node scripts/memory.mjs check --brief … --category … --archetype … --palette … --fonts … --motion … --signature …` (exit 2 = a repeat).

Without a shell, read `~/.motomation/log.json` by hand and compare the five values. **Test:** does `DESIGN.md` have a `Divergence` section that names the prior build (or says there is none)? If not, Step 1 doesn't start.

## 1. Tension

**Required before this step:** `gates/rules.md` has been read. State it in one line before the step starts:
`Rules : gates/rules.md read; designing within it.`
If you haven't read it, stop and read it. No step of the sequence runs without that line.

Every good brief hides a conflict. Design lives in that conflict.

Ask: **what two true things about this brief pull against each other?**

| Brief | Tension |
|---|---|
| Boutique hotel in old Dhaka | Centuries-old lanes ↔ a hotel that wants to feel new |
| Developer tool for logs | Huge volumes of noise ↔ finding one line |
| Ceramic studio shop | Slow handmade objects ↔ fast online buying |
| Climate non-profit | Urgent emergency ↔ readers worn out by alarm |
| Designer portfolio | "Look at my range" ↔ "remember one thing about me" |

**Test:** could this tension belong to a different brief? If yes, it's too generic ("modern vs classic" fits everything). Make it specific.

---

## 2. Concept

The concept resolves the tension in one sentence. It is an idea, not a layout or a colour.

Formula: **"A site that [does something unexpected] so that [the tension resolves]."**

- Hotel: "The site is a slow walk down one lane, where each scroll step opens a door."
- Log tool: "Everything is noise until you type, then the page goes quiet around your one line."
- Ceramics: "Every product page is a kiln firing: it starts raw and finishes glazed as you scroll."
- Non-profit: "Instead of alarms, the page counts what is still saveable, and it grows as you read."
- Portfolio: "One name, set huge, that every project slides behind like a stage curtain."

**Test:** would a client repeat the sentence to a friend? Can you draw it in three frames? If not, sharpen it.

---

## 3. Archetype + Mutation

Derive the page's structure from the concept. `structures/archetypes.md` and `data/archetypes.csv` are reference and constraint: they tell you what structures exist and what each one demands, not which one to take. Then **mutate** it: break one rule of that structure on purpose.

Mutation operators (or draw one with `node scripts/collide.mjs`):
- **Invert the axis.** Vertical becomes horizontal, or time runs backwards.
- **Change the scale.** One element becomes 10× bigger or smaller than expected.
- **Swap the material.** Paper becomes glass, a list becomes a map.
- **Remove the expected.** No nav, no hero image, no grid.
- **Make the UI the content.** The scrollbar is the timeline, the cursor is the product.
- **Slow it down / speed it up.** One section moves at film speed while the rest stay still.
- **Borrow a rule from print.** Marginalia, footnotes, a folio, a masthead, a colophon.

**WRONG / RIGHT** (brief: "a 1962 family bakery in Old Dhaka; it should feel like the shop"):

- **WRONG:** `Archetype: The Ledger. Mutation: invert-axis.` Two rows copied from the CSVs; it would read the same for a law firm.
- **RIGHT:** `Structure: the shop's order book (Ledger as reference: dated rows, running totals). Each section is a day's page, bakes as line items. Mutation (invert-axis as the constraint): the book reads back in time, today first, the 1962 opening entry last.` The rows set the constraints; the brief supplied every specific.

**Test:** name the original structure, then name the rule you broke. If you can't name the broken rule, you haven't mutated it. If your plan line could be pasted onto a different brief unchanged, you copied a row instead of deriving.

**When the draw doesn't fit.** If the drawn archetype can't serve the brief, take the draw's seeded fallback (`collide.mjs` prints "If it can't serve the brief, take: …"). Don't swap in the archetype you like best: hand-picked replacements converge. In the v2 benchmark, two SaaS runs drew different archetypes (Lookbook, Gallery Wall), both replaced them with Console, and the two pages came out as the same structure. If the fallback can't serve the brief either, write one line in the plan saying why both failed, then choose.

---

## 4. Forced Collision

Take something from a world unrelated to the brief and steal **one property** from it. This is where original patterns come from.

Run `node scripts/collide.mjs --n 3`, or read `data/collisions.csv` as fuel: the worlds show the kind of distance that works; steal from a world the brief suggests, not the next row. Examples:

| Source | Property stolen | Becomes |
|---|---|---|
| Railway departure board | Flipping characters, rows as a schedule | A menu that flips into place |
| Tailor's measuring tape | Numbered ruler, tension when pulled | A scroll progress bar that stretches |
| Darkroom | Images appear slowly in red light | Photos develop from blank as they enter view |
| Theatre curtain | Reveal by withdrawal | Sections open sideways, not upward |
| Seismograph | One continuous line that reacts | A hairline across the page that tracks the cursor |
| Library card catalogue | Index cards and tabs | Case studies as pull-out cards |

**Test:** the collision must be visible in the final site but not literal. No clip-art trains: steal the behaviour, not the picture.

---

## 5. Signature Move

Invent one interaction or motion that people will remember and describe. Use `signatures/` and `examples/components/` as references, then make it specific to this concept: compose, extend, or invent. If what the concept needs is not in the library, build it as a new file with the library's header.

Good signature moves are:
- **Tied to the concept.** For the hotel lane: doors that open on scroll. For the log tool: the page goes quiet as you type.
- **Felt in the first 5 seconds.**
- **Repeated with variation**, at least twice: introduced in the hero, echoed later.
- **Describable in one line**: "the name breaks into letters and each one runs into the header".

**Test:** if you removed it, would the site lose its identity? If not, it's decoration, not a signature.

---

## 6. Anti-Sameness Check

Compare your plan against four things:
1. **The AI-default list** in `gates/delivery-gate.md`. Count the matches.
2. **Memory (IDs and structure, every project):** run
   `node scripts/memory.mjs check --archetype <x> --signature <y> --tier <n> --sections hero,work,contact --type-scale <ratio>`.
   It checks the last 5 runs in the user-level log, from any project. First, exact IDs: an archetype or signature already used. A repeated motion tier is only a warning ("Tier 2 used in the last N builds. This is allowed if the brief requires it. State the reason in DESIGN.md."): the tier follows the brief, so it is never forced to change. A repeated palette family is also a warning, and so is a collision source drawn in the last 5 builds (`memory.mjs log --collision "<source>"`; `collide.mjs --exclude-recent` skips those sources). Second, a **structural fingerprint**: layout family, type-scale bucket, section order, motion tier and signature type, scored 0–100%. A different archetype with the same rows layout, the same section order and the same kind of signature is still a repeat. At **≥ 70%** the script names the run you're rebuilding and the dimensions that match, and offers a mutation aimed at the heaviest one. Apply it (or justify the overlap in one line) and check again. Exit code 2 means a clash. `/invent` prints each draw's partial fingerprint and flags draws that rebuild a recent page. After delivery, `memory.mjs log` with the same flags stores the fingerprint. Without a shell, compare the five dimensions by hand against `~/.motomation/log.json`.
3. **Earlier builds, measured (after the build):** the plan is checked here; the result is checked by `node scripts/originality.mjs <this build> <earlier builds for unrelated briefs>`, axis O of `gates/delivery-gate.md`. It scores structure, composition, image treatment, typography, interaction and signature move from 0 to 1 against each earlier build. Any axis at or above **0.4** means this brief came out in the same shape as an unrelated one: change that axis and re-run. The memory check compares what you intended; this compares what the browser renders.
4. **The obvious version:** write down what a template would do. Your plan must differ in at least **three** of: structure, type, colour, motion, signature, imagery.

**Reuse across projects.** Memory now spans every project, so a repeat from another project is caught like one from this project. A deliberate reuse is allowed only for a dissimilar brief, as a documented mutation (a different mutation **and** a different structural fingerprint), stated in one line: `Reuse : Letter again (used in <project>), mutated by remove-expected; signature type micro, not type`. For a similar brief, the five-way divergence above always applies.

**Test:** if a stranger saw your site next to the last one you made, would they think the same person made them on autopilot? If yes, mutate again.

---

## 7. Restraint Gate

Test every element (section, ornament, texture, colour moment, animation) with two questions:

1. **Does this serve hierarchy, feedback, or storytelling?**
2. **Does the brief need this to feel like itself?** (the café's hand-drawn map, the darkroom's grain)

**Cut only what fails both.** Failing question 1 alone is no reason to cut: a brand's texture or ornament can do no informational work and still be the point. Passing question 2 needs a reason traceable to the brief, its audience or the concept sentence; "it looks nice" is not one.

The budgets hold either way: one signature move, one accent moment per screen, one display face (two only for a contrast concept), every animation passes the four questions in `motion/tokens.md`. Question 2 keeps an element; it never buys a second signature or a contrast failure. Log `- Cut:` (failed both) and `- Kept:` (failed Q1, passed Q2, with the reason) in `DESIGN.md`. Example and counter-example: `principles/restraint.md`.

**Test:** for every element, can you name the question it passes? If neither, cut it.

**Checkpoint 2: Research and concept** (after the dials, type and colour). Show the 3 references looked at and what was taken from each, the pattern being avoided, the tension, concept, archetype and mutation, the collision draw output (pasted), the palette, typography, motion tier and signature move, with the reasoning for each. Stop and wait: the user approves or redirects.

**Checkpoint 4: Build plan** (after `MOTION.md`). Show the section order, the components to create (compose, extend or invent, each named), the animation language per section, and the page-to-page transitions. Stop and wait.

**Checkpoint 5: Design review**: the preview and review pack; approve, or changes and a new preview.

**Checkpoint 6: Gate and ship**: the gate and `/critique` on the approved design, pasted, and the handoff. Nothing is pushed before the gate passes.

## Delivery flow: design review, then gate, then ship

Two paths. Both run the same six steps; only step 2 differs, by whether the agent can produce a preview the author can open.

**Path A: preview possible** (the agent can run a dev server or deploy and give the author a URL):

1. The agent designs and builds in its own environment.
2. It produces a **live preview** (a URL the author opens).
3. **Checkpoint 5:** it shows the preview plus the review pack: screenshots at 375, 768 and 1440, `DESIGN.md`, `MOTION.md`, `MEDIA.md`, `SCHEMA.md` and `DATA.md` (when the delivery mode has them), and a one-line summary.
4. The author reviews: **approve**, or **request changes**, which loop back to step 1 and a new preview.
5. The gate (`gates/delivery-gate.md`) and `/critique` run on the approved design. **Pass:** the handoff push to the connected repo. **Fail:** fix, and re-present (step 3).
6. **Checkpoint 6:** the handoff (the gate output, the critique, `GATE.md`, `CRITIQUE.md`, where the push went).

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

## Worked example: "Portfolio for a motion designer in Dhaka"

```
Stack     : none named → Next.js (App Router, TS, Tailwind): the default for a site with routes (case studies) and data (the reel list); approved at Checkpoint 1
Tension   : 10 years of varied work ↔ clients remember one thing
Concept   : The site is a single film reel; each project is a frame you scrub through
Archetype : Film Reel (Tier 5 scroll-film) mutated by "invert the axis": the reel runs horizontally while the page scrolls vertically
Collision : 35mm contact sheet → frame numbers, sprocket holes as a progress rail, grease-pencil circles as hover marks
Signature : Hovering a project draws a grease-pencil circle around it; scrolling past the reel's end rewinds it with a film-leader countdown
Dials     : ENERGY 3 · RHYTHM 2 · MOTION 3 → Tier 5
Type mode : HOUSE STYLE (a portfolio: the work and the name are the impression, nobody comes to compare rows)
Type      : Big Shoulders Display (condensed, cinematic) / Switzer (neutral text)
Palette   : Darkroom: #0E0D0B, #F2EEE6, accent safelight red #E0442B
Not doing : Bento grid of thumbnails with a centred "Hi, I'm…" hero
```
