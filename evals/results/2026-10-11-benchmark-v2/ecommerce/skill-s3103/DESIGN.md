# DESIGN.md: Mati (ceramics shop)

## Concept
- **Tension:** Eight and a half days of slow fire for 32 cups ↔ a visitor who wants to buy in two taps.
- **Concept sentence:** A shop where the cup is for sale in the first screen, and below it one thread of running stitch measures the firing hour by hour until the cup comes out finished.
- **Archetype + mutation:** The Broadsheet (nameplate, folios, hairline columns) mutated by "Single object: the whole site orbits one object": the Firing Cup is the only illustrated hero, and it changes state down the page.
- **Collision:** nakshi kantha (textile) → "running stitch telling a story": a dashed stitch line whose segments are proportional to the hours of each firing stage (72 h stacking, 36 h firing, 96 h cooling).
- **Signature move:** The Stitch. Scrolling the firing story pulls a thread through the page; the needle's position is the cup's state (raw clay → in the flame → cooled with ash glaze). Echoed once: the shipping figures sit on a short stitched rule.
- **Dials:** ENERGY 2 · RHYTHM 2 · MOTION 2 → Tier 2
- **Rejected:** Hold-to-Commit buying (slows the one job that must be fast); a horizontal specimen; a rickshaw-panel frame (wrong culture for a Rajshahi wood-fire studio).

Override (house style): ecommerce category wins over "type as image": type leads by clarity in the buy panel and price rows. Display scale is used for the product name only.

## Typography
| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Fraunces (Noto Serif Bengali for ৳) | opsz auto, wght 400–600, SOFT 100, WONK 1 | `--step-4` | warm old-style with soft, slightly wonky terminals: hand-thrown, wood-fired; the SOFT axis is the concept carrier |
| Heading | Fraunces | wght 500 | `--step-2/3` | |
| Body | Instrument Sans (Noto Sans Bengali for ৳) | 400–600 | `--step-0` | calm, disappears; contrasts in one dimension (serif vs sans) |
| Mono / labels | Instrument Sans caps | 600, +0.1em tracking | `--step--1` | folios, captions; tabular-nums on prices |

## Colour
Pairs checked with `scripts/contrast.mjs`.
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #EFE9E1 | — | page background |
| `--surface` | #E4DCD1 | — | figure panels, shop band |
| `--ink` | #2A241E | 14.0 | text |
| `--muted` | #5F564C | 6.4 on ground · 5.29 on surface | secondary text, both light surfaces |
| `--ember` | #A33E1A | 5.7 on ground · 4.74 on surface · white on it 6.44 | the one accent: buy buttons, the stitch |
| `--night` | #1D1713 | firing band ground | story band |
| `--night-muted` | #B8AA99 | 7.81 on night | secondary text on night only |
| `--ember-lit` | #F08A5D | 7.18 on night | stitch + labels on night only |

## Layout
- Grid: 12 columns, broadsheet columns separated by hairlines; hero 5/7, shop 2 columns of rows, care 3 figures.
- Margins / gutters: 5vw / 24px; section spacing 96 / 144px.
- Nav: nameplate "Mati" left, three section links, cart button with count right, sticky, one row at 375.
- Footer (sign-off): a colophon line: who, where, how many pieces.

## Components
- Buttons: solid ember, white text, 48px tall, radius 2px; press scale 0.97 in 120ms.
- Links: underlined on hover/focus, ink.
- Cards: none. Rows with hairlines.
- Forms: cart dialog with +/− buttons; no inputs.

## Imagery
- Source: drawn in SVG (one cup symbol, five silhouettes). No raster, no URLs.
- Treatment: flat clay tones, ash-glaze drips, ember flame marks clipped inside the cup.
- `[NEEDS ASSET]` list: real photographs of the pieces would replace the drawn cup and silhouettes.

## Restraint Gate record
- Concept survived: yes
- Cut: "Another cup" button that re-rolls the flame marks — a second interaction competing with the stitch.
- Cut: testimonial/press strip and "as seen in" row — nothing in the brief supports them.
- Cut: a checkout step and a carousel of products — no real checkout; a carousel would hide prices.
- Rejected animation: hero cup auto-rotating loop — failed question 2 (tells the visitor nothing) and 4 (runs off-screen).
- Rejected animation: fade-up of every shop row on scroll — failed question 1 (seen on a buying screen, delays scanning).
- Rejected animation: Lenis smooth scroll — failed question 2 (nothing is told; scroll must stay native).
- Rejected animation: name letter-relay into the header — failed question 2 (no story value for a shop).
