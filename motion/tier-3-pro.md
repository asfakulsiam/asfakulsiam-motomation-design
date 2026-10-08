# Tier 3 — Pro (Seamless Transitions + Lottie / Rive)

The site begins to feel like a native application. Page changes are continuous. Complex motion is delivered through efficient vector formats.

## Core techniques

- View Transitions API (or framework equivalents / Barba-style AJAX + morphing)
- Lottie for After Effects–exported vector animation
- Rive for interactive state-machine driven motion
- Shared element transitions between pages or views

## Rules

- Never show a blank white loading screen between pages when avoidable.
- Keep transition duration short (300–600 ms) unless the narrative requires longer.
- Lottie and Rive files must be optimised. Prefer .lottie over heavy JSON when possible.
- Provide static or reduced-motion fallbacks for every Lottie / Rive sequence.
- Shared elements should feel continuous; mismatched sizes or positions break the illusion.

## Typical patterns

- Project grid item expands into full case study
- Navigation that morphs into page content
- Product cards that become product detail pages without hard cuts
- Illustrated sequences that play on scroll or interaction
- Interactive icons and illustrations driven by Rive state machines

## Integration notes

- Prefer CSS View Transitions when browser support is acceptable and the effect is simple.
- Fall back to GSAP or framework transition systems for more complex orchestration.
- Always test the back button and deep linking.

## Escalation

If the experience requires real-time 3D, custom shaders, or full scroll-scrubbed video sequences, move to tier 4 or 5.