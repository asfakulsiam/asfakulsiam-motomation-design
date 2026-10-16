// Tier 1. One state script: today's sentence, the ward lookup (signature: the sentence answers your ward), the outage
// tables (skeleton while loading, error with retry, empty), and the language toggle. No animation at all.
(() => {
  const $ = (s) => document.querySelector(s); const bn = () => document.documentElement.lang === "bn";
  const BN = (n) => String(n).replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);
  let data = null;
  const say = (el, parts) => { el.replaceChildren(...parts.map((p) => typeof p === "string" ? document.createTextNode(p) : Object.assign(document.createElement("b"), { textContent: p.b }))); };
  const sentence = () => { const el = $(".sentence"); if (!el || !data) return; const n = data.wards.filter((w) => w.cut).length;
    say(el, bn() ? ["আজ ৩০টি ওয়ার্ডের মধ্যে ", { b: BN(n) + "টিতে" }, " পানি সরবরাহ বন্ধ।"] : ["Today, ", { b: n + " of 30" }, " wards have a supply cut."]); el.setAttribute("aria-busy", "false"); };
  const row = (cells, cls) => { const tr = document.createElement("tr"); if (cls) tr.className = cls; for (const [t, c] of cells) { const td = document.createElement("td"); td.textContent = t; if (c) td.className = c; tr.append(td); } return tr; };
  const fill = () => document.querySelectorAll("tbody[data-entity=outage]").forEach((tb) => {
    const list = tb.dataset.filter === "cut" ? data.wards.filter((w) => w.cut) : data.wards;
    tb.replaceChildren(...(list.length ? list.map((w) => row(tb.dataset.filter === "cut" ? [["Ward " + w.ward], [w.area], [w.back]] : [["Ward " + w.ward], [w.area], [w.cut ? "Supply cut, back " + w.back : "Water on", w.cut ? "st-cut" : "st-ok"]])) : [row([["No supply cuts today in any ward."]], "msg")]));
    if (!list.length) tb.firstChild.firstChild.colSpan = 3; tb.setAttribute("aria-busy", "false"); });
  const fail = () => { document.querySelectorAll("tbody[data-entity=outage]").forEach((tb) => { const tr = row([["Could not load today's outage list. Check your connection."]], "msg"); tr.firstChild.colSpan = 3;
      const b = document.createElement("button"); b.type = "button"; b.textContent = "Try again"; b.addEventListener("click", load); tr.firstChild.append(" ", b); tb.replaceChildren(tr); tb.setAttribute("aria-busy", "false"); });
    const el = $(".sentence"); if (el) { el.textContent = "Today's supply list could not load. Call 0721-000000."; el.setAttribute("aria-busy", "false"); } };
  async function load() { try { const r = await fetch("/data/outages.json", { cache: "no-store" }); if (!r.ok) throw 0; data = await r.json(); sentence(); fill();
      const u = $("#updated"); if (u) u.textContent = "Last update: " + new Date(data.updated).toLocaleString("en-GB", { timeZone: "Asia/Dhaka" }) + "."; } catch { fail(); } }
  const d = $("#today-date"); if (d) d.textContent = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "Asia/Dhaka" });
  if (document.querySelector("tbody[data-entity=outage], .sentence")) load();
  const go = $("#ward-go"), inp = $("#ward-no"), msg = $("#ward-msg");
  if (go) { const check = () => { const n = parseInt(inp.value, 10);
      if (!(n >= 1 && n <= 30)) { inp.setAttribute("aria-invalid", "true"); msg.textContent = "Enter a ward number from 1 to 30."; inp.focus(); return; }
      inp.setAttribute("aria-invalid", "false"); msg.textContent = ""; if (!data) { msg.textContent = "Still loading today's list, try again in a moment."; return; }
      const w = data.wards[n - 1]; const el = $(".sentence");
      say(el, w.cut ? ["Ward " + n + ", " + w.area + ": ", { b: "no water" }, " until " + w.back + "."] : ["Ward " + n + ", " + w.area + ": ", { b: "water is on" }, " today."]);
      msg.textContent = "Showing ward " + n + ". Clear the box to see the whole city."; };
    go.addEventListener("click", check); inp.addEventListener("keydown", (e) => { if (e.key === "Enter") check(); });
    inp.addEventListener("input", () => { if (!inp.value) { msg.textContent = ""; inp.removeAttribute("aria-invalid"); sentence(); } }); }
  const lang = $(".lang"); if (lang) lang.addEventListener("click", () => { const toBn = !bn(); document.documentElement.lang = toBn ? "bn" : "en"; lang.setAttribute("aria-pressed", String(toBn)); lang.textContent = toBn ? "English" : "বাংলা"; lang.lang = toBn ? "en" : "bn";
    document.querySelectorAll("[data-bn]").forEach((a) => { if (!a.dataset.en) a.dataset.en = a.textContent; a.textContent = toBn ? a.dataset.bn : a.dataset.en; }); sentence(); });
})();
