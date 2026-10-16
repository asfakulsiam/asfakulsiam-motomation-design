# DESIGN.md · Oud No. 7 · Maison Ilham

Built for `evals/briefs/diversity/04-luxury-perfume.md` by following the skill's full route (thinking/sequence.md), in one session, by the agent that also wrote `scripts/originality.mjs`. See `evals/results/diversity/REPORT.md` for why that matters.

## Scope
**Site type:** single luxury product, Dhaka, Bangladesh; static + one request endpoint
**Admin panel:** no (no checkpoint asked for one; "Approve every checkpoint")

| Kind | Item | Mark | Evidence |
|---|---|---|---|
| route | / | requested | |
| route | /the-oud.html | requested | |
| route | /atelier.html | requested | |
| route | /request.html | requested | |
| function | /request.html: request a numbered bottle and an appointment | required | request.js#/api/request |
| state | request form: default / validation error / pending / success / server error | required | request.js#Please fix the marked fields |
| edge | the three notes and the batch number left, on the home page | required | index.html#Bottle 41 of 120 |
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
1. references/sources/foundation.md (space as value): emptiness as the price signal
2. A tailor's tape (lived artefact): a ruler you read in one direction; took "progress you can measure, under tension"
3. references/sources/motion.md (scroll-linked state): drive a value, not a spectacle

## Collision draw
`node scripts/collide.mjs --n 1 --seed 9404 --category product-launch`

Archetype The Timeline, refused by the memory check (used by run #1, the funeral home); took the seeded fallback The Stage · mutation Invert the axis (time runs backwards) · collision tailor's measuring tape, "a numbered ruler with tension" · seed move Darkroom Develop (rejected) · fingerprint layout=sequence tier=2 signature_type=scroll

## Tension
Luxury sells the waiting and the scarcity; the web is instant and infinite. The site has to make a visitor wait, and enjoy it, while still telling them the price and how to ask.

## Concept
One object on a stage: the bottle, lit from inside a dark room. The page runs backwards through the seven years it took, from today (bottle 41 of 120) back to the grove in Sujanagar. A ruler on the left counts down 7 to 0 as you read, its amber hairline stretching, and the oil in the bottle thins from tea-dark to pale. By the end you have waited for it.

## Choices
| Decision | Choice | Why (from the brief) |
|---|---|---|
| Archetype | The Stage (fallback): one object, centred, lit | a single fragrance, nothing else to show |
| Signature | seven-year ruler: numeral 7 to 0, stretching hairline, oil colour by year | invert-axis mutation x measuring-tape collision |
| Type | Bodoni Moda italic (display) + Jost light, tracked capitals (body/labels) | didone contrast reads as a label on glass |
| Palette | night #120e0b, smoke #e8dfd2, amber #c9893b (accent: the oil) | the accent is the product's colour |
| Layout | centred stage scenes; sticky bottle beside scenes; wide empty margins | space as the luxury |
| Imagery | one SVG bottle in a radial vignette, on every scene [NEEDS ASSET: photograph] | one treatment carried through, as the brief asks |

## Divergence
`memory.mjs check` against runs #1 to #3: archetype "timeline" refused (run #1), so The Stage; signature, fonts, palette, motion fresh. Tier: the check flags every tier used in the last three runs (2, 3, 4), so any honest tier repeats; kept 3 because the brief supports it, and logged the conflict as a finding in REPORT.md.

## Restraint Gate record
- Concept survived: yes, after 1 change (Timeline to Stage, by memory)
- Cut: Darkroom Develop (photos develop from blank paper): fails Q1 and Q2; there is one object and it is never a photo
- Kept: the radial glow behind the bottle: fails Q1, passes Q2: the brief's "restraint, one image treatment" needs the bottle lit, not cut out
- Rejected animation: background bending on hover (the drawn kinetic): fails "does it serve the brief": decoration on a page about patience
