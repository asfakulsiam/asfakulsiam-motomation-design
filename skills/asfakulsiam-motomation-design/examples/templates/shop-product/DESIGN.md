# DESIGN.md: Mati — No. 14-07, Ash celadon plate

> How it looks. Page template `shop-product` in `examples/templates/`, composed from `examples/sections/` only.

## Concept
- **Tension:** Handmade plates are sold like commodities online; each one is unique.
- **Concept sentence:** One plate sold as a catalogue lot: number, provenance, the record of its making, and a reservation you have to mean.
- **Archetype + mutation:** catalogue + single-object
- **Collision:** auction catalogue × kiln log
- **Signature move:** hold-to-commit
- **Dials:** ENERGY 2 · RHYTHM 2 · MOTION 2 → Tier 2
- **Rejected:** Image carousel hero with thumbnails; star ratings.

## Typography
Type mode: HOUSE STYLE (typography-led), because the object and its story sell it

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Fraunces | as shipped in `fonts/` | `clamp()` per section | headings h1–h3 |
| Heading | Fraunces | — | `clamp()` per section | |
| Body | Familjen Grotesk | 400–600 | 17px base | Hind Siliguri for Bangla and ৳ |
| Mono / labels | JetBrains Mono | 400 | 11–13px | labels, numbers, codes |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #efe9df | — | page background |
| `--ink` | #2a221b | 12.95:1 | text |
| `--muted` | #5e5246 | 6.28:1 | secondary text, labels |
| `--accent` | #8c4a26 | 5.57:1 | the one moment (links, the active choice, the signature's line) |

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
- Source: Photographs of No. 14-07 and batch 14 [NEEDS ASSET]; generated SVG placeholders in the repo
- Treatment: none beyond what the section does
- `[NEEDS ASSET]` list: see Source

## Restraint Gate record
- Concept survived: yes
- Cut: star ratings — buyers' mailed notes replace them, each tied to an object number
- Cut: an add-to-cart button — there are nine of these plates; a press-and-hold reservation matches the stakes
- Rejected animation: zoom-on-hover on the product image — the plate's surface is not detailed enough in a placeholder to reward it, and tilt already responds
- Rejected animation: animating the glaze-set prices in — the numbers check forbids a price that settles after load
