// Interaction test page (tests/components/interaction.test.mjs): mounts one component's gallery demo into #stage and
// unmounts it on demand. The page script (in the test) wraps requestAnimationFrame and window/document listeners
// before this bundle runs, so the test can see what a component leaves behind.
import { createRoot, type Root } from "react-dom/client";
import { useEffect, type ReactElement } from "react";
import { DEMOS } from "../../../skills/asfakulsiam-motomation-design/examples/gallery/demos";

// negative control (not a component): a listener and a frame loop with no cleanup, and a button without a focus ring
function Leak() {
  useEffect(() => { window.addEventListener("pointermove", () => {}); const loop = () => requestAnimationFrame(loop); loop(); }, []);
  return <button type="button" style={{ outline: "none", boxShadow: "none" }}>leak</button>;
}
const CONTROL: Record<string, () => ReactElement> = { "__control-leak": () => <Leak /> };

let root: Root | null = null;
declare global { interface Window { __mount: (id: string) => boolean; __unmount: () => void; __ids: () => string[] } }
window.__mount = (id) => { const d = DEMOS[id] || CONTROL[id]; const el = document.getElementById("stage"); if (!d || !el) return false; root?.unmount(); root = createRoot(el); root.render(<div data-demo={id}>{d()}</div>); return true; };
window.__unmount = () => { root?.unmount(); root = null; };
window.__ids = () => Object.keys(DEMOS);
// warm-up: React adds its one-time document listeners (selectionchange) on the first root; done before the baseline
declare global { interface Window { __warm: () => void } }
window.__warm = () => { const el = document.createElement("div"); document.body.append(el); const r = createRoot(el); r.render(<span />); setTimeout(() => { r.unmount(); el.remove(); }, 0); };
