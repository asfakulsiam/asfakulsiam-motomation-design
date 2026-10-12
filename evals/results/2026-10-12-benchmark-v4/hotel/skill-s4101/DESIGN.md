# DESIGN.md: Haveli 1893

## Concept
- **Tension:** A house that is 130 years old and a booking that must take one tap. Heritage vs. effortless.
- **Concept sentence:** One red running stitch sews the page together from 1893 to the booking button, and the scrollbar is that thread.
- **Archetype + mutation:** Timeline, mutated by "the scrollbar is the timeline" (a fixed stitch in the margin fills as you scroll).
- **Collision:** nakshi kantha (textile) → running stitch telling a story.
- **Signature move:** `thread`: the margin stitch; the doorway, the house section and the year line are drawn in the same dashed stitch.
- **Dials:** ENERGY 1 · RHYTHM 2 · MOTION 2 → Tier 2
- **Rejected:** Gallery Wall (needs photographs; none allowed), a Tier 5 arrival walk (no image sequence to scrub), a carousel of rooms.

## Typography
Type mode: HOUSE STYLE (typography-led) — because the hotel sells a feeling before a booking; the facts (rooms, prices, hours) sit in compact ledger rows and tabular figures.

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Fraunces | opsz 144, wght 400, SOFT 50 | clamp 4.5rem–15rem | warm old-style, heritage |
| Heading | Fraunces | wght 400 | clamp 2rem–4.5rem | |
| Body | Switzer (Fontshare) | 400/500 | 1.0625rem | |
| Mono / labels | Switzer | 500 caps, tracked | 0.875rem | tabular figures |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #EFE7D8 (lime plaster) | — | page background |
| `--ink` | #1F1A14 | 14.05:1 | text |
| `--muted` | #5A4F40 | 6.50:1 | secondary text |
| `--accent` | #A23A1C (thread red) | 5.41:1 | the stitch, price, button |
| `--night` | #1B1612 | ink on dawn section: 14.60:1 | breakfast section |
| `--sun` | #D9B27A | 9.05:1 on night | sun and kicker in dark section |

## Layout
- Grid: 12 columns desktop, single column at 375; 44px (mobile) / 96px (desktop) left gutter reserved for the stitch.
- Margins / gutters: 20px mobile, 5vw desktop.
- Section spacing: clamp(5rem, 12vw, 10rem).
- Nav: sticky bar; wordmark left, five anchors, "Check availability" always visible (anchors hidden at 375).
- Footer (sign-off): the address as the headline, phone, email, booking link.

## Components
- Buttons: one filled thread-red pill-less rectangle, 2px radius; hover shifts background in 160ms.
- Links: underlined, offset 4px.
- Cards: none. Rooms and walks are ledger rows with hairlines.
- Forms: none; booking is external.

## Imagery
- Source: SVG only (doorway in running stitch, house cross-section, rooftop skyline and sun).
- Treatment: line drawings in ink or thread red; no photographs.
- `[NEEDS ASSET]` list: real photographs of rooms, courtyard and rooftop.

## Restraint Gate record
- Concept survived: yes
- Cut: Remembered-list marks on rooms — the stitch already carries progress, a second memory device had no job
- Cut: Room descriptions (size, bed, view) — not in the brief, so left out instead of invented
- Cut: Smooth-scroll library — native scroll keeps keyboard and anchors intact
- Rejected animation: Cursor-bent hairline — failed "what does it tell the user?" on a booking site used on touch
- Rejected animation: Counting up prices — failed "should it move at all?"; prices must be readable at once
