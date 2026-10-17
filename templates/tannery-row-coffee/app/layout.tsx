// Root layout: fonts, site-wide metadata, the masthead and the footer.
import type { Metadata, Viewport } from "next";
import { Newsreader, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const display = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz"], variable: "--font-display", display: "swap" });
const text = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-text", display: "swap", preload: false });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-mono", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Tannery Row Coffee · espresso, filter and pastry", template: "%s · Tannery Row Coffee" },
  description: "A specialty coffee bar in a former tannery on Tannery Row, Northbank. Espresso and filter brewed in front of you, pastry baked each morning, open seven days.",
  openGraph: { type: "website", siteName: "Tannery Row Coffee", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Tannery Row Coffee" }] },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#F1EADF", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${display.variable} ${text.variable} ${mono.variable}`}>
      <body>
        <Masthead />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
