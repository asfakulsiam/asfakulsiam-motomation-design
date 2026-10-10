# Tier 1: Basic (CSS)

Every site has Tier 1. It's the craft floor.

## What belongs here

- Hover, focus-visible, active and disabled states on every interactive element.
- Underline draws, colour shifts, small lifts (`translateY(-2px)`), press scale (0.97).
- CSS `@keyframes` for loaders and small loops.
- Same-document View Transitions for state changes (filters, tabs, theme switch).
- CSS scroll-driven animations (`animation-timeline: view()`) as progressive enhancement.

## Recipes

```css
/* link underline that draws from the left and retracts to the right */
.link { background: linear-gradient(currentColor 0 0) 0 100% / 0 1px no-repeat;
        transition: background-size 220ms var(--ease-out); }
.link:hover { background-size: 100% 1px; }

/* button press */
.btn { transition: transform 120ms var(--ease-out), background-color 160ms var(--ease-out); }
.btn:active { transform: scale(0.97); }

/* focus that is designed, not removed */
:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 2px; }

/* reveal on entering view: progressive enhancement */
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .reveal { animation: reveal linear both; animation-timeline: view(); animation-range: entry 10% cover 30%; }
    @keyframes reveal { from { opacity: 0; transform: translateY(24px); } }
  }
}

/* theme switch with a view transition */
::view-transition-old(root), ::view-transition-new(root) { animation-duration: 420ms; }
```

```js
function setTheme(next) {
  const apply = () => document.documentElement.dataset.theme = next;
  if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return apply();
  document.startViewTransition(apply);
}
```

## Rules

- Transition only what changes: `transition: transform 160ms, opacity 160ms`, never `transition: all`.
- Use `@media (hover: hover)` to scope hover effects.
- Use the `motion/tokens.md` durations. Tier 1 stays under 300ms.
