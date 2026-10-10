# Tier 2: Intermediate (GSAP, ScrollTrigger, SplitText, Lenis)

The baseline for marketing and portfolio sites. Kinetic type, reveals, pinned moments and smooth scroll.

## Setup

```bash
npm i gsap @gsap/react lenis
```

GSAP and all of its plugins (SplitText, ScrollTrigger, ScrollSmoother, Flip, MorphSVG, DrawSVG…) are free, including for commercial use, under the GSAP Standard License.

```js
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);
```

## Lenis + ScrollTrigger (one loop)

```js
import Lenis from "lenis";
const lenis = new Lenis({ autoRaf: false });   // respectReducedMotion is on by default
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
```

React: `import { ReactLenis } from "lenis/react"` with `options={{ autoRaf: false }}`, and drive it from the GSAP ticker in an effect.

## Core recipes

**Line reveal (house signature):**
```js
SplitText.create(".headline", {
  type: "lines", mask: "lines", autoSplit: true,
  onSplit: (self) => gsap.from(self.lines, {
    yPercent: 110, duration: 0.9, ease: "expo.out", stagger: 0.08,
    scrollTrigger: { trigger: self.elements[0], start: "top 85%", once: true },
  }),
});
```
Returning the tween from `onSplit` lets GSAP clean up and re-run it when the text re-splits on resize.

**Pinned chapter:**
```js
gsap.timeline({ scrollTrigger: { trigger: ".chapter", start: "top top", end: "+=200%", scrub: 1, pin: true } })
  .from(".chapter .title", { yPercent: 40, opacity: 0, ease: "none" })
  .to(".chapter .image", { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }, "<");
```

**Parallax depth (subtle):** move layers by 5–15% of their height at most; never on body text.

**Batch reveals for lists:**
```js
ScrollTrigger.batch(".row", { start: "top 90%", once: true,
  onEnter: (els) => gsap.from(els, { y: 24, opacity: 0, stagger: 0.06, ease: "power3.out" }) });
```

## React

Use `useGSAP` from `@gsap/react`: it scopes selectors and reverts everything on unmount.

```tsx
const root = useRef<HTMLDivElement>(null);
useGSAP(() => {
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => { /* animations */ });
}, { scope: root });
```

## Rules

- Wrap everything in `gsap.matchMedia()` with a reduced-motion condition.
- Set final states in CSS and animate **from** them, so no-JS and reduced-motion users see finished content.
- `scrub: true` for exact sync, `scrub: 0.5–1.5` for weight. Use `ease: "none"` inside scrubbed timelines.
- `ScrollTrigger.refresh()` after fonts and images load (`document.fonts.ready.then(() => ScrollTrigger.refresh())`).
- Remove `markers: true` before shipping.
