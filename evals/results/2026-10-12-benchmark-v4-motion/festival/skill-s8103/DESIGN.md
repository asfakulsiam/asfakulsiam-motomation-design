# DESIGN.md: Chattogram independent music festival, 14–15 February

MOTOMATION PLAN
Route       : full (new site)
Seed        : 8103, draw 1 (Broadsheet), tier forced to 4

## Concept
- **Tension:** Two days of loud, crowded live music ↔ a visitor who has only a date, a headcount (18 artists, two stages) and a price (৳1,500 a day), and no names yet to lean on.
- **Concept sentence:** A broadsheet printed on dark glass, where two stage lights and your cursor are the only light, so the page shows what is lit: 14–15, eighteen frames, two stages, ৳1,500.
- **Archetype + mutation:** Broadsheet (masthead, columns, folios) mutated by "swap the material: paper becomes glass; a list becomes a map" (the lineup is a contact sheet of 18 glass frames lit from behind).
- **Collision:** film contact sheet → frame numbers, edge print and grease-pencil circles on hover.
- **Signature move:** Light behind glass. One WebGL canvas lights the page from behind. The cursor (or touch) is a light, and two stage lights travel the page as you scroll.
- **Dials:** ENERGY 3 · RHYTHM 2 · MOTION 3 → Tier 4 (forced by --tier=4; the concept is lit)
- **Rejected:** a poster collage with stock crowd photos and a purple gradient; invented headliner names; a countdown.

## Typography
Type mode: HOUSE STYLE (typography-led), because it is a festival poster and the date is the image.

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Big Shoulders Display | 800 | `--step-5` | condensed poster caps, date as hero |
| Heading | Big Shoulders Display | 700 | `--step-3` | |
| Body | Instrument Sans | 400/500 | `--step-0` | |
| Labels | Instrument Sans caps, tracked | 600 | `--step--1` | folios, frame numbers |
| Taka sign | Noto Sans Bengali | fallback | | ৳ glyph |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #0b0d12 | — | page |
| `--ink` | #f3eee4 | ~17:1 | text |
| `--muted` | #b4ada0 | ~9:1 | secondary |
| `--accent` | #ff6a3d | ~7:1 | stage light, one moment per screen |

## Layout
- Grid: 12 columns, broadsheet columns with hairline rules between them.
- Nav: masthead strip (place, dates, folio) with in-page anchors; no link bar.
- Footer: colophon.

## Components
- Buttons: day toggles (checkbox as large glass tablets).
- Cards: none; frames are ruled cells.

## Imagery
- Source: none. Light is the image (WebGL canvas, SVG still for reduced motion and no WebGL).
- `[NEEDS ASSET]`: artist names, stage names, venue, schedule, ticket link, festival name.

## Restraint Gate record
- Concept survived: yes
- Cut: festival name, artist names, venue and times — not in the brief, so not invented
- Cut: countdown timer — a live number with no job
- Cut: smooth-scroll library — native scroll keeps keyboard and anchors intact
- Cut: lineup split between stages — the brief gives no split
- Rejected animation: parallax on frames — fails "what does it tell the user"
- Rejected animation: counter animating the price — fails "should it move at all"
