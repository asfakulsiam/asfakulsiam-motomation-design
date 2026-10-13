# Choreography: timing sheets, overlap grammar, camera and rhythm

A tier says how much motion a page may have. Choreography says **when** each thing moves, **against what**, and **how the page breathes between moves**. Every Tier 3–5 page ships a timing sheet in its `MOTION.md` (template: `templates/MOTION.md`), and `/critique` scores the build against that sheet (see "Scoring against the sheet" below). A Tier 1–2 page may ship one; it is not required.

Why a sheet: motion that is only described in prose ("the title reveals, then the image drifts") drifts in the build. A sheet fixes positions in numbers that the code uses verbatim, so the critique can check the build line by line, and a reviewer can see the rhythm before anything is built.

---

## 1. The timing sheet

### Units

- **Scroll-linked motion** (pinned chapters, scrubbed sections) is written in **% of the chapter's scroll length**: `0%` is the moment the chapter pins (or, unpinned, its top reaches the top of the viewport), `100%` is the moment it releases. The chapter length itself is written in **% of the viewport height** (`500vh` = five screens of scroll).
- **Time-based motion** (entrances triggered by scroll, hovers, state changes) is written as a **trigger point in % of the section's pass** (`0%` = section top enters the bottom of the viewport, `100%` = section bottom leaves the top), followed by a **duration in ms**.
- **Never mix the two in one row.** A row is either scrubbed (`12–40%`) or triggered (`@30% · 600ms`).

GSAP: write timelines with `duration: 1` so a timeline position *is* the sheet's fraction (`tl.to(x, {…}, 0.40)` = 40%). CSS scroll-driven animations: `animation-range: contain 40% contain 70%` maps one-to-one.

### Columns

| Column | Content |
|---|---|
| **Beat** | `01`, `02`… in order of start |
| **Range** | `12–40%` (scrubbed) or `@30% · 600ms` (triggered) |
| **Element** | the selector or role: `.film__canvas`, `h2`, `caption 2` |
| **Action** | what changes, in one verb phrase with values: `scale 0.92 → 1`, `opacity 0 → 1, y 30% → 0` |
| **Ease** | a token from `motion/tokens.md` (`none` for scrubbed rows unless the scrub itself is eased) |
| **Overlap** | how it relates to the beat before, in the grammar of §2 (`after 01`, `with 01 +20%`, `over 02 −30%`) |
| **Camera** | one word from §3, or `—` |
| **Reduced motion** | what the reader sees instead (`plate 2 of the storyboard`, `shown at rest`, `—` if the row has no visual effect) |

### Chapter header

Every chapter gets one line above its table:

`### Chapter <n>: <name> · <length>vh desktop / <length>vh mobile · <dense | still> · technique <A–D> (tier-5-motomation.md)`

The `dense | still` mark is what §4 checks.

---

## 2. Stagger and overlap grammar

Beats relate to each other in one of four ways. Use these words in the **Overlap** column so the relation is readable and checkable.

| Relation | Written | Means | Use for |
|---|---|---|---|
| **after** | `after 02` | starts when beat 02 ends | cause and effect; a reveal that answers the one before |
| **with** | `with 02` · `with 02 +10%` | starts at the same point as 02, or a fixed offset after its start | parts of one gesture (a heading and its rule) |
| **over** | `over 02 −30%` | starts before 02 ends, by that fraction of 02's length | hand-offs: the next thing arriving while the last settles |
| **hold** | `hold 20%` | nothing new starts for that span | letting a frame be read |

### Stagger tokens

Staggers inside one beat (letters, lines, list items, grid cells) use one of three spacings, never an arbitrary number:

| Token | Time-based | Scroll-linked | Use |
|---|---|---|---|
| `tight` | 30–40 ms | 1–2% | letters, small marks; reads as one gesture |
| `beat` | 70–90 ms | 3–5% | lines, list items; reads as a sequence |
| `phrase` | 140–180 ms | 8–12% | cards, chapters of a list; each is read before the next |

### Grammar rules

1. **At most two moving groups at once.** A third beat may only start `over` when the first of the two is at least 70% done.
2. **An `over` hand-off overlaps 20–40%.** Less reads as a stutter, more as a crowd.
3. **Captions never scrub.** Text the reader must read is triggered (on or off), never left half-faded where the scroll stops. The film demo's captions are a worked case (§6).
4. **Every chapter ends on a `hold`.** At least 10% of a chapter's length is a held, readable frame before release.
5. **Stagger direction follows reading direction** (start to end of the line, top to bottom) unless the motion is explaining a different order (e.g. assembly from the centre out), and the sheet says so.

---

## 3. Camera vocabulary

A page with a scene (a canvas film, a 3D object, a frame sequence, a large image the viewport moves over) has a camera. Name every camera move in the **Camera** column with one of these words. One move per beat; a beat with two camera moves is two beats.

| Move | What the viewer sees | Typical implementation | Use when | Don't |
|---|---|---|---|---|
| **push** | the camera moves toward the subject; the subject grows, the surround leaves the frame | `scale` up on the scene layer, or frames rendered with a dolly-in; background moves faster than subject (parallax) | drawing attention to a detail; entering a space | push and zoom type at the same time: the reader loses the line |
| **pull** | the camera moves away; the subject shrinks and its context appears | `scale` down; dolly-out frames | revealing that a detail belongs to something bigger; the end of a chapter | pull to an empty frame; a pull should arrive at a composed wide shot |
| **truck** | the camera slides sideways; the scene passes across the frame | `x` translate on the scene, horizontal reel; layers at different speeds | a sequence, a timeline, a process with steps | truck against the reading direction on body text |
| **orbit** | the camera circles the subject; the subject turns to show its depth | rotation in 3D, or frames rendered around the object | showing form: a product, a sculpture, a building | orbit more than ~180° per chapter on a phone (disorienting at 300vh) |
| **match cut** | one shot ends and the next begins on a shape, position or motion that continues across the cut | the outgoing frame's dominant shape sits exactly where the incoming one's does; cut on a single frame, or over ≤ 5% | moving between scenes or chapters without a fade | dissolve and call it a match cut; if the shapes don't align, it's a dissolve |

Fades and wipes are transitions, not camera moves; write them in **Action**.

---

## 4. Rhythm

A film page is a sequence of chapters, and the reader's attention needs the same thing a film audience does: intensity, then rest.

- **Dense chapter:** two moving groups for most of its length, or a camera move plus a type move, or a burst of beats closer than `phrase` spacing. Mark it `dense`.
- **Still chapter:** at most one moving group, nothing scrubbed except a progress indicator, type that is simply there to be read. Mark it `still`. Full-bleed type on a held image is a still chapter.
- **Alternate.** Two dense chapters in a row need a still chapter between them, or the second one must open with a `hold` of at least 20%.
- **One breath per three chapters.** In any run of three consecutive chapters, at least one is `still`. The page's sections count as chapters for this rule even when they are not pinned (a plain section with text is a still chapter).
- **Opening and closing.** The first chapter after the hero and the last chapter before the call to action are where the page breathes: prefer `still` there, so the reader arrives and leaves with the content, not the effect.

---

## 5. Scoring against the sheet (`/critique`)

`/critique` adds a **Choreography** line (format in `commands/critique-format.md`) for every page that has a timing sheet. It reads the sheet, then the code (timeline positions, `animation-range`, trigger thresholds, durations, stagger values), and scores 5 minus one point per class of deviation, minimum 1:

| Deviation (one point each, however many rows) | How it's checked |
|---|---|
| **Position drift:** a row's range or trigger differs from the code by more than 5% of the chapter (or 100 ms) | sheet number vs timeline position / threshold in code |
| **Grammar:** more than two moving groups at once, an `over` outside 20–40%, a scrubbed caption, a chapter without its closing `hold` | the sheet's own rows, after drift is corrected |
| **Camera:** two camera moves in one beat, an unnamed move, a "match cut" whose shapes don't align in the gate's motion-report strip | sheet + `scripts/gate.mjs --report` frames |
| **Rhythm:** two `dense` chapters adjacent without a breath, or three chapters without a `still` | chapter headers |
| **Reduced motion:** a row with a visual effect and an empty **Reduced motion** cell, or a cell the build doesn't honour | sheet + the page under `prefers-reduced-motion` (gate Q axis `rm:`) |

The score is written `Choreography 4/5 · drift: beat 03 at 48% (sheet 40%)` and feeds the **M** discussion in the critique. It does not change the gate's measured M axis, which only scores budgets. Never claim a choreography score without the sheet: a page with no sheet gets `Choreography: no timing sheet`. That is a failure for Tier 3–5 (enforced by the repository check, check-repo, for the shipped templates).

---

## 6. Worked example: the Tier 5 film demo

`examples/html/motomation-film.html`, chapter "the stage". The numbers are the code's (`tl` with `duration: 1`, `scenes = [[0, .25], [.25, .5], [.5, .75], [.75, 1]]`, the render's `light`, `orbit`, `burst` terms).

### Chapter 1: The stage · 500vh desktop / 300vh mobile · dense · technique A (procedural canvas, scrubbed)

| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 01 | 0–12% | `.film__canvas` ring | light 0 → 1 (strands appear) | none | — | — | plate 1 "Darkness" |
| 02 | 0–100% | `.film__canvas` | camera angle 0 → 1.6π | none | with 01 | orbit | plates show the four key angles |
| 03 | 0–100% | `.rail` bar + timecode | scaleX 0 → 1; 00:00:00 → 00:24:00 | none | with 01 | — | — (no rail) |
| 04 | @1% · 450ms | caption 1 "Darkness" | opacity 0 → 1, y 30% → 0 | power3.out | after 01 starts | — | caption beside plate 1 |
| 05 | @25% · 300 + 450ms | caption 1 → caption 2 "Orbit" | out: opacity → 0, y → −30% (300ms); in after 150ms | power2.in / power3.out | over 04 −40% (time) | — | caption beside plate 2 |
| 06 | 40–85% | ring strands | burst: separate, peak at ~62%, close | sine (in the render) | over 02 | push (the strands come toward the lens) | plate 3 "Exploded" |
| 07 | @50% · 750ms | caption 2 → 3 "Exploded" | as 05 | as 05 | with 06 +10% | — | caption beside plate 3 |
| 08 | @75% · 750ms | caption 3 → 4 "Whole" | as 05 | as 05 | after 06 −10% | — | caption beside plate 4 |
| 09 | 85–100% | ring | closed form, orbit continues | none | hold 15% (no new beat) | orbit | plate 4 "Whole" |

Grammar check: at most two moving groups (canvas + caption) at any point ✓ · captions are triggered, not scrubbed ✓ · closing hold 15% ✓. Rhythm: the film is the page's one dense chapter, between the statement (still) and the closing ask (still) ✓.

---

## Related

- `templates/MOTION.md`: the sheet to fill in
- `tier-5-motomation.md`: chapter techniques A–D, frame budgets
- `motion/tokens.md`: ease and duration tokens
- `gates/delivery-gate.md`: Q axis (progression, smoothness, reduced-motion distinctness)
- `docs/rm-stills/`: reduced-motion compositions, worked
