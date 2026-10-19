# GATE.md · <project>

**Written after Checkpoint 5.** Fill this in at Checkpoint 6, from the gate output on the design the author approved at Checkpoint 5 (Design review), never on a draft or a preview (`thinking/sequence.md` → Delivery flow). A gate failure is fixed and the design re-presented before this file is final.

The first line is the status `node scripts/handoff.mjs <site>` printed, pasted (`gates/handoff.md`):

```
handoff: <VALIDATED | CONDITIONAL | NOT VALIDATED | REFERENCE> · <hash> · gate <date> · journey: …
```

Check this file against the record before the handoff push: `node scripts/handoff.mjs <site> --report GATE.md` (exit 2: the note claims more than the record; fix the note). Nothing below may claim more than that line: with any status but VALIDATED, no "fully validated", "all journeys work", "production-ready".

The gate output per page, pasted from `node scripts/gate.mjs …`, never typed. Three sections, no mixing (`gates/delivery-gate.md`, "Every report"). A section with nothing in it says `none`.

## Measured

What `scripts/gate.mjs` (and any other tool) printed, per page. Paste; do not summarise.

```
<page path or URL> · gate.mjs <version> · <date> · Chromium <version>
<the full output: gate: … · rules: … · the X lines · the J lines (nav, mobile, forms, loading, errors, session) · PASS/FAIL>
<the stamp line>
```

```
originality.mjs <this build> <earlier builds>   (axis O; only if it ran)
<the pair table it printed>
```

## Judged

Opinions, each marked `(opinion)` with who judged. The gate prints C and R, but it counts the agent's own Restraint Gate record, so they live here.

- self (opinion): C <n> · R <n>, from `DESIGN.md` → Restraint Gate record
- self (opinion): AI-default scan (`gates/delivery-gate.md` Part 2) answered by eye: <n>/25 failed, <numbers>
- self (opinion): craft checklist (Part 3) items checked by eye: <failed items or "none">
- judge (opinion): <independent judge, named, or "none">

## Not verified

Each check that did not run or could not decide, with the reason. No claim either way.

- <every exception handoff.mjs listed under "not verified", one per line (a CONDITIONAL note lists all of them)>
- <"gate.mjs: not verified — no browser" / "timed out after 600 s" / "the full gate did not run: development checks only (--rules, --journey)" / axes marked `?` and the missing record>
- <journey checks that printed `n/a`, and why: "forms: no form on any page">
- <O: not run, no earlier build to compare>
- <prototype boundaries handoff.mjs listed: forms saved only in this browser, labelled simulations, unavailable features>
- <real devices, screen readers, copy accuracy: not checked>
