# Mobile Motion Reduction Matrix

This matrix defines what must survive on different devices and preference settings. Agents must follow it.

| Tier | Desktop | Tablet | Mobile | prefers-reduced-motion | Low-end device |
|------|---------|--------|--------|------------------------|----------------|
| 1 - Basic | Full | Full | Full | Instant (no transition or very short) | Full |
| 2 - Intermediate | Full | Reduced stagger | Minimal / simpler reveals | Instant or opacity only | Minimal |
| 3 - Pro | Full | Full (lighter assets) | Simplified transitions | Disabled or static morph | Disabled |
| 4 - Max (WebGL) | Full | Fallback image / light version | Disabled → static poster | Disabled → static | Disabled → static |
| 5 - Motomation | Full scrubbed experience | Reduced duration / fewer pins | Poster mode or short key moments | Poster / static keyframes | Poster / static |

## Rules
- Mobile: Prefer shorter pinned sections. Avoid long scrub sequences.
- Reduced motion: Always provide a complete static or instantly-visible version.
- Tier 4 & 5 on mobile: Prefer a beautiful static poster + optional light CSS over forcing WebGL.
- When building Tier 4 or 5, ship the reduced-motion / mobile fallback in the same component.