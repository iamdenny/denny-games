import { test, expect } from "@playwright/test";

declare global {
  interface Window {
    __blackBoxButtons?: number[];
  }
}

const playPath = "/vendor/sgt-blackbox/index.html";

async function getFrame(page: import("@playwright/test").Page) {
  await expect
    .poll(() => page.frames().some((frame) => frame.url().includes(playPath)))
    .toBe(true);
  const frame = page.frames().find((item) => item.url().includes(playPath));
  if (!frame) throw new Error("Black Box iframe did not finish navigation");
  await expect(frame.locator("#puzzlecanvas")).toBeVisible();
  return frame;
}

test("Black Box stays local, isolated, responsive and pausable", async ({
  page,
  request,
}, testInfo) => {
  const errors: string[] = [];
  const external: string[] = [];
  const baseURL = testInfo.project.use.baseURL;
  if (typeof baseURL !== "string")
    throw new Error("Playwright baseURL is required for request isolation");
  const baseOrigin = new URL(baseURL).origin;
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("request", (gameRequest) => {
    const url = gameRequest.url();
    if (url.startsWith("http") && new URL(url).origin !== baseOrigin)
      external.push(url);
  });

  for (const locale of ["en", "ko"] as const) {
    await page.goto(`/${locale}/games/sgt-blackbox/`);
    await expect(page.locator("h1")).toContainText(
      locale === "ko" ? "블랙 박스" : "Black Box",
    );
    await expect(page.locator("main")).toContainText("MIT");
    await expect(
      page.locator(`a[href="/${locale}/guides/sgt-blackbox/"]`),
    ).toBeVisible();
    await expect(page.locator(".detail-hero img")).toHaveAttribute(
      "src",
      "/art/open-games/sgt-blackbox.svg",
    );

    await page.goto(`/${locale}/guides/sgt-blackbox/`);
    await expect(page.locator("h1")).toContainText(
      locale === "ko" ? "블랙 박스" : "Black Box",
    );
    await expect(page.locator("main")).toContainText(
      locale === "ko" ? "표시 모드" : "Mark mode",
    );
  }

  await page.goto("/licenses/sgt-blackbox/");
  await expect(page.locator("h1")).toContainText(
    "Black Box source and license",
  );
  await expect(page.locator('a[href="LICENCE.txt"]')).toHaveCount(2);
  await expect(page.locator('a[href="LICENCE.txt"]').first()).toBeVisible();
  const provenanceLink = page.locator(
    'a[href="/vendor/sgt-blackbox/source/provenance.json"]',
  );
  await expect(provenanceLink).toHaveCount(2);
  await expect(provenanceLink.first()).toBeVisible();
  const license = await request.get("/licenses/sgt-blackbox/LICENCE.txt");
  expect(license.ok()).toBe(true);
  expect(await license.text()).toContain("Permission is hereby granted");

  await page.goto("/ko/play/sgt-blackbox/");
  const start = page.locator("#start-button");
  await expect(start).toBeEnabled({ timeout: 20000 });
  const iframe = page.locator("iframe").first();
  await expect(iframe).toHaveAttribute("sandbox", "allow-scripts");
  await expect(iframe).toHaveAttribute("referrerpolicy", "no-referrer");
  const frame = await getFrame(page);
  expect(
    await frame.evaluate(() => {
      try {
        void parent.document.body;
        return false;
      } catch (error) {
        return error instanceof DOMException && error.name === "SecurityError";
      }
    }),
  ).toBe(true);
  const csp = await frame
    .locator('meta[http-equiv="Content-Security-Policy"]')
    .getAttribute("content");
  expect(csp).toContain("connect-src 'none'");
  expect(csp).toContain("wasm-unsafe-eval");
  await expect(frame.locator("#statusbar")).toContainText(
    "Balls marked: 0 / 5",
  );

  await start.click();
  await expect(page.locator("#game-overlay")).toBeHidden();
  await frame.evaluate(() => {
    const win = window as unknown as { __blackBoxButtons: number[] };
    win.__blackBoxButtons = [];
    document.addEventListener(
      "mousedown",
      (event) => win.__blackBoxButtons.push(event.button),
      true,
    );
  });
  const canvas = frame.locator("#puzzlecanvas");
  const canvasBox = await canvas.boundingBox();
  if (!canvasBox) throw new Error("Black Box canvas has no visible bounds");
  const boardBeforeBeam = await canvas.evaluate((element) =>
    (element as HTMLCanvasElement).toDataURL(),
  );
  await canvas.click({
    position: { x: canvasBox.width * 0.05, y: canvasBox.height / 2 },
  });
  await expect
    .poll(() => frame.evaluate(() => window.__blackBoxButtons?.at(-1)))
    .toBe(0);
  await expect
    .poll(() =>
      canvas.evaluate((element) => (element as HTMLCanvasElement).toDataURL()),
    )
    .not.toBe(boardBeforeBeam);
  await canvas.click({
    button: "right",
    position: { x: canvasBox.width * 0.35, y: canvasBox.height * 0.35 },
  });
  await expect
    .poll(() => frame.evaluate(() => window.__blackBoxButtons?.at(-1)))
    .toBe(2);
  const guess = {
    x: canvasBox.width * 0.45,
    y: canvasBox.height * 0.45,
  };
  await canvas.click({ position: guess });
  await expect(frame.locator("#statusbar")).toContainText(
    "Balls marked: 1 / 5",
  );
  await canvas.click({ position: guess });
  await expect(frame.locator("#statusbar")).toContainText(
    "Balls marked: 0 / 5",
  );
  await frame.evaluate(() => window.dispatchEvent(new Event("blur")));
  await expect(page.locator("#game-overlay")).toBeVisible();
  await start.click();
  await expect(page.locator("#game-overlay")).toBeHidden();

  for (const [width, height] of [
    [320, 740],
    [390, 844],
    [820, 1180],
    [844, 390],
    [1440, 900],
  ] as const) {
    await page.setViewportSize({ width, height });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `${width}x${height} page overflow`,
    ).toBe(true);
    const frameBox = await iframe.boundingBox();
    expect(frameBox, `${width}x${height} frame bounds`).not.toBeNull();
    expect(frameBox!.x).toBeGreaterThanOrEqual(0);
    expect(frameBox!.x + frameBox!.width).toBeLessThanOrEqual(width + 1);
  }

  await page.locator("#pause-button").click();
  await expect(page.locator("#game-overlay")).toBeVisible();
  await expect(frame.locator("#denny-mark")).toBeDisabled();
  const buttonsBeforePausedInput = await frame.evaluate(
    () => window.__blackBoxButtons?.length ?? 0,
  );
  await frame.evaluate(() =>
    document
      .querySelector("#puzzlecanvas")
      ?.dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true, button: 0 }),
      ),
  );
  expect(
    await frame.evaluate(() => window.__blackBoxButtons?.length ?? 0),
  ).toBe(buttonsBeforePausedInput);
  await start.click();
  await expect(page.locator("#game-overlay")).toBeHidden();
  const oldChannel = new URL(frame.url()).searchParams.get("channel");
  await page.locator("#restart-button").click();
  await expect(page.locator("#game-overlay")).toBeVisible();
  await expect(start).toBeEnabled({ timeout: 20000 });
  const restartedFrame = await getFrame(page);
  await expect
    .poll(() => restartedFrame.locator("#statusbar").innerText())
    .toContain("Balls marked: 0 / 5");
  const newChannel = new URL(restartedFrame.url()).searchParams.get("channel");
  expect(newChannel).not.toBe(oldChannel);
  await start.click();
  await expect(page.locator("#game-overlay")).toBeHidden();
  await restartedFrame.evaluate((channel) => {
    parent.postMessage({ channel, type: "error", message: "stale frame" }, "*");
  }, oldChannel);
  await expect(page.locator("#game-overlay")).toBeHidden();

  const resumedCanvas = restartedFrame.locator("#puzzlecanvas");
  const resumedCanvasBox = await resumedCanvas.boundingBox();
  if (!resumedCanvasBox)
    throw new Error("Black Box canvas has no visible bounds after restart");
  await resumedCanvas.click({
    position: {
      x: resumedCanvasBox.width * 0.05,
      y: resumedCanvasBox.height / 2,
    },
  });
  await page.locator("#sound-button").click();
  await expect(page.locator("#game-overlay")).toBeVisible();
  await start.click();
  await expect(page.locator("#game-overlay")).toBeHidden();
  await expect
    .poll(() =>
      page.evaluate(() =>
        Object.keys(localStorage).filter((key) =>
          key.startsWith("denny-games:v1:progress:sgt-blackbox:"),
        ),
      ),
    )
    .toEqual([]);
  await page.goto("/ko/games/sgt-blackbox/");
  await expect(page.locator("iframe")).toHaveCount(0);

  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});

test("Black Box touch Mark mode marks without guessing on coarse pointers", async ({
  page,
}, testInfo) => {
  const use = testInfo.project.use as { hasTouch?: boolean };
  test.skip(!use.hasTouch, "Touch Mark mode requires a touch-enabled profile");
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.goto("/ko/play/sgt-blackbox/");
  const start = page.locator("#start-button");
  await expect(start).toBeEnabled({ timeout: 20000 });
  await start.click();
  const frame = await getFrame(page);
  const mark = frame.locator("#denny-mark");
  await expect(mark).toBeVisible();
  await frame.evaluate(() => {
    const win = window as unknown as { __blackBoxButtons: number[] };
    win.__blackBoxButtons = [];
    document.addEventListener(
      "mousedown",
      (event) => win.__blackBoxButtons.push(event.button),
      true,
    );
  });
  const canvas = frame.locator("#puzzlecanvas");
  const box = await canvas.boundingBox();
  if (!box) throw new Error("Black Box canvas has no visible bounds");
  await mark.tap();
  await expect(mark).toHaveAttribute("aria-pressed", "true");
  const initialStatus = await frame.locator("#statusbar").innerText();
  await canvas.tap({
    position: { x: box.width * 0.35, y: box.height * 0.35 },
  });
  await expect
    .poll(() => frame.evaluate(() => window.__blackBoxButtons?.at(-1)))
    .toBe(2);
  await expect(frame.locator("#statusbar")).toHaveText(initialStatus);
  await mark.tap();
  await expect(mark).toHaveAttribute("aria-pressed", "false");
  await canvas.tap({
    position: { x: box.width * 0.45, y: box.height * 0.45 },
  });
  await expect(frame.locator("#statusbar")).toContainText(
    "Balls marked: 1 / 5",
  );
  await canvas.tap({
    position: { x: box.width * 0.45, y: box.height * 0.45 },
  });
  await expect(frame.locator("#statusbar")).toContainText(
    "Balls marked: 0 / 5",
  );
});
