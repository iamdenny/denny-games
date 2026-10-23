import { expect, test } from "@playwright/test";

async function begin(page: import("@playwright/test").Page, route: string) {
  await page.goto(route);
  await page.locator("#start-button").click();
  await expect(page.locator(".gonggi-game")).toBeVisible();
}

async function catchInAmberBand(
  page: import("@playwright/test").Page,
  button = page.locator(".gonggi-catch"),
) {
  await expect(button).toBeEnabled();
  await expect(button).toHaveClass(/in-window/, { timeout: 5000 });
  await expect(button).toHaveCSS("color", "rgb(21, 42, 44)");
  await button.click();
}

for (const locale of ["ko", "en"] as const) {
  test(`${locale}: Gonggi stage one is playable through four catches`, async ({
    page,
  }) => {
    await begin(page, `/${locale}/play/gonggi/?seed=stage-one`);
    const toss = page.locator(
      ".gonggi-controls .gonggi-action:not(.gonggi-catch)",
    );
    const status = page.locator(".gonggi-status");

    for (let group = 0; group < 4; group++) {
      await toss.click();
      await page.locator(".gonggi-stone:not(:disabled)").first().click();
      await catchInAmberBand(page);
      if (group < 3)
        await expect(status).toContainText(
          locale === "ko" ? "잘 받았어요" : "Nice catch",
        );
    }

    await expect(page.locator("#next-stage")).toBeVisible();
    await expect(page.locator("#score")).not.toHaveText("0");
  });
}

test("Kkeokgi uses two timed catches and reports the recovered count", async ({
  page,
}) => {
  await page.clock.install();
  await begin(page, "/en/play/gonggi/?seed=kkeokgi&stage=5");
  await expect(page.locator(".gonggi-stone").first()).toHaveAccessibleName(
    "Kkeokgi display stone 1",
  );
  const toss = page.locator(
    ".gonggi-controls .gonggi-action:not(.gonggi-catch)",
  );
  const catchButton = page.locator(".gonggi-catch");

  await toss.click();
  await catchAtCenter(page, catchButton);
  await expect(toss).toContainText("Flick");
  await toss.click();
  await catchAtCenter(page, catchButton);

  await expect(page.locator("#next-stage")).toBeVisible();
  await expect(page.locator("#score")).toHaveText("750");
  await expect(page.locator("#overlay-note")).toContainText("5 stones");
});

async function catchAtCenter(
  page: import("@playwright/test").Page,
  button: import("@playwright/test").Locator,
) {
  await expect(button).toBeEnabled();
  await page.clock.runFor(2600);
  await expect(button).toHaveClass(/in-window/);
  await expect(button).toHaveCSS("color", "rgb(21, 42, 44)");
  await button.click();
}

test("touch-sized layout has no horizontal overflow at phone, tablet and desktop widths", async ({
  page,
}) => {
  await page.goto("/ko/games/gonggi/");
  await expect(
    page.getByRole("heading", { name: "공기놀이", level: 1 }),
  ).toBeVisible();
  await page.goto("/ko/play/gonggi/");
  await page.locator("#start-button").click();

  for (const viewport of [
    { width: 320, height: 740 },
    { width: 390, height: 844 },
    { width: 810, height: 1080 },
    { width: 1080, height: 810 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      )
      .toBe(true);
    const minimumStone = await page
      .locator(".gonggi-stone")
      .first()
      .evaluate((element) => element.getBoundingClientRect().width);
    expect(minimumStone).toBeGreaterThanOrEqual(48);
  }
});

test("keyboard selection and pause/reload keep the stage usable", async ({
  page,
}) => {
  await begin(page, "/en/play/gonggi/?seed=keyboard-save");
  await page
    .locator(".gonggi-controls .gonggi-action:not(.gonggi-catch)")
    .click();
  const stone = page.locator(".gonggi-stone:not(:disabled)").first();
  await stone.focus();
  await stone.press("Enter");
  await expect(stone).toHaveAttribute("aria-pressed", "true");

  const beforePause = Number(
    await page.locator(".gonggi-flight-track").getAttribute("aria-valuenow"),
  );
  await page.locator("#pause-button").click();
  await page.waitForTimeout(300);
  const paused = Number(
    await page.locator(".gonggi-flight-track").getAttribute("aria-valuenow"),
  );
  expect(paused).toBeGreaterThanOrEqual(beforePause);
  await page.waitForTimeout(250);
  await expect(page.locator(".gonggi-flight-track")).toHaveAttribute(
    "aria-valuenow",
    String(paused),
  );

  await page.locator("#start-button").click();
  await catchInAmberBand(page);
  await page.reload();
  await expect(page.locator("#start-button")).toBeEnabled();
  await page.locator("#start-button").click();
  await page
    .locator(".gonggi-controls .gonggi-action:not(.gonggi-catch)")
    .click();
  await expect(page.locator(".gonggi-stone")).toHaveCount(4);
  await expect(page.locator(".gonggi-stone:not(:disabled)")).toHaveCount(3);
});

test("bilingual guide and traditional-games collection link to the local player", async ({
  page,
}) => {
  for (const [locale, title] of [
    ["en", "How to play Gonggi: four picking stages and Kkeokgi"],
    ["ko", "공기놀이 하는 법: 1단부터 꺾기까지"],
  ] as const) {
    const playHref = `a[href="/${locale}/play/gonggi/"]`;
    await page.goto(`/${locale}/guides/gonggi-rules/`);
    await expect(
      page.getByRole("heading", { name: title, level: 1 }),
    ).toBeVisible();
    await expect(page.locator(playHref)).toBeVisible();
    await page.goto(`/${locale}/collections/traditional-games/`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      locale === "ko" ? "전통놀이" : "Korean traditional games",
    );
    await expect(page.locator(playHref)).toBeVisible();
  }
});
