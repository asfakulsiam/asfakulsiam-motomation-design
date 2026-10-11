# MOTION.md: Tracewell

## Motion principles for this project
- Tier: 2 (GSAP + ScrollTrigger, no Lenis: native scroll)
- Personality (one line): a typewriter's ink strike: flat, decisive, left to right.
- Ease tokens used: `power3.out` for reveals, `none` inside the scrubbed timeline, steps() for typed commands.
- What never moves: body copy, pricing text, install commands, nav.

## Global
| Element | Behaviour | Tier | Duration/ease | Reduced motion |
|---|---|---|---|---|
| Scroll | native | — | — | native |
| Links/buttons | colour + press scale .97 | 1 | 120ms ease-out | colour only |
| Retention bars | scaleX from left when entering | 2 | 0.8s power3.out | final width |

## Chapters
### Chapter: The session  ·  length: 220% viewport (desktop ≥900px wide and ≥720px tall only)  ·  technique: pinned scrub
| Scene | Timecode | Shot / visual | Type on screen | Camera move | Transition out |
|---|---|---|---|---|---|
| 01 | 0.00–0.28 | terminal types `tracewell ingest`, three source lines appear | step 01 active | none | prompt returns |
| 02 | 0.28–0.68 | terminal types `tracewell why --since 15m`, lines are ranked, common ones struck | step 02 active | none | one line left in accent |
| 03 | 0.68–1.00 | result view appears under the terminal with the explanation and share link | step 03 active | none | unpin |

**Static fallback frames:** all three scenes stacked, in final state (phones, short screens, reduced motion).

## Signature move
- Name: Ink Strike
- Trigger: hero on load (once); the `why` output in the demo (scrubbed)
- Off-switch (touch / reduced motion): no strike animation; lines are drawn already struck, the key line already marked.
