#!/usr/bin/env node
// Share images for the templates (craft/seo.md seo-18): a 1200×630 JPEG of each page's first screen, written to
// examples/templates/<id>/og.jpg. build-templates.mjs adds the og: tags when the file exists; the film templates
// carry their tags by hand. Reduced motion, so the image is the page at rest, not a mid-animation frame.
//   node scripts/build-og.mjs [<template-id> …]
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "skills/asfakulsiam-motomation-design/examples/templates");
const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) { console.log("Usage: node scripts/build-og.mjs [<template-id> …]   (1200×630 og.jpg per template)"); process.exit(0); }
const all = readdirSync(DIR).filter((d) => statSync(join(DIR, d)).isDirectory() && (existsSync(join(DIR, `${d}.html`)) || existsSync(join(DIR, d, "index.html"))));
const ids = args.length ? args : all;
const unknown = ids.filter((i) => !all.includes(i));
if (unknown.length) { console.error(`build-og: no template called ${unknown.join(", ")} (have: ${all.join(", ")})`); process.exit(2); }
let chromium; try { ({ chromium } = createRequire(join(ROOT, "noop.js"))("playwright")); } catch { console.error("build-og: needs Playwright (npm i -D playwright && npx playwright install chromium)"); process.exit(2); }
const browser = await chromium.launch();
try {
  for (const id of ids) {
    const page = existsSync(join(DIR, `${id}.html`)) ? join(DIR, `${id}.html`) : join(DIR, id, "index.html");
    const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
    const p = await ctx.newPage(); await p.goto(pathToFileURL(page).href, { waitUntil: "load" }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
    const out = join(DIR, id, "og.jpg"); await p.screenshot({ path: out, type: "jpeg", quality: 80 });
    console.log(`wrote ${out.slice(ROOT.length + 1)} (${(statSync(out).size / 1024).toFixed(0)} KB)`); await ctx.close();
  }
} finally { await browser.close(); }
