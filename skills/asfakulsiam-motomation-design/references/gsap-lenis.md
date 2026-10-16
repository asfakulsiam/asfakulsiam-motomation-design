# GSAP + Lenis Quick Reference

> **Dependency check (`craft/stack.md`, checked 2026-10-16):** `gsap` 3.15.0 fails check 1 (last release 2026-04-13, more than 6 months) and check 5 (GSAP Standard "no charge" licence, not MIT/Apache/ISC/BSD). Use GSAP only when the brief names it; otherwise the same technique is built with Motion, anime.js or the platform (CSS scroll-driven animations, WAAPI). Re-run the checks at build time.

## Imports
```js
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);
```

## ScrollTrigger options you'll use most
| Option | Typical |
|---|---|
| `start` / `end` | `"top 80%"`, `"top top"`, `"+=300%"`, `() => "+=" + el.offsetWidth` |
| `scrub` | `true` (exact) or `0.5–1.5` (weight) |
| `pin` | `true`; add `anticipatePin: 1` for fast scrollers |
| `once` | `true` for reveals that shouldn't replay |
| `toggleActions` | `"play none none reverse"` for non-scrubbed reveals |
| `invalidateOnRefresh` | `true` when values are functions of layout |
| `containerAnimation` | animate items inside a horizontal pinned track |

## Lifecycle
- React: `useGSAP` with `{ scope }`; everything is reverted on unmount.
- Vanilla: `const ctx = gsap.context(() => {...}, root); ctx.revert();`
- Responsive and reduced motion: `gsap.matchMedia()`, which reverts automatically when queries change.
- After fonts/images: `document.fonts.ready.then(() => ScrollTrigger.refresh())`.

## Lenis
```js
const lenis = new Lenis({ autoRaf: false, lerp: 0.1 });    // smaller lerp = smoother and slower
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
// anchor links: lenis.scrollTo("#section", { offset: -80 })
// stop during modals: lenis.stop(); lenis.start();
```
Lenis respects `prefers-reduced-motion` by default and keeps native touch scrolling unless you set `syncTouch: true` (don't, for most sites). Add `data-lenis-prevent` to scrollable inner panels.

## Debugging
- `markers: true` during development only.
- `ScrollTrigger.getAll()` to list triggers; `ScrollTrigger.killAll()` in hot-reload edge cases.
- If pinned sections jump: check for CSS `transform` on ancestors, and fonts loading after measurement.
