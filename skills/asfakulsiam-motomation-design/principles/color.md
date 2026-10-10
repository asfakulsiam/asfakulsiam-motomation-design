# Colour

Colour in this house style is quiet by default and loud at one moment.

## Method

1. **Ground:** choose the background temperature from the concept (warm paper, cool concrete, dark room).
2. **Ink:** the text colour, never pure black on pure white unless starkness is the concept. Aim for 12:1 or higher contrast for body text on the ground.
3. **Muted:** a secondary text and hairline colour, at 4.5:1 or higher for any text.
4. **Accent:** one hue, chosen from the concept (safelight red for a darkroom, brass for a hotel, signal green for a terminal).
5. **Surface:** at most one extra tone for cards or panels, 3–6% away from the ground.

Search curated palettes with `node scripts/search.mjs palettes "<mood>"` and verify every pair with `node scripts/contrast.mjs <fg> <bg>`.

## Tokens

```css
:root {
  --ground: #F3F0EA;
  --surface: #EAE6DE;
  --ink: #151412;
  --muted: #5E5A53;
  --line: color-mix(in oklab, var(--ink) 14%, transparent);
  --accent: #D9481E;
  --accent-ink: #FFFFFF;
}
@media (prefers-color-scheme: dark) { /* only if the concept supports both */ }
```

Use OKLCH or `color-mix(in oklab, …)` for tints so they stay perceptually even.

## Rules

- **Accent footprint ≤ 5% of any screen.** Reserve it for the action, the active state or the signature.
- **No default gradients.** If you use one, it must come from the concept (a sunset hotel, a heat map) and be built in OKLCH to avoid muddy middles.
- **Dark mode is a design, not an inversion.** Lower the contrast of large surfaces slightly, raise the accent's lightness, and swap shadows for hairlines.
- **Images set the palette.** When photography leads, sample the ground and accent from the photos.
- **Contrast is non-negotiable:** 4.5:1 for body text, 3:1 for large text (24px+, or 18.66px+ bold) and UI boundaries.
