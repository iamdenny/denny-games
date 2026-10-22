import { test, expect } from "@playwright/test";
for (const id of ["neverball", "neverputt"]) {
  test(`${id} local course gameplay, pause, save and reload`, async ({
    page,
  }) => {
    test.setTimeout(90000);
    const errors: string[] = [],
      remote: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => {
      if (/neverball\.org/.test(r.url())) remote.push(r.url());
    });
    await page.goto(`/en/play/${id}/`);
    await page.locator("#start-button").click({ timeout: 60000 });
    const frame = page.frameLocator("iframe"),
      canvas = frame.locator("canvas");
    await expect(canvas).toBeVisible();
    await page.waitForTimeout(3500);
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press("Enter");
      await page.waitForTimeout(600);
    }
    const box = await canvas.boundingBox();
    expect(box!.width / box!.height).toBeCloseTo(16 / 9, 1);
    const before = await canvas.screenshot();
    await page.keyboard.down("ArrowUp");
    await page.waitForTimeout(700);
    await page.keyboard.up("ArrowUp");
    await page.keyboard.press("Space");
    await page.waitForTimeout(700);
    expect(Buffer.compare(before, await canvas.screenshot())).not.toBe(0);
    expect(
      await canvas.evaluate(() => document.pointerLockElement === null),
    ).toBe(true);
    await page.locator("#pause-button").click();
    await expect(page.locator("#start-button")).toBeVisible();
    await page.waitForTimeout(250);
    const frozen = await canvas.screenshot();
    await page.waitForTimeout(500);
    expect(Buffer.compare(frozen, await canvas.screenshot())).toBe(0);
    const beforeRestart = await page.evaluate(
      () =>
        Object.entries(localStorage).find(([key]) =>
          key.includes("progress:never"),
        )?.[1],
    );
    expect(beforeRestart).toContain("neverballrc");
    await page.locator("#restart-button").click();
    await expect(page.locator("#start-button")).toBeEnabled({ timeout: 60000 });
    const afterRestart = await page.evaluate(
      () =>
        Object.entries(localStorage).find(([key]) =>
          key.includes("progress:never"),
        )?.[1],
    );
    expect(afterRestart).toBe(beforeRestart);
    await page.reload();
    await page.locator("#start-button").click({ timeout: 60000 });
    await expect(canvas).toBeVisible();
    expect(errors).toEqual([]);
    expect(remote).toEqual([]);
  });
}
