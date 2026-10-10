# Type Signatures

## 1. Proximity Weight
**Idea:** letters near the cursor get heavier (or wider), like a lens of weight following the pointer.
**Why it works:** "attention" made visible. Good for portfolios, type-led brands and manifesto headlines.
**Build:**
```js
const letters = [...document.querySelectorAll(".pw span")];   // one span per letter, aria-hidden; keep an sr-only copy of the word
const radius = 160, min = 300, max = 900;
addEventListener("pointermove", (e) => {
  for (const el of letters) {
    const r = el.getBoundingClientRect();
    const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
    const t = Math.max(0, 1 - d / radius);
    el.style.fontVariationSettings = `"wght" ${Math.round(min + (max - min) * t * t)}`;
  }
}, { passive: true });
```
**The detail that matters:** cache the letter centres on resize instead of measuring on every move, and ease with `t * t` so the falloff feels optical, not linear.
**Off-switch:** only when `(hover: hover) and (pointer: fine)` and motion is allowed; otherwise one static weight.
**Prompt:** "Split the hero word into letter spans (aria-hidden, with a screen-reader copy). On pointer move, set each letter's variable font weight from 300 to 900 based on its distance to the cursor within 160px, with quadratic falloff. Cache letter centres on resize. Disable on touch and reduced motion."

## 2. Letter Relay
**Idea:** the big name in the hero breaks into letters that travel one by one into the small header logo as you scroll.
**Why it works:** identity becomes navigation. The brand "follows" you.
**Build:** pin nothing. Use a scrubbed timeline from the hero letter positions to the header letter positions with GSAP Flip, or measure deltas and tween `x`/`y`/`scale` for each letter with a 0.02 stagger, `scrub: 0.5`, `end: "+=60%"`.
**The detail that matters:** disable any hover effects on the letters while they're travelling, so the hover never fights the scroll.
**Off-switch:** reduced motion: the header logo is simply visible; the hero name scrolls away normally.
**Prompt:** "As the user scrolls the first 60% of the viewport, move each letter of the hero name into the matching letter of the small header wordmark using a scrubbed GSAP timeline with a 0.02s stagger. Lock hover effects while letters travel. Reduced motion: show the header wordmark immediately."

## 3. Line Curtain
**Idea:** headlines rise line by line from behind invisible masks, like a curtain lifting.
**Why it works:** the house default reveal. Calm, editorial and confident.
**Build:** see `motion/tier-2-intermediate.md` → line reveal (`SplitText` with `mask: "lines"`, `yPercent: 110`, `expo.out`, stagger 0.08).
**The detail that matters:** reveal each heading **once**, starting at about 85% of the viewport, and re-split on resize (`autoSplit`) so lines stay correct.
**Off-switch:** text is visible in its final state.
**Prompt:** "Reveal every h1 and h2 by lines using GSAP SplitText with line masks: yPercent 110 → 0, expo.out, 0.9s, stagger 0.08, triggered once at top 85%. Use autoSplit and return the tween from onSplit. Reduced motion: no animation."

## 4. Width Sprint
**Idea:** a variable-width headline stretches wider the faster you scroll, then settles back.
**Why it works:** speed, sport, film, launch energy.
**Build:**
```js
const el = document.querySelector(".sprint"); let w = 100;
ScrollTrigger.create({ onUpdate: (self) => {
  const v = Math.min(Math.abs(self.getVelocity()) / 30, 25);      // 0..25
  gsap.to(el, { "--wdth": 100 + v, duration: 0.3, overwrite: true, ease: "power2.out" });
}});
```
```css
.sprint { font-variation-settings: "wdth" var(--wdth, 100); }
```
**The detail that matters:** clamp the range to the font's real axis (check `data/fonts.csv`), and settle back with `power2.out` so it doesn't jitter.
**Off-switch:** fixed width.
**Prompt:** "Use a variable font with a width axis for the display heading. Map ScrollTrigger velocity to an extra 0–25 units of width with a 0.3s power2.out settle. Clamp to the font's axis range. Reduced motion: fixed width."

## 5. Decode
**Idea:** text resolves from random glyphs into the real word, letter by letter.
**Why it works:** technical, cryptographic, "revealing the truth". Use it only for short labels, never paragraphs.
**Build:** GSAP `ScrambleTextPlugin`: `gsap.to(el, { duration: 1, scrambleText: { text: el.dataset.text, chars: "01▮▯", speed: 0.4 } })`.
**The detail that matters:** keep the final text in the DOM for screen readers (`aria-label`) and fix the element width to stop layout jumps.
**Off-switch:** final text instantly.
**Prompt:** "For elements with data-decode, animate the text from random characters '01▮▯' to its final value with GSAP ScrambleTextPlugin over 1s when it enters view. Keep an aria-label with the final text and reserve width to avoid layout shift."

## 6. Neighbour Moves
**Idea:** every letter of a name has its own hover animation, and neighbouring letters never share one.
**Why it works:** playful personality without turning the name into a toy. You touch one letter at a time.
**Build:** define 6–8 short `@keyframes` (squash, tip-and-swing, drop-and-spring, flip, shiver, pop, hop, slide). Assign them in a cycle so neighbours differ. Trigger on `pointerenter` per letter, then remove the class on `animationend`.
**The detail that matters:** ignore re-triggers while a letter is already animating, and disable all moves while the name is moving for any other reason (scroll, transition).
**Off-switch:** no hover animation; normal text.
**Prompt:** "Split the name into letters. Write eight 400–600ms hover keyframes (squash, tip-and-swing, drop-and-spring, 3D flip, shiver, pop, hop, slide) and cycle them so neighbours never match. Trigger per letter on pointerenter, ignore re-triggers mid-animation, and turn it all off on touch and reduced motion."

## 7. Ink Fill
**Idea:** a long statement starts in a muted grey and fills with ink word by word as you scroll through it.
**Why it works:** reading becomes progress. Perfect for manifestos and "about" statements.
**Build:** split into words; scrub `color` (or `opacity` 0.2 → 1) across the words with `stagger`, `scrub: true`, `start: "top 70%"`, `end: "bottom 40%"`.
**The detail that matters:** the muted state must still meet 4.5:1 contrast if the text is readable content. Otherwise animate opacity on a duplicate decorative layer.
**Off-switch:** full ink.
**Prompt:** "Split the manifesto paragraph into words and scrub their colour from the muted token to the ink token as it scrolls from top 70% to bottom 40%. Keep the muted colour at 4.5:1 contrast. Reduced motion: full ink colour."
