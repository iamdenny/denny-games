import { expect, test } from "@playwright/test";

test("Korean Yutnori supports four-player setup, shortcuts, extra throws and saved turns", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  await page.goto("/ko/play/yutnori/");
  await expect(page.locator(".yut-node")).toHaveCount(29);
  await page.locator("#game-mode-choice select").selectOption("4");
  await page.locator("#start-button").click();
  await expect(page.locator(".yut-player")).toHaveCount(4);

  await page.getByRole("button", { name: "윷 던지기" }).click();
  await expect(page.locator(".yut-result")).toContainText("윷");
  await page.getByRole("button", { name: "1번 말" }).click();
  await page.getByRole("button", { name: /바깥길/ }).click();
  await expect(page.locator('.yut-node[data-node="4"]')).toContainText("1");
  await expect(page.locator(".yut-turn")).toContainText("1번 플레이어");

  await page.getByRole("button", { name: "윷 던지기" }).click();
  await page.locator('.yut-node[data-node="4"]').click();
  await expect(
    page.getByRole("button", { name: /대각선 지름길/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: /대각선 지름길/ }).click();
  await expect(page.locator('.yut-node[data-node="22"]')).toContainText("1");
  await expect(page.locator(".yut-turn")).toContainText("1번 플레이어");
  await page.locator(".yut-board").screenshot({
    path: test.info().outputPath("yutnori-board-ko.png"),
  });

  await page.locator("#pause-button").click();
  await page.locator("#player-settings summary").click();
  await page.locator("#game-settings select").selectOption("2");
  await page.reload();
  await expect(page.locator("#game-mode-choice select")).toHaveValue("4");
  await expect(page.locator("#game-settings select")).toHaveValue("2");
  await page.locator("#start-button").click();
  await expect(page.locator(".yut-player")).toHaveCount(4);
  await expect(page.locator('.yut-node[data-node="22"]')).toContainText("1");
});

test("Yutnori labels and board controls fit bilingual phone, tablet and desktop widths", async ({
  page,
}) => {
  for (const locale of ["en", "ko"] as const) {
    await page.goto(`/${locale}/play/yutnori/`);
    await expect(page.locator(".yut-board")).toBeVisible();
    for (const [width, height] of [
      [320, 640],
      [360, 640],
      [390, 844],
      [430, 932],
      [768, 900],
      [1024, 768],
      [1440, 900],
    ] as const) {
      await page.setViewportSize({ width, height });
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        )
        .toBe(true);
      const bounds = await page.locator(".yut-board").boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.width).toBeLessThanOrEqual(width);
      expect(bounds!.height).toBeLessThanOrEqual(width);
    }
  }
});

test("keyboard confirmation throws the sticks and assistive labels remain available", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  await page.goto("/en/play/yutnori/");
  await page.locator("#start-button").click();
  const throwButton = page.getByRole("button", { name: "Throw the sticks" });
  await throwButton.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".yut-result")).toContainText("Yut");
  const yardPiece = page.locator('.yut-yard-piece[data-yard-piece="0"]');
  await yardPiece.focus();
  await page.keyboard.press("Enter");
  await expect(yardPiece).toBeFocused();
  const cancel = page.getByRole("button", { name: "Choose another piece" });
  await cancel.focus();
  await page.keyboard.press("Enter");
  await expect(yardPiece).toBeFocused();
  await page.keyboard.press("Enter");
  const routeChoice = page.locator(".yut-move-choice").first();
  if (test.info().project.name === "chromium") {
    for (let index = 0; index < 6; index++) {
      if (
        await routeChoice.evaluate(
          (element) => element === document.activeElement,
        )
      )
        break;
      await page.keyboard.press("Tab");
    }
  } else {
    await routeChoice.focus();
  }
  await expect(routeChoice).toBeFocused();
  await page.keyboard.press("Enter");
  const nextThrow = page.getByRole("button", { name: "Throw the sticks" });
  await expect(nextThrow).toBeFocused();
  await page.keyboard.press("Enter");
  const boardPiece = page.locator('.yut-node[data-node="4"]');
  await boardPiece.focus();
  await expect(boardPiece).toBeFocused();
  await expect(boardPiece).toHaveCSS("outline-offset", "-3px");

  await expect(page.locator('.yut-node[data-node="0"]')).toHaveAttribute(
    "aria-label",
    /finish/,
  );
});

test("iPad touch can throw the sticks and move a piece", async ({ page }) => {
  test.skip(
    test.info().project.name !== "webkit-ipad-touch",
    "This journey verifies real touch input in the iPad Mini project.",
  );
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  await page.goto("/ko/play/yutnori/");
  await page.locator("#game-mode-choice select").selectOption("2");
  await page.locator("#start-button").tap();
  await expect(page.locator(".yut-player")).toHaveCount(2);
  await page.getByRole("button", { name: "윷 던지기" }).tap();
  await expect(page.locator(".yut-result")).toContainText("윷");
  await page.getByRole("button", { name: "1번 말" }).tap();
  await page.getByRole("button", { name: /바깥길/ }).tap();
  await expect(page.locator('.yut-node[data-node="4"]')).toContainText("1");
});

test("Yutnori can start with two, three or four local players", async ({
  page,
}) => {
  for (const count of [2, 3, 4]) {
    await page.goto("/en/play/yutnori/");
    await page.locator("#game-mode-choice select").selectOption(String(count));
    await page.locator("#start-button").click();
    await expect(page.locator(".yut-player")).toHaveCount(count);
  }
});
test("a saved Yutnori win returns to the completed result view", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const finished = () => ({ node: null, finished: true, route: null });
    const waiting = () => ({ node: null, finished: false, route: null });
    localStorage.setItem(
      "denny-games:v1:progress:yutnori:v1:yutnori:v1:normal:1",
      JSON.stringify({
        version: 1,
        players: [
          { tokens: Array.from({ length: 4 }, finished) },
          { tokens: Array.from({ length: 4 }, waiting) },
        ],
        turn: 0,
        roll: null,
        winner: 0,
        moves: 17,
      }),
    );
  });
  await page.goto("/en/play/yutnori/");
  await page.locator("#start-button").click();
  await expect(page.locator("#game-overlay")).toBeVisible();
  await expect(page.locator("#overlay-note")).toHaveText(
    "Player 1 brought all four pieces home.",
  );
});
test("iPad landscape keeps Yutnori touch controls reachable", async ({
  page,
}) => {
  test.skip(
    test.info().project.name !== "webkit-ipad-touch",
    "This journey verifies landscape touch input in the iPad Mini project.",
  );
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  await page.goto("/ko/play/yutnori/");
  await page.locator("#game-mode-choice select").selectOption("2");
  await page.locator("#start-button").tap();
  const throwButton = page.getByRole("button", { name: "윷 던지기" });
  await expect(throwButton).toBeVisible();
  const bounds = await throwButton.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(768);
  await throwButton.tap();
  await expect(page.locator(".yut-result")).toContainText("윷");
  await page.getByRole("button", { name: "1번 말" }).tap();
  await page.getByRole("button", { name: /바깥길/ }).tap();
  await expect(page.locator('.yut-node[data-node="4"]')).toContainText("1");
});

test("Yutnori rejects an overshooting piece and reports a live win", async ({
  page,
}) => {
  await page.addInitScript(() => {
    if (
      localStorage.getItem(
        "denny-games:v1:progress:yutnori:v1:yutnori:v1:normal:1",
      )
    )
      return;
    const waiting = () => ({ node: null, finished: false, route: null });
    localStorage.setItem(
      "denny-games:v1:progress:yutnori:v1:yutnori:v1:normal:1",
      JSON.stringify({
        version: 1,
        players: [
          {
            tokens: [
              { node: 19, finished: false, route: null },
              ...Array.from({ length: 3 }, () => ({
                node: null,
                finished: true,
                route: null,
              })),
            ],
          },
          { tokens: Array.from({ length: 4 }, waiting) },
        ],
        turn: 0,
        roll: { faces: [true, true, false, false], steps: 2 },
        winner: null,
        moves: 16,
      }),
    );
  });
  await page.goto("/en/play/yutnori/");
  await page.locator("#start-button").click();
  await expect(page.locator('.yut-node[data-node="19"]')).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Skip this move" }),
  ).toBeVisible();
  await page.evaluate(() => {
    const key = "denny-games:v1:progress:yutnori:v1:yutnori:v1:normal:1";
    const state = JSON.parse(localStorage.getItem(key)!);
    state.roll = { faces: [true, false, false, false], steps: 1 };
    localStorage.setItem(
      "denny-games:v1:progress:yutnori:v1:live-finish:1",
      JSON.stringify(state),
    );
  });
  await page.goto("/en/play/yutnori/?seed=live-finish");
  await page.locator("#start-button").click();
  await page.locator('.yut-node[data-node="19"]').click();
  await page.locator(".yut-move-choice").click();
  await expect(page.locator("#game-overlay")).toBeVisible();
  await expect(page.locator("#overlay-note")).toHaveText(
    "Player 1 brought all four pieces home.",
  );
  await page.reload();
  await page.locator("#start-button").click();
  await expect(page.locator("#overlay-note")).toHaveText(
    "Player 1 brought all four pieces home.",
  );
});
test("Yutnori capture returns the rival piece to the yard and grants another throw", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const waiting = () => ({ node: null, finished: false, route: null });
    localStorage.setItem(
      "denny-games:v1:progress:yutnori:v1:yutnori:v1:normal:1",
      JSON.stringify({
        version: 1,
        players: [
          {
            tokens: [
              { node: 4, finished: false, route: null },
              ...Array.from({ length: 3 }, waiting),
            ],
          },
          {
            tokens: [
              { node: 6, finished: false, route: null },
              ...Array.from({ length: 3 }, waiting),
            ],
          },
        ],
        turn: 0,
        roll: { faces: [true, true, false, false], steps: 2 },
        winner: null,
        moves: 3,
      }),
    );
  });
  await page.goto("/en/play/yutnori/");
  await page.locator("#start-button").click();
  await page.locator('.yut-node[data-node="4"]').click();
  await page.getByRole("button", { name: /Outer route.*capture 1/ }).click();
  await expect(page.locator(".yut-status")).toContainText(
    "Captured 1 opposing piece; throw again.",
  );
  await expect(
    page.getByRole("button", { name: "Throw the sticks" }),
  ).toBeEnabled();
  expect(
    await page.evaluate(() => {
      const state = JSON.parse(
        localStorage.getItem(
          "denny-games:v1:progress:yutnori:v1:yutnori:v1:normal:1",
        )!,
      );
      return [state.players[1].tokens[0].node, state.turn];
    }),
  ).toEqual([null, 0]);
});
