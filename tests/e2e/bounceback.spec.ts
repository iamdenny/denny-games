import { test, expect } from "@playwright/test";

test("Bounce Back: isolated play, touch and pad input, save, sound, pause and restart", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors: string[] = [];
  const external: string[] = [];
  const requests: string[] = [];
  const baseURL = testInfo.project.use.baseURL;
  if (typeof baseURL !== "string")
    throw new Error("Playwright baseURL is required for request isolation");
  const baseOrigin = new URL(baseURL).origin;
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("request", (request) => {
    requests.push(request.url());
    if (new URL(request.url()).origin !== baseOrigin)
      external.push(request.url());
  });
  await page.addInitScript(() => {
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

  for (const [locale, artworkAlt] of [
    ["en", "Bounce Back — Bounce Back original title screen"],
    ["ko", "Bounce Back — Bounce Back 원본 타이틀 화면"],
  ]) {
    await page.goto(`/${locale}/games/bounce-back/`);
    await expect(page.locator(".game-screenshot")).toHaveCount(0);
    await expect(page.locator(".detail-hero img")).toHaveAttribute(
      "alt",
      artworkAlt!,
    );
  }

  await page.goto("/ko/play/bounce-back/");
  await expect(page.locator("#start-button")).toBeEnabled();
  const frameElement = page.locator("#game-host iframe");
  await expect(frameElement).toHaveAttribute("sandbox", "allow-scripts");
  await page.locator("#start-button").click();
  // The shell is ready before the newly mounted iframe commits navigation.
  const waitForGameFrame = () =>
    expect
      .poll(() =>
        page
          .frames()
          .some((item) => item.url().includes("/vendor/bounceback/index.html")),
      )
      .toBe(true);
  await waitForGameFrame();
  let frame = page
    .frames()
    .find((item) => item.url().includes("/vendor/bounceback/index.html"));
  expect(frame).toBeDefined();
  await frame!.waitForFunction(() => Number(document.body.dataset.ticks) > 5);
  expect(
    await frame!.evaluate(() => {
      try {
        return parent.document.body.nodeName;
      } catch {
        return "isolated";
      }
    }),
  ).toBe("isolated");

  await page.evaluate(() => {
    const pad = (window as unknown as { testPad: { axes: number[] } }).testPad;
    pad.axes[0] = 0.8;
  });
  await expect
    .poll(() => frame!.locator("body").getAttribute("data-virtual-keys"))
    .toContain("d");
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
    pad.buttons[0]!.pressed = true;
  });
  await expect
    .poll(() => frame!.locator("body").getAttribute("data-mouse-pressed"))
    .toBe("true");
  await page.evaluate(() => {
    (
      window as unknown as {
        testPad: { buttons: { pressed: boolean }[] };
      }
    ).testPad.buttons[0]!.pressed = false;
  });

  await frame!.evaluate(() => {
    const touch = (identifier: number, clientX: number, clientY: number) => ({
      identifier,
      clientX,
      clientY,
    });
    const emit = (type: string, changedTouches: object[]) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperty(event, "changedTouches", { value: changedTouches });
      document.dispatchEvent(event);
    };
    emit("touchstart", [touch(1, 60, 300)]);
    emit("touchmove", [touch(1, 0, 300)]);
    emit("touchstart", [touch(2, 300, 300)]);
  });
  await expect
    .poll(() => frame!.locator("body").getAttribute("data-virtual-keys"))
    .toContain("a");
  await expect
    .poll(() => frame!.locator("body").getAttribute("data-mouse-pressed"))
    .toBe("true");
  await frame!.evaluate(() => {
    const event = new Event("touchend", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "changedTouches", {
      value: [{ identifier: 1 }, { identifier: 2 }],
    });
    document.dispatchEvent(event);
  });
  await page.locator("#pause-button").click();
  await expect(page.locator("#game-overlay")).toBeVisible();
  await page.locator("#sound-button").click();
  await expect
    .poll(() =>
      frame!.evaluate(
        () =>
          (window as unknown as { dennyBridge: { soundEnabled: boolean } })
            .dennyBridge.soundEnabled,
      ),
    )
    .toBe(true);
  await page.locator("#sound-volume").evaluate((element) => {
    const input = element as HTMLInputElement;
    input.value = "25";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await expect
    .poll(() =>
      frame!.evaluate(
        () =>
          (window as unknown as { dennyBridge: { volume: number } }).dennyBridge
            .volume,
      ),
    )
    .toBe(0.25);

  await frame!.evaluate(() => {
    localStorage.kbap_coins = "321";
    localStorage.kbap_warp = "4";
  });
  await expect
    .poll(() =>
      page.evaluate(() => {
        const entry = Object.entries(localStorage).find(([key]) =>
          key.includes("progress:bounce-back:"),
        );
        if (!entry) return null;
        return (
          JSON.parse(entry[1]!) as {
            storage?: Record<string, string>;
          }
        ).storage?.kbap_coins;
      }),
    )
    .toBe("321");
  const pausedTicks = await frame!.locator("body").getAttribute("data-ticks");
  await page.waitForTimeout(100);
  await expect(frame!.locator("body")).toHaveAttribute(
    "data-ticks",
    pausedTicks!,
  );

  await page.locator("#restart-button").click();
  await expect(page.locator("#start-button")).toBeEnabled();
  await waitForGameFrame();
  frame = page
    .frames()
    .find((item) => item.url().includes("/vendor/bounceback/index.html"));
  expect(frame).toBeDefined();
  await frame!.waitForFunction(
    () =>
      document.body !== null && Number(document.body.dataset.ticks ?? 0) === 0,
  );
  await page.locator("#start-button").click();
  await frame!.waitForFunction(() => Number(document.body.dataset.ticks) > 5);
  await expect
    .poll(() =>
      frame!.evaluate(
        () => localStorage.kbap_coins + ":" + localStorage.kbap_warp,
      ),
    )
    .toBe("321:4");
  expect(requests.some((url) => url.includes("gameEngineDebug.js"))).toBe(
    false,
  );
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});
