// Purpose-drawn illustration for the page templates (principles/imagery.md). Each function draws one real subject in
// its template's illustration style and returns an SVG data URL, so a section keeps a plain <img> (or Halftone) with
// honest alt text, and a project swaps in its own photograph later without touching layout. They replace the old
// abstract colour bands the templates used before, which depicted nothing and read as placeholders.
//   ceramic   shop-product      the plate and its batch, three-quarter view on linen, celadon or iron glaze
//   haveli    hotel             line elevations of the house: cusped arches, jali, a shaft of afternoon light
//   cover     studio / portfolio  project covers as typographic posters: an index number and one mark
//   survey    org               the river reaches as a survey plate: channels, banks, contours (screened by Halftone)
//   longTable studio            the studio at its long table, four people under pendant lamps, in flat shapes

const url = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
const rnd = (seed: number) => { let s = seed % 2147483647 || 1; return () => ((s = (s * 16807) % 2147483647) / 2147483647); };
const f = (n: number) => +n.toFixed(1);

// ── ceramic: one object from the batch, three-quarter view, on linen ─────────────────────────────────────────────
export type Ware = "plate" | "side" | "bowl" | "dish" | "cup" | "pitcher";
export function ceramic(kind: Ware, glaze: string, opts: { ground?: string; seed?: number; w?: number; h?: number } = {}): string {
  const { ground = "#e6dfd2", seed = 7, w = 800, h = 800 } = opts; const r = rnd(seed);
  const cx = w / 2, base = h * (kind === "plate" || kind === "side" || kind === "dish" ? 0.54 : 0.66);
  // linen: a fine weave, darker where the light falls off
  // linen: a fine weave as one pattern tile (a line each way), not hundreds of lines
  const weave = `<rect width="${w}" height="${h}" fill="url(#wv)"/>`;
  const speck = (x0: number, y0: number, rx: number, ry: number, n: number) => Array.from({ length: n }, () => { const a = r() * 6.283, d = Math.sqrt(r()); return `<circle cx="${f(x0 + Math.cos(a) * rx * d)}" cy="${f(y0 + Math.sin(a) * ry * d)}" r="${f(0.6 + r() * 1.4)}" fill="#2b241c" fill-opacity="${f(0.15 + r() * 0.3)}"/>`; }).join("");
  const defs = `<defs><pattern id="wv" width="7" height="6" patternUnits="userSpaceOnUse"><path d="M0 0.5H7" stroke="#000" stroke-opacity=".05"/><path d="M0.5 0V6" stroke="#fff" stroke-opacity=".08"/></pattern><radialGradient id="gl" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".55" stop-color="${glaze}" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></radialGradient><radialGradient id="pool" cx=".5" cy=".55" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient><radialGradient id="sh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>`;
  let body = "";
  const flat = (R: number) => { const ry = R * 0.42; // plate seen from about 25° above
    return `<ellipse cx="${cx}" cy="${base + ry * 0.35}" rx="${R * 1.08}" ry="${ry * 0.9}" fill="url(#sh)"/>`
      + `<ellipse cx="${cx}" cy="${base}" rx="${R}" ry="${ry}" fill="${glaze}"/><ellipse cx="${cx}" cy="${base}" rx="${R}" ry="${ry}" fill="url(#gl)"/>`
      + `<ellipse cx="${cx}" cy="${base + ry * 0.06}" rx="${R * 0.62}" ry="${ry * 0.6}" fill="url(#pool)"/><ellipse cx="${cx}" cy="${base + ry * 0.06}" rx="${R * 0.62}" ry="${ry * 0.6}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="1.5"/>`
      + `<ellipse cx="${cx}" cy="${base}" rx="${R}" ry="${ry}" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="2"/>` + speck(cx, base, R * 0.9, ry * 0.85, 40); };
  const vessel = (top: number, R: number, H: number, foot: number) => { const ry = R * 0.3, y = base - H; // rim ellipse at y, foot at base
    const side = `M${cx - R} ${y} C${cx - R} ${y + H * 0.7} ${cx - foot * 1.2} ${base} ${cx - foot} ${base} L${cx + foot} ${base} C${cx + foot * 1.2} ${base} ${cx + R} ${y + H * 0.7} ${cx + R} ${y}Z`;
    return `<ellipse cx="${cx}" cy="${base + 8}" rx="${R * 1.1}" ry="${R * 0.22}" fill="url(#sh)"/><path d="${side}" fill="${glaze}"/><path d="${side}" fill="url(#gl)"/>`
      + `<path d="M${cx - foot} ${base} L${cx + foot} ${base} L${cx + foot * 0.96} ${base - H * 0.08} L${cx - foot * 0.96} ${base - H * 0.08}Z" fill="#c9b79a"/>` // unglazed foot, the clay showing
      + `<ellipse cx="${cx}" cy="${y}" rx="${R}" ry="${ry}" fill="${glaze}"/><ellipse cx="${cx}" cy="${y + ry * 0.12}" rx="${R * 0.9}" ry="${ry * 0.82}" fill="#000" fill-opacity=".22"/>`
      + `<ellipse cx="${cx}" cy="${y}" rx="${R}" ry="${ry}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="2"/>` + speck(cx, y + H * 0.45, R * 0.8, H * 0.35, 26) + (top ? "" : ""); };
  if (kind === "plate") body = flat(w * 0.36);
  else if (kind === "side") body = flat(w * 0.26);
  else if (kind === "dish") body = flat(w * 0.4).replace(/ry="([\d.]+)"/g, (m, v) => `ry="${f(+v * 0.85)}"`);
  else if (kind === "bowl") body = vessel(0, w * 0.27, h * 0.2, w * 0.1);
  else if (kind === "cup") body = vessel(0, w * 0.15, h * 0.24, w * 0.08) + `<path d="M${cx + w * 0.15} ${base - h * 0.19} c${w * 0.1} 0 ${w * 0.1} ${h * 0.12} ${-w * 0.02} ${h * 0.13}" fill="none" stroke="${glaze}" stroke-width="${w * 0.025}" stroke-linecap="round"/>`;
  else if (kind === "pitcher") body = vessel(0, w * 0.14, h * 0.42, w * 0.11) + `<path d="M${cx - w * 0.14} ${base - h * 0.42} l${-w * 0.06} ${-h * 0.03} l${w * 0.04} ${h * 0.05}Z" fill="${glaze}"/><path d="M${cx + w * 0.13} ${base - h * 0.36} c${w * 0.13} ${h * 0.02} ${w * 0.12} ${h * 0.2} ${-w * 0.01} ${h * 0.24}" fill="none" stroke="${glaze}" stroke-width="${w * 0.03}" stroke-linecap="round"/>`;
  return url(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${defs}<rect width="${w}" height="${h}" fill="${ground}"/>${weave}<rect width="${w}" height="${h}" fill="url(#sh)" opacity=".25"/>${body}</svg>`);
}

// ── haveli: line elevations of an old Sonargaon house ───────────────────────────────────────────────────────────
export type Room = "neem" | "well" | "safe" | "dovecote" | "bath";
const ROOM_AT: Record<Room, number> = { neem: 0.1, well: 0.6, safe: 0.14, dovecote: 0.58, bath: 0.36 }; // where the window sits, so no two rooms frame alike
export function haveli(view: "courtyard" | "room", seed: number, c: { wall: string; ink: string; light: string }, w = 1600, h = 1000, room?: Room): string {
  const r = rnd(seed); const floor = h * 0.8; const n = view === "courtyard" ? 3 : 1;
  const arch = (x: number, aw: number, top: number) => { const s = aw / 2, cy = top + aw * 0.42; // cusped (multifoil) arch
    const lobes = [0.2, 0.5, 0.8].map((t) => `${f(x + aw * t)} ${f(cy - aw * (0.32 - Math.abs(t - 0.5) * 0.28))}`);
    return `<path d="M${x} ${floor} V${cy} Q${x} ${top + aw * 0.2} ${lobes[0]} Q${x + s} ${top - aw * 0.06} ${lobes[1]} Q${x + s} ${top - aw * 0.06} ${lobes[2]} Q${x + aw} ${top + aw * 0.2} ${x + aw} ${cy} V${floor}Z" fill="${c.ink}" fill-opacity=".82" stroke="${c.ink}" stroke-width="3"/>`
      + `<path d="M${x - 14} ${floor} V${cy - 10} Q${x - 14} ${top + aw * 0.1} ${x + s} ${top - aw * 0.18} Q${x + aw + 14} ${top + aw * 0.1} ${x + aw + 14} ${cy - 10} V${floor}" fill="none" stroke="${c.ink}" stroke-opacity=".5" stroke-width="2"/>`; };
  const aw = view === "courtyard" ? w * 0.16 : w * 0.24; const gap = room ? w * ROOM_AT[room] : (w - n * aw) / (n + 1);
  let parts = `<rect width="${w}" height="${h}" fill="${c.wall}"/>`
    + Array.from({ length: 14 }, (_, i) => `<line x1="0" y1="${f(h * 0.08 + i * h * 0.05)}" x2="${w}" y2="${f(h * 0.08 + i * h * 0.05 + (r() - 0.5) * 3)}" stroke="${c.ink}" stroke-opacity=".06"/>`).join("") // lime-plaster courses
    + `<rect x="0" y="${floor}" width="${w}" height="${h - floor}" fill="${c.ink}" fill-opacity=".16"/><line x1="0" y1="${floor}" x2="${w}" y2="${floor}" stroke="${c.ink}" stroke-width="3"/>`
    + `<rect x="0" y="${h * 0.06}" width="${w}" height="${h * 0.035}" fill="${c.ink}" fill-opacity=".25"/>`; // cornice
  for (let i = 0; i < n; i++) parts += arch(gap + i * (aw + gap), aw, h * 0.26);
  if (view === "room") { const x = gap + aw * 0.18, y = h * 0.42, jw = aw * 0.64, jh = h * 0.3, cols = 6 + Math.floor(r() * 6), rows = 4 + Math.floor(r() * 4); const k = room || "neem";
    parts += `<rect x="${x}" y="${y}" width="${jw}" height="${jh}" fill="${c.light}" fill-opacity=".85"/>`;
    if (k === "neem") parts += Array.from({ length: 9 }, () => `<circle cx="${f(x + r() * jw)}" cy="${f(y + r() * jh)}" r="${f(jh * (0.12 + r() * 0.1))}" fill="${c.ink}" fill-opacity=".45"/>`).join(""); // the tree at the window
    if (k === "well") parts += `<rect x="${x}" y="${f(y + jh * 0.62)}" width="${jw}" height="${f(jh * 0.38)}" fill="${c.ink}" fill-opacity=".25"/><ellipse cx="${f(x + jw / 2)}" cy="${f(y + jh * 0.74)}" rx="${f(jw * 0.22)}" ry="${f(jh * 0.07)}" fill="${c.ink}" fill-opacity=".8"/><rect x="${f(x + jw * 0.28)}" y="${f(y + jh * 0.74)}" width="${f(jw * 0.44)}" height="${f(jh * 0.14)}" fill="${c.ink}" fill-opacity=".55"/>`; // looking down into the courtyard well
    else parts += Array.from({ length: cols - 1 }, (_, i) => `<line x1="${f(x + (i + 1) * jw / cols)}" y1="${y}" x2="${f(x + (i + 1) * jw / cols)}" y2="${y + jh}" stroke="${c.ink}" stroke-width="5"/>`).join("") + Array.from({ length: rows - 1 }, (_, i) => `<line x1="${x}" y1="${f(y + (i + 1) * jh / rows)}" x2="${x + jw}" y2="${f(y + (i + 1) * jh / rows)}" stroke="${c.ink}" stroke-width="5"/>`).join(""); // the jali
    const away = gap < w * 0.4 ? w * 0.52 : w * 0.08; // the room's object sits across from the window
    if (k === "neem" || k === "dovecote") parts += `<rect x="${f(away)}" y="${floor - h * 0.1}" width="${w * 0.32}" height="${h * 0.035}" fill="${c.ink}" fill-opacity=".7"/><rect x="${f(away + w * 0.01)}" y="${floor - h * 0.065}" width="10" height="${h * 0.065}" fill="${c.ink}"/><rect x="${f(away + w * 0.3)}" y="${floor - h * 0.065}" width="10" height="${h * 0.065}" fill="${c.ink}"/>`; // a charpai
    if (k === "dovecote") parts += Array.from({ length: 9 }, (_, i) => `<path d="M${f(w * 0.06 + i * w * 0.1)} ${f(h * 0.24)} v${-h * 0.06} q${w * 0.025} ${-h * 0.05} ${w * 0.05} 0 v${h * 0.06}Z" fill="${c.ink}" fill-opacity=".75"/>`).join(""); // the dovecote niches under the cornice
    if (k === "safe") parts += `<rect x="${f(away + w * 0.08)}" y="${f(floor - h * 0.3)}" width="${w * 0.16}" height="${h * 0.3}" fill="${c.ink}" fill-opacity=".85"/><circle cx="${f(away + w * 0.16)}" cy="${f(floor - h * 0.17)}" r="${h * 0.03}" fill="none" stroke="${c.light}" stroke-width="4"/><line x1="${f(away + w * 0.09)}" y1="${f(floor - h * 0.26)}" x2="${f(away + w * 0.23)}" y2="${f(floor - h * 0.26)}" stroke="${c.light}" stroke-opacity=".6" stroke-width="2"/>`; // the iron safe
    if (k === "bath") parts += `<rect x="${f(w * 0.06)}" y="${f(floor - h * 0.14)}" width="${w * 0.26}" height="${h * 0.14}" rx="${h * 0.05}" fill="${c.wall}" stroke="${c.ink}" stroke-width="4"/><rect x="${f(w * 0.08)}" y="${f(floor - h * 0.12)}" width="${w * 0.22}" height="${h * 0.03}" rx="${h * 0.015}" fill="${c.ink}" fill-opacity=".3"/><rect x="${w * 0.7}" y="${f(floor - h * 0.05)}" width="${w * 0.14}" height="${h * 0.05}" fill="${c.ink}" fill-opacity=".5"/><rect x="${w * 0.73}" y="${f(floor - h * 0.1)}" width="${w * 0.11}" height="${h * 0.05}" fill="${c.ink}" fill-opacity=".35"/>`; } // the stone tank and its steps
  else { const wx = w * 0.78; parts += `<rect x="${wx - 60}" y="${floor - 70}" width="120" height="70" fill="${c.ink}" fill-opacity=".6"/><ellipse cx="${wx}" cy="${floor - 70}" rx="60" ry="14" fill="${c.ink}" fill-opacity=".8"/>` // the well
      + `<rect x="${w * 0.055}" y="${floor - h * 0.34}" width="16" height="${h * 0.34}" fill="${c.ink}" fill-opacity=".7"/>` + Array.from({ length: 16 }, () => `<circle cx="${f(w * 0.06 + (r() - 0.5) * w * 0.07)}" cy="${f(floor - h * 0.38 + (r() - 0.5) * h * 0.16)}" r="${f(h * 0.025 + r() * h * 0.02)}" fill="${c.ink}" fill-opacity=".55"/>`).join(""); } // the neem
  // the shaft of afternoon light: one hard parallelogram from the upper left, landing as a pool on the floor
  const lx = w * (0.28 + r() * 0.1); parts += `<path d="M${lx} 0 L${lx + w * 0.12} 0 L${lx + w * 0.42} ${floor} L${lx + w * 0.26} ${floor}Z" fill="${c.light}" fill-opacity=".28"/><path d="M${lx + w * 0.26} ${floor} L${lx + w * 0.42} ${floor} L${lx + w * 0.47} ${h} L${lx + w * 0.3} ${h}Z" fill="${c.light}" fill-opacity=".45"/>`;
  return url(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${parts}</svg>`);
}

// ── cover: a project cover as a typographic poster (index number + one mark) ───────────────────────────────────
export function cover(i: number, c: [string, string, string], w = 400, h = 300): string {
  const [ground, a, b] = c; const marks = [
    `<circle cx="${w * 0.7}" cy="${h * 0.42}" r="${h * 0.26}" fill="${a}"/>`,
    `<rect x="${w * 0.52}" y="${h * 0.12}" width="${w * 0.12}" height="${h * 0.76}" fill="${a}"/><rect x="${w * 0.7}" y="${h * 0.12}" width="${w * 0.12}" height="${h * 0.76}" fill="${b}"/>`,
    `<path d="M${w * 0.45} ${h * 0.85} L${w * 0.72} ${h * 0.15} L${w * 0.95} ${h * 0.85}Z" fill="${a}"/>`,
    `<path d="M${w * 0.5} ${h * 0.5} h${w * 0.42} M${w * 0.71} ${h * 0.18} v${h * 0.64}" stroke="${b}" stroke-width="${h * 0.08}"/>`,
    `<circle cx="${w * 0.72}" cy="${h * 0.5}" r="${h * 0.3}" fill="none" stroke="${a}" stroke-width="${h * 0.06}"/><circle cx="${w * 0.72}" cy="${h * 0.5}" r="${h * 0.1}" fill="${b}"/>`,
  ];
  return url(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${ground}"/>${marks[(i - 1) % marks.length]}<text x="${w * 0.06}" y="${h * 0.86}" font-family="Georgia, serif" font-size="${h * 0.42}" fill="${b}">${String(i).padStart(2, "0")}</text><line x1="${w * 0.06}" y1="${h * 0.12}" x2="${w * 0.36}" y2="${h * 0.12}" stroke="${b}" stroke-width="2"/></svg>`);
}

// ── survey: the river reaches as a survey plate ─────────────────────────────────────────────────────────────────
export function survey(c: { paper: string; water: string; land: string }, w = 720, h = 480, seed = 133): string {
  const r = rnd(seed); const river = (y0: number, amp: number, width: number) => { const pts = Array.from({ length: 7 }, (_, i) => [i * w / 6, y0 + Math.sin(i * 1.3 + r() * 2) * amp]);
    const d = pts.map(([x, y], i) => (i ? `S${f(x - w / 12)} ${f(y)} ${f(x)} ${f(y)}` : `M${x} ${f(y)}`)).join(" ");
    return `<path d="${d}" fill="none" stroke="${c.water}" stroke-width="${width}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c.paper}" stroke-opacity=".5" stroke-width="${width * 0.25}" stroke-dasharray="2 14"/>`; };
  const contours = Array.from({ length: 9 }, (_, k) => { const y = h * 0.08 + k * h * 0.11; return `<path d="M0 ${f(y)} C${w * 0.3} ${f(y - 30 + r() * 60)} ${w * 0.6} ${f(y - 30 + r() * 60)} ${w} ${f(y)}" fill="none" stroke="${c.land}" stroke-opacity=".45" stroke-width="1.5"/>`; }).join("");
  return url(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${c.paper}"/><rect x="0" y="${h * 0.55}" width="${w}" height="${h * 0.45}" fill="${c.land}" fill-opacity=".25"/>${contours}${river(h * 0.28, h * 0.06, 22)}${river(h * 0.55, h * 0.08, 30)}${river(h * 0.8, h * 0.05, 16)}<rect x="12" y="12" width="${w - 24}" height="${h - 24}" fill="none" stroke="${c.land}" stroke-width="2"/></svg>`);
}

// ── longTable: the studio at work, flat shapes ──────────────────────────────────────────────────────────────────
export function longTable(c: [string, string, string], w = 1400, h = 700): string {
  const [wall, a, b] = c; const top = h * 0.62;
  const person = (x: number, k: number) => `<circle cx="${x}" cy="${top - h * 0.27}" r="${h * 0.055}" fill="${k % 2 ? a : b}"/><path d="M${x - h * 0.1} ${top} Q${x - h * 0.1} ${top - h * 0.19} ${x} ${top - h * 0.2} Q${x + h * 0.1} ${top - h * 0.19} ${x + h * 0.1} ${top}Z" fill="${k % 2 ? b : a}"/>`;
  const lamp = (x: number) => `<line x1="${x}" y1="0" x2="${x}" y2="${h * 0.2}" stroke="${b}" stroke-width="3"/><path d="M${x - h * 0.06} ${h * 0.26} L${x} ${h * 0.2} L${x + h * 0.06} ${h * 0.26}Z" fill="${b}"/><path d="M${x - h * 0.06} ${h * 0.26} L${x - h * 0.18} ${top} L${x + h * 0.18} ${top} L${x + h * 0.06} ${h * 0.26}Z" fill="#fff" fill-opacity=".18"/>`;
  const xs = [0.2, 0.4, 0.6, 0.8].map((t) => w * t);
  return url(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${wall}"/>`
    + Array.from({ length: 6 }, (_, i) => `<rect x="${w * 0.08 + i * w * 0.145}" y="${h * 0.08}" width="${w * 0.12}" height="${h * 0.3}" fill="#fff" fill-opacity=".22"/>`).join("") // the windows behind
    + xs.map(lamp).join("") + xs.map(person).join("")
    + `<rect x="${w * 0.08}" y="${top}" width="${w * 0.84}" height="${h * 0.04}" fill="${b}"/><rect x="${w * 0.12}" y="${top + h * 0.04}" width="${h * 0.025}" height="${h * 0.3}" fill="${b}"/><rect x="${w * 0.86}" y="${top + h * 0.04}" width="${h * 0.025}" height="${h * 0.3}" fill="${b}"/>`
    + xs.map((x, i) => `<rect x="${x - h * 0.08}" y="${top - h * 0.02}" width="${h * 0.12}" height="${h * 0.02}" fill="#fff" fill-opacity=".8" transform="rotate(${(i % 2 ? 4 : -3)} ${x} ${top})"/>`).join("") // papers
    + `</svg>`);
}
