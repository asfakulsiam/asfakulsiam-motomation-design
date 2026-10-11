"use client";
// Lenis smooth scroll driven by the GSAP ticker, so ScrollTrigger and Lenis share one loop.
// Lenis respects prefers-reduced-motion by default and keeps native touch scrolling.
//
// The Lenis instance does not exist on the first render: ReactLenis creates it in its own
// effect. So the ticker reads the ref on every frame (never a value captured at mount), and
// the ScrollTrigger bridge subscribes once the root instance is published by useLenis().
import { useEffect, useRef, type ReactNode } from "react";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { gsap, ScrollTrigger } from "../lib/gsap";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const lenis = useLenis(); // the root instance; undefined until ReactLenis has mounted

  // One loop: the GSAP ticker drives Lenis. Read the ref inside the callback.
  useEffect(() => {
    const tick = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => gsap.ticker.remove(tick);
  }, []);

  // ScrollTrigger reads positions on every Lenis scroll event.
  useEffect(() => {
    if (!lenis) return;
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis]);

  return (
    <ReactLenis root options={{ autoRaf: false, lerp: 0.1 }} ref={lenisRef}>
      {children}
    </ReactLenis>
  );
}
