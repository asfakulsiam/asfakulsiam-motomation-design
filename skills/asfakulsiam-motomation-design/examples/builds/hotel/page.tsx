// @motomation-template
// id: hotel
// name: Haveli Panam · seven rooms in Sonargaon
// kind: hotel / hospitality
// archetype: room
// mutation: reverse-reveal
// signature: darkroom-develop
// sections: hero-hotel-room, testimonial-hotel-guestbook, features-hotel-rooms, pricing-hotel-seasons, contact-hotel-atlas
// fonts: display "Cormorant Garamond" · text "Cormorant Garamond" · mono "JetBrains Mono"
// theme: --ground:#ead6ab;--surface:#f3e4c4;--ink:#2a180c;--muted:#5c3f27;--line:rgba(42,24,12,.2);--accent:#7d2a10;--display-scale:1.12;--display-lh:.9;--display-track:0em;--display-weight:500;--display-style:italic;--label-font:var(--font-display);--label-size:16px;--label-track:.04em;--label-case:none;--label-style:italic;--body-size:20px;--body-lh:1.62
// what: A heritage hotel in Sonargaon kept like an old print: the courtyard develops beside the name, then the guest book, the rooms, the rates and the way from Dhaka.
import { HeroHotelRoom } from "../../sections/hero-hotel-room";
import { TestimonialHotelGuestbook } from "../../sections/testimonial-hotel-guestbook";
import { FeaturesHotelRooms } from "../../sections/features-hotel-rooms";
import { PricingHotelSeasons } from "../../sections/pricing-hotel-seasons";
import { ContactHotelAtlas } from "../../sections/contact-hotel-atlas";

// Navigation: the page's header is a fixed rail of brass key tags down the left edge, the house monogram at the top,
// one tag per part of the house and a call tag at the foot; on phones it becomes a
// row of tags under the photograph. Feedback: a tag's lettering opens up on hover (tracking), dims while pressed,
// and focus draws a dotted ring with a thick underline, like a pencil mark in the register.
const CSS = `
.rail{position:fixed;left:0;top:0;bottom:0;width:88px;z-index:20;display:flex;flex-direction:column;justify-content:center;gap:6px;padding:12px 10px;background:var(--surface);border-right:1px solid var(--line)}
.rail a{display:flex;align-items:center;justify-content:center;min-height:52px;padding:6px 4px;border:1px solid var(--line);border-radius:26px 26px 6px 6px;font:italic 500 15px/1.1 var(--font-display);text-align:center;text-decoration:none;color:var(--ink);transition:letter-spacing .25s ease}
.rail a:hover{letter-spacing:.08em}
.rail a:active{opacity:.55}
.rail nav{display:flex;flex-direction:inherit;gap:6px}
.rail .mono{display:grid;place-items:center;height:52px;font:italic 600 22px/1 var(--font-display);border-bottom:1px solid var(--line);margin-bottom:8px}
.rail .tel{margin-top:14px;font-size:13px;border-style:dashed}
:focus-visible{outline:2px dotted var(--accent);outline-offset:4px;text-decoration:underline 3px;text-underline-offset:5px}
.p-hotel{padding-left:88px}
@media (max-width:820px){.rooms-arches{grid-template-columns:1fr!important}.rooms-arches figure{grid-row:auto!important}.rail{position:static;width:auto;flex-direction:row;flex-wrap:wrap;padding:10px 12px;border-right:0;border-bottom:1px solid var(--line)}.rail nav{flex-wrap:wrap;flex:1 1 100%}.rail .mono{display:none}.rail a{flex:1 1 30%;min-height:44px;border-radius:22px}.rail .tel{margin-top:0}.p-hotel{padding-left:0}.hotel-split{grid-template-columns:1fr!important}.hotel-split>div:last-of-type{order:-1;min-height:0!important;aspect-ratio:4/5}}
@media (prefers-reduced-motion:reduce){.rail a{transition:none}}
`;
const TAGS: [string, string][] = [["#hero-hotel-room", "Door"], ["#testimonial-hotel-guestbook", "Book"], ["#features-hotel-rooms", "Rooms"], ["#pricing-hotel-seasons", "Rates"], ["#contact-hotel-atlas", "Way"]];

export function Page() {
  return (
    <div className="p-hotel">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header className="rail">
        <span className="mono" aria-hidden="true">HP</span>
        <nav aria-label="The house">{TAGS.map(([href, t]) => <a key={href} href={href}>{t}</a>)}</nav>
        <a className="tel" href="tel:+8801711000214">Call</a>
      </header>
      <main id="main">
        <HeroHotelRoom />
        <TestimonialHotelGuestbook />
        <FeaturesHotelRooms />
        <PricingHotelSeasons />
        <ContactHotelAtlas />
      </main>
    </div>
  );
}
