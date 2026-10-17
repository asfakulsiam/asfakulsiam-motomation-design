// The menu laid out as the counter itself: three stations, left to right, each with its own cup.
import type { Metadata } from "next";
import { Station } from "@/components/Station";
import { menu, price, stations } from "@/lib/site";
import { Photo } from "@/components/Photo";
import { photos } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Menu",
  description: "Espresso, filter and pastry at Tannery Row Coffee, laid out the way the counter is: choose a drink to see what is in the cup.",
  alternates: { canonical: "/menu/" },
};

export default function MenuPage() {
  const pastry = menu.filter((m) => m.station === "pastry");
  const pastryInfo = stations.find((s) => s.id === "pastry")!;
  return (
    <div className="wrap menu">
      <header className="page-head">
        <p className="kicker mono">The menu</p>
        <h1>The counter, left to right.</h1>
        <p className="dek">Choose a drink to see its cup in cross-section: what goes in, and how much. Oat milk costs nothing extra. Prices include VAT.</p>
        <nav aria-label="Stations" className="jump">
          <ul>{stations.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>)}</ul>
        </nav>
        <Photo photo={photos.bloom} className="page-head__photo" caption="A V60 in its first thirty seconds: the bloom." />
      </header>
      <div className="counter">
        {stations.filter((s) => s.id !== "pastry").map((s) => (
          <Station key={s.id} id={s.id} title={s.title} lede={s.lede} items={menu.filter((m) => m.station === s.id)} />
        ))}
        <section className="station station--pastry" id="pastry" aria-labelledby="pastry-title">
          <header className="station__head"><h2 id="pastry-title">{pastryInfo.title}</h2><p>{pastryInfo.lede}</p></header>
          <ul className="pastries">
            {pastry.map((p) => (
              <li key={p.id} id={p.id} className={p.soldOut ? "is-out" : undefined}>
                <span className="drink__name">{p.name}</span>
                <span className="drink__price mono">{p.soldOut ? "Sold out today" : price(p.price)}</span>
                <span className="drink__notes">{p.notes}</span>
                <span className="mono pastry__allergens">Contains {p.allergens}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <p className="menu__allergy">Tell us about any allergy before you order. Our kitchen handles nuts, gluten, milk and egg, so we can&rsquo;t promise any item is free of them.</p>
    </div>
  );
}
