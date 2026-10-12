import { setBoardMode } from "./helpers/board-settings";
import { test, expect } from "@playwright/test";
for (const viewport of [
  { width: 1440, height: 900 },
  { width: 800, height: 600 },
  { width: 960, height: 640 },
  { width: 320, height: 568 },
  { width: 360, height: 640 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 667, height: 375 },
  { width: 844, height: 390 },
]) {
  for (const id of [
    "gomoku",
    "reversi",
    "four-in-a-row",
    "checkers",
    "dots-and-boxes",
    "circuit-loop",
    "orbit-break",
    "2048",
    "crisp-cywall",
  ]) {
    test(`${id} fills ${viewport.width}x${viewport.height} webview and preserves state on view change`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto(`/en/play/${id}/`);
      await expect(page.locator("#player")).toHaveAttribute(
        "data-immersive",
        "true",
      );
      await page.locator("#start-button").click();
      expect(
        await page.evaluate(() => document.fullscreenElement === null),
      ).toBe(true);
      const rect = await page.locator("#player").boundingBox();
      expect(rect!.width).toBe(viewport.width);
      expect(rect!.height).toBe(viewport.height);
      for (const selector of [
        "#pause-button",
        "#restart-button",
        "#sound-button",
        "#fullscreen-button",
        "#player-settings summary",
      ]) {
        const box = await page.locator(selector).boundingBox();
        expect(box!.y).toBeGreaterThanOrEqual(0);
        expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
      }
      const surface = page.locator(
        ".classic-board,.circuit-board,.merge-board,.orbit-canvas,.crisp-frame",
      );
      const bounds = await surface.boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport.width);
      if (
        ["gomoku", "reversi", "checkers", "dots-and-boxes", "2048"].includes(id)
      ) {
        expect(Math.abs(bounds!.width - bounds!.height)).toBeLessThan(2);
      }
      if (id === "gomoku") {
        const area = await page.locator(".play-area").boundingBox();
        expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(
          area!.y + area!.height,
        );
      }
      if (viewport.width <= 560 && viewport.height >= 568) {
        const area = await page.locator(".play-area").boundingBox();
        for (const control of await page
          .locator(".game-hint,.direction-controls,.launch-button")
          .all()) {
          const box = await control.boundingBox();
          expect(box!.y + box!.height).toBeLessThanOrEqual(
            area!.y + area!.height,
          );
        }
      }
      const host = page.locator("#game-host");
      // Track the actual DOM node, so switching views cannot silently remount the engine.
      await host.evaluate((el) => {
        (window as any).playerNode = el.firstElementChild;
      });
      await page.locator("#fullscreen-button").click();
      await expect(page.locator("#player")).toHaveAttribute(
        "data-immersive",
        "false",
      );
      await expect(page.locator(".site-header")).toBeVisible();
      await page.locator("#fullscreen-button").click();
      expect(
        await host.evaluate(
          (el) => el.firstElementChild === (window as any).playerNode,
        ),
      ).toBe(true);
      await page.locator("#player-settings summary").click();
      await expect(page.locator("#sound-volume")).toBeVisible();
      await page.locator("#player-settings summary").click();
    });
  }
}
for (const id of ["reversi", "four-in-a-row", "dots-and-boxes"]) {
  test(`${id} repeats the selected target to commit`, async ({ page }) => {
    await page.goto(`/en/play/${id}/`);
    await page.locator("#start-button").click();
    await setBoardMode(page, "local");
    const target = page
      .locator(id === "four-in-a-row" ? '[data-cell="0"]' : ".board-cell.legal")
      .first();
    const cell = await target.getAttribute("data-cell");
    await target.click();
    await expect(page.locator(".classic-game")).toHaveAttribute(
      "data-moves",
      "0",
    );
    await page.locator(`[data-cell="${cell}"]`).click();
    await expect(page.locator(".classic-game")).toHaveAttribute(
      "data-moves",
      "1",
    );
  });
}

test("touch previews then commits a stone, and view changes preserve it", async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("/ko/play/gomoku/");
  await page.locator("#start-button").tap();
  await setBoardMode(page, "local");
  await page.locator('[data-cell="112"]').tap();
  await expect(page.locator(".classic-game")).toHaveAttribute(
    "data-moves",
    "0",
  );
  await page.locator('[data-cell="112"]').tap();
  await expect(page.locator(".classic-game")).toHaveAttribute(
    "data-moves",
    "1",
  );
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(page.locator(".classic-game")).toHaveAttribute(
    "data-moves",
    "1",
  );
  await page.locator("#fullscreen-button").tap();
  await page.locator("#fullscreen-button").tap();
  await expect(page.locator(".classic-game")).toHaveAttribute(
    "data-moves",
    "1",
  );
  await context.close();
});

test("checkers destination commits directly and continued jumps remain locked", async ({
  page,
}) => {
  const { initial } = await import("../../src/games/board/rules");
  const position = initial("checkers");
  position.cells.fill(0);
  for (const [cell, side] of [
    [42, 1],
    [35, 2],
    [21, 2],
    [56, 1],
    [1, 2],
  ])
    position.cells[cell!] = side!;
  await page.addInitScript(
    (position) =>
      localStorage.setItem(
        "denny-games:v1:progress:checkers:v1:pointer-jump:1",
        JSON.stringify({ position, mode: "local", level: 2 }),
      ),
    position,
  );
  await page.goto("/en/play/checkers/?seed=pointer-jump");
  await page.locator("#start-button").click();
  await page.locator('[data-cell="42"]').click();
  await page.locator('[data-cell="28"]').click();
  await expect(page.locator(".classic-game")).toHaveAttribute(
    "data-moves",
    "1",
  );
  await expect(page.locator(".classic-game")).toHaveAttribute("data-turn", "1");
  await page.locator('[data-cell="56"]').click();
  await expect(page.locator(".classic-game")).toHaveAttribute(
    "data-moves",
    "1",
  );
  await page.locator('[data-cell="28"]').click();
  await page.locator('[data-cell="14"]').click();
  await expect(page.locator(".classic-game")).toHaveAttribute(
    "data-moves",
    "2",
  );
  await expect(page.locator(".classic-game")).toHaveAttribute("data-turn", "2");
});

test("checkers keeps keyboard preview and confirmation as an alternative", async ({
  page,
}) => {
  await page.goto("/en/play/checkers/");
  await page.locator("#start-button").click();
  await setBoardMode(page, "local");
  await page.locator('[data-cell="40"]').click();
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await expect(page.locator(".classic-game")).toHaveAttribute(
    "data-moves",
    "0",
  );
  await expect(page.locator("[data-board-confirm]")).toBeEnabled();
  await page.keyboard.press("Enter");
  await expect(page.locator(".classic-game")).toHaveAttribute(
    "data-moves",
    "1",
  );
});
