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
    en: "Build civilizations and plan transport networks in classic browser strategy games. Freeciv offers turn-based city building, while OpenTTD lets you grow a transport company; each opens on an independent host with its own save and service rules.",
    ko: "고전 브라우저 전략 게임에서 문명을 세우고 교통망을 계획하세요. Freeciv에서는 턴제로 도시를 키우고 OpenTTD에서는 운송 회사를 확장합니다. 각 게임은 저장과 서비스 규칙이 별도인 외부 호스트에서 열립니다.",
  },
  roguelike: {
    en: "Explore classic turn-based dungeons in NetHack, Umoria, Larn, Angband and Dungeon Crawl: Stone Soup. Each game has its own commands, browser build, account or save behavior; read its detail page before starting a run.",
    ko: "NetHack · Umoria · Larn · Angband · Dungeon Crawl: Stone Soup의 고전 턴제 던전을 탐험하세요. 게임마다 명령 · 브라우저 빌드 · 계정 · 저장 방식이 다르므로 모험을 시작하기 전에 상세 안내를 확인하세요.",
  },
  simulation: {
    en: "Experiment with falling sand, heat, water and living materials in two open-source browser sandboxes. The Powder Toy and Sandspiel open on their own hosts; each page explains its controls and sharing boundaries.",
    ko: "모래·열·물·생명 재료가 반응하는 오픈소스 브라우저 샌드박스 두 종을 살펴보세요. The Powder Toy와 Sandspiel은 각자의 호스트에서 열리며 조작법과 공유 범위를 상세 페이지에서 안내합니다.",
  },
};
