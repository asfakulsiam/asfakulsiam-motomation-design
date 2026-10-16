# Diversity arm: similarity matrix

Five unrelated briefs (evals/briefs/diversity/), one build each, compared by scripts/originality.mjs at 1440×900 on six axes. 0 = nothing shared, 1 = the same. Every axis of every pair must stay below 0.4; ✗ marks a repeat. Written by `node evals/diversity.mjs`.

## Measured

Tool: scripts/originality.mjs (35s). Result: FAIL, 5 of 10 pairs repeat on at least one axis.

| Pair | structure | composition | image | typography | interaction | signature | overall |
|---|---:|---:|---:|---:|---:|---:|---:|
| funeral-home × childrens-dentistry | 0.20 | 0.09 | 0.00 | 0.33 | 0.27 | 0.17 | 0.18 |
| funeral-home × hardcore-metal-band | 0.01 | 0.06 | 0.00 | 0.06 | 0.41 ✗ | 0.10 | 0.11 |
| funeral-home × luxury-perfume | 0.12 | 0.10 | 0.00 | 0.21 | 0.54 ✗ | 0.09 | 0.18 |
| funeral-home × municipal-water-authority | 0.10 | 0.26 | n/a | 0.33 | 0.35 | 0.10 | 0.23 |
| childrens-dentistry × hardcore-metal-band | 0.03 | 0.16 | 0.00 | 0.14 | 0.31 | 0.13 | 0.13 |
| childrens-dentistry × luxury-perfume | 0.03 | 0.04 | 0.67 ✗ | 0.17 | 0.20 | 0.00 | 0.19 |
| childrens-dentistry × municipal-water-authority | 0.04 | 0.36 | 0.00 | 0.43 ✗ | 0.30 | 0.06 | 0.20 |
| hardcore-metal-band × luxury-perfume | 0.16 | 0.04 | 0.00 | 0.05 | 0.56 ✗ | 0.05 | 0.14 |
| hardcore-metal-band × municipal-water-authority | 0.01 | 0.09 | 0.00 | 0.15 | 0.34 | 0.13 | 0.12 |
| luxury-perfume × municipal-water-authority | 0.07 | 0.03 | 0.00 | 0.26 | 0.38 | 0.11 | 0.14 |

Per axis, the five builds against each other (rows × columns):

**structure** (max 0.20)

| | funeral-home | childrens-dentistry | hardcore-metal-band | luxury-perfume | municipal-water-authority |
|---|---:|---:|---:|---:|---:|
| funeral-home | 1.00 | 0.20 | 0.01 | 0.12 | 0.10 |
| childrens-dentistry | 0.20 | 1.00 | 0.03 | 0.03 | 0.04 |
| hardcore-metal-band | 0.01 | 0.03 | 1.00 | 0.16 | 0.01 |
| luxury-perfume | 0.12 | 0.03 | 0.16 | 1.00 | 0.07 |
| municipal-water-authority | 0.10 | 0.04 | 0.01 | 0.07 | 1.00 |

**composition** (max 0.36)

| | funeral-home | childrens-dentistry | hardcore-metal-band | luxury-perfume | municipal-water-authority |
|---|---:|---:|---:|---:|---:|
| funeral-home | 1.00 | 0.09 | 0.06 | 0.10 | 0.26 |
| childrens-dentistry | 0.09 | 1.00 | 0.16 | 0.04 | 0.36 |
| hardcore-metal-band | 0.06 | 0.16 | 1.00 | 0.04 | 0.09 |
| luxury-perfume | 0.10 | 0.04 | 0.04 | 1.00 | 0.03 |
| municipal-water-authority | 0.26 | 0.36 | 0.09 | 0.03 | 1.00 |

**image** (max 0.67)

| | funeral-home | childrens-dentistry | hardcore-metal-band | luxury-perfume | municipal-water-authority |
|---|---:|---:|---:|---:|---:|
| funeral-home | 1.00 | 0.00 | 0.00 | 0.00 | n/a |
| childrens-dentistry | 0.00 | 1.00 | 0.00 | 0.67 ✗ | 0.00 |
| hardcore-metal-band | 0.00 | 0.00 | 1.00 | 0.00 | 0.00 |
| luxury-perfume | 0.00 | 0.67 ✗ | 0.00 | 1.00 | 0.00 |
| municipal-water-authority | n/a | 0.00 | 0.00 | 0.00 | 1.00 |

**typography** (max 0.43)

| | funeral-home | childrens-dentistry | hardcore-metal-band | luxury-perfume | municipal-water-authority |
|---|---:|---:|---:|---:|---:|
| funeral-home | 1.00 | 0.33 | 0.06 | 0.21 | 0.33 |
| childrens-dentistry | 0.33 | 1.00 | 0.14 | 0.17 | 0.43 ✗ |
| hardcore-metal-band | 0.06 | 0.14 | 1.00 | 0.05 | 0.15 |
| luxury-perfume | 0.21 | 0.17 | 0.05 | 1.00 | 0.26 |
| municipal-water-authority | 0.33 | 0.43 ✗ | 0.15 | 0.26 | 1.00 |

**interaction** (max 0.56)

| | funeral-home | childrens-dentistry | hardcore-metal-band | luxury-perfume | municipal-water-authority |
|---|---:|---:|---:|---:|---:|
| funeral-home | 1.00 | 0.27 | 0.41 ✗ | 0.54 ✗ | 0.35 |
| childrens-dentistry | 0.27 | 1.00 | 0.31 | 0.20 | 0.30 |
| hardcore-metal-band | 0.41 ✗ | 0.31 | 1.00 | 0.56 ✗ | 0.34 |
| luxury-perfume | 0.54 ✗ | 0.20 | 0.56 ✗ | 1.00 | 0.38 |
| municipal-water-authority | 0.35 | 0.30 | 0.34 | 0.38 | 1.00 |

**signature** (max 0.17)

| | funeral-home | childrens-dentistry | hardcore-metal-band | luxury-perfume | municipal-water-authority |
|---|---:|---:|---:|---:|---:|
| funeral-home | 1.00 | 0.17 | 0.10 | 0.09 | 0.10 |
| childrens-dentistry | 0.17 | 1.00 | 0.13 | 0.00 | 0.06 |
| hardcore-metal-band | 0.10 | 0.13 | 1.00 | 0.05 | 0.13 |
| luxury-perfume | 0.09 | 0.00 | 0.05 | 1.00 | 0.11 |
| municipal-water-authority | 0.10 | 0.06 | 0.13 | 0.11 | 1.00 |

**overall** (max 0.23)

| | funeral-home | childrens-dentistry | hardcore-metal-band | luxury-perfume | municipal-water-authority |
|---|---:|---:|---:|---:|---:|
| funeral-home | 1.00 | 0.18 | 0.11 | 0.18 | 0.23 |
| childrens-dentistry | 0.18 | 1.00 | 0.13 | 0.19 | 0.20 |
| hardcore-metal-band | 0.11 | 0.13 | 1.00 | 0.14 | 0.12 |
| luxury-perfume | 0.18 | 0.19 | 0.14 | 1.00 | 0.14 |
| municipal-water-authority | 0.23 | 0.20 | 0.12 | 0.14 | 1.00 |

## Judged

none in this file: it is measurement only. The judged reading of these numbers, where the system avoids repetition and where it fails, is REPORT.md.

## Not verified

none
