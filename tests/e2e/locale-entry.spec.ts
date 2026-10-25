import { test, expect } from "@playwright/test";

for (const [browserLocale, destination] of [
  ["ko-KR", "ko"],
  ["en-US", "en"],
  ["ja-JP", "en"],
] as const) {
  test(`root opens ${destination} for ${browserLocale}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ locale: browserLocale });
    const page = await context.newPage();
    await page.goto("/?ref=first-visit#main");
    await expect(page).toHaveURL(`/${destination}/?ref=first-visit#main`);
    await expect(page.locator("html")).toHaveAttribute("lang", destination);
    await expect(page.locator("[data-game-card]").first()).toBeVisible();
    await expect(page.locator(".root-choice")).toHaveCount(0);
    await context.close();
  });
}

for (const [languages, language, destination] of [
  [["fr-FR", "ko-KR", "en-US"], "fr-FR", "ko"],
  [["en-GB", "ko-KR"], "en-GB", "en"],
  [["KO-KR"], "KO-KR", "ko"],
  [[], "ko-KR", "ko"],
  [[], "", "en"],
] as const) {
  test(`root preference ${JSON.stringify(languages)} / ${language}`, async ({
    page,
  }) => {
    await page.addInitScript(
      ({ languages, language }) => {
        Object.defineProperty(navigator, "languages", { get: () => languages });
        Object.defineProperty(navigator, "language", { get: () => language });
      },
      { languages, language },
    );
    await page.goto("/");
    await expect(page).toHaveURL(`/${destination}/`);
  });
}

test("explicit locale and manual switching override browser language", async ({
  browser,
}) => {
  const context = await browser.newContext({ locale: "ko-KR" });
  const page = await context.newPage();
  await page.goto("/en/games/2048/?ref=shared#main");
  await expect(page).toHaveURL("/en/games/2048/?ref=shared#main");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.locator('[data-locale-link][lang="ko"]').click();
  await expect(page).toHaveURL("/ko/games/2048/?ref=shared#main");
  await page.locator('[data-locale-link][lang="en"]').click();
  await expect(page).toHaveURL("/en/games/2048/?ref=shared#main");
  await context.close();
});

test("back navigation skips the root selector", async ({ page }) => {
  await page.goto("/en/about/");
  await page.goto("/");
  await expect(page).toHaveURL("/en/");
  await page.goBack();
  await expect(page).toHaveURL("/en/about/");
});

test("root keeps bilingual links and verification metadata without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page).toHaveURL("/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://games.iamdenny.com/",
  );
  await expect(
    page.locator('meta[name="naver-site-verification"]'),
  ).toHaveCount(1);
  await expect(page.locator('meta[name="msvalidate.01"]')).toHaveCount(1);
  await expect(page.locator('.root-choice a[lang="en"]')).toBeVisible();
  await page.locator('.root-choice a[lang="ko"]').click();
  await expect(page).toHaveURL("/ko/");
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  await context.close();
});

// Header links must work before the deferred site bundle finishes loading.
test("locale links preserve queries and fragments without external scripts", async ({
  page,
}) => {
  await page.route("**/*.js", (route) => route.abort());
  await page.goto("/en/games/2048/?ref=shared#main");
  await page.locator('[data-locale-link][lang="ko"]').click();
  await expect(page).toHaveURL("/ko/games/2048/?ref=shared#main");
  await page.locator('[data-locale-link][lang="en"]').click();
  await expect(page).toHaveURL("/en/games/2048/?ref=shared#main");
});
