// @motomation-template
// id: event
// name: Monsoon Jazz Night · National Theatre Hall, 14 November
// kind: event landing
// archetype: poster
// mutation: scale-abuse
// signature: velocity-skew
// sections: hero-event-poster, team-event-lineup, pricing-event-tickets, contact-event-venue
// fonts: display "Anybody" · text "Instrument Sans" · mono "JetBrains Mono"
// theme: --ground:#f1ebe0;--surface:#faf6ee;--ink:#17140f;--muted:#5a5244;--line:rgba(23,20,15,.16);--accent:#a2311b
// what: A one-night concert as a poster: the name under stage light, the lineup in running order, tickets drawn as tickets, and how to get to the hall.
import { HeroEventPoster } from "../../sections/hero-event-poster";
import { TeamEventLineup } from "../../sections/team-event-lineup";
import { PricingEventTickets } from "../../sections/pricing-event-tickets";
import { ContactEventVenue } from "../../sections/contact-event-venue";

export function Page() {
  return (
    <>
      <main id="main">
        <HeroEventPoster />
        <TeamEventLineup />
        <PricingEventTickets />
        <ContactEventVenue />
      </main>
    </>
  );
}
