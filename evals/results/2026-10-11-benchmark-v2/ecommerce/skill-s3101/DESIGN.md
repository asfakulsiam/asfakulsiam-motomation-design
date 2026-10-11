# DESIGN.md: Mati (ceramics shop)

## Concept
- **Tension:** slow handmade objects (3 days stacking, 36 hours firing, 4 days cooling) ↔ a buyer who wants to add to cart in one tap.
- **Concept sentence:** The cup is for sale from the first screen, and the page is the kiln: scroll distance is firing time, and the cup goes from raw clay to glazed as you read.
- **Archetype + mutation:** Diptych (hero and firing story are two halves in dialogue) mutated by "single object": the whole site orbits the Firing Cup.
- **Collision:** thermal camera (science) → heat shown as colour: a clay → ember → ash scale becomes the cup's state, the timeline bar and the free-shipping thread.
- **Signature move:** Heat Thread. One clay→ember→ash scale. The sticky cup develops as you scroll (heat in, heat out, ash glaze drips down, flame marks appear), and the same scale fills the free-shipping bar in the cart.
- **Dials:** ENERGY 2 · RHYTHM 2 · MOTION 2 → Tier 2
- **Rejected:** a product carousel; a turntable (Tier 5) for a cup that is bought in one tap; rustic wood textures and script fonts.

## Typography
| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Fraunces | opsz auto, wght 400–600, SOFT 100 | `--step-4` clamp 3.4–8.5rem | warm, soft old-style; chosen for hand-made warmth without rustic clichés |
| Heading | Fraunces | wght 500 | `--step-2/3` | |
| Body | Hanken Grotesk | 400/500 | `--step-0` 1.0625rem | calm; disappears |
| Mono / labels | Hanken Grotesk caps | 600, +0.1em | `--step--1` | no mono face needed |
| Taka glyph | Noto Sans Bengali (subset to ৳) | 400–700 | | fallback for ৳ only |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #EFE9E1 | — | page background (Clay & Moss ground) |
| `--ink` | #2A241E | 13:1 | text |
| `--muted` | #6B6157 | 5.0:1 | secondary text |
| `--ember` | #A8401A | 6.15:1 white on it | the one accent: CTA, focus, heat |
| `--kiln` | #1E1814 | chalk on it 14.6:1 | firing story ground |

## Layout
- Grid: 2-column diptych (7/5 hero, 5/6 story) from 900px; stacked below, detail moved not dropped.
- Margins / gutters: clamp(20px, 5vw, 80px).
- Section spacing: 96 / 160px.
- Nav: wordmark, three anchors, cart button with count.
- Footer (sign-off): one line, makers and place.

## Components
- Buttons: ember fill, 48px high, press scale 0.97.
- Links: underline on hover.
- Cards: none; the shelf is ruled rows.
- Forms: none (cart steppers only).

## Imagery
- Source: SVG drawn in code (cup, five silhouettes).
- Treatment: flat clay fills, ash glaze, heat gradient.
- `[NEEDS ASSET]` list: real product photographs of each piece.

## Restraint Gate record
- Concept survived: yes
- Cut: stage caption that named the current phase — the timeline bar already says it
- Cut: product carousel — the shelf is a plain list, buying stays one tap
- Cut: smooth-scroll library — native scroll keeps keyboard and anchors intact
- Rejected animation: hover heat on shelf rows — failed question 2 (tells nothing new, seen constantly)
- Rejected animation: whole-page parallax on the hero cup — failed question 2 (what does it tell the user?)
