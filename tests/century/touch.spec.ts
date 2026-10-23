import { test, expect } from "@playwright/test";
import crisp from "../../src/data/century-crisp.json" with { type: "json" };
import { agenticGames } from "../../src/data/agentic-games";
for (const game of [...crisp, ...agenticGames]) {
  test(`${game.id}: touch smoke and phone, tablet, wide containment`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(() => {
      if (window === window.top)
        localStorage.setItem("denny-games.analytics-consent", "denied");
    });
    await page.goto(`/ko/play/${game.id}/`);
    await page.locator("#start-button").tap();
    const frame = page.frameLocator("iframe.crisp-frame");
    const canvas = frame.locator("canvas").first();
    await expect(canvas).toBeVisible();
    await canvas.tap({ position: { x: 30, y: 30 } });
    await expect
      .poll(async () =>
        Number(await frame.locator("body").getAttribute("data-ticks")),
      )
      .toBeGreaterThan(2);
    if (await page.locator("#pause-button").isEnabled())
      await page.locator("#pause-button").tap();
    const ticks = await frame.locator("body").getAttribute("data-ticks");
    await page.waitForTimeout(80);
    await expect(frame.locator("body")).toHaveAttribute("data-ticks", ticks!);
    for (const size of [
      { width: 320, height: 640 },
      { width: 834, height: 1194 },
      { width: 1280, height: 800 },
      { width: 740, height: 360 },
    ]) {
      await page.setViewportSize(size);
      await expect
        .poll(async () => {
          const host = await page.locator("#game-host").boundingBox();
          const rect = await page.locator("iframe.crisp-frame").boundingBox();
          if (!host || !rect) return false;
          const inner = await canvas.boundingBox();
          return (
            !!inner &&
            rect.width > 40 &&
            rect.height > 40 &&
            rect.x >= host.x - 2 &&
            rect.y >= host.y - 2 &&
            rect.x + rect.width <= host.x + host.width + 2 &&
            rect.y + rect.height <= host.y + host.height + 2 &&
            inner.x >= rect.x - 2 &&
            inner.y >= rect.y - 2 &&
            inner.x + inner.width <= rect.x + rect.width + 2 &&
            inner.y + inner.height <= rect.y + rect.height + 2 &&
            rect.y + rect.height <= size.height + 2
          );
        })
        .toBe(true);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      for (const control of await page
        .locator(
          "#pause-button,#restart-button,#sound-button,#game-controls button",
        )
        .all()) {
        if (!(await control.isVisible())) continue;
        const rect = (await control.boundingBox())!;
        expect(rect.width).toBeGreaterThanOrEqual(47);
        expect(rect.height).toBeGreaterThanOrEqual(47);
        expect(rect.x).toBeGreaterThanOrEqual(-1);
        expect(rect.y).toBeGreaterThanOrEqual(-1);
        expect(rect.x + rect.width).toBeLessThanOrEqual(size.width + 1);
        expect(rect.y + rect.height).toBeLessThanOrEqual(size.height + 1);
      }
    }
    expect(errors).toEqual([]);
  });
}
