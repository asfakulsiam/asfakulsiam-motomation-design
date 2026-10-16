# Diversity arm: similarity matrix at two viewports (2026-10-16)

The tool (scripts/originality.mjs) now opens every build at 1440×900 and 375×812, and by default scores each axis
as the worse of the two (`--viewport` picks others). The same five builds were measured again, with no rebuilds.

**Do the numbers change?** At 1440×900 they do not: every cell equals matrix.md. At 375×812:
- composition moves on all 10 pairs (the largest change is funeral × metal, 0.06 → 0.27: at 375 both collapse to one column);
- typography moves on 9 of 10 (the largest is metal × water, 0.15 → 0.31);
- signature moves on 6 of 10 (funeral × dentistry, 0.17 → 0.00);
- structure moves on one pair (funeral × dentistry, 0.20 → 0.16);
- image and interaction do not change.

No pair crosses 0.4 at 375 that did not at 1440, and none drops below. The verdict is unchanged: **FAIL, 5 of 10
pairs repeat on at least one axis** (the same five pairs on the same axes: interaction ×3, image ×1, typography ×1).

## 1440×900

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

Result: FAIL, 5 of 10 pairs repeat.

## 375×812

| Pair | structure | composition | image | typography | interaction | signature | overall |
|---|---:|---:|---:|---:|---:|---:|---:|
| funeral-home × childrens-dentistry | 0.16 | 0.24 | 0.00 | 0.35 | 0.27 | 0.00 | 0.17 |
| funeral-home × hardcore-metal-band | 0.01 | 0.27 | 0.00 | 0.10 | 0.41 ✗ | 0.17 | 0.16 |
| funeral-home × luxury-perfume | 0.12 | 0.11 | 0.00 | 0.26 | 0.54 ✗ | 0.09 | 0.19 |
| funeral-home × municipal-water-authority | 0.10 | 0.21 | n/a | 0.24 | 0.35 | 0.10 | 0.20 |
| childrens-dentistry × hardcore-metal-band | 0.03 | 0.14 | 0.00 | 0.21 | 0.31 | 0.00 | 0.12 |
| childrens-dentistry × luxury-perfume | 0.03 | 0.14 | 0.67 ✗ | 0.25 | 0.20 | 0.00 | 0.22 |
| childrens-dentistry × municipal-water-authority | 0.04 | 0.22 | 0.00 | 0.43 ✗ | 0.30 | 0.00 | 0.17 |
| hardcore-metal-band × luxury-perfume | 0.16 | 0.08 | 0.00 | 0.16 | 0.56 ✗ | 0.11 | 0.18 |
| hardcore-metal-band × municipal-water-authority | 0.01 | 0.12 | 0.00 | 0.31 | 0.34 | 0.21 | 0.17 |
| luxury-perfume × municipal-water-authority | 0.07 | 0.07 | 0.00 | 0.27 | 0.38 | 0.11 | 0.15 |

Result: FAIL, 5 of 10 pairs repeat.

## both (worst of the two, per axis)

| Pair | structure | composition | image | typography | interaction | signature | overall |
|---|---:|---:|---:|---:|---:|---:|---:|
| funeral-home × childrens-dentistry | 0.20 | 0.24 | 0.00 | 0.35 | 0.27 | 0.17 | 0.18 |
| funeral-home × hardcore-metal-band | 0.01 | 0.27 | 0.00 | 0.10 | 0.41 ✗ | 0.17 | 0.16 |
| funeral-home × luxury-perfume | 0.12 | 0.11 | 0.00 | 0.26 | 0.54 ✗ | 0.09 | 0.19 |
| funeral-home × municipal-water-authority | 0.10 | 0.26 | n/a | 0.33 | 0.35 | 0.10 | 0.23 |
| childrens-dentistry × hardcore-metal-band | 0.03 | 0.16 | 0.00 | 0.21 | 0.31 | 0.13 | 0.13 |
| childrens-dentistry × luxury-perfume | 0.03 | 0.14 | 0.67 ✗ | 0.25 | 0.20 | 0.00 | 0.22 |
| childrens-dentistry × municipal-water-authority | 0.04 | 0.36 | 0.00 | 0.43 ✗ | 0.30 | 0.06 | 0.20 |
| hardcore-metal-band × luxury-perfume | 0.16 | 0.08 | 0.00 | 0.16 | 0.56 ✗ | 0.11 | 0.18 |
| hardcore-metal-band × municipal-water-authority | 0.01 | 0.12 | 0.00 | 0.31 | 0.34 | 0.21 | 0.17 |
| luxury-perfume × municipal-water-authority | 0.07 | 0.07 | 0.00 | 0.27 | 0.38 | 0.11 | 0.15 |

Result: FAIL, 5 of 10 pairs repeat.

