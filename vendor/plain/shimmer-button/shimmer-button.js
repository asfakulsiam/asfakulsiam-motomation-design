// @motomation-variant
// id: shimmer-button
// react: skills/asfakulsiam-motomation-design/examples/components/ui/shimmer-button.tsx
// markup: <a href="…" data-mm="shimmer-button" [data-shine="rgba(255,240,205,.55)"]>Label</a>  (or <button type="button" data-mm="shimmer-button">)
// behaviour: a light band crosses the button once per trigger (mouse enter, focus, or press on touch; 760 ms, transform
//   only); pressing scales it to .97 and darkens it (brightness .88) for 120 ms feedback.
// reduced-motion: No band; the press still darkens the button (colour, not movement).  touch: The band crosses on press.
import { reduced, EASE, DUR, partClass, mountAll } from "../_lib/motion.js";

export function mount(el) {
  const band = document.createElement("span"); band.setAttribute("aria-hidden", "true"); band.className = partClass(el, "band", "mm-shimmer-button__band");
  band.style.background = `linear-gradient(90deg, transparent, ${el.dataset.shine || "var(--mm-shine, rgba(255,240,205,.55))"}, transparent)`; band.style.transform = "translateX(-120%) skewX(-20deg)";
  el.prepend(band); el.style.transition = `transform ${DUR.press}ms ${EASE.out}, filter ${DUR.press}ms`;
  const sweep = () => { if (reduced()) return; band.animate([{ transform: "translateX(-120%) skewX(-20deg)" }, { transform: "translateX(320%) skewX(-20deg)" }], { duration: 760, easing: EASE.inOut }); };
  const enter = (e) => { if (e.pointerType === "mouse") sweep(); };
  const down = (e) => { if (e.pointerType !== "mouse") sweep(); el.style.transform = reduced() ? "" : "scale(.97)"; el.style.filter = "brightness(.88)"; };
  const up = () => { el.style.transform = ""; el.style.filter = ""; };
  const evs = [["pointerenter", enter], ["focus", sweep], ["pointerdown", down], ["pointerup", up], ["pointerleave", up]]; evs.forEach(([e, f]) => el.addEventListener(e, f));
  return () => { evs.forEach(([e, f]) => el.removeEventListener(e, f)); band.remove(); };
}
export const mountShimmerButton = (root) => mountAll("shimmer-button", mount, root);
mountShimmerButton();
