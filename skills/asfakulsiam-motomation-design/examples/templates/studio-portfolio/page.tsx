// @motomation-template
// id: studio-portfolio
// name: Hawa Studio · design for public institutions, Dhaka
// kind: portfolio (studio)
// archetype: ledger
// mutation: swap-material
// signature: lens
// sections: hero-studio-ledger, features-studio-services, team-studio-rows, contact-studio-copy, footer-studio-marquee
// fonts: display "Young Serif" · text "Hanken Grotesk" · mono "JetBrains Mono"
// theme: --ground:#f2ede3;--surface:#faf7f0;--ink:#1b1a17;--muted:#5a554c;--line:rgba(27,26,23,.16);--accent:#a33a1c
// what: A design studio's site kept as its account book: projects as ledger entries, services with fixed shapes, the team at the table, and the wait for a new start.
import { HeroStudioLedger } from "../../sections/hero-studio-ledger";
import { FeaturesStudioServices } from "../../sections/features-studio-services";
import { TeamStudioRows } from "../../sections/team-studio-rows";
import { ContactStudioCopy } from "../../sections/contact-studio-copy";
import { FooterStudioMarquee } from "../../sections/footer-studio-marquee";

export function Page() {
  return (
    <>
      <main id="main">
        <HeroStudioLedger />
        <FeaturesStudioServices />
        <TeamStudioRows />
        <ContactStudioCopy />
      </main>
      <footer>
        <FooterStudioMarquee />
      </footer>
    </>
  );
}
