// @motomation-section
// id: testimonial-personal-replies
// kind: testimonial
// archetype: letter
// components: AnimatedList
// what: Replies to last month's letter arrive one by one, like the morning's post: a line from each, with the reader's town.
// signature: A newsletter's proof is that people write back; the arrival order is the order the replies came in.
// mobile: Replies are full width cards.
// reduced-motion: All replies are shown at once.
import { AnimatedList } from "../components/ui/animated-list";
import { Section, h, label, LINE, MUTED, SURFACE } from "./_shared";

const REPLIES = [["“My grandfather was a binder in Banglabazar. I'd never heard anyone describe the smell of the glue before.”", "Imran, Narayanganj"], ["“Printed it and gave it to my mother. She called the shop.”", "Lamia, Toronto"], ["“Please do the umbrella repairers next.”", "Arif, Khulna"]];

export function TestimonialPersonalReplies() {
  return (
    <Section id="testimonial-personal-replies" title="Replies">
      <p style={label}>Replies to No. 36</p>
      <h2 id="testimonial-personal-replies-title" style={h("clamp(1.8rem, 4vw, 3rem)", { margin: "12px 0 28px" })}>The post this morning.</h2>
      <AnimatedList interval={1100} itemStyle={{ padding: "18px 20px", background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 6 }} style={{ maxWidth: 720 }}>
        {REPLIES.map(([q, who]) => <figure key={who} style={{ margin: 0 }}><blockquote style={{ margin: 0, fontFamily: "var(--font-display, serif)", fontSize: "1.3rem", lineHeight: 1.35 }}>{q}</blockquote><figcaption style={{ marginTop: 8, color: MUTED }}>{who}</figcaption></figure>)}
      </AnimatedList>
    </Section>
  );
}
