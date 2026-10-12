# Mobile Motion Matrix

Mobile is not desktop with less space. Touch has no hover, a thumb blocks the view, and batteries matter.

| Desktop effect | Mobile behaviour |
|---|---|
| Hover reveals, cursor-follow, magnetic, lens, proximity weight | **Off.** Content visible by default, or tap to reveal |
| Pixel trail / cursor canvas | Off |
| Pinned chapter (Tier 2) | Keep, with a shorter `end` (≤ 150%) |
| Motomation chapter (Tier 5) | Keep with half the frames, `end` ≤ 300%, or the static storyboard on slow connections |
| Horizontal reel | Native horizontal swipe with `scroll-snap` |
| WebGL scene | Simpler shader / lower DPR (≤ 1.5) / static fallback on low-end devices |
| Line reveals | Keep (they're cheap), shorter stagger |
| Velocity marquee | Keep, lower max speed, no skew |
| Smooth scroll (Lenis) | Lenis keeps native touch scrolling by default (`syncTouch: false`). Keep it that way |
| Page transitions | Keep, ≤ 400ms |

## Reduced motion, any device

`prefers-reduced-motion: reduce` wins over every row above, on phones and desktops alike. The fallback is a designed still (`principles/restraint.md`, "Designed stills"), not the same layout frozen.

| Effect | Reduced-motion behaviour |
|---|---|
| WebGL / 3D background (Tier 4) | Canvas not mounted. The component's designed still (SVG/CSS), composed differently from any animated frame |
| Pinned chapter, scrubbed sequence (Tier 2, 5) | Unpinned: each step in normal flow as its own plate, fully visible, no dimmed inactive steps |
| Image-sequence film (Tier 5) | The storyboard: 3–5 chosen frames as numbered plates with captions, not the first frame |
| Ambient CSS loops (beams, meteors, mesh) | The component's designed still; no Web Animations created |
| Line reveals, counters | Final state on first paint |

```js
const mm = gsap.matchMedia();
mm.add({ desktop: "(min-width: 768px) and (hover: hover)", mobile: "(max-width: 767px)",
         motion: "(prefers-reduced-motion: no-preference)" }, ({ conditions: c }) => {
  if (!c.motion) return;
  if (c.desktop) { /* full choreography */ }
  if (c.mobile)  { /* reduced choreography */ }
});
```

Respect `navigator.connection?.saveData` and serve the static storyboard when it's true.
