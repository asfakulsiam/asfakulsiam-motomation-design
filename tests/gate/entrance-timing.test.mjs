// V (entrance repeats) is read at each entrance's start and end, not at fixed moments (v3.0.1). The fixture's entrances
// are slower than the old fixed waits (a 0.9 s delay + 1.6 s rise, a 1.4 s keyframe, a 1.5 s rAF tween, a 1.3 s clip)
// and it has a looping marquee: v3.0.0 read the delayed rises as "static" and the marquee as an x entrance.
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
let bad = 0; const say = (ok, m) => { console.log(`${ok ? "ok  " : "FAIL"} ${m}`); if (!ok) bad++; };
let pw; try { pw = await import("playwright"); } catch { console.log("not verified — no playwright"); process.exit(0); }
const { structure } = await import(join(ROOT, "skills/asfakulsiam-motomation-design/scripts/gate.mjs"));
const dir = join(ROOT, "fixtures/motion/entrance-timing");
const srv = createServer((q, r) => { try { r.setHeader("content-type", "text/html"); r.end(readFileSync(join(dir, q.url === "/" ? "index.html" : q.url))); } catch { r.statusCode = 404; r.end(); } }).listen(0);
const url = `http://127.0.0.1:${srv.address().port}/`;
let b; try { b = await pw.chromium.launch(); } catch { console.log("not verified — no browser"); srv.close(); process.exit(0); }
try {
  const want = ["fade+y", "fade+y", "fade+y", "x", "clip", "static", "static"];
  const runs = []; for (let i = 0; i < 3; i++) runs.push(await structure(b, url, []));
  say(runs[0].timing === "frozen", `measured with the page clock paused and animations frozen (${runs[0].timing})`);
  say(runs[0].patterns.join() === want.join(), `slow entrances read at their end state: ${runs[0].patterns.join(" | ")}`);
  say(runs[0].repeats === 2, `fade+y three times is 2 repeats (${runs[0].repeats})`);
  say(runs[0].patterns[5] === "static", "a looping marquee is not an entrance");
  say(runs.every((r) => r.patterns.join() === runs[0].patterns.join() && r.repeats === runs[0].repeats), `three runs, one result (${runs.map((r) => r.repeats).join(", ")})`);
} finally { await b.close(); srv.close(); }
console.log(bad ? `\n${bad} failing` : "\nentrance measurement is time-independent"); process.exit(bad ? 1 : 0);
