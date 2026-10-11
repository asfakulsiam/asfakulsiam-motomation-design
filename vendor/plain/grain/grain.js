// @motomation-variant
// id: grain
// react: skills/asfakulsiam-motomation-design/examples/components/backgrounds/grain.tsx
// markup: <canvas data-mm="grain" aria-hidden="true" [data-size="160" data-fps="12" data-animate="false"]></canvas> (inside a positioned parent)
// behaviour: a 160 px tile of random grey noise, stretched over the parent with overlay blending (pixelated); with
//   data-animate="true" and a fine pointer it re-rolls `fps` times a second while the tab is visible.
// reduced-motion: Still grain.  touch: Still grain.
import { reduced, finePointer, mountAll } from "../_lib/motion.js";

export function mount(el) {
  const ctx = el.getContext("2d"); if (!ctx) return () => {};
  const size = +(el.dataset.size ?? 160), fps = +(el.dataset.fps ?? 12); el.width = size; el.height = size;
  const img = ctx.createImageData(size, size);
  const paint = () => { for (let i = 0; i < img.data.length; i += 4) { const v = (Math.random() * 255) | 0; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; } ctx.putImageData(img, 0, 0); };
  paint();
  if (el.dataset.animate !== "true" || reduced() || !finePointer()) return () => {};
  const id = setInterval(() => { if (!document.hidden) paint(); }, 1000 / fps);
  return () => clearInterval(id);
}
export const mountGrain = (root) => mountAll("grain", mount, root);
mountGrain();
