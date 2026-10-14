// @motomation-template
// id: hotel
// name: Haveli Panam · seven rooms in Sonargaon
// kind: hotel / hospitality
// archetype: room
// mutation: reverse-reveal
// signature: aperture
// sections: hero-hotel-room, features-hotel-rooms, pricing-hotel-seasons, testimonial-hotel-guestbook, contact-hotel-atlas
// fonts: display "Cormorant Garamond" · text "Instrument Sans" · mono "JetBrains Mono"
// theme: --ground:#f1e8da;--surface:#f8f1e6;--ink:#2b2018;--muted:#62513e;--line:rgba(43,32,24,.16);--accent:#8a4b2a
// what: A heritage hotel that opens with a door: the courtyard, the upstairs gallery of rooms, rates by season, one guest-book entry, and the way from Dhaka.
import { HeroHotelRoom } from "../../sections/hero-hotel-room";
import { FeaturesHotelRooms } from "../../sections/features-hotel-rooms";
import { PricingHotelSeasons } from "../../sections/pricing-hotel-seasons";
import { TestimonialHotelGuestbook } from "../../sections/testimonial-hotel-guestbook";
import { ContactHotelAtlas } from "../../sections/contact-hotel-atlas";

export function Page() {
  return (
    <>
      <main id="main">
        <HeroHotelRoom />
        <FeaturesHotelRooms />
        <PricingHotelSeasons />
        <TestimonialHotelGuestbook />
        <ContactHotelAtlas />
      </main>
    </>
  );
}
