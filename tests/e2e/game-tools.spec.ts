import { test, expect } from "@playwright/test";

for (const locale of ["en", "ko"])
  for (const id of ["circuit-loop", "orbit-break", "2048"]) {
    test(`${locale} ${id}: primary actions, optional directions and remount cleanup`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await page.goto(`/${locale}/play/${id}/?seed=game-tools`);
      await page.locator("#start-button").click();
      await expect(page.locator("#player")).toHaveAttribute(
        "data-controls-layout",
        "side",
      );
      if (id === "2048") {
        await expect(page.locator(".direction-controls")).not.toBeVisible();
        await page.locator("#player-settings summary").click();
        await expect(
          page.locator("#game-settings .direction-controls button"),
        ).toHaveCount(4);
        await page.locator(".direction-controls button").first().click();
        await page.locator("#player-settings summary").click();
      } else {
        await expect(page.locator("#game-controls .game-actions")).toHaveCount(
          1,
        );
        const action = page.locator(
          id === "circuit-loop" ? ".game-hint" : ".launch-button",
        );
        await expect(action).toBeEnabled();
        await action.click();
        if (id === "orbit-break") await expect(action).toBeDisabled();
        else
          await expect(page.locator(".board-note")).toContainText(
            locale === "ko" ? "힌트" : "Hint",
          );
      }
      await page.locator("#pause-button").click();
      await expect(page.locator("#game-overlay")).toBeVisible();
      await page.locator("#start-button").click();
      await page.locator("#player-settings summary").click();
      await page.locator("#stage-select").selectOption("1");
      if (id === "2048")
        await expect(
          page.locator("#game-settings .direction-controls"),
        ).toHaveCount(1);
      else
        await expect(page.locator("#game-controls .game-actions")).toHaveCount(
          1,
        );
      await page.locator("#player-settings summary").click();
      await page.locator("#start-button").click();
      await page.setViewportSize({ width: 600, height: 900 });
      await expect(page.locator("#player")).toHaveAttribute(
        "data-controls-layout",
        "bottom",
      );
      expect(
        await page.locator(".play-area").evaluate((el) => el.scrollTop),
      ).toBe(0);
    });
  }
