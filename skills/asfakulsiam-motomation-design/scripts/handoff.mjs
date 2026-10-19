#!/usr/bin/env node
// handoff.mjs — the handoff status, computed from what actually ran (v3.0.2). Zero dependencies, no browser.
//
//   node scripts/handoff.mjs <project folder>                 the status line and its exceptions
//   node scripts/handoff.mjs <project folder> --report GATE.md  also check the handoff note against it
//   node scripts/handoff.mjs <project folder> --json
//
// Why: in the v3.0.1 benchmark, three of four builders never ran the journey check (axis J) because the full gate was
// too heavy for their machines. Two said so ("rule-only results"); one wrote "all 3 core journeys connect without broken
// paths" in GATE.md with J never run, and nothing could tell the two apart. A handoff note is prose; this file is not.
// gate.mjs writes <project>/.motomation/gate-record.json on every run (full, --journey, --rules, and a run that ends
// "not verified"), with a hash of the site's files. The status is computed from that record, never typed:
//
//   VALIDATED      a full gate run passed on the current files, the journey check (J) ran and passed, and it left
//                  nothing unverified. Prototype boundaries (browser-only or labelled simulated forms) are listed.
//   CONDITIONAL    the full run passed, but something it could not verify is listed (a checkout behind an empty cart,
//                  a form that rejected the filled values, a Scope route no link reaches, a URL target whose files
//                  could not be hashed). Those are walked by hand and written in GATE.md; the status stays conditional.
//   NOT VALIDATED  no full run, a full run on older files (the site changed since), a failing run, a run that ended
//                  "not verified" (no browser, a constrained machine, a timeout), or the journey check skipped or
//                  not measured. Development checks (--journey, --rules, completeness.mjs) never make a handoff.
//   REFERENCE      a design reference gated with --reference: J does not apply (no live site).
//
// Exit: 0 VALIDATED or REFERENCE · 3 CONDITIONAL · 1 NOT VALIDATED · 2 the --report note contradicts the status.
import { readFileSync, existsSync, readdirSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import { createHash } from "node:crypto";

export const RECORD = ".motomation/gate-record.json";
export const SCHEMA = "motomation-handoff/1";
// not the site: notes, records, reports, dependencies. A stamp pasted into a page is not a change either (it is
// the gate's own output): stamps are stripped before hashing.
const SKIP_DIR = new Set([".motomation", "node_modules", ".git", ".next", ".turbo", "screens", "evidence"]);
const SKIP_FILE = /^(GATE|CRITIQUE|CHECKPOINTS|RUN|HANDOFF|NOTES)\.md$|\.motion-report\.html$|\.log$|^\.DS_Store$/i;
const STAMP_RX = /<!--[^>]*?motomation ·[\s\S]*?-->|\/\*[^*]*?motomation ·[\s\S]*?\*\//g;

export function siteHash(dir) {
  const h = createHash("sha256"); let files = 0;
  const walk = (d) => { for (const n of readdirSync(d).sort()) { const p = join(d, n); let s; try { s = statSync(p); } catch { continue; }
    if (s.isDirectory()) { if (!SKIP_DIR.has(n)) walk(p); continue; } if (SKIP_FILE.test(n)) continue;
    let buf = readFileSync(p); if (/\.(html?|css)$/i.test(n)) buf = Buffer.from(buf.toString("utf8").replace(STAMP_RX, ""));
    h.update(relative(dir, p)); h.update("\0"); h.update(buf); h.update("\0"); files++; } };
  walk(dir); return { hash: h.digest("hex").slice(0, 16), files };
}

// what a journey result leaves unverified: the things a pass does not cover. Coverage sampling (tap and loading on 12
// pages) is a stated limit, not an exception; a state, a form or a route the check could not reach is.
export function journeyExceptions(j) {
  if (!j) return ["journey (J) did not run"];
  if (j.skipped) return [];
  if (j.error) return [`journey (J) not measured: ${j.error}`];
  const out = []; const cov = j.coverage || {};
  for (const k of ["nav", "mobile", "forms", "loading", "errors", "session"]) if (j[k]?.error) out.push(`journey ${k} not measured: ${j[k].error}`);
  for (const u of cov.formsUncovered || []) out.push(`form not verified: ${u}`);
  const flows = new Set((j.nav?.excused || []).map((e) => e.route));
  for (const r of cov.contractUnreached || []) if (!/^\/?404(\.html)?$/.test(r) && !flows.has(r)) out.push(`Scope route no link reaches (walk it): ${r}`);
  for (const r of cov.notLoaded || []) out.push(`route found but not loaded (page cap): ${r}`);
  if (j.mobile?.layout?.error) out.push(`layout widths not measured: ${j.mobile.layout.error}`);
  return out;
}

const summaryOf = (j) => j ? { ran: !j.skipped && !j.error, skipped: !!j.skipped, error: j.error || null, pass: !!j.pass, segment: j.segment, counts: j.counts || null,
  exceptions: journeyExceptions(j), prototype: j.forms?.prototype || [], excused: (j.nav?.excused || []).map((e) => `${e.route} (${e.entry}${e.via ? `, via ${e.via}` : ""})`), layout: j.mobile?.layoutLine || null,
  coverage: j.coverage ? { loaded: j.coverage.loaded, routes: j.coverage.routes, sampled: (j.coverage.sampled || []).length, notSampled: (j.coverage.notSampled || []).length, formsChecked: j.coverage.formsChecked } : null } : null;

// mode: "full" | "journey" | "rules" | "not-verified". results: the gate's per-target objects (or { reason } for not-verified)
export function writeRecord(project, mode, results, meta = {}) {
  if (!project) return null;
  const file = join(project, RECORD); let rec = {};
  try { rec = JSON.parse(readFileSync(file, "utf8")); } catch {}
  if (rec.schema !== SCHEMA) rec = { schema: SCHEMA, project: resolve(project), runs: {} };
  const { hash, files } = meta.noHash ? { hash: null, files: 0 } : siteHash(project);
  const list = Array.isArray(results) ? results : [results];
  const entry = { at: new Date().toISOString(), gate: meta.gate || null, skill: meta.skill || null, hash, files, machine: meta.machine || null, footprint: meta.footprint || null,
    targets: list.map((r) => ({ target: r.target ? String(r.target) : null, pass: !!r.pass, verified: r.verified !== false, stamp: r.stamp || null, reason: r.reason || null,
      reference: !!r.journey?.skipped, completeness: r.completeness ? { ran: true, pass: !!r.completeness.pass, error: r.completeness.error || null } : null,
      journey: mode === "journey" ? summaryOf(r) : mode === "full" ? summaryOf(r.journey) : null, counts: r.counts || null })) };
  rec.runs[mode] = entry; rec.updated = entry.at;
  try { mkdirSync(join(project, ".motomation"), { recursive: true }); writeFileSync(file, JSON.stringify(rec, null, 2) + "\n"); } catch { return null; }
  return file;
}

export function handoffStatus(project, rec = null) {
  const file = join(project, RECORD);
  if (!rec) { try { rec = JSON.parse(readFileSync(file, "utf8")); } catch { rec = null; } }
  const dev = []; const exceptions = []; const prototype = []; const excused = [];
  const now = existsSync(project) ? siteHash(project).hash : null;
  if (!rec || rec.schema !== SCHEMA) return { status: "NOT VALIDATED", why: `no gate record (${RECORD}): the full gate never ran on this project, so nothing is validated`, exceptions, prototype, excused, dev, hash: now };
  for (const m of ["journey", "rules"]) if (rec.runs?.[m]) { const e = rec.runs[m]; dev.push(`${m === "journey" ? "--journey" : "--rules"} at ${e.at}: ${e.targets.every((t) => t.pass) ? "pass" : "FAIL"}${e.hash && now && e.hash !== now ? " (older files)" : ""} (a development check, not a handoff)`); }
  const nv = rec.runs?.["not-verified"], full = rec.runs?.full;
  if (nv && (!full || nv.at >= full.at)) return { status: "NOT VALIDATED", why: `the last gate run ended not verified: ${nv.targets[0]?.reason || "unknown reason"} (the site was not measured; run the full gate where it can finish)`, exceptions, prototype, excused, dev, hash: now, at: nv.at };
  if (!full) return { status: "NOT VALIDATED", why: "no full gate run: only development checks ran (--journey, --rules); the full gate (node scripts/gate.mjs <site>) is the handoff check", exceptions, prototype, excused, dev, hash: now };
  const stale = full.hash && now && full.hash !== now;
  if (stale) return { status: "NOT VALIDATED", why: `the full gate ran on older files (record ${full.hash}, now ${now}, at ${full.at}): the site changed since; run it again`, exceptions, prototype, excused, dev, hash: now, at: full.at };
  const bad = full.targets.filter((t) => !t.verified); if (bad.length) return { status: "NOT VALIDATED", why: `the full run was not a measurement (coverage) on ${bad.map((t) => t.target).join(", ")}`, exceptions, prototype, excused, dev, hash: now, at: full.at };
  const failing = full.targets.filter((t) => !t.pass);
  if (failing.length) return { status: "NOT VALIDATED", why: `the full gate FAILS on ${failing.map((t) => `${t.target}${t.journey?.segment ? ` (${t.journey.segment})` : ""}`).join(", ")}`, exceptions, prototype, excused, dev, hash: now, at: full.at };
  const ref = full.targets.every((t) => t.reference);
  if (ref) return { status: "REFERENCE", why: "a design reference (--reference): the journey check does not apply; not a live site", exceptions, prototype, excused, dev, hash: now, at: full.at };
  const withJ = full.targets.filter((t) => t.journey && !t.journey.skipped);
  if (!withJ.length) return { status: "NOT VALIDATED", why: "the full run has no journey result (J skipped or missing)", exceptions, prototype, excused, dev, hash: now, at: full.at };
  for (const t of withJ) { if (!t.journey.ran) exceptions.push(`journey (J) not measured on ${t.target}: ${t.journey.error || "unknown"}`); exceptions.push(...t.journey.exceptions); prototype.push(...t.journey.prototype); excused.push(...t.journey.excused); }
  if (withJ.some((t) => !t.journey.ran)) return { status: "NOT VALIDATED", why: "the journey check did not finish", exceptions, prototype, excused, dev, hash: now, at: full.at };
  if (!full.hash) exceptions.push("the site's files were not hashed (a URL target without --record <project folder>): the run cannot be tied to these files");
  const status = exceptions.length ? "CONDITIONAL" : "VALIDATED";
  return { status, why: status === "VALIDATED" ? "the full gate passed on the current files; the journey check ran, passed and left nothing unverified" : `the full gate passed, but ${exceptions.length} thing(s) were not verified: each is walked by hand and written in GATE.md, and the status stays conditional`,
    exceptions: [...new Set(exceptions)], prototype: [...new Set(prototype)], excused: [...new Set(excused)], dev, hash: now, at: full.at, segments: withJ.map((t) => t.journey.segment) };
}

export const statusLine = (s) => `handoff: ${s.status} · ${s.hash || "no hash"}${s.at ? ` · gate ${s.at.slice(0, 16).replace("T", " ")}` : ""}${s.segments?.length ? ` · ${s.segments[0]}` : ""}`;

// a note that claims more than the status: the B2B builder's "All 3 core journeys connect without broken paths" with J
// never run. Negated sentences ("not verified", "no journey run") are not claims.
const OVERCLAIM = /\b(fully (validated|verified|tested)|(all|every) (\d+ )?(core |critical |key |main )?(journeys?|flows?|forms?|checks?|pages?|routes?)( \w+){0,3} (connect|work|works|pass|passed|passes|verified|validated|function)|production[- ]ready|ready (to|for) (ship|launch|production)|no (known )?(issues|defects|broken paths?)|gate pass(ed|es)?|validated)\b/i;
export function checkReport(text, s) {
  const problems = [];
  const line = text.split("\n").find((l) => /^\s*(?:[-*>]\s*)?`?handoff:/.test(l));
  if (!line) problems.push(`no "handoff:" line: paste the first line node scripts/handoff.mjs printed (${statusLine(s)})`);
  else { const st = line.match(/handoff:\s*(NOT VALIDATED|VALIDATED|CONDITIONAL|REFERENCE)/)?.[1]; if (st !== s.status) problems.push(`the note says "handoff: ${st || "?"}" but the record gives "${s.status}" (${s.why})`);
    else if (s.hash && !line.includes(s.hash)) problems.push(`the handoff line names other files (no ${s.hash}): it was pasted before the last change; run handoff.mjs again`); }
  if (s.status !== "VALIDATED" && s.status !== "REFERENCE") {
    text.split("\n").forEach((l, i) => { if (/^\s*(?:[-*>]\s*)?`?handoff:/.test(l)) return; const m = l.match(OVERCLAIM); if (!m) return; const pre = l.slice(0, m.index); if (/\b(not|no|never|un\w*|nothing|cannot|can.t|isn.t|wasn.t|without)\b[^.;]*$/i.test(pre) || /\b(not|unverified|un-?verified)\b/i.test(l.slice(m.index, m.index + m[0].length + 30))) return; problems.push(`line ${i + 1} claims "${m[0]}" but the status is ${s.status}: "${l.trim().slice(0, 100)}"`); });
    if (s.status === "CONDITIONAL") for (const e of s.exceptions) { const k = e.replace(/^[^:]+:\s*/, "").slice(0, 40); if (!text.includes(k)) problems.push(`exception not written in the note: ${e}`); }
  }
  return problems;
}

function main() {
  const argv = process.argv.slice(2); const flags = {}; const pos = [];
  for (let i = 0; i < argv.length; i++) { const t = argv[i]; if (t.startsWith("--")) { const k = t.slice(2); flags[k] = argv[i + 1] && !argv[i + 1].startsWith("--") && k !== "json" ? argv[++i] : true; } else pos.push(t); }
  if (flags.help || !pos.length) { console.log("usage: node scripts/handoff.mjs <project folder> [--report GATE.md] [--json]"); process.exit(pos.length ? 0 : 2); }
  const project = resolve(pos[0]); const s = handoffStatus(project);
  const problems = flags.report ? (existsSync(String(flags.report)) ? checkReport(readFileSync(String(flags.report), "utf8"), s) : [`no such report: ${flags.report}`]) : [];
  if (flags.json) console.log(JSON.stringify({ ...s, line: statusLine(s), report: flags.report ? { file: String(flags.report), problems } : undefined }, null, 2));
  else {
    console.log(statusLine(s)); console.log(`  ${s.why}`);
    if (s.exceptions.length) { console.log("  not verified (walk each by hand; write it in GATE.md):"); for (const e of s.exceptions) console.log(`    - ${e}`); }
    if (s.prototype.length) { console.log("  prototype boundaries (say so in the handoff):"); for (const e of s.prototype) console.log(`    - ${e}`); }
    if (s.excused.length) console.log(`  routes reached outside the link graph: ${s.excused.join(", ")}`);
    for (const d of s.dev) console.log(`  · ${d}`);
    if (flags.report) { if (problems.length) { console.log(`\nREPORT REJECTED · ${flags.report}`); for (const p of problems) console.log(`  ✗ ${p}`); } else console.log(`\nreport OK · ${flags.report} agrees with the record`); }
  }
  process.exit(problems.length ? 2 : s.status === "VALIDATED" || s.status === "REFERENCE" ? 0 : s.status === "CONDITIONAL" ? 3 : 1);
}
if (process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname) main();
