# Brief 05: Climate non-profit (benchmark: public-interest website)
Site for **Sundari Trust**, a non-profit that restores mangroves in the Sundarbans buffer zone with local communities. Needs donations and volunteer sign-ups. Bangla and English.

## Content
- Real figure: **140 hectares replanted since 2019** (source: Sundari Trust annual report 2025). Use only this figure.
- Work: community nurseries run by women's groups in Shyamnagar and Koyra; planting in the monsoon; three years of care for each plot.
- Donate: ৳500 grows a nursery tray, ৳2,000 plants a plot row, ৳10,000 funds a season of care (one-time or monthly; the form can be a front-end mock).
- Volunteer: planting season July–September; sign-up form with name, email, phone, preferred month.
- Bilingual: the headline and section titles in Bangla and English (e.g. "ম্যানগ্রোভ ফিরিয়ে আনি / Bringing the mangroves back").
- Contact: hello@sundaritrust.org.

**Expect:** WCAG AA, MOTION ≤ 2, no guilt imagery, the real figure with its source, bilingual typography.

## Benchmark conditions (identical for baseline and skill runs)
- Deliver **one self-contained `index.html`** (inline CSS and JS). Allowed external resources: Google Fonts or Fontshare CSS, and GSAP 3 + ScrollTrigger from a CDN. No other libraries, no image URLs: draw imagery with CSS, SVG or canvas.
- Use only the facts in this brief. Don't invent clients, logos, testimonials or statistics; leave them out.
- It must work at 375px and 1440px wide, by keyboard, and with `prefers-reduced-motion: reduce`.
