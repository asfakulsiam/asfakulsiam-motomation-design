// Per-component demo page (v2.4.0, C1): one component's gallery demo, alone on a page, mountable and unmountable.
// tests/components/per-component.mjs bundles this once and writes a page per component that calls __mount(id).
import { createRoot, type Root } from "react-dom/client";
import { DEMOS } from "../../../skills/asfakulsiam-motomation-design/examples/gallery/demos";

let root: Root | null = null;
declare global { interface Window { __mount: (id: string) => boolean; __unmount: () => void; __MM_ID?: string } }
window.__mount = (id) => {
  const el = document.getElementById("stage"); const demo = DEMOS[id];
  if (!el || !demo) return false;
  root = createRoot(el); root.render(demo()); return true;
};
window.__unmount = () => { root?.unmount(); root = null; };
if (window.__MM_ID) window.__mount(window.__MM_ID);
