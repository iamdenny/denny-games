import { test, expect } from "@playwright/test";
import { games } from "../../src/data/games";
import { agenticGames } from "../../src/data/agentic-games";
import fs from "node:fs";
const crisp = JSON.parse(
  fs.readFileSync("src/data/century-crisp.json", "utf8"),
) as { id: string }[];
const added = [...crisp.map((g) => g.id), ...agenticGames.map((g) => g.id)];
for (const locale of ["en", "ko"])
  test(`century hundred distinct local titles and crawlable metadata ${locale}`, async ({
    request,
  }) => {
    test.setTimeout(120000);
    expect(added).toHaveLength(100);
    expect(new Set(added).size).toBe(100);
    const index = (await (
      await request.get(`/${locale}/search-index.json`)
    ).json()) as { id: string }[];
    expect(index).toHaveLength(games.length);
    for (const id of added) {
      expect(index.filter((g) => g.id === id)).toHaveLength(1);
      const response = await request.get(`/${locale}/games/${id}/`);
      expect(response.ok()).toBe(true);
      const html = await response.text();
      expect(html).toContain(
        `https://games.iamdenny.com/${locale}/games/${id}/`,
      );
      expect(html).toContain("VideoGame");
      expect(html).toContain(`/${locale}/play/${id}/`);
      expect(html).not.toContain('content="noindex');
      const game = games.find((g) => g.id === id)!;
      expect(game.externalPlay).toBeUndefined();
      expect((await request.get(game.artwork)).ok()).toBe(true);
    }
  });
for (const game of agenticGames)
  test(`century agentic lifecycle ${game.id}`, async ({ page }, info) => {
    const baseOrigin = new URL(String(info.project.use.baseURL)).origin;
    const errors: string[] = [],
      foreign: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => {
      if (/^https?:/.test(r.url()) && new URL(r.url()).origin !== baseOrigin)
        foreign.push(r.url());
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/ko/play/${game.id}/`);
    await page.locator("#start-button").click();
    const frame = page
      .frames()
      .find((f) => f.url().includes("/vendor/agentic/"))!;
    expect(frame).toBeTruthy();
    const canvas = frame.locator("canvas").first();
    await expect(canvas).toBeVisible();
    await expect(page.locator("iframe")).toHaveAttribute(
      "sandbox",
      "allow-scripts",
    );
    await canvas.click({ position: { x: 30, y: 30 } });
    await page.keyboard.press("Space");
    await page.keyboard.down("ArrowRight");
    await page.waitForTimeout(150);
    await page.keyboard.up("ArrowRight");
    await page.locator("#pause-button").click();
    await page.waitForTimeout(100);
    const ticks = await frame.locator("body").getAttribute("data-ticks");
    const snapshot = await canvas.evaluate((el) =>
      (el as HTMLCanvasElement).toDataURL(),
    );
    await page.waitForTimeout(180);
    expect(
      await canvas.evaluate((el) => (el as HTMLCanvasElement).toDataURL()),
    ).toBe(snapshot);
    await expect(frame.locator("body")).toHaveAttribute("data-ticks", ticks!);
    await page.locator("#start-button").click();
    await expect
      .poll(async () =>
        Number(await frame.locator("body").getAttribute("data-ticks")),
      )
      .toBeGreaterThan(Number(ticks));
    await page.waitForTimeout(150);
    await expect(page.locator("#pause-button")).toBeEnabled();
    const previousSource = await page.locator("iframe").getAttribute("src");
    await page.locator("#restart-button").click();
    await expect(page.locator("iframe")).not.toHaveAttribute(
      "src",
      previousSource!,
    );
    await expect(page.locator("iframe")).toHaveCount(1);
    await expect(page.locator("#start-button")).toBeEnabled();
    const restartedBody = page.frameLocator("iframe").locator("body");
    const readyTicks = await restartedBody.getAttribute("data-ticks");
    await page.waitForTimeout(150);
    expect(await restartedBody.getAttribute("data-ticks")).toBe(readyTicks);
    await page.locator("#start-button").click();
    await expect
      .poll(async () =>
        Number(
          await page
            .frameLocator("iframe")
            .locator("body")
            .getAttribute("data-ticks"),
        ),
      )
      .toBeGreaterThan(2);
    await expect(page.locator("#pause-button")).toBeEnabled();
    expect(errors).toEqual([]);
    expect(foreign).toEqual([]);
    expect(
      await page.evaluate(() => !!(window as Window & { gtag?: unknown }).gtag),
    ).toBe(false);
  });
for (const id of [
  "agentic-blink-scope",
  "agentic-draft-line",
  "agentic-twin-vector",
])
  for (const [width, height] of [
    [320, 740],
    [740, 360],
    [1440, 900],
  ])
    test(`century stage bounds ${id} ${width}`, async ({ page }) => {
      await page.setViewportSize({ width: width!, height: height! });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`/ko/play/${id}/`);
      await page.locator("#start-button").click();
      const frame = page
        .frames()
        .find((f) => f.url().includes("/vendor/agentic/"))!;
      for (const el of [
        page.locator("iframe"),
        frame.locator("canvas").first(),
        ...(await page
          .locator(
            "#game-controls button,#pause-button,#restart-button,#sound-button,#player-settings summary",
          )
          .all()),
      ]) {
        if (!(await el.isVisible())) continue;
        const b = await el.boundingBox();
        expect(b!.x).toBeGreaterThanOrEqual(-1);
        expect(b!.y).toBeGreaterThanOrEqual(-1);
        expect(b!.x + b!.width).toBeLessThanOrEqual(width! + 1);
        expect(b!.y + b!.height).toBeLessThanOrEqual(height! + 1);
        if (await el.evaluate((e) => e.matches("button,summary"))) {
          expect(b!.height).toBeGreaterThanOrEqual(48);
          expect(b!.width).toBeGreaterThanOrEqual(48);
        }
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    });
test("century imported start analytics respects consent and does not count pause as completion", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("denny-games.analytics-consent", "granted-v2"),
  );
  await page.goto("/en/play/agentic-blink-scope/");
  const events = () =>
    page.evaluate(() =>
      ((window as Window & { dataLayer?: IArguments[] }).dataLayer ?? [])
        .map((v) => Array.from(v))
        .filter((v) => v[0] === "event"),
    );
  expect(await events()).toEqual([]);
  await page.locator("#start-button").click();
  await expect
    .poll(
      async () => (await events()).filter((v) => v[1] === "game_start").length,
    )
    .toBe(1);
  await page.locator("#pause-button").click();
  await page.waitForTimeout(200);
  expect((await events()).filter((v) => v[1] === "game_complete")).toEqual([]);
  await page.locator("#start-button").click();
  expect((await events()).filter((v) => v[1] === "game_start")).toHaveLength(1);
  const start = (await events()).find((v) => v[1] === "game_start")!;
  expect(start[2]).toMatchObject({ game_id: "agentic-blink-scope" });
  expect(start[2]).not.toHaveProperty("score");
});
test("century natural loss emits one consented completion", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.addInitScript(() =>
    localStorage.setItem("denny-games.analytics-consent", "granted-v2"),
  );
  await page.goto("/en/play/agentic-blink-scope/");
  await page.locator("#start-button").click();
  // Stay still and let the original hunters reach the player. No source state,
  // timer acceleration, bridge end message or synthetic result is injected.
  const completions = () =>
    page.evaluate(() =>
      ((window as Window & { dataLayer?: IArguments[] }).dataLayer ?? [])
        .map((v) => Array.from(v))
        .filter((v) => v[0] === "event" && v[1] === "game_complete"),
    );
  await expect
    .poll(async () => (await completions()).length, { timeout: 60000 })
    .toBe(1);
  await page.waitForTimeout(250);
  const completed = await completions();
  expect(completed).toHaveLength(1);
  expect(completed[0]![2]).toMatchObject({ game_id: "agentic-blink-scope" });
  expect(completed[0]![2]).not.toHaveProperty("score");
});

test("century real audio follows sound, volume, pause and restart", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const captured: { context: AudioContext; gains: GainNode[] }[] = [];
    Object.assign(window, { __audioEvidence: captured });
    const Native = window.AudioContext;
    window.AudioContext = new Proxy(Native, {
      construct(Target, args) {
        const context = new Target(...args);
        const gains: GainNode[] = [];
        const create = context.createGain.bind(context);
        context.createGain = () => {
          const gain = create();
          gains.push(gain);
          return gain;
        };
        captured.push({ context, gains });
        return context;
      },
    });
  });
  await page.goto("/en/play/agentic-blink-scope/");
  await page.locator("#sound-button").click();
  await expect(page.locator("#sound-button")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.locator("#start-button").click();
  const read = async () =>
    page
      .frameLocator("iframe")
      .locator("body")
      .evaluate(() => {
        const entries = (
          window as unknown as {
            __audioEvidence: { context: AudioContext; gains: GainNode[] }[];
          }
        ).__audioEvidence;
        return entries.map((e) => ({
          state: e.context.state,
          master: e.gains[0]?.gain.value,
        }));
      });
  await page.frameLocator("iframe").locator("canvas").click();
  await expect
    .poll(async () => (await read()).some((e) => e.state === "running"))
    .toBe(true);
  await page.locator("#player-settings summary").click();
  await page.locator("#sound-volume").fill("0");
  await expect
    .poll(async () => (await read()).every((e) => e.master === 0))
    .toBe(true);
  await page.locator("#player-settings summary").click();
  await page.locator("#pause-button").click();
  await expect
    .poll(async () => (await read()).every((e) => e.state === "suspended"))
    .toBe(true);
  await page.locator("#restart-button").click();
  await expect(page.locator("#start-button")).toBeEnabled();
  await expect(page.locator("#sound-button")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.locator("#start-button").click();
  await page.frameLocator("iframe").locator("canvas").click();
  await expect
    .poll(async () =>
      (await read()).some((e) => e.state === "running" && e.master === 0),
    )
    .toBe(true);
  await page.locator("#sound-button").click();
  await expect
    .poll(async () => (await read()).every((e) => e.state === "suspended"))
    .toBe(true);
});
