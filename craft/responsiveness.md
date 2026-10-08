# Responsiveness & Fluid Design

## Principles

- Design the experience, not the breakpoints.
- Prefer fluid type, spacing, and layout (clamp, container queries, relative units) over a rigid set of media queries.
- Mobile is not a shrunk desktop. Hierarchy, touch targets, and breathing room must be reconsidered.
- Test on real devices. Emulators miss scroll performance, safe areas, and touch feel.

## Practical rules

- Minimum touch target 44 × 44 px.
- Respect safe-area-inset for notched devices.
- Avoid hover-only interactions as the sole way to reveal important content.
- On small screens, prefer vertical rhythm and clear section separation over complex multi-column layouts.
- Large type scales should still feel intentional on mobile; do not simply shrink everything.

## Container queries

Use container queries for components that must adapt to their available space rather than the viewport. This produces more resilient design systems.

## Performance on mobile

Heavy motion (tier 4–5) must degrade gracefully. Detect low-power or reduced-motion preferences and simplify. A beautiful static experience is better than a janky cinematic one.