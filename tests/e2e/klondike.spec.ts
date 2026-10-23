import { expect, test } from "@playwright/test";

for (const locale of ["en", "ko"] as const) {
  test(`${locale}: Klondike game and rules guide stay on the local site`, async ({
    page,
  }) => {
    const externalRequests: string[] = [];
    page.on("request", (request) => {
      const url = new URL(request.url());
      if (url.hostname !== "127.0.0.1") externalRequests.push(url.href);
    });
    await page.goto(`/${locale}/games/klondike-solitaire/`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      locale === "en" ? "Solitaire" : "솔리테어",
    );
    await page
      .locator(`a[href="/${locale}/guides/klondike-solitaire/"]`)
      .click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      locale === "en" ? "Klondike" : "클론다이크",
    );
    await expect(
      page.locator(`a[href="/${locale}/play/klondike-solitaire/"]`),
    ).toBeVisible();
    await page.goto(`/${locale}/play/klondike-solitaire/?seed=browser-check`);
    await expect(page.locator(".klondike-setup")).toBeVisible();
    await page.locator(".klondike-setup [data-draw-choice='3']").click();
    await page.locator("#start-button").click();
    await expect(page.locator(".klondike-board")).toHaveAttribute(
      "data-draw-count",
      "3",
    );
    await expect(page.locator(".klondike-tableau .klondike-card")).toHaveCount(
      7,
    );
    await expect(
      page.locator(".klondike-tableau .klondike-facedown"),
    ).toHaveCount(21);
    expect(externalRequests).toEqual([]);
  });
}

test("Draw 3, undo, hint, explicit new deal and local resume", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en/play/klondike-solitaire/?seed=round-trip");
  await page.locator(".klondike-setup [data-draw-choice='3']").click();
  await page.locator("#start-button").click();

  const board = page.locator(".klondike-board");
  await page.locator("[data-klondike-action='stock']").click();
  await expect(board).toHaveAttribute("data-stock", "21");
  await expect(board).toHaveAttribute("data-waste", "3");
  await expect(
    page.locator(".klondike-waste .klondike-card-face").last(),
  ).toHaveCSS("background-color", "rgb(248, 245, 233)");
  await page.getByRole("button", { name: /hint/i }).click();
  await expect(
    page.locator(".klondike-board .is-hinted").first(),
  ).toBeVisible();

  await page.getByRole("button", { name: /undo/i }).click();
  await expect(board).toHaveAttribute("data-stock", "24");
  await expect(board).toHaveAttribute("data-waste", "0");
  await page.locator("[data-klondike-action='stock']").click();
  await page.reload();
  await page.locator("#start-button").click();
  await expect(board).toHaveAttribute("data-draw-count", "3");
  await expect(board).toHaveAttribute("data-stock", "21");
  await expect(board).toHaveAttribute("data-waste", "3");

  await page.locator(".klondike-tools [data-draw-choice='1']").click();
  await expect(board).toHaveAttribute("data-draw-count", "3");
  await page.getByRole("button", { name: /New deal/ }).click();
  await expect(board).toHaveAttribute("data-draw-count", "1");
  await expect(board).toHaveAttribute("data-stock", "24");
  await expect(board).toHaveAttribute("data-waste", "0");
  await page.locator("[data-klondike-action='stock']").click();
  await expect(board).toHaveAttribute("data-stock", "23");
  await expect(board).toHaveAttribute("data-waste", "1");
  await page.reload();
  await page.locator("#start-button").click();
  await expect(board).toHaveAttribute("data-draw-count", "1");
  await expect(board).toHaveAttribute("data-stock", "23");
  await expect(board).toHaveAttribute("data-waste", "1");
});

test("a completed saved deal can start another game", async ({ page }) => {
  await page.addInitScript(() => {
    const state = {
      dealSeed: "completed-deal",
      drawCount: 3,
      stock: [],
      waste: [],
      foundations: Array.from({ length: 4 }, (_, suit) =>
        Array.from({ length: 13 }, (_, rank) => suit * 13 + rank),
      ),
      tableau: Array.from({ length: 7 }, () => ({ cards: [], down: 0 })),
      moves: 52,
    };
    localStorage.setItem(
      "denny-games:v1:progress:klondike-solitaire:v1:completed-check:1",
      JSON.stringify({
        version: 1,
        routeSeed: "completed-check",
        state,
        history: [],
        nextDrawCount: 3,
      }),
    );
  });
  await page.goto("/en/play/klondike-solitaire/?seed=completed-check");
  await page.locator("#start-button").click();
  const board = page.locator(".klondike-board");
  await expect(board).toHaveAttribute("data-draw-count", "3");
  await expect(board).toHaveAttribute("data-foundations", "0");
  await expect(page.locator("#game-overlay")).toBeHidden();
  await expect(page.locator("[data-klondike-action='stock']")).toBeEnabled();
});

test("occupied foundations and waste cards keep readable card faces", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const state = {
      dealSeed: "face-deal",
      drawCount: 1,
      stock: Array.from({ length: 51 }, (_, card) => card + 1),
      waste: [],
      foundations: [[0], [], [], []],
      tableau: Array.from({ length: 7 }, () => ({ cards: [], down: 0 })),
      moves: 1,
    };
    localStorage.setItem(
      "denny-games:v1:progress:klondike-solitaire:v1:face-check:1",
      JSON.stringify({
        version: 1,
        routeSeed: "face-check",
        state,
        history: [],
        nextDrawCount: 1,
      }),
    );
  });
  await page.goto("/en/play/klondike-solitaire/?seed=face-check");
  await page.locator("#start-button").click();
  const foundation = page.locator(".klondike-foundation.has-card").first();
  await expect(foundation).toHaveCSS("background-color", "rgb(248, 245, 233)");
  await expect(foundation.locator(".klondike-card-face")).toHaveCSS(
    "color",
    "rgb(178, 60, 67)",
  );
  await page.locator("[data-klondike-action='stock']").click();
  const wasteFace = page.locator(".klondike-waste .klondike-card-face");
  await expect(wasteFace).toHaveCSS("background-color", "rgb(248, 245, 233)");
  await expect(wasteFace).toHaveCSS("color", "rgb(23, 44, 39)");
});

test("keyboard and synthetic standard gamepad operate the card piles", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const pad = {
      index: 0,
      id: "Synthetic test only",
      mapping: "standard",
      connected: true,
      axes: [0, 0],
      buttons: Array.from({ length: 17 }, () => ({
        pressed: false,
        touched: false,
        value: 0,
      })),
      timestamp: 0,
    };
    Object.defineProperty(navigator, "getGamepads", { value: () => [pad] });
    (window as unknown as { testPad: typeof pad }).testPad = pad;
  });
  await page.goto("/en/play/klondike-solitaire/?seed=focus-check");
  await page.locator("#start-button").click();
  const board = page.locator(".klondike-board");
  await expect(page.locator("[data-focus-key='stock']")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(board).toHaveAttribute("data-stock", "23");
  await expect(board).toHaveAttribute("data-waste", "1");

  await page.evaluate(() => {
    (
      window as unknown as { testPad: { buttons: { pressed: boolean }[] } }
    ).testPad.buttons[15]!.pressed = true;
  });
  await page.waitForTimeout(80);
  await page.evaluate(() => {
    (
      window as unknown as { testPad: { buttons: { pressed: boolean }[] } }
    ).testPad.buttons[15]!.pressed = false;
  });
  await page.waitForTimeout(80);
  await expect(page.locator("[data-focus-key='waste']")).toBeFocused();
  await page.evaluate(() => {
    (
      window as unknown as { testPad: { buttons: { pressed: boolean }[] } }
    ).testPad.buttons[0]!.pressed = true;
  });
  await expect(page.locator("[data-focus-key='waste']")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.evaluate(() => {
    (
      window as unknown as { testPad: { buttons: { pressed: boolean }[] } }
    ).testPad.buttons[0]!.pressed = false;
  });
});

for (const width of [320, 390, 810, 1440]) {
  test(`Klondike fits a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/ko/play/klondike-solitaire/?seed=viewport-check");
    await page.locator("#start-button").click();
    const board = page.locator(".klondike-board");
    await expect(board).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    expect(
      await board.evaluate(
        (element) => element.scrollWidth <= element.clientWidth + 1,
      ),
    ).toBe(true);
  });
}

test("iPad touch selects a face-up solitaire card", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "webkit-ipad-touch",
    "Runs in the iPad touch project",
  );
  await page.goto("/ko/play/klondike-solitaire/?seed=ipad-touch");
  await page.locator("#start-button").click();
  const card = page.locator(".klondike-tableau .klondike-card").first();
  const box = await card.boundingBox();
  expect(box).not.toBeNull();
  await page.touchscreen.tap(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await expect(card).toHaveAttribute("aria-pressed", "true");
});
