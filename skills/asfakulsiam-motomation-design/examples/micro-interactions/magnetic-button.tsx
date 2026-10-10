"use client";
// Considerate Magnet: the label leans toward the cursor; the button's hit area never moves.
// Fine pointer + motion allowed only. Works as a normal button everywhere else.
import { useRef, type ButtonHTMLAttributes } from "react";
import { gsap, useGSAP, MQ } from "../lib/gsap";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { strength?: number; max?: number };

export function MagneticButton({ children, className = "", strength = 0.25, max = 10, type = "button", ...rest }: Props) {
  const btn = useRef<HTMLButtonElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(`${MQ.motion} and ${MQ.finePointer}`, () => {
      const el = btn.current, label = inner.current;
      if (!el || !label) return;
      const toX = gsap.quickTo(label, "x", { duration: 0.35, ease: "power3.out" });
      const toY = gsap.quickTo(label, "y", { duration: 0.35, ease: "power3.out" });
      const clamp = gsap.utils.clamp(-max, max);
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        toX(clamp((e.clientX - (r.left + r.width / 2)) * strength));
        toY(clamp((e.clientY - (r.top + r.height / 2)) * strength));
      };
      const leave = () => { toX(0); toY(0); };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
    });
  }, { scope: btn, dependencies: [strength, max] });

  return (
    <button
      ref={btn}
      type={type}
      className={`relative inline-flex items-center justify-center rounded-full bg-[var(--ink)] px-7 py-4 text-[var(--ground)] transition-transform duration-100 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] ${className}`}
      {...rest}
    >
      <span ref={inner} className="inline-block">{children}</span>
    </button>
  );
}
