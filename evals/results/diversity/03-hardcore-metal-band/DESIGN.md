# DESIGN.md · GHURNI

Built for `evals/briefs/diversity/03-hardcore-metal-band.md` by following the skill's full route (thinking/sequence.md), in one session, by the agent that also wrote `scripts/originality.mjs`. See `evals/results/diversity/REPORT.md` for why that matters.

## Scope
**Site type:** band site (album, tour, merch), Bangladesh; static + one notify endpoint
**Admin panel:** no (no checkpoint asked for one; "Approve every checkpoint")

| Kind | Item | Mark | Evidence |
|---|---|---|---|
| route | / | requested | |
| route | /album.html | requested | |
| route | /shows.html | requested | |
| route | /merch.html | requested | |
| function | /merch.html: email me when the drop opens | required | notify.js#/api/notify |
| state | notify form: default / validation error / pending / success / server error | required | notify.js#Please fix the marked fields |
| edge | photosensitive visitors: flashes capped below 3 per second, off under reduced motion | required | impact.js#under 3 per second |
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
1. WCAG 2.3.1 Three Flashes or Below Threshold: the limit the flash is designed under
2. Hardcore show flyers (xerox, halftone, hand-cut type): took "type as a blunt object, cut not styled"
3. references/sources/motion.md (impact vs ease): a hit is a step, not a curve

## Collision draw
`node scripts/collide.mjs --n 1 --seed 9303 --category event`

Archetype The Room · mutation Remove the expected (no nav bar) · collision darkroom tray, "images appear slowly under red light", bent: the red light arrives as one hit, not slowly · seed move Line Curtain (rejected) · fingerprint layout=sequence tier=2 signature_type=type

## Tension
The music is violence and noise; the fan needs four facts (album, next show, dates, merch) readable at 375px in a crowd.

## Concept
The site is the rehearsal room in Chattogram: each section is a room with a number on the door, entered one at a time. There is no nav bar; the rooms are listed at the bottom as words big enough to hit. Each room heading lands like a kick drum: two hard frames, and the room flashes red once, the darkroom light switched on by force.

## Choices
| Decision | Choice | Why (from the brief) |
|---|---|---|
| Archetype | The Room, full-viewport rooms numbered 01 to 03 | four facts, one per room |
| Signature | impact: two-frame slam + one red flash per room, capped under 3/s | darkroom red light x hardcore hit |
| Type | Anton (display, 27vw) + JetBrains Mono (body) | blunt condensed hit against a flat machine voice |
| Palette | black #0a0a0a, bone #ece6da, red #f22b1f (accent, also whole rooms; first #e01b12 failed AA at 4.09:1) | no smoke, no fire: one red |
| Layout | full-bleed, no container, 6px rules between rooms; word index replaces the nav | remove-the-expected mutation |
| Imagery | one drawn halftone SVG (bulb, four silhouettes), jagged clip-path | xerox flyer, not a stock photo |

## Divergence
`memory.mjs check` against runs #1 and #2: archetype, signature, fonts, palette, motion fresh; tier 2 repeated, so the tier moved to 4. No similar brief logged (category event).

## Restraint Gate record
- Concept survived: yes, after 1 change (darkroom slow develop bent to a single hit)
- Cut: Line Curtain (headlines rising line by line from masks): fails Q1 and Q2 (soft; the brief wants impact)
- Kept: the scroll drift on the giant word: fails Q1, passes Q2: it makes the door feel like walking past a wall
- Rejected animation: scroll-velocity cursor counter (the drawn kinetic): fails "does the fan need it"; the brief bans decoration clichés
