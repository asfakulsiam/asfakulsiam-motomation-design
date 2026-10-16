# Form script shared by builds 02-05: client checks mirror the server schema (sec-11 says the server must re-validate),
# then fetch POST; states: default, validation error, pending, success, server error. Messages are per site.
def form_js(sel, endpoint, pending, ok, fail, empty='Please fill this in.'):
    return r'''(() => {
  const form = document.querySelector("%(sel)s"); if (!form) return;
  const btn = form.querySelector("button[type=submit]"), status = form.querySelector(".form-status"), label = btn.textContent;
  const msg = (f, t) => { const m = form.querySelector('[data-for="' + f.name + '"]'); if (m) m.textContent = t; f.setAttribute("aria-invalid", t ? "true" : "false"); };
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); let bad = null;
    for (const f of form.querySelectorAll("input, select, textarea")) {
      const v = f.value.trim(); let t = "";
      if (f.required && !v) t = "%(empty)s";
      else if (v && f.type === "tel" && !/^[+0-9 -]{7,16}$/.test(v)) t = "Enter a phone number, digits only.";
      else if (v && f.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) t = "Enter an email address like name@example.com.";
      else if (v && f.type === "number" && (+v < +(f.min || -1e9) || +v > +(f.max || 1e9))) t = "Enter a number from " + f.min + " to " + f.max + ".";
      msg(f, t); if (t && !bad) bad = f;
    }
    if (bad) { status.className = "form-status is-error"; status.textContent = "Please fix the marked fields."; bad.focus(); return; }
    btn.disabled = true; btn.textContent = "%(pending)s"; form.setAttribute("aria-busy", "true"); status.className = "form-status"; status.textContent = "";
    try {
      const r = await fetch("%(endpoint)s", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      if (!r.ok) throw new Error(String(r.status));
      status.className = "form-status is-ok"; status.textContent = "%(ok)s"; form.reset();
    } catch {
      status.className = "form-status is-error"; status.textContent = "%(fail)s";
    } finally { btn.disabled = false; btn.textContent = label; form.removeAttribute("aria-busy"); }
  });
})();
''' % dict(sel=sel, endpoint=endpoint, pending=pending, ok=ok, fail=fail, empty=empty)
