# DESIGN.md: Ittaghor Studio

## Concept
- **Tension:** Brick is heavy, closed and slow; the studio's promise is light and an open centre. A page about walls has to feel open.
- **Concept sentence:** A site where every house is a plan that draws itself as you scroll, and then the light comes in.
- **Archetype + mutation:** Film Reel (scroll is a timeline of scenes) mutated by "remove the expected": no nav and no hero image; the hero is type and one drawn plan.
- **Collision:** rickshaw art (Dhaka street culture) → bold painted panels and borders: each project is a double-ruled painted frame.
- **Signature move:** Plan draws, light enters. Each frame's plan strokes draw with scroll, then the courtyard fills with light and the elevation's opening lights up. Echoed in the hero on load.
- **Dials:** ENERGY 1 · RHYTHM 2 · MOTION 2 → Tier 2
- **Rejected:** a Tier 5 pinned film (the content is five houses, a stroke draw says it); a photo-grid portfolio (no photos exist, and drawing is what architects do); a nav bar (one page, five scenes).

## Typography
Type mode: HOUSE STYLE (typography-led) — a studio portfolio: the line "Houses built around light, brick and an open courtyard." and the project names are the first impression; nobody is comparing rows.

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Instrument Serif | 400 | `--step-5` | condensed, drawn feel, fits long email at 375 |
| Heading | Instrument Serif | 400 | `--step-3/4` | project names |
| Body | Instrument Sans | 400/500 | `--step-0` (17px) | measure ≤ 60ch |
| Mono / labels | Instrument Sans | 500, caps, tracked | `--step--1` (14px) | frame numbers, captions |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #F1E8DA | — | page background (lime-washed paper) |
| `--ink` | #231813 | 14.27:1 | text, plan lines |
| `--muted` | #6B5A4E | 5.40:1 | secondary text |
| `--accent` | #9A3E26 | 5.59:1 | brick: numerals, emphasis words, brick fills |
| `--night` | #2A1A14 | cream on it 13.76:1 | process and contact sections |
| `--light-on-night` | #E0A07E | 7.56:1 | accent on night |
| `--sun` | #EBB27A | graphic only | light fills in plans and elevations |

## Layout
- Grid: 12 columns, project frames 7/5 and mirrored on alternate frames (the grid break).
- Margins / gutters: `clamp(20px, 5vw, 72px)`.
- Section spacing: `clamp(72px, 12vw, 176px)`.
- Nav: none (mutation). A top line carries the name, "Dhaka · Est. 2011" and the email.
- Footer (sign-off): name, place, year, email.

## Components
- Buttons: none. The email is the only action, a large serif link.
- Links: underline offset, 3px accent focus ring.
- Cards: the painted frame (double rule + brick strip), only for projects.
- Forms: none; `mailto:`.

## Imagery
- Source: SVG, drawn. One brick `<pattern>` shared by five elevations; five plans.
- Treatment: flat colour, brick texture, light as the single warm shape.
- `[NEEDS ASSET]` list: real photographs and the studio's own drawings, when available.

## Restraint Gate record
- Concept survived: yes
- Cut: navigation bar — one page and five scenes; the scroll is the navigation
- Cut: process step descriptions — the brief gives four names only; inventing detail would add claims
- Cut: partner roles and bios — none in the brief
- Rejected animation: hero headline word-by-word reveal — failed "what does this tell the user?"; the plan drawing is the hero motion
- Rejected animation: parallax on the elevations — failed "does it explain?"; it only decorates
- Rejected animation: custom cursor over frames — failed "does it explain?" and has no touch equivalent
