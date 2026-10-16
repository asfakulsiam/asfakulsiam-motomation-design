// Originality math, without a browser: the similarity helpers and the six-axis comparison behave at the edges.
//   node tests/gate/originality.test.mjs
import { wjaccard, seqSim, gridSim, compare, signatureOf, AXES } from "../../skills/asfakulsiam-motomation-design/scripts/originality.mjs";
let bad = 0; const say = (ok, m) => { console.log(`${ok ? "ok  " : "FAIL"} ${m}`); if (!ok) bad++; };

say(wjaccard({ a: 2, b: 1 }, { a: 2, b: 1 }) === 1, "wjaccard: identical bags → 1");
say(wjaccard({ a: 1 }, { b: 1 }) === 0, "wjaccard: disjoint bags → 0");
say(Math.abs(wjaccard({ a: 2, b: 2 }, { a: 1, b: 2 }) - 0.75) < 1e-9, "wjaccard: Σmin/Σmax = 3/4");
say(wjaccard({}, {}) === 1, "wjaccard: both empty → 1 (absence on both sides is the same pattern)");
say(seqSim(["a", "b", "c"], ["a", "b", "c"]) === 1 && seqSim(["a"], ["b"]) === 0, "seqSim: same order → 1, nothing shared → 0");
say(Math.abs(seqSim(["a", "b", "c", "d"], ["a", "c", "d"]) - 0.75) < 1e-9, "seqSim: one deletion in four → 0.75");
say(gridSim(["t", "", "m"], ["t", "", "t"]) === 0.5 && gridSim(["", ""], ["", ""]) === 1, "gridSim: matching non-empty over non-empty in either");

const feat = (o = {}) => ({
  structure: { shingles: { "body>main>section": 3, "main>section>h2": 3 }, order: ["media:m", "text:m", "grid:l"] },
  composition: { grids: [["t", "m", "", "t"], ["t", "", "", ""]], density: [0.6, 0.2], columns: { "c2:left": 1, "c1:centre": 1 } },
  image: { count: 2, ratioSize: { "img:16:9:bleed": 2 }, cropMask: { "crop:square:none": 2 }, effects: { "none:normal:flat": 2 } },
  typography: { display: "fraunces", body: "inter", bodyPx: 17, scale: { 0: 10, 8: 3 }, rhythm: { "body:lh1.5": 10 }, hier: { h1: 4, h2: 2 } },
  interaction: { feedback: { "hover:colour": 2, "focus:border": 1 }, forms: {}, navigation: { "nav:1": 1, "nav-in-page:some": 1, "skip-link": 1 } },
  signature: { tokens: { "trigger:scroll": 1, "prop:transform": 1 }, declared: "aperture" }, ...o });
const same = compare(feat(), feat());
say(AXES.every((a) => same.score[a] === 1) && same.score.overall === 1, "compare: a build against itself → 1.00 on every axis");
const other = feat({
  structure: { shingles: { "body>div#g>article": 5 }, order: ["statement:s", "form:m"] },
  composition: { grids: [["", "", "m", ""], ["", "t", "", ""], ["m", "m", "m", "m"]], density: [0.9, 0.1, 1], columns: { "c4:spread": 3 } },
  image: { count: 0, ratioSize: {}, cropMask: {}, effects: {} },
  typography: { display: "space mono", body: "space mono", bodyPx: 14, scale: { 0: 4, 12: 1 }, rhythm: { "body:lh1.2": 4 }, hier: { h1: 8 } },
  interaction: { feedback: { "active:transform": 1 }, forms: { "forms:1": 1, "field:email": 1, required: 1 }, navigation: { "nav-pages:few": 1, dialog: 1 } },
  signature: { tokens: { "trigger:pointer": 1, "prop:clip": 1 }, declared: "split-type" } });
const diff = compare(feat(), other);
say(AXES.every((a) => diff.score[a] < 0.4), `compare: unrelated feature sets → every axis below 0.4 (${AXES.map((a) => `${a} ${diff.score[a]}`).join(", ")})`);
say(compare(feat(), feat({ image: { count: 0, ratioSize: {}, cropMask: {}, effects: {} } })).score.image === 0, "compare: imagery on one side only → image 0");
{ const none = { image: { count: 0, ratioSize: {}, cropMask: {}, effects: {} } }; const c = compare(feat(none), feat(none));
  say(c.score.image === null && c.score.image !== 1, "compare: neither page has imagery → image n/a (null), never 1.00"); }
{ const none = { feedback: {}, forms: {}, navigation: {} }; const c = compare(feat({ interaction: none }), feat({ interaction: none }));
  say(c.score.interaction === null && !Number.isNaN(c.score.overall), "compare: neither page has any interaction pattern → interaction n/a (null), overall from the other axes"); }
{ const c = compare(feat(), feat({ interaction: { feedback: { "hover:colour": 2, "focus:border": 1 }, forms: {}, navigation: { "nav:1": 1 } } }));
  say(!("forms" in c.parts.interaction) && c.score.interaction < 1, `compare: a part neither page has (forms) is left out, not counted as a match (${JSON.stringify(c.parts.interaction)})`); }

const snap = (p, t = "text", a = 400000) => ({ p, t, a, txt: "x" });
const base = [snap(["none", "1"]), snap(["none", "1"], "media", 900000)];
const sig = signatureOf({ base, time: base, pointer: base, scroll: [base, [snap(["matrix(1,0,0,1,0,-40)", "1"]), snap(["none", "1"], "media", 900000)]] }, 1440, 900);
say(sig.found && sig.found.trigger.join() === "scroll" && sig.found.props.join() === "transform" && sig.found.kind === "text", "signatureOf: the element that moves under scroll is the signature, the static one is not");
say(signatureOf({ base, time: base, pointer: base, scroll: [base, base] }, 1440, 900).found === null, "signatureOf: nothing changes → static, no signature");

console.log(bad ? `\n${bad} failing` : "\nall originality checks pass"); process.exit(bad ? 1 : 0);
