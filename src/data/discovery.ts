import type { Category } from "./games";
import type { Locale } from "../lib/types";

// Editorial category descriptions must describe the actual catalogue.
export const categoryCopy: Record<Category, Record<Locale, string>> = {
  puzzle: {
    en: "Free browser puzzles with circuits, numbers, matching and mazes. Read each game's rules and controls before playing without an account or installation.",
    ko: "회로 연결, 숫자 계산, 짝 맞추기와 미로를 즐기는 무료 퍼즐 웹게임입니다. 게임별 규칙과 조작법을 확인하고 가입·설치 없이 시작하세요.",
  },
  arcade: {
    en: "Short browser arcade games about balance, timing, collecting and avoiding obstacles. Pick a game, learn its controls and try to beat your local best.",
    ko: "균형 잡기, 타이밍, 수집과 장애물 피하기를 즐기는 짧은 아케이드 웹게임입니다. 조작법을 확인하고 이 브라우저에 저장되는 최고 기록에 도전하세요.",
  },
  action: {
    en: "Free action mini-games with jumping, climbing, swinging and survival. Each detail page explains the game's own movement and action controls.",
    ko: "점프, 오르기, 매달리기와 생존을 즐기는 무료 액션 미니게임입니다. 게임마다 다른 이동·행동 조작법을 상세 페이지에서 확인하세요.",
  },
  shooting: {
    en: "Browser shooting mini-games with beams, projectiles, aiming and reflection. Learn each game's firing controls and pause whenever you need a break.",
    ko: "빔, 발사체, 조준과 반사를 활용하는 브라우저 슈팅 미니게임입니다. 게임별 발사 조작을 익히고 쉬고 싶을 때 일시정지하세요.",
  },
  racing: {
    en: "Steering and movement mini-games including parking, lane changes and slalom. This collection includes direction-control challenges as well as driving games.",
    ko: "주차, 차선 변경과 슬라럼 등 방향·움직임을 다루는 미니게임입니다. 자동차 운전뿐 아니라 방향 조작에 도전하는 게임도 포함합니다.",
  },
  sports: {
    en: "Golf, ball and juggling mini-games you can play in a browser. Check the rules for each game: scoring and controls differ between titles.",
    ko: "브라우저에서 즐기는 골프, 공과 저글링 미니게임입니다. 작품마다 점수 규칙과 조작법이 다르므로 게임 소개를 먼저 확인하세요.",
  },
};
