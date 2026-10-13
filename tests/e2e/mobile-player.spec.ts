import { test, expect } from "@playwright/test";
import { setBoardMode } from "./helpers/board-settings";
for (const locale of ["en", "ko"])
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 360, height: 640 },
    { width: 430, height: 932 },
    { width: 667, height: 375 },
  ]) {
    test(`${locale} ${viewport.width}x${viewport.height}: full board, one-row controls and settings`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto(`/${locale}/play/gomoku/`);
      const modeChoice = page.locator("#game-mode-choice");
      await expect(modeChoice).toBeVisible();
      await expect(modeChoice.locator("label")).toHaveCount(2);
      for (const option of await modeChoice.locator("label").all()) {
        const box = await option.boundingBox();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
        expect(box!.y).toBeGreaterThanOrEqual(0);
        expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
        expect(box!.height).toBeGreaterThanOrEqual(48);
      }
      await page.locator("#start-button").click();
      const area = await page.locator(".play-area").boundingBox();
      const board = await page.locator(".classic-board").boundingBox();
      expect(board!.y).toBeGreaterThanOrEqual(area!.y);
      expect(board!.y + board!.height).toBeLessThanOrEqual(
        area!.y + area!.height,
      );
      expect(
        await page.locator(".play-area").evaluate((el) => el.scrollTop),
      ).toBe(0);
      const controls = await page
        .locator(
          "#pause-button,#restart-button,#sound-button,#player-settings summary",
        )
        .evaluateAll((nodes) =>
          nodes.map((el) => ({
            y: el.getBoundingClientRect().y,
            height: el.getBoundingClientRect().height,
            width: el.getBoundingClientRect().width,
          })),
        );
      if (viewport.width < 600) {
        expect(
          Math.max(...controls.map((c) => c.y)) -
            Math.min(...controls.map((c) => c.y)),
        ).toBeLessThan(2);
      } else {
        const tools = await page.locator(".player-tools").boundingBox();
        expect(tools!.x).toBeGreaterThanOrEqual(board!.x + board!.width);
      }
      expect(controls.every((c) => c.height >= 48 && c.width >= 44)).toBe(true);
      await setBoardMode(page, "local");
      await page.locator('[data-cell="112"]').click();
      await expect(page.locator(".board-selection")).toContainText(
        locale === "ko" ? "8행" : "Row 8",
      );
      await page.locator("[data-board-confirm]").click();
      await expect(page.locator(".classic-game")).toHaveAttribute(
        "data-moves",
        "1",
      );
      await page.locator("#player-settings summary").click();
      await expect(page.locator("[data-board-mode]")).toBeVisible();
      await expect(page.locator("[data-board-level]")).toBeDisabled();
      expect(
        await page
          .locator("[data-board-mode]")
          .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
      ).toBeGreaterThanOrEqual(16);
    });
  }
test("game remount removes previous settings and retains saved progress", async ({
  page,
}) => {
  await page.goto("/ko/play/gomoku/");
  await page.locator("#start-button").click();
  await setBoardMode(page, "local");
  await page.locator('[data-cell="112"]').click();
  await page.locator('[data-cell="112"]').click();
  await page.locator("#player-settings summary").click();
  await page.locator("#stage-select").selectOption("1");
  await expect(page.locator("#game-settings .board-options")).toHaveCount(1);
  await expect(page.locator("#game-controls .board-tools")).toHaveCount(1);
  await expect(
    page.locator("#game-settings .board-directions button"),
  ).toHaveCount(4);
  await expect(page.locator("[data-board-mode]")).toHaveCount(1);
  await expect(
    page.locator("#game-mode-choice [data-board-mode-choice]"),
  ).toHaveCount(1);
  await page.locator("#player-settings summary").click();
  await page.locator("#start-button").click();
  await expect(page.locator(".classic-game")).toHaveAttribute(
    "data-moves",
    "1",
  );
});
test("real touch swipe merges 2048, while a cancelled touch cannot commit later", async ({
  browser,
  browserName,
}) => {
  test.skip(
    browserName !== "chromium",
    "CDP touch injection is Chromium-specific; tap/layout/orientation also run on WebKit.",
  );
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 360, height: 640 },
  });
  const page = await context.newPage();
  await page.addInitScript(() =>
    localStorage.setItem(
      "denny-games:v1:progress:2048:v1:mobile-swipe:1",
      JSON.stringify({
        board: [2, 2, ...Array(14).fill(0)],
        score: 0,
        counter: 0,
      }),
    ),
  );
  await page.goto("/ko/play/2048/?seed=mobile-swipe");
  await page.locator("#start-button").tap();
  const grid = page.locator(".merge-board");
  await grid.evaluate((el) =>
    el.addEventListener("pointerdown", (e) => {
      (window as any).lastTouch = (e as PointerEvent).pointerId;
    }),
  );
  const rect = await grid.boundingBox();
  const x = rect!.x + rect!.width - 24,
    y = rect!.y + rect!.height / 2;
  const cdp = await context.newCDPSession(page);
  const start = () =>
    cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y, id: 1 }],
    });
  const move = () =>
    cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: x - 100, y, id: 1 }],
    });
  await start();
  await move();
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchCancel",
    touchPoints: [],
  });
  const pointerId = await page.evaluate(
    () => (window as any).lastTouch as number,
  );
  await grid.dispatchEvent("pointerup", {
    pointerId,
    clientX: x - 100,
    clientY: y,
    pointerType: "touch",
  });
  await expect(page.locator("#score")).toHaveText("0");
  await expect(page.locator(".merge-cell").first()).toHaveText("2");
  await start();
  await move();
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(page.locator("#score")).toHaveText("4");
  await expect(page.locator(".merge-cell").first()).toHaveText("4");
  expect(await page.locator(".play-area").evaluate((el) => el.scrollTop)).toBe(
    0,
  );
  await context.close();
});
