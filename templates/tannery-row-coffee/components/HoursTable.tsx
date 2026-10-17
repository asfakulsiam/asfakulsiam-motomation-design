"use client";
// Opening hours as a table. After hydration the row for today (in the shop's time zone) is marked.
// tier 0 · use-when: anywhere hours are asked · avoid-when: never · reduced-motion: no motion · touch: not interactive
import { useEffect, useState } from "react";
import { hours, shop } from "@/lib/site";
import { shopClock } from "@/lib/hours";

type Row = { days: number[]; label: string; open: string; close: string };

// compact: consecutive days with the same hours share a row ("Monday to Wednesday")
function rows(compact: boolean): Row[] {
  const week = [1, 2, 3, 4, 5, 6, 0].map((d) => hours.find((h) => h.day === d)!).filter(Boolean);
  if (!compact) return week.map((h) => ({ days: [h.day], label: h.label, open: h.open, close: h.close }));
  const out: Row[] = [];
  for (const h of week) {
    const last = out[out.length - 1];
    if (last && last.open === h.open && last.close === h.close) { last.days.push(h.day); continue; }
    out.push({ days: [h.day], label: h.label, open: h.open, close: h.close });
  }
  return out.map((r) => ({ ...r, label: r.days.length > 1 ? `${week.find((h) => h.day === r.days[0])!.label.slice(0, 3)} to ${week.find((h) => h.day === r.days[r.days.length - 1])!.label.slice(0, 3)}` : r.label }));
}

export function HoursTable({ compact = false }: { compact?: boolean }) {
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(shopClock(new Date(), shop.timeZone).day), []);
  return (
    <table className={`hours ${compact ? "hours--compact" : ""}`}>
      <caption className={compact ? "visually-hidden" : undefined}>Opening hours ({shop.timeZone.split("/")[1]} time)</caption>
      <tbody>
        {rows(compact).map((r) => {
          const isToday = today !== null && r.days.includes(today);
          return (
            <tr key={r.label} className={isToday ? "is-today" : undefined} aria-current={isToday ? "date" : undefined}>
              <th scope="row">{r.label}{isToday ? <span className="mono hours__today"> today</span> : null}</th>
              <td className="mono">{r.open}–{r.close}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
