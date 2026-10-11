import { test, expect } from "@playwright/test";
// Lexical globals exposed by the pinned DANGO script inside its frame.
declare let stickTicks: number;
declare let expStr: string;
declare const expAdd: number;

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

test("DANGO calculates collected expressions under the restricted CSP", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/ko/play/crisp-dango/");
  await page.locator("#start-button").click();
  const frame = page
    .frames()
    .find((item) => item.url().includes("/vendor/crisp/index.html"))!;
  await frame.waitForFunction(() => Number(document.body.dataset.ticks) > 5);
  await page.locator("#pause-button").click();
  for (const [expression, expected] of [
    ["2+3*4", 14],
    ["+2*3+4", 10],
    ["*9+2", 2],
    ["", 0],
  ] as const) {
    await frame.evaluate((expression) => {
      stickTicks = 19;
      expStr = expression;
    }, expression);
    await page.locator("#pause-button").click();
    // Let the existing engine callback execute under CSP; DevTools evaluation
    // itself can bypass unsafe-eval and must not execute update() for this test.
    await frame.waitForFunction(
      (expected) => expAdd === expected && stickTicks === 0,
      expected,
    );
    await page.locator("#pause-button").click();
    expect(await frame.evaluate(() => expAdd)).toBe(expected);
  }
  expect(errors).toEqual([]);
});
