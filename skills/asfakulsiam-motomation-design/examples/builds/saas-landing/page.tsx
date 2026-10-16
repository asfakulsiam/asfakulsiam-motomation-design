// @motomation-template
// id: saas-landing
// name: Tally · bookkeeping in Bangla and English for small shops
// kind: SaaS landing
// archetype: workbench
// mutation: ui-is-content
// signature: ink-fill
// sections: hero-saas-workbench, features-saas-console, features-saas-bento, pricing-saas-switch, testimonial-saas-ink, cta-saas-trial
// fonts: display "Bricolage Grotesque" · text "JetBrains Mono" · mono "JetBrains Mono"
// theme: --ground:#ffffff;--surface:#f1f6f2;--ink:#0d1a13;--muted:#3f5247;--line:rgba(13,26,19,.14);--accent:#11724a;--display-scale:1.02;--display-lh:.94;--display-track:-.045em;--display-weight:700;--label-font:var(--font-display);--label-size:12px;--label-track:.04em;--label-weight:700;--body-size:14px;--body-lh:1.52
// what: Bookkeeping for corner shops where the product is the page: the day's ledger, a one-line export, four screens, two plans and one customer's evening.
import { useState } from "react";
import { HeroSaasWorkbench } from "../../sections/hero-saas-workbench";
import { FeaturesSaasConsole } from "../../sections/features-saas-console";
import { FeaturesSaasBento } from "../../sections/features-saas-bento";
import { PricingSaasSwitch } from "../../sections/pricing-saas-switch";
import { TestimonialSaasInk } from "../../sections/testimonial-saas-ink";
import { CtaSaasTrial } from "../../sections/cta-saas-trial";

// Navigation: a fixed app bar (the product is software, so the page behaves like it) with two destinations and a
// menu button that opens them on phones. Feedback: controls lift with a shadow on hover and press down flat, focus is
// a green border with a halo.
const CSS = `
.appbar{position:fixed;inset:0 0 auto 0;z-index:40;display:flex;align-items:center;gap:16px;height:60px;padding:0 clamp(16px,4vw,40px);background:#fff;border-bottom:1px solid var(--line)}
.appbar b{font:700 20px/1 var(--font-display);letter-spacing:-.04em;margin-right:auto}
.appbar .menu{display:flex;gap:8px}
.appbar a,.appbar button{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border:1px solid var(--line);border-radius:8px;background:#fff;color:var(--ink);font:600 13px/1 var(--font-text);text-decoration:none;cursor:pointer}
.appbar a:hover,.appbar button:hover{box-shadow:0 6px 16px rgba(13,26,19,.14);transform:translateY(-2px)}
.appbar a:active,.appbar button:active{box-shadow:none;transform:translateY(1px)}
.appbar .toggle{display:none}
:focus-visible{outline:none;border-color:var(--accent)!important;box-shadow:0 0 0 4px rgba(17,114,74,.28)}
.p-saas{padding-top:60px}
@media (max-width:720px){.appbar .toggle{display:inline-flex}.appbar .menu{position:absolute;top:60px;right:12px;flex-direction:column;padding:10px;background:#fff;border:1px solid var(--line);border-radius:10px}.appbar .menu[data-open="false"]{display:none}}
@media (prefers-reduced-motion:reduce){.appbar a:hover,.appbar button:hover,.appbar a:active,.appbar button:active{transform:none}}
`;

export function Page() {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-saas">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header className="appbar">
        <b>Tally</b>
        <button className="toggle" type="button" aria-expanded={open} aria-controls="appmenu" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button>
        <nav id="appmenu" className="menu" aria-label="Tally" data-open={open ? "true" : "false"}><a href="#pricing-saas-switch">Plans</a><a href="#cta-saas-trial">Start free</a></nav>
      </header>
      <main id="main">
        <HeroSaasWorkbench />
        <FeaturesSaasConsole />
        <FeaturesSaasBento />
        <PricingSaasSwitch />
        <TestimonialSaasInk />
        <CtaSaasTrial />
      </main>
    </div>
  );
}
