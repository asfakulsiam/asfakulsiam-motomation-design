// @motomation-variant
// id: bento-reveal
// react: skills/asfakulsiam-motomation-design/examples/components/layout/bento-reveal.tsx
// markup: <ul data-mm="bento-reveal" style="--mm-bento-columns:4"><li data-col="2" data-row="2">…</li>…</ul>
//   (spans: the plain CSS reads data-col/data-row; the Tailwind markup uses col-span/row-span utilities)
// behaviour: tiles rise 16 px and fade in once, in DOM order 70 ms apart, when the grid enters the viewport.
//   Below 640 px the grid is one column (CSS media query, as the React version's useMedia). No-JS: tiles visible.
// reduced-motion: Tiles are visible from the start.  touch: Collapses to one column below 640px.
import { inView, reduced, EASE, mountAll } from "../_lib/motion.js";

export function mount(el) {
  if (reduced()) return () => {};
  const tiles = [...el.children];
  tiles.forEach((t, i) => { t.style.opacity = "0"; t.style.transform = "translateY(16px)"; t.style.transition = `opacity 500ms ${EASE.out} ${i * 70}ms, transform 700ms ${EASE.outStrong} ${i * 70}ms`; });
  return inView(el, () => tiles.forEach((t) => { t.style.opacity = "1"; t.style.transform = "none"; }));
}
export const mountBentoReveal = (root) => mountAll("bento-reveal", mount, root);
mountBentoReveal();
