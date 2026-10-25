import { test, expect } from "@playwright/test";
import {
  fresh as freshMine,
  reveal,
} from "../../src/games/minefield-watch/engine";
import {
  fresh as freshMosaic,
  puzzles,
  mark,
} from "../../src/games/mosaic-mystery/engine";
for (const id of ["minefield-watch", "mosaic-mystery"])
  for (const locale of ["en", "ko"])
    test(`${id} ${locale} native modes, pause, save and restart`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/play/${id}/`);
      await page.locator("#start-button").click();
      const root = page.locator(`#game-host [data-game=${id}]`);
      await page.locator(".watch-controls [data-mode]").click();
      await page.locator(".watch-controls [data-confirm]").click();
      await expect(root.locator('[data-cell="0"]')).toHaveAttribute(
        "data-kind",
        id === "minefield-watch" ? "flag" : "cross",
      );
      await page.locator("#pause-button").click();
      await expect(
        page.locator(".watch-controls [data-confirm]"),
      ).toBeDisabled();
      await page.reload();
      await page.locator("#start-button").click();
      await expect(root.locator('[data-cell="0"]')).toHaveAttribute(
        "data-kind",
        id === "minefield-watch" ? "flag" : "cross",
      );
      await root.locator(".watch-grid").focus();
      await page.keyboard.press("ArrowRight");
      await expect(root).toHaveAttribute("data-selected", "1");
      await page.locator("#restart-button").click();
      await expect(root).toHaveAttribute("data-selected", "0");
      await expect(root.locator('[data-cell="0"]')).toHaveAttribute(
        "data-kind",
        id === "minefield-watch" ? "hidden" : "blank",
      );
    });
for (const id of ["minefield-watch", "mosaic-mystery"])
  test(`${id} reduced motion completes and restored result is not another completion`, async ({
    page,
  }) => {
    const seed = `${id}:v1:normal`;
    const key = `denny-games:v1:progress:${id}:v1:${seed}:1`;
    let state: unknown,
      last = 0;
    if (id === "minefield-watch") {
      let s = reveal(freshMine(1, seed), 0);
      const safe = Array.from({ length: 36 }, (_, i) => i).filter(
        (i) => !s.mines.includes(i) && !s.open.includes(i),
      );
      last = safe.pop()!;
      for (const i of safe) s = reveal(s, i);
      state = s;
    } else {
      let s = freshMosaic(1);
      const filled = puzzles[0]!.cells.flatMap((v, i) => (v ? [i] : []));
      last = filled.pop()!;
      for (const i of filled) s = mark(s, i, 1);
      state = s;
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(
      ({ key, state }) => {
        if (!localStorage.getItem(key))
          localStorage.setItem(key, JSON.stringify(state));
        localStorage.setItem("denny-games.analytics-consent", "granted-v3");
      },
      { key, state },
    );
    await page.goto(`/en/play/${id}/`);
    await page.locator("#start-button").click();
    const cell = page.locator(
      `#game-host [data-game=${id}] [data-cell="${last}"]`,
    );
    await cell.click();
    await page.locator(".watch-controls [data-confirm]").click();
    await expect(page.locator(`#game-host [data-game=${id}]`)).toHaveAttribute(
      "data-phase",
      "won",
    );
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
    await expect(page.locator(`#game-host [data-game=${id}]`)).toHaveAttribute(
      "data-phase",
      "won",
    );
    expect(await count()).toBe(0);
  });
for (const id of ["minefield-watch", "mosaic-mystery"])
  for (const stage of [1, id === "minefield-watch" ? 3 : 12])
    test(`${id} stage ${stage} short landscape contains every cell and clue`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 740, height: 360 });
      await page.goto(`/ko/play/${id}/?stage=${stage}`);
      await page.locator("#start-button").click();
      const root = page.locator(`#game-host [data-game=${id}]`),
        grid = root.locator(".watch-grid");
      await expect(grid).toBeVisible();
      const box = await grid.boundingBox();
      expect(Math.abs(box!.width - box!.height)).toBeLessThan(2);
      for (const el of await grid
        .locator("button,.watch-row,.watch-col")
        .all()) {
        const r = await el.boundingBox();
        expect(r!.x).toBeGreaterThanOrEqual(box!.x);
        expect(r!.y).toBeGreaterThanOrEqual(box!.y);
        expect(r!.x + r!.width).toBeLessThanOrEqual(box!.x + box!.width + 1);
        expect(r!.y + r!.height).toBeLessThanOrEqual(box!.y + box!.height + 1);
      }
      const hint = await root.locator(".watch-note").boundingBox();
      expect(hint!.y).toBeGreaterThanOrEqual(box!.y + box!.height);
    });
