import { test, expect } from "@playwright/test";
test("house promotions show local banners and link to both home pages", async ({
  page,
}) => {
  const external: string[] = [];
  page.on("request", (r) => {
    if (/https:\/\/(modutt\.kr|tools\.iamdenny\.com)\//.test(r.url()))
      external.push(r.url());
  });
  for (const locale of ["ko", "en"]) {
    await page.goto(`/${locale}/`);
    const promos = page.locator("[data-house-promos]");
    await promos.scrollIntoViewIfNeeded();
    await expect(promos).toBeVisible();
    await expect(promos.locator("a")).toHaveCount(2);
    await expect(promos.locator("a").nth(0)).toHaveAttribute(
      "href",
      "https://modutt.kr/",
    );
    await expect(promos.locator("a").nth(1)).toHaveAttribute(
      "href",
      "https://tools.iamdenny.com/",
    );
    for (const width of [320, 390, 430, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const img of await promos.locator("img").all()) {
        await img.scrollIntoViewIfNeeded();
        await expect
          .poll(() =>
            img.evaluate(
              (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
            ),
          )
          .toBe(true);
        await expect
          .poll(() => img.evaluate((el: HTMLImageElement) => el.currentSrc))
          .toContain(
            width <= 600
              ? (await img.getAttribute("src"))!.includes("modutt")
                ? "mobile"
                : "landscape"
              : (await img.getAttribute("src"))!,
          );
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    await expect(page.locator("[data-ad-slot]:visible")).toHaveCount(0);
  }
  expect(external).toEqual([]);
  for (const path of [
    "/ko/play/2048/",
    "/en/play/2048/",
    "/ko/search/",
    "/ko/library/",
    "/ko/device-check/",
  ]) {
    await page.goto(path);
    await expect(page.locator("[data-house-promos]")).toHaveCount(0);
  }
});
