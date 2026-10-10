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
- **Total length:** 300–600% of the viewport height per chapter. Over 800% feels like a trap.
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

```js
gsap.registerPlugin(ScrollTrigger);
const mm = gsap.matchMedia();

mm.add({ motion: "(prefers-reduced-motion: no-preference)", small: "(max-width: 767px)" }, (ctx) => {
  const { motion, small } = ctx.conditions;
  if (!motion) return;                              // static storyboard frames are shown by CSS

  const canvas = document.querySelector(".film canvas");
  const c = canvas.getContext("2d");
  const count = small ? 90 : 180;                   // fewer frames on phones
  const src = (i) => `/film/${small ? "m" : "d"}/f_${String(i + 1).padStart(4, "0")}.webp`;
  const frames = []; const state = { frame: 0 };

  const draw = () => {
    const img = frames[Math.round(state.frame)];
    if (!img || !img.complete) return;
    const dpr = Math.min(devicePixelRatio, 2);
    canvas.width = canvas.clientWidth * dpr; canvas.height = canvas.clientHeight * dpr;
    const s = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight); // cover
    const w = img.naturalWidth * s, h = img.naturalHeight * s;
    c.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  };

  for (let i = 0; i < count; i++) { const img = new Image(); img.decoding = "async"; img.src = src(i); frames.push(img); }
  frames[0].onload = draw;

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: ".film", start: "top top", end: "+=500%", scrub: 0.6, pin: true, anticipatePin: 1 },
  });

  tl.to(state, { frame: count - 1, duration: 1, onUpdate: draw }, 0)          // the playhead
    .from(".film .s1", { yPercent: 100, opacity: 0, duration: 0.08 }, 0.02)   // scene 1 type
    .to(".film .s1",   { yPercent: -100, opacity: 0, duration: 0.06 }, 0.15)
    .from(".film .s2", { yPercent: 100, opacity: 0, duration: 0.08 }, 0.18)
    .to(".film .s2",   { yPercent: -100, opacity: 0, duration: 0.06 }, 0.38);
    // …positions are fractions of the whole film: they ARE the storyboard timecodes

  addEventListener("resize", draw);
  return () => removeEventListener("resize", draw);
});
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
| Small screens | Fewer frames, shorter `end` (300% max), simpler type moves |
| Slow network / Save-Data | Load the mobile sequence or show the static storyboard frames |
| No JS | The static storyboard frames are in the HTML by default |

```css
.film__static { display: grid; gap: 4rem; }
.film__stage  { display: none; }
@media (prefers-reduced-motion: no-preference) {
  .js .film__static { display: none; }
  .js .film__stage  { display: block; height: 100vh; }
}
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
