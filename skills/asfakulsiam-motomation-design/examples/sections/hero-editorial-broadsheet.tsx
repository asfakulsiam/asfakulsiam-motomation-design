// @motomation-section
// id: hero-editorial-broadsheet
// kind: hero
// archetype: broadsheet
// components: BlurFocus
// what: A long-read's opening set as a newspaper front: masthead, a dateline set as filed, a headline that comes into focus, and the first paragraphs in two columns with a drop cap.
// signature: It reads as journalism before a word is read: masthead, folio and columns are the structure, and the wire dateline marks the piece as filed, not published by a template.
// mobile: Columns collapse to one; the masthead rules stay; the headline wraps at a smaller size.
// reduced-motion: The headline appears complete and sharp.
import { BlurFocus } from "../components/type/blur-focus";
import { Section, body, h, label, DISPLAY, LINE } from "./_shared";

export function HeroEditorialBroadsheet() {
  return (
    <Section id="hero-editorial-broadsheet" title="The Delta Review">
      <header style={{ borderTop: "3px double currentColor", borderBottom: "1px solid currentColor", padding: "10px 0", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
        <span style={h("clamp(1.6rem, 4vw, 2.8rem)", { letterSpacing: "0" })}>The Delta Review</span>
        <span style={label}>KHULNA · 11 OCTOBER 2026 · NO. 214</span>
      </header>
      <BlurFocus as="h1" text="The river took the school. The village rebuilt it on stilts." style={h("clamp(2.4rem, 6.4vw, 5.6rem)", { margin: "40px 0 28px", maxWidth: "18ch", lineHeight: 1.02 })} />
      <p style={{ ...label, marginBottom: 28 }}>By Tahmina Akter · Photographs by Shafiq Alam · 14 min read</p>
      <div style={{ columnWidth: "30ch", columnGap: 40, columnRule: `1px solid ${LINE}` }}>
        <p style={{ ...body, maxWidth: "none" }}><span style={{ float: "left", fontFamily: DISPLAY, fontSize: "4.2em", lineHeight: 0.8, padding: "6px 8px 0 0" }}>I</span>n the third week of the monsoon the Kobadak moved forty metres east in a night. By morning the primary school at Ghughudanga was a roof and a flagpole. The headmaster counted the children twice.</p>
        <p style={{ ...body, maxWidth: "none", marginTop: "1em" }}>What happened next was not an aid project. The parents, most of them shrimp farmers, drew the new school on the back of a calendar: two metres up, bamboo and steel, a boat ramp where the steps had been.</p>
      </div>
    </Section>
  );
}
