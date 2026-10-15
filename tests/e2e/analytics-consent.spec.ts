import { test, expect } from "@playwright/test";

test("GA4 stays unloaded until the visitor allows it and strips URL details", async ({
  page,
}) => {
  await page.goto("/ko/?q=private-search-term#private-fragment");

  const panel = page.locator("[data-analytics-consent]");
  await expect(panel).toBeVisible();
  await expect(panel).toContainText("검색어·입력값·게임 점수는 보내지 않으며");
  await expect(
    page.locator('script[src*="googletagmanager.com/gtag/js"]'),
  ).toHaveCount(0);
  expect(
    await page.evaluate(
      () => (window as Window & { dataLayer?: unknown[][] }).dataLayer,
    ),
  ).toBeUndefined();

  await page.getByRole("button", { name: "분석 허용" }).click();
  await expect(panel).toBeHidden();
  expect(
    await page.evaluate(() =>
      localStorage.getItem("denny-games.analytics-consent"),
    ),
  ).toBe("granted");

  const commands = await page.evaluate(
    () => (window as Window & { dataLayer?: unknown[][] }).dataLayer ?? [],
  );
  const config = commands.find(
    (command) => Array.isArray(command) && command[0] === "config",
  ) as unknown[] | undefined;
  expect(config?.[1]).toBe("G-5NZLTVBG5Y");
  expect(config?.[2]).toMatchObject({
    page_location: `${new URL(page.url()).origin}/ko/`,
    page_referrer: "",
    cookie_domain: "games.iamdenny.com",
    cookie_prefix: "dennygames",
    cookie_expires: 5_184_000,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
});

test("visitors can decline or withdraw analytics from the privacy page", async ({
  page,
}) => {
  await page.goto("/en/");
  await page.getByRole("button", { name: "Decline" }).click();
  await expect(page.locator("[data-analytics-consent]")).toBeHidden();
  expect(
    await page.evaluate(() =>
      localStorage.getItem("denny-games.analytics-consent"),
    ),
  ).toBe("denied");
  expect(
    await page.evaluate(
      () => (window as Window & { dataLayer?: unknown[][] }).dataLayer,
    ),
  ).toBeUndefined();

  await page.goto("/en/privacy/");
  await expect(page.locator("[data-analytics-consent]")).toBeHidden();
  await page.getByRole("button", { name: "Manage analytics choice" }).click();
  await expect(page.locator("[data-analytics-consent]")).toBeVisible();
  await page.getByRole("button", { name: "Allow analytics" }).click();
  await expect(page.locator("[data-analytics-consent]")).toBeHidden();

  await page.getByRole("button", { name: "Manage analytics choice" }).click();
  await page.getByRole("button", { name: "Decline" }).click();
  expect(
    await page.evaluate(
      () =>
        (window as unknown as Record<string, unknown>)[
          "ga-disable-G-5NZLTVBG5Y"
        ],
    ),
  ).toBe(true);
  expect(
    await page.evaluate(() =>
      localStorage.getItem("denny-games.analytics-consent"),
    ),
  ).toBe("denied");

  await page.goto("/ko/");
  await expect(page.locator("[data-analytics-consent]")).toBeHidden();
  await expect(
    page.locator('script[src*="googletagmanager.com/gtag/js"]'),
  ).toHaveCount(0);
});
