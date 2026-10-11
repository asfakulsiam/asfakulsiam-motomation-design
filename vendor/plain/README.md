<!-- @motomation-variant · index of vendor/plain -->
# vendor/plain: the top 20 components without React

The 20 components used most across the page sections and templates, each in three variants that behave the same:

- React: the original in `skills/asfakulsiam-motomation-design/examples/components/`, unchanged.
- CSS + HTML: `<id>/<id>.css` (BEM classes `.mm-<id>__part`) with the markup in `<id>/plain.html`.
- Tailwind: utility classes on the markup in `<id>/tailwind.html`. There's no custom CSS. A generated part takes its classes from `data-<part>-class`.

Both HTML variants run the same behaviour file, `<id>/<id>.js`. This is a dependency-free ES module that mounts every `[data-mm="<id>"]` on load and exports `mount(el)`, which returns a cleanup function. Shared helpers (easing, durations, reduced-motion and pointer queries, in-view, scroll progress and velocity, the low-power probe) are in `_lib/motion.js`. Nothing here imports a package, and every file is original to this repository.

Ranking: components are ordered by how many of the 38 sections import them, then by how many of the 8 templates reach them, then by name. The list is in [`top20.json`](top20.json). `scripts/check-repo.mjs` recomputes the ranking from the sources and fails if the list is out of date, if a folder is missing a file, if a file lacks its `@motomation-variant` header, or if a script imports anything but a relative path.

## Use

```html
<link rel="stylesheet" href="vendor/plain/count-up/count-up.css">
<span class="mm-count-up" data-mm="count-up" data-value="1260">1,260</span>
<script type="module" src="vendor/plain/count-up/count-up.js"></script>
```

For Tailwind, copy the markup from `tailwind.html` and add the folder to your `@source`. The `data-*-class` attributes hold class names, so Tailwind's scanner picks them up. `tailwind.preview.css` is the compiled output for the preview pages only. Your build makes its own.

Options are `data-` attributes named after the React props (for example `speed` becomes `data-speed`, and `maxSkew` becomes `data-max-skew`). Each script header lists its options.

## The 20, and their fallbacks

The fallbacks are the same as in React: reduced motion gives the same still state, touch gives the same alternative, and the low-power poster uses the same capability probe (Beams).

| Component | React source | Reduced motion | Touch |
|---|---|---|---|
| [count-up](count-up/) | [count-up.tsx](../../skills/asfakulsiam-motomation-design/examples/components/micro/count-up.tsx) | Shows the final value at once. | Same as desktop. |
| [split-flap](split-flap/) | [split-flap.tsx](../../skills/asfakulsiam-motomation-design/examples/components/type/split-flap.tsx) | Shows the new value at once. | Same as desktop. |
| [copy-button](copy-button/) | [copy-button.tsx](../../skills/asfakulsiam-motomation-design/examples/components/micro/copy-button.tsx) | The tick swaps in without the morph (the CSS turns the path transition off). | Same as desktop. |
| [ink-fill](ink-fill/) | [ink-fill.tsx](../../skills/asfakulsiam-motomation-design/examples/components/type/ink-fill.tsx) | The whole statement is in ink from the start. | Same as desktop. |
| [typewriter](typewriter/) | [typewriter.tsx](../../skills/asfakulsiam-motomation-design/examples/components/text/typewriter.tsx) | The whole line is there from the start, with no caret. | Same as desktop (starts when in view). |
| [animated-list](animated-list/) | [animated-list.tsx](../../skills/asfakulsiam-motomation-design/examples/components/ui/animated-list.tsx) | Every entry is there from the start. | Same as desktop. |
| [contour-lines](contour-lines/) | [contour-lines.tsx](../../skills/asfakulsiam-motomation-design/examples/components/backgrounds/contour-lines.tsx) | Still lines. | Same as desktop. |
| [glow-border](glow-border/) | [glow-border.tsx](../../skills/asfakulsiam-motomation-design/examples/components/ui/glow-border.tsx) | A steady, faint border. | A steady, faint border; the light follows a dragging finger. |
| [rotating-words](rotating-words/) | [rotating-words.tsx](../../skills/asfakulsiam-motomation-design/examples/components/text/rotating-words.tsx) | The first word, still. | Same as desktop; it pauses while touched. |
| [squish-switch](squish-switch/) | [squish-switch.tsx](../../skills/asfakulsiam-motomation-design/examples/components/micro/squish-switch.tsx) | The knob moves without stretching (120 ms linear). | Same as desktop. |
| [tilt-card](tilt-card/) | [tilt-card.tsx](../../skills/asfakulsiam-motomation-design/examples/components/cursor/tilt-card.tsx) | Flat card, no rotation or highlight. | Flat card. |
| [velocity-marquee](velocity-marquee/) | [velocity-marquee.tsx](../../skills/asfakulsiam-motomation-design/examples/components/scroll/velocity-marquee.tsx) | A static, wrapped row of the same words (the no-JS markup is this row too). | Same as desktop. |
| [flowing-menu](flowing-menu/) | [flowing-menu.tsx](../../skills/asfakulsiam-motomation-design/examples/components/layout/flowing-menu.tsx) | Hover shows the band instantly with still text. | Plain links (the browser's own pressed state). |
| [grain](grain/) | [grain.tsx](../../skills/asfakulsiam-motomation-design/examples/components/backgrounds/grain.tsx) | Still grain. | Still grain. |
| [scramble-on-hover](scramble-on-hover/) | [scramble-on-hover.tsx](../../skills/asfakulsiam-motomation-design/examples/components/text/scramble-on-hover.tsx) | Plain text; nothing scrambles. | Tap scrambles the whole word once, settling left to right. |
| [shimmer-button](shimmer-button/) | [shimmer-button.tsx](../../skills/asfakulsiam-motomation-design/examples/components/ui/shimmer-button.tsx) | No band; the press still darkens the button (colour, not movement). | The band crosses on press. |
| [aperture](aperture/) | [aperture.tsx](../../skills/asfakulsiam-motomation-design/examples/components/scroll/aperture.tsx) | Fully open from the start. | Same as desktop. |
| [beams](beams/) | [beams.tsx](../../skills/asfakulsiam-motomation-design/examples/components/backgrounds/beams.tsx) | The shafts, still, at their resting angles (this is also the low-power poster). | Same as desktop (no pointer input). |
| [bento-reveal](bento-reveal/) | [bento-reveal.tsx](../../skills/asfakulsiam-motomation-design/examples/components/layout/bento-reveal.tsx) | Tiles are visible from the start. | Collapses to one column below 640px. |
| [blur-focus](blur-focus/) | [blur-focus.tsx](../../skills/asfakulsiam-motomation-design/examples/components/type/blur-focus.tsx) | Text is sharp and visible from the start. | Same as desktop (scroll-triggered). |

## Without JavaScript

The React components render on the server. The plain variants start from your HTML. Wherever the two would differ, the plain variant shows the finished content:

- InkFill shows full ink, not the muted pre-scroll state.
- Typewriter shows the whole sentence, not hidden characters.
- Aperture is fully open, not clipped.
- BentoReveal and AnimatedList show every tile and entry, not hidden ones.
- BlurFocus is sharp.
- VelocityMarquee is a wrapped row of the words.

The scripts add the "before" state just before animating, and under reduced motion they don't add it at all. With JavaScript running, the visible result and the screen-reader text match React. `tests/variants/compare.mjs` checks this.

## Verified by

`NODE_PATH=<toolchain>/node_modules node tests/variants/compare.mjs --shots <dir>` loads each component as React (bundled with esbuild from the local toolchain), CSS + HTML and Tailwind. For each one it checks:

- no console errors;
- the same settled screen-reader text and the same roles and names, before and after the scripted interaction (Change the date, the switch, Copy);
- under reduced motion, two frames 900 ms apart are identical;
- a side-by-side screenshot.

Playwright, esbuild and the Tailwind CLI come from a local toolchain. None of them is a repository dependency.
