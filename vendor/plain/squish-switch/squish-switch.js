// @motomation-variant
// id: squish-switch
// react: skills/asfakulsiam-motomation-design/examples/components/micro/squish-switch.tsx
// markup: <label><button type="button" role="switch" aria-checked="false" data-mm="squish-switch"><span aria-hidden="true"></span></button><span>Label</span></label>
// behaviour: a real switch button. Pressing stretches the knob (24 → 32 px) toward where it's going; releasing slides it
//   across (220 ms ease-out). Fires a "change" event with detail.on, and keeps aria-checked in step.
// reduced-motion: The knob moves without stretching (120 ms linear).  touch: Same as desktop.
import { reduced, EASE, mountAll } from "../_lib/motion.js";

export function mount(el) {
  const knob = el.querySelector("span"); let press = false;
  const paint = () => { const on = el.getAttribute("aria-checked") === "true", r = reduced();
    knob.style.width = `${press && !r ? 32 : 24}px`; knob.style.transform = `translateX(${on ? (press && !r ? 14 : 22) : 0}px)`;
    knob.style.transition = r ? "transform 120ms linear" : `transform 220ms ${EASE.out}, width 140ms ${EASE.out}`; };
  const click = () => { const on = el.getAttribute("aria-checked") !== "true"; el.setAttribute("aria-checked", String(on)); paint(); el.dispatchEvent(new CustomEvent("change", { bubbles: true, detail: { on } })); };
  const down = () => { press = true; paint(); }, up = () => { press = false; paint(); };
  const evs = [["click", click], ["pointerdown", down], ["pointerup", up], ["pointerleave", up]]; evs.forEach(([e, f]) => el.addEventListener(e, f));
  paint();
  return () => evs.forEach(([e, f]) => el.removeEventListener(e, f));
}
export const mountSquishSwitch = (root) => mountAll("squish-switch", mount, root);
mountSquishSwitch();
