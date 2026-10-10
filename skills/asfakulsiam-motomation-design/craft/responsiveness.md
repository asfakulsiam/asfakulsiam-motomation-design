# Responsiveness

A design is responsive when it's **recomposed**, not just squeezed.

## Breakpoints (content-led, as a starting point)
- `< 640px` phone · `640–1023px` tablet · `≥ 1024px` desktop · `≥ 1600px` wide

## Rules
- Fluid type and spacing with `clamp()`, so most changes happen without breakpoints.
- Recompose at each breakpoint: an asymmetric 7/5 split becomes a stacked layout with the detail **moved**, not deleted.
- Display type can stay huge on mobile, but check that the longest word fits (`overflow-wrap: anywhere` only as a last resort, and use `hyphens: auto` with a `lang` attribute).
- Navigation on phones: a clear menu button with `aria-expanded`, a full-screen menu with large type, and focus trapped inside while open.
- Horizontal scroll sections become native swipe with `scroll-snap` on touch.
- Use container queries (`@container`) for components that live in different widths.
- Test at 320, 375, 768, 1024, 1440 and 1920px, and in landscape on phones.
- Use `svh`/`dvh` units for full-height sections so mobile browser bars don't cut content.
