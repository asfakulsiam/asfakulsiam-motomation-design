// @motomation-template
// id: editorial-article
// name: The river took the school — The Delta Review
// kind: editorial article
// archetype: broadsheet
// mutation: print-rule
// signature: decode
// sections: hero-editorial-broadsheet, feature-editorial-pullquote, footer-editorial-folio
// fonts: display "Bodoni Moda" · text "Instrument Sans" · mono "JetBrains Mono"
// theme: --ground:#f5f1e8;--surface:#fbf8f1;--ink:#161616;--muted:#55504a;--line:rgba(22,22,22,.16);--accent:#9b1c1c
// what: A long-read set like a broadsheet: masthead, deck and columns, one pull quote that inks in as it is read, and a folio footer that remembers what you've read.
import { HeroEditorialBroadsheet } from "../../sections/hero-editorial-broadsheet";
import { FeatureEditorialPullquote } from "../../sections/feature-editorial-pullquote";
import { FooterEditorialFolio } from "../../sections/footer-editorial-folio";

export function Page() {
  return (
    <>
      <main id="main">
        <HeroEditorialBroadsheet />
        <FeatureEditorialPullquote />
      </main>
      <footer>
        <FooterEditorialFolio />
      </footer>
    </>
  );
}
