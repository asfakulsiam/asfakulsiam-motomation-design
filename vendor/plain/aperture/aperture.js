// @motomation-variant
// id: aperture
// react: skills/asfakulsiam-motomation-design/examples/components/scroll/aperture.tsx
// markup: <div data-mm="aperture" [data-shape="circle|door" data-from="6"]>…</div>
// behaviour: the block opens as it scrolls in (5% → 45% of its trip through the viewport): a circle grows from `from`%
//   to 75%, or a door (an arched inset) widens from a narrow arch to the full rectangle. Only clip-path changes; the
//   content is always in the DOM. No-JS: fully open.
// reduced-motion: Fully open from the start.  touch: Same as desktop.
import { reduced, scrollProgress, clamp, mountAll } from "../_lib/motion.js";

export function mount(el) {
  if (reduced()) { el.style.clipPath = "none"; return () => {}; }
  const shape = el.dataset.shape || "circle", from = +(el.dataset.from ?? 6);
  return scrollProgress(el, (p) => { const k = clamp((p - 0.05) / 0.4);
    el.style.clipPath = shape === "circle" ? `circle(${from + (75 - from) * k}% at 50% 50%)` : `inset(0 ${(1 - k) * 42}% round ${(1 - k) * 999}px ${(1 - k) * 999}px 0 0)`; });
}
export const mountAperture = (root) => mountAll("aperture", mount, root);
mountAperture();
