import { expect, test, type Frame, type Page } from "@playwright/test";

async function waitForHextrisFrame(page: Page): Promise<Frame> {
  await expect(page.locator("#game-host iframe")).toHaveAttribute(
    "src",
    /vendor\/hextris\/index\.html/,
  );
  await expect
    .poll(() =>
      page
        .frames()
        .some((frame) => frame.url().includes("/vendor/hextris/index.html")),
    )
    .toBe(true);
  const frame = page
    .frames()
    .find((item) => item.url().includes("/vendor/hextris/index.html"));
  if (!frame) throw new Error("Hextris iframe did not finish navigation");
  return frame;
}

test("Hextris has bilingual instructions, source notices and clear mobile controls", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [locale, title, licenseText] of [
    ["en", "Hextris", "GPL-3.0-or-later"],
    ["ko", "Hextris", "GPL-3.0-or-later"],
  ] as const) {
    await page.goto(`/${locale}/games/hextris/`);
    await expect(page.locator("h1")).toContainText(title);
    await expect(page.locator("main")).toContainText(licenseText);
    await expect(page.locator('a[href="/licenses/hextris/"]')).toBeVisible();
  }
  await page.goto("/licenses/hextris/");
  await expect(page.locator("h1")).toContainText("source and licenses");
  await expect(page.locator('a[href="LICENSE.txt"]')).toBeVisible();
  await expect(page.locator('a[href="APACHE-2.0.txt"]')).toBeVisible();

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

  await page.goto("/ko/play/hextris/");
  await expect(page.locator("#start-button")).toBeEnabled();
  await expect(page.locator("#game-host iframe")).toHaveAttribute(
    "src",
    /vendor\/hextris\/index\.html/,
  );
  const frameElement = page.locator("#game-host iframe");
  await expect(frameElement).toHaveAttribute("sandbox", "allow-scripts");
  await expect
    .poll(() => frameElement.evaluate((frame) => frame.style.aspectRatio))
    .toBe("1 / 1");
  for (const viewport of [
    { width: 320, height: 740 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(viewport);
    const box = await frameElement.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.width - box!.height)).toBeLessThanOrEqual(1);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  let frame = await waitForHextrisFrame(page);
  expect(
    await frame!.evaluate(() => {
      try {
        return parent.document.body.nodeName;
      } catch {
        return "opaque";
      }
    }),
  ).toBe("opaque");
  await expect(page.locator("#sound-button")).toBeHidden();
  const rotateLeft = page.getByRole("button", { name: "육각형 왼쪽으로 회전" });
  const rotateRight = page.getByRole("button", {
    name: "육각형 오른쪽으로 회전",
  });
  await expect(rotateLeft).toBeVisible();
  await expect(rotateRight).toBeVisible();
  expect((await rotateLeft.boundingBox())!.height).toBeGreaterThanOrEqual(48);
  expect((await rotateRight.boundingBox())!.height).toBeGreaterThanOrEqual(48);

  await page.locator("#start-button").click();
  await expect
    .poll(() =>
      frame!.evaluate(
        () => (window as unknown as { gameState: number }).gameState,
      ),
    )
    .toBe(1);
  const startingPosition = await frame!.evaluate(
    () =>
      (window as unknown as { MainHex: { position: number } }).MainHex.position,
  );
  await expect
    .poll(() =>
      frame!.evaluate(
        () =>
          Date.now() -
          (window as unknown as { MainHex: { lastRotate: number } }).MainHex
            .lastRotate,
      ),
    )
    .toBeGreaterThanOrEqual(75);
  await rotateRight.click();
  await expect
    .poll(() =>
      frame!.evaluate(
        () =>
          (window as unknown as { MainHex: { position: number } }).MainHex
            .position,
      ),
    )
    .not.toBe(startingPosition);
  const rotatedPosition = await frame!.evaluate(
    () =>
      (window as unknown as { MainHex: { position: number } }).MainHex.position,
  );
  await expect
    .poll(() =>
      page.evaluate(() => {
        const key = Object.keys(localStorage).find((name) =>
          name.includes("progress:hextris"),
        );
        if (!key) return "";
        const saved = JSON.parse(localStorage.getItem(key) ?? "null");
        return saved?.storage?.saveState ?? "";
      }),
    )
    .not.toBe("");

  // The checkpoint is delivered during play, so a reload need not wait for
  // the host's slower autosave or the upstream pause animation.
  await page.reload();
  await expect(page.locator("#game-host iframe")).toHaveAttribute(
    "src",
    /vendor\/hextris\/index\.html/,
  );
  const recoveredFrame = await waitForHextrisFrame(page);
  await expect
    .poll(() =>
      recoveredFrame!.evaluate(
        () => (window as unknown as { importing: number }).importing,
      ),
    )
    .toBe(0);
  expect(
    await recoveredFrame!.evaluate(
      () =>
        (window as unknown as { MainHex: { position: number } }).MainHex
          .position,
    ),
  ).toBe(rotatedPosition);
  frame = recoveredFrame!;
  await page.locator("#start-button").click();
  await expect
    .poll(() =>
      recoveredFrame!.evaluate(
        () => (window as unknown as { gameState: number }).gameState,
      ),
    )
    .toBe(1);

  await page.locator("#pause-button").click();
  await expect(page.locator("#game-overlay")).toBeVisible();
  await expect
    .poll(() =>
      frame!.evaluate(
        () => (window as unknown as { gameState: number }).gameState,
      ),
    )
    .toBe(-1);
  const pausedPosition = await frame!.evaluate(
    () =>
      (window as unknown as { MainHex: { position: number } }).MainHex.position,
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
  await page.reload();
  await expect(page.locator("#game-host iframe")).toHaveAttribute(
    "src",
    /vendor\/hextris\/index\.html/,
  );
  const restored = await waitForHextrisFrame(page);
  await expect
    .poll(() =>
      restored!.evaluate(
        () => (window as unknown as { importing: number }).importing,
      ),
    )
    .toBe(0);
  expect(
    await restored!.evaluate(
      () =>
        (window as unknown as { MainHex: { position: number } }).MainHex
          .position,
    ),
  ).toBe(pausedPosition);
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});

test("Hextris flushes the current board before switching language", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ko/play/hextris/");
  await page.locator("#start-button").click();
  let frame = await waitForHextrisFrame(page);
  await expect
    .poll(() =>
      frame!.evaluate(
        () => (window as unknown as { gameState: number }).gameState,
      ),
    )
    .toBe(1);
  const position = await frame!.evaluate(
    () =>
      (window as unknown as { MainHex: { position: number } }).MainHex.position,
  );
  await expect
    .poll(() =>
      frame!.evaluate(
        () =>
          Date.now() -
          (window as unknown as { MainHex: { lastRotate: number } }).MainHex
            .lastRotate,
      ),
    )
    .toBeGreaterThanOrEqual(75);
  await page.getByRole("button", { name: "육각형 오른쪽으로 회전" }).click();
  await expect
    .poll(() =>
      frame!.evaluate(
        () =>
          (window as unknown as { MainHex: { position: number } }).MainHex
            .position,
      ),
    )
    .not.toBe(position);
  const rotatedPosition = await frame!.evaluate(
    () =>
      (window as unknown as { MainHex: { position: number } }).MainHex.position,
  );

  await page
    .getByRole("navigation", { name: "언어" })
    .getByRole("link", {
      name: "EN",
    })
    .click();
  await expect(page).toHaveURL(/\/en\/play\/hextris\//);
  await expect(page.locator("#game-host iframe")).toHaveAttribute(
    "src",
    /vendor\/hextris\/index\.html/,
  );
  frame = await waitForHextrisFrame(page);
  await expect
    .poll(() =>
      frame!.evaluate(
        () => (window as unknown as { importing: number }).importing,
      ),
    )
    .toBe(0);
  expect(
    await frame!.evaluate(
      () =>
        (window as unknown as { MainHex: { position: number } }).MainHex
          .position,
    ),
  ).toBe(rotatedPosition);
});

test("Hextris stays on the page when the save checkpoint is not acknowledged", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ko/play/hextris/");
  await page.locator("#start-button").click();
  const frame = await waitForHextrisFrame(page);
  await expect
    .poll(() =>
      frame!.evaluate(
        () => (window as unknown as { gameState: number }).gameState,
      ),
    )
    .toBe(1);

  await page.locator("#game-host iframe").evaluate((element) => {
    (element as HTMLIFrameElement).contentWindow?.location.replace(
      "about:blank",
    );
  });
  await page
    .getByRole("navigation", { name: "언어" })
    .getByRole("link", {
      name: "EN",
    })
    .click();
  await expect(page).toHaveURL(/\/ko\/play\/hextris\//);
  await expect(page.locator("#game-message")).toContainText(
    "게임을 저장하지 못했어요",
  );
});

test("Hextris blocks locale navigation when browser storage rejects progress", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const setItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key.includes("progress:hextris")) {
        throw new DOMException("storage is full", "QuotaExceededError");
      }
      setItem.call(this, key, value);
    };
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ko/play/hextris/");
  await page.locator("#start-button").click();
  const frame = await waitForHextrisFrame(page);
  await expect
    .poll(() =>
      frame!.evaluate(
        () => (window as unknown as { gameState: number }).gameState,
      ),
    )
    .toBe(1);

  await page
    .getByRole("navigation", { name: "언어" })
    .getByRole("link", { name: "EN" })
    .click();
  await expect(page).toHaveURL(/\/ko\/play\/hextris\//);
  await expect(page.locator("#game-message")).toContainText(
    /게임을 저장하지 못했어요|이 기기에서 저장할 수 없어요/,
  );
});
