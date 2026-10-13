# Performance

Motion only feels premium when it is smooth. A dropped frame reads as a cheap site, whatever the idea was. Budgets are part of the design, decided before the build, not discovered after it.

## Targets (field data, mid-range phone, 4G)
- **LCP** ≤ 2.5s · **INP** ≤ 200ms · **CLS** ≤ 0.1
- 60fps on desktop for all scroll animations; 30fps or better on mid-range phones for Tier 4–5, otherwise use the fallback.
- One frame is 16.7ms at 60Hz and 8.3ms at 120Hz. The browser needs part of that for style, layout, paint and composite, so script work per frame should stay under about 6ms.

**Never claim scores you didn't measure.** If you can, run Lighthouse or check field data and report the real numbers. Otherwise say "not measured".

## JavaScript budget (gzipped, first load)
| Tier | Budget |
|---|---|
| 1 | ≤ 30KB beyond the framework |
| 2 | ≤ 80KB (gsap core ≈ 25KB, ScrollTrigger ≈ 15KB, SplitText ≈ 7KB, lenis ≈ 4KB) |
| 3 | ≤ 140KB (+ Lottie/Rive runtime, loaded when needed) |
| 4–5 | ≤ 250KB + assets loaded after first paint; Three.js imported dynamically |

## What each property costs

The browser turns a change into pixels in up to three stages. The fewer stages a property touches, the cheaper every frame is.

| Cost | Properties | Use |
|---|---|---|
| Composite only | `transform`, `opacity` | Routine motion: reveals, parallax, hovers, page transitions |
| Composite in current engines, paint in some | `clip-path` (basic shapes: `inset()`, `circle()`, `polygon()`) | When the shape change **is** the concept (an aperture opening, a wipe between chapters). Ship with the checks below |
| Paint every frame | `filter` (blur, drop-shadow), `box-shadow`, `background-position`, `mask`, gradients that move, `backdrop-filter` | Rarely, on small areas, with a measured frame time and a static fallback |
| Layout every frame | `width`, `height`, `top`, `left`, `margin`, `padding`, `font-size`, `grid-template-*` | Never animated. Use `transform: scale()` / `translate()` and the FLIP technique instead |

## Rules you can check by reading the code

Each rule names what to look for in the source, so a reviewer can pass or fail it without a browser.

**P1. Routine motion uses `transform` and `opacity`.** Look at every `transition`, `@keyframes`, `gsap.to/from`, and every `style.x =` inside a rAF or scroll handler. Anything that changes a layout property (table above) fails.
Why: layout changes force the browser to recompute the position of everything after the element, every frame.

**P2. Paint-heavy effects carry a performance check and a static fallback.** Any animated `clip-path`, `filter`, `mask`, `backdrop-filter` or moving gradient needs, next to it: (a) a size limit (the effect covers one element, not the page, or the reason it must is written down), (b) a reduced-motion path that shows the end state, and (c) a fallback that keeps the meaning when the effect is off (content visible, not clipped to nothing).
Why: paint cost scales with the painted area. A blur on a 300px card is cheap; the same blur on a 2560px hero at DPR 2 is the most common cause of jank on motion sites.

**P3. No layout reads inside a write loop.** Inside a scroll handler, rAF callback or `onUpdate`, there are no calls to `getBoundingClientRect`, `offsetTop/Width/Height`, `scrollHeight` or `getComputedStyle` after a style write in the same frame. Measure once (on mount and on resize), cache, then only write.
Why: a read after a write forces a synchronous layout, and doing it per element per frame multiplies it.

**P4. Scroll work is driven, not polled.** Scroll-linked motion uses ScrollTrigger, `IntersectionObserver`, or a single passive `scroll` listener that only schedules one rAF. Look for `addEventListener("scroll", …)` without `{ passive: true }`, or handlers that do work directly.
Why: scroll events can fire more often than frames; work belongs in the frame.

**P5. Every loop stops when it can't be seen.** Each `requestAnimationFrame` loop, canvas, WebGL context and `<video>` is paused by an `IntersectionObserver` when off-screen and by `visibilitychange` when the tab is hidden. Search for `requestAnimationFrame(`: each one needs both stop paths and a `cancelAnimationFrame` in cleanup.
Why: off-screen work is the most common hidden cost on animated sites. Users never see it but their battery does.

**P6. Canvas resolution is clamped.** `canvas.width = clientWidth * Math.min(1.5, devicePixelRatio)` or lower; coarse pointers (phones) may drop to half. Look for a bare `devicePixelRatio` multiplication.
Why: at DPR 3 a full-screen canvas has 9× the pixels of DPR 1 for an effect nobody can see that sharply.

**P7. `will-change` is temporary and rare.** It appears on at most a few elements, set when an animation starts and removed when it ends. A stylesheet rule like `* { will-change: transform }` or `will-change` on list items fails.
Why: each promoted layer costs GPU memory; too many and the page slows down instead of speeding up.

**P8. Heavy libraries load late.** Three.js, Lottie, Rive and physics are `await import()`ed when the section that needs them is near the viewport, never in the first bundle.
Why: the first paint should not wait for code that runs three screens down.

**P9. Images and fonts never shift the layout.** Every `<img>`/`<video>` has `width` and `height` (or an `aspect-ratio` box); below-the-fold images are `loading="lazy"` with `sizes`; the LCP image is preloaded with `fetchpriority="high"`; AVIF/WebP with width-based `srcset`; hero images ≤ 200KB. Fonts: preload one file at most, `font-display: swap`, subset, with metric-matched fallbacks (`size-adjust`).
Why: CLS is caused almost entirely by media without reserved space and by late font swaps.

**P10. Resize and refresh are batched.** Resize work is debounced or uses `ResizeObserver`; `ScrollTrigger.refresh()` runs once after fonts and images load, not inside every component.
Why: each refresh re-measures every trigger on the page.

## Worked example: reading a Tier 4 component

`examples/components/backgrounds/liquid-field.tsx` draws a full-bleed WebGL shader, the most expensive kind of effect in the library. Reading it against the rules:

| Rule | What the code does | Result |
|---|---|---|
| P5 | `IntersectionObserver` sets `visible`; `visibilitychange` restarts only when visible; the frame loop only re-arms when `!reduce && visible && !document.hidden`; cleanup calls `cancelAnimationFrame`, disconnects both observers | pass |
| P6 | `scale = (fine ? 1 : 0.5) * Math.min(1.5, devicePixelRatio)` | pass (half resolution on touch) |
| P2 | The canvas sits inside a span that already paints a `linear-gradient` of the same three colours, so a failed context, a lost context or reduced motion still shows the material | pass |
| P10 | `ResizeObserver` resizes the drawing buffer; no window resize listener | pass |
| P9 | `position: absolute; inset: 0` inside the parent, so the canvas never changes layout | pass |

A failing version of the same idea, the kind agents write by default:

```js
// ✗ P1, P3, P4, P6
window.addEventListener("scroll", () => {
  hero.style.height = `${100 - scrollY / 10}vh`;            // layout property, every scroll event
  const top = card.getBoundingClientRect().top;             // read after write: forced layout
  card.style.filter = `blur(${Math.max(0, top / 50)}px)`;   // full-card paint, no fallback
});
canvas.width = innerWidth * devicePixelRatio;               // 9× pixels at DPR 3
```

```js
// ✓ same intent
let cardTop = card.getBoundingClientRect().top + scrollY;  // measured once (and on resize)
let queued = false;
addEventListener("scroll", () => { if (!queued) { queued = true; requestAnimationFrame(frame); } }, { passive: true });
function frame() {
  queued = false;
  hero.style.transform = `scale(${1 - Math.min(scrollY, 400) / 4000})`;  // composite only
  card.style.opacity = String(Math.min(1, Math.max(0, 1 - (cardTop - scrollY) / innerHeight))); // fade, not blur
}
canvas.width = canvas.clientWidth * Math.min(1.5, devicePixelRatio);
```

Reading alone catches all four failures. The Delivery Gate measures the result in a browser; these rules are what you check before it runs.

## The twenty-item checklist

Loaded on every build and redesign (SKILL.md), next to `craft/copy.md`, `craft/seo.md` and the security checklist. Tags:
**[FE]** frontend, **[BE]** backend, **[IN]** infrastructure, **[H]** a human records it. Items marked **gate P** are
measured on every page by `scripts/gate.mjs` (axis P, gate/4); the rest are ticked in `gates/delivery-gate.md`
"Performance" with the file, config or measurement that proves them. A static page with no backend writes "n/a (no
backend)" for the [BE] items, never a tick.

| ID | Tag | Item | How it is decided |
|---|---|---|---|
| perf-01 | [FE] | Images compressed; AVIF or WebP, with a fallback where needed | **gate P**: a raster `<img>` (JPEG, PNG, GIF) with no AVIF/WebP `<source>` fails |
| perf-02 | [FE] | Below-the-fold images use `loading="lazy"` | **gate P**: an `<img>` whose top is below the first 1440 × 900 screen without `loading="lazy"` fails |
| perf-03 | [FE] | The LCP image is not lazy-loaded | **gate P**: the largest image in the first screen with `loading="lazy"` fails |
| perf-04 | [FE] | Code-split: no single script over the tier's budget | **gate P**: total gzipped JS over the tier budget above fails; no tier known → the Tier 4–5 budget |
| perf-05 | [FE] | API responses cached (SWR, React Query, or `Cache-Control`) | read the data layer; "n/a (no API)" on a static page |
| perf-06 | [FE] | A CDN fronts static assets | the deploy target (Pages, Vercel, Netlify, Cloudflare) or the CDN config |
| perf-07 | [FE] | JS and CSS minified in production | **gate P** warns when a script over 2 KB looks unminified (long comments, short lines); the build config decides |
| perf-08 | [FE] | No extra re-renders (memo only where the profiler showed a cost) | React Profiler, recorded when used; never `memo` everything by default |
| perf-09 | [FE] | Input handlers debounced (search, resize) | read the handlers; `requestAnimationFrame` or a debounce on every resize/scroll/input listener |
| perf-10 | [FE] | Large lists paginated or virtualised | any list over ~100 items |
| perf-11 | [FE] | Unused packages and dead scripts removed | **gate P**: an inline `<script>` with no code (empty or comments only) fails; packages: `npx depcheck` or reading `package.json` |
| perf-12 | [FE] | Non-critical scripts deferred (analytics, chat) | **gate P**: an external classic `<script>` in `<head>` without `defer`, `async` or `type="module"` fails |
| perf-13 | [FE] | Loading skeletons for async content | read the async views; a skeleton sized like the final content (no layout shift) |
| perf-14 | [IN] | A load balancer when traffic justifies one, and the reason written down | hosting notes |
| perf-15 | [BE] | API payloads trimmed to what the client uses | read the handlers or the GraphQL selection |
| perf-16 | [BE] | Database connections pooled | the DB client config |
| perf-17 | [BE] | Costly query results cached (Redis or in-memory) | the cache layer, with its invalidation rule |
| perf-18 | [BE] | N+1 queries fixed | query log on the slowest route |
| perf-19 | [BE] | Server-side caching on expensive routes | response headers or the framework's route cache |
| perf-20 | [H] | A Lighthouse run recorded with its real numbers | the report file, or "not measured"; never a number from memory |

Each failing gate P item adds one to the P count in the stamp (`rules: C0 S0 P0 K0`); the page passes P at 0.
