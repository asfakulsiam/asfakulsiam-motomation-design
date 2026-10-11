// @motomation-variant
// id: blur-focus
// react: skills/asfakulsiam-motomation-design/examples/components/type/blur-focus.tsx
// markup: <h2 data-mm="blur-focus" [data-stagger="70" data-duration="800" data-blur="12"]>A line that comes into focus.</h2>
// behaviour: when the line enters the viewport (once), its words come into focus one after another: blur(12px) →
//   blur(0) and opacity .15 → 1, `stagger` ms apart. Only filter and opacity change. No-JS: sharp.
// reduced-motion: Text is sharp and visible from the start.  touch: Same as desktop (scroll-triggered).
import { inView, reduced, EASE, mountAll } from "../_lib/motion.js";

export function mount(el) {
  if (reduced()) return () => {};
  const d = el.dataset, stagger = +(d.stagger ?? 70), duration = +(d.duration ?? 800), blur = +(d.blur ?? 12);
  const words = el.textContent.trim().split(" ");
  const spans = words.map((w, i) => { const s = document.createElement("span"); s.textContent = w + (i < words.length - 1 ? " " : "");
    s.style.cssText = `display:inline-block;white-space:pre;filter:blur(${blur}px);opacity:.15;transition:filter ${duration}ms ${EASE.outStrong} ${i * stagger}ms, opacity ${duration}ms ${EASE.outStrong} ${i * stagger}ms`; return s; });
  el.replaceChildren(...spans);
  return inView(el, () => spans.forEach((s) => { s.style.filter = "blur(0)"; s.style.opacity = "1"; }));
}
export const mountBlurFocus = (root) => mountAll("blur-focus", mount, root);
mountBlurFocus();
