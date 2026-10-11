# DESIGN.md: Haveli 1893

## Concept
- **Tension:** A hotel that must feel new to book (instant, always-reachable booking) ↔ a house whose whole value is a slow arrival through 1890s doors in a lane.
- **Concept sentence:** The site is one arrival: you scroll and the old doors open, and a booking stub stays in your hand the whole way.
- **Archetype + mutation:** Room, mutated by "a list becomes a map": the rooms price list is drawn as one door per room (12 doors), grouped by type.
- **Collision:** boarding pass (travel) → tear-off stub and perforation: the always-visible "Check availability" is a perforated stub.
- **Signature move:** Threshold doors. The hero's two timber leaves swing open with scroll; the twelve room-doors swing open once each, as their row arrives.
- **Dials:** ENERGY 1 · RHYTHM 2 · MOTION 2 → Tier 2
- **Rejected:** hero photo carousel; floating nav bar with five links; a pinned multi-chapter film; invented floor plan.

## Typography
| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Fraunces (+ Noto Serif Bengali for ৳) | opsz auto, 300–500 | clamp 3.25–8.5rem | warm old-style, soft, fits lime and timber |
| Heading | Fraunces | 400 | clamp 2–4rem | |
| Body | Instrument Sans (+ Noto Sans Bengali for ৳) | 400/600 | 1.0625rem | disappears |
| Labels | Instrument Sans | 600, caps, tracking | 0.8125rem... 0.875rem | |

## Colour (Oxblood Library, adapted)
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #F1ECE4 | — | lime-plaster page |
| `--ink` | #1E1614 | >15:1 | text |
| `--muted` | #62554F | 6.09:1 | secondary text |
| `--accent` | #7A1F1F | 8.74:1 (ground text on it) | the booking stub only |
| `--wood` | #3A2A22 | illustration | doors |

## Layout
- Grid: 12-col feel via two-column splits; wide margins; hairlines.
- Nav: none beyond wordmark and the stub (removed the expected). Footer has anchor links.
- Footer: address, phone, email.

## Imagery
- Source: SVG and CSS only. Courtyard scene, door glyphs, roofline.
- `[NEEDS ASSET]`: real photographs of the house, rooms and rooftop.

## Restraint Gate record
- Concept survived: yes
- Cut: top navigation links — five anchors to a five-section page had no job
- Cut: room amenities/sizes/bed details — not in the brief, and would be invented
- Cut: a second signature (thread line through the page) — one signature only
- Rejected animation: parallax on the courtyard scene beyond the scale settle — failed "what does it tell the user?"
- Rejected animation: looping dust in the light shaft — failed "should it move at all?" and runs off-screen
