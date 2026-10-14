// Richness advisory (v2.6.0): the "too little" warnings fire on thin pages, stay silent on rich ones, and never decide
// the gate. Synthetic pages, real browser.
//   node tests/gate/richness.test.mjs      (needs Playwright; without it: "not verified — no browser", exit 3)
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const ROOT = fileURLToPath(new URL("../..", import.meta.url));
let pw; try { pw = createRequire(ROOT + "noop.js")("playwright"); } catch { console.log("not verified — no browser"); process.exit(3); }
const { richness, pageKind, stampOf } = await import("../../skills/asfakulsiam-motomation-design/scripts/gate.mjs");
const head = (t) => `<!doctype html><html lang="en"><title>${t}</title><style>body{margin:0;font:17px/1.5 sans-serif}h1{font-size:64px;margin:0}.g{display:grid;grid-template-columns:repeat(4,200px);gap:16px}.g a{display:block;height:200px;background:#ddd}</style>`;
const nav = `<header><nav aria-label="Main"><a href="/shop/">Shop</a> <a href="/about/">About</a></nav></header>`;
const items = Array.from({ length: 8 }, (_, i) => `<a href="/p/${i}"><img alt="Plate ${i}" width="200" height="160" src="data:image/gif;base64,R0lGODlhAQABAAAAACw="></a>`).join("");
const para = "Two kilns in Mirpur, fired every second Thursday since 2014. ".repeat(2);
const PAGES = {
  "/": `${head("thin home")}<main style="padding-top:40vh"><p>Ceramics.</p></main>`,
  "/rich/index.html": `${head("rich home")}${nav}<main><section><h1>Fired twice, used daily.</h1><p>${para}</p><a href="/shop/">See the batch</a></section></main>`,
  "/shop/": `${head("thin category")}<main><div class="g">${items}</div></main>`,
  "/collections/": `${head("rich category")}${nav}<main><h1>Plates</h1><p>8 pieces in this batch</p><div class="g">${items}</div></main>`,
  "/about/": `${head("thin about")}${nav}<main><h1>About</h1></main>`,
  "/story/": `${head("rich about")}${nav}<main><h1>Our story</h1><section><p>${para}</p></section><section><p>${para}</p></section></main>`,
};
const srv = createServer((q, r) => { r.writeHead(PAGES[q.url] ? 200 : 404, { "content-type": "text/html" }); r.end(PAGES[q.url] || ""); }).listen(0, "127.0.0.1");
await new Promise((ok) => srv.on("listening", ok)); const base = `http://127.0.0.1:${srv.address().port}`;
const b = await pw.chromium.launch(); let fails = 0; const say = (ok, m) => { console.log(`${ok ? "ok  " : "FAIL"} ${m}`); if (!ok) fails++; };
const ids = (r) => r.warns.map((w) => w.id).sort().join(",");
try {
  say(pageKind(base + "/").kind === "home" && pageKind(base + "/about/").kind === "about" && pageKind(base + "/shop/").kind === "category" && pageKind(base + "/hotel.html").kind === "page" && pageKind(base + "/hotel.html", "home").kind === "home", "page kind from the path, --page wins");
  const th = await richness(b, base + "/"), rh = await richness(b, base + "/rich/index.html");
  say(ids(th) === "fold,opening", `thin homepage warns: fold + opening (${ids(th)})`);
  say(rh.warns.length === 0, `rich homepage is silent (${rh.fold.length} sections above the fold, opening ${rh.opening})`);
  const tc = await richness(b, base + "/shop/"), rc = await richness(b, base + "/collections/");
  say(tc.warns.some((w) => w.id === "category" && /no title/.test(w.why) && /no count/.test(w.why)), `bare grid warns: ${tc.warns.find((w) => w.id === "category")?.why}`);
  say(!rc.warns.some((w) => w.id === "category") && rc.count === "8 pieces", `titled, counted grid is silent (title ${rc.title}, count "${rc.count}")`);
  const ta = await richness(b, base + "/about/"), ra = await richness(b, base + "/story/");
  say(ta.warns.some((w) => w.id === "about"), `one-heading about page warns: ${ta.warns.find((w) => w.id === "about")?.why}`);
  say(!ra.warns.some((w) => w.id === "about"), `two-block about page is silent (${ra.blocks.length} blocks)`);
  const k = { contrast: 0, overflow: 0, words: 0, motion: 0, names: 0, numbers: 0, quality: 0, access: 0, copy: 0, seo: 0, perf: 0, sec: 0 };
  say(!/rich|fold|opening/.test(stampOf(k, "0123456789")), "the stamp carries no richness field (advisory only)");
  const src = readFileSync(ROOT + "skills/asfakulsiam-motomation-design/scripts/gate.mjs", "utf8");
  const pass = src.match(/const pass = Object[^\n]+/)[0]; const idLine = src.match(/const id = createHash[^\n]+/)[0]; const countsLine = src.match(/const counts = \{[^\n]+/)[0];
  say(![pass, idLine, countsLine].some((l) => /\brich\b|richness/.test(l)), "pass/fail, the counts and the stamp id do not read the richness result");
} finally { await b.close(); srv.close(); }
console.log(fails ? `\n${fails} failure(s)` : "\nrichness warns on thin pages, stays silent on rich ones, and never decides the gate"); process.exit(fails ? 1 : 0);
