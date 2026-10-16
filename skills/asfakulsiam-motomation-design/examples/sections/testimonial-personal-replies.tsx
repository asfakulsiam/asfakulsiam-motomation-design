// @motomation-section
// id: testimonial-personal-replies
// kind: testimonial
// archetype: letter
// components: CurvedText
// what: Replies to last month's letter, laid out as the morning's post: a received postmark inked over the paper (multiply), tilted as a hand stamp lands, then a line from each, with the reader's town.
// signature: A newsletter's proof is that people write back; the postmark dates the replies, and nothing animates in, because letters don't arrive on scroll.
// mobile: The postmark sits above the replies; replies are full-width cards.
// reduced-motion: Nothing here moves.
import { CurvedText } from "../components/type/curved-text";
import { Section, h, label, LINE, MUTED, SURFACE } from "./_shared";

const REPLIES = [["“My grandfather was a binder in Banglabazar. I'd never heard anyone describe the smell of the glue before.”", "Imran, Narayanganj"], ["“Printed it and gave it to my mother. She called the shop.”", "Lamia, Toronto"], ["“Please do the umbrella repairers next.”", "Arif, Khulna"]];

export function TestimonialPersonalReplies() {
  return (
    <Section id="testimonial-personal-replies" title="Replies">
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 28px", margin: "0 0 28px" }}>
        <div><p style={label}>Replies to No. 36</p><h2 id="testimonial-personal-replies-title" style={h("clamp(1.8rem, 4vw, 3rem)", { marginTop: 12 })}>The post this morning.</h2></div>
        <div role="img" aria-label="Postmark: received, Dhaka GPO, 14 October" style={{ transform: "rotate(-9deg)", color: "var(--accent)", opacity: 0.85, mixBlendMode: "multiply" }}>
          <CurvedText text="RECEIVED · DHAKA G.P.O. · 14 OCT · " size={118} spinSeconds={0}><span style={{ font: "italic 400 15px/1 var(--font-display)" }}>No. 36</span></CurvedText>
        </div>
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10, maxWidth: 720 }}>
        {REPLIES.map(([q, who]) => <li key={who} style={{ padding: "18px 20px", background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 2 }}><figure style={{ margin: 0 }}><blockquote style={{ margin: 0, fontFamily: "var(--font-display, serif)", fontSize: "1.3rem", lineHeight: 1.35 }}>{q}</blockquote><figcaption style={{ marginTop: 8, color: MUTED }}>{who}</figcaption></figure></li>)}
      </ul>
    </Section>
  );
}
