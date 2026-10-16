// @motomation-variant
// id: grain
// react: skills/asfakulsiam-motomation-design/examples/components/backgrounds/grain.tsx
// markup: <canvas data-mm="grain" aria-hidden="true" [data-opacity="0.08" data-size="160" data-fps="12" data-animate]></canvas>
//   as the last child of a positioned element (position: relative); the canvas covers it.
// behaviour: paints one tile of monochrome noise, stretched over the element with overlay blending. With data-animate
//   it repaints at data-fps while the tab is visible. No-JS: the canvas stays empty (no grain, nothing hidden).
// reduced-motion: Static grain.  touch: Static grain (no repaint on coarse pointers, to save battery).
import { reduced, finePointer, mountAll } from "../_lib/motion.js";

export function mount(el) {
  const size = +(el.dataset.size || 160), fps = +(el.dataset.fps || 12);
  const ctx = el.getContext("2d"); if (!ctx) return () => {};
  el.width = size; el.height = size;
  if (el.dataset.opacity) el.style.opacity = el.dataset.opacity;
  const img = ctx.createImageData(size, size);
  const paint = () => { for (let i = 0; i < img.data.length; i += 4) { const v = (Math.random() * 255) | 0; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; } ctx.putImageData(img, 0, 0); };
  paint();
  if (!("animate" in el.dataset) || reduced() || !finePointer()) return () => {};
  const id = setInterval(() => { if (!document.hidden) paint(); }, 1000 / fps);
  return () => clearInterval(id);
}
export const mountGrain = (root) => mountAll("grain", mount, root);
mountGrain();
