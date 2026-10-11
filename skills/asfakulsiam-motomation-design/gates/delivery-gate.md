# Delivery Gate

Run this before handing back **any** page or component. It has four parts: the measured gate, a self-critique score, the AI-default scan and the craft checklist. If anything fails, fix it and run the gate again. Two passes is normal; needing three means the concept is weak, so go back to the Thinking Sequence.

---

## Part 0: Measured gate (`scripts/gate.mjs`)

Build the page, then run the script against the built file, folder or URL:

```bash
node scripts/gate.mjs dist/index.html          # or a folder, or http://localhost:3000/
node scripts/gate.mjs --verify dist/index.html # re-scan and check the stamp written in the file
```

It runs five bounded checks in a real browser and prints numbers:

| Code | Check | Fails when |
|---|---|---|
| `c` | **Contrast**: every visible text element against the pixels actually behind it. The text is hidden, the viewport is screenshotted at each scroll position and the background is sampled. Each element is judged at its most visible state. | below 4.5:1 for body text, below 3:1 for large text (≥ 24px, or ≥ 18.66px bold) |
| `o` | **Overflow** at 375, 390, 768 and 1440px | the page scrolls sideways, or an element leaves the viewport or pushes text out of its parent by more than 1px with no clipping ancestor |
| `w` | **Long display words** at 375px: every h1–h3 and any text ≥ 32px, including decorative text | the text is wider than its box, leaves the viewport, breaks a word across lines, or splits one word across elements (e.g. "Have" + "li" on two door leaves) |
| `rm` | **Reduced motion**: the page loaded with `prefers-reduced-motion: reduce` | text that is visible normally is hidden, or pixels keep changing on a still page |
| `a` | **Alt and names** | an `img` has no `alt`, or a link, button, input or other focusable element has no accessible name |

The output ends with a stamp line built only from those numbers:
`gate: c0 o0 w0 rm0 a0 · gate/1 · <id>`. The id is a hash of what was measured on this page, so the same page gives the same id and a different page does not.

**Rule: a stamp is only valid if it contains numbers produced by `scripts/gate.mjs` in the same run. A hand-written stamp is rejected.** Paste the line the script printed. Never type the numbers yourself and never copy them from an example or an earlier page. `--verify` re-scans the page and rejects any stamp whose numbers or id differ from the fresh scan, or that has no `gate:` segment at all.

**No browser, no pass.** If Playwright or Chromium is missing, the script prints `not verified — no browser` and exits with code 3. Report exactly that in the handoff (`Measured: not verified — no browser`) and leave the `gate:` segment out of the stamp. Don't write a pass you didn't measure.

The checks are bounded, and each reports what it skipped (text that was covered or never settled, elements parked off-canvas such as skip links and closed drawers). A clean run means these five things were measured. It doesn't mean the page is accessible. Keyboard paths, focus order and copy still need Parts 1–3.

Exit codes: `0` pass · `1` fail · `2` stamp rejected · `3` not verified.

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

**Any score below 4 → revise before continuing.** Write the scores into the stamp comment, after the `gate:` line from Part 0:
`/* motomation · archetype: <x> · mutation: <y> · signature: <z> · tier: <n> · critique: C<n> H<n> S<n> R<n> M<n> V<n> · gate: <paste the line gate.mjs printed> */`

The placeholders are deliberate. There are no numbers to copy. A stamp without a measured `gate:` segment is rejected by `node scripts/gate.mjs --verify`.

---

## Part 2: AI-default scan (every answer must be "no")

**Structure**
1. Is the page hero → logo wall → 3 features → testimonials → pricing → CTA?
2. Is the hero a centred headline + subtitle + two buttons + a screenshot, without a reason?
3. Is there a bento grid without a concept reason?
4. Do all sections use the same layout?
5. Is the nav "logo left, 5 links centre, button right", and the footer four columns of links, without thought?

**Visual**
6. Is the display font Inter, Roboto, Open Sans, Lato, Poppins, Montserrat or a system font?
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
20. Do UI feedback animations exceed 300ms, or use ease-in or `scale(0)` entrances?
21. Is the scroll hijacked (custom scroll that breaks keyboard, anchor links or screen readers)?
22. Does any loop or canvas keep running off-screen?

**Code**
23. Are there TODOs, `// ...rest`, or unfinished components?
24. Are there clickable `div`s, missing labels or missing `alt` text?
25. Are there `markers: true`, console logs or unused imports left in?

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
- [ ] Copy: real, specific, no banned phrases; `[NEEDS COPY]` markers listed for the user
- [ ] `node scripts/gate.mjs` run on the build; its stamp line pasted (or "not verified — no browser" reported)
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
