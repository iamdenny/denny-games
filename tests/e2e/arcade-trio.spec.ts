import { test, expect } from "@playwright/test";
import fs from "node:fs";

for (const locale of ["en", "ko"]) {
  test(`new campaigns expose localized discovery and consent boundaries ${locale}`, async ({
    page,
    request,
  }) => {
    const index = await (
      await request.get(`/${locale}/search-index.json`)
    ).json();
    for (const id of ["snack-street", "pocket-pingpong"]) {
      expect(index.filter((g: { id: string }) => g.id === id)).toHaveLength(1);
      const loaded: string[] = [];
      page.on("request", (r) => loaded.push(r.url()));
      await page.goto(`/${locale}/games/${id}/`);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `https://games.iamdenny.com/${locale}/games/${id}/`,
      );
      await expect(
        page.locator(`a[href="/${locale}/play/${id}/"]`).first(),
      ).toBeVisible();
      expect(
        loaded.some((url) => /google-analytics|googletagmanager/.test(url)),
      ).toBe(false);
      const schema = await page
        .locator('script[type="application/ld+json"]')
        .allTextContents();
      expect(schema.join(" ")).toContain("VideoGame");
      await page.goto(`/${locale}/guides/${id}/`);
      await expect(page.locator("h1")).toBeVisible();
      await expect(
        page.locator(`a[href="/${locale}/play/${id}/"]`).first(),
      ).toBeVisible();
    }
    await page.goto(`/${locale}/collections/cook-rally-duel/`);
    await expect(page.locator("[data-game-card]")).toHaveCount(3);
  });
}

test("capture actual campaign preview images", async ({ page }) => {
  test.skip(!process.env.CAPTURE_TRIO, "Explicit preview generation only");
  await page.setViewportSize({ width: 1440, height: 900 });
  fs.mkdirSync("public/art/screenshots", { recursive: true });
  for (const [id, selector] of [
    ["snack-street", ".snack-street"],
    ["pocket-pingpong", 'canvas[data-game="pocket-pingpong"]'],
  ]) {
    await page.goto(`/en/play/${id}/`);
    await page.locator("#start-button").click();
    await expect(page.locator(selector!)).toBeVisible();
    if (id === "snack-street") await page.locator('[data-food="rice"]').click();
    await page
      .locator(selector!)
      .screenshot({ path: `public/art/screenshots/${id}.png` });
  }
});
