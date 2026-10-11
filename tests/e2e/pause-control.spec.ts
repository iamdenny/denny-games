import { test, expect } from "@playwright/test";
test("pointer pause remains paused when iframe blur arrives before click", async ({
  page,
}) => {
  await page.goto("/ko/play/crisp-forfour/");
  await page.locator("#start-button").click();
  const frame = page
    .frames()
    .find((f) => f.url().includes("/vendor/crisp/index.html"))!;
  await frame.waitForFunction(() => Number(document.body.dataset.ticks) > 5);
  await frame.locator("canvas").click();
  await page.locator("#pause-button").click({ delay: 150 });
  await expect(page.locator("#game-overlay")).toBeVisible({ timeout: 2000 });
  expect(
    await frame.evaluate(
      () =>
        (window as unknown as { dennyBridge: { running: boolean } }).dennyBridge
          .running,
    ),
  ).toBe(false);
  await page.locator("#pause-button").click({ delay: 150 });
  await expect(page.locator("#game-overlay")).toBeHidden();
  await frame.locator("body").press("Escape");
  await expect(page.locator("#game-overlay")).toBeVisible();
  await page.locator("#pause-button").focus();
  await page.locator("#pause-button").press("Enter");
  await expect(page.locator("#game-overlay")).toBeHidden();
});
