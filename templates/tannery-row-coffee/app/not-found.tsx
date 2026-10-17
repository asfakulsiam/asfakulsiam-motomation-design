// The designed not-found page: says what happened and offers the two pages most people want.
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap notfound">
      <p className="kicker mono">Error 404</p>
      <h1>Page not found.</h1>
      <p className="dek">That page isn&rsquo;t on the counter. The address may be mistyped, or the page has moved.</p>
      <ul className="notfound__links">
        <li><Link className="button" href="/">Back to the front page</Link></li>
        <li><Link href="/menu/">See the menu</Link></li>
        <li><Link href="/visit/#hours">Opening hours</Link></li>
      </ul>
    </div>
  );
}
