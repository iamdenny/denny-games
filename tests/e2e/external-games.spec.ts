import { test, expect } from "@playwright/test";

const retiredExternalIds = [
  "freedoom",
  "openfront",
  "yourcraft",
  "friday-night-funkin",
];
const publishedCategories = [
  "board",
  "puzzle",
  "arcade",
  "action",
  "shooting",
  "racing",
  "sports",
];

test("public descriptions and search controls promise on-site play", async ({
  page,
  request,
}) => {
  const root = await request.get("/");
  const rootHtml = await root.text();
  expect(rootHtml).toMatch(
    /name="description" content="[^"]*all playable on Denny Games/,
  );

  for (const locale of ["en", "ko"] as const) {
    await page.goto(`/${locale}/`);
    await expect(page.locator(".rail-note")).toContainText(
      locale === "ko" ? "이 사이트 안에서 플레이해요" : "plays right here",
    );
    for (const category of publishedCategories) {
      await page.goto(`/${locale}/category/${category}/`);
      const content = await page.locator("main").innerText();
      expect(content.toLowerCase()).not.toMatch(
        /external links?|external hosts?|independent host|host rules/,
      );
      expect(content).not.toMatch(/외부 링크|외부 호스트|호스트 조건/);
      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(description?.toLowerCase()).not.toMatch(
        /external|independent host|host rules/,
      );
      expect(description).not.toMatch(/외부|호스트/);
    }
    await page.goto(`/${locale}/search/`);
    await expect(
      page.locator('[name="control"] option[value="host"]'),
    ).toHaveCount(0);
  }
});

for (const locale of ["en", "ko"] as const) {
  test(`${locale}: every published game launches on this site`, async ({
    page,
  }) => {
    for (const [width, height] of [
      [320, 800],
      [390, 844],
      [834, 1194],
      [1194, 834],
    ] as const) {
      await page.setViewportSize({ width, height });
      await page.goto(`/${locale}/games/circuit-loop/`);
      const play = page.locator(".detail-actions a.button.primary");
      await expect(play).toHaveAttribute(
        "href",
        `/${locale}/play/circuit-loop/`,
      );
      await expect(play).not.toHaveAttribute("target", "_blank");
      await expect(page.locator(".external-host-note")).toHaveCount(0);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    }

    for (const id of retiredExternalIds) {
      const response = await page.goto(`/${locale}/games/${id}/`);
      expect(response?.status(), `${locale}/${id}`).toBe(404);
    }

    await page.goto(`/${locale}/search/`);
    const searchIndex = await page.evaluate(async (activeLocale) => {
      const response = await fetch(`/${activeLocale}/search-index.json`);
      return (await response.json()) as {
        externalHost?: string;
        externalPlayUrl?: string;
      }[];
    }, locale);
    expect(searchIndex).toHaveLength(207);
    expect(
      searchIndex.every(
        (entry) => !entry.externalHost && !entry.externalPlayUrl,
      ),
    ).toBe(true);
    await expect(page.locator(".external-label")).toHaveCount(0);
  });
}
