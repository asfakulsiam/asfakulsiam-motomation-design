// Variant comparison for vendor/plain: React (the source component) vs plain CSS + HTML vs Tailwind, per component.
// Local toolchain only (NODE_PATH with playwright + esbuild; Tailwind CLI for --tailwind). Nothing here is a repo dependency.
//   NODE_PATH=~/tc/node_modules node tests/variants/compare.mjs [--only a,b] [--shots dir] [--json out.json] [--tailwind path/to/cli]
// Per component and variant: (1) no console errors or page errors; (2) the settled screen-reader text (text outside
// aria-hidden subtrees, block elements joined by a space) and the interactive roles and names match React's; (3) after the scripted interaction (if any)
// they still match; (4) under prefers-reduced-motion two frames 900 ms apart are pixel-identical (it holds still);
// (5) a settled screenshot of each, joined side by side.
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const esbuild = require("esbuild");

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const args = process.argv.slice(2), opt = (k) => { const i = args.indexOf(k); return i < 0 ? null : args[i + 1]; };
const TOP = JSON.parse(readFileSync(join(ROOT, "vendor/plain/top5.json"), "utf8")).components.map((c) => c.id);
const only = opt("--only")?.split(","), ids = only || TOP, shots = opt("--shots"), jsonOut = opt("--json");

if (opt("--tailwind")) { // the CLI resolves "tailwindcss" from the input file's folder, so the input sits in the toolchain
  const cli = opt("--tailwind"), tc = dirname(dirname(dirname(cli))), tmp = join(tc, ".mm-tw-in.css");
  writeFileSync(tmp, `@import "tailwindcss";\n@source "${ROOT}/vendor/plain/**/tailwind.html";\n`);
  execFileSync(cli, ["-i", tmp, "-o", "/tmp/mm-tw.css", "--minify"], { cwd: tc, stdio: "ignore" }); rmSync(tmp);
  const file = join(ROOT, "vendor/plain/tailwind.preview.css"), head = readFileSync(file, "utf8").split("\n")[0];
  writeFileSync(file, head + "\n" + readFileSync("/tmp/mm-tw.css", "utf8")); }

const out = join(ROOT, "node_modules/.variants"); mkdirSync(out, { recursive: true });
await esbuild.build({ entryPoints: [join(ROOT, "tests/variants/fixtures.tsx")], bundle: true, format: "esm", outfile: join(out, "react.js"), jsx: "automatic", minify: true, define: { "process.env.NODE_ENV": '"production"' }, nodePaths: [process.env.NODE_PATH || ""], logLevel: "error" });
writeFileSync(join(out, "react.html"), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>React</title><link rel="icon" href="data:,"><link rel="stylesheet" href="/vendor/plain/_lib/demo.css"></head><body><div id="root"></div><script type="module" src="/node_modules/.variants/react.js"></script></body></html>`);

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };
const server = createServer((q, r) => { const p = join(ROOT, decodeURIComponent(q.url.split("?")[0]));
  if (!p.startsWith(ROOT) || !existsSync(p)) { r.writeHead(404).end(); return; } r.writeHead(200, { "content-type": TYPES[extname(p)] || "application/octet-stream" }).end(readFileSync(p)); });
await new Promise((ok) => server.listen(0, ok)); const base = `http://127.0.0.1:${server.address().port}`;
const url = (id, v) => v === "react" ? `${base}/node_modules/.variants/react.html?c=${id}` : `${base}/vendor/plain/${id}/${v}.html`;

// Scroll-driven demos are measured with the component scrolled to the middle of the screen.
const SCROLL = { "ink-fill": "[data-mm=ink-fill], main > p", aperture: "img", "velocity-marquee": "main > :first-child" };
const ACT = {
  "split-flap": async (p) => { await p.getByRole("button", { name: "Change the date" }).click(); await p.waitForTimeout(1600); },
  "squish-switch": async (p) => { await p.getByRole("switch").click(); await p.waitForTimeout(400); },
  "copy-button": async (p) => { await p.getByRole("button").click(); await p.waitForTimeout(300); },
};
const SETTLE = { typewriter: 3200, "animated-list": 3600, "count-up": 2200, "split-flap": 1600, "blur-focus": 2200, "bento-reveal": 1400 };

async function read(p) {
  return p.evaluate(() => {
    const hidden = (n) => n.closest?.("[aria-hidden=true]"), parts = [];
    const walk = (n) => { if (n.nodeType === 3) { if (!hidden(n.parentElement)) parts.push(n.textContent); return; }
      if (n.nodeType !== 1 || hidden(n) || ["SCRIPT", "STYLE"].includes(n.tagName)) return;
      if (n.hasAttribute("aria-label") && n.tagName !== "NAV") { parts.push(` ${n.getAttribute("aria-label")} `); return; } // the accessible name replaces the content
      const block = !getComputedStyle(n).display.startsWith("inline") || n.tagName === "BR";
      if (block) parts.push(" "); n.childNodes.forEach(walk); if (block) parts.push(" "); };
    walk(document.querySelector("main"));
    const roles = [...document.querySelectorAll("main a[href], main button, main [role=switch], main nav, main img")].filter((e) => !hidden(e)).map((e) => {
      const role = e.getAttribute("role") || { A: "link", BUTTON: "button", NAV: "navigation", IMG: "img" }[e.tagName];
      const name = (e.getAttribute("aria-label") || (e.tagName === "IMG" ? e.alt : "") || [...e.childNodes].map((c) => c.nodeType === 3 ? c.textContent : hidden(c) ? "" : c.textContent).join("")).replace(/\s+/g, " ").trim();
      return `${role}:${name}${e.hasAttribute("aria-checked") ? `[${e.getAttribute("aria-checked")}]` : ""}`; });
    return { text: parts.join("").replace(/\s+/g, " ").trim(), roles };
  });
}
async function visit(browser, id, v, reduced) {
  const ctx = await browser.newContext({ viewport: { width: 1100, height: 760 }, reducedMotion: reduced ? "reduce" : "no-preference", permissions: ["clipboard-read", "clipboard-write"] });
  const p = await ctx.newPage(), errors = [];
  p.on("console", (m) => m.type() === "error" && errors.push(m.text())); p.on("pageerror", (e) => errors.push(String(e)));
  await p.goto(url(id, v), { waitUntil: "load" });
  if (SCROLL[id]) { await p.locator(SCROLL[id]).first().evaluate((e) => e.scrollIntoView({ block: "center" })); }
  await p.mouse.move(5, 5); await p.waitForTimeout(SETTLE[id] || 900);
  const r = { errors };
  if (reduced) { const a = await p.screenshot(); await p.waitForTimeout(900); const b = await p.screenshot(); r.still = a.equals(b); }
  else { r.before = await read(p); r.shot = await p.screenshot(); if (ACT[id]) { await ACT[id](p); r.after = await read(p); } }
  r.errors = errors; await ctx.close(); return r;
}

const browser = await chromium.launch(), rows = [];
for (const id of ids) {
  const res = {}; for (const v of ["react", "plain", "tailwind"]) res[v] = { motion: await visit(browser, id, v, false), reduced: await visit(browser, id, v, true) };
  const same = (k) => ["plain", "tailwind"].every((v) => JSON.stringify(res[v].motion[k]) === JSON.stringify(res.react.motion[k]));
  const row = { id, errors: Object.values(res).flatMap((r) => [...r.motion.errors, ...r.reduced.errors]), sameText: same("before"), sameAfter: ACT[id] ? same("after") : null,
    still: Object.fromEntries(Object.entries(res).map(([v, r]) => [v, r.reduced.still])), react: res.react.motion.before, diff: {} };
  for (const v of ["plain", "tailwind"]) if (JSON.stringify(res[v].motion.before) !== JSON.stringify(res.react.motion.before) || (ACT[id] && JSON.stringify(res[v].motion.after) !== JSON.stringify(res.react.motion.after))) row.diff[v] = { before: res[v].motion.before, after: res[v].motion.after, reactAfter: res.react.motion.after };
  row.pass = !row.errors.length && row.sameText && row.sameAfter !== false && Object.values(row.still).every(Boolean);
  if (shots) { mkdirSync(shots, { recursive: true });
    const pg = await browser.newPage({ viewport: { width: 1680, height: 420 } });
    const cells = ["react", "plain", "tailwind"].map((v) => `<figure><img src="data:image/png;base64,${res[v].motion.shot.toString("base64")}"><figcaption>${v === "react" ? "React" : v === "plain" ? "CSS + HTML" : "Tailwind"}</figcaption></figure>`).join("");
    await pg.setContent(`<style>body{margin:0;font:14px ui-monospace,monospace;background:#222;color:#eee}h1{font-size:15px;margin:10px 12px}main{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:0 8px 8px}figure{margin:0}img{width:100%;display:block}figcaption{padding:4px 0}</style><h1>${id}</h1><main>${cells}</main>`);
    await pg.screenshot({ path: join(shots, `${id}.jpg`), type: "jpeg", quality: 82, fullPage: true }); await pg.close(); }
  rows.push(row);
  console.log(`${row.pass ? "PASS" : "FAIL"}  ${id.padEnd(18)} text ${row.sameText ? "same" : "DIFF"}${row.sameAfter === null ? "" : ` · after action ${row.sameAfter ? "same" : "DIFF"}`} · reduced still ${["react", "plain", "tailwind"].map((v) => (row.still[v] ? "y" : "N")).join("/")} · errors ${row.errors.length}`);
  if (!row.pass) console.log("   ", JSON.stringify({ react: row.react, reactAfter: res.react.motion.after, diff: row.diff, errors: row.errors.slice(0, 3) }).slice(0, 1500));
}
await browser.close(); server.close();
if (jsonOut) writeFileSync(jsonOut, JSON.stringify(rows.map(({ diff, ...r }) => r), null, 2));
const bad = rows.filter((r) => !r.pass).length; console.log(`\n${rows.length - bad}/${rows.length} components match across React, CSS + HTML and Tailwind`); process.exit(bad ? 1 : 0);
