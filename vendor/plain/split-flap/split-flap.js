// @motomation-variant
// id: split-flap
// react: skills/asfakulsiam-motomation-design/examples/components/type/split-flap.tsx
// markup: <span data-mm="split-flap" data-value="JAN 2027" [data-alphabet data-step-ms="45" data-cell-class]>JAN 2027</span>
// behaviour: shows its value in flap cells; when data-value changes (set it, or call el.mmSet("NEW")) each cell steps
//   through the alphabet to the new character, left to right with a 2-tick stagger, 45 ms per step. aria-live announces
//   the final value only; the flipping cells are aria-hidden.
// reduced-motion: Shows the new value at once.  touch: Same as desktop.
import { reduced, srOnly, partClass, mountAll } from "../_lib/motion.js";
const ABC = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:.-";

export function mount(el) {
  const alphabet = el.dataset.alphabet || ABC, stepMs = +(el.dataset.stepMs ?? 45), cls = partClass(el, "cell", "mm-split-flap__cell");
  const live = srOnly(el.dataset.value || el.textContent.trim()); live.setAttribute("aria-live", "polite");
  const cellsBox = document.createElement("span"); cellsBox.setAttribute("aria-hidden", "true"); cellsBox.style.display = "contents";
  el.textContent = ""; el.append(live, cellsBox);
  let cells = (el.dataset.value || "").toUpperCase(), timer = 0;
  const paint = (s) => { cellsBox.replaceChildren(...s.split("").map((c) => { const x = document.createElement("span"); x.className = cls; x.textContent = c === " " ? "\u00a0" : c; return x; })); };
  const go = (value) => {
    const target = value.toUpperCase(); live.textContent = value; clearInterval(timer);
    if (reduced()) { cells = target; paint(cells); return; }
    let cur = cells.padEnd(target.length, " ").slice(0, target.length).split(""), tick = 0;
    timer = setInterval(() => {
      tick++; let done = true;
      cur = cur.map((c, i) => { if (c === target[i] || tick < i * 2) { if (c !== target[i]) done = false; return c; } done = false; const at = alphabet.indexOf(c); return alphabet[(at + 1) % alphabet.length] ?? target[i]; });
      cells = cur.join(""); paint(cells); if (done) clearInterval(timer);
    }, stepMs);
  };
  paint(cells);
  el.mmSet = (v) => { el.dataset.value = v; };
  const mo = new MutationObserver(() => go(el.dataset.value || "")); mo.observe(el, { attributes: true, attributeFilter: ["data-value"] });
  return () => { mo.disconnect(); clearInterval(timer); };
}
export const mountSplitFlap = (root) => mountAll("split-flap", mount, root);
mountSplitFlap();
