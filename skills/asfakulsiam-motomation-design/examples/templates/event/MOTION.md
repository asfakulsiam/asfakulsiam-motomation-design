# MOTION.md: Monsoon Jazz Night (template `event`)

> How it moves. Grammar and scoring: `motion/choreography.md`. Values are the component props the page uses (defaults
> unless the section sets them), so the sheet can be checked against `examples/sections/*-event-*.tsx`. The page has no
> pinned chapter: "scroll %" is the share of the whole page's scroll while the chapter holds the top of the screen
> (1440×900; the page is 3.38 screens, 3046 px, measured on the built `event.html`), and a row's Action gives its enter / hold /
> exit inside that, and the list under each table gives the reason it moves (one line per row).

## Motion principles for this project
- Tier: 4 (Beams: spatial stage light, one WebGL-class background, designed still for reduced motion)
- Personality: a poster under stage light; the light moves, the print doesn't
- Ease tokens used: `cubic-bezier(0.45, 0, 0.55, 1)` (sine in-out) for the light; `EASE.out` for every response to a
  hand (hover, focus, pointer); `none` for discrete steps and for the scroll-linked width
- What never moves: the title, the date once set, the prices, the venue details, the pill's position
- Cut in this revision (no reason to move, see "Cuts"): the title's pointer pressure, the stamp's shine, the dock's
  magnification. The lineup marquee was replaced by the width sprint in the template redesign.

## Timing sheet

### Chapter 1: Poster (`hero-event-poster`) · scroll 0–39% · 92vh · dense · technique: ambient background
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 01 | 0–39% (on screen) | Beams (5 shafts, 18°) | enter: at load, already mid-sway (each shaft starts −2300 ms × i into its cycle) · hold: loop: each shaft sways ±1.5–3.1° over 9.0–15.8 s (9000 + 1700 × i ms), alternate · exit: paused off screen and in hidden tabs; no exit animation | sine in-out | periods differ by 1.7 s, so the five never line up: no beat to the loop | — | one follow-spot still: a single cone from the rig onto an empty stage, a sharp oval pool (a different picture, see below) |
| 02 | 0% | Date (SplitFlap "SAT 14 NOV") | enter: at load: each tile flips through its alphabet, 45 ms per step · hold: settles left to right; then holds for good · exit: none | none (discrete steps) | tiles settle in reading order, so the date reads as it lands; runs over the first ≈0.6 s of the beams | — | the date shown at once in its tiles |
| 03 | 0% | Title, venue line, prices | none (holds) | — | — | — | same |

Why this moves:
- **01 Beams (5 shafts, 18°):** The poster is lit by the hall's real clerestory; the light moving is the one sign that this is a night that happens, not a print
- **02 Date (SplitFlap "SAT 14 NOV"):** The date is the one fact on the poster that changes from night to night; a departures board is where a changing fact is announced
- **03 Title, venue line, prices:** (does not move: print)

### Chapter 2: Tickets (`pricing-event-tickets`) · scroll 39–64% · 60vh · still
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 04 | 39–64% | Three tickets (TiltCard, max 7°) | enter: pointer enters: the card follows in 200 ms · hold: tilts toward the cursor while it stays, with a glare highlight · exit: pointer leaves: back flat in 200 ms | `EASE.out` | per card; only the card under the pointer moves | — | flat tickets, no glare |
| 05 | — | "WITH INTERVAL DRINKS" stamp | none (holds) | — | — | — | same |

Why this moves:
- **04 Three tickets (TiltCard, max 7°):** A ticket is a thing you hold to the light to read the seat; the tilt says these are printed stubs, and it answers the hand, nothing else
- **05 "WITH INTERVAL DRINKS" stamp:** (does not move: the shine was cut)

### Chapter 3: Lineup (`team-event-lineup`) · scroll 64–100% · 108vh · dense · technique: scroll-velocity type
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 06 | 22–100% (any time it is on screen) | "Four sets" (WidthSprint, wdth 72 → 112) | enter: scrolling starts: width follows scroll speed, smoothed (velocity lerp 0.2 per frame), full width at 40 px/frame · hold: width tracks speed while you scroll · exit: scrolling stops: relaxes back to wdth 72 as the velocity decays (rAF ends below 0.05 px/frame) | none (the lerp is the curve) | the signature; nothing else in the chapter moves on scroll | — | the word stays at wdth 72 |
| 07 | 64–100% | Running order (FlowingMenu, 4 rows) | enter: hover or focus: a band rolls over the row from the edge the pointer entered, 260 ms · hold: the band carries the set's instruments as a marquee (12 s per loop) while hovered or focused · exit: leaving: the band rolls out the way it came, 260 ms | `EASE.out`; marquee linear | one row at a time | — | the band shows at once with still text |

Why this moves:
- **06 "Four sets" (WidthSprint, wdth 72 → 112):** The signature: a night of four sets runs to a tempo, and the heading takes yours; it is type, so it says "music" without a picture of a saxophone
- **07 Running order (FlowingMenu, 4 rows):** It answers "who plays what" on demand, in the row you are pointing at, without a second column of small type

### Chapter 4: Venue (`contact-event-venue`) · scroll 67–100% (on screen from 67%; the page ends before it reaches the top) · 65vh · still
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 08 | — | Dock (4 actions, 48 px, fixed size) | none (holds) | — | — | — | same |
| 09 | 67–100% | CopyButton (address) | enter: click: label → "Copied" · hold: 2000 ms · exit: label back | ease-out, 200 ms | — | — | label change only |

Why this moves:
- **08 Dock (4 actions, 48 px, fixed size):** (does not move: magnification cut)
- **09 CopyButton (address):** Confirms the address is on the clipboard: the only feedback a copy action has

### Page chrome: the pill (`header.pill`) · scroll 0–100%
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 10 | 0–100% | Pill links | enter: hover: skew −10° and amber; press: scale 0.94 · hold: while hovered / pressed · exit: release: back | `EASE.out`, CSS transition | — | — | colour only; no skew, no scale |

Why this moves:
- **10 Pill links:** Tells a hand the link is live, in the poster's own leaning type

Rhythm: dense · still · dense · still. The breath rule holds: every dense chapter is followed by a still one, and
the redesign's new order (tickets before the lineup) removed the old deviation (two dense chapters back to back with
a 14% hold).

## Signature move
- Name: width-sprint (the lineup heading widens with scroll speed)
- Trigger: scroll velocity while the lineup is on screen
- What it shows: the night's tempo, in the type
- Off-switch: reduced motion → base width; touch → same as desktop (scroll-driven, not pointer)

## Reduced motion
A different composition, not the light paused: **one follow-spot**. The rig runs across the top, a single cone drops
from one lamp onto an empty stage at the right, and it lands as a sharp oval pool; dust shows only inside the cone,
the rest of the hall is dark. The moving version is five soft shafts passing through windows ("light passing"); the
still is one fixed cone ("the stage is set"). Everything else is final at once: the date in its tiles, flat tickets,
the lineup heading at base width, the running order's bands without motion. Screens: `evals/results/motion-quality/`.

## Cuts (motion with no reason, removed in this revision)
| Was | Where | Why it went |
|---|---|---|
| PressureType title (weight 300 → 900, width 75 → 125 within 220 px of the cursor) | poster | A second variable-type effect beside the width-sprint signature, so neither read as the one; pointer-only, so on phones (most of this audience) it never happened |
| ShinyText shine across "WITH INTERVAL DRINKS" (1100 ms, once) | tickets | Decoration: a shine tells the reader nothing about the drinks or the seat |
| Dock magnification (to 1.7× within 140 px) | venue | Enlarged four 48 px targets under a mouse only; no reader needed bigger targets on a desktop, and touch never saw it |

## Performance notes
- Beams: transform-only Web Animations, paused off screen; low-end probe (Save-Data, ≤ 2 cores, < 4 GB) gets static shafts
- Width sprint: one `font-variation-settings` write per frame while scrolling; rAF stops when the page rests
- Frame-time numbers: not measured in the sandbox (`docs/adapters/sandbox.md`)
