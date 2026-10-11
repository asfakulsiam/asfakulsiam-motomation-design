// @motomation-section
// id: testimonial-saas-ink
// kind: testimonial
// archetype: workbench
// components: InkFill, CountUp
// what: One shopkeeper's words, long enough to be specific, inking in as they're read, beside the one number that changed for her.
// signature: One real testimonial with a measured result beats a carousel of five-star quotes; the number is the before/after of her evening.
// mobile: The number sits above the quote; the quote wraps at full width.
// reduced-motion: The quote is fully inked; the number shows its final value.
import { InkFill } from "../components/type/ink-fill";
import { CountUp } from "../components/micro/count-up";
import { Section, cols, h, label, MUTED } from "./_shared";

export function TestimonialSaasInk() {
  return (
    <Section id="testimonial-saas-ink" title="From a customer" hideTitle>
      <div style={{ ...cols(300, 48), alignItems: "center" }}>
        <div><p style={h("clamp(4rem, 10vw, 8rem)")}><CountUp value={40} suffix=" min" /></p><p style={{ ...label, marginTop: 10 }}>less closing up, every night</p></div>
        <figure style={{ margin: 0 }}>
          <InkFill as="blockquote" text="“I used to sit with the khata until eleven, adding the credit twice because I didn't trust myself. Now I check the phone, I lock the shutter, and I'm home for dinner with my son.”" style={{ margin: 0, fontFamily: "var(--font-display, serif)", fontSize: "clamp(1.5rem, 2.6vw, 2.2rem)", lineHeight: 1.25 }} />
          <figcaption style={{ marginTop: 20, color: MUTED }}>Shirin Akter, Akter Pharmacy, Mirpur 10 · customer since 2024</figcaption>
        </figure>
      </div>
    </Section>
  );
}
