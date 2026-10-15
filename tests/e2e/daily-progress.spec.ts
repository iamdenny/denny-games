import { test, expect } from "@playwright/test";
const now = new Date("2026-10-15T06:00:00Z");
for (const locale of ["en", "ko"]) {
  test(`${locale}: actual daily completion persists and leads to the next challenge`, async ({
    page,
  }) => {
    await page.clock.setFixedTime(now);
    await page.addInitScript(() =>
      localStorage.setItem("denny-games:v1:stage:circuit-loop", "5"),
    );
    await page.goto(`/${locale}/daily/`);
    await expect(page.locator("[data-daily-progress]")).toContainText("0 / 3");
    await page.locator('[data-daily="circuit-loop"]').click();
    await expect(page.locator("#stage-select")).toHaveValue("1");
    // Old daily links without a stage must also ignore saved stage preferences.
    await page.goto(`/${locale}/play/circuit-loop/?daily=1`);
    await expect(page.locator("#stage-select")).toHaveValue("1");
    await page.locator("#start-button").click();
    await page.locator("#pause-button").click();
    expect(
      await page.evaluate(() =>
        localStorage.getItem("denny-games:v1:daily-rounds"),
      ),
    ).toBeNull();
    await page.locator("#start-button").click();
    for (let i = 0; i < 36; i++) {
      if (await page.locator("#game-overlay").isVisible()) break;
      await page.locator(".game-hint").click();
    }
    await expect(page.locator("#daily-result")).toContainText("1 / 3");
    await expect(page.locator("#next-game")).toHaveAttribute(
      "href",
      `/${locale}/play/orbit-break/?daily=1&stage=1`,
    );
    await page.goto(`/${locale}/daily/`);
    await expect(page.locator("[data-daily-progress]")).toContainText("1 / 3");
    await expect(
      page.locator('[data-daily-card="circuit-loop"]'),
    ).toHaveAttribute("data-complete", "true");
    await page.reload();
    await expect(page.locator("[data-daily-progress]")).toContainText("1 / 3");
    await page.goto(`/${locale}/`);
    await expect(page.locator("[data-daily-progress]")).toContainText("1 / 3");
    await page.clock.setFixedTime(new Date("2026-10-16T00:01:00Z"));
    await page.evaluate(() => window.dispatchEvent(new Event("pageshow")));
    await expect(page.locator("[data-daily-progress]")).toContainText("0 / 3");
  });
}

test("daily progress rejects corrupt, old-version and old-date records", async ({
  page,
}) => {
  await page.clock.setFixedTime(now);
  await page.addInitScript(() =>
    localStorage.setItem(
      "denny-games:v1:daily-rounds",
      JSON.stringify({
        date: "2026-10-15",
        results: {
          "circuit-loop": { version: 2, score: 10 },
          "orbit-break": { version: 1, score: -1 },
          "2048": { version: 1, score: 0 },
          unknown: { version: 1, score: 999 },
        },
      }),
    ),
  );
  await page.goto("/en/daily/");
  await expect(page.locator("[data-daily-progress]")).toContainText("1 / 3");
  await expect(page.locator('[data-daily-card="2048"]')).toHaveAttribute(
    "data-complete",
    "true",
  );
  await expect(page.locator("[data-daily-record]").last()).toContainText("0");
});

for (const width of [320, 834, 1194]) {
  test(`daily cards and actions fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 834 });
    await page.goto("/ko/daily/");
    await expect(page.locator("[data-daily-progress]")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    for (const link of await page.locator("[data-daily]").all()) {
      const rect = await link.boundingBox();
      expect(rect!.height).toBeGreaterThanOrEqual(48);
      expect(rect!.x).toBeGreaterThanOrEqual(0);
      expect(rect!.x + rect!.width).toBeLessThanOrEqual(width + 1);
    }
  });
}

test("static daily links work without JavaScript and denied storage stays usable", async ({
  browser,
  page,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context.newPage();
  await staticPage.goto("/en/daily/");
  await expect(staticPage.locator("[data-daily]")).toHaveCount(3);
  await staticPage.locator('[data-daily="2048"]').click();
  await expect(staticPage).toHaveURL(/\/en\/play\/2048\/\?daily=1&stage=1/);
  await context.close();
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new DOMException("denied");
    };
    Storage.prototype.setItem = () => {
      throw new DOMException("denied");
    };
  });
  await page.goto("/ko/daily/");
  await expect(page.locator("[data-daily-progress]")).toContainText("0 / 3");
  await page.locator('[data-daily="2048"]').click();
  await page.locator("#start-button").click();
  await expect(page.locator("#game-overlay")).toBeHidden();
});
