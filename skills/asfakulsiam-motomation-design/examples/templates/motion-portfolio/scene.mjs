// Scene for the motion-portfolio template: "The Cut", a title designer's reel in four shots.
// Rendered to frames by scripts/build-frames.mjs (see its header for the contract). Pure: no Date, no Math.random.
//   01 Slit    0.00–0.25  a slit of sodium light opens across the dark (push: none, the frame holds)
//   02 Ribbon  0.25–0.50  the slit lifts into a ribbon that twists through depth (truck: camera slides with it)
//   03 Gates   0.50–0.75  the ribbon folds into film gates receding to a vanishing point (push: camera moves in)
//   04 Cut     0.75–1.00  the gates close into one lit frame, then the light cuts to a single outline (hold)
export const scene = { name: "motion-portfolio · The Cut", desktop: [16, 9], mobile: [9, 16], stills: [0.14, 0.4, 0.64, 0.9], seed: 11 };

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (p, a, b) => clamp((p - a) / (b - a));
const ease = (t) => 1 - Math.pow(1 - t, 3);
const inout = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const AMBER = [242, 165, 65], WHITE = [238, 232, 220], GROUND = "#0A0D12";
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;

export function render(ctx, p, w, h, rand) {
  const u = Math.min(w, h), portrait = h > w;
  ctx.fillStyle = GROUND; ctx.fillRect(0, 0, w, h);
  const cx = w / 2, cy = h * (portrait ? 0.42 : 0.47);

  // dust in the beam: fixed seeded motes, drifting with p (deterministic)
  const motes = 70;
  for (let i = 0; i < motes; i++) {
    const x0 = rand(), y0 = rand(), z = 0.3 + rand() * 0.7, ph = rand() * 6.28;
    const x = ((x0 + p * 0.25 * z) % 1) * w, y = cy + (y0 - 0.5) * u * 0.5 + Math.sin(ph + p * 9) * u * 0.01;
    const glow = seg(p, 0.02, 0.16) * (1 - seg(p, 0.86, 0.98)) * (0.08 + 0.18 * z);
    ctx.fillStyle = rgba(WHITE, glow); ctx.fillRect(x, y, 1.5 * z * (u / 900), 1.5 * z * (u / 900));
  }

  const open = ease(seg(p, 0.03, 0.2));          // 01: the slit opens
  const lift = inout(seg(p, 0.25, 0.5));         // 02: becomes a ribbon
  const fold = inout(seg(p, 0.5, 0.74));         // 03: folds into gates
  const close = inout(seg(p, 0.76, 0.9));        // 04: gates close into one frame
  const cut = seg(p, 0.92, 0.96);                // 04: the light cuts

  // 01–02 the ribbon: a strip sampled along x; height and twist grow with lift, it fades as it folds
  const ribbonA = (1 - fold * 0.95) * (1 - cut);
  if (ribbonA > 0.01) {
    const n = 140, len = w * (0.15 + 0.85 * open) * (1 - 0.35 * lift);
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1), x = cx + (t - 0.5) * len;
      const twist = lift * (t * 5.2 + p * 7);
      const amp = lift * u * 0.12 * Math.sin(t * Math.PI * 1.6 + p * 4);
      const half = (u * 0.004 + lift * u * 0.07) * Math.abs(Math.cos(twist)) + u * 0.0015;
      const face = 0.55 + 0.45 * Math.cos(twist);
      const y = cy + amp;
      const col = face > 0.6 ? AMBER : WHITE;
      const edge = Math.sin(t * Math.PI);
      ctx.fillStyle = rgba(col, ribbonA * (0.25 + 0.75 * face) * (0.35 + 0.65 * edge) * (0.3 + 0.7 * open));
      ctx.fillRect(x, y - half, len / n + 1, half * 2);
    }
    // the slit's bloom
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, u * (0.25 + 0.3 * open));
    g.addColorStop(0, rgba(AMBER, 0.18 * open * ribbonA)); g.addColorStop(1, rgba(AMBER, 0));
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }

  // 03–04 the gates: rectangles receding to the vanishing point; the camera pushes in (scale grows)
  const gatesA = fold * (1 - cut);
  if (gatesA > 0.01) {
    const count = 14, push = fold * 0.9 + close * 0.6;
    const ar = portrait ? 0.7 : 1.5;
    for (let k = count - 1; k >= 0; k--) {
      const d = ((k + push * 3) % count) / count;          // depth 0 (near) … 1 (far), drifting toward the camera
      const s = (1 - close) * (0.06 + 1.1 * Math.pow(1 - d, 2.2)) + close * 0.34;
      const gw = u * s * ar, gh = u * s;
      const a = gatesA * (0.15 + 0.85 * (1 - d)) * (1 - close * 0.85 * (k ? 1 : 0));
      ctx.strokeStyle = rgba(k % 5 === 0 ? AMBER : WHITE, a);
      ctx.lineWidth = Math.max(1, u * 0.002 * (1.4 - d));
      ctx.strokeRect(cx - gw / 2, cy - gh / 2, gw, gh);
    }
    // the closing frame fills with light
    if (close > 0) {
      const s = 0.34, gw = u * s * ar, gh = u * s;
      const g = ctx.createLinearGradient(cx - gw / 2, cy, cx + gw / 2, cy);
      g.addColorStop(0, rgba(AMBER, 0.85 * close)); g.addColorStop(1, rgba(WHITE, 0.75 * close));
      ctx.fillStyle = g; ctx.fillRect(cx - gw / 2, cy - gh / 2, gw, gh);
    }
  }

  // 04 after the cut: one outline holds
  if (cut > 0) {
    const ar = portrait ? 0.7 : 1.5, s = 0.34, gw = u * s * ar, gh = u * s;
    ctx.strokeStyle = rgba(AMBER, cut); ctx.lineWidth = Math.max(1, u * 0.002);
    ctx.strokeRect(cx - gw / 2, cy - gh / 2, gw, gh);
    ctx.fillStyle = rgba(AMBER, cut * 0.9);
    ctx.fillRect(cx - gw / 2, cy + gh / 2 + u * 0.03, gw * seg(p, 0.95, 1), Math.max(1, u * 0.002));
  }

  // letterbox bars come in as the reel starts and stay: the frame is a film frame from shot 02 on
  const bar = (portrait ? 0 : h * 0.07) * ease(seg(p, 0.22, 0.32));
  if (bar > 0) { ctx.fillStyle = "#000"; ctx.fillRect(0, 0, w, bar); ctx.fillRect(0, h - bar, w, bar); }
}
