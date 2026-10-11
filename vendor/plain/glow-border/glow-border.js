// @motomation-variant
// id: glow-border
// react: skills/asfakulsiam-motomation-design/examples/components/ui/glow-border.tsx
// markup: <div data-mm="glow-border" [data-reach="220" data-color="#ffcf7a" data-lamp-class]><div class="…surface">…</div></div>
// behaviour: a soft lamp (radial gradient, 2×reach wide) sits behind a solid inner surface and follows the pointer
//   anywhere on the page, so only the 1-border-wide gap lights up nearest the pointer. It moves by transform; the
//   listener runs only while the card is within 120 px of the screen.
// reduced-motion: A steady, faint border.  touch: A steady, faint border; the light follows a dragging finger.
import { inView, reduced, partClass, mountAll } from "../_lib/motion.js";

export function mount(el) {
  const reach = +(el.dataset.reach ?? 220), color = el.dataset.color || "var(--mm-glow-color, #ffcf7a)";
  const lamp = document.createElement("span"); lamp.setAttribute("aria-hidden", "true"); lamp.className = partClass(el, "lamp", "mm-glow-border__lamp");
  Object.assign(lamp.style, { width: `${reach * 2}px`, height: `${reach * 2}px`, transform: "translate(-9999px, -9999px)", background: `radial-gradient(closest-side, ${color}, transparent)` });
  el.prepend(lamp);
  if (reduced()) return () => lamp.remove();
  let raf = 0, x = -9999, y = -9999, listening = false;
  const paint = () => { raf = 0; const r = el.getBoundingClientRect(); lamp.style.transform = `translate(${x - r.left - reach}px, ${y - r.top - reach}px)`; };
  const on = (e) => { x = e.clientX; y = e.clientY; if (!raf) raf = requestAnimationFrame(paint); };
  const stop = inView(el, (near) => { if (near && !listening) { addEventListener("pointermove", on, { passive: true }); listening = true; } else if (!near && listening) { removeEventListener("pointermove", on); listening = false; } }, { once: false, margin: "120px" });
  return () => { stop(); removeEventListener("pointermove", on); cancelAnimationFrame(raf); lamp.remove(); };
}
export const mountGlowBorder = (root) => mountAll("glow-border", mount, root);
mountGlowBorder();
