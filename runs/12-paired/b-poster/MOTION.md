# Leaf & Ledger · Loud poster · motion

## Selection and purpose
Tier 3 cross-document transitions are progressively enhanced across same-origin navigation. Component feedback stays Tier 1 on checkout/account; these routes have no decorative pack entrance. Named tea image continuity links the shop shelf to the corresponding tea detail.
No animation is required to use any route. Native scrolling, no pinned zones, no canvas, no loop.

| Behaviour | Where | Meaning | Technique and timing | Edges |
|---|---|---|---|---|
| Poster continuity | between same-origin documents, with named tea images on shelf/detail, with named tea images on shelf/detail | tea image remains recognizable between shelf and detail | cross-document View Transitions, 420ms ease-out | Unsupported browsers navigate normally; reduced motion instant |
| Press | all buttons | acknowledges touch | transform scale(.97), 100ms | hit area fixed; reset on release |
| Pack settle | home hero and product tiles | playful printed identity | one-off rotate/translate, 520ms ease-out | not looped; reduced still arranges three packs upright |
| Save feedback | builder, cart, management | confirms state change | text in live region, instant then 120ms fade optional | blocked storage shows error, no success claim |
| Pending | local form submit | prevents duplicate operation | disabled button with explicit saving text, 120ms local task | failure re-enables control; no network success implied |

## Four questions
Every motion has feedback, continuity or brand-feeling purpose; CSS is the cheapest tool; UI feedback stays below 250ms; fast repeated actions remain possible. No scroll effects or layout-property animation. Form content is never hidden.

## Reduced-motion design
Pack fan becomes three aligned printed origin swatches, all visible with origin labels; no rotation, travel or page transitions. This is a composed origin index, not a paused settle frame.
@media (prefers-reduced-motion: reduce) disables all animation and travel; page transitions are opt-in only under no-preference.

## Mobile
No pointer-follow effect. Full controls remain visible; hover feedback is optional and only enabled on fine pointers. 375px product stage reduces pack scale while preserving readable text outside the illustration.

## Verification boundary
Screenshots and the bounded reduced-motion/skip-link assertions ran via qa/journeys.mjs; full motion smoothness gate and CPU-throttled benchmark intentionally not run under user's CPU constraint. No performance score claimed.
