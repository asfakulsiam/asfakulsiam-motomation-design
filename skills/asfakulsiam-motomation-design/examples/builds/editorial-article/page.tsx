// @motomation-template
// id: editorial-article
// name: The river took the school · The Delta Review
// kind: editorial article
// archetype: broadsheet
// mutation: print-rule
// signature: remembered-list
// sections: hero-editorial-broadsheet, feature-editorial-pullquote, footer-editorial-folio
// fonts: display "Bodoni Moda" · text "Instrument Sans" · mono "JetBrains Mono"
// theme: --ground:#e8e6e0;--surface:#f2f1ec;--ink:#121212;--muted:#4a4844;--line:rgba(18,18,18,.22);--accent:#a3121a;--display-scale:1.18;--display-lh:.98;--display-track:-.015em;--display-weight:600;--label-font:var(--font-display);--label-size:14px;--label-track:.02em;--label-case:none;--label-style:italic;--body-size:16px;--body-lh:1.6
// what: A long-read set like a broadsheet on newsprint: a chapter rail, masthead, deck and columns, one pull quote that inks in, and a folio footer.
import { useEffect, useState } from "react";
import { HeroEditorialBroadsheet } from "../../sections/hero-editorial-broadsheet";
import { FeatureEditorialPullquote } from "../../sections/feature-editorial-pullquote";
import { FooterEditorialFolio } from "../../sections/footer-editorial-folio";

// Navigation: a chapter rail, sticky in the left margin on wide screens (a strip above the story on phones), with the
// three parts of the story (the one you are reading is marked) and a way back to the masthead at its foot. Feedback: rail entries underline on hover, a press turns
// the entry red, focus puts a yellow marker box behind it.
// Signature (remembered-list): the rail remembers the chapters you have read, on this device, and ticks them in the
// margin like a reader's pencil mark, so a long read put down on the bus is picked up at the right chapter. It is a
// state, not an animation: nothing moves; the mark is there when you come back.
const CSS = `
.p-ed{display:grid;grid-template-columns:200px minmax(0,1fr)}
.chapters{position:sticky;top:0;align-self:start;height:100vh;display:flex;flex-direction:column;justify-content:space-between;padding:28px 18px;border-right:1px solid var(--line);font:italic 400 15px/1.3 var(--font-display)}
.chapters ol{list-style:none;margin:0;padding:0;display:grid;gap:2px;counter-reset:ch}
.chapters li{counter-increment:ch}
.chapters a{display:flex;gap:8px;align-items:baseline;min-height:44px;padding:8px 0;text-decoration:none;color:var(--ink)}
.chapters ol a::before{content:counter(ch,upper-roman);font-style:normal;font-size:12px;color:var(--muted)}
.chapters a[aria-current]{font-weight:600}
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.chapters .tick{flex:none;width:12px;font:normal 400 13px/1 var(--font-text);color:var(--accent)}
.chapters a[aria-current]::after{content:"";flex:1;align-self:center;border-top:1px solid var(--ink)}
.chapters a:hover{text-decoration:underline 1px;text-underline-offset:4px}
.chapters a:active{color:var(--accent);text-decoration:underline 2px}
.chapters .turn{border-top:3px double var(--ink);padding-top:8px;font-size:14px}
:focus-visible{outline:2px solid var(--ink);outline-offset:1px;background:#f7e463}
@media (max-width:860px){.p-ed{grid-template-columns:1fr}.chapters{position:static;height:auto;flex-direction:row;flex-wrap:wrap;gap:4px 18px;padding:8px 16px;border-right:0;border-bottom:1px solid var(--line)}.chapters ol{display:flex;flex-wrap:wrap;gap:0 16px}.chapters .turn{border-top:0;padding-top:0}}
`;

const READ_KEY = "delta-review:river-took-the-school:read";
const CHAPTERS: [string, string][] = [["hero-editorial-broadsheet", "The night the river moved"], ["feature-editorial-pullquote", "The school on stilts"], ["footer-editorial-folio", "Folio"]];

export function Page() {
  // the rail marks the chapter you are reading (aria-current), from the section that crosses the middle of the screen
  const [at, setAt] = useState(CHAPTERS[0][0]);
  // the chapters read on this device (localStorage, this article only; no account, nothing sent)
  const [read, setRead] = useState<string[]>([]);
  useEffect(() => {
    let saved: string[] = [];
    try { saved = JSON.parse(localStorage.getItem(READ_KEY) || "[]"); } catch {}
    setRead(saved.filter((id) => CHAPTERS.some(([c]) => c === id)));
    const mark = (id: string) => setRead((r) => { if (r.includes(id)) return r; const next = [...r, id]; try { localStorage.setItem(READ_KEY, JSON.stringify(next)); } catch {} return next; });
    const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) { setAt(e.target.id); mark(e.target.id); } }, { rootMargin: "-50% 0px -50% 0px" });
    for (const [id] of CHAPTERS) { const el = document.getElementById(id); if (el) io.observe(el); }
    return () => io.disconnect();
  }, []);
  return (
    <div className="p-ed" id="top">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <aside className="chapters">
        <nav aria-label="Chapters"><ol>{CHAPTERS.map(([id, t]) => <li key={id}><a href={`#${id}`} aria-current={at === id ? "location" : undefined}><span className="tick" aria-hidden="true">{read.includes(id) ? "✓" : ""}</span>{t}{read.includes(id) ? <span className="sr-only"> (read)</span> : null}</a></li>)}</ol></nav>
        <a className="turn" href="#top">↑ Back to the masthead</a>
      </aside>
      <main id="main">
        <HeroEditorialBroadsheet />
        <FeatureEditorialPullquote />
        <FooterEditorialFolio />
      </main>
    </div>
  );
}
