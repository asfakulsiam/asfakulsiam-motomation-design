// The async advisory (gate.mjs MICRO_EXPECT asy) reads page scripts with regexes.
// Regression: optional catch binding (`catch {`) and `!r.ok` were not seen as an error state,
// so a page that handled failures was told it had none (found on the v3 paired build).
import { readFileSync } from "node:fs";
const src = readFileSync(new URL("../../skills/asfakulsiam-motomation-design/scripts/gate.mjs", import.meta.url), "utf8");
const block = src.slice(src.indexOf("const asy = asyncJs ? {"), src.indexOf("} : null;\n  return { btn, frm, lst, img, asy };"));
const re = (k) => { const m = block.match(new RegExp(`${k}: (/.*/i)\\.test\\(js\\)`)); if (!m) throw new Error("no " + k + " regex"); return eval(m[1]); };
const err = re("error"), ok = re("success");
let fails = 0; const say = (c, m) => { console.log((c ? "ok   " : "FAIL ") + m); if (!c) fails++; };
const cases = [
  ["try { const r = await fetch(u); } catch { show() }", true, "optional catch binding"],
  ["try { await fetch(u) } catch (e) { show(e) }", true, "catch (e)"],
  ["fetch(u).then(a).catch(b)", true, ".catch("],
  ["const r = await fetch(u); if (!r.ok) throw x", true, "!r.ok"],
  ["const res = await fetch(u); if (res.ok === false) fail()", true, ".ok === false"],
  ["const r = await fetch(u); render(await r.json())", false, "no error handling"],
];
for (const [js, want, name] of cases) say(err.test(js) === want, `error state ${want ? "seen" : "absent"}: ${name}`);
say(ok.test("const r = await fetch(u); if (r.ok) done()"), "success state seen: r.ok");
console.log(fails ? `\n${fails} failing` : "\nall async-state checks pass"); process.exit(fails ? 1 : 0);
