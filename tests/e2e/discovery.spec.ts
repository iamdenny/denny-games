import { test, expect } from "@playwright/test";

test("categories and guide remain discoverable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("/ko/category/action/");
  await page.getByRole("link", { name: "2", exact: true }).click();
  await expect(page).toHaveTitle(/2페이지/);
  await expect(page.locator("[data-game-card]")).toHaveCount(24);
  await page.locator("[data-game-card] a").first().click();
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(
    1,
  );
  await expect(
    page.getByRole("heading", { name: "나에게 맞는 조작", exact: true }),
  ).toBeVisible();
  await page.goto("/ko/guides/open-browser-games/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "무료 웹게임 안내",
  );
  await expect(
    page.getByRole("link", { name: "Crisp MIT 라이선스와 고정 소스" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await context.close();
});
