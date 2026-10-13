# DESIGN.md: Noor Haque — titles and motion for film

> How it looks. Tier 5 template `motion-portfolio` in `examples/templates/motion-portfolio/`: a standalone page
> (`index.html`, no build) whose reel is a real frame sequence rendered by `scripts/build-frames.mjs` from
> `scene.mjs`. Noor Haque is a fictional title designer; the page is a template, not a client site.

## Concept
- **Tension:** A motion designer's portfolio is usually a grid of muted video thumbnails, so the work is never seen moving until a click.
- **Concept sentence:** The page is the reel: scroll is the playhead, and each shot is one commission.
- **Archetype + mutation:** film-reel + tempo-shift (the hook, credits and booking are still pages; only the reel runs at film speed)
- **Collision:** showreel × film treatment (a storyboard with notes beside each frame)
- **Signature move:** timecode-rail (a running mm:ss:ff timecode and the current shot under the film)
- **Dials:** ENERGY 3 · RHYTHM 2 · MOTION 3 → Tier 5 (MOTION 3 allows Tier 2–5; Tier 5 because the work itself is moving image and the page would misrepresent it as stills; one pinned film, nothing else past Tier 1)
- **Rejected:** Autoplaying background video behind the name (the work becomes wallpaper); a grid of hover-to-play thumbnails (the reader has to hunt for the motion).

## Typography
Type mode: HOUSE STYLE (typography-led): titles are the trade, so the page sets one big title and keeps the rest quiet.

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Bricolage Grotesque | 300 for statements, 700 for the one accented word, 600 for shot titles | `clamp(3.25rem, 11.5vw, 13rem)` hero | light weight at size, like a main title card |
| Heading | Bricolage Grotesque | 600 | `clamp(1.75rem, …, 3.5rem)` | |
| Body | Hanken Grotesk | 400 / 600 | 16–18px | |
| Mono / labels | JetBrains Mono | 400 | 12px, 0.12em tracking, uppercase | timecodes, shot numbers, years |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #0A0D12 | — | page and film background (the projection booth) |
| `--ink` | #EEE8DC | 15.95:1 | text |
| `--muted` | #A39D90 | 7.21:1 | secondary text, labels |
| `--accent` | #F2A541 | 9.48:1 | sodium light: the one accented word, timecode, the film's light |
| `--surface` | #141922 | — | storyboard image wells before the stills load |

Caption panels over the film are `rgba(10, 13, 18, 0.82)`, so caption text keeps ≥ 7:1 over any frame.

## Layout
- Grid: 12 columns, `5vw` side margins; one column at 375
- Hook: title bottom-left at 88svh, lead on columns 1–6, reel meta right-aligned on 9–12
- Reel: 520vh section (340vh on mobile) with a sticky 100svh stage; captions bottom-left over the film, timecode rail at the foot
- Credits: label on columns 1–3, a ruled list on 4–12
- Nav: none; skip link to `#main`; the header mark links to `#main`
- Footer: one line (name, and the reduced-motion promise)

## Components
- Buttons: one real `<a>` (mailto), outline, fills with the accent on hover
- Links: shot titles are links to their own shot; focusing one moves the film to that shot
- Cards: none
- Forms: none (a booking is an email with a cut attached)

## Imagery
- Mode: illustration (procedural motion graphics rendered to frames; principles/imagery.md §2)
- Subject: Noor's four commissions as one continuous film: a slit of light, a ribbon, film gates, a lit frame
- Direction: dark booth, one warm light source (sodium amber) and one cool white; no photography, no faces, letterbox bars from shot 02 on
- Frames: `frames/` 180 × 1920×1080 WebP, `frames-mobile/` 90 × 828×1472 WebP, `poster.webp` (frame 90), `storyboard/1–4.webp` at 1600w, `film.mp4` (H.264, every frame a keyframe), manifest `frames.json`; rebuild (from the skill folder): `node scripts/build-frames.mjs --scene examples/templates/motion-portfolio/scene.mjs --out examples/templates/motion-portfolio` (`--check` proves the build is byte-identical)
- Frame storage: `frames/`, `frames-mobile/` and `film.mp4` are not on main (the skill stays small). `frames.lock.json` names the tarball and its sha256; `node scripts/fetch-frames.mjs motion-portfolio` (skill folder) restores them, or rebuild them with the command above. Without them the page shows `poster.webp` and the storyboard.
- Texture: dust motes in the beam only
- Interplay: captions sit on their own panel at the bottom-left, never over the light source at frame centre
- Template stand-in: the procedural reel stands in for the designer's real title sequences
- `[NEEDS ASSET]`: the real reel as frames or an all-intra MP4 (same pipeline, `--scene` replaced by the exported sequence); a real contact address

## Restraint Gate record
- Concept survived: yes
- Cut: a cursor-following "play" disc over the reel — scroll is already the control
- Cut: a client logo wall — the credits list carries the same information as text
- Cut: a second pinned chapter for the credits — one film per page; the credits are a still page on purpose (tempo-shift)
- Rejected animation: letters of the hero title arriving one by one — the title holds still like a title card
- Rejected animation: smooth-scroll hijack — native scroll, so the film stops exactly where the reader stops
