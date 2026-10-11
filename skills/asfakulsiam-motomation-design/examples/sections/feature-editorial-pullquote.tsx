// @motomation-section
// id: feature-editorial-pullquote
// kind: features
// archetype: broadsheet
// components: InkFill, ReadingRail
// what: The middle of a long read: a pull quote that inks in as it's read, between body columns, with a thin reading rail showing how far through the article you are.
// signature: Broadsheet devices doing their real jobs: the pull quote slows the reader at the article's turn, and the rail answers "how long is left" without a timer.
// mobile: One column; the quote is full width at a smaller size; the rail stays at the top.
// reduced-motion: The quote is fully inked; the rail still tracks position (it moves only when the reader scrolls).
import { useRef } from "react";
import { InkFill } from "../components/type/ink-fill";
import { ReadingRail } from "../components/scroll/reading-rail";
import { Section, body, LINE } from "./_shared";

export function FeatureEditorialPullquote() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <Section id="feature-editorial-pullquote" title="The stilt school, continued" hideTitle>
      <ReadingRail target={ref} />
      <div ref={ref} style={{ columnWidth: "30ch", columnGap: 40, columnRule: `1px solid ${LINE}` }}>
        <p style={{ ...body, maxWidth: "none" }}>The steel came from a shipbreaking yard in Sitakunda, bought by weight. The bamboo came from the parents' own clumps, cut at the waning moon, when, the farmers say, the sap is low and the borers stay away.</p>
        <InkFill as="blockquote" text="“We didn't build it high so the water couldn't reach it. We built it so the children could watch the water come.”" style={{ breakInside: "avoid", margin: "1.2em 0", fontFamily: "var(--font-display, serif)", fontSize: "clamp(1.6rem, 3vw, 2.3rem)", lineHeight: 1.2, columnSpan: "all" }} />
        <p style={{ ...body, maxWidth: "none" }}>Mohammad Ali, who chairs the school committee, says the boat ramp was the children's idea. In the flood months it's the only entrance; in the dry months, it's where they eat lunch.</p>
      </div>
    </Section>
  );
}
