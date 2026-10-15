// The four rule-set axes bite, without a browser: each rule fails on a planted violation and passes on clean input.
//   node tests/gate/rulesets.test.mjs
import { copyRules, seoRules, perfRules, secRules, parseHeadersFile, countOf, rulesAxes } from "../../skills/asfakulsiam-motomation-design/scripts/rulesets.mjs";
let bad = 0; const say = (ok, m) => { console.log(`${ok ? "ok  " : "FAIL"} ${m}`); if (!ok) bad++; };
const ids = (r) => [...new Set(r.fails.map((f) => f.id))].sort().join(" ");
const URL0 = "https://example.org/rooms/";

// C · copy
const cleanCopy = { blocks: [{ tag: "h1", text: "Twelve rooms on Shankhari Bazar" }, { tag: "p", text: "Book a room. Pay at the desk." }], ctas: [{ tag: "a", text: "Book a room for tonight" }], extras: [{ where: "title", text: "Twelve rooms · Ghor" }] };
say(countOf(copyRules(cleanCopy)) === 0, "copy: clean copy → C0");
const dirty = (b, c = []) => copyRules({ blocks: [{ tag: "p", text: b }], ctas: c });
say(ids(dirty("Fast — simple — reliable")) === "copy-04", "copy-04: em dash caught");
say(ids(dirty("It's not a website, it's an experience.")) === "copy-09", "copy-09: aphorism formula caught");
say(ids(dirty("Not just a designer, but an engineer.")) === "copy-15", "copy-15: two-beat antithesis caught");
say(ids(dirty("Not just a hotel. A home.")) === "copy-15", "copy-15: 'Not just X. Y.' caught");
say(ids(dirty("In today's fast-paced world, teams need speed.")) === "copy-11", "copy-11: warm-up opener caught");
say(ids(dirty("Plain text.", [{ tag: "a", text: "Learn more" }])) === "copy-17", "copy-17: vague CTA caught");
say(countOf(dirty("[NEEDS COPY: tagline — owner]")) === 0, "copy: [NEEDS COPY] markers are skipped");
say(copyRules({ blocks: [{ tag: "p", text: "Trusted by 10,000+ teams worldwide." }] }).warns.some((w) => w.id === "copy-16"), "copy-16: unsourced usage claim warns");

// S · SEO
const goodSeo = { pageUrl: URL0, title: "Twelve rooms on Shankhari Bazar · Ghor", description: "A twelve-room hotel in Old Dhaka.", robots: [], canonicals: [URL0], headings: [1, 2, 3, 2], links: ["/rooms/garden-room/", "/visit/", "/journal/", "#top"], jsonld: ['{"@type":"Hotel"}'], ogImage: "https://example.org/og.png", ogWidth: "1200", ogHeight: "630", subresources: ["https://example.org/a.webp"] };
say(countOf(seoRules(goodSeo)) === 0, "seo: complete page → S0");
const S = (o) => ids(seoRules({ ...goodSeo, ...o }));
say(S({ robots: ["noindex, follow"] }) === "seo-03", "seo-03: noindex caught");
say(S({ canonicals: [] }) === "seo-04", "seo-04: missing canonical caught");
say(S({ title: "x".repeat(61) }) === "seo-05", "seo-05: 61-char title caught");
say(S({ description: null }) === "seo-06", "seo-06: missing description caught");
say(S({ headings: [1, 1, 2] }) === "seo-07", "seo-07: two h1 caught");
say(S({ headings: [1, 2, 4] }) === "seo-08", "seo-08: h2 → h4 caught");
say(S({ jsonld: ["{oops"] }) === "seo-10", "seo-10: unparseable JSON-LD caught");
say(S({ links: ["#a", "#b", "/visit/"] }) === "seo-11", "seo-11: one internal link caught");
say(S({ links: ["/Rooms/", "/visit/?id=7", "/journal/"] }) === "seo-17", "seo-17: uppercase slug and query caught");
say(S({ subresources: ["http://cdn.example.org/a.js"] }) === "seo-16", "seo-16: mixed content caught");
say(S({ ogImage: null }) === "seo-18", "seo-18: missing og:image caught");
say(S({ ogWidth: "800", ogHeight: "600" }) === "seo-18", "seo-18: 800×600 og:image caught");
say(countOf(seoRules({ ...goodSeo, pageUrl: "http://127.0.0.1:5000/p.html", canonicals: ["p.html"], links: ["a.html", "b.html", "c.html"] })) === 0, "seo-04: a relative canonical is accepted for a local file");

// P · performance
const goodPerf = { images: [{ src: "/hero.avif", top: 100, area: 5e5, loading: null }, { src: "/a.webp", top: 2000, area: 1e5, loading: "lazy" }], scripts: [{ inline: true, type: "module", text: "init()" }, { src: "/a.js", inline: false, inHead: true, defer: true }], jsKB: 40, budgetKB: 80 };
say(countOf(perfRules(goodPerf)) === 0, "perf: clean page → P0");
const P = (o) => ids(perfRules({ ...goodPerf, ...o }));
say(P({ images: [{ src: "/hero.jpg", top: 100, area: 5e5, loading: null }] }) === "perf-01", "perf-01: JPEG without a modern source caught");
say(P({ images: [{ src: "/hero.jpg", top: 100, area: 5e5, loading: null, inPictureModern: true }] }) === "", "perf-01: JPEG inside <picture> with AVIF passes");
say(P({ images: [{ src: "/b.webp", top: 1800, area: 1e5, loading: null }] }) === "perf-02", "perf-02: eager below-the-fold image caught");
say(P({ images: [{ src: "data:image/svg+xml,%3Csvg%3E", top: 1800, area: 1e5, loading: null }] }) === "", "perf-02: an inline data: image below the fold needs no lazy loading");
say(P({ images: [{ src: "/hero.webp", top: 0, area: 9e5, loading: "lazy" }] }) === "perf-03", "perf-03: lazy LCP image caught");
say(P({ jsKB: 120 }) === "perf-04", "perf-04: JS over budget caught");
say(P({ scripts: [{ inline: true, type: null, text: "  /* nothing */ " }] }) === "perf-11", "perf-11: empty inline script caught");
say(P({ scripts: [{ src: "/analytics.js", inline: false, inHead: true }] }) === "perf-12", "perf-12: render-blocking head script caught");

// K · security
const goodSec = { pageUrl: URL0, html: "<p>hi</p>", scriptTexts: ["const pk = 'pk_live_abcdefghijklmnop';"], headers: { "content-security-policy": "default-src 'self'", "x-content-type-options": "nosniff", "referrer-policy": "strict-origin-when-cross-origin" }, cookies: ["sid=1; Path=/; HttpOnly; Secure; SameSite=Lax"] };
say(countOf(secRules(goodSec)) === 0, "sec: headers, flagged cookie, publishable key only → K0");
const K = (o) => ids(secRules({ ...goodSec, ...o }));
say(K({ cookies: ["sid=1; Path=/"] }) === "sec-06", "sec-06: cookie without flags caught");
say(K({ scriptTexts: ["const k = 'sk_live_" + "a".repeat(24) + "';"] }) === "sec-07", "sec-07: Stripe live secret key caught");
say(K({ html: "<script>const AWS='AKIA" + "ABCDEFGHIJKLMNOP" + "'</script>" }) === "sec-07", "sec-07: AWS key id caught");
say(secRules({ ...goodSec, scriptTexts: ["sk_live_" + "b".repeat(24)] }).fails[0].at.includes("…"), "sec-07: the match is masked in the report");
say(K({ scriptTexts: ["out.innerHTML = location.hash.slice(1);"] }) === "sec-12", "sec-12: URL → innerHTML caught");
say(K({ headers: { ...goodSec.headers, "access-control-allow-origin": "*" } }) === "sec-16", "sec-16: CORS wildcard caught");
say(K({ headers: { "x-content-type-options": "nosniff" } }) === "sec-h1 sec-h3", "sec-h1/h3: no CSP and no Referrer-Policy caught");
say(K({ headers: { "x-content-type-options": "nosniff" }, metaCsp: "default-src 'self'", metaReferrer: "no-referrer" }) === "", "sec-h1/h3: meta CSP and meta referrer accepted");
say(K({ headers: { ...goodSec.headers, "x-content-type-options": "" } }) === "sec-h2", "sec-h2: no nosniff caught");
const W = (o) => secRules({ ...goodSec, ...o }).warns.map((w) => w.id).sort().join(" ");
say(W({}) === "", "sec warnings: the good page has none");
say(W({ scriptTexts: ["localStorage.setItem('authToken', res.token);"] }) === "sec-06", "sec-06 (warn): auth token in localStorage caught");
say(W({ scriptTexts: ["localStorage.setItem('theme', 'dark');"] }) === "", "sec-06 (warn): a non-auth localStorage key is fine");
say(W({ scriptTexts: ["console.log('session', user.email, token);"] }) === "sec-09", "sec-09 (warn): console.log of email/token caught");
say(W({ scriptTexts: ["console.log('ready');"] }) === "", "sec-09 (warn): a plain console.log is not flagged");
say(W({ envIgnored: { root: "/p", ignored: false, why: "no .gitignore found" } }) === "sec-08", "sec-08 (warn): .env not ignored caught");
say(W({ envIgnored: { root: "/p", ignored: true } }) === "", "sec-08 (warn): .env ignored passes");
say(W({ headers: { "x-content-type-options": "nosniff", "referrer-policy": "no-referrer" }, metaCsp: "default-src 'self'" }) === "sec-h1", "sec-h1 (warn): CSP only as meta over HTTP");
say(countOf(secRules({ ...goodSec, scriptTexts: ["localStorage.setItem('jwt', t); console.log(token);"] })) === 0, "sec warnings never add to the K count");

// _headers parsing and the stamp segment
const hf = "/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: no-referrer\n/admin/*\n  X-Robots-Tag: noindex\n";
say(parseHeadersFile(hf, "/studio.html")["x-content-type-options"] === "nosniff" && !parseHeadersFile(hf, "/studio.html")["x-robots-tag"], "_headers: /* applies, /admin/* does not");
say(rulesAxes({ copy: { fails: [{ id: "copy-04" }, { id: "copy-04" }] }, seo: { fails: [] }, perf: { fails: [] }, sec: { fails: [{ id: "sec-h2" }] } }).segment === "rules: C1 S0 P0 K1", "a rule failing twice counts once: rules: C1 S0 P0 K1");

if (bad) { console.error(`\n${bad} check(s) failed`); process.exit(1); }
console.log("\nevery rule-set check bites");
