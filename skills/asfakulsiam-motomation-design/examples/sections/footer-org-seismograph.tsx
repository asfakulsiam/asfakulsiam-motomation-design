// @motomation-section
// id: footer-org-seismograph
// kind: footer
// archetype: manifesto
// components: SeismographLine
// what: The trust's footer sits under a single line that ripples where the pointer crosses it, like a river gauge's trace; then the registration details donors look for.
// signature: The gauge line is the trust's instrument, and its only motion responds to the visitor; the registration numbers are what a careful donor checks last.
// mobile: The line rests flat (no pointer); columns stack.
// reduced-motion: The line is flat and still.
import { SeismographLine } from "../components/cursor/seismograph-line";
import { Section, cols, label, MONO, MUTED } from "./_shared";

export function FooterOrgSeismograph() {
  return (
    <Section id="footer-org-seismograph" title="River Commons footer" hideTitle>
      <SeismographLine height={80} color="var(--accent, #b5401f)" />
      <div style={{ ...cols(220, 32), marginTop: 28 }}>
        <div><p style={label}>River Commons Trust</p><p style={{ marginTop: 10, lineHeight: 1.6 }}>12/3 Shyamoli, Dhaka 1207<br />hello@rivercommons.org.bd</p></div>
        <div><p style={label}>Registered</p><p style={{ marginTop: 10, fontFamily: MONO, fontSize: 13, lineHeight: 1.8 }}>NGOAB 3127 · 2017<br />Audited by Hoda Vasi, 2025</p></div>
        <div><p style={label}>Read</p><ul style={{ listStyle: "none", padding: 0, margin: "6px 0 0", lineHeight: 1.6 }}><li><a href="#report" style={{ color: "inherit", display: "inline-block", padding: "4px 0" }}>2025 annual report (PDF, 4 MB)</a></li><li><a href="#cases" style={{ color: "inherit", display: "inline-block", padding: "4px 0" }}>Court cases, all 38</a></li></ul></div>
      </div>
      <p style={{ marginTop: 36, color: MUTED, fontSize: 14 }}>Rivers are living entities under Bangladeshi law (High Court, 2019).</p>
    </Section>
  );
}
