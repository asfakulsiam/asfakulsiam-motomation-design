// @motomation-section
// id: hero-studio-ledger
// kind: hero
// archetype: ledger
// components: SplitFlap, ScrambleOnHover
// what: A studio's homepage set as an account book: a ruled ledger of recent projects with year, client, discipline and hours, under a split-flap counter of projects shipped.
// signature: The studio shows its work as entries with numbers, which is how its clients (archives, banks, ministries) think; the counter is a real figure, not decoration.
// mobile: The ledger drops its hours and discipline columns below 640px (they move under the client name); the counter stays on one line.
// reduced-motion: The counter shows its final value; names don't scramble.
import { SplitFlap } from "../components/type/split-flap";
import { ScrambleOnHover } from "../components/text/scramble-on-hover";
import { Section, h, label, LINE, MONO, MUTED, TEXT } from "./_shared";

const ROWS = [["2026", "Bangladesh Bank Museum", "Exhibition", "1,240"], ["2026", "Sonargaon Archive", "Identity", "610"], ["2025", "Ministry of Water", "Data design", "980"], ["2025", "Old Dhaka Trust", "Wayfinding", "455"]];

export function HeroStudioLedger() {
  return (
    <Section id="hero-studio-ledger" title="Hawa Studio">
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: 24, borderBottom: `2px solid currentColor`, paddingBottom: 18 }}>
        <h1 id="hero-studio-ledger-title" style={h("clamp(2.6rem, 8vw, 7rem)")}>Hawa Studio</h1>
        <div><p style={label}>Projects shipped since 2011</p><SplitFlap value="0312" cellStyle={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)" }} /></div>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: TEXT, marginTop: 8 }}>
        <caption style={{ ...label, textAlign: "left", padding: "14px 0" }}>Recent entries</caption>
        <thead><tr style={{ fontFamily: MONO, fontSize: 12, color: MUTED, textAlign: "left" }}><th scope="col" style={{ padding: "8px 0" }}>Year</th><th scope="col">Client</th><th scope="col" className="ledger-wide">Discipline</th><th scope="col" className="ledger-wide" style={{ textAlign: "right" }}>Hours</th></tr></thead>
        <tbody>{ROWS.map(([y, c, d, hrs]) => (
          <tr key={c} style={{ borderTop: `1px solid ${LINE}` }}>
            <td style={{ padding: "16px 12px 16px 0", fontFamily: MONO, fontSize: 13 }}>{y}</td>
            <td style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.6rem)" }}><ScrambleOnHover text={c} /><span className="ledger-narrow" style={{ display: "block", fontSize: 13, color: MUTED }}>{d} · {hrs} h</span></td>
            <td className="ledger-wide" style={{ color: MUTED }}>{d}</td>
            <td className="ledger-wide" style={{ textAlign: "right", fontFamily: MONO, fontVariantNumeric: "tabular-nums" }}>{hrs}</td>
          </tr>))}</tbody>
      </table>
      <style>{`.ledger-narrow{display:none!important}@media (max-width:640px){.ledger-wide{display:none}.ledger-narrow{display:block!important}}`}</style>
    </Section>
  );
}
