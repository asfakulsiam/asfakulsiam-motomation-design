// @motomation-section
// id: team-studio-rows
// kind: team
// archetype: ledger
// components: Lens, ScrambleOnHover
// what: The studio's team as a ledger of names, roles and years, above a studio photograph you can look through with a lens that reveals who sits where.
// signature: A team page with no headshot grid: the people are entries in the book and in the room, and the lens connects the two.
// mobile: The lens becomes a toggle button (Lens's touch path); rows stack name over role.
// reduced-motion: The lens is a toggle; names don't scramble.
import { Lens } from "../components/cursor/lens";
import { ScrambleOnHover } from "../components/text/scramble-on-hover";
import { Section, h, label, LINE, MONO, MUTED } from "./_shared";
import { longTable } from "./_imagery";

const TEAM = [["Ayesha Siddiqua", "Partner, identity", "2011"], ["Tanvir Hasan", "Partner, exhibitions", "2013"], ["Mithila Das", "Data design", "2019"], ["Rafi Chowdhury", "Typesetting", "2022"]];
const photo = (labels: boolean) => (
  <div style={{ position: "relative" }}>
    <img src={longTable(labels ? ["#efe3cf", "#b5401f", "#1d3b4a"] : ["#d8d2c6", "#8f8a82", "#5d5a55"])} alt={labels ? "" : "The studio at its long table, four people at work"} width={1400} height={700} style={{ display: "block", width: "100%", height: "auto" }} />
    {labels && TEAM.map(([n], i) => <span key={n} style={{ position: "absolute", left: `${14 + i * 22}%`, top: `${38 + (i % 2) * 14}%`, padding: "4px 8px", background: "#1d1a16", color: "#f4efe6", fontFamily: "var(--font-mono, monospace)", fontSize: 12 }}>{n}</span>)}
  </div>
);

export function TeamStudioRows() {
  return (
    <Section id="team-studio-rows" title="People">
      <p style={label}>People · four partners and staff, no freelancers</p>
      <h2 id="team-studio-rows-title" style={h("clamp(2rem, 4.4vw, 3.4rem)", { margin: "12px 0 28px" })}>Who sits at the table.</h2>
      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px" }}>
        {TEAM.map(([n, role, y]) => <li key={n} style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8, padding: "14px 0", borderTop: `1px solid ${LINE}` }}><ScrambleOnHover text={n} style={{ fontSize: "clamp(1.2rem, 2.4vw, 1.7rem)" }} /><span style={{ color: MUTED }}>{role}</span><span style={{ fontFamily: MONO, fontSize: 13 }}>since {y}</span></li>)}
      </ul>
      <Lens base={photo(false)} reveal={photo(true)} radius={130} toggleLabel="Show who sits where" />
    </Section>
  );
}
