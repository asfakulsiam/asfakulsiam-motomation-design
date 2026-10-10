"use client";
// Tier 2 pinned chapter: one idea in three beats. Shorter on mobile, static under reduced motion.
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "../lib/gsap";

type Beat = { label: string; line: string };

export function PinnedChapter({ title, beats, image, alt }: { title: string; beats: Beat[]; image: string; alt: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({ motion: MQ.motion, mobile: MQ.mobile }, (ctx) => {
      const { motion, mobile } = ctx.conditions as { motion: boolean; mobile: boolean };
      if (!motion) return;
      const lines = gsap.utils.toArray<HTMLElement>("[data-beat]");
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: mobile ? "+=150%" : "+=250%", scrub: 0.8, pin: true, anticipatePin: 1 },
      });
      tl.fromTo("[data-image]", { clipPath: "inset(30% 20% 30% 20%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }, 0);
      lines.forEach((el, i) => {
        const at = (i / lines.length) * 0.9;
        tl.fromTo(el, { autoAlpha: 0, yPercent: 40 }, { autoAlpha: 1, yPercent: 0, duration: 0.12 }, at);
        if (i < lines.length - 1) tl.to(el, { autoAlpha: 0, yPercent: -40, duration: 0.12 }, at + 0.9 / lines.length - 0.1);
      });
    });
  }, { scope: root });

  return (
    <section ref={root} className="relative min-h-[100svh] overflow-hidden bg-[var(--ground)] px-[5vw] py-[10vh] text-[var(--ink)]">
      <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--muted)]">{title}</h2>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img data-image src={image} alt={alt} className="mt-8 h-[60svh] w-full object-cover" />
      <div className="relative mt-8 grid min-h-[6em] gap-6 motion-safe:md:block">
        {beats.map((b) => (
          <p key={b.label} data-beat className="max-w-[24ch] text-[clamp(1.75rem,4vw,4rem)] leading-[1.05] tracking-[-0.02em] motion-safe:md:absolute motion-safe:md:inset-x-0 motion-safe:md:top-0">
            <span className="mr-3 align-top font-mono text-xs tracking-[0.12em] text-[var(--accent)]">{b.label}</span>
            {b.line}
          </p>
        ))}
      </div>
    </section>
  );
}
