// Composition heuristics (v2.5.0, C4) measure what they say, and stay advisory. Synthetic pages, real browser.
//   node tests/gate/composition.test.mjs      (needs Playwright; without it: "not verified — no browser", exit 3)
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const ROOT = fileURLToPath(new URL("../..", import.meta.url));
let pw; try { pw = createRequire(ROOT + "noop.js")("playwright"); } catch { console.log("not verified — no browser"); process.exit(3); }
const { composition, stampOf, COMP_FILL_MIN, COMP_SCALE_MIN } = await import("../../skills/asfakulsiam-motomation-design/scripts/gate.mjs");
const css = "body{margin:0;background:#f4f1ea;color:#111;font:16px/1.5 sans-serif}p{max-width:40rem;margin:0 0 1rem}";
const para = "This sentence is body copy long enough to count as a run of reading text on the page. ".repeat(3);
const PAGES = {
  // a tall sticky stage holding one small word: mostly empty while pinned; no display size; two equal paragraphs per screen
  "/sparse": `<!doctype html><html lang="en"><title>s</title><style>${css}.zone{height:300vh}.stage{position:sticky;top:0;height:100vh}.stage span{font-size:20px}</style><div class="zone"><div class="stage"><span>Small</span></div></div><main><p>${para}</p><p>${para}</p></main>`,
  // a sticky stage filled by a picture and a 120px headline over 16px body: filled, one focal point, scale 1:7.5
  "/rich": `<!doctype html><html lang="en"><title>r</title><style>${css}.zone{height:300vh}.stage{position:sticky;top:0;height:100vh;display:grid;place-items:center}.stage svg{position:absolute;inset:0;width:100%;height:100%}h1{position:relative;font-size:120px;line-height:1;margin:0}.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}</style><div class="zone"><div class="stage"><svg viewBox="0 0 10 10" preserveAspectRatio="none" aria-hidden="true"><rect width="10" height="10" fill="#c96"/></svg><h1><span>S</span><span>p</span><span>l</span><span>i</span><span>t</span></h1><span class="sr">${"hidden ".repeat(200)}</span></div></div><main><p>${para}</p></main>`,
};
const srv = createServer((q, r) => { r.writeHead(PAGES[q.url] ? 200 : 404, { "content-type": "text/html" }); r.end(PAGES[q.url] || ""); }).listen(0, "127.0.0.1");
await new Promise((ok) => srv.on("listening", ok)); const base = `http://127.0.0.1:${srv.address().port}`;
const b = await pw.chromium.launch(); let fails = 0; const say = (ok, m) => { console.log(`${ok ? "ok  " : "FAIL"} ${m}`); if (!ok) fails++; };
try {
  const s = await composition(b, base + "/sparse"), r = await composition(b, base + "/rich");
  say(s.pin.length === 1 && s.pin[0].fill < COMP_FILL_MIN * 100 && !s.pin[0].ok, `sparse pinned zone warns (${s.pin[0]?.fill}% filled, limit ${COMP_FILL_MIN * 100}%)`);
  say(r.pin.length === 1 && r.pin[0].ok, `filled pinned zone passes (${r.pin[0]?.fill}%)`);
  say(r.screens[0].ok && /h1/.test(r.screens[0].top), `a headline split into per-letter spans is one focal block (${r.screens[0].top}, lead ${r.screens[0].lead}×)`);
  say(s.screens.some((x) => x.text && !x.ok), "two equal paragraphs on a screen: no clear focal point, warns");
  say(r.scale.ratio === 7.5 && r.scale.ok, `display:body 120/16 = 1:${r.scale.ratio} passes (limit 1:${COMP_SCALE_MIN})`);
  say(!s.scale.ok, `no display size: 1:${s.scale.ratio} warns`);
  const k = { contrast: 0, overflow: 0, words: 0, motion: 0, names: 0, numbers: 0, quality: 0, access: 0, copy: 0, seo: 0, perf: 0, sec: 0 };
  say(!/comp|fill|focal|scale/.test(stampOf(k, "0123456789")), "the stamp carries no composition field (advisory only)");
  const src = readFileSync(ROOT + "skills/asfakulsiam-motomation-design/scripts/gate.mjs", "utf8");
  const pass = src.match(/const pass = Object[^\n]+/)[0]; const idLine = src.match(/const id = createHash[^\n]+/)[0];
  say(!/\bcomp\b|composition/.test(pass) && !/\bcomp\b|composition/.test(idLine) && /counts/.test(pass), "pass/fail and the stamp id do not read the composition result");
} finally { await b.close(); srv.close(); }
console.log(fails ? `\n${fails} failure(s)` : "\ncomposition heuristics measure what they say and never decide the gate"); process.exit(fails ? 1 : 0);
