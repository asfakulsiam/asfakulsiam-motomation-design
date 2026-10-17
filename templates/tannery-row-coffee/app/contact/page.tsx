// Contact: when to email, when to just come in, and the form.
import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { shop } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Write to Tannery Row Coffee about a group visit, beans for home or wholesale, or anything about the menu. We reply within two working days.",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <div className="wrap contact">
      <header className="page-head">
        <p className="kicker mono">Contact</p>
        <h1>Write to the bar.</h1>
        <p className="dek">For a table for two, just come in: we don&rsquo;t take bookings. For groups of six or more, beans for home or wholesale, send a note and someone from the counter will reply.</p>
      </header>
      <div className="contact__grid">
        <ContactForm />
        <aside className="contact__aside">
          <h2 className="section-title">Rather email?</h2>
          <p><a href={`mailto:${shop.email}`}>{shop.email}</a></p>
          <h2 className="section-title">Just visiting?</h2>
          <p>Hours, directions and access are on the <Link href="/visit/">visit page</Link>.</p>
        </aside>
      </div>
    </div>
  );
}
