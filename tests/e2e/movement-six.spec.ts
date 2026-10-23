import { test, expect } from "@playwright/test";
import {
  fresh as trafficFresh,
  solve,
} from "../../src/games/traffic-escape/rules";
import { fresh as riverFresh, objects } from "../../src/games/river-hop/rules";
const saveKey = (id: string, stage = 1) =>
  `denny-games:v1:progress:${id}:v1:${id}:v1:normal:${stage}`;
for (const locale of ["en", "ko"]) {
  test(`Traffic Escape real move undo pause and reload ${locale}`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/play/traffic-escape/`);
    await page.locator("#start-button").click();
    const board = page.locator('#game-host [data-game="traffic-escape"]'),
      initial = await board.getAttribute("data-positions");
    const [car, d] = solve(trafficFresh(1))[0]!;
    await board.locator(".traffic-car").nth(car).click();
    const { CARS } = await import("../../src/games/traffic-escape/rules");
    const direction =
      CARS[car]!.axis === "h"
        ? d < 0
          ? "left"
          : "right"
        : d < 0
          ? "up"
          : "down";
    await page.locator(`[data-traffic-action=${direction}]`).click();
    await expect(board).toHaveAttribute("data-moves", "1");
    await page.locator("#pause-button").click();
    const pos = await board.getAttribute("data-positions");
    await page.waitForTimeout(300);
    await expect(board).toHaveAttribute("data-positions", pos!);
    await page.reload();
    await page.locator("#start-button").click();
    await expect(board).toHaveAttribute("data-positions", pos!);
    await page.locator("[data-traffic-action=undo]").click();
    await expect(board).toHaveAttribute("data-positions", initial!);
    await expect(board).toHaveAttribute("data-moves", "1");
  });
  test(`River Hop real hop frozen pause and restore ${locale}`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/play/river-hop/`);
    await page.locator("#start-button").click();
    const board = page.locator('#game-host [data-game="river-hop"]');
    await page.locator("[data-river-action=up]").click();
    await expect(board).toHaveAttribute("data-row", "9");
    await page.locator("#pause-button").click();
    const time = await board.getAttribute("data-time");
    await page.waitForTimeout(400);
    await expect(board).toHaveAttribute("data-time", time!);
    await page.reload();
    await page.locator("#start-button").click();
    await expect(board).toHaveAttribute("data-row", "9");
    await page.waitForTimeout(160);
    await page.locator("[data-river-action=left]").click();
    await expect(board).toHaveAttribute("data-hops", "2");
    await page.locator("#restart-button").click();
    await expect(board).toHaveAttribute("data-row", "10");
    await expect(board).toHaveAttribute("data-lives", "3");
  });
}
for (const id of ["traffic-escape", "river-hop"])
  for (const viewport of [
    { width: 320, height: 740 },
    { width: 390, height: 844 },
    { width: 1440, height: 900 },
    { width: 740, height: 360 },
  ])
    test(`${id} entire board and native actions fit ${viewport.width}x${viewport.height}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto(`/ko/play/${id}/`);
      await page.locator("#start-button").click();
      const board = page.locator(`#game-host [data-game="${id}"]`),
        r = await board.boundingBox();
      expect(r!.x).toBeGreaterThanOrEqual(0);
      expect(r!.y).toBeGreaterThanOrEqual(0);
      expect(r!.x + r!.width).toBeLessThanOrEqual(viewport.width + 1);
      expect(r!.y + r!.height).toBeLessThanOrEqual(viewport.height + 1);
      const tools = await page.locator(".player-tools").boundingBox();
      for (const control of await page
        .locator(
          "#game-controls button, #pause-button, #restart-button, #sound-button, #player-settings > summary",
        )
        .all()) {
        if (!(await control.isVisible())) continue;
        const bounds = await control.boundingBox();
        expect(bounds!.y).toBeGreaterThanOrEqual(tools!.y - 1);
        expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(
          tools!.y + tools!.height + 1,
        );
        expect(bounds!.x).toBeGreaterThanOrEqual(tools!.x - 1);
        expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(
          tools!.x + tools!.width + 1,
        );
      }
      for (const b of await page
        .locator(
          id === "traffic-escape"
            ? "[data-traffic-action]"
            : "[data-river-action]",
        )
        .all()) {
        const box = await b.boundingBox();
        expect(box!.width).toBeGreaterThanOrEqual(48);
        expect(box!.height).toBeGreaterThanOrEqual(48);
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height + 1);
      }
    });
test("Traffic Escape solved by real car inputs; terminal reload does not duplicate analytics", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("denny-games.analytics-consent", "granted-v2"),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en/play/traffic-escape/");
  await page.locator("#start-button").click();
  const board = page.locator('#game-host [data-game="traffic-escape"]');
  const { CARS } = await import("../../src/games/traffic-escape/rules");
  for (const [car, d] of solve(trafficFresh(1))) {
    await board.locator(".traffic-car").nth(car).click();
    const a =
      CARS[car]!.axis === "h"
        ? d < 0
          ? "left"
          : "right"
        : d < 0
          ? "up"
          : "down";
    await page.locator(`[data-traffic-action=${a}]`).click();
  }
  await expect(board).toHaveAttribute("data-phase", "won");
  const count = () =>
    page.evaluate(
      () =>
        (window.dataLayer ?? []).filter(
          (e) => e[0] === "event" && e[1] === "game_complete",
        ).length,
    );
  expect(await count()).toBe(1);
  await page.reload();
  await page.locator("#start-button").click();
  await expect(board).toHaveAttribute("data-phase", "won");
  expect(await count()).toBe(0);
});
test("River Hop final-bank real input wins and restores terminal", async ({
  page,
}) => {
  const s = riverFresh(5);
  s.row = 1;
  s.invulnerable = 0;
  s.time = 12;
  s.hops = 9;
  await page.addInitScript(
    ({ key, s }) => {
      if (!localStorage.getItem(key))
        localStorage.setItem(key, JSON.stringify(s));
      localStorage.setItem("denny-games.analytics-consent", "granted-v2");
    },
    { key: saveKey("river-hop", 5), s },
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en/play/river-hop/?stage=5");
  await page.locator("#start-button").click();
  await page.locator("[data-river-action=up]").click();
  await expect(
    page.locator('#game-host [data-game="river-hop"]'),
  ).toHaveAttribute("data-phase", "won");
  const count = () =>
    page.evaluate(
      () =>
        (window.dataLayer ?? []).filter(
          (e) => e[0] === "event" && e[1] === "game_complete",
        ).length,
    );
  expect(await count()).toBe(1);
  await page.reload();
  await page.locator("#start-button").click();
  await expect(
    page.locator('#game-host [data-game="river-hop"]'),
  ).toHaveAttribute("data-phase", "won");
  expect(await count()).toBe(0);
});
test("River Hop last-life collision ends once and restart resets the stage", async ({
  page,
}) => {
  const s = riverFresh(1);
  s.lives = 1;
  s.invulnerable = 0;
  s.row = 8;
  s.x = objects(s, 8).find((o) => o.x >= 0)!.x + 0.4;
  await page.addInitScript(
    ({ key, s }) => {
      if (!localStorage.getItem(key))
        localStorage.setItem(key, JSON.stringify(s));
    },
    { key: saveKey("river-hop"), s },
  );
  await page.goto("/en/play/river-hop/");
  await page.locator("#start-button").click();
  const board = page.locator('#game-host [data-game="river-hop"]');
  await expect(board).toHaveAttribute("data-phase", "lost");
  await page.locator("#restart-button").click();
  await expect(board).toHaveAttribute("data-phase", "play");
  await expect(board).toHaveAttribute("data-lives", "3");
});
