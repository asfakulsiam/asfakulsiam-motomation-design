/**
 * Cinematic Hero
 * Tier: 2–3
 * Feel: Confident, editorial, fully visible on load
 *
 * Notes:
 * - Hero content is visible immediately
 * - Only a subtle scroll cue moves
 * - Uses GSAP + ScrollTrigger for the exit transition
 */

"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function CinematicHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        })
        .to(el.querySelector("[data-hero-content]"), {
          y: -80,
          opacity: 0.3,
          ease: "none",
        })
        .to(
          el.querySelector("[data-scroll-cue]"),
          { opacity: 0, ease: "none" },
          0
        );
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative h-screen flex items-center">
      <div data-hero-content className="px-6 md:px-16 max-w-5xl">
        <p className="text-sm tracking-[0.2em] uppercase mb-6 opacity-60">
          Studio
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.95] tracking-tight">
          Design that
          <br />
          moves with
          <br />
          intention
        </h1>
      </div>

      <div
        data-scroll-cue
        className="absolute bottom-10 left-6 md:left-16 text-sm tracking-widest uppercase opacity-50"
      >
        Scroll to explore
      </div>
    </section>
  );
}