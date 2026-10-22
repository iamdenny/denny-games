import { test, expect } from "@playwright/test";

test("beginner links and worked examples are readable without JavaScript in both languages", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 900 },
  });
  const page = await context.newPage();
  for (const locale of ["en", "ko"]) {
    await page.goto(`/${locale}/`);
    await page
      .locator(`.learn-links a[href='/${locale}/games/2048/#learn']`)
      .click();
    await expect(page.locator("#learn")).toBeVisible();
    const examples = page.locator(".merge-example");
    await expect(examples).toHaveCount(3);
    // A newly merged tile must not chain-merge with an existing equal tile.
    await expect(examples.nth(1).locator(".tile-row").nth(1)).toHaveAttribute(
      "aria-label",
      /^4, 4,/,
    );
    await expect(examples.nth(2).locator(".tile-row").nth(1)).toHaveAttribute(
      "aria-label",
      /^8, 8,/,
    );
    await expect(page.locator("[data-share-button]")).toBeHidden();
    await page.locator("[data-share-fallback] summary").click();
    await expect(page.locator("[data-share-url]")).toHaveValue(
      `https://games.iamdenny.com/${locale}/games/2048/`,
    );
    await page.goto(`/${locale}/games/gomoku/#learn`);
    await expect(page.locator(".gomoku-example figcaption")).toBeVisible();
    await page
      .locator(`#learn a[href='/${locale}/collections/classic-board/#choose']`)
      .click();
    await expect(page.locator("#choose li")).toHaveCount(6);
    await page
      .locator(`#choose a[href='/${locale}/games/four-in-a-row/']`)
      .click();
    await expect(
      page.locator(`.detail-actions a[href='/${locale}/play/four-in-a-row/']`),
    ).toBeVisible();
  }
  await context.close();
});

test("sharing sends only the canonical landing URL and blocks duplicate clicks", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async (data: ShareData) => {
        (window as unknown as { shared: ShareData }).shared = data;
        await new Promise<void>((resolve) => {
          (window as unknown as { finishShare: () => void }).finishShare =
            resolve;
        });
      },
    });
  });
  await page.goto("/ko/games/2048/?q=private&seed=123#learn");
  const button = page.locator("[data-share-button]");
  await button.click();
  await expect(button).toBeDisabled();
  await page.evaluate(() =>
    (window as unknown as { finishShare: () => void }).finishShare(),
  );
  await expect(page.locator("[data-share-status]")).toHaveText(
    "공유 창을 열었습니다.",
  );
  const data = await page.evaluate(
    () => (window as unknown as { shared: ShareData }).shared,
  );
  expect(data.url).toBe("https://games.iamdenny.com/ko/games/2048/");
  expect(data.title).toBe("2048 · Denny Games");
  expect(data.text).toBeUndefined();
  await expect(button).toBeEnabled();
});

for (const mode of ["no-share", "rejected", "cancelled", "blocked"] as const) {
  test(`share recovery: ${mode}`, async ({ page }) => {
    await page.addInitScript((mode) => {
      Object.defineProperty(navigator, "share", {
        configurable: true,
        value:
          mode === "no-share"
            ? undefined
            : async () => {
                throw new DOMException(
                  "test",
                  mode === "cancelled" ? "AbortError" : "NotAllowedError",
                );
              },
      });
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async (value: string) => {
            if (mode === "blocked")
              throw new DOMException("blocked", "NotAllowedError");
            (window as unknown as { copied: string }).copied = value;
          },
        },
      });
    }, mode);
    await page.goto("/en/collections/classic-board/?utm_source=test");
    await page.locator("[data-share-button]").click();
    if (mode === "blocked") {
      await expect(page.locator("[data-share-url]")).toBeFocused();
      await expect(page.locator("[data-share-url]")).toHaveValue(
        "https://games.iamdenny.com/en/collections/classic-board/",
      );
      await expect(page.locator("[data-share-status]")).toHaveText(
        "Copy the address below.",
      );
    } else if (mode === "cancelled") {
      await expect(page.locator("[data-share-status]")).toBeEmpty();
      expect(
        await page.evaluate(
          () => (window as unknown as { copied?: string }).copied,
        ),
      ).toBeUndefined();
      await expect(page.locator("[data-share-fallback]")).not.toHaveAttribute(
        "open",
      );
    } else {
      await expect(page.locator("[data-share-status]")).toHaveText(
        "Link copied.",
      );
      expect(
        await page.evaluate(
          () => (window as unknown as { copied: string }).copied,
        ),
      ).toBe("https://games.iamdenny.com/en/collections/classic-board/");
    }
    await expect(page.locator("[data-share-button]")).toBeEnabled();
  });
}

for (const width of [320, 360, 390, 430, 1440]) {
  test(`learning and sharing fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const locale of ["en", "ko"]) {
      for (const path of [
        "",
        "games/2048/",
        "games/gomoku/",
        "collections/classic-board/",
      ]) {
        await page.goto(`/${locale}/${path}`);
        const manual = page.locator("[data-share-fallback]");
        if (await manual.count()) await manual.locator("summary").click();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      }
    }
  });
}
