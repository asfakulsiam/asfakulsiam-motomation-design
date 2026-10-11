"use client";
// @motomation-component
// id: remembered-list
// name: Remembered List
// family: micro
// tier: 1
// deps: react
// what: A list of links quietly marks the ones you've already opened (a small tick and a lighter weight), remembered across visits on this device.
// use-when: Project lists, article archives, course modules, menus people browse more than once.
// avoid-when: Lists that change identity often; sensitive topics where "visited" is private information on shared devices.
// reduced-motion: The mark appears without a transition.
// touch: Same as desktop.
// a11y: Visited items get a visually hidden "(opened)" suffix; storage is local only and fails silently.
import { useEffect, useState, type CSSProperties } from "react";
import { useReducedMotion } from "../_lib/motion";

type Item = { id: string; label: string; href: string };
type Props = { items: Item[]; storageKey?: string; className?: string; style?: CSSProperties };

export function RememberedList({ items, storageKey = "mm-remembered", className, style }: Props) {
  const reduce = useReducedMotion();
  const [seen, setSeen] = useState<string[]>([]);
  useEffect(() => { try { setSeen(JSON.parse(localStorage.getItem(storageKey) || "[]")); } catch { /* storage unavailable */ } }, [storageKey]);
  const mark = (id: string) => { const next = Array.from(new Set([...seen, id])); setSeen(next); try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* storage unavailable */ } };
  return (
    <ul className={className} style={{ listStyle: "none", margin: 0, padding: 0, ...style }}>
      {items.map((it) => { const was = seen.includes(it.id); return (
        <li key={it.id} style={{ borderTop: "1px solid var(--line, rgba(0,0,0,.12))" }}>
          <a href={it.href} onClick={() => mark(it.id)} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", color: "inherit", textDecoration: "none", fontWeight: was ? 400 : 600, opacity: was ? 0.72 : 1, transition: reduce ? "none" : "opacity 180ms ease-out" }}>
            <span>{it.label}{was && <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}> (opened)</span>}</span>
            <span aria-hidden="true" style={{ opacity: was ? 1 : 0, transition: reduce ? "none" : "opacity 180ms ease-out" }}>✓</span>
          </a>
        </li>); })}
    </ul>
  );
}
