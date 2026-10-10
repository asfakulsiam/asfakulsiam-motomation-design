# Tier 3: Pro (Page Transitions, Flip, Lottie, Rive, SVG Morphing)

Continuity between states and pages, and illustrated motion that a designer authors outside code.

## Cross-document View Transitions (MPA, Astro, plain HTML)

```css
@view-transition { navigation: auto; }
.project-title { view-transition-name: var(--vt-name); }   /* set a unique name per item */
::view-transition-group(*) { animation-duration: 520ms; animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
@media (prefers-reduced-motion: reduce) { ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; } }
```

This is progressive enhancement: browsers without support simply navigate normally. In Next.js App Router, use the experimental `viewTransition` flag or React's `<ViewTransition>` when it's available in your version, or a client-side Flip.

## GSAP Flip (shared-element transitions inside a page)

```js
import { Flip } from "gsap/Flip";
const state = Flip.getState(".card");
container.classList.toggle("is-grid");
Flip.from(state, { duration: 0.6, ease: "power3.inOut", absolute: true, stagger: 0.02 });
```

Use it for filtering, grid ↔ list switching, and expanding a thumbnail into a detail view.

## Lottie (designer-authored loops and illustrations)

- Prefer `.lottie` files with `@lottiefiles/dotlottie-web` (smaller than JSON).
- Scrub a Lottie with scroll: set its frame from a ScrollTrigger's `onUpdate(self => anim.setFrame(self.progress * total))`.
- Pause when off-screen. Show the poster frame when reduced motion is on.

## Rive (interactive state machines)

- Use Rive when the animation must **react**: hover, press, success/failure, a character following the cursor.
- `@rive-app/canvas` (vanilla) or `@rive-app/react-canvas`. Drive state machine inputs from UI events.
- Keep the file under ~150KB. Supply a static fallback image.

## SVG morphing and drawing

- `MorphSVGPlugin` for shape-to-shape transitions (logo → icon, letter → symbol).
- `DrawSVGPlugin` for lines that draw: signatures, routes on a map, underlines.
- Keep SVGs optimised (SVGO) and avoid morphing paths with very different point counts. Use `shapeIndex: "auto"`.

## Rules

- Page transitions under 700ms. The user is waiting for content.
- Never block navigation on an animation finishing.
- Every authored animation (Lottie/Rive) needs a static fallback and a reduced-motion poster.
