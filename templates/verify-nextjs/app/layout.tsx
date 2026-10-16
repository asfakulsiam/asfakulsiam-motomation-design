import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Verify · Next.js zero-config check",
  description: "A functional check: App Router, TypeScript, Tailwind, GSAP scroll motion, mock JSON data, a schema and middleware.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ground text-ink font-sans antialiased">{children}</body>
    </html>
  );
}
