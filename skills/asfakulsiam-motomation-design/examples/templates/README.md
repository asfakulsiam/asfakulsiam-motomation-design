# Page templates

**Templates are design references.** If the brief names Next.js, produce Next.js. If it names plain HTML, produce HTML. Do not copy a template's file structure into a different stack. Each `<id>/` folder is design only: `DESIGN.md` (the decisions), `structure.md` (sections, hierarchy and motion, stack-neutral) and `og.jpg` (the screenshot). The stack comes from Step 0 (`thinking/sequence.md`), never from here. Why: `docs/adr/0001-templates-are-design-references.md`.

The pages are also built once, in one stack, so the Delivery Gate can measure them: the React source is in `examples/builds/<id>/page.tsx` and `<id>.html` is its rendered, gated preview. Both are evidence that the design holds up, not a file layout to reproduce.

8 whole pages, each composed only from the sections in `examples/sections/` (a template imports sections and nothing else; `node scripts/build-templates.mjs` checks this). Each sets its brand once: colours and fonts as CSS variables, so the same sections change voice per page. Each built page is server-rendered HTML with its own stamp, measured by the Delivery Gate (`scripts/gate.mjs`) and checked with `gate.mjs --verify`.

| Page | Kind | Archetype · mutation · signature | Tier | Sections (in order) | Fonts |
|---|---|---|---|---|---|
| [The river took the school · The Delta Review](editorial-article.html) ([structure](editorial-article/structure.md) · [design](editorial-article/DESIGN.md) · [reference build](../builds/editorial-article/page.tsx)) | editorial article | broadsheet · print-rule · remembered-list | 2 | `hero-editorial-broadsheet` → `feature-editorial-pullquote` → `footer-editorial-folio` | Bodoni Moda / Instrument Sans / JetBrains Mono |
| [Monsoon Jazz Night · National Theatre Hall, 14 November](event.html) ([structure](event/structure.md) · [design](event/DESIGN.md) · [reference build](../builds/event/page.tsx)) | event landing | poster · scale-abuse · width-sprint | 4 | `hero-event-poster` → `pricing-event-tickets` → `team-event-lineup` → `contact-event-venue` | Anybody / Anybody / JetBrains Mono |
| [Haveli Panam · seven rooms in Sonargaon](hotel.html) ([structure](hotel/structure.md) · [design](hotel/DESIGN.md) · [reference build](../builds/hotel/page.tsx)) | hotel / hospitality | room · reverse-reveal · darkroom-develop | 2 | `hero-hotel-room` → `testimonial-hotel-guestbook` → `features-hotel-rooms` → `pricing-hotel-seasons` → `contact-hotel-atlas` | Cormorant Garamond / Cormorant Garamond / JetBrains Mono |
| [River Commons · a public trust for Bangladesh's rivers](org.html) ([structure](org/structure.md) · [design](org/DESIGN.md) · [reference build](../builds/org/page.tsx)) | public-interest organisation | manifesto · constraint · seismograph-line | 2 | `hero-org-manifesto` → `team-org-field-guide` → `features-org-impact` → `cta-org-donate` → `footer-org-seismograph` | Gloock / Schibsted Grotesk / JetBrains Mono |
| [Letters from Nusrat · one letter a month](personal.html) ([structure](personal/structure.md) · [design](personal/DESIGN.md) · [reference build](../builds/personal/page.tsx)) | personal brand | letter · second-person · thread | 2 | `hero-personal-letter` → `cta-personal-subscribe` → `testimonial-personal-replies` | Instrument Serif / Instrument Serif / JetBrains Mono |
| [Tally · bookkeeping in Bangla and English for small shops](saas-landing.html) ([structure](saas-landing/structure.md) · [design](saas-landing/DESIGN.md) · [reference build](../builds/saas-landing/page.tsx)) | SaaS landing | workbench · ui-is-content · ink-fill | 2 | `hero-saas-workbench` → `features-saas-console` → `features-saas-bento` → `pricing-saas-switch` → `testimonial-saas-ink` → `cta-saas-trial` | Bricolage Grotesque / JetBrains Mono / JetBrains Mono |
| [Mati · No. 14-07, Ash celadon plate](shop-product.html) ([structure](shop-product/structure.md) · [design](shop-product/DESIGN.md) · [reference build](../builds/shop-product/page.tsx)) | e-commerce product | catalogue · single-object · hold-to-commit | 2 | `hero-shop-catalogue` → `features-shop-specs` → `cta-shop-hold` → `testimonial-shop-notes` → `pricing-shop-glazes` → `gallery-shop-carousel` | Young Serif / Familjen Grotesk / JetBrains Mono |
| [Hawa Studio · design for public institutions, Dhaka](studio-portfolio.html) ([structure](studio-portfolio/structure.md) · [design](studio-portfolio/DESIGN.md) · [reference build](../builds/studio-portfolio/page.tsx)) | portfolio (studio) | ledger · swap-material · lens | 2 | `hero-studio-ledger` → `team-studio-rows` → `features-studio-services` → `contact-studio-copy` → `footer-studio-marquee` | JetBrains Mono / Hanken Grotesk / JetBrains Mono |

**What each page is**

- **The river took the school · The Delta Review** (editorial article): A long-read set like a broadsheet on newsprint: a chapter rail, masthead, deck and columns, one pull quote that inks in, and a folio footer.
- **Monsoon Jazz Night · National Theatre Hall, 14 November** (event landing): A one-night jazz concert as a lit poster on a dark street: the name, tickets drawn as tickets, the running order, and how to get to the hall.
- **Haveli Panam · seven rooms in Sonargaon** (hotel / hospitality): A heritage hotel in Sonargaon kept like an old print: the courtyard develops beside the name, then the guest book, the rooms, the rates and the way from Dhaka.
- **River Commons · a public trust for Bangladesh's rivers** (public-interest organisation): A river trust's case in one page: the claim, the people who watch the banks, a year of hearings, gifts tied to real costs, and its papers.
- **Letters from Nusrat · one letter a month** (personal brand): A writer's homepage that is this month's letter, on airmail paper: written to you, a postscript to subscribe, and the replies that came in the post.
- **Tally · bookkeeping in Bangla and English for small shops** (SaaS landing): Bookkeeping for corner shops where the product is the page: the day's ledger, a one-line export, four screens, two plans and one customer's evening.
- **Mati · No. 14-07, Ash celadon plate** (e-commerce product): One plate from a small firing, sold like a catalogue lot: the object, how it was made, a hold to reserve it, buyers' notes, the sets and the shelf.
- **Hawa Studio · design for public institutions, Dhaka** (portfolio (studio)): A design studio kept as its account book on ledger paper: projects as entries, the people at the table, fixed-shape services and how to start one.

**Tier 5 film templates** (standalone: `index.html` + a frame sequence, not built from sections)

2 scroll-as-film pages. Each folder holds the page, its `scene.mjs`, the frames rendered from it by `scripts/build-frames.mjs` (`poster.webp`, `storyboard/`, `frames.json`; `frames/`, `frames-mobile/` and `film.mp4` are not on main: `node scripts/fetch-frames.mjs` restores them from the tarball named in `frames.lock.json`, sha256-checked), `DESIGN.md`, `MOTION.md` and `log.json`. Reduced motion is the storyboard: stills in normal flow, no canvas mounted.

| Page | Archetype · mutation · signature | Tier | Frames (desktop · mobile) | Fonts | Motion | Tier 5 assets |
|---|---|---|---|---|---|---|
| [Noor Haque · titles and motion for film](motion-portfolio/index.html) | film-reel · tempo-shift · timecode-rail | 5 | 180 × 1920×1080 · 90 × 828×1472 | Bricolage Grotesque / JetBrains Mono | [MOTION.md](motion-portfolio/MOTION.md) | `MOTION.md` · `poster.webp` · `frames.lock.json` · `fetch-frames.mjs motion-portfolio` |
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
