# DESIGN.md: Sundari Trust

## Concept
- **Tension:** An urgent ask (donate, volunteer) for slow work (a mangrove takes three years of care).
- **Concept sentence:** The page is a tide table: you scroll, the water rises, and each action has its season.
- **Archetype + mutation:** The Index (huge typographic rows) mutated by second person: every row speaks to "you".
- **Collision:** tide chart (sea) → periodic rise and fall; a gauge that fills as you read.
- **Signature move:** a fixed tide gauge on the right edge; the water level rises with scroll progress.
- **Dials:** ENERGY 1 · RHYTHM 2 · MOTION 1 → Tier 1
- **Rejected:** Stage and Broadsheet draws (logged runs too similar); a count-up of 140 (would show a value later corrected).

## Typography
Type mode: HOUSE STYLE (typography-led) for the hero and index rows; forms stay compact. Bangla headline is the image.

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Noto Serif Bengali + Fraunces | 600 / 500 | clamp 2.6–7rem | Bangla and Latin scripts each get a serif |
| Heading | same | 600 | clamp 2–4.5rem | |
| Body | Hind Siliguri | 400/500 | 1.0625rem | covers Bangla and Latin |
| Labels | Hind Siliguri | 600 | 0.875rem | uppercase tracking on Latin only |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #EDEFE3 | — | page |
| `--ink` | #11261F | 13.67 | text, dark band |
| `--muted` | #4A5A52 | 6.27 | secondary |
| `--accent` | #A63A18 | 5.57 | the one moment (actions) |
| `--water` | #9FD3B8 | 9.45 on ink | water on dark |

## Layout
- Grid: 12 columns; index number in column 1, title across the rest.
- Section spacing: clamp 4–9rem; hairline between rows.
- Nav: wordmark left, three anchors right; collapses to wordmark + one Donate link at 375.
- Footer: ink band with email.

## Components
- Buttons: solid accent, 2px focus ring offset; hover colour shift under 200ms.
- Forms: visible labels (Bangla/English), radios as tiles, front-end mock confirm.

## Imagery
- Source: inline SVG mangrove roots. Treatment: single ink line drawing. `[NEEDS ASSET]`: real photographs from Sundari Trust.

## Restraint Gate record
- Concept survived: yes
- Cut: count-up of 140 — it would show 0 before settling
- Cut: Bangla/English language toggle — both languages sit together, a toggle adds state with no job
- Cut: GSAP and Lenis — one scroll-linked transform needs neither
- Rejected animation: wave drift on the hero waterline — fails "what does this tell the user?"
- Rejected animation: fade-up on every row — fails "does it explain anything?"
