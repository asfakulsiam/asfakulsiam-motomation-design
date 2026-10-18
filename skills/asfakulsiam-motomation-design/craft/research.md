# Research protocol (Steps 1 and 2)

The skill's own recipes, components, data sets, archetypes and collision engine are one source. Used alone they make every build look like the skill made it, and they cannot cover the range of real products. Research sends the agent outside the skill twice: in Step 1 to learn what this exact type of product must do, and in Step 2 to discover how it could be designed. It is required for all new design work; its depth is proportional to the project.

## The order

1. **Read the brief and write the product contract** (`thinking/product-contract.md`). Name the exact type and subtype, or the combination (a marketplace with a subscription box is two).
2. **Type research (Step 1):** look at real websites of that exact type, same job not same look; record routes, functions, states, flows, admin and legal surfaces, each finding observed, inferred or unverified. It informs the contract and the Scope table.
3. **Write the design research questions (Step 2):** what this project needs to learn to design well.
4. **Choose sources by what they can prove** (below), search, and **extract evidence**: what works, why, what applies, what would fail here.
5. **Record it** with URLs and limitations.
6. **Synthesise** directions in Step 3. Never a copy of one reference, never a forced variation of a built-in recipe.

## Depth: proportional, not fixed

| Project | Type research | Design research |
|---|---|---|
| One informational page for a new brand | 2–3 comparable sites, a quick look | 2–3 questions, a handful of references |
| A multi-route brand or portfolio site | 3–5 sites | 3–5 questions, references across galleries and production sites |
| Commerce, marketplace, booking, SaaS app, publication, institution | 3–5 sites per type, deeper on journeys and states | 4–6 questions, including production patterns, component libraries and implementation sources |
| Immersive or award-ambition launch | as needed for the product | add motion and technique research: case studies, GitHub implementations, official docs |

Research that doesn't change a decision is stopped, not padded. Research that keeps finding the same answer has found it.

## Type research (exact type, for the product contract)

For each exact-type site (usually 3–5; fewer when few exist, gap stated), as far as it is publicly observable:

| Dimension | Record |
|---|---|
| Identity | who it is, purpose, audience, business model |
| Routes | the discoverable page inventory, nested pages, important route variants |
| Functionality | what each relevant route lets the visitor do |
| Flows | forms, search, filters, sorting, pagination; account, sign-in, onboarding; cart, checkout, payment, orders, or the type's equivalent |
| States | empty, loading, error, success, disabled, validation, authentication, permission-dependent, where they apply |
| Admin | seller-facing or admin surfaces, only if public or documented |
| Legal | privacy, terms, cookies, returns, accessibility, compliance pages |
| Structure | navigation, information architecture, content hierarchy, user journeys |
| Responsive | mobile navigation and what changes on small screens |

Record only the dimensions that matter for this type; a portfolio has no checkout to study.

Rules:

- **Observed, inferred, unverified.** Observed: you saw it. Inferred: a reasoned conclusion from what you saw or from the industry. Unverified: you could not reach it (behind a login, a paywall, a private admin, a region block). Never present an inferred or unverified item as observed.
- **Type references and inspiration are different lists.** A visually striking site from another industry can be a design reference below; it never counts as one of the 3–5 type references.
- **References are evidence, not a specification.** A competitor's feature becomes a scope row only when this brief needs it. A category recipe (`categories/<type>.md`), if one exists, is a starting point for design, not the scope.
- **Hybrid briefs** research each type separately, then keep only what the actual brief needs.
- **No category file** for the type: research it as itself. Do not force it into the nearest category.
- **When research falls short** (no web, blocked pages, too few public examples), say so, work from what you have, and mark the gaps unverified or as stated assumptions. Never fill a gap with an invented finding.

## Where to look (source files)

| File | Holds | Look here when |
|---|---|---|
| `references/sources/inspiration.md` | award sites and live sources (Awwwards, FWA, CSSDA, Godly, Land-book, SiteInspire, Dribbble, Behance, Codrops, showcases, platform design systems), curated lists, interaction experiments | always: start here for the brief's category |
| `references/sources/skills.md` | other agent skills and design methods (taste, anti-slop, motion principles, spec-first) | always: to question this skill's own process |
| `references/sources/components.md` | component libraries and design systems | the brief needs UI anatomy, states or accessibility behaviour |
| `references/sources/motion.md` | animation engines and motion references | Tier 2 and up, or any signature move that moves |
| `references/sources/3d.md` | 3D, shaders, WebGL, WebGPU | Tier 4–5, or a concept that needs depth or light |
| `references/sources/foundation.md` | frameworks, tokens, colour, fonts, measurement, testing | every build that ships code |
| `references/sources/future.md` | AI in the browser | the brief has an AI, camera or on-device feature |

Live search, last 6 months, by the brief's category (a bakery searches bakeries, food and hospitality; a SaaS brief searches the product's domain, not "SaaS landing page"). Older references only for heritage briefs, labelled as older. Search queries that work: `awwwards <category> site of the day <year>`, `<category> website <year> godly`, `codrops <technique>`.


## Design research questions

Questions decide where you look. Write 2–6, drawn from the contract and its tensions. Good questions name the product's real difficulty:

- "How do premium grocery apps keep a 2,000-item catalogue browsable on a phone?"
- "How do award-level hotel sites hand off from story to booking without a jarring change of register?"
- "What makes dense procurement tables scannable without looking like a spreadsheet?"
- "What motion language do the best editorial publications use for article transitions, and what do they avoid?"

A question like "what are good websites?" finds nothing useful.

## What each source proves

Sources serve different purposes. Choose by relevance and quality; you don't consult every platform for every project.

| Source | Good evidence for | Weak evidence for |
|---|---|---|
| **Awwwards, FWA, CSSDA, Godly, SiteInspire** | art direction, composition, interaction ideas, motion language | whether a pattern works in a real product at scale; accessibility |
| **Behance case studies** | complete brand and product systems, visual narratives, how an identity extends across touchpoints | live behaviour, responsive reality, implementation cost |
| **Dribbble shots** | focused component and interface treatments, micro-interaction ideas | anything structural; many shots are never built |
| **Real production websites** (category leaders, specialist players) | navigation, IA, journeys, content hierarchy, responsive behaviour, functional conventions users already know | visual originality; popularity is not quality |
| **UI and component libraries** (shadcn/ui, Radix, React Aria, Headless UI, platform design systems) | accessible patterns, states, keyboard models, responsive components | identity; their defaults look like their defaults |
| **GitHub repositories, Codrops, CodePen** | how an effect or interaction is actually implemented, its cost and its edge cases | product fit; demos skip states and accessibility |
| **Official framework and library docs** | correct APIs, version compatibility, performance and accessibility guidance | design direction |
| **Design publications, specialist studios, industry references** | context, rationale, trends with their reasons | details |

A concept shot is not proof that a pattern works. A production site is not automatically a good visual reference. Pair them: the gallery shows what is possible, the production site shows what users need, the library or repository shows how to build it properly.

## Extracting evidence

For each important reference, record more than its look:

- **Problem:** what problem does this design solve, for whom?
- **Hierarchy and IA:** how is the content ordered, how is navigation organised, how deep does it go?
- **Interaction and states:** how does it handle search, filtering, feedback, empty, loading, error?
- **Responsive:** what actually happens at 375px?
- **Composition:** what makes it distinctive (grid, scale, rhythm, image treatment, type role)?
- **Motion:** what moves, what triggers it, what it communicates (hierarchy, continuity, feedback, narrative, mood)?
- **Applies here:** which part transfers to this project, as a principle?
- **Fails here:** which part would break this contract, audience, stack or budget?

Only claim what you saw. A page you didn't load, a flow behind a login, an animation you only read about: mark it inferred or unverified.

## Reference into principle, not a copy

1. **Name the decision.** "The menu is the hero: dishes listed as a timetable", not "big serif on beige".
2. **Say why it works there.** What problem in that brief does it solve?
3. **State it as a principle.** "Lead with the inventory, not the atmosphere." A principle has no colour, font, brand or code in it.
4. **Test it against this brief.** Same problem here? If not, drop it.
5. **Hand it to the sequence.** It feeds Step 3: a direction, the tension, the concept, a structure or a signature. Input, not the concept.

If the build would still be recognisable as the reference with the logo swapped, it is a copy. Go back to 3.

## Code, components and techniques from research

Concepts come from inspiration sources; **code** enters a build only in one of three ways:

1. **A dependency** that passes the checks in `craft/stack.md` and `craft/components.md` (maintained, licence fits, accessible, compatible, worth its weight).
2. **Code under a permissive licence** (MIT, Apache-2.0, BSD, ISC), adapted for this build, with attribution in a comment and in `README.md` when the licence requires it.
3. **Code written for this build**, using a technique learned from a source.

Never copy protected visual work (layouts, illustrations, brand assets, distinctive compositions) or code with no licence or an incompatible one. Nothing at all from CreativeAgencyStyle (reported as malware). Name the techniques considered and their sources, say which one is used and why; the count follows the project, not a quota.

## How to record it

In `DESIGN.md` (from `templates/DESIGN.md`):

```markdown
## Type research
| Site | Type | Routes | Functionality | States | Admin | Legal | Notes |
|---|---|---|---|---|---|---|---|
| <name, URL> | <exact type> | <inventory> (observed / inferred / unverified) | … | … | <visible, or unverified> | … | <IA, journeys> |

**Gaps:** <what could not be verified, and the assumption used instead>

## Research record
**Access:** web (searched YYYY-MM-DD) | no web access: working from training data (limitation stated)

**Questions:**
1. <question>

| Source (name, URL) | Kind | Observation | Intended use | Limitation |
|---|---|---|---|---|
| <name, URL> | gallery / case study / shot / production / library / repo / docs | <what it does and why it works> | <the principle taken, for which route or decision> | <what would fail here, what wasn't verified> |

**Techniques considered:** <technique> (<source>): <used | not used, why>
**Pattern being avoided:** <the overused pattern for this type> — <why it fails this product>

## Decision trace
| Decision | Traces to |
|---|---|
| <structure, IA, type, palette, motion language, signature, component choice> | <brief: "quote" | contract | research row n | heuristic H-… with reason> |
```

At least one finding from outside the skill must change a decision. Every row of the decision trace names the brief, the contract or research; "skill default" is not an allowed answer, and a heuristic is cited with the reason it applies.

## No web access

Say so in one line before Step 2, set `Access: no web access: working from training data` and state the limitation. Still name exact-type sites and references from what you know, each finding marked inferred or unverified, each with the year you last knew it. Don't present remembered sites as current, and don't invent URLs. Never claim browsing you didn't do.

## Test

Before Step 3: does `DESIGN.md` have `Type research` (findings marked, gaps stated), a `Research record` with questions, sources with URLs, intended use and limitations, the access line, and a decision trace where nothing traces to "the skill's defaults"? Did at least one finding change a decision? If not, Step 3 doesn't start.
