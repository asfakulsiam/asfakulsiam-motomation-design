"use client";
// Tier 5 Motomation: a pinned image-sequence film scrubbed by scroll, with scene type and a timecode rail.
// Timeline duration is 1, so scene positions are the storyboard timecodes from MOTION.md.
// Reduced motion, no-JS, and Save-Data visitors get the static storyboard frames instead.
import { useRef } from "react";
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
      const images: HTMLImageElement[] = [];
      const state = { frame: 0 };
      let last = -1;

      const nearestLoaded = (i: number) => {
        for (let d = 0; d < count; d++) {
          if (images[i - d]?.complete && images[i - d].naturalWidth) return images[i - d];
          if (images[i + d]?.complete && images[i + d].naturalWidth) return images[i + d];
        }
        return undefined;
      };
      const draw = (force = false) => {
        const i = Math.round(state.frame);
        if (i === last && !force) return;
        const img = nearestLoaded(i);
        if (!img) return;
        last = i;
        const dpr = Math.min(devicePixelRatio || 1, 2);
        const w = el.clientWidth * dpr, h = el.clientHeight * dpr;
        if (el.width !== w || el.height !== h) { el.width = w; el.height = h; }
        const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
        c.drawImage(img, (w - img.naturalWidth * s) / 2, (h - img.naturalHeight * s) / 2, img.naturalWidth * s, img.naturalHeight * s);
      };

      // first 10 frames eagerly, the rest when the browser is idle
      const loadFrame = (i: number) => { const img = new Image(); img.decoding = "async"; img.src = src(i, size); img.onload = () => i === Math.round(state.frame) && draw(true); images[i] = img; };
      for (let i = 0; i < Math.min(10, count); i++) loadFrame(i);
      const idle = (cb: () => void) => ("requestIdleCallback" in window ? requestIdleCallback(cb) : setTimeout(cb, 200));
      idle(() => { for (let i = 10; i < count; i++) loadFrame(i); });

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
      tl.to(state, { frame: count - 1, duration: 1, onUpdate: () => draw() }, 0);
      scenes.forEach((s, i) => {
        const sel = `[data-scene="${i}"]`;
        const len = s.to - s.from, io = Math.min(0.06, len * 0.25);  // in/out time; the middle is the hold
        tl.fromTo(sel, { autoAlpha: 0, yPercent: 30 }, { autoAlpha: 1, yPercent: 0, duration: io }, s.from);
        if (i < scenes.length - 1) tl.to(sel, { autoAlpha: 0, yPercent: -30, duration: io }, s.to - io);
      });

      const onResize = () => draw(true);
      addEventListener("resize", onResize);
      return () => { removeEventListener("resize", onResize); if (root.current) delete root.current.dataset.film; };
    });
  }, { scope: root });

  return (
    <section ref={root} className="group relative bg-[var(--ground)] text-[var(--ink)]">
      {/* Static storyboard: the default. Hidden only when the film is running. */}
      <div className="grid gap-[12vh] px-[5vw] py-[12vh] group-data-[film=on]:hidden">
        {scenes.map((s) => (
          <figure key={s.title} className="grid gap-6 md:grid-cols-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.still} alt={s.alt} loading="lazy" className="w-full md:col-span-8" />
            <figcaption className="md:col-span-4 md:self-end">
              <p className="text-[clamp(1.75rem,3.5vw,3.5rem)] leading-[1.02] tracking-[-0.02em]">{s.title}</p>
              {s.caption && <p className="mt-3 text-[var(--muted)]">{s.caption}</p>}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Film stage */}
      <div data-stage className="relative hidden h-[100svh] overflow-hidden group-data-[film=on]:block">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        <div className="absolute inset-x-[5vw] bottom-[12vh]">
          {scenes.map((s, i) => (
            <div key={s.title} data-scene={i} className="invisible absolute bottom-0 left-0 max-w-[18ch]">
              <p className="text-[clamp(2.5rem,7vw,8rem)] leading-[0.92] tracking-[-0.03em]">{s.title}</p>
              {s.caption && <p className="mt-4 max-w-[40ch] text-[var(--muted)]">{s.caption}</p>}
            </div>
          ))}
        </div>
        <div className="absolute inset-x-[5vw] bottom-[5vh] flex items-center gap-4 font-mono text-xs tabular-nums tracking-[0.08em]">
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
