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

## Scope
<!-- Step 0.7 (thinking/sequence.md). Derived from research, standards and knowledge; never from a fixed list.
     Checked by scripts/completeness.mjs (gate axis X). Marks: requested · required · optional · not required for this brief, reason: <why>.
     Evidence: a path, optionally #<text> it must contain. Routes, legal pages and admin items starting with "/" are found automatically. -->
**Site type:** <type, region>
**Admin panel:** <yes | no> (settled at Checkpoint 3)
**Delivery mode:** <design exploration | functional frontend | production template> (from the request; templates/TEMPLATE.md)

| Kind | Item | Mark | Evidence |
|---|---|---|---|
| route | </path> | requested | |
| function | <route: what it does> | required | <file#text> |
| state | <route or surface: empty / loading / error / filled> | required | <SCHEMA.md#text or file#text> |
| legal | </privacy-or-what-the-region-requires> | required | |
| edge | <edge case> | required | <file#text> |
| admin | </admin/...> | required | |
| skeleton | <async surface> | required | <file> |
| template | <middleware.ts, data/, …> | <required, or not required for this brief, reason: …> | |

## References
<!-- Step 0.5, mandatory (craft/research.md). Written before Step 1. Sources: references/sources/ + live award sites. Concepts only, no copied code. -->
**Access:** <web (searched YYYY-MM-DD) | no web access: working from training data (limitation: <what that means here>)>

**References looked at:**
1. <name> — <what it is> — <what I took from it, as a principle>
2. <name> — <what it is> — <what I took from it>
3. <name> — <what it is> — <what I took from it>

**Techniques considered:**
- <technique> (<source>): <used | not used, why>
- <technique> (<source>): <used | not used, why>
- <technique> (<source>): <used | not used, why>

**Pattern being avoided:** <the overused pattern in this category> — <why it fails this brief>

## Divergence
<!-- Memory check (thinking/sequence.md): node scripts/memory.mjs similar --brief "…" --category … (user-level log, every project) -->
- **Prior similar build:** <none: first build ever | none similar | run #n, <project>, <date>>
- **Diverging from → chose:** archetype <x → y> · palette family <x → y> · type pairing <x → y> · motion language <x → y> · signature move <x → y>

## Decision trace
<!-- Every design decision traces to the brief or a reference above. "Skill default" is not a source. -->
| Decision | Traces to |
|---|---|
| Archetype | <brief: "…" / reference n / technique> |
| Palette | |
| Type pairing | |
| Motion language | |
| Signature move | |

## Concept
- **Tension:** 
- **Concept sentence:** 
- **Archetype + mutation:** 
- **Collision:** 
- **Signature move:** 
- **Dials:** ENERGY _ · RHYTHM _ · MOTION _ → Tier _
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
<!-- Filled in at step 7 of the Thinking Sequence. scripts/gate.mjs derives the C and R critique scores from these lines, so keep the exact prefixes. -->
- Concept survived: <yes | yes, after 1 change | no>
- Cut: <what was removed> — fails Q1 and Q2 (no hierarchy, feedback or story; the brief doesn't need it)
- Kept: <element> — fails Q1, passes Q2: <what in the brief needs it>
- Rejected animation: <the animation> — <which of the four questions it failed>

