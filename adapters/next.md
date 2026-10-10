# Next.js Adapter (App Router)

Recommended stack:
- Lenis for smooth scroll
- GSAP + @gsap/react + ScrollTrigger
- Framer Motion only for simple presence
- Three.js / React Three Fiber for Tier 4
- View Transitions API for Tier 3 when possible

Key practices:
- Put heavy animation in client components
- Use `useGSAP` for automatic cleanup
- Recreate ScrollTrigger contexts on route change
- Always ship reduced-motion fallbacks
- Keep essential content in semantic HTML, not only canvas

The thinking sequence and Restraint Gate still apply fully.