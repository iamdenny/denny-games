import { expect, test } from "@playwright/test";

test("Gridland plays locally, saves in the browser and fits phone and tablet views", async ({
  page,
}, testInfo) => {
  const baseURL = testInfo.project.use.baseURL;
  if (typeof baseURL !== "string")
    throw new Error("Playwright baseURL is required for request isolation");
  const baseOrigin = new URL(baseURL).origin;
  const external: string[] = [];
  const errors: string[] = [];
  page.on("request", (request) => {
    if (
      !request.url().startsWith("data:") &&
      new URL(request.url()).origin !== baseOrigin
    )
      external.push(request.url());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en/games/gridland/");
  await page.evaluate(() => window.localStorage.clear());
  await expect(page.locator("h1")).toContainText("Gridland");
  await expect(page.locator("main")).toContainText("MPL-2.0");
  await expect(page.locator('a[href="/licenses/gridland/"]')).toBeVisible();
  await page.goto("/licenses/gridland/");
  await expect(page.locator('a[href="LICENSE.txt"]')).toBeVisible();

  await page.goto("/en/play/gridland/");
  const iframe = page.locator("#game-host iframe");
  await expect(iframe).toHaveAttribute(
    "src",
    /vendor\/gridland\/runtime\/index\.html\?silent&channel=/,
  );
  await expect(iframe).toHaveAttribute("sandbox", "allow-scripts");
  await expect(page.locator("#start-button")).toBeEnabled();
  await expect(page.locator("#sound-button")).toBeHidden();

  for (const width of [320, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: width < 600 ? 740 : 900 });
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      )
      .toBe(true);
    expect(await iframe.boundingBox()).not.toBeNull();
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#start-button").click();
  let frame = page
    .frames()
    .find((candidate) => candidate.url().includes("/vendor/gridland/runtime/"));
  expect(frame).toBeDefined();
  const hasTouch = testInfo.project.use.hasTouch === true;
  const slots = frame!.locator(".saveSlot");
  await expect(slots).toHaveCount(3);
  if (hasTouch) await slots.nth(2).tap();
  else await slots.nth(2).click();
  await frame!.waitForFunction(
    () =>
      !document.body.classList.contains("titleScreen") &&
      new Promise<boolean>((resolve) => {
        const requireModules = (
          window as unknown as {
            require?: (
              modules: string[],
              callback: (
                board: {
                  options: { rows: number; columns: number };
                  canMove: () => boolean;
                },
                world: { canMove: () => boolean },
              ) => void,
            ) => void;
          }
        ).require;
        if (!requireModules) {
          resolve(false);
          return;
        }
        requireModules(["app/gameboard", "app/world"], (board, world) => {
          const container = document.querySelector(".tileContainer");
          const bounds = container?.getBoundingClientRect();
          const tiles = Array.from(
            document.querySelectorAll<HTMLElement>(
              ".gameBoard .tile:not(.hidden):not(.pooled)",
            ),
          );
          const expected = board.options.rows * board.options.columns;
          const settled = Boolean(
            bounds &&
            tiles.length === expected &&
            tiles.every((tile) => {
              const rect = tile.getBoundingClientRect();
              return (
                rect.left >= bounds.left - 1 &&
                rect.top >= bounds.top - 1 &&
                rect.right <= bounds.right + 1 &&
                rect.bottom <= bounds.bottom + 1
              );
            }),
          );
          resolve(settled && board.canMove() && world.canMove());
        });
      }),
    undefined,
    { timeout: 15_000 },
  );
  const tiles = frame!.locator(".tile:not(.hidden):not(.pooled)");
  await expect(tiles.first()).toBeVisible();

  const readBoard = () =>
    frame!.evaluate(() => {
      const tiles = Array.from(
        document.querySelectorAll<HTMLElement>(
          ".gameBoard .tile:not(.hidden):not(.pooled)",
        ),
      );
      const cells = tiles.map((tile) => {
        const rect = tile.getBoundingClientRect();
        return {
          x: rect.x + rect.width / 2,
          y: rect.y + rect.height / 2,
          width: rect.width,
          type: Array.from(tile.classList).find(
            (name) =>
              name !== "tile" &&
              name !== "selected" &&
              name !== "hidden" &&
              name !== "pooled",
          ),
        };
      });
      const cluster = (values: number[]) => {
        const result: number[] = [];
        for (const value of values.sort((a, b) => a - b)) {
          if (
            !result.length ||
            Math.abs(value - result[result.length - 1]!) > 2
          )
            result.push(value);
        }
        return result;
      };
      const xs = cluster(cells.map((cell) => cell.x));
      const ys = cluster(cells.map((cell) => cell.y));
      const nearest = (values: number[], value: number) =>
        values.reduce(
          (best, candidate, index) =>
            Math.abs(candidate - value) < Math.abs(values[best]! - value)
              ? index
              : best,
          0,
        );
      const grid: (string | undefined)[][] = Array.from(
        { length: ys.length },
        () => Array(xs.length),
      );
      const centers: { x: number; y: number }[][] = Array.from(
        { length: ys.length },
        () => Array(xs.length),
      );
      for (const cell of cells) {
        const row = nearest(ys, cell.y);
        const column = nearest(xs, cell.x);
        grid[row]![column] = cell.type;
        centers[row]![column] = { x: cell.x, y: cell.y };
      }
      const matchesAt = (row: number, column: number) => {
        const type = grid[row]?.[column];
        if (!type) return false;
        for (const [dr, dc] of [
          [0, 1],
          [1, 0],
        ]) {
          let count = 1;
          for (const sign of [-1, 1]) {
            let nextRow = row + dr! * sign;
            let nextColumn = column + dc! * sign;
            while (grid[nextRow]?.[nextColumn] === type) {
              count++;
              nextRow += dr! * sign;
              nextColumn += dc! * sign;
            }
          }
          if (count >= 3) return true;
        }
        return false;
      };
      let candidate:
        | { from: { x: number; y: number }; to: { x: number; y: number } }
        | undefined;
      for (let row = 0; row < grid.length && !candidate; row++) {
        for (
          let column = 0;
          column < (grid[row]?.length ?? 0) && !candidate;
          column++
        ) {
          for (const [dr, dc] of [
            [0, 1],
            [1, 0],
          ]) {
            const nextRow = row + dr!;
            const nextColumn = column + dc!;
            if (!grid[nextRow]?.[nextColumn]) continue;
            [grid[row]![column], grid[nextRow]![nextColumn]] = [
              grid[nextRow]![nextColumn],
              grid[row]![column],
            ];
            if (matchesAt(row, column) || matchesAt(nextRow, nextColumn)) {
              candidate = {
                from: centers[row]![column]!,
                to: centers[nextRow]![nextColumn]!,
              };
            }
            [grid[row]![column], grid[nextRow]![nextColumn]] = [
              grid[nextRow]![nextColumn],
              grid[row]![column],
            ];
            if (candidate) break;
          }
        }
      }
      return {
        signature: grid
          .map((row) => row.map((cell) => cell ?? "?").join(","))
          .join("/"),
        candidate,
        complete:
          grid.length === ys.length &&
          grid.every(
            (row) =>
              row.length === xs.length &&
              row.every((cell) => typeof cell === "string"),
          ) &&
          cells.length === xs.length * ys.length,
      };
    });
  await expect
    .poll(readBoard, { timeout: 15_000 })
    .toMatchObject({ complete: true });
  await expect
    .poll(async () => (await readBoard()).candidate, { timeout: 15_000 })
    .toBeDefined();
  const beforeMove = await readBoard();
  const frameBox = (await iframe.boundingBox())!;
  if (!beforeMove.candidate)
    throw new Error("Gridland did not expose a match-producing move.");
  const tapOrClick = (point: { x: number; y: number }) =>
    hasTouch
      ? page.touchscreen.tap(frameBox.x + point.x, frameBox.y + point.y)
      : page.mouse.click(frameBox.x + point.x, frameBox.y + point.y);
  await tapOrClick(beforeMove.candidate.from);
  await tapOrClick(beforeMove.candidate.to);
  await expect
    .poll(async () => (await readBoard()).signature, {
      timeout: 15_000,
      intervals: [200, 400, 700],
    })
    .not.toBe(beforeMove.signature);

  await page.locator("#pause-button").click();
  await expect(page.locator("#game-overlay")).toBeVisible();
  await page.locator("#start-button").click();
  await expect(page.locator("#game-overlay")).toBeHidden();
  await page.locator('[data-locale-link][lang="ko"]').click();
  await expect(page).toHaveURL(/\/ko\/play\/gridland\//);
  await expect(
    page.frameLocator("#game-host iframe").locator(".saveSlot"),
  ).toHaveCount(3);
  frame = page
    .frames()
    .find((candidate) => candidate.url().includes("/vendor/gridland/runtime/"));
  expect(frame).toBeDefined();
  const saved = await page.evaluate(() => {
    const key = Object.keys(localStorage).find((name) =>
      name.startsWith("denny-games:v1:progress:gridland:"),
    );
    return key ? JSON.parse(localStorage.getItem(key) ?? "null") : null;
  });
  expect(saved?.version).toBe(1);
  expect(saved?.storage?.slot2).toBeTruthy();
  expect(await frame!.evaluate(() => localStorage.getItem("slot2"))).toBe(
    saved.storage.slot2,
  );
  const quotaResult = await frame!.evaluate(() => {
    localStorage.clear();
    localStorage.setItem("slot0", "a".repeat(200_000));
    localStorage.setItem("slot1", "b".repeat(120_000));
    try {
      localStorage.setItem("slot2", "c");
      return false;
    } catch (error) {
      return (
        error instanceof DOMException && error.name === "QuotaExceededError"
      );
    }
  });
  expect(quotaResult).toBe(true);
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});
