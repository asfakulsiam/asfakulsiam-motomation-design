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
// cells are graphemes (Intl.Segmenter, code points as the fallback), so a Bangla cluster or an emoji is one cell
const SEG = typeof Intl !== "undefined" && Intl.Segmenter ? new Intl.Segmenter(undefined, { granularity: "grapheme" }) : null;
const graphemes = (s) => (SEG ? Array.from(SEG.segment(s), (x) => x.segment) : Array.from(s));

export function mount(el) {
  const alphabet = graphemes(el.dataset.alphabet || ABC), stepMs = +(el.dataset.stepMs ?? 45), cls = partClass(el, "cell", "mm-split-flap__cell");
  const live = srOnly(el.dataset.value || el.textContent.trim()); live.setAttribute("aria-live", "polite");
  const cellsBox = document.createElement("span"); cellsBox.setAttribute("aria-hidden", "true"); cellsBox.style.display = "contents";
  el.textContent = ""; el.append(live, cellsBox);
  let cells = (el.dataset.value || "").toUpperCase(), timer = 0;
  const paint = (s) => { cellsBox.replaceChildren(...graphemes(s).map((c) => { const x = document.createElement("span"); x.className = cls; x.textContent = c === " " ? "\u00a0" : c; return x; })); };
  const go = (value) => {
    const target = value.toUpperCase(); live.textContent = value; clearInterval(timer);
    if (reduced()) { cells = target; paint(cells); return; }
    const want = graphemes(target), have = graphemes(cells); let cur = want.map((_, i) => have[i] ?? " "), tick = 0;
    timer = setInterval(() => {
      tick++; let done = true;
      // a glyph the alphabet can't reach ("/", "ক", an emoji) lands directly; so does a cell starting from one
      cur = cur.map((c, i) => { if (c === want[i] || tick < i * 2) { if (c !== want[i]) done = false; return c; } const at = alphabet.indexOf(c); if (at < 0 || !alphabet.includes(want[i])) return want[i]; done = false; return alphabet[(at + 1) % alphabet.length]; });
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
