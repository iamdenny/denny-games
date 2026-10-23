import { test, expect } from "@playwright/test";

for (const locale of ["en", "ko"] as const) {
  test(`${locale}: player filter combines with genre and survives reload, history and language`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/search/?mode=multi-player&category=board`);
    const modes = page.locator('[name="mode"]');
    const results = page.locator("[data-search-result]");
    await expect(modes).toHaveValue("multi-player");
    await expect(results).toHaveCount(6);
    await expect(page.locator('[data-search-result="yutnori"]')).toBeVisible();
    await expect(page.locator("[data-search-modes]").first()).toContainText(
      locale === "ko" ? "같은 기기에서 함께" : "Together on one device",
    );
    await page.reload();
    await expect(results).toHaveCount(6);
    await modes.selectOption("single-player");
    await expect(results).toHaveCount(5);
    await expect(page.locator('[data-search-result="yutnori"]')).toHaveCount(0);
    await page.goBack();
    await expect(modes).toHaveValue("multi-player");
    await expect(results).toHaveCount(6);
    const other = locale === "ko" ? "en" : "ko";
    await page.locator(`[data-locale-link][lang="${other}"]`).click();
    await expect(page).toHaveURL(
      new RegExp(`/${other}/search/.*mode=multi-player`),
    );
    await expect(results).toHaveCount(6);
    await page.locator('#search-form button[type="reset"]').click();
    await expect(modes).toHaveValue("");
    await expect(results).toHaveCount(24);
    await modes.selectOption("single-player");
    await page
      .locator("#search-pages")
      .getByRole("link", { name: "2", exact: true })
      .click();
    await expect(page).toHaveURL(/mode=single-player.*page=2/);
    await page.reload();
    await expect(modes).toHaveValue("single-player");
    await expect(results).toHaveCount(24);
    await page.goto(`/${locale}/search/?mode=forged&page=Infinity`);
    await expect(results).toHaveCount(24);
    await expect(page).toHaveURL(new RegExp(`/${locale}/search/$`));
  });
}

test("player filters and local game launches fit phones and tablets", async ({
  page,
}, testInfo) => {
  for (const width of [320, 360, 390, 430, 834, 1194, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/ko/search/?mode=multi-player");
    await expect(page.locator("[data-search-result]")).toHaveCount(10);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (width === 320 || width === 1440) {
      await page.screenshot({
        path: testInfo.outputPath(`search-players-${width}.png`),
        fullPage: true,
      });
    }
  }
  await page.locator('[data-search-play="yutnori"]').click();
  await expect(page).toHaveURL((url) => url.pathname === "/ko/play/yutnori/");
  await expect(page.locator("#start-button")).toBeVisible();
});
