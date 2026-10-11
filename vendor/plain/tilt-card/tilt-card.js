// @motomation-variant
// id: tilt-card
// react: skills/asfakulsiam-motomation-design/examples/components/cursor/tilt-card.tsx
// markup: <div data-mm="tilt-card" [data-max="10" data-glare="true"]>…</div>
// behaviour: with a fine pointer, the card rotates up to `max` degrees toward the pointer (perspective 900 px, 200 ms
//   ease-out) and a soft-light highlight follows it; leaving springs it flat.
// reduced-motion: Flat card, no rotation or highlight.  touch: Flat card.
import { reduced, finePointer, EASE, mountAll } from "../_lib/motion.js";

export function mount(el) {
  const max = +(el.dataset.max ?? 10), live = () => finePointer() && !reduced();
  el.style.transformStyle = "preserve-3d"; el.style.transition = `transform 200ms ${EASE.out}`; if (getComputedStyle(el).position === "static") el.style.position = "relative";
  let shine = null;
  if (el.dataset.glare !== "false" && live()) { shine = document.createElement("span"); shine.setAttribute("aria-hidden", "true"); shine.style.cssText = "position:absolute;inset:0;border-radius:inherit;pointer-events:none;mix-blend-mode:soft-light"; el.append(shine); el.style.willChange = "transform"; }
  const move = (e) => { if (!live()) return; const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-py * max}deg) rotateY(${px * max}deg)`;
    if (shine) shine.style.background = `radial-gradient(circle at ${(px + 0.5) * 100}% ${(py + 0.5) * 100}%, rgba(255,255,255,.35), transparent 55%)`; };
  const leave = () => { el.style.transform = "perspective(900px) rotateX(0) rotateY(0)"; if (shine) shine.style.background = "transparent"; };
  el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
  return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); shine?.remove(); };
}
export const mountTiltCard = (root) => mountAll("tilt-card", mount, root);
mountTiltCard();
