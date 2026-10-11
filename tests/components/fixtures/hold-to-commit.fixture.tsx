// Test fixture: mounts HoldToCommit and exposes hooks the interaction test reads.
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { HoldToCommit } from "../../../skills/asfakulsiam-motomation-design/examples/components/micro/hold-to-commit";

declare global { interface Window { __commits: number; __unmount: () => void; __pendingRaf: () => number } }
window.__commits = 0;
// count rAF callbacks scheduled but not yet run or cancelled
const pending = new Set<number>(); const raf = window.requestAnimationFrame.bind(window); const caf = window.cancelAnimationFrame.bind(window);
window.requestAnimationFrame = (cb) => { const id = raf((t) => { pending.delete(id); cb(t); }); pending.add(id); return id; };
window.cancelAnimationFrame = (id) => { pending.delete(id); caf(id); };
window.__pendingRaf = () => pending.size;

function App() {
  const [mounted, setMounted] = useState(true);
  window.__unmount = () => setMounted(false);
  return <main style={{ padding: 40 }}>{mounted ? <HoldToCommit label="Hold to delete" doneLabel="Deleted" holdMs={1200} onCommit={() => { window.__commits++; }} /> : <p>Another page</p>}</main>;
}
createRoot(document.getElementById("root")!).render(<App />);
