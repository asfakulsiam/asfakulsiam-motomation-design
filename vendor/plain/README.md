<!-- @motomation-variant · index of vendor/plain -->
# vendor/plain: the top 5 components without React

The library is React-first. Plain variants exist for the 5 most-used components. For other components, use the React version.

Why only five (v2.5.0): every plain variant is a second implementation that has to keep behaving like the React original, and most of the twenty were used by one or two sections. The five kept are the ones the most page sections and templates import (count-up and split-flap: 4 sections, 3 templates; copy-button, ink-fill and typewriter: 3 sections, 3 templates; the next component is in 2). Each is in three variants that behave the same:

- React: the original in `skills/asfakulsiam-motomation-design/examples/components/`, unchanged.
- CSS + HTML: `<id>/<id>.css` (BEM classes `.mm-<id>__part`) with the markup in `<id>/plain.html`.
- Tailwind: utility classes on the markup in `<id>/tailwind.html`. There's no custom CSS. A generated part takes its classes from `data-<part>-class`.

Both HTML variants run the same behaviour file, `<id>/<id>.js`. This is a dependency-free ES module that mounts every `[data-mm="<id>"]` on load and exports `mount(el)`, which returns a cleanup function. Shared helpers (easing, durations, reduced-motion and pointer queries, in-view, scroll progress and velocity, the low-power probe) are in `_lib/motion.js`. Nothing here imports a package, and every file is original to this repository.

Ranking: components are ordered by how many of the 38 sections import them, then by how many of the 8 templates reach them, then by name. The list is in [`top5.json`](top5.json). `scripts/check-repo.mjs` recomputes the ranking from the sources and fails if the list is out of date, if a plain folder exists for a component outside the five, if a folder is missing a file, if a file lacks its `@motomation-variant` header, or if a script imports anything but a relative path.

## Use

```html
<link rel="stylesheet" href="vendor/plain/count-up/count-up.css">
<span class="mm-count-up" data-mm="count-up" data-value="1260">1,260</span>
<script type="module" src="vendor/plain/count-up/count-up.js"></script>
```

For Tailwind, copy the markup from `tailwind.html` and add the folder to your `@source`. The `data-*-class` attributes hold class names, so Tailwind's scanner picks them up. `tailwind.preview.css` is the compiled output for the preview pages only. Your build makes its own.

Options are `data-` attributes named after the React props (for example `speed` becomes `data-speed`, and `maxSkew` becomes `data-max-skew`). Each script header lists its options.

## The 5, and their fallbacks

The fallbacks are the same as in React: reduced motion gives the same still state, touch gives the same alternative, and none of the five needs a low-power poster.

| Component | React source | Reduced motion | Touch |
|---|---|---|---|
| [count-up](count-up/) | [count-up.tsx](../../skills/asfakulsiam-motomation-design/examples/components/micro/count-up.tsx) | Shows the final value at once. | Same as desktop. |
| [split-flap](split-flap/) | [split-flap.tsx](../../skills/asfakulsiam-motomation-design/examples/components/type/split-flap.tsx) | Shows the new value at once. | Same as desktop. |
| [copy-button](copy-button/) | [copy-button.tsx](../../skills/asfakulsiam-motomation-design/examples/components/micro/copy-button.tsx) | The tick swaps in without the morph (the CSS turns the path transition off). | Same as desktop. |
| [ink-fill](ink-fill/) | [ink-fill.tsx](../../skills/asfakulsiam-motomation-design/examples/components/type/ink-fill.tsx) | The whole statement is in ink from the start. | Same as desktop. |
| [typewriter](typewriter/) | [typewriter.tsx](../../skills/asfakulsiam-motomation-design/examples/components/text/typewriter.tsx) | The whole line is there from the start, with no caret. | Same as desktop (starts when in view). |

## Without JavaScript

The React components render on the server. The plain variants start from your HTML. Wherever the two would differ, the plain variant shows the finished content:

- InkFill shows full ink, not the muted pre-scroll state.
- Typewriter shows the whole sentence, not hidden characters.

The scripts add the "before" state just before animating, and under reduced motion they don't add it at all. With JavaScript running, the visible result and the screen-reader text match React. `tests/variants/compare.mjs` checks this.

## Verified by

`NODE_PATH=<toolchain>/node_modules node tests/variants/compare.mjs --shots <dir>` loads each component as React (bundled with esbuild from the local toolchain), CSS + HTML and Tailwind. For each one it checks:

- no console errors;
- the same settled screen-reader text and the same roles and names, before and after the scripted interaction (Change the date, Copy);
- under reduced motion, two frames 900 ms apart are identical;
- a side-by-side screenshot.

Playwright, esbuild and the Tailwind CLI come from a local toolchain. None of them is a repository dependency.
