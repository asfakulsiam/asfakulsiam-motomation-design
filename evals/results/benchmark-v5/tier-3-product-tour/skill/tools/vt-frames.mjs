// Freezes the cross-document transition at fixed times and screenshots it (forward, then browser Back).
import { chromium } from "playwright";
import { serve } from "./serve.mjs";
const srv = await serve(process.cwd(), 8767);
const b = await chromium.launch();
const [from, to, w, h, rm] = [process.argv[2] || "index.html", process.argv[3] || "features.html", +(process.argv[4] || 1440), +(process.argv[5] || 900), process.argv[6] === "rm"];
const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: rm ? "reduce" : "no-preference" });
const p = await ctx.newPage();
const freeze = async (tag, t) => {
  await p.waitForFunction(() => document.getAnimations().some((a) => a.effect && a.effect.pseudoElement), null, { timeout: 3000 }).catch(() => {});
  await p.evaluate((t) => document.getAnimations().forEach((a) => { if (a.effect && a.effect.pseudoElement) { a.pause(); a.currentTime = t; } }), t);
  await p.screenshot({ path: `qa/vt-${tag}-${t}.png` });
};
await p.goto("http://127.0.0.1:8767/" + from); await p.waitForTimeout(1500);
await p.click(`a[href="${to}"][rel]`).catch(() => p.click(`.route a[href="${to}"]`));
await freeze("fwd", +(process.argv[7] || 300));
await p.evaluate(() => document.getAnimations().forEach((a) => a.finish && a.play()));
await p.waitForTimeout(1600);
console.log("on", p.url(), "focus:", await p.evaluate(() => document.activeElement.tagName + "#" + document.activeElement.id));
await p.goBack();
await freeze("back", +(process.argv[7] || 300));
await p.evaluate(() => document.getAnimations().forEach((a) => a.play()));
await p.waitForTimeout(1600);
console.log("on", p.url(), "focus:", await p.evaluate(() => document.activeElement.tagName + "#" + document.activeElement.id));
await b.close(); srv.close();
