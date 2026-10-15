// Authors the four stand-in Lottie files (320 × 120 artboard, 60fps, play once) and their final-frame SVG posters.
// The client's designer replaces assets/lottie/*.json later; the posters are what shows until a file loads.
// Run: node tools/make-lottie.mjs  (from the project folder)
import { writeFileSync, mkdirSync } from "node:fs";

const hex = (h) => [1, 3, 5].map((i) => Math.round((parseInt(h.slice(i, i + 2), 16) / 255) * 1000) / 1000);
const C = { ink: "#171613", accent: "#2B3CB0", paper: "#FBFAF5", rule: "#D6D1C5" };
const st = (k) => ({ a: 0, k });
// keyframes: [[frame, value], ...], eased in-out for travel, out for arrivals
const kf = (frames, ease = "inout") => {
  const o = ease === "out" ? { x: [0.22], y: [1] } : { x: [0.65], y: [0] };
  const i = ease === "out" ? { x: [0.36], y: [1] } : { x: [0.35], y: [1] };
  return { a: 1, k: frames.map(([t, s], n) => (n < frames.length - 1 ? { t, s: [].concat(s), o, i } : { t, s: [].concat(s) })) };
};
const tr = () => ({ ty: "tr", p: st([0, 0]), a: st([0, 0]), s: st([100, 100]), r: st(0), o: st(100), sk: st(0), sa: st(0) });
const el = (x, y, w, h) => ({ ty: "el", p: st([x, y]), s: st([w, h]), d: 1 });
const rc = (x, y, w, h, r) => ({ ty: "rc", p: st([x, y]), s: st([w, h]), r: st(r), d: 1 });
const sh = (v, c = false) => ({ ty: "sh", ks: st({ i: v.map(() => [0, 0]), o: v.map(() => [0, 0]), v, c }) });
const fl = (c) => ({ ty: "fl", c: st([...hex(c), 1]), o: st(100), r: 1 });
const sk = (c, w) => ({ ty: "st", c: st([...hex(c), 1]), o: st(100), w: st(w), lc: 2, lj: 2, ml: 4 });
const tm = (e) => ({ ty: "tm", s: st(0), e, o: st(0), m: 1 });
const gr = (it) => ({ ty: "gr", it: [...it, tr()] });

function anim(name, op, layers) {
  return {
    v: "5.7.4", fr: 60, ip: 0, op, w: 320, h: 120, nm: name, ddd: 0, assets: [],
    layers: layers.map((l, n) => ({
      ddd: 0, ind: n + 1, ty: 4, nm: l.nm, sr: 1, ao: 0, ip: 0, op, st: 0, bm: 0,
      ks: { o: st(100), r: st(0), p: st([0, 0, 0]), a: st([0, 0, 0]), s: st([100, 100, 100]), ...(l.ks || {}) },
      shapes: [gr(l.shapes)],
    })),
  };
}

// 1 · Intro: the balance card. Mitu (left) → Sabbir (right); the arrow draws, the bar fills.
const balance = anim("balance", 72, [
  { nm: "head", ks: { o: kf([[36, 0], [44, 100]], "out") }, shapes: [sh([[234, 34], [248, 46], [234, 58]]), sk(C.accent, 4)] },
  { nm: "arrow", shapes: [sh([[72, 46], [246, 46]]), tm(kf([[4, 0], [40, 100]], "inout")), sk(C.accent, 4)] },
  { nm: "mitu", shapes: [el(48, 46, 36, 36), fl(C.ink)] },
  { nm: "sabbir", shapes: [el(272, 46, 36, 36), fl(C.ink)] },
  { nm: "bar", ks: { p: st([48, 96, 0]), s: kf([[28, [0, 100, 100]], [68, [100, 100, 100]]], "out") }, shapes: [rc(112, 0, 224, 8, 4), fl(C.accent)] },
  { nm: "track", shapes: [rc(160, 96, 224, 8, 4), fl(C.rule)] },
]);

// 2 · Features: an expense being added. Two taps on the add button, then the new row drops in with a tick.
const tapScale = kf([[2, [100, 100, 100]], [7, [90, 90, 100]], [13, [100, 100, 100]], [22, [100, 100, 100]], [27, [90, 90, 100]], [33, [100, 100, 100]]], "out");
const ring = (t0) => ({ nm: "ring", ks: { p: st([52, 60, 0]), s: kf([[t0, [100, 100, 100]], [t0 + 20, [175, 175, 100]]], "out"), o: kf([[t0 - 1, 0], [t0, 70], [t0 + 20, 0]], "out") }, shapes: [el(0, 0, 44, 44), sk(C.accent, 2)] });
const addExpense = anim("add-expense", 78, [
  { nm: "tick", shapes: [sh([[264, 81], [271, 88], [284, 75]]), tm(kf([[58, 0], [74, 100]], "out")), sk(C.paper, 3)] },
  { nm: "new-row", ks: { p: kf([[38, [0, -16, 0]], [60, [0, 0, 0]]], "out"), o: kf([[38, 0], [52, 100]], "out") }, shapes: [rc(198, 82, 196, 26, 3), fl(C.ink)] },
  { nm: "row", shapes: [rc(198, 38, 196, 26, 3), fl(C.rule)] },
  { nm: "plus", ks: { p: st([52, 60, 0]), s: tapScale }, shapes: [sh([[-9, 0], [9, 0]]), sh([[0, -9], [0, 9]]), sk(C.paper, 3)] },
  { nm: "button", ks: { p: st([52, 60, 0]), s: tapScale }, shapes: [el(0, 0, 44, 44), fl(C.accent)] },
  ring(7),
  ring(27),
]);

// 3 · Pricing: the plan toggle slides from the Free side to the Plus side and fills.
const planToggle = anim("plan-toggle", 60, [
  { nm: "knob", ks: { p: kf([[8, [134, 60, 0]], [44, [186, 60, 0]]], "inout") }, shapes: [el(0, 0, 40, 40), fl(C.paper), sk(C.ink, 2)] },
  { nm: "track-on", ks: { o: kf([[14, 0], [44, 100]], "inout") }, shapes: [rc(160, 60, 104, 52, 26), fl(C.accent)] },
  { nm: "track", shapes: [rc(160, 60, 104, 52, 26), fl(C.rule)] },
]);

// 4 · Start: a circle draws, then the check mark inside it.
const check = anim("check", 66, [
  { nm: "mark", shapes: [sh([[143, 61], [155, 73], [178, 49]]), tm(kf([[30, 0], [60, 100]], "out")), sk(C.accent, 6)] },
  { nm: "circle", shapes: [el(160, 60, 84, 84), tm(kf([[0, 0], [36, 100]], "inout")), sk(C.accent, 5)] },
]);

mkdirSync("assets/lottie", { recursive: true });
for (const [f, a] of Object.entries({ balance, "add-expense": addExpense, "plan-toggle": planToggle, check }))
  writeFileSync(`assets/lottie/${f}.json`, JSON.stringify(a));

// Final-frame posters (same geometry as the last frame of each file)
const svg = (inner) => `<svg class="poster" viewBox="0 0 320 120" aria-hidden="true" focusable="false">${inner}</svg>`;
const posters = {
  balance: svg(`<rect x="48" y="92" width="224" height="8" rx="4" fill="${C.accent}"/><circle cx="48" cy="46" r="18" fill="${C.ink}"/><circle cx="272" cy="46" r="18" fill="${C.ink}"/><path d="M72 46H246M234 34l14 12-14 12" fill="none" stroke="${C.accent}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`),
  "add-expense": svg(`<rect x="100" y="25" width="196" height="26" rx="3" fill="${C.rule}"/><rect x="100" y="69" width="196" height="26" rx="3" fill="${C.ink}"/><path d="M264 81l7 7 13-13" fill="none" stroke="${C.paper}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="52" cy="60" r="22" fill="${C.accent}"/><path d="M43 60h18M52 51v18" stroke="${C.paper}" stroke-width="3" stroke-linecap="round"/>`),
  "plan-toggle": svg(`<rect x="108" y="34" width="104" height="52" rx="26" fill="${C.accent}"/><circle cx="186" cy="60" r="20" fill="${C.paper}" stroke="${C.ink}" stroke-width="2"/>`),
  check: svg(`<circle cx="160" cy="60" r="42" fill="none" stroke="${C.accent}" stroke-width="5"/><path d="M143 61l12 12 23-24" fill="none" stroke="${C.accent}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`),
};
writeFileSync("tools/posters.json", JSON.stringify(posters, null, 1));
console.log("wrote", Object.keys(posters).map((k) => `assets/lottie/${k}.json`).join(", "));
