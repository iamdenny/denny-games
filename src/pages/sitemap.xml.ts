import type { APIRoute } from "astro";
import { allIndexableUrls } from "../lib/routes";
export const GET: APIRoute = () =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${["/", ...allIndexableUrls()].map((url) => `<url><loc>https://games.iamdenny.com${url}</loc></url>`).join("")}</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
