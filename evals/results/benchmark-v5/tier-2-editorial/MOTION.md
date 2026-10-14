# MOTION.md: Jol · Issue 07, "The Last Boatbuilders of Sadarghat"

> How it moves. Tier 2: GSAP 3.13 core + ScrollTrigger + SplitText, Lenis 1.3 for smooth scroll. Section entrances and scroll choreography only. No pinned sections, no scrubbed film, no WebGL, no View Transitions, no Lottie/Rive.

## Motion principles for this project
- Tier: 2 (forced, `--tier=2`; MOTION dial 2)
- Personality (one line): things surface from the river, line by line, at reading pace, and then hold still so the words can be read.
- Ease tokens used: `--ease-out-strong` / `expo.out` (titles surfacing, plates), `--ease-out` / `power3.out` (line feed, captions), `none` (the draft-scale water, tied to scroll), `--ease-out` 150 ms (link hover, focus).
- What never moves: body paragraphs, footnotes, the author note, captions after they settle, anything a reader is in the middle of reading. No motion on the second visit to a section (every entrance runs once).

## The four questions, answered per animation
| Animation | Should it move? | What it tells | Cheapest tool | Edges |
|---|---|---|---|---|
| Masthead waterline draws | once per visit | what this brand feels like (the river line) | `scaleX` on a 1 px rule | RM: rule is drawn |
| h1 surfaces by line | once | what to look at first | SplitText line masks, `yPercent` | resize re-splits (`autoSplit`); RM: set |
| Standfirst feeds line by line | once | where reading starts | SplitText lines, `yPercent` | RM: set |
| Movement opener (folio, waterline, title) ×7 | once per movement | where a movement starts | `opacity`, `scaleX`, line masks | `once: true`; RM: set |
| Plate surfaces from its bottom edge ×6 | once per plate | what to look at (an image takes its space) | `clip-path: inset()` on one element; the opening from the water is the concept | RM: unclipped |
| Pull quote feeds line by line ×2 | once each | what to look at (a quote lands) | SplitText lines, `yPercent` | RM: set |
| Draft-scale water rises | continuous, scrubbed | where you are in the piece | `scaleY` / `scaleX` on one 2–3 px element | RM: no fill, the active mark changes instantly |
| Sign-off জল surfaces | once | where it ends | `clip-path` on one word | RM: set |

## Global
| Element | Behaviour | Tier | Duration/ease | Reduced motion |
|---|---|---|---|---|
| Smooth scroll | Lenis on the GSAP ticker, `lerp 0.1`, native touch (`syncTouch` off), native anchor jumps for notes | 2 | lerp 0.1 | not created: native scrolling |
| Headings (h1, h2) | Line Curtain bent to the concept: lines rise from under the waterline | 2 | h1 1.1 s expo.out, 0.1 stagger · h2 0.9 s expo.out, 0.08 stagger | final state on first paint |
| Standfirst, pull quotes | Line feed (receipt-printer collision) | 2 | 0.6–0.7 s power3.out, 0.12–0.14 stagger | final state |
| Plates | clip from `inset(100% 0 0 0)` to `inset(0)` | 2 | 1.0 s expo.out; caption 0.4 s after 0.3 s | unclipped |
| Links | underline thickness | 1 | 150 ms ease-out | instant |
| Focus | 2 px accent ring, offset 3 px | 1 | none | same |

## Entrance sheet (triggered, `once: true`)
| Section | Trigger | Order | Notes |
|---|---|---|---|
| Cover | page load | masthead rule 0 s → h1 lines 0.15 s → standfirst lines 0.55 s → credits and phone draft scale fade 0.9 s | total under 1.6 s; text is selectable throughout |
| 01–07 opener | opener top at 85 % of viewport | folio fade (0.4 s) with waterline draw (0.8 s), title lines after 0.1 s | body text below is already static and readable |
| Plates | plate top at 88 % | clip open 1.0 s, caption fade after 0.3 s | |
| Pull quotes | quote top at 80 % | lines feed 0.14 s apart, attribution after the last line | |
| 05 Monsoon | opener top at 85 % | same opener, on river ground; the draft scale passes its half-way mark here | the turn is carried by the full-bleed river ground, not by extra motion |
| Sign-off | footer word top at 90 % | জল clip from its bottom edge, 1.2 s expo.out | |

Rhythm: one entrance group on screen at a time (≤ 3 groups budget); a run of three movements always has a plain stretch of body text between openers.

## Signature move
- Name: Draft Marks
- Trigger: scroll position. Each movement drives the water from its mark to the next (`ScrollTrigger` per movement, `start: top 55%`, `end: bottom 55%`), smoothed by a 0.4 s `quickTo`.
- Off-switch (touch / reduced motion): on phones (< 1200 px) the scale becomes a 3 px waterline across the top of the screen plus a static inline scale in the cover. Under reduced motion the water is not drawn; the current movement is marked instantly (`aria-current="location"`), and every link still jumps to its movement.
