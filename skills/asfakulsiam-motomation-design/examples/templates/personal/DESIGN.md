# DESIGN.md: Letters from Nusrat — one letter a month

> How it looks. Page template `personal` in `examples/templates/`, composed from `examples/sections/` only.

## Concept
- **Tension:** A newsletter homepage is usually a pitch for the newsletter.
- **Concept sentence:** The homepage is this month's letter, addressed to you.
- **Archetype + mutation:** letter + second-person
- **Collision:** letter × post
- **Signature move:** thread
- **Dials:** ENERGY 1 · RHYTHM 1 · MOTION 2 → Tier 2 (Thread is a Tier 2 component; MOTION 1 would allow hover and focus only)
- **Rejected:** Headshot hero with a bio; a grid of past issues.

## Typography
Type mode: HOUSE STYLE (typography-led), because the voice is the product

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Instrument Serif | as shipped in `fonts/` | `clamp()` per section | headings h1–h3 |
| Heading | Instrument Serif | — | `clamp()` per section | |
| Body | Familjen Grotesk | 400–600 | 17px base | Hind Siliguri for Bangla and ৳ |
| Mono / labels | JetBrains Mono | 400 | 11–13px | labels, numbers, codes |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #f6f0e4 | — | page background |
| `--ink` | #2a1f1a | 14.13:1 | text |
| `--muted` | #655443 | 6.37:1 | secondary text, labels |
| `--accent` | #9c3b2a | 6.02:1 | the one moment (links, the active choice, the signature's line) |

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
- Source: None needed
- Treatment: none beyond what the section does
- `[NEEDS ASSET]` list: see Source

## Restraint Gate record
- Concept survived: yes, after 1 change
- Cut: an archive grid — the replies and the next topics say more about the letters than thumbnails
- Cut: a headshot — the signature closes the letter
- Rejected animation: typing the whole letter body — only the salutation types; the body must be readable at once
- Rejected animation: the pen line crossing the text — moved into its own margin column after the 375 review
