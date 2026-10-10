# Cursor and Micro Signatures

Small moments where the page notices the visitor. Every one of them is off on touch devices unless stated, and off for reduced motion.

## 1. Seismograph Line
**Idea:** a hairline across the page bends toward the cursor like a string, and springs back when you leave.
**Build:** an SVG quadratic path `M0,y Q x,cy W,y`. On pointer move near the line, tween `cy` toward the pointer (max ±40px) with `elastic.out(1, 0.4)` on release.
**The detail that matters:** only react within 80px of the line, so it feels found, not forced.
**Prompt:** "Draw a full-width 1px SVG line under the hero. When the pointer is within 80px, pull the line's midpoint toward the pointer (max 40px) and spring back on leave with elastic.out(1,0.4). Fine pointer only; reduced motion off."

## 2. Lens
**Idea:** the cursor becomes a magnifier that shows a sharper or alternate layer of the image beneath it.
**Build:** two stacked images; the top one uses `clip-path: circle(80px at var(--x) var(--y))`, with CSS variables updated on pointer move (throttled with rAF).
**The detail that matters:** the hidden layer must have meaning: the sketch under the final design, the night under the day, the raw material under the product.
**Prompt:** "Stack two images. Reveal the top image only inside an 80px circle following the pointer via clip-path and CSS variables updated in requestAnimationFrame. On touch, toggle the full top image on tap."

## 3. Pixel Wake
**Idea:** the cursor leaves a short trail of square pixels in the accent colour that fade out.
**Build:** a canvas over the hero; on pointer move, push grid-snapped cells with a timestamp; each frame, draw cells with alpha = 1 − age/400ms; stop the loop when it's empty.
**The detail that matters:** snap to a visible grid size (8–16px) so it reads as pixels, and stop rendering completely when there's no movement.
**Prompt:** "Add a canvas over the hero that draws 12px grid-snapped squares in the accent colour along the pointer path, fading over 400ms. Run the rAF loop only while cells exist. Fine pointer only; reduced motion off."

## 4. Sticker Scatter
**Idea:** clicking the name or logo bursts it into stickers (shapes, emoji-free icons, mini words) that fly out and settle with physics.
**Build:** on click, create 8–14 elements at the click point and tween each to a random angle/distance with rotation, gravity via `y` keyframes, then fade. Recycle the nodes.
**The detail that matters:** limit how often it can fire (one burst per 600ms) and keep stickers on-brand (the brand's shapes and words).
**Off-switch:** a small single pulse on click.
**Prompt:** "On click of the logo, spawn 10 on-brand stickers at the click point and animate each with GSAP to a random direction (120–260px), random rotation, slight gravity, then fade out over 1.2s. Throttle to one burst per 600ms. Reduced motion: a single 150ms scale pulse."

## 5. Considerate Magnet
**Idea:** primary buttons lean toward the cursor slightly as it approaches.
**Build:** on pointer move inside a padded area, `gsap.quickTo` the button's `x`/`y` to 25% of the offset (max 10px); reset with `power3.out` on leave.
**The detail that matters:** the **hit area never moves**: animate an inner element, not the button itself. Use it on one or two buttons, never every link.
**Prompt:** "Give the primary CTA a magnetic pull: within a 40px padded zone, move an inner span 25% of the pointer offset (max 10px) using gsap.quickTo, and reset on leave with power3.out. The button's hit area stays fixed. Fine pointer only."

## 6. Remembered List
**Idea:** a project list marks what you've already opened, with a quiet "viewed" mark.
**Build:** on opening an item, store its id in `localStorage`; on render, add a small mono `Viewed` tag or a filled dot.
**The detail that matters:** this is about usability, not flash. It helps the 30-second visitor. Works on touch too.
**Prompt:** "Store opened project slugs in localStorage and show a small mono 'Viewed' label next to them in the index list. Include a way to clear it."

## 7. Brand Selection
**Idea:** text selection uses the brand accent, and the selection colour changes per section.
**Build:** `::selection { background: var(--accent); color: var(--accent-ink); }`, with per-section `--accent` overrides.
**The detail that matters:** check contrast of the selected text against the accent.
**Prompt:** "Style ::selection with the accent background and accent-ink text, overriding the accent per section via CSS variables. Verify 4.5:1 contrast."

## 8. Hold to Commit
**Idea:** an important action (book, buy, send) fills while pressed and completes at the end, with a cancel if released early.
**Build:** on `pointerdown`, tween an inner fill `scaleX: 0 → 1` over 800ms; on complete, fire the action; on `pointerup`/`leave` before complete, reverse quickly. Keyboard: Enter or Space triggers immediately.
**The detail that matters:** never use it for routine actions, and always keep the keyboard path instant.
**Prompt:** "Make the booking button a hold-to-confirm: fill an inner bar over 800ms while pressed, submit on completion, reverse in 200ms if released early. Keyboard Enter or Space submits immediately. Announce state with aria-live."
