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
  for (const locale of ["ko", "en"])
    for (const width of [320, 768, 1440]) {
      test(`${locale} ${width}: long collection ad follows eight games without overflow`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 900 });
        let requests = 0;
        await page.route("https://bauval.org/**", (route) => {
          requests++;
          return route.fulfill({
            contentType: "application/javascript",
            body: "",
          });
        });
        await page.goto(`/${locale}/collections/arcade-century/`);
        const banner = page.locator("[data-adsterra]");
        await expect(banner).toBeVisible();
        await expect(banner.locator("[data-adsterra-choice]")).toBeVisible();
        await expect(banner.locator("iframe")).toHaveCount(0);
        expect(await page.locator("[data-adsterra]").count()).toBe(1);
        expect(
          await banner.evaluate((element) => {
            let cardsBefore = 0;
            for (
              let sibling = element.previousElementSibling;
              sibling;
              sibling = sibling.previousElementSibling
            )
              if (sibling.matches("[data-game-card]")) cardsBefore++;
            return cardsBefore;
          }),
        ).toBe(8);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        expect(requests).toBe(0);
      });
    }
  test("withdrawal propagates across tabs and player ads stay outside the game", async ({
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
    await expect(page.locator("#player [data-adsterra]")).toHaveCount(0);
    await expect(
      page.locator(".player-promotions [data-adsterra] iframe"),
    ).toHaveCount(1);
  });
  test("pre-consented sparse category results keep the banner and request hidden", async ({
    page,
  }) => {
    let requests = 0;
    await page.route("https://bauval.org/**", (route) => {
      requests++;
      return route.fulfill({
        contentType: "application/javascript",
        body: "document.body.append('Test advertisement');",
      });
    });
    await page.addInitScript(
      ({ storageKey }) => localStorage.setItem(storageKey, "allowed"),
      { storageKey: key },
    );
    await page.goto("/en/category/sports/?input=mouse");
    const banner = page.locator("[data-adsterra-category]");
    await expect(banner).toBeHidden();
    await expect(
      page.locator('.game-grid [data-game-card="pocket-pingpong"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('.game-grid [data-game-card="pocket-bowling"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('.game-grid [data-game-card="neverball"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('.game-grid [data-game-card="neverputt"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('.game-grid [data-game-card="jegi-rally"]'),
    ).toHaveCount(1);
    await expect(page.locator(".game-grid .game-card")).toHaveCount(5);
    expect(requests).toBe(0);
    await expect(banner.locator("iframe")).toHaveCount(0);
  });
  test("a sparse category filter removes an already-loaded banner", async ({
    page,
  }) => {
    let requests = 0;
    await page.route("https://bauval.org/**", (route) => {
      requests++;
      return route.fulfill({ contentType: "application/javascript", body: "" });
    });
    await page.addInitScript(
      ({ storageKey }) => localStorage.setItem(storageKey, "allowed"),
      { storageKey: key },
    );
    await page.goto("/en/category/sports/");
    const banner = page.locator("[data-adsterra-category]");
    await expect(banner).toBeVisible();
    await expect(banner.locator("iframe")).toHaveCount(1);
    await page.locator("[data-input-filter]").selectOption("mouse");
    await expect(
      page.locator('.game-grid [data-game-card="pocket-pingpong"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('.game-grid [data-game-card="pocket-bowling"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('.game-grid [data-game-card="neverball"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('.game-grid [data-game-card="neverputt"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('.game-grid [data-game-card="jegi-rally"]'),
    ).toHaveCount(1);
    await expect(page.locator(".game-grid .game-card")).toHaveCount(5);
    await expect(banner).toBeHidden();
    await expect(banner.locator("iframe")).toHaveCount(0);
    expect(requests).toBe(1);
  });
  test("catalogue errors hide category ads and stop the existing frame", async ({
    page,
  }) => {
    await page.route("https://bauval.org/**", (route) =>
      route.fulfill({ contentType: "application/javascript", body: "" }),
    );
    await page.route("**/search-index.json", (route) => route.abort());
    await page.addInitScript(
      ({ storageKey }) => localStorage.setItem(storageKey, "allowed"),
      { storageKey: key },
    );
    await page.goto("/en/category/arcade/");
    const banner = page.locator("[data-adsterra-category]");
    await expect(banner).toBeVisible();
    await expect(banner.locator("iframe")).toHaveCount(1);
    await page.locator("[data-input-filter]").selectOption("mouse");
    await expect(page.locator(".game-grid")).toContainText(
      "Could not load games",
    );
    await expect(banner).toBeHidden();
    await expect(banner.locator("iframe")).toHaveCount(0);
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
