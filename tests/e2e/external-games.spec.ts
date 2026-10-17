import { test, expect } from "@playwright/test";
import { games } from "../../src/data/games";

const externalGames = games.flatMap((game) =>
  game.externalPlay
    ? [
        {
          id: game.id,
          title: game.text,
          url: game.externalPlay.url,
          licenseDescription: game.licenseDescription,
          licenseUrl: game.licenseUrl,
          licenseUrlLabel: game.licenseUrlLabel,
          privacyNote: game.externalPlay.privacyNote,
          privacyUrl: game.externalPlay.privacyUrl,
        },
      ]
    : [],
);

for (const locale of ["en", "ko"] as const) {
  for (const game of externalGames) {
    test(`${locale} ${game.id}: explains and safely opens the external host`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 320, height: 800 });
      await page.goto(`/${locale}/games/${game.id}/`);

      const launch = page.locator(".detail-actions a.button.primary");
      await expect(launch).toHaveAttribute("href", game.url);
      await expect(launch).toHaveAttribute("target", "_blank");
      await expect(launch).toHaveAttribute("rel", "noopener noreferrer");
      if (game.privacyNote?.[locale] && game.privacyUrl) {
        const privacyNote = page.locator(".external-privacy-note");
        await expect(privacyNote).toBeVisible();
        await expect(privacyNote).toContainText(game.privacyNote[locale]);
        const privacyLink = privacyNote.getByRole("link");
        await expect(privacyLink).toHaveAttribute("href", game.privacyUrl);
        await expect(privacyLink).toHaveAccessibleName(
          locale === "ko"
            ? `${game.title[locale].title} 개인정보 처리방침 읽기`
            : `Read privacy policy for ${game.title[locale].title}`,
        );
        expect(
          await page.evaluate(() => {
            const disclosure = document.querySelector(".external-privacy-note");
            const launch = document.querySelector(
              ".detail-actions a.button.primary",
            );
            return Boolean(
              disclosure &&
              launch &&
              disclosure.compareDocumentPosition(launch) &
                Node.DOCUMENT_POSITION_FOLLOWING,
            );
          }),
        ).toBe(true);
        for (const [width, height] of [
          [320, 800],
          [390, 844],
          [834, 1194],
          [1194, 834],
        ] as const) {
          await page.setViewportSize({ width, height });
          expect(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= window.innerWidth,
            ),
          ).toBe(true);
        }
      }
      await expect(
        page.locator(".external-host-note:not(.external-privacy-note)"),
      ).toBeVisible();
      if (game.licenseDescription?.[locale])
        await expect(page.locator(".prose")).toContainText(
          game.licenseDescription[locale],
        );
      if (game.id === "friday-night-funkin")
        await expect(
          page.getByRole("link", { name: game.licenseUrlLabel?.[locale] }),
        ).toHaveAttribute("href", game.licenseUrl!);
      await expect(page.locator(".prose")).toContainText(
        locale === "ko" ? "검증하지 않았습니다" : "has not verified",
      );
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        "content",
        /\.png$/,
      );
      await expect(
        page.locator(`.detail-actions a[href="/${locale}/play/${game.id}/"]`),
      ).toHaveCount(0);
    });
  }
}

for (const locale of ["en", "ko"]) {
  test(`${locale}: external game details fit phone and iPad viewports`, async ({
    page,
  }) => {
    const viewports: [number, number][] = [
      [320, 800],
      [390, 844],
      [834, 1194],
      [1194, 834],
    ];
    for (const [width, height] of viewports) {
      await page.setViewportSize({ width, height });
      await page.goto(`/${locale}/games/yourcraft/`);
      await expect(
        page.locator(".detail-actions a.button.primary"),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    }
  });
}
