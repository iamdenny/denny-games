import { test, expect } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 667, height: 375 },
]) {
  for (const locale of ["en", "ko"] as const) {
    for (const choice of ["deny", "allow"] as const) {
      test(`${locale} ${viewport.width}: direct game entry can ${choice} analytics`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport);
        await page.route("https://www.googletagmanager.com/**", (route) =>
          route.abort(),
        );
        await page.route("https://*.google-analytics.com/**", (route) =>
          route.abort(),
        );
        await page.goto(`/${locale}/play/amber-trail/`);
        const panel = page.locator("[data-analytics-consent]");
        await expect(panel).toBeVisible();
        await expect(page.locator("#player")).toHaveAttribute(
          "data-immersive",
          "true",
        );
        await page
          .locator(`[data-analytics-${choice}]`)
          .click({ timeout: 5000 });
        await expect(panel).toBeHidden();
        expect(
          await page.evaluate(() =>
            localStorage.getItem("denny-games.analytics-consent"),
          ),
        ).toBe(choice === "allow" ? "granted" : "denied");
        await page.locator("#start-button").click();
        await expect(page.locator("#game-overlay")).toBeHidden();
        await page.locator("#pause-button").click();
        await expect(page.locator("#game-overlay")).toBeVisible();
      });
    }
  }
}

for (const width of [320, 390, 667, 1440]) {
  test(`undecided visitor can play at ${width}`, async ({ page }) => {
    await page.setViewportSize({
      width,
      height: width === 667 ? 375 : width === 320 ? 568 : 900,
    });
    await page.goto("/ko/play/amber-trail/");
    await expect(page.locator("[data-analytics-consent]")).toBeVisible();
    await page.locator("#start-button").click();
    await page.locator("#pause-button").click();
    await expect(page.locator("#game-overlay")).toBeVisible();
    expect(
      await page.evaluate(() =>
        localStorage.getItem("denny-games.analytics-consent"),
      ),
    ).toBeNull();
    await expect(
      page.locator('script[src*="googletagmanager.com/gtag/js"]'),
    ).toHaveCount(0);
  });
}
