#!/usr/bin/env node
// Frame pipeline for Tier 5 (scroll-as-film) pages: render a procedural scene into an image sequence, a poster, four
// storyboard stills and an all-intra MP4. No Blender, no After Effects: the scene is a plain JS module drawn with the
// Canvas 2D API in headless Chromium (Playwright), encoded with ffmpeg (libwebp / libaom-av1 / libx264).
//
// Run from the skill folder (skills/asfakulsiam-motomation-design); paths are relative to where you run it.
//   node scripts/build-frames.mjs --scene <scene.mjs> --out <dir>                   desktop + mobile + poster + stills + mp4
//   node scripts/build-frames.mjs --scene <scene.mjs> --out <dir> --format avif     AVIF frames instead of WebP
//   node scripts/build-frames.mjs --scene <scene.mjs> --out <dir> --check           render again into a temp folder and
//                                                                                   compare hashes with <dir>/frames.json
//   options: --frames 180 --mobile-frames 90 --width 1920 --mobile-width 828 --quality 70 --no-mp4
//
// Output (<dir>):
//   frames/0001.webp … 0180.webp      desktop sequence, 1920 wide, the scene's desktop aspect (16:9 unless it says so)
//   frames-mobile/0001.webp … 0090    mobile sequence, 828 wide, the scene's mobile aspect (9:16 unless it says so)
//   poster.webp                       the middle desktop frame (frame 90 of 180), also the no-JS / first paint
//   storyboard/1.webp … 4.webp        four stills at the scene's storyboard progress points, 1600 wide, for the
//                                     reduced-motion storyboard (normal flow, no canvas)
//   film.mp4                          desktop sequence as H.264, every frame a keyframe (-g 1) so a <video> can be
//                                     scrubbed to any frame; 30 fps, yuv420p, +faststart
//   frames.json                       manifest: counts, sizes, scene hash, encoder settings, sha256 of every file
//
// Scene module contract (examples/templates/<id>/scene.mjs):
//   export const scene = { name, desktop: [16, 9], mobile: [9, 16], stills: [0.1, 0.37, 0.63, 0.9], seed: 7 };
//   export function render(ctx, p, w, h, rand) { … }   // p in [0, 1]; draw the whole frame; no Date, no Math.random:
//                                                      // use rand() (seeded mulberry32, reset to scene.seed per frame)
//
// Deterministic: the same scene file, the same Chromium and the same ffmpeg give byte-identical files. Frames are
// rendered to PNG (lossless) and encoded by ffmpeg single-threaded with -bitexact; `--check` proves it by rendering
// again and comparing every hash in frames.json.
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync, copyFileSync, mkdtempSync } from "node:fs";
import { join, resolve, dirname, basename } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const USAGE = "Usage: node scripts/build-frames.mjs --scene <scene.mjs> --out <dir> [--frames 180] [--mobile-frames 90] [--width 1920] [--mobile-width 828] [--format webp|avif] [--quality 70] [--no-mp4] [--check]";
const die = (msg) => { console.error(`build-frames: ${msg}\n${USAGE}`); process.exit(2); };

const KNOWN = new Set(["scene", "out", "frames", "mobile-frames", "width", "mobile-width", "format", "quality", "no-mp4", "check", "help"]);
const BOOL = new Set(["no-mp4", "check", "help"]);
const args = {};
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (!a.startsWith("--")) die(`unexpected argument "${a}"`);
  const k = a.slice(2); if (!KNOWN.has(k)) die(`unknown flag --${k}`);
  if (BOOL.has(k)) { args[k] = true; continue; }
  const v = argv[++i]; if (v === undefined || v.startsWith("--")) die(`--${k} needs a value`);
  args[k] = v;
}
if (args.help) { console.log(USAGE); process.exit(0); }
if (!args.scene) die("missing --scene");
if (!args.out) die("missing --out");
const scenePath = resolve(args.scene);
if (!existsSync(scenePath)) die(`scene not found: ${args.scene}`);
const int = (k, d) => { const n = args[k] === undefined ? d : Number(args[k]); if (!Number.isInteger(n) || n < 1) die(`--${k} must be a positive integer`); return n; };
const N = int("frames", 180), NM = int("mobile-frames", 90), W = int("width", 1920), WM = int("mobile-width", 828), Q = int("quality", 70);
const FORMAT = args.format || "webp";
if (!["webp", "avif"].includes(FORMAT)) die(`--format must be webp or avif, not ${FORMAT}`);
const ffmpegOk = spawnSync("ffmpeg", ["-hide_banner", "-version"], { encoding: "utf8" });
if (ffmpegOk.status !== 0) die("ffmpeg is not installed (needed to encode frames and the MP4)");
let chromium;
try { ({ chromium } = await import("playwright")); } catch { die("Playwright is not installed: npm i --no-save playwright && npx playwright install chromium"); }

const sha = (buf) => createHash("sha256").update(buf).digest("hex");
const sceneSrc = readFileSync(scenePath, "utf8");
const OUT = args.check ? mkdtempSync(join(tmpdir(), "frames-check-")) : resolve(args.out);

// ffmpeg, single-threaded and bit-exact, so the same PNGs always give the same bytes
function ff(list) {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-threads", "1", ...list], { encoding: "utf8" });
  if (r.status !== 0) { console.error(`build-frames: ffmpeg failed: ${(r.stderr || "").trim().split("\n").slice(-3).join(" | ")}`); process.exit(1); }
}
const imageArgs = (q) => FORMAT === "webp"
  ? ["-c:v", "libwebp", "-lossless", "0", "-quality", String(q), "-compression_level", "6", "-preset", "picture", "-fflags", "+bitexact", "-flags:v", "+bitexact"]
  : ["-c:v", "libaom-av1", "-still-picture", "1", "-crf", String(Math.round(63 - (q / 100) * 40)), "-cpu-used", "6", "-row-mt", "0", "-tiles", "1x1", "-pix_fmt", "yuv420p", "-fflags", "+bitexact", "-flags:v", "+bitexact"];
const encodeOne = (png, out, q = Q) => ff(["-i", png, ...imageArgs(q), "-frames:v", "1", "-update", "1", out]);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent("<!doctype html><title>frames</title><body></body>");
// the scene runs as a module in the page; every frame is drawn on a fresh canvas with the rng reset to the seed
await page.addScriptTag({ type: "module", content: `${sceneSrc.replace(/^export /gm, "")}
window.__scene = scene; window.__render = render;
const mulberry = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
window.__frame = (p, w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; const ctx = c.getContext("2d", { alpha: false });
  ctx.save(); render(ctx, p, w, h, mulberry(scene.seed ?? 1)); ctx.restore(); return c.toDataURL("image/png"); };` });
await page.waitForFunction(() => typeof window.__frame === "function", null, { timeout: 10000 }).catch(() => die(`scene ${args.scene} did not load: it must export "scene" and "render" (see the header of this script)`));
const meta = await page.evaluate(() => ({ ...window.__scene }));
const [dw, dh] = meta.desktop || [16, 9], [mw, mh] = meta.mobile || [9, 16];
const stills = meta.stills || [0.1, 0.37, 0.63, 0.9];
if (stills.length !== 4) die(`scene.stills must list 4 progress points, has ${stills.length}`);
const even = (n) => Math.round(n / 2) * 2;
const size = { desktop: [W, even((W * dh) / dw)], mobile: [WM, even((WM * mh) / mw)], still: [1600, even((1600 * dh) / dw)] };

const tmp = mkdtempSync(join(tmpdir(), "frames-png-"));
async function sequence(label, count, [w, h]) {
  const dir = join(tmp, label); mkdirSync(dir, { recursive: true });
  for (let i = 0; i < count; i++) {
    const p = count === 1 ? 0 : i / (count - 1);
    const url = await page.evaluate(([p, w, h]) => window.__frame(p, w, h), [p, w, h]);
    writeFileSync(join(dir, `${String(i + 1).padStart(4, "0")}.png`), Buffer.from(url.split(",")[1], "base64"));
    if ((i + 1) % 30 === 0 || i + 1 === count) process.stdout.write(`  ${label}: ${i + 1}/${count}\r`);
  }
  process.stdout.write("\n");
  return dir;
}

console.log(`build-frames: ${basename(scenePath)} → ${args.check ? "(check) " : ""}${OUT}`);
const pngDesk = await sequence("frames", N, size.desktop);
const pngMob = await sequence("frames-mobile", NM, size.mobile);
const pngStill = join(tmp, "storyboard"); mkdirSync(pngStill);
for (let i = 0; i < 4; i++) { const url = await page.evaluate(([p, w, h]) => window.__frame(p, w, h), [stills[i], ...size.still]); writeFileSync(join(pngStill, `${i + 1}.png`), Buffer.from(url.split(",")[1], "base64")); }
await browser.close();

const ext = FORMAT;
for (const d of ["frames", "frames-mobile", "storyboard"]) { rmSync(join(OUT, d), { recursive: true, force: true }); mkdirSync(join(OUT, d), { recursive: true }); }
for (const [src, dst] of [[pngDesk, "frames"], [pngMob, "frames-mobile"], [pngStill, "storyboard"]])
  for (const f of readdirSync(src).sort()) encodeOne(join(src, f), join(OUT, dst, f.replace(/\.png$/, `.${ext}`)), dst === "storyboard" ? Math.min(90, Q + 12) : Q);
const mid = String(Math.ceil(N / 2)).padStart(4, "0");
encodeOne(join(pngDesk, `${mid}.png`), join(OUT, `poster.${ext}`), Math.min(90, Q + 12));
if (!args["no-mp4"]) ff(["-framerate", "30", "-i", join(pngDesk, "%04d.png"), "-c:v", "libx264", "-preset", "medium", "-crf", "30", "-g", "1", "-keyint_min", "1", "-sc_threshold", "0", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-map_metadata", "-1", "-fflags", "+bitexact", "-flags:v", "+bitexact", "-x264-params", "threads=1:lookahead-threads=1", join(OUT, "film.mp4")]);
rmSync(tmp, { recursive: true, force: true });

// manifest with a hash of every file, so a re-render can be compared byte for byte
const files = {};
let bytes = 0;
for (const d of ["frames", "frames-mobile", "storyboard"]) for (const f of readdirSync(join(OUT, d)).sort()) { const b = readFileSync(join(OUT, d, f)); bytes += b.length; files[`${d}/${f}`] = sha(b); }
for (const f of [`poster.${ext}`, "film.mp4"]) if (existsSync(join(OUT, f))) { const b = readFileSync(join(OUT, f)); bytes += b.length; files[f] = sha(b); }
const ffv = ffmpegOk.stdout.split("\n")[0].replace(/ Copyright.*/, "");
const manifest = { scene: { file: basename(scenePath), name: meta.name, sha256: sha(sceneSrc), seed: meta.seed ?? 1, stills },
  desktop: { frames: N, width: size.desktop[0], height: size.desktop[1] }, mobile: { frames: NM, width: size.mobile[0], height: size.mobile[1] },
  storyboard: { width: size.still[0], height: size.still[1] }, format: ext, quality: Q, poster: `poster.${ext} (frame ${mid} of ${N})`,
  mp4: args["no-mp4"] ? null : "film.mp4 (H.264, -g 1, 30 fps, crf 30)", encoder: ffv, total_bytes: bytes, files };

if (args.check) {
  const ref = join(resolve(args.out), "frames.json");
  if (!existsSync(ref)) die(`--check needs an existing ${ref}; build once without --check first`);
  const old = JSON.parse(readFileSync(ref, "utf8")).files;
  const keys = new Set([...Object.keys(old), ...Object.keys(files)]);
  const diff = [...keys].filter((k) => old[k] !== files[k]);
  rmSync(OUT, { recursive: true, force: true });
  if (diff.length) { console.log(`✗ not deterministic: ${diff.length} of ${keys.size} files differ (first: ${diff.slice(0, 3).join(", ")})`); process.exit(1); }
  console.log(`✓ deterministic: all ${keys.size} files byte-identical to ${ref}`);
  process.exit(0);
}
writeFileSync(join(OUT, "frames.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`✓ ${N} desktop (${size.desktop.join("×")}) + ${NM} mobile (${size.mobile.join("×")}) ${ext} frames, poster, 4 stills${args["no-mp4"] ? "" : ", film.mp4"} · ${(bytes / 1048576).toFixed(1)} MB · frames.json`);
