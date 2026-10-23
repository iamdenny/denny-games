import { test, expect } from "@playwright/test";
import { create } from "../../src/games/pocket-pingpong/rules";
for (const locale of ["en", "ko"])
  test(`table tennis real serve, movement, shot choice and pause ${locale}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${locale}/play/pocket-pingpong/`);
    await page.locator("#start-button").click();
    const canvas = page.locator('canvas[data-game="pocket-pingpong"]');
    await canvas.focus();
    await page.keyboard.down("ArrowRight");
    await page.waitForTimeout(180);
    await page.keyboard.up("ArrowRight");
    expect(Number(await canvas.getAttribute("data-paddle"))).toBeGreaterThan(
      0.55,
    );
    await page.locator('[data-shot="spin"]').click();
    await expect(page.locator('[data-shot="spin"]')).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await page
      .getByRole("button", {
        name: locale === "ko" ? "서브" : "Serve",
        exact: true,
      })
      .click();
    await expect(canvas).toHaveAttribute("data-phase", "rally");
    await expect
      .poll(async () => Number(await canvas.getAttribute("data-rally")))
      .toBeGreaterThan(0);
    await page.locator("#pause-button").click();
    const time = await canvas.getAttribute("data-time");
    await page.waitForTimeout(180);
    await expect(canvas).toHaveAttribute("data-time", time!);
    await page.reload();
    await expect(canvas).toHaveAttribute("data-time", time!);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
test("table tennis restores final rally, awards league win and restarts", async ({
  page,
}) => {
  const s = create();
  s.phase = "rally";
  s.opponent = 2;
  s.points = [4, 2];
  s.ai = 0.9;
  s.ball = { x: 0.1, y: 0.08, vx: 0, vy: -0.72 };
  await page.addInitScript(
    (state) =>
      localStorage.setItem(
        "denny-games:v1:progress:pocket-pingpong:v1:pocket-pingpong:v1:normal:1",
        JSON.stringify(state),
      ),
    s,
  );
  await page.goto("/en/play/pocket-pingpong/");
  await page.locator("#start-button").click();
  const canvas = page.locator('canvas[data-game="pocket-pingpong"]');
  await canvas.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(canvas).toHaveAttribute("data-phase", "won");
  await expect(canvas).toHaveAttribute("data-points", "5:2");
  await page.locator("#restart-button").click();
  await expect(canvas).toHaveAttribute("data-phase", "serve");
  await expect(canvas).toHaveAttribute("data-points", "0:0");
});
for (const locale of ["en", "ko"])
  for (const width of [320, 390, 1440])
    test(`table tennis controls fit ${locale} ${width} with reduced motion`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: width === 1440 ? 900 : 740 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`/${locale}/play/pocket-pingpong/`);
      await page.locator("#start-button").click();
      const canvas = page.locator('canvas[data-game="pocket-pingpong"]');
      await canvas.focus();
      await page.keyboard.press("ArrowUp");
      await expect(page.locator('[data-shot="spin"]')).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      await page.keyboard.press("ArrowDown");
      await expect(page.locator('[data-shot="drive"]')).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      for (const button of await page
        .locator("[data-pingpong-controls] button")
        .filter({
          hasText: /^(←|→|Serve|서브|Drive|안정타|Topspin|회전|Smash|스매시)$/,
        })
        .all()) {
        const box = await button.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.width).toBeGreaterThanOrEqual(48);
        expect(box!.height).toBeGreaterThanOrEqual(48);
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
        expect(box!.y).toBeGreaterThanOrEqual(0);
        expect(box!.y + box!.height).toBeLessThanOrEqual(
          width === 1440 ? 901 : 741,
        );
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    });
test("table tennis match transition retains score and restores terminal result", async ({
  page,
}) => {
  const s = create();
  s.phase = "between";
  s.points = [5, 2];
  s.score = 500;
  await page.addInitScript(
    (state) =>
      localStorage.setItem(
        "denny-games:v1:progress:pocket-pingpong:v1:pocket-pingpong:v1:normal:1",
        JSON.stringify(state),
      ),
    s,
  );
  await page.goto("/en/play/pocket-pingpong/");
  await page.locator("#start-button").click();
  await page.getByRole("button", { name: "Next match", exact: true }).click();
  const canvas = page.locator('canvas[data-game="pocket-pingpong"]');
  await expect(canvas).toHaveAttribute("data-phase", "rally");
  await expect(canvas).toHaveAttribute("data-points", "0:0");
  await expect(
    page.getByRole("status").filter({ hasText: "Spin specialist" }),
  ).toBeVisible();
});
test("table tennis restored completed league stays terminal without advancing time", async ({
  page,
}) => {
  const s = create();
  s.phase = "won";
  s.opponent = 2;
  s.points = [5, 3];
  s.score = 1500;
  s.time = 240;
  await page.addInitScript(
    (state) =>
      localStorage.setItem(
        "denny-games:v1:progress:pocket-pingpong:v1:pocket-pingpong:v1:normal:1",
        JSON.stringify(state),
      ),
    s,
  );
  await page.goto("/en/play/pocket-pingpong/");
  await page.locator("#start-button").click();
  const canvas = page.locator('canvas[data-game="pocket-pingpong"]');
  await expect(canvas).toHaveAttribute("data-phase", "won");
  await expect(page.locator("#restart-button")).toBeVisible();
  // The terminal overlay owns focus; Space intentionally activates Restart.
  // Observe the restored engine without requesting a new round.
  await page.waitForTimeout(250);
  await expect(canvas).toHaveAttribute("data-time", "240.00");
  await expect(canvas).toHaveCount(1);
  await expect(page.locator("#restart-button")).toHaveCount(1);
});
