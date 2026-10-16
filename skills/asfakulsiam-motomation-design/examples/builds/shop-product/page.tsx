// @motomation-template
// id: shop-product
// name: Mati · No. 14-07, Ash celadon plate
// kind: e-commerce product
// archetype: catalogue
// mutation: single-object
// signature: hold-to-commit
// sections: hero-shop-catalogue, features-shop-specs, cta-shop-hold, testimonial-shop-notes, pricing-shop-glazes, gallery-shop-carousel
// fonts: display "Young Serif" · text "Familjen Grotesk" · mono "JetBrains Mono"
// theme: --ground:#dde3dc;--surface:#eaeee9;--ink:#1c231f;--muted:#46524b;--line:rgba(28,35,31,.2);--accent:#3f5e4e;--display-scale:1.42;--display-lh:1.12;--display-track:-.01em;--display-weight:400;--label-font:var(--font-text);--label-size:11px;--label-track:.24em;--label-weight:600;--body-size:14px;--body-lh:1.4
// what: One plate from a small firing, sold like a catalogue lot: the object, how it was made, a hold to reserve it, buyers' notes, the sets and the shelf.
import { HeroShopCatalogue } from "../../sections/hero-shop-catalogue";
import { FeaturesShopSpecs } from "../../sections/features-shop-specs";
import { CtaShopHold } from "../../sections/cta-shop-hold";
import { TestimonialShopNotes } from "../../sections/testimonial-shop-notes";
import { PricingShopGlazes } from "../../sections/pricing-shop-glazes";
import { GalleryShopCarousel } from "../../sections/gallery-shop-carousel";

// Navigation: a breadcrumb (shop › batch › this lot, current lot marked) and a lot pager at the top right, previous
// and next in the batch, as a catalogue numbers its pages. Feedback: photographs come into full colour on hover (a
// filter), links get a celadon wash; pressing a link inverts it; focus is a square outline, like a lot number's box.
const CSS = `
.lotbar{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px 24px;padding:10px clamp(20px,5vw,72px);font:600 11px/1 var(--font-text);letter-spacing:.24em;text-transform:uppercase;border-bottom:1px solid var(--line)}
.lotbar ol{display:flex;flex-wrap:wrap;gap:4px 10px;list-style:none;margin:0;padding:0}
.lotbar li+li::before{content:"›";margin-right:10px;color:var(--muted)}
.lotbar a,.lotbar [aria-current]{display:inline-flex;align-items:center;min-height:44px;padding:0 6px;text-decoration:none;color:var(--ink)}
.lotbar a:hover{background:rgba(63,94,78,.16)}
.lotbar a:active{background:var(--ink);color:var(--surface)}
.lotbar .pager{display:flex;gap:6px}
.p-shop img{filter:saturate(.75)}
.p-shop img:hover{filter:saturate(1.05) contrast(1.04)}
:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
`;

export function Page() {
  return (
    <div className="p-shop">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header className="lotbar">
        <nav aria-label="Breadcrumb"><ol><li><a href="./">Mati</a></li><li><a href="#gallery-shop-carousel">Batch 14</a></li><li><span aria-current="page">Lot 14-07</span></li></ol></nav>
        <nav className="pager" aria-label="Lots in this batch"><a rel="prev" href="#gallery-shop-carousel">← 14-06</a><a rel="next" href="#gallery-shop-carousel">14-08 →</a></nav>
      </header>
      <main id="main">
        <HeroShopCatalogue />
        <FeaturesShopSpecs />
        <CtaShopHold />
        <TestimonialShopNotes />
        <PricingShopGlazes />
        <GalleryShopCarousel />
      </main>
    </div>
  );
}
