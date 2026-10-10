/**
 * Product Feature Demo
 * Tier: 2–3
 * Feel: Clear, demonstrative, calm
 *
 * Notes:
 * - Shows the product action instead of only describing it
 * - Motion teaches, it does not decorate
 * - Works well for SaaS and tool websites
 */

"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function FeatureDemo() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const ui = el.querySelector("[data-product-ui]");
      const caption = el.querySelector("[data-caption]");

      gsap
        .timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 70%",
            end: "center center",
            scrub: 0.6,
          },
        })
        .from(ui, { y: 60, opacity: 0.2, duration: 1 })
        .from(caption, { opacity: 0, y: 20, duration: 0.6 }, 0.3);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="py-32 px-6 md:px-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div data-caption>
          <p className="text-sm tracking-[0.2em] uppercase mb-4 opacity-60">
            Feature
          </p>
          <h3 className="text-3xl md:text-5xl font-medium mb-6">
            See the action,
            <br />
            not just the claim
          </h3>
          <p className="text-lg opacity-75 leading-relaxed">
            Motion should demonstrate how the product works. If it doesn’t
            teach, remove it.
          </p>
        </div>

        <div
          data-product-ui
          className="aspect-[4/3] rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-black/5 flex items-center justify-center"
        >
          <span className="text-sm opacity-40">Product UI / Demo surface</span>
        </div>
      </div>
    </section>
  );
}