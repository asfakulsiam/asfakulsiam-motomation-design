# Build 1 · Shanti Ghat Funeral Service (diversity brief 01). Writes the static site into ../01-funeral-home/.
import os, json
OUT = os.path.join(os.path.dirname(__file__), '..', '01-funeral-home'); os.makedirs(OUT, exist_ok=True)
DOMAIN = 'https://shantighat.example'
FONTS = '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300&family=IBM+Plex+Mono:wght@400;500&display=swap">'
CSP = "default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self'; img-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'self'"
STAMP = '<!-- motomation · archetype: timeline · mutation: single-object · signature: paper-feed · tier: 2 · critique: <paste> · gate: <paste> -->'
def head(title, desc, path):
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="{CSP}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{DOMAIN}{path}">
<meta property="og:title" content="{title}"><meta property="og:description" content="{desc}"><meta property="og:image" content="{DOMAIN}/og.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
{FONTS}
<link rel="stylesheet" href="/style.css">
<script type="application/ld+json">{json.dumps({"@context": "https://schema.org", "@type": "FuneralHome" if path == "/" else "WebPage", "name": "Shanti Ghat Funeral Service", "telephone": "+8801711000000", "address": {"@type": "PostalAddress", "addressLocality": "Narayanganj", "addressCountry": "BD"}, "openingHours": "Mo-Su 00:00-23:59"})}</script>
</head>
<body>
{STAMP}
<a class="skip" href="#main">Skip to the instructions</a>
<div class="callbar" role="region" aria-label="24-hour line"><span>Someone has died? We answer at any hour.</span> <a class="callbar-tel" href="tel:+8801711000000">Call 01711-000000</a></div>
<header class="mast"><a class="mast-name" href="/">Shanti Ghat Funeral Service</a><nav aria-label="Main"><a href="/what-happens-next.html">What happens next</a><a href="/prices.html">Prices</a><a href="/contact.html">Contact</a></nav></header>
'''
FOOT = '''<footer class="foot"><p>Shanti Ghat Funeral Service · Narayanganj · since 1974</p><p><a href="/what-happens-next.html">What happens next</a> · <a href="/prices.html">Prices</a> · <a href="/contact.html">Contact</a></p><p class="foot-small">Sample content: the phone number, address and prices on this demo site are illustrative.</p></footer>
<script src="/feed.js" defer></script>
</body>
</html>
'''
STEPS = [("The first hour", "Call the line. A person answers, not a menu. Tell us where your family member is and which rite you follow."), ("We come to you", "Two of us arrive with a vehicle, at home or at the hospital. We bring the papers you will need to sign."), ("The washing", "Ghusl or snan, done by people of your faith, men for men and women for women. Family may join."), ("The rite", "Burial at the graveyard you choose, cremation at the ghat, or a church service. We arrange the place and the time."), ("After", "Transport to the home district if the family wishes, and the death certificate paperwork with the city office.")]
PRICES = [("Collection, home or hospital", "4,500"), ("Washing and shrouding", "3,000"), ("Coffin or bier", "6,000"), ("Cremation arrangement at the ghat", "9,000"), ("Burial coordination", "5,000"), ("Transport per 100 km", "2,500")]
def receipt(rows, total=True):
    lines = ''.join(f'<li class="line"><span>{n}</span><span class="dots" aria-hidden="true"></span><span class="amt">BDT {a}</span></li>' for n, a in rows)
    return f'<ol class="receipt" aria-label="Sample prices in taka">{lines}</ol>'
def steps(rows):
    return '<ol class="steps">' + ''.join(f'<li class="line"><h3>{t}</h3><p>{d}</p></li>' for t, d in rows) + '</ol>'

index = head('Shanti Ghat Funeral Service · Narayanganj', 'A family funeral home in Narayanganj since 1974. We answer at any hour, come to you, and publish every price.', '/') + f'''<main id="main" class="sheet">
<p class="sheet-label line">Instructions for the family · keep this page</p>
<h1 class="line">We will come to you, tonight if you need us.</h1>
<p class="lede line">Shanti Ghat has looked after families in Narayanganj since 1974: Muslim, Hindu and Christian. Below is everything that happens next, in order, and what each part costs.</p>
<section aria-labelledby="h-next"><h2 id="h-next" class="line">What happens next</h2>{steps(STEPS)}<p class="line"><a class="more" href="/what-happens-next.html">Read each step in full</a></p></section>
<section aria-labelledby="h-prices"><h2 id="h-prices" class="line">Prices, written down</h2><p class="line">Every price is fixed. Nothing is added later, and nothing is sold at the door.</p>{receipt(PRICES[:4])}<p class="line"><a class="more" href="/prices.html">See every price</a></p></section>
<section aria-labelledby="h-faith"><h2 id="h-faith" class="line">For every faith</h2><p class="line">Muslim, Hindu, Christian or Buddhist: tell us the rite, and we follow it.</p></section>
<section aria-labelledby="h-reach"><h2 id="h-reach" class="line">Where we are</h2><p class="line">Shanti Ghat, Bandar Road, Narayanganj. Open every day, every hour.</p><p class="line"><a class="more" href="/contact.html">How to reach us</a></p></section>
<p class="sheet-end line" aria-hidden="true">· · ·</p>
</main>
''' + FOOT
wh = head('What happens next · Shanti Ghat', 'Each step from the first call to the paperwork afterwards, in the order it happens, for every faith.', '/what-happens-next.html') + f'''<main id="main" class="sheet">
<p class="sheet-label line">Step by step</p><h1 class="line">What happens next</h1>
{steps(STEPS + [("Paperwork", "We fill in the death registration with you and take it to the city office. You keep the copies."), ("Later", "If you want a gathering on the fortieth day or a shraddha, we can help with the hall and the food.")])}
<p class="line"><a class="more" href="/prices.html">What each step costs</a></p>
</main>
''' + FOOT
pr = head('Prices · Shanti Ghat Funeral Service', 'Every price we charge, fixed and written down. No package upsells, nothing added later.', '/prices.html') + f'''<main id="main" class="sheet">
<p class="sheet-label line">Price list</p><h1 class="line">Prices, written down</h1>
<p class="line">These are the only charges. You pay after the rite, not before.</p>
{receipt(PRICES)}
<p class="line">If a family cannot pay, tell us. We have never turned anyone away.</p>
<p class="line"><a class="more" href="/contact.html">Ask us a question</a></p>
</main>
''' + FOOT
ct = head('Contact · Shanti Ghat Funeral Service', 'Call 01711-000000 at any hour, or come to Bandar Road, Narayanganj. A person answers every call.', '/contact.html') + '''<main id="main" class="sheet">
<p class="sheet-label line">Contact</p><h1 class="line">Call us. A person answers.</h1>
<p class="line big-tel"><a href="tel:+8801711000000">01711-000000</a></p>
<p class="line">Every hour of every day. If you cannot speak, send a text with your address and we will come.</p>
<p class="line">Shanti Ghat, Bandar Road, Narayanganj</p>
<p class="line">Email for paperwork, not emergencies: <a href="mailto:office@shantighat.example">office@shantighat.example</a></p>
</main>
''' + FOOT
nf = head('Page not found · Shanti Ghat', 'This page is not here. The phone line is open at any hour.', '/404.html').replace(f'<link rel="canonical" href="{DOMAIN}/404.html">', '') + '''<main id="main" class="sheet">
<p class="sheet-label line">Not found (404)</p><h1 class="line">This page is not here.</h1>
<p class="line">The address may have changed. If you need us now, call 01711-000000.</p>
<p class="line"><a class="more" href="/">Back to the home page</a></p>
</main>
''' + FOOT
CSS = r''':root { --table: #d8d2c6; --paper: #f8f5ef; --ink: #24211d; --soft: #5b554c; --brass: #7a4f0e; --rule: #cfc7b8; }
* { box-sizing: border-box; }
html { background: var(--table); color: var(--ink); }
body { margin: 0; font: 400 1.125rem/1.6 "Newsreader", Georgia, serif; font-optical-sizing: auto; }
a { color: var(--ink); text-decoration-thickness: 1px; text-underline-offset: 3px; }
a:hover { text-decoration-thickness: 2px; color: var(--brass); }
a:focus-visible { outline: 2px solid var(--brass); outline-offset: 3px; border-radius: 2px; }
.skip { position: absolute; left: -999px; top: 0; background: var(--paper); padding: .5rem 1rem; }
.skip:focus { left: 1rem; z-index: 10; }
.callbar { position: sticky; top: 0; z-index: 5; display: flex; flex-wrap: wrap; gap: .25rem 1rem; justify-content: center; align-items: center; padding: .55rem 1rem; background: var(--ink); color: var(--paper); font: 500 .95rem/1.3 "IBM Plex Mono", monospace; text-align: center; }
.callbar-tel { color: var(--paper); font-weight: 500; padding: .35rem .6rem; border: 1px solid var(--paper); border-radius: 2px; text-decoration: none; min-height: 44px; display: inline-flex; align-items: center; }
.callbar-tel:hover { background: var(--paper); color: var(--ink); }
.mast { max-width: 38rem; margin: 2.5rem auto 0; padding: 0 1.25rem; display: flex; flex-direction: column; gap: .5rem; }
.mast-name { font-size: 1rem; letter-spacing: .08em; text-transform: uppercase; text-decoration: none; color: var(--soft); }
.mast nav { display: flex; flex-wrap: wrap; gap: 0 1.25rem; }
.mast nav a { display: inline-block; padding: .55rem 0; color: var(--soft); }
.sheet { position: relative; max-width: 38rem; margin: 1rem auto 3rem; padding: 3rem 2.25rem 2.5rem; background: var(--paper); box-shadow: 0 1px 0 var(--rule), 0 18px 40px -28px rgba(36, 33, 29, .45); }
.sheet::before { content: ""; position: absolute; left: 0; right: 0; top: -8px; height: 8px; background: radial-gradient(circle at 6px 8px, var(--paper) 5px, transparent 5.5px) 0 0 / 12px 8px repeat-x; }
.sheet-label { margin: 0 0 1.25rem; font: 500 .8rem/1.4 "IBM Plex Mono", monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--soft); }
h1 { margin: 0 0 1.25rem; font-weight: 300; font-size: clamp(2.1rem, 6.4vw, 3.1rem); line-height: 1.08; letter-spacing: -.01em; }
h2 { margin: 2.75rem 0 .75rem; font-weight: 500; font-size: 1.45rem; line-height: 1.25; padding-top: 1.25rem; border-top: 1px dashed var(--rule); }
h3 { margin: 0; font-weight: 500; font-size: 1.1rem; }
p { margin: 0 0 .9rem; max-width: 62ch; }
.lede { font-size: 1.2rem; color: var(--soft); }
.steps { list-style: none; margin: 0; padding: 0; counter-reset: s; }
.steps li { counter-increment: s; display: grid; grid-template-columns: 2.25rem 1fr; column-gap: .5rem; padding: .75rem 0; border-bottom: 1px dotted var(--rule); }
.steps li::before { content: counter(s, decimal-leading-zero); grid-row: span 2; font: 500 .85rem/1.9 "IBM Plex Mono", monospace; color: var(--brass); }
.steps p { margin: .15rem 0 0; color: var(--soft); }
.receipt { list-style: none; margin: .75rem 0 1rem; padding: 0; font: 400 .95rem/1.5 "IBM Plex Mono", monospace; }
.receipt li { display: flex; align-items: baseline; gap: .5rem; padding: .3rem 0; }
.receipt .dots { flex: 1; border-bottom: 1px dotted var(--soft); transform: translateY(-.25em); min-width: 1rem; }
.receipt .amt { white-space: nowrap; }
.more { display: inline-block; padding: .5rem 0; font-style: italic; }
.big-tel { font-size: clamp(2rem, 9vw, 3rem); font-weight: 300; }
.big-tel a { text-decoration: none; border-bottom: 1px solid var(--ink); }
.sheet-end { text-align: center; color: var(--soft); letter-spacing: .6em; margin-top: 2rem; }
.foot { max-width: 38rem; margin: 0 auto 4rem; padding: 0 1.25rem; color: var(--soft); font-size: 1rem; }
.foot a { color: var(--soft); display: inline-block; padding: .4rem 0; }
.foot-small { font-size: .9rem; }
/* paper feed: lines rise out of the slot one at a time, the way a printer feeds a slip. JS adds .feed to <html> */
/* opacity, not clip-path: a clipped line cannot be tapped, a transparent one can (gate J found the clip-path version) */
.feed .line { opacity: 0; transform: translateY(.6em); transition: opacity .7s cubic-bezier(.2, .7, .2, 1), transform .7s cubic-bezier(.2, .7, .2, 1); }
.feed .line.fed { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .feed .line { opacity: 1; transform: none; transition: none; } }
@media (max-width: 480px) { .sheet { padding: 2.25rem 1.25rem 2rem; margin-top: .75rem; } .callbar span { flex-basis: 100%; } }
'''
JS = r'''// Paper feed (signature, tier 2): each .line rises into place once, in reading order, as it enters the view, like a slip
// feeding out of a printer. Reduced motion: nothing is hidden (the CSS rule is off). No scroll hijack.
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  const lines = [...document.querySelectorAll(".line")]; document.documentElement.classList.add("feed");
  let queue = [], busy = false;
  const pump = () => { if (!queue.length) { busy = false; return; } busy = true; queue.shift().classList.add("fed"); setTimeout(pump, 110); };
  const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) { io.unobserve(e.target); queue.push(e.target); } queue.sort((a, b) => lines.indexOf(a) - lines.indexOf(b)); if (!busy) pump(); }, { rootMargin: "0px 0px -8% 0px" });
  lines.forEach((l) => io.observe(l));
})();
'''
files = {'index.html': index, 'what-happens-next.html': wh, 'prices.html': pr, 'contact.html': ct, '404.html': nf, 'style.css': CSS, 'feed.js': JS,
 'sitemap.xml': '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(f'<url><loc>{DOMAIN}{p}</loc></url>\n' for p in ['/', '/what-happens-next.html', '/prices.html', '/contact.html']) + '</urlset>\n',
 'robots.txt': f'User-agent: *\nAllow: /\nSitemap: {DOMAIN}/sitemap.xml\n',
 '_headers': '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n'}
for n, c in files.items(): open(os.path.join(OUT, n), 'w').write(c)
print('wrote', len(files), 'files to', os.path.abspath(OUT))
