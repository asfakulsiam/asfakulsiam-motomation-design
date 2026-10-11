// @motomation-variant
// id: count-up
// react: skills/asfakulsiam-motomation-design/examples/components/micro/count-up.tsx
// markup: <span data-mm="count-up" data-value="1260" [data-from="0" data-duration="1400" data-decimals="0" data-locale data-prefix data-suffix]>1,260</span>
// behaviour: counts from `from` to `value` once, when 20% into the viewport (ease-out quart). The visible text is the final
//   value before it counts (no-JS and screenshots never show 0); the final value is the accessible name throughout.
// reduced-motion: Shows the final value at once.  touch: Same as desktop.
import { inView, reduced, mountAll } from "../_lib/motion.js";

export function mount(el) {
  const d = el.dataset; const value = +d.value, from = +(d.from ?? 0), duration = +(d.duration ?? 1400), decimals = +(d.decimals ?? 0);
  const fmt = (n) => (d.prefix ?? "") + n.toLocaleString(d.locale || undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + (d.suffix ?? "");
  el.setAttribute("aria-label", fmt(value)); el.textContent = "";
  const shown = document.createElement("span"); shown.setAttribute("aria-hidden", "true"); shown.textContent = fmt(value); el.append(shown);
  let raf = 0;
  const stop = inView(el, () => {
    if (reduced()) return; const t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / duration), e = 1 - Math.pow(1 - k, 4); shown.textContent = fmt(from + (value - from) * e); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
  }, { margin: "0px 0px -20% 0px" });
  return () => { stop(); cancelAnimationFrame(raf); };
}
export const mountCountUp = (root) => mountAll("count-up", mount, root);
mountCountUp();
