# Build 5 · Rajshahi City Water Supply Authority (diversity brief 05). Writes ../05-municipal-water-authority/.
import os, json, forms
OUT = os.path.join(os.path.dirname(__file__), '..', '05-municipal-water-authority'); os.makedirs(os.path.join(OUT, 'data'), exist_ok=True)
DOMAIN = 'https://rajshahiwater.example'
FONTS = '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Noto+Sans+Bengali:wght@400;700&display=swap">'
CSP = "default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self'; img-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'self'"
STAMP = '<!-- motomation · archetype: manifesto · mutation: single-object (today\'s sentence) · signature: ward-sentence · tier: 1 · critique: <paste> · gate: <paste> -->'
NAV = [('/', 'Today', 'আজ'), ('/outages.html', 'Outages', 'সরবরাহ বন্ধ'), ('/bills.html', 'Bills', 'বিল'), ('/report.html', 'Report a problem', 'সমস্যা জানান'), ('/water-quality.html', 'Water quality', 'পানির মান')]
def head(title, desc, path, page):
    # the current page is marked, not linked: a link to the page you are on changes nothing when tapped
    nav = ''.join(f'<span data-bn="{b}" aria-current="page">{t}</span>' if h == path else f'<a href="{h}" data-bn="{b}">{t}</a>' for h, t, b in NAV)
    ld = {"@context": "https://schema.org", "@type": "GovernmentOrganization", "name": "Rajshahi City Water Supply Authority", "areaServed": "Rajshahi City Corporation"}
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="{CSP}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>{title}</title>
<meta name="description" content="{desc}">
{'' if page == '404' else f'<link rel="canonical" href="{DOMAIN}{path}">'}
<meta property="og:title" content="{title}"><meta property="og:description" content="{desc}"><meta property="og:image" content="{DOMAIN}/og.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
{FONTS}
<link rel="stylesheet" href="/style.css">
<script type="application/ld+json">{json.dumps(ld)}</script>
</head>
<body class="p-{page}">
{STAMP}
<a class="skip" href="#main">Skip to main content</a>
<header class="top"><div class="bar"><a class="org" href="/"><span class="org-mark" aria-hidden="true">RW</span><span>Rajshahi City Water Supply Authority</span></a><button class="lang" type="button" aria-pressed="false" lang="bn">বাংলা</button></div><nav aria-label="Main">{nav}</nav></header>
'''
FOOT = '''<footer class="foot"><p><b>Rajshahi City Water Supply Authority</b> · Helpline 0721-000000, 24 hours · <a href="/report.html">Report a problem</a> · <a href="/water-quality.html">Water quality</a></p><p>The Bangla switch translates the navigation and the ward sentence; the rest of this demo site is in English. Sample content: the helpline, tariffs, outage data and water-quality readings are illustrative.</p></footer>
<script src="/site.js" defer></script>
'''
SKEL = '<tr class="skel"><td colspan="3"><span></span></td></tr>' * 4
index = head('Rajshahi water: today\'s supply cuts by ward', 'Check whether your ward has a water supply cut today, pay or understand your bill, report a leak and read the monthly quality report.', '/', 'home') + f'''<main id="main">
<section class="today" aria-labelledby="h1"><p class="date" id="today-date">Today</p><h1 id="h1" class="sentence" aria-live="polite" aria-busy="true"><span class="skel-line"></span></h1>
<search class="ward" aria-label="Check your ward"><label for="ward-no">Your ward number (1 to 30)</label><div class="ward-row"><input id="ward-no" inputmode="numeric" pattern="[0-9]*" maxlength="2" autocomplete="off"><button type="button" id="ward-go">Check my ward</button></div><p class="ward-msg" id="ward-msg" aria-live="polite"></p></search></section>
<section class="cuts" aria-labelledby="h-cuts"><h2 id="h-cuts">Wards with a cut today</h2><table class="table"><thead><tr><th scope="col">Ward</th><th scope="col">Area</th><th scope="col">Expected back</th></tr></thead><tbody data-entity="outage" data-filter="cut" aria-busy="true">{SKEL}</tbody></table><p><a href="/outages.html">All 30 wards</a></p></section>
<section class="jobs" aria-labelledby="h-jobs"><h2 id="h-jobs">Other things you can do</h2><ul><li><a href="/bills.html">Understand or pay a bill</a></li><li><a href="/report.html">Report a leak or dirty water</a></li><li><a href="/water-quality.html">Read this month's water quality report</a></li></ul></section>
</main>
''' + FOOT + '</body>\n</html>\n'
outages = head('Supply cuts by ward · Rajshahi water', 'The full list of all 30 Rajshahi wards with today\'s water supply status and the time supply is expected back.', '/outages.html', 'outages') + f'''<main id="main"><h1>Supply status, all 30 wards</h1><p class="lede">Updated every morning at 6 and when a cut starts or ends. <span id="updated"></span></p>
<table class="table"><thead><tr><th scope="col">Ward</th><th scope="col">Area</th><th scope="col">Status</th></tr></thead><tbody data-entity="outage" data-filter="all" aria-busy="true">{SKEL}</tbody></table></main>
''' + FOOT + '</body>\n</html>\n'
bills = head('Water bills and tariffs · Rajshahi water', 'Water tariffs per 1,000 litres for homes and businesses, how to read your bill, and where to pay it.', '/bills.html', 'bills') + '''<main id="main"><h1>Bills and tariffs</h1>
<h2>Tariff per 1,000 litres</h2><table class="table"><thead><tr><th scope="col">Connection</th><th scope="col">Price per 1,000 litres</th></tr></thead><tbody><tr><td>Home</td><td>BDT 12 (sample)</td></tr><tr><td>Business</td><td>BDT 30 (sample)</td></tr><tr><td>Public standpipe</td><td>Free</td></tr></tbody></table>
<h2>Reading your bill</h2><ol class="steps"><li>Your account number is at the top left. Keep it for every payment.</li><li>Usage is the difference between this month's and last month's meter reading, in thousands of litres.</li><li>Pay by the due date shown on the bill to avoid a late fee.</li></ol>
<h2>Where to pay</h2><p>At any ward office counter, at a partner bank, or by mobile banking with the account number printed on your bill.</p><p><a href="/report.html">Report a wrong bill</a></p></main>
''' + FOOT + '</body>\n</html>\n'
report = head('Report a leak or dirty water · Rajshahi water', 'Report a leak, dirty water or no water to the Rajshahi water authority. You get a reference number to track it.', '/report.html', 'report') + '''<main id="main"><h1>Report a problem</h1><p class="lede">You will get a reference number. For a burst main, call 0721-000000 now.</p>
<form id="report" class="form" novalidate aria-label="Report a problem">
<div class="field"><label for="kind">What is wrong?</label><select id="kind" name="kind" required><option value="">Choose one</option><option>Leak or burst pipe</option><option>Dirty or smelly water</option><option>No water</option><option>Wrong bill</option></select><span class="err" data-for="kind" aria-live="polite"></span></div>
<div class="field"><label for="ward">Ward number</label><input id="ward" name="ward" type="number" min="1" max="30" inputmode="numeric" required><span class="err" data-for="ward" aria-live="polite"></span></div>
<div class="field"><label for="where">Where exactly? (road, landmark)</label><input id="where" name="where" required><span class="err" data-for="where" aria-live="polite"></span></div>
<div class="field"><label for="phone">Phone, so we can call you back</label><input id="phone" name="phone" type="tel" autocomplete="tel" required><span class="err" data-for="phone" aria-live="polite"></span></div>
<button type="submit">Send the report</button>
<p class="form-status" role="status" aria-live="polite"></p>
</form></main>
''' + FOOT + '<script src="/report.js" defer></script>\n</body>\n</html>\n'
Q = [("Free chlorine", "mg/L", 0, 1.0, 0.2, 0.5, 0.34), ("Turbidity", "NTU", 0, 10, 0, 5, 1.8), ("E. coli", "per 100 mL", 0, 10, 0, 0, 0)]
def ruler(n, u, lo, hi, s0, s1, v):
    pct = lambda x: f"{(x - lo) / (hi - lo) * 100:.1f}%"
    safe = f"safe {s0} to {s1} {u}" if s1 > s0 else f"safe: {s0} {u}"
    return f'<li class="q"><h3>{n}</h3><p class="q-val"><b>{v}</b> {u} · <span>{safe}</span> · within limit (demo)</p><div class="gauge q-{n.split()[0].lower().replace(".", "")}" role="img" aria-label="{n}: {v} {u}, {safe}"><span class="band"></span><span class="mark"></span></div><p class="scale"><span>{lo}</span><span>{hi} {u}</span></p></li>'
qcss = ''.join(f'.q-{n.split()[0].lower().replace(".", "")} .band {{ left: {(s0 - lo) / (hi - lo) * 100:.1f}%; width: {max((s1 - s0) / (hi - lo) * 100, 1.2):.1f}%; }} .q-{n.split()[0].lower().replace(".", "")} .mark {{ left: {(v - lo) / (hi - lo) * 100:.1f}%; }}\n' for n, u, lo, hi, s0, s1, v in Q)
quality = head('Water quality report · Rajshahi water', 'This month\'s tap water quality in Rajshahi: free chlorine, turbidity and E. coli, each measured against the safe limit.', '/water-quality.html', 'quality') + '''<main id="main"><h1>Water quality this month</h1><p class="lede">Sampled at 60 taps across the city. The readings below are sample values, not a real monthly report. Each ruler shows the safe range and this month's reading.</p>
<ul class="quality">''' + ''.join(ruler(*q) for q in Q) + '''</ul><p><a href="/report.html">Report dirty water</a></p></main>
''' + FOOT + '</body>\n</html>\n'
nf = head('Page not found · Rajshahi water', 'This page does not exist. Check today\'s supply cuts or report a problem instead.', '/404.html', '404') + '''<main id="main"><h1>Page not found</h1><p class="lede">This address is not on the site (error 404).</p><ul class="jobs-list"><li><a href="/">Today's supply cuts</a></li><li><a href="/report.html">Report a problem</a></li></ul></main>
''' + FOOT + '</body>\n</html>\n'
AREAS = ["Shaheb Bazar", "Ghoramara", "Boalia", "Rajpara", "Kazla", "Motihar", "Talaimari", "Uposhohor", "Laxmipur", "Shiroil", "Kadirganj", "Hetem Khan", "Sagorpara", "Kumarpara", "Ranibazar", "Padma Residential", "Sapura", "Baliapukur", "Terokhadia", "Chhoto Bongram", "Horogram", "Keshobpur", "Kashiadanga", "Naodapara", "Bhadra", "Binodpur", "Meherchandi", "Budhpara", "Khorkhori", "Shalbagan"]
CUT = {4: "4 pm", 14: "6 pm", 22: "tomorrow 6 am"}
data = {"demo": True, "note": "Demo data. Replace with the authority's daily outage feed before launch.", "updated": "2026-10-16T06:00:00+06:00",
        "wards": [{"demo": True, "ward": i + 1, "area": a, "cut": (i + 1) in CUT, "back": CUT.get(i + 1)} for i, a in enumerate(AREAS)]}
CSS = r''':root { --ink: #0b1f33; --soft: #3d4f63; --blue: #0057b8; --line: #c7d0da; --pale: #eef3f8; }
* { box-sizing: border-box; }
html { background: #fff; color: var(--ink); }
body { margin: 0; font: 400 1.125rem/1.6 "Atkinson Hyperlegible", "Noto Sans Bengali", Verdana, sans-serif; }
:lang(bn) { font-family: "Noto Sans Bengali", "Atkinson Hyperlegible", sans-serif; }
::selection { background: var(--blue); color: #fff; }
a { color: var(--blue); text-underline-offset: 3px; }
a:hover { color: var(--ink); text-decoration-thickness: 3px; }
:focus-visible { outline: 3px solid var(--ink); outline-offset: 2px; box-shadow: 0 0 0 6px #ffd23f; }
.skip { position: absolute; left: -999px; } .skip:focus { left: 1rem; top: 1rem; z-index: 9; background: #fff; padding: .5rem 1rem; }
.top { border-bottom: 4px solid var(--blue); }
.bar { max-width: 64rem; margin: 0 auto; padding: .75rem 1rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
.org { display: flex; align-items: center; gap: .6rem; font-weight: 700; color: var(--ink); text-decoration: none; line-height: 1.25; }
.org-mark { flex: none; width: 2.5rem; height: 2.5rem; border-radius: 50%; background: var(--blue); color: #fff; display: grid; place-items: center; font-size: .9rem; }
.lang { font: 700 1rem/1 "Noto Sans Bengali", sans-serif; min-height: 44px; min-width: 44px; padding: .5rem .9rem; border: 2px solid var(--ink); background: #fff; color: var(--ink); border-radius: 4px; cursor: pointer; }
.lang:hover { background: var(--pale); }
.lang[aria-pressed="true"] { background: var(--ink); color: #fff; }
.top nav { max-width: 64rem; margin: 0 auto; padding: 0 1rem; display: flex; flex-wrap: wrap; gap: 0 .25rem; }
.top nav a, .top nav [aria-current] { padding: .7rem .6rem; color: var(--ink); text-decoration: none; border-bottom: 4px solid transparent; margin-bottom: -4px; }
.top nav a:hover { border-bottom-color: var(--soft); }
.top nav [aria-current] { font-weight: 700; border-bottom-color: var(--ink); }
main { max-width: 64rem; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
h1 { font-size: clamp(1.9rem, 5vw, 2.6rem); line-height: 1.15; margin: .5rem 0 1rem; }
h2 { font-size: 1.4rem; margin: 2.25rem 0 .75rem; }
h3 { font-size: 1.15rem; margin: 0 0 .25rem; }
p { max-width: 65ch; margin: 0 0 1rem; } .lede { color: var(--soft); }
.today { padding: 1rem 0 1.5rem; border-bottom: 1px solid var(--line); }
.date { color: var(--soft); margin: 0; font-weight: 700; }
.sentence { font-size: clamp(2.1rem, 7vw, 4.2rem); line-height: 1.08; letter-spacing: -.01em; max-width: 18ch; min-height: 2.2em; }
.sentence b { color: var(--blue); }
.skel-line, .skel span { display: block; height: .9em; width: 80%; border-radius: 4px; background: linear-gradient(90deg, var(--pale), #dde5ee, var(--pale)); }
.skel span { height: 1.1em; width: 100%; }
.ward label { display: block; font-weight: 700; margin-bottom: .35rem; }
.ward-row { display: flex; flex-wrap: wrap; gap: .5rem; }
input, select { font: inherit; min-height: 48px; padding: .5rem .75rem; border: 2px solid var(--ink); border-radius: 4px; background: #fff; color: var(--ink); }
#ward-no { width: 6rem; }
input[aria-invalid="true"], select[aria-invalid="true"] { border-color: #b00020; border-width: 3px; }
button { font: 700 1.05rem/1.2 "Atkinson Hyperlegible", sans-serif; min-height: 48px; padding: .6rem 1.2rem; border: 2px solid var(--blue); background: var(--blue); color: #fff; border-radius: 4px; cursor: pointer; }
button:hover { background: var(--ink); border-color: var(--ink); }
button:active { transform: translateY(1px); }
button:disabled { opacity: .7; cursor: progress; }
.ward-msg { margin: .5rem 0 0; min-height: 1.6em; font-weight: 700; }
.table { width: 100%; border-collapse: collapse; margin: .5rem 0 1rem; }
.table th, .table td { text-align: left; padding: .65rem .5rem; border-bottom: 1px solid var(--line); vertical-align: top; }
.table thead th { border-bottom: 2px solid var(--ink); }
.table tbody tr:hover { background: var(--pale); }
.st-cut { font-weight: 700; color: #b00020; } .st-ok { color: #11663a; }
.table .msg td { color: var(--soft); }
.jobs ul, .jobs-list { padding-left: 1.2rem; } .jobs li, .jobs-list li { padding: .1rem 0; }
/* stand-alone links get a 44px target: the first build measured 22px (gate targets) */
.jobs a, .jobs-list a, .cuts > p > a, main > p > a { display: inline-block; padding: .55rem 0; min-height: 44px; }
.steps li { margin-bottom: .5rem; }
.form { max-width: 34rem; display: grid; gap: 1.1rem; }
.field { display: grid; gap: .3rem; } label { font-weight: 700; }
.err { color: #b00020; font-weight: 700; min-height: 1.2em; }
.form-status { font-weight: 700; min-height: 1.5em; margin: 0; } .is-ok { color: #11663a; } .is-error { color: #b00020; }
.quality { list-style: none; padding: 0; display: grid; gap: 2rem; max-width: 44rem; }
.q-val b { font-size: 1.6rem; }
.gauge { position: relative; height: 2.25rem; background: repeating-linear-gradient(90deg, var(--ink) 0 2px, transparent 2px 10%) bottom / 100% 40% no-repeat, var(--pale); border: 2px solid var(--ink); }
.band { position: absolute; top: 0; bottom: 0; background: #b9d5f2; border-left: 2px solid var(--blue); border-right: 2px solid var(--blue); }
.mark { position: absolute; top: -.6rem; bottom: -.6rem; width: 4px; margin-left: -2px; background: var(--ink); }
.scale { display: flex; justify-content: space-between; color: var(--soft); font-size: 1rem; margin: .25rem 0 0; max-width: none; }
.foot { border-top: 1px solid var(--line); background: var(--pale); padding: 1.5rem 1rem; font-size: 1rem; }
.foot p { max-width: 64rem; margin: 0 auto .5rem; }
@media (max-width: 600px) { .org span:last-child { font-size: .95rem; } .table th, .table td { padding: .55rem .3rem; } }
''' + qcss
SJS = r'''// Tier 1. One state script: today's sentence, the ward lookup (signature: the sentence answers your ward), the outage
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
'''
files = {'index.html': index, 'outages.html': outages, 'bills.html': bills, 'report.html': report, 'water-quality.html': quality, '404.html': nf, 'style.css': CSS, 'site.js': SJS,
 'report.js': forms.form_js('#report', '/api/report', 'Sending the report…', 'Thank you. Report received; we will send a reference number by SMS.', 'Sorry, we could not send your report. Please try again, or call 0721-000000.'),
 'data/outages.json': json.dumps(data, ensure_ascii=False, indent=1),
 'sitemap.xml': '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(f'<url><loc>{DOMAIN}{p}</loc></url>\n' for p in ['/', '/outages.html', '/bills.html', '/report.html', '/water-quality.html']) + '</urlset>\n',
 'robots.txt': f'User-agent: *\nAllow: /\nSitemap: {DOMAIN}/sitemap.xml\n',
 '_headers': '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n'}
for n, c in files.items(): open(os.path.join(OUT, n), 'w').write(c)
print('wrote', len(files), 'files to', os.path.abspath(OUT))
