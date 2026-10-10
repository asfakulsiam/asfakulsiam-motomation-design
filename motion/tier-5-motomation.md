# Tier 5 — Motomation

**Definition**  
Motomation is purposeful scroll-scrubbed motion that turns the page into a directed film. The scroll position acts as a playhead. Content is revealed, transformed, and sequenced with intention.

## When to use
- The experience is meant to feel cinematic
- Storytelling is more important than pure utility
- The brand personality benefits from expressive motion
- There is time to implement proper fallbacks

## Core techniques
- Scroll-scrubbed timelines (GSAP ScrollTrigger with `scrub`)
- Pinned sections that hold the user while a sequence plays
- Progressive storytelling (overview first → deeper content)
- Coordinated typography + media + annotation
- Optional WebGL / canvas layer for high-impact moments

## Hard rules
1. Progress is king — animation state must stay in sync with scroll position (including reverse scrolling).
2. Pin with purpose — only pin when it clarifies a sequence.
3. Content must remain accessible — never hide essential information exclusively inside canvas or animation.
4. Always ship a reduced-motion and mobile fallback (usually a beautiful static poster or simplified sequence).
5. Clean up all timelines, listeners, and GPU resources on unmount / route change.
6. Prefer transform and opacity. Profile heavier effects.

## Signature test
If the user can put down the mouse and the page still feels like a finished film, the Motomation is working.

## Performance & accessibility
- Lazy-load heavy assets
- Pause offscreen rendering when possible
- Honor `prefers-reduced-motion`
- Test on real mobile devices
- Never use Tier 5 only to look technically impressive

## Relationship to lower tiers
Tier 5 sits on top of solid Tier 1–3 foundations. Micro-interactions, entrance choreography, and page transitions still matter.