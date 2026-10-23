import { test, expect } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

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
      () => (window as Window & { dataLayer?: IArguments[] }).dataLayer,
    ),
  ).toBeUndefined();

  await page.getByRole("button", { name: "분석 허용" }).click();
  await expect(panel).toBeHidden();
  expect(
    await page.evaluate(() =>
      localStorage.getItem("denny-games.analytics-consent"),
    ),
  ).toBe("granted-v2");

  const commands = await page.evaluate(() => {
    const dataLayer =
      (window as Window & { dataLayer?: IArguments[] }).dataLayer ?? [];
    return {
      types: dataLayer.map((command) =>
        Object.prototype.toString.call(command),
      ),
      values: dataLayer.map((command) => Array.from(command)),
    };
  });
  expect(commands.types).toEqual(["[object Arguments]", "[object Arguments]"]);
  const config = commands.values.find(
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
  await page.getByRole("button", { name: "Decline", exact: true }).click();
  await expect(page.locator("[data-analytics-consent]")).toBeHidden();
  expect(
    await page.evaluate(() =>
      localStorage.getItem("denny-games.analytics-consent"),
    ),
  ).toBe("denied");
  expect(
    await page.evaluate(
      () => (window as Window & { dataLayer?: IArguments[] }).dataLayer,
    ),
  ).toBeUndefined();

  await page.goto("/en/privacy/");
  await expect(page.locator("[data-analytics-consent]")).toBeHidden();
  await page.getByRole("button", { name: "Manage analytics choice" }).click();
  await expect(page.locator("[data-analytics-consent]")).toBeVisible();
  await page.getByRole("button", { name: "Allow analytics" }).click();
  await expect(page.locator("[data-analytics-consent]")).toBeHidden();

  await page.getByRole("button", { name: "Manage analytics choice" }).click();
  await page.getByRole("button", { name: "Decline", exact: true }).click();
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

test("consent choices synchronize across open tabs", async ({ context }) => {
  const firstTab = await context.newPage();
  const secondTab = await context.newPage();
  await firstTab.goto("/en/");
  await secondTab.goto("/ko/");

  await firstTab.getByRole("button", { name: "Allow analytics" }).click();
  await expect(secondTab.locator("[data-analytics-consent]")).toBeHidden();
  expect(
    await secondTab.evaluate(
      () => (window as Window & { dataLayer?: IArguments[] }).dataLayer?.length,
    ),
  ).toBe(2);

  await firstTab.goto("/en/privacy/");
  await firstTab
    .getByRole("button", { name: "Manage analytics choice" })
    .click();
  await firstTab.getByRole("button", { name: "Decline", exact: true }).click();
  await expect(secondTab.locator("[data-analytics-consent]")).toBeHidden();
  expect(
    await secondTab.evaluate(
      () =>
        (window as unknown as Record<string, unknown>)[
          "ga-disable-G-5NZLTVBG5Y"
        ],
    ),
  ).toBe(true);
});

test("old permission is renewed before real game starts are counted", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("denny-games.analytics-consent", "granted"),
  );
  await page.goto("/en/play/2048/");
  await expect(page.locator("[data-analytics-consent]")).toBeVisible();
  await expect(
    page.locator('script[src*="googletagmanager.com/gtag/js"]'),
  ).toHaveCount(0);
  await page.locator("[data-analytics-allow]").click();
  const events = () =>
    page.evaluate(() =>
      (window.dataLayer ?? [])
        .map((entry) => Array.from(entry))
        .filter((entry) => entry[0] === "event"),
    );
  expect(await events()).toEqual([]);
  await page.locator("#start-button").click();
  await page.locator("#pause-button").click();
  await page.locator("#start-button").click();
  expect(await events()).toEqual([
    [
      "event",
      "game_start",
      {
        send_to: "G-5NZLTVBG5Y",
        game_id: "2048",
        page_location: `${new URL(page.url()).origin}/en/play/2048/`,
        page_referrer: "",
      },
    ],
  ]);
});

test("restored terminal rounds do not create a phantom game start", async ({
  page,
}) => {
  const { newPop } = await import("../../src/games/prism-pop/rules");
  const saved = newPop(1);
  saved.status = "won";
  saved.balls = [];
  saved.score = 1000;
  await page.addInitScript((state) => {
    localStorage.setItem("denny-games.analytics-consent", "granted-v2");
    localStorage.setItem(
      "denny-games:v1:progress:prism-pop:v1:prism-pop:v1:normal:1",
      JSON.stringify(state),
    );
  }, saved);
  await page.goto("/en/play/prism-pop/");
  await page.locator("#start-button").click();
  await expect(page.locator("#next-stage")).toBeVisible();
  expect(
    await page.evaluate(() =>
      (window.dataLayer ?? [])
        .map((x) => Array.from(x))
        .filter((x) => x[0] === "event"),
    ),
  ).toEqual([]);
});
