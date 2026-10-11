// Motomation component gallery: every component in examples/components, live, on one page.
// Built into a single self-contained index.html by scripts/build-gallery.mjs (esbuild). Open index.html directly.
// The demos live in demos.tsx (shared with the docs site).
import { useRef } from "react";
import { createRoot } from "react-dom/client";
import { ReadingRail } from "../components/scroll/reading-rail";
import { LetterRelay } from "../components/type/letter-relay";
import { StickyIndex } from "../components/layout/sticky-index";
import { CopyButton } from "../components/micro/copy-button";
import { DEMOS, FAMILY_TITLES, RAW } from "./demos";

declare const CATALOGUE: { id: string; name: string; family: string; tier: string; what: string; use_when: string; avoid_when: string; reduced_motion: string; file: string }[];

function App() {
  const main = useRef<HTMLElement>(null);
  const families = Object.keys(FAMILY_TITLES).filter((f) => CATALOGUE.some((c) => c.family === f));
  return (
    <>
      <a href="#library" className="skip">Skip to the components</a>
      <ReadingRail target={main} />
      <LetterRelay name="Motomation" heroSize="clamp(3.4rem, 17vw, 13rem)" href="#top" />
      <p className="lede"><strong className="lede-head">Components.</strong> {CATALOGUE.length} motion components for the Motomation Design skill, written from scratch. Each one has props with defaults, a reduced-motion path and a touch behaviour. Turn on reduced motion in your system settings and reload to see every fallback.</p>
      <div className="layout">
        <StickyIndex label="Families" sections={families.map((f) => ({ id: `family-${f}`, label: FAMILY_TITLES[f] }))} />
        <main id="library" ref={main}>
          {families.map((f) => (
            <section key={f} id={`family-${f}`} aria-labelledby={`h-${f}`}>
              <h2 id={`h-${f}`} className="family">{FAMILY_TITLES[f]}</h2>
              {CATALOGUE.filter((c) => c.family === f).map((c) => (
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
        </main>
      </div>
      <footer className="foot"><p>Motomation Design by asfakulsiam · MIT · <a href="https://github.com/asfakulsiam/asfakulsiam-motomation-design">github.com/asfakulsiam/asfakulsiam-motomation-design</a></p></footer>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
