// @motomation-section
// id: team-org-field-guide
// kind: team
// archetype: field-guide
// components: Halftone
// what: The river watchers as field-guide entries: a halftone portrait, the river and reach each person watches, and one observation from their log.
// signature: The people who do the work, catalogued the way the trust catalogues rivers; the halftone ties portraits to the survey prints.
// mobile: Entries stack one per row, portrait above notes.
// reduced-motion: Halftone is static by nature; nothing moves.
import { Halftone } from "../components/backgrounds/halftone";
import { Section, art, cols, h, label, MONO, MUTED } from "./_shared";

const WATCHERS = [["Jahanara Begum", "Turag · Tongi bridge to Ashulia", "“Dyeing water came at 2 am again, purple this time.”"], ["Kamal Uddin", "Buriganga · Sadarghat", "“The new wall is 11 metres inside the 2019 line.”"], ["Mousumi Roy", "Karatoya · Bogura town", "“Otters back below the old ghat. Two.”"]];

export function TeamOrgFieldGuide() {
  return (
    <Section id="team-org-field-guide" title="River watchers">
      <p style={label}>Field guide · the watchers</p>
      <h2 id="team-org-field-guide-title" style={h("clamp(2rem, 4.4vw, 3.4rem)", { margin: "12px 0 36px" })}>The people on the bank.</h2>
      <div style={cols(260, 32)}>
        {WATCHERS.map(([name, reach, log], i) => (
          <article key={name} style={{ display: "grid", gap: 12 }}>
            <Halftone src={art(120 + i * 13, ["#e9e2d4", "#3a4a52", "#9aa59c"], 600, 600)} alt={`Portrait of ${name}`} width={600} height={600} ink="#1d3b4a" paper="#efe9dc" style={{ width: "100%", height: "auto", aspectRatio: "1" }} />
            <h3 style={h("1.6rem")}>{name}</h3>
            <p style={{ margin: 0, fontFamily: MONO, fontSize: 12, color: MUTED }}>{reach}</p>
            <p style={{ margin: 0, fontStyle: "italic" }}>{log}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
