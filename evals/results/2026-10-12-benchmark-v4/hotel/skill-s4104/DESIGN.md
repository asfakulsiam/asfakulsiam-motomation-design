# DESIGN.md: Haveli 1893

## Concept
- **Tension:** a 130-year-old house vs. a booking that must be one tap away on an outside engine.
- **Concept sentence:** One red thread is stitched through the house, from the front door to the address, and the guest follows it to "Check availability".
- **Archetype + mutation:** Lookbook (spreads) mutated by "remove the expected": no hero image, no nav menu.
- **Collision:** nakshi kantha (textile) → running stitch telling a story.
- **Signature move:** Running stitch: a dashed thread down the margin, a needle at the reading line, knots that fill as it passes.
- **Dials:** ENERGY 1 · RHYTHM 2 · MOTION 2 → Tier 2
- **Rejected:** Letter/seismograph cursor line (a cursor effect does nothing on touch); gallery wall with tear-off stub (booking is external, nothing to tear).

## Typography
Type mode: HOUSE STYLE (typography-led), because a hotel sells a feeling before a rate; booking is delegated to the external engine, so the page needs no dense service UI.

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Gloock | 400 | `--step-5` | sturdy shopfront serif for a merchant house; reasoned, not an AI default |
| Heading | Gloock | 400 | `--step-2/3` | |
| Body | Karla | 400/500/700 | `--step-0` 17px | Hind Siliguri fallback supplies ৳ |
| Labels | Karla | 700 caps, tracked | `--step--1` | |

## Colour
| Token | Value | Contrast | Use |
|---|---|---|---|
| `--ground` | #EFE6D6 | — | lime plaster |
| `--ink` | #1F1A15 | 13.9:1 | text |
| `--muted` | #5E5348 | 5.3:1 on plate | secondary |
| `--accent` | #A8391F | 4.55:1 on plate | the thread, numerals |
| `--dark` | #1D1B22 | 13.8:1 | rooftop chapter only |

## Layout
- Grid: 40px thread rail on the left, content beside it; two-column spreads.
- Section spacing: clamp(72px,12vw,160px).
- Nav: wordmark + "Check availability" only, always reachable.
- Footer: address line; full sign-off is the Visit section.

## Imagery
- Source: SVG line drawings (doorway, balcony rail, rooftops, skyline).
- `[NEEDS ASSET]`: real photographs of the rooms and house.

## Restraint Gate record
- Concept survived: yes
- Cut: hero image or illustration — the type and the thread are the first screen
- Cut: menu navigation — a one-page linear story with a persistent booking link
- Cut: room amenity descriptions, sizes, beds, views — not in the brief, so not invented
- Rejected animation: parallax on the drawings — failed "what does it tell the user?"
- Rejected animation: counters on prices and room counts — failed "does it mislead?" (values must be true on load)
- Rejected animation: fade-up on every section — failed "what does it tell the user?"
