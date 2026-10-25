import { test, expect } from "@playwright/test";

for (const locale of ["en", "ko"] as const) {
  test(`${locale}: compact filters keep games visible and expose indexable answers`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(`/${locale}/search/?mode=multi-player`);
    const disclosure = page.locator("[data-search-refinements]");
    await expect(page.locator("[data-search-result]")).toHaveCount(11);
    await expect(disclosure).not.toHaveAttribute("open");
    await expect(page.locator("#search-filter-count")).toContainText("1");
    expect(
      (await page.locator("[data-search-result]").first().boundingBox())!.y,
    ).toBeLessThan(650);
    await page.screenshot({
      path: testInfo.outputPath(`compact-${locale}-initial.png`),
    });
    await disclosure.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(disclosure).toHaveAttribute("open", "");
    await page.locator('[name="category"]').selectOption("board");
    await page.locator('#search-form button[type="submit"]').click();
    await expect(disclosure).not.toHaveAttribute("open");
    await expect(page.locator("[data-search-result]")).toHaveCount(6);
    await expect(page.locator("#search-filter-count")).toContainText("2");
    await page.screenshot({
      path: testInfo.outputPath(`compact-${locale}.png`),
    });
    await page.locator(".search-guide-link a").click();
    await expect(page).toHaveURL(
      new RegExp(`/${locale}/guides/classic-board-games/$`),
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /^index, follow/,
    );
    await expect(
      page.locator(
        `a[href="/${locale}/search/?mode=single-player&category=board"]`,
      ),
    ).toBeVisible();
    await expect(page.locator("h2")).toContainText([
      locale === "ko"
        ? "혼자 할 게임과 친구와 할 게임은 어떻게 찾나요?"
        : "How do I find a solo game or a game to share?",
    ]);
  });
}

test("search advertising obeys consent and removes the frame for sparse results", async ({
  page,
}) => {
  let requests = 0;
  await page.route("https://bauval.org/**", (route) => {
    requests++;
    return route.fulfill({ contentType: "application/javascript", body: "" });
  });
  await page.goto("/en/search/?mode=multi-player");
  const banner = page.locator("[data-adsterra-search]");
  await expect(page.locator("[data-search-result]")).toHaveCount(11);
  await expect(banner).toBeVisible();
  expect(requests).toBe(0);
  await banner.locator("[data-adsterra-allow]").click();
  await expect.poll(() => requests).toBe(1);
  await expect(banner.locator("iframe")).toHaveCount(1);
  await page.locator('[name="category"]').selectOption("board");
  await expect(page.locator("[data-search-result]")).toHaveCount(6);
  await expect(banner).toBeHidden();
  await expect(banner.locator("iframe")).toHaveCount(0);
  await page.reload();
  await expect(page.locator("[data-search-result]")).toHaveCount(6);
  expect(requests).toBe(1);
  await page.locator('[name="category"]').selectOption("");
  await expect(banner.locator("iframe")).toHaveCount(1);
  await banner.locator("[data-adsterra-revoke]").click();
  await expect(banner.locator("iframe")).toHaveCount(0);
  expect(
    await page.evaluate(() =>
      localStorage.getItem("denny-games.analytics-consent"),
    ),
  ).toBe("denied");
});

test("search keeps GA4 consent separate and excludes terms from page-view commands", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.removeItem("denny-games.analytics-consent"),
  );
  await page.goto("/ko/search/?q=private-test-term&mode=multi-player#private");
  expect(await page.evaluate(() => window.dataLayer)).toBeUndefined();
  await page.locator("[data-analytics-allow]").click();
  const commands = await page.evaluate(() =>
    (window.dataLayer ?? []).map((entry) => Array.from(entry)),
  );
  const config = commands.find((entry) => entry[0] === "config");
  expect(config?.[1]).toBe("G-5NZLTVBG5Y");
  expect(config?.[2]).toMatchObject({
    page_location: new URL(page.url()).origin + "/ko/search/",
  });
  expect(JSON.stringify(commands)).not.toContain("private-test-term");
  expect(
    await page.evaluate(() =>
      localStorage.getItem("denny-games.adsterra-consent.v1"),
    ),
  ).toBeNull();
});

test("pre-consented search errors never request an advertisement", async ({
  page,
}) => {
  let requests = 0;
  await page.route("https://bauval.org/**", (route) => {
    requests++;
    return route.fulfill({ body: "" });
  });
  await page.route("**/search-index.json", (route) => route.abort());
  await page.addInitScript(() =>
    localStorage.setItem("denny-games.adsterra-consent.v1", "allowed"),
  );
  await page.goto("/ko/search/");
  await expect(page.locator("#result-count")).toContainText(
    "검색을 불러오지 못했어요",
  );
  await expect(page.locator("[data-adsterra-search]")).toBeHidden();
  await expect(page.locator("[data-adsterra-search] iframe")).toHaveCount(0);
  expect(requests).toBe(0);
});
