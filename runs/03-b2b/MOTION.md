# MOTION.md: Cargoline Freight Visibility Software

How Cargoline moves. Designed for high-clarity operational utility and instant visual feedback without latency or scroll hijacking.

## Motion principles for this project
- Tier: Tier 1 (Basic CSS transitions, WAAPI, zero layout-property animation, strict prefers-reduced-motion fallback).
- Personality: Operational maritime telemetry: precise, instantaneous, stable, dispatch-grade reliability.
- Ease tokens used: `--ease-standard: cubic-bezier(0.16, 1, 0.3, 1)`, `--ease-exit: cubic-bezier(0.7, 0, 0.84, 0)`.
- What never moves: Document root scrollbars, navigation container width/position, primary heading anchors, table column boundaries.

## Motion tokens
- `--duration-instant: 100ms`: Micro-state responses (hover, active, focus-visible rings).
- `--duration-fast: 180ms`: Button state transitions, dropdown menu expansions, filter tag toggles.
- `--duration-normal: 240ms`: Tab panel switching, modal drawer transitions, milestone pulse indicators.
- `--ease-standard: cubic-bezier(0.16, 1, 0.3, 1)`: Natural deceleration curve for UI elements entering view.

## Global
| Element | Behaviour | Tier | Duration/ease | Reduced motion |
|---|---|---|---|---|
| Buttons & CTAs | Background color tint, transform translateY(-1px) | 1 | 150ms ease-out | Color shift only, no transform |
| Interactive Cards | Subtle border color illumination and shadow elevation | 1 | 200ms ease-out | Border color only |
| Dropdown Navigation | Fade and vertical slide into view | 1 | 180ms cubic-bezier(0.16, 1, 0.3, 1) | Instant display toggle |
| Form Validation | Field border shift to red and inline error slide-in | 1 | 150ms ease-out | Instant appearance |
| Filter Pills | Background and border color transition | 1 | 120ms ease-out | Instant state toggle |
| Live Telemetry Pulse | Subtle opacity glow on active radar beacon | 1 | 1800ms ease-in-out infinite | Static indicator icon |

## Signature move
- Name: Live Multi-Modal Milestone Stepper
- Trigger: Tab selection or shipment telemetry card activation on `/` and `/product`.
- Behaviour: Milestone connector lines animate progress from Origin Port to Destination Berth with precise ETA updates.
- Off-switch (touch / reduced motion): Static completed path with high-contrast text badge and zero pulsing or line transitions.

## Accessibility and Reduced Motion
All CSS transitions are wrapped in `@media (prefers-reduced-motion: no-preference)`. When `prefers-reduced-motion: reduce` is enabled:
1. All animation durations are forced to `0.001ms`.
2. All transforms, scale changes, and position shifts are eliminated.
3. Every screen element remains instantly visible in its final stable state.
4. No text or control is hidden behind animation timing.
