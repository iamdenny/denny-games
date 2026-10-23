import { test, expect } from "@playwright/test";
import { collections } from "../../src/data/collections";

for (const locale of ["en", "ko"] as const) {
  test(`${locale}: collection previews show real member artwork without JavaScript`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    const catalogue: { id: string; artwork: string; title: string }[] = await (
      await context.request.get(`/${locale}/search-index.json`)
    ).json();
    for (const route of ["", "collections/", "games/gomoku/"]) {
      await page.goto(`/${locale}/${route}`);
      const cards = page.locator("[data-collection-card]");
      await expect(cards).toHaveCount(
        route.includes("gomoku") ? 1 : collections.length,
      );
      const firstId = await cards.first().getAttribute("data-collection-card");
      for (const card of await cards.all()) {
        const id = await card.getAttribute("data-collection-card");
        const detail = await context.request.get(
          `/${locale}/collections/${id}/`,
        );
        expect(detail.ok()).toBe(true);
        const memberIds = Array.from(
          (await detail.text()).matchAll(/data-game-card="([^"]+)"/g),
          (match) => match[1],
        );
        await expect(card.locator(".eyebrow")).toContainText(
          String(memberIds.length),
        );
        await expect(card.locator("img")).toHaveCount(
          Math.min(3, memberIds.length),
        );
        await expect(card.locator("a")).toHaveAccessibleName(
          (await card.locator("h3").innerText()).replace("↗", "").trim(),
        );
        expect(
          await card
            .locator("[data-preview-game]")
            .evaluateAll((elements) =>
              elements.map((element) =>
                element.getAttribute("data-preview-game"),
              ),
            ),
        ).toEqual(memberIds.slice(0, 3));
        for (const memberId of memberIds.slice(0, 3)) {
          const game = catalogue.find((game) => game.id === memberId)!;
          const image = card.locator(`[data-preview-game="${memberId}"] img`);
          await expect(image).toHaveAttribute("src", game.artwork);
          await expect(image).toHaveAttribute("alt", game.title);
          await image.scrollIntoViewIfNeeded();
          await expect(image).toBeVisible();
          await expect
            .poll(() =>
              image.evaluate((img: HTMLImageElement) => img.naturalWidth),
            )
            .toBeGreaterThan(0);
        }
      }
      await page.locator(".collection-preview").first().click();
      await expect(page).toHaveURL(`/${locale}/collections/${firstId}/`);
    }
    await context.close();
  });
}

for (const width of [320, 360, 390, 430, 1440]) {
  test(`collection previews fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const locale of ["en", "ko"]) {
      await page.goto(`/${locale}/`);
      const first = page.locator("[data-collection-card]").first();
      await first.scrollIntoViewIfNeeded();
      const images = first.locator("img");
      await expect(images).toHaveCount(Math.min(3, collections[0]!.ids.length));
      for (const image of await images.all()) {
        const box = await image.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.width).toBeGreaterThan(40);
        expect(box!.height).toBeGreaterThan(30);
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const cards = page.locator("[data-collection-card]");
      const one = await cards.nth(0).boundingBox();
      const two = await cards.nth(1).boundingBox();
      if (width <= 600) expect(two!.y).toBeGreaterThan(one!.y + one!.height);
      else expect(two!.y).toBe(one!.y);
    }
    await page.screenshot({
      path: test.info().outputPath(`collection-previews-${width}.png`),
      fullPage: false,
    });
  });
}
