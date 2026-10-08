# Performance

Performance is a design decision. A site that feels slow is a design failure even if the visuals are strong.

## Non-negotiable rules

- Animate transform and opacity by default. Layout properties cause reflow and are expensive.
- Prefer will-change only on elements that will actually animate, and remove it when idle.
- Images: correct size, modern formats (AVIF/WebP), lazy loading, proper width/height to avoid CLS.
- Fonts: subset, use font-display: swap or optional, preload critical faces.
- JavaScript: code-split, defer non-critical work, clean up listeners and animation contexts.
- WebGL / canvas: dispose resources, cap pixel ratio, provide fallbacks.

## Motomation-specific

- Preload the first critical frames of any sequence.
- Throttle or sample scroll progress updates if necessary.
- Offer a “reduced motion / low power” path that skips heavy sequences.
- Measure frame times. 60 fps is the target; 30 fps is the absolute floor for cinematic work.

## Measurement

- Core Web Vitals matter.
- Test on mid-range Android and older iPhones.
- Use Lighthouse, WebPageTest, and real-device profiling.

A beautiful experience that only works on a high-end laptop is incomplete.