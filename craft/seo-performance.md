# SEO & Performance

SEO, performance, and accessibility are design inputs, not post-launch tasks.

## Core rules
1. Plan routes, indexability, and content before designing the visual system.
2. One URL, one clear purpose.
3. Content must be genuine — never invent projects, testimonials, metrics, or schema values.
4. Semantic HTML first. Keep essential content out of canvas/WebGL.
5. Make important content discoverable without requiring animation.
6. Design mobile intentionally.
7. Measure — do not claim scores or indexing without evidence.
8. Protect private routes with real authentication, not just `noindex`.

## Technical checklist (minimum)
- Unique, descriptive titles and meta descriptions
- Correct canonical URLs
- Valid sitemap.xml and robots.txt
- Meaningful image alt text
- Open Graph / social metadata
- Structured data only when accurate and eligible
- Core Web Vitals awareness (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 as targets)
- Prefer modern image formats and responsive sizes
- Lazy-load below-the-fold media; do not lazy-load the LCP image blindly
- Clean up animation and GPU resources

## Motion & SEO relationship
- Do not hide essential text exclusively inside canvas or animation sequences.
- Provide a usable experience when JavaScript or WebGL fails.
- Reduced-motion users must still receive complete content.

## Agent rule
Never claim Search Console verification, indexing success, Lighthouse scores, or Core Web Vitals results unless they were actually measured.