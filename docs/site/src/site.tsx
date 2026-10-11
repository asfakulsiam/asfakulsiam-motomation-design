// Motomation docs site: one page per component (live demo, prop playground, copy and install, notes), search across
// all components, a reduced-motion toggle and a 375 px mobile preview. The demos are the gallery's (examples/gallery/
// demos.tsx), not rebuilt here. Built by scripts/build-docs-site.mjs into docs/site/.
import { Children, cloneElement, isValidElement, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { DEMOS, COMPONENTS, FAMILY_TITLES, RAW } from "../../../skills/asfakulsiam-motomation-design/examples/gallery/demos";

type Prop = { name: string; type: string; optional: boolean; def: string | null; control: "number" | "string" | "boolean" | "select" | null; options?: string[] };
type Entry = { id: string; name: string; family: string; tier: string; what: string; use_when: string; avoid_when: string; reduced_motion: string; touch: string; a11y: string; file: string; props: Prop[]; plain: boolean };
declare const SITE: { components: Entry[]; repo: string };
const ALL = SITE.components;
const byId = Object.fromEntries(ALL.map((c) => [c.id, c]));
const page = document.body.dataset.page || "index", ID = document.body.dataset.id || "";
const qs = new URLSearchParams(location.search);
const FRAME = qs.has("frame");
const ROOT = page === "index" ? "" : "../";
const install = (id: string) => `npx shadcn@latest add ${RAW}/registry/${id}.json`;

// ── reduced motion: a site-wide override of the (prefers-reduced-motion: reduce) query, so every component's own
//    useReducedMotion follows the toggle live. Off / on / follow the system; stored in localStorage.
const RM_Q = "(prefers-reduced-motion: reduce)";
const sysMM = window.matchMedia.bind(window);
const rmListeners = new Set<(e: MediaQueryListEvent) => void>();
const rmStored = () => { const f = qs.get("rm") ?? localStorage.getItem("mm-rm"); return f === "1" ? true : f === "0" ? false : null; };
const rmNow = () => rmStored() ?? sysMM(RM_Q).matches;
window.matchMedia = ((q: string) => {
  if (q.replace(/\s+/g, " ").trim() !== RM_Q) return sysMM(q);
  const mql = { get matches() { return rmNow(); }, media: RM_Q, onchange: null,
    addEventListener: (_: string, f: (e: MediaQueryListEvent) => void) => rmListeners.add(f), removeEventListener: (_: string, f: (e: MediaQueryListEvent) => void) => rmListeners.delete(f),
    addListener: (f: (e: MediaQueryListEvent) => void) => rmListeners.add(f), removeListener: (f: (e: MediaQueryListEvent) => void) => rmListeners.delete(f), dispatchEvent: () => true };
  return mql as unknown as MediaQueryList;
}) as typeof window.matchMedia;
function setRM(v: boolean) { localStorage.setItem("mm-rm", v ? "1" : "0"); document.documentElement.classList.toggle("rm", v);
  rmListeners.forEach((f) => f({ matches: v, media: RM_Q } as MediaQueryListEvent)); window.dispatchEvent(new Event("mm-rm")); }
document.documentElement.classList.toggle("rm", rmNow());

async function copy(text: string) {
  try { await navigator.clipboard.writeText(text); return true; } catch {
    const t = document.createElement("textarea"); t.value = text; t.setAttribute("readonly", ""); t.style.cssText = "position:fixed;opacity:0"; document.body.append(t); t.select();
    const ok = document.execCommand("copy"); t.remove(); return ok; }
}
function CopyBtn({ text, label, done = "Copied" }: { text: string; label: string; done?: string }) {
  const [state, setState] = useState<"idle" | "ok" | "fail">("idle");
  return <button type="button" className="btn" onClick={async () => { setState((await copy(text)) ? "ok" : "fail"); setTimeout(() => setState("idle"), 1600); }}>
    <span aria-live="polite">{state === "ok" ? done : state === "fail" ? "Select and copy it by hand" : label}</span></button>;
}

// ── search: every word must match the name, id, family, tier or the notes; name matches rank first
const hay = (c: Entry) => `${c.name} ${c.id} ${FAMILY_TITLES[c.family] || c.family} tier ${c.tier} ${c.what} ${c.use_when}`.toLowerCase();
export function search(q: string): Entry[] {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean); if (!words.length) return ALL;
  return ALL.filter((c) => words.every((w) => hay(c).includes(w)))
    .sort((a, b) => Number(!words.every((w) => a.name.toLowerCase().includes(w))) - Number(!words.every((w) => b.name.toLowerCase().includes(w))) || a.name.localeCompare(b.name));
}
function SearchBox({ value, onChange, onEnter }: { value: string; onChange: (v: string) => void; onEnter?: () => void }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === "/" && document.activeElement?.tagName !== "INPUT") { e.preventDefault(); ref.current?.focus(); } };
    addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, []);
  return <label className="search"><span className="sr">Search components</span>
    <input ref={ref} type="search" placeholder={`Search ${ALL.length} components  ( / )`} value={value} onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => { if (e.key === "Enter") onEnter?.(); }} autoComplete="off" /></label>;
}
function RMToggle() {
  const [on, setOn] = useState(rmNow());
  return <button type="button" role="switch" aria-checked={on} className="rm-toggle" onClick={() => { setRM(!on); setOn(!on); }}>
    <span className="rm-track" aria-hidden="true"><span className="rm-knob" /></span>Reduced motion</button>;
}
function Bar({ q, setQ, onEnter }: { q: string; setQ: (v: string) => void; onEnter?: () => void }) {
  return <header className="bar"><a className="brand" href={`${ROOT}index.html`}>Motomation <span>docs</span></a>
    <SearchBox value={q} onChange={setQ} onEnter={onEnter} /><RMToggle /><a className="bar-link" href={`${ROOT}gallery/index.html`}>Gallery</a></header>;
}
function Results({ list }: { list: Entry[] }) {
  return <ul className="results">{list.map((c) => <li key={c.id}><a href={`${ROOT}c/${c.id}.html`}><strong>{c.name}</strong><span className="meta">{FAMILY_TITLES[c.family]} · tier {c.tier}</span><span className="what">{c.what}</span></a></li>)}</ul>;
}

function Index() {
  const [q, setQ] = useState(qs.get("q") || ""); const list = useMemo(() => search(q), [q]);
  const fams = Object.keys(FAMILY_TITLES).filter((f) => list.some((c) => c.family === f));
  return <>
    <Bar q={q} setQ={setQ} onEnter={() => list[0] && (location.href = `c/${list[0].id}.html`)} />
    <main className="index" id="main">
      <h1>{ALL.length} motion components, each with a reduced-motion path and a touch behaviour.</h1>
      <p className="lede">Each page has the live demo, a prop playground, a mobile preview, the install command and the notes on when not to use it.</p>
      <p className="count" role="status">{q ? `${list.length} of ${ALL.length} match “${q}”` : `${ALL.length} components`}</p>
      {fams.map((f) => <section key={f} aria-labelledby={`f-${f}`}><h2 id={`f-${f}`}>{FAMILY_TITLES[f]}</h2><Results list={list.filter((c) => c.family === f)} /></section>)}
      {!list.length && <p>Nothing matches. Try a family (“scroll”, “cursor”) or a material (“paper”, “metal”).</p>}
    </main></>;
}

// ── playground: find the component's element in the gallery demo and clone it with the chosen props
function findProps(node: ReactNode, C: unknown): Record<string, unknown> | null {
  let found: Record<string, unknown> | null = null;
  const walk = (n: ReactNode) => { if (found) return; if (Array.isArray(n)) { n.forEach(walk); return; } if (!isValidElement(n)) return;
    const p = n.props as Record<string, unknown>; if (n.type === C) { found = p; return; } for (const v of Object.values(p)) if (isValidElement(v) || Array.isArray(v)) walk(v as ReactNode); };
  walk(node); return found;
}
function inject(node: ReactNode, C: unknown, o: Record<string, unknown>, hit = { n: 0 }): ReactNode {
  if (Array.isArray(node)) return Children.map(node, (n) => inject(n, C, o, hit));
  if (!isValidElement(node)) return node;
  if (node.type === C) return hit.n++ === 0 ? cloneElement(node, o) : node;
  const p = node.props as Record<string, unknown>, np: Record<string, unknown> = {}; let changed = false;
  for (const [k, v] of Object.entries(p)) if (isValidElement(v) || Array.isArray(v)) { const nv = inject(v as ReactNode, C, o, hit); if (nv !== v) { np[k] = nv; changed = true; } }
  return changed ? cloneElement(node, np) : node;
}
const parseDef = (d: string | null): unknown => { if (d == null) return undefined; if (/^-?\d*\.?\d+$/.test(d)) return +d; if (d === "true" || d === "false") return d === "true"; const m = d.match(/^["'`](.*)["'`]$/); return m ? m[1] : undefined; };

function Stage({ id, o, k }: { id: string; o: Record<string, unknown>; k: number }) {
  const tree = DEMOS[id] ? DEMOS[id]() : <p>No demo.</p>;
  return <div className="stage" key={k}>{Object.keys(o).length ? inject(tree, COMPONENTS[id], o) : tree}</div>;
}
function Control({ p, value, set }: { p: Prop; value: unknown; set: (v: unknown) => void }) {
  const id = `p-${p.name}`;
  if (p.control === "boolean") return <label className="ctl ctl-bool" htmlFor={id}><input id={id} type="checkbox" checked={!!value} onChange={(e) => set(e.target.checked)} /><code>{p.name}</code></label>;
  return <label className="ctl" htmlFor={id}><code>{p.name}</code>
    {p.control === "select" ? <select id={id} value={String(value ?? "")} onChange={(e) => set(e.target.value)}>{p.options!.map((x) => <option key={x}>{x}</option>)}</select>
      : p.control === "number" ? <input id={id} type="number" step={String(value).includes(".") ? 0.01 : 1} value={value === undefined ? "" : String(value)} onChange={(e) => set(e.target.value === "" ? undefined : +e.target.value)} />
      : <input id={id} type="text" value={String(value ?? "")} onChange={(e) => set(e.target.value)} />}</label>;
}

function ComponentPage() {
  const c = byId[ID]; const [q, setQ] = useState(""); const list = useMemo(() => search(q), [q]);
  const base = useMemo(() => { const demo = DEMOS[ID] ? findProps(DEMOS[ID](), COMPONENTS[ID]) : null;
    return { found: !!demo, values: Object.fromEntries(c.props.filter((p) => p.control).map((p) => [p.name, demo && p.name in demo ? demo[p.name] : parseDef(p.def)])) }; }, []);
  const [o, setO] = useState<Record<string, unknown>>(() => { try { return JSON.parse(qs.get("p") || "{}"); } catch { return {}; } });
  const [k, setK] = useState(0); const [mobile, setMobile] = useState(false);
  useEffect(() => { const t = setTimeout(() => setK((x) => x + 1), 220); return () => clearTimeout(t); }, [o]);
  useEffect(() => { const f = () => setK((x) => x + 1); addEventListener("mm-rm", f); return () => removeEventListener("mm-rm", f); }, []);
  if (FRAME) return <main className="frame"><Stage id={ID} o={o} k={k} /></main>;
  const values = { ...base.values, ...o }, controls = c.props.filter((p) => p.control);
  const frameSrc = `${c.id}.html?frame=1&rm=${rmNow() ? 1 : 0}&p=${encodeURIComponent(JSON.stringify(o))}`;
  return <>
    <Bar q={q} setQ={setQ} onEnter={() => list[0] && (location.href = `${list[0].id}.html`)} />
    {q && <div className="dropdown" role="region" aria-label="Search results"><p className="count" role="status">{list.length} of {ALL.length} match</p><Results list={list.slice(0, 12)} /></div>}
    <div className="doc">
      <nav className="side" aria-label="Components">{Object.keys(FAMILY_TITLES).map((f) => <div key={f}><p className="side-fam">{FAMILY_TITLES[f]}</p>
        <ul>{ALL.filter((x) => x.family === f).map((x) => <li key={x.id}><a href={`${x.id}.html`} aria-current={x.id === c.id ? "page" : undefined}>{x.name}</a></li>)}</ul></div>)}</nav>
      <main id="main" className="comp">
        <p className="crumb">{FAMILY_TITLES[c.family]} · tier {c.tier}</p>
        <h1>{c.name}</h1>
        <p className="lede">{c.what}</p>
        <div className="toolbar">
          <div className="seg" role="group" aria-label="Preview size"><button type="button" aria-pressed={!mobile} onClick={() => setMobile(false)}>Desktop</button><button type="button" aria-pressed={mobile} onClick={() => setMobile(true)}>Mobile 375</button></div>
          <button type="button" className="btn" onClick={() => setK((x) => x + 1)}>Replay</button>
        </div>
        {mobile ? <div className="phone"><iframe title={`${c.name} at 375 pixels wide`} src={frameSrc} key={frameSrc + k} width={375} height={720} /></div> : <Stage id={c.id} o={o} k={k} />}
        <section className="play" aria-labelledby="h-play"><h2 id="h-play">Playground</h2>
          {!controls.length ? <p className="hint">No simple props to change: this one takes content (children, items or a callback). See the props table.</p>
            : !base.found ? <p className="hint">This demo wraps the component in its own interactive state, so the playground can't reach it. The props are listed below.</p>
            : <><div className="ctls">{controls.map((p) => <Control key={p.name} p={p} value={values[p.name]} set={(v) => setO((x) => ({ ...x, [p.name]: v }))} />)}</div>
              <p className="hint"><button type="button" className="btn" onClick={() => setO({})}>Reset</button> Changes apply live to the demo and to the mobile preview.</p></>}
        </section>
        <section aria-labelledby="h-install"><h2 id="h-install">Install</h2>
          <pre className="cmd"><code>{install(c.id)}</code></pre>
          <p className="row"><CopyBtn text={install(c.id)} label="Copy install command" /><CopyBtn text={JSON.parse(document.getElementById("source")?.textContent || '""')} label="Copy source" done="Source copied" />
            <a className="btn" href={`${SITE.repo}/blob/main/skills/asfakulsiam-motomation-design/${c.file}`}>View on GitHub</a></p>
          <p className="hint">Installs <code>{c.file.replace("examples/components/", "components/motomation/")}</code> and its shared <code>_lib</code> helpers; React is the only dependency.{c.plain && <> No React? This one also ships as <a href={`${SITE.repo}/tree/main/vendor/plain/${c.id}`}>CSS + HTML and Tailwind</a>.</>}</p>
        </section>
        <section aria-labelledby="h-notes"><h2 id="h-notes">When to use it</h2>
          <dl className="notes"><div><dt>Use when</dt><dd>{c.use_when}</dd></div><div><dt>Avoid when</dt><dd>{c.avoid_when}</dd></div>
            <div><dt>Reduced motion</dt><dd>{c.reduced_motion}</dd></div><div><dt>Touch</dt><dd>{c.touch}</dd></div>{c.a11y && <div><dt>Accessibility</dt><dd>{c.a11y}</dd></div>}</dl></section>
        <section aria-labelledby="h-props"><h2 id="h-props">Props</h2>
          {c.props.length ? <div className="table"><table><thead><tr><th scope="col">Prop</th><th scope="col">Type</th><th scope="col">Default</th></tr></thead>
            <tbody>{c.props.map((p) => <tr key={p.name}><td><code>{p.name}{p.optional ? "?" : ""}</code></td><td><code>{p.type}</code></td><td>{p.def == null ? (p.optional ? "—" : "required") : <code>{p.def}</code>}</td></tr>)}</tbody></table></div>
            : <p className="hint">No props.</p>}
        </section>
      </main>
    </div></>;
}

createRoot(document.getElementById("root")!).render(page === "index" ? <Index /> : <ComponentPage />);
