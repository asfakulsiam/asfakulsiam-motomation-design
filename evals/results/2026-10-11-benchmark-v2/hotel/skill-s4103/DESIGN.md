# DESIGN.md: Haveli 1893

## Concept
- **Tension:** A 130-year-old merchant house with its original doors ↔ a hotel that must be bookable in one tap from anywhere.
- **Concept sentence:** The site is the walk from the lane to your room: every threshold is a door that opens as you arrive, and the booking link never leaves your side.
- **Archetype + mutation:** Atlas (a diagram you move through) mutated by "second person": the visitor is the one walking the lane.
- **Collision:** monsoon window (weather) → a view that clears. Steals the "swept clear, now you can see" moment: doors open and reveal the lit courtyard.
- **Signature move:** Doors that open. The hero doorway opens on load; each room's door swings open as it enters view; the walk's lane draws itself as you scroll.
- **Dials:** ENERGY 1 · RHYTHM 2 · MOTION 2 → Tier 2
- **Rejected:** Image carousel of rooms; a full-page pinned arrival film.

## Typography
| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Cormorant Garamond | 500 | clamp(3.25rem, 14vw, 9rem) | hotel quiet; only large, weight 500 for screens |
| Heading | Cormorant Garamond | 500 | clamp(2rem, 6vw, 3.75rem) | |
| Body | Hanken Grotesk | 400/500 | 1.0625rem | disappears |
| Mono / labels | Hanken Grotesk caps | 600, +0.12em | 0.8125rem | |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #F1ECE4 | — | lime-plaster ground |
| `--ink` | #1E1614 | 15:1 | text |
| `--muted` | #62554F | 6:1 | secondary text, rules |
| `--accent` | #7A1F1F | 9:1 | the booking button |

## Layout
- Grid: 12 col, 6vw margins, content 7 / air 5.
- Nav: wordmark + four small links + permanent Check availability button.
- Footer (sign-off): ink ground, address, phone, email, booking.

## Imagery
- Source: SVG only (doors, roofline, lane).
- `[NEEDS ASSET]`: real photographs of rooms, house and view.

## Restraint Gate record
- Concept survived: yes, after 1 change
- Cut: pinned scroll-scrubbed arrival film — the doors open on load; a pin would hide the booking path and break at 375
- Cut: roofline sun that rises from 7 to 10 — decoration, the hours are in the type
- Rejected animation: cursor-following door light — fails "what does it tell the user?"; touch has no cursor
- Rejected animation: parallax on the roofline — fails "what does it tell the user?"
