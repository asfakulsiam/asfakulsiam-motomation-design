import pkg from "/home/user/node_modules/playwright/index.js";
import { writeFileSync, mkdirSync } from "node:fs";
const { chromium } = pkg;

const ORIGIN = process.env.ORIGIN || "http://127.0.0.1:4410";
const OUT = "/home/user/workspace/bench/judge/05-saas-dashboard/screens";
mkdirSync(OUT, { recursive: true });
const findings = { origin: ORIGIN, started: new Date().toISOString(), widths: {}, defects: [], notes: [] };

function shot(page, name) {
  return page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
}
async function viewportShot(page, name) {
  await page.screenshot({ path: `${OUT}/${name}-viewport.png`, fullPage: false });
}

async function textOf(page, sel) {
  const el = page.locator(sel).first();
  if (!(await el.count())) return null;
  return (await el.innerText()).replace(/\s+/g, " ").trim();
}

async function clearStorage(page) {
  await page.goto(ORIGIN + "/sign-in", { waitUntil: "load" });
  await page.evaluate(() => localStorage.clear());
}

async function runWidth(width) {
  const tag = String(width);
  const browser = await chromium.launch({ args: ["--disable-dev-shm-usage"] });
  const ctx = await browser.newContext({ viewport: { width, height: width === 375 ? 812 : 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  const log = { width, journeys: {}, states: {}, layout: {}, errors };
  const prefix = width === 1440 ? "d" : "m";

  // J1 sign-in invalid then success, expense invalid then save, dashboard updated
  await clearStorage(page);
  await page.goto(ORIGIN + "/sign-in", { waitUntil: "load" });
  await page.waitForTimeout(250);
  await shot(page, `${prefix}-01-signin`);
  await viewportShot(page, `${prefix}-01-signin`);
  const signinH1 = await textOf(page, "h1");
  const heroLike = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    if (!h1) return null;
    const s = getComputedStyle(h1);
    const r = h1.getBoundingClientRect();
    return { text: h1.textContent, font: s.fontFamily, size: s.fontSize, top: Math.round(r.top), height: Math.round(r.height) };
  });
  log.layout.signinH1 = signinH1;
  log.layout.signinHeroProbe = heroLike;
  await page.locator("#display-name").fill("");
  await page.locator("#signin-form button[type=submit]").click();
  await page.waitForTimeout(200);
  const signinErr = await textOf(page, "#signin-form .form-message");
  log.journeys.signinInvalid = signinErr;
  await shot(page, `${prefix}-02-signin-invalid`);
  await page.locator("#display-name").fill("Jordan Hale");
  await page.locator("#signin-form button[type=submit]").click();
  await page.waitForURL("**/dashboard", { timeout: 8000 });
  await page.waitForTimeout(300);
  const expBefore = await page.locator(".metrics .metric").nth(1).innerText();
  log.journeys.expenseBefore = expBefore.replace(/\s+/g, " ");
  await shot(page, `${prefix}-03-dashboard`);
  await viewportShot(page, `${prefix}-03-dashboard`);
  const addBtn = page.getByRole("link", { name: "Add expense" }).first();
  const addBox = await addBtn.boundingBox();
  log.layout.addExpenseBox = addBtn ? addBox : null;
  const navBox = await page.locator("nav[aria-label='Main navigation']").boundingBox();
  log.layout.navBox = navBox;
  await addBtn.click();
  await page.waitForURL("**/expenses/new");
  await page.waitForTimeout(200);
  await shot(page, `${prefix}-04-expense-form`);
  await page.locator("#expense-form button[type=submit]").click();
  await page.waitForTimeout(200);
  log.journeys.expenseInvalid = await textOf(page, "#expense-form .form-message");
  const invalidCount = await page.locator("#expense-form [aria-invalid=true]").count();
  log.journeys.expenseInvalidFields = invalidCount;
  await shot(page, `${prefix}-05-expense-invalid`);
  await page.locator("#merchant").fill("Harbor Paper");
  await page.locator("#amount").fill("42.75");
  await page.locator("#expense-date").fill("2026-10-19");
  await page.locator("#expense-category").selectOption("Supplies");
  await page.locator("#expense-form button[type=submit]").click();
  await page.waitForURL("**/expenses/saved", { timeout: 8000 });
  await page.waitForTimeout(250);
  log.journeys.savedText = await textOf(page, "main");
  await shot(page, `${prefix}-06-expense-saved`);
  await page.getByRole("link", { name: "Back to overview" }).click();
  await page.waitForURL("**/dashboard");
  await page.waitForTimeout(300);
  const expAfter = await page.locator(".metrics .metric").nth(1).innerText();
  log.journeys.expenseAfter = expAfter.replace(/\s+/g, " ");
  const recentHas = await page.locator("text=Harbor Paper").count();
  log.journeys.recentHasHarbor = recentHas;
  await shot(page, `${prefix}-07-dashboard-updated`);
  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(300);
  log.journeys.expenseAfterReload = (await page.locator(".metrics .metric").nth(1).innerText()).replace(/\s+/g, " ");
  log.journeys.j1ok = log.journeys.expenseAfter.includes("42.75") || log.journeys.expenseAfter !== log.journeys.expenseBefore;

  // J2 invoices
  await page.goto(ORIGIN + "/invoices", { waitUntil: "load" });
  await page.waitForTimeout(250);
  await shot(page, `${prefix}-08-invoices`);
  await page.getByRole("link", { name: "New invoice" }).first().click();
  await page.waitForURL("**/invoices/new");
  await page.waitForTimeout(200);
  await shot(page, `${prefix}-09-invoice-editor`);
  await page.locator("#invoice-due").fill("2026-10-01");
  await page.locator("#invoice-issued").fill("2026-10-19");
  await page.locator("button[value=preview]").click();
  await page.waitForTimeout(250);
  log.journeys.invoiceDateError = await textOf(page, "#invoice-form .form-message");
  await shot(page, `${prefix}-10-invoice-invalid`);
  await page.locator("#invoice-due").fill("2026-11-02");
  await page.locator("#line-description-0").fill("Linen market bags");
  await page.locator("#line-qty-0").fill("3");
  await page.locator("#line-price-0").fill("18.50");
  await page.locator("#invoice-tax").fill("8");
  await page.waitForTimeout(150);
  log.journeys.invoiceCalc = await textOf(page, ".invoice-calculation");
  await page.locator("button[value=preview]").click();
  await page.waitForURL("**/invoices/preview", { timeout: 8000 });
  await page.waitForTimeout(250);
  log.journeys.previewText = (await textOf(page, "#invoice-paper")).slice(0, 400);
  const mark = page.getByRole("button", { name: /Mark sent/i });
  log.journeys.markVisible = await mark.count();
  await shot(page, `${prefix}-11-invoice-preview`);
  await mark.click();
  await page.waitForURL("**/invoices/sent", { timeout: 8000 });
  await page.waitForTimeout(250);
  log.journeys.sentText = await textOf(page, "main h1, main h2, main p");
  const sentMain = await page.locator("main").innerText();
  log.journeys.sentMain = sentMain.replace(/\s+/g, " ").slice(0, 400);
  await shot(page, `${prefix}-12-invoice-sent`);
  await page.goto(ORIGIN + "/invoices", { waitUntil: "load" });
  await page.waitForTimeout(200);
  log.journeys.invoiceListHas = (await page.locator("text=INV-1045").count()) + (await page.locator("text=Linen market bags").count());
  await page.getByRole("button", { name: "Awaiting payment" }).click();
  await page.waitForTimeout(200);
  log.journeys.awaitingHasNew = await page.locator("text=INV-1045").count();
  await shot(page, `${prefix}-13-invoices-awaiting`);

  // J3 filter date + category then detail
  await page.goto(ORIGIN + "/transactions", { waitUntil: "load" });
  await page.waitForTimeout(250);
  await shot(page, `${prefix}-14-transactions`);
  const countAll = await textOf(page, ".result-count");
  await page.locator("#category-filter").selectOption("Inventory");
  await page.locator("#date-from").fill("2026-10-14");
  await page.locator("#date-to").fill("2026-10-19");
  await page.waitForTimeout(250);
  log.journeys.filterCount = await textOf(page, ".result-count");
  log.journeys.filterNames = await page.locator(".record-link").allInnerTexts();
  await shot(page, `${prefix}-15-transactions-filtered`);
  const firstLink = page.locator(".record-link").first();
  const firstName = (await firstLink.innerText()).trim();
  await firstLink.click();
  await page.waitForURL("**/transactions/detail");
  await page.waitForTimeout(250);
  log.journeys.detailHeading = await textOf(page, ".detail-title h2");
  log.journeys.detailCategory = await textOf(page, ".detail-grid");
  log.journeys.detailMatchesFilter = log.journeys.detailHeading === firstName;
  await shot(page, `${prefix}-16-transaction-detail`);
  await page.goBack();
  await page.waitForTimeout(300);
  log.journeys.filterSurvivesBack = await textOf(page, ".result-count");
  await shot(page, `${prefix}-17-transactions-back`);

  // sort + pagination
  await page.locator("button[data-action=clear]").first().click();
  await page.waitForTimeout(200);
  await page.locator("#transaction-sort").selectOption("amount:1");
  await page.waitForTimeout(200);
  log.journeys.sortFirst = await textOf(page, ".record-link");
  log.journeys.page1 = await textOf(page, ".pagination");
  const next = page.getByRole("button", { name: "Next" });
  if (await next.isEnabled()) {
    await next.click();
    await page.waitForTimeout(200);
    log.journeys.page2 = await textOf(page, ".pagination");
    log.journeys.page2First = await textOf(page, ".record-link");
  }
  await shot(page, `${prefix}-18-transactions-page2`);

  // invalid date range
  await page.locator("#date-from").fill("2026-10-19");
  await page.locator("#date-to").fill("2026-10-01");
  await page.waitForTimeout(200);
  log.states.invalidRange = await textOf(page, "#filter-message");
  await shot(page, `${prefix}-19-invalid-range`);

  // customers + settings
  await page.goto(ORIGIN + "/customers", { waitUntil: "load" });
  await page.waitForTimeout(200);
  await shot(page, `${prefix}-20-customers`);
  await page.goto(ORIGIN + "/settings", { waitUntil: "load" });
  await page.waitForTimeout(200);
  log.states.settingsHeadings = await page.locator("h2").allInnerTexts();
  const bankDisabled = await page.locator("#bank button").isDisabled();
  log.states.bankDisabled = bankDisabled;
  log.states.bankText = await textOf(page, "#bank");
  await shot(page, `${prefix}-21-settings`);
  await page.locator("#profile-name").fill("");
  await page.locator("#profile-form button[type=submit]").click();
  await page.waitForTimeout(200);
  log.states.profileInvalid = await textOf(page, "#profile-form .form-message");
  await shot(page, `${prefix}-22-settings-invalid`);

  // empty account
  await page.goto(ORIGIN + "/empty", { waitUntil: "load" });
  await page.waitForTimeout(200);
  await shot(page, `${prefix}-23-empty-guide`);
  await page.getByRole("button", { name: "Start empty workspace" }).click();
  await page.waitForTimeout(200);
  log.states.emptyDialog = await textOf(page, "dialog");
  await shot(page, `${prefix}-24-empty-confirm`);
  await page.locator("#confirm-action").click();
  await page.waitForURL("**/dashboard");
  await page.waitForTimeout(300);
  log.states.emptyDash = (await page.locator("main").innerText()).replace(/\s+/g, " ").slice(0, 500);
  await shot(page, `${prefix}-25-empty-dashboard`);
  await page.goto(ORIGIN + "/transactions", { waitUntil: "load" });
  await page.waitForTimeout(200);
  log.states.emptyTx = await textOf(page, "main");
  await shot(page, `${prefix}-26-empty-transactions`);
  await page.goto(ORIGIN + "/invoices", { waitUntil: "load" });
  await page.waitForTimeout(200);
  await shot(page, `${prefix}-27-empty-invoices`);
  await page.goto(ORIGIN + "/invoices/new", { waitUntil: "load" });
  await page.waitForTimeout(200);
  log.states.emptyInvoiceCustomers = await page.locator("#invoice-customer option").allInnerTexts();
  await page.locator("#line-description-0").fill("Test item");
  await page.locator("#line-price-0").fill("10");
  await page.locator("button[value=draft]").click();
  await page.waitForTimeout(250);
  log.states.emptyInvoiceError = await textOf(page, "#invoice-form .form-message");
  await shot(page, `${prefix}-28-empty-invoice-invalid`);

  // error + offline routes
  await page.goto(ORIGIN + "/error", { waitUntil: "load" });
  await page.waitForTimeout(200);
  log.states.errorRoute = await textOf(page, "main h1, main h2");
  await shot(page, `${prefix}-29-error`);
  await page.goto(ORIGIN + "/offline", { waitUntil: "load" });
  await page.waitForTimeout(200);
  log.states.offlineRoute = await textOf(page, "main");
  await shot(page, `${prefix}-30-offline`);

  // corrupt storage recovery
  await page.evaluate(() => localStorage.setItem("ledgerly.workspace.v1", "{not-json"));
  await page.goto(ORIGIN + "/dashboard", { waitUntil: "load" });
  await page.waitForTimeout(300);
  log.states.corruptDash = (await page.locator("main").innerText()).replace(/\s+/g, " ").slice(0, 350);
  await shot(page, `${prefix}-31-corrupt-storage`);

  // 404
  const res404 = await page.goto(ORIGIN + "/missing-ledger-page", { waitUntil: "load" });
  log.states.http404 = res404.status();
  log.states.notfoundText = await textOf(page, "main");
  await shot(page, `${prefix}-32-404`);
  const res404route = await page.goto(ORIGIN + "/404", { waitUntil: "load" });
  log.states.http404route = res404route.status();
  log.states.route404text = await textOf(page, "h1");

  // offline already-open save: load the form first, then drop the network
  try {
    await page.evaluate(() => localStorage.removeItem("ledgerly.workspace.v1"));
    await page.goto(ORIGIN + "/expenses/new", { waitUntil: "load" });
    await page.waitForTimeout(200);
    await ctx.setOffline(true);
    await page.waitForTimeout(300);
    log.states.offlineBannerHidden = await page.locator("#offline-banner").getAttribute("hidden");
    log.states.offlineBannerText = await textOf(page, "#offline-banner");
    await page.locator("#merchant").fill("Offline kiosk");
    await page.locator("#amount").fill("9.50");
    await page.locator("#expense-form button[type=submit]").click();
    await page.waitForTimeout(500);
    log.states.offlineSavedUrl = page.url();
    log.states.offlineSaved = await textOf(page, "main");
    await shot(page, `${prefix}-33-offline-saved`);
    await page.getByRole("link", { name: "Back to overview" }).click();
    await page.waitForTimeout(400);
    log.states.offlineDashUrl = page.url();
    log.states.offlineDashHas = await page.locator("text=Offline kiosk").count();
    await shot(page, `${prefix}-34-offline-dashboard`);
  } catch (e) {
    log.states.offlineError = String(e).slice(0, 300);
  } finally {
    await ctx.setOffline(false).catch(() => {});
  }

  // overflow probe
  log.layout.overflow = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    iw: document.documentElement.clientWidth,
  }));
  // bias probes on dashboard
  await page.goto(ORIGIN + "/dashboard", { waitUntil: "load" });
  await page.waitForTimeout(200);
  log.layout.bias = await page.evaluate(() => {
    const html = document.documentElement.outerHTML;
    const anim = [...document.querySelectorAll("*")].filter((el) => {
      const s = getComputedStyle(el);
      return (s.animationName && s.animationName !== "none") || (s.scrollTimeline && s.scrollTimeline !== "none");
    }).length;
    const h1 = document.querySelector("h1");
    const hs = h1 ? getComputedStyle(h1) : null;
    return {
      h1: h1?.textContent || null,
      h1Size: hs?.fontSize || null,
      h1Family: hs?.fontFamily || null,
      runningAnimations: anim,
      hasHeroClass: !!document.querySelector(".hero, [data-hero], .editorial"),
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    };
  });

  // horizontal overflow at this width on key pages
  const overflowPages = {};
  for (const route of ["/dashboard", "/transactions", "/invoices", "/invoices/new", "/settings", "/customers"]) {
    await page.goto(ORIGIN + route, { waitUntil: "load" });
    await page.waitForTimeout(150);
    overflowPages[route] = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      overflowing: [...document.querySelectorAll("body *")].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.right > document.documentElement.clientWidth + 2 && getComputedStyle(el).position !== "fixed";
      }).slice(0, 8).map((el) => el.tagName + "." + el.className.toString().slice(0, 40)),
    }));
  }
  log.layout.overflowPages = overflowPages;
  log.errors = errors;
  await browser.close();
  return log;
}

const widths = [1440, 375];
for (const w of widths) {
  findings.widths[w] = await runWidth(w);
  writeFileSync("/home/user/workspace/bench/judge/05-saas-dashboard/logs/walk-partial.json", JSON.stringify(findings, null, 2));
}
findings.ended = new Date().toISOString();
writeFileSync("/home/user/workspace/bench/judge/05-saas-dashboard/logs/walk.json", JSON.stringify(findings, null, 2));
console.log(JSON.stringify({ ok: true, keys: Object.keys(findings.widths) }, null, 2));
