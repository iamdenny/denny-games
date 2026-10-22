import { test, expect } from "@playwright/test";
for (const locale of ["en", "ko"]) {
  test(`${locale} promotional banners work at desktop and mobile widths`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/`);
    await page.locator(`footer a[href="/${locale}/promote/"]`).click();
    await expect(page.locator("h1")).toBeVisible();
    const downloads = page.locator(".banner-card a[download]");
    await expect(downloads).toHaveCount(10);
    for (const width of [320, 360, 390, 430, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    for (const img of await page.locator(".banner-preview img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          img.evaluate(
            (node: HTMLImageElement) => node.complete && node.naturalWidth > 0,
          ),
        )
        .toBe(true);
      expect(
        await img.evaluate(
          (node: HTMLImageElement) =>
            node.naturalWidth === Number(node.getAttribute("width")) &&
            node.naturalHeight === Number(node.getAttribute("height")),
        ),
      ).toBe(true);
    }
    const downloadEvent = page.waitForEvent("download");
    await downloads.first().click();
    expect((await downloadEvent).suggestedFilename()).toBe(
      `denny-games-${locale}-728x90.png`,
    );
    await page.locator(".banner-card details summary").first().click();
    await expect(page.locator("textarea").first()).toHaveValue(
      new RegExp(`https://games.iamdenny.com/${locale}/`),
    );
    await page.screenshot({
      path: `test-results/promo-${locale}-desktop.png`,
      fullPage: true,
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: `test-results/promo-${locale}-mobile.png`,
      fullPage: true,
    });
  });
}
