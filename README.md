# Tannery Row Coffee

A small, responsive website for a fictional specialty coffee bar, built with the Motomation Design workflow as an
integration check of the skill. It is a functional frontend: every route, interaction and state works, on demo data,
with no backend. It is not production-ready.

All data in data/ is demo. Replace with real data before launch.

## Run it
```bash
npm ci
npm run build      # static export to out/
npx serve out      # or any static host; public/_headers carries the security headers on hosts that read it
```

## What works
- Five routes: front page, menu, visit, contact, privacy; a designed not-found page; sitemap.xml and robots.txt
- Open/closed status in the masthead, computed in the shop's time zone (`lib/hours.ts`)
- Menu laid out as the counter; choosing a drink draws its cup in cross-section; `/menu/#flat-white` preselects a drink
- Contact form with validation, pending, success and error states. It posts to `/api/contact`, which this static build does not have, so it reports an error and says nothing was sent

## Before launch
- Replace `data/` with the real shop, menu and hours, and `public/media/` with the shop's own photographs (`MEDIA.md` lists every placeholder)
- Provide `/api/contact` (see `SCHEMA.md`) or point the form at a form service, and add that origin to `connect-src` in `public/_headers`
- Set `SITE_URL`
- The CSP allows `'unsafe-inline'` scripts because a Next.js static export inlines its hydration data; a server deployment can switch to nonces
