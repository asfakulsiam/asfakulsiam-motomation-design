# Build 3 · GHURNI hardcore metal band (diversity brief 03). Writes ../03-hardcore-metal-band/.
import os, json, forms
OUT = os.path.join(os.path.dirname(__file__), '..', '03-hardcore-metal-band'); os.makedirs(OUT, exist_ok=True)
DOMAIN = 'https://ghurni.example'
FONTS = '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=JetBrains+Mono:wght@400;700&display=swap">'
CSP = "default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self'; img-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'self'"
STAMP = '<!-- motomation · archetype: room · mutation: remove-expected · signature: impact · tier: 4 · critique: <paste> · gate: <paste> -->'
SHOWS = [("Dhaka", "Jolshaghor", "[NEEDS COPY: date]"), ("Chattogram", "Theatre Institute", "[NEEDS COPY: date]"), ("Sylhet", "Shahjalal Hall", "[NEEDS COPY: date]")]
def head(title, desc, path, page):
    ld = {"@context": "https://schema.org", "@type": "MusicGroup", "name": "GHURNI", "genre": "Hardcore metal", "foundingLocation": "Chattogram", "album": {"@type": "MusicAlbum", "name": "Lohar Shohor"}}
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
<a class="mark" href="/" aria-label="GHURNI home">GH</a>
<div class="flash" aria-hidden="true"></div>
'''
INDEX = '<nav class="index" aria-label="Rooms">' + ''.join(f'<a href="{h}"><span class="n">{n}</span><span class="w">{w}</span></a>' for n, h, w in [("01", "/album.html", "ALBUM"), ("02", "/shows.html", "SHOWS"), ("03", "/merch.html", "MERCH")]) + '</nav>'
FOOT = f'''<footer class="foot">{INDEX}<p>GHURNI · Chattogram · Tanvir, Rumi, Sabbir, Joy</p></footer>
<script src="/impact.js" defer></script>
'''
def room(num, name, body, cls=''):
    return f'<section class="room {cls}" aria-labelledby="r{num}"><p class="room-no">ROOM {num}</p><h2 id="r{num}" class="hit">{name}</h2>{body}</section>'
def shows_table():
    return '<table class="shows"><caption>Lohar Shohor tour, 2026 [NEEDS COPY: year and dates]</caption><thead><tr><th scope="col">City</th><th scope="col">Venue</th><th scope="col">Date</th></tr></thead><tbody>' + ''.join(f'<tr><th scope="row">{c}</th><td>{v}</td><td>{d}</td></tr>' for c, v, d in SHOWS) + '</tbody></table>'
PHOTO = '<div class="photo" role="img" aria-label="Band photo, four members under one red bulb [NEEDS ASSET: photo]"><span></span></div>'
index = head('GHURNI · Lohar Shohor, out 14 November', 'GHURNI, hardcore metal from Chattogram. New album Lohar Shohor out 14 November. Tour: Dhaka, Chattogram, Sylhet. Merch drop.', '/', 'home') + f'''<main id="main">
<section class="door" aria-labelledby="h1"><h1 id="h1" class="hit"><span class="giant">GHURNI</span><span class="sub">Lohar Shohor. Eight tracks. Out 14 November.</span></h1>{PHOTO}</section>
{room("01", "LOHAR SHOHOR", '<p class="big">Iron City. Eight tracks recorded live in one room in Chattogram, four people, no clicks.</p><p><a class="go" href="/album.html">Go into the album room</a></p>')}
{room("02", "NEXT SHOW", shows_table()[:0] + '<p class="big">Dhaka, Jolshaghor. [NEEDS COPY: date]</p><p><a class="go" href="/shows.html">All three shows</a></p>', 'red')}
{room("03", "THE DROP", '<p class="big">Two shirts and one patch. Pressed once, in Chattogram.</p><p><a class="go" href="/merch.html">Get told when it opens</a></p>')}
</main>
''' + FOOT + '</body>\n</html>\n'
album = head('Lohar Shohor · GHURNI', 'Lohar Shohor (Iron City), the new GHURNI album: eight tracks, out 14 November. Tracklist and where to hear it.', '/album.html', 'album') + f'''<main id="main">
<section class="door" aria-labelledby="h1"><p class="room-no">ROOM 01</p><h1 id="h1" class="hit"><span class="giant g2">LOHAR SHOHOR</span><span class="sub">Iron City · 8 tracks · 14 November</span></h1></section>
{room("01A", "TRACKS", '<ol class="tracks">' + ''.join(f'<li><span>{i:02d}</span>[NEEDS COPY: title]</li>' for i in range(1, 9)) + '</ol>')}
{room("01B", "HEAR IT", '<p class="big">On every platform on release day [NEEDS COPY: links]. On vinyl at the shows.</p>', 'red')}
</main>
''' + FOOT + '</body>\n</html>\n'
shows = head('Shows · GHURNI Lohar Shohor tour', 'GHURNI live: Dhaka at Jolshaghor, Chattogram at Theatre Institute, Sylhet at Shahjalal Hall. Dates and venues.', '/shows.html', 'shows') + f'''<main id="main">
<section class="door" aria-labelledby="h1"><p class="room-no">ROOM 02</p><h1 id="h1" class="hit"><span class="giant">SHOWS</span><span class="sub">Three cities. Doors at 7.</span></h1></section>
{room("02A", "DATES", shows_table())}
</main>
''' + FOOT + '</body>\n</html>\n'
merch = head('Merch drop · GHURNI', 'The Lohar Shohor merch drop: two shirts and one patch, pressed once. Leave your email to hear when it opens.', '/merch.html', 'merch') + f'''<main id="main">
<section class="door" aria-labelledby="h1"><p class="room-no">ROOM 03</p><h1 id="h1" class="hit"><span class="giant">MERCH</span><span class="sub">Pressed once. Then gone.</span></h1></section>
{room("03A", "THE DROP", '<ul class="merch"><li><b>Iron City shirt</b><span>black, red print [NEEDS COPY: price]</span></li><li><b>GHURNI logo shirt</b><span>bone on black [NEEDS COPY: price]</span></li><li><b>Woven patch</b><span>10 cm [NEEDS COPY: price]</span></li></ul>')}
{room("03B", "TELL ME", '<form id="notify" class="notify" novalidate aria-label="Tell me when the drop opens"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" required><span class="err" data-for="email" aria-live="polite"></span><button type="submit">TELL ME WHEN IT OPENS</button><p class="form-status" role="status" aria-live="polite"></p></form>', 'red')}
</main>
''' + FOOT + '<script src="/notify.js" defer></script>\n</body>\n</html>\n'
nf = head('404 · GHURNI', 'Nothing in this room. Go back to the album, the shows or the merch drop.', '/404.html', '404') + f'''<main id="main"><section class="door" aria-labelledby="h1"><p class="room-no">ROOM 404</p><h1 id="h1" class="hit"><span class="giant">EMPTY</span><span class="sub">Not found. Nothing in this room.</span></h1><p><a class="go" href="/">Back to the door</a></p></section></main>
''' + FOOT + '</body>\n</html>\n'
CSS = r''':root { --black: #0a0a0a; --bone: #ece6da; --dim: #a39c90; --red: #f22b1f; /* 4.85:1 on black; #e01b12 measured 4.09:1 by the gate */ }
* { box-sizing: border-box; }
html { background: var(--black); color: var(--bone); }
body { margin: 0; font: 400 1rem/1.55 "JetBrains Mono", "Courier New", monospace; overflow-x: hidden; }
a { color: var(--bone); }
a:focus-visible, button:focus-visible, input:focus-visible { outline: 3px solid var(--red); outline-offset: 3px; }
.skip { position: absolute; left: -999px; } .skip:focus { left: 1rem; top: 1rem; z-index: 30; background: var(--bone); color: var(--black); padding: .5rem 1rem; }
.mark { position: fixed; top: .75rem; left: .75rem; z-index: 20; font: 400 1.25rem/1 "Anton", Impact, sans-serif; background: var(--red); color: var(--black); padding: .55rem .6rem; text-decoration: none; letter-spacing: .02em; }
.mark:hover { background: var(--bone); }
.flash { position: fixed; inset: 0; z-index: 15; background: var(--red); opacity: 0; pointer-events: none; mix-blend-mode: multiply; }
.flash.on { animation: flash .22s linear; }
@keyframes flash { 0% { opacity: 0; } 30% { opacity: .85; } 100% { opacity: 0; } }
h1, h2, .giant, .w, .room-no { font-family: "Anton", Impact, sans-serif; font-weight: 400; text-transform: uppercase; }
.door { overflow-x: clip; min-height: 100vh; min-height: 100svh; display: grid; align-content: end; padding: 5rem 1rem 2rem; position: relative; overflow: hidden; }
h1 { margin: 0; position: relative; z-index: 2; }
.giant { display: block; font-size: 27vw; line-height: .82; letter-spacing: -.015em; white-space: nowrap; }
.giant.g2 { font-size: 15vw; white-space: normal; }
.sub { display: block; margin-top: 1rem; font: 700 1rem/1.4 "JetBrains Mono", monospace; text-transform: none; letter-spacing: 0; max-width: 34ch; }
.photo { position: absolute; right: 4vw; top: 9vh; width: min(46vw, 34rem); aspect-ratio: 4 / 5; clip-path: polygon(0 4%, 22% 0, 48% 6%, 74% 1%, 100% 5%, 97% 38%, 100% 70%, 94% 100%, 60% 96%, 30% 100%, 3% 95%, 6% 60%); background: radial-gradient(circle, var(--dim) 0 34%, transparent 36%) 0 0 / 7px 7px, linear-gradient(160deg, #3a3631, #121110 70%); filter: contrast(1.4); }
.photo span { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 30%, transparent 0 22%, var(--black) 64%); }
.room { overflow: clip; min-height: 85vh; padding: 5rem 1rem 4rem; border-top: 6px solid var(--bone); display: grid; align-content: start; gap: 1rem; }
.room.red { background: var(--red); color: var(--black); border-top-color: var(--black); }
.room.red a { color: var(--black); }
.room.red :focus-visible { outline-color: var(--black); }
.room-no { margin: 0; font-size: 1rem; letter-spacing: .2em; color: var(--dim); }
/* forced colours paint an opaque backplate behind every text run; the transformed .giant and the oversized .hit headings
   paint above their non-positioned siblings, so their backplates covered .sub and .room-no. Lift both above them. */
.room-no, .sub { position: relative; z-index: 3; }
.room.red .room-no { color: var(--black); }
h2 { margin: 0; font-size: clamp(3.4rem, 15vw, 13rem); line-height: .85; letter-spacing: -.01em; overflow-wrap: normal; }
.big { font-size: clamp(1.15rem, 2.6vw, 1.9rem); line-height: 1.3; max-width: 34ch; margin: 0; font-weight: 700; }
.go { display: inline-block; padding: .8rem 1rem; border: 3px solid currentColor; font-weight: 700; text-decoration: none; text-transform: uppercase; transition: background .12s linear, color .12s linear; }
.go:hover { background: var(--bone); color: var(--black); }
.room.red .go:hover { background: var(--black); color: var(--red); }
.shows { width: 100%; max-width: 64rem; border-collapse: collapse; font-size: 1.05rem; }
.shows caption { text-align: left; padding-bottom: .75rem; color: var(--dim); }
.shows th, .shows td { text-align: left; padding: 1rem .5rem; border-bottom: 2px solid var(--bone); }
.shows thead th { font-size: .85rem; color: var(--dim); border-bottom-width: 6px; }
.shows tbody th { font: 400 clamp(1.6rem, 6vw, 3rem)/1 "Anton", Impact, sans-serif; text-transform: uppercase; }
.shows tbody tr:hover { background: var(--bone); color: var(--black); }
.tracks { list-style: none; margin: 0; padding: 0; columns: 2 18rem; column-gap: 2rem; font-size: 1.1rem; }
.tracks li { break-inside: avoid; padding: .7rem 0; border-bottom: 2px solid var(--bone); display: flex; gap: 1rem; }
.tracks li:hover { background: var(--bone); color: var(--black); }
.tracks span { color: var(--red); font-weight: 700; }
.merch { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); gap: 0; border: 3px solid var(--bone); }
.merch li { padding: 1.5rem; border: 3px solid var(--bone); display: grid; gap: .5rem; min-height: 12rem; align-content: end; }
.merch li:hover { background: var(--bone); color: var(--black); }
.merch b { font: 400 2rem/1 "Anton", Impact, sans-serif; text-transform: uppercase; }
.notify { display: grid; gap: .5rem; max-width: 34rem; font-weight: 700; }
.notify input { font: inherit; min-height: 52px; padding: .7rem; border: 3px solid var(--black); background: var(--bone); color: var(--black); border-radius: 0; }
.notify input[aria-invalid="true"] { border-style: dashed; outline: 3px solid var(--black); }
.notify button { font: 400 1.4rem/1 "Anton", Impact, sans-serif; min-height: 56px; padding: .8rem 1rem; border: 0; background: var(--black); color: var(--bone); cursor: pointer; margin-top: .5rem; }
.notify button:hover { background: var(--bone); color: var(--black); }
.notify button:active { transform: translateY(2px); }
.notify button:disabled { opacity: .75; cursor: progress; }
.err, .form-status { min-height: 1.3em; margin: 0; font-weight: 700; }
.foot { border-top: 6px solid var(--bone); padding: 2rem 1rem 3rem; color: var(--dim); }
.index { display: grid; margin-bottom: 2rem; }
.index a { display: flex; align-items: baseline; gap: 1rem; text-decoration: none; border-bottom: 2px solid var(--dim); padding: .25rem 0; }
.index .n { color: var(--red); font-weight: 700; }
.index .w { font-size: clamp(3rem, 14vw, 10rem); line-height: .9; color: var(--bone); transition: transform .12s linear; }
.index a:hover .w { transform: translateX(1.5rem) skewX(-8deg); color: var(--red); }
/* impact: a heading entering the view slams down from 118%, two hard frames; the room flashes red once */
.armed .hit { transform: scale(1.18) translateY(-6%); opacity: 0; }
.armed .hit.landed { animation: slam .16s steps(2, end) forwards; }
@keyframes slam { 0% { transform: scale(1.18) translateY(-6%); opacity: 0; } 50% { transform: scale(.97) translate(1%, 1%); opacity: 1; } 100% { transform: none; opacity: 1; } }
@media (max-width: 700px) { .photo { position: relative; right: auto; top: auto; width: 100%; margin-top: 1.5rem; } .door { align-content: start; padding-top: 4.5rem; } .giant { font-size: 28vw; } }
@media (forced-colors: active) { .armed .hit { transform: none; opacity: 1; } .flash { display: none; } }
@media (prefers-reduced-motion: reduce) { .armed .hit { transform: none; opacity: 1; } .flash { display: none; } * { animation: none !important; transition: none !important; } }
'''
IJS = r'''// Impact (signature, tier 4). Each .hit heading lands with a two-frame slam the first time it enters the view, and the
// room behind it flashes red once. Flash safety: at most one flash per 400 ms (under 3 per second), each 220 ms,
// never repeated for the same heading. Tier 4 drift: the giant word slides with scroll (transform only, rAF, passive).
// Reduced motion: nothing is armed, no flash, no drift.
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("armed");
  const flash = document.querySelector(".flash"); let last = 0;
  const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) { e.target.classList.add("landed"); io.unobserve(e.target);
    const now = performance.now(); if (flash && now - last > 400 && e.target.tagName === "H2") { last = now; flash.classList.remove("on"); void flash.offsetWidth; flash.classList.add("on"); } } }, { threshold: .35 });
  document.querySelectorAll(".hit").forEach((h) => io.observe(h));
  const g = document.querySelector(".door .giant"); if (!g) return; let tick = false;
  addEventListener("scroll", () => { if (tick) return; tick = true; requestAnimationFrame(() => { tick = false; const y = Math.min(scrollY, innerHeight); g.style.transform = "translateX(" + (-y * 0.18).toFixed(1) + "px)"; }); }, { passive: true });
})();
'''
files = {'index.html': index, 'album.html': album, 'shows.html': shows, 'merch.html': merch, '404.html': nf, 'style.css': CSS, 'impact.js': IJS,
 'notify.js': forms.form_js('#notify', '/api/notify', 'SENDING…', 'Got it. You are on the list: one email when the drop opens, nothing else.', 'Sorry, that did not go through. Try again in a minute.', 'Please enter your email.'),
 'sitemap.xml': '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(f'<url><loc>{DOMAIN}{p}</loc></url>\n' for p in ['/', '/album.html', '/shows.html', '/merch.html']) + '</urlset>\n',
 'robots.txt': f'User-agent: *\nAllow: /\nSitemap: {DOMAIN}/sitemap.xml\n',
 '_headers': '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n'}
for n, c in files.items(): open(os.path.join(OUT, n), 'w').write(c)
print('wrote', len(files), 'files to', os.path.abspath(OUT))
