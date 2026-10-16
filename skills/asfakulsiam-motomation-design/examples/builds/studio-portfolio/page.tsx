// @motomation-template
// id: studio-portfolio
// name: Hawa Studio · design for public institutions, Dhaka
// kind: portfolio (studio)
// archetype: ledger
// mutation: swap-material
// signature: lens
// sections: hero-studio-ledger, team-studio-rows, features-studio-services, contact-studio-copy, footer-studio-marquee
// fonts: display "JetBrains Mono" · text "Hanken Grotesk" · mono "JetBrains Mono"
// theme: --ground:#fbfbf7;--surface:#ffffff;--ink:#141414;--muted:#4d4d4a;--line:rgba(179,36,26,.35);--accent:#b3241a;--display-scale:.74;--display-lh:1.12;--display-track:-.03em;--label-font:var(--font-text);--label-size:12px;--label-track:.1em;--label-weight:800;--body-size:16px;--body-lh:1.5
// what: A design studio kept as its account book on ledger paper: projects as entries, the people at the table, fixed-shape services and how to start one.
import { useRef } from "react";
import { HeroStudioLedger } from "../../sections/hero-studio-ledger";
import { TeamStudioRows } from "../../sections/team-studio-rows";
import { FeaturesStudioServices } from "../../sections/features-studio-services";
import { ContactStudioCopy } from "../../sections/contact-studio-copy";
import { FooterStudioMarquee } from "../../sections/footer-studio-marquee";

// Navigation: a dock fixed at the bottom centre, four ledger tabs and a "Start" button that opens a dialog with the
// address to write to. Feedback: a tab inverts (ink fill, paper text) on hover, a press lifts it and fades it a
// little, focus is a red rule under the tab plus a red halo. Image: the studio drawing is cut like a ledger card,
// its top-right corner notched off.
const CSS = `
body{padding-bottom:calc(76px + 4vh)}
.dock{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:40;display:flex;gap:2px;padding:4px;background:var(--surface);border:1px solid var(--ink);box-shadow:4px 4px 0 var(--accent)}
@media (max-height:560px){.dock{position:static!important;transform:none!important;margin:24px auto!important;width:max-content;max-width:100%}body{padding-bottom:0}}
.dock a,.dock button{display:inline-flex;align-items:center;min-height:44px;padding:0 14px;border:0;background:transparent;color:var(--ink);font:700 12px/1 var(--font-text);letter-spacing:.1em;text-transform:uppercase;text-decoration:none;cursor:pointer}
.dock a:hover,.dock button:hover{background:var(--ink);color:var(--surface)}
.dock a:active,.dock button:active{opacity:.7;transform:translateY(-2px)}
:focus-visible{outline:none;box-shadow:0 0 0 3px rgba(179,36,26,.4);text-decoration:underline 2px var(--accent);text-underline-offset:6px}
.p-studio{padding-bottom:84px}
#team-studio-rows img{clip-path:polygon(0 0,calc(100% - 36px) 0,100% 36px,100% 100%,0 100%)}
.start{max-width:min(440px,90vw);padding:28px;border:1px solid var(--ink);box-shadow:6px 6px 0 var(--accent);background:var(--surface);color:var(--ink)}
.start::backdrop{background:rgba(20,20,20,.45)}
.start a{color:var(--accent)}
.start button{margin-top:18px;min-height:44px;padding:0 18px;border:1px solid var(--ink);background:var(--surface);font:700 12px/1 var(--font-text);letter-spacing:.1em;text-transform:uppercase;cursor:pointer}
@media (max-width:480px){.dock a,.dock button{padding:0 9px;letter-spacing:.04em}}
@media (prefers-reduced-motion:reduce){.dock a:active,.dock button:active{transform:none}}
`;

export function Page() {
  const dlg = useRef<HTMLDialogElement>(null);
  return (
    <div className="p-studio">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <main id="main">
        <HeroStudioLedger />
        <TeamStudioRows />
        <FeaturesStudioServices />
        <ContactStudioCopy />
        <FooterStudioMarquee />
      </main>
      <nav className="dock" aria-label="Studio ledger">
        <a href="#studio-entries">Work</a><a href="#team-studio-rows">People</a><a href="#features-studio-services">Services</a>
        <button type="button" aria-haspopup="dialog" onClick={() => dlg.current?.showModal()}>Start</button>
      </nav>
      <dialog ref={dlg} className="start" aria-labelledby="start-title">
        <h2 id="start-title" style={{ margin: "0 0 12px", font: "400 22px/1.2 var(--font-display)" }}>Start a project</h2>
        <p style={{ margin: 0 }}>We take two new public projects a year. Write to <a href="mailto:work@hawa.studio">work@hawa.studio</a> with the institution, the brief and the date it must open.</p>
        <button type="button" onClick={() => dlg.current?.close()}>Close</button>
      </dialog>
    </div>
  );
}
