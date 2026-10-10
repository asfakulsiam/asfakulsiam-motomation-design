"use client";
// Line Curtain: real line-by-line masked reveal with SplitText (re-splits on resize, keeps aria labels).
import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, MQ } from "../lib/gsap";

type Props = { as?: ElementType; children: ReactNode; className?: string; stagger?: number };

export function LineCurtain({ as: Tag = "h2", children, className, stagger = 0.08 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      if (!ref.current) return;
      SplitText.create(ref.current, {
        type: "lines", mask: "lines", autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110, duration: 0.9, ease: "expo.out", stagger,
            scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
          }),
      });
    });
  }, { scope: ref });

  return <Tag ref={ref} className={className}>{children}</Tag>;
}
