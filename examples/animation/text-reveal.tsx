/**
 * Text Line Reveal
 * Tier: 2
 * Feel: Editorial, confident, purposeful
 *
 * Notes:
 * - Reveals by lines, not random characters
 * - Only used on key statements
 * - Respects reduced motion
 */

"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function TextReveal({
  children,
}: {
  children: React.ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReduced) return;

      gsap.from(el.querySelectorAll("[data-line]"), {
        yPercent: 110,
        duration: 1,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
        },
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="overflow-hidden">
      <div data-line className="overflow-hidden">
        <div>{children}</div>
      </div>
    </div>
  );
}