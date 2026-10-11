// @motomation-template
// id: org
// name: River Commons — a public trust for Bangladesh's rivers
// kind: public-interest organisation
// archetype: manifesto
// mutation: constraint
// signature: seismograph-line
// sections: hero-org-manifesto, features-org-impact, team-org-field-guide, cta-org-donate, footer-org-seismograph
// fonts: display "Gloock" · text "Schibsted Grotesk" · mono "JetBrains Mono"
// theme: --ground:#eef0ea;--surface:#f7f8f4;--ink:#142023;--muted:#4a5658;--line:rgba(20,32,35,.16);--accent:#1d5a73
// what: A river trust's case in one page: the claim, a year of audited hearings, the people who watch the banks, gifts tied to real costs, and the registration a donor checks.
import { HeroOrgManifesto } from "../../sections/hero-org-manifesto";
import { FeaturesOrgImpact } from "../../sections/features-org-impact";
import { TeamOrgFieldGuide } from "../../sections/team-org-field-guide";
import { CtaOrgDonate } from "../../sections/cta-org-donate";
import { FooterOrgSeismograph } from "../../sections/footer-org-seismograph";

export function Page() {
  return (
    <>
      <main id="main">
        <HeroOrgManifesto />
        <FeaturesOrgImpact />
        <TeamOrgFieldGuide />
        <CtaOrgDonate />
      </main>
      <footer>
        <FooterOrgSeismograph />
      </footer>
    </>
  );
}
