import { test, expect } from "@playwright/test";
import { createPuzzle, type Kind } from "../../src/games/logic/rules";
for (const kind of ["lantern-grid", "number-trail"] as Kind[]) {
  for (const locale of ["en", "ko"]) {
    test(`${kind} ${locale}: undo, save, pause, restart and complete`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      const puzzle = createPuzzle(kind, "browser", 2);
      await page.goto(`/${locale}/play/${kind}/?seed=browser&stage=2`);
      await page.locator("#start-button").click();
      const board = page.locator(".logic-board");
      await expect(board).toHaveAttribute(
        "data-cells",
        puzzle.initial.join(","),
      );
      await page.locator(".logic-cell").nth(puzzle.solution[0]!).click();
      const changed = await board.getAttribute("data-cells");
      expect(changed).not.toBe(puzzle.initial.join(","));
      await page.locator(".logic-controls button").click();
      await expect(board).toHaveAttribute(
        "data-cells",
        puzzle.initial.join(","),
      );
      await expect(board).toHaveAttribute("data-moves", "1");
      await page.locator(".logic-cell").nth(puzzle.solution[0]!).click();
      await page.keyboard.press("Escape");
      await expect(page.locator("#game-overlay")).toBeVisible();
      await page.keyboard.press("ArrowRight");
      await expect(board).toHaveAttribute("data-cells", changed!);
      await page.reload();
      await page.locator("#start-button").click();
      await expect(board).toHaveAttribute("data-cells", changed!);
      await expect(board).toHaveAttribute("data-moves", "2");
      await page.locator("#restart-button").click();
      await page.locator("#start-button").click();
      await expect(board).toHaveAttribute(
        "data-cells",
        puzzle.initial.join(","),
      );
      await expect(board).toHaveAttribute("data-moves", "0");
      for (const index of puzzle.solution)
        await page.locator(".logic-cell").nth(index).click();
      await expect(page.locator("#next-stage")).toBeVisible();
      await page.locator("#next-stage").click();
      await expect(page).toHaveURL(/stage=3/);
      expect(errors).toEqual([]);
    });
  }
  test(`${kind}: keyboard and corrupt saved game`, async ({ page }) => {
    await page.goto(`/en/play/${kind}/?seed=keyboard&stage=24`);
    await page.evaluate(
      ({ kind }) =>
        localStorage.setItem(
          `denny-games:v1:progress:${kind}:v1:keyboard:24`,
          JSON.stringify({
            identity: `${kind}:keyboard:24`,
            history: [999],
            moves: 1,
          }),
        ),
      { kind },
    );
    await page.reload();
    await page.locator("#start-button").click();
    const puzzle = createPuzzle(kind, "keyboard", 24);
    await expect(page.locator(".logic-board")).toHaveAttribute(
      "data-cells",
      puzzle.initial.join(","),
    );
    const index = puzzle.solution[0]!;
    await page.locator(".logic-cell").first().focus();
    for (let i = 0; i < index % puzzle.size; i++)
      await page.keyboard.press("ArrowRight");
    for (let i = 0; i < Math.floor(index / puzzle.size); i++)
      await page.keyboard.press("ArrowDown");
    await expect(page.locator(".logic-cell").nth(index)).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator(".logic-board")).toHaveAttribute(
      "data-moves",
      "1",
    );
  });
  for (const width of [320, 360, 390, 430, 1440])
    test(`${kind}: layout ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/ko/play/${kind}/?seed=layout&stage=24`);
      await page.locator("#start-button").click();
      const board = page.locator(".logic-board");
      await expect(board).toBeVisible();
      const bounds = await board.boundingBox();
      expect(bounds!.width).toBeGreaterThan(200);
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await page.screenshot({
        path: `test-results/${kind}-${width}.png`,
        fullPage: true,
      });
    });
}

for (const kind of ["lantern-grid", "number-trail"] as Kind[]) {
  test(`${kind}: touch input`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    await page.goto(
      `http://127.0.0.1:${process.env.PLAYWRIGHT_PORT ?? 4321}/ko/play/${kind}/?seed=touch&stage=24`,
    );
    await page.locator("#start-button").tap();
    const puzzle = createPuzzle(kind, "touch", 24);
    await page.locator(".logic-cell").nth(puzzle.solution[0]!).tap();
    await expect(page.locator(".logic-board")).toHaveAttribute(
      "data-moves",
      "1",
    );
    await context.close();
  });
}
