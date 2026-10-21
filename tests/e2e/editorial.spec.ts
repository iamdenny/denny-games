import { test, expect } from "@playwright/test";
import { editorPicks } from "../../src/data/editorial";
import { categories, categoryGames, gameById } from "../../src/data/games";

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
  for (const locale of ["en", "ko"] as const) {
    await page.goto(`/${locale}/`);
    const featuredId = await page
      .locator("[data-quick-play]")
      .getAttribute("data-quick-current");
    expect(gameById(featuredId!)).toBeDefined();
    await expect(page.locator("[data-quick-details]")).toHaveAttribute(
      "href",
      `/${locale}/games/${featuredId}/`,
    );
    expect(
      await page
        .locator("[data-game-card]")
        .evaluateAll((cards) =>
          cards.slice(0, 6).map((card) => card.getAttribute("data-game-card")),
        ),
    ).toEqual(editorPicks.slice(0, 6).map((pick) => pick.id));
    const homeCardIds = await page
      .locator("[data-game-card]")
      .evaluateAll((cards) =>
        cards.map((card) => card.getAttribute("data-game-card")),
      );
    const curatedIds = new Set(editorPicks.slice(0, 6).map((pick) => pick.id));
    const expectedCategoryIds = categories.flatMap((category) =>
      categoryGames(category)
        .filter((game) => !curatedIds.has(game.id))
        .slice(0, 3)
        .map((game) => game.id),
    );
    const categoryCardIds = await page
      .locator(".catalogue-section [data-game-card]")
      .evaluateAll((cards) =>
        cards.map((card) => card.getAttribute("data-game-card")),
      );
    expect(categoryCardIds).toEqual(expectedCategoryIds);
    expect(homeCardIds).toHaveLength(
      curatedIds.size + expectedCategoryIds.length,
    );
    expect(new Set(homeCardIds).size).toBe(homeCardIds.length);
    expect(categoryCardIds.every((id) => !curatedIds.has(id!))).toBe(true);
    await expect(
      page.locator(".catalogue-section [data-home-play-link]"),
    ).toHaveCount(expectedCategoryIds.length);
    await expect(
      page.locator(".catalogue-section [data-home-play-link]").first(),
    ).toHaveAttribute("href", new RegExp(`^/${locale}/play/`));
  }

  const featuredCategories = await page
    .locator("[data-game-card]")
    .evaluateAll((cards) =>
      cards.slice(0, 6).map((card) => card.getAttribute("data-category")),
    );
  expect(new Set(featuredCategories).size).toBe(6);
  await expect(page.locator("[data-home-play-link]").first()).toHaveAttribute(
    "href",
    `/ko/play/${editorPicks[0]!.id}/`,
  );
  await expect(page.locator(".home-genres [data-home-genre]")).toHaveCount(7);
  for (const link of await page
    .locator(".home-genres [data-home-genre]")
    .all()) {
    const category = await link.getAttribute("data-home-genre");
    await expect(link).toHaveAttribute("href", `/ko/category/${category}/`);
  }
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

test("home genre cards fit phone, tablet and desktop widths with tappable play links", async ({
  page,
}) => {
  const viewports = [
    { width: 320, height: 568 },
    { width: 360, height: 800 },
    { width: 390, height: 844 },
    { width: 430, height: 900 },
    { width: 810, height: 1080 },
    { width: 1080, height: 810 },
    { width: 1440, height: 900 },
  ];

  for (const locale of ["en", "ko"] as const) {
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto(`/${locale}/`);
      const category = page.locator(".catalogue-section").first();
      await category.scrollIntoViewIfNeeded();
      const card = category.locator("[data-game-card]").first();
      const gameId = await card.getAttribute("data-game-card");
      const detailLink = card.locator(".game-card-link");
      const playLink = card.locator("[data-home-play-link]");
      await expect(playLink).toBeVisible();
      await expect(playLink).toHaveAttribute(
        "href",
        `/${locale}/play/${gameId}/`,
      );
      expect(await detailLink.getAttribute("href")).toBe(
        `/${locale}/games/${gameId}/`,
      );
      const playBounds = await playLink.boundingBox();
      expect(playBounds).not.toBeNull();
      expect(playBounds!.height).toBeGreaterThanOrEqual(48);
      expect(playBounds!.x).toBeGreaterThanOrEqual(0);
      expect(playBounds!.x + playBounds!.width).toBeLessThanOrEqual(
        viewport.width,
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    }
  }
});
