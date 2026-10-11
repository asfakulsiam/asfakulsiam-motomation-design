// @motomation-section
// id: cta-shop-hold
// kind: cta
// archetype: catalogue
// components: HoldToCommit
// what: Reserving a piece from a small firing takes a deliberate press and hold, because there are nine and each one is unique; it confirms in words.
// signature: The hold matches the stakes (a unique object, held for 48 hours), and the confirmation names the object number.
// mobile: The hold button is full width with a large target.
// reduced-motion: Hold still works; the fill is linear with no flourish.
import { useState } from "react";
import { HoldToCommit } from "../components/micro/hold-to-commit";
import { Section, body, h, label } from "./_shared";

export function CtaShopHold() {
  const [held, setHeld] = useState(false);
  return (
    <Section id="cta-shop-hold" title="Reserve">
      <div style={{ maxWidth: 640, display: "grid", gap: 20 }}>
        <p style={label}>No. 14-07 · 9 left</p>
        <h2 id="cta-shop-hold-title" style={h("clamp(2rem, 4.4vw, 3.4rem)")}>Hold one for 48 hours.</h2>
        <p style={body}>We'll keep the plate aside while you decide. Pay on delivery anywhere in Bangladesh.</p>
        <HoldToCommit label="Press and hold to reserve" doneLabel="Reserved" onCommit={() => setHeld(true)} />
        <p role="status" style={{ ...body, minHeight: "1.6em" }}>{held ? "No. 14-07 is held for you until Thursday, 18:00. We've sent the details by SMS." : ""}</p>
      </div>
    </Section>
  );
}
