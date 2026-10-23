import { expect, test } from "@playwright/test";
const ids = [
  "ember-maze",
  "frost-patrol",
  "crater-duel",
  "iron-bastion",
  "prism-pop",
  "bubble-harbor",
  "starfall-wing",
  "vault-runner",
];
for (const id of ids) {
  test(`${id}: responsive controls, pause, reload and bilingual entry`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/ko/play/${id}/?seed=retro-layout`);
    await page.locator("#start-button").click();
    const canvas = page.locator("#game-host canvas").first();
    await expect(canvas).toBeVisible();
    await canvas.focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Space");
    await page.locator("#pause-button").click();
    for (const width of [320, 360, 390, 430, 1440]) {
      await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
        )
        .toBe(true);
      const buttons = page.locator("[data-retro-action]");
      expect(await buttons.count()).toBeGreaterThan(0);
      for (const button of await buttons.all()) {
        await button.scrollIntoViewIfNeeded();
        const bounds = await button.boundingBox();
        expect(bounds).not.toBeNull();
        expect(bounds!.width).toBeGreaterThanOrEqual(44);
        expect(bounds!.height).toBeGreaterThanOrEqual(44);
        expect(bounds!.x).toBeGreaterThanOrEqual(0);
        expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
        await expect(button).toBeInViewport();
      }
      const rect = await canvas.boundingBox();
      expect(rect?.width).toBeGreaterThan(80);
      expect(rect?.height).toBeGreaterThan(80);
    }
    await page.locator("#start-button").click();
    await page.locator("#pause-button").click();
    await page.reload();
    await expect(page.locator("#start-button")).toBeEnabled();
    await page.locator("#start-button").click();
    await expect(canvas).toBeVisible();
    await page.goto(`/en/play/${id}/?seed=retro-layout`);
    await page.locator("#start-button").click();
    await expect(canvas).toBeVisible();
    expect(errors).toEqual([]);
  });
}
