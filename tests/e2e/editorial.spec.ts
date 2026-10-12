import { test, expect } from "@playwright/test";
import { editorPicks } from "../../src/data/editorial";

test("2048 remains playable with reduced motion and low effects", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en/play/2048/?seed=motion-review");
  await page.locator("#start-button").click();
  for (const key of ["ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp"])
    await page.keyboard.press(key);
  await expect(
    page.locator('.merge-cell:not([data-power="0"])').first(),
  ).toBeVisible();
  expect(
    await page
      .locator(".merge-cell")
      .evaluateAll((cells) =>
        cells.every((cell) => getComputedStyle(cell).animationName === "none"),
      ),
  ).toBe(true);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.locator("#player-settings summary").click();
  await page.locator("#low-effects").check();
  await page.keyboard.press("ArrowLeft");
  expect(
    await page
      .locator(".merge-cell")
      .evaluateAll((cells) =>
        cells.every((cell) => getComputedStyle(cell).animationName === "none"),
      ),
  ).toBe(true);
  await page.locator("#pause-button").click();
  await expect(page.locator("#game-overlay")).toBeVisible();
});

test("editor picks stay consistent across home, full catalogue, categories and default search", async ({
  page,
}) => {
  await page.goto("/ko/");
  await expect(page.locator(".feature a.button")).toHaveAttribute(
    "href",
    `/ko/games/${editorPicks[0]!.id}/`,
  );
  expect(
    await page
      .locator("[data-game-card]")
      .evaluateAll((cards) =>
        cards.slice(0, 6).map((card) => card.getAttribute("data-game-card")),
      ),
  ).toEqual(editorPicks.slice(0, 6).map((pick) => pick.id));
  await page.goto("/ko/all/");
  expect(
    await page
      .locator("[data-game-card]")
      .evaluateAll(
        (cards, count) =>
          cards
            .slice(0, count)
            .map((card) => card.getAttribute("data-game-card")),
        editorPicks.length,
      ),
  ).toEqual(editorPicks.map((pick) => pick.id));
  await expect(page.locator(".editorial-note")).toContainText(
    "인기 순위는 아닙니다",
  );
  await page.goto("/en/category/arcade/");
  await expect(page.locator("[data-game-card]").first()).toHaveAttribute(
    "data-game-card",
    "orbit-break",
  );
  await page.locator("[data-sort]").selectOption("name");
  await page.locator("[data-sort]").selectOption("recommended");
  await expect(page.locator("[data-game-card]").first()).toHaveAttribute(
    "data-game-card",
    "orbit-break",
  );
  await page.goto("/en/search/");
  await expect(page.locator("#search-results a").first()).toHaveAttribute(
    "href",
    `/en/games/${editorPicks[0]!.id}/`,
  );
});
