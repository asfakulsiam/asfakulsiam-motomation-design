# DESIGN.md: Tracewell

## Concept
- **Tension:** 4 million lines of noise vs. one line the on-call engineer needs at 3 a.m.
- **Concept sentence:** The page starts as a wall of logs and, as you scroll, takes everything away until one line is left.
- **Archetype + mutation:** console (fallback of the atlas draw) mutated by one font, one weight (400); hierarchy only by size and colour.
- **Collision:** typewriter (writing) → carriage return as section break, ink strike as the one amber underline on the line that matters.
- **Signature move:** Reverse reveal: the log wall dims line by line in scrambled order (scroll-scrubbed) until the one unusual line stays, struck in amber.
- **Dials:** ENERGY 2 · RHYTHM 2 · MOTION 2 → Tier 2
- **Rejected:** hero + logo wall + 3 icon features (no logos exist); purple gradient; a fake live dashboard; counting-up numbers (the brief gives no usage numbers).

## Typography
Type mode: SERVICE STYLE (information-led) — on-call engineers read, compare plans and copy commands; the product frame is the content. The headline stays at page-title scale (max 52px).

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Spline Sans Mono | 400 | clamp 28–52px | the one face: mono is the product's own material |
| Heading | Spline Sans Mono | 400 | 24px | |
| Body | Spline Sans Mono | 400 | 16px | measure ≤ 62ch |
| Mono / labels | Spline Sans Mono | 400 | 12–14px | |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #0E1110 | — | page background |
| `--ink` | #D9DDD4 | 13.77:1 | text |
| `--muted` | #8E978D | 6.29:1 | secondary text, dimmed log lines |
| `--accent` | #FFB547 | 10.80:1 | the one line, focus, selection |

## Layout
- Grid: single 1120px column, ledger rows for steps and pricing; demo is a 2-up (terminal / result view), stacked on mobile.
- Margins / gutters: clamp(20px, 5vw, 48px).
- Section spacing: clamp(64px, 10vw, 128px); hairline with a ↵ at the end of each section label.
- Nav: inline index in the corner (how · demo · pricing · install), no bar.
- Footer (sign-off): one line.

## Components
- Buttons: bordered copy buttons, 150ms feedback.
- Links: underline.
- Cards (only if needed): terminal and result windows only.
- Forms: none.

## Imagery
- Source: none. HTML/CSS terminal and result view.
- Treatment: n/a
- `[NEEDS ASSET]` list: none

## Restraint Gate record
- Concept survived: yes
- Cut: logo wall and testimonials — the brief has none and none may be invented
- Cut: counting-up numbers and usage stats — no numbers exist to count
- Cut: icon feature row — the three steps are shown as the product's own commands
- Rejected animation: typed-out hero headline — failed Q2, tells the user nothing
- Rejected animation: entrance fades on every section — failed Q1, seen once and carries no meaning
