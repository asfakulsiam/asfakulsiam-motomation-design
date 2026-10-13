// Scene for the product-launch template: "Shapla R1", a kitchen radio, turned and taken apart in five beats.
// Rendered to frames by scripts/build-frames.mjs (see its header for the contract). Pure: no Date, no Math.random.
// A small flat-shaded 3D renderer: boxes in the radio's local space, rotated, perspective-projected, painter-sorted.
//   01 Face     0.00–0.20  front-on, the camera pushes in a little (the page opens it through an aperture)
//   02 Profile  0.20–0.40  the radio turns to three-quarters (orbit)
//   03 Inside   0.40–0.70  the five layers separate along the depth axis (exploded view)
//   04 Closed   0.70–0.85  the layers come back together (assembly)
//   05 Tune     0.85–1.00  the dial needle sweeps to a station and the dial window warms (hold)
export const scene = { name: "product-launch · Shapla R1", desktop: [4, 3], mobile: [4, 5], stills: [0.1, 0.32, 0.6, 0.95], seed: 3 };

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (p, a, b) => clamp((p - a) / (b - a));
const io = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const PAPER = [233, 228, 216], RED = [201, 64, 38], ALU = [204, 200, 191], BOARD = [32, 86, 70], CELL = [58, 56, 52], INK = [25, 24, 20];
const shade = (c, k) => `rgb(${c.map((v) => Math.round(Math.min(255, v * k))).join(",")})`;

// parts: [name, centre z, width, height, depth, colour, exploded centre z]; z grows toward the viewer. The two shells meet at z = 0, so
// assembled they are one closed box; the three inner parts are drawn only once the shells have opened (burst > 0.05)
const PARTS = [
  ["back", -0.125, 1.6, 1.0, 0.25, RED, -0.95],
  ["cell", -0.06, 0.9, 0.26, 0.14, CELL, -0.42],
  ["board", 0.04, 1.42, 0.86, 0.03, BOARD, -0.02],
  ["plate", 0.11, 1.5, 0.92, 0.025, ALU, 0.38],
  ["front", 0.125, 1.6, 1.0, 0.25, RED, 0.9],
];

export function render(ctx, p, w, h) {
  ctx.fillStyle = shade(PAPER, 1); ctx.fillRect(0, 0, w, h);
  const portrait = h > w, U = Math.min(w, h) * (portrait ? 0.3 : 0.38);
  const cx = w * 0.5, cy = h * (portrait ? 0.5 : 0.52);

  const push = io(seg(p, 0, 0.2)), turn = io(seg(p, 0.2, 0.4)), apart = io(seg(p, 0.4, 0.62)), back = io(seg(p, 0.7, 0.85)), tune = io(seg(p, 0.86, 0.97));
  const burst = apart * (1 - back);
  const yaw = -0.68 * turn - 0.3 * apart + 0.42 * back, pitch = 0.26 * turn + 0.08 * apart - 0.1 * back;
  const scale = U * (0.88 + 0.1 * push - 0.12 * burst);
  const cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const P = ([x, y, z]) => { // local → camera → screen
    const x1 = x * cyw + z * syw, z1 = -x * syw + z * cyw;
    const y1 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
    const f = 4.2 / (4.2 - z2);
    return [cx + x1 * scale * f, cy - y1 * scale * f, z2];
  };
  const L = [-0.45, 0.6, 0.66]; const ln = Math.hypot(...L); const light = L.map((v) => v / ln);
  const rot = ([x, y, z]) => { const x1 = x * cyw + z * syw, z1 = -x * syw + z * cyw; return [x1, y * cp - z1 * sp, y * sp + z1 * cp]; };

  // the floor shadow: tighter when assembled, wider and fainter when apart
  const sh = ctx.createRadialGradient(cx, cy + scale * 0.72, 0, cx, cy + scale * 0.72, scale * (1.1 + 0.5 * burst));
  sh.addColorStop(0, `rgba(25,24,20,${0.22 - 0.08 * burst})`); sh.addColorStop(1, "rgba(25,24,20,0)");
  ctx.save(); ctx.translate(0, cy + scale * 0.72); ctx.scale(1, 0.18); ctx.translate(0, -(cy + scale * 0.72));
  ctx.fillStyle = sh; ctx.fillRect(0, 0, w, h * 3); ctx.restore();

  // painter's order per part: the parts are slabs along the radio's depth axis, so sorting whole parts by the depth of
  // their centre is exact for this object; inside a part, back faces are culled (each part is a convex box)
  const groups = [];
  PARTS.forEach(([name, z0, bw, bh, bd, col, zx], idx) => {
    if (idx > 0 && idx < PARTS.length - 1 && burst < 0.05) return;
    const faces = [];
    const z = z0 + (zx - z0) * burst, y = (idx - 2) * 0.05 * burst;
    const X = bw / 2, Y = bh / 2, Z = bd / 2;
    const v = [[-X, -Y, -Z], [X, -Y, -Z], [X, Y, -Z], [-X, Y, -Z], [-X, -Y, Z], [X, -Y, Z], [X, Y, Z], [-X, Y, Z]].map(([a, b, c]) => [a, b + y, c + z]);
    const quads = [[[4, 5, 6, 7], [0, 0, 1]], [[1, 0, 3, 2], [0, 0, -1]], [[5, 1, 2, 6], [1, 0, 0]], [[0, 4, 7, 3], [-1, 0, 0]], [[7, 6, 2, 3], [0, 1, 0]], [[0, 1, 5, 4], [0, -1, 0]]];
    for (const [q, n] of quads) {
      const nr = rot(n); if (nr[2] <= 0.001) continue; // facing away
      const pts = q.map((i) => P(v[i])); const depth = pts.reduce((s, t) => s + t[2], 0) / 4;
      const k = 0.62 + 0.42 * Math.max(0, nr[0] * light[0] + nr[1] * light[1] + nr[2] * light[2]);
      faces.push({ pts, depth, fill: shade(col, k), name, front: n[2] === 1, z: z + Z, y, bw, bh });
    }
    groups.push({ depth: P([0, y, z])[2], faces });
  });
  groups.sort((a, b) => a.depth - b.depth);
  for (const f of groups.flatMap((g) => g.faces)) {
    ctx.beginPath(); f.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath();
    ctx.fillStyle = f.fill; ctx.fill();
    ctx.strokeStyle = "rgba(25,24,20,0.18)"; ctx.lineWidth = Math.max(1, U * 0.003); ctx.stroke();
    if (f.front && f.name === "front") frontDetails(f);
    if (f.front && f.name === "board") boardDetails(f);
  }

  function onFace(f, x, y) { return P([x, y + f.y, f.z + 0.001]); }
  function frontDetails(f) {
    // speaker grille: a field of holes on the left two thirds
    ctx.fillStyle = shade(INK, 1.4);
    for (let i = 0; i < 13; i++) for (let j = 0; j < 9; j++) {
      const [x, y] = onFace(f, -0.68 + i * 0.07, -0.34 + j * 0.085); ctx.beginPath(); ctx.arc(x, y, U * 0.011, 0, 6.283); ctx.fill();
    }
    // dial window on the right: a ring, a scale, and the needle that sweeps on beat 05
    const dx = 0.5, dy = 0, r = 0.24;
    const ring = (rr) => { ctx.beginPath(); for (let k = 0; k <= 48; k++) { const a = (k / 48) * 6.283; const [x, y] = onFace(f, dx + rr * Math.cos(a), dy + rr * Math.sin(a)); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); };
    ring(r); ctx.fillStyle = `rgb(${Math.round(240 - 10 * (1 - tune))},${Math.round(228 - 18 * (1 - tune))},${Math.round(200 - 30 * (1 - tune))})`; ctx.fill();
    ctx.strokeStyle = shade(INK, 1); ctx.lineWidth = Math.max(1, U * 0.006); ring(r); ctx.stroke();
    for (let k = 0; k <= 20; k++) { const a = Math.PI * (0.8 + 1.4 * (k / 20)); const r1 = k % 5 ? r * 0.82 : r * 0.72;
      const [x1, y1] = onFace(f, dx + r1 * Math.cos(a), dy + r1 * Math.sin(a)), [x2, y2] = onFace(f, dx + r * 0.92 * Math.cos(a), dy + r * 0.92 * Math.sin(a));
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineWidth = Math.max(1, U * 0.004); ctx.stroke(); }
    const a = Math.PI * (0.8 + 1.4 * (0.18 + 0.52 * tune));
    const [n1, m1] = onFace(f, dx, dy), [n2, m2] = onFace(f, dx + r * 0.86 * Math.cos(a), dy + r * 0.86 * Math.sin(a));
    ctx.beginPath(); ctx.moveTo(n1, m1); ctx.lineTo(n2, m2); ctx.strokeStyle = shade(RED, 0.9); ctx.lineWidth = Math.max(1.5, U * 0.01); ctx.stroke();
    // the tuning knob below the dial
    const [kx, ky] = onFace(f, 0.5, -0.38); ctx.beginPath(); ctx.arc(kx, ky, U * 0.045, 0, 6.283); ctx.fillStyle = shade(ALU, 0.9); ctx.fill();
  }
  function boardDetails(f) {
    // traces and chips: visible only when the radio is apart
    ctx.strokeStyle = "rgba(214, 196, 120, 0.8)"; ctx.lineWidth = Math.max(1, U * 0.004);
    for (let i = 0; i < 9; i++) { const [x1, y1] = onFace(f, -0.62, -0.32 + i * 0.08), [x2, y2] = onFace(f, 0.3, -0.32 + i * 0.08 + (i % 3) * 0.03); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
    ctx.fillStyle = shade(INK, 1.1);
    for (const [x, y, s] of [[0.42, 0.1, 0.14], [0.42, -0.2, 0.09], [-0.2, 0.25, 0.1]]) {
      const q = [[x - s, y - s], [x + s, y - s], [x + s, y + s], [x - s, y + s]].map(([a, b]) => onFace(f, a, b));
      ctx.beginPath(); q.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b))); ctx.closePath(); ctx.fill();
    }
  }
}
