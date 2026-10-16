# Motion quality: reduced-motion stills, timing sheets, reasons (2026-10-16)

Motion-only judging lost 3–6 and the reduced-motion fallback was rated 2.50/5. This pass fixes the quality of the
motion that exists. It adds none, and the gate was not changed.

Tier 3–5 templates: **event** (Tier 4), **product-launch** (Tier 5), **motion-portfolio** (Tier 5). The other seven are
Tier 2. There is only one Tier 4 template, so the side-by-side pairs below are the Tier 4 event plus the two Tier 5 films.

## A. Reduced motion is a designed still, not a frozen frame

| Template | Before | Verdict | After |
|---|---|---|---|
| event (Tier 4, Beams) | the same five shafts at the same angle, hard-edged, plus floor bands | the animation paused: redesigned | **one follow-spot**: a single cone from the rig onto an empty stage, a sharp oval pool, dust only in the light (`components/backgrounds/beams.tsx`, `BeamsStill`) |
| product-launch (Tier 5) | the four film frames in a list, each with its note | the film's frames laid out: redesigned | **a parts plate**: the exploded still framed, its five parts numbered on the drawing and keyed, the other three steps as small figures under it |
| motion-portfolio (Tier 5) | the four film frames in a list, each with its caption | the film's frames laid out: redesigned | **a wall of four title cards**: each shot's name set on its still, the slate (shot, timecode) in the corner, the commission under it |

Full motion (left) vs reduced motion (right), 1440×900, captured with Playwright (`reducedMotion: "reduce"`). The images are on the evals branch, per the heavy-artifact rule.

- [Event, Tier 4: five moving shafts vs one follow-spot](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/motion-quality/event-full-vs-reduced.webp)
- [Product launch, Tier 5: the film at step 3 vs the parts plate](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/motion-quality/product-launch-full-vs-reduced.webp)
- [Motion portfolio, Tier 5: the film at shot 3 vs the title-card wall](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/motion-quality/motion-portfolio-full-vs-reduced.webp)

`tests/components/rm-stills.test.mjs` (measured: no canvas under reduced motion, 0% change in 1 s, ≥ 5% different
from full motion) passes 9/9. Beams 44.2%, event 44.8% (was 47.1%). **The old event still passed this test too.** A
pixel difference cannot tell a stopped frame from a new composition, so the "distinct composition" verdict above is
judged from the side-by-side pairs, not measured.

## B. Timing sheets

All three sheets use the repository's timing-sheet table (`| Beat | Range | Element | Action | Ease | Overlap | Camera |
Reduced motion |`, which `scripts/template-rules.mjs` checks).
- Each chapter header carries its scroll % of the page, measured on the built page at 1440×900.
- Each element row gives its Range (scroll % or pass %) and its Action as **enter · hold · exit**.
- Ease is per element. Overlap holds the stagger and overlap.
- Under every table, **"Why this moves:"** gives one line per beat.

- event: rewritten. The old sheet described the velocity marquee and the pointer-pressure title, which no longer exist, gave no scroll %, and had no reasons.
- product-launch: restructured from range tables into per-element rows, with page scroll % and reasons added.
- motion-portfolio: restructured the same way.

## C. Every motion has a reason; motion without one was cut

| Template | Cut | Why |
|---|---|---|
| event | PressureType title (weight and width under the cursor) | a second variable-type effect beside the width-sprint signature; pointer-only, so phones never saw it |
| event | ShinyText shine across the drinks stamp | decoration; tells the reader nothing |
| event | Dock magnification (1.7×) | enlarged four 48px targets under a mouse only |
| motion-portfolio | the captions' 14px rise | the page's personality is hard cuts; a caption changes on a cut, it does not arrive |
| product-launch | none | every motion has a reason in the sheet |

## Gate (this task's)

- Every Tier 3–5 template has a timing sheet with a reason on every row: event, product-launch, motion-portfolio. **Met.**
- Every Tier 4–5 reduced-motion version is a distinct composition: event (follow-spot), launch (parts plate), portfolio (title-card wall). **Met.** Judged from the pairs above; the pixel test is necessary, not sufficient.

## One full timing sheet (event, Tier 4)

Pasted from `examples/templates/event/MOTION.md`.

### Timing sheet

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

Diffs of the three MOTION.md files: `git show <this commit> -- 'skills/asfakulsiam-motomation-design/examples/templates/*/MOTION.md'` (the commit titled "T2: motion quality").
