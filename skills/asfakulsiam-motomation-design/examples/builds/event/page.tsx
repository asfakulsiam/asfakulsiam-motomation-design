// @motomation-template
// id: event
// name: Monsoon Jazz Night · National Theatre Hall, 14 November
// kind: event landing
// archetype: poster
// mutation: scale-abuse
// signature: width-sprint
// sections: hero-event-poster, pricing-event-tickets, team-event-lineup, contact-event-venue
// fonts: display "Anybody" · text "Anybody" · mono "JetBrains Mono"
// theme: --ground:#13111d;--surface:#1f1c2e;--ink:#f3ead8;--muted:#c9bfa9;--line:rgba(243,234,216,.2);--accent:#f2a93b;--display-scale:1.28;--display-lh:.82;--display-track:-.035em;--display-weight:800;--display-case:uppercase;--label-font:var(--font-display);--label-size:13px;--label-track:.32em;--label-weight:700;--body-size:15px;--body-lh:1.38
// what: A one-night jazz concert as a lit poster on a dark street: the name, tickets drawn as tickets, the running order, and how to get to the hall.
import { HeroEventPoster } from "../../sections/hero-event-poster";
import { PricingEventTickets } from "../../sections/pricing-event-tickets";
import { TeamEventLineup } from "../../sections/team-event-lineup";
import { ContactEventVenue } from "../../sections/contact-event-venue";

// Navigation: a floating pill, sticky at the top centre, with two links and a back-to-poster mark; it is the only
// chrome. Feedback: links lean (skew) and light up amber on hover, press squashes them, focus inverts a pill segment and draws a double amber outline elsewhere
// (an inverted background alone vanished on the dock's and copy button's own fills: gate focus check).
const CSS = `
.pill{position:sticky;top:14px;z-index:30;display:flex;justify-content:center;pointer-events:none;height:0}
.pill nav{pointer-events:auto;display:flex;gap:4px;padding:5px;border-radius:999px;background:rgba(19,17,29,.86);border:1px solid var(--line);backdrop-filter:blur(6px);transform:translateY(0)}
.pill a{display:inline-flex;align-items:center;min-height:44px;padding:0 20px;border-radius:999px;font:800 13px/1 var(--font-display);letter-spacing:.2em;text-transform:uppercase;text-decoration:none;color:var(--ink);transition:transform .18s ease,background-color .18s ease,color .18s ease}
.pill a:hover{transform:skewX(-10deg);background:var(--accent);color:#13111d}
.pill a:active{transform:scale(.94)}
:focus-visible{outline:3px double var(--accent);outline-offset:4px}
.pill a:focus-visible{background:var(--ink);color:var(--ground)}
@media (max-width:520px){.pill a{padding:0 14px;letter-spacing:.12em}}
@media (prefers-reduced-motion:reduce){.pill a{transition:none}.pill a:hover{transform:none}}
`;

export function Page() {
  return (
    <div id="top">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header className="pill"><nav aria-label="The night"><a href="#pricing-event-tickets">Seats</a><a href="#team-event-lineup">Times</a><a href="#top" aria-label="Back to the poster">↑</a></nav></header>
      <main id="main">
        <HeroEventPoster />
        <PricingEventTickets />
        <TeamEventLineup />
        <ContactEventVenue />
      </main>
    </div>
  );
}
