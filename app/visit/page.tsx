// Visit: the address, the full hours table, directions, access and a drawn map of the street.
import type { Metadata } from "next";
import Link from "next/link";
import { HoursTable } from "@/components/HoursTable";
import { address, shop } from "@/lib/site";

export const metadata: Metadata = {
  title: "Visit",
  description: "Find Tannery Row Coffee at 14 Tannery Row, Northbank: opening hours for every day, directions from the station, bike racks and step-free access.",
  alternates: { canonical: "/visit/" },
};

export default function VisitPage() {
  return (
    <div className="wrap visit">
      <header className="page-head">
        <p className="kicker mono">Visit</p>
        <h1>14 Tannery Row, by the river.</h1>
        <p className="dek">Two minutes from Northbank station. Look for the brick arch with the old dye-works sign above it.</p>
      </header>
      <div className="visit__grid">
        <section aria-labelledby="where-title" className="visit__where">
          <h2 id="where-title" className="section-title">Where</h2>
          <address className="visit__address">{shop.name}<br />{address}</address>
          <p><a href={`mailto:${shop.email}`}>{shop.email}</a></p>
          <h3>Getting here</h3>
          <ul className="plain">{shop.directions.map((d) => <li key={d}>{d}</li>)}</ul>
          <h3>Access</h3>
          <p>{shop.access}</p>
        </section>
        <section aria-labelledby="hours" className="visit__hours">
          <h2 id="hours" className="section-title" tabIndex={-1}>Opening hours</h2>
          <HoursTable />
          <p className="visit__note">Hours change on bank holidays; we post them here a week ahead.</p>
          <p><Link className="button" href="/contact/">Ask us something</Link></p>
        </section>
        <figure className="map" aria-labelledby="map-caption">
          <svg viewBox="0 0 400 260" role="img" aria-labelledby="map-title">
            <title id="map-title">Sketch map: the shop sits on Tannery Row between the river path and Mill Street, two minutes north-east of Northbank station.</title>
            <rect x="0" y="0" width="400" height="260" className="map__ground" />
            <path d="M0 210 C 90 190, 160 240, 260 215 S 380 200, 400 190" className="map__river" />
            <path d="M40 0 L 40 260" className="map__road" /><path d="M0 120 L 400 120" className="map__road" /><path d="M250 0 L 250 200" className="map__road map__road--minor" />
            <path d="M58 150 C 120 150, 170 140, 230 132" className="map__walk" />
            <rect x="24" y="140" width="32" height="20" className="map__station" /><text x="64" y="176" className="map__label">Northbank station</text>
            <circle cx="236" cy="130" r="9" className="map__pin" /><text x="200" y="104" className="map__label map__label--strong">Tannery Row Coffee</text>
            <text x="262" y="60" className="map__label">Mill Street</text><text x="150" y="112" className="map__label">Tannery Row</text><text x="290" y="236" className="map__label">River path</text>
          </svg>
          <figcaption id="map-caption" className="mono">Not to scale. Dotted line: the two-minute walk from the station.</figcaption>
        </figure>
      </div>
    </div>
  );
}
