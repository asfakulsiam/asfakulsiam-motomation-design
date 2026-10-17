# MOTION.md: Tannery Row Coffee

> How it moves. Tier 1: CSS only, no motion library. Nothing moves before the visitor has the facts.

## Motion principles for this project
- Tier: 1 (dials ENERGY 1 · RHYTHM 2 · MOTION 1; collide.mjs suggested tier 2, lowered because the brief puts hours and menu first)
- Personality (one line): a steady hand at the counter: one rule drawn, one cup poured, nothing else performs
- Ease tokens used: `--ease-out` cubic-bezier(0.22, 1, 0.36, 1)
- What never moves: the hours table, the address, the open/closed line, prices, photographs, page sections on scroll

## Global
| Element | Behaviour | Tier | Duration/ease | Reduced motion |
|---|---|---|---|---|
| Masthead double rule | draws left to right once on load (`rule-draw`, transform scaleX) | 1 | 700ms `--ease-out` | instant (1ms) |
| Nav links | underline grows under the hovered or current link (background-size) | 1 | 160ms `--ease-out` | instant |
| Buttons | ink to red background on hover | 1 | 160ms | instant |
| Drink rows | tint on hover; the chosen row inverts to ink | 1 | 160ms | instant |
| Headings, sections | no entrance animation | — | — | — |

## Signature move
- Name: Cup cross-section ("the pour")
- Trigger: choosing a drink at the espresso or brew station (click, tap, Enter or Space on its button, or a `#drink-id` link). Each layer grows from the bottom of the glass (transform scaleY), 220ms `--ease-out`, the next layer 40ms later, so a three-layer drink is drawn in 300ms
- Off-switch (touch / reduced motion): touch keeps it (it is feedback for a tap, not a hover effect); `prefers-reduced-motion: reduce` shows the finished cup at once. The layers and their volumes are also a text list beside the cup, so nothing depends on seeing the motion
