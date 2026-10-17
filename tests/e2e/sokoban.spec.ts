import { expect, test } from "@playwright/test";

test("Sokoban plays on Denny Games in both locales with responsive local controls", async ({
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
  await page.addInitScript(() => window.localStorage.clear());

  for (const locale of ["en", "ko"] as const) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${locale}/play/sokoban/`);
    await expect(page.locator("#start-button")).toBeEnabled();
    await expect(page.locator("#game-host iframe")).toHaveCount(0);
    await expect(page.locator(".sokoban-board")).toHaveAttribute(
      "role",
      "grid",
    );
    await expect(page.locator("#sokoban-board-description")).toContainText(
      locale === "ko" ? "목표 칸: 2행 4열" : "Goals: row 2, column 4",
    );
    await expect(page.locator("#sokoban-board-description")).toContainText(
      locale === "ko" ? "상자: 2행 3열" : "Crates: row 2, column 3",
    );
    await expect(page.locator("#sokoban-board-description")).toContainText(
      locale === "ko"
        ? "행별 벽 위치: 1행 1~5열"
        : "Walls by row: row 1: columns 1–5",
    );
    await expect(page.locator("#sokoban-board-description")).toContainText(
      locale === "ko" ? "빈 공간: 없음" : "Empty spaces: none",
    );
    await expect(page.locator("#game-settings")).toContainText(
      locale === "ko" ? "퍼즐 선택" : "Choose puzzle",
    );

    for (const width of [320, 390, 768, 1024]) {
      await page.setViewportSize({ width, height: width < 600 ? 740 : 768 });
      await expect(page.locator(".sokoban-direction").first()).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `no horizontal overflow at ${width}px`,
      ).toBe(true);
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator("#start-button").click();
    const moveRight = page.getByRole("button", {
      name: locale === "ko" ? "오른쪽으로 이동" : "Move right",
    });
    if (testInfo.project.name === "webkit-ipad-touch") await moveRight.tap();
    else await moveRight.click();
    await expect(page.locator(".sokoban-announcement")).toContainText(
      locale === "ko" ? "이동 1회" : "Moves: 1",
    );
    await expect(page.locator(".sokoban-announcement")).toContainText(
      locale === "ko" ? "관리인 2행 3열" : "Keeper at row 2, column 3",
    );
    await expect(page.locator(".sokoban-announcement")).toContainText(
      locale === "ko" ? "오른쪽 이동." : "Moved right.",
    );
    await expect(page.locator(".sokoban-status")).toContainText(
      locale === "ko" ? "퍼즐 완료" : "Puzzle complete",
    );
    await expect(page.locator(".sokoban-counts")).toContainText("1");
    await expect(page.locator(".sokoban-actions")).toContainText(
      locale === "ko" ? "다음 퍼즐" : "Next puzzle",
    );

    if (locale === "en") {
      await page.locator("#player-settings summary").click();
      await page.locator(".sokoban-settings select").selectOption("1");
      await page.locator("#player-settings summary").click();
      await page.getByRole("button", { name: "Move left" }).click();
      await page.keyboard.press("ArrowRight");
      await expect(page.locator(".sokoban-counts")).toContainText("Moves: 2");
      await page.getByRole("button", { name: "Show solution" }).click();
      await expect(page.locator(".sokoban-status")).toContainText(
        "Puzzle complete",
        { timeout: 10_000 },
      );
    }
    await page.locator("#pause-button").click();
    await expect(page.locator("#start-button")).toBeVisible();
    await page.locator("#start-button").click();
    await expect(page.locator(".sokoban-board")).toBeVisible();

    await page.locator("#restart-button").click();
    await expect(page.locator("#start-button")).toBeEnabled();
    await page.locator("#start-button").click();
    await expect(page.locator(".sokoban-counts")).toContainText(
      locale === "ko" ? "이동: 0" : "Moves: 0",
    );
    await page.locator("#player-settings summary").click();
    await page.locator(".sokoban-settings select").selectOption("0");
    await expect(page.locator(".sokoban-status")).toContainText(
      locale === "ko" ? "이전에 완료한 퍼즐" : "Previously completed",
    );
  }

  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});

test("Sokoban remains playable when its solver worker fails to start", async ({
  page,
}, testInfo) => {
  await page.addInitScript(() => {
    class FailedWorker {
      onmessage: ((event: MessageEvent) => void) | null = null;
      onerror: ((event: ErrorEvent) => void) | null = null;

      constructor() {
        window.setTimeout(() => this.onerror?.(new ErrorEvent("error")), 0);
      }

      postMessage() {}
      terminate() {}
    }
    Object.defineProperty(window, "Worker", {
      configurable: true,
      value: FailedWorker,
    });
  });
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/en/play/sokoban/");
  await page.locator("#start-button").click();
  await expect(page.locator(".sokoban-status")).toContainText(
    "Continue with manual moves",
  );
  await expect(
    page.getByRole("button", { name: "Show solution" }),
  ).toBeDisabled();
  const moveRight = page.getByRole("button", { name: "Move right" });
  if (testInfo.project.name === "webkit-ipad-touch") await moveRight.tap();
  else await moveRight.click();
  await expect(page.locator(".sokoban-counts")).toContainText("Moves: 1");
});
