# Typography

Typography is the main tool of this skill. On a minimal site, the type **is** the visual identity. Choose type first, before colour or layout.

## 1. Choose with a reason

Write one line: *"<Display> because <reason tied to the concept>; <Text> because it stays out of the way."*

- Concept about precision or engineering: a grotesk with tight apertures or a mono.
- Concept about heritage, craft or slowness: a serif with visible stroke contrast or calligraphic roots.
- Concept about film, sport or speed: a condensed display with a width axis.
- Concept about play: a face with unusual shapes, used **only** at display sizes.

Search the curated list: `node scripts/search.mjs fonts "<mood words>"`. `data/fonts.csv` lists source, license, axes and good pairings.

## 2. Banned as display faces

Inter, Roboto, Open Sans, Lato, Poppins, Montserrat, Arial/Helvetica fallbacks and the system UI stack. They're fine as **text** faces when chosen deliberately, never as the identity. Also avoid using Playfair Display and Space Grotesk on autopilot: they became AI defaults.

## 3. Scale

Use a fluid, dramatic scale. A good starting point:

```css
:root {
  --step--1: clamp(0.83rem, 0.80rem + 0.15vw, 0.94rem);  /* captions, mono labels */
  --step-0:  clamp(1.00rem, 0.95rem + 0.25vw, 1.19rem);  /* body */
  --step-1:  clamp(1.25rem, 1.10rem + 0.70vw, 1.75rem);  /* lead */
  --step-2:  clamp(1.75rem, 1.40rem + 1.80vw, 3.00rem);  /* section titles */
  --step-3:  clamp(2.75rem, 1.80rem + 4.80vw, 6.50rem);  /* page titles */
  --step-4:  clamp(4.00rem, 1.50rem + 12vw, 14rem);      /* hook / display */
}
```

- Display sizes in `vw` (via `clamp`) so the word fills the composition at every width.
- Body text never below 16px. Measure 60–75 characters (`max-width: 68ch`).
- Line-height: display 0.85–1.0, headings 1.05–1.2, body 1.5–1.65.

## 4. Details that separate designed from generated

- `text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs.
- Optical tracking: tighten large type (-0.02em to -0.05em); open small caps and mono (+0.06em to +0.12em).
- Real typographic characters: curly quotes (" " ' '), en dash for ranges (10–20), em dash or spaced en dash for breaks, true ellipsis (…), non-breaking spaces before units.
- `font-variant-numeric: tabular-nums` for prices, tables, counters and timecodes.
- Hanging punctuation for pull quotes (`hanging-punctuation: first` where supported; otherwise a negative indent).
- One typographic motif repeated through the site: index numbers `(01)`, folio marks, a dot leader, a superscript counter.

## 5. Variable fonts as motion

Variable axes are your cheapest high-impact motion:
- `wght` (weight) reacting to cursor proximity, see `signatures/type-signatures.md`.
- `wdth` (width) stretching with scroll velocity.
- `opsz` (optical size) adjusting automatically with `font-optical-sizing: auto`.
- Custom axes (e.g. `SOFT`, `WONK` in Fraunces; `YEAR` in Climate Crisis) as concept carriers.

Animate `font-variation-settings` with GSAP or CSS. Keep the change **local** (letters near the cursor), not whole paragraphs, to avoid reflow-heavy work.

## 6. Kinetic type rules

1. **Split with care.** Use GSAP SplitText (`type: "lines,words"`, `mask: "lines"`, `autoSplit: true`). It keeps accessibility labels and re-splits on resize. Never split into characters for body text.
2. **Reveal by lines** with a mask, staggered 0.06–0.12s. Characters only for short display words.
3. **Readable at every frame.** If a frame mid-animation is unreadable for longer than 300ms, it's too much.
4. **Reduced motion:** text appears instantly in its final state.

## 7. Loading

- Self-host or use `next/font`. Subset to the languages you need.
- Preload only the display face used above the fold.
- `font-display: swap`, with metric-compatible fallbacks (`size-adjust`, `ascent-override`) to avoid layout shift.
- Two families at most, three including a mono.

## 8. Pairing method

1. Pick the display face from the concept.
2. Choose a text face that **contrasts in one dimension only**: serif vs sans, or wide vs narrow, never both.
3. Check both at 16px and at 160px side by side.
4. Check language support (Bangla, Arabic, CJK) if the audience needs it. For Bangla, pair with Hind Siliguri, Noto Sans Bengali or Noto Serif Bengali, and test conjuncts.
