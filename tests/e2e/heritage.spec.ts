import { test, expect } from "@playwright/test";
import {
  newQuest,
  questStep,
  maps,
  type QuestAction,
} from "../../src/games/heritage/quest";
for (const locale of ["en", "ko"]) {
  test(`apprentice full season, save, pause and ending ${locale}`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/play/starlight-apprentice/`);
    await page.locator("#start-button").click();
    await page.locator("[data-course=craft]").click();
    await expect(page.locator(".academy")).toHaveAttribute("data-week", "1");
    await page.locator("#pause-button").click();
    await expect(page.locator("[data-course=craft]")).toBeDisabled();
    await page.reload();
    await page.locator("#start-button").click();
    await expect(page.locator(".academy")).toHaveAttribute("data-week", "1");
    for (let i = 1; i < 24; i++)
      await page.locator("[data-course=rest]").click();
    await expect(page.locator(".academy")).toHaveAttribute("data-week", "24");
    await expect(page.locator("#start-button")).toBeVisible();
    await expect(page.locator("#player")).toContainText(
      locale === "ko" ? "치유사" : "Healer",
    );
  });
  test(`quest legal full campaign ${locale}`, async ({ page }) => {
    await page.goto(`/${locale}/play/beacon-quest/`);
    await page.locator("#start-button").click();
    let s = newQuest();
    async function act(a: QuestAction) {
      await page.locator(`[data-quest-action=${a}]`).click();
      s = questStep(s, a);
    }
    async function go(tx: number, ty: number) {
      const queue: [number, number, QuestAction[]][] = [[s.x, s.y, []]],
        seen = new Set<string>();
      let route: QuestAction[] = [];
      while (queue.length) {
        const [x, y, p] = queue.shift()!;
        if (x === tx && y === ty) {
          route = p;
          break;
        }
        if (seen.has(`${x},${y}`)) continue;
        seen.add(`${x},${y}`);
        for (const [a, dx, dy] of [
          ["up", 0, -1],
          ["down", 0, 1],
          ["left", -1, 0],
          ["right", 1, 0],
        ] as const) {
          const t = maps[s.chapter]?.[y + dy]?.[x + dx];
          if (t && t !== "#" && (t !== ">" || (x + dx === tx && y + dy === ty)))
            queue.push([x + dx, y + dy, [...p, a]]);
        }
      }
      for (const a of route) {
        await act(a);
        while (s.battle && !s.lost)
          await act(s.hp <= s.battle.power && s.gold >= 5 ? "potion" : "guard");
      }
    }
    for (let c = 0; c < 3; c++) {
      await go(7, 1);
      if (c === 0) {
        await go(4, 5);
        if (s.gold >= 10) await act("upgrade");
        await page.locator("#pause-button").click();
        await page.reload();
        await page.locator("#start-button").click();
        await expect(page.locator(".quest")).toHaveAttribute(
          "data-position",
          `${s.x},${s.y}`,
        );
      }
      if (c === 1) {
        await go(1, 3);
        if (s.gold >= 10) await act("upgrade");
      }
      if (c === 2) {
        await go(4, 1);
        if (s.gold >= 10) await act("upgrade");
      }
      await go(7, 5);
      if (c === 2) await go(5, 7);
      await go(7, 7);
    }
    expect(s.won).toBe(true);
    await expect(page.locator("#player")).toContainText(
      locale === "ko" ? "봉화가 다시 빛나요" : "The beacon shines again",
    );
  });
}
for (const width of [320, 360, 390, 430, 1440])
  for (const id of ["amber-trail", "starlight-apprentice", "beacon-quest"])
    test(`${id} fits ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/ko/play/${id}/`);
      await page.locator("#start-button").click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const surface = page.locator(
        id === "amber-trail" ? ".wild-canvas" : ".heritage-surface",
      );
      await expect(surface).toBeVisible();
      const rect = await surface.boundingBox();
      expect(rect!.width).toBeGreaterThan(150);
      if (id === "starlight-apprentice") {
        await page.locator("[data-course=rest]").click();
        await expect(surface).toHaveAttribute("data-week", "1");
      }
      if (id === "beacon-quest") {
        await page.locator("[data-quest-action=right]").click();
        await expect(surface).toHaveAttribute("data-position", "2,1");
      }
    });
test("amber trail continuous keyboard, pause, save and release", async ({
  page,
}) => {
  await page.goto("/en/play/amber-trail/");
  await page.locator("#start-button").click();
  await page.locator(".wild-canvas").focus();
  await page.keyboard.down("ArrowRight");
  await page.waitForTimeout(700);
  await page.keyboard.up("ArrowRight");
  const x = Number(await page.locator(".wild-canvas").getAttribute("data-x"));
  expect(x).toBeGreaterThan(130);
  await page.waitForTimeout(200);
  expect(
    Number(await page.locator(".wild-canvas").getAttribute("data-x")),
  ).toBe(x);
  await page.locator("#pause-button").click();
  await page.reload();
  await page.locator("#start-button").click();
  expect(
    Number(await page.locator(".wild-canvas").getAttribute("data-x")),
  ).toBe(x);
});
for (const stage of [1, 2, 3, 4, 5, 6])
  test(`amber trail stage ${stage} completes using real movement and attacks`, async ({
    page,
  }) => {
    await page.goto(`/en/play/amber-trail/?stage=${stage}`);
    await page.locator("#start-button").click();
    await page.locator(".wild-canvas").focus();
    await page.keyboard.down("ArrowRight");
    for (let i = 0; i < 135; i++) {
      // Check and send the gameplay input in one browser task: completion
      // focuses Restart, so a later global Space press can start a new round.
      const playing = await page.locator(".wild-canvas").evaluate((canvas) => {
        if (!document.querySelector<HTMLElement>("#game-overlay")?.hidden)
          return false;
        canvas.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: " ",
            code: "Space",
            bubbles: true,
            cancelable: true,
          }),
        );
        return true;
      });
      if (!playing) break;
      await page.waitForTimeout(100);
    }
    await page.keyboard.up("ArrowRight");
    await expect(page.locator("#player")).toContainText("Nicely done");
  });

test("amber trail gamepad neutral stops movement", async ({ page }) => {
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
  await page.goto("/en/play/amber-trail/");
  await page.locator("#start-button").click();
  await page.evaluate(() => {
    (window as unknown as { testPad: { axes: number[] } }).testPad.axes[0] = 1;
  });
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    (window as unknown as { testPad: { axes: number[] } }).testPad.axes[0] = 0;
  });
  await page.waitForTimeout(100);
  const x = await page.locator(".wild-canvas").getAttribute("data-x");
  await page.waitForTimeout(300);
  expect(await page.locator(".wild-canvas").getAttribute("data-x")).toBe(x);
});
