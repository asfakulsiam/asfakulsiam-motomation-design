// Interaction tests for examples/components/micro/hold-to-commit.tsx
//   NODE_PATH=<dir with esbuild react react-dom playwright>/node_modules node tests/components/hold-to-commit.test.mjs
import { bundle, chromium, runner, assert } from "./harness.mjs";
const html = await bundle("hold-to-commit.fixture.tsx");
const browser = await chromium.launch();
const errors = [];
async function fresh(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 600, height: 400 }, ...opts });
  const p = await ctx.newPage();
  p.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errors.push(m.text()); });
  p.on("pageerror", (e) => errors.push(String(e)));
  await p.setContent(html); await p.waitForTimeout(150); return p;
}
const btn = (p) => p.getByRole("button");
const commits = (p) => p.evaluate(() => window.__commits);
const fillScale = (p) => p.evaluate(() => { const t = document.querySelector("button span[aria-hidden]").style.transform; return Number((t.match(/scaleX\(([\d.e-]+)\)/) || [0, 0])[1]); });
const live = (p) => p.evaluate(() => document.querySelector("button [aria-live]").textContent);
async function pointerDown(p) { const b = await btn(p).boundingBox(); await p.mouse.move(b.x + 20, b.y + b.height / 2); await p.mouse.down(); }
const t = runner("hold-to-commit interaction tests");

await t.test("pointer: hold 1.6 s commits once and announces", async () => {
  const p = await fresh(); await pointerDown(p); await p.waitForTimeout(1600); await p.mouse.up(); await p.waitForTimeout(200);
  assert(await commits(p) === 1, `commits=${await commits(p)}`); assert(await live(p) === "Deleted", `live="${await live(p)}"`);
  assert(await btn(p).isDisabled(), "button should be disabled after commit");
});
await t.test("pointer: release at 600 ms cancels and the fill drains to 0", async () => {
  const p = await fresh(); await pointerDown(p); await p.waitForTimeout(600); const mid = await fillScale(p); await p.mouse.up(); await p.waitForTimeout(800);
  assert(mid > 0.2, `fill mid-hold ${mid}`); assert(await commits(p) === 0, "should not commit"); assert(await fillScale(p) === 0, `fill after drain ${await fillScale(p)}`);
  assert(await live(p) === "", "nothing announced");
});
await t.test("pointer: leaving the button mid-hold cancels", async () => {
  const p = await fresh(); await pointerDown(p); await p.waitForTimeout(500); await p.mouse.move(590, 390); await p.waitForTimeout(1500); await p.mouse.up();
  assert(await commits(p) === 0, "should not commit after pointerleave");
});
await t.test("keyboard: Space held 1.6 s commits", async () => {
  const p = await fresh(); await btn(p).focus(); await p.keyboard.down("Space"); await p.waitForTimeout(1600); await p.keyboard.up("Space"); await p.waitForTimeout(200);
  assert(await commits(p) === 1, `commits=${await commits(p)}`);
});
await t.test("keyboard: Enter held 1.6 s commits", async () => {
  const p = await fresh(); await btn(p).focus(); await p.keyboard.down("Enter"); await p.waitForTimeout(1600); await p.keyboard.up("Enter"); await p.waitForTimeout(200);
  assert(await commits(p) === 1, `commits=${await commits(p)}`);
});
await t.test("keyboard: Space released at 500 ms cancels (and the keyup does not count as a click)", async () => {
  const p = await fresh(); await btn(p).focus(); await p.keyboard.down("Space"); await p.waitForTimeout(500); await p.keyboard.up("Space"); await p.waitForTimeout(800);
  assert(await commits(p) === 0, "should not commit"); assert(await live(p) === "", `nothing armed, live="${await live(p)}"`);
});
await t.test("screen reader: a synthesized click (no pointer, no key hold) arms, a second one commits", async () => {
  const p = await fresh();
  await btn(p).evaluate((b) => b.click()); await p.waitForTimeout(100);
  assert(await commits(p) === 0, "first click must not commit"); assert(await live(p) === "Press again to confirm", `armed announcement "${await live(p)}"`);
  assert(/Press again to confirm/.test(await btn(p).innerText()), "visible label changes");
  await p.waitForTimeout(500); await btn(p).evaluate((b) => b.click()); await p.waitForTimeout(100);
  assert(await commits(p) === 1, `commits=${await commits(p)}`); assert(await live(p) === "Deleted", "completion announced");
});
await t.test("screen reader: accessibility-tree activation via Playwright role query works the same", async () => {
  const p = await fresh(); const b = p.getByRole("button", { name: /hold to delete/i });
  await b.dispatchEvent("click", { detail: 0 }); await p.waitForTimeout(500);
  await p.getByRole("button", { name: /press again to confirm/i }).dispatchEvent("click", { detail: 0 }); await p.waitForTimeout(100);
  assert(await commits(p) === 1, `commits=${await commits(p)}`);
});
await t.test("screen reader: an armed confirmation expires after 6 s", async () => {
  const p = await fresh(); await btn(p).evaluate((b) => b.click()); await p.waitForTimeout(6300);
  assert(await live(p) === "", "disarmed"); await btn(p).evaluate((b) => b.click()); await p.waitForTimeout(100);
  assert(await commits(p) === 0, "a click after expiry only re-arms");
});
await t.test("cancel: a fast double-click never commits", async () => {
  const p = await fresh(); await btn(p).dblclick(); await p.waitForTimeout(300);
  assert(await commits(p) === 0, `commits=${await commits(p)}`);
});
await t.test("navigate away during hold: unmount at 500 ms, no commit, no pending frames, no errors", async () => {
  const before = errors.length;
  const p = await fresh(); await pointerDown(p); await p.waitForTimeout(500);
  assert(await p.evaluate(() => window.__pendingRaf()) > 0, "a frame is pending mid-hold");
  await p.evaluate(() => window.__unmount()); await p.waitForTimeout(100);
  assert(await p.evaluate(() => window.__pendingRaf()) === 0, `pending frames after unmount: ${await p.evaluate(() => window.__pendingRaf())}`);
  await p.waitForTimeout(1500); await p.mouse.up();
  assert(await commits(p) === 0, "must not commit after unmount");
  assert(errors.length === before, `console errors: ${errors.slice(before).join(" | ")}`);
});
await t.test("navigate away during hold: window blur (tab switch) stops the hold", async () => {
  const p = await fresh(); await pointerDown(p); await p.waitForTimeout(400);
  await p.evaluate(() => window.dispatchEvent(new Event("blur"))); await p.waitForTimeout(1500);
  assert(await commits(p) === 0, "should not commit after blur"); assert(await fillScale(p) === 0, "fill drained");
  await p.mouse.up();
});
await t.test("reduced motion: hold still commits; drain is linear over holdMs", async () => {
  const p = await fresh({ reducedMotion: "reduce" }); await pointerDown(p); await p.waitForTimeout(600); await p.mouse.up();
  await p.waitForTimeout(300); const a = await fillScale(p); assert(a > 0.05, `still draining slowly at 300 ms: ${a}`);
  await pointerDown(p); await p.waitForTimeout(1600); await p.mouse.up(); await p.waitForTimeout(100);
  assert(await commits(p) === 1, `commits=${await commits(p)}`);
});
await browser.close();
t.done();
