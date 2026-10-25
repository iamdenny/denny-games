import { expect, test, type Frame, type Page } from "@playwright/test";

declare global {
  interface Window {
    DennyGameBridge?: { running: boolean };
  }
}

const framePath = "/vendor/chogan-eightball/games/eightball/index.html";

async function getFrame(page: Page): Promise<Frame> {
  await expect(page.locator("#game-host iframe")).toHaveAttribute(
    "src",
    /vendor\/chogan-eightball\/games\/eightball\/index\.html/,
  );
  await expect
    .poll(() => page.frames().some((frame) => frame.url().includes(framePath)))
    .toBe(true);
  const frame = page.frames().find((item) => item.url().includes(framePath));
  if (!frame)
    throw new Error("Chogan 8-Ball Pool iframe did not finish navigation");
  await expect(frame.locator(".eb-canvas")).toBeVisible();
  return frame;
}

test("Chogan 8-Ball Pool stays local, bilingual, isolated and replayable", async ({
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
    await page.goto(`/${locale}/games/chogan-eightball/`);
    await expect(page.locator("h1")).toContainText(
      locale === "ko" ? "8볼 풀" : "8-Ball Pool",
    );
    await expect(page.locator("main")).toContainText(
      locale === "ko" ? "한 기기 2인 대전" : "same-device two-player",
    );
    await expect(
      page.locator(`a[href="/${locale}/guides/chogan-eightball/"]`),
    ).toBeVisible();
    await expect(page.locator(".detail-hero img")).toHaveAttribute(
      "src",
      "/art/open-games/chogan-eightball.svg",
    );

    await page.goto(`/${locale}/guides/chogan-eightball/`);
    await expect(page.locator("h1")).toContainText(
      locale === "ko" ? "8볼 풀" : "8-Ball Pool",
    );
    await expect(page.locator("main")).toContainText(
      locale === "ko" ? "온라인 매칭" : "online matchmaking",
    );
  }

  await page.goto("/licenses/chogan-eightball/");
  await expect(page.locator("h1")).toContainText("source and licenses");
  await expect(page.locator('a[href="LICENSE.txt"]')).toHaveCount(2);
  await expect(page.locator('a[href="OFL.txt"]')).toHaveCount(2);
  await expect(page.locator('a[href="THIRD-PARTY-NOTICES.txt"]')).toHaveCount(
    2,
  );
  const license = await request.get("/licenses/chogan-eightball/LICENSE.txt");
  expect(license.ok()).toBe(true);
  expect(await license.text()).toContain("Copyright (c) 2026 Chogan");
  const fontLicense = await request.get("/licenses/chogan-eightball/OFL.txt");
  expect(fontLicense.ok()).toBe(true);
  expect(await fontLicense.text()).toContain(
    "SIL OPEN FONT LICENSE Version 1.1",
  );

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ko/play/chogan-eightball/");
  await expect(page.locator("#start-button")).toBeEnabled({ timeout: 20000 });
  await expect(page.locator(".scoreboard")).toBeHidden();
  await expect(page.locator("#overlay-note")).toContainText("키보드");
  const iframe = page.locator("#game-host iframe");
  await expect(iframe).toHaveAttribute("sandbox", "allow-scripts");
  await expect(iframe).toHaveAttribute("referrerpolicy", "no-referrer");
  const frame = await getFrame(page);
  expect(
    await frame.evaluate(() => {
      try {
        void parent.document.body;
        return false;
      } catch {
        return true;
      }
    }),
  ).toBe(true);
  await expect(frame.locator("html")).toHaveAttribute("lang", "ko-KR");
  await expect(frame.locator(".ch-gamebar__title")).toHaveText("8볼 풀");
  await expect(frame.locator(".ch-scrim")).toHaveCount(0);
  await expect(frame.getByRole("button", { name: "전체 화면" })).toHaveCount(0);
  await expect(frame.getByRole("button", { name: "뒤로" })).toHaveCount(0);
  const csp = await frame
    .locator('meta[http-equiv="Content-Security-Policy"]')
    .getAttribute("content");
  expect(csp).toContain("connect-src 'none'");
  expect(csp).toContain("frame-src 'none'");
  expect(csp).not.toContain("unsafe-eval");

  for (const viewport of [
    { width: 320, height: 740 },
    { width: 390, height: 844 },
    { width: 820, height: 1180 },
    { width: 844, height: 390 },
    { width: 1180, height: 820 },
  ]) {
    await page.setViewportSize(viewport);
    await expect
      .poll(async () => {
        const box = await iframe.boundingBox();
        return Boolean(box && box.width > 0 && box.height > 0);
      })
      .toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(frame.locator(".eb-canvas")).toBeVisible();
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#start-button").click();
  await expect(page.locator("#game-overlay")).toBeHidden();
  await expect(frame.locator(".eb-player")).toHaveCount(2);

  const channel = new URL(frame.url()).searchParams.get("channel");
  expect(channel).toBeTruthy();
  const canvas = frame.locator(".eb-canvas");
  const beforeGamepadMove = await canvas.evaluate((element) =>
    (element as HTMLCanvasElement).toDataURL(),
  );
  await iframe.evaluate((element, activeChannel) => {
    (element as HTMLIFrameElement).contentWindow?.postMessage(
      { channel: activeChannel, type: "action", action: "up" },
      "*",
    );
  }, channel);
  await expect
    .poll(() =>
      canvas.evaluate((element) => (element as HTMLCanvasElement).toDataURL()),
    )
    .not.toBe(beforeGamepadMove);
  await frame.locator("body").press("ArrowUp");
  await expect(frame.locator('[role="slider"]')).toHaveAttribute(
    "aria-valuenow",
    "60",
  );

  await frame.getByRole("button", { name: "새 게임" }).click();
  await expect(frame.locator(".ch-scrim")).toContainText("두 명이 함께");
  await frame.getByRole("tab", { name: "두 명이 함께" }).click();
  await frame.getByRole("button", { name: "시작" }).click();
  await expect(frame.locator(".eb-player__name").nth(1)).toHaveText(
    "두 번째 플레이어",
  );

  await frame
    .getByRole("button", { name: "오른쪽으로 조금 조준" })
    .dispatchEvent("pointerdown", {
      pointerId: 1,
      pointerType: "mouse",
      isPrimary: true,
      button: 0,
      buttons: 1,
    });
  await page.locator("#pause-button").click();
  await expect(page.locator("#game-overlay")).toBeVisible();
  await expect
    .poll(() => frame.evaluate(() => window.DennyGameBridge?.running ?? false))
    .toBe(false);
  const pausedCanvas = await canvas.evaluate((element) =>
    (element as HTMLCanvasElement).toDataURL(),
  );
  await page.waitForTimeout(240);
  expect(
    await canvas.evaluate((element) =>
      (element as HTMLCanvasElement).toDataURL(),
    ),
  ).toBe(pausedCanvas);
  await page.locator("#start-button").click();
  await expect(page.locator("#game-overlay")).toBeHidden();
  await expect
    .poll(() => frame.evaluate(() => window.DennyGameBridge?.running ?? false))
    .toBe(true);

  const previousChannel = channel;
  await page.locator("#restart-button").click();
  await expect(page.locator("#start-button")).toBeEnabled();
  const restartedFrame = await getFrame(page);
  const restartedChannel = new URL(restartedFrame.url()).searchParams.get(
    "channel",
  );
  expect(restartedChannel).not.toBe(previousChannel);
  await expect(restartedFrame.locator(".ch-scrim")).toHaveCount(0);

  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});
