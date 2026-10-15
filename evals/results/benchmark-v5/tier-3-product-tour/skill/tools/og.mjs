// Renders og.png (1200 × 630) from the Intro page: the line and the slip.
import { chromium } from "playwright";
import { serve } from "./serve.mjs";
const srv = await serve(process.cwd(), 8768);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } , reducedMotion: "reduce"});
await p.goto("http://127.0.0.1:8768/index.html"); await p.waitForTimeout(1200);
await p.addStyleTag({ content: ".pager,.foot,.aside{display:none}.stage{padding-top:24px}" });
await p.screenshot({ path: "og.png" });
await b.close(); srv.close();
