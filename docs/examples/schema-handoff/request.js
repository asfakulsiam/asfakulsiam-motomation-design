// Request form states: idle → sending → sent | error (SCHEMA.md, section #request). Validation is repeated on the server.
const form = document.getElementById("request-form");
const status = form.querySelector(".status");
const set = (state, text) => { status.dataset.state = state; status.textContent = text; };
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!form.checkValidity()) { set("error", "Please fill in your name, a way to reach you and what the book needs."); return; }
  const files = form.photos.files;
  if (files.length > 3 || [...files].some((f) => f.size > 5 * 1024 * 1024)) { set("error", "Up to 3 photos, 5 MB each."); return; }
  set("sending", "Sending your docket…"); form.querySelector("button").disabled = true;
  try {
    const res = await fetch(form.action, { method: "POST", body: new FormData(form) });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.message || "The request did not go through.");
    set("sent", `Docket ${body.docket} is open. We reply within one working day.`); form.reset();
  } catch (err) { set("error", `${err.message} Please try again, or call the shop.`); }
  finally { form.querySelector("button").disabled = false; }
});
