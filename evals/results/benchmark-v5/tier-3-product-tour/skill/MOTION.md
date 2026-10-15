# MOTION.md: Tally · a four-step product tour

> How it moves. Tier 3: cross-document View Transitions carry the slip and the route marker from page to page; Lottie plays one short product animation per page inside the slip's print window. Times below are the values in `assets/tour.css` and `assets/tour.js`, verbatim.

## Motion principles for this project
- Tier: **3 — Pro** (forced `--tier=3`). Cross-document View Transitions (`@view-transition { navigation: auto }`) with shared elements, plus Lottie (lottie-web 5.12.2 light SVG player, vendored, loaded after first paint). No WebGL, no Three.js, no shaders, no pinned scroll film, no scroll-triggered reveals.
- Personality (one line): a receipt that advances one line at a time: steady, short, never bouncing.
- Ease tokens used: `--ease-in-out` cubic-bezier(0.65, 0, 0.35, 1) for things travelling from A to B (slip, lines, route marker); `--ease-out` cubic-bezier(0.22, 1, 0.36, 1) for things entering (the new line, the new page, press release); `--ease-out-strong` cubic-bezier(0.16, 1, 0.3, 1) inside the Lottie stand-ins.
- What never moves: the wordmark, the step label text, body copy, prices, links (they change state only), anything while the visitor is reading.
- Forward and Back: the new page reads the direction from the Navigation API (`navigation.activation`: from-URL step vs. entry-URL step) in `pagereveal`, before the first frame, and sets `html[data-dir="back"]` so the same transition plays mirrored. Browser Back, the page's own Back link and a click on an earlier station all count as back.
- Browsers without cross-document View Transitions: a normal, instant page change; every page is complete without JS.
- Focus: after every in-tour page change the new page's `h1` (`tabindex="-1"`) receives focus, so a screen reader announces the new step; the route says "Step n of 4" in text and `aria-current="step"`.

## Global
| Element | Behaviour | Tier | Duration/ease | Reduced motion |
|---|---|---|---|---|
| Smooth scroll | none (native scroll; pages are one screen) | — | — | — |
| Page change (root) | old page fades and trucks 24px toward where the visitor came from; new page fades in from the other side | 3 | out 360ms `--ease-out`; in 400ms `--ease-out`, delay 120ms | 150ms cross-fade, no travel |
| Slip (`view-transition-name: slip`) | travels to its new place on the new page; constant width, height grows by one line | 3 | 520ms `--ease-in-out` | instant (no group animation) |
| Slip lines (`line-1` … `line-4`) | earlier lines ride with the slip; the new line feeds out (clip from the top edge + 8px drop) | 3 | travel 520ms `--ease-in-out`; feed 260ms `--ease-out` at 364ms | present at rest, no feed |
| Route marker (`view-transition-name: here`) | slides from the old station to the new one | 3 | 520ms `--ease-in-out` | instant |
| Lottie in the print window | plays once after the page transition finishes (or on load), rests on its final frame | 3 | 1000–1200ms authored, 60fps | not played: the player is set to the final frame (`goToAndStop(last, true)`) |
| Links / buttons | press scales to .97, colour shift on hover | 1 | 120ms `--ease-out` | colour only |
| Focus ring | appears instantly | 1 | 0ms | same |

## Timing sheet (required for Tier 3–5; grammar in `motion/choreography.md`)
Every row is triggered (`@<ms from the navigation's first frame> · <duration>`); nothing on this site is scroll-linked. Two moving groups at most: **A** = the travelling object (slip, its lines, the route marker: one gesture, "the slip moves one station along the route") and **B** = the page swap (root). The new line feeds only when A is 70% done.

### Chapter 1: Forward step (Intro → Features, Features → Pricing, Pricing → Start) · one screen, no scroll · dense · technique: cross-document View Transition
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 01 | @0ms · 360ms | `::view-transition-old(root)` | opacity 1 → 0, x 0 → −24px | `--ease-out` | — | truck (the page slides back as the route advances) | opacity 1 → 0 in 150ms, no x |
| 02 | @0ms · 520ms | `::view-transition-group(slip)` | position A → B, height grows one line | `--ease-in-out` | with 01 | — | instant |
| 03 | @0ms · 520ms | `::view-transition-group(line-1…n-1)` | ride with the slip to their new rows | `--ease-in-out` | with 02 | — | instant |
| 04 | @0ms · 520ms | `::view-transition-group(here)` | marker slides to the next station | `--ease-in-out` | with 02 | — | instant |
| 05 | @120ms · 400ms | `::view-transition-new(root)` | opacity 0 → 1, x 24px → 0 | `--ease-out` | with 01 +120ms | — | opacity 0 → 1 in 150ms |
| 06 | @364ms · 260ms | `::view-transition-new(line-n)` (the step's new line) | clip-path inset(0 0 100% 0) → inset(0), y −8px → 0 | `--ease-out` | over 02 −30% | — | line shown at rest |
| 07 | after 02 (transition `finished`) · 1000–1200ms | `.window` Lottie | the step's product animation plays once | authored (`--ease-out-strong` curves) | after 02 | — | final frame, still |
| 08 | after 07 | whole page | nothing moves; the step is read | — | hold (until the visitor acts) | — | — |

### Chapter 2: Back step (any page → an earlier page, browser Back included) · one screen, no scroll · dense · technique: cross-document View Transition, mirrored
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 01 | @0ms · 240ms | `::view-transition-old(line-n)` (the line the visitor is leaving) | clip-path inset(0) → inset(0 0 100% 0), y 0 → −8px (rolls back into the slot) | `--ease-out` | — | — | removed instantly |
| 02 | @0ms · 360ms | `::view-transition-old(root)` | opacity 1 → 0, x 0 → +24px | `--ease-out` | with 01 | truck (reverse) | opacity 1 → 0 in 150ms |
| 03 | @0ms · 520ms | `::view-transition-group(slip / lines / here)` | travel back to the earlier station's places | `--ease-in-out` | with 02 | — | instant |
| 04 | @120ms · 400ms | `::view-transition-new(root)` | opacity 0 → 1, x −24px → 0 | `--ease-out` | with 02 +120ms | — | opacity 0 → 1 in 150ms |
| 05 | after 03 | `.window` Lottie | plays the earlier step's animation once | authored | after 03 | — | final frame, still |
| 06 | after 05 | whole page | rest | — | hold (until the visitor acts) | — | — |

Groups: 01 and 03 belong to group A (the slip), 02 and 04 to group B (root): two groups at most ✓. `over` hand-off in chapter 1 is 30% ✓ (inside 20–40%). Every chapter ends on a hold ✓. No captions scrub (nothing scrubs) ✓. Page transitions finish by 624ms (under 700ms) and never block navigation: the browser owns them.

Rhythm: a transition is the one dense moment per step; each page itself is a still chapter (one Lottie that plays once, then a hold). Run of three: transition (dense) → page (still) → transition (dense) ✓. The first screen (Intro) and the last (Start) are still: their only motion is the Lottie playing once.

## Product animations (Lottie stand-ins, 320 × 120 artboard, 60fps, play once)
| Page | File | What it shows | Frames | Shown until it loads (and with no JS) | Reduced motion |
|---|---|---|---|---|---|
| Intro | `assets/lottie/balance.json` | two dots (Mitu, Sabbir), an arrow draws from Mitu to Sabbir, the balance bar fills | 0–72 | inline SVG poster: arrow drawn, bar full | final frame |
| Features | `assets/lottie/add-expense.json` | the add button is tapped twice (two press dips, two rings), then a new expense row drops into the list with a tick | 0–78 | poster: row in place, tick drawn | final frame |
| Pricing | `assets/lottie/plan-toggle.json` | a switch slides from the Free side to the Plus side and fills stamp blue | 0–60 | poster: switch on the Plus side, filled | final frame |
| Start | `assets/lottie/check.json` | a circle draws, then the check mark draws inside it | 0–66 | poster: circle and check drawn | final frame |

Loading: `tour.js` injects `assets/vendor/lottie_light.min.js` (46.6 KB gzipped) after `DOMContentLoaded`, then loads the page's one JSON. The poster stays until the player reports `DOMLoaded`, then the player's SVG replaces it in the same box (same artboard, so no layout shift). If the script or JSON fails, the poster remains. Swapping in the client's files: same file names, 320 × 120 artboard; a `.riv` file can replace a JSON by switching the loader to `@rive-app/canvas` with the same window and poster.

## Chapters (Motomation)
Not used: Tier 3 has no scroll film. The tour is four one-screen documents.

## Signature move
- Name: The slip carries forward
- Trigger: any navigation between two tour pages (route station, pager link, browser Back/Forward)
- Off-switch (touch / reduced motion): touch keeps it (it is not pointer-driven); reduced motion turns every travel into an instant change under a 150ms cross-fade, the new line is simply there, and the Lottie shows its final frame. Browsers without View Transitions get an instant page change with the same final layout.
