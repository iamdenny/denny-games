import { test, expect } from "@playwright/test";
import { quickPlayGroups } from "../../src/data/quick-play";
import { gameById, games } from "../../src/data/games";

test("all curated launch targets exist and declare local touch play", () => {
  for (const group of quickPlayGroups)
    for (const id of group.ids) {
      const game = gameById(id);
      expect(game, id).toBeDefined();
      expect(game!.externalPlay, id).toBeUndefined();
      expect(game!.inputs, id).toContain("touch");
      if (group.id === "together") expect(game!.classic, id).toBe(true);
    }
});

for (const locale of ["en", "ko"]) {
  test(`${locale}: pick a mood, cycle games and launch with touch controls`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/`);
    const launch = page.locator("[data-quick-launch]");
    await expect(launch).toHaveAttribute(
      "href",
      new RegExp(`^/${locale}/play/[^/]+/$`),
    );
    const initialId = await page
      .locator("[data-quick-play]")
      .getAttribute("data-quick-current");
    expect(gameById(initialId!)).toBeDefined();
    await page.locator('[data-quick-mood="think"]').click();
    await expect(page.locator('[data-quick-mood="think"]')).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(launch).toHaveAttribute(
      "href",
      `/${locale}/play/circuit-loop/`,
    );
    await page.locator("[data-quick-next]").click();
    await expect(launch).toHaveAttribute("href", `/${locale}/play/2048/`);
    await expect(page.locator("[data-quick-status]")).toContainText("2048");
    await page.locator("[data-quick-next]").click();
    await expect(launch).toHaveAttribute("href", `/${locale}/play/reversi/`);
    await page.locator("[data-quick-next]").click();
    await expect(launch).toHaveAttribute(
      "href",
      `/${locale}/play/klondike-solitaire/`,
    );
    await expect(page.locator("[data-quick-title]")).toContainText(
      locale === "ko" ? "솔리테어" : "Solitaire",
    );
    await page.locator("[data-quick-next]").click();
    await expect(launch).toHaveAttribute(
      "href",
      `/${locale}/play/circuit-loop/`,
    );
    await page.locator('[data-quick-mood="together"]').click();
    await expect(launch).toHaveAttribute("href", `/${locale}/play/gomoku/`);
    await expect(page.locator("[data-quick-note]")).toContainText(
      locale === "ko" ? "2인 플레이" : "two-player",
    );
    await launch.click();
    await expect(page.locator('[data-board-mode-setup="local"]')).toBeVisible();
  });
  test(`${locale}: static game links work without JavaScript`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`/${locale}/`);
    await expect(page.locator("[data-quick-title]")).toHaveText("Hextris");
    await expect(page.locator("[data-quick-controls]")).toBeHidden();
    await expect(page.locator("[data-quick-next]")).toBeHidden();
    await expect(page.locator("[data-quick-toggle]")).toBeHidden();
    await expect(page.locator(".home-genres [data-home-genre]")).toHaveCount(9);
    await page.locator('[data-home-genre="puzzle"]').click();
    await expect(page).toHaveURL(`/${locale}/category/puzzle/`);
    await page.goto(`/${locale}/`);
    await page.locator("[data-quick-details]").click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/games/hextris/`));
    await context.close();
  });
}

test("home spotlight rotates through the complete local catalogue and can pause", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install();
  await page.goto("/en/");
  const root = page.locator("[data-quick-play]");
  const choices = JSON.parse((await root.getAttribute("data-choices"))!);
  expect(choices.items.map((item: { id: string }) => item.id)).toEqual(
    games.map((game) => game.id),
  );
  expect(
    new Set(choices.items.map((item: { id: string }) => item.id)).size,
  ).toBe(games.length);

  const launch = page.locator("[data-quick-launch]");
  const initialHref = await launch.getAttribute("href");
  const rotation = page.locator("[data-quick-toggle]");
  await expect(rotation).toContainText("Pause rotation");
  await page.clock.fastForward(8000);
  await expect(launch).not.toHaveAttribute("href", initialHref!);

  await rotation.click();
  await expect(rotation).toContainText("Resume rotation");
  const pausedHref = await launch.getAttribute("href");
  await page.clock.fastForward(16000);
  await expect(launch).toHaveAttribute("href", pausedHref!);

  await page.mouse.move(0, 0);
  await rotation.evaluate((button: HTMLButtonElement) => button.blur());
  await rotation.click();
  await expect(rotation).toContainText("Pause rotation");
  await rotation.evaluate((button: HTMLButtonElement) => button.blur());
  await page.mouse.move(0, 0);
  await page.clock.fastForward(8000);
  await expect(launch).not.toHaveAttribute("href", pausedHref!);
});

test("keyboard focus pauses rotation even immediately after a pointer click", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install();
  await page.goto("/en/");
  const launch = page.locator("[data-quick-launch]");
  const initialHref = await launch.getAttribute("href");

  await page.locator("#quick-heading").click();
  await page.evaluate(() => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
    document
      .querySelector<HTMLButtonElement>('[data-quick-mood="all"]')!
      .focus();
  });

  await expect(page.locator("[data-quick-toggle]")).toContainText(
    "Resume rotation",
  );
  await page.clock.fastForward(16000);
  await expect(launch).toHaveAttribute("href", initialHref!);

  const rotation = page.locator("[data-quick-toggle]");
  await rotation.click();
  await expect(rotation).toContainText("Pause rotation");
  const resumedHref = await launch.getAttribute("href");
  await page.mouse.move(0, 0);
  await page.clock.fastForward(8000);
  await expect(launch).not.toHaveAttribute("href", resumedHref!);
});

test("search results show game art, controls and an in-site launch", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/ko/search/?q=회로");
  const circuit = page.locator('[data-search-result="circuit-loop"]');
  await expect(circuit).toBeVisible();
  await expect(circuit.locator("img")).toHaveAttribute(
    "src",
    "/art/circuit-loop.svg",
  );
  await expect(circuit).toContainText("위치 조작");
  await expect(circuit.locator("[data-search-play]")).toHaveAttribute(
    "href",
    "/ko/play/circuit-loop/",
  );
  await expect(circuit.locator("[data-search-details]")).toHaveAttribute(
    "href",
    "/ko/games/circuit-loop/",
  );
  const artwork = await circuit.locator("img").boundingBox();
  expect(artwork).not.toBeNull();
  expect(artwork!.width).toBeGreaterThan(artwork!.height);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  for (const action of await circuit
    .locator(".search-result-actions a")
    .all()) {
    expect((await action.boundingBox())!.height).toBeGreaterThanOrEqual(48);
  }
});

test("external game candidates are absent from public search", async ({
  page,
}) => {
  await page.goto("/en/search/?q=Lichess");
  await expect(page.locator('[data-search-result="lichess"]')).toHaveCount(0);
  await expect(page.locator("#search-empty")).toBeVisible();
  await expect(page.locator("#search-results [data-search-play]")).toHaveCount(
    0,
  );
});

test("recent games use real local history and never generate unknown or external play routes", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "denny-games:v1:recent",
      JSON.stringify(["unknown", "hexgl", "2048", "2048", "gomoku"]),
    ),
  );
  await page.goto("/ko/");
  const links = page.locator("[data-quick-recent-list] a");
  await expect(links).toHaveCount(2);
  await expect(links.first()).toHaveAttribute("href", "/ko/play/2048/");
  await links.first().click();
  await page.locator("#start-button").click();
  await expect(page.locator("#game-overlay")).toBeHidden();
});

test("denied storage keeps discovery working", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new DOMException("denied");
    };
    Storage.prototype.setItem = () => {
      throw new DOMException("denied");
    };
  });
  await page.goto("/en/");
  await expect(page.locator("[data-quick-recent]")).toBeHidden();
  const current = await page
    .locator("[data-quick-play]")
    .getAttribute("data-quick-current");
  await page.locator("[data-quick-next]").click();
  const selected = await page
    .locator("[data-quick-play]")
    .getAttribute("data-quick-current");
  expect(selected).not.toBe(current);
  expect(gameById(selected!)).toBeDefined();
});

for (const [width, height] of [
  [320, 568],
  [390, 844],
  [834, 1194],
  [1194, 834],
]) {
  test(`discovery fits ${width}x${height} with reduced motion`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: width!, height: height! });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/ko/");
    await page.locator('[data-quick-mood="together"]').click();
    for (const selector of [
      "[data-quick-launch]",
      "[data-quick-next]",
      "[data-quick-toggle]",
      '[data-quick-mood="together"]',
    ]) {
      const button = page.locator(selector);
      await button.scrollIntoViewIfNeeded();
      const rect = await button.boundingBox();
      expect(rect!.x).toBeGreaterThanOrEqual(0);
      expect(rect!.x + rect!.width).toBeLessThanOrEqual(width! + 1);
      expect(rect!.height).toBeGreaterThanOrEqual(48);
    }
    const imageRect = await page.locator("[data-quick-image]").boundingBox();
    const artRect = await page.locator("[data-quick-art-link]").boundingBox();
    expect(imageRect!.y).toBeGreaterThanOrEqual(artRect!.y);
    expect(imageRect!.y + imageRect!.height).toBeLessThanOrEqual(
      artRect!.y + artRect!.height,
    );
    if (width! < 700) {
      const copyRect = await page.locator(".quick-copy").boundingBox();
      expect(imageRect!.y + imageRect!.height).toBeLessThanOrEqual(copyRect!.y);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      await page
        .locator("[data-quick-image]")
        .evaluate((image) => getComputedStyle(image).transitionDuration),
    ).toBe("0s");
  });
}

for (const [width, height] of [
  [320, 568],
  [844, 390],
]) {
  test(`actual result, record and replay stay reachable at ${width}x${height}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: width!, height: height! });
    await page.addInitScript(() =>
      localStorage.setItem(
        "denny-games:v1:best:circuit-loop:replay-check:1",
        "1",
      ),
    );
    await page.goto("/en/play/circuit-loop/?seed=replay-check&stage=1");
    await page.locator("#start-button").click();
    for (let i = 0; i < 36; i++) {
      if (await page.locator("#game-overlay").isVisible()) break;
      await page.locator(".game-hint").click();
    }
    await expect(page.locator("#overlay-title")).toHaveText("Nicely done!");
    await expect(page.locator("#round-record")).toContainText(
      "New personal best!",
    );
    await expect(page.locator("#next-game")).toHaveAttribute(
      "href",
      "/en/play/2048/",
    );
    await page.locator("#next-game").scrollIntoViewIfNeeded();
    const next = await page.locator("#next-game").boundingBox();
    expect(next!.y).toBeGreaterThanOrEqual(0);
    expect(next!.y + next!.height).toBeLessThanOrEqual(height! + 1);
    await page.locator("#start-button").click();
    await expect(page.locator("#round-record")).toBeHidden();
    await expect(page.locator("#next-game")).toBeHidden();
    await page.locator("#start-button").click();
    await expect(page.locator("#game-overlay")).toBeHidden();
    await page.locator("#pause-button").click();
    await expect(page.locator("#next-game")).toBeHidden();
  });
}

test("start waits for game hydration on a slow connection", async ({
  page,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/_astro/*.js", async (route) => {
    await gate;
    await route.continue();
  });
  await page.goto("/en/play/2048/", { waitUntil: "commit" });
  await expect(page.locator("#start-button")).toBeDisabled();
  release();
  await expect(page.locator("#start-button")).toBeEnabled();
  await page.locator("#start-button").click();
  await expect(page.locator("#game-overlay")).toBeHidden();
});
