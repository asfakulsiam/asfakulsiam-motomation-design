# SEO and Discoverability

Animated sites often fail SEO because content hides behind JavaScript. Don't let that happen.

- **Content is in the HTML.** All text exists in server-rendered markup in its final state; animations start *from* it. Pinned chapters keep their text in the DOM.
- **One `<title>` (≤ 60 chars) and one meta description (≤ 155 chars) per page**, written for people.
- **Open Graph and Twitter cards** with a designed 1200×630 image for every main page.
- **Structured data (JSON-LD)** that matches the category: `Organization`, `Person`, `Product`/`Offer`, `Hotel`, `Restaurant`, `Event`, `Course`, `Article`, `BreadcrumbList`.
- **Semantic headings** that describe the content, not "Welcome" or "Section 2".
- **Canonical URLs, sitemap.xml and robots.txt.**
- **`llms.txt`** at the root: a plain summary of the site and key pages, so AI assistants describe it correctly.
- **Images:** descriptive file names, `alt` text, width/height attributes.
- **Internationalisation:** `lang` on `<html>`, `hreflang` for language versions (e.g. `bn` and `en`).
- **Performance is SEO:** meet the targets in `craft/performance.md`.
- **Never claim Lighthouse or Core Web Vitals scores you didn't measure.**
