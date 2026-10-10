# Critique Format

Use this exact structure for `/critique` and for the critique step inside `/overdrive`.

```
CRITIQUE · <page or component>

Scores     C <n> · H <n> · S <n> · R <n> · M <n> · V <n>      (1–5, see gates/delivery-gate.md)
Verdict    <one sentence: the single biggest reason it does or doesn't work>

Top 3 problems (most important first)
1. <problem> — where: <section/file:line> — why it matters: <effect on the user>
   Fix: <specific change>
2. …
3. …

AI-default scan    <n>/25 failed: <list gate numbers>
Motion             <passes / list animations failing the four questions>
Accessibility      <contrast failures with values, keyboard issues, missing reduced-motion>
Performance        <measured numbers, or "not measured">

Keep               <the 1–3 things that are working and must survive the revision>
Next command       <e.g. /mutate hero, /type, /quieter>
```

## Rules

- Be specific: name the element, the value and the fix. "Increase hero display size from 64px to clamp(4rem, 12vw, 14rem)", not "make it bolder".
- Every problem links to a user effect (confusion, slowness, distrust, inaccessibility, forgettability).
- Never invent measurements. If you didn't measure performance, say so.
- Always include **Keep**. Critique protects what works.
