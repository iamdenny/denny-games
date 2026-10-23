import { test, expect } from "@playwright/test";
import { fresh } from "../../src/games/jewel-drop/engine";
const key = "denny-games:v1:progress:jewel-drop:v1:jewel-drop:v1:normal:1";
for (const locale of ["en", "ko"])
  test(`Jewel Drop rotates, falls, pauses and restores ${locale}`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/play/jewel-drop/`);
    await page.locator("#start-button").click();
    const root = page.locator(".jewel-drop");
    await page.locator(".jewel-board").focus();
    await page.keyboard.press("ArrowLeft");
    await expect(root).toHaveAttribute("data-x", "1");
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("Space");
    await expect(root).toHaveAttribute("data-pieces", "1");
    await page.locator("#pause-button").click();
    const y = await root.getAttribute("data-y");
    await page.waitForTimeout(1100);
    await expect(root).toHaveAttribute("data-y", y!);
    await page.reload();
    await page.locator("#start-button").click();
    await expect(root).toHaveAttribute("data-pieces", "1");
    await page.locator("[data-jewel-action=right]").click();
    await expect(root).toHaveAttribute("data-x", "3");
  });
for (const width of [320, 390, 1440])
  test(`Jewel Drop ${width}px native controls fit`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 740 });
    await page.goto("/ko/play/jewel-drop/");
    await page.locator("#start-button").click();
    const root = page.locator(".jewel-drop");
    const bounds = await root.boundingBox();
    expect(await root.evaluate((e) => e.scrollWidth <= e.clientWidth + 1)).toBe(
      true,
    );
    for (const b of await root.locator("button").all()) {
      const r = await b.boundingBox();
      expect(r!.height).toBeGreaterThanOrEqual(48);
      expect(r!.width).toBeGreaterThanOrEqual(48);
      expect(r!.y + r!.height).toBeLessThanOrEqual(
        bounds!.y + bounds!.height + 1,
      );
    }
    await page.locator("[data-jewel-action=up]").click();
    await page.locator("[data-jewel-action=confirm]").click();
    await expect(root).toHaveAttribute("data-pieces", "1");
  });
test("Jewel Drop reduced motion wins and restores terminal without duplicate completion", async ({
  page,
}) => {
  const s = fresh();
  s.cleared = 57;
  s.score = 570;
  s.pieces = 19;
  s.falling = [2, 2, 2];
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(
    ({ key, s }) => {
      if (!localStorage.getItem(key))
        localStorage.setItem(key, JSON.stringify(s));
      localStorage.setItem("denny-games.analytics-consent", "granted-v2");
    },
    { key, s },
  );
  await page.goto("/en/play/jewel-drop/");
  await page.locator("#start-button").click();
  await page.locator("[data-jewel-action=confirm]").click();
  await expect(page.locator(".jewel-drop")).toHaveAttribute(
    "data-phase",
    "won",
  );
  await expect(page.locator(".jewel-drop")).toHaveAttribute(
    "data-cleared",
    "60",
  );
  const count = () =>
    page.evaluate(
      () =>
        (window.dataLayer ?? []).filter(
          (e) => e[0] === "event" && e[1] === "game_complete",
        ).length,
    );
  expect(await count()).toBe(1);
  await page.reload();
  await page.locator("#start-button").click();
  await expect(page.locator(".jewel-drop")).toHaveAttribute(
    "data-phase",
    "won",
  );
  expect(await count()).toBe(0);
});
