# Page templates

8 whole pages, each composed only from the sections in `examples/sections/` (a template imports sections and nothing else; `node scripts/build-templates.mjs` checks this). Each sets its brand once: colours and fonts as CSS variables, so the same sections change voice per page. Each built page is server-rendered HTML with its own stamp, measured by the Delivery Gate (`scripts/gate.mjs`) and checked with `gate.mjs --verify`.

| Page | Kind | Archetype · mutation · signature | Tier | Sections (in order) | Fonts |
|---|---|---|---|---|---|
| [The river took the school · The Delta Review](editorial-article.html) ([source](editorial-article/page.tsx)) | editorial article | broadsheet · print-rule · decode | 2 | `hero-editorial-broadsheet` → `feature-editorial-pullquote` → `footer-editorial-folio` | Bodoni Moda / Instrument Sans / JetBrains Mono |
| [Monsoon Jazz Night · National Theatre Hall, 14 November](event.html) ([source](event/page.tsx)) | event landing | poster · scale-abuse · velocity-skew | 4 | `hero-event-poster` → `team-event-lineup` → `pricing-event-tickets` → `contact-event-venue` | Anybody / Instrument Sans / JetBrains Mono |
| [Haveli Panam · seven rooms in Sonargaon](hotel.html) ([source](hotel/page.tsx)) | hotel / hospitality | room · reverse-reveal · aperture | 2 | `hero-hotel-room` → `features-hotel-rooms` → `pricing-hotel-seasons` → `testimonial-hotel-guestbook` → `contact-hotel-atlas` | Cormorant Garamond / Instrument Sans / JetBrains Mono |
| [River Commons · a public trust for Bangladesh's rivers](org.html) ([source](org/page.tsx)) | public-interest organisation | manifesto · constraint · seismograph-line | 2 | `hero-org-manifesto` → `features-org-impact` → `team-org-field-guide` → `cta-org-donate` → `footer-org-seismograph` | Gloock / Schibsted Grotesk / JetBrains Mono |
| [Letters from Nusrat · one letter a month](personal.html) ([source](personal/page.tsx)) | personal brand | letter · second-person · thread | 2 | `hero-personal-letter` → `testimonial-personal-replies` → `cta-personal-subscribe` | Instrument Serif / Familjen Grotesk / JetBrains Mono |
| [Tally · bookkeeping in Bangla and English for small shops](saas-landing.html) ([source](saas-landing/page.tsx)) | SaaS landing | workbench · ui-is-content · ink-fill | 2 | `hero-saas-workbench` → `features-saas-bento` → `features-saas-console` → `testimonial-saas-ink` → `pricing-saas-switch` → `cta-saas-trial` | Bricolage Grotesque / Hanken Grotesk / JetBrains Mono |
| [Mati · No. 14-07, Ash celadon plate](shop-product.html) ([source](shop-product/page.tsx)) | e-commerce product | catalogue · single-object · hold-to-commit | 2 | `hero-shop-catalogue` → `features-shop-specs` → `testimonial-shop-notes` → `cta-shop-hold` → `gallery-shop-carousel` → `pricing-shop-glazes` | Fraunces / Familjen Grotesk / JetBrains Mono |
| [Hawa Studio · design for public institutions, Dhaka](studio-portfolio.html) ([source](studio-portfolio/page.tsx)) | portfolio (studio) | ledger · swap-material · lens | 2 | `hero-studio-ledger` → `features-studio-services` → `team-studio-rows` → `contact-studio-copy` → `footer-studio-marquee` | Young Serif / Hanken Grotesk / JetBrains Mono |

**What each page is**

- **The river took the school · The Delta Review** (editorial article): A long-read set like a broadsheet: masthead, deck and columns, one pull quote that inks in as it is read, and a folio footer that remembers what you've read.
- **Monsoon Jazz Night · National Theatre Hall, 14 November** (event landing): A one-night concert as a poster: the name under stage light, the lineup in running order, tickets drawn as tickets, and how to get to the hall.
- **Haveli Panam · seven rooms in Sonargaon** (hotel / hospitality): A heritage hotel that opens with a door: the courtyard, the upstairs gallery of rooms, rates by season, one guest-book entry, and the way from Dhaka.
- **River Commons · a public trust for Bangladesh's rivers** (public-interest organisation): A river trust's case in one page: the claim, a year of audited hearings, the people who watch the banks, gifts tied to real costs, and its registration.
- **Letters from Nusrat · one letter a month** (personal brand): A writer's homepage that is this month's letter: written to the reader, with replies that came in the post and a postscript to subscribe.
- **Tally · bookkeeping in Bangla and English for small shops** (SaaS landing): A bookkeeping app for corner shops where the product is the page: the day's ledger, the four screens, the export line, one customer's evening, two plans.
- **Mati · No. 14-07, Ash celadon plate** (e-commerce product): One plate from a small firing, sold like a catalogue lot: the object, its making in four steps, buyers' notes, a hold to reserve, then the rest of the shelf.
- **Hawa Studio · design for public institutions, Dhaka** (portfolio (studio)): A design studio's site kept as its account book: projects as ledger entries, services with fixed shapes, the team at the table, and the wait for a new start.

**Tier 5 film templates** (standalone: `index.html` + a frame sequence, not built from sections)

2 scroll-as-film pages. Each folder holds the page, its `scene.mjs`, the frames rendered from it by `scripts/build-frames.mjs` (`poster.webp`, `storyboard/`, `frames.json`; `frames/`, `frames-mobile/` and `film.mp4` are not on main: `node scripts/fetch-frames.mjs` restores them from the tarball named in `frames.lock.json`, sha256-checked), `DESIGN.md`, `MOTION.md` and `log.json`. Reduced motion is the storyboard: stills in normal flow, no canvas mounted.

| Page | Archetype · mutation · signature | Tier | Frames (desktop · mobile) | Fonts | Motion | Tier 5 assets |
|---|---|---|---|---|---|---|
| [Noor Haque · titles and motion for film](motion-portfolio/index.html) | film-reel · tempo-shift · timecode-rail | 5 | 180 × 1920×1080 · 90 × 828×1472 | Bricolage Grotesque / Hanken Grotesk / JetBrains Mono | [MOTION.md](motion-portfolio/MOTION.md) | `MOTION.md` · `poster.webp` · `frames.lock.json` · `fetch-frames.mjs motion-portfolio` |
| [Shapla R1 · a kitchen radio you tune by hand](product-launch/index.html) | stage · single-object · aperture | 5 | 180 × 1920×1440 · 90 × 828×1036 | Fraunces / Schibsted Grotesk / JetBrains Mono | [MOTION.md](product-launch/MOTION.md) | `MOTION.md` · `poster.webp` · `frames.lock.json` · `fetch-frames.mjs product-launch` |

- **motion-portfolio**: Noor Haque designs title sequences in Dhaka. The reel on this page is a film you play by scrolling: four shots, four commissions.
- **product-launch**: Shapla R1 is an FM radio in a folded aluminium shell, with a dial you turn by hand. Pre-orders ship in March 2027.

Rebuild a film's frames and check they are byte-identical (from the skill folder):

```sh
node scripts/build-frames.mjs --scene examples/templates/<id>/scene.mjs --out examples/templates/<id>
node scripts/build-frames.mjs --scene examples/templates/<id>/scene.mjs --out examples/templates/<id> --check
node scripts/gate.mjs examples/templates/<id>/index.html
```

**Build and check one**

```sh
node scripts/build-templates.mjs --only <id>          # from the repository root
node skills/asfakulsiam-motomation-design/scripts/gate.mjs skills/asfakulsiam-motomation-design/examples/templates/<id>.html
node scripts/build-templates.mjs --stamp <id> "critique: … · gate: …"   # paste the line the gate printed
node skills/asfakulsiam-motomation-design/scripts/gate.mjs --verify skills/asfakulsiam-motomation-design/examples/templates/<id>.html
```

Fonts are self-hosted from `fonts/` (SIL Open Font License 1.1; see `fonts/LICENSES.md`). Every page also loads Hind Siliguri for Bangla text and the taka sign, limited by `unicode-range` so it downloads only when Bengali characters are on the page.
