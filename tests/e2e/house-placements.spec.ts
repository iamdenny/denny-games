import { test, expect } from "@playwright/test";

for (const locale of ["ko", "en"]) {
  for (const width of [320, 390, 1440]) {
    test(`house images and outside-player placement ${locale} ${width}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      let requests = 0;
      await page.route("https://bauval.org/**", (route) => {
        requests++;
        return route.fulfill({
          contentType: "application/javascript",
          body: "document.body.append('Test advertisement');",
        });
      });
      await page.goto(`/${locale}/play/2048/`);
      const player = page.locator("#player");
      const promotions = page.locator(".player-promotions");
      const playerBox = await player.boundingBox();
      const promoBox = await promotions.boundingBox();
      expect(playerBox?.height).toBeGreaterThanOrEqual(899);
      expect(promoBox!.y).toBeGreaterThanOrEqual(
        playerBox!.y + playerBox!.height,
      );
      expect(requests).toBe(0);
      await page.locator("#start-button").click();
      await promotions.locator("[data-house-banner] a").focus();
      await expect(page.locator("#game-overlay")).toBeVisible();
      await expect(promotions.locator("[data-house-banner] a")).toBeFocused();
      await promotions.scrollIntoViewIfNeeded();
      const banner = promotions.locator("[data-house-banner]");
      const href = await banner.locator("a").getAttribute("href");
      expect([
        "https://modutt.kr/",
        `https://tools.iamdenny.com/${locale}/`,
      ]).toContain(href);
      await expect
        .poll(() =>
          banner
            .locator("img")
            .evaluate(
              (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
            ),
        )
        .toBe(true);
      await banner.locator("a").focus();
      await page.setViewportSize({ width: width + 1, height: 900 });
      expect(await banner.locator("a").getAttribute("href")).toBe(href);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await promotions.locator("[data-adsterra-allow]").click();
      await expect.poll(() => requests).toBe(1);
      await promotions.locator("[data-adsterra-revoke]").click();
      await expect(promotions.locator("iframe")).toHaveCount(0);
      await page.locator(".player-promotions > a").click();
      await expect(player).toBeInViewport();
    });
  }
}

test("catalogue has one paid placement between game cards and visible ad shortcut", async ({
  page,
}) => {
  await page.goto("/ko/all/");
  const ad = page.locator("[data-adsterra]");
  await expect(ad).toHaveCount(1);
  await expect(page.locator("[data-ad-settings]")).toBeVisible();
  expect(
    await ad.evaluate((el) => [...el.parentElement!.children].indexOf(el)),
  ).toBe(8);
  await page.locator("[data-ad-settings]").click();
  await expect(ad).toBeInViewport();
});
