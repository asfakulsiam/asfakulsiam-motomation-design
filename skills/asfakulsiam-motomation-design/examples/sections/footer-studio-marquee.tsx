// @motomation-section
// id: footer-studio-marquee
// kind: footer
// archetype: ledger
// components: VelocityMarquee
// what: The studio's footer runs the full client list as a marquee that leans with scroll speed, then closes with the ledger's totals line.
// signature: Every client the studio has worked for, as the books' closing line, not a logo wall; the totals line ends the ledger metaphor.
// mobile: Marquee keeps its base speed; columns stack.
// reduced-motion: The client list is a static wrapped line.
import { VelocityMarquee } from "../components/scroll/velocity-marquee";
import { Section, label, LINE, MONO, MUTED } from "./_shared";

export function FooterStudioMarquee() {
  return (
    <Section id="footer-studio-marquee" title="Hawa Studio footer" hideTitle style={{ borderTop: `1px solid ${LINE}` }}>
      <p style={label}>Clients since 2011</p>
      <VelocityMarquee separator=" · " items={["Bangladesh Bank Museum", "Sonargaon Archive", "Ministry of Water", "Old Dhaka Trust", "BRAC University Press", "Liberation War Museum", "Bengal Foundation", "Chhayanaut"]} style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(1.6rem, 4vw, 3rem)", margin: "18px 0 40px" }} />
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 16, borderTop: "2px solid currentColor", paddingTop: 14, fontFamily: MONO, fontSize: 13 }}>
        <span>Total · 312 projects · 15 years</span><span style={{ color: MUTED }}>© 2026 Hawa Studio Ltd · Dhaka</span><a href="#hero-studio-ledger" style={{ color: "inherit", display: "inline-block", padding: "4px 0" }}>Back to the first page</a>
      </div>
    </Section>
  );
}
