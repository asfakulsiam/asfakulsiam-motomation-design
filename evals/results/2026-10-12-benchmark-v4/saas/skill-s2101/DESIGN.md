# DESIGN.md: Tracewell landing page

## Concept
- **Tension:** 4 million lines of noise against one line that matters.
- **Concept sentence:** The wall of logs goes past while the one line stays still, and gets circled.
- **Archetype + mutation:** Broadsheet, mutated by second person (the visitor is the on-call engineer holding the pager). Pricing is a ledger.
- **Collision:** film contact sheet → frame numbers and a grease-pencil mark.
- **Signature move:** a grease-pencil circle draws around the one line, in the hero and again in the result view.
- **Dials:** ENERGY 2 · RHYTHM 2 · MOTION 1 → Tier 1
- **Rejected:** dark neon hero with a centred screenshot; GSAP pinned scroll story.

## Typography
Type mode: SERVICE STYLE (information-led), because on-call engineers read, compare and install.

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Heading | Schibsted Grotesk | 700 | `--title`, `--ui-3` | h1 is the largest type on the page |
| Body | Schibsted Grotesk | 400 | `--ui-1` | |
| Mono / labels | JetBrains Mono | 400/600 | `--ui--1`, `--ui-0` | commands, logs, frame labels |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--paper` | #F2EFE6 | — | page background |
| `--ink` | #15140F | high | text, terminal ground |
| `--muted` | #5A564A | 6.37:1 | secondary text |
| `--red` | #B3261E | 5.68:1 | grease-pencil mark on paper |
| `--dred` | #FF8A6B | 7.99:1 on ink | grease-pencil mark on dark |

## Layout
- Grid: two columns from 960px, one column below.
- Section spacing: 64px, hairline rules.
- Nav: wordmark plus anchors; only Install on phones.

## Restraint Gate record
- Concept survived: yes, after 1 change
- Cut: logo strip, testimonials and usage numbers — the brief has none and none may be invented
- Cut: GSAP and ScrollTrigger — Tier 1 CSS plus one IntersectionObserver delivers the concept
- Cut: a working "copy explanation link" button — it would imply a real URL that the brief doesn't give
- Cut: three-icon feature row — the three steps are shown as command frames instead
- Rejected animation: count-up figures — there are no usage numbers to count, and it would fail "what does this tell the user"
- Rejected animation: cursor lens over the logs — decoration that doesn't explain the product
