// The broadsheet masthead: name, today's "edition" line with live opening status, and the three-link nav.
// tier 1 · use-when: every page · avoid-when: never · reduced-motion: the rule appears drawn · touch: nav links 44px tall
import Link from "next/link";
import { shop } from "@/lib/site";
import { EditionLine } from "./EditionLine";
import { Nav } from "./Nav";

export function Masthead() {
  return (
    <header className="masthead">
      <a className="skip" href="#main">Skip to content</a>
      <div className="wrap masthead__inner">
        <p className="masthead__folio mono">{shop.town} · <EditionLine /></p>
        <Link href="/" className="masthead__name">Tannery Row <em>Coffee</em></Link>
        <Nav />
      </div>
    </header>
  );
}
