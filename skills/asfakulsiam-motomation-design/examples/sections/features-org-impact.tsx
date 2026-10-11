// @motomation-section
// id: features-org-impact
// kind: features
// archetype: manifesto
// components: CountUp, ContourLines
// what: Three numbers from the trust's last year, set huge on a contour-line field like a survey map, each with the sentence that makes it mean something.
// signature: The Manifesto backs its argument with evidence at the same scale as the words; the contour lines are the survey work itself.
// mobile: Numbers stack, still large; contour lines stay behind at low contrast.
// reduced-motion: Lines are still; numbers show final values.
import { CountUp } from "../components/micro/count-up";
import { ContourLines } from "../components/backgrounds/contour-lines";
import { Section, body, cols, h, label } from "./_shared";

const FACTS = [{ n: 214, s: " km", line: "of river bank surveyed on foot with local watchers." }, { n: 38, s: "", line: "court cases filed; 11 encroachments removed by order." }, { n: 1260, s: "", line: "people paid to watch their own river, monthly." }];

export function FeaturesOrgImpact() {
  return (
    <Section id="features-org-impact" title="Last year in numbers">
      <ContourLines lines={14} color="rgba(29,59,74,.16)" />
      <div style={{ position: "relative" }}>
        <p style={label}>2025 · audited</p>
        <h2 id="features-org-impact-title" style={h("clamp(2rem, 4.4vw, 3.4rem)", { margin: "12px 0 40px" })}>What a year of hearings did.</h2>
        <div style={cols(240, 40)}>{FACTS.map((f) => <div key={f.line}><p style={h("clamp(3.4rem, 8vw, 6.4rem)")}><CountUp value={f.n} suffix={f.s} locale="en-IN" /></p><p style={{ ...body, marginTop: 12 }}>{f.line}</p></div>)}</div>
      </div>
    </Section>
  );
}
