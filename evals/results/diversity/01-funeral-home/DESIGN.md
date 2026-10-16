# DESIGN.md · Shanti Ghat Funeral Service

Built for `evals/briefs/diversity/01-funeral-home.md` by following the skill's full route (thinking/sequence.md), in one session, by the agent that also wrote `scripts/originality.mjs`. See `evals/results/diversity/REPORT.md` for why that matters.

## Scope
**Site type:** funeral home, Narayanganj, Bangladesh; static, phone-first
**Admin panel:** no (no checkpoint asked for one; "Approve every checkpoint")

| Kind | Item | Mark | Evidence |
|---|---|---|---|
| route | / | requested | |
| route | /what-happens-next.html | requested | |
| route | /prices.html | requested | |
| route | /contact.html | requested | |
| function | 24-hour line: one tap to call from every page | required | index.html#tel:\+8801711000000 |
| function | prices: every charge fixed and published | required | prices.html#BDT |
| edge | family cannot pay | required | prices.html#cannot pay |
| edge | caller cannot speak | required | contact.html#send a text |
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
1. references/sources/foundation.md (reading rhythm, measure): set the body at a book measure, not a web measure
2. The instruction slip a hospital or funeral home hands a family (lived artefact, not a site): one sheet, numbered, kept
3. references/sources/motion.md (motion that carries story): reveal order equals reading order

## Collision draw
`node scripts/collide.mjs --n 1 --seed 9101 --category organisation`

Archetype The Timeline · mutation Single object · collision receipt printer, "paper feeding line by line" · seed move Horizontal Reel (rejected: sideways film strip fights a family reading on a phone at night) · fingerprint layout=sequence tier=2 signature_type=scroll

## Tension
A family needs the number and the next step in one second, in the worst hour of their lives; the home must never look as if it is hurrying them or selling to them.

## Concept
The site is the one sheet of instructions a family is handed at the door: a narrow paper slip on a darker table, numbered steps in the order they happen, prices printed like a receipt. Lines feed out one at a time as you read, never faster than you read. The phone number sits above the sheet, always.

## Choices
| Decision | Choice | Why (from the brief) |
|---|---|---|
| Archetype | The Timeline, mutated to a single object (the instruction sheet) | the brief is "what happens next", which is time in order |
| Signature | paper feed: lines rise out of a clip, in reading order, 110 ms apart | receipt printer collision; calm, never ahead of the reader |
| Type | Newsreader (display and body, light) + IBM Plex Mono for prices and labels | a book voice for grief; mono only where numbers must line up |
| Palette | paper #f8f5ef on table #d8d2c6, ink #24211d, brass #7a4f0e (accent) | no black, no lilies, nothing that looks like an advert |
| Layout | one 38rem column, perforated top edge, sticky call bar | a slip, not a page; one thing to read |
| Imagery | none | stock grief photography is the cliché the brief rules out |

## Divergence
First build in the memory log (`memory.mjs similar`: "No log yet: first build, no divergence required").

## Restraint Gate record
- Concept survived: yes
- Cut: the Horizontal Reel seed move and a hero photograph: fail Q1 and Q2 (no hierarchy, feedback or story; the brief asks for calm)
- Kept: the perforated top edge: fails Q1, passes Q2: it is the one cue that this is a sheet you keep
- Rejected animation: a magnifying word on idle (the drawn kinetic): fails "does the reader need it" at night on a phone
