// Placeholder photography from Wikimedia Commons (none of it shows this shop). Every entry is recorded in MEDIA.md.
export type PhotoMeta = { src: string; alt: string; width: number; height: number; credit: string; href: string; licence: string; licenceUrl: string };

export const photos = {
  counter: { src: "/media/placeholder-pour-over-counter.webp", alt: "A pour-over brewer, gooseneck kettle and scale on a stone counter", width: 1400, height: 894, credit: "Cerebral726", href: "https://commons.wikimedia.org/wiki/File:Coffee_Pour_Over_Setup.jpg", licence: "CC BY-SA 4.0", licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/" },
  bloom: { src: "/media/placeholder-v60-bloom.webp", alt: "Coffee grounds blooming in a white V60 dripper, seen from above", width: 1000, height: 795, credit: "Indigo.udm", href: "https://commons.wikimedia.org/wiki/File:Tasty_Coffee_pourover_V60_bloom_2025.jpg", licence: "CC BY 4.0, cropped", licenceUrl: "https://creativecommons.org/licenses/by/4.0/" },
  latte: { src: "/media/placeholder-latte.webp", alt: "A flat white with a rosetta poured in the milk, held over a steel bar top", width: 900, height: 675, credit: "Linda N.", href: "https://commons.wikimedia.org/wiki/File:Latte_art_at_Balzac%27s.jpg", licence: "CC BY 2.0", licenceUrl: "https://creativecommons.org/licenses/by/2.0/" },
  pastry: { src: "/media/placeholder-pastry-case.webp", alt: "A glass pastry case lined with trays of croissants and buns", width: 1000, height: 750, credit: "Sarah Stierch", href: "https://commons.wikimedia.org/wiki/File:Le_Croissant_French_Bakery_-_November_2023_-_Sarah_Stierch_02.jpg", licence: "CC BY 4.0", licenceUrl: "https://creativecommons.org/licenses/by/4.0/" },
} satisfies Record<string, PhotoMeta>;
