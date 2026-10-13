# MOTION.md: <Project name>

> How it moves. Written by `/shape` or `/motomate`. Timecodes are fractions of each chapter's scroll and match the timeline positions in code.

## Motion principles for this project
- Tier: 
- Personality (one line): 
- Ease tokens used: 
- What never moves: 

## Global
| Element | Behaviour | Tier | Duration/ease | Reduced motion |
|---|---|---|---|---|
| Smooth scroll | Lenis | 2 | lerp 0.1 | off (default) |
| Headings | Line Curtain | 2 | 0.9s expo.out, 0.08 stagger | instant |
| Links/buttons | | 1 | | |

## Timing sheet (required for Tier 3–5; grammar in `motion/choreography.md`)
Scrubbed rows in % of the chapter's scroll (`12–40%`); triggered rows as `@<% of the section's pass> · <ms>`. Overlap uses the grammar words: `after`, `with`, `over −n%`, `hold n%`. Camera: push, pull, truck, orbit, match cut, or `—`.

### Chapter 1: <name> · <n>vh desktop / <n>vh mobile · <dense | still> · technique <A–D>
| Beat | Range | Element | Action | Ease | Overlap | Camera | Reduced motion |
|---|---|---|---|---|---|---|---|
| 01 | 0–15% | | | none | — | — | |
| 02 | | | | | | | |
| 03 | | | | | | | |

Rhythm: <which chapters are dense / still; the breath in every run of three>

## Chapters (Motomation)
### Chapter: <name>  ·  length: <300–600>% viewport  ·  technique: <A/B/C/D>
| Scene | Timecode | Shot / visual | Type on screen | Camera move | Transition out |
|---|---|---|---|---|---|
| 01 | 0.00–0.15 | | | | |
| 02 | 0.15–0.40 | | | | |
| 03 | 0.40–0.70 | | | | |
| 04 | 0.70–1.00 | | | | |

**Static fallback frames:** 01 · 02 · 03 · 04 (images + type, stacked)
**Assets:** frames <n> desktop / <n> mobile · budget <MB> · path `/public/film/...`

## Signature move
- Name: 
- Trigger: 
- Off-switch (touch / reduced motion): 
