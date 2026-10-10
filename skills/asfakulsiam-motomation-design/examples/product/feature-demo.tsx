"use client";
// Workbench pattern: a product moment demonstrated by scroll instead of a feature-icon grid.
// The step list stays readable and in the DOM; the visual pane scrubs between states.
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "../lib/gsap";

type Step = { title: string; body: string; image: string; alt: string };

export function FeatureDemo({ steps }: { steps: Step[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({ motion: MQ.motion, desktop: MQ.desktop }, (ctx) => {
      const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
      if (!motion || !desktop) return; // mobile + reduced motion: stacked steps with their own images
      const frames = gsap.utils.toArray<HTMLElement>("[data-frame]");
      const items = gsap.utils.toArray<HTMLElement>("[data-step]");
      gsap.set(frames.slice(1), { autoAlpha: 0 });
      items.forEach((item, i) => {
        gsap.timeline({ scrollTrigger: { trigger: item, start: "top 60%", end: "bottom 60%", toggleActions: "play none none reverse" } })
          .to(frames, { autoAlpha: 0, duration: 0.3, ease: "power2.out" }, 0)
          .to(frames[i], { autoAlpha: 1, duration: 0.45, ease: "power3.out" }, 0)
          .fromTo(item, { opacity: 0.35 }, { opacity: 1, duration: 0.3 }, 0);
      });
    });
  }, { scope: root });

  return (
    <section ref={root} className="grid gap-16 px-[5vw] py-[20vh] md:grid-cols-12">
      <ol className="md:col-span-5">
        {steps.map((s, i) => (
          <li key={s.title} data-step className="py-[18vh] first:pt-0">
            <p className="font-mono text-xs tracking-[0.12em] text-[var(--muted)]">({String(i + 1).padStart(2, "0")})</p>
            <h3 className="mt-3 text-[clamp(1.75rem,3vw,3rem)] leading-[1.05] tracking-[-0.02em]">{s.title}</h3>
            <p className="mt-4 max-w-[46ch] leading-relaxed text-[var(--muted)]">{s.body}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.image} alt={s.alt} className="mt-8 w-full rounded-sm md:hidden" loading="lazy" />
          </li>
        ))}
      </ol>
      <div className="relative hidden md:col-span-6 md:col-start-7 md:block">
        <div className="sticky top-[15vh] aspect-[4/3] overflow-hidden rounded-sm bg-[var(--surface)]">
          {steps.map((s) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={s.title} data-frame src={s.image} alt={s.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          ))}
        </div>
      </div>
    </section>
  );
}
