import type { Category } from "./games";
import type { Locale } from "../lib/types";

// Editorial category descriptions must describe the actual catalogue.
export const categoryCopy: Record<Category, Record<Locale, string>> = {
  board: {
    en: "Free classic board games: Gomoku, Reversi, Four in a Row, English checkers and Dots and Boxes. Play local AI or two players on the same device; rules and progress stay accessible without an account.",
    ko: "무료 오목·리버시·사목·영국식 체커·점 잇기 보드게임입니다. 가입 없이 로컬 AI 또는 같은 기기 2인으로 대전하고, 규칙을 확인하며 저장한 대국을 이어가세요.",
  },
  puzzle: {
    en: "Free browser puzzles with circuits, numbers, matching and mazes. Read each game's rules and controls before playing without an account or installation.",
    ko: "회로 연결, 숫자 계산, 짝 맞추기와 미로를 즐기는 무료 퍼즐 웹게임입니다. 게임별 규칙과 조작법을 확인하고 가입·설치 없이 시작하세요.",
  },
  arcade: {
    en: "Short browser arcade games about balance, timing, collecting and avoiding obstacles. Pick a game, learn its controls and try to beat your local best.",
    ko: "균형 잡기, 타이밍, 수집과 장애물 피하기를 즐기는 짧은 아케이드 웹게임입니다. 조작법을 확인하고 이 브라우저에 저장되는 최고 기록에 도전하세요.",
  },
  action: {
    en: "Free action games range from quick jumping, climbing and survival challenges to SuperTux's longer platform adventure on an external host. Each detail page explains the controls and play conditions.",
    ko: "점프·오르기·생존 미니게임부터 외부 호스트에서 즐기는 SuperTux의 긴 플랫폼 모험까지 살펴보세요. 상세 페이지에서 조작법과 플레이 조건을 확인할 수 있습니다.",
  },
  shooting: {
    en: "Browser shooters range from quick beam and aiming challenges to Freedoom's external first-person campaign. Check each game's controls and host requirements before playing.",
    ko: "짧은 빔·조준 도전부터 외부 호스트의 Freedoom 1인칭 캠페인까지 브라우저 슈팅 게임을 둘러보세요. 시작하기 전에 조작법과 호스트 요구사항을 확인하세요.",
  },
  racing: {
    en: "Steering and movement mini-games including parking, lane changes and slalom. This collection includes direction-control challenges as well as driving games.",
    ko: "주차, 차선 변경과 슬라럼 등 방향·움직임을 다루는 미니게임입니다. 자동차 운전뿐 아니라 방향 조작에 도전하는 게임도 포함합니다.",
  },
  sports: {
    en: "Golf, ball and juggling mini-games you can play in a browser. Check the rules for each game: scoring and controls differ between titles.",
    ko: "브라우저에서 즐기는 골프, 공과 저글링 미니게임입니다. 작품마다 점수 규칙과 조작법이 다르므로 게임 소개를 먼저 확인하세요.",
  },
  strategy: {
    en: "Plan routes, connect towns and manage transport networks in strategy and simulation games. OpenTTD is available through an independent browser host; its saves and online content follow that host's rules.",
    ko: "노선을 계획하고 도시를 연결하며 교통망을 운영하는 전략·경영 게임입니다. OpenTTD는 독립 브라우저 호스트에서 실행되며 저장과 온라인 콘텐츠는 해당 호스트가 관리합니다.",
  },
  roguelike: {
    en: "Explore turn-based dungeons, manage supplies and learn classic roguelike rules. NetHack opens on a community server with its own account and save policies.",
    ko: "턴제 던전을 탐험하고 자원을 관리하며 고전 로그라이크 규칙을 익혀보세요. NetHack은 계정과 저장 정책이 별도인 커뮤니티 서버에서 열립니다.",
  },
};
