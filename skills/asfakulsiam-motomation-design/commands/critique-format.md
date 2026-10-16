# Critique Format

Use this exact structure for `/critique` and for the critique step inside `/overdrive`.

```
CRITIQUE · <page or component> · <date>

## Measured
gate.mjs        H <n> · M <n> · V <n> · Q <n> · A <n> · S <n>, with the traces it printed (the critique: segment without C and R)
                gate: c o w rm a n q k · rules: C S P K · the X lines · journey: nav mobile forms loading errors session
contrast.mjs    <failures with the ratio and the pair, e.g. 3.1:1 #8a857a on #f3efe6>
performance     <numbers a tool printed: JS gzipped, LCP, CLS; none printed → Not verified>
originality.mjs <scores against earlier builds, if it ran>

## Judged
self (opinion)  C <n> · R <n> (counted by gate.mjs from my own Restraint Gate record: self-reported)
self (opinion)  Verdict: <one sentence: the single biggest reason it does or doesn't work>
self (opinion)  Top 3 problems (most important first)
                1. <problem> — where: <section/file:line> — why it matters: <effect on the user> — evidence: <"see Measured: …" or "by eye">
                   Fix: <specific change>
                2. …
                3. …
self (opinion)  AI-default scan <n>/25 failed, by eye: <list gate numbers>
self (opinion)  Restraint Gate, per questioned element: <element> — Q1 hierarchy/feedback/storytelling <pass|fail> · Q2 brief
                needs it to feel like itself <pass|fail> → <kept|cut>   (cut only if both fail; principles/restraint.md)
self (opinion)  Motion: <passes / animations failing the four questions>
self (opinion)  Choreography <n>/5 against MOTION.md's timing sheet: <drift, grammar, camera, rhythm, reduced motion>
                (motion/choreography.md §5; "no timing sheet" on Tier 3–5 is a failure)
self (opinion)  Keyboard and focus, by hand: <issues found by tabbing, or "none found">
judge (opinion) <an independent judge, named, with its scores and notes, or "none">
self (opinion)  Keep: <the 1–3 things that are working and must survive the revision>
self (opinion)  Next command: <e.g. /mutate hero, /type, /quieter>

## Not verified
<every check that did not run or could not decide, with the reason: "not verified — no browser", axes marked ?, n/a journey
 checks, performance not measured, real devices, screen readers>
```

## Rules

- Be specific: name the element, the value and the fix. "Increase hero display size from 64px to clamp(4rem, 12vw, 14rem)", not "make it bolder".
- Every problem links to a user effect (confusion, slowness, distrust, inaccessibility, forgettability).
- Never invent measurements. A number goes under **Measured** only if a tool printed it; name the tool. Performance you didn't measure goes under **Not verified**, with the reason.
- Three sections, no mixing (`gates/delivery-gate.md`, "Every report"). Every **Judged** line says `(opinion)` and who judged (`self` or a named `judge`). A problem may cite measured evidence (`see Measured: contrast`) but does not restate its numbers. A check done by hand (tabbing, reading copy) is judged, not measured: no tool observed it.
- Always include **Keep**. Critique protects what works.
- Never recommend cutting an element for failing Q1 alone. If it passes Q2 (the brief needs it to feel like itself), it stays; name the brief's reason. Recommend a cut only when it fails both.
