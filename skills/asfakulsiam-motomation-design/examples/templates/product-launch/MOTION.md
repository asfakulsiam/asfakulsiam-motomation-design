# MOTION.md: Shapla R1 (template `product-launch`)

> How it moves. Grammar and scoring: `motion/choreography.md`. Ranges are % of the stage's pinned pass (440vh
> desktop, 360vh mobile, minus one viewport). Film positions refer to `scene.mjs` progress (frames 1–180; mobile 90).
> Unlike `motion-portfolio` (a continuous scrub with caption cuts), this stage is stepped: each quarter of the pass
> moves the film for 70% and holds for 30%, so the object is still while its note is read.

## Motion principles for this project
- Tier: 5 (scroll-scrubbed frame sequence on one sticky stage, stepped; no WebGL, no smooth-scroll library)
- Personality: a repair manual: deliberate steps, full stops between them, nothing decorative
- Ease tokens used: `none` for the scrub inside a step; smoothstep (`k²(3 − 2k)`) for the aperture; `--ease` (`cubic-bezier(0.2, 0.7, 0.2, 1)`) 300ms for the step highlight
- What never moves: the hook, the price, the spec sheet, the form; the step list's positions (only emphasis changes)

## Timing sheet

### Chapter 1: Hook · 82svh · still
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 01 | — | title, price, reserve | hold | — | hold | — | same |

### Chapter 2: Stage (`.stage`, pinned) · 440vh · dense · technique: stepped frame sequence
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 01 | 0–16% | film window | aperture: `circle(16%)` → `circle(75%)`, then unclipped | smoothstep | with 02 | — | no aperture; still 1 in flow |
| 02 | 0–17.5% (film 0–0.20, f1–36) | radio | front-on, the camera pushes in | ease-in-out cubic (scene) | with 01 | push | still 1 + note "Folded from one sheet" |
| 03 | 17.5–25% | — | hold on the front; step 1 note open | — | hold 7.5% | — | — |
| 04 | 25–42.5% (film 0.20–0.40, f36–72) | radio | turns to three-quarters, showing the 48 mm depth | ease-in-out cubic | after 03 | orbit | still 2 + note |
| 05 | 25% | step list | step 2 marked (ink, rule), its note opens | `--ease` 300ms | cut at 25% | — | all notes open |
| 06 | 42.5–50% | — | hold on the profile | — | hold 7.5% | — | — |
| 07 | 50–67.5% (film 0.40–0.70, f72–126) | radio | the five parts separate along the depth axis; the shadow widens | ease-in-out cubic | after 06 | orbit continues (−0.3 rad) | still 3 + note |
| 08 | 67.5–75% | — | hold on the exploded view | — | hold 7.5% | — | — |
| 09 | 75–92.5% (film 0.70–1.00, f126–180) | radio | the parts close up (0.70–0.85), then the needle sweeps to a station and the dial warms (0.86–0.97) | ease-in-out cubic | after 08 | orbit back (+0.42 rad) | still 4 + note |
| 10 | 92.5–100% | — | hold on the tuned radio; the page lets go | — | hold 7.5% | — | — |

### Chapter 3: Specifications · ~70vh · still
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 01 | — | spec list | hold | — | hold | — | same |

### Chapter 4: Order · ~80vh · still
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 01 | hover · 160ms | buttons | vermilion → ink | `--ease` | — | — | colour change only |
| 02 | submit | status line | text replaced once | — | — | — | same |

Rhythm: still · dense · still · still. Inside the dense chapter, every step ends in a 7.5% hold: four breaths in one pin.

## Signature move
- Name: aperture
- Trigger: scroll, the first 16% of the stage
- What it shows: the film window opens from a small circle over the radio's dial to the whole stage
- Off-switch: reduced motion, no JavaScript, or a window under 560px tall → no aperture (the spec sheet's first still is simply there)

## Reduced motion
A different composition: a printed spec sheet. Four stills (`storyboard/1–4.webp`, 1600w) in normal flow, each beside
its note with every note open, under a heading that names the sequence. The script returns before it creates the
canvas: no canvas mounted, no pin, no frame requested. Windows under 560px tall (including 200% zoom on a 1440×900
screen) get the same sheet, so no step is ever clipped by the pinned stage.

## Performance notes
- Frames: desktop 180 × 1920×1440 WebP, mobile 90 × 828×1036; the set is chosen by `(max-width: 767px)` at load
- Draw: one `drawImage` per changed frame, rAF-throttled, cover-fit, DPR capped at 2; nearest loaded frame while streaming
- JS: inline, under 3 KB; no libraries
- Frame-time numbers: not measured in the sandbox (docs/adapters/sandbox.md); `tier5-fps.yml` measures this page on GitHub runners
