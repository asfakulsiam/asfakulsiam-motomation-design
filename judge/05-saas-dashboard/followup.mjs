import pkg from "/home/user/node_modules/playwright/index.js";
import { writeFileSync } from "node:fs";
const { chromium } = pkg;
const ORIGIN = "http://127.0.0.1:4410";
const OUT = "/home/user/workspace/bench/judge/05-saas-dashboard/screens";
const notes = {};

function lum(hex) {
  const m = hex.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return null;
  const [r, g, b] = [m[1], m[2], m[3]].map((n) => {
    const c = Number(n) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(fg, bg) {
  const a = lum(fg), b = lum(bg);
  if (a == null || b == null) return null;
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

const browser = await chromium.launch({ args: ["--disable-dev-shm-usage"] });
for (const width of [1440, 375]) {
  const prefix = width === 1440 ? "d" : "m";
  const ctx = await browser.newContext({ viewport: { width, height: width === 375 ? 812 : 900 } });
  const page = await ctx.newPage();
  await page.goto(ORIGIN + "/sign-in", { waitUntil: "load" });
  await page.evaluate(() => localStorage.clear());
  const res = await page.goto(ORIGIN + "/no-such-ledger-route", { waitUntil: "load" });
  await page.waitForTimeout(300);
  notes[width] = { http: res.status(), h1: await page.locator("h1").innerText(), body: (await page.locator("main").innerText()).replace(/\s+/g, " ").slice(0, 240) };
  await page.screenshot({ path: `${OUT}/${prefix}-32-404-clean.png`, fullPage: true });
  const res2 = await page.goto(ORIGIN + "/404", { waitUntil: "load" });
  await page.waitForTimeout(250);
  notes[width].route404 = { http: res2.status(), h1: await page.locator("h1").innerText() };
  await page.screenshot({ path: `${OUT}/${prefix}-32b-404-route.png`, fullPage: true });

  // due date edge with otherwise valid invoice
  await page.goto(ORIGIN + "/invoices/new", { waitUntil: "load" });
  await page.waitForTimeout(200);
  await page.locator("#invoice-issued").fill("2026-10-19");
  await page.locator("#invoice-due").fill("2026-10-01");
  await page.locator("#line-description-0").fill("Wool throws");
  await page.locator("#line-qty-0").fill("2");
  await page.locator("#line-price-0").fill("40");
  await page.locator("button[value=preview]").click();
  await page.waitForTimeout(250);
  notes[width].dueError = await page.locator("#invoice-form .form-message").innerText();
  notes[width].stillOnEditor = page.url();
  await page.screenshot({ path: `${OUT}/${prefix}-10b-due-date-invalid.png`, fullPage: true });

  // contrast sample
  await page.goto(ORIGIN + "/dashboard", { waitUntil: "load" });
  await page.waitForTimeout(200);
  notes[width].contrast = await page.evaluate(() => {
    function lum(rgb) {
      const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (!m) return null;
      const alpha = m[4] == null ? 1 : Number(m[4]);
      const ch = [m[1], m[2], m[3]].map((n) => {
        const c = Number(n) / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      });
      return { y: 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2], alpha };
    }
    const out = [];
    for (const el of document.querySelectorAll("h1,h2,h3,p,span,a,button,td,th,label,strong,li")) {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2 || s.visibility === "hidden" || s.display === "none") continue;
      const size = parseFloat(s.fontSize);
      if (size < 16) continue;
      const text = (el.innerText || "").trim();
      if (!text || text.length > 80) continue;
      if (el.querySelector("h1,h2,p,span,strong") && el.children.length) continue;
      out.push({ text: text.slice(0, 40), size, color: s.color, bg: s.backgroundColor, weight: s.fontWeight });
    }
    return out.slice(0, 40);
  });
  notes[width].contrastRatios = notes[width].contrast.map((c) => ({ ...c, ratio: ratio(c.color, c.bg) })).filter((c) => c.ratio && c.ratio < 4.5);

  await ctx.close();
}

// keyboard-only expense journey at 375
{
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await ctx.newPage();
  await page.goto(ORIGIN + "/sign-in", { waitUntil: "load" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(200);
  // Tab to display name, type, tab to submit, enter
  const steps = [];
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press("Tab");
    const name = await page.evaluate(() => {
      const e = document.activeElement;
      return e ? (e.id || e.innerText || e.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 40) : "";
    });
    if (name === "display-name" || (await page.evaluate(() => document.activeElement?.id === "display-name"))) {
      steps.push("focused display-name after " + (i + 1) + " tabs");
      await page.keyboard.press("Control+A");
      await page.keyboard.type("Keyboard Owner");
      break;
    }
  }
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    const tag = await page.evaluate(() => document.activeElement?.tagName + " " + (document.activeElement?.innerText || "").slice(0, 30));
    if (/Continue to demo/i.test(tag)) {
      steps.push("focused submit");
      await page.keyboard.press("Enter");
      break;
    }
  }
  await page.waitForTimeout(400);
  steps.push("url " + page.url());
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press("Tab");
    const name = await page.evaluate(() => (document.activeElement?.innerText || document.activeElement?.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim());
    if (/Add expense/i.test(name)) {
      steps.push("focused add expense");
      await page.keyboard.press("Enter");
      break;
    }
  }
  await page.waitForTimeout(400);
  steps.push("url " + page.url());
  for (let i = 0; i < 25; i++) {
    await page.keyboard.press("Tab");
    const id = await page.evaluate(() => document.activeElement?.id || "");
    if (id === "merchant") { await page.keyboard.type("Key Merchant"); steps.push("typed merchant"); break; }
  }
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    const id = await page.evaluate(() => document.activeElement?.id || "");
    if (id === "amount") { await page.keyboard.type("15.25"); steps.push("typed amount"); break; }
  }
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press("Tab");
    const label = await page.evaluate(() => (document.activeElement?.innerText || "").replace(/\s+/g, " ").trim());
    if (/Save expense/i.test(label)) { await page.keyboard.press("Enter"); steps.push("saved via enter"); break; }
  }
  await page.waitForTimeout(500);
  steps.push("url " + page.url());
  steps.push((await page.locator("main").innerText()).replace(/\s+/g, " ").slice(0, 180));
  notes.keyboardOnly = steps;
  await page.screenshot({ path: `${OUT}/m-35-keyboard-saved.png`, fullPage: true });
  await ctx.close();
}

// reduced motion
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(ORIGIN + "/dashboard", { waitUntil: "load" });
  notes.reducedMotion = await page.evaluate(() => {
    const btn = document.querySelector(".button");
    const s = getComputedStyle(btn);
    return { transition: s.transitionDuration, animation: s.animationName, transform: s.transform };
  });
  await ctx.close();
}
await browser.close();
writeFileSync("/home/user/workspace/bench/judge/05-saas-dashboard/logs/followup.json", JSON.stringify(notes, null, 2));
console.log("wrote followup");
