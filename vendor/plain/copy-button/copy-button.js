// @motomation-variant
// id: copy-button
// react: skills/asfakulsiam-motomation-design/examples/components/micro/copy-button.tsx
// markup: <button type="button" data-mm="copy-button" data-text="…" [data-label="Copy"]><svg …><path d="M5 5h8v8H5zM3 11V3h8"/></svg><span>Copy</span></button>
// behaviour: copies data-text (Clipboard API, falling back to a selected textarea + execCommand), then for 2 s the icon
//   morphs to a tick, the label reads "Copied" and an aria-live region announces it.
// reduced-motion: The tick swaps in without the morph (the CSS turns the path transition off).  touch: Same as desktop.
import { srOnly, mountAll } from "../_lib/motion.js";
const COPY = "M5 5h8v8H5zM3 11V3h8", TICK = "M3 8.5l3 3 7-7";

export function mount(el) {
  const label = el.dataset.label || "Copy", path = el.querySelector("path"), text = el.querySelector("span:not([aria-live])") || el.appendChild(document.createElement("span"));
  const live = srOnly(""); live.setAttribute("aria-live", "polite"); el.append(live);
  let t = 0;
  const copy = async () => {
    try { await navigator.clipboard.writeText(el.dataset.text || ""); }
    catch { const ta = document.createElement("textarea"); ta.value = el.dataset.text || ""; document.body.appendChild(ta); ta.select(); document.execCommand?.("copy"); ta.remove(); }
    path?.setAttribute("d", TICK); path && (path.style.d = `path("${TICK}")`); text.textContent = "Copied"; live.textContent = "Copied";
    clearTimeout(t); t = setTimeout(() => { path?.setAttribute("d", COPY); path && (path.style.d = `path("${COPY}")`); text.textContent = label; live.textContent = ""; }, 2000);
  };
  el.addEventListener("click", copy);
  return () => { el.removeEventListener("click", copy); clearTimeout(t); };
}
export const mountCopyButton = (root) => mountAll("copy-button", mount, root);
mountCopyButton();
