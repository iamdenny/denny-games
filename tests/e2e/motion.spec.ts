import { test, expect } from "@playwright/test";
const initial = [2, 0, 2, 0, 0, 4, 0, 4, 8, 0, 0, 0, 0, 0, 0, 0];
async function seed(page: import("@playwright/test").Page) {
  await page.addInitScript((board) => {
    if (!sessionStorage.getItem("motion-fixture")) {
      localStorage.setItem(
        "denny-games:v1:progress:2048:v1:motion:1",
        JSON.stringify({ board, score: 0, counter: 10 }),
      );
      sessionStorage.setItem("motion-fixture", "1");
    }
  }, initial);
  await page.goto("/en/play/2048/?seed=motion&stage=1");
  await page.locator("#start-button").click();
}
for (const key of ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"])
  test(`2048 ${key}: real travel then stable board`, async ({ page }) => {
    await seed(page);
    await page.keyboard.press(key);
    await expect(page.locator(".tile-travel-layer")).toHaveCount(1);
    const travelling = await page
      .locator(".tile-traveller")
      .evaluateAll((nodes) =>
        nodes.map((node) => getComputedStyle(node).transform),
      );
    expect(
      travelling.some(
        (value) => value !== "none" && value !== "matrix(1, 0, 0, 1, 0, 0)",
      ),
    ).toBe(true);
    await expect(page.locator(".tile-travel-layer")).toHaveCount(0);
    await expect(page.locator(".merge-cell")).toHaveCount(16);
    await expect(
      page.locator(".merge-cell").filter({ hasText: "4" }).first(),
    ).toBeVisible();
  });
test("2048 rapid input, pause, resize and save never leave ghosts or hidden tiles", async ({
  page,
}) => {
  await seed(page);
  for (const key of [
    "ArrowLeft",
    "ArrowDown",
    "ArrowRight",
    "ArrowUp",
    "ArrowLeft",
  ])
    await page.keyboard.press(key);
  await page.keyboard.press("Escape");
  await expect(page.locator(".tile-travel-layer")).toHaveCount(0);
  const values = await page.locator(".merge-cell").allTextContents();
  await page.reload();
  await page.locator("#start-button").click();
  expect(await page.locator(".merge-cell").allTextContents()).toEqual(values);
  await page.keyboard.press("ArrowDown");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".tile-travel-layer")).toHaveCount(0);
  expect(
    await page
      .locator(".merge-cell")
      .evaluateAll((nodes) =>
        nodes.every((node) => getComputedStyle(node).visibility === "visible"),
      ),
  ).toBe(true);
});
for (const preference of ["reduce", "low"])
  test(`2048 ${preference}: motion suppressed without changing rules`, async ({
    page,
  }) => {
    if (preference === "reduce")
      await page.emulateMedia({ reducedMotion: "reduce" });
    await seed(page);
    if (preference === "low") {
      await page.locator("#player-settings summary").click();
      await page.locator("#low-effects").check();
    }
    await page.locator(".merge-board").focus();
    await page.keyboard.press("ArrowLeft");
    await expect(page.locator(".tile-travel-layer")).toHaveCount(0);
    await expect(page.locator("#score")).toHaveText("12");
  });
test("win loads Three.js on demand and restart disposes the scene", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() =>
    localStorage.setItem(
      "denny-games:v1:progress:2048:v1:win:1",
      JSON.stringify({
        board: [1024, 1024, ...Array(14).fill(0)],
        score: 0,
        counter: 0,
      }),
    ),
  );
  await page.goto("/en/play/2048/?seed=win&stage=1");
  await expect(page.locator(".victory-scene")).toHaveCount(0);
  await page.locator("#start-button").click();
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator("#game-overlay")).toBeVisible();
  await expect(page.locator(".victory-scene")).toHaveCount(1);
  await expect(page.locator("#overlay-title")).toContainText("Nicely done!");
  await page.locator("#restart-button").click();
  await expect(page.locator(".victory-scene")).toHaveCount(0);
  expect(errors).toEqual([]);
});
for (const id of [
  "gomoku",
  "reversi",
  "four-in-a-row",
  "checkers",
  "dots-and-boxes",
])
  test(`${id}: piece motion settles before pause`, async ({ page }) => {
    await page.goto(`/ko/play/${id}/`);
    await page.locator('[data-board-mode-setup="local"]').check();
    await page.locator("#start-button").click();
    if (id === "checkers") {
      await page.locator(".board-cell.movable").first().click();
      await page.locator(".board-cell.legal").first().click();
    } else {
      const target =
        id === "gomoku"
          ? page.locator('[data-cell="112"]')
          : page.locator(".board-cell.legal").first();
      await target.click();
      await page.locator("[data-board-confirm]").click();
    }
    await expect(page.locator(".classic-game")).toHaveAttribute(
      "data-moves",
      "1",
    );
    const transforming = await page
      .locator(".board-piece,.edge,.box-fill")
      .evaluateAll((nodes) =>
        nodes.some((node) => (node as HTMLElement).style.transform !== ""),
      );
    expect(transforming).toBe(true);
    await page.keyboard.press("Escape");
    expect(
      await page
        .locator(".board-piece,.edge,.box-fill")
        .evaluateAll((nodes) =>
          nodes.every((node) => (node as HTMLElement).style.transform === ""),
        ),
    ).toBe(true);
    await expect(page.locator(".board-capture,.board-flip-face")).toHaveCount(
      0,
    );
  });
test("turning reduced motion on during tile travel settles immediately", async ({
  page,
}) => {
  await seed(page);
  await page.keyboard.press("ArrowLeft");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".tile-travel-layer")).toHaveCount(0);
  expect(
    await page
      .locator(".merge-cell")
      .evaluateAll((nodes) =>
        nodes.every((node) => getComputedStyle(node).visibility === "visible"),
      ),
  ).toBe(true);
  await expect(page.locator("#score")).toHaveText("12");
});
for (const mode of ["reduce", "no-webgl"])
  test(`win ${mode}: replay stays usable without a GPU effect`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const loads: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/victory.")) loads.push(request.url());
    });
    if (mode === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
    if (mode === "no-webgl")
      await page.addInitScript(() => {
        const original = HTMLCanvasElement.prototype.getContext;
        Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
          value: function (
            this: HTMLCanvasElement,
            type: string,
            ...args: unknown[]
          ) {
            if (type === "webgl2") {
              document.documentElement.dataset.webglAttempted = "true";
              return null;
            }
            return Reflect.apply(original, this, [type, ...args]);
          },
        });
      });
    await page.addInitScript(() =>
      localStorage.setItem(
        "denny-games:v1:progress:2048:v1:fallback:1",
        JSON.stringify({
          board: [1024, 1024, ...Array(14).fill(0)],
          score: 0,
          counter: 0,
        }),
      ),
    );
    await page.goto("/en/play/2048/?seed=fallback&stage=1");
    await page.locator("#start-button").click();
    await page.keyboard.press("ArrowLeft");
    await expect(page.locator("#overlay-title")).toHaveText("Nicely done!");
    if (mode === "no-webgl")
      await expect(page.locator("html")).toHaveAttribute(
        "data-webgl-attempted",
        "true",
      );
    await expect(page.locator(".victory-scene")).toHaveCount(0);
    await page.locator("#restart-button").click();
    await expect(page.locator("#start-button")).toBeEnabled();
    expect(errors).toEqual([]);
    if (mode === "reduce") expect(loads).toEqual([]);
  });
test("Number Trail keeps focus and accepts the next touch during travel", async ({
  page,
}) => {
  await page.goto("/en/play/number-trail/?seed=focus&stage=24");
  await page.locator("#start-button").click();
  const tile = page.locator(".logic-cell.movable").first();
  await tile.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".logic-board")).toHaveAttribute("data-moves", "1");
  expect(
    await page.evaluate(() =>
      document.activeElement?.classList.contains("logic-cell"),
    ),
  ).toBe(true);
  await page.locator(".logic-cell.movable").first().click();
  await expect(page.locator(".logic-board")).toHaveAttribute("data-moves", "2");
  await expect(page.locator(".tile-travel-layer")).toHaveCount(0);
  expect(
    await page
      .locator(".logic-cell")
      .evaluateAll((cells) =>
        cells.every((cell) => getComputedStyle(cell).opacity === "1"),
      ),
  ).toBe(true);
});
