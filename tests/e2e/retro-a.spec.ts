import { test, expect, type Page } from "@playwright/test";
import * as frost from "../../src/games/frost-patrol/rules";
import * as duel from "../../src/games/crater-duel/rules";
import * as tank from "../../src/games/iron-bastion/rules";
const idle = { x: 0, y: 0, fire: false };
async function checkpoint(page: Page, id: string, state: unknown) {
  await page.addInitScript(
    ({ id, state }) => {
      localStorage.setItem(
        `denny-games:v1:progress:${id}:v1:${id}:v1:normal:1`,
        JSON.stringify({ version: 1, stage: 1, state }),
      );
    },
    { id, state },
  );
}
for (const locale of ["en", "ko"]) {
  test(`retro-a bomb blast loss and restart ${locale}`, async ({ page }) => {
    await page.goto(`/${locale}/play/ember-maze/`);
    await page.locator("#start-button").click();
    await page.locator('canvas[data-game="ember-maze"]').focus();
    await page.keyboard.press("Space");
    await expect(
      page.locator('canvas[data-game="ember-maze"]'),
    ).toHaveAttribute("data-lost", "true", { timeout: 6000 });
    await expect(page.locator("#next-stage")).toBeHidden();
    await page.locator("#restart-button").click();
    await expect(
      page.locator('canvas[data-game="ember-maze"]'),
    ).toHaveAttribute("data-lost", "false");
    await page.locator("#start-button").click();
    await page.keyboard.down("ArrowRight");
    await page.waitForTimeout(350);
    await page.keyboard.up("ArrowRight");
    await page.locator("#pause-button").click();
    const time = await page
      .locator("canvas.retro-a-canvas")
      .getAttribute("data-time");
    await page.waitForTimeout(200);
    await expect(page.locator("canvas.retro-a-canvas")).toHaveAttribute(
      "data-time",
      time!,
    );
    await page.reload();
    await expect(page.locator("canvas.retro-a-canvas")).toHaveAttribute(
      "data-time",
      time!,
    );
  });
  test(`retro-a snow projectiles freeze and kick to stage win ${locale}`, async ({
    page,
  }) => {
    const s = frost.create(1, "solo");
    s.heroes[0]!.x = 80;
    s.enemies.forEach((e, i) => {
      e.alive = i === 0;
      e.x = 120;
      e.y = 450;
      e.left = e.right = 120;
      e.vx = 0;
    });
    await checkpoint(page, "frost-patrol", s);
    await page.goto(`/${locale}/play/frost-patrol/`);
    await page.locator("#start-button").click();
    await page.locator("canvas.retro-a-canvas").focus();
    await page.keyboard.down("Space");
    await expect(page.locator("canvas.retro-a-canvas")).toHaveAttribute(
      "data-won",
      "true",
      {
        timeout: 9000,
      },
    );
    await page.keyboard.up("Space");
    await expect(page.locator("#next-stage")).toBeVisible();
    await page.locator("#next-stage").click();
    await expect(page).toHaveURL(/stage=2/);
    await expect(page.locator("canvas.retro-a-canvas")).toHaveAttribute(
      "data-won",
      "false",
    );
  });
  test(`retro-a artillery real ballistic shot destroys opponent ${locale}`, async ({
    page,
  }) => {
    const seed = duel.create(1, "local");
    let found = false;
    for (let angle = 20; angle <= 80 && !found; angle += 5)
      for (let power = 260; power <= 500 && !found; power += 20) {
        const candidate = duel.create(1, "local");
        candidate.wait = 0;
        candidate.angle = angle;
        candidate.power = power;
        candidate.hp[1] = 40;
        duel.fire(candidate);
        for (let i = 0; i < 500 && candidate.shot; i++)
          duel.step(candidate, 1, 0.02, [idle, idle]);
        if (candidate.won) {
          seed.angle = angle;
          seed.power = power;
          seed.hp[1] = 40;
          seed.wait = 0;
          found = true;
        }
      }
    expect(found).toBe(true);
    await checkpoint(page, "crater-duel", seed);
    await page.goto(`/${locale}/play/crater-duel/`);
    await page.locator("#start-button").click();
    await page.locator("canvas.retro-a-canvas").focus();
    await page.keyboard.press("Space");
    await expect(page.locator("canvas.retro-a-canvas")).toHaveAttribute(
      "data-won",
      "true",
      {
        timeout: 10000,
      },
    );
    await expect(page.locator("#player")).toContainText(
      locale === "ko" ? "P1 승리" : "P1 wins",
    );
  });
  test(`retro-a tank bullets finish a moving final raider ${locale}`, async ({
    page,
  }) => {
    const s = tank.create(1, "solo");
    s.spawned = 5;
    s.spawn = 3;
    s.tiles.fill(0);
    // Stay on the beacon approach: an off-axis enemy turns out of the
    // firing lane before a real user can fire, making an immediate-shot fixture race.
    s.heroes[0]!.x = 378;
    s.enemies = [{ x: 378, y: 270, dir: 2, hp: 1, cool: 1, inv: 0 }];
    await checkpoint(page, "iron-bastion", s);
    await page.goto(`/${locale}/play/iron-bastion/`);
    await page.locator("#start-button").click();
    await page.locator("canvas.retro-a-canvas").focus();
    await expect
      .poll(async () =>
        Number(
          await page.locator("canvas.retro-a-canvas").getAttribute("data-time"),
        ),
      )
      .toBeGreaterThan(0.2);
    await page.keyboard.down("Space");
    await expect(page.locator("canvas.retro-a-canvas")).toHaveAttribute(
      "data-won",
      "true",
      {
        timeout: 5000,
      },
    );
    await page.keyboard.up("Space");
    await expect(page.locator("#next-stage")).toBeVisible();
  });
}
for (const [id, field, startX] of [
  ["ember-maze", "actors", 13],
  ["frost-patrol", "heroes", 430],
  ["iron-bastion", "heroes", 450],
] as const) {
  test(`retro-a ${id} local player two moves independently`, async ({
    page,
  }) => {
    await page.goto(`/en/play/${id}/`);
    await expect(page.locator("canvas.retro-a-canvas")).toBeVisible();
    await page.locator("#player-settings summary").click();
    const mode = page.getByRole("combobox", { name: "Play mode", exact: true });
    await mode.selectOption("local");
    await page.locator("#player-settings summary").click();
    await page.locator("#start-button").click();
    await page.locator("canvas.retro-a-canvas").focus();
    await page.keyboard.down("a");
    await page.waitForTimeout(300);
    await page.keyboard.up("a");
    await page.locator("#pause-button").click();
    const state = await page.evaluate(
      ({ id, field }) => {
        const raw = JSON.parse(
          localStorage.getItem(
            `denny-games:v1:progress:${id}:v1:${id}:v1:normal:1`,
          )!,
        );
        return {
          mode: raw.state.mode,
          p1: raw.state[field][0].x,
          p2: raw.state[field][1].x,
        };
      },
      { id, field },
    );
    expect(state.mode).toBe("local");
    expect(state.p2).toBeLessThan(startX);
    expect(state.p1).toBe(
      id === "ember-maze" ? 1 : id === "frost-patrol" ? 350 : 270,
    );
    await page.locator("#player-settings summary").click();
    await expect(mode).toBeDisabled();
  });
}
