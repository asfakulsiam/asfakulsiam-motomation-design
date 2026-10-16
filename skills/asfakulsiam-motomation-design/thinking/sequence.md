# The Thinking Sequence

This is the missing key: it makes an agent think like a designer instead of a template engine. Run Step 0 and all seven design steps for every page.

**Data is fuel, not a menu.** The files in `data/` (archetypes, palettes, fonts, mutations, collisions, motion, signatures, styles) inform the brief. Do not pick from a list; derive from the brief, using the list as reference and constraint. A draw from `scripts/collide.mjs` is a constraint to design inside, not a finished answer. Write the results into the preview block. Each step has a test. If the test fails, redo the step.

**One confirmation.** The agent asks exactly once per build, at the start, and never again. The flow:

1. Read the brief.
2. Step 0: Stack.
3. Step 0.5: Research.
4. Step 0.7: Derive the scope (what this build covers).
5. Present the plan: stack, scope, references, and what will be deferred (each with its reason).
6. Ask exactly one question: **"Proceed?"**
7. On yes, commit to the plan: build, gate, ship. No more interruptions: no question before the build, before the gate, or after the critique.

The agent may ask again only when (a) the brief is genuinely ambiguous on a critical choice (payment provider, legal region, locale priority), (b) a decision would lock in a costly choice the plan didn't cover (framework, hosting), or (c) the brief says "ask me before X" for something specific. Everything else the agent decides, states its reasoning in `DESIGN.md`, and moves on. Gaps in the brief are not questions: each becomes a stated default in the plan, which the user can change in their answer to "Proceed?". When no one can answer (CI, a benchmark run, a brief that says "don't ask"), the plan goes into `DESIGN.md` and the build proceeds.

**Rules come first, the gate comes last.** Before Step 0, read `gates/rules.md`: every limit the gate measures (contrast, overflow, reduced motion, accessibility, SEO, security, performance budgets). It is design input. Design inside it from the first step; `gates/delivery-gate.md` only verifies it at the end. A design that passes the gate by patching (an invented link, domain or page added to satisfy a check) was not designed within the rules.

**No component limits.** The components in examples/components/ are references and starting points. They are not a menu. They are not a limit. If the brief needs something that does not exist in the library, build it. Write it as one file, with a header that records tier, use-when, avoid-when, reduced-motion, and touch behaviour, following the same pattern as the library. The skill grows when the agent builds something new. Every step below composes, extends, or invents; none of them chooses from the library.

---

## 0. Stack

Before any design step, know what you are building in. The stack changes what the design can be (server rendering, a single file, a build step), so it is decided first and never guessed. Default and dependency rule: `craft/stack.md`.

1. **The brief names a stack** ("Next.js", "Astro", "a single HTML file", `--stack=<x>`), or the project already has one (read `package.json` and the framework config, say what you found): use it.
2. **The brief says "ask me":** ask once, inside the plan's single question, offering Next.js as the default.
3. **The brief says "you choose", or names none:** choose **Next.js (App Router, TypeScript, Tailwind)** for anything with routes or data. A single static page may be plain HTML/CSS/JS. Never pick Astro or React + Vite for e-commerce unless the brief demands it. Never pick the stack you used last.

   | Stack | When | Adapter |
   |---|---|---|
   | **Next.js (App Router, TS, Tailwind): the default** | anything with routes or data; every e-commerce | `adapters/next.md` |
   | Plain HTML/CSS/JS | a single static page | `adapters/vanilla.md` |
   | Astro | only when the brief asks for it | `adapters/astro.md` |
   | React + Vite | only when the brief asks for a client-only embed or prototype | `adapters/react-vite.md` |

4. **Every dependency passes the five checks** in `craft/stack.md` (maintained within 6 months, 10k+ weekly downloads, not deprecated, Node 20+ and React 19, MIT/Apache-2.0/ISC/BSD) before it is added: `npm view <pkg>`, the repo, the last release. A failure means an alternative or building it from scratch. Platform first; no heavy package for a small feature.
5. **Record it** in `DESIGN.md` under `Stack` and `Dependencies` (from `templates/DESIGN.md`): the stack, who chose it (brief, project, or you, confirmed at "Proceed?"), the reason, and each dependency's five checks.
6. **Load the adapter** for that stack. The adapter is chosen here, not at build time, and it is never skipped.

**Test:** can you point to where the stack came from (the brief, the project, or the default with its reason, shown in the plan), and does every dependency in `DESIGN.md` show five passed checks? If not, fix it before Step 0.5.

---

## 0.5 Research (mandatory)

Before designing anything, leave the skill. Its own components, data, archetypes and collision engine are one source; used alone, every build looks like the skill made it. This step is not optional. Protocol: `craft/research.md`.

- Search the live sources for the brief's category, last 6 months: Awwwards, FWA, CSSDA, Godly, Land-book, SiteInspire, Dribbble, Behance, Codrops, X and recent design publications (`references/sources/inspiration.md`).
- Read wide in `references/sources/` (at least two of `skills.md`, `components.md`, `motion.md`, `3d.md`, `foundation.md`, `future.md`) for method and technique. Concepts only: copy no code from any repository.
- Write in `DESIGN.md` under `References`: **References looked at** (three: name — what it is — what you took from it), **Techniques considered** (three, sources named), **Pattern being avoided** (the overused pattern in this category, and why).
- Fill the **Decision trace** in `DESIGN.md` as you go: every design decision traces to the brief or a named reference. "The skill's defaults" alone is never a source.

If you cannot access the web, say so explicitly, work from training data, and state the limitation in `DESIGN.md` (`Access: no web access: working from training data`).

**Test:** three references, three techniques with sources, the avoided pattern with why, the access line, and no decision traced only to the skill's defaults. If not, Step 1 doesn't start.

---

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

Compare your plan against three things:
1. **The AI-default list** in `gates/delivery-gate.md`. Count the matches.
2. **Memory (IDs and structure, every project):** run
   `node scripts/memory.mjs check --archetype <x> --signature <y> --tier <n> --sections hero,work,contact --type-scale <ratio>`.
   It checks the last 5 runs in the user-level log, from any project. First, exact IDs: an archetype or signature already used. Second, a **structural fingerprint**: layout family, type-scale bucket, section order, motion tier and signature type, scored 0–100%. A different archetype with the same rows layout, the same section order and the same kind of signature is still a repeat. At **≥ 70%** the script names the run you're rebuilding and the dimensions that match, and offers a mutation aimed at the heaviest one. Apply it (or justify the overlap in one line) and check again. Exit code 2 means a clash. `/invent` prints each draw's partial fingerprint and flags draws that rebuild a recent page. After delivery, `memory.mjs log` with the same flags stores the fingerprint. Without a shell, compare the five dimensions by hand against `~/.motomation/log.json`.
3. **The obvious version:** write down what a template would do. Your plan must differ in at least **three** of: structure, type, colour, motion, signature, imagery.

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

---

## Required output: DESIGN.md and SCHEMA.md

Every build ships two documents next to the code, written together while the design system is set (default flow, step 3), never after the build:

- `DESIGN.md` (`templates/DESIGN.md`): how it looks, with `References` from Step 0.5.
- `SCHEMA.md` (`templates/SCHEMA.md`): the data contract. Data model (every entity and field: name, type, required or optional, example, where it appears), Routes (every URL and what it reads), Section contract (every section id on every page, the data it reads, and what it renders when empty, loading, in error and filled), API surface (every endpoint, or "none: static"), Handoff notes (environment variables, third-party services, rate limits, auth flow).

A section added to the page gets its row in `SCHEMA.md` in the same edit. **Test:** could a backend developer build the backend from `SCHEMA.md` alone, without asking a question? Does every section `id` in the markup have a row in the section contract? If not, the build isn't finished.

---

## Worked example: "Portfolio for a motion designer in Dhaka"

```
Stack     : none named → Next.js (App Router, TS, Tailwind): the default for a site with routes (case studies) and data (the reel list); confirmed at "Proceed?"
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
