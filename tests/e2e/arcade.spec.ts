import { test, expect } from "@playwright/test";
test("catalogue, saved games, Korean search and daily routes", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/ko/");
  await expect(page.locator("[data-game-card]")).toHaveCount(29);
  await page.locator('[data-favorite="circuit-loop"]').first().click();
  await page.goto("/ko/library/");
  await expect(
    page.locator('[data-library="favorites"] [data-game-card]:visible'),
  ).toHaveCount(1);
  await page.goto("/ko/search/?q=회로");
  await expect(page.locator("#search-results li")).toHaveCount(2);
  await expect(page.locator("#search-results")).toContainText("서킷 루프");
  await expect(page.locator("#search-results")).toContainText("볼트 키퍼");
  await page.locator("#search-query").fill("<script>");
  await expect(page.locator("#search-empty")).toBeVisible();
  await page.goto("/en/daily/");
  await expect(page.locator("[data-daily]")).toHaveCount(3);
  await expect(page.locator("[data-utc-date]")).toHaveText(
    new Date().toISOString().slice(0, 10),
  );
  expect(errors).toEqual([]);
});
for (const id of ["circuit-loop", "orbit-break", "2048"])
  test(`${id}: play, pause, reload, locale, restart`, async ({ page }) => {
    const errors: string[] = [],
      ads: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => {
      if (/googlesyndication|doubleclick/.test(r.url())) ads.push(r.url());
    });
    await page.goto(`/en/play/${id}/?seed=test-seed&stage=1`);
    await expect(page.locator("#start-button")).toBeEnabled();
    await page.locator("#start-button").click();
    await expect(page.locator("#game-overlay")).toBeHidden();
    if (id === "circuit-loop")
      await page.locator(".circuit-cell").first().click();
    else if (id === "2048") await page.keyboard.press("ArrowLeft");
    else {
      await page.locator(".launch-button").click();
      await page.keyboard.press("ArrowRight");
    }
    await page.keyboard.press("Escape");
    await expect(page.locator("#game-overlay")).toBeVisible();
    const before = await page.evaluate(() =>
      Object.entries(localStorage).find(([key]) => key.includes("progress:")),
    );
    await page.locator('[data-locale-link][lang="ko"]').click();
    await expect(page.locator("#start-button")).toHaveText(/게임 시작/);
    await expect(page).toHaveURL(/seed=test-seed/);
    const after = await page.evaluate(() =>
      Object.entries(localStorage).find(([key]) => key.includes("progress:")),
    );
    expect(after).toEqual(before);
    await page.locator("#start-button").click();
    await page.locator("#restart-button").click();
    await expect(page.locator("#game-overlay")).toBeVisible();
    await expect(page.locator("#score")).toHaveText(
      id === "circuit-loop" ? "1,000" : "0",
    );
    await page.reload();
    await expect(page.locator("#start-button")).toBeEnabled();
    await expect(page.locator("[data-ad-slot]")).toHaveCount(0);
    expect(ads).toEqual([]);
    expect(errors).toEqual([]);
  });
for (const width of [320, 360, 390, 430, 1440])
  test(`responsive ${width}px: catalogue and games`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/ko/",
      "/ko/games/circuit-loop/",
      "/ko/play/circuit-loop/",
      "/ko/play/orbit-break/",
      "/ko/play/2048/",
    ]) {
      await page.goto(route);
      if (route.includes("/play/")) {
        await expect(page.locator("#start-button")).toBeEnabled();
        await page.locator("#start-button").click();
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route,
      ).toBe(true);
    }
  });
test("2048 pointer swipe and denied storage remain playable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = function () {
      throw new DOMException("denied");
    };
  });
  await page.goto("/en/play/2048/");
  await page.locator("#start-button").click();
  const board = page.locator(".merge-board");
  const box = await board.boundingBox();
  await page.mouse.move(box!.x + box!.width - 10, box!.y + 100);
  await page.mouse.down();
  await page.mouse.move(box!.x + 10, box!.y + 100);
  await page.mouse.up();
  await expect(page.locator("#game-message")).toContainText(
    "Saving is unavailable",
  );
  await expect(page.locator("#game-overlay")).toBeHidden();
});
test("synthetic standard pad and disconnect pause; diagnostics are local", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const buttons = Array.from({ length: 17 }, () => ({
      pressed: false,
      touched: false,
      value: 0,
    }));
    const pad = {
      index: 0,
      id: "Synthetic test only",
      mapping: "standard",
      connected: true,
      axes: [0, 0],
      buttons,
      timestamp: 0,
    };
    Object.defineProperty(navigator, "getGamepads", { value: () => [pad] });
    (window as unknown as { testPad: typeof pad }).testPad = pad;
  });
  await page.goto("/en/gamepad-test/");
  await expect(page.locator("#diagnostic")).toContainText(
    "Synthetic test only",
  );
  await page.locator("#touch-test").click();
  await expect(page.locator("#touch-result")).toContainText("1 inputs");
  await page.goto("/en/play/2048/");
  await page.locator("#start-button").click();
  await page.evaluate(() => {
    const pad = (
      window as unknown as { testPad: { buttons: { pressed: boolean }[] } }
    ).testPad;
    pad.buttons[14]!.pressed = true;
  });
  await page.waitForTimeout(220);
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await expect(page.locator("#game-overlay")).toBeVisible();
  await page.locator("#start-button").click();
  await page.evaluate(() => {
    const event = new Event("gamepaddisconnected");
    Object.defineProperty(event, "gamepad", { value: { index: 0 } });
    window.dispatchEvent(event);
  });
  await expect(page.locator("#overlay-note")).toHaveText(
    "Controller disconnected.",
  );
});
test("Circuit can finish, score hint and share fallback without clipboard", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { value: undefined });
    Object.defineProperty(navigator, "clipboard", { value: undefined });
  });
  await page.goto("/en/play/circuit-loop/?seed=solvable");
  await page.locator("#start-button").click();
  for (let i = 0; i < 36; i++) {
    if (await page.locator("#game-overlay").isVisible()) break;
    await page.locator(".game-hint").click();
  }
  await expect(page.locator("#overlay-title")).toHaveText("Nicely done!");
  await page.locator("#share-button").click();
  await expect(page.locator("#share-fallback")).toBeVisible();
  await expect(page.locator("#share-fallback")).toHaveValue(
    /Hint used[\s\S]*seed=solvable/,
  );
});

test("Circuit exposes its 30-board campaign and advances after a solved board", async ({
  page,
}) => {
  await page.goto("/ko/play/circuit-loop/?seed=campaign&stage=1");
  await expect(page.locator("#stage-progress")).toHaveText("스테이지 1 / 30");
  await page.locator("#start-button").click();
  for (let i = 0; i < 36; i++) {
    if (await page.locator("#game-overlay").isVisible()) break;
    await page.locator(".game-hint").click();
  }
  await expect(page.locator("#overlay-title")).toHaveText("멋지게 해냈어요!");
  await expect(page.locator("#next-stage")).toBeVisible();
  await expect(page.locator("#next-stage")).toHaveText("다음 스테이지 2 / 30");
  await page.locator("#next-stage").click();
  await expect(page).toHaveURL(/stage=2/);
  await expect(page.locator("#stage-progress")).toHaveText("스테이지 2 / 30");
  await expect(page.locator("#game-overlay")).toBeVisible();
  await expect(page.locator("#next-stage")).toBeHidden();
});

test("last multi-stage win offers a clear return to stage one", async ({
  page,
}) => {
  await page.goto("/en/play/circuit-loop/?seed=campaign&stage=30");
  await expect(page.locator("#stage-progress")).toHaveText("Stage 30 / 30");
  await page.locator("#start-button").click();
  for (let i = 0; i < 36; i++) {
    if (await page.locator("#game-overlay").isVisible()) break;
    await page.locator(".game-hint").click();
  }
  await expect(page.locator("#next-stage")).toHaveText(
    "Start again from stage 1",
  );
  await page.locator("#next-stage").click();
  await expect(page).toHaveURL(/stage=1/);
  await expect(page.locator("#stage-progress")).toHaveText("Stage 1 / 30");
});

test("late puzzle stages retain touch targets and arcade drag aligns with the visible board", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/en/play/circuit-loop/?stage=30");
  await page.locator("#start-button").click();
  const cell = await page.locator(".circuit-cell").first().boundingBox();
  expect(cell!.width).toBeGreaterThanOrEqual(48);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en/play/orbit-break/");
  await page.locator("#start-button").click();
  const canvas = await page.locator("canvas").boundingBox();
  expect(canvas!.width / canvas!.height).toBeCloseTo(640 / 680, 2);
  await page.mouse.move(
    canvas!.x + canvas!.width * 0.8,
    canvas!.y + canvas!.height * 0.95,
  );
  await page.mouse.down();
  await page.mouse.up();
  await page.keyboard.press("Escape");
  const paddle = await page.evaluate(() => {
    const entry = Object.entries(localStorage).find(([key]) =>
      key.includes("progress:orbit-break"),
    );
    return JSON.parse(entry![1]).paddle;
  });
  expect(paddle).toBeCloseTo(512, 0);
});
