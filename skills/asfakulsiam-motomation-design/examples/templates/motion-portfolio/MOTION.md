# MOTION.md: Noor Haque reel (template `motion-portfolio`)

> How it moves. Grammar and scoring: `motion/choreography.md`. Ranges are % of the reel's pinned pass (520vh desktop,
> 340vh mobile, minus one viewport). Frame numbers refer to `frames/` (180 frames; mobile has 90, same ranges).
> The film's internals come from `scene.mjs`; the page only maps scroll to a frame.

## Motion principles for this project
- Tier: 5 (scroll-scrubbed frame sequence on one sticky stage; no WebGL, no smooth-scroll library)
- Personality: a projectionist's reel: one light source, slow camera, hard cuts between commissions
- Ease tokens used: `none` for the scrub (frame = progress), `--ease` (`cubic-bezier(0.16, 1, 0.3, 1)`) for caption fades (360ms opacity, 480ms rise)
- What never moves: the hero title, the credits, the booking block; the rail's position

## Timing sheet

### Chapter 1: Hook · 88svh · still
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 01 | — | title, lead, reel meta | hold: nothing animates; the poster frame is preloaded for the reel | — | hold | — | same |

### Chapter 2: Reel (`.reel`, pinned) · 520vh · dense · technique: frame sequence
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 01 | 0–3% (f1–6) | film | hold on black with dust motes: the room before the light | none | hold 3% | — | storyboard still 1 |
| 02 | 3–20% (f6–36) | slit | the slit opens to full width, bloom rises | ease-out cubic (in scene) | after 01 | — | still 1: the open slit |
| 03 | 0–25% | caption 01 "Nodir Opar" | visible from the first scroll; timecode 00:00:00 → 00:01:12 | `--ease` 360ms | with 02 | — | caption beside still 1 |
| 04 | 22–32% (f39–57) | letterbox bars | bars close to 7% top and bottom and stay | ease-out cubic | over 02→05 | — | bars in stills 2–4 |
| 05 | 25–50% (f45–90) | ribbon | the slit lifts and twists through depth; motes drift faster | ease-in-out cubic | after 02 | truck (camera slides with the ribbon) | still 2 |
| 06 | 25% | caption 02 "Kantha" | caption 01 out, 02 in (one on at a time) | `--ease` 360ms | cut at 25% | — | caption beside still 2 |
| 07 | 50–74% (f90–133) | gates | the ribbon fades as 14 gates recede to the vanishing point and drift toward the camera | ease-in-out cubic | with 05 (ribbon out over 50–74%) | push (camera moves in) | still 3 |
| 08 | 50% | caption 03 "Projectionist" | caption swap | `--ease` 360ms | cut at 50% | — | caption beside still 3 |
| 09 | 76–90% (f136–161) | lit frame | the gates close into one frame that fills with light | ease-in-out cubic | after 07 | push ends | still 4 |
| 10 | 75% | caption 04 "End card" | caption swap | `--ease` 360ms | cut at 75% | — | caption beside still 4 |
| 11 | 92–96% (f165–172) | the cut | the light cuts to one amber outline; a rule draws under it 95–100% | linear | after 09 | — | still 4 shows the lit frame |
| 12 | 96–100% (f172–180) | — | hold on the outline, then the page lets go | — | hold 4% | — | — |
| — | 0–100% | timecode rail | mm:ss:ff 00:00:00 → 00:06:00, current shot, progress bar | none | continuous | — | not rendered |

### Chapter 3: Credits · ~70vh · still
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 01 | — | credits list | hold: a still page after the film | — | hold | — | same |

### Chapter 4: Booking · 80svh · still
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 01 | hover · 160ms | button | fills with the accent | `--ease` | — | — | colour change only (no motion involved) |

Rhythm: still · dense · still · still. One dense chapter between stills: the breath rule holds, and the tempo-shift
mutation is the rhythm itself (only the reel runs at film speed).

## Signature move
- Name: timecode-rail
- Trigger: scroll position in the reel
- What it shows: `mm:ss:ff` at 24 fps across a 6-second reel, the current shot, and a progress bar
- Off-switch: reduced motion → no rail (the storyboard captions carry each shot's timecode as text)

## Reduced motion
A different composition, not a slowed film: the reel is a storyboard of four stills (`storyboard/1–4.webp`, 1600w) in
normal flow, each with its caption beside it, under a heading that says what it is. The script returns before it
creates the canvas, so no canvas is mounted, nothing pins, and no frame is requested. Turning reduced motion on
mid-visit reloads into the storyboard.

## Performance notes
- Frames: desktop 180 × 1920×1080 WebP (≈1.8 MB total), mobile 90 × 828×1472 (≈0.6 MB); the mobile set is chosen by
  `(max-width: 767px)` at load
- Draw: one `drawImage` per changed frame on scroll (rAF-throttled), cover-fit, DPR capped at 2; nearest loaded frame
  while the sequence streams in
- JS: inline, under 3 KB; no libraries
- Frame-time numbers: not measured in the sandbox (docs/adapters/sandbox.md); `tier5-fps.yml` measures this page on GitHub runners
