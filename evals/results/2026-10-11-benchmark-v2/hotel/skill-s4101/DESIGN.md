# DESIGN.md: Haveli 1893

## Concept
- **Tension:** Puran Dhaka's crowded lanes outside ↔ a still, 12-room house behind one door.
- **Concept sentence:** The page arrives the way a guest does: a door in the lane opens, and a stitched thread leads you through the house.
- **Archetype + mutation:** Timeline (1893 → 2022) mutated by "make the UI the content": the scrollbar is the thread, drawn as a running stitch.
- **Collision:** nakshi kantha (textile) → a running stitch that tells a story; it fills as you scroll and doubles as section nav.
- **Signature move:** Door leaves that part: once on arrival in the hero, then once per room as it scrolls in.
- **Dials:** ENERGY 1 · RHYTHM 2 · MOTION 2 → Tier 2
- **Rejected:** Image-sequence arrival walk (Tier 5): no photographs in the brief and too loud for a quiet mood; dark footer band (rail labels would vanish).

## Typography
| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Fraunces | 400, opsz 144, SOFT 50 | clamp(4rem, 15vw, 11rem) | warm old-style, heritage without costume |
| Heading | Fraunces | 400 | clamp(2rem, 5vw, 3.5rem) | |
| Body | Instrument Sans | 400/500 | 1.0625rem | disappears |
| Labels | Instrument Sans | 500, caps, tracked | 0.8125rem | |
| Taka sign | Noto Sans Bengali | 500 | inherit | fallback for ৳ |

## Colour
| Token | Value | Use |
|---|---|---|
| `--ground` | #EFE7D8 | lime plaster |
| `--band` | #E6DBC6 | breakfast band |
| `--ink` | #1E1B16 | text |
| `--muted` | #5A5144 | secondary |
| `--accent` | #9B3A22 | door red: CTA, thread fill |
| `--lamp` | #E3A857 | light behind the doors |
| `--door` | #34443A | door leaves (verdigris dark) |

## Layout
- Grid: single wide column with left rail ≥1000px; rows with hairlines.
- Nav: fixed header (brand + Check availability, always visible); left thread rail with section links.
- Footer (sign-off): address, phone, email, booking button.

## Imagery
- Source: CSS/SVG only (door, roofline). No photos.
- `[NEEDS ASSET]` list: room photographs, if the hotel wants them.

## Restraint Gate record
- Concept survived: yes
- Cut: image-sequence arrival walk — no photos, wrong for quiet
- Cut: map of the lanes — no coordinates or distances in the brief
- Rejected animation: parallax on the roofline — fails "what does it tell the user?"
- Rejected animation: text fade-up on every section — decoration, no meaning
