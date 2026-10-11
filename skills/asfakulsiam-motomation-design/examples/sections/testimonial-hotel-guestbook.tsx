// @motomation-section
// id: testimonial-hotel-guestbook
// kind: testimonial
// archetype: letter
// components: Typewriter, Grain
// what: One entry from the guest book, typed out on grained paper as if written at the desk, with the room and the date.
// signature: The hotel's real guest book replaces review stars; the typing is the guest writing, and it plays once.
// mobile: The page is full width with a narrower measure.
// reduced-motion: The entry is complete; the grain is still.
import { Typewriter } from "../components/text/typewriter";
import { Grain } from "../components/backgrounds/grain";
import { Section, label, MUTED } from "./_shared";

export function TestimonialHotelGuestbook() {
  return (
    <Section id="testimonial-hotel-guestbook" title="From the guest book" hideTitle>
      <figure style={{ position: "relative", maxWidth: 760, margin: "0 auto", padding: "clamp(28px, 5vw, 56px)", background: "#f7efdf", borderRadius: 4, boxShadow: "0 20px 40px rgba(0,0,0,.08)", overflow: "hidden" }}>
        <Grain opacity={0.08} animate={false} />
        <p style={{ ...label, position: "relative" }}>Guest book · Well Room · 3 January 2026</p>
        <Typewriter as="p" speed={30} text="We came for one night and stayed four. On the last morning the cook taught our daughter to make pitha in the courtyard, and she has asked for it every Sunday since." style={{ position: "relative", fontFamily: "var(--font-display, serif)", fontStyle: "italic", fontSize: "clamp(1.4rem, 2.6vw, 2rem)", lineHeight: 1.35, margin: "20px 0" }} />
        <figcaption style={{ position: "relative", color: MUTED }}>The Chowdhury family, Rajshahi</figcaption>
      </figure>
    </Section>
  );
}
