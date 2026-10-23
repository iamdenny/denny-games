import { test, expect } from "@playwright/test";
import { create, GOAL } from "../../src/games/star-pinball/rules";
const key = "denny-games:v1:progress:star-pinball:v1:star-pinball:v1:normal:1";
for (const locale of ["en", "ko"])
  test(`pinball launch held flipper pause and restore ${locale}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${locale}/play/star-pinball/`);
    await page.locator("#start-button").click();
    const canvas = page.locator('canvas[data-game="star-pinball"]');
    await canvas.focus();
    await page.keyboard.down("ArrowLeft");
    await expect(canvas).toHaveAttribute("data-left", "1.00");
    await page.keyboard.up("ArrowLeft");
    await page.keyboard.press("Space");
    await expect(canvas).toHaveAttribute("data-phase", "playing");
    await expect
      .poll(async () => Number(await canvas.getAttribute("data-score")))
      .toBeGreaterThan(0);
    await page.locator("#pause-button").click();
    const time = await canvas.getAttribute("data-time");
    await page.waitForTimeout(200);
    await expect(canvas).toHaveAttribute("data-time", time!);
    await page.reload();
    await expect(canvas).toHaveAttribute("data-time", time!);
    await page.locator("#start-button").click();
    await expect(canvas).toHaveAttribute("data-left", "0.00");
  });
for (const width of [320, 390, 1440])
  test(`pinball reduced motion controls fit ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 740 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/ko/play/star-pinball/");
    await page.locator("#start-button").click();
    for (const b of await page
      .locator("[data-pinball-controls] button")
      .all()) {
      const box = await b.boundingBox();
      expect(box!.width).toBeGreaterThanOrEqual(48);
      expect(box!.height).toBeGreaterThanOrEqual(48);
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
      expect(box!.y + box!.height).toBeLessThanOrEqual(
        width === 1440 ? 901 : 741,
      );
    }
    await page.getByRole("button", { name: "발사", exact: true }).click();
    await expect(
      page.locator('canvas[data-game="star-pinball"]'),
    ).toHaveAttribute("data-phase", "playing");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
test("pinball final drain wins once and restart clears the round", async ({
  page,
}) => {
  const s = create();
  s.number = 3;
  s.phase = "playing";
  s.score = GOAL;
  s.ball = { x: 200, y: 625, vx: 0, vy: 200 };
  await page.addInitScript(
    ({ s, key }) => localStorage.setItem(key, JSON.stringify(s)),
    { s, key },
  );
  await page.goto("/en/play/star-pinball/");
  await page.locator("#start-button").click();
  const canvas = page.locator('canvas[data-game="star-pinball"]');
  await expect(canvas).toHaveAttribute("data-phase", "won");
  await page.locator("#restart-button").click();
  await expect(canvas).toHaveAttribute("data-phase", "ready");
  await expect(canvas).toHaveAttribute("data-score", "0");
  await expect(canvas).toHaveAttribute("data-ball", "1");
});
test("pinball terminal restore stays still", async ({ page }) => {
  const s = create();
  s.number = 3;
  s.phase = "lost";
  s.time = 100;
  s.ball = { x: 200, y: 630, vx: 0, vy: 0 };
  await page.addInitScript(
    ({ s, key }) => localStorage.setItem(key, JSON.stringify(s)),
    { s, key },
  );
  await page.goto("/en/play/star-pinball/");
  await page.locator("#start-button").click();
  const canvas = page.locator('canvas[data-game="star-pinball"]');
  await expect(canvas).toHaveAttribute("data-phase", "lost");
  await page.waitForTimeout(200);
  await expect(canvas).toHaveAttribute("data-time", "100.00");
});
test("pinball button hold releases when focus moves before keyup", async ({
  page,
}) => {
  await page.goto("/en/play/star-pinball/");
  await page.locator("#start-button").click();
  const canvas = page.locator('canvas[data-game="star-pinball"]');
  const left = page.getByRole("button", { name: "Left flipper", exact: true });
  await left.focus();
  await page.keyboard.down("Space");
  await expect(canvas).toHaveAttribute("data-left", "1.00");
  await page.keyboard.press("Tab");
  await expect(left).not.toBeFocused();
  await page.keyboard.up("Space");
  await expect(canvas).toHaveAttribute("data-left", "0.00");
});
