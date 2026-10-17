"use client";
// Primary navigation; marks the current page so the masthead doubles as a "you are here".
// tier 1 · use-when: the masthead · avoid-when: more than five links (would need a menu toggle at 375px) · reduced-motion: underline appears at once · touch: 44px targets
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/menu/", label: "Menu" },
  { href: "/visit/", label: "Visit" },
  { href: "/contact/", label: "Contact" },
];

export function Nav() {
  const path = usePathname() || "/";
  return (
    <nav aria-label="Main" className="nav">
      <ul>
        {links.map((l) => {
          const here = path === l.href || path === l.href.slice(0, -1);
          return <li key={l.href}><Link href={l.href} aria-current={here ? "page" : undefined}>{l.label}</Link></li>;
        })}
      </ul>
    </nav>
  );
}
