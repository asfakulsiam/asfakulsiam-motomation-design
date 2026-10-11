// @motomation-variant
// id: beams
// react: skills/asfakulsiam-motomation-design/examples/components/backgrounds/beams.tsx
// markup: <span data-mm="beams" aria-hidden="true" [data-count="5" data-angle="18" data-light="255, 236, 200" data-ground="#0e0c0a"]></span> (inside a positioned parent)
// behaviour: `count` shafts of light lean in from the top edge like sun through high windows, with soft edges (a static
//   mask); each sways slowly (1.5–3.1°, 9–16 s, transform only) via Web Animations that pause off screen and in hidden tabs.
// reduced-motion: The shafts, still, at their resting angles (this is also the low-power poster).
// low-power: Save-Data, ≤ 2 cores or < 4 GB → the still poster (same probe as _lib/ambient.ts; ?ambient=force overrides).
// touch: Same as desktop (no pointer input).
import { reduced, probeCapability, ambientAnimations, mountAll } from "../_lib/motion.js";

export function mount(el) {
  const d = el.dataset, count = +(d.count ?? 5), angle = +(d.angle ?? 18), light = d.light || "255, 236, 200", ground = d.ground || "#0e0c0a";
  Object.assign(el.style, { position: "absolute", inset: "0", overflow: "hidden", pointerEvents: "none", background: `linear-gradient(to bottom, rgba(${light}, .06), transparent 50%), ${ground}`, perspective: "900px" });
  const shafts = Array.from({ length: count }, (_, i) => { const s = document.createElement("span");
    s.style.cssText = `position:absolute;left:${-6 + (i + 0.5) * (112 / count)}%;top:-8%;width:${(52 / count) * (0.8 + (i % 2) * 0.4)}%;height:140%;transform-origin:50% 0;transform:rotate(${angle}deg);background:linear-gradient(to bottom, rgba(${light}, ${0.26 + (i % 3) * 0.05}), rgba(${light}, .08) 55%, transparent 85%);border-radius:2px;-webkit-mask-image:linear-gradient(to right, transparent, #000 25%, #000 75%, transparent);mask-image:linear-gradient(to right, transparent, #000 25%, #000 75%, transparent)`;
    el.append(s); return s; });
  if (reduced() || !probeCapability(false).ok) return () => el.replaceChildren();
  const stop = ambientAnimations(el, () => shafts.map((s, i) => { const sway = 1.5 + (i % 3) * 0.8;
    return s.animate([{ transform: `rotate(${angle - sway}deg) rotateY(-14deg)` }, { transform: `rotate(${angle + sway}deg) rotateY(14deg)` }], { duration: 9000 + i * 1700, direction: "alternate", iterations: Infinity, easing: "cubic-bezier(0.45, 0, 0.55, 1)", delay: -i * 2300 }); }));
  return () => { stop(); el.replaceChildren(); };
}
export const mountBeams = (root) => mountAll("beams", mount, root);
mountBeams();
