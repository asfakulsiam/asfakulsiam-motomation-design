# Build 4 · Oud No. 7 by Maison Ilham (diversity brief 04). Writes ../04-luxury-perfume/.
import os, json, forms
OUT = os.path.join(os.path.dirname(__file__), '..', '04-luxury-perfume'); os.makedirs(OUT, exist_ok=True)
DOMAIN = 'https://maisonilham.example'
FONTS = '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;1,6..96,400&family=Jost:wght@300;400&display=swap">'
CSP = "default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self'; img-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'self'"
STAMP = '<!-- motomation · archetype: stage · mutation: invert-axis (time runs backwards) · signature: seven-year-ruler · tier: 3 · critique: <paste> · gate: <paste> -->'
BOTTLE = '''<svg class="bottle" viewBox="0 0 200 320" role="img" aria-label="Oud No. 7, a squat glass bottle with a brass cap, bottle 41 of 120 [NEEDS ASSET: photograph]"><defs><radialGradient id="glow" cx="50%" cy="58%" r="55%"><stop offset="0" stop-color="#3a2a1c"/><stop offset="1" stop-color="#120e0b" stop-opacity="0"/></radialGradient><clipPath id="glass"><path d="M48 120c0-14 10-22 26-22h52c16 0 26 8 26 22v150c0 18-12 30-30 30H78c-18 0-30-12-30-30z"/></clipPath></defs><circle cx="100" cy="190" r="150" fill="url(#glow)"/><rect x="78" y="40" width="44" height="52" rx="4" fill="#c9893b"/><rect x="86" y="88" width="28" height="14" fill="#8a5d27"/><path d="M48 120c0-14 10-22 26-22h52c16 0 26 8 26 22v150c0 18-12 30-30 30H78c-18 0-30-12-30-30z" fill="#1d1712" stroke="#e8dfd2" stroke-opacity=".5" stroke-width="1.5"/><g clip-path="url(#glass)"><rect class="liquid" x="40" y="150" width="120" height="160" fill="#c9893b"/></g><text x="100" y="230" text-anchor="middle" font-family="Bodoni Moda, serif" font-style="italic" font-size="22" fill="#e8dfd2">No. 7</text></svg>'''
def head(title, desc, path, page):
    ld = {"@context": "https://schema.org", "@type": "Product", "name": "Oud No. 7", "brand": {"@type": "Brand", "name": "Maison Ilham"}, "description": desc}
    nav = ''.join(f'<a href="{h}">{t}</a>' for h, t in [('/the-oud.html', 'The oud'), ('/atelier.html', 'The atelier'), ('/request.html', 'Request a bottle')])
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
<a class="skip" href="#main">Skip to content</a>
<header class="top"><a class="house" href="/">Maison Ilham</a><nav aria-label="Main">{nav}</nav></header>
'''
FOOT = '''<footer class="foot"><p class="house">Maison Ilham</p><p>Atelier, Road 79, Gulshan 2, Dhaka · by appointment [NEEDS COPY: address]</p><p><a href="/the-oud.html">The oud</a> · <a href="/atelier.html">The atelier</a> · <a href="/request.html">Request a bottle</a></p></footer>
<script src="/ruler.js" defer></script>
'''
YEARS = [(7, "Year seven. Today.", "Bottle 41 of 120 is the next to be filled. 79 remain for this year [NEEDS COPY: confirm count]."),
 (6, "Year six.", "The vetiver is smoked over coconut husk and laid into the oil. The rose has already gone in."),
 (5, "Year five.", "Rose from Savar, picked before seven in the morning, distilled the same day."),
 (4, "Year four.", "The oil is tasted, not tested. If it is not ready, it waits another year."),
 (3, "Year three.", "Copper vessels, sealed with cloth and clay, in a room kept dark."),
 (2, "Year two.", "Nothing happens that anyone can see. This is most of the work."),
 (1, "Year one.", "The wood is distilled slowly over eleven days."),
 (0, "Year zero.", "Agarwood cut from one grove in Sujanagar, Moulvibazar, from trees older than the house.")]
# time runs backwards: the page starts at today (7 years aged) and walks back to the grove
scenes = ''.join(f'<section class="scene" data-year="{y}" aria-labelledby="y{y}"><h2 id="y{y}">{t}</h2><p>{d}</p></section>' for y, t, d in YEARS)
index = head('Oud No. 7 · Maison Ilham', 'Oud No. 7: Sylhet agarwood aged seven years with Savar rose and smoked vetiver. 120 numbered bottles a year, by appointment.', '/', 'home') + f'''<div class="ruler" aria-hidden="true"><span class="ruler-year">7</span><span class="ruler-unit">years</span><span class="ruler-track"><span class="ruler-fill"></span></span></div>
<main id="main">
<section class="stage-open" aria-labelledby="h1"><p class="eyebrow">Maison Ilham · Gulshan</p><h1 id="h1">Oud No. 7</h1><p class="lede">Seven years to make. One hundred and twenty bottles a year. Read it backwards, from today to the grove.</p></section>
<div class="stage"><div class="stage-object">{BOTTLE}</div><div class="scenes">{scenes}</div></div>
<section class="notes" aria-labelledby="h-notes"><h2 id="h-notes">Three notes</h2><ol><li><b>Oud</b><span>Sujanagar agarwood, seven years</span></li><li><b>Rose</b><span>Savar damask, same-day distilled</span></li><li><b>Vetiver</b><span>smoked over coconut husk</span></li></ol><p class="price">50 ml · BDT 18,500 [NEEDS COPY: confirm]</p><p><a class="ask" href="/request.html">Request bottle 41</a></p></section>
</main>
''' + FOOT + '</body>\n</html>\n'
oud = head('The oud · Oud No. 7', 'Where the agarwood in Oud No. 7 comes from: one grove in Sujanagar, Moulvibazar, distilled over eleven days and aged seven years.', '/the-oud.html', 'oud') + f'''<main id="main"><section class="stage-open small" aria-labelledby="h1"><p class="eyebrow">The oud</p><h1 id="h1">One grove, seven years</h1><p class="lede">Agarwood forms when the aquilaria tree defends a wound with resin. It cannot be hurried, only waited for.</p></section>
<div class="prose"><h2>The grove</h2><p>Sujanagar in Moulvibazar has grown agar for perfume for four hundred years [NEEDS COPY: source]. Our wood comes from one family's grove.</p><h2>The still</h2><p>Eleven days of slow distillation in copper, the water changed by hand.</p><h2>The wait</h2><p>Seven years in sealed vessels. The oil darkens from straw to amber to the colour of tea.</p><p><a class="ask" href="/request.html">Request a bottle</a></p></div></main>
''' + FOOT + '</body>\n</html>\n'
atelier = head('The atelier · Maison Ilham, Gulshan', 'Visit the Maison Ilham atelier in Gulshan by appointment, smell Oud No. 7 on skin, and choose your numbered bottle.', '/atelier.html', 'atelier') + f'''<main id="main"><section class="stage-open small" aria-labelledby="h1"><p class="eyebrow">The atelier</p><h1 id="h1">By appointment, in Gulshan</h1><p class="lede">One visitor at a time. An hour, tea, and the oil on your skin before you decide.</p></section>
<div class="prose"><h2>The visit</h2><p>We wear it on your wrist first, then wait twenty minutes. Oud changes on skin; you should smell the second hour, not the first minute.</p><h2>The number</h2><p>Your bottle is engraved with its number and your name. Numbers are given in order; nobody can choose 1 or 7.</p><p><a class="ask" href="/request.html">Ask for an appointment</a></p></div></main>
''' + FOOT + '</body>\n</html>\n'
request = head('Request a bottle · Oud No. 7', 'Request a numbered bottle of Oud No. 7 and an appointment at the Gulshan atelier. We reply by phone within two days.', '/request.html', 'request') + '''<main id="main"><section class="stage-open small" aria-labelledby="h1"><p class="eyebrow">Request</p><h1 id="h1">Request a bottle</h1><p class="lede">We reply within two days to arrange your visit.</p></section>
<form id="request" class="req" novalidate aria-label="Request a bottle">
<div class="field"><label for="name">Name</label><input id="name" name="name" autocomplete="name" required><span class="err" data-for="name" aria-live="polite"></span></div>
<div class="field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" required><span class="err" data-for="email" aria-live="polite"></span></div>
<div class="field"><label for="tel">Phone</label><input id="tel" name="tel" type="tel" autocomplete="tel" required><span class="err" data-for="tel" aria-live="polite"></span></div>
<div class="field"><label for="month">When would you like to visit?</label><select id="month" name="month" required><option value="">Choose a month</option><option>This month</option><option>Next month</option><option>Later this year</option></select><span class="err" data-for="month" aria-live="polite"></span></div>
<button type="submit">Request my bottle</button>
<p class="form-status" role="status" aria-live="polite"></p>
</form></main>
''' + FOOT + '<script src="/request.js" defer></script>\n</body>\n</html>\n'
nf = head('Not found · Maison Ilham', 'This page does not exist. Return to Oud No. 7 or request a bottle.', '/404.html', '404') + '''<main id="main"><section class="stage-open" aria-labelledby="h1"><p class="eyebrow">404</p><h1 id="h1">Not found</h1><p class="lede">Some things are worth waiting for. This page is not one of them.</p><p><a class="ask" href="/">Return to Oud No. 7</a></p></section></main>
''' + FOOT + '</body>\n</html>\n'
CSS = r''':root { --night: #120e0b; --smoke: #e8dfd2; --dim: #b3a898; --amber: #c9893b; --hair: rgba(232, 223, 210, .25); }
* { box-sizing: border-box; }
html { background: var(--night); color: var(--smoke); }
body { margin: 0; font: 300 1.0625rem/1.75 "Jost", "Gill Sans", sans-serif; letter-spacing: .01em; }
a { color: var(--smoke); text-underline-offset: 4px; text-decoration-thickness: 1px; }
a:hover { color: var(--amber); }
a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible { outline: 1px solid var(--amber); outline-offset: 4px; }
.skip { position: absolute; left: -999px; } .skip:focus { left: 1rem; top: 1rem; z-index: 30; background: var(--smoke); color: var(--night); padding: .5rem 1rem; }
.top { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .5rem 2rem; padding: 1.5rem 6vw; position: relative; z-index: 5; }
.house { font: italic 400 1.2rem/1 "Bodoni Moda", Didot, serif; text-decoration: none; display: inline-block; padding: .7rem 0; } /* 19px tall failed the 24px target rule */
.top nav { display: flex; flex-wrap: wrap; gap: 0 1.75rem; font-size: .8rem; letter-spacing: .22em; text-transform: uppercase; }
.top nav a { text-decoration: none; padding: .6rem 0; }
h1, h2 { font-family: "Bodoni Moda", Didot, serif; font-weight: 400; }
.eyebrow { font-size: .78rem; letter-spacing: .3em; text-transform: uppercase; color: var(--dim); margin: 0 0 1.5rem; }
.stage-open { min-height: 78vh; display: grid; align-content: center; justify-items: center; text-align: center; padding: 4rem 8vw; }
.stage-open.small { min-height: 52vh; }
h1 { font-size: clamp(3.2rem, 11vw, 8.5rem); line-height: .95; margin: 0 0 1.5rem; font-style: italic; letter-spacing: -.02em; }
.lede { max-width: 34ch; margin: 0 auto; color: var(--dim); font-size: 1.15rem; }
.stage { display: grid; grid-template-columns: 1fr 1fr; gap: 0 4vw; padding: 0 8vw 0 12vw; }
.stage-object { position: sticky; top: 12vh; height: 76vh; display: grid; place-items: center; }
.bottle { width: min(26vw, 20rem); height: auto; }
.liquid { transform-box: fill-box; transform-origin: 50% 100%; transition: fill .6s ease-out; }
.scenes { padding: 10vh 0 20vh; }
.scene { min-height: 70vh; display: grid; align-content: center; max-width: 30rem; border-top: 1px solid var(--hair); }
.scene h2 { font-size: clamp(1.9rem, 3.4vw, 2.8rem); margin: 0 0 .75rem; line-height: 1.1; }
.scene p { margin: 0; color: var(--dim); max-width: 38ch; }
.ruler { opacity: 0; visibility: hidden; transition: opacity .4s ease-out, visibility 0s .4s; position: fixed; left: 3vw; top: 14vh; bottom: 14vh; z-index: 4; width: 3.2rem; display: grid; grid-template-rows: auto auto 1fr; justify-items: center; }
.in-stage .ruler { opacity: 1; visibility: visible; transition: opacity .4s ease-out; }
.ruler-year { font: italic 400 2.4rem/1 "Bodoni Moda", serif; color: var(--amber); }
.ruler-unit { font-size: .7rem; letter-spacing: .25em; text-transform: uppercase; color: var(--dim); margin: .4rem 0 1rem; }
.ruler-track { position: relative; width: 14px; height: 100%; background: repeating-linear-gradient(to bottom, var(--hair) 0 1px, transparent 1px calc(100% / 7)); border-left: 1px solid var(--hair); }
.ruler-fill { position: absolute; left: -1px; top: 0; width: 1px; height: 100%; background: var(--amber); transform-origin: 50% 0; transform: scaleY(0); }
.notes { padding: 14vh 8vw; text-align: center; border-top: 1px solid var(--hair); }
.notes h2 { font-size: clamp(2.2rem, 5vw, 3.6rem); font-style: italic; margin: 0 0 2rem; }
.notes ol { list-style: none; padding: 0; margin: 0 auto 2.5rem; display: flex; flex-wrap: wrap; justify-content: center; gap: 2rem 5vw; }
.notes li { display: grid; gap: .25rem; min-width: 12rem; }
.notes b { font: italic 400 1.9rem/1 "Bodoni Moda", serif; font-weight: 400; }
.notes span { color: var(--dim); font-size: .95rem; }
.price { letter-spacing: .2em; text-transform: uppercase; font-size: .85rem; color: var(--dim); }
.ask { display: inline-block; margin-top: 1rem; padding: .9rem 1.8rem; border: 1px solid var(--smoke); text-decoration: none; letter-spacing: .22em; text-transform: uppercase; font-size: .8rem; transition: background .25s ease-out, color .25s ease-out; }
.ask:hover { background: var(--smoke); color: var(--night); }
.prose { max-width: 36rem; margin: 0 auto; padding: 0 8vw 14vh; box-sizing: content-box; }
.prose h2 { font-size: 1.9rem; font-style: italic; margin: 3rem 0 .5rem; }
.req { max-width: 30rem; margin: 0 auto 14vh; padding: 0 6vw; box-sizing: content-box; display: grid; gap: 1.4rem; }
.field { display: grid; gap: .35rem; }
label { font-size: .78rem; letter-spacing: .22em; text-transform: uppercase; color: var(--dim); }
input, select { font: inherit; color: var(--smoke); background: transparent; border: 0; border-bottom: 1px solid var(--dim); padding: .6rem 0; min-height: 46px; border-radius: 0; }
select option { color: #120e0b; }
input[aria-invalid="true"], select[aria-invalid="true"] { border-bottom: 2px solid #ef8a76; }
.err { color: #ef8a76; font-size: .9rem; min-height: 1.2em; }
.req button { font: 400 .8rem/1 "Jost", sans-serif; letter-spacing: .22em; text-transform: uppercase; padding: 1.1rem 1.8rem; background: var(--smoke); color: var(--night); border: 1px solid var(--smoke); cursor: pointer; transition: background .25s ease-out, color .25s ease-out; justify-self: start; min-height: 48px; }
.req button:hover { background: transparent; color: var(--smoke); }
.req button:disabled { opacity: .7; cursor: progress; }
.form-status { min-height: 1.4em; margin: 0; }
.form-status.is-error { color: #ef8a76; } .form-status.is-ok { color: var(--smoke); }
.foot { border-top: 1px solid var(--hair); padding: 3rem 8vw; text-align: center; color: var(--dim); font-size: .95rem; }
.foot a { display: inline-block; padding: .4rem 0; }
@media (max-width: 760px) { .stage { grid-template-columns: 1fr; padding: 0 6vw 0 5.5rem; } .stage-object { position: relative; top: 0; height: auto; padding: 2rem 0; } .bottle { width: 60vw; max-width: 14rem; } .ruler { left: 1rem; width: 2.6rem; } .ruler-year { font-size: 1.9rem; } .scene { min-height: 55vh; } }
@media (prefers-reduced-motion: reduce) { .stage-object { position: relative; top: 0; height: auto; } .liquid, .ask, .req button { transition: none; } }
'''
RJS = r'''// Seven-year ruler (signature, tier 3; mutation: time runs backwards). A fixed ruler counts the years the reader has
// walked back through: the numeral steps 7, 6 … 0 as each scene crosses the middle of the screen, the amber hairline
// stretches with progress, and the oil in the bottle thins from tea-dark (today) to pale (the grove). Transform and
// fill only; passive scroll listener with rAF. Reduced motion: the numeral and fill still update (state), no transitions
// (CSS), and the bottle is not sticky.
(() => {
  const scenes = [...document.querySelectorAll(".scene")], yr = document.querySelector(".ruler-year"), fill = document.querySelector(".ruler-fill"), liq = document.querySelector(".liquid");
  if (!scenes.length || !yr) { document.querySelector(".ruler")?.remove(); return; }
  const shades = ["#d9b274", "#d3a45f", "#cc964d", "#c9893b", "#b67830", "#a06726", "#87531d", "#6c4115"];
  let tick = false, cur = -1;
  const draw = () => { tick = false; const mid = innerHeight / 2; let y = +scenes[0].dataset.year;
    for (const s of scenes) if (s.getBoundingClientRect().top < mid) y = +s.dataset.year;
    const first = scenes[0].getBoundingClientRect().top, last = scenes[scenes.length - 1].getBoundingClientRect().bottom;
    document.documentElement.classList.toggle("in-stage", first < mid && last > mid);
    const p = Math.max(0, Math.min(1, (mid - first) / (last - first))); fill.style.transform = "scaleY(" + p.toFixed(3) + ")";
    if (y !== cur) { cur = y; yr.textContent = String(y); if (liq) { liq.style.fill = shades[y]; liq.style.transform = "scaleY(" + (0.55 + y * 0.065).toFixed(3) + ")"; } } };
  addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(draw); } }, { passive: true }); draw();
})();
'''
files = {'index.html': index, 'the-oud.html': oud, 'atelier.html': atelier, 'request.html': request, '404.html': nf, 'style.css': CSS, 'ruler.js': RJS,
 'request.js': forms.form_js('#request', '/api/request', 'Sending…', 'Thank you. Your request is received; we will call you within two days.', 'Sorry, we could not send your request. Please try again, or call the atelier.'),
 'sitemap.xml': '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(f'<url><loc>{DOMAIN}{p}</loc></url>\n' for p in ['/', '/the-oud.html', '/atelier.html', '/request.html']) + '</urlset>\n',
 'robots.txt': f'User-agent: *\nAllow: /\nSitemap: {DOMAIN}/sitemap.xml\n',
 '_headers': '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n'}
for n, c in files.items(): open(os.path.join(OUT, n), 'w').write(c)
print('wrote', len(files), 'files to', os.path.abspath(OUT))
