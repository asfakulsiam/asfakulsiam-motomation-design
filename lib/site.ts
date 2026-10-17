// Demo data and the site URL, read once at build time. Replace data/*.json with the shop's real details before launch.
import shopFile from "@/data/shop.json";
import menuFile from "@/data/menu.json";

export type Hours = { day: number; label: string; open: string; close: string };
export type Layer = { kind: "espresso" | "milk" | "foam" | "water" | "filter" | "ice"; ml: number };
export type MenuItem = {
  demo: boolean; id: string; station: "espresso" | "brew" | "pastry"; name: string; price: number;
  spec?: string; notes?: string; allergens?: string; soldOut?: boolean; layers?: Layer[];
};

export const shop = shopFile.item;
export const hours: Hours[] = shopFile.item.hours;
export const menu: MenuItem[] = menuFile.items as MenuItem[];
export const currency = menuFile.currency;

// SITE_URL is the deployed origin; the fallback is a reserved .example domain so nothing points at a real site by accident
export const siteUrl = (process.env.SITE_URL || "https://tannery-row.example").replace(/\/$/, "");

export const price = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(n);
export const address = `${shop.street}, ${shop.town} ${shop.postcode}`;

export const stations = [
  { id: "espresso", title: "Espresso bar", lede: "Left of the till. Two groups, one grinder per coffee." },
  { id: "brew", title: "Brew bar", lede: "Middle of the counter. Filter by the cup, weighed every time." },
  { id: "pastry", title: "Pastry case", lede: "Right by the door. Baked this morning; gone when it's gone." },
] as const;
