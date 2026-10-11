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

## Overflow rules you can check by reading the CSS

None of these needs a browser. At 375px the content box is about **335px** (375 minus two 20px gutters; use your real gutter). Any box that can't shrink below that overflows the page.

1. **Grid tracks shrink.** Content tracks are `minmax(0, 1fr)`, not a bare `1fr`. A bare `1fr` keeps the track at least as wide as its widest unbreakable child, so one wide child widens the whole page. Flex children holding text or media get `min-width: 0`.
2. **`aspect-ratio` + `min-height` hides a minimum width.** The box can't be narrower than `min-height × ratio`. Check that the product is ≤ 335px at 375, or drop the `min-height` on mobile.
3. **Fixed widths fit.** Every `width`, `min-width`, `flex-basis` or track size in px or rem fits in 335px at 375, including padding and gap.
4. **`white-space: nowrap` has a length limit.** Only on labels you know are short (≤ 20 characters at button size). Long buttons, prices with units, and nav rows must be able to wrap.
5. **Never overflow a container without an explicit overflow rule.** Anything allowed to be wider than its parent (marquees, horizontal galleries, oversized display words, code blocks) sits inside a parent with `overflow-x: clip`, `hidden` or `auto`, written next to it. Wide content without one is a failure.
6. **Long display words at 375.** Check each display heading with the formula in `principles/typography.md` §3 ("Long words at 375"). The longest word has to fit in 335px at the size the `clamp()` gives at 375.

Example. In the v2.1.0 hotel output, `.grid{grid-template-columns:1fr}` (rule 1) holds `.sky{aspect-ratio:2/1;min-height:230px}` (rule 2). 230 × 2 = 460px > 335px, so reading alone predicts the overflow. The measured gate found the page 105px too wide at 375 (480px for a 375px screen).
