// @motomation-variant
// id: animated-list
// react: skills/asfakulsiam-motomation-design/examples/components/ui/animated-list.tsx
// markup: <ul data-mm="animated-list" [data-interval="900"]><li>…</li>…</ul>
// behaviour: entries arrive one at a time (first after 250 ms, then every `interval`) while the list is on screen, and
//   pause when it leaves. Every entry is in the DOM and laid out from the start (opacity 0 + a 14 px lift), so screen
//   readers read them all and the page never shifts.
// reduced-motion: Every entry is there from the start.  touch: Same as desktop.
import { inView, reduced, EASE, mountAll } from "../_lib/motion.js";

export function mount(el) {
  if (reduced()) return () => {};
  const items = [...el.children], interval = +(el.dataset.interval ?? 900); let shown = 0, t = 0, on = false;
  items.forEach((li) => { li.style.opacity = "0"; li.style.transform = "translateY(14px) scale(.98)"; li.style.transition = `opacity 360ms ${EASE.out}, transform 520ms ${EASE.outStrong}`; });
  const tick = () => { clearTimeout(t); if (!on || shown >= items.length) return; t = setTimeout(() => { const li = items[shown++]; li.style.opacity = "1"; li.style.transform = "none"; tick(); }, shown === 0 ? 250 : interval); };
  const stop = inView(el, (v) => { on = v; v ? tick() : clearTimeout(t); }, { once: false });
  return () => { stop(); clearTimeout(t); };
}
export const mountAnimatedList = (root) => mountAll("animated-list", mount, root);
mountAnimatedList();
