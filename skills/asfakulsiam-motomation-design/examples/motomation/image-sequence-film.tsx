"use client";
// Tier 5 Motomation: a pinned image-sequence film scrubbed by scroll, with scene type and a timecode rail.
// Timeline duration is 1, so scene positions are the storyboard timecodes from MOTION.md.
// Frames load playhead-first with a request cap and pause in hidden tabs / off-screen (see tier-5 "Loading strategy").
// Reduced motion, no-JS, and Save-Data visitors get the static storyboard frames instead.
// Accessibility: the storyboard is the canonical narrative and is never display:none. While the film runs it is
// visually hidden but stays in the accessibility tree, so a screen reader reads every scene in order without
// scrolling. Each scene title is a link: focusing it scrubs the film to that scene and shows the caption card.
import { useId, useRef } from "react";
import { gsap, useGSAP, MQ } from "../lib/gsap";

export type Scene = { from: number; to: number; title: string; caption?: string; still: string; alt: string };

type Props = {
  frames: { desktop: number; mobile: number };
  src: (i: number, size: "d" | "m") => string;  // e.g. (i, s) => `/film/${s}/f_${String(i + 1).padStart(4, "0")}.webp`
  scenes: Scene[];
  length?: { desktop: number; mobile: number }; // chapter length in % of viewport height
  seconds?: number;                             // "film length" shown on the timecode
};

const tc = (s: number) => {
  const f = Math.floor((s % 1) * 24), sec = Math.floor(s) % 60, min = Math.floor(s / 60);
  return [min, sec, f].map((n) => String(n).padStart(2, "0")).join(":");
};

export function ImageSequenceFilm({ frames, src, scenes, length = { desktop: 500, mobile: 300 }, seconds = 24 }: Props) {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const uid = useId().replace(/:/g, "");

  useGSAP(() => {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData) return;
    const mm = gsap.matchMedia();
    mm.add({ motion: MQ.motion, mobile: MQ.mobile }, (ctx) => {
      const { motion, mobile } = ctx.conditions as { motion: boolean; mobile: boolean };
      const el = canvas.current, c = el?.getContext("2d");
      if (!motion || !el || !c || !root.current) return;
      root.current.dataset.film = "on"; // CSS swaps static frames for the stage

      const size = mobile ? "m" : "d";
      const count = mobile ? frames.mobile : frames.desktop;
      const images: (HTMLImageElement | undefined)[] = [];
      const state = { frame: 0 };
      let last = -1, shown = -1; // last = playhead frame drawn, shown = index of the image actually on screen

      const nearestLoaded = (i: number) => {
        for (let d = 0; d < count; d++) {
          for (const img of [images[i - d], images[i + d]]) if (img?.complete && img.naturalWidth) return img;
        }
        return undefined;
      };
      const draw = (force = false) => {
        const i = Math.round(state.frame);
        if (i === last && !force) return;
        const img = nearestLoaded(i);
        if (!img) return;
        last = i; shown = images.indexOf(img);
        const dpr = Math.min(devicePixelRatio || 1, 2);
        const w = Math.round(el.clientWidth * dpr), h = Math.round(el.clientHeight * dpr); // integers, or the size check never matches
        if (el.width !== w || el.height !== h) { el.width = w; el.height = h; }
        const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
        c.drawImage(img, (w - img.naturalWidth * s) / 2, (h - img.naturalHeight * s) / 2, img.naturalWidth * s, img.naturalHeight * s);
      };

      // Loading: bounded concurrency, nearest-to-playhead first, paused in hidden tabs and while off-screen.
      const limit = mobile ? 4 : 6;                       // never more than this many frame requests in flight
      const requested = new Uint8Array(count);            // 0 = not asked, 1 = in flight or done
      const inFlight = new Map<number, HTMLImageElement>();
      let onScreen = false;
      const nextFrame = () => {                           // closest unrequested frame, looking ahead first
        const p = Math.round(state.frame);
        for (let d = 0; d < count; d++) for (const i of [p + d, p - d]) if (i >= 0 && i < count && !requested[i]) return i;
        return -1;
      };
      const pump = () => {
        while (onScreen && !document.hidden && inFlight.size < limit) {
          const i = nextFrame(); if (i < 0) return;
          const img = new Image(); img.decoding = "async";
          requested[i] = 1; inFlight.set(i, img);
          const settle = () => { inFlight.delete(i); pump(); };
          img.onload = () => {                            // repaint if this frame is closer to the playhead than what's shown
            const p = Math.round(state.frame);
            if (shown < 0 || Math.abs(i - p) < Math.abs(shown - p)) draw(true);
            settle();
          };
          img.onerror = settle;                           // a missing frame is skipped, not retried forever
          img.src = src(i, size); images[i] = img;
        }
      };
      const cancel = () => {                              // abort in-flight requests; they are re-queued later
        inFlight.forEach((img, i) => { img.onload = img.onerror = null; img.src = ""; images[i] = undefined; requested[i] = 0; });
        inFlight.clear();
      };
      const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; if (onScreen) pump(); else cancel(); }, { rootMargin: "50% 0px" });
      io.observe(root.current);
      const onVisibility = () => (document.hidden ? cancel() : pump());
      document.addEventListener("visibilitychange", onVisibility);

      const stage = root.current.querySelector<HTMLElement>("[data-stage]");
      const rail = root.current.querySelector<HTMLElement>("[data-rail]");
      const code = root.current.querySelector<HTMLElement>("[data-code]");
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current, start: "top top", end: `+=${mobile ? length.mobile : length.desktop}%`,
          scrub: 0.6, pin: stage ?? true, anticipatePin: 1,
          onUpdate: (self) => {
            if (rail) rail.style.transform = `scaleX(${self.progress})`;
            if (code) code.textContent = tc(self.progress * seconds);
          },
        },
      });
      tl.to(state, { frame: count - 1, duration: 1, onUpdate: () => { draw(); pump(); } }, 0); // pump: a jump re-targets loading at once
      scenes.forEach((s, i) => {
        const sel = `[data-scene="${i}"]`;
        const len = s.to - s.from, io = Math.min(0.06, len * 0.25);  // in/out time; the middle is the hold
        tl.fromTo(sel, { autoAlpha: 0, yPercent: 30 }, { autoAlpha: 1, yPercent: 0, duration: io }, s.from);
        if (i < scenes.length - 1) tl.to(sel, { autoAlpha: 0, yPercent: -30, duration: io }, s.to - io);
      });

      // Keyboard + screen reader: focusing a scene link scrubs the film to the middle of that scene
      const st = tl.scrollTrigger!;
      const jumps = [...root.current.querySelectorAll<HTMLAnchorElement>("[data-jump]")];
      const jump = (e: Event) => {
        const s = scenes[Number((e.currentTarget as HTMLElement).dataset.jump)];
        if (s) requestAnimationFrame(() => scrollTo({ top: st.start + (st.end - st.start) * ((s.from + s.to) / 2), behavior: "instant" as ScrollBehavior }));
      };
      const click = (e: Event) => { e.preventDefault(); jump(e); };
      jumps.forEach((a) => { a.addEventListener("focus", jump); a.addEventListener("click", click); });

      const onResize = () => draw(true);
      addEventListener("resize", onResize);
      return () => {
        removeEventListener("resize", onResize);
        io.disconnect(); document.removeEventListener("visibilitychange", onVisibility); cancel();
        jumps.forEach((a) => { a.removeEventListener("focus", jump); a.removeEventListener("click", click); });
        if (root.current) delete root.current.dataset.film;
      };
    });
  }, { scope: root });

  return (
    <section ref={root} className="group relative bg-[var(--ground)] text-[var(--ink)]">
      <style>{FILM_A11Y_CSS}</style>
      {/* Static storyboard: the default, and the accessible narrative. Visually hidden (never display:none) while the film runs. */}
      <div data-storyboard className="grid gap-[12vh] px-[5vw] py-[12vh] group-data-[film=on]:gap-0 group-data-[film=on]:p-0">
        {scenes.map((s, i) => (
          <figure key={s.title} id={`${uid}-scene-${i}`} className="grid gap-6 md:grid-cols-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.still} alt={s.alt} loading="lazy" className="w-full md:col-span-8" />
            <figcaption className="md:col-span-4 md:self-end">
              <p className="text-[clamp(1.75rem,3.5vw,3.5rem)] leading-[1.02] tracking-[-0.02em]">
                <a href={`#${uid}-scene-${i}`} data-jump={i} className="no-underline">
                  <span className="sr-only">Scene {i + 1} of {scenes.length}: </span>{s.title}
                </a>
              </p>
              {s.caption && <p className="mt-3 text-[var(--muted)]">{s.caption}</p>}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Film stage */}
      <div data-stage className="relative hidden h-[100svh] overflow-hidden group-data-[film=on]:block">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        {/* Visual mirror of the storyboard: aria-hidden because the same text is already exposed above */}
        <div className="absolute inset-x-[5vw] bottom-[12vh]" aria-hidden="true">
          {scenes.map((s, i) => (
            <div key={s.title} data-scene={i} className="invisible absolute bottom-0 left-0 max-w-[18ch]">
              <p className="text-[clamp(2.5rem,7vw,8rem)] leading-[0.92] tracking-[-0.03em]">{s.title}</p>
              {s.caption && <p className="mt-4 max-w-[40ch] text-[var(--muted)]">{s.caption}</p>}
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="absolute inset-x-[5vw] bottom-[5vh] flex items-center gap-4 font-mono text-xs tabular-nums tracking-[0.08em]">
          <span data-code>00:00:00</span>
          <span className="relative h-px flex-1 bg-[var(--line,rgba(127,127,127,.3))]">
            <span data-rail className="absolute inset-0 origin-left scale-x-0 bg-[var(--accent)]" />
          </span>
          <span>{tc(seconds)}</span>
        </div>
      </div>
    </section>
  );
}

// Film-mode storyboard: visually hidden but readable; a focused scene becomes a visible caption card over the stage.
const FILM_A11Y_CSS = `
[data-film=on] [data-storyboard] figure{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
[data-film=on] [data-storyboard] figure:focus-within{position:fixed;left:5vw;bottom:12vh;z-index:10;width:auto;height:auto;max-width:min(40ch,90vw);overflow:visible;clip-path:none;white-space:normal;display:block}
[data-film=on] [data-storyboard] figure:focus-within img{display:none}
[data-film=on]:has([data-storyboard] figure:focus-within) [data-scene]{opacity:0!important}
`;
