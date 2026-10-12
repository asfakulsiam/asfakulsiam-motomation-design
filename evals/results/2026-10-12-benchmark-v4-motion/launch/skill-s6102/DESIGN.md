# DESIGN.md: Halo launch page

## Concept
- **Tension:** a lamp should disappear into the room, but a launch page has to be looked at.
- **Concept sentence:** A dark page lit only by the Halo, where scrolling turns the ring through its 180 rendered frames and the visitor's choice of temperature sets the light of the whole page.
- **Archetype + mutation:** The Shelf (seed fallback: The Stage), mutated by "a list becomes a map": the three temperatures are three stops on one rail, not three products on shelves.
- **Collision:** tide chart (sea) → periodic rise and fall: the ring opens, closes edge-on and opens again over the half turn.
- **Signature move:** Aperture. The ring is the iris: it closes to a line mid-film and reopens, and the price section opens through a circle.
- **Dials:** ENERGY 3 · RHYTHM 2 · MOTION 3 → Tier 4 (forced by `--tier=4`)
- **Rejected:** centred hero with a product photo and three feature icons; a Three.js scene for one torus.

## Typography
Type mode: HOUSE STYLE (typography-led) because a launch is a moment of desire, so one serif word, "Halo", carries the first screen.

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Instrument Serif | 400 | clamp(7rem, 30vw, 24rem) hero; clamp(5rem, 16vw, 13rem) price | tight leading |
| Heading | Instrument Serif | 400 | clamp(2rem, 4.5vw, 3.6rem) | |
| Body | Instrument Sans | 400/500 | 1.0625rem | tabular-nums for timecode and price |

## Colour (Darkroom-like; one accent that is the lamp's own light)
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #0E0D0B | — | page |
| `--ink` | #F2EEE6 | 16.6:1 | text |
| `--muted` | #A8A196 | 7.58:1 | secondary text, rules |
| `--accent` | warm #FF9F4A / neutral #F3E9D8 / cool #9CC4FF | ink-on-accent ≥ 9.5:1 | the lamp's current light |

## Layout
- Grid: text in the left ~5 of 12 columns; the ring lives in the right half (top half on phones).
- Nav: wordmark top-left, price and pre-order link top-right, always visible.
- Footer: one line sign-off.

## Components
- Buttons: accent fill, dark ink text, 140ms press.
- Temperature control: a radio group drawn as a rail with three stops.

## Imagery
- Source: none. The ring is a raw WebGL2 fragment shader (raymarched torus). The 180 supplied frames are not referenced by URL (no image URLs allowed), so the shader stands in: frame 000–179 maps to a half turn.
- `[NEEDS ASSET]` list: the 180 rendered frames if they should replace the shader; checkout URL.

## Restraint Gate record
- Concept survived: yes
- Cut: FAQ section — the brief gives no facts to answer with
- Cut: spec table — the brief gives no specs beyond price, ship month, one control, three temperatures
- Cut: second signature (cursor trail) — one signature, the aperture
- Cut: Lenis smooth scroll — native scroll keeps anchors and keyboard intact
- Rejected animation: idle floating loop on the ring — tells the user nothing (question 2) and keeps the GPU busy
- Rejected animation: stagger fade-up on every section — nothing comes from anywhere (question 2)
- Rejected animation: count-up on the price — a price must never show a wrong value
- Rejected animation: pointer-following glow on touch — no pointer to follow (question 4)
