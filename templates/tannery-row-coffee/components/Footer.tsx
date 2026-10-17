// Footer: the address and hours link again, the secondary links, and the demo-content notice.
// tier 0 · use-when: every page · avoid-when: never · reduced-motion: no motion · touch: links padded to 24px+
import Link from "next/link";
import { address, shop } from "@/lib/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div>
          <p className="footer__name">{shop.name}</p>
          <p>{address}</p>
          <p><Link href="/visit/#hours">Opening hours</Link> · <a href={`mailto:${shop.email}`}>{shop.email}</a></p>
        </div>
        <nav aria-label="Footer">
          <ul className="footer__links">
            <li><Link href="/menu/">Menu</Link></li>
            <li><Link href="/visit/">Visit</Link></li>
            <li><Link href="/contact/">Contact</Link></li>
            <li><Link href="/privacy/">Privacy</Link></li>
          </ul>
        </nav>
        <p className="footer__demo mono">
          Demo build. The address, hours, menu and prices are sample content, and the photographs are placeholders by
          other photographers, credited where they appear.
        </p>
      </div>
    </footer>
  );
}
