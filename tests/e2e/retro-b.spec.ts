import { test, expect, type Page } from "@playwright/test";
import { newPop } from "../../src/games/prism-pop/rules";
import { newHarbor } from "../../src/games/bubble-harbor/rules";
import { newWing } from "../../src/games/starfall-wing/rules";
import { newVault } from "../../src/games/vault-runner/rules";
async function checkpoint(page: Page, id: string, state: unknown) {
  await page.addInitScript(
    ({ id, state }) => {
      if (
        !localStorage.getItem(
          `denny-games:v1:progress:${id}:v1:${id}:v1:normal:1`,
        )
      )
        localStorage.setItem(
          `denny-games:v1:progress:${id}:v1:${id}:v1:normal:1`,
          JSON.stringify(state),
        );
    },
    { id, state },
  );
}
async function saved(page: Page, id: string) {
  return page.evaluate(
    (id) =>
      JSON.parse(
        localStorage.getItem(
          `denny-games:v1:progress:${id}:v1:${id}:v1:normal:1`,
        ) ?? "null",
      ),
    id,
  );
}
for (const locale of ["en", "ko"]) {
  test(`retro-b harpoon physically clears final sphere and next arena ${locale}`, async ({
    page,
  }) => {
    const s = newPop(1);
    s.score = 650;
    s.balls = [{ x: 320, y: 300, vx: 0, vy: 0, size: 0 }];
    await checkpoint(page, "prism-pop", s);
    await page.goto(`/${locale}/play/prism-pop/`);
    await page.locator("#start-button").click();
    await page.locator("[data-retro-action=fire]").click();
    await expect(page.locator(".retro-b-stage")).toHaveAttribute(
      "data-status",
      "won",
    );
    await expect(page.locator("#next-stage")).toBeVisible();
    await page.locator("#next-stage").click();
    await expect(page).toHaveURL(/stage=2/);
    await expect(page.locator(".retro-b-stage")).toHaveAttribute(
      "data-status",
      "playing",
    );
  });
  test(`retro-b aimed bubble attaches and clears a hex group ${locale}`, async ({
    page,
  }) => {
    const s = newHarbor(1);
    s.score = 3000;
    s.board = [
      { row: 0, col: 5, color: 0 },
      { row: 0, col: 6, color: 0 },
    ];
    s.ammo = s.next = 0;
    await checkpoint(page, "bubble-harbor", s);
    await page.goto(`/${locale}/play/bubble-harbor/`);
    await page.locator("#start-button").click();
    await page.locator("[data-retro-action=fire]").click();
    await expect(page.locator(".retro-b-stage")).toHaveAttribute(
      "data-status",
      "won",
      { timeout: 5000 },
    );
    await expect(page.locator("#next-stage")).toBeVisible();
  });
  test(`retro-b nova damages real guardian and completes sector ${locale}`, async ({
    page,
  }) => {
    const s = newWing(1);
    s.wave = 3;
    s.bossSpawned = true;
    s.boss = { x: 200, y: 100, hp: 20, kind: 1, phase: 0, fire: 1 };
    await checkpoint(page, "starfall-wing", s);
    await page.goto(`/${locale}/play/starfall-wing/`);
    await page.locator("#start-button").click();
    await page.locator("[data-retro-action=bomb]").click();
    await expect(page.locator(".retro-b-stage")).toHaveAttribute(
      "data-status",
      "won",
    );
    await expect(page.locator("#next-stage")).toBeVisible();
    expect((await saved(page, "starfall-wing")).bombs).toBe(1);
  });
  test(`retro-b vault collects last gem and reaches unlocked exit ${locale}`, async ({
    page,
  }) => {
    const s = newVault(1);
    s.gold = [{ x: 8, y: 1 }];
    s.collected = 3;
    s.score = 900;
    s.player = { x: 7, y: 1, px: 7, py: 1, anim: 0, trapped: 0, alive: true };
    s.guards.forEach((g) => {
      g.alive = false;
    });
    await checkpoint(page, "vault-runner", s);
    await page.goto(`/${locale}/play/vault-runner/`);
    await page.locator("#start-button").click();
    await page.locator("canvas").focus();
    await page.keyboard.down("ArrowRight");
    await expect(page.locator(".retro-b-stage")).toHaveAttribute(
      "data-status",
      "won",
      { timeout: 5000 },
    );
    await page.keyboard.up("ArrowRight");
    await expect(page.locator("#next-stage")).toBeVisible();
  });
}
test("retro-b dig persists, pause freezes and held input releases", async ({
  page,
}) => {
  const s = newVault(1);
  s.player = { x: 5, y: 9, px: 5, py: 9, anim: 0, trapped: 0, alive: true };
  await checkpoint(page, "vault-runner", s);
  await page.goto("/en/play/vault-runner/");
  await page.locator("#start-button").click();
  await page.locator("[data-retro-action=digRight]").click();
  await page.waitForTimeout(100);
  await page.locator("#pause-button").click();
  const before = await saved(page, "vault-runner");
  expect(before.holes).toHaveLength(1);
  await page.waitForTimeout(200);
  expect(await saved(page, "vault-runner")).toEqual(before);
  await page.reload();
  expect(await saved(page, "vault-runner")).toEqual(before);
  await page.locator("#start-button").click();
  await page.locator("canvas").focus();
  await page.keyboard.down("ArrowRight");
  await page.waitForTimeout(130);
  await page.locator("#pause-button").click();
  await page.keyboard.up("ArrowRight");
  const paused = await saved(page, "vault-runner");
  await page.locator("#start-button").click();
  await page.waitForTimeout(100);
  await page.locator("#pause-button").click();
  const resumed = await saved(page, "vault-runner");
  expect(resumed.player.x).toBe(paused.player.x);
});

test("retro-b bubble aim hands off from mouse hover to keyboard and onscreen controls", async ({
  page,
}) => {
  await page.goto("/en/play/bubble-harbor/");
  await page.locator("#start-button").click();
  const canvas = page.locator(".retro-b-stage canvas");
  const box = (await canvas.boundingBox())!;
  const point = { x: box.x + box.width * 0.3, y: box.y + box.height * 0.25 };
  await page.mouse.move(point.x, point.y);
  await page.waitForTimeout(80);
  await page.locator("#pause-button").click();
  const baseline = (await saved(page, "bubble-harbor")).angle;
  await page.locator("#start-button").click();
  await page.mouse.move(point.x, point.y);
  await page.waitForTimeout(80);
  await canvas.focus();
  await page.keyboard.down("ArrowRight");
  await page.waitForTimeout(250);
  await page.keyboard.up("ArrowRight");
  await page.locator("#pause-button").click();
  expect((await saved(page, "bubble-harbor")).angle).toBeGreaterThan(
    baseline + 0.2,
  );
  await page.locator("#start-button").click();
  await page.mouse.move(point.x, point.y);
  await page.waitForTimeout(80);
  const right = page.locator("[data-retro-action=right]");
  const controlBox = (await right.boundingBox())!;
  await page.mouse.move(
    controlBox.x + controlBox.width / 2,
    controlBox.y + controlBox.height / 2,
  );
  await page.mouse.down();
  await page.waitForTimeout(250);
  await page.mouse.up();
  await page.locator("#pause-button").click();
  expect((await saved(page, "bubble-harbor")).angle).toBeGreaterThan(
    baseline + 0.2,
  );
});
