// @motomation-variant
// id: flowing-menu
// react: skills/asfakulsiam-motomation-design/examples/components/layout/flowing-menu.tsx
// markup: <nav data-mm="flowing-menu" aria-label="Projects" [data-band-class]><ul><li><a href="…" data-marquee="…">Label</a></li>…</ul></nav>
// behaviour: with a fine pointer, entering a row floods it with an inverted band from the edge the pointer came in by
//   (top or bottom half), and the band carries a slow marquee of the row's data-marquee text (12 s per loop); leaving
//   sends it back out. The band and marquee are aria-hidden; the links are a normal list.
// reduced-motion: Hover shows the band instantly with still text.  touch: Plain links (the browser's own pressed state).
import { reduced, finePointer, partClass, EASE, mountAll } from "../_lib/motion.js";

export function mount(el) {
  const rows = [...el.querySelectorAll("li")]; let hot = null; const flows = new Map();
  const bands = rows.map((li) => {
    const a = li.querySelector("a"); const band = document.createElement("span"); band.setAttribute("aria-hidden", "true"); band.className = partClass(el, "band", "mm-flowing-menu__band");
    const run = document.createElement("span"); run.className = partClass(el, "run", "mm-flowing-menu__run");
    for (let k = 0; k < 6; k++) { const s = document.createElement("span"); s.style.paddingRight = "1.5em"; s.textContent = a?.dataset.marquee || a?.textContent || ""; run.append(s); }
    band.append(run); li.append(band); return { band, run };
  });
  const paint = () => bands.forEach(({ band, run }, i) => {
    const on = hot?.i === i, r = reduced();
    band.style.transition = r ? "none" : `transform 260ms ${EASE.out}`;
    band.style.transform = on ? "translateY(0)" : `translateY(${hot?.from === "bottom" || (!on && hot?.i !== i) ? "101%" : "-101%"})`;
    if (on && !r && !flows.has(i)) flows.set(i, run.animate([{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }], { duration: 12000, iterations: Infinity, easing: "linear" }));
    if ((!on || r) && flows.has(i)) { flows.get(i).cancel(); flows.delete(i); }
  });
  const offs = rows.flatMap((li, i) => {
    const enter = (e) => { if (!finePointer()) return; const r = li.getBoundingClientRect(); hot = { i, from: e.clientY - r.top < r.height / 2 ? "top" : "bottom" }; paint(); };
    const leave = () => { hot = null; paint(); };
    li.addEventListener("pointerenter", enter); li.addEventListener("pointerleave", leave);
    return [() => li.removeEventListener("pointerenter", enter), () => li.removeEventListener("pointerleave", leave)];
  });
  paint();
  return () => { offs.forEach((f) => f()); bands.forEach(({ band }) => band.remove()); flows.forEach((a) => a.cancel()); };
}
export const mountFlowingMenu = (root) => mountAll("flowing-menu", mount, root);
mountFlowingMenu();
