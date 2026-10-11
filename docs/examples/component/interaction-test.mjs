import { chromium } from "playwright";
const OUT = ".";
const URL = "http://127.0.0.1:8901/after/dist/index.html";
const b = await chromium.launch(); const log = [];
const fresh = async () => { const p = await (await b.newContext({ viewport: { width: 900, height: 780 } })).newPage(); await p.goto(URL); await p.waitForTimeout(400); return p; };
const statusText = (p) => p.getByRole("status").allTextContents().then((t) => t.join("|") || "(none)");
let p = await (await b.newContext({ viewport: { width: 900, height: 780 } })).newPage();
await p.goto("http://127.0.0.1:8901/before/dist/index.html"); await p.waitForTimeout(400); await p.screenshot({ path: `${OUT}/before.png` });
p = await fresh(); await p.screenshot({ path: `${OUT}/after-rest.png` });
// screenshot mid-hold (the hold may complete while the screenshot is taken; that is fine here)
let box = await p.getByRole("button", { name: /hold to delete/i }).boundingBox();
await p.mouse.move(box.x + 30, box.y + box.height / 2); await p.mouse.down(); await p.waitForTimeout(700);
await p.screenshot({ path: `${OUT}/after-mid-hold.png` }); await p.mouse.up();
// 1. pointer, released at 700 ms → cancelled
p = await fresh(); box = await p.getByRole("button", { name: /hold to delete/i }).boundingBox();
await p.mouse.move(box.x + 30, box.y + box.height / 2); await p.mouse.down(); await p.waitForTimeout(700); await p.mouse.up(); await p.waitForTimeout(1500);
log.push("pointer released at 700 ms → status: " + await statusText(p));
// 2. pointer, held 2 s → committed
p = await fresh(); box = await p.getByRole("button", { name: /hold to delete/i }).boundingBox();
await p.mouse.move(box.x + 30, box.y + box.height / 2); await p.mouse.down(); await p.waitForTimeout(2000); await p.mouse.up(); await p.waitForTimeout(500);
log.push("pointer held 2 s → status: " + await statusText(p));
// 3. keyboard, Space held 2 s → committed
p = await fresh(); await p.getByRole("button", { name: /hold to delete/i }).focus(); await p.keyboard.down("Space"); await p.waitForTimeout(2000); await p.keyboard.up("Space"); await p.waitForTimeout(500);
log.push("keyboard Space held 2 s → status: " + await statusText(p));
await p.screenshot({ path: `${OUT}/after-committed.png` });
// 4. keyboard, Space released at 600 ms → cancelled
p = await fresh(); await p.getByRole("button", { name: /hold to delete/i }).focus(); await p.keyboard.down("Space"); await p.waitForTimeout(600); await p.keyboard.up("Space"); await p.waitForTimeout(1500);
log.push("keyboard Space released at 600 ms → status: " + await statusText(p));
console.log(log.join("\n")); await b.close();
