// @motomation-template
// id: shop-product
// name: Mati — No. 14-07, Ash celadon plate
// kind: e-commerce product
// archetype: catalogue
// mutation: single-object
// signature: hold-to-commit
// sections: hero-shop-catalogue, features-shop-specs, testimonial-shop-notes, cta-shop-hold, gallery-shop-carousel, pricing-shop-glazes
// fonts: display "Fraunces" · text "Familjen Grotesk" · mono "JetBrains Mono"
// theme: --ground:#efe9df;--surface:#f8f4ec;--ink:#2a221b;--muted:#5e5246;--line:rgba(42,34,27,.16);--accent:#8c4a26
// what: One plate from a small firing, sold like a catalogue lot: the object, its making in four steps, buyers' notes, a deliberate hold to reserve, then the rest of the shelf.
import { HeroShopCatalogue } from "../../sections/hero-shop-catalogue";
import { FeaturesShopSpecs } from "../../sections/features-shop-specs";
import { TestimonialShopNotes } from "../../sections/testimonial-shop-notes";
import { CtaShopHold } from "../../sections/cta-shop-hold";
import { GalleryShopCarousel } from "../../sections/gallery-shop-carousel";
import { PricingShopGlazes } from "../../sections/pricing-shop-glazes";

export function Page() {
  return (
    <>
      <main id="main">
        <HeroShopCatalogue />
        <FeaturesShopSpecs />
        <TestimonialShopNotes />
        <CtaShopHold />
        <GalleryShopCarousel />
        <PricingShopGlazes />
      </main>
    </>
  );
}
