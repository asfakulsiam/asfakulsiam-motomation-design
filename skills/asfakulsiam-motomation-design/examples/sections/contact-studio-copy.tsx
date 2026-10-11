// @motomation-section
// id: contact-studio-copy
// kind: contact
// archetype: ledger
// components: CopyButton, SplitFlap
// what: Contact as the last page of the ledger: the address, the hours, and the email with a copy button that confirms, plus the studio's current wait time on a flap board.
// signature: The wait time is the real answer to "can you take us on", and copying the email is the action people actually take (no form).
// mobile: Columns stack; the copy button sits under the email.
// reduced-motion: The board shows the final value; copy confirms in text.
import { CopyButton } from "../components/micro/copy-button";
import { SplitFlap } from "../components/type/split-flap";
import { Section, cols, h, label, MUTED } from "./_shared";

export function ContactStudioCopy() {
  return (
    <Section id="contact-studio-copy" title="Contact">
      <h2 id="contact-studio-copy-title" style={h("clamp(2rem, 4.4vw, 3.4rem)", { marginBottom: 36 })}>Write to us.</h2>
      <div style={cols(240, 36)}>
        <div style={{ display: "grid", gap: 10 }}><p style={label}>Email</p><p style={h("1.6rem")}>work@hawa.studio</p><CopyButton text="work@hawa.studio" label="Copy email" /></div>
        <div style={{ display: "grid", gap: 10 }}><p style={label}>Studio</p><p style={{ margin: 0, lineHeight: 1.6 }}>House 9, Road 4<br />Dhanmondi, Dhaka 1205<br /><span style={{ color: MUTED }}>Sun–Thu, 10:00–18:00</span></p></div>
        <div style={{ display: "grid", gap: 10 }}><p style={label}>Next free start</p><SplitFlap value="JAN 2027" cellStyle={{ fontSize: 26 }} /></div>
      </div>
    </Section>
  );
}
