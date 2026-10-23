import { expect, test } from "@playwright/test";
import fs from "node:fs";

type JegiWindow = Window & {
  __jegiStatusObserver?: MutationObserver;
  __jegiStatusMutations?: () => number;
};

test.describe.configure({ mode: "serial" });

async function begin(page: import("@playwright/test").Page, route: string) {
  await page.clock.install();
  await page.goto(route);
  await page.locator("#start-button").click();
  await expect(page.locator('canvas[data-game="jegi-rally"]')).toBeVisible();
}

async function kickAtTarget(
  page: import("@playwright/test").Page,
  targetMs: number,
) {
  await page.clock.runFor(Math.max(0, targetMs - 100));
  await page.locator('[data-action="kick"]').click();
}

for (const [locale, title] of [
  [
    "en",
    "How to play Jegichagi: single-foot, alternating and back-foot styles",
  ],
  ["ko", "제기차기 하는 법: 외발·양발·뒷발 방식 알아보기"],
] as const) {
  test(`${locale}: Jegi Rally detail, guide, collection and search discovery`, async ({
    page,
    request,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const index = await (
      await request.get(`/${locale}/search-index.json`)
    ).json();
    expect(
      index.filter((game: { id: string }) => game.id === "jegi-rally"),
    ).toHaveLength(1);

    await page.goto(`/${locale}/games/jegi-rally/`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://games.iamdenny.com/${locale}/games/jegi-rally/`,
    );
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      locale === "ko" ? "제기 랠리" : "Jegi Rally",
    );

    await page.goto(`/${locale}/guides/jegichagi-rules/`);
    await expect(
      page.getByRole("heading", { level: 1, name: title }),
    ).toBeVisible();
    await expect(
      page.locator(`a[href="/${locale}/play/jegi-rally/"]`),
    ).toBeVisible();
    await expect(
      page.locator('a[href^="https://www.mcst.go.kr/"]'),
    ).toBeVisible();

    await page.goto(`/${locale}/collections/traditional-games/`);
    await expect(page.locator("[data-game-card]")).toHaveCount(3);
    await expect(
      page.locator(`a[href="/${locale}/games/jegi-rally/"]`),
    ).toBeVisible();

    const llms = await (await request.get("/llms.txt")).text();
    expect(llms).toContain(`/${locale}/guides/jegichagi-rules/`);
    expect(errors).toEqual([]);
  });
}

test("completes the six-kick single-foot round and restores its terminal result once", async ({
  page,
}) => {
  await begin(page, "/en/play/jegi-rally/?seed=jegi-six&stage=1");
  const canvas = page.locator('canvas[data-game="jegi-rally"]');
  await page.getByRole("button", { name: "Right foot" }).click();
  for (let hit = 1; hit <= 6; hit++) {
    await kickAtTarget(page, 1500);
    await expect(canvas).toHaveAttribute("data-hits", String(hit));
  }
  await expect(page.locator("#next-stage")).toBeVisible();
  await page.reload();
  await page.locator("#start-button").click();
  await expect(page.locator("#next-stage")).toBeVisible();
  await expect(canvas).toHaveAttribute("data-phase", "won");
  await expect(canvas).toHaveAttribute("data-hits", "6");
});

test("stage two rejects the repeated foot, recovers, pauses and resumes one flight", async ({
  page,
}) => {
  await begin(page, "/en/play/jegi-rally/?seed=jegi-alternating&stage=2");
  const canvas = page.locator('canvas[data-game="jegi-rally"]');
  await page.getByRole("button", { name: "Right foot" }).click();
  await kickAtTarget(page, 1300);
  await expect(canvas).toHaveAttribute("data-hits", "1");

  await kickAtTarget(page, 1300);
  await expect(canvas).toHaveAttribute("data-misses", "1");
  await page.getByRole("button", { name: "Left foot, required" }).click();
  await kickAtTarget(page, 1300);
  await expect(canvas).toHaveAttribute("data-hits", "2");

  await page.clock.runFor(400);
  await page.locator("#pause-button").click();
  const frozenAt = await page
    .locator(".jegi-flight-track")
    .getAttribute("aria-valuenow");
  await page.clock.runFor(500);
  await expect(page.locator(".jegi-flight-track")).toHaveAttribute(
    "aria-valuenow",
    frozenAt!,
  );
  await page.locator("#start-button").click();
  await page.clock.runFor(150);
  await expect
    .poll(() =>
      page.locator(".jegi-flight-track").getAttribute("aria-valuenow"),
    )
    .not.toBe(frozenAt);
});

test("keyboard and reduced-motion play remain usable across phone, tablet and desktop", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await begin(page, "/ko/play/jegi-rally/?seed=jegi-keyboard&stage=3");
  const canvas = page.locator('canvas[data-game="jegi-rally"]');
  await page.evaluate(() => {
    let mutations = 0;
    const observer = new MutationObserver((records) => {
      mutations += records.length;
    });
    observer.observe(document.querySelector(".jegi-status")!, {
      childList: true,
      characterData: true,
      subtree: true,
    });
    const jegiWindow = window as JegiWindow;
    jegiWindow.__jegiStatusObserver = observer;
    jegiWindow.__jegiStatusMutations = () => mutations;
  });
  await page.clock.runFor(500);
  expect(
    await page.evaluate(() => (window as JegiWindow).__jegiStatusMutations?.()),
  ).toBe(0);
  await page.evaluate(() =>
    (window as JegiWindow).__jegiStatusObserver?.disconnect(),
  );
  await page.keyboard.press("ArrowRight");
  await expect(canvas).toHaveAttribute("data-selected", "right");
  await page.keyboard.press("ArrowUp");
  await expect(canvas).toHaveAttribute("data-selected", "back");
  await page.keyboard.press("ArrowLeft");
  await expect(canvas).toHaveAttribute("data-selected", "left");
  // Browser time continues between protocol commands, so wait on the live
  // timing indicator after keyboard selection before sending the kick.
  await expect(canvas).toHaveAttribute("data-window", "true");
  await page.keyboard.press("Space");
  await expect(canvas).toHaveAttribute("data-hits", "1");

  for (const viewport of [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
    { width: 810, height: 1080 },
    { width: 1440, height: 900 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(viewport);
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    const board = await canvas.boundingBox();
    expect(board).not.toBeNull();
    expect(board!.width).toBeGreaterThan(80);
    expect(board!.height).toBeGreaterThan(70);
    expect(board!.x).toBeGreaterThanOrEqual(-1);
    expect(board!.x + board!.width).toBeLessThanOrEqual(viewport.width + 1);
    for (const button of await page
      .locator(".jegi-controls button:visible")
      .all()) {
      const box = await button.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(48);
      expect(box!.width).toBeGreaterThanOrEqual(48);
      expect(box!.x).toBeGreaterThanOrEqual(-1);
      expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width + 1);
    }
    for (const label of await page
      .locator(".jegi-technique-label:visible")
      .all()) {
      const fontSize = await label.evaluate((element) =>
        parseFloat(getComputedStyle(element).fontSize),
      );
      expect(fontSize).toBeGreaterThanOrEqual(12);
    }
  }
});

test("captures a real Jegi Rally playfield", async ({ page }, info) => {
  test.skip(
    !process.env.CAPTURE_JEGI,
    "Explicit gameplay screenshot capture only",
  );
  await page.setViewportSize({ width: 1440, height: 900 });
  await begin(page, "/en/play/jegi-rally/?seed=jegi-art&stage=3");
  await page.clock.runFor(1050);
  await expect(page.locator('canvas[data-game="jegi-rally"]')).toHaveAttribute(
    "data-window",
    "true",
  );
  fs.mkdirSync("public/art/screenshots", { recursive: true });
  const path = "public/art/screenshots/jegi-rally.png";
  await page.locator("#player").screenshot({ path });
  await info.attach("jegi-rally-gameplay", {
    path,
    contentType: "image/png",
  });
  await page.setViewportSize({ width: 390, height: 844 });
  const mobilePath = info.outputPath("jegi-rally-mobile.png");
  await page.locator("#player").screenshot({ path: mobilePath });
  await info.attach("jegi-rally-mobile", {
    path: mobilePath,
    contentType: "image/png",
  });
  await page.setViewportSize({ width: 844, height: 390 });
  const landscapePath = info.outputPath("jegi-rally-landscape.png");
  await page.locator("#player").screenshot({ path: landscapePath });
  await info.attach("jegi-rally-landscape", {
    path: landscapePath,
    contentType: "image/png",
  });
});
