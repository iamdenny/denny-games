import { test, expect } from "@playwright/test";

test("UNDERRUN has localized source and license pages", async ({ page }) => {
  for (const locale of ["en", "ko"] as const) {
    await page.goto(`/${locale}/games/underrun/`);
    await expect(page.locator("h1")).toContainText("UNDERRUN");
    await expect(page.locator("main")).toContainText("WebGL");
    await expect(
      page.locator('img[src="/art/underrun.png"]').first(),
    ).toBeVisible();
    await expect(page.locator("figure.game-screenshot")).toHaveCount(0);
    await expect(page.locator('a[href="/licenses/underrun/"]')).toBeVisible();
  }
  await page.goto("/licenses/underrun/");
  await expect(page.locator("h1")).toContainText("source and licenses");
  await expect(page.locator('a[href="LICENSE.txt"]')).toBeVisible();
  await expect(page.locator('a[href="SONANT-X-LICENSE.txt"]')).toBeVisible();
});

test("UNDERRUN WebGL runtime is isolated and handles pad, touch, pause and restart", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors: string[] = [];
  const external: string[] = [];
  const baseURL = testInfo.project.use.baseURL;
  if (typeof baseURL !== "string")
    throw new Error("Playwright baseURL is required for request isolation");
  const baseOrigin = new URL(baseURL).origin;
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" || message.text().startsWith("CSPVIOLATION"))
      errors.push(`${message.text()} ${JSON.stringify(message.location())}`);
  });
  page.on("request", (request) => {
    if (
      !request.url().startsWith("data:") &&
      new URL(request.url()).origin !== baseOrigin
    )
      external.push(request.url());
  });
  await page.addInitScript(() => {
    addEventListener("securitypolicyviolation", (event) => {
      const violation = event as SecurityPolicyViolationEvent;
      console.warn(
        "CSPVIOLATION " +
          JSON.stringify({
            blockedURI: violation.blockedURI,
            directive: violation.violatedDirective,
            sourceFile: violation.sourceFile,
            line: violation.lineNumber,
            column: violation.columnNumber,
            sample: violation.sample,
          }),
      );
    });
    const pad = {
      index: 0,
      mapping: "standard",
      axes: [0, 0],
      buttons: Array.from({ length: 17 }, () => ({
        pressed: false,
        value: 0,
      })),
    };
    Object.defineProperty(navigator, "getGamepads", { value: () => [pad] });
    (window as unknown as { testPad: typeof pad }).testPad = pad;
  });

  await page.goto("/ko/play/underrun/");
  const frameElement = page.locator("#game-host iframe");
  await expect(frameElement).toHaveAttribute("sandbox", "allow-scripts");
  await expect
    .poll(() => frameElement.evaluate((frame) => frame.style.aspectRatio))
    .toBe("16 / 9");
  await expect(page.locator("#start-button")).toBeEnabled({ timeout: 20000 });
  let frame = page
    .frames()
    .find((item) => item.url().includes("/vendor/underrun/index.html"));
  expect(frame).toBeDefined();
  const isolated = await frame!.evaluate(() => {
    try {
      return parent.document.body.nodeName;
    } catch {
      return "opaque";
    }
  });
  expect(isolated).toBe("opaque");
  expect(
    await frame!.evaluate(() =>
      Boolean((window as unknown as { gl?: WebGLRenderingContext | null }).gl),
    ),
  ).toBe(true);
  const canvasRatio = await frame!.locator("#c").evaluate((canvas) => {
    const rect = canvas.getBoundingClientRect();
    return rect.width / rect.height;
  });
  expect(canvasRatio).toBeCloseTo(16 / 9, 2);

  await page.locator("#start-button").click();
  await frame!.waitForFunction(() => Number(document.body.dataset.ticks) > 5);
  await expect(frame!.locator("body")).toHaveAttribute("data-running", "true");

  const beforeAim = await frame!.evaluate(
    () => (window as unknown as { mouse_x: number }).mouse_x,
  );
  await page.evaluate(() => {
    const pad = (
      window as unknown as {
        testPad: {
          axes: number[];
          buttons: { pressed: boolean }[];
        };
      }
    ).testPad;
    pad.axes[0] = 0.8;
    pad.buttons[0]!.pressed = true;
  });
  await expect
    .poll(() => frame!.locator("body").getAttribute("data-keys"))
    .toContain("right");
  await expect
    .poll(() => frame!.locator("body").getAttribute("data-keys"))
    .toContain("fire");
  await expect
    .poll(() =>
      frame!.evaluate(() => (window as unknown as { mouse_x: number }).mouse_x),
    )
    .toBe(beforeAim);
  await page.evaluate(() => {
    const pad = (
      window as unknown as {
        testPad: {
          axes: number[];
          buttons: { pressed: boolean }[];
        };
      }
    ).testPad;
    pad.axes[0] = 0;
    pad.buttons[0]!.pressed = false;
  });
  await page.evaluate(() => {
    const pad = (
      window as unknown as {
        testPad: {
          buttons: { pressed: boolean }[];
        };
      }
    ).testPad;
    pad.buttons[15]!.pressed = true;
  });
  await expect
    .poll(() =>
      frame!.evaluate(() => (window as unknown as { mouse_x: number }).mouse_x),
    )
    .toBeGreaterThan(beforeAim);
  await expect
    .poll(() => frame!.locator("body").getAttribute("data-keys"))
    .toBe("");
  await page.evaluate(() => {
    const pad = (
      window as unknown as {
        testPad: {
          buttons: { pressed: boolean }[];
        };
      }
    ).testPad;
    pad.buttons[15]!.pressed = false;
  });

  const touchState = await frame!.evaluate(() => {
    const canvas = document.querySelector<HTMLCanvasElement>("#c")!;
    canvas.setPointerCapture = () => {};
    const rect = canvas.getBoundingClientRect();
    const emit = (type: string, pointerId: number, x: number, y: number) =>
      canvas.dispatchEvent(
        new PointerEvent(type, {
          pointerId,
          pointerType: "touch",
          clientX: x,
          clientY: y,
          bubbles: true,
          cancelable: true,
        }),
      );
    const leftX = rect.left + rect.width * 0.2;
    const rightX = rect.left + rect.width * 0.8;
    const y = rect.top + rect.height * 0.5;
    emit("pointerdown", 1, leftX, y);
    emit("pointermove", 1, leftX + 40, y);
    emit("pointerdown", 2, rightX, y);
    const globals = window as unknown as {
      keys: Record<number, number>;
      key_right: number;
      key_shoot: number;
    };
    const state = {
      right: globals.keys[globals.key_right],
      fire: globals.keys[globals.key_shoot],
    };
    emit("pointerup", 1, leftX + 40, y);
    emit("pointerup", 2, rightX, y);
    return state;
  });
  expect(touchState).toEqual({ right: 1, fire: 1 });

  await page.locator("#pause-button").click();
  await expect(frame!.locator("body")).toHaveAttribute("data-running", "false");
  const pausedTicks = await frame!.locator("body").getAttribute("data-ticks");
  await page.waitForTimeout(150);
  await expect(frame!.locator("body")).toHaveAttribute(
    "data-ticks",
    pausedTicks!,
  );
  await page.locator("#start-button").click();
  await expect(frame!.locator("body")).toHaveAttribute("data-running", "true");
  await page.locator("#sound-button").click();
  await expect(frame!.locator("body")).toHaveAttribute("data-running", "false");
  await expect(page.locator("#game-overlay")).toBeVisible();
  await expect(page.locator("#overlay-title")).toContainText(
    "잠깐 쉬어가도 좋아요.",
  );
  await page.locator("#start-button").click();
  await expect(frame!.locator("body")).toHaveAttribute("data-running", "true");

  const oldFrame = frame;
  await page.locator("#restart-button").click();
  await expect(page.locator("#start-button")).toBeEnabled();
  frame = page
    .frames()
    .find((item) => item.url().includes("/vendor/underrun/index.html"));
  expect(frame).toBeDefined();
  expect(frame).not.toBe(oldFrame);
  await expect(frameElement).toHaveAttribute("sandbox", "allow-scripts");
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});
