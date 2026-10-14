import { test, expect } from "@playwright/test";

const games = [
  { id: "crisp-chain-drift", action: "밀기" },
  { id: "crisp-comet-slash", action: "베기" },
  { id: "crisp-volt-keeper", action: "접지" },
];

for (const game of games) {
  test(`${game.id}: mobile controls, isolated cycle and pause`, async ({
    browser,
  }, testInfo) => {
    const baseURL = testInfo.project.use.baseURL;
    if (typeof baseURL !== "string")
      throw new Error("Playwright baseURL is required for request isolation");
    const context = await browser.newContext({
      baseURL,
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    const errors: string[] = [];
    const external: string[] = [];
    const baseOrigin = new URL(baseURL).origin;
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("request", (request) => {
      if (
        !request.url().startsWith("data:") &&
        new URL(request.url()).origin !== baseOrigin
      )
        external.push(request.url());
    });

    try {
      await page.goto(`/ko/play/${game.id}/`);
      await expect(page.locator("#start-button")).toBeEnabled();
      await expect(page.locator("#game-controls")).toBeVisible();
      const left = page.getByRole("button", { name: "왼쪽 이동" });
      const action = page.getByRole("button", { name: game.action });
      await expect(left).toBeVisible();
      await expect(action).toBeVisible();
      expect(
        await left.evaluate((button) => button.getBoundingClientRect().width),
      ).toBeGreaterThanOrEqual(48);
      expect(
        await action.evaluate(
          (button) => button.getBoundingClientRect().height,
        ),
      ).toBeGreaterThanOrEqual(48);

      await page.locator("#start-button").click();
      const frame = page
        .frames()
        .find((candidate) => candidate.url().includes("/vendor/crisp-cycles/"));
      expect(frame).toBeDefined();
      if (game.id === "crisp-comet-slash") {
        await page.locator("#pause-button").click();
        await expect(page.locator("#game-overlay")).toBeVisible();
        await page.locator("#start-button").click();
      }
      await frame!.waitForFunction(
        () => Number(document.body.dataset.ticks) > 5,
      );
      await frame!.waitForFunction((id) => {
        const gameWindow = window as unknown as {
          CD?: { state: () => { phase: string } };
          __cometSlashDebug?: { state: () => { phase: string } };
          __voltKeeper?: { state: () => { phase: string } };
        };
        const phase =
          id === "crisp-chain-drift"
            ? gameWindow.CD?.state().phase
            : id === "crisp-comet-slash"
              ? gameWindow.__cometSlashDebug?.state().phase
              : gameWindow.__voltKeeper?.state().phase;
        return phase === "play";
      }, game.id);

      await left.dispatchEvent("pointerdown", {
        pointerId: 41,
        pointerType: "touch",
        button: 0,
        isPrimary: true,
      });
      await action.dispatchEvent("pointerdown", {
        pointerId: 42,
        pointerType: "touch",
        button: 0,
        isPrimary: false,
      });
      await frame!.waitForFunction(
        () =>
          document.body.dataset.keys?.includes("left") &&
          document.body.dataset.keys.includes("action"),
      );
      await left.dispatchEvent("pointerup", {
        pointerId: 41,
        pointerType: "touch",
        button: 0,
      });
      await action.dispatchEvent("pointerup", {
        pointerId: 42,
        pointerType: "touch",
        button: 0,
      });
      await frame!.waitForFunction(() => document.body.dataset.keys === "");

      await page.screenshot({
        path: testInfo.outputPath(`${game.id}-mobile.png`),
        fullPage: true,
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.setViewportSize({ width: 844, height: 390 });
      await expect(left).toBeVisible();
      await expect(action).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);

      const pause = page.locator("#pause-button");
      await pause.click();
      await frame!.waitForFunction(
        () =>
          !(window as unknown as { dennyBridge: { running: boolean } })
            .dennyBridge.running,
      );
      const pausedTicks = await frame!
        .locator("body")
        .getAttribute("data-ticks");
      await page.waitForTimeout(120);
      expect(await frame!.locator("body").getAttribute("data-ticks")).toBe(
        pausedTicks,
      );

      await page.locator("#start-button").click();
      await expect
        .poll(async () =>
          Number(await frame!.locator("body").getAttribute("data-ticks")),
        )
        .toBeGreaterThan(Number(pausedTicks));
      expect(errors).toEqual([]);
      expect(external).toEqual([]);
    } finally {
      await context.close();
    }
  });
}
