import { chromium } from "playwright";
import { serve } from "./serve.mjs";
const srv = await serve(process.cwd(), 8765);
const base = "http://127.0.0.1:8765/";
const b = await chromium.launch();
for (const [w, h] of [[1440, 900], [375, 812]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  p.on("console", (m) => console.log("console:", m.text()));
  p.on("pageerror", (e) => console.log("pageerror:", e.message));
  for (const f of ["index.html", "features.html", "pricing.html", "start.html"]) {
    await p.goto(base + f); await p.waitForTimeout(1800);
    await p.screenshot({ path: `qa/${f.replace(".html", "")}-${w}.png`, fullPage: true });
  }
  await p.close();
}
// transition test
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(base + "index.html"); await p.waitForTimeout(1500);
console.log("VT support:", await p.evaluate(() => "startViewTransition" in document && CSS.supports("view-transition-name: a")));
await p.click("a[rel=next]");
await p.waitForTimeout(260);
await p.screenshot({ path: "qa/vt-mid-fwd.png" });
await p.waitForTimeout(1500);
console.log("after fwd:", p.url(), "focused:", await p.evaluate(() => document.activeElement && document.activeElement.tagName + "#" + document.activeElement.id), "dir attr:", await p.evaluate(() => document.documentElement.getAttribute("data-dir")));
await p.goBack(); await p.waitForTimeout(240);
await p.screenshot({ path: "qa/vt-mid-back.png" });
await p.waitForTimeout(1500);
console.log("after back:", p.url(), "focused:", await p.evaluate(() => document.activeElement && document.activeElement.tagName));
await b.close(); srv.close();
