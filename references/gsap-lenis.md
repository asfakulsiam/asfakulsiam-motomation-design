# GSAP + Lenis — Recommended Stack

These two libraries form the technical foundation of Tier 2–5 in this skill.

## GSAP (GreenSock)
- Official repo: https://github.com/greensock/GSAP
- Core tool for timelines, tweens, and ScrollTrigger
- Use `@gsap/react` and the `useGSAP` hook in React/Next.js for automatic cleanup
- Always register plugins: `gsap.registerPlugin(ScrollTrigger)`
- Prefer `scrub` for Motomation-style scroll-driven sequences
- Use `clamp()` on start/end values when needed
- Clean up all ScrollTriggers and timelines on unmount / route change

## Lenis
- Official repo: https://github.com/darkroomengineering/lenis
- Best modern smooth-scroll library
- Lightweight, accessible, works with native scroll
- Perfect companion for GSAP ScrollTrigger
- Respects `prefers-reduced-motion`
- Has official React adapter

## Recommended pairing pattern
1. Initialize Lenis for smooth scrolling
2. Update ScrollTrigger on Lenis scroll events
3. Build scrubbed or triggered animations with GSAP
4. Always provide a reduced-motion path that disables Lenis smoothing and complex timelines

This combination is the current industry standard for high-end scroll experiences.