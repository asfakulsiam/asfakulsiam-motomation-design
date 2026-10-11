"use client";
// @motomation-component
// id: brand-selection
// name: Brand Selection
// family: micro
// tier: 1
// deps: react
// what: Text selection uses the brand accent and ink instead of the browser's blue, scoped to a section or the whole page.
// use-when: Almost always; it's a tiny, free detail that shows care.
// avoid-when: The accent and its text colour don't pass 4.5:1 together.
// reduced-motion: Not applicable (no motion).
// touch: Same as desktop.
// a11y: Check the contrast of selection text on the selection colour (scripts/contrast.mjs).
import type { CSSProperties, ReactNode } from "react";
import { useId } from "react";

type Props = { children: ReactNode; background?: string; color?: string; className?: string; style?: CSSProperties };

export function BrandSelection({ children, background = "var(--accent, #e0442b)", color = "var(--ground, #fff)", className, style }: Props) {
  const id = "mm-sel-" + useId().replace(/:/g, "");
  return (
    <div data-sel={id} className={className} style={style}>
      <style>{`[data-sel="${id}"] ::selection{background:${background};color:${color}}`}</style>
      {children}
    </div>
  );
}
