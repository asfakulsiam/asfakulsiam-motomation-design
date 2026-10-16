# Build 2 · Little Molars children's dentistry (diversity brief 02). Writes ../02-childrens-dentistry/.
import os, json, forms
OUT = os.path.join(os.path.dirname(__file__), '..', '02-childrens-dentistry'); os.makedirs(OUT, exist_ok=True)
DOMAIN = 'https://littlemolars.example'
FONTS = '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&family=Nunito:wght@400;700&display=swap">'
CSP = "default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self'; img-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'self'"
STAMP = '<!-- motomation · archetype: field-guide · mutation: ui-as-content · signature: tooth-stamps · tier: 3 · critique: <paste> · gate: <paste> -->'
TOOTH = '<svg viewBox="0 0 40 44" aria-hidden="true" focusable="false"><path d="M8 4c5-3 9 1 12 1s7-4 12-1c6 4 5 13 2 19-2 5-2 17-6 18-3 1-4-10-8-10s-5 11-8 10c-4-1-4-13-6-18C3 17 2 8 8 4z"/></svg>'
FISH = '<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false"><circle cx="60" cy="60" r="60" class="pool"/><path class="fish" d="M28 62c10-14 30-20 46-12l14-10v40L74 70c-16 8-36 4-46-8z"/><circle cx="44" cy="58" r="3.5" class="eye"/><circle cx="84" cy="34" r="4" class="bub"/><circle cx="92" cy="22" r="2.5" class="bub"/></svg>'
def head(title, desc, path, page):
    # the current page is marked, not linked (a link to the page you are on changes nothing when tapped); the label sits in
    # a span so the measured text box is the text on the navy pill, not the pill's rounded corners
    nav = ''.join(f'<span class="here" aria-current="page"><span>{t}</span></span>' if h == path else f'<a href="{h}"><span>{t}</span></a>' for h, t in [('/', 'Home'), ('/first-visit.html', 'First visit'), ('/treatments.html', 'Treatments'), ('/book.html', 'Book')])
    logo = f'<span class="logo">{TOOTH}<span>Little Molars</span></span>' if path == '/' else f'<a class="logo" href="/">{TOOTH}<span>Little Molars</span></a>'
    ld = {"@context": "https://schema.org", "@type": "Dentist", "name": "Little Molars Children's Dentistry", "address": {"@type": "PostalAddress", "addressLocality": "Uttara, Dhaka", "addressCountry": "BD"}, "medicalSpecialty": "Pediatric"}
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
<header class="top">{logo}<nav aria-label="Main">{nav}</nav></header>
<ol class="passport" aria-label="Your tooth passport: a stamp for each part of this page you have read"></ol>
'''
FOOT = '''<footer class="foot"><div><p class="foot-name">Little Molars Children's Dentistry</p><p>House 12, Road 7, Sector 4, Uttara, Dhaka. Saturday to Thursday, 9 am to 7 pm.</p><p>Sample content: names, address, phone number and prices on this demo site are illustrative.</p></div><nav aria-label="Footer"><a href="/first-visit.html">First visit</a><a href="/treatments.html">Treatments</a><a href="/book.html">Book a visit</a></nav></footer>
<script src="/passport.js" defer></script>
'''
def page(sections):  # each section is one passport page with a stamp slot
    return ''.join(f'<section class="pp" data-stamp="{s}" aria-labelledby="h-{i}"><span class="stamp" aria-hidden="true">{TOOTH}<b>{s}</b></span>{body.replace("<h2>", f"<h2 id=\"h-{i}\">", 1)}</section>' for i, (s, body) in enumerate(sections))
index = head("Little Molars · Children's dentist in Uttara", "A children's dentist in Uttara for ages 1 to 14. Every visit earns a stamp in the tooth passport. Book a first check-up online.", '/', 'home') + f'''<main id="main">
<div class="hero"><div class="hero-copy"><p class="kicker">Children's dentistry · Uttara · ages 1 to 14</p><h1>Every visit gets a stamp.</h1><p class="lede">At Little Molars a check-up is a page in your child's tooth passport. We tell them what we will do, show them the tool, and then do it. No surprises, no white coats.</p><p class="cta-row"><a class="btn" href="/book.html">Book a first check-up</a><a class="link" href="/first-visit.html">What the first visit looks like</a></p></div><div class="hero-art">{FISH}<p class="caption">The fish tank in our waiting room. Its name is Bubbles.</p></div></div>
<div class="pages">{page([
 ("Tell", '<h2>Tell</h2><p>We explain each step in words a four-year-old knows. "Counting your teeth" comes before any tool comes out.</p>'),
 ("Show", '<h2>Show</h2><p>Your child holds the mirror, feels the soft brush on a fingertip, and hears the water spray before it goes near a tooth.</p>'),
 ("Do", '<h2>Do</h2><p>Only then do we start, and a raised hand means stop. Every time. Children learn that they are in charge of the chair.</p>'),
 ("Stamp", '<h2>Stamp</h2><p>At the end, a new stamp in the passport. Ten stamps and the passport goes on the clinic wall with their name.</p>')])}</div>
<section class="docs" aria-labelledby="h-docs"><h2 id="h-docs">Your dentists</h2><ul class="doc-list"><li><span class="face" aria-hidden="true">NJ</span><h3>Dr. Nusrat Jahan</h3><p>Paediatric dentist</p></li><li><span class="face" aria-hidden="true">AH</span><h3>Dr. Arif Hossain</h3><p>Paediatric dentist</p></li></ul></section>
<section class="urgent" aria-labelledby="h-urgent"><h2 id="h-urgent">A tooth knocked out?</h2><p>Hold it by the white top, not the root. Put it in milk and call us now on <a href="tel:+8801800000000">01800-000000</a>. The first hour matters most.</p></section>
</main>
''' + FOOT + '</body>\n</html>\n'
first = head('First visit · Little Molars', 'What happens at a first visit to Little Molars, minute by minute, and how to talk about it at home the night before.', '/first-visit.html', 'first') + f'''<main id="main"><div class="intro"><p class="kicker">First visit · about 30 minutes</p><h1>The first visit, page by page</h1><p class="lede">Read this with your child the night before. Each part below is a page in their passport.</p></div>
<div class="pages">{page([
 ("Hello", '<h2>Arrive and meet Bubbles</h2><p>Come ten minutes early. Your child can feed the fish while you fill in one short form.</p>'),
 ("Chair", '<h2>Ride the chair</h2><p>The chair goes up and down. Your child presses the button first.</p>'),
 ("Count", '<h2>Count the teeth</h2><p>We count them out loud with a small mirror. Most children have 20 baby teeth.</p>'),
 ("Brush", '<h2>A tickle brush</h2><p>A soft spinning brush polishes the teeth. It tickles. Then a fluoride paint if your child is over two.</p>'),
 ("Stamp", '<h2>The first stamp</h2><p>Your child picks the stamp colour. You get a short note on what we saw and when to come back.</p>')])}</div>
<p class="cta-row center"><a class="btn" href="/book.html">Book the first visit</a></p></main>
''' + FOOT + '</body>\n</html>\n'
TREAT = [("Check-up", "Every six months, from the first tooth or the first birthday.", "BDT 1,200"), ("Cleaning", "Polish and plaque removal with a soft brush.", "BDT 1,500"), ("Fluoride", "A paint that hardens the enamel. Two minutes.", "BDT 800"), ("Sealants", "A thin coat on back teeth so food cannot sit in the grooves.", "BDT 2,000 per tooth"), ("Fillings", "Tooth-coloured fillings, numbed with a gel first.", "from BDT 2,500"), ("Emergency", "Knocked-out or broken teeth, the same day.", "BDT 1,500 call-out")]
treat = head('Treatments and prices · Little Molars', 'Check-ups, cleaning, fluoride, sealants, fillings and same-day emergencies for children, with prices.', '/treatments.html', 'treat') + '''<main id="main"><div class="intro"><p class="kicker">Treatments</p><h1>What we do, and what it costs</h1><p class="lede">Prices are for the whole visit, and we tell you before we start.</p></div>
<ul class="treat">''' + ''.join(f'<li class="card"><h2>{n}</h2><p>{d}</p><p class="price">{p}</p></li>' for n, d, p in TREAT) + '''</ul>
<p class="cta-row center"><a class="btn" href="/book.html">Book a visit</a></p></main>
''' + FOOT + '</body>\n</html>\n'
book = head('Book a visit · Little Molars', "Book a check-up for your child online. Tell us their age and a good day; we call back to confirm a time.", '/book.html', 'book') + '''<main id="main"><div class="intro"><p class="kicker">Book</p><h1>Book a visit</h1><p class="lede">Choose a day. We call you within one working day to confirm the time.</p></div>
<form id="book" class="form card" novalidate aria-label="Book a visit">
<div class="field"><label for="parent">Your name</label><input id="parent" name="parent" autocomplete="name" required><span class="err" data-for="parent" aria-live="polite"></span></div>
<div class="field"><label for="age">Child's age (years)</label><input id="age" name="age" type="number" min="1" max="14" inputmode="numeric" required><span class="err" data-for="age" aria-live="polite"></span></div>
<div class="field"><label for="phone">Phone</label><input id="phone" name="phone" type="tel" autocomplete="tel" required><span class="err" data-for="phone" aria-live="polite"></span></div>
<div class="field"><label for="day">Preferred day</label><select id="day" name="day" required><option value="">Choose a day</option><option>Saturday</option><option>Sunday</option><option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option></select><span class="err" data-for="day" aria-live="polite"></span></div>
<button class="btn" type="submit">Request this visit</button>
<p class="form-status" role="status" aria-live="polite"></p>
</form></main>
''' + FOOT + '<script src="/book.js" defer></script>\n</body>\n</html>\n'
nf = head('Page not found · Little Molars', 'This page is missing, like a baby tooth. Go back to the home page or book a visit.', '/404.html', '404') + '''<main id="main"><div class="intro"><p class="kicker">404 · page not found</p><h1>This page fell out, like a baby tooth.</h1><p class="lede">The link may be old. A new page will grow in its place.</p><p class="cta-row"><a class="btn" href="/">Back to the home page</a><a class="link" href="/book.html">Book a visit</a></p></div></main>
''' + FOOT + '</body>\n</html>\n'
CSS = r''':root { --cream: #fff8ee; --navy: #1c2a4a; --soft: #48557a; --coral: #e8553d; --mint: #dff2ea; --line: #ead9c2; }
* { box-sizing: border-box; }
html { background: var(--cream); color: var(--navy); }
body { margin: 0; font: 400 1.0625rem/1.6 "Nunito", "Trebuchet MS", sans-serif; padding-bottom: 5rem; }
h1, h2, h3, .logo, .btn, .stamp b, .kicker { font-family: "Fredoka", "Trebuchet MS", sans-serif; }
a { color: var(--navy); }
a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible { outline: 3px solid var(--coral); outline-offset: 3px; }
.skip { position: absolute; left: -999px; } .skip:focus { left: 1rem; top: 1rem; z-index: 20; background: #fff; padding: .5rem 1rem; }
.top { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: .5rem 1.5rem; max-width: 72rem; margin: 0 auto; padding: 1rem 1.25rem; }
.logo { display: inline-flex; align-items: center; gap: .5rem; font-weight: 600; font-size: 1.35rem; text-decoration: none; }
.logo svg { width: 2rem; height: 2.2rem; fill: var(--navy); }
.top nav { display: flex; flex-wrap: wrap; gap: .25rem; }
.top nav a, .top nav .here { padding: .55rem .9rem; border-radius: 999px; text-decoration: none; font-weight: 700; }
.top nav a:hover { background: var(--mint); }
.top nav [aria-current] { background: var(--navy); color: var(--cream); }
main { max-width: 72rem; margin: 0 auto; padding: 0 1.25rem; }
.kicker { margin: 0 0 .5rem; font-weight: 500; color: var(--soft); letter-spacing: .02em; }
h1 { font-weight: 600; font-size: clamp(2.4rem, 7vw, 4.4rem); line-height: 1.02; margin: 0 0 1rem; letter-spacing: -.01em; }
h2 { font-weight: 600; font-size: 1.6rem; line-height: 1.15; margin: 0 0 .5rem; }
h3 { font-weight: 600; font-size: 1.2rem; margin: .25rem 0; }
p { margin: 0 0 .8rem; max-width: 60ch; }
.lede { font-size: 1.2rem; color: var(--soft); }
.hero { display: grid; grid-template-columns: 1.2fr .8fr; gap: 2rem; align-items: center; padding: 2rem 0 3rem; }
.hero-art svg { width: 100%; max-width: 22rem; display: block; margin: 0 auto; }
.hero-art .pool { fill: var(--mint); } .hero-art .fish { fill: var(--coral); } .hero-art .eye { fill: var(--navy); } .hero-art .bub { fill: none; stroke: var(--navy); stroke-width: 2; }
.caption { font-size: .95rem; color: var(--soft); text-align: center; margin: .75rem auto 0; }
.cta-row { display: flex; flex-wrap: wrap; gap: .75rem 1.25rem; align-items: center; margin-top: 1.25rem; }
.cta-row.center { justify-content: center; margin: 2.5rem 0; }
.btn { display: inline-flex; align-items: center; min-height: 48px; padding: .7rem 1.4rem; border: 0; border-radius: 999px; background: var(--navy); color: var(--cream); font-weight: 600; font-size: 1.05rem; text-decoration: none; cursor: pointer; transition: transform .15s ease-out, box-shadow .15s ease-out; box-shadow: 0 4px 0 #0e1730; }
.btn:hover { transform: translateY(-2px); box-shadow: 0 6px 0 #0e1730; }
.btn:active { transform: translateY(3px); box-shadow: 0 1px 0 #0e1730; }
.btn:disabled { opacity: .7; cursor: progress; transform: none; }
.link { font-weight: 700; padding: .5rem 0; }
.pages, .treat { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.25rem; list-style: none; padding: 0; margin: 0 0 3rem; }
.pp, .card { position: relative; background: #fff; border: 2px solid var(--line); border-radius: 28px; padding: 1.75rem 1.75rem 1.5rem 6.25rem; min-height: 11rem; transition: transform .2s ease-out, border-color .2s ease-out; }
.card { padding-left: 1.75rem; }
.pp:hover, .card:hover { transform: translateY(-3px) rotate(-.4deg); border-color: var(--navy); }
.stamp { position: absolute; left: 1.25rem; top: 1.5rem; width: 3.9rem; height: 3.9rem; border: 3px dashed var(--line); border-radius: 50%; display: grid; place-items: center; transform: rotate(-12deg); }
.stamp svg { width: 1.5rem; height: 1.65rem; fill: var(--line); }
.stamp b { position: absolute; bottom: -1.5rem; font-size: .8rem; font-weight: 500; color: var(--soft); }
.pp.stamped .stamp { border: 3px solid var(--coral); background: #fff1ec; animation: strike .32s cubic-bezier(.3, 1.4, .5, 1); }
.pp.stamped .stamp svg { fill: var(--coral); }
@keyframes strike { from { transform: rotate(-24deg) scale(1.5); opacity: .4; } to { transform: rotate(-12deg) scale(1); opacity: 1; } }
.price { font-family: "Fredoka", sans-serif; font-weight: 600; font-size: 1.25rem; color: var(--navy); margin: .5rem 0 0; }
.docs, .urgent { margin: 0 0 3rem; }
.doc-list { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 1.5rem; }
.doc-list li { display: grid; grid-template-columns: 4rem 1fr; column-gap: 1rem; align-items: center; }
.doc-list p { grid-column: 2; margin: 0; color: var(--soft); }
.face { grid-row: span 2; width: 4rem; height: 4rem; border-radius: 50%; background: var(--mint); display: grid; place-items: center; font-weight: 700; }
.urgent { background: var(--navy); color: var(--cream); border-radius: 28px; padding: 2rem; }
.urgent a { color: var(--cream); font-weight: 700; }
.intro { padding: 2rem 0 2rem; }
.form { max-width: 36rem; padding: 2rem; margin-bottom: 3rem; }
.field { display: grid; gap: .3rem; margin-bottom: 1.1rem; }
label { font-weight: 700; }
input, select { font: inherit; min-height: 48px; padding: .6rem .9rem; border: 2px solid var(--line); border-radius: 14px; background: #fff; color: var(--navy); }
input:hover, select:hover { border-color: var(--soft); }
input[aria-invalid="true"], select[aria-invalid="true"] { border-color: #b3261e; background: #fff6f5; }
.err { color: #b3261e; font-weight: 700; font-size: .95rem; min-height: 1.2em; }
.form-status { margin: 1rem 0 0; font-weight: 700; min-height: 1.4em; }
.form-status.is-ok { color: #136b47; } .form-status.is-error { color: #b3261e; }
.foot { max-width: 72rem; margin: 0 auto; padding: 2rem 1.25rem; border-top: 2px dashed var(--line); display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; color: var(--soft); }
.foot-name { font-family: "Fredoka", sans-serif; font-weight: 600; color: var(--navy); }
.foot nav { display: flex; flex-wrap: wrap; gap: .25rem 1.25rem; } .foot nav a { padding: .4rem 0; }
/* the passport: the page's progress, as a row of tooth stamps fixed to the bottom edge (UI as content) */
.passport { position: fixed; left: 50%; bottom: .75rem; transform: translateX(-50%); z-index: 8; display: flex; gap: .4rem; margin: 0; padding: .45rem .7rem; list-style: none; background: #fff; border: 2px solid var(--navy); border-radius: 999px; }
.passport:empty { display: none; }
.passport li { width: 1.6rem; height: 1.75rem; }
.passport svg { width: 100%; height: 100%; fill: none; stroke: var(--soft); stroke-width: 2.5; transition: fill .2s ease-out; }
.passport li.on svg { fill: var(--coral); stroke: var(--navy); animation: strike .32s cubic-bezier(.3, 1.4, .5, 1); }
@media (max-width: 760px) { .hero { grid-template-columns: 1fr; } .hero-art svg { max-width: 14rem; } .pages, .treat { grid-template-columns: 1fr; } .pp { padding-left: 5.5rem; } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
'''
PJS = r'''// Tooth passport (signature, tier 3): one tooth per passport page (.pp) in a pill fixed to the bottom edge; when a page
// is half in view it is stamped (ink strike), and its tooth in the pill fills. The pill is the page's scroll progress.
// Reduced motion: the CSS turns animation off; stamping still happens, instantly, so the state still reads.
(() => {
  const pages = [...document.querySelectorAll(".pp")], pill = document.querySelector(".passport"); if (!pages.length || !pill) return;
  const svg = document.querySelector(".logo svg").outerHTML;
  const dots = pages.map((p) => { const li = document.createElement("li"); li.innerHTML = svg; li.title = p.dataset.stamp; pill.append(li); return li; });
  const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) { const i = pages.indexOf(e.target); e.target.classList.add("stamped"); dots[i].classList.add("on"); io.unobserve(e.target); } }, { threshold: .5 });
  pages.forEach((p) => io.observe(p));
})();
'''
files = {'index.html': index, 'first-visit.html': first, 'treatments.html': treat, 'book.html': book, '404.html': nf, 'style.css': CSS, 'passport.js': PJS,
 'book.js': forms.form_js('#book', '/api/book', 'Sending your request…', 'Thank you. Request received: we will call you within one working day to confirm the time.', 'Sorry, we could not send your booking. Please try again, or call 01800-000000.'),
 'sitemap.xml': '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(f'<url><loc>{DOMAIN}{p}</loc></url>\n' for p in ['/', '/first-visit.html', '/treatments.html', '/book.html']) + '</urlset>\n',
 'robots.txt': f'User-agent: *\nAllow: /\nSitemap: {DOMAIN}/sitemap.xml\n',
 '_headers': '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n'}
for n, c in files.items(): open(os.path.join(OUT, n), 'w').write(c)
print('wrote', len(files), 'files to', os.path.abspath(OUT))
