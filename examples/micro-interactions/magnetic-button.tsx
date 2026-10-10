/**
 * Magnetic Button
 * Tier: 1
 * Feel: Subtle, tactile, premium
 *
 * Notes:
 * - Small movement only
 * - Must not interfere with accessibility
 * - Disable on touch devices if needed
 */

"use client";

import { useRef } from "react";
import gsap from "gsap";

export default function MagneticButton({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const btn = ref.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
      x: x * 0.25,
      y: y * 0.25,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });
  };

  return (
    <button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="px-8 py-4 rounded-full bg-neutral-900 text-white text-sm tracking-wide"
    >
      {children}
    </button>
  );
}