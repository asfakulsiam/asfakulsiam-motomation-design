# Leaf & Ledger · Quiet archival · motion

## Selection and purpose
Tier 1 throughout.
No animation is required to use any route. Native scrolling, no pinned zones, no canvas, no loop.

| Behaviour | Where | Meaning | Technique and timing | Edges |
|---|---|---|---|---|
| Ink response | links and main buttons | which element is actionable | CSS opacity 160ms ease-out | Unsupported browsers navigate normally; reduced motion instant |
| Press | all buttons | acknowledges touch | ink-opacity response, 100ms | hit area fixed; reset on release |
| Focus ink | keyboard focus | current control | instant 3px outline | no motion |
| Save feedback | builder, cart, management | confirms state change | text in live region, instant then 120ms fade optional | blocked storage shows error, no success claim |
| Pending | local form submit | prevents duplicate operation | disabled button with explicit saving text, 120ms local task | failure re-enables control; no network success implied |

## Four questions
Every motion has feedback, continuity or brand-feeling purpose; CSS is the cheapest tool; UI feedback stays below 250ms; fast repeated actions remain possible. No scroll effects or layout-property animation. Form content is never hidden.

## Reduced-motion design
Everything remains in natural document flow. No entrance obscures text; focus is instantaneous.
@media (prefers-reduced-motion: reduce) disables all animation and travel; page transitions are opt-in only under no-preference.

## Mobile
No pointer-follow effect. Full controls remain visible; hover feedback is optional and only enabled on fine pointers. 375px specimen plates fit the content column; purchase controls precede the plate in the mobile reading order.

## Verification boundary
Screenshots and the bounded reduced-motion/skip-link assertions ran via qa/journeys.mjs; full motion smoothness gate and CPU-throttled benchmark intentionally not run under user's CPU constraint. No performance score claimed.
