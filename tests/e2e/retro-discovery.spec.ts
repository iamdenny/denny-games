import { test, expect } from "@playwright/test";
import { retroIds } from "../../src/data/retro-discovery";

const site = "https://games.iamdenny.com";

test("all eight original arcade games have bilingual canonical discovery", async ({
  request,
}) => {
  const sitemapResponse = await request.get("/sitemap.xml");
  expect(sitemapResponse.ok()).toBe(true);
  const sitemap = await sitemapResponse.text();
  const llmsResponse = await request.get("/llms.txt");
  expect(llmsResponse.ok()).toBe(true);
  const llms = await llmsResponse.text();
  expect(llms).toContain("original names, graphics and stages");
  expect(llms).toContain("there is no online matchmaking");
  for (const locale of ["en", "ko"] as const) {
    for (const path of ["guides/retro-arcade", "collections/retro-arcade"]) {
      const canonical = `${site}/${locale}/${path}/`;
      const response = await request.get(`/${locale}/${path}/`);
      expect(response.ok()).toBe(true);
      const html = await response.text();
      expect(html).toContain(`rel="canonical" href="${canonical}"`);
      expect(sitemap).toContain(`<loc>${canonical}</loc>`);
      expect(llms).toContain(canonical);
      for (const id of retroIds)
        expect(html).toContain(`/${locale}/games/${id}/`);
      expect(html).toContain(locale === "en" ? "same-device" : "한 기기");
    }
    for (const id of retroIds) {
      const path = `/${locale}/games/${id}/`;
      const response = await request.get(path);
      expect(response.ok()).toBe(true);
      const html = await response.text();
      expect(html).toContain(`rel="canonical" href="${site}${path}"`);
      expect(html).not.toContain('content="noindex');
      expect(html).toContain(`hreflang="${locale === "en" ? "ko" : "en"}"`);
      const schemas = [
        ...html.matchAll(
          /<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs,
        ),
      ].map((match) => JSON.parse(match[1]!));
      const serialized = JSON.stringify(schemas);
      expect(serialized).toContain('"@type":"VideoGame"');
      expect(serialized).toContain(`"url":"${site}${path}"`);
      expect(serialized).not.toContain('"aggregateRating"');
      expect(sitemap).toContain(`<loc>${site}${path}</loc>`);
      expect(llms).toContain(`${site}${path}`);
      expect(html).toContain(`/${locale}/play/${id}/`);
    }
  }
});
