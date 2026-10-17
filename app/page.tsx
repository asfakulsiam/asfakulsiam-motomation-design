// Front page: what the shop is, whether it is open, three things on the counter today, the room, and how to get there.
import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/Photo";
import { HoursTable } from "@/components/HoursTable";
import { address, hours, menu, price, shop, siteUrl } from "@/lib/site";
import { photos } from "@/lib/photos";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const featured = ["flat-white", "v60", "cardamom-bun"].map((id) => menu.find((m) => m.id === id)!);
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const jsonLd = {
  "@context": "https://schema.org", "@type": "CafeOrCoffeeShop", name: shop.name, url: `${siteUrl}/`, email: shop.email, servesCuisine: "Coffee", image: `${siteUrl}/og.png`,
  address: { "@type": "PostalAddress", streetAddress: shop.street, addressLocality: shop.town, postalCode: shop.postcode },
  openingHoursSpecification: hours.map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: dayNames[h.day], opens: h.open, closes: h.close })),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="lead wrap" aria-labelledby="lead-title">
        <div className="lead__story">
          <p className="kicker mono">Front page</p>
          <h1 id="lead-title">Coffee you can watch being made.</h1>
          <p className="dek">An old tannery on Tannery Row, one long counter, and every cup weighed, timed and brewed in front of you. Espresso on the left, filter in the middle, pastry by the door.</p>
          <p className="lead__actions"><Link className="button" href="/menu/">Read the menu</Link> <Link className="link-arrow" href="/visit/">How to find us</Link></p>
        </div>
        <aside className="today" aria-labelledby="today-title">
          <h2 id="today-title" className="today__title">Find us</h2>
          <p className="today__address">{address}</p>
          <HoursTable compact />
          <p><Link href="/visit/">Directions and access</Link></p>
        </aside>
        <Photo photo={photos.counter} eager className="lead__photo" caption="The brew bar is the middle of the counter: scale, kettle, dripper." />
      </section>

      <section className="columns wrap" aria-labelledby="counter-title">
        <h2 id="counter-title" className="section-title">On the counter today</h2>
        <ol className="columns__list">
          {featured.map((d) => (
            <li key={d.id} className="column">
              <p className="kicker mono">{d.station === "pastry" ? "Pastry case" : d.station === "brew" ? "Brew bar" : "Espresso bar"}</p>
              <h3><Link href={`/menu/#${d.id}`}>{d.name}</Link></h3>
              <p>{d.notes}</p>
              <p className="mono column__meta">{d.spec ?? d.allergens} · {price(d.price)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="room wrap" aria-labelledby="room-title">
        <div className="room__text">
          <h2 id="room-title" className="section-title">The room</h2>
          <p>Twenty-two seats under the old drying racks, a long bench by the window and no music before ten. Laptops are welcome until noon; after that the big table is for people talking.</p>
          <p>Ask at the counter what&rsquo;s on the brew bar. We&rsquo;ll pour you a taste of either guest coffee before you choose.</p>
        </div>
        <Photo photo={photos.latte} className="room__a" caption="A flat white, poured with a rosetta." />
        <Photo photo={photos.pastry} className="room__b" caption="The pastry case fills at seven and empties by two." />
      </section>
    </>
  );
}
