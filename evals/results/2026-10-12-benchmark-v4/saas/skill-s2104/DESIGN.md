# DESIGN.md: Tracewell landing page

## Concept
- **Tension:** millions of log lines of noise ↔ one line that matters at 3 a.m.
- **Concept sentence:** A site where a field of log lines runs hot, then goes quiet around the one that explains the incident.
- **Archetype + mutation:** Ledger (rows and columns like an account book) mutated by print marginalia: row folios and margin notes carry the meaning.
- **Collision:** thermal camera → heat shown as colour: every line is a bar that glows with how unusual it is.
- **Signature move:** Heat Fall: noise bars cool from the edges inward until one line stays hot and unfolds into readable text.
- **Dials:** ENERGY 2 · RHYTHM 2 · MOTION 2 → Tier 2
- **Rejected:** a centred hero + screenshot; a Console/terminal-only page (the previous SaaS default); an animated log ticker (noise as decoration, no meaning).

## Typography
Type mode: SERVICE STYLE (information-led): the visitor is an on-call engineer who came to read the commands, compare two plans and install.

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display / heading | Bricolage Grotesque | 600, opsz auto | h1 clamp 2.25-3.5rem, h2 1.5-2.1rem | not a banned face; condensed warmth against mono |
| Body | Geist | 400/500 | 1.0625rem | 62ch measure |
| Mono / labels | Geist Mono | 400/500 | 0.875rem | commands, folios, tags |

## Colour (Safelight family, darkened for terminals)
| Token | Value | Use |
|---|---|---|
| `--ground` | #140B0A | page |
| `--surface` | #21110F | terminal, result, plans |
| `--ink` | #F6E9E2 | text |
| `--muted` | #B89A90 | secondary text |
| `--accent` | #FF5A3C | heat: the one hot line, primary action |

## Layout
- Grid: ledger, folio margin (6rem) + content column; stacks at 375px with the folio above the row.
- Section spacing: clamp(64px, 9vw, 128px). Nav: wordmark + four anchors, wraps on phones. Footer: one line.

## Components
- Buttons: one primary (accent fill). Code blocks with a real copy button.
- No cards-in-cards, no icons, no logos, no testimonials, no statistics.

## Imagery
- CSS only: bars, terminal, result view. `[NEEDS ASSET]`: none.

## Restraint Gate record
- Concept survived: yes
- Cut: hero screenshot — the field of bars is the product image
- Cut: feature icon row — the three steps are the features, as ledger rows
- Cut: docs/GitHub/social footer links — the brief gives no URLs
- Rejected animation: continuously scrolling log ticker — tells the user nothing (question 2)
- Rejected animation: cursor-reactive bars — seen once, adds a second signature (question 1)
- Rejected animation: count-up on prices — would show a corrected value (question 4)
