// Reduced-motion override for the gallery and the docs site: replaces the (prefers-reduced-motion: reduce) media query
// so every component's own useReducedMotion follows an on-page toggle live. ?rm=1 / ?rm=0 or the stored choice win;
// otherwise the system setting. Import once, before rendering.
const RM_Q = "(prefers-reduced-motion: reduce)";
const sys = window.matchMedia.bind(window);
const listeners = new Set<(e: MediaQueryListEvent) => void>();
const stored = () => { const f = new URLSearchParams(location.search).get("rm") ?? localStorage.getItem("mm-rm"); return f === "1" ? true : f === "0" ? false : null; };
export const rmNow = () => stored() ?? sys(RM_Q).matches;
window.matchMedia = ((q: string) => {
  if (q.replace(/\s+/g, " ").trim() !== RM_Q) return sys(q);
  const add = (f: (e: MediaQueryListEvent) => void) => { listeners.add(f); }, remove = (f: (e: MediaQueryListEvent) => void) => { listeners.delete(f); };
  return { get matches() { return rmNow(); }, media: RM_Q, onchange: null, addEventListener: (_: string, f: (e: MediaQueryListEvent) => void) => add(f),
    removeEventListener: (_: string, f: (e: MediaQueryListEvent) => void) => remove(f), addListener: add, removeListener: remove, dispatchEvent: () => true } as unknown as MediaQueryList;
}) as typeof window.matchMedia;
export function setRM(v: boolean) {
  localStorage.setItem("mm-rm", v ? "1" : "0"); document.documentElement.classList.toggle("rm", v);
  listeners.forEach((f) => f({ matches: v, media: RM_Q } as MediaQueryListEvent)); window.dispatchEvent(new Event("mm-rm"));
}
document.documentElement.classList.toggle("rm", rmNow());
