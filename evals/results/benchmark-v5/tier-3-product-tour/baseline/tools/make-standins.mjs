// Generates the four stand-in Lottie files (anim/*.json) and matching
// static "final frame" posters (anim/*-final.svg) shown until Lottie loads.
// Run: node tools/make-standins.mjs   (output is committed; no build needed to view)
import { writeFileSync } from 'node:fs';

const C = {
  ink: [0.106, 0.122, 0.114], green: [0.059, 0.482, 0.373], coral: [0.910, 0.408, 0.29],
  line: [0.882, 0.863, 0.816], soft: [0.945, 0.933, 0.902], white: [1, 1, 1],
};
const hex = c => '#' + c.map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
const st = v => ({ a: 0, k: v });
const ease = { i: { x: [0.2], y: [1] }, o: { x: [0.5], y: [0] } };
const anim = (keys) => ({ a: 1, k: keys.map(([t, s], n) => n < keys.length - 1 ? { t, s: [].concat(s), ...ease } : { t, s: [].concat(s) }) });
const tr = () => ({ ty: 'tr', p: st([0, 0]), a: st([0, 0]), s: st([100, 100]), r: st(0), o: st(100), sk: st(0), sa: st(0) });
const fill = (c, o = 100) => ({ ty: 'fl', c: st([...c, 1]), o: st(o), r: 1 });
const stroke = (c, w) => ({ ty: 'st', c: st([...c, 1]), o: st(100), w: st(w), lc: 2, lj: 2 });
const rect = (w, h, r, p = [0, 0]) => ({ ty: 'rc', d: 1, s: st([w, h]), p: st(p), r: st(r) });
const ell = (d, p = [0, 0]) => ({ ty: 'el', d: 1, s: st([d, d]), p: st(p) });
const path = (pts) => ({ ty: 'sh', ks: st({ i: pts.map(() => [0, 0]), o: pts.map(() => [0, 0]), v: pts, c: false }) });
const trim = (e) => ({ ty: 'tm', s: st(0), e, o: st(0), m: 1 });
const gr = (...it) => ({ ty: 'gr', it: [...it, tr()] });
let ind = 0;
const layer = (nm, shapes, { p = [0, 0], s = st([100, 100, 100]), o = st(100), a = [0, 0] , op } = {}) => ({
  ddd: 0, ind: ++ind, ty: 4, nm, sr: 1, ao: 0, ip: 0, op: op, st: 0, bm: 0,
  ks: { o, r: st(0), p: p.a ? p : st([...p, 0]), a: st([...a, 0]), s },
  shapes,
});
const comp = (nm, w, h, op, layers) => {
  layers.forEach(l => (l.op = op));
  return { v: '5.7.4', fr: 30, ip: 0, op, w, h, nm, ddd: 0, assets: [], layers: layers.reverse() /* first = top */ };
};
const out = (name, json, svg) => {
  writeFileSync(`anim/${name}.json`, JSON.stringify(json));
  writeFileSync(`anim/${name}-final.svg`, svg.trim() + '\n');
};
const svgWrap = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`;

// 1. Intro: the running balance — Mitu (coral) owes Sabbir (green); bar fills, a coin travels across.
ind = 0;
out('intro-balance', comp('Intro · balance card', 320, 140, 60, [
  layer('Mitu', [gr(ell(44), fill(C.coral))], { p: [40, 60], s: anim([[0, [0, 0, 100]], [12, [100, 100, 100]]]) }),
  layer('Sabbir', [gr(ell(44), fill(C.green))], { p: [280, 60], s: anim([[4, [0, 0, 100]], [16, [100, 100, 100]]]) }),
  layer('track', [gr(rect(176, 10, 5), fill(C.line))], { p: [160, 60] }),
  layer('fill', [gr(rect(176, 10, 5, [88, 0]), fill(C.coral))], { p: [72, 60], s: anim([[10, [0, 100, 100]], [40, [64, 100, 100]]]) }),
  layer('coin', [gr(ell(18), fill(C.ink))], { p: anim([[20, [40, 60, 0]], [50, [280, 60, 0]]]), o: anim([[20, 0], [24, 100], [46, 100], [52, 0]]) }),
  layer('ledger', [gr(rect(240, 8, 4), fill(C.soft)), gr(rect(150, 8, 4, [-45, 18]), fill(C.soft))], { p: [160, 110], o: anim([[30, 0], [44, 100]]) }),
]), svgWrap(320, 140, `
<circle cx="40" cy="60" r="22" fill="${hex(C.coral)}"/><circle cx="280" cy="60" r="22" fill="${hex(C.green)}"/>
<rect x="72" y="55" width="176" height="10" rx="5" fill="${hex(C.line)}"/>
<rect x="72" y="55" width="112.6" height="10" rx="5" fill="${hex(C.coral)}"/>
<rect x="40" y="106" width="240" height="8" rx="4" fill="${hex(C.soft)}"/><rect x="40" y="124" width="150" height="8" rx="4" fill="${hex(C.soft)}"/>`));

// 2. Features: an expense being added — "+" pressed, new row slides in, tick drawn.
ind = 0;
const rowShapes = (accent) => [gr(ell(22, [-112, 0]), fill(accent)), gr(rect(110, 8, 4, [-30, -5]), fill(C.line)), gr(rect(60, 8, 4, [-55, 9]), fill(C.soft)), gr(rect(40, 10, 5, [100, 0]), fill(C.line)), gr(rect(264, 44, 12), fill(C.white))];
out('features-add', comp('Features · add expense', 320, 200, 66, [
  layer('row 1', rowShapes(C.green), { p: [160, 30] }),
  layer('row 2', rowShapes(C.coral), { p: [160, 82] }),
  layer('new row', [gr(ell(26, [100, 0]), fill(C.green)), ...rowShapes(C.coral).slice(0, 3), gr(rect(264, 44, 12), fill(C.white)), gr(rect(266, 46, 13), stroke(C.green, 2))],
    { p: anim([[14, [160, 190, 0]], [34, [160, 134, 0]]]), o: anim([[14, 0], [26, 100]]) }),
  layer('tick', [gr(path([[-6, 0], [-1, 5], [7, -5]]), trim(anim([[36, 0], [52, 100]])), stroke(C.white, 3))], { p: [260, 134], o: anim([[35, 0], [36, 100]]) }),
  layer('plus button', [gr(path([[-8, 0], [8, 0]]), stroke(C.white, 3)), gr(path([[0, -8], [0, 8]]), stroke(C.white, 3)), gr(ell(40), fill(C.ink))],
    { p: [272, 182], s: anim([[0, [100, 100, 100]], [6, [84, 84, 100]], [14, [100, 100, 100]]]), o: anim([[30, 100], [40, 0]]) }),
]), svgWrap(320, 200, `
${[30, 82].map((y, n) => `<rect x="28" y="${y - 22}" width="264" height="44" rx="12" fill="#fff"/><circle cx="48" cy="${y}" r="11" fill="${hex(n ? C.coral : C.green)}"/><rect x="75" y="${y - 9}" width="110" height="8" rx="4" fill="${hex(C.line)}"/><rect x="75" y="${y + 5}" width="60" height="8" rx="4" fill="${hex(C.soft)}"/><rect x="240" y="${y - 5}" width="40" height="10" rx="5" fill="${hex(C.line)}"/>`).join('')}
<rect x="27" y="111" width="266" height="46" rx="13" fill="#fff" stroke="${hex(C.green)}" stroke-width="2"/><circle cx="48" cy="134" r="11" fill="${hex(C.coral)}"/><rect x="75" y="125" width="110" height="8" rx="4" fill="${hex(C.line)}"/><rect x="75" y="139" width="60" height="8" rx="4" fill="${hex(C.soft)}"/>
<circle cx="260" cy="134" r="13" fill="${hex(C.green)}"/><path d="M254 134l5 5 8-10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`));

// 3. Pricing: the plan toggle — knob slides monthly -> yearly, track turns green. Frames 0-30; site plays it both ways.
ind = 0;
out('pricing-toggle', comp('Pricing · plan toggle', 200, 90, 31, [
  layer('track off', [gr(rect(100, 52, 26), fill(C.line))], { p: [100, 45] }),
  layer('track on', [gr(rect(100, 52, 26), fill(C.green))], { p: [100, 45], o: anim([[0, 0], [30, 100]]) }),
  layer('knob', [gr(ell(40), fill(C.white))], { p: anim([[0, [76, 45, 0]], [30, [124, 45, 0]]]) }),
]), svgWrap(200, 90, `<rect x="50" y="19" width="100" height="52" rx="26" fill="${hex(C.green)}"/><circle cx="124" cy="45" r="20" fill="#fff"/>`));

// 4. Start: the check mark — ring draws, tick draws, small settle.
ind = 0;
out('start-check', comp('Start · check mark', 160, 160, 50, [
  layer('disc', [gr(ell(120), fill([0.894, 0.949, 0.929]))], { p: [80, 80], o: anim([[10, 0], [30, 100]]) }),
  layer('ring', [gr(ell(120), trim(anim([[0, 0], [24, 100]])), stroke(C.green, 7))], { p: [80, 80], s: anim([[30, [100, 100, 100]], [38, [106, 106, 100]], [48, [100, 100, 100]]]) }),
  layer('tick', [gr(path([[-22, 2], [-6, 18], [24, -16]]), trim(anim([[18, 0], [38, 100]])), stroke(C.green, 9))], { p: [80, 80] }),
]), svgWrap(160, 160, `<circle cx="80" cy="80" r="60" fill="#e4f2ed" stroke="${hex(C.green)}" stroke-width="7"/><path d="M58 82l16 16 30-34" fill="none" stroke="${hex(C.green)}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`));
console.log('ok');
