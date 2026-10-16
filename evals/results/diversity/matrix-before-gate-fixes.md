# Diversity arm: similarity matrix

Five unrelated briefs (evals/briefs/diversity/), one build each, compared by scripts/originality.mjs at 1440×900 on six axes. 0 = nothing shared, 1 = the same. Every axis of every pair must stay below 0.4; ✗ marks a repeat. Written by `node evals/diversity.mjs`.

## Measured

Tool: scripts/originality.mjs (35s). Result: FAIL, 7 of 10 pairs repeat on at least one axis.

| Pair | structure | composition | image | typography | interaction | signature | overall |
|---|---:|---:|---:|---:|---:|---:|---:|
| funeral-home × childrens-dentistry | 0.18 | 0.18 | 0.00 | 0.45 ✗ | 0.58 ✗ | 0.17 | 0.26 |
| funeral-home × hardcore-metal-band | 0.01 | 0.11 | 0.00 | 0.08 | 0.47 ✗ | 0.10 | 0.13 |
| funeral-home × luxury-perfume | 0.12 | 0.08 | 0.00 | 0.18 | 0.51 ✗ | 0.04 | 0.16 |
| funeral-home × municipal-water-authority | 0.21 | 0.23 | 1.00 ✗ | 0.37 | 0.35 | 0.10 | 0.38 |
| childrens-dentistry × hardcore-metal-band | 0.03 | 0.18 | 0.00 | 0.10 | 0.52 ✗ | 0.13 | 0.16 |
| childrens-dentistry × luxury-perfume | 0.05 | 0.04 | 0.67 ✗ | 0.16 | 0.38 | 0.00 | 0.22 |
| childrens-dentistry × municipal-water-authority | 0.06 | 0.29 | 0.00 | 0.37 | 0.35 | 0.06 | 0.19 |
| hardcore-metal-band × luxury-perfume | 0.16 | 0.04 | 0.00 | 0.08 | 0.62 ✗ | 0.05 | 0.16 |
| hardcore-metal-band × municipal-water-authority | 0.01 | 0.04 | 0.00 | 0.12 | 0.36 | 0.13 | 0.11 |
| luxury-perfume × municipal-water-authority | 0.07 | 0.06 | 0.00 | 0.26 | 0.33 | 0.11 | 0.14 |

Per axis, the five builds against each other (rows × columns):

**structure** (max 0.21)

| | funeral-home | childrens-dentistry | hardcore-metal-band | luxury-perfume | municipal-water-authority |
|---|---:|---:|---:|---:|---:|
| funeral-home | 1.00 | 0.18 | 0.01 | 0.12 | 0.21 |
| childrens-dentistry | 0.18 | 1.00 | 0.03 | 0.05 | 0.06 |
| hardcore-metal-band | 0.01 | 0.03 | 1.00 | 0.16 | 0.01 |
| luxury-perfume | 0.12 | 0.05 | 0.16 | 1.00 | 0.07 |
| municipal-water-authority | 0.21 | 0.06 | 0.01 | 0.07 | 1.00 |

**composition** (max 0.29)

| | funeral-home | childrens-dentistry | hardcore-metal-band | luxury-perfume | municipal-water-authority |
|---|---:|---:|---:|---:|---:|
| funeral-home | 1.00 | 0.18 | 0.11 | 0.08 | 0.23 |
| childrens-dentistry | 0.18 | 1.00 | 0.18 | 0.04 | 0.29 |
| hardcore-metal-band | 0.11 | 0.18 | 1.00 | 0.04 | 0.04 |
| luxury-perfume | 0.08 | 0.04 | 0.04 | 1.00 | 0.06 |
| municipal-water-authority | 0.23 | 0.29 | 0.04 | 0.06 | 1.00 |

**image** (max 1.00)

| | funeral-home | childrens-dentistry | hardcore-metal-band | luxury-perfume | municipal-water-authority |
|---|---:|---:|---:|---:|---:|
| funeral-home | 1.00 | 0.00 | 0.00 | 0.00 | 1.00 ✗ |
| childrens-dentistry | 0.00 | 1.00 | 0.00 | 0.67 ✗ | 0.00 |
| hardcore-metal-band | 0.00 | 0.00 | 1.00 | 0.00 | 0.00 |
| luxury-perfume | 0.00 | 0.67 ✗ | 0.00 | 1.00 | 0.00 |
| municipal-water-authority | 1.00 ✗ | 0.00 | 0.00 | 0.00 | 1.00 |

**typography** (max 0.45)

| | funeral-home | childrens-dentistry | hardcore-metal-band | luxury-perfume | municipal-water-authority |
|---|---:|---:|---:|---:|---:|
| funeral-home | 1.00 | 0.45 ✗ | 0.08 | 0.18 | 0.37 |
| childrens-dentistry | 0.45 ✗ | 1.00 | 0.10 | 0.16 | 0.37 |
| hardcore-metal-band | 0.08 | 0.10 | 1.00 | 0.08 | 0.12 |
| luxury-perfume | 0.18 | 0.16 | 0.08 | 1.00 | 0.26 |
| municipal-water-authority | 0.37 | 0.37 | 0.12 | 0.26 | 1.00 |

**interaction** (max 0.62)

| | funeral-home | childrens-dentistry | hardcore-metal-band | luxury-perfume | municipal-water-authority |
|---|---:|---:|---:|---:|---:|
| funeral-home | 1.00 | 0.58 ✗ | 0.47 ✗ | 0.51 ✗ | 0.35 |
| childrens-dentistry | 0.58 ✗ | 1.00 | 0.52 ✗ | 0.38 | 0.35 |
| hardcore-metal-band | 0.47 ✗ | 0.52 ✗ | 1.00 | 0.62 ✗ | 0.36 |
| luxury-perfume | 0.51 ✗ | 0.38 | 0.62 ✗ | 1.00 | 0.33 |
| municipal-water-authority | 0.35 | 0.35 | 0.36 | 0.33 | 1.00 |

**signature** (max 0.17)

| | funeral-home | childrens-dentistry | hardcore-metal-band | luxury-perfume | municipal-water-authority |
|---|---:|---:|---:|---:|---:|
| funeral-home | 1.00 | 0.17 | 0.10 | 0.04 | 0.10 |
| childrens-dentistry | 0.17 | 1.00 | 0.13 | 0.00 | 0.06 |
| hardcore-metal-band | 0.10 | 0.13 | 1.00 | 0.05 | 0.13 |
| luxury-perfume | 0.04 | 0.00 | 0.05 | 1.00 | 0.11 |
| municipal-water-authority | 0.10 | 0.06 | 0.13 | 0.11 | 1.00 |

**overall** (max 0.38)

| | funeral-home | childrens-dentistry | hardcore-metal-band | luxury-perfume | municipal-water-authority |
|---|---:|---:|---:|---:|---:|
| funeral-home | 1.00 | 0.26 | 0.13 | 0.16 | 0.38 |
| childrens-dentistry | 0.26 | 1.00 | 0.16 | 0.22 | 0.19 |
| hardcore-metal-band | 0.13 | 0.16 | 1.00 | 0.16 | 0.11 |
| luxury-perfume | 0.16 | 0.22 | 0.16 | 1.00 | 0.14 |
| municipal-water-authority | 0.38 | 0.19 | 0.11 | 0.14 | 1.00 |

## Judged

none in this file: it is measurement only. The judged reading of these numbers, where the system avoids repetition and where it fails, is REPORT.md.

## Not verified

none
