# Tier 5: Motomation (Scroll as Film)

**Motomation** is this skill's signature: scrolling feels like scrubbing through an After Effects composition or a 3D render. The visitor's scroll is the playhead. Forward plays the film, backward rewinds it, stopping holds the frame.

It is not "lots of animation". It is **one directed sequence** with a beginning, a middle and an end.

---

## 1. Direct it like a film

Before code, write `MOTION.md` from `templates/MOTION.md`:

```
SCENE  TIMECODE (scroll %)  SHOT                         TYPE ON SCREEN              TRANSITION OUT
01     0–15%                Product in darkness          "Made in one piece."        light sweeps left→right
02     15–40%               Camera orbits 90°            spec lines draw in          cut on rotation
03     40–70%               Exploded view, parts float   part names, mono labels     parts reassemble
04     70–100%              Final hero, price, CTA       "Yours from ৳ 24,000"        unpin, normal scroll
```

Rules for the storyboard:
- **3–6 scenes per chapter.** More than 6 and people lose the thread.
- **Each scene has one idea** and at most one line of display type.
- **Hold frames:** leave 10–15% of the scroll distance in each scene where nothing moves, so people can read.
- **Total length:** 300–600% of the viewport height per chapter on desktop, **300% or less on phones** (`craft/mobile-motion-matrix.md`). Over 800% feels like a trap.
- **Never hijack:** the scrollbar, keyboard, and screen reader still work; the user can always leave.

---

## 2. Choose the technique

| Technique | Looks like | Use when | Cost |
|---|---|---|---|
| **A. Scrubbed DOM timeline** | Motion graphics: type, shapes, masks, layers | The film is typographic or illustrative | Low |
| **B. Image sequence on canvas** | A real 3D render or video, frame-accurate in both directions | You have a rendered animation (Blender, C4D, After Effects) | Medium: 80–200 frames |
| **C. Video scrub** | Same as B with fewer files | Long shots, smaller total size | Medium: needs special encoding |
| **D. WebGL scene** | A live 3D scene with a camera on a scroll path | The object must be interactive or lit live | High |

Combine them: a canvas sequence (B) for the product, with DOM type (A) layered above it.

---

## 3. The master pattern (A + B)

This is the vanilla version of `examples/motomation/image-sequence-film.tsx`; the logic is line-for-line the same.
Markup: `<section class="film">` holds `.film__static` (the storyboard: `<figure>`s with a `[data-jump]` link per title)
and `.film__stage` (`aria-hidden="true"`: a `<canvas>`, one `[data-scene]` caption per scene, the timecode rail).

```js
gsap.registerPlugin(ScrollTrigger);
const scenes = [{ from: 0, to: 0.15 }, { from: 0.15, to: 0.4 }, { from: 0.4, to: 0.7 }, { from: 0.7, to: 1 }]; // = MOTION.md timecodes
const root = document.querySelector(".film");
const mm = gsap.matchMedia();

mm.add({ motion: "(prefers-reduced-motion: no-preference)", small: "(max-width: 767px)" }, (ctx) => {
  const { motion, small } = ctx.conditions;
  if (!motion || navigator.connection?.saveData) return;   // the static storyboard is already designed
  root.classList.add("film-on");                            // CSS: storyboard visually hidden (still readable), stage shown

  const canvas = root.querySelector(".film__stage canvas"), c = canvas.getContext("2d");
  const count = small ? 90 : 180;                           // fewer frames on phones
  const src = (i) => `/film/${small ? "m" : "d"}/f_${String(i + 1).padStart(4, "0")}.webp`;
  const images = []; const state = { frame: 0 }; let last = -1;

  const nearestLoaded = (i) => {                            // draw the closest frame that has arrived
    for (let d = 0; d < count; d++) {
      if (images[i - d]?.complete && images[i - d].naturalWidth) return images[i - d];
      if (images[i + d]?.complete && images[i + d].naturalWidth) return images[i + d];
    }
  };
  const draw = (force = false) => {
    const i = Math.round(state.frame);
    if (i === last && !force) return;                       // same frame: skip the work
    const img = nearestLoaded(i); if (!img) return;
    last = i;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; } // resize only when the size changes
    const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);                         // cover
    c.drawImage(img, (w - img.naturalWidth * s) / 2, (h - img.naturalHeight * s) / 2, img.naturalWidth * s, img.naturalHeight * s);
  };

  // Loading: see "Loading strategy" in section 5
  const loadFrame = (i) => { const img = new Image(); img.decoding = "async"; img.src = src(i);
    img.onload = () => i === Math.round(state.frame) && draw(true); images[i] = img; };
  for (let i = 0; i < Math.min(10, count); i++) loadFrame(i);
  (window.requestIdleCallback || ((cb) => setTimeout(cb, 200)))(() => { for (let i = 10; i < count; i++) loadFrame(i); });

  const stage = root.querySelector(".film__stage");
  const rail = root.querySelector("[data-rail]"), code = root.querySelector("[data-code]");
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: root, start: "top top", end: small ? "+=300%" : "+=500%",   // phones: 300% max (craft/mobile-motion-matrix.md)
      scrub: 0.6, pin: stage, anticipatePin: 1,
      onUpdate: (self) => { rail.style.transform = `scaleX(${self.progress})`; code.textContent = tc(self.progress * 24); },
    },
  });
  tl.to(state, { frame: count - 1, duration: 1, onUpdate: () => draw() }, 0);            // the playhead
  scenes.forEach((s, i) => {                                                               // type rides the film
    const sel = `.film [data-scene="${i}"]`, io = Math.min(0.06, (s.to - s.from) * 0.25); // in/out; the middle is the hold
    tl.fromTo(sel, { autoAlpha: 0, yPercent: 30 }, { autoAlpha: 1, yPercent: 0, duration: io }, s.from);
    if (i < scenes.length - 1) tl.to(sel, { autoAlpha: 0, yPercent: -30, duration: io }, s.to - io);
  });

  // Keyboard + screen readers: focusing a storyboard link scrubs the film to that scene
  const st = tl.scrollTrigger, jumps = [...root.querySelectorAll("[data-jump]")];
  const jump = (e) => { const s = scenes[+e.currentTarget.dataset.jump];
    requestAnimationFrame(() => scrollTo({ top: st.start + (st.end - st.start) * (s.from + s.to) / 2, behavior: "instant" })); };
  const click = (e) => { e.preventDefault(); jump(e); };
  jumps.forEach((a) => { a.addEventListener("focus", jump); a.addEventListener("click", click); });

  const onResize = () => draw(true);
  addEventListener("resize", onResize);
  return () => { removeEventListener("resize", onResize); root.classList.remove("film-on");
    jumps.forEach((a) => { a.removeEventListener("focus", jump); a.removeEventListener("click", click); }); };
});

function tc(sec) { return [Math.floor(sec / 60), Math.floor(sec) % 60, Math.floor((sec % 1) * 24)].map((n) => String(n).padStart(2, "0")).join(":"); }
```

Key idea: **the timeline's duration is 1**, so every position (`0.15`, `0.38`) is literally the timecode from `MOTION.md`. The storyboard and the code use the same numbers.

---

## 4. Video scrub (C)

Browsers only seek quickly to keyframes, so encode with every frame (or nearly every frame) as a keyframe:

```bash
ffmpeg -i master.mov -vf "scale=1920:-2" -c:v libx264 -preset slow -crf 23 \
  -g 1 -pix_fmt yuv420p -movflags +faststart -an film-desktop.mp4
ffmpeg -i master.mov -vf "scale=960:-2"  -c:v libx264 -preset slow -crf 26 \
  -g 2 -pix_fmt yuv420p -movflags +faststart -an film-mobile.mp4
```

```js
const video = document.querySelector(".film video"); video.pause();
ScrollTrigger.create({ trigger: ".film", start: "top top", end: "+=400%", pin: true, scrub: true,
  onUpdate: (self) => { if (video.duration) video.currentTime = self.progress * video.duration; } });
```

Use `muted playsinline preload="auto"` on the video. Test on iOS Safari; if seeking stutters, switch to an image sequence.

## 5. Image sequence pipeline (B)

```bash
mkdir -p public/film/d public/film/m
ffmpeg -i master.mov -vf "fps=30,scale=1600:-2" -c:v libwebp -quality 78 public/film/d/f_%04d.webp
ffmpeg -i master.mov -vf "fps=15,scale=800:-2"  -c:v libwebp -quality 72 public/film/m/f_%04d.webp
```

Budgets: desktop ≤ 180 frames and ≤ 8MB total; mobile ≤ 90 frames and ≤ 3MB. Load the first 10 frames eagerly, then the rest while idle. Draw the nearest loaded frame while the rest arrive.

---

## 6. Pacing and craft

- **Easing lives in the scrub, not the tweens.** Use `ease: "none"` inside the film and `scrub: 0.4–1` for weight.
- **Camera language:** push in (scale 1 → 1.15), pan (x), reveal (clip-path), rack focus (blur 8px → 0 on one layer). Use one camera move per scene.
- **Type rides the film:** headlines enter and leave between hold frames; they never move while the user is meant to read them.
- **Sound design without sound:** use rhythm. Alternate fast scenes with slow holds, like a film edit.
- **Progress is visible:** a thin timecode or progress rail tells people how long the chapter is.
- **The exit is designed:** the last frame hands over cleanly to normal scrolling (unpin, then the next section rises).

---

## 7. Fallbacks (required)

| Condition | Behaviour |
|---|---|
| `prefers-reduced-motion: reduce` | No pin, no scrub. Show 3–4 key frames as static images with their type, stacked as a normal section |
| Small screens | Fewer frames, `end: "+=300%"` (the maximum), simpler type moves |
| Slow network / Save-Data | Load the mobile sequence or show the static storyboard frames |
| No JS | The static storyboard frames are in the HTML by default |

```css
/* Default (no JS, reduced motion, Save-Data): the storyboard is a normal designed section */
.film__static { display: grid; gap: 4rem; }
.film__stage  { display: none; }
/* Film running: the storyboard is visually hidden but never display:none, so screen readers keep the narrative */
.film-on .film__static figure { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.film-on .film__static figure:focus-within { position: fixed; left: 5vw; bottom: 12vh; z-index: 10; width: auto; height: auto;
  max-width: min(40ch, 90vw); overflow: visible; clip-path: none; white-space: normal; }       /* focused scene = visible caption card */
.film-on .film__static figure:focus-within :is(img, canvas) { display: none; }
.film-on .film:has(figure:focus-within) [data-scene] { opacity: 0 !important; }              /* no double caption */
.film-on .film__stage { display: block; height: 100svh; }
```

---

## 8. Motomation checklist

- [ ] `MOTION.md` storyboard written; code timecodes match it
- [ ] 3–6 scenes, a hold frame in each, chapter ≤ 600% viewport
- [ ] Lenis synced to the GSAP ticker; `ScrollTrigger.refresh()` after fonts/images load
- [ ] Frame or video budgets met; first frame visible in under 1.5s
- [ ] Reduced-motion static version is designed, not just "animations off"
- [ ] Keyboard (Space / PageDown) and screen readers move through the content normally
- [ ] 60fps on desktop; no layout properties animated
