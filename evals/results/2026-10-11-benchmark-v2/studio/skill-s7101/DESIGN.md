# DESIGN.md: Ittaghor Studio

## Concept
- **Tension:** The studio sells light, but a website is a flat, evenly lit screen. Brick is heavy and still; light moves across it all day.
- **Concept sentence:** A site where one sun crosses the page as you scroll, and every brick wall, courtyard and plan is read in that changing light.
- **Archetype + mutation:** The Timeline (years as nav) mutated by "single object": the whole site orbits one object, the sun.
- **Collision:** tailor's measuring tape → a numbered ruler with tension: the time-of-day ruler (06:00–18:00) is the scroll progress bar and a draggable control.
- **Signature move:** The Sun Ruler. Scrolling (or dragging/keying the ruler) moves one sun across every brick image, so light slides over walls, down the library shaft, through the jali holes and across both twin courts.
- **Dials:** ENERGY 1 · RHYTHM 1 · MOTION 2 → Tier 2
- **Rejected:** Full-bleed dark hero with a centred title; a parallax image carousel; a bento grid of project thumbnails.

## Typography
| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Instrument Serif | 400 | clamp up to 7.6rem | quiet, drawn like a title block |
| Heading | Instrument Serif | 400 | clamp 2–4.5rem | |
| Body | Instrument Sans | 400/500 | 1.0625rem | disappears |
| Mono / labels | Instrument Sans | 500, caps, tracked | 0.8125rem | ruler, meta |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #EEE7DA | — | page background |
| `--ink` | #241A14 | ~14:1 | text |
| `--muted` | #5F5045 | 6.28:1 | secondary text |
| `--accent` | #8E3B20 (brick) | 6.11:1 | years, thumb, links |
| `--light` | #FFE7A8 | 13.5:1 on dark | the sun, contact link |

## Layout
- Grid: 12-col feel, 3fr/9fr project rows; years act as the timeline column.
- Margins / gutters: fluid 1.25rem–3.5rem.
- Section spacing: 3–7rem.
- Nav: wordmark + four anchors; fixed Sun Ruler at the bottom.
- Footer: partners and founding year on the dark contact ground.

## Components
- Buttons: none. Links are underlined text.
- Cards: none.
- Forms: none (email link).

## Imagery
- Source: inline SVG, brick pattern defined once and reused.
- Treatment: each image has one moving light element driven by `--sun`.
- `[NEEDS ASSET]` list: none; real photographs to replace drawings when the studio supplies them.

## Restraint Gate record
- Concept survived: yes, after 1 change
- Cut: sun-coloured page background shift — it broke contrast measurement and competed with the imagery
- Cut: custom cursor — nothing for it to say on a quiet site
- Cut: project-to-project page transitions — single page, no job
- Rejected animation: parallax on brick images — fails "what does it tell the user?"; light is what moves, not the wall
- Rejected animation: looping sway on the neem tree — runs off-screen, decorative
