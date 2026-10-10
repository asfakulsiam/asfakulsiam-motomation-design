# Accessibility (WCAG 2.2 AA minimum)

Award-level means usable by everyone. These rules are part of the design, not a final pass.

## Structure
- One `<h1>` per page; headings in order; landmarks (`header`, `nav`, `main`, `footer`).
- Interactive elements are real `<button>` and `<a href>`, never clickable `<div>`s.
- Split text (letters/words) keeps an accessible name: `aria-label` on the parent, `aria-hidden="true"` on the pieces. GSAP SplitText handles this automatically.
- Skip link to `#main` as the first focusable element.

## Visual
- Contrast: 4.5:1 body text, 3:1 large text and UI component boundaries. Verify with `node scripts/contrast.mjs`.
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
