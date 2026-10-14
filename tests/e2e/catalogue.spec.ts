import { test, expect } from "@playwright/test";
import { games } from "../../src/data/games";
import { editorialOrder } from "../../src/data/editorial";
const gameIds = editorialOrder(games.map((game) => ({ id: game.id }))).map(
  (game) => game.id,
);
import { PAGE_SIZE } from "../../src/lib/catalogue";

for (const locale of ["en", "ko"] as const) {
  test(`${locale}: every published game is reachable through static next links without JavaScript`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    await page.goto(`/${locale}/`);
    await page.locator(".compact-menu summary").click();
    await page.locator('.compact-menu a[href$="/all/"]').click();
    const seen: string[] = [];
    const total = Math.ceil(gameIds.length / PAGE_SIZE);
    for (let n = 1; n <= total; n++) {
      await expect(page).toHaveURL(
        new RegExp(`/${locale}/all/${n > 1 ? `page/${n}/` : ""}$`),
      );
      const cards = page.locator("[data-all-games] [data-game-card]");
      const ids = await cards.evaluateAll((elements) =>
        elements.map((element) => element.getAttribute("data-game-card")!),
      );
      expect(ids).toEqual(gameIds.slice((n - 1) * PAGE_SIZE, n * PAGE_SIZE));
      seen.push(...ids);
      await expect(
        page.locator('[data-catalogue-pages="top"] [aria-current="page"]'),
      ).toHaveText(String(n));
      await expect(page.locator("[data-catalogue-range]")).toContainText(
        String(gameIds.length),
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      if (n < total)
        await page
          .locator('[data-catalogue-pages="top"] a[rel="next"]')
          .click();
    }
    expect(new Set(seen).size).toBe(gameIds.length);
    await page.locator("[data-all-games] [data-game-card] a").last().click();
    await expect(page).toHaveURL(new RegExp(`/games/${gameIds.at(-1)!}/$`));
    await context.close();
  });
}

test("complete catalogue remains visible at narrow and desktop widths, and locale links keep the page", async ({
  page,
}) => {
  for (const width of [320, 360, 430, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/ko/all/page/2/");
    await expect(page.locator("[data-all-games] [data-game-card]")).toHaveCount(
      24,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.locator('[data-locale-link][lang="en"]').click();
  await expect(page).toHaveURL(/\/en\/all\/page\/2\/$/);
  await expect(page.locator("[data-catalogue-range]")).toContainText("25–48");
  await page.locator('[data-catalogue-pages="bottom"] a[rel="prev"]').click();
  await expect(page).toHaveURL(/\/en\/all\/$/);
});
