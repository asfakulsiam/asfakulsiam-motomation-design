# Tier 1 — Basic (CSS Micro-Interactions)

The foundation. Every interactive element should feel responsive and intentional.

## Allowed techniques

- CSS transitions on transform and opacity
- Simple @keyframes for loops or state changes
- Hover, focus, active, and checked states
- Subtle scale, translate, and fade

## Rules

- Prefer transform and opacity only. Never animate width, height, top, left, margin, or padding for performance reasons.
- Duration: 150–300 ms for most micro-interactions. Longer only for more significant state changes.
- Easing: ease-out for entering elements, ease-in for exiting, or carefully chosen cubic-bezier.
- Provide reduced-motion alternatives: transition: none or shorter durations under prefers-reduced-motion.

## Typical uses

- Button hover and press states
- Link underlines that grow
- Card lift on hover
- Form field focus rings
- Toggle and checkbox animations
- Loading spinners or subtle progress indicators

## Anti-patterns

- Animating everything on page load
- Long, floating animations that delay interaction
- Bounce or elastic effects on primary actions (use sparingly)
- Motion that continues after the user has finished interacting

## Example mindset

A button should feel like it responds to the user’s finger or cursor. The feedback is immediate, subtle, and satisfying. That is the entire goal of tier 1.