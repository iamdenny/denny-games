import { test, expect } from "@playwright/test";
import { adsterra } from "../../src/data/adsterra";
const key = "denny-games.adsterra-consent.v1";
test.describe("Adsterra banner", () => {
  test.skip(
    !adsterra.filtersConfirmed,
    "Provider filter confirmation pending; no banner is emitted",
  );
  for (const locale of ["ko", "en"])
    for (const width of [320, 390, 1440]) {
      test(`${locale} ${width}: opt-in, withdrawal, and no overflow`, async ({
        page,
      }, testInfo) => {
        await page.setViewportSize({ width, height: 900 });
        let requests = 0;
        await page.route("https://bauval.org/**", (route) => {
          requests++;
          return route.fulfill({
            contentType: "application/javascript",
            body: "document.body.append('Test advertisement');",
          });
        });
        await page.goto(`/${locale}/games/2048/`);
        const banner = page.locator("[data-adsterra]");
        await expect(banner).toBeVisible();
        expect(requests).toBe(0);
        await banner.locator("[data-adsterra-deny]").click();
        expect(requests).toBe(0);
        await banner.locator("[data-adsterra-allow]").click();
        await expect.poll(() => requests).toBe(1);
        await expect(
          page.frameLocator("[data-adsterra] iframe").locator("body"),
        ).toHaveText("Test advertisement");
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        expect(
          await page.evaluate(() =>
            localStorage.getItem("denny-games.analytics-consent"),
          ),
        ).toBe("denied");
        await banner.locator("[data-adsterra-revoke]").click();
        await expect(banner.locator("iframe")).toHaveCount(0);
        await page.reload();
        await expect(banner.locator("iframe")).toHaveCount(0);
        expect(requests).toBe(1);
        await banner.screenshot({
          path: testInfo.outputPath(`adsterra-${locale}-${width}.png`),
        });
      });
    }
  test("withdrawal propagates across tabs and gameplay never embeds ads", async ({
    page,
    context,
  }) => {
    await context.route("https://bauval.org/**", (route) =>
      route.fulfill({ contentType: "application/javascript", body: "" }),
    );
    await page.goto("/ko/");
    await page.locator("[data-adsterra-allow]").click();
    const other = await context.newPage();
    await other.goto("/en/games/2048/");
    await expect(other.locator("[data-adsterra] iframe")).toHaveCount(1);
    await page.locator("[data-adsterra-revoke]").click();
    await expect(other.locator("[data-adsterra] iframe")).toHaveCount(0);
    await page.evaluate((k) => localStorage.setItem(k, "allowed"), key);
    await page.goto("/ko/play/2048/");
    await expect(page.locator("[data-adsterra]")).toHaveCount(0);
  });
  test("storage failures keep an in-page choice usable", async ({ page }) => {
    await page.route("https://bauval.org/**", (route) =>
      route.fulfill({ contentType: "application/javascript", body: "" }),
    );
    await page.addInitScript(() => {
      Storage.prototype.getItem = () => {
        throw new Error("blocked");
      };
      Storage.prototype.setItem = () => {
        throw new Error("blocked");
      };
    });
    await page.goto("/en/");
    await page.locator("[data-adsterra-allow]").click();
    await expect(page.locator("[data-adsterra] iframe")).toHaveCount(1);
    await page.locator("[data-adsterra-revoke]").click();
    await expect(page.locator("[data-adsterra] iframe")).toHaveCount(0);
  });
});
