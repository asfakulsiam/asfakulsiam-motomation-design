# Responsiveness

A design is responsive when it's **recomposed**, not just squeezed.

## Breakpoints (content-led, as a starting point)
- `< 640px` phone · `640–1023px` tablet · `≥ 1024px` desktop · `≥ 1600px` wide

## Recomposition rules

Each rule says what to look for in the code, and why it matters.

- **R1. Fluid type and spacing.** Display sizes, section padding and gaps use `clamp(min, preferred-vw, max)`, so most changes happen without breakpoints. Look for display `font-size` in fixed px with three or more media-query overrides. Why: stepped sizes jump at the breakpoint and look wrong at every width between them.
- **R2. Recompose, don't squeeze.** At each breakpoint the layout changes shape: an asymmetric 7/5 split becomes a stacked layout with the detail **moved** (above or below the type), not deleted. Look for `display: none` on content at small widths. Why: hiding content on phones removes it for most of the audience; the phone layout is a layout, not a crop.
- **R3. Display type stays big and fits.** Display type can stay huge on mobile, but the longest word fits (rule 6 below). `overflow-wrap: anywhere` only as a last resort; prefer `hyphens: auto` with a `lang` attribute. Why: a display word that breaks mid-letter is the most visible responsive bug there is.
- **R4. Phone navigation is a real menu.** A menu button with `aria-expanded` and `aria-controls`, a full-screen menu with large type, focus trapped inside while open, Escape closes it. Why: a squeezed desktop nav row either overflows or becomes a row of 12px tap targets.
- **R5. Horizontal sections become native swipe on touch.** Pinned horizontal scroll uses `scroll-snap` on coarse pointers (`@media (pointer: coarse)`). Why: scroll-jacked horizontal motion fights the thumb on phones.
- **R6. Components respond to their container.** Cards and media that live at several widths use `@container` queries, not viewport media queries. Why: the same card in a sidebar and in a full-width grid needs different layouts at the same viewport width.
- **R7. Full-height sections use `svh`/`dvh`.** Look for `height: 100vh` on heroes. Why: on mobile browsers `100vh` includes the area under the address bar, so the bottom of the hero is cut off.
- **R8. Tap targets are at least 44×44px on coarse pointers**, including icon buttons and inline links in nav. Why: WCAG 2.5.8 sets 24px as the floor; 44px is what thumbs hit reliably.
- **Test widths:** 320, 375, 768, 1024, 1440 and 1920px, and landscape on phones.

## Overflow rules you can check by reading the CSS

None of these needs a browser. At 375px the content box is about **335px** (375 minus two 20px gutters; use your real gutter). Any box that can't shrink below that overflows the page.

1. **Grid tracks shrink.** Content tracks are `minmax(0, 1fr)`, not a bare `1fr`. A bare `1fr` keeps the track at least as wide as its widest unbreakable child, so one wide child widens the whole page. Flex children holding text or media get `min-width: 0`.
2. **`aspect-ratio` + `min-height` hides a minimum width.** The box can't be narrower than `min-height × ratio`. Check that the product is ≤ 335px at 375, or drop the `min-height` on mobile.
3. **Fixed widths fit.** Every `width`, `min-width`, `flex-basis` or track size in px or rem fits in 335px at 375, including padding and gap.
4. **`white-space: nowrap` has a length limit.** Only on labels you know are short (≤ 20 characters at button size). Long buttons, prices with units, and nav rows must be able to wrap.
5. **Never overflow a container without an explicit overflow rule.** Anything allowed to be wider than its parent (marquees, horizontal galleries, oversized display words, code blocks) sits inside a parent with `overflow-x: clip`, `hidden` or `auto`, written next to it. Wide content without one is a failure.
6. **Long display words at 375.** Check each display heading with the formula in `principles/typography.md` §3 ("Long words at 375"). The longest word has to fit in 335px at the size the `clamp()` gives at 375.

Example. In the v2.1.0 hotel output, `.grid{grid-template-columns:1fr}` (rule 1) holds `.sky{aspect-ratio:2/1;min-height:230px}` (rule 2). 230 × 2 = 460px > 335px, so reading alone predicts the overflow. The measured gate found the page 105px too wide at 375 (480px for a 375px screen).

## Worked example: recomposing a split hero

A desktop hero with display type on the left and a detail panel on the right:

```css
/* ✗ squeezed: the panel is hidden on phones and the type is stepped */
.hero { display: grid; grid-template-columns: 7fr 5fr; height: 100vh; }
.hero h1 { font-size: 160px; }
@media (max-width: 640px) { .hero h1 { font-size: 64px; } .hero .detail { display: none; } }
```

Reading it: rule 1 below fails (bare `fr` tracks), R1 fails (stepped px size), R2 fails (`display: none` on content), R7 fails (`100vh`).

```css
/* ✓ recomposed: one fluid size, the detail moves under the type, height respects the browser bars */
.hero { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); min-height: 100svh; gap: clamp(16px, 3vw, 48px); }
.hero h1 { font-size: clamp(3.5rem, 11vw, 10rem); hyphens: auto; }
@media (max-width: 640px) { .hero { grid-template-columns: minmax(0, 1fr); } .hero .detail { order: 2; } }
```

Check the longest word with the formula in `principles/typography.md` §3 before shipping: at 375px, `11vw` is 41px, but the `clamp()` floor is 3.5rem (56px), so the floor decides the size there.

