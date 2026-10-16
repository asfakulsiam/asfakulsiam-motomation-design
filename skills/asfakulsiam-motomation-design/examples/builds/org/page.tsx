// @motomation-template
// id: org
// name: River Commons · a public trust for Bangladesh's rivers
// kind: public-interest organisation
// archetype: manifesto
// mutation: constraint
// signature: seismograph-line
// sections: hero-org-manifesto, team-org-field-guide, features-org-impact, cta-org-donate, footer-org-seismograph
// fonts: display "Gloock" · text "Schibsted Grotesk" · mono "JetBrains Mono"
// theme: --ground:#dfe9e6;--surface:#eef4f2;--ink:#0d2830;--muted:#3b5a60;--line:rgba(13,40,48,.22);--accent:#0b5a72;--display-scale:.92;--display-lh:1.08;--display-track:-.01em;--label-font:var(--font-text);--label-size:13px;--label-track:.01em;--label-case:none;--label-weight:700;--body-size:18px;--body-lh:1.72
// what: A river trust's case in one page: the claim, the people who watch the banks, a year of hearings, gifts tied to real costs, and its papers.
import { HeroOrgManifesto } from "../../sections/hero-org-manifesto";
import { TeamOrgFieldGuide } from "../../sections/team-org-field-guide";
import { FeaturesOrgImpact } from "../../sections/features-org-impact";
import { CtaOrgDonate } from "../../sections/cta-org-donate";
import { FooterOrgSeismograph } from "../../sections/footer-org-seismograph";

// Navigation: a full-width top bar that scrolls away with the page (a trust is read, not operated), three plain links
// and a disclosure that opens the trust's registration and audit details in place. The trust's papers (annual report,
// court cases) are a footer list under the gauge line, outside the article, where a careful donor looks last; the
// footer is the page's contentinfo landmark, so it is reachable as its own region. Feedback: links gain a rule under
// them on hover (a border, not an underline), a pressed link fills with the river tint, focus is a soft ring.
const CSS = `
.bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px 28px;padding:14px clamp(20px,5vw,72px);border-bottom:2px solid var(--ink);background:var(--surface)}
.bar strong{font:400 22px/1 var(--font-display);margin-right:auto}
.bar nav{display:flex;flex-wrap:wrap;gap:4px 22px}
.bar a{display:inline-flex;align-items:center;min-height:44px;text-decoration:none;border-bottom:2px solid transparent}
.bar a:hover{border-bottom-color:var(--accent)}
.bar a:active{background:rgba(11,90,114,.14)}
.bar details{position:relative}
.bar summary{cursor:pointer;min-height:44px;display:inline-flex;align-items:center;font-weight:700}
@media (max-width:640px){.bar details p{position:static!important;width:auto!important}}
.bar details p{position:absolute;right:0;z-index:10;margin:6px 0 0;padding:14px 16px;width:min(320px,80vw);background:var(--surface);border:2px solid var(--ink);font-size:15px;line-height:1.6}
:focus-visible{outline:none;box-shadow:0 0 0 3px var(--surface),0 0 0 6px var(--accent);border-radius:2px}
`;

export function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header className="bar">
        <strong>River Commons</strong>
        <nav aria-label="This page"><a href="#team-org-field-guide">Watchers</a><a href="#features-org-impact">Hearings</a><a href="#cta-org-donate">Give</a></nav>
        <details><summary>The trust's papers</summary><p>NGOAB registration 3127 (2017). Accounts audited by Hoda Vasi, 2025. The annual report and the case list are in the footer.</p></details>
      </header>
      <main id="main">
        <HeroOrgManifesto />
        <TeamOrgFieldGuide />
        <FeaturesOrgImpact />
        <CtaOrgDonate />
      </main>
      <footer>
        <FooterOrgSeismograph />
      </footer>
    </>
  );
}
