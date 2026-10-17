// sitemap.xml for the five public pages.
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/menu/", "/visit/", "/contact/", "/privacy/"].map((p) => ({ url: `${siteUrl}${p}` }));
}
