"use client";
// Tier 2 hero: an edge-anchored display headline that rises line by line, then recedes as you scroll.
// Concept slot: replace the copy with the brief's concept sentence. Fonts come from CSS variables.
import { useRef } from "react";
import { gsap, SplitText, useGSAP, MQ } from "../lib/gsap";

type Props = { kicker: string; title: string; note: string };

export function CinematicHero({ kicker, title, note }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({ motion: MQ.motion, desktop: MQ.desktop }, (ctx) => {
      const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
      if (!motion) return; // final state is the default CSS state

      SplitText.create("[data-title]", {
        type: "lines", mask: "lines", autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, { yPercent: 110, duration: 1, ease: "expo.out", stagger: 0.08, delay: 0.1 }),
      });
      gsap.from("[data-fade]", { opacity: 0, y: 12, duration: 0.8, ease: "power3.out", delay: 0.6, stagger: 0.08 });

      // recede on scroll: the hero steps back like a camera pulling out
      gsap.to("[data-stage]", {
        scale: desktop ? 0.92 : 0.96, yPercent: desktop ? 8 : 4, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    });
  }, { scope: root });

  return (
    <section ref={root} className="relative min-h-[100svh] overflow-hidden bg-[var(--ground)] text-[var(--ink)]">
      <div data-stage className="flex min-h-[100svh] origin-top flex-col justify-end px-[5vw] pb-[6vh]">
        <p data-fade className="mb-6 font-mono text-xs uppercase tracking-[0.12em] text-[var(--muted)]">{kicker}</p>
        <h1 data-title className="max-w-[14ch] font-[family-name:var(--font-display)] text-[clamp(3.5rem,11vw,13rem)] leading-[0.9] tracking-[-0.035em] [text-wrap:balance]">
          {title}
        </h1>
        <p data-fade className="mt-8 max-w-[42ch] self-end text-[clamp(1rem,1.2vw,1.2rem)] leading-relaxed text-[var(--muted)]">{note}</p>
      </div>
    </section>
  );
}
