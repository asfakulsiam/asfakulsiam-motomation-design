// Confetti: fires from its gallery demo, draws while bursting, removes its canvas after; under reduced motion draws nothing.
// Usage: node tests/components/confetti.test.mjs [screenshot.png]   (exit 1 on failure)
import { chromium } from "playwright"; import { createServer } from "node:http"; import { readFileSync } from "node:fs";
const html = readFileSync(new URL("../../skills/asfakulsiam-motomation-design/examples/gallery/index.html", import.meta.url)); const srv = createServer((q, s) => { s.writeHead(200, { "content-type": "text/html" }); s.end(html); }).listen(0);
const b = await chromium.launch();
for (const rm of [false, true]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: rm ? "reduce" : "no-preference" }); const pg = await ctx.newPage(); const errs = [];
  pg.on("pageerror", (e) => errs.push(String(e)));
  await pg.goto(`http://127.0.0.1:${srv.address().port}/`); const btn = pg.locator("article#confetti .stage button"); await btn.scrollIntoViewIfNeeded(); await btn.click();
  await pg.waitForTimeout(450); const mid = await pg.evaluate(() => document.querySelectorAll("body > canvas").length);
  if (!rm && process.argv[2]) await pg.screenshot({ path: process.argv[2] });
  await pg.waitForTimeout(2600); const after = await pg.evaluate(() => document.querySelectorAll("body > canvas").length);
  const msg = await pg.locator("article#confetti [role=status]").innerText();
  const ok = (rm ? mid === 0 : mid === 1) && after === 0 && !errs.length && /14 February/.test(msg); if (!ok) process.exitCode = 1;
  console.log(`${ok ? "ok  " : "FAIL"} ${rm ? "reduced" : "motion "}: canvases at 450ms = ${mid}, after 3s = ${after}, status = "${msg}", errors = ${errs.length}`);
  await ctx.close();
}
await b.close(); srv.close();
