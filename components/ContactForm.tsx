"use client";
// Contact form with validation, pending, success and error states. It posts to /api/contact, which this static demo
// tier 1 · use-when: a short message to the shop · avoid-when: bookings or payments (needs a real backend) · reduced-motion: no motion · touch: 48px fields, native keyboard types
// does not provide: a 404 says so plainly, and nothing is ever reported as sent unless the server accepts it.
import { useRef, useState, type FormEvent } from "react";
import { shop } from "@/lib/site";

type Fields = { name: string; email: string; topic: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;
type Phase = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Tell us your name.";
  if (!f.email.trim()) e.email = "Add an email address so we can reply.";
  else if (!EMAIL.test(f.email.trim())) e.email = "That email address looks incomplete, for example name@example.com.";
  if (!f.topic) e.topic = "Choose what your message is about.";
  if (f.message.trim().length < 10) e.message = "Write at least a sentence (10 characters or more).";
  return e;
}

export function ContactForm() {
  const [fields, setFields] = useState<Fields>({ name: "", email: "", topic: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const form = useRef<HTMLFormElement>(null);
  const set = (k: keyof Fields) => (ev: { target: { value: string } }) => {
    setFields((f) => ({ ...f, [k]: ev.target.value }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  async function submit(ev: FormEvent) {
    ev.preventDefault();
    const found = validate(fields);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) { form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus(); return; }
    setPhase({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fields) });
      if (res.ok) { setPhase({ kind: "sent" }); return; }
      // 404, 405 or 501: a static host with no message service behind /api/contact
      setPhase({ kind: "error", message: [404, 405, 501].includes(res.status)
        ? `The message service isn't connected in this demo build, so nothing was sent. Email ${shop.email} instead.`
        : `We couldn't send that (error ${res.status}). Your message is still here; try again, or email ${shop.email}.` });
    } catch {
      setPhase({ kind: "error", message: `We couldn't reach the server. Check your connection and try again; your message is still here.` });
    }
  }

  if (phase.kind === "sent") {
    return (
      <div className="form-done" role="status">
        <h2>Thanks, {fields.name.trim().split(" ")[0]}.</h2>
        <p>Your message reached the bar. We reply within two working days, usually sooner.</p>
        <button type="button" className="button button--quiet" onClick={() => { setFields({ name: "", email: "", topic: "", message: "" }); setPhase({ kind: "idle" }); }}>Write another message</button>
      </div>
    );
  }

  const sending = phase.kind === "sending";
  const field = (k: keyof Fields) => ({ id: `f-${k}`, name: k, value: fields[k], onChange: set(k), "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `f-${k}-error` : undefined, disabled: sending });
  const err = (k: keyof Fields) => errors[k] ? <p className="field__error" id={`f-${k}-error`}>{errors[k]}</p> : null;

  return (
    <form ref={form} className="form" onSubmit={submit} noValidate aria-busy={sending}>
      {phase.kind === "error" ? <p className="form__alert" role="alert">{phase.message}</p> : null}
      <div className="field"><label htmlFor="f-name">Your name</label><input {...field("name")} type="text" autoComplete="name" required />{err("name")}</div>
      <div className="field"><label htmlFor="f-email">Email</label><input {...field("email")} type="email" autoComplete="email" inputMode="email" required />{err("email")}</div>
      <div className="field">
        <label htmlFor="f-topic">About</label>
        <select {...field("topic")} required>
          <option value="">Choose one</option>
          <option value="visit">A visit or a question about the menu</option>
          <option value="group">A group of six or more</option>
          <option value="beans">Beans or wholesale</option>
          <option value="other">Something else</option>
        </select>
        {err("topic")}
      </div>
      <div className="field"><label htmlFor="f-message">Message</label><textarea {...field("message")} rows={6} required />{err("message")}</div>
      <p className="form__note">We use these details only to reply. See the <a href="/privacy/">privacy note</a>.</p>
      <button type="submit" className="button" disabled={sending}>{sending ? "Sending…" : "Send message"}</button>
    </form>
  );
}
