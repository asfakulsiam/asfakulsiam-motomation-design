# Delivery Gate

Run this before handing back **any** page or component. It has four parts: the measured gate, a self-critique score, the AI-default scan and the craft checklist. If anything fails, fix it and run the gate again. Two passes is normal; needing three means the concept is weak, so go back to the Thinking Sequence.

---

## Part 0: Measured gate (`scripts/gate.mjs`)

Build the page, then run the script against the built file, folder or URL:

```bash
node scripts/gate.mjs dist/index.html          # or a folder, or http://localhost:3000/
node scripts/gate.mjs --verify dist/index.html # re-scan and check the stamp written in the file
```

It runs six bounded checks in a real browser and prints numbers:

| Code | Check | Fails when |
|---|---|---|
| `c` | **Contrast** at 375, 390, 768 and 1440px, reported per width: every visible text element against the pixels actually behind it. The text is hidden, the viewport is screenshotted at each scroll position and the background is sampled. A phone layout that stacks a caption over a pale crop of the image fails at 375 even when the desktop layout passes. Each element is judged at its most visible state, by its 10th-percentile sample (not the median), so text that sits partly on a pale image edge cannot pass on its dark half. | below 4.5:1 for body text, below 3:1 for large text (≥ 24px, or ≥ 18.66px bold) |
| `o` | **Overflow** at 375, 390, 768 and 1440px | the page scrolls sideways, or an element leaves the viewport or pushes text out of its parent by more than 1px with no clipping ancestor |
| `w` | **Long display words** at 375px: every h1–h3 and any text ≥ 32px, including decorative text | the text is wider than its box, leaves the viewport, breaks a word across lines, or splits one word across elements (e.g. "Have" + "li" on two door leaves) |
| `rm` | **Reduced motion**: the page loaded with `prefers-reduced-motion: reduce` | text that is visible normally is hidden, or pixels keep changing on a still page |
| `a` | **Alt and names** | an `img` has no `alt`, or a link, button, input or other focusable element has no accessible name |
| `n` | **Numbers**: every number (counters, prices, `progress`/`meter`, `aria-valuenow`) read at scroll 0, after jumping to the end, and under reduced motion, then compared with the value it settles on once scrolled into view. A value that changes by itself between two settled reads (a live ticker), or that reads as a clock (`9:02`) or sits in `<time>`, `role=timer`/`status`/`log` or `aria-live`, is listed as live and not judged. | an element is visible with a value that is later corrected: "0 hectares" before a count-up runs, a price replaced after load, a counter that never runs under reduced motion |

The output ends with a stamp line built only from those numbers:
`gate: c0 o0 w0 rm0 a0 n0 · gate/2 · <id>`. The id is a hash of what was measured on this page, so the same page gives the same id and a different page does not. `c` is the total of the per-width contrast failures. A `gate/1` stamp (five checks, contrast at 1440 only, no `n`) is rejected by `--verify`: re-run the gate and paste the new line.

**Rule: a stamp is only valid if it contains numbers produced by `scripts/gate.mjs` in the same run. A hand-written stamp is rejected.** Paste the line the script printed. Never type the numbers yourself and never copy them from an example or an earlier page. `--verify` re-scans the page and rejects any stamp whose numbers or id differ from the fresh scan, or that has no `gate:` segment at all.

**No browser, no pass.** If Playwright or Chromium is missing, the script prints `not verified — no browser` and exits with code 3. Report exactly that in the handoff (`Measured: not verified — no browser`) and leave the `gate:` segment out of the stamp. Don't write a pass you didn't measure.

The checks are bounded, and each reports what it skipped (text that was covered or never settled, elements parked off-canvas such as skip links and closed drawers). When more than 30% of text elements are skipped for contrast, the gate prints a coverage warning: the `c` count is then not a full measurement, and the skipped text needs a check by hand. A clean run means these six things were measured. It doesn't mean the page is accessible. Keyboard paths, focus order and copy still need Parts 1–3.

Exit codes: `0` pass · `1` fail · `2` stamp rejected · `3` not verified (no browser, or the scan ran past `--timeout`, default 600 s, which very tall pages such as the 36,000px component gallery can do).

**Optional motion report.** `node scripts/gate.mjs --report dist/index.html` (or `--report out.html` after a target) also writes a self-contained HTML file with scroll-frame strips: 8 frames at 1440px, 8 at 375px and 8 at 1440px under reduced motion. Use it to review motion by eye, show a client, or give judges something better than one screenshot. It's off by default, doesn't change the text output, and adds nothing to the gate's numbers.

---

## Part 1: Self-critique (score 1–5)

| Axis | Question | 5 means |
|---|---|---|
| **C**oncept | Is there a clear idea, and does every section serve it? | A stranger could repeat the concept sentence after one visit |
| **H**ierarchy | Within 2 seconds, is it obvious what's first, second and third on each screen? | One focal point per screen, every time |
| **S**pecificity | Could this only belong to this brief? | Swap the logo, and it would no longer make sense |
| **R**estraint | Has everything without a job been removed? | Nothing left to cut |
| **M**otion | Does every animation pass the four questions and have fallbacks? | Motion explains, never decorates, and reduced motion is designed |
| **V**ariety | Is this structurally different from previous runs (memory log) and from the template? | Different archetype, signature, type and nav from the last 5 runs |

### Where each number comes from

You don't type the scores. Each axis is derived from one named check, and `scripts/gate.mjs` prints the result with its trace. The question in the table above is what the axis means. The check below is how it's scored.

| Axis | Check | Source | Score |
|---|---|---|---|
| **C** | Did the concept survive the Restraint Gate? | `DESIGN.md` → "Restraint Gate record" → `Concept survived:` | `yes` → 5 · `yes, after N change(s)` → 5 − N (min 2) · `no` (replaced) → 1 |
| **H** | 375 hierarchy test: display words fit (`w`), no overflow at 375, exactly one `h1`, no skipped heading levels, one largest text on the first 375px screen | measured by gate.mjs | 5 − issues (min 1) |
| **S** | Is the archetype/signature unique across the last 5 runs, and how similar is the structural fingerprint? | `.motomation/log.json` (via `scripts/lib.mjs` fingerprints) + the stamp's archetype, signature, tier | both new and fingerprint < 50% → 5 · < 70% → 4 · one reused or ≥ 70% → 3 · both reused → 2 · identical → 1 |
| **R** | How many things the Restraint Gate cut and logged | `DESIGN.md` → "Restraint Gate record" → `- Cut:` and `- Rejected animation:` lines | 1 + cuts + rejected animations (max 5). Four logged rejections → R5 |
| **M** | Is the tier under budget? | measured by gate.mjs against the stamp's `tier`: pinned sections ≤ 2, WebGL canvases ≤ 1, JS (gzipped) ≤ the tier budget in `craft/performance.md`, reduced motion clean (`rm0`) | 5 − budget breaches (min 1); any `rm` failure caps M at 2 |
| **V** | How many sections repeat an entrance pattern already used on the page? | measured by gate.mjs: each top-level section's entrance (fade, x, y, scale, clip, filter, or static) | 5 − repeats (min 1). Static sections don't count |

A traced stamp reads like this, with the trace in brackets after each number:
`critique: C5[restraint:kept] H4[375:1] S5[last5:archetype-new,signature-new,fp31] R5[cuts:2,anim:2] M5[t2:pins1/2,webgl0/1,js41/80KB,rm0] V3[entrance-repeats:2]`

That line is an illustration of the format, not numbers to copy. `--verify` recomputes every axis from the page, `DESIGN.md` and the memory log, and rejects the stamp if any number or trace differs. It also rejects bare scores like `C5 H4 S5 R4 M5 V5`, and axes marked `?` (no record to derive from, e.g. `C?[no-record]` when `DESIGN.md` has no Restraint Gate record).

**Any score below 4 → revise before continuing.** Then paste the stamp line gate.mjs printed into the stamp comment:
`/* motomation · archetype: <x> · mutation: <y> · signature: <z> · tier: <n> · critique: <paste> · gate: <paste> */`

The placeholders are deliberate. There are no numbers to copy. Write the archetype, mutation, signature and tier first, because gate.mjs reads them from the comment. Then run `node scripts/gate.mjs <build>` and replace the critique and gate segments with what it printed. Check with `node scripts/gate.mjs --verify <build>`.

---

## Part 2: AI-default scan (every answer must be "no")

**Structure**
1. Is the page hero → logo wall → 3 features → testimonials → pricing → CTA?
2. Is the hero a centred headline + subtitle + two buttons + a screenshot, without a reason?
3. Is there a bento grid without a concept reason?
4. Do all sections use the same layout?
5. Is the nav "logo left, 5 links centre, button right", and the footer four columns of links, without thought?

**Visual**
6. Is the display font <!--rule:banned_display_fonts-->Inter, Roboto, Open Sans, Lato, Poppins, Montserrat, Arial, Helvetica or the system UI stack<!--/rule-->? Is <!--rule:caution_fonts-->Playfair Display and Space Grotesk<!--/rule--> used without a stated reason?
7. Is there a purple/blue/pink gradient, a glowing orb or blurred blobs without meaning?
8. Is glassmorphism used without the concept needing layers?
9. Is there an icon above every feature title?
10. Are there more than one accent colour or more than one display face, without a reason?
11. Is every corner the same large radius, with a shadow and a border all at once?
12. Is the hero image a generic stock photo or AI art with no relation to the brief?

**Content**
13. Is there lorem ipsum, "Acme", "John Doe", or placeholder copy?
14. Are there invented statistics, logos, testimonials or awards?
15. Does the copy contain any banned phrase from `craft/copy.md`?
16. Are there emoji used as icons or bullets?

**Motion**
17. Does anything fade-up on scroll just because it can?
18. Is any animation missing a reduced-motion path?
19. Are layout properties animated?
20. Do UI feedback animations exceed <!--rule:ui_feedback_max_ms-->250ms<!--/rule-->, or use ease-in or `scale(0)` entrances?
21. Is the scroll hijacked (custom scroll that breaks keyboard, anchor links or screen readers)?
22. Does any loop or canvas keep running off-screen?

**Code**
23. Are there TODOs, `// ...rest`, or unfinished components?
24. Are there clickable `div`s, missing labels or missing `alt` text?
25. Are there `markers: true`, console logs or unused imports left in?

**Copy** (the copy pass in `craft/copy.md`)
26. Does more than one section headline share the same shape (all questions, all "X. Y." fragments, all mirror sentences)?
27. Does any sentence end in a vague "-ing" benefit tail, or cite unnamed experts or studies?
28. Is the same thing called by more than one name across the page (synonym cycling)?
29. Does an em dash appear in most paragraphs, or does every section close with a generic invitation?

---

## Part 3: Craft checklist

- [ ] Concept sentence and signature move are visible in the first screen
- [ ] Type: display face chosen with a reason; body ≥ 16px; measure ≤ 75ch; `text-wrap: balance` on headings
- [ ] Colour: all text pairs verified (`node scripts/contrast.mjs` while designing, `node scripts/gate.mjs` on the build), accent ≤ 5% of each screen
- [ ] Layout: one deliberate grid break per screen, recomposed (not squeezed) on mobile
- [ ] Motion: tokens used; `gsap.matchMedia()` with reduced-motion and pointer conditions; `ScrollTrigger.refresh()` after load
- [ ] Mobile motion matrix applied
- [ ] Accessibility: keyboard path, visible focus, landmarks, skip link, alt text
- [ ] Performance: LCP image preloaded, heavy libraries loaded dynamically, off-screen work paused
- [ ] SEO: title, description, OG image, structured data, `llms.txt` (for sites)
- [ ] Copy: real, specific, no banned phrases; the copy pass in `craft/copy.md` run with every row "none found" or fixed; `[NEEDS COPY]` markers listed for the user
- [ ] "Restraint Gate record" filled in `DESIGN.md` (concept survived?, every cut, every rejected animation)
- [ ] `node scripts/gate.mjs` run on the build; its full `critique: … · gate: …` line pasted and `--verify` passes (or "not verified — no browser" reported)
- [ ] Stamp comment written; run logged with `node scripts/memory.mjs log …`

---

## Handoff note (end every delivery with this)

```
Chose     : <archetype + mutation, signature, type, palette, tier>
Rejected  : <the obvious option and why>
Needs     : <[NEEDS COPY]/[NEEDS ASSET] items for the user>
Measured  : <the gate.mjs stamp line and real numbers, or "not verified — no browser">
Try next  : <one command, e.g. /bolder on the hero, or /motomate the product chapter>
```
