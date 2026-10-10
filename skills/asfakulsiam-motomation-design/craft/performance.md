# Performance

Motion only feels premium when it is smooth. Budgets are part of the design.

## Targets (field data, mid-range phone, 4G)
- **LCP** ≤ 2.5s · **INP** ≤ 200ms · **CLS** ≤ 0.1
- 60fps on desktop for all scroll animations; 30fps or better on mid-range phones for Tier 4–5, otherwise use the fallback.

**Never claim scores you didn't measure.** If you can, run Lighthouse or check field data and report the real numbers. Otherwise say "not measured".

## JavaScript budget (gzipped, first load)
| Tier | Budget |
|---|---|
| 1 | ≤ 30KB beyond the framework |
| 2 | ≤ 80KB (gsap core ≈ 25KB, ScrollTrigger ≈ 15KB, SplitText ≈ 7KB, lenis ≈ 4KB) |
| 3 | ≤ 140KB (+ Lottie/Rive runtime, loaded when needed) |
| 4–5 | ≤ 250KB + assets loaded after first paint; Three.js imported dynamically |

## Rules
- Animate only `transform`, `opacity`, `clip-path`, and occasionally `filter`. Never animate layout properties.
- `will-change` only during the animation, then remove it.
- Lazy-load below-the-fold images (`loading="lazy"`, with `sizes`). Preload the LCP image with `fetchpriority="high"`.
- AVIF/WebP with width-based `srcset`. Hero images ≤ 200KB.
- Dynamically import heavy libraries: `const THREE = await import("three")`.
- Pause every rAF loop, canvas and video when off-screen (`IntersectionObserver`) or when the tab is hidden (`visibilitychange`). Off-screen work is the most common hidden cost on animated sites.
- Debounce resize work; call `ScrollTrigger.refresh()` once after fonts and images load.
- Fonts: preload one file at most, use `font-display: swap`, subset, and use metric-matched fallbacks.
