// Reduced-motion first render (v2.4.0, C2): useReducedMotion must be right on the very first render, so a
// reduced-motion user never sees one animated frame before an effect corrects it.
//   NODE_PATH=<dir with esbuild react react-dom playwright>/node_modules node tests/components/reduced-motion.test.mjs [--video dir]
import { bundle, chromium, runner, assert } from "./harness.mjs";
const html = await bundle("reduced-motion.fixture.tsx");
const video = process.argv.includes("--video") ? process.argv[process.argv.indexOf("--video") + 1] : null;
const browser = await chromium.launch();
async function open(reducedMotion) {
  const ctx = await browser.newContext({ viewport: { width: 600, height: 300 }, reducedMotion, ...(video ? { recordVideo: { dir: `${video}/${reducedMotion}`, size: { width: 600, height: 300 } } } : {}) });
  const p = await ctx.newPage(); const errors = []; p.on("pageerror", (e) => errors.push(String(e)));
  await p.setContent(html); await p.waitForTimeout(1500);
  const r = { renders: await p.evaluate(() => window.__renders), shown: await p.evaluate(() => window.__shown), blur: await p.evaluate(() => window.__blur), painted: await p.evaluate(() => window.__painted), errors };
  await ctx.close(); return r;
}
const t = runner("reduced-motion first render");
await t.test("reduce: the first render already knows (useReducedMotion() === true on render 1)", async () => {
  const r = await open("reduce"); assert(r.renders.length > 0, "no renders"); assert(r.renders[0] === true, `renders: ${JSON.stringify(r.renders)}`);
  assert(r.renders.every((x) => x === true), `a render saw false: ${JSON.stringify(r.renders)}`);
});
await t.test("reduce: Decode never shows anything but the final text", async () => {
  const r = await open("reduce"); const bad = r.shown.filter((s) => s && s !== "SIGNAL FOUND");
  assert(bad.length === 0, `animated frames: ${JSON.stringify(bad.slice(0, 4))} (of ${r.shown.length} texts)`);
});
// The computed filter and opacity are read (not the inline style): since v2.5.0 settled BlurFocus text carries no
// filter at all (a lingering blur(0) re-rasterised it), so "none 1" and "blur(0px) 1" are both the unblurred, opaque state.
await t.test("reduce: BlurFocus is never committed blurred or faded (no animated first frame)", async () => {
  const r = await open("reduce"); const bad = r.blur.filter((v) => !/^(none|blur\(0(px)?\)) 1$/.test(v));
  assert(r.blur.length > 0 && bad.length === 0, `styles committed: ${JSON.stringify(r.blur)}`);
});
await t.test("reduce: no painted frame shows BlurFocus blurred (sampled every animation frame)", async () => {
  const r = await open("reduce"); const bad = r.painted.filter((v) => v !== "(not mounted)" && !/^(none|blur\(0(px)?\)) 1$/.test(v));
  if (process.env.SHOW) console.log("painted frames:", JSON.stringify(r.painted.slice(0, 8)));
  assert(bad.length === 0, `${bad.length} painted frame(s) blurred: ${JSON.stringify(r.painted.slice(0, 6))}`);
});
await t.test("no-preference: motion still runs (Decode cycles glyphs)", async () => {
  const r = await open("no-preference"); assert(r.renders[0] === false, `renders: ${JSON.stringify(r.renders)}`);
  assert(r.shown.some((s) => s && s !== "SIGNAL FOUND"), `no glyph cycling seen: ${JSON.stringify(r.shown)}`);
});
await browser.close(); t.done();
