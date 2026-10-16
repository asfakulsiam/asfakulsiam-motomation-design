// @motomation-section
// id: contact-event-venue
// kind: contact
// archetype: stage
// components: Dock, CopyButton
// what: The night's practical details (venue, doors, getting there) with a small dock of the four things people do next: add to calendar, open the map, share, and call the box office.
// signature: A dock of real next actions instead of a contact form, at a fixed size: the magnification was cut (it enlarged four already 48px targets under a mouse only, and gave no reason to move).
// mobile: The dock is a static row of large buttons.
// reduced-motion: Nothing here moves; the copy button's label change is the only feedback.
import { Dock } from "../components/layout/dock";
import { CopyButton } from "../components/micro/copy-button";
import { Section, cols, h, label, MUTED } from "./_shared";

const icon = (d: string) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d={d} /></svg>;

export function ContactEventVenue() {
  return (
    <Section id="contact-event-venue" title="Getting there">
      <h2 id="contact-event-venue-title" style={h("clamp(2rem, 4.4vw, 3.4rem)", { marginBottom: 28 })}>National Theatre Hall, Segunbagicha.</h2>
      <div style={{ ...cols(220, 28), marginBottom: 36 }}>
        <div><p style={label}>Doors</p><p style={{ margin: "6px 0 0" }}>19:00, first set 19:30</p></div>
        <div><p style={label}>Metro</p><p style={{ margin: "6px 0 0" }}>Shahbagh station, 9 min walk</p></div>
        <div><p style={label}>Box office</p><p style={{ margin: "6px 0 0" }}>+880 2 9562 801 <CopyButton text="+88029562801" label="Copy" /></p><p style={{ margin: 0, color: MUTED }}>12:00–20:00 daily</p></div>
      </div>
      <Dock magnify={1} items={[
        { label: "Add to calendar", icon: icon("M4 6h16v14H4zM4 10h16M9 3v4M15 3v4"), href: "#calendar" },
        { label: "Open map", icon: icon("M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"), href: "#map" },
        { label: "Share", icon: icon("M4 12v7h16v-7M12 3v12M7 8l5-5 5 5"), href: "#share" },
        { label: "Call box office", icon: icon("M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"), href: "tel:+88029562801" },
      ]} />
    </Section>
  );
}
