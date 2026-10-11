# DESIGN.md: Haveli Panam — seven rooms in Sonargaon

> How it looks. Page template `hotel` in `examples/templates/`, composed from `examples/sections/` only.

## Concept
- **Tension:** A seven-room heritage house has to feel like arriving, not like booking.
- **Concept sentence:** The page opens a door onto the courtyard, then walks you along the upstairs gallery.
- **Archetype + mutation:** room + reverse-reveal
- **Collision:** doorway × survey sheet
- **Signature move:** aperture
- **Dials:** ENERGY 1 · RHYTHM 2 · MOTION 2 → Tier 2
- **Rejected:** A booking widget in the hero; an image slider of rooms.

## Typography
Type mode: HOUSE STYLE (typography-led), because the house sells the stay

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Cormorant Garamond | as shipped in `fonts/` | `clamp()` per section | headings h1–h3 |
| Heading | Cormorant Garamond | — | `clamp()` per section | |
| Body | Instrument Sans | 400–600 | 17px base | Hind Siliguri for Bangla and ৳ |
| Mono / labels | JetBrains Mono | 400 | 11–13px | labels, numbers, codes |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #f1e8da | — | page background |
| `--ink` | #2b2018 | 13.08:1 | text |
| `--muted` | #62513e | 6.25:1 | secondary text, labels |
| `--accent` | #8a4b2a | 5.54:1 | the one moment (links, the active choice, the signature's line) |

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
- Source: Courtyard, rooms and guest-book photographs [NEEDS ASSET]
- Treatment: none beyond what the section does
- `[NEEDS ASSET]` list: see Source

## Restraint Gate record
- Concept survived: yes, after 1 change
- Cut: a booking widget in the hero — seven rooms are booked by phone; the call and address are copyable in the last section
- Cut: an amenities icon list — the season cards say what the house is like, which is what an amenity list fails to say
- Rejected animation: animated film grain on the hero — still grain gives the paper feel without a moving texture behind text
- Rejected animation: drifting contour lines repainting every frame — rebuilt as three composited layers after the 60fps measurement
