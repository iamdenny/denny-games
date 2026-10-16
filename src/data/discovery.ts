import type { Category } from "./games";
import type { Locale } from "../lib/types";

// Editorial category descriptions must describe the actual catalogue.
export const categoryCopy: Record<Category, Record<Locale, string>> = {
  board: {
    en: "Play local classics such as Gomoku, Reversi, checkers and Four in a Row, or follow links to card-table and board-game variations including Briscola, Klondike, Naval Battle and Parchis. Local multiplayer and external host rules vary by title.",
    ko: "오목·리버시·체커·사목 같은 로컬 게임과 브리스콜라·클론다이크·해전·파르치스 보드게임을 둘러보세요. 로컬 대전과 외부 호스트 방식은 게임마다 다릅니다.",
  },
  puzzle: {
    en: "Browser puzzles range from circuits, number grids and matching boards to Klondike solitaire and classic arcade variations. Read each game's rules and host details before playing.",
    ko: "회로·숫자 퍼즐·짝 맞추기부터 클론다이크와 고전 아케이드 변형까지 즐겨보세요. 게임별 규칙과 외부 호스트 안내를 확인하세요.",
  },
  arcade: {
    en: "Play quick in-site arcade challenges or follow external links to block games, pinball tables and classic arcade experiments. Controls, scores and saves depend on the title and host.",
    ko: "사이트 안의 짧은 아케이드 게임과 외부 링크의 블록 게임·핀볼·고전 아케이드 실험작을 둘러보세요. 조작·점수·저장 방식은 게임과 호스트마다 다릅니다.",
  },
  action: {
    en: "Action games include platform adventures, maze duels, arena combat and longer host-based campaigns. Each detail page explains its controls, license and external-host conditions.",
    ko: "플랫폼 모험·미로 대전·아레나 전투·외부 호스트 캠페인 등 액션 게임을 살펴보세요. 상세 페이지에서 조작법·라이선스·호스트 조건을 확인할 수 있습니다.",
  },
  shooting: {
    en: "Aim, dodge and survive in locally hosted shooters or try external space-combat, artillery and top-down battle royale games such as Suroi. Check each title's controls and host requirements before playing.",
    ko: "사이트 안의 조준 도전과 외부 호스트의 우주 전투·포격·탑다운 배틀로얄 게임 Suroi를 즐겨보세요. 시작하기 전에 게임별 조작과 호스트 요구사항을 확인하세요.",
  },
  racing: {
    en: "Race 3D tracks, dodge traffic, and try browser time trials or track editing. The collection also includes short parking and steering games.",
    ko: "주차·차선 변경 미니게임부터 3D 레이싱 트랙 편집, 타임 트라이얼과 교통 피하기까지 즐겨보세요. 외부 게임은 각 호스트에서 열립니다.",
  },
  sports: {
    en: "Try browser sports and table games, from golf and ball challenges to 3D pong. Scoring and controls differ between titles; external games open on their own host.",
    ko: "골프·공·저글링부터 3D 탁구까지 브라우저 스포츠 게임을 해보세요. 점수 규칙과 조작법은 다르며 외부 게임은 해당 호스트에서 열립니다.",
  },
  strategy: {
    en: "Plan, build and outthink rivals in turn-based, tile-based and real-time strategy games. Freeciv, OpenTTD and tactical match-3 titles link to independent hosts with different save and service rules.",
    ko: "턴제·타일 기반 전략 게임에서 문명을 세우고 교통망을 만들며 전술 대전을 즐겨보세요. Freeciv·OpenTTD 등은 저장과 서비스 규칙이 서로 다른 외부 호스트에서 열립니다.",
  },
  roguelike: {
    en: "Explore classic turn-based dungeons in NetHack, Umoria, Larn, Angband and Dungeon Crawl: Stone Soup. Each game has its own commands, browser build, account or save behavior; read its detail page before starting a run.",
    ko: "NetHack · Umoria · Larn · Angband · Dungeon Crawl: Stone Soup의 고전 턴제 던전을 탐험하세요. 게임마다 명령 · 브라우저 빌드 · 계정 · 저장 방식이 다르므로 모험을 시작하기 전에 상세 안내를 확인하세요.",
  },
  simulation: {
    en: "Explore creative browser sandboxes and simulations, from 3D city building and procedural voxel survival to shared social rooms, cafes, pet care and horse riding. Open-source status and host rules vary by title.",
    ko: "3D 도시 건설과 절차 생성 복셀 생존부터 공유 소셜 룸·카페·반려동물 돌봄·승마까지 웹 시뮬레이션을 둘러보세요. 오픈소스 여부와 호스트 조건은 게임마다 다릅니다.",
  },
};
