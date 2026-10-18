import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";

test("curated collections and device instructions are readable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 800 },
  });
  const page = await context.newPage();
  for (const locale of ["en", "ko"]) {
    await page.goto(`/${locale}/collections/one-button/`);
    await expect(page.locator("[data-game-card]")).toHaveCount(12);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const graph = JSON.parse(
      (await page
        .locator('script[type="application/ld+json"]')
        .textContent()) ?? "{}",
    )["@graph"];
    expect(
      graph.find((node: { "@type": string }) => node["@type"] === "ItemList")
        .numberOfItems,
    ).toBe(12);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.locator("[data-game-card] a").first().click();
    await expect(page).toHaveURL(/games\/crisp-accelb/);
    await page.goto(`/${locale}/guides/test-your-device/`);
    await expect(
      page.locator(`a[href='/${locale}/device-check/']`),
    ).toBeVisible();
  }
  await context.close();
});

test("search composes filters, preserves URL and language, handles history and resets", async ({
  page,
}) => {
  await page.goto("/en/search/?category=racing&control=buttons&length=short");
  await expect(page.locator("#search-results li").first()).toBeVisible();
  await expect(page.locator('[name="category"]')).toHaveValue("racing");
  await page.locator("#search-query").fill("PARKING");
  await expect(page.locator("#search-results li")).toHaveCount(1);
  await expect(page.locator("#search-results")).toContainText("PARKING");
  await expect(page.locator('[data-locale-link][lang="ko"]')).toHaveAttribute(
    "href",
    /q=PARKING.*category=racing/,
  );
  await page.reload();
  await expect(page.locator("#search-results li")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  await expect(page.locator("#search-results li")).toHaveCount(24);
  await page
    .locator("#search-pages")
    .getByRole("link", { name: "2", exact: true })
    .click();
  await expect(page).toHaveURL(/page=2/);
  const secondId = await page
    .locator("#search-results li")
    .first()
    .getAttribute("data-search-result");
  await page.reload();
  await expect(page.locator("#search-results li").first()).toHaveAttribute(
    "data-search-result",
    secondId!,
  );
  await page.locator('[name="category"]').selectOption("sports");
  await page.locator('[name="control"]').selectOption("numbers");
  await expect(page.locator("#search-empty")).toBeVisible();
  await page.goBack();
  await expect(page.locator('[name="control"]')).toHaveValue("");
  await expect(page.locator("#search-results li")).toHaveCount(12);
  await page.goto(
    "/ko/search/?page=Infinity&category=unknown&control=forged&length=invalid",
  );
  await expect(page.locator("#search-results li")).toHaveCount(24);
  await expect(page).toHaveURL(/\/ko\/search\/$/);
});

test("device report downloads actual chosen observations with no upload", async ({
  page,
}) => {
  const mutations: string[] = [];
  page.on("request", (request) => {
    if (request.method() !== "GET") mutations.push(request.url());
  });
  await page.goto("/ko/device-check/?game=2048");
  await expect(page.locator("#device-game")).toHaveValue("2048");
  await page.locator("#device-environment").fill("local test / Chromium");
  await page.locator("#check-pause").selectOption("pass");
  await page.locator("#check-input").selectOption("fail");
  const downloading = page.waitForEvent("download");
  await page.locator("#device-download").click();
  const download = await downloading;
  const report = JSON.parse(
    await fs.readFile((await download.path())!, "utf8"),
  );
  expect(report.gameId).toBe("2048");
  expect(report.certified).toBe(false);
  expect(report.checks.pause).toBe("pass");
  expect(report.checks.input).toBe("fail");
  expect(report.checks.soak).toBe("not-tested");
  expect(mutations).toEqual([]);
  await page.reload();
  await expect(page.locator("#check-pause")).toHaveValue("not-tested");
  await expect(page.locator("#device-environment")).toHaveValue("");
});

for (const width of [320, 390, 1440])
  test(`discovery and checklist fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "en/search/",
      "ko/collections/point-and-play/",
      "ko/device-check/",
    ]) {
      await page.goto(`/${path}`);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await expect(page.locator('[data-affiliate="coupang"]')).toHaveCount(0);
      for (const select of await page
        .locator(".search-filters select, .device-check-form select")
        .all())
        expect((await select.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    }
  });
