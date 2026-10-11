// Shared rules from data/rules.csv, rendered the one way every doc must spell them.
// Docs mark each use as <!--rule:KEY-->rendered text<!--/rule-->; scripts/check-repo.mjs fails when a marker's text
// differs from the CSV, or when a rule is restated without a marker.
import { load } from "./lib.mjs";

export const rules = () => Object.fromEntries(load("rules").map((r) => [r.key, r]));
const list = (v) => v.split("|").map((s) => s.trim()).filter(Boolean);
const join = (xs, last = "or") => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} ${last} ${xs.at(-1)}`);

/** The exact text a doc must show for a rule key. */
export function renderRule(key, r = rules()) {
  const row = r[key];
  if (!row) throw new Error(`unknown rule ${key}`);
  if (key === "ui_feedback_max_ms") return `${row.value}ms`;
  if (key === "banned_display_fonts") return join(list(row.value).map((f) => (f === "system-ui" ? "the system UI stack" : f)), "or");
  if (key === "caution_fonts") return join(list(row.value), "and");
  return row.value;
}
export const bannedDisplayFonts = () => list(rules().banned_display_fonts.value);
export const cautionFonts = () => list(rules().caution_fonts.value);
export const uiFeedbackMaxMs = () => Number(rules().ui_feedback_max_ms.value);
