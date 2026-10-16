(() => {
  const form = document.querySelector("#notify"); if (!form) return;
  const btn = form.querySelector("button[type=submit]"), status = form.querySelector(".form-status"), label = btn.textContent;
  const msg = (f, t) => { const m = form.querySelector('[data-for="' + f.name + '"]'); if (m) m.textContent = t; f.setAttribute("aria-invalid", t ? "true" : "false"); };
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); let bad = null;
    for (const f of form.querySelectorAll("input, select, textarea")) {
      const v = f.value.trim(); let t = "";
      if (f.required && !v) t = "Please enter your email.";
      else if (v && f.type === "tel" && !/^[+0-9 -]{7,16}$/.test(v)) t = "Enter a phone number, digits only.";
      else if (v && f.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) t = "Enter an email address like name@example.com.";
      else if (v && f.type === "number" && (+v < +(f.min || -1e9) || +v > +(f.max || 1e9))) t = "Enter a number from " + f.min + " to " + f.max + ".";
      msg(f, t); if (t && !bad) bad = f;
    }
    if (bad) { status.className = "form-status is-error"; status.textContent = "Please fix the marked fields."; bad.focus(); return; }
    btn.disabled = true; btn.textContent = "SENDING…"; form.setAttribute("aria-busy", "true"); status.className = "form-status"; status.textContent = "";
    try {
      const r = await fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      if (!r.ok) throw new Error(String(r.status));
      status.className = "form-status is-ok"; status.textContent = "Got it. You are on the list: one email when the drop opens, nothing else."; form.reset();
    } catch {
      status.className = "form-status is-error"; status.textContent = "Sorry, that did not go through. Try again in a minute.";
    } finally { btn.disabled = false; btn.textContent = label; form.removeAttribute("aria-busy"); }
  });
})();
