#!/usr/bin/env node
// Server rendering and hydration (P2 T8), for every component in data/components.csv (its gallery demo):
//   1. renderToString in Node does not throw (no window/document during render or at import)
//   2. hydrateRoot over that markup in Chromium logs no hydration warning, no recoverable error (onRecoverableError),
//      no console error and no page error, with reduced motion and without, and the demo is still there afterwards
// React's development build is used on both sides: it is the one that reports mismatches.
//
//   NODE_PATH=<dir with esbuild react react-dom playwright>/node_modules node tests/components/ssr.test.mjs [--out dir] [--only id,id]
import { createRequire } from "node:module";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "../..");
const resolve = (m) => { for (const b of [process.cwd(), ...(process.env.NODE_PATH || "").split(":").filter(Boolean)]) { try { return createRequire(join(b, "noop.js"))(m); } catch {} } console.error(`ssr.test: cannot find ${m}; install it and set NODE_PATH (see the header of this file)`); process.exit(2); };
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const OUT = arg("--out", "/tmp/ssr-test"); mkdirSync(OUT, { recursive: true });
const ONLY = arg("--only", null)?.split(",");
const esbuild = resolve("esbuild"); const { chromium } = resolve("playwright");
const nodePaths = (process.env.NODE_PATH || "").split(":").filter(Boolean);
const common = { bundle: true, jsx: "automatic", nodePaths, define: { "process.env.NODE_ENV": '"development"' }, logLevel: "error" };

// server: one module exporting render(id) → markup
writeFileSync(join(OUT, "server.tsx"), `import { renderToString } from "react-dom/server";\nimport { Demo, IDS } from ${JSON.stringify(join(HERE, "fixtures/ssr.fixture.tsx"))};\nexport { IDS };\nexport const render = (id: string) => renderToString(<Demo id={id} />);\n`);
await esbuild.build({ ...common, entryPoints: [join(OUT, "server.tsx")], outfile: join(OUT, "server.mjs"), platform: "node", format: "esm", banner: { js: "import { createRequire as __cr } from 'module'; const require = __cr(import.meta.url);" } });
// client: hydrate window.__ID over #root, report what React says
writeFileSync(join(OUT, "client.tsx"), `import { hydrateRoot } from "react-dom/client";\nimport { Demo } from ${JSON.stringify(join(HERE, "fixtures/ssr.fixture.tsx"))};\nconst w = window as unknown as { __ID: string; __recoverable: string[]; __hydrated: boolean };\nw.__recoverable = [];\nhydrateRoot(document.getElementById("root")!, <Demo id={w.__ID} />, { onRecoverableError: (e: unknown) => { w.__recoverable.push(String((e as Error)?.message || e)); } });\nrequestAnimationFrame(() => { w.__hydrated = true; });\n`);
await esbuild.build({ ...common, entryPoints: [join(OUT, "client.tsx")], outfile: join(OUT, "client.js"), platform: "browser", format: "iife", target: "es2020" });

const csv = readFileSync(join(ROOT, "skills/asfakulsiam-motomation-design/data/components.csv"), "utf8").trim().split("\n").slice(1).map((l) => l.split(",")[0]);
const server = await import(pathToFileURL(join(OUT, "server.mjs")).href);
const missing = csv.filter((id) => !server.IDS.includes(id));
const ids = [...csv.filter((id) => !ONLY || ONLY.includes(id)), "__control-mismatch"];
let failed = 0; const rows = [];
const line = (ok, id, msg) => { if (!ok) failed++; rows.push({ id, ok, msg }); console.log(`${ok ? "✓" : "✗"} ${id.padEnd(20)} ${msg}`); };
if (missing.length) { failed++; console.log(`✗ no gallery demo (so no SSR check) for: ${missing.join(", ")}`); }

const browser = await chromium.launch();
const HYDRATION = /hydrat|did not match|server rendered|didn't match|Expected server HTML|text content does not match/i;
for (const id of ids) {
  let html;
  const noisy = []; const origErr = console.error, origWarn = console.warn;
  console.error = (...a) => noisy.push(a.map(String).join(" ").slice(0, 200)); console.warn = (...a) => noisy.push(a.map(String).join(" ").slice(0, 200));
  try { html = server.render(id); } catch (e) { console.error = origErr; console.warn = origWarn; line(false, id, `renderToString threw: ${String(e?.message || e).split("\n")[0]}`); continue; }
  console.error = origErr; console.warn = origWarn;
  const serverNoise = noisy.filter((m) => !/useLayoutEffect does nothing on the server/.test(m));
  const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${id}</title></head><body><div id="root">${html}</div><script>window.__ID=${JSON.stringify(id)}</script><script src="client.js"></script></body></html>`;
  writeFileSync(join(OUT, `${id}.html`), page);
  const problems = [...serverNoise.map((m) => `server: ${m}`)];
  for (const motion of ["reduce", "no-preference"]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: motion }); const p = await ctx.newPage();
    const msgs = [];
    p.on("pageerror", (e) => msgs.push(`pageerror: ${e.message.split("\n")[0]}`));
    p.on("console", (m) => { const t = m.text(); if (m.type() === "error" || (m.type() === "warning" && HYDRATION.test(t))) msgs.push(`${m.type()}: ${t.split("\n")[0].slice(0, 220)}`); });
    await p.goto(pathToFileURL(join(OUT, `${id}.html`)).href); await p.waitForFunction(() => window.__hydrated === true, null, { timeout: 10000 }).catch(() => msgs.push("never hydrated"));
    await p.waitForTimeout(400);
    const r = await p.evaluate(() => ({ rec: window.__recoverable || [], alive: !!document.querySelector("#root [data-demo]") }));
    for (const m of r.rec) msgs.push(`recoverable: ${m.split("\n")[0].slice(0, 220)}`);
    if (!r.alive) msgs.push("demo missing after hydration (React re-rendered from scratch)");
    problems.push(...msgs.map((m) => `[${motion === "reduce" ? "rm" : "motion"}] ${m}`));
    await ctx.close();
  }
  if (id === "__control-mismatch") { line(problems.some((m) => /recoverable|hydrat|match/i.test(m)), "control", problems.length ? `mismatch caught: ${problems[0].slice(0, 120)}` : "a server/client text mismatch was NOT reported: the check is blind"); continue; }
  line(!problems.length, id, problems.length ? problems.join(" | ") : `server ${Math.round(html.length / 1024 * 10) / 10} KB of markup; hydrates clean (reduced motion and motion)`);
}
await browser.close();
writeFileSync(join(OUT, "report.json"), JSON.stringify(rows, null, 2));
console.log(failed ? `\n${failed} of ${ids.length} check(s) failed SSR/hydration.` : `\nall ${ids.length - 1} components render on the server and hydrate with no warning; the mismatch control is caught.`);
process.exit(failed ? 1 : 0);
