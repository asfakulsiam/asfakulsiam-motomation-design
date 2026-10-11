# Accessibility (WCAG 2.2 AA minimum)

Award-level means usable by everyone. These rules are part of the design, not a final pass.

## Structure
- One `<h1>` per page; headings in order; landmarks (`header`, `nav`, `main`, `footer`).
- Interactive elements are real `<button>` and `<a href>`, never clickable `<div>`s.
- Split text (letters/words) keeps an accessible name: `aria-label` on the parent, `aria-hidden="true"` on the pieces. GSAP SplitText handles this automatically.
- Skip link to `#main` as the first focusable element.

## Visual
- Contrast: 4.5:1 body text, 3:1 large text and UI component boundaries. Verify with `node scripts/contrast.mjs`.

### Contrast rules you can check by reading the CSS

You don't need a browser or a script for these. Read the stylesheet and check each rule. A "no" on any of them is a failure.

1. **Every text token against every surface it sits on.** Write the pairs as a comment next to the tokens, one per surface, with the ratio: `/* --muted on --ground 5.01 · on --surface 4.45 ✗ */`. A tinted panel, card, band or overlay counts as its own surface. Checking only against the page ground isn't enough.
2. **A muted token belongs to one surface.** `--muted` is for `--ground` only. Text inside any rule whose background is something else (`--surface`, `--panel`, a dark band) uses `--ink` or a token made for that surface (`--muted-on-surface`). Read each `color: var(--muted)` and look up the background of that selector and its parents. If it isn't the ground, that's a failure.
3. **Margin for small, muted text.** Muted text below 14px, or mono/uppercase captions, needs at least **4.7:1**, not 4.5. Thin strokes at 11–13px lose contrast to antialiasing, and a 4.45 that rounds to "about 4.5" is a fail.
4. **Small text has a floor.** Nothing below 12px (`0.75rem`). Text under 14px over an image or video sits on a solid chip, never straight on the picture.
5. **No dimming by opacity.** Never lower text contrast with `opacity` or an alpha colour (`rgb(… / .6)`, `#0008`). The ratio then depends on whatever is behind it. Use a solid token with a known ratio.
6. **Text over images or gradients** sits on a solid or scrimmed area with a stated worst-case ratio. Without one, it fails.
7. **No text below 4.5:1 on the ground.** That includes eyebrows, links and accent-coloured labels: an accent that reads as "bold" on screen is often 3.5–4.4:1 at 12px.

Example. In the v2.1.0 studio output, `.plan{background:var(--surface)}` and `.plan figcaption{color:var(--muted);font-size:.7rem}` fail rules 1–3 by reading alone. `--muted` (#6B6157) passes on the ground (#EFE9E1) but sits on `--surface` (#E4DCD1) at 4.45:1, in 11px mono caps. The measured gate (`scripts/gate.mjs`) later confirms the same five captions at 4.45:1.
- Focus is always visible and designed (`:focus-visible` ring in the accent colour, 2px or more, with offset).
- Never convey meaning by colour alone.
- Text resizes to 200% without loss; layout holds at 320px wide.
- Target size: 24×24px minimum (WCAG 2.2), with 44×44px recommended for primary touch targets.

## Motion
- Every animation has a `prefers-reduced-motion` path (see `motion/tokens.md`).
- Nothing flashes more than 3 times per second.
- Anything that moves for longer than 5 seconds (marquees, loops, video) can be paused.
- Scroll is never hijacked: native keyboard scrolling (Space, PageDown, arrows) and screen readers move through content normally. Pinned sections still read in DOM order.

## Interaction
- All functionality works with the keyboard; the focus order follows the visual order.
- Cursor-only effects have a non-cursor equivalent (content visible by default, or tap/Enter to reveal).
- Custom cursors never hide the real pointer for users who need it; respect `(pointer: coarse)`.
- Forms: visible labels, errors in text near the field, `aria-describedby` for hints, `autocomplete` attributes.

## Media
- Meaningful images have `alt` text describing their role; decorative images have `alt=""`.
- Video has captions; autoplay video is muted, has controls and pauses for reduced motion.
- Canvas/WebGL content has a DOM text equivalent.
