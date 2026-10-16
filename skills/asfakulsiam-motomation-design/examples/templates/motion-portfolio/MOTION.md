# MOTION.md: Noor Haque reel (template `motion-portfolio`)

> How it moves. Grammar and scoring: `motion/choreography.md`. Ranges are % of the reel's pinned pass (520vh desktop,
> 340vh mobile, minus one viewport). Frame numbers refer to `frames/` (180 frames; mobile has 90, same ranges).
> The film's internals come from `scene.mjs`; the page only maps scroll to a frame.

## Motion principles for this project
- Tier: 5 (scroll-scrubbed frame sequence on one sticky stage; no WebGL, no smooth-scroll library)
- Personality: a projectionist's reel: one light source, slow camera, hard cuts between commissions
- Ease tokens used: `none` for the scrub (frame = progress), `--ease` (`cubic-bezier(0.16, 1, 0.3, 1)`) for caption fades (360ms opacity; the 480ms rise was cut)
- What never moves: the hero title, the credits, the booking block; the rail's position

## Timing sheet

Scroll % is the share of the whole page's scroll while a chapter holds the top of the screen (1440×900; the page is
8.03 screens, 7227 px, measured on the built page with motion on). Inside the reel, ranges are % of the reel's own
pinned pass and frame numbers refer to `frames/` (180 desktop; mobile 90, same ranges).

### Chapter 1: Hook · page 0–15% · 100vh · still
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 01 | — | Title, lead, reel meta, the screened first shot | none (holds) | — | — | — | same |

Why this moves:
- **01 Title, lead, reel meta, the screened first shot:** (does not move: the still behind the title is the reel's first frame, waiting)

### Chapter 2: Reel (`.reel`, pinned) · page 15–89% · 520vh · dense · technique: frame sequence
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 02 | 0–3% (f1–6) | Film, room | enter: black with dust motes · hold: 0–3% · exit: the slit opens | none (frame = scroll) | — | static | title card 01 |
| 03 | 3–20% (f6–36) | Slit | enter: the slit opens to full width, bloom rises · hold: — · exit: lifts into the ribbon at 25% | ease-out cubic (scene) | after the room hold | static | title card 01 |
| 04 | 22–32% (f39–57) | Letterbox bars | enter: close to 7% top and bottom · hold: stay to the end · exit: none | ease-out cubic | over the slit → ribbon change | — | bars are in stills 2–4 |
| 05 | 25–50% (f45–90) | Ribbon | enter: the slit lifts and twists through depth; motes drift faster · hold: — · exit: fades over 50–74% as the gates come in | ease-in-out cubic | after the slit; camera trucks with it | trucks with the ribbon | title card 02 |
| 06 | 50–74% (f90–133) | Gates (14) | enter: recede to the vanishing point, drift toward the camera · hold: — · exit: close into one frame from 76% | ease-in-out cubic | with the ribbon's fade; camera pushes in | pushes in | title card 03 |
| 07 | 76–90% (f136–161) | Lit frame | enter: the gates close into one frame that fills with light · hold: — · exit: cuts at 92% | ease-in-out cubic | after the gates; the push ends | push ends | title card 04 |
| 08 | 92–96% (f165–172) | The cut | enter: the light cuts to one amber outline; a rule draws under it 95–100% · hold: 96–100% (4%) · exit: the page lets go of the pin | linear | after the lit frame | static | title card 04 shows the lit frame |
| 09 | 0, 25, 50, 75% | Captions (4) | enter: the shot's caption fades in, 360 ms · hold: while its shot runs · exit: fades out at the next cut, 360 ms | `--ease` | one on at a time; the swap is the cut | — | the four names are set on the title cards |
| 10 | 0–100% | Timecode rail | enter: with the pin · hold: continuous: mm:ss:ff 00:00:00 → 00:06:00, current shot, progress bar · exit: with the pin | none | continuous | — | not rendered (each card carries its timecode in its slate) |

Why this moves:
- **02 Film, room:** The room before the projector lamp: a held breath so the first light is an event
- **03 Slit:** Shot 01's commission opens on one line of light; the reel shows the title, it does not describe it
- **04 Letterbox bars:** The moment the reel becomes cinema, the frame changes shape: it marks the switch from a page to a film
- **05 Ribbon:** Shot 02 (Kantha): the stitch is the title card, so the line has to turn like thread
- **06 Gates (14):** Shot 03 (Projectionist): the camera pushes through every gate a print passes
- **07 Lit frame:** Shot 04 (End card): every door closes into one screen
- **08 The cut:** An ident ends on a cut, and the hold is the last frame you remember
- **09 Captions (4):** Names the commission for the shot on screen; a short dissolve so two captions never flash together (the 14 px rise was cut: a caption changes on a cut, it does not arrive)
- **10 Timecode rail:** The signature: a title designer's work is measured in frames; the rail tells you where you are in the reel the way an edit suite does

### Chapter 3: Credits · page 89–100% · 76vh · still
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 11 | — | Contact sheet of credits | none (holds) | — | — | — | same |

Why this moves:
- **11 Contact sheet of credits:** (does not move: a still page after the film)

### Chapter 4: Booking · page 86–100% (enters at 86%; the page ends before it reaches the top) · 80vh · still
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 12 | — | Button | enter: hover: fills with the accent, 160 ms · hold: while hovered · exit: back, 160 ms | `--ease` | — | — | colour change only |

Why this moves:
- **12 Button:** Tells a hand the button is live

Rhythm: still · dense · still · still. One dense chapter between stills: the breath rule holds, and the tempo-shift
mutation is the rhythm itself (only the reel runs at film speed). Cut in this revision: the captions' 480 ms rise.

## Signature move
- Name: timecode-rail
- Trigger: scroll position in the reel
- What it shows: `mm:ss:ff` at 24 fps across a 6-second reel, the current shot, and a progress bar
- Off-switch: reduced motion → no rail (each title card carries its shot's timecode in its slate)

## Reduced motion
A different picture, not a slowed or stopped film: **a wall of four title cards**, two by two. Each shot's name is set
on its own still (`storyboard/1–4.webp`, 1600w) the way a main title sits on a plate, centred on a dark band; the slate
(shot number, timecode) sits in the card's top-left corner and the commission is one line under the card. The film is
one screen changing over time; the wall shows all four commissions at once, as a title designer's pitch board would.
The script returns before it creates the canvas, so no canvas is mounted, nothing pins, and no frame is requested.
Turning reduced motion on mid-visit reloads into the wall. Screens: `evals/results/motion-quality/`.

## Performance notes
- Frames: desktop 180 × 1920×1080 WebP (≈1.8 MB total), mobile 90 × 828×1472 (≈0.6 MB); the mobile set is chosen by
  `(max-width: 767px)` at load
- Draw: one `drawImage` per changed frame on scroll (rAF-throttled), cover-fit, DPR capped at 2; nearest loaded frame
  while the sequence streams in
- JS: inline, under 3 KB; no libraries
- Frame-time numbers: not measured in the sandbox (docs/adapters/sandbox.md); `tier5-fps.yml` measures this page on GitHub runners
