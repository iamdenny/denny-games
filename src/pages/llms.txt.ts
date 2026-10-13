import { games } from "../data/games";
const boardGames = games.filter((game) => game.classic);
export function GET() {
  const base = "https://games.iamdenny.com";
  const lines = [
    "# Denny Games",
    "",
    `> Free English and Korean browser games. ${games.length} published titles. No account or installation required.`,
    "",
    "## Authoritative pages",
    `- [English catalogue](${base}/en/all/)`,
    `- [한국어 전체 게임](${base}/ko/all/)`,
    `- [Classic board guide](${base}/en/guides/classic-board-games/)`,
    `- [보드게임 규칙과 대전 안내](${base}/ko/guides/classic-board-games/)`,
    `- [Compatibility evidence](${base}/en/compatibility/)`,
    `- [Tesla browser games and compatibility](${base}/en/tesla/)`,
    `- [테슬라 브라우저 웹게임과 호환성 안내](${base}/ko/tesla/)`,
    `- [Credits and sources](${base}/en/licenses/)`,
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
    "Game detail pages contain the implemented rule variant, controls and local-save behavior. Board games support local AI and same-device two-player play, not online matchmaking. AI levels are bounded search settings, not skill ratings. Physical phones, controllers and Tesla browsers require separate device verification. Advertising availability is not approval or serving evidence. This file is a navigation aid; visible canonical pages are the source of truth.",
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
