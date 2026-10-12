# DESIGN.md: Rafi, motion designer (Dhaka)

## Concept
- **Tension:** Rafi has eight years across music videos, idents and launches, but wants studios to hire him for one thing: title sequences. Range vs. one ask.
- **Concept sentence:** The page is one title card, and a single projector bar moves across it as you scroll, so the visitor watches Rafi direct attention, which is what a title sequence does.
- **Archetype + mutation:** The Broadsheet (masthead, columns, folios) mutated by "swap the material: paper becomes glass". The newspaper's column rules are WebGL hairlines seen through a moving glass prism.
- **Collision:** library card catalogue (archives) → index cards with tabs: the three projects are pull-out cards with numbered tabs.
- **Signature move:** Projector Bar. A glass bar of light sweeps the masthead, bending the column rules and splitting them into RGB fringes. Echoed once: each card is drawn out by a sweep, with an accent rule.
- **Dials:** ENERGY 2 · RHYTHM 2 · MOTION 3 → Tier 4 (forced by `--tier=4`)
- **Rejected:** a reel of thumbnails (no images exist and none may be invented); a shader that renders the name (kills selectable text and contrast).

## Typography
Type mode: HOUSE STYLE (typography-led), because this is a studio-facing portfolio and the name is the image.

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Big Shoulders Display | 900 | `min(44–52vw, 58svh)` | condensed title-card face, uppercase |
| Heading | Big Shoulders Display | 800 | `clamp(2.6rem, 7vw, 6rem)` | |
| Body | Switzer | 400/500 | 1.0625rem | measure ≤ 62ch |
| Labels | Switzer | 500, uppercase, tracked | 0.8125rem | |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #0E0D0B | n/a | page |
| `--surface` | #1A1814 | n/a | index cards |
| `--ink` | #F2EEE6 | 15+ | text |
| `--muted` | #A8A196 | 7.58 | secondary text (below the masthead only) |
| `--accent` | #E0442B | 4.65 | rules, the bar, one tag |

## Layout
- Grid: 12-column broadsheet; lead card full width, two cards as half columns.
- Nav: none (single page, nothing to navigate; a skip link only).
- Footer: one line sign-off.

## Imagery
- None. No image exists in the brief. The light is the image. `[NEEDS ASSET]`: stills from Bhoot, Monsoon Idents, Koi if Rafi wants them shown.

## Restraint Gate record
- Concept survived: yes
- Cut: a separate "range" section for music videos / idents / launches: it repeated the masthead line
- Cut: a navigation bar: a one-screen-per-job page has nothing to navigate
- Cut: invented case-study blurbs: the brief gives only name, kind and year
- Rejected animation: letter-by-letter split of the name: fails "what does it tell the user" and splits a word across elements
- Rejected animation: hover tilt on cards: cards are not interactive
