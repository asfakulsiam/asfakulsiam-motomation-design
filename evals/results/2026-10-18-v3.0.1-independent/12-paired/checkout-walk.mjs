// Hand walk of the checkout journey (what the journey check reports as "walk it by hand"): a fresh browser at 375px adds
// a tea, opens checkout, submits empty, fills the form, submits, and lands on the receipt. Screenshots at each step.
import { createServer } from "node:http"; import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs"; import { resolve, extname } from "node:path";
import { chromium } from "playwright";
const [dir, out, port] = process.argv.slice(2); mkdirSync(out, { recursive: true });
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".json": "application/json", ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg" };
const srv = createServer((q, r) => { let p = decodeURIComponent(new URL(q.url, "http://x").pathname); let f = resolve(dir, "." + p); if (existsSync(f) && statSync(f).isDirectory()) f = resolve(f, "index.html"); if (!existsSync(f) && !extname(f)) f += ".html"; let s = 200; if (!existsSync(f)) { f = resolve(dir, "404.html"); s = 404; } r.writeHead(s, { "Content-Type": mime[extname(f)] || "application/octet-stream" }); r.end(readFileSync(f)); }).listen(+port);
const base = `http://127.0.0.1:${port}`; const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }); const page = await ctx.newPage();
const errs = []; page.on("pageerror", (e) => errs.push(String(e).split("\n")[0])); const log = []; const step = (ok, m) => { log.push(`${ok ? "ok  " : "FAIL"} ${m}`); };
const shot = (n) => page.screenshot({ path: `${out}/${n}.png`, fullPage: false });
await page.goto(base + "/checkout"); await page.waitForTimeout(400);
const emptyText = (await page.locator("[data-empty]:visible").first().innerText().catch(() => "")).replace(/\s+/g, " ").trim();
step(!(await page.locator("form[data-checkout]").isVisible()) && emptyText.length > 0, `fresh browser: /checkout hides the form and shows the designed empty state "${emptyText.slice(0, 60)}"`); await shot("1-checkout-empty-cart");
await page.goto(base + "/tea/sylhet-black"); await page.waitForTimeout(300); await page.locator("[data-add]").first().tap(); await page.waitForTimeout(500);
const count = await page.locator("[data-cart-count], [data-count]").first().innerText().catch(() => "?"); step(/1/.test(count), `add to cart on /tea/sylhet-black: cart count reads "${count.trim()}"`); await shot("2-added");
await page.goto(base + "/checkout"); await page.waitForTimeout(400); const form = page.locator("form[data-checkout]");
step(await form.isVisible(), "with a tea in the cart: checkout form visible");
await form.locator("button[type=submit]").tap(); await page.waitForTimeout(500);
const msg = (await form.locator("[data-form-message]").innerText().catch(() => "")).trim(); const inv = await form.locator("[aria-invalid=true]").count();
step(msg.length > 0 && inv > 0, `empty submit: designed error "${msg.slice(0, 80)}", ${inv} field(s) marked invalid`); await shot("3-validation");
await form.locator("#name").fill("Nadia Rahman"); await form.locator("#email").fill("nadia@example.com"); await form.locator("#address").fill("221 Maple Street"); await form.locator("#city").fill("Portland"); await form.locator("#postal").fill("97205"); await form.locator("input[name=consent]").check();
const btn = form.locator("button[type=submit]"); const before = (await btn.innerText()).trim();
// record the button from the moment of the tap (the pending state may last only ~100 ms before the next page)
await page.evaluate(() => { const b = document.querySelector("form[data-checkout] button[type=submit]"); window.__seen = []; const t0 = performance.now(); new MutationObserver(() => { window.__seen.push({ t: Math.round(performance.now() - t0), text: b.textContent.trim(), busy: b.getAttribute("aria-busy") }); sessionStorage.setItem("__seen", JSON.stringify(window.__seen)); }).observe(b, { attributes: true, childList: true, characterData: true, subtree: true }); });
await btn.tap(); await page.waitForTimeout(40); await shot("4-pending");
await page.waitForURL("**/confirmation", { timeout: 8000 }).catch(() => {}); await page.waitForTimeout(400);
const seen = JSON.parse(await page.evaluate(() => sessionStorage.getItem("__seen") || "[]").catch(() => "[]")); const pend = seen.find((x) => x.text !== before || x.busy === "true"); const during = pend ? pend.text : before, busy = pend?.busy;
step(during !== before || busy === "true", `valid submit: pending state "${during}"${busy ? ` aria-busy=${busy}` : ""}, shown for ${seen.length > 1 ? seen[seen.length - 1].t - (pend?.t || 0) : "?"} ms before the next page`);
const conf = await page.locator("main").innerText().catch(() => ""); step(/confirmation$/.test(new URL(page.url()).pathname) && /LL-[A-Z0-9]+/.test(conf), `lands on ${new URL(page.url()).pathname} with a demo receipt reference (${(conf.match(/LL-[A-Z0-9]+/) || ["none"])[0]})`); await shot("5-confirmation");
await page.goto(base + "/cart"); await page.waitForTimeout(300); step(await page.locator("[data-empty]:visible").count() > 0, "after the order: the cart shows its empty state again");
await page.reload(); await page.goto(base + "/confirmation"); await page.waitForTimeout(300); step(/LL-[A-Z0-9]+/.test(await page.locator("main").innerText()), "receipt survives a reload");
step(errs.length === 0, `no uncaught errors${errs.length ? ": " + errs.join("; ") : ""}`);
console.log(log.join("\n")); const bad = log.filter((l) => l.startsWith("FAIL")).length; console.log(bad ? `\n${bad} step(s) failed` : "\nall steps pass");
await b.close(); srv.close(); process.exit(bad ? 1 : 0);
