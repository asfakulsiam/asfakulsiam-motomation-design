// @motomation-template
// id: saas-landing
// name: Tally · bookkeeping in Bangla and English for small shops
// kind: SaaS landing
// archetype: workbench
// mutation: ui-is-content
// signature: ink-fill
// sections: hero-saas-workbench, features-saas-bento, features-saas-console, testimonial-saas-ink, pricing-saas-switch, cta-saas-trial
// fonts: display "Bricolage Grotesque" · text "Hanken Grotesk" · mono "JetBrains Mono"
// theme: --ground:#f3f1ea;--surface:#fbfaf6;--ink:#15201b;--muted:#4c5751;--line:rgba(21,32,27,.15);--accent:#1f6b4f
// what: A bookkeeping app for corner shops where the product is the page: the day's ledger, the four screens, the export line, one customer's evening, two plans.
import { HeroSaasWorkbench } from "../../sections/hero-saas-workbench";
import { FeaturesSaasBento } from "../../sections/features-saas-bento";
import { FeaturesSaasConsole } from "../../sections/features-saas-console";
import { TestimonialSaasInk } from "../../sections/testimonial-saas-ink";
import { PricingSaasSwitch } from "../../sections/pricing-saas-switch";
import { CtaSaasTrial } from "../../sections/cta-saas-trial";

export function Page() {
  return (
    <>
      <main id="main">
        <HeroSaasWorkbench />
        <FeaturesSaasBento />
        <FeaturesSaasConsole />
        <TestimonialSaasInk />
        <PricingSaasSwitch />
        <CtaSaasTrial />
      </main>
    </>
  );
}
