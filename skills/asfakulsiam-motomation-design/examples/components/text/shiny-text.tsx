"use client";
// @motomation-component
// id: shiny-text
// name: Shiny Text
// family: text
// tier: 1
// deps: react
// what: A single band of light passes once across a short label, like light catching foil or a brass plate, when it enters the screen and again on hover.
// use-when: The material is metal, foil, glass or a printed seal; one short label or badge.
// avoid-when: Large headlines (the moving gradient is paint-heavy: cost grows with area); body text; infinite loops; as a "premium" sticker on everything.
// reduced-motion: Solid ink, no light band.
// touch: Plays once when in view; tap replays it.
// a11y: Plain text. The ink colour is the base everywhere and the band only lightens it, so pick a `shine` that still contrasts with the ground. Falls back to solid ink where background-clip: text isn't supported. Paint-heavy (moving gradient), so it runs once per trigger, never in a loop (motion/tokens.md "What to animate").
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInView, useReducedMotion, EASE } from "../_lib/motion";

type Props = { text: string; ink?: string; shine?: string; duration?: number; as?: "span" | "p" | "h2" | "h3"; className?: string; style?: CSSProperties };

export function ShinyText({ text, ink = "currentColor", shine = "#fff6d8", duration = 1100, as: Tag = "span", className, style }: Props) {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref);
  const reduce = useReducedMotion();
  const [ok, setOk] = useState(false);
  useEffect(() => setOk(typeof CSS !== "undefined" && (CSS.supports("background-clip", "text") || CSS.supports("-webkit-background-clip", "text"))), []);
  const play = () => { const el = ref.current; if (!el || reduce || !ok) return;
    el.animate([{ backgroundPosition: "120% 0" }, { backgroundPosition: "-20% 0" }], { duration, easing: EASE.inOut }); };
  useEffect(() => { if (seen) play(); }, [seen, ok, reduce]); // eslint-disable-line react-hooks/exhaustive-deps
  const sheen: CSSProperties = ok && !reduce ? { color: "transparent", backgroundImage: `linear-gradient(100deg, ${ink} 38%, ${shine} 50%, ${ink} 62%)`, backgroundSize: "260% 100%",
    backgroundPosition: "-20% 0", WebkitBackgroundClip: "text", backgroundClip: "text" } : { color: ink };
  return <Tag ref={ref as never} className={className} onPointerEnter={play} onPointerDown={play} style={{ ...sheen, ...style }}>{text}</Tag>;
}
