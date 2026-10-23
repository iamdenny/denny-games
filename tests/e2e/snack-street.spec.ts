import { test, expect } from "@playwright/test";
import {
  newShop,
  work,
  tick,
  nextDay,
  foods,
  type Shop,
} from "../../src/games/snack-street/engine";
const key = "denny-games:v1:progress:snack-street:v1:snack-street:v1:normal:1";
function nearEnd(day: number): Shop {
  let s = newShop();
  while (s.day < day || s.resolved < 4 + day) {
    if (s.phase === "shop") {
      s = nextDay(s);
      continue;
    }
    const i = foods.indexOf(s.orders[0]!.food);
    s = s.stations[i]!.cook ? tick(s) : work(s, i);
  }
  const i = foods.indexOf(s.orders[0]!.food);
  while (!s.stations[i]!.ready) s = s.stations[i]!.cook ? tick(s) : work(s, i);
  return s;
}
for (const locale of ["en", "ko"]) {
  test(`Snack Street recipes, pause and checkpoint ${locale}`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/play/snack-street/`);
    await page.locator("#start-button").click();
    const surface = page.locator(".snack-street");
    const roll = page.locator("[data-food=roll]");
    for (let i = 0; i < 3; i++) await roll.click();
    await expect(roll).toHaveAttribute("data-ready", "true");
    await roll.click();
    await expect(surface).toHaveAttribute("data-served", "1");
    await expect(surface).toHaveAttribute("data-earned", "9");
    const rice = page.locator("[data-food=rice]");
    await rice.click();
    await rice.click();
    await page.locator("#pause-button").click();
    await expect(rice).toBeDisabled();
    const paused = await rice.textContent();
    await page.waitForTimeout(1200);
    await expect(rice).toHaveText(paused!);
    await page.reload();
    await page.locator("#start-button").click();
    await expect(surface).toHaveAttribute("data-served", "1");
    await expect(rice).toHaveAttribute("data-ready", "true", { timeout: 6000 });
    await rice.click();
    await expect(surface).toHaveAttribute("data-served", "2");
  });
}
for (const width of [320, 390, 1440])
  test(`Snack Street ${width}px touch layout`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 740 });
    await page.goto("/ko/play/snack-street/");
    await page.locator("#start-button").click();
    const surface = page.locator(".snack-street");
    await expect(surface).toBeVisible();
    expect(
      await surface.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
    ).toBeTruthy();
    const stageBounds = await surface.boundingBox();
    const ordersBounds = await page.locator(".snack-orders").boundingBox();
    expect(ordersBounds!.y).toBeGreaterThanOrEqual(stageBounds!.y);
    for (const food of ["rice", "roll", "broth"]) {
      const b = page.locator(`[data-food=${food}]`);
      await expect(b).toBeVisible();
      const box = await b.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(48);
      expect(box!.y + box!.height).toBeLessThanOrEqual(
        stageBounds!.y + stageBounds!.height + 1,
      );
      await b.click();
    }
  });

test("Snack Street closes a day, purchases upgrades and resumes service", async ({
  page,
}) => {
  const state = nearEnd(1);
  await page.addInitScript(
    ({ key, state }) => localStorage.setItem(key, JSON.stringify(state)),
    { key, state },
  );
  await page.goto("/en/play/snack-street/");
  await expect(page.locator("#score")).toHaveText(String(state.earned));
  await page.locator("#start-button").click();
  await page.locator(`[data-food=${state.orders[0]!.food}]`).click();
  await expect(page.locator(".snack-street")).toHaveAttribute(
    "data-phase",
    "shop",
  );
  await page.locator("[data-upgrade=stove]").click();
  await expect(page.locator("[data-upgrade=stove]")).toContainText("42");
  await page.locator("[data-next-day]").click();
  await expect(page.locator(".snack-street")).toHaveAttribute("data-day", "2");
  await expect(page.locator("[data-order]")).toHaveCount(3);
});
test("Snack Street reduced motion completes campaign; terminal reload does not report another completion", async ({
  page,
}) => {
  const state = nearEnd(5);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(
    ({ key, state }) => {
      if (!localStorage.getItem(key))
        localStorage.setItem(key, JSON.stringify(state));
      localStorage.setItem("denny-games.analytics-consent", "granted-v2");
    },
    { key, state },
  );
  await page.goto("/en/play/snack-street/");
  await page.locator("#start-button").click();
  await page.locator(`[data-food=${state.orders[0]!.food}]`).click();
  await expect(page.locator(".snack-street")).toHaveAttribute(
    "data-phase",
    "done",
  );
  await expect(page.locator(".snack-street")).toHaveAttribute(
    "data-served",
    "40",
  );
  const completionCount = () =>
    page.evaluate(
      () =>
        (window.dataLayer ?? []).filter(
          (e) => e[0] === "event" && e[1] === "game_complete",
        ).length,
    );
  expect(await completionCount()).toBe(1);
  await page.reload();
  await page.locator("#start-button").click();
  await expect(page.locator(".snack-street")).toHaveAttribute(
    "data-phase",
    "done",
  );
  expect(await completionCount()).toBe(0);
});
