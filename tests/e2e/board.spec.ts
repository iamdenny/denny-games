import { setBoardMode } from "./helpers/board-settings";
import { test, expect } from "@playwright/test";
import { classicIds } from "../../src/data/board-games";
import { initial } from "../../src/games/board/rules";
for (const locale of ["en", "ko"] as const)
  for (const id of classicIds)
    test(`${locale} ${id}: choose local play before starting`, async ({
      page,
    }) => {
      if (locale === "ko" && id === "gomoku")
        await page.setViewportSize({ width: 800, height: 600 });
      await page.goto(`/${locale}/play/${id}/`);
      const choice = page.locator("#game-mode-choice");
      await expect(choice).toBeVisible();
      await expect(choice).toContainText(
        locale === "ko"
          ? "기기 하나에서 번갈아 두기"
          : "Take turns on this device",
      );
      await page.locator('[data-board-mode-setup="local"]').check();
      await expect(page.locator("[data-board-mode]")).toHaveValue("local");
      await expect(
        page.locator('[data-board-mode-setup="local"]'),
      ).toBeChecked();
      if (locale === "ko" && id === "gomoku")
        await page.screenshot({
          path: test.info().outputPath("gomoku-ready-mode.png"),
        });
      await page.locator("#start-button").click();
      await expect(page.locator(".classic-game")).toHaveAttribute(
        "data-board-kind",
        id,
      );
    });

for (const locale of ["en", "ko"] as const)
  test(`${locale} Gomoku: ready screen starts a real local two-player match`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/play/gomoku/`);
    await page.locator('[data-board-mode-setup="local"]').check();
    await page.locator("#start-button").click();
    await page.locator('[data-cell="112"]').click();
    await page.locator("[data-board-confirm]").click();
    await expect(page.locator(".classic-game")).toHaveAttribute(
      "data-moves",
      "1",
    );
    await expect(page.locator(".classic-game")).toHaveAttribute(
      "data-turn",
      "2",
    );
    await page.waitForTimeout(600);
    await expect(page.locator(".classic-game")).toHaveAttribute(
      "data-moves",
      "1",
    );
  });

for (const id of classicIds)
  test(`${id}: both local players can make a move`, async ({ page }) => {
    await page.goto(`/ko/play/${id}/`);
    await page.locator('[data-board-mode-setup="local"]').check();
    await page.locator("#start-button").click();
    const game = page.locator(".classic-game");
    const confirm = page.locator("[data-board-confirm]");

    async function move(player: 1 | 2) {
      if (id === "gomoku" || id === "four-in-a-row") {
        const cell = id === "gomoku" ? (player === 1 ? 112 : 113) : player - 1;
        await page.locator(`[data-cell="${cell}"]`).click();
        await expect(confirm).toBeEnabled();
        await confirm.click();
      } else if (id === "checkers") {
        const source = await page
          .locator(".board-cell.movable")
          .first()
          .getAttribute("data-cell");
        expect(source).not.toBeNull();
        await page.locator(`[data-cell="${source}"]`).click();
        await page.locator(".board-cell.legal").first().click();
      } else {
        const cell = await page
          .locator(".board-cell.legal")
          .first()
          .getAttribute("data-cell");
        expect(cell).not.toBeNull();
        await page.locator(`[data-cell="${cell}"]`).click();
        await page.locator(`[data-cell="${cell}"]`).click();
      }

      await expect(game).toHaveAttribute("data-moves", String(player));
      await expect(game).toHaveAttribute(
        "data-turn",
        String(player === 1 ? 2 : 1),
      );
      await expect(game).toHaveAttribute("data-ai-turn", "false");
    }

    await move(1);
    await page.waitForTimeout(600);
    await expect(game).toHaveAttribute("data-moves", "1");
    await move(2);
  });

for (const id of classicIds) {
  test(`${id}: preview, AI, local mode, pause, restoration and locale`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const workers: string[] = [];
    page.on("worker", (worker) => workers.push(worker.url()));
    await page.goto(`/en/play/${id}/?seed=board-tests`);
    await page.locator("#start-button").click();
    const game = page.locator(".classic-game");
    if (id === "checkers") await page.locator('[data-cell="40"]').click();
    await page
      .locator(
        id === "gomoku"
          ? '[data-cell="112"]'
          : id === "four-in-a-row"
            ? '[data-cell="0"]'
            : ".board-cell.legal",
      )
      .first()
      .click();
    if (id !== "checkers") {
      await expect(game).toHaveAttribute("data-moves", "0");
      await expect(page.locator("[data-board-confirm]")).toBeEnabled();
      await page.locator("[data-board-confirm]").click();
    }
    await expect(game).toHaveAttribute("data-moves", "2");
    expect(workers.length).toBeGreaterThan(0);
    await setBoardMode(page, "local");
    await expect(page.locator('[data-board-mode-setup="local"]')).toBeChecked();
    await expect(game).toHaveAttribute("data-moves", "0");
    if (id === "checkers") await page.locator('[data-cell="40"]').click();
    await page
      .locator(
        id === "gomoku"
          ? '[data-cell="112"]'
          : id === "four-in-a-row"
            ? '[data-cell="0"]'
            : ".board-cell.legal",
      )
      .first()
      .click();
    if (id !== "checkers") await page.locator("[data-board-confirm]").click();
    await expect(game).toHaveAttribute("data-moves", "1");
    await expect(game).toHaveAttribute("data-turn", "2");
    await page.locator("#pause-button").click();
    await expect(page.locator("#game-overlay")).toBeVisible();
    await expect(page.locator("#game-mode-choice")).toBeHidden();
    await page.reload();
    await expect(page.locator('[data-board-mode-setup="local"]')).toBeChecked();
    await page.locator("#start-button").click();
    await expect(game).toHaveAttribute("data-moves", "1");
    await expect(page.locator("[data-board-mode]")).toHaveValue("local");
    await page.locator('[data-locale-link][lang="ko"]').click();
    await page.locator("#start-button").click();
    await expect(game).toHaveAttribute("data-moves", "1");
    await expect(page.locator("[data-board-confirm]")).toHaveText(
      "선택한 수 두기",
    );
    await expect(page.locator("[data-ad-slot]")).toHaveCount(0);
    expect(errors).toEqual([]);
  });
  for (const width of [320, 390, 430])
    test(`${id}: ${width}px board and controls fit`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/ko/play/${id}/`);
      await page.locator("#start-button").click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const button = await page.locator("[data-board-confirm]").boundingBox();
      expect(button!.height).toBeGreaterThanOrEqual(48);
      await expect(page.locator(".classic-board")).toBeVisible();
    });
}
test("paused AI cannot make a late move and resumes exactly once", async ({
  page,
}) => {
  await page.goto("/en/play/gomoku/");
  await page.locator("#start-button").click();
  await page.locator('[data-cell="112"]').click();
  await page.locator("[data-board-confirm]").click();
  await page.locator("#pause-button").click();
  await page.waitForTimeout(550);
  await expect(page.locator(".classic-game")).toHaveAttribute(
    "data-moves",
    "1",
  );
  await page.locator("#start-button").click();
  await expect(page.locator(".classic-game")).toHaveAttribute(
    "data-moves",
    "2",
  );
});
test("Four in a Row supports keyboard preview then confirmation from the top row", async ({
  page,
}) => {
  await page.goto("/en/play/four-in-a-row/");
  await page.locator("#start-button").click();
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-board-confirm]")).toBeEnabled();
  await page.keyboard.press("Enter");
  await expect(page.locator(".classic-game")).toHaveAttribute(
    "data-moves",
    "2",
  );
});
test("a local winning move reports its side and restored results remain completed", async ({
  page,
}) => {
  const position = initial("gomoku");
  for (const i of [105, 106, 107, 108]) position.cells[i] = 1;
  position.moves = 8;
  await page.addInitScript((position) => {
    const key = "denny-games:v1:progress:gomoku:v1:winning-board:1";
    if (!localStorage.getItem(key))
      localStorage.setItem(
        key,
        JSON.stringify({ position, mode: "local", level: 2 }),
      );
  }, position);
  await page.goto("/en/play/gomoku/?seed=winning-board");
  await page.locator("#start-button").click();
  await page.locator('[data-cell="109"]').click();
  await page.locator("[data-board-confirm]").click();
  await expect(page.locator("#game-overlay")).toBeVisible();
  await expect(page.locator("#overlay-note")).toHaveText("Mint wins.");
  await page.reload();
  await page.locator("#start-button").click();
  await expect(page.locator("#overlay-note")).toHaveText("Mint wins.");
});
test("board category, collection, guide, schema and llms links are bilingual and crawlable", async ({
  page,
  request,
}) => {
  for (const locale of ["en", "ko"]) {
    await page.goto(`/${locale}/category/board/`);
    await expect(page.locator("[data-game-card]")).toHaveCount(11);
    await page.goto(`/${locale}/collections/classic-board/`);
    await expect(page.locator("[data-game-card]")).toHaveCount(5);
    await page.goto(`/${locale}/games/gomoku/`);
    const schema = JSON.parse(
      (await page
        .locator('script[type="application/ld+json"]')
        .textContent()) ?? "{}",
    );
    expect(
      schema["@graph"].find(
        (n: { "@type": string }) => n["@type"] === "VideoGame",
      ).playMode,
    ).toEqual([
      "https://schema.org/SinglePlayer",
      "https://schema.org/MultiPlayer",
    ]);
    await page
      .locator(`a[href="/${locale}/guides/classic-board-games/"]`)
      .click();
    await expect(page.locator("h1")).toBeVisible();
  }
  const response = await request.get("/llms.txt");
  expect(response.ok()).toBe(true);
  const text = await response.text();
  for (const id of classicIds) expect(text).toContain(`/ko/games/${id}/`);
  expect(text).toContain("304 published titles");
});

for (const id of classicIds)
  test(`${id}: sound starts only after a gesture and each move emits its own cue`, async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const NativeAudio = window.AudioContext;
      const evidence = {
        contexts: 0,
        frequencies: [] as number[],
        stopped: 0,
        state: () => "none",
      };
      (window as unknown as { audioEvidence: typeof evidence }).audioEvidence =
        evidence;
      window.AudioContext = class extends NativeAudio {
        constructor() {
          super();
          evidence.contexts++;
          evidence.state = () => this.state;
        }
        createOscillator() {
          const node = super.createOscillator();
          const start = node.start.bind(node),
            stop = node.stop.bind(node);
          node.start = (when) => {
            evidence.frequencies.push(node.frequency.value);
            start(when);
          };
          node.stop = (when) => {
            evidence.stopped++;
            stop(when);
          };
          return node;
        }
      };
    });
    await page.goto(`/en/play/${id}/?seed=sound`);
    expect(
      await page.evaluate(() => (window as any).audioEvidence.contexts),
    ).toBe(0);
    await page.locator("#sound-button").click();
    await expect(page.locator("#sound-button")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      await page.evaluate(() => (window as any).audioEvidence.state()),
    ).toBe("running");
    await page.locator("#start-button").click();
    await setBoardMode(page, "local");
    const before = await page.evaluate(
      () => (window as any).audioEvidence.frequencies.length,
    );
    if (id === "checkers") await page.locator('[data-cell="40"]').click();
    await page
      .locator(
        id === "gomoku"
          ? '[data-cell="112"]'
          : id === "four-in-a-row"
            ? '[data-cell="0"]'
            : ".board-cell.legal",
      )
      .first()
      .click();
    if (id !== "checkers") await page.locator("[data-board-confirm]").click();
    const notes = await page.evaluate(
      (before) => (window as any).audioEvidence.frequencies.slice(before),
      before,
    );
    expect(notes.length).toBe(
      id === "gomoku" || id === "four-in-a-row" || id === "reversi" ? 2 : 1,
    );
    await page.locator("#pause-button").click();
    expect(
      await page.evaluate(() => (window as any).audioEvidence.state()),
    ).toBe("suspended");
    await page.locator("#start-button").click();
    expect(
      await page.evaluate(
        () => (window as any).audioEvidence.frequencies.length,
      ),
    ).toBe(before + notes.length);
    await page.locator("#sound-button").click();
    await expect(page.locator("#game-overlay")).toBeHidden();
    expect(
      await page.evaluate(() => (window as any).audioEvidence.state()),
    ).toBe("suspended");
    if (id === "checkers")
      await page.locator(".board-cell.movable").first().click();
    await page.locator(".board-cell.legal").first().click();
    if (id !== "checkers") await page.locator("[data-board-confirm]").click();
    expect(
      await page.evaluate(
        () => (window as any).audioEvidence.frequencies.length,
      ),
    ).toBe(before + notes.length);
    await page.reload();
    await expect(page.locator("#sound-button")).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(
      await page.evaluate(() => (window as any).audioEvidence.contexts),
    ).toBe(0);
  });

test("sound preferences persist, but restoring enabled sound never autoplays", async ({
  page,
}) => {
  await page.goto("/ko/play/gomoku/");
  await page.locator("#player-settings summary").click();
  await page.locator("#sound-volume").fill("25");
  await page.locator("#sound-button").click();
  await page.reload();
  await expect(page.locator("#sound-button")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator("#sound-volume")).toHaveValue("25");
  await page.locator("#start-button").click();
  await page.locator("#sound-button").click();
  await expect(page.locator("#sound-button")).toHaveAttribute(
    "aria-pressed",
    "false",
  );
});

test("fractional imported scores stay readable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.addInitScript(() => {
    localStorage.setItem(
      "denny-games:v1:best:crisp-cywall:score-regression:1",
      "26.27129749556306",
    );
  });
  await page.goto("/ko/play/crisp-cywall/?seed=score-regression");
  await expect(page.locator("#best")).toHaveText("26");
  await page.locator("#start-button").click();
  const frame = page
    .frames()
    .find((f) => f.url().includes("/vendor/crisp/index.html"))!;
  await page.locator("#pause-button").click();
  await frame.waitForFunction(
    () =>
      !(window as unknown as { dennyBridge: { running: boolean } }).dennyBridge
        .running,
  );
  await frame.evaluate(() =>
    parent.postMessage(
      {
        channel: new URL(location.href).searchParams.get("channel"),
        type: "end",
        score: 26.27129749556306,
        won: false,
      },
      "*",
    ),
  );
  await expect(page.locator("#score")).toHaveText("26");
  await expect(page.locator("#overlay-note")).toHaveText("점수: 26");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

for (const locale of ["en", "ko"])
  test(`Gomoku ${locale}: click to preview, click the same intersection to confirm`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/play/gomoku/?seed=click-confirm`);
    await page.locator("#start-button").click();
    await setBoardMode(page, "local");
    const game = page.locator(".classic-game");
    await page.locator('[data-cell="112"]').click();
    await expect(game).toHaveAttribute("data-moves", "0");
    await expect(page.locator('[data-cell="112"]')).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await page.locator('[data-cell="113"]').click();
    await expect(game).toHaveAttribute("data-moves", "0");
    await expect(page.locator('[data-cell="112"]')).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    await page.locator('[data-cell="113"]').click();
    await expect(game).toHaveAttribute("data-moves", "1");
    await expect(
      page.locator('[data-cell="113"] .board-piece.side-1'),
    ).toHaveCount(1);
    await page.locator('[data-cell="113"]').click();
    await expect(game).toHaveAttribute("data-moves", "1");
    await page.locator('[data-cell="114"]').click();
    await page.locator('[data-cell="114"]').click();
    await expect(game).toHaveAttribute("data-moves", "2");
    await expect(
      page.locator('[data-cell="114"] .board-piece.side-2'),
    ).toHaveCount(1);
  });
