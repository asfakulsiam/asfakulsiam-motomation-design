"use client";
// Date and open/closed status in the shop's time zone. Before hydration (and without JS) it links to the hours table.
// tier 0 · use-when: the masthead folio · avoid-when: a page that already leads with the hours table · reduced-motion: no motion · touch: the status is a plain link
import { useEffect, useState } from "react";
import Link from "next/link";
import { hours, shop } from "@/lib/site";
import { openStatus, type Status } from "@/lib/hours";

export function EditionLine() {
  const [state, setState] = useState<{ date: string; status: Status } | null>(null);
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const date = new Intl.DateTimeFormat("en-GB", { timeZone: shop.timeZone, weekday: "long", day: "numeric", month: "long" }).format(now);
      setState({ date, status: openStatus(hours, now, shop.timeZone) });
    };
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);
  if (!state) return <Link href="/visit/#hours">See today&rsquo;s hours</Link>;
  return (
    <>
      <span>{state.date}</span> · <Link href="/visit/#hours" className={state.status.open ? "status status--open" : "status"}>{state.status.line}</Link>
    </>
  );
}
