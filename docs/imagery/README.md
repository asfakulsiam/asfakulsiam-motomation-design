# Template imagery (P1 T10)

The old `art()` helper in `examples/sections/_shared.tsx` drew the same abstract bands and a sun for every image slot, in every template. It is gone. Each image slot now draws its real subject as a template stand-in (`skills/asfakulsiam-motomation-design/examples/sections/_imagery.tsx`), in its template's illustration style, with the same size and alt text the project's photograph will have. Templates whose subject is words, type or UI have no imagery, on purpose. Rules: `principles/imagery.md`. Each template's choice: the `## Imagery` block in `examples/templates/<id>/DESIGN.md`.

Screenshots: Chromium 147, 1440×900, each section rendered in its built template (`examples/templates/<id>.html`).

| Template | Mode | Stand-in | Screenshot |
|---|---|---|---|
| shop-product | photography (stand-in: illustration) | `ceramic()`: the plate and each piece of batch 14, three-quarter view on linen | [hero](shop-product--hero-shop-catalogue.webp) · [carousel](shop-product--gallery-shop-carousel.webp) |
| hotel | photography (stand-in: illustration) | `haveli()`: the courtyard; five rooms, each with what its caption names (neem, well, iron safe, dovecote, stone tank) | [hero](hotel--hero-hotel-room.webp) · [rooms reel](hotel--features-hotel-rooms.webp) |
| org | illustration | `survey()`: the three river reaches as a survey plate, screened by Halftone | [field guide](org--team-org-field-guide.webp) |
| studio-portfolio | photography (stand-in: illustration) | `longTable()`: the four partners at the long table; the Lens shows the labelled version | [people](studio-portfolio--team-studio-rows.webp) |
| editorial-article | none (the words are the product) | — | — |
| event | none (type is the poster; Beams is light, not a picture) | — | — |
| personal | none (a letter) | — | — |
| saas-landing | none (the UI is the image, coded in DeviceMockup) | — | — |

All stand-ins side by side: [contact-sheet.webp](contact-sheet.webp). It also shows `cover()`, used by the `hero-portfolio-index` section, which no shipped template includes.

The rooms got distinct compositions because the gate's progression check caught near-identical frames. With five versions of one drawing, the pinned reel measured Δ 0% between scroll samples, so it read as a static pin.
