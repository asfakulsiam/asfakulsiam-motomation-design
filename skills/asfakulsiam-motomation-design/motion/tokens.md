# Motion Tokens and the Four Questions

Load this before any motion work.

## The four questions (every animation must pass)

1. **Should it move at all?** How often will people see it? Something seen 100 times a day (a menu, a button) gets the smallest, fastest motion or none. Something seen once (the hook, a story chapter) can be rich.
2. **What does it tell the user?** Pick one: *where something came from · where it went · what changed · what to look at · what this brand feels like*. If none applies, delete it.
3. **What's the cheapest tool that does it?** CSS before GSAP, GSAP before WebGL. Animate `transform`, `opacity`, `clip-path` and `filter` (sparingly); never `top`, `left`, `width` or `height`.
4. **What happens at the edges?** Interruption (hover out mid-animation), exit, rapid repeat, reduced motion, touch, slow devices.

## Easing tokens

```css
:root {
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);       /* UI default: fast start, gentle stop */
  --ease-out-strong: cubic-bezier(0.16, 1, 0.3, 1); /* editorial reveals, house signature */
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);    /* things moving on screen from A to B */
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);    /* sheets, drawers, panels */
  --ease-linear: linear;                            /* scrubbed scroll, progress, marquees */
}
```

GSAP equivalents: `"power3.out"` / `"expo.out"` for reveals, `"power2.inOut"` for travel, `"none"` inside scrubbed timelines.

**Never** use ease-in for things entering. It feels sluggish exactly when the user is waiting.

## Duration tokens

| Use | Duration |
|---|---|
| Press / tap feedback | 80–140ms |
| Hover, focus, toggles | 120–200ms |
| Tooltips, small popovers | 140–220ms |
| Dropdowns, menus | 180–260ms |
| Modals, drawers | 240–420ms |
| Editorial text reveals | 600–1000ms (+ stagger 60–120ms) |
| Page transitions | 400–700ms |
| Scrubbed scroll | no duration: tied to scroll distance |

Exit animations run about 20–30% faster than entrances.

## Distance and scale

- Entrances travel 8–40px (UI) or 100% of a masked line (editorial). Never fly in from off-screen without a reason.
- Scale entrances start at 0.94–0.98, **never `scale(0)`**.
- Press states scale to 0.96–0.98.

## Reduced motion (required everywhere)

Reduced motion doesn't mean nothing at all. It means **no travel, no parallax, no scrubbing, no autoplay**:
- Replace movement with an instant change or a fade of 150ms or less.
- Pinned Motomation chapters become static sequential frames (see Tier 5).
- Smooth scroll is off (Lenis does this by default with `respectReducedMotion`).

GSAP pattern, used in every example:

```js
const mm = gsap.matchMedia();
mm.add(
  { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)",
    desktop: "(min-width: 900px)", touch: "(hover: none)" },
  (ctx) => {
    const { motion, desktop, touch } = ctx.conditions;
    if (!motion) return;          // final states already set in CSS
    // build animations here; they are reverted automatically when conditions change
  }
);
```

## Pointer and touch

- Hover effects only when `(hover: hover) and (pointer: fine)`.
- Cursor-follow effects are off on touch. Provide the content another way (tap to open, visible by default).
- Magnetic or tilt effects never move the hit area away from the finger or pointer.
