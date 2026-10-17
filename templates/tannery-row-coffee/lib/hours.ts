// Opening status in the shop's own time zone (not the visitor's), so "open now" is right wherever the page is read.
import type { Hours } from "./site";

const toMin = (hhmm: string) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };

/** Weekday (0 = Sunday) and minutes past midnight for `now` in `timeZone`. */
export function shopClock(now: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export type Status = { open: boolean; line: string };

/** "Open now, until 17:00" or "Closed, opens tomorrow at 07:30". */
export function openStatus(hours: Hours[], now: Date, timeZone: string): Status {
  const { day, minutes } = shopClock(now, timeZone);
  const today = hours.find((h) => h.day === day);
  if (today && minutes >= toMin(today.open) && minutes < toMin(today.close)) return { open: true, line: `Open now, until ${today.close}` };
  if (today && minutes < toMin(today.open)) return { open: false, line: `Closed, opens today at ${today.open}` };
  for (let step = 1; step <= 7; step++) {
    const next = hours.find((h) => h.day === (day + step) % 7);
    if (next) return { open: false, line: `Closed, opens ${step === 1 ? "tomorrow" : next.label} at ${next.open}` };
  }
  return { open: false, line: "Closed" };
}
