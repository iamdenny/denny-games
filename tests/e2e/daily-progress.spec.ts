import { test, expect } from "@playwright/test";
import { dailySeed } from "../../src/lib/random";
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
    await expect(page.locator("[data-daily-board]")).toContainText(
      locale === "ko" ? "최근 7일 완료 기록" : "seven-day completion history",
    );
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
    await expect(page.locator("#next-stage")).toBeHidden();
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
    await expect(page.locator('[data-history-day="2026-10-15"]')).toContainText(
      "1/3",
    );
    await expect(page.locator('[data-history-day="2026-10-16"]')).toContainText(
      "0/3",
    );
    await expect(page.locator("[data-daily-history-summary]")).toContainText(
      "1 / 21",
    );
  });
}

for (const locale of ["en", "ko"]) {
  test(`${locale}: a shared daily seed keeps daily results when the daily flag is absent`, async ({
    page,
  }) => {
    await page.clock.setFixedTime(now);
    await page.goto(
      `/${locale}/play/circuit-loop/?seed=${dailySeed("circuit-loop", now)}&stage=1`,
    );
    await page.locator("#start-button").click();
    for (let i = 0; i < 36; i++) {
      if (await page.locator("#game-overlay").isVisible()) break;
      await page.locator(".game-hint").click();
    }
    await expect(page.locator("#daily-result")).toBeVisible();
    await expect(page.locator("#next-stage")).toBeHidden();
    await expect(page.locator("#next-game")).toHaveAttribute(
      "href",
      `/${locale}/play/orbit-break/?daily=1&stage=1`,
    );
  });
}

for (const locale of ["en", "ko"]) {
  test(`${locale}: a daily challenge can be shared as a direct play invitation`, async ({
    page,
  }) => {
    await page.clock.setFixedTime(new Date("2026-10-18T08:59:00Z"));
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "share", {
        configurable: true,
        value: async (data: ShareData) => {
          (window as unknown as { shared: ShareData }).shared = data;
        },
      });
    });
    await page.goto(`/${locale}/daily/`);
    const card = page.locator('[data-daily-card="circuit-loop"]');
    const shareButton = card.locator("[data-share-button]");
    await expect(shareButton).toHaveText(
      locale === "ko" ? "친구에게 도전 보내기 ↗" : "Challenge a friend ↗",
    );
    await shareButton.click();
    const shared = await page.evaluate(
      () => (window as unknown as { shared: ShareData }).shared,
    );
    expect(shared.title).toMatch(
      locale === "ko"
        ? /오늘의 도전 · 데니 게임즈$/
        : /daily challenge · Denny Games$/,
    );
    expect(shared.url).toBe(
      `https://games.iamdenny.com/${locale}/play/circuit-loop/?daily=1&stage=1`,
    );
    const localLaunch = new URL(shared.url!);
    await page.goto(localLaunch.pathname + localLaunch.search);
    await expect(page.locator("#stage-select")).toHaveValue("1");
    await expect(page.locator('[data-id="circuit-loop"]')).toBeVisible();
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
    await expect(page.locator("[data-history-day]")).toHaveCount(7);
    const firstHistoryDay = page.locator("[data-history-day]").first();
    expect(
      await firstHistoryDay
        .locator("time")
        .evaluate((node) => getComputedStyle(node).display),
    ).toBe("block");
    expect(
      await firstHistoryDay
        .locator(".history-count")
        .evaluate((node) => getComputedStyle(node).display),
    ).toBe("block");
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
    for (const button of await page
      .locator("[data-daily-card] [data-share-button]")
      .all()) {
      const rect = await button.boundingBox();
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
  await expect(
    staticPage.locator('[data-daily-card="2048"] [data-share-button]'),
  ).toBeHidden();
  await expect(
    staticPage.locator('[data-daily-card="2048"] [data-share-url]'),
  ).toHaveValue("https://games.iamdenny.com/en/play/2048/?daily=1&stage=1");
  const shareFallback = staticPage.locator(
    '[data-daily-card="2048"] [data-share-fallback] summary',
  );
  expect((await shareFallback.boundingBox())!.height).toBeGreaterThanOrEqual(
    48,
  );
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
