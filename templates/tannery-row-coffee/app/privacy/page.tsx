// Privacy note: what the contact form collects and what the site does not do.
import type { Metadata } from "next";
import { shop } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Tannery Row Coffee does with the details you send through the contact form, and what this website does not collect.",
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <div className="wrap prose">
      <header className="page-head">
        <p className="kicker mono">Privacy</p>
        <h1>What we keep, and why.</h1>
      </header>
      <h2>The contact form</h2>
      <p>It asks for your name, your email address, a topic and your message. We use them only to reply to you, and delete the message twelve months after the last reply.</p>
      <h2>What this site does not do</h2>
      <p>No cookies, no analytics and no advertising trackers. Fonts and images are served from this site, not from third parties.</p>
      <h2>Questions</h2>
      <p>Email <a href={`mailto:${shop.email}`}>{shop.email}</a> to ask what we hold about you, or to have it deleted.</p>
      <p className="mono prose__demo">Demo build: this note describes the intended policy. The shop&rsquo;s real policy replaces it before launch.</p>
    </div>
  );
}
