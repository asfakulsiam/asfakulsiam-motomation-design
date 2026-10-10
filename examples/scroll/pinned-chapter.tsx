/**
 * Pinned Chapter (Motomation style)
 * Tier: 5
 * Feel: Scroll acts as a playhead
 *
 * Notes:
 * - Section pins
 * - Content reveals in sequence while scrolling
 * - Reverses cleanly on scroll up
 * - Always provide a reduced-motion fallback
 */

"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function PinnedChapter() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReduced) {
        gsap.set(el.querySelectorAll("[data-step]"), { opacity: 1, y: 0 });
        return;
      }

      const steps = el.querySelectorAll("[data-step]");

      gsap.set(steps, { opacity: 0, y: 40 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      steps.forEach((step, i) => {
        tl.to(
          step,
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          i * 0.4
        );
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative h-screen flex items-center">
      <div className="px-6 md:px-16 w-full max-w-4xl">
        <p data-step className="text-sm tracking-[0.2em] uppercase mb-4 opacity-60">
          Chapter 02
        </p>
        <h2 data-step className="text-4xl md:text-6xl font-medium mb-8">
          Selected Work
        </h2>
        <p data-step className="text-lg md:text-xl max-w-2xl opacity-80 leading-relaxed">
          Each project is treated as a short story. Scroll to move through the
          narrative.
        </p>
      </div>
    </section>
  );
}