"use client";
// @motomation-component
// id: image-trail
// name: Image Trail
// family: cursor
// tier: 2
// deps: react
// what: Moving the cursor across an area drops a trail of images that appear, linger briefly and shrink away, cycling through a set.
// use-when: Photographers, archives, studios with a deep body of work; one area per page.
// avoid-when: Fewer than 5 images; e-commerce product pages; over text that must be read.
// reduced-motion: The images are shown as a static row instead.
// touch: A static, swipeable row.
// a11y: Trail images are decorative (empty alt) because the static row, with alt text, is always in the DOM for assistive tech.
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion, useFinePointer } from "../_lib/motion";

type Img = { src: string; alt: string };
type Props = { images: Img[]; spacing?: number; lifeMs?: number; size?: number; children?: ReactNode; className?: string; style?: CSSProperties };

export function ImageTrail({ images, spacing = 90, lifeMs = 900, size = 180, children, className, style }: Props) {
  const area = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const live = fine && !reduce;
  useEffect(() => {
    const el = area.current; if (!el || !live) return;
    let lx = -1e4, ly = -1e4, n = 0;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top;
      if (Math.hypot(x - lx, y - ly) < spacing) return; lx = x; ly = y;
      const im = images[n++ % images.length]; const node = document.createElement("img"); node.src = im.src; node.alt = ""; node.setAttribute("aria-hidden", "true");
      Object.assign(node.style, { position: "absolute", left: `${x - size / 2}px`, top: `${y - size * 0.6}px`, width: `${size}px`, height: "auto", pointerEvents: "none", transform: "scale(.6)", opacity: "0", transition: `transform ${lifeMs / 3}ms cubic-bezier(.22,1,.36,1), opacity 150ms linear` });
      el.appendChild(node); requestAnimationFrame(() => { node.style.transform = "scale(1)"; node.style.opacity = "1"; });
      setTimeout(() => { node.style.transform = "scale(.2)"; node.style.opacity = "0"; setTimeout(() => node.remove(), lifeMs / 3); }, lifeMs);
    };
    el.addEventListener("pointermove", move);
    return () => { el.removeEventListener("pointermove", move); el.querySelectorAll("img[aria-hidden]").forEach((n) => n.remove()); };
  }, [live, images, spacing, lifeMs, size]);
  return (
    <div ref={area} className={className} style={{ position: "relative", overflow: "hidden", ...style }}>
      {children}
      <ul style={live ? { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" } : { listStyle: "none", margin: 0, padding: 0, display: "flex", gap: 12, overflowX: "auto", scrollSnapType: "x mandatory" }}>
        {images.map((im, i) => <li key={i} style={{ flex: `0 0 ${size}px`, scrollSnapAlign: "start" }}><img src={im.src} alt={im.alt} width={size} loading="lazy" style={{ display: "block", width: "100%", height: "auto" }} /></li>)}
      </ul>
    </div>
  );
}
