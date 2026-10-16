# DESIGN.md · Little Molars Children's Dentistry

Built for `evals/briefs/diversity/02-childrens-dentistry.md` by following the skill's full route (thinking/sequence.md), in one session, by the agent that also wrote `scripts/originality.mjs`. See `evals/results/diversity/REPORT.md` for why that matters.

## Scope
**Site type:** children's dental clinic, Dhaka, Bangladesh; static pages + one booking endpoint
**Admin panel:** no (no checkpoint asked for one; "Approve every checkpoint")

| Kind | Item | Mark | Evidence |
|---|---|---|---|
| route | / | requested | |
| route | /first-visit.html | requested | |
| route | /treatments.html | requested | |
| route | /book.html | requested | |
| function | /book.html: request a slot (name, child age, phone, day) | required | book.js#/api/book |
| state | booking form: default / validation error / pending / success / server error | required | book.js#Please fix the marked fields |
| edge | knocked-out tooth: what to do before calling | required | index.html#put it in milk |
| template | README.md | not required for this brief, reason: the diversity arm compares rendered sites, not the sellable template package | |
| template | SCHEMA.md | not required for this brief, reason: the diversity arm compares rendered sites, not the sellable template package | |
| template | DATA.md | not required for this brief, reason: the diversity arm compares rendered sites, not the sellable template package | |
| template | CRITIQUE.md | not required for this brief, reason: the diversity arm compares rendered sites, not the sellable template package | |
| template | GATE.md | not required for this brief, reason: the diversity arm compares rendered sites, not the sellable template package | |
| template | LICENSE | not required for this brief, reason: the diversity arm compares rendered sites, not the sellable template package | |
| template | CHANGELOG.md | not required for this brief, reason: the diversity arm compares rendered sites, not the sellable template package | |
| template | .env.example | not required for this brief, reason: the diversity arm compares rendered sites, not the sellable template package | |
| template | middleware.ts | not required for this brief, reason: the diversity arm compares rendered sites, not the sellable template package | |
| template | data/ | not required for this brief, reason: the diversity arm compares rendered sites, not the sellable template package | |
| template | data/schema.json | not required for this brief, reason: the diversity arm compares rendered sites, not the sellable template package | |

## References
**Access:** no live web search this session (fonts fetched from Google Fonts only). Working from `references/sources/` and training data; limitation: no 2026 award-site references were looked at.

**References looked at:**
1. references/sources/components.md (form states): every form ships five states
2. A real stamp card (loyalty card, passport): progress you can see and own; took "progress is a collection"
3. references/sources/inspiration.md (playful systems): one playful rule applied everywhere beats many cute details

## Collision draw
`node scripts/collide.mjs --n 1 --seed 9202 --category organisation`

Archetype The Manifesto, rejected: one argument set large like a speech would speak to parents and frighten nobody into calm; took the seeded fallback The Field Guide · mutation Make the UI the content · collision typewriter, "carriage return and ink strike" · seed move Width Sprint (rejected) · fingerprint layout=statement tier=2 signature_type=type

## Tension
Parents book with reasons (price, time, credentials); children decide with fear. The site has to be legible to the first and harmless, even fun, to the second.

## Concept
The site is a field guide to the visit, bound as the child's tooth passport: every step (Tell, Show, Do, Stamp) is a passport page with an empty stamp ring. Reading a page strikes the stamp in, like a typewriter key hitting the ribbon, and a pill of teeth at the bottom edge fills as you go. The scroll position is the passport.

## Choices
| Decision | Choice | Why (from the brief) |
|---|---|---|
| Archetype | The Field Guide (fallback), pages as specimen cards | the visit is a sequence a child can learn in advance |
| Signature | tooth passport: ink-strike stamps + a fixed tooth pill as scroll progress | UI-as-content mutation x typewriter ink strike |
| Type | Fredoka (display) + Nunito (body) | round, friendly, still legible at 16px for parents |
| Palette | cream #fff8ee, navy #1c2a4a, coral #e8553d (accent), mint #dff2ea surface | nothing white-and-blue clinical |
| Layout | 2-column grid of rounded cards, 28px radius | pages of a booklet |
| Imagery | one inline SVG (the fish tank), round mask; doctor initials as faces (drawn, no photographs) | no stock smiles |

## Divergence
`memory.mjs check` against run #1 (funeral home): archetype, signature fresh; tier 2 repeated, so the tier moved to 3. Fingerprint layout=cards, closest run 37% (< 70%).

## Restraint Gate record
- Concept survived: yes, after 1 change (Manifesto to Field Guide)
- Cut: Width Sprint (variable width with scroll speed): fails Q1 and Q2 (no hierarchy, feedback or story for a parent booking)
- Kept: the fish SVG: fails Q1, passes Q2: the brief names the fish tank as the thing children remember
- Rejected animation: a breathing cursor on idle (the drawn kinetic): fails "does it serve the brief": a parent reading has no use for it
