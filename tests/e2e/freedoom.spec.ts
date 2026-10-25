import { expect, test } from "@playwright/test";

test("Freedoom Phase 2 runs locally in a paused opaque frame with touch controls", async ({
  page,
  baseURL,
}, testInfo) => {
  test.setTimeout(150_000);
  const outsideRequests: string[] = [];
  const pageErrors: string[] = [];
  await page.addInitScript(() => {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key.endsWith(":stage:freedoom-2")) {
        throw new DOMException("Storage blocked", "QuotaExceededError");
      }
      return originalSetItem.call(this, key, value);
    };
  });
  page.on("request", (request) => {
    if (/^https?:/.test(request.url()) && !request.url().startsWith(baseURL!)) {
      outsideRequests.push(request.url());
    }
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/en/games/freedoom-2/");
  await expect(
    page.getByRole("heading", { name: "Freedoom Phase 2" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /controls and guide/i }),
  ).toHaveAttribute("href", "/en/guides/freedoom-2/");
  await page.goto("/ko/guides/freedoom-2/");
  await expect(
    page.getByRole("heading", { name: /프리둠 페이즈 2 하는 법/ }),
  ).toBeVisible();
  await page.goto("/licenses/freedoom/");
  await expect(
    page.getByRole("link", { name: /corresponding engine source/i }),
  ).toHaveAttribute(
    "href",
    "/vendor/freedoom/source/chocolate-doom-emscripten.tar.gz",
  );
  await expect(
    page.getByRole("link", { name: /pause-aware runtime patch/i }),
  ).toHaveAttribute(
    "href",
    "/vendor/freedoom/source/emscripten-sleep-patch.json",
  );

  await page.route("**/vendor/freedoom/chocolate-doom.js", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await route.continue();
  });
  await page.goto("/ko/play/freedoom-2/");
  const start = page.locator("#start-button");
  const frameElement = page.locator("iframe.freedoom-frame");
  await expect(frameElement).toHaveAttribute("sandbox", "allow-scripts");
  await expect(frameElement).toHaveAttribute("referrerpolicy", "no-referrer");
  const gameFrame = () =>
    page
      .frames()
      .find((frame) => frame.url().includes("/vendor/freedoom/index.html"));
  await expect
    .poll(() => gameFrame()?.url() ?? "")
    .toContain("/vendor/freedoom/index.html");
  const child = gameFrame();
  if (!child) throw new Error("Freedoom opaque frame did not load");
  await expect(child.locator("html")).toHaveAttribute("lang", "ko");
  await expect(child.locator("canvas#doom-canvas")).toHaveAttribute(
    "aria-label",
    "프리둠 페이즈 2 게임 화면",
  );
  await expect(child.locator("#status")).toHaveText("게임 파일을 기다리는 중…");
  await expect(start).toBeDisabled();
  await expect(start).toBeEnabled({ timeout: 90_000 });
  expect(
    await child.evaluate(() => {
      try {
        void parent.document.body;
        return { origin: self.origin, isolated: false };
      } catch (error) {
        return {
          origin: self.origin,
          isolated:
            error instanceof DOMException && error.name === "SecurityError",
        };
      }
    }),
  ).toEqual({ origin: "null", isolated: true });
  const csp = await child
    .locator('meta[http-equiv="Content-Security-Policy"]')
    .getAttribute("content");
  expect(csp).toContain("connect-src 'none'");
  expect(csp).toContain("wasm-unsafe-eval");
  await expect(child.locator("canvas#doom-canvas")).toBeVisible();
  await expect
    .poll(() =>
      child
        .locator("canvas#doom-canvas")
        .evaluate((canvas: HTMLCanvasElement) => [
          canvas.width,
          canvas.height,
          Math.round(canvas.getBoundingClientRect().width / window.innerWidth),
        ]),
    )
    .toEqual([640, 400, 2]);
  await expect(page.locator(".freedoom-touch-button")).toHaveCount(7);
  await expect(page.locator(".freedoom-download-note")).toContainText(
    "12.4 MiB",
  );

  for (const [width, height] of [
    [320, 740],
    [360, 780],
    [390, 844],
    [430, 932],
    [820, 1180],
    [844, 390],
    [1440, 900],
  ] as const) {
    await page.setViewportSize({ width, height });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `${width}x${height} has horizontal overflow`,
    ).toBe(true);
    const box = await frameElement.boundingBox();
    expect(box, `${width}x${height} iframe bounds`).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
    const button = await page
      .getByRole("button", { name: "앞으로" })
      .boundingBox();
    expect(button, `${width}x${height} forward button`).not.toBeNull();
    expect(button!.height).toBeGreaterThanOrEqual(48);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await start.click();
  const canvas = child.locator("main");
  await expect(page.locator("#game-overlay")).toBeHidden();
  await page.waitForTimeout(400);
  await child.evaluate(() => {
    const collector = window as Window & { __freedoomKeyEvents?: string[] };
    collector.__freedoomKeyEvents = [];
    const record = (event: KeyboardEvent) => {
      if (event.key.startsWith("Arrow"))
        collector.__freedoomKeyEvents?.push(`${event.type}:${event.key}`);
    };
    window.addEventListener("keydown", record, true);
    window.addEventListener("keyup", record, true);
  });
  const observedKeyEvents = () =>
    child.evaluate(
      () =>
        (window as Window & { __freedoomKeyEvents?: string[] })
          .__freedoomKeyEvents ?? [],
    );
  await child.locator("canvas#doom-canvas").focus();
  await page.keyboard.down("ArrowRight");
  await expect.poll(observedKeyEvents).toContain("keydown:ArrowRight");
  await page.waitForTimeout(800);
  await page.keyboard.up("ArrowRight");
  await expect.poll(observedKeyEvents).toContain("keyup:ArrowRight");
  await page.waitForTimeout(150);
  expect(
    await page.evaluate(() =>
      Object.keys(localStorage).filter((key) =>
        key.includes(":progress:freedoom-2:"),
      ),
    ),
  ).toEqual([]);
  const forward = page.getByRole("button", { name: "앞으로" });
  await child.evaluate(() => {
    (
      window as Window & { __freedoomKeyEvents?: string[] }
    ).__freedoomKeyEvents = [];
  });
  if (testInfo.project.name === "webkit-ipad-touch") {
    await forward.scrollIntoViewIfNeeded();
    const forwardBox = await forward.boundingBox();
    if (!forwardBox) throw new Error("Freedoom forward button is not visible");
    await page.touchscreen.tap(
      forwardBox.x + forwardBox.width / 2,
      forwardBox.y + forwardBox.height / 2,
    );
  } else {
    const forwardBox = await forward.boundingBox();
    if (!forwardBox) throw new Error("Freedoom forward button is not visible");
    await page.mouse.move(
      forwardBox.x + forwardBox.width / 2,
      forwardBox.y + forwardBox.height / 2,
    );
    await page.mouse.down();
    await page.waitForTimeout(900);
    await page.mouse.up();
  }
  await expect.poll(observedKeyEvents).toContain("keydown:ArrowUp");
  await expect.poll(observedKeyEvents).toContain("keyup:ArrowUp");
  await expect(page.locator("#game-message")).toBeEmpty();
  await canvas.screenshot({ path: "test-results/freedoom-2-gameplay.png" });

  await page.locator("#pause-button").click();
  await expect(page.locator("#game-overlay")).toBeVisible();
  await page.waitForTimeout(250);
  const paused = await canvas.screenshot();
  const channel = new URL(child.url()).searchParams.get("channel");
  expect(channel).toBeTruthy();
  await child.evaluate(() => {
    (
      window as Window & { __freedoomKeyEvents?: string[] }
    ).__freedoomKeyEvents = [];
  });
  await page.evaluate((activeChannel) => {
    const frame = document.querySelector<HTMLIFrameElement>(
      "iframe.freedoom-frame",
    );
    if (!frame?.contentWindow || !activeChannel) return;
    frame.contentWindow.postMessage(
      {
        channel: activeChannel,
        type: "key",
        key: "forward",
        pressed: true,
      },
      "*",
    );
    setTimeout(
      () =>
        frame.contentWindow?.postMessage(
          {
            channel: activeChannel,
            type: "key",
            key: "forward",
            pressed: false,
          },
          "*",
        ),
      250,
    );
  }, channel);
  await page.waitForTimeout(500);
  expect(Buffer.compare(paused, await canvas.screenshot())).toBe(0);
  expect(await observedKeyEvents()).toEqual([]);
  await start.click();
  await expect(page.locator("#game-overlay")).toBeHidden();
  await page.evaluate((activeChannel) => {
    const frame = document.querySelector<HTMLIFrameElement>(
      "iframe.freedoom-frame",
    );
    if (!frame?.contentWindow || !activeChannel) return;
    frame.contentWindow.postMessage(
      {
        channel: activeChannel,
        type: "key",
        key: "forward",
        pressed: true,
      },
      "*",
    );
    setTimeout(
      () =>
        frame.contentWindow?.postMessage(
          {
            channel: activeChannel,
            type: "key",
            key: "forward",
            pressed: false,
          },
          "*",
        ),
      250,
    );
  }, channel);
  await expect.poll(observedKeyEvents).toContain("keydown:ArrowUp");
  await expect.poll(observedKeyEvents).toContain("keyup:ArrowUp");

  const oldChannel = new URL(child.url()).searchParams.get("channel");
  await page.locator("#restart-button").click();
  await expect
    .poll(
      () => {
        const next = page
          .frames()
          .find((frame) => frame.url().includes("/vendor/freedoom/index.html"));
        return next ? new URL(next.url()).searchParams.get("channel") : null;
      },
      { timeout: 90_000 },
    )
    .not.toBe(oldChannel);
  await expect(page.locator("iframe.freedoom-frame")).toHaveCount(1);
  await expect(start).toBeEnabled({ timeout: 90_000 });
  await start.click();
  await expect(page.locator("#game-overlay")).toBeHidden();
  await page.locator('[data-locale-link][lang="en"]').click();
  await page.waitForURL((url) => url.pathname === "/en/play/freedoom-2/");
  await expect(
    page.getByRole("heading", { name: "Freedoom Phase 2" }),
  ).toBeVisible();

  await page.goto("/ko/games/freedoom-2/");
  await expect(page.locator("iframe.freedoom-frame")).toHaveCount(0);
  expect(outsideRequests).toEqual([]);
  expect(pageErrors).toEqual([]);
});
