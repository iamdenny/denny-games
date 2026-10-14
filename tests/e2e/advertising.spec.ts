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
  for (const path of [
    "/ko/gamepad-test/",
    "/ko/controller-games/",
    "/ko/guides/controller-not-detected/",
  ]) {
    await page.goto(path);
    await expect(page.locator('[data-affiliate="coupang"]')).toHaveCount(1);
  }
  expect(requests).toEqual([]);
});

test("affiliate cards fit narrow screens and stay outside gameplay", async ({
  page,
}) => {
  for (const width of [320, 390, 430]) {
    await page.setViewportSize({ width, height: 844 });
    for (const path of [
      "/ko/",
      "/en/",
      "/ko/games/2048/",
      "/ko/gamepad-test/",
      "/ko/controller-games/",
      "/ko/guides/controller-not-detected/",
    ]) {
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
    "/en/gamepad-test/",
    "/en/controller-games/",
    "/en/guides/controller-not-detected/",
  ]) {
    await page.goto(path);
    await expect(page.locator('[data-affiliate="coupang"]')).toHaveCount(0);
  }
});

test("affiliate links support Korean controller-intent pages only", async ({
  page,
}) => {
  for (const path of [
    "/ko/gamepad-test/",
    "/ko/controller-games/",
    "/ko/guides/controller-not-detected/",
  ]) {
    await page.goto(path);
    const card = page.locator('[data-affiliate="coupang"]');
    await expect(card).toHaveCount(1);
    await expect(card.locator("small")).toContainText("쿠팡 파트너스");
    await expect(card.locator(".affiliate-disclosure")).toBeVisible();
    await expect(card.locator("a")).toHaveAttribute("rel", /sponsored/);
  }
  for (const path of [
    "/en/gamepad-test/",
    "/en/controller-games/",
    "/en/guides/controller-not-detected/",
  ]) {
    await page.goto(path);
    await expect(page.locator('[data-affiliate="coupang"]')).toHaveCount(0);
  }
});

test("contact pages expose a public partnership inquiry in both locales", async ({
  page,
}) => {
  for (const locale of ["ko", "en"] as const) {
    await page.goto(`/${locale}/contact/`);
    const section = page.locator(".note-card");
    await expect(section).toHaveCount(1);
    await expect(section.getByRole("heading")).toBeVisible();
    await expect(section).toContainText(
      locale === "ko" ? "공개됩니다" : "are public",
    );
    await expect(section).toContainText(
      locale === "ko" ? "보장하지 않습니다" : "not guaranteed",
    );
    await expect(
      section.getByRole("link", {
        name:
          locale === "ko" ? /광고·제휴 제안하기/ : /Send a partnership inquiry/,
      }),
    ).toHaveAttribute(
      "href",
      "https://github.com/iamdenny/denny-games/issues/new?template=partnership-inquiry.yml",
    );
    await expect(section.getByRole("link")).toHaveAttribute("target", "_blank");
    await expect(section.getByRole("link")).toHaveAttribute("rel", /noopener/);
  }
});
