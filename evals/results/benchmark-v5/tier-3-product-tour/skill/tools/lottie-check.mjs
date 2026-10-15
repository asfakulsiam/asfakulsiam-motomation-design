// Screenshots each page's print window early and late, to confirm the Lottie plays once and rests on its final frame.
import { chromium } from "playwright";
import { serve } from "./serve.mjs";
const srv = await serve(process.cwd(), 8769);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
p.on("pageerror", (e) => console.log("pageerror", e.message));
for (const f of ["index", "features", "pricing", "start"]) {
  await p.goto(`http://127.0.0.1:8769/${f}.html`);
  await p.waitForSelector(".window.is-live", { timeout: 5000 }).catch(() => console.log(f, "never live"));
  await p.waitForTimeout(250);
  await p.locator(".window").screenshot({ path: `qa/lottie-${f}-early.png` });
  await p.waitForTimeout(1600);
  await p.locator(".window").screenshot({ path: `qa/lottie-${f}-end.png` });
}
await b.close(); srv.close();
