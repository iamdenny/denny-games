import type { APIRoute } from "astro";
import { allIndexableUrls } from "../lib/routes";
import { SITE } from "../lib/seo";
export const GET: APIRoute = () => {
  const urls = ["/", ...allIndexableUrls()];
  const entries = urls
    .map((url) => {
      const path = url === "/" ? "" : url.slice(4);
      const en = `${SITE}/en/${path}`,
        ko = `${SITE}/ko/${path}`;
      const fallback = path ? en : `${SITE}/`;
      return `<url><loc>${SITE}${url}</loc><xhtml:link rel="alternate" hreflang="en" href="${en}"/><xhtml:link rel="alternate" hreflang="ko" href="${ko}"/><xhtml:link rel="alternate" hreflang="x-default" href="${fallback}"/></url>`;
    })
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries}</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
};
