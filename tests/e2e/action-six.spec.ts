import { test, expect } from "@playwright/test";
import { create as meteor } from "../../src/games/meteor-guard/rules";
import { create as bowling } from "../../src/games/pocket-bowling/rules";
for (const id of ["meteor-guard", "pocket-bowling"])
  for (const locale of ["en", "ko"])
    test(`${id} real input pause restore restart ${locale}`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/play/${id}/`);
      await page.locator("#start-button").click();
      const canvas = page.locator(`canvas[data-game="${id}"]`);
      const controls = page.locator(`[data-action-controls="${id}"]`);
      await controls.locator("input").first().focus();
      await page.keyboard.press("ArrowRight");
      await controls.getByRole("button").click();
      await expect
        .poll(async () => Number(await canvas.getAttribute("data-time")))
        .toBeGreaterThan(0.2);
      if (id === "pocket-bowling")
        await expect(canvas).not.toHaveAttribute("data-phase", "ready");
      await page.locator("#pause-button").click();
      const time = await canvas.getAttribute("data-time");
      await page.waitForTimeout(150);
      await expect(canvas).toHaveAttribute("data-time", time!);
      await page.reload();
      await expect(canvas).toHaveAttribute("data-time", time!);
      await page.locator("#start-button").click();
      await expect
        .poll(async () => Number(await canvas.getAttribute("data-time")))
        .toBeGreaterThan(Number(time));
      await page.locator("#restart-button").click();
      await expect(canvas).toHaveAttribute("data-score", "0");
    });
for (const id of ["meteor-guard", "pocket-bowling"])
  for (const width of [320, 390, 1440])
    test(`${id} reduced motion controls ${width}`, async ({ page }) => {
      const height = width === 1440 ? 900 : 740;
      await page.setViewportSize({ width, height });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`/ko/play/${id}/`);
      await page.locator("#start-button").click();
      for (const el of await page
        .locator(
          `[data-action-controls="${id}"] button,[data-action-controls="${id}"] input`,
        )
        .all()) {
        const b = await el.boundingBox();
        expect(b!.width).toBeGreaterThanOrEqual(48);
        expect(b!.height).toBeGreaterThanOrEqual(48);
        expect(b!.x).toBeGreaterThanOrEqual(0);
        expect(b!.x + b!.width).toBeLessThanOrEqual(width + 1);
        expect(b!.y + b!.height).toBeLessThanOrEqual(height + 1);
      }
      const b = await page.locator(`canvas[data-game="${id}"]`).boundingBox();
      expect(b!.y + b!.height).toBeLessThanOrEqual(height + 1);
    });
for (const id of ["meteor-guard", "pocket-bowling"])
  test(`${id} terminal fixture and restored result remain frozen`, async ({
    page,
  }) => {
    const m = meteor();
    m.wave = 5;
    m.elapsed = 20;
    m.time = 110;
    m.score = 2000;
    const b = bowling();
    b.rolls = Array(11).fill(10);
    b.score = 290;
    b.phase = "falling";
    b.flight = 0.54;
    b.pending = 10;
    b.time = 50;
    const key = `denny-games:v1:progress:${id}:v1:${id}:v1:normal:1`;
    await page.addInitScript(
      ({ key, state }) => localStorage.setItem(key, JSON.stringify(state)),
      { key, state: id === "meteor-guard" ? m : b },
    );
    await page.goto(`/en/play/${id}/`);
    await page.locator("#start-button").click();
    const canvas = page.locator(`canvas[data-game="${id}"]`);
    await expect(canvas).toHaveAttribute(
      "data-phase",
      id === "meteor-guard" ? "won" : "done",
    );
    const time = await canvas.getAttribute("data-time");
    await page.waitForTimeout(150);
    await expect(canvas).toHaveAttribute("data-time", time!);
    await expect(page.locator("#restart-button")).toBeVisible();
  });
for (const locale of ["en", "ko"])
  test(`bowling compact landscape keeps shell controls visible ${locale}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 740, height: 360 });
    await page.goto(`/${locale}/play/pocket-bowling/`);
    await page.locator("#start-button").click();
    const tools = await page.locator(".player-tools").boundingBox();
    expect(tools!.y).toBeGreaterThanOrEqual(0);
    expect(tools!.y + tools!.height).toBeLessThanOrEqual(361);
    for (const control of await page
      .locator(
        '[data-action-controls="pocket-bowling"] button,[data-action-controls="pocket-bowling"] input,#pause-button,#restart-button,#sound-button,#player-settings summary',
      )
      .all()) {
      const b = await control.boundingBox();
      expect(b!.width).toBeGreaterThanOrEqual(48);
      expect(b!.height).toBeGreaterThanOrEqual(48);
      expect(b!.x).toBeGreaterThanOrEqual(0);
      expect(b!.x + b!.width).toBeLessThanOrEqual(741);
      expect(b!.y).toBeGreaterThanOrEqual(0);
      expect(b!.y + b!.height).toBeLessThanOrEqual(361);
      expect(b!.y + b!.height).toBeLessThanOrEqual(
        tools!.y + tools!.height + 1,
      );
    }
  });
