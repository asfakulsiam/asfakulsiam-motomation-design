# DESIGN.md: Shapla R1 — a kitchen radio you tune by hand

> How it looks. Tier 5 template `product-launch` in `examples/templates/product-launch/`: a standalone page
> (`index.html`, no build) whose stage is a real frame sequence rendered by `scripts/build-frames.mjs` from
> `scene.mjs`. Shapla is a fictional maker; the page is a template, not a client site.

## Concept
- **Tension:** A launch page usually shows a hero render and a list of features, so the reader is told the object is well made but never shown how.
- **Concept sentence:** The page takes the radio apart in front of you, one step at a time, and then asks for the reservation.
- **Archetype + mutation:** stage + single-object (one fixed stage, one object, every step of the story happens to it)
- **Collision:** product launch × repair manual (numbered steps, an exploded view, a spec sheet)
- **Signature move:** aperture (the stage opens through an iris as the first step begins)
- **Dials:** ENERGY 2 · RHYTHM 2 · MOTION 3 → Tier 5 (MOTION 3 allows Tier 2–5; Tier 5 because the claim, "five parts, no glue", is physical and has to be seen coming apart; one pinned stage, nothing else past Tier 1)
- **Rejected:** A turntable hero that spins the radio forever (motion with nothing to say); a lifestyle photo of a kitchen (the radio becomes a prop).

## Typography
Type mode: EDITORIAL: a manual set like a good catalogue, a serif for statements and step titles, a grotesque for notes.

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Fraunces | 400, opsz 144; italic for the one accented word | `clamp(3rem, 8.6vw, 10rem)` hero | soft high-contrast serif, like a product name on a box |
| Heading | Fraunces | 400–500 | `clamp(1.6rem, …, 4rem)` | step titles, section titles |
| Body | Schibsted Grotesk | 400 / 600 | 16–18px | Hind Siliguri for ৳ |
| Mono / labels | JetBrains Mono | 400 | 12px, 0.1em, uppercase | step numbers, band, ship date |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #E9E4D8 | — | page and film background (the frames are rendered on the same paper, so the stage has no edge) |
| `--ink` | #191814 | 14.0:1 | text |
| `--muted` | #5A554B | 5.84:1 | notes, inactive step titles, labels |
| `--accent` | #A8341B | 5.22:1 | vermilion (the radio's case): the accented word, step numbers, the buttons (ground text on accent 5.22:1) |

## Layout
- Grid: 12 columns, `4vw` margins; one column at 375
- Hook: title on columns 1–9, price and reserve on 10–12, bottom-aligned
- Stage: 440vh (360vh mobile) with a sticky 100svh pin; desktop is a 5 : 7 split (steps left, film right); mobile stacks the film (58%) over the current step (42%)
- Specs: a two-column definition list on columns 5–12
- Order: statement on 1–7, form on 8–12
- Nav: none; skip link; the wordmark links to `#main`

## Components
- Buttons: real `<a>` (to `#order`) and a real submit `<button>`; pill, vermilion, ink on hover
- Links: step titles are links to their own step; focusing one moves the film to that step's hold
- Forms: one email field with a visible label; the template confirms in a `role="status"` line and sends nothing
- Cards: none

## Imagery
- Mode: illustration (a flat-shaded 3D render of the object, drawn procedurally; principles/imagery.md §2)
- Subject: Shapla R1 itself: the front, the profile, the five parts apart, and the dial tuned
- Direction: one object on paper, soft floor shadow, one key light from the upper left, no environment, no hands
- Frames: `frames/` 180 × 1920×1440 WebP, `frames-mobile/` 90 × 828×1036 WebP, `poster.webp` (frame 90), `storyboard/1–4.webp` at 1600w, `film.mp4` (H.264, every frame a keyframe), manifest `frames.json`; rebuild (from the skill folder): `node scripts/build-frames.mjs --scene examples/templates/product-launch/scene.mjs --out examples/templates/product-launch --quality 64` (`--check` proves byte identity)
- Frame storage: `frames/`, `frames-mobile/` and `film.mp4` are not on main (the skill stays small). `frames.lock.json` names the tarball and its sha256; `node scripts/fetch-frames.mjs product-launch` (skill folder) restores them, or rebuild them with the command above. Without them the page shows `poster.webp` and the storyboard.
- Texture: none
- Interplay: notes never sit over the render; on desktop they have their own column, on mobile their own band under the film
- Template stand-in: the procedural render stands in for a studio CGI sequence of the real product
- `[NEEDS ASSET]`: the product's real turntable/exploded sequence (same pipeline); a real checkout or reservation endpoint

## Restraint Gate record
- Concept survived: yes
- Cut: a feature grid with icons — every claim is either a step on the stage or a line in the spec sheet
- Cut: a countdown to the ship date — "ships March 2027" is the information
- Cut: an animated price counter — the price is a number to read, not a performance
- Rejected animation: the radio rotating continuously between steps — each step moves, then holds still so the note can be read
- Rejected animation: parallax on the spec sheet — it is a table; it stays put
