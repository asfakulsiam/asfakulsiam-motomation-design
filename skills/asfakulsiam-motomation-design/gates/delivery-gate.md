# Delivery Gate

Run this before handing back **any** page or component. It has three parts: a self-critique score, the AI-default scan and the craft checklist. If anything fails, fix it and run the gate again. Two passes is normal; needing three means the concept is weak, so go back to the Thinking Sequence.

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

**Any score below 4 → revise before continuing.** Write the scores into the stamp comment:
`/* motomation · archetype: ledger · mutation: invert-axis · signature: letter-relay · tier: 2 · critique: C5 H4 S5 R4 M5 V5 */`

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
- [ ] Colour: all text pairs verified (`node scripts/contrast.mjs`), accent ≤ 5% of each screen
- [ ] Layout: one deliberate grid break per screen, recomposed (not squeezed) on mobile
- [ ] Motion: tokens used; `gsap.matchMedia()` with reduced-motion and pointer conditions; `ScrollTrigger.refresh()` after load
- [ ] Mobile motion matrix applied
- [ ] Accessibility: keyboard path, visible focus, landmarks, skip link, alt text
- [ ] Performance: LCP image preloaded, heavy libraries loaded dynamically, off-screen work paused
- [ ] SEO: title, description, OG image, structured data, `llms.txt` (for sites)
- [ ] Copy: real, specific, no banned phrases; `[NEEDS COPY]` markers listed for the user
- [ ] Stamp comment written; run logged with `node scripts/memory.mjs log …`

---

## Handoff note (end every delivery with this)

```
Chose     : <archetype + mutation, signature, type, palette, tier>
Rejected  : <the obvious option and why>
Needs     : <[NEEDS COPY]/[NEEDS ASSET] items for the user>
Measured  : <real numbers, or "performance not measured">
Try next  : <one command, e.g. /bolder on the hero, or /motomate the product chapter>
```
