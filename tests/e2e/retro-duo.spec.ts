import { test, expect } from "@playwright/test";
import fs from "node:fs";
for (const lang of ["en", "ko"]) {
  test(`pinball and gems discovery and consent ${lang}`, async ({
    page,
    request,
  }) => {
    const index = await (
      await request.get(`/${lang}/search-index.json`)
    ).json();
    for (const id of ["star-pinball", "jewel-drop"]) {
      expect(index.filter((g: { id: string }) => g.id === id)).toHaveLength(1);
      const errors: string[] = [];
      const requests: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("request", (r) => requests.push(r.url()));
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
        page.locator(
          id === "star-pinball"
            ? 'canvas[data-game="star-pinball"]'
            : ".jewel-drop",
        ),
      ).toBeVisible();
      expect(
        requests.some((u) => /google-analytics|googletagmanager/.test(u)),
      ).toBe(false);
      expect(errors).toEqual([]);
    }
    await page.goto(`/${lang}/collections/bumpers-and-gems/`);
    await expect(page.locator("[data-game-card]")).toHaveCount(3);
  });
}
test("capture actual pinball and gem previews", async ({ page }) => {
  test.skip(!process.env.CAPTURE_DUO, "Explicit runtime preview capture only");
  await page.setViewportSize({ width: 1440, height: 900 });
  fs.mkdirSync("public/art/screenshots", { recursive: true });
  for (const [id, selector] of [
    ["star-pinball", 'canvas[data-game="star-pinball"]'],
    ["jewel-drop", ".jewel-drop"],
  ]) {
    await page.goto(`/en/play/${id}/`);
    await page.locator("#start-button").click();
    if (id === "star-pinball")
      await page.getByRole("button", { name: "Launch", exact: true }).click();
    else await page.locator("[data-jewel-action=confirm]").click();
    await page
      .locator(selector!)
      .screenshot({ path: `public/art/screenshots/${id}.png` });
  }
});
for (const id of ["star-pinball", "jewel-drop"])
  for (const width of [320, 390, 1440]) {
    test(`complete stage fits ${id} ${width}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: width === 1440 ? 900 : 740 });
      await page.goto(`/ko/play/${id}/`);
      await page.locator("#start-button").click();
      const selector =
        id === "star-pinball"
          ? 'canvas[data-game="star-pinball"]'
          : ".jewel-board";
      const board = await page.locator(selector).boundingBox();
      expect(board!.x).toBeGreaterThanOrEqual(0);
      expect(board!.y).toBeGreaterThanOrEqual(0);
      expect(board!.x + board!.width).toBeLessThanOrEqual(width + 1);
      expect(board!.y + board!.height).toBeLessThanOrEqual(
        (width === 1440 ? 900 : 740) + 1,
      );
      for (const btn of await page
        .locator(
          "#game-host button, #game-controls button, #pause-button, #restart-button",
        )
        .all()) {
        const b = await btn.boundingBox();
        expect(b!.y + b!.height).toBeLessThanOrEqual(
          (width === 1440 ? 900 : 740) + 1,
        );
        expect(b!.x + b!.width).toBeLessThanOrEqual(width + 1);
      }
      await page.screenshot({ path: `/tmp/duo-${id}-${width}.png` });
      await testInfo.attach("stage", {
        path: `/tmp/duo-${id}-${width}.png`,
        contentType: "image/png",
      });
    });
  }
test("gem flight settles when player width changes", async ({ page }) => {
  await page.goto("/en/play/jewel-drop/");
  await page.locator("#start-button").click();
  await page.locator("[data-jewel-action=confirm]").click();
  await page.setViewportSize({ width: 390, height: 740 });
  await expect(page.locator(".jewel-flight,.jewel-clear-layer")).toHaveCount(0);
  await expect(page.locator(".jewel-drop")).toHaveAttribute("data-pieces", "1");
});
