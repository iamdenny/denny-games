import { test, expect } from "@playwright/test";
import crisp from "../../src/data/crisp.json" with { type: "json" };
import { games } from "../../src/data/games";
for (const item of crisp)
  test(`${item.id}: isolated mobile load, input and pause`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const errors: string[] = [],
      external: string[] = [];
    const baseURL = testInfo.project.use.baseURL;
    if (typeof baseURL !== "string")
      throw new Error("Playwright baseURL is required for request isolation");
    const baseOrigin = new URL(baseURL).origin;
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("request", (r) => {
      if (
        !r.url().startsWith("data:") &&
        new URL(r.url()).origin !== baseOrigin
      )
        external.push(r.url());
    });
    await page.goto(`/ko/play/${item.id}/`);
    await expect(page.locator("#start-button")).toBeEnabled();
    await expect(page.locator("iframe")).toHaveAttribute(
      "sandbox",
      "allow-scripts",
    );
    await page.locator("#start-button").click();
    const frame = page
      .frames()
      .find((f) => f.url().includes("/vendor/crisp/index.html"))!;
    const canvas = frame.locator("canvas");
    if (item.id === "crisp-rolfrg") {
      await canvas.dispatchEvent("mousedown", { clientX: 100, clientY: 100 });
      await page.waitForTimeout(80);
      await canvas.dispatchEvent("mouseup", {});
      await expect(page.locator("#score")).not.toHaveText("0");
    } else {
      await frame.waitForFunction(
        () => Number(document.body.dataset.ticks) > 5,
      );
      await canvas.dispatchEvent("mousedown", { clientX: 100, clientY: 100 });
      await page.waitForTimeout(80);
      await canvas.dispatchEvent("mouseup", {});
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
    if (await page.locator("#pause-button").isEnabled())
      await page.locator("#pause-button").click();
    await frame.waitForFunction(
      () =>
        !(window as unknown as { dennyBridge: { running: boolean } })
          .dennyBridge.running,
    );
    const ticks = await frame.locator("body").getAttribute("data-ticks");
    await expect(page.locator("#game-controls")).toHaveAttribute("inert", "");
    await page.waitForTimeout(80);
    expect(await frame.locator("body").getAttribute("data-ticks")).toBe(ticks);
    for (const viewport of [
      { width: 390, height: 844 },
      { width: 800, height: 600 },
    ]) {
      await page.setViewportSize(viewport);
      await expect
        .poll(
          async () => {
            const available = await page
              .locator("#game-host")
              .evaluate((el) => {
                const style = getComputedStyle(el);
                return {
                  width:
                    el.clientWidth -
                    parseFloat(style.paddingLeft) -
                    parseFloat(style.paddingRight),
                  height:
                    el.clientHeight -
                    parseFloat(style.paddingTop) -
                    parseFloat(style.paddingBottom),
                };
              });
            const surface = (await page.locator("iframe").boundingBox())!;
            const canvas = await frame.locator("canvas").evaluate((el) => ({
              width: (el as HTMLCanvasElement).width,
              height: (el as HTMLCanvasElement).height,
              rect: el.getBoundingClientRect().toJSON(),
            }));
            const expected = Math.min(
              available.width,
              (available.height * canvas.width) / canvas.height,
            );
            return (
              Math.abs(surface.width - expected) < 2 &&
              Math.abs(canvas.rect.width - surface.width) < 2 &&
              Math.abs(canvas.rect.height - surface.height) < 2
            );
          },
          {
            message: `${item.id} fills its ${viewport.width}px stage and frame with the original ratio`,
          },
        )
        .toBe(true);
      expect(await frame.locator("body").getAttribute("data-ticks")).toBe(
        ticks,
      );
    }
    expect(errors).toEqual([]);
    expect(external).toEqual([]);
  });
test("category sort spans pages, imported search and lazy library", async ({
  page,
}) => {
  await page.goto("/en/category/action/");
  await expect(page.locator("[data-game-card]")).toHaveCount(24);
  await page.locator("[data-sort]").selectOption("name");
  await expect(page).toHaveURL(/sort=name/);
  const sorted = games
    .filter((game) => game.category === "action")
    .map((game) => ({ id: game.id, title: game.text.en.title }))
    .sort((a, b) => a.title.localeCompare(b.title, "en"));
  await expect(page.locator("[data-game-card]").first()).toHaveAttribute(
    "data-game-card",
    sorted[0]!.id,
  );
  await page.locator("[data-pagination] a").nth(1).click();
  await expect(page.locator("[data-game-card]").first()).toHaveAttribute(
    "data-game-card",
    sorted[24]!.id,
  );
  await page.goto("/ko/search/?q=자석");
  await expect(page.locator("#search-results")).toContainText("MAGNET BLOCKS");
  await page.goto("/ko/games/crisp-magnetblocks/");
  await page.locator('[data-favorite="crisp-magnetblocks"]').click();
  await page.goto("/ko/library/");
  await expect(
    page.locator('[data-library="favorites"] [data-game-card]'),
  ).toHaveCount(1);
  expect(await page.locator("[data-game-card]").count()).toBe(1);
});
test("held controller button and pointer, focus pause, restart, frame isolation", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const pad = {
      index: 0,
      mapping: "standard",
      axes: [0, 0],
      buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })),
    };
    Object.defineProperty(navigator, "getGamepads", { value: () => [pad] });
    (window as unknown as { testPad: typeof pad }).testPad = pad;
  });
  await page.goto("/en/play/crisp-accelb/");
  await expect(page.locator("#start-button")).toBeEnabled();
  await page.locator("#start-button").click();
  const frame = page
    .frames()
    .find((f) => f.url().includes("/vendor/crisp/index.html"))!;
  await page.evaluate(() => {
    (
      window as unknown as { testPad: { buttons: { pressed: boolean }[] } }
    ).testPad.buttons[0]!.pressed = true;
  });
  await frame.waitForFunction(
    () =>
      (window as unknown as { input: { isPressed: boolean } }).input.isPressed,
  );
  await page.waitForTimeout(180);
  expect(
    await frame.evaluate(
      () =>
        (window as unknown as { input: { isPressed: boolean } }).input
          .isPressed,
    ),
  ).toBe(true);
  await page.evaluate(() => {
    (
      window as unknown as { testPad: { buttons: { pressed: boolean }[] } }
    ).testPad.buttons[0]!.pressed = false;
  });
  await frame.waitForFunction(
    () =>
      !(window as unknown as { input: { isPressed: boolean } }).input.isPressed,
  );
  expect(
    await frame.evaluate(() => {
      try {
        return parent.document.body.nodeName;
      } catch {
        return "isolated";
      }
    }),
  ).toBe("isolated");
  await frame.locator("canvas").click();
  await expect(page.locator("#game-overlay")).toBeHidden();
  await frame.locator("body").press("Escape");
  await expect(page.locator("#game-overlay")).toBeVisible();
  await page.locator("#restart-button").click();
  await expect(page.locator("#start-button")).toBeEnabled();
  await expect(page.locator("#score")).toHaveText("0");
});
