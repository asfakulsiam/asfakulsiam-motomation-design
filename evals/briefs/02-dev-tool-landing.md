# Brief 02: Developer tool landing page (benchmark: SaaS product)
Landing page for **Tracewell**, a CLI and web app that finds the one log line that explains an incident. Audience: on-call backend engineers.

## Content
- One-liner: "From 4 million log lines to the one that matters."
- How it works: `tracewell ingest` (stream logs from files, Docker or Kubernetes) → `tracewell why --since 15m` (ranks lines by how unusual they are compared with the last 7 days) → share the explanation link with the team.
- Show the product working: a terminal session and a result view (build them in HTML/CSS).
- Pricing: Free (1 user, 3 days of retention) · Team $12 per seat per month (30 days retention, shared incidents, SSO).
- Install: `brew install tracewell` or `curl -fsSL https://tracewell.dev/install.sh | sh`.
- No customer logos yet, no usage numbers. Don't invent any.

**Expect:** no fake logos or metrics, the product shown working, Console or Workbench thinking, MOTION 2.

## Benchmark conditions (identical for baseline and skill runs)
- Deliver **one self-contained `index.html`** (inline CSS and JS). Allowed external resources: Google Fonts or Fontshare CSS, and GSAP 3 + ScrollTrigger from a CDN. No other libraries, no image URLs: draw imagery with CSS, SVG or canvas.
- Use only the facts in this brief. Don't invent clients, logos, testimonials or statistics; leave them out.
- It must work at 375px and 1440px wide, by keyboard, and with `prefers-reduced-motion: reduce`.
