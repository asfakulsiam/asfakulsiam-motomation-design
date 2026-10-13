# Imagery: photo direction, illustration, texture, and when to use none

Every page decides its imagery the way it decides its type: on purpose, written down in `DESIGN.md` under `## Imagery`, before anything is built. An image that depicts nothing (abstract bands, a gradient blob, a stock "team at laptop") is worse than no image: it spends the reader's attention and tells them nothing about the subject. The shipped templates hold to this: none uses a generic placeholder. Each one either draws its real subject (`examples/sections/_imagery.tsx`) or has no imagery and says why.

## The Imagery block in DESIGN.md

```
## Imagery
- Mode: photography | illustration | texture only | none   (one primary mode per page)
- Subject: what the images show, concretely (the object, the place, the people, the work)
- Direction: light · angle and lens · crop · colour · people   (photography)  or  style · line · fill · palette (illustration)
- Texture: none | grain | paper | halftone, with its opacity and where it sits
- Interplay: how type and image meet (over, beside, under; what never overlaps)
- Template stand-in: what the template draws until the project's own images exist
- [NEEDS ASSET]: the shot list or illustration list, one line each, with the alt text
```

## 1. Photo direction

Write the direction so a photographer could shoot it without asking a question.

| Axis | Decide | Bad (vague) | Good (direct) |
|---|---|---|---|
| **Subject** | the specific thing, in its own place | "lifestyle shots" | "No. 14-07 on the linen it was photographed on in the studio, nothing else in frame" |
| **Light** | source, direction, hardness, time | "natural light" | "one north window, camera-left, soft; no fill, let the far side fall to shadow" |
| **Angle and lens** | height, angle, focal length | "nice angle" | "about 25° above the table, 50 mm equivalent, no wide-angle distortion on round ware" |
| **Crop** | what is cut and where the subject sits | "centred" | "the plate fills two thirds of the width, the rim never touches the edge" |
| **Colour** | how it is graded against the palette | "warm" | "graded to the page's ground (#efe9df); no added saturation; the glaze colour is the one accent" |
| **People** | who, doing what, aware of camera or not | "diverse team smiling" | "the four of them at the long table mid-work, nobody looking at the lens" |
| **Authenticity** | real or staged, and why | — | "the guest book's own pages, not a reshoot" |

Rules:

1. **One light per page.** Every photograph on a page shares a light direction and temperature, or the page reads as collected rather than made.
2. **No stock unless the subject is generic.** A hotel, a product, a team, a place is never stock. If the project can't shoot yet, use the template's drawn stand-in, not stock.
3. **The subject is the hero, not the photograph.** No vignettes, lens flares, tilt-shift or "cinematic" grades the brand doesn't own.
4. **Alt text says what's in the picture and why it's there**, in the page's own voice ("The courtyard at Haveli Panam in the late afternoon, with the well and the neem tree"). Decorative images have `alt=""` and are never the only carrier of meaning.

## 2. Illustration, per style

Illustration is drawn for the page, in the style the page already uses. Pick the row for the style (`styles/`):

| Style | Illustration | Line | Fill | Avoid |
|---|---|---|---|---|
| `editorial` | engraving-like line, cross-hatching, archival plates | fine, even, ink colour | none or one flat tone | glossy 3D, gradients |
| `swiss` | geometric marks, diagrams, maps | uniform weight on a grid | flat, the palette's primaries | hand-drawn wobble |
| `minimal` | one object or one mark, a lot of space | thin, or none | one tone, low contrast | scenes, detail |
| `organic` | hand-drawn plants, objects, people, irregular edges | varying, brush or pencil | soft flat fills, paper showing | perfect geometry, outlines on everything |
| `dark-luxe` | object studies lit from one side, metallic accents | none, form by light | deep tones, one warm highlight | bright flat cartoon colour |
| `flat` | simple figures and objects in flat shapes | none | flat, 3–4 colours from the palette | drop shadows, gradients |
| `neobrutalism` | bold cut-out shapes, sticker-like objects | thick black outline | saturated flat fills, hard offset shadow | delicate line, gradients |
| `kinetic-type` | type is the image: letterforms, numbers as shapes | — | the palette | adding pictures that compete with the type |
| `glassmorphism` | blurred colour fields behind frosted panels | none | soft gradients, kept behind content | detailed illustration under glass (it smears) |
| `neumorphism` | soft extruded icons and objects | none | the surface colour, light and shadow only | colourful scenes |

One illustration style per page. A page that mixes an engraving with a flat cartoon has two art directors.

## 3. Texture rules

Texture is a surface, not a picture: grain, paper, halftone screens, weave.

1. **One kind of texture per page** (grain, paper, halftone or weave, not two), on as few surfaces as the concept needs: the whole ground, or the surfaces that are that material.
2. **Under text, keep it faint**: grain or paper ≤ 0.08 opacity behind body text, and the gate's contrast check is against the rendered pixels, so a texture that drops text under AA fails. Heavier texture (halftone, visible weave) only behind display type or no type.
3. **Texture is still by default.** An animated grain is a motion choice and counts against the tier; a static grain counts as nothing.
4. **Texture has a reason**: the paper of a catalogue card, the screen of a printed survey, the linen under a plate. If you can't say what material it is, cut it.
5. **No texture under forced colors**: it should disappear, not turn into noise (the gate's forced-colors check reads the text over it).

## 4. How image types meet

- **One primary mode.** Photography, illustration, or texture only; a second mode may appear only in a supporting role (e.g. a photographed product page with a drawn diagram of its parts).
- **Type over image** only where the image has a quiet zone the type sits in; never over a face, a product edge or a busy area. Check it at 375px, where the crop moves.
- **Image and type never compete at the same size.** If the image is full-bleed, the headline is small or beside it. If the headline is the hero, images are small and few.
- **The same subject keeps the same treatment** across the page: if one plate is shot from 25° above, all plates are.
- **Screens, halftones and duotones apply to all images in a set**, or to none.

## 5. When to use no imagery

No imagery is a decision, written as `Mode: none` with the reason. It is right when:

- **The words are the product**: an essay, a letter, a manifesto, a changelog. Images would decorate a text that is already the subject (`editorial-article`, `personal`).
- **The type already is the image**: a poster, a lineup, a kinetic headline (`event`: the stage light is a background effect, not a picture of anything).
- **The thing has no honest picture**: software whose UI is the subject is shown as its UI, in a device frame or as live components, not as a stock photo of someone using a laptop (`saas-landing`).
- **You don't have the real images yet and a stand-in would mislead**: say so with `[NEEDS ASSET]` and keep the space structural.

A page with no imagery still has a visual subject: its type, its rules, its numbers, its one background. The `## Imagery` block says which.

## 6. Template stand-ins

A template can't ship a project's photographs. It ships a drawn stand-in of the real subject, in the page's illustration style, with the alt text the real photograph will have, so the layout, crop and contrast are tested against something that looks like the subject. `examples/sections/_imagery.tsx` draws them (`ceramic`, `haveli`, `cover`, `survey`, `longTable`). Replace a stand-in with the photograph that the `[NEEDS ASSET]` list names; keep the same width, height and alt.

## Related

- `principles/color.md`: grading images to the palette
- `principles/restraint.md`: an image is a component; it has to earn its place
- `styles/`: the style the illustration follows
- `gates/delivery-gate.md`: contrast is measured on rendered pixels, so texture and type-over-image are checked
