import { test, expect } from "@playwright/test";
test("verification and static affiliate cards make no provider requests before a click", async ({
  page,
  request,
}) => {
  const requests: string[] = [];
  page.on("request", (req) => {
    if (/googlesyndication|doubleclick|coupang/.test(req.url()))
      requests.push(req.url());
  });
  for (const locale of ["ko", "en"]) {
    await page.goto(`/${locale}/`);
    await expect(
      page.locator('meta[name="google-adsense-account"]'),
    ).toHaveAttribute("content", "ca-pub-3539037484563455");
    const card = page.locator('[data-affiliate="coupang"]');
    await expect(card).toHaveCount(1);
    await expect(card.locator("a")).toHaveAttribute(
      "href",
      "https://link.coupang.com/a/hLh0ZMTttc",
    );
    await expect(card.locator("a")).toHaveAttribute("rel", /sponsored/);
    await expect(card.locator(".affiliate-disclosure")).toBeVisible();
    await expect(page.locator("[data-ad-slot]:visible")).toHaveCount(0);
  }
  const sellers = await request.get("/ads.txt");
  expect(await sellers.text()).toBe(
    "google.com, pub-3539037484563455, DIRECT, f08c47fec0942fa0\n",
  );
  expect(requests).toEqual([]);
});

test("affiliate cards fit narrow screens and stay outside gameplay", async ({
  page,
}) => {
  for (const width of [320, 390, 430]) {
    await page.setViewportSize({ width, height: 844 });
    for (const path of ["/ko/", "/en/", "/ko/games/2048/"]) {
      await page.goto(path);
      const card = page.locator('[data-affiliate="coupang"]');
      await card.scrollIntoViewIfNeeded();
      await expect(card).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  }
  for (const path of [
    "/ko/play/2048/",
    "/ko/search/",
    "/ko/library/",
    "/ko/gamepad-test/",
  ]) {
    await page.goto(path);
    await expect(page.locator('[data-affiliate="coupang"]')).toHaveCount(0);
  }
});
