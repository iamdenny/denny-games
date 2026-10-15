import { test, expect } from "@playwright/test";

const externalGames = [
  { id: "freedoom", url: "https://danborden1.github.io/doom-web/" },
  { id: "openttd", url: "https://openttdonline.com/play/" },
  { id: "supertux", url: "https://play.supertux.org/play/" },
  { id: "nethack", url: "https://www.alt.org/nethack/hterm/" },
  {
    id: "freeciv",
    url: "https://freecivweb.com/webclient/?action=new&type=singleplayer",
  },
  { id: "umoria", url: "https://umoria.org/play/" },
  { id: "larn", url: "https://larn.org/" },
  { id: "neo-angband", url: "https://angband.rpgm.world/" },
  { id: "dcss", url: "https://crawl.nemelex.cards/" },
  {
    id: "simon-tatham-puzzles",
    url: "https://www.chiark.greenend.org.uk/~sgtatham/puzzles/",
  },
  { id: "powder-toy", url: "https://powdertoy.co.uk/Wasm.html" },
  { id: "hyperrogue", url: "https://roguetemple.com/z/hyper/online.php" },
  {
    id: "tuxmath",
    url: "https://tuxmath.org/game.html?opt_lang=en&opt_osk=1",
  },
  { id: "sandspiel", url: "https://sandspiel.club/" },
  { id: "frozen-bubble", url: "https://dchau360.itch.io/frozenbubble2" },
];

for (const locale of ["en", "ko"]) {
  for (const game of externalGames) {
    test(`${locale} ${game.id}: explains and safely opens the external host`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/games/${game.id}/`);

      const launch = page.locator(".detail-actions a.button.primary");
      await expect(launch).toHaveAttribute("href", game.url);
      await expect(launch).toHaveAttribute("target", "_blank");
      await expect(launch).toHaveAttribute("rel", "noopener noreferrer");
      await expect(page.locator(".external-host-note")).toBeVisible();
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
