import { expect, test, type Frame, type Page } from "@playwright/test";

async function waitForGameFrame(page: Page): Promise<Frame> {
  await expect(page.locator("#game-host iframe")).toHaveAttribute(
    "src",
    /vendor\/packabunchas\/index\.html/,
  );
  await expect
    .poll(() =>
      page
        .frames()
        .some((frame) =>
          frame.url().includes("/vendor/packabunchas/index.html"),
        ),
    )
    .toBe(true);
  const frame = page
    .frames()
    .find((item) => item.url().includes("/vendor/packabunchas/index.html"));
  if (!frame) throw new Error("PACKABUNCHAS iframe did not finish navigation");
  return frame;
}

test("PACKABUNCHAS stays local, saves modes and pauses across phone/tablet layouts", async ({
  page,
}, testInfo) => {
  const external: string[] = [];
  const errors: string[] = [];
  const baseURL = testInfo.project.use.baseURL;
  if (typeof baseURL !== "string")
    throw new Error("Playwright baseURL is required for request isolation");
  const baseOrigin = new URL(baseURL).origin;
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

  for (const [locale, label] of [
    ["en", "PACKABUNCHAS"],
    ["ko", "PACKABUNCHAS"],
  ] as const) {
    await page.goto(`/${locale}/games/packabunchas/`);
    await expect(page.locator("h1")).toContainText(label);
    await expect(page.locator("main")).toContainText("MIT");
    await expect(
      page.locator(`a[href="/${locale}/guides/packabunchas/"]`),
    ).toBeVisible();
  }
  await page.goto("/licenses/packabunchas/");
  await expect(page.locator("h1")).toContainText("source and licenses");
  await expect(page.locator('a[href="LICENSE.txt"]')).toBeVisible();
  await expect(page.locator('a[href="THIRD-PARTY-NOTICES.txt"]')).toBeVisible();
  const noticeResponse = await page.request.get(
    "/licenses/packabunchas/THIRD-PARTY-NOTICES.txt",
  );
  expect(noticeResponse.ok()).toBe(true);
  const notices = await noticeResponse.text();
  expect(notices).toContain("CC BY-SA 4.0");
  expect(notices).not.toContain("ma77os");

  const saved = {
    version: 1,
    storage: {
      currentGameMode: "0",
      polyLeft: "13",
      storyState: "3",
      muted: "true",
      showTutorial: "false",
    },
  };
  await page.addInitScript((save) => {
    const key =
      "denny-games:v1:progress:packabunchas:v1:packabunchas:v1:normal:1";
    if (window !== window.top) return;
    if (location.search.includes("packabunchas-test-large-poly=1")) {
      const existing = JSON.parse(localStorage.getItem(key) ?? "null");
      if (existing?.version === 1 && existing.storage)
        existing.storage.polyLeft = "13312";
      else save.storage.polyLeft = "13312";
      localStorage.setItem(key, JSON.stringify(existing ?? save));
    } else if (localStorage.getItem(key) === null) {
      localStorage.setItem(key, JSON.stringify(save));
    }
  }, saved);

  await page.goto("/ko/play/packabunchas/");
  const frameElement = page.locator("#game-host iframe");
  await expect(page.locator("#start-button")).toBeEnabled();
  await expect(page.locator(".scoreboard")).toBeHidden();
  await expect(page.locator("#overlay-note")).toContainText(
    "키보드·게임패드는 지원하지 않아요.",
  );
  await expect(frameElement).toHaveAttribute("sandbox", "allow-scripts");
  await expect
    .poll(() => frameElement.evaluate((frame) => frame.style.aspectRatio))
    .toBe("9 / 16");
  await expect(page.locator("#sound-button")).toBeHidden();

  let frame = await waitForGameFrame(page);
  expect(
    await frame.evaluate(() => {
      try {
        return parent.document.body.nodeName;
      } catch {
        return "opaque";
      }
    }),
  ).toBe("opaque");
  for (const viewport of [
    { width: 320, height: 740 },
    { width: 390, height: 844 },
    { width: 820, height: 1180 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(viewport);
    const box = await frameElement.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.width / box!.height - 9 / 16)).toBeLessThan(0.025);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#start-button").click();
  await expect(page.locator("#game-overlay")).toBeHidden();
  await page.waitForTimeout(500);
  frame = await waitForGameFrame(page);
  const canvas = frame.locator("canvas");
  const clickCanvas = async (x: number, y: number) => {
    const box = await canvas.boundingBox();
    if (!box) throw new Error("PACKABUNCHAS canvas is not visible");
    const position = { x: (box.width * x) / 1080, y: (box.height * y) / 1920 };
    if (testInfo.project.name === "webkit-ipad-touch")
      await canvas.tap({ position });
    else await canvas.click({ position });
  };
  await clickCanvas(540, 960);
  await expect
    .poll(() =>
      frame.evaluate(() => (window as unknown as { state: string }).state),
    )
    .toBe("menu");
  await frame.waitForFunction(() => {
    const { rightButton } = window as unknown as {
      rightButton: { x: number; originalx: number };
    };
    return Math.abs(rightButton.x - rightButton.originalx) < 2;
  });
  expect(
    await frame.evaluate(
      () => (window as unknown as { gameModes: string[] }).gameModes.length,
    ),
  ).toBe(5);

  await clickCanvas(918, 1056);
  await expect
    .poll(() =>
      page.evaluate(() => {
        const key = Object.keys(localStorage).find((name) =>
          name.includes("progress:packabunchas"),
        );
        if (!key) return "";
        return JSON.parse(localStorage.getItem(key) ?? "null")?.storage
          ?.currentGameMode;
      }),
    )
    .toBe("1");

  await frame.waitForFunction(() => {
    const { startButton } = window as unknown as {
      startButton: { y: number; originaly: number };
    };
    // Upstream easing settles with a small residual offset from originaly.
    return Math.abs(startButton.y - startButton.originaly) < 24;
  });
  const startButton = await frame.evaluate(() => {
    const button = (
      window as unknown as { startButton: { x: number; y: number } }
    ).startButton;
    return { x: button.x, y: button.y };
  });
  await clickCanvas(startButton.x, startButton.y);
  await expect
    .poll(() =>
      frame.evaluate(() => (window as unknown as { state: string }).state),
    )
    .toBe("game");
  await expect
    .poll(() =>
      frame.evaluate(
        () => (window as unknown as { pieces: unknown[] }).pieces.length,
      ),
    )
    .toBeGreaterThan(0);

  await frame.evaluate(() => {
    const scope = window as unknown as {
      packTestFrames?: number;
      packPauseAcknowledged?: boolean;
    };
    scope.packTestFrames = 0;
    scope.packPauseAcknowledged = false;
    window.addEventListener("message", (event) => {
      if (event.data?.type === "run" && event.data.running === false)
        scope.packPauseAcknowledged = true;
    });
    const tick = () => {
      scope.packTestFrames = (scope.packTestFrames ?? 0) + 1;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await expect
    .poll(() =>
      frame.evaluate(
        () => (window as unknown as { packTestFrames: number }).packTestFrames,
      ),
    )
    .toBeGreaterThan(2);
  await page.locator("#pause-button").click();
  await expect(page.locator("#game-overlay")).toBeVisible();
  await expect
    .poll(() =>
      frame.evaluate(
        () =>
          (window as unknown as { packPauseAcknowledged: boolean })
            .packPauseAcknowledged,
      ),
    )
    .toBe(true);
  const pausedFrames = await frame.evaluate(
    () => (window as unknown as { packTestFrames: number }).packTestFrames,
  );
  await page.waitForTimeout(200);
  expect(
    await frame.evaluate(
      () => (window as unknown as { packTestFrames: number }).packTestFrames,
    ),
  ).toBe(pausedFrames);
  await page.locator("#start-button").click();
  await expect
    .poll(() =>
      frame.evaluate(
        () => (window as unknown as { packTestFrames: number }).packTestFrames,
      ),
    )
    .toBeGreaterThan(pausedFrames);

  await frame.evaluate(() => {
    (
      window as unknown as { packPauseAcknowledged: boolean }
    ).packPauseAcknowledged = false;
    window.dispatchEvent(new Event("blur"));
  });
  await expect(page.locator("#game-overlay")).toBeVisible();
  await expect
    .poll(() =>
      frame.evaluate(
        () =>
          (window as unknown as { packPauseAcknowledged: boolean })
            .packPauseAcknowledged,
      ),
    )
    .toBe(true);
  const blurPausedFrames = await frame.evaluate(
    () => (window as unknown as { packTestFrames: number }).packTestFrames,
  );
  await page.waitForTimeout(200);
  expect(
    await frame.evaluate(
      () => (window as unknown as { packTestFrames: number }).packTestFrames,
    ),
  ).toBe(blurPausedFrames);

  await page.reload();
  frame = await waitForGameFrame(page);
  expect(
    await frame.evaluate(
      () => (window as unknown as { currentGameMode: number }).currentGameMode,
    ),
  ).toBe(1);
  await page.goto("/ko/play/packabunchas/?packabunchas-test-large-poly=1");
  frame = await waitForGameFrame(page);
  expect(
    await frame.evaluate(
      () => (window as unknown as { polyLeft: number }).polyLeft,
    ),
  ).toBe(13312);
  await frame.evaluate(() => {
    const save = window as unknown as {
      __packabunchasSaveData: (key: string, value: string) => void;
    };
    save.__packabunchasSaveData("polyLeft", "13312");
  });
  await expect
    .poll(() =>
      page.evaluate(() => {
        const key = Object.keys(localStorage).find((name) =>
          name.includes("progress:packabunchas"),
        );
        return key
          ? JSON.parse(localStorage.getItem(key) ?? "null")?.storage?.polyLeft
          : "";
      }),
    )
    .toBe("13312");
  await page.reload();
  frame = await waitForGameFrame(page);
  expect(
    await frame.evaluate(
      () => (window as unknown as { polyLeft: number }).polyLeft,
    ),
  ).toBe(13312);
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});
