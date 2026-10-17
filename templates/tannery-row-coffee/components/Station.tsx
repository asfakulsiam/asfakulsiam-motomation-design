"use client";
// One station on the counter map. Choosing a drink redraws its cup; a #drink-id in the URL preselects it.
// tier 1 · use-when: a counter station with drinks · avoid-when: items without layers (the pastry case lists them instead) · reduced-motion: the cup redraws without the pour · touch: whole row is the button
import { useEffect, useState } from "react";
import { price, type MenuItem } from "@/lib/site";
import { Cup } from "./Cup";

export function Station({ id, title, lede, items }: { id: string; title: string; lede: string; items: MenuItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const [pour, setPour] = useState(0); // choosing the drink already shown pours it again, so every tap answers
  useEffect(() => {
    const pick = () => { const h = decodeURIComponent(window.location.hash.slice(1)); if (items.some((i) => i.id === h)) setActive(h); };
    pick();
    window.addEventListener("hashchange", pick);
    return () => window.removeEventListener("hashchange", pick);
  }, [items]);
  const current = items.find((i) => i.id === active) ?? items[0];
  if (!current) return null;
  return (
    <section className="station" id={id} aria-labelledby={`${id}-title`}>
      <header className="station__head">
        <h2 id={`${id}-title`}>{title}</h2>
        <p>{lede}</p>
      </header>
      <div className="station__body">
        <div className="station__cup" aria-live="polite">
          <Cup key={`${current.id}-${pour}`} layers={current.layers ?? []} name={current.name} spec={current.spec} />
        </div>
        <ul className="drinks" aria-label={`${title} drinks`}>
          {items.map((d) => (
            <li key={d.id} id={d.id}>
              <button type="button" className="drink" aria-pressed={d.id === current.id} onClick={() => { setActive(d.id); setPour((n) => n + 1); }}>
                <span className="drink__name">{d.name}</span>
                <span className="drink__price mono">{price(d.price)}</span>
                {d.notes ? <span className="drink__notes">{d.notes}</span> : null}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
