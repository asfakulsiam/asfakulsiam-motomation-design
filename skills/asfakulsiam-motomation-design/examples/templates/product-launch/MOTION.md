# MOTION.md: Shapla R1 (template `product-launch`)

> How it moves. Grammar and scoring: `motion/choreography.md`. Ranges are % of the stage's pinned pass (440vh
> desktop, 360vh mobile, minus one viewport). Film positions refer to `scene.mjs` progress (frames 1–180; mobile 90).
> Unlike `motion-portfolio` (a continuous scrub with caption cuts), this stage is stepped: each quarter of the pass
> moves the film for 70% and holds for 30%, so the object is still while its note is read.

## Motion principles for this project
- Tier: 5 (scroll-scrubbed frame sequence on one sticky stage, stepped; no WebGL, no smooth-scroll library)
- Personality: a repair manual: deliberate steps, full stops between them, nothing decorative
- Ease tokens used: `none` for the scrub inside a step; smoothstep (`k²(3 − 2k)`) for the aperture; `--ease` (`cubic-bezier(0.2, 0.7, 0.2, 1)`) 300ms for the step highlight
- What never moves: the hook, the price, the spec tiles, the form; the step list's positions (only emphasis changes)

## Timing sheet

Scroll % is the share of the whole page's scroll while a chapter holds the top of the screen (1440×900; the page is
6.69 screens, 6018 px, measured on the built page with motion on). Inside the stage, ranges are % of the stage's own
pinned pass, as before.

### Chapter 1: Hook · page 0–16% · 82svh · still
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 01 | — | Title, price, reserve, preset buttons | none (holds) | — | — | — | same |
| 02 | — | Preset buttons | enter: hover: border and label turn vermilion; press: the key drops 3 px onto its shadow · hold: while hovered / held · exit: release: back | none (instant state changes, no transition) | — | — | same (a state change, not an animation) |

Why this moves:
- **01 Title, price, reserve, preset buttons:** (does not move: the offer is read, not watched)
- **02 Preset buttons:** They are the radio's own preset keys; a key that travels when pressed says it is a key

### Chapter 2: Stage (`.stage`, pinned) · page 16–93% · 440vh · dense · technique: stepped frame sequence
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 03 | 0–16% | Film window (aperture) | enter: a `circle(16%)` over the dial · hold: grows to `circle(75%)`, then unclipped · exit: stays open to the end of the pass | smoothstep `k²(3 − 2k)` | runs with step 1's push-in | locked on the dial | no aperture; the parts plate is simply there |
| 04 | 0–25% (film f1–36) | Radio, step 1 · Face | enter: front-on; the camera pushes in over 0–17.5% · hold: 17.5–25% (7.5%) · exit: cut to step 2 at 25% | ease-in-out cubic (scene) | with the aperture | push-in (scene) | small figure 01 under the plate |
| 05 | 25–50% (f36–72) | Radio, step 2 · Profile | enter: turns to three-quarters, 25–42.5% · hold: 42.5–50% · exit: at 50% | ease-in-out cubic | after step 1's hold | turn to three-quarters | small figure 02 |
| 06 | 50–75% (f72–126) | Radio, step 3 · Inside | enter: the five parts separate along the depth axis, shadow widens, 50–67.5% · hold: 67.5–75% · exit: at 75% | ease-in-out cubic | after step 2's hold; camera orbits −0.3 rad with it | orbit −0.3 rad | the plate itself: the exploded view, parts numbered and keyed |
| 07 | 75–100% (f126–180) | Radio, step 4 · Tune | enter: parts close up (0.70–0.85 of the film), the needle sweeps to a station and the dial warms (0.86–0.97), 75–92.5% · hold: 92.5–100% · exit: the page lets go of the pin | ease-in-out cubic | after step 3's hold; orbit back +0.42 rad | orbit back +0.42 rad | small figure 04 (needle on a station) |
| 08 | 0, 25, 50, 75% | Step list (4 notes) | enter: the current step is marked (ink rule, ink title, note opens) · hold: while its step runs and holds · exit: unmarked when the next step starts | `--ease` 300 ms | one at a time: a cut, not a crossfade | — | every note open |
| 09 | 0, 25, 50, 75% | Count ("Step 1 of 4") | enter: text replaced · hold: — · exit: — | none | with the step list | — | not rendered |

Why this moves:
- **03 Film window (aperture):** The signature: you look at the radio through its own dial before you see all of it
- **04 Radio, step 1 · Face:** Shows the folded front at the size you will hold it
- **05 Radio, step 2 · Profile:** The 48 mm depth only reads in profile; a turn is how you would look at it in a shop
- **06 Radio, step 3 · Inside:** "Five parts, no glue" is a claim; taking it apart is the proof
- **07 Radio, step 4 · Tune:** It goes back together and works: the needle moving is the radio's one moving part
- **08 Step list (4 notes):** Says which claim the film is proving now, so the words and the picture never disagree
- **09 Count ("Step 1 of 4"):** Position in a stepped sequence

### Chapter 3: Specifications · page 93–100% · 66vh · still
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 10 | — | Spec tiles (6) | none (holds) | — | — | — | same |

Why this moves:
- **10 Spec tiles (6):** (does not move: numbers to be read)

### Chapter 4: Order · page 87–100% (enters at 87%; the page ends before it reaches the top) · 53vh · still
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 11 | — | Reserve button | enter: hover: vermilion → ink, 160 ms · hold: while hovered · exit: back, 160 ms | `--ease` | — | — | colour only (nothing moves) |
| 12 | on submit | Status line | enter: text replaced once · hold: — · exit: — | none | — | — | same |

Why this moves:
- **11 Reserve button:** Tells a hand the button is live
- **12 Status line:** The form's answer

Rhythm: still · dense · still · still. Inside the dense chapter, every step ends in a 7.5% hold: four breaths in one pin.
Nothing was cut from this page: every motion above has a reason in the table.

## Signature move
- Name: aperture
- Trigger: scroll, the first 16% of the stage
- What it shows: the film window opens from a small circle over the radio's dial to the whole stage
- Off-switch: reduced motion, no JavaScript, or a window under 560px tall → no aperture (the parts plate is simply there)

## Reduced motion
A different picture, not the film stopped: **a parts plate**, like the front page of a service manual. The exploded
view (`storyboard/3.webp`) is the plate, framed in a ruled box, with the five parts numbered on the drawing
(1 front shell, 2 dial plate, 3 board, 4 3.7 V cell, 5 back shell) and keyed beside it under its note; the other three
steps (face, profile, tuned) sit under the plate as small figures with their notes, the way the other views are printed
along the foot of a sheet. The film is a sequence in time; the plate is one composed page you read in any order. The
script returns before it creates the canvas: no canvas, no pin, no frame requested. Windows under 560px tall (including
200% zoom on a 1440×900 screen) get the same plate. Screens: `evals/results/motion-quality/`.

## Performance notes
- Frames: desktop 180 × 1920×1440 WebP, mobile 90 × 828×1036; the set is chosen by `(max-width: 767px)` at load
- Draw: one `drawImage` per changed frame, rAF-throttled, cover-fit, DPR capped at 2; nearest loaded frame while streaming
- JS: inline, under 3 KB; no libraries
- Frame-time numbers: not measured in the sandbox (docs/adapters/sandbox.md); `tier5-fps.yml` measures this page on GitHub runners
