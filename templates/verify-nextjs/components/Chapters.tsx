"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Chapter = { id: string; number: number; title: string; body: string };

gsap.registerPlugin(ScrollTrigger);

// Each chapter rises 24px and fades in as it enters the lower fifth of the screen, scrubbed to scroll,
// so the motion only says "next chapter". With prefers-reduced-motion nothing is animated: the chapters are
// simply there (gsap.matchMedia only runs the animation when the query matches).
export function Chapters({ chapters }: { chapters: Chapter[] }) {
  const root = useRef<HTMLOListElement>(null);

  useLayoutEffect(() => {
    if (!root.current) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-chapter]", root.current).forEach((el) => {
        gsap.fromTo(el, { autoAlpha: 0, y: 24 }, {
          autoAlpha: 1, y: 0, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 80%", end: "top 55%", scrub: true },
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <ol ref={root} className="divide-y divide-ink/20">
      {chapters.map((c) => (
        <li key={c.id} id={c.id} data-chapter className="min-h-[60vh] py-16 grid gap-4 content-center">
          <span className="font-mono text-sm text-accent">{String(c.number).padStart(2, "0")}</span>
          <h2 className="text-4xl font-semibold tracking-tight">{c.title}</h2>
          <p className="max-w-prose text-muted">{c.body}</p>
        </li>
      ))}
    </ol>
  );
}
