# DESIGN.md: <Project name>

> How it looks. Written by `/shape`, read by every later command. If this file exists, it overrides the house defaults.

## Stack
- **Stack:** <Next.js | Astro | React + Vite | plain HTML/CSS/JS | other>
- **Source:** <named in the brief | read from the project | user's answer | "you choose">
- **Reason:** <one line; required for plain HTML and for "you choose">
- **Adapter:** `adapters/<x>.md`

## Dependencies
<!-- craft/stack.md: every package passes the three checks (active, not deprecated, licence free for commercial use; checked on npm and in the repo). Platform first. -->
| Package | Why (what the platform can't do) | 1 active (last release) | 2 deprecated | 3 licence |
|---|---|---|---|---|
| | | | | |

## Product contract
<!-- Step 1 (thinking/product-contract.md), approved at Checkpoint 2 BEFORE any concept. Authority level 4: no concept may
     silently remove what it lists. Required by gate axis X when the Scope states a delivery mode. -->
- **Product:** <what is built and why; the exact subtype>
- **Audience:** <who, device and connection, expertise, accessibility needs, how often they return>
- **Jobs:** 1. <in their words, most important first> 2. … 3. …
- **Business model:** <how it makes money or delivers value, and what that demands>
- **Core journeys:** <route sequences, e.g. / → /shop → /product/[slug] → /cart → /checkout → /order/[id]>
- **Information architecture:** <nav model (top nav, mega-menu, sidebar, search-first), route families, depth>
- **Content and density:** <per route family; data relationships>
- **Essential interactions and states:** <search, filters, compare, forms, auth-dependent views; empty / loading / error / success>
- **Responsive expectations:** <what collapses, what becomes a sheet, what stays one tap away on mobile; tablet; desktop>
- **Constraints:** <stack, existing architecture, dependencies, content availability, region, performance>
- **Explicit exclusions:** <item: reason, decided by the user | proposed, awaiting approval>
- **Success criteria:** <if stated>
- **Assumptions:** <gaps the brief left, answered from type research>

## Scope
<!-- Step 1 (thinking/sequence.md). Derived from the contract, research, standards and knowledge; never from a fixed list.
     Checked by scripts/completeness.mjs (gate axis X). Marks: requested · required · optional · not required for this brief, reason: <why>.
     Evidence: a path, optionally #<text> it must contain. Routes, legal pages and admin items starting with "/" are found automatically.
     A journey's evidence is its route sequence; every route in it must exist.
     Level (optional): interface · interaction · persisted · backend · integration. A deferred backend or integration names the
     interface that still ships: "not required for this brief, reason: payment provider deferred; interface: /checkout". -->
**Site type:** <type, region>
**Admin panel:** <yes | no> (settled at Checkpoint 2)
**Delivery mode:** <design exploration | functional frontend | production template> (from the request; templates/TEMPLATE.md)

| Kind | Item | Mark | Evidence | Level |
|---|---|---|---|---|
| route | </path> | requested | | interface |
| journey | <name: e.g. buy> | required | </ → /shop → /cart → /checkout> | interaction |
| function | <route: what it does> | required | <file#text> | interaction |
| function | <a deferred backend capability> | not required for this brief, reason: <backend deferred>; interface: </route> | | integration |
| state | <route or surface: empty / loading / error / filled> | required | <SCHEMA.md#text or file#text> | |
| legal | </privacy-or-what-the-region-requires> | required | | |
| edge | <edge case> | required | <file#text> | |
| admin | </admin/...> | required | | |
| skeleton | <async surface> | required | <file> | |
| template | <middleware.ts, data/, …> | <required, or not required for this brief, reason: …> | | |

## Type research
<!-- Step 1 (craft/research.md): real sites of the exact type (usually 3–5), or the closest, with the gap stated. Every finding
     observed / inferred / unverified. Required by gate axis X when the Scope states a delivery mode. -->
| Site | Type | Routes | Functionality | States | Admin | Legal | Notes |
|---|---|---|---|---|---|---|---|
| <name, URL> | <exact type> | <inventory> (observed / inferred / unverified) | … | … | <visible, or unverified> | … | <IA, journeys> |

**Gaps:** <what could not be verified, and the assumption used instead>

## Research record
<!-- Step 2 (craft/research.md). Questions first; sources chosen by what they prove; evidence, not screenshots.
     Concepts from inspiration; code only as a vetted dependency or permissively licensed with attribution. -->
**Access:** <web (searched YYYY-MM-DD) | no web access: working from training data (limitation: <what that means here>)>

**Questions:**
1. <what this project needs to learn to design well>
2. …

| Source (name, URL) | Kind | Observation | Intended use | Limitation |
|---|---|---|---|---|
| <name, URL> | <gallery / case study / shot / production / library / repo / docs> | <what it does and why it works> | <the principle taken, for which route or decision> | <what would fail here; what wasn't verified> |

**Techniques considered:**
- <technique> (<source>): <used | not used, why>

**Pattern being avoided:** <the overused pattern for this type> — <why it fails this product>

## Directions
<!-- Step 3. 2–3 directions that differ in kind; compared against the contract, not each other's novelty. -->
| | A <name> | B <name> | C <name> |
|---|---|---|---|
| Idea | | | |
| Structure per route family | | | |
| Type mode and motion language | | | |
| Journeys survive? | | | |
| Suitability · audience · usability · distinction · motion · responsive · technical · originality | | | |

**Chosen:** <A | B | C | a merge> — <why, against the contract>

## Divergence
<!-- Step 4 (thinking/sequence.md): node scripts/memory.mjs similar --brief "…" --category … (user-level log, every project) -->
- **Prior similar build:** <none: first build ever | none similar | run #n, <project>, <date>>
- **Diverging from → chose:** <dimension: x → y, for each unjustified similarity>
- **Same, justified:** <dimension: why the brief needs the same answer | none>

## Decision trace
<!-- Every consequential decision traces to the brief, the contract or research. "Skill default" is not a source; a heuristic is
     cited with its ID and why it applies here. -->
| Decision | Traces to |
|---|---|
| Structure and IA | <contract / brief: "…" / research row n> |
| Palette | |
| Type pairing and mode | |
| Motion language | |
| Signature move (or none) | |
| Components: reuse / adapt / adopt / build | |
| Heuristics ignored or adapted | <H-… : reason> |

## Concept
- **Tension:** 
- **Concept sentence:** 
- **Structure:** <from the contract | archetype <x> (+ mutation) for <surface> | none>
- **Exploration tools used or rejected:** <collision, recipes, styles, components: one reason each>
- **Signature move:** <one | none: identity from <system>>
- **Dials:** ENERGY _ · RHYTHM _ · MOTION _ → Tier _ (<per route family if they differ>)
- **Rejected:** 

## Typography
Type mode: HOUSE STYLE (typography-led) | SERVICE STYLE (information-led) — because <reason from the brief>

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | | | `--step-4` | |
| Heading | | | `--step-2/3` | |
| Body | | | `--step-0` | |
| Mono / labels | | | `--step--1` | |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | | — | page background |
| `--ink` | | | text |
| `--muted` | | | secondary text, rules |
| `--accent` | | | the one moment |

## Layout
- Grid: 
- Margins / gutters: 
- Section spacing: 
- Nav: 
- Footer (sign-off): 

## Components
- Buttons: 
- Links: 
- Cards (only if needed): 
- Forms: 

## Imagery
- Source: 
- Treatment: 
- `[NEEDS ASSET]` list: 

## Restraint Gate record
<!-- Filled in at Step 5 (Restraint) of the Thinking Sequence. scripts/gate.mjs derives the C and R critique scores from these lines, so keep the exact prefixes. -->
- Concept survived: <yes | yes, after 1 change | no>
- Cut: <what was removed> — fails Q1 and Q2 (no hierarchy, feedback or story; the brief doesn't need it)
- Kept: <element> — fails Q1, passes Q2: <what in the brief needs it>
- Rejected animation: <the animation> — <which of the four questions it failed>

