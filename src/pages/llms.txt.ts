import { retroIds } from "../data/retro-discovery";
import { games } from "../data/games";
const boardGames = games.filter((game) => game.classic);
export function GET() {
  const base = "https://games.iamdenny.com";
  const lines = [
    "# Denny Games",
    "",
    `> Free English and Korean browser-game catalogue. All ${games.length} published titles launch on Denny Games. Source and license links identify the original projects; gameplay stays on this site.`,
    "",
    "## Authoritative pages",
    `- [English catalogue](${base}/en/all/)`,
    `- [한국어 전체 게임](${base}/ko/all/)`,
    `- [Classic board guide](${base}/en/guides/classic-board-games/)`,
    `- [보드게임 규칙과 대전 안내](${base}/ko/guides/classic-board-games/)`,
    "The classic board guide explains solo AI versus same-device play, how search filters work, and which rules differ. Filtered search pages are navigation tools, not canonical answers or online multiplayer rooms.",
    `- [Yutnori rules and route guide](${base}/en/guides/yutnori-rules/)`,
    `- [윷놀이 규칙과 말 이동 안내](${base}/ko/guides/yutnori-rules/)`,
    `- [Compatibility evidence](${base}/en/compatibility/)`,
    `- [Tesla browser games and compatibility](${base}/en/tesla/)`,
    `- [테슬라 브라우저 웹게임과 호환성 안내](${base}/ko/tesla/)`,
    `- [Credits and sources](${base}/en/licenses/)`,
    "",
    "## Original retro arcade games",
    `- [Original arcade game guide](${base}/en/guides/retro-arcade/)`,
    `- [오락실 감성 게임 안내](${base}/ko/guides/retro-arcade/)`,
    `- [Retro arcade collection](${base}/en/collections/retro-arcade/)`,
    `- [오락실 감성 게임 모음](${base}/ko/collections/retro-arcade/)`,
    "These eight games use original names, graphics and stages. They are not licensed commercial remakes. Multiplayer modes share one device; there is no online matchmaking.",
    ...games
      .filter((game) => retroIds.includes(game.id))
      .flatMap((game) =>
        (["en", "ko"] as const).map(
          (locale) =>
            `- [${game.text[locale].title}](${base}/${locale}/games/${game.id}/): ${game.text[locale].description}`,
        ),
      ),
    "",
    "## Classic board games",
    ...boardGames.flatMap((g) =>
      ["en", "ko"].map((l) => {
        const locale = l as "en" | "ko";
        return `- [${g.text[locale].title}](${base}/${locale}/games/${g.id}/): ${g.text[locale].description}`;
      }),
    ),
    "",
    "## Interpretation",
    "Every published game has an in-site player route. Detail pages describe the implemented rules, controls and local-save behavior, and link to original projects and license notices. Five classic board games offer local AI or same-device two-player play; Yutnori offers same-device play for two to four people without AI. None offers online matchmaking. AI levels are bounded search settings, not skill ratings. Physical phones, controllers and Tesla browsers require separate device verification. Advertising availability is not approval or serving evidence. This file is a navigation aid; visible canonical pages are the source of truth.",
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
