# Media

A visually rich site needs real visual material, not generic gradients, empty image boxes and arbitrary placeholders. A reachable URL is not a licence, though, and a direct image link is not a promise that the file stays online or free for commercial use. This file covers how to find media, track where it came from, and make clear what must be replaced before launch. Referenced from `thinking/sequence.md` ("Required output: a sellable template").

## Media selection

Every build weighs its need for photography, video, icons, illustrations, SVGs, screenshots and any other visual asset the brief calls for.

- Select media for the actual project: the page content, the visual concept and the audience. Do not force every format into every build.
- Prefer real, relevant assets when they improve the design.
- Use custom illustration, CSS, SVG or another technique when it fits the concept better than stock.

## Where to source media

Starting points:

| Source | For |
|---|---|
| Unsplash — https://unsplash.com | photography |
| Pexels — https://pexels.com | photography, video |
| Pixabay — https://pixabay.com | photography, video, illustration |
| Coverr — https://coverr.co | background video |
| Mixkit — https://mixkit.co | video |
| unDraw — https://undraw.co | illustration |
| Heroicons — https://heroicons.com | icons |
| Lucide — https://lucide.dev | icons |
| Feather — https://feathericons.com | icons |

These are **discovery sources**, not blanket guarantees. None of them guarantees, for every asset, that it is licence-eligible for this project, free of restrictions, at a stable URL, or available without limits.

- **Verify each selected asset's licence and usage terms** when possible, on the asset's own page and the source's current licence page. Respect attribution, commercial-use restrictions, redistribution rules, hotlinking restrictions and any other condition.
- **Prefer stable integration**: download the file into the project, or use the source's supported method, when the terms permit it. Do not assume an image URL stays available.
- **No keys or paid services by default.** Do not require an API key or a paid service when a suitable free, accessible alternative exists. If a source needs registration, an API key, or has access limits, say so; never claim unrestricted access.

## Placeholder identification

Separate temporary reference assets from assets approved for production.

For a temporary or unverified asset, name it, where practical:

```
placeholder-<description>.<ext>
```

Where appropriate, add a source and replacement comment:

```html
<!-- PLACEHOLDER: <source URL>; license/status: <verified or unknown>; replace before production if not approved. -->
```

```js
// PLACEHOLDER: <source URL>; license/status: <verified or unknown>; replace before production if not approved.
```

When a file cannot reasonably be renamed (a CMS path, a framework-imposed name), record its placeholder status in `MEDIA.md` instead.

Do not label a properly licensed, production-approved asset as disposable just because it came from a stock site.

## Required `MEDIA.md`

Every generated website project has a `MEDIA.md` in its root. At least these columns:

```markdown
| File or asset | Source URL | License / usage status | Placeholder? | Replace before production? |
|---|---|---|---|---|
| public/img/placeholder-harbour-dawn.jpg | <asset page URL> | unknown | yes | yes |
| public/icons/arrow.svg | https://lucide.dev | <licence as stated on the source, verified YYYY-MM-DD> | no | no |
| hero grain (CSS) | custom, this build | custom | no | no |
```

- List the photographs, videos, illustrations, externally sourced icons and other assets the project uses.
- Record the original source where available, the licence or terms that apply, and any attribution or replacement requirement.
- Write `unknown` when the licence or provenance has not been verified. Never invent a licence, attribution, source URL or permission.
- Mark custom-created assets as custom, and list external dependencies (an icon package, a hosted font, a video CDN) where relevant.
- A build with no external media still ships `MEDIA.md`: a short inventory stating that no external media assets were used.

The root `README.md` explains the media handoff and names every unverified or temporary asset that must be reviewed before production.

## Media rules

- Do not take assets from Google Images results, Pinterest, social media or arbitrary websites as though finding them there grants reuse rights. Such places may be looked at for design research; implementation assets come through legitimate, documented channels.
- For people, prefer appropriately licensed stock photography, or media the client supplied or explicitly authorized.
- Do not use identifiable real people or public figures as disposable placeholders without appropriate permission and usage rights.
- Do not copy proprietary code, protected artwork or photography from reference websites. Learn composition, art direction, information architecture and interaction from them; build original or properly licensed implementations.
- Every temporary or unverified asset is identifiable (name, comment, or a `MEDIA.md` row) and documented.
- Every website build includes `MEDIA.md`.
- Do not call the site production-ready while required permissions, attributions or placeholder replacements are unresolved.

## Production handoff

Tell the client which assets need replacement, permission checks, attribution or approval before launch (in the handoff message and in `README.md`, pointing to `MEDIA.md`).

A production-approved asset stays in place when its usage rights, provenance, technical suitability and required conditions have been verified.

## What not to do

- Treat a search result or an accessible URL as proof of a licence.
- Ship unverified temporary assets silently.
- Invent provenance or licensing information.
- Omit `MEDIA.md`.
- Make every asset a placeholder by default when it is already approved for production.
