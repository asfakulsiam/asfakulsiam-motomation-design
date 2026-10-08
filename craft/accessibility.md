# Accessibility & Reduced Motion

Accessibility is not optional. Every site produced under this skill must be usable by as many people as possible.

## Baseline requirements

- Semantic HTML
- Sufficient color contrast (WCAG AA minimum, AAA preferred for body text)
- Visible focus states that meet contrast requirements
- Keyboard navigable interactive elements
- Meaningful alt text for images that convey information
- Proper heading hierarchy
- Form labels and error messages that are programmatically associated

## prefers-reduced-motion

This media query is mandatory.

When reduced motion is requested:

- Disable or simplify all non-essential animation
- Replace scrubbed sequences with static key frames or a short controlled video
- Keep essential feedback (focus, state changes) but make it instant or very short
- Never leave the user with a broken or empty experience

## Motomation under reduced motion

Provide a complete alternative narrative path. The story and information must still be available. A static but well-designed long-scroll page is acceptable; a blank canvas is not.

## Testing

- Keyboard-only navigation
- Screen reader spot checks
- Forced colors / high contrast mode
- Zoom to 200 %
- Reduced motion preference enabled

Design that excludes people is incomplete design.