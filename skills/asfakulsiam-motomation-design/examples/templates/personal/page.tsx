// @motomation-template
// id: personal
// name: Letters from Nusrat — one letter a month
// kind: personal brand
// archetype: letter
// mutation: second-person
// signature: thread
// sections: hero-personal-letter, testimonial-personal-replies, cta-personal-subscribe
// fonts: display "Instrument Serif" · text "Familjen Grotesk" · mono "JetBrains Mono"
// theme: --ground:#f6f0e4;--surface:#fcf8f0;--ink:#2a1f1a;--muted:#655443;--line:rgba(42,31,26,.16);--accent:#9c3b2a
// what: A writer's homepage that is this month's letter: written to the reader, with replies that came in the post and a postscript to subscribe.
import { HeroPersonalLetter } from "../../sections/hero-personal-letter";
import { TestimonialPersonalReplies } from "../../sections/testimonial-personal-replies";
import { CtaPersonalSubscribe } from "../../sections/cta-personal-subscribe";

export function Page() {
  return (
    <>
      <main id="main">
        <HeroPersonalLetter />
        <TestimonialPersonalReplies />
        <CtaPersonalSubscribe />
      </main>
    </>
  );
}
