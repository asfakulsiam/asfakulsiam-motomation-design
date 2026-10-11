// Docs site check (local toolchain: NODE_PATH with playwright). Serves the repo, then:
//   every component page loads with no console errors, shows its name and a live demo;
//   search on the index filters (and Enter opens the first hit);
//   "Copy install command" puts the exact shadcn command on the clipboard;
//   the playground changes the live demo; the reduced-motion toggle flips the components' media query;
//   the mobile preview renders the component in a 375 px frame.
//   NODE_PATH=~/tc/node_modules node tests/docs/site.mjs [--shots dir]
import { createServer } from "node:http";
import { readFileSync, existsSync, readdirSync, mkdirSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const shots = process.argv.includes("--shots") ? process.argv[process.argv.indexOf("--shots") + 1] : null; if (shots) mkdirSync(shots, { recursive: true });
const T = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };
const server = createServer((q, r) => { const p = join(ROOT, decodeURIComponent(q.url.split("?")[0])); if (!p.startsWith(ROOT) || !existsSync(p)) { r.writeHead(404).end(); return; } r.writeHead(200, { "content-type": T[extname(p)] || "application/octet-stream" }).end(readFileSync(p)); });
await new Promise((ok) => server.listen(0, ok)); const base = `http://127.0.0.1:${server.address().port}/docs/site`;
const browser = await chromium.launch(); const ctx = await browser.newContext({ viewport: { width: 1360, height: 900 }, permissions: ["clipboard-read", "clipboard-write"] });
const fails = []; const ok = (c, m) => { if (!c) fails.push(m); return c; };
const ids = readdirSync(join(ROOT, "docs/site/c")).map((f) => f.replace(/\.html$/, "")).sort();
const page = await ctx.newPage(); let errs = []; page.on("console", (m) => m.type() === "error" && !/fonts\.(googleapis|gstatic)/.test(m.text()) && errs.push(m.text())); page.on("pageerror", (e) => errs.push(String(e)));
// 1. every page
let good = 0, play = 0; const noPlay = [];
for (const id of ids) { errs = [];
  await page.goto(`${base}/c/${id}.html`, { waitUntil: "load" }); await page.waitForTimeout(350);
  const h1 = await page.locator("h1").first().textContent().catch(() => ""), stage = await page.locator(".stage").first().evaluate((e) => e.children.length + e.textContent.length).catch(() => 0);
  const cmd = await page.locator(".cmd").textContent().catch(() => "");
  const pass = ok(h1 && stage > 0 && !errs.length && cmd === `npx shadcn@latest add https://raw.githubusercontent.com/asfakulsiam/asfakulsiam-motomation-design/main/registry/${id}.json`, `${id}: h1 "${h1}", stage ${stage}, errors ${errs.slice(0, 2).join(" | ")}, cmd "${cmd}"`);
  if (pass) good++; if (await page.locator(".play .ctls").count()) play++; else noPlay.push(id); }
console.log(`pages      ${good}/${ids.length} load with a heading, a live demo, the install command and no console errors`);
console.log(`playground ${play}/${ids.length} pages have live controls; the rest explain why not: ${noPlay.join(", ")}`);
// 2. search
await page.goto(`${base}/index.html`); await page.waitForTimeout(300);
const all = await page.locator(".results li").count();
await page.fill(".search input", "scroll"); await page.waitForTimeout(150);
const scroll = await page.locator(".results li strong").allTextContents(); const status = await page.locator(".count").textContent();
await page.fill(".search input", "paper fold"); await page.waitForTimeout(150); const two = await page.locator(".results li").count();
await page.fill(".search input", "zzzz"); await page.waitForTimeout(150); const none = await page.locator(".results li").count();
await page.fill(".search input", "typewr"); await page.waitForTimeout(150); if (shots) { await page.fill(".search input", "scroll"); await page.waitForTimeout(150); await page.screenshot({ path: join(shots, "search.jpg"), type: "jpeg", quality: 80 }); await page.fill(".search input", "typewr"); }
await page.press(".search input", "Enter"); await page.waitForURL(/c\/typewriter\.html/, { timeout: 5000 }).catch(() => {});
ok(all === ids.length && scroll.length >= 5 && none === 0 && page.url().endsWith("c/typewriter.html"), `search: all ${all}, scroll ${scroll.length}, none ${none}, enter → ${page.url()}`);
console.log(`search     index lists ${all}; "scroll" → ${scroll.length} (${status}); "paper fold" → ${two}; "zzzz" → ${none}; "typewr" + Enter → ${page.url().split("/").pop()}`);
// 3. install button
await page.goto(`${base}/c/count-up.html`); await page.waitForTimeout(300);
await page.getByRole("button", { name: "Copy install command" }).click(); await page.waitForTimeout(200);
const clip = await page.evaluate(() => navigator.clipboard.readText());
ok(clip === "npx shadcn@latest add https://raw.githubusercontent.com/asfakulsiam/asfakulsiam-motomation-design/main/registry/count-up.json", `install clipboard: ${clip}`);
console.log(`install    clipboard after "Copy install command": ${clip}`);
await page.getByRole("button", { name: "Copy source" }).click(); await page.waitForTimeout(200);
const src = await page.evaluate(() => navigator.clipboard.readText()); ok(src.includes("export function CountUp"), "copy source"); console.log(`source     "Copy source" → ${src.length} chars, starts ${JSON.stringify(src.slice(0, 40))}`);
// 4. playground: count-up suffix + decimals
await page.fill("#p-suffix", " km"); await page.fill("#p-decimals", "1"); await page.waitForTimeout(2400);
const shown = await page.locator(".stage [aria-label]").first().getAttribute("aria-label");
ok(/ km$/.test(shown || "") && /\.\d km$/.test(shown || ""), `playground: ${shown}`); console.log(`playground count-up suffix " km", decimals 1 → demo reads "${shown}"`);
// 5. reduced-motion toggle
const before = await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
await page.getByRole("switch", { name: "Reduced motion" }).click(); await page.waitForTimeout(200);
const after = await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
await page.goto(`${base}/c/typewriter.html`); await page.waitForTimeout(150);
const typed = await page.locator(".stage").first().evaluate((e) => [...e.querySelectorAll("span")].filter((s) => s.textContent.length === 1 && getComputedStyle(s).opacity === "1").length);
ok(!before && after && typed > 5, `rm toggle ${before}→${after}, typewriter chars visible at once ${typed}`);
console.log(`reduced    toggle: matchMedia(reduce) ${before} → ${after}; persists across pages; Typewriter shows ${typed} characters at once (no typing)`);
await page.getByRole("switch", { name: "Reduced motion" }).click();
// 6. mobile preview
await page.goto(`${base}/c/flowing-menu.html`); await page.waitForTimeout(300); await page.getByRole("button", { name: "Mobile 375" }).click(); await page.waitForTimeout(1200);
const frame = page.frameLocator("iframe"); const fw = await page.locator("iframe").evaluate((f) => f.contentWindow.innerWidth); const ftext = await frame.locator(".stage").textContent();
ok(fw === 375 && ftext.length > 10, `mobile frame width ${fw}`); console.log(`mobile     iframe viewport ${fw}px wide, demo text "${ftext.slice(0, 40)}…"`);
if (shots) { await page.screenshot({ path: join(shots, "component-mobile.jpg"), type: "jpeg", quality: 80 });
  await page.goto(`${base}/c/count-up.html`); await page.waitForTimeout(2200); await page.screenshot({ path: join(shots, "component.jpg"), type: "jpeg", quality: 80, fullPage: true }); }
await browser.close(); server.close();
console.log(fails.length ? `\nFAIL (${fails.length}):\n  ${fails.slice(0, 20).join("\n  ")}` : "\nall checks passed"); process.exit(fails.length ? 1 : 0);
