# Tier 2 — Intermediate (GSAP + ScrollTrigger + Lenis)

DOM elements respond to scroll position and user interaction with precise choreography.

## Core tools

- GSAP for timelines and high-performance animation
- ScrollTrigger for scroll-linked behaviour
- Lenis (or equivalent) for smooth scrolling feel
- Optional: SplitText or similar for advanced text reveals

## Rules

- Animate only transform and opacity whenever possible.
- Use scrub: true (or a small number) for scroll-linked sequences so motion feels tied to the user’s hand.
- Pin sections only when the content benefits from a longer dwell time.
- Stagger reveals carefully; too much staggered text becomes predictable.
- Always clean up ScrollTriggers and GSAP contexts on unmount or page change.
- Respect prefers-reduced-motion: disable scrub and complex timelines, fall back to static or simple fades.

## Typical patterns

- Text and image reveals as sections enter the viewport
- Horizontal scroll sections
- Progress indicators tied to scroll
- Parallax layers with different speeds
- Sticky elements that transform as the user scrolls past
- Magnetic or follow-cursor effects on selected interactive items

## Performance notes

- Prefer will-change sparingly and only on elements that will animate.
- Batch DOM reads and writes.
- Avoid animating large numbers of individual characters unless necessary.
- Test on mid-range mobile devices.

## When to escalate

If the experience needs seamless page morphs, complex vector animation, or real 3D, move to tier 3 or higher. Tier 2 is for refined DOM storytelling.