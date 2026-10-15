import { test, expect } from "@playwright/test";
import { setBoardMode } from "./helpers/board-settings";

for (const locale of ["en", "ko"]) {
  test(`${locale}: compact navigation preserves menu access without JavaScript`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    for (const width of [320, 390, 780, 800, 960, 1100]) {
      await page.setViewportSize({ width, height: 600 });
      await page.goto(`/${locale}/`);
      const header = await page.locator(".site-header").boundingBox();
      expect(header!.height).toBeLessThanOrEqual(66);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
      const menu = page.locator(".compact-menu");
      await expect(menu.locator("nav")).not.toBeVisible();
      if (width >= 780) {
        const thumbnail = await page
          .locator("[data-quick-art-link]")
          .first()
          .boundingBox();
        expect(thumbnail!.y).toBeLessThan(250);
      }
      await menu.locator("summary").click();
      await expect(menu.locator('a[href$="/category/board/"]')).toBeVisible();
      await expect(menu.locator('a[href$="/daily/"]')).toBeVisible();
      await expect(menu.locator('a[href$="/library/"]')).toBeVisible();
      await menu.locator('a[href$="/all/"]').click();
      await expect(page).toHaveURL(`/${locale}/all/`);
    }
    await context.close();
  });

  test(`${locale}: compact menu closes with Escape and restores focus`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    await page.goto(`/${locale}/`);
    const summary = page.locator(".compact-menu summary");
    await summary.click();
    await page.locator('.compact-menu a[href$="/daily/"]').focus();
    await page.keyboard.press("Escape");
    await expect(page.locator(".compact-menu")).not.toHaveAttribute("open");
    await expect(summary).toBeFocused();
    await page.locator("[data-large]").click();
    expect((await summary.boundingBox())!.height).toBeGreaterThanOrEqual(56);
    expect(
      (await page.locator(".site-header").boundingBox())!.height,
    ).toBeLessThanOrEqual(66);
  });

  test(`${locale}: classic board uses the full stage with reachable side controls`, async ({
    page,
  }) => {
    for (const viewport of [
      { width: 800, height: 600 },
      { width: 960, height: 640 },
      { width: 667, height: 375 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto(`/${locale}/play/gomoku/?seed=compact-${viewport.width}`);
      await page.locator("#start-button").click();
      await setBoardMode(page, "local");
      const area = await page.locator(".play-area").boundingBox();
      const board = await page.locator(".classic-board").boundingBox();
      expect(board!.width).toBeGreaterThan(
        Math.min(area!.width, area!.height) - 24,
      );
      expect(board!.y).toBeGreaterThanOrEqual(area!.y);
      expect(board!.y + board!.height).toBeLessThanOrEqual(
        area!.y + area!.height,
      );
      const tools = await page.locator(".player-tools").boundingBox();
      expect(tools!.x).toBeGreaterThanOrEqual(board!.x + board!.width);
      for (const selector of [
        "#pause-button",
        "#restart-button",
        "#sound-button",
        "#player-settings summary",
        "[data-board-confirm]",
      ]) {
        const control = await page.locator(selector).boundingBox();
        expect(control!.y).toBeGreaterThanOrEqual(0);
        expect(control!.y + control!.height).toBeLessThanOrEqual(
          viewport.height,
        );
      }
      await expect(page.locator(".board-directions")).not.toBeVisible();
      await page.locator('[data-cell="112"]').click();
      await page.locator("[data-board-confirm]").click();
      await expect(page.locator(".classic-game")).toHaveAttribute(
        "data-moves",
        "1",
      );
      await page.locator("#pause-button").click();
      await expect(page.locator("#game-overlay")).toBeVisible();
      await page.locator("#start-button").click();
      await expect(page.locator(".classic-game")).toHaveAttribute(
        "data-moves",
        "1",
      );
      await page.locator("#player-settings summary").click();
      await expect(page.locator(".board-directions button")).toHaveCount(4);
      await expect(
        page.locator(".board-directions button").first(),
      ).toBeVisible();
      await page.locator("#player-settings summary").click();
      if (viewport.width === 800)
        await page.screenshot({
          path: test.info().outputPath(`board-side-rail-${locale}.png`),
        });
    }
  });
}
