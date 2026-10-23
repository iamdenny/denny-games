import { test, expect } from "@playwright/test";
import fs from "node:fs";
const ids = [
  "minefield-watch",
  "mosaic-mystery",
  "traffic-escape",
  "river-hop",
  "meteor-guard",
  "pocket-bowling",
];
for (const lang of ["en", "ko"]) {
  for (const id of ids)
    test(`six discovery and consent ${lang} ${id}`, async ({
      page,
      request,
    }) => {
      const index = await (
        await request.get(`/${lang}/search-index.json`)
      ).json();
      expect(index.filter((g: { id: string }) => g.id === id)).toHaveLength(1);
      const errors: string[] = [],
        analytics: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("request", (r) => {
        if (/google-analytics|googletagmanager/.test(r.url()))
          analytics.push(r.url());
      });
      await page.goto(`/${lang}/games/${id}/`);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `https://games.iamdenny.com/${lang}/games/${id}/`,
      );
      expect(
        (
          await page
            .locator('script[type="application/ld+json"]')
            .allTextContents()
        ).join(" "),
      ).toContain("VideoGame");
      await page.goto(`/${lang}/guides/${id}/`);
      await expect(page.locator("h1")).toBeVisible();
      await page.locator(`a[href="/${lang}/play/${id}/"]`).first().click();
      await page.locator("#start-button").click();
      await expect(
        page.locator(`#game-host [data-game="${id}"]`),
      ).toBeVisible();
      expect(errors).toEqual([]);
      expect(analytics).toEqual([]);
    });
  for (const collection of ["logic-detectives", "cross-defend-roll"])
    test(`six collection ${lang} ${collection}`, async ({ page }) => {
      await page.goto(`/${lang}/collections/${collection}/`);
      await expect(page.locator("[data-game-card]")).toHaveCount(3);
    });
}
for (const id of ids)
  for (const [width, height] of [
    [320, 740],
    [390, 844],
    [1440, 900],
    [740, 360],
  ]) {
    test(`six complete stage ${id} ${width}x${height}`, async ({
      page,
    }, info) => {
      await page.setViewportSize({ width: width!, height: height! });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`/ko/play/${id}/`);
      await page.locator("#start-button").click();
      const board = page.locator(`#game-host [data-game="${id}"]`);
      await expect(board).toBeVisible();
      const bounds = await board.boundingBox();
      expect(bounds!.width).toBeGreaterThan(80);
      expect(bounds!.height).toBeGreaterThan(80);
      expect(bounds!.x).toBeGreaterThanOrEqual(-1);
      expect(bounds!.y).toBeGreaterThanOrEqual(-1);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width! + 1);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(height! + 1);
      for (const button of await page
        .locator(
          "#game-controls button, #pause-button, #restart-button, #sound-button, #player-settings > summary",
        )
        .all()) {
        if (!(await button.isVisible())) continue;
        const b = await button.boundingBox();
        expect(b!.height).toBeGreaterThanOrEqual(47);
        expect(b!.x).toBeGreaterThanOrEqual(-1);
        expect(b!.y).toBeGreaterThanOrEqual(-1);
        expect(b!.x + b!.width).toBeLessThanOrEqual(width! + 1);
        expect(b!.y + b!.height).toBeLessThanOrEqual(height! + 1);
        const tools = await page.locator(".player-tools").boundingBox();
        expect(b!.y).toBeGreaterThanOrEqual(tools!.y - 1);
        expect(b!.y + b!.height).toBeLessThanOrEqual(
          tools!.y + tools!.height + 1,
        );
      }
      const path = `/tmp/six-${id}-${width}.png`;
      await page.screenshot({ path });
      await info.attach("stage", { path, contentType: "image/png" });
    });
  }
test("capture six actual game previews", async ({ page }) => {
  test.skip(!process.env.CAPTURE_SIX, "Explicit runtime preview capture only");
  await page.setViewportSize({ width: 1440, height: 900 });
  fs.mkdirSync("public/art/screenshots", { recursive: true });
  for (const id of ids) {
    await page.goto(`/en/play/${id}/`);
    await page.locator("#start-button").click();
    if (id === "minefield-watch" || id === "mosaic-mystery")
      await page.locator("[data-confirm]").click();
    if (id === "river-hop")
      await page.locator("[data-river-action=up]").click();
    if (id === "meteor-guard")
      await page.getByRole("button", { name: "Fire", exact: true }).click();
    if (id === "pocket-bowling") {
      await page.getByRole("button", { name: "Roll", exact: true }).click();
      await expect(
        page.locator('canvas[data-game="pocket-bowling"]'),
      ).toHaveAttribute("data-phase", "ready");
    }
    await page
      .locator(`#game-host [data-game="${id}"]`)
      .screenshot({ path: `public/art/screenshots/${id}.png` });
  }
});
