#!/usr/bin/env node
// Builds examples/gallery/index.html: every component, live, in one self-contained file (no network needed
// except optional Google Fonts). Needs esbuild, react and react-dom resolvable from the current folder or NODE_PATH:
//   npm i --no-save esbuild react react-dom && node scripts/build-gallery.mjs
// The output embeds a hash of the component sources; `check-repo` fails if the components change and the gallery
// isn't rebuilt (that check needs no esbuild).
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { collect } from "./build-components.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SKILL = join(ROOT, "skills/asfakulsiam-motomation-design");
const GAL = join(SKILL, "examples/gallery");

/** Hash of every source file the gallery is built from, in a stable order. */
export function sourceHash() {
  const files = []; const walk = (d) => { for (const f of readdirSync(d).sort()) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (/\.(tsx?|css)$/.test(f) && !/index\.html$/.test(f)) files.push(p); } };
  walk(join(SKILL, "examples/components")); files.push(join(GAL, "gallery.tsx"), join(GAL, "gallery.css"));
  const h = createHash("sha256"); for (const f of files) { h.update(relative(SKILL, f)); h.update(readFileSync(f)); } return h.digest("hex").slice(0, 16);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const req = createRequire(join(process.cwd(), "noop.js"));
  let esbuild; try { esbuild = req("esbuild"); } catch { console.error("esbuild not found. Run: npm i --no-save esbuild react react-dom"); process.exit(1); }
  const { components } = collect();
  const catalogue = components.map((c) => ({ id: c.id, name: c.name, family: c.family, tier: c.tier, what: c.what, use_when: c["use-when"], avoid_when: c["avoid-when"], reduced_motion: c["reduced-motion"], file: c.file }));
  const res = await esbuild.build({ entryPoints: [join(GAL, "gallery.tsx")], bundle: true, minify: true, format: "iife", write: false, target: "es2020", jsx: "automatic",
    nodePaths: [join(process.cwd(), "node_modules"), ...(process.env.NODE_PATH || "").split(":").filter(Boolean)], define: { CATALOGUE: JSON.stringify(catalogue), "process.env.NODE_ENV": '"production"' }, legalComments: "none" });
  const js = res.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
  const css = readFileSync(join(GAL, "gallery.css"), "utf8");
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Motomation components · ${components.length} motion components</title>
<meta name="description" content="${components.length} original motion components for the Motomation Design skill, live, with reduced-motion fallbacks.">
<meta name="motomation-gallery" content="source:${sourceHash()} components:${components.length}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anybody:wdth,wght@50..150,100..900&family=Fraunces:opsz,wght@9..144,300..800&display=swap">
<style>${css}</style>
</head>
<body>
<div id="root"><noscript><p style="padding:24px">The component gallery needs JavaScript. The catalogue is in examples/components/README.md.</p></noscript></div>
<script>${js}</script>
</body>
</html>
`;
  writeFileSync(join(GAL, "index.html"), html);
  console.log(`Wrote examples/gallery/index.html (${(html.length / 1024).toFixed(0)} KB, ${components.length} components, source ${sourceHash()})`);
}
