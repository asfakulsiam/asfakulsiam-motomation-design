# DESIGN.md: Sundari Trust

## Concept
- **Tension:** Urgent coastal loss ↔ readers worn out by alarm and guilt imagery.
- **Concept sentence:** Instead of alarms, a pressed specimen sheet whose roots grow a little as you read, beside the one real number: 140 hectares.
- **Archetype + mutation:** Index, mutated by "remove the expected": no hero image; the section list is the page and a specimen sheet replaces the picture.
- **Collision:** herbarium → pressed specimens with labels (the numbered sheet caption, taped specimen).
- **Signature move:** Herbarium specimen: seedling roots draw as the page is read.
- **Dials:** ENERGY 1 · RHYTHM 2 · MOTION 2 → Tier 2
- **Rejected:** Horizontal reel (too heavy for a calm brief); mangrove-loss imagery (guilt).

## Typography
| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display (Bangla) | Noto Serif Bengali | 700 | `--step-5` | headline and section titles |
| Display (English) | Fraunces | 400/600 | `--step-2` | translation line, figures |
| Body | Hind Siliguri | 400–600 | `--step-0` | covers Bangla and Latin |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #F2EEE3 | — | page |
| `--ink` | #10281F | 13.46:1 | text |
| `--muted` | #4A5B52 | 6.23:1 | secondary |
| `--accent` | #9A3B0C | 6.03:1 | roots, CTA, numerals |
| night block | #10281F / #E9A66F | 7.54:1 | figure band |

## Layout
- Grid: text column + sticky specimen column (≥960px); single column below, specimen after hero.
- Nav: wordmark + four bilingual anchors. Footer: sign-off with source.

## Restraint Gate record
- Concept survived: yes
- Cut: Language toggle — both languages always shown, so no state to manage
- Cut: Cursor effects — nothing in the concept needs them
- Rejected animation: Letter-by-letter headline relay — decoration; Bangla conjuncts must not be split
- Rejected animation: Parallax on the specimen — tells the user nothing
