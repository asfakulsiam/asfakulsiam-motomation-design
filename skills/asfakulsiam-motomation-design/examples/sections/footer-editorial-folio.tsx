// @motomation-section
// id: footer-editorial-folio
// kind: footer
// archetype: broadsheet
// components: RememberedList
// what: The paper's footer is a folio line plus "recently read": the stories this reader has opened before (kept on their device), with the sections and the masthead again.
// signature: Recently-read is genuinely useful for a long-read magazine and costs nothing (local storage, no tracking); the folio closes the print metaphor.
// mobile: Columns stack; the list is full width.
// reduced-motion: Nothing animates; the list is static.
import { RememberedList } from "../components/micro/remembered-list";
import { Section, cols, h, label, LINE, MONO } from "./_shared";

export function FooterEditorialFolio() {
  return (
    <Section id="footer-editorial-folio" title="The Delta Review footer" hideTitle style={{ borderTop: "3px double currentColor" }}>
      <div style={cols(260, 40)}>
        <div><p style={label}>You've read</p><RememberedList storageKey="delta-read" items={[{ id: "stilts", label: "The river took the school", href: "#hero-editorial-broadsheet" }, { id: "salt", label: "Salt in the paddy, Satkhira", href: "#salt" }, { id: "boats", label: "The last boatwrights of Barishal", href: "#boats" }]} /></div>
        <div><p style={label}>Sections</p><ul style={{ listStyle: "none", padding: 0, margin: "6px 0 0", lineHeight: 1.6 }}>{["Rivers", "Cities", "Work", "Letters"].map((s) => <li key={s}><a href={`#${s.toLowerCase()}`} style={{ color: "inherit", display: "inline-block", padding: "6px 0" }}>{s}</a></li>)}</ul></div>
        <div><p style={h("2rem")}>The Delta Review</p><p style={{ marginTop: 10 }}>Independent, reader-funded, published from Khulna since 2009.</p></div>
      </div>
      <p style={{ marginTop: 40, paddingTop: 12, borderTop: `1px solid ${LINE}`, fontFamily: MONO, fontSize: 12, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}><span>No. 214 · October 2026</span><span>ISSN 2410-0000</span></p>
    </Section>
  );
}
