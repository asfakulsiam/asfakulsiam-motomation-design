// Shared test harness: bundles a fixture with esbuild and opens it in Chromium (Playwright).
// Needs esbuild, react, react-dom and playwright resolvable from the current folder or NODE_PATH.
import { createRequire } from "node:module";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
const req = createRequire(join(process.cwd(), "noop.js"));
const resolve = (m) => { for (const base of [process.cwd(), ...(process.env.NODE_PATH || "").split(":").filter(Boolean)]) { try { return createRequire(join(base, "noop.js"))(m); } catch {} } return req(m); };
export const esbuild = resolve("esbuild");
export const { chromium } = resolve("playwright");
const HERE = fileURLToPath(new URL(".", import.meta.url));
export async function bundle(fixture) {
  const nodePaths = [join(process.cwd(), "node_modules"), ...(process.env.NODE_PATH || "").split(":").filter(Boolean)];
  const r = await esbuild.build({ entryPoints: [join(HERE, "fixtures", fixture)], bundle: true, write: false, format: "iife", jsx: "automatic", target: "es2020", nodePaths, define: { "process.env.NODE_ENV": '"development"' }, logLevel: "silent" });
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>fixture</title></head><body><div id="root"></div><script>${r.outputFiles[0].text.replace(/<\/script/gi, "<\\/script")}</script></body></html>`;
}
export function runner(name) {
  const results = []; let failed = 0;
  return {
    async test(title, fn) { const t0 = Date.now(); try { await fn(); results.push(`✓ ${title} (${Date.now() - t0} ms)`); } catch (e) { failed++; results.push(`✗ ${title}: ${e.message}`); } },
    done() { console.log(`${name}\n${results.join("\n")}\n${results.length - failed}/${results.length} passed`); if (failed) process.exit(1); },
  };
}
export const assert = (c, m) => { if (!c) throw new Error(m); };
