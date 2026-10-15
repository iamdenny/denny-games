import { test, expect } from "@playwright/test";
import { games } from "../../src/data/games";

const externalGames = games.flatMap((game) =>
  game.externalPlay ? [{ id: game.id, url: game.externalPlay.url }] : [],
);

for (const locale of ["en", "ko"]) {
  for (const game of externalGames) {
    test(`${locale} ${game.id}: explains and safely opens the external host`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 320, height: 800 });
      await page.goto(`/${locale}/games/${game.id}/`);

      const launch = page.locator(".detail-actions a.button.primary");
      await expect(launch).toHaveAttribute("href", game.url);
      await expect(launch).toHaveAttribute("target", "_blank");
      await expect(launch).toHaveAttribute("rel", "noopener noreferrer");
      await expect(page.locator(".external-host-note")).toBeVisible();
      await expect(page.locator(".prose")).toContainText(
        locale === "ko" ? "검증하지 않았습니다" : "has not verified",
      );
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        "content",
        /\.png$/,
      );
      await expect(
        page.locator(`.detail-actions a[href="/${locale}/play/${game.id}/"]`),
      ).toHaveCount(0);
    });
  }
}

for (const locale of ["en", "ko"]) {
  test(`${locale}: external game details fit phone and iPad viewports`, async ({
    page,
  }) => {
    const viewports: [number, number][] = [
      [320, 800],
      [390, 844],
      [834, 1194],
      [1194, 834],
    ];
    for (const [width, height] of viewports) {
      await page.setViewportSize({ width, height });
      await page.goto(`/${locale}/games/sheepdog-sim/`);
      await expect(
        page.locator(".detail-actions a.button.primary"),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    }
  });
}
