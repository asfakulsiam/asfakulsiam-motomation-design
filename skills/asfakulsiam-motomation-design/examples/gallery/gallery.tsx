// Motomation component gallery: every component in examples/components, live, on one page.
// Built into a single self-contained index.html by scripts/build-gallery.mjs (esbuild). Open index.html directly.
// The demos live in demos.tsx (shared with the docs site). The toolbar filters the cards, switches reduced motion for
// every component live, and opens the page in a 375 px frame (?frame=1: the same gallery without the toolbar).
import { rmNow, setRM } from "./rm"; // first: installs the reduced-motion override the toolbar switch drives
import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { ReadingRail } from "../components/scroll/reading-rail";
import { LetterRelay } from "../components/type/letter-relay";
import { StickyIndex } from "../components/layout/sticky-index";
import { CopyButton } from "../components/micro/copy-button";
import { DEMOS, FAMILY_TITLES, RAW } from "./demos";

declare const CATALOGUE: { id: string; name: string; family: string; tier: string; what: string; use_when: string; avoid_when: string; reduced_motion: string; file: string }[];

const FRAME = new URLSearchParams(location.search).has("frame");
const matches = (c: (typeof CATALOGUE)[number], q: string) => { const h = `${c.name} ${c.id} ${c.family} ${FAMILY_TITLES[c.family]} tier ${c.tier} ${c.what} ${c.use_when}`.toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => h.includes(w)); };

function Toolbar({ q, setQ, shown }: { q: string; setQ: (v: string) => void; shown: number }) {
  const [rm, setRm] = useState(rmNow()); const [mobile, setMobile] = useState(false);
  useEffect(() => { document.body.style.overflow = mobile ? "hidden" : ""; if (!mobile) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") setMobile(false); }; addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, [mobile]);
  return (
    <div className="toolbar" role="search">
      <label className="tb-search"><span className="sr-only">Search components</span>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${CATALOGUE.length} components`} autoComplete="off" /></label>
      <p className="tb-count" role="status">{q ? `${shown} of ${CATALOGUE.length}` : `${CATALOGUE.length} components`}</p>
      <button type="button" role="switch" aria-checked={rm} className="tb-switch" onClick={() => { setRM(!rm); setRm(!rm); }}><span aria-hidden="true" className="tb-track"><span /></span>Reduced motion</button>
      <button type="button" className="tb-btn" aria-pressed={mobile} onClick={() => setMobile(!mobile)}>{mobile ? "Close mobile preview" : "Mobile 375"}</button>
      {mobile && createPortal(<div className="tb-phone" role="dialog" aria-label="Mobile preview, 375 pixels wide"><button type="button" className="tb-btn tb-close" onClick={() => setMobile(false)}>Close</button><iframe title="The gallery at 375 pixels wide" src={`?frame=1&rm=${rm ? 1 : 0}${location.hash}`} width={395} height={760} /></div>, document.body)}
    </div>
  );
}

function App() {
  const main = useRef<HTMLElement>(null);
  const [q, setQ] = useState(""); const [, bump] = useState(0);
  useEffect(() => { const f = () => bump((x) => x + 1); addEventListener("mm-rm", f); return () => removeEventListener("mm-rm", f); }, []);
  const list = CATALOGUE.filter((c) => matches(c, q));
  const families = Object.keys(FAMILY_TITLES).filter((f) => list.some((c) => c.family === f));
  return (
    <>
      <a href="#library" className="skip">Skip to the components</a>
      {!FRAME && <Toolbar q={q} setQ={setQ} shown={list.length} />}
      <ReadingRail target={main} />
      <LetterRelay name="Motomation" heroSize="clamp(3.4rem, 17vw, 13rem)" href="#top" />
      <p className="lede"><strong className="lede-head">Components.</strong> {CATALOGUE.length} motion components for the Motomation Design skill, written from scratch. Each one has props with defaults, a reduced-motion path and a touch behaviour. Switch on reduced motion in the toolbar (or in your system settings) to see every fallback.</p>
      <div className="layout">
        <StickyIndex label="Families" sections={families.map((f) => ({ id: `family-${f}`, label: FAMILY_TITLES[f] }))} />
        <main id="library" ref={main}>
          {families.map((f) => (
            <section key={f} id={`family-${f}`} aria-labelledby={`h-${f}`}>
              <h2 id={`h-${f}`} className="family">{FAMILY_TITLES[f]}</h2>
              {list.filter((c) => c.family === f).map((c) => (
                <article key={c.id} id={c.id} className="card" aria-labelledby={`t-${c.id}`}>
                  <header className="card-head">
                    <h3 id={`t-${c.id}`}>{c.name}</h3>
                    <span className="tier">Tier {c.tier}</span>
                  </header>
                  <p className="what">{c.what}</p>
                  <div className="stage">{DEMOS[c.id] ? DEMOS[c.id]() : <p>No demo.</p>}</div>
                  <dl className="notes">
                    <div><dt>Use when</dt><dd>{c.use_when}</dd></div>
                    <div><dt>Avoid when</dt><dd>{c.avoid_when}</dd></div>
                    <div><dt>Reduced motion</dt><dd>{c.reduced_motion}</dd></div>
                  </dl>
                  <p className="file"><code>{c.file}</code> <CopyButton label="Copy install command" text={`npx shadcn@latest add ${RAW}/registry/${c.id}.json`} style={{ fontSize: 13, padding: "4px 10px" }} /></p>
                </article>
              ))}
            </section>
          ))}
          {!list.length && <p className="what">Nothing matches “{q}”. Try a family (“scroll”, “cursor”) or a material (“paper”, “metal”).</p>}
        </main>
      </div>
      <footer className="foot"><p>Motomation Design by asfakulsiam · MIT · <a href="https://github.com/asfakulsiam/asfakulsiam-motomation-design">github.com/asfakulsiam/asfakulsiam-motomation-design</a></p></footer>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
