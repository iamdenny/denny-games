import { test, expect, type Page, type Locator } from "@playwright/test";
import { fresh, solve, CARS } from "../../src/games/traffic-escape/rules";
const ids = [
  "minefield-watch",
  "mosaic-mystery",
  "traffic-escape",
  "river-hop",
  "meteor-guard",
  "pocket-bowling",
];
async function tap(page: Page, el: Locator) {
  await el.scrollIntoViewIfNeeded();
  const b = await el.boundingBox();
  expect(b).not.toBeNull();
  await page.touchscreen.tap(b!.x + b!.width / 2, b!.y + b!.height / 2);
}
async function fits(page: Page) {
  const vp = page.viewportSize()!;
  for (const el of await page
    .locator(
      "#game-host [data-game],#game-controls button,#game-controls input,#pause-button,#restart-button,#sound-button,#player-settings > summary",
    )
    .all()) {
    if (!(await el.isVisible())) continue;
    const b = (await el.boundingBox())!;
    expect(b.x).toBeGreaterThanOrEqual(-1);
    expect(b.y).toBeGreaterThanOrEqual(-1);
    expect(b.x + b.width).toBeLessThanOrEqual(vp.width + 1);
    expect(b.y + b.height).toBeLessThanOrEqual(vp.height + 1);
  }
  const tools = (await page.locator(".player-tools").boundingBox())!;
  for (const el of await page
    .locator(
      "#game-controls button,#game-controls input,#pause-button,#restart-button,#sound-button,#player-settings > summary",
    )
    .all()) {
    if (!(await el.isVisible())) continue;
    const b = (await el.boundingBox())!;
    expect(b.width).toBeGreaterThanOrEqual(48);
    expect(b.height).toBeGreaterThanOrEqual(48);
    expect(b.y + b.height).toBeLessThanOrEqual(tools.y + tools.height + 1);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
}
for (const id of ids)
  for (const locale of ["en", "ko"])
    test(`${id} ${locale} touch rotate restore`, async ({ page }, info) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(`/${locale}/play/${id}/`);
      await tap(page, page.locator("#start-button"));
      const board = page.locator(`#game-host [data-game="${id}"]`);
      await expect(board).toBeVisible();
      let attr = "",
        value = "";
      if (id === "minefield-watch" || id === "mosaic-mystery") {
        await tap(page, page.locator(".watch-controls [data-mode]"));
        await tap(page, page.locator(".watch-controls [data-confirm]"));
        await expect(board.locator('[data-cell="0"]')).toHaveAttribute(
          "data-kind",
          id === "minefield-watch" ? "flag" : "cross",
        );
      } else if (id === "traffic-escape") {
        const [car, d] = solve(fresh(1))[0]!;
        await tap(page, board.locator(".traffic-car").nth(car));
        const direction =
          CARS[car]!.axis === "h"
            ? d < 0
              ? "left"
              : "right"
            : d < 0
              ? "up"
              : "down";
        await tap(page, page.locator(`[data-traffic-action=${direction}]`));
        await expect(board).toHaveAttribute("data-moves", "1");
        attr = "data-positions";
      } else if (id === "river-hop") {
        await tap(page, page.locator("[data-river-action=up]"));
        await expect(board).toHaveAttribute("data-row", "9");
        attr = "data-time";
      } else {
        const range = page.locator("#game-controls input").first();
        await tap(page, range);
        await tap(page, page.locator("#game-controls button"));
        if (id === "pocket-bowling")
          await expect(board).not.toHaveAttribute("data-phase", "ready");
        await expect
          .poll(async () => Number(await board.getAttribute("data-time")))
          .toBeGreaterThan(0.1);
        attr = "data-time";
      }
      await fits(page);
      await page.screenshot({ path: info.outputPath("playing.png") });
      await tap(page, page.locator("#pause-button"));
      if (attr) value = (await board.getAttribute(attr))!;
      await fits(page);
      await page.screenshot({ path: info.outputPath("initial.png") });
      const vp = page.viewportSize()!;
      await page.setViewportSize({ width: vp.height, height: vp.width });
      await expect
        .poll(async () => {
          const b = (await board.boundingBox())!;
          return b.width > 0 && b.height > 0;
        })
        .toBe(true);
      await fits(page);
      await page.screenshot({ path: info.outputPath("rotated.png") });
      if (attr) await expect(board).toHaveAttribute(attr, value);
      await page.reload();
      await expect(page.locator("#start-button")).toBeEnabled();
      await tap(page, page.locator("#start-button"));
      if (id === "minefield-watch" || id === "mosaic-mystery")
        await expect(board.locator('[data-cell="0"]')).toHaveAttribute(
          "data-kind",
          id === "minefield-watch" ? "flag" : "cross",
        );
      if (id === "traffic-escape")
        await expect(board).toHaveAttribute(attr, value);
      await tap(page, page.locator("#restart-button"));
      await expect(board).toBeVisible();
      expect(errors).toEqual([]);
    });
