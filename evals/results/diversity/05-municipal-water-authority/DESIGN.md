# DESIGN.md · Rajshahi City Water Supply Authority

Built for `evals/briefs/diversity/05-municipal-water-authority.md` by following the skill's full route (thinking/sequence.md), in one session, by the agent that also wrote `scripts/originality.mjs`. See `evals/results/diversity/REPORT.md` for why that matters.

## Scope
**Site type:** public utility, Rajshahi, Bangladesh; static pages + daily JSON feed + one report endpoint; EN/Bangla
**Admin panel:** no (no checkpoint asked for one; "Approve every checkpoint")

| Kind | Item | Mark | Evidence |
|---|---|---|---|
| route | / | requested | |
| route | /outages.html | requested | |
| route | /bills.html | requested | |
| route | /report.html | requested | |
| route | /water-quality.html | requested | |
| function | today: supply cuts by ward from the daily feed | required | site.js#/data/outages.json |
| function | ward lookup rewrites today's sentence | required | site.js#Enter a ward number from 1 to 30 |
| function | /report.html: report a leak, dirty water, no water or a wrong bill | required | report.js#/api/report |
| state | outage list: loading (skeleton, aria-busy) / error with retry / empty / filled | required | site.js#No supply cuts today |
| state | report form: default / validation error / pending / success / server error | required | report.js#Please fix the marked fields |
| skeleton | outage tables and today's sentence | required | index.html#skel |
| edge | Bangla readers: language toggle (partial copy) | required | site.js#বাংলা |
| edge | feed fails on slow 3G: the sentence names the helpline | required | site.js#Call 0721-000000 |
| template | README.md | not required for this brief, reason: the diversity arm compares rendered sites, not the sellable template package | |
| template | SCHEMA.md | not required for this brief, reason: the diversity arm compares rendered sites, not the sellable template package | |
| template | DATA.md | not required for this brief, reason: the diversity arm compares rendered sites, not the sellable template package | |
| template | CRITIQUE.md | not required for this brief, reason: the diversity arm compares rendered sites, not the sellable template package | |
| template | GATE.md | not required for this brief, reason: the diversity arm compares rendered sites, not the sellable template package | |
| template | LICENSE | not required for this brief, reason: the diversity arm compares rendered sites, not the sellable template package | |
| template | CHANGELOG.md | not required for this brief, reason: the diversity arm compares rendered sites, not the sellable template package | |
| template | .env.example | not required for this brief, reason: the diversity arm compares rendered sites, not the sellable template package | |
| template | middleware.ts | not required for this brief, reason: the diversity arm compares rendered sites, not the sellable template package | |
| template | data/schema.json | not required for this brief, reason: the diversity arm compares rendered sites, not the sellable template package | |

## References
**Access:** no live web search this session (fonts fetched from Google Fonts only). Working from `references/sources/` and training data; limitation: no 2026 award-site references were looked at.

**References looked at:**
1. GOV.UK Design System (public service pattern): the task first, nothing between the resident and the answer
2. WCAG 2.2 AAA focus appearance and Atkinson Hyperlegible (Braille Institute): accessibility beyond AA where cheap
3. A tailor's tape (collision): a ruler with a marked band; used for the quality report only

## Collision draw
`node scripts/collide.mjs --n 1 --seed 9505 --category organisation`

Archetype The Film Reel, rejected: scenes in sequence waste bytes and time on slow 3G; took the seeded fallback The Manifesto · mutation Single object (today's sentence) · collision tailor's measuring tape, "a numbered ruler with tension", the same collision as build 4 · seed move Brand Selection (kept: text selection in the brand blue, zero bytes) · fingerprint layout=sequence tier=1 signature_type=micro

## Tension
A utility should be boring and reliable, but the one fact residents need (is my water on today?) changes every morning and is urgent.

## Concept
A manifesto with one sentence, rewritten every morning: "Today, 3 of 30 wards have a supply cut." Everything else on the site is a plain document under it. Type your ward and the sentence answers you instead. The quality report borrows the tailor's tape: each measure is a ruler with the safe band marked and this month's reading as a line.

## Choices
| Decision | Choice | Why (from the brief) |
|---|---|---|
| Archetype | The Manifesto (fallback): one sentence set large | today's outage count is the whole message |
| Signature | the sentence answers your ward | single-object mutation; zero motion, tier 1 |
| Type | Atkinson Hyperlegible (all text) + Noto Sans Bengali (Bangla, loaded by unicode-range) | legibility on old phones, beyond AA |
| Palette | white, ink #0b1f33, civic blue #0057b8 (accent); status red/green only with words | a public service, not a brand |
| Layout | one 64rem document column, tables, no images | slow 3G, decoration costs bytes |
| Imagery | none; CSS rulers for quality | the brief asks for no decoration that costs bytes |

## Divergence
`memory.mjs check` against runs #1 to #4: archetype, signature, fonts, palette, motion and tier fresh. The collision repeats build 4's (measuring tape); memory does not check collisions. Recorded in REPORT.md.

## Restraint Gate record
- Concept survived: yes, after 1 change (Film Reel to Manifesto)
- Cut: a city map of wards: fails Q1 and Q2 for a slow phone (bytes, no hierarchy the table lacks)
- Kept: the yellow focus halo: fails Q1, passes Q2: residents on keyboards and switch devices
- Rejected animation: "a word travels on page exit" (the drawn kinetic): fails "does the resident need it" and costs bytes
