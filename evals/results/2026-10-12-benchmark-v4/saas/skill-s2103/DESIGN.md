# DESIGN.md: Tracewell

## Concept
- **Tension:** four million lines of noise vs. one line that matters; a tool that must look calm while the reader is mid-incident.
- **Concept sentence:** The page is a ledger of log lines, and scrolling dims every row until one is left.
- **Archetype + mutation:** Ledger (collide draw 2, seed 2103), mutated by the self-imposed constraint "one font weight only" (400 everywhere; hierarchy comes from size, colour and rules).
- **Collision:** topographic map → contour rules: section depth is shown as ruled, ledger-style bands.
- **Signature move:** Dim to one (hero ledger rows dim by distance until the single explaining line stays lit).
- **Dials:** ENERGY 1 · RHYTHM 2 · MOTION 1 → Tier 2
- **Rejected:** Stage/Tier 5 scrubbed film (draw 3): heavy for an on-call audience; centred hero + screenshot.

## Typography
Type mode: SERVICE STYLE (information-led): engineers came to read commands, compare plans and act; no hero-scale display word.

| Role | Family | Weight | Notes |
|---|---|---|---|
| Display/Heading | Schibsted Grotesk | 400 only | compact scale, text-wrap balance |
| Body | Schibsted Grotesk | 400 | 16-18px |
| Mono / labels | JetBrains Mono | 400 | tabular figures, logs and commands |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--paper` | #F2EFE6 | n/a | ground |
| `--ink` | #15171C | 15.6 | text |
| `--dim` | #5C5F66 | 5.56 | dimmed rows, secondary text |
| `--accent` | #B53A0E | 5.10 | the one lit line, key rules |
| terminal | #15171C / #E8E6DF / #9A9DA6 / #FF9B6B | 14.4 / 6.6 / 8.7 | product panel |

## Layout
- Grid: ledger rows with hairline rules; the product panels break the grid by running full width.
- Nav: wordmark left, three anchor links right; collapses to wordmark + install link at 375.
- Footer: one sign-off line.

## Restraint Gate record
- Concept survived: yes
- Cut: customer logo wall, testimonials and usage numbers — none exist in the brief and none may be invented
- Cut: feature icon row — the three steps are the features, shown as ledger rows
- Cut: pricing toggle — only two plans with a fixed monthly price, nothing to toggle
- Rejected animation: typing effect in the terminal — fails "what does it tell the user?"; the reader needs the whole session at once
- Rejected animation: count-down of 4 million to 1 — a value that changes would show wrong numbers mid-scroll
- Rejected animation: fade-up on every section — decoration only
