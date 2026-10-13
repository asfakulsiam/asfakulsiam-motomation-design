# MOTION.md: Monsoon Jazz Night (template `event`)

> How it moves. Grammar and scoring: `motion/choreography.md`. Values are the component props the page uses (defaults unless the section sets them), so the sheet can be checked against `examples/sections/*-event-*.tsx`.

## Motion principles for this project
- Tier: 4 (Beams: spatial stage light, one WebGL-class background, CSS poster fallback)
- Personality: a poster under stage light; the light moves, the print doesn't
- Ease tokens used: `EASE.out` (examples/components/_lib/motion) for hover responses, `ease-out` for the dock and copy button, `none` for loops and scroll-linked skew
- What never moves: the title's position, the ticket prices, the venue details

## Timing sheet

The page has no pinned chapter; each section is a chapter in the rhythm sense. Every row is triggered (`@<% of the section's pass> · <duration>`) or continuous (`loop`). Nothing is scrubbed.

### Chapter 1: Poster (hero-event-poster) · 100vh · dense · technique — (no film)
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 01 | @0% · loop 9.0–15.8 s per beam | Beams (5 shafts, 18°) | shafts sweep across the dark; each beam on its own period (9000 + i × 1700 ms), so the pattern never repeats in sync | none | — | truck (the light passes the frame) | hard-edged bars at 18°, pools on the stage floor, motes as a fixed dot pattern (docs/rm-stills/event.webp) |
| 02 | @0% · 45 ms per flap step | SplitFlap "SAT 14 NOV" | each tile flips through the alphabet to its letter | none (discrete steps) | with 01 | — | the date shown at once in its tiles |
| 03 | pointer · continuous | PressureType title | weight 300 → 900 and width 75 → 125 within 220px of the cursor | none (follows pointer) | with 01 | — | title at its resting weight; no pointer response |
| 04 | after 02 | — | hold: the poster reads as print (beams only) | — | hold | — | — |

### Chapter 2: Lineup (team-event-lineup) · ~110vh · dense · technique —
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 01 | @0–≈14% | label + h2 | hold: heading is static while the section enters (≈14%: estimated from the layout at 1440, not measured) | — | hold 14% | — | — |
| 02 | @14% · loop | VelocityMarquee (names) | names drift at speed 40, speed up and follow scroll direction, skew up to 10° with scroll velocity, back to 0 at rest | none | after 01 | truck | one static line of names, no skew |
| 03 | hover · 260 ms | FlowingMenu rows | a row floods with its instruments marquee on hover/focus | EASE.out | — | — | rows static; instruments listed as text |

### Chapter 3: Tickets (pricing-event-tickets) · ~100vh · still
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 01 | pointer · 200 ms follow | TiltCard tickets | tilt toward the cursor, max 7°, with glare | EASE.out | — | orbit (≤ 7°, the ticket held to the light) | flat tickets, no glare |
| 02 | @in view · 1100 ms, once | ShinyText "WITH INTERVAL DRINKS" | a single shine passes the brass stamp | EASE (component default) | — | — | text at rest |

### Chapter 4: Venue (contact-event-venue) · ~80vh · still
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 01 | pointer · 120 ms | Dock (4 actions) | icons magnify up to 1.7× within 140px of the cursor | ease-out | — | — | icons at rest size |
| 02 | click · 200 ms, back after 2000 ms | CopyButton | label → "Copied", back | ease-out | — | — | label change only |

Rhythm: dense · dense · still · still. The breath rule holds (chapters 2–4 include two stills). **Known deviation:** two dense chapters are adjacent, and chapter 2 opens on a 14% hold where `motion/choreography.md` §4 asks for 20%. `/critique` scores this `Choreography 4/5 · rhythm: lineup follows the hero with a 14% hold (rule 20%)`. The fix, if the page is revised: give the lineup heading more lead-in (top padding or a one-line intro), or make the marquee start at rest and pick up speed only on scroll.

## Signature move
- Name: velocity-skew (the lineup marquee leans with scroll speed)
- Trigger: scroll velocity
- Off-switch: reduced motion → no skew, static line; touch → same as desktop (scroll-driven, not pointer)
