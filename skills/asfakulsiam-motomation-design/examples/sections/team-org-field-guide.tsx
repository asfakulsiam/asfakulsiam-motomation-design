// @motomation-section
// id: team-org-field-guide
// kind: team
// archetype: field-guide
// components: Halftone
// what: The river watchers as field-guide entries (name, the reach each person watches, one line from their log) beside a single halftone survey print of the three rivers.
// signature: The people who do the work, catalogued the way the trust catalogues rivers; the one halftone ties the page to the survey prints, and it shows the water, not the people.
// mobile: The survey print sits above the entries; entries stack one per row.
// reduced-motion: The print is drawn at full size at once; nothing moves.
// note: Halftone is used for a map-like print, not portraits (its avoid-when: portraits where likeness matters; many on one page).
import { Halftone } from "../components/backgrounds/halftone";
import { Section, cols, h, label, LINE, MONO, MUTED } from "./_shared";
import { survey } from "./_imagery";

const WATCHERS = [["Jahanara Begum", "Turag · Tongi bridge to Ashulia", "“Dyeing water came at 2 am again, purple this time.”"], ["Kamal Uddin", "Buriganga · Sadarghat", "“The new wall is 11 metres inside the 2019 line.”"], ["Mousumi Roy", "Karatoya · Bogura town", "“Otters back below the old ghat. Two.”"]];

export function TeamOrgFieldGuide() {
  return (
    <Section id="team-org-field-guide" title="River watchers">
      <p style={label}>Field guide · the watchers</p>
      <h2 id="team-org-field-guide-title" style={h("clamp(2rem, 4.4vw, 3.4rem)", { margin: "12px 0 36px" })}>The people on the bank.</h2>
      <div style={{ ...cols(300, 40), alignItems: "start" }}>
        <figure style={{ margin: 0 }}>
          <Halftone src={survey({ paper: "#e9e2d4", water: "#3a4a52", land: "#9aa59c" })} alt="Survey print of the Turag, Buriganga and Karatoya reaches the watchers cover" width={720} height={480} cell={8} ink="#1d3b4a" paper="#efe9dc" style={{ width: "100%", height: "auto" }} />
          <figcaption style={{ marginTop: 10, fontFamily: MONO, fontSize: 12, color: MUTED }}>Survey print · three reaches, 2025</figcaption>
        </figure>
        <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {WATCHERS.map(([name, reach, log], i) => (
            <li key={name} style={{ display: "grid", gap: 6, padding: "18px 0", borderTop: `1px solid ${LINE}` }}>
              <p style={{ margin: 0, fontFamily: MONO, fontSize: 12, color: MUTED }}>Entry {i + 1} · {reach}</p>
              <h3 style={h("1.6rem")}>{name}</h3>
              <p style={{ margin: 0, fontStyle: "italic" }}>{log}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
