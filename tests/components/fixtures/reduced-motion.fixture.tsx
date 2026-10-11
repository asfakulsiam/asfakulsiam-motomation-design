// Fixture for reduced-motion.test.mjs: records the reduced-motion value on every render, and every text the Decode
// label shows, so the test can prove that a reduced-motion user never gets an animated render.
import { createRoot } from "react-dom/client";
import { useReducedMotion } from "../../../skills/asfakulsiam-motomation-design/examples/components/_lib/motion";
import { Decode } from "../../../skills/asfakulsiam-motomation-design/examples/components/type/decode";
import { BlurFocus } from "../../../skills/asfakulsiam-motomation-design/examples/components/type/blur-focus";
declare global { interface Window { __renders: boolean[]; __shown: string[]; __blur: string[]; __painted: string[] } }
window.__renders = []; window.__shown = []; window.__blur = []; window.__painted = [];
function Probe() { const r = useReducedMotion(); window.__renders.push(r); return <p id="probe">{r ? "reduced" : "motion"}</p>; }
function App() { return (<main><Probe /><h2 id="label"><Decode text="SIGNAL FOUND" /></h2><div id="blur"><BlurFocus text="Quiet words arrive" /></div></main>); }
createRoot(document.getElementById("root")!).render(<App />);
// every text the label shows, from the first commit on
new MutationObserver(() => { const t = document.querySelector("#label [aria-hidden]")?.textContent ?? document.querySelector("#label")?.textContent ?? ""; if (window.__shown[window.__shown.length - 1] !== t) window.__shown.push(t); })
  .observe(document.getElementById("root")!, { subtree: true, childList: true, characterData: true });
// every style the BlurFocus words get (filter + opacity), including the first commit
new MutationObserver(() => { const s = document.querySelector("#blur span") as HTMLElement | null; if (!s) return; const v = `${s.style.filter} ${s.style.opacity}`; if (window.__blur[window.__blur.length - 1] !== v) window.__blur.push(v); })
  .observe(document.getElementById("root")!, { subtree: true, childList: true, attributes: true, attributeFilter: ["style"] });
// what each painted frame shows (sampled on every animation frame for the first 40 frames): a commit that never
// reaches a frame is invisible; one that does is a flash the user sees
let frames = 0; const sample = () => { const s = document.querySelector("#blur span") as HTMLElement | null; window.__painted.push(s ? `${s.style.filter} ${s.style.opacity}` : "(not mounted)"); if (++frames < 40) requestAnimationFrame(sample); };
requestAnimationFrame(sample);
