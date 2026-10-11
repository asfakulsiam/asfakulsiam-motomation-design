# DESIGN.md: Kalo Ghor

## Concept
- **Tension:** titles are watched once, in the dark ↔ a portfolio is skimmed in daylight.
- **Concept sentence:** The page is an opening title sequence: scrolling plays the credits, and a running timecode tells you where you are.
- **Archetype + mutation:** Film Reel, mutated by "make the UI the content" (the scrollbar's job becomes a timeline rail).
- **Collision:** tide chart → periodic rise and fall of the credits.
- **Signature move:** The Tide Rail: one tide line of how much is on screen, a playhead, a 24 fps timecode, a mark per film.
- **Dials:** ENERGY 2 · RHYTHM 3 · MOTION 2 → Tier 2
- **Rejected:** Big Shoulders + Darkroom (the skill's own example), video thumbnails (none exist), client logos (none supplied).

## Typography
Type mode: HOUSE STYLE (typography-led) — because a title studio's type is its work.

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Noto Serif Bengali / Instrument Serif | 400 | clamp(3rem, 15vw, 9.5rem) | Bangla titles first, English under |
| Heading | Instrument Serif | 400, italic | clamp(1.75rem, 4vw, 3rem) | |
| Body | Instrument Sans | 400 | 1.0625rem / 1.55 | |
| Labels | Instrument Sans | 500, uppercase, tracked | 0.8125rem | credits roles, timecode |

## Colour
Palette: Night Brass (`data/palettes.csv`).

| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | `#0D0D0F` | — | the dark room |
| `--surface` | `#18181B` | — | the index |
| `--ink` | `#EDEBE6` | 16.29:1 | titles, text |
| `--muted` | `#A3A09A` | 7.44:1 (6.79:1 on surface) | credit roles |
| `--accent` | `#C9A15B` | 8.07:1 | the tide line, playhead, timecode, marks |

## Layout
- The reel: one pinned stage (100svh) over 700svh of scroll; credits centred on a 12-column grid, offset left of centre.
- The rail: right edge on desktop (vertical), bottom edge on phones (horizontal).
- After the reel: the index, the same facts as a plain list, readable without scrolling through the sequence.
- Nav: the studio's name and one "Write to us" link. The rail is the rest of the navigation.

## Components
- Rail marks: real buttons, one per film, labelled "Jump to <film>".
- Links: ink with a brass underline.

## Imagery
- Source: none. `[NEEDS ASSET]`: none — the page is built to work without stills.

## Restraint Gate record
- Concept survived: yes
- Cut: the Aperture seed move (the next section opens through an iris) — a second signature
- Cut: grain and gate-weave overlay on the stage — film texture is the cliché of every film site, and it costs paint on every frame
- Cut: a "play reel" button — there is no reel to play yet
- Cut: credits typed letter by letter — slower to read, and Bangla conjuncts break when split
- Rejected animation: the whole page magnifying on exit (Draw 1's kinetic) — it says nothing about titles
- Rejected animation: credits sliding in from the sides — titles rise and fall; sideways motion breaks the tide
