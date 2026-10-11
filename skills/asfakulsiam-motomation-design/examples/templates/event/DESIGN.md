# DESIGN.md: Monsoon Jazz Night — National Theatre Hall, 14 November

> How it looks. Page template `event` in `examples/templates/`, composed from `examples/sections/` only.

## Concept
- **Tension:** A concert page is usually a flyer image with a buy button.
- **Concept sentence:** The page is the poster, under stage light, then the running order and the tickets you'll hold.
- **Archetype + mutation:** poster + scale-abuse
- **Collision:** concert poster × theatre ticket
- **Signature move:** velocity-skew
- **Dials:** ENERGY 4 · RHYTHM 3 · MOTION 4 → Tier 4
- **Rejected:** Artist photo collage; a countdown timer.

## Typography
Type mode: HOUSE STYLE (typography-led), because the poster is the brand

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Big Shoulders Display | as shipped in `fonts/` | `clamp()` per section | headings h1–h3 |
| Heading | Big Shoulders Display | — | `clamp()` per section | |
| Body | Instrument Sans | 400–600 | 17px base | Hind Siliguri for Bangla and ৳ |
| Mono / labels | JetBrains Mono | 400 | 11–13px | labels, numbers, codes |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #f1ebe0 | — | page background |
| `--ink` | #17140f | 15.48:1 | text |
| `--muted` | #5a5244 | 6.50:1 | secondary text, labels |
| `--accent` | #a2311b | 5.92:1 | the one moment (links, the active choice, the signature's line) |

## Layout
- Grid: each section's own (see its header); auto-fit columns collapse to one column at 375
- Margins / gutters: `clamp(20px, 5vw, 72px)` sides, sections `clamp(56px, 9vw, 128px)` tall padding
- Section spacing: by section padding only; no dividers beyond the sections' own rules
- Nav: none (single page, skip link to `#main`)
- Footer (sign-off): the last section is the sign-off (no footer)

## Components
- Buttons: real `<button>`/`<a>`, native focus ring in `--accent`
- Links: underlined, inherit colour
- Cards (only if needed): only where the section is a set of comparable things (plans, rooms, tickets)
- Forms: only where the page asks for something (email, amount)

## Imagery
- Source: None needed: type and light
- Treatment: none beyond what the section does
- `[NEEDS ASSET]` list: see Source

## Restraint Gate record
- Concept survived: yes
- Cut: a countdown timer — the date on the flap board is the information; a ticking clock is pressure
- Cut: a gallery of last year's photos — the lineup is what people need first
- Rejected animation: tilting the whole poster with the cursor — the tickets tilt, the poster stays a poster
- Rejected animation: animated stage beams on low-power devices — the ambient probe shows a still poster frame there
