# DESIGN.md: Tracewell landing page

## Concept
- **Tension:** 4 million lines of identical-looking noise ↔ the single line an on-call engineer needs at 3 a.m.
- **Concept sentence:** A page that opens as a wall of log lines, then goes quiet around the one line that explains the incident.
- **Archetype + mutation:** Ledger (rows as a log) mutated by "one font weight only": every size and role is weight 400; hierarchy comes from size, colour and dimming. Console flavour for the product demo.
- **Collision:** topographic map (geography) → contour rules: concentric contour lines rise around the key line like a peak.
- **Signature move:** Quiet-down: lines dim to the muted tone one by one while the key line stays lit with an amber marker. Echoed in "How it works" (active step lit, others dimmed on scroll) and in the ranked result (bars).
- **Dials:** ENERGY 2 · RHYTHM 2 · MOTION 2 → Tier 2
- **Rejected:** centred hero + two buttons + screenshot; logo wall (no logos exist); purple gradient "AI" glow; fake dashboard with metrics.

## Typography
| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Geist Mono | 400 | clamp 2.1–4.6rem | a log tool speaks in mono; the one-liner is set like a log line |
| Heading | Geist Mono | 400 | 1.4–2rem | |
| Body | Geist | 400 | 1.0625rem | disappears |
| Mono / labels | Geist Mono | 400 | 0.8125–0.875rem | log lines, labels |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #0E1110 | — | page background |
| `--ink` | #ECEEE9 | 16.25:1 | text |
| `--muted` | #8A928C | 5.94:1 | dimmed lines, secondary |
| `--accent` | #FFB547 | fill behind #0E1110 text 10.8:1 | the key line only |
| `--paper` | #ECEEE9 | result view surface, text #0E1110 / #566059 5.59:1 | |

## Layout
- Grid: 12 columns ≥960px, single column below; hero 5/7 split.
- Margins / gutters: clamp(20px, 4vw, 64px)
- Section spacing: hairline rules, generous vertical rhythm
- Nav: wordmark + two anchor links, no button
- Footer (sign-off): install commands, one line

## Components
- Buttons: copy buttons, outlined, 44px min target
- Links: underlined
- Cards: none; ledger rows only. Result view is one light panel.
- Forms: none

## Imagery
- Source: CSS/SVG only (contour lines, bars)
- Treatment: contours at low contrast, decorative, aria-hidden
- `[NEEDS ASSET]` list: none. `[NEEDS COPY]`: docs link target, sign-up URL.

## Restraint Gate record
- Concept survived: yes
- Cut: logo wall — no customers exist yet
- Cut: usage-number strip — no numbers exist
- Cut: feature icon row — the demo shows the features
- Cut: hero screenshot — replaced by the live ledger
- Rejected animation: counting "lines processed" ticker — failed "what does it tell the user?" (would imply a usage metric)
- Rejected animation: parallax on contours — failed "does it serve the concept?"
