import type { Locale } from "../lib/types";

// Editorial judgement from screen/rule review, not measured popularity.
export const editorPicks = [
  {
    id: "hextris",
    reason: {
      en: "A legible hexagonal board, quick color matches and touch rotation.",
      ko: "한눈에 보이는 육각형 판, 빠른 색 맞추기와 터치 회전",
    },
  },
  {
    id: "gomoku",
    reason: {
      en: "A clear 15×15 board, move preview and freestyle five-in-a-row.",
      ko: "15×15 선명한 판과 수 미리보기로 즐기는 자유룰 오목",
    },
  },
  {
    id: "reversi",
    reason: {
      en: "Legal-move hints, clear disc counts and sweeping reversals.",
      ko: "가능한 수와 돌 개수가 보이는 차분한 뒤집기 전략",
    },
  },
  {
    id: "four-in-a-row",
    reason: {
      en: "Seven columns, simple drops and readable connection threats.",
      ko: "7개 열에 돌을 떨어뜨리는 쉽고 선명한 연결 전략",
    },
  },
  {
    id: "checkers",
    reason: {
      en: "Highlighted destinations, capture chains and crowned kings.",
      ko: "목적지 표시와 연속 잡기, 킹 승급의 전략",
    },
  },
  {
    id: "dots-and-boxes",
    reason: {
      en: "A compact four-by-four board and satisfying box chains.",
      ko: "작은 4×4 판에서 사각형을 연달아 차지하는 재미",
    },
  },
  {
    id: "bounce-back",
    reason: {
      en: "Aim a boomerang, dodge enemies and shop between generated rooms.",
      ko: "절차 생성 방에서 부메랑 조준·회피·상점 강화를 즐기는 액션 로그라이트",
    },
  },
  {
    id: "orbit-break",
    reason: {
      en: "Readable rebounds and twelve colourful brick layouts.",
      ko: "선명한 반사각과 12가지 컬러 벽돌 배치",
    },
  },
  {
    id: "2048",
    reason: {
      en: "A familiar sliding puzzle with clear, tactile number tiles.",
      ko: "큰 숫자 타일로 즐기는 익숙한 슬라이딩 퍼즐",
    },
  },
  {
    id: "circuit-loop",
    reason: {
      en: "Thirty solvable boards, connected paths and no countdown.",
      ko: "연결이 보이는 30개 회로 보드, 시간제한 없는 퍼즐",
    },
  },
  {
    id: "crisp-flipo",
    reason: {
      en: "A bright brick field and a distinct flipping-paddle mechanic.",
      ko: "밝은 벽돌판과 패들을 뒤집는 독특한 조작",
    },
  },
  {
    id: "crisp-skygolf",
    reason: {
      en: "Aim at a visible course and follow the in-game stroke count.",
      ko: "코스를 보며 조준하고 타수를 줄이는 골프",
    },
  },
  {
    id: "crisp-snake1",
    reason: {
      en: "A recognisable snake board with a strong grid structure.",
      ko: "격자가 선명한 익숙한 스네이크 게임판",
    },
  },
  {
    id: "crisp-hexmin",
    reason: {
      en: "A compact hexagonal board with clearly separated pieces.",
      ko: "조각이 또렷한 작은 육각형 게임판",
    },
  },
  {
    id: "crisp-jugglingchain",
    reason: {
      en: "A colourful circular playfield and one-button timing.",
      ko: "컬러 원형 게임판과 한 버튼 타이밍 조작",
    },
  },
  {
    id: "crisp-thruststrafe",
    reason: {
      en: "Illustrated scenery gives this flying game a distinct setting.",
      ko: "그림 배경으로 공간감이 있는 비행 게임",
    },
  },
  {
    id: "crisp-dinos",
    reason: {
      en: "Illustrated desert scenery and a one-button action loop.",
      ko: "사막 그림 배경과 한 버튼 액션",
    },
  },
  {
    id: "crisp-parking",
    reason: {
      en: "A recognisable road layout and concise steering controls.",
      ko: "알아보기 쉬운 도로 배치와 간단한 주행 조작",
    },
  },
  {
    id: "crisp-breedc",
    reason: {
      en: "A colourful matching board with a compact set of rules.",
      ko: "컬러 블록과 짧은 규칙의 짝 맞추기 퍼즐",
    },
  },
] satisfies { id: string; reason: Record<Locale, string> }[];

export const editorialPick = (id: string) =>
  editorPicks.find((pick) => pick.id === id);
export function editorialOrder<T extends { id: string }>(
  items: readonly T[],
): T[] {
  const ranks = new Map(editorPicks.map((pick, i) => [pick.id, i]));
  return [...items].sort(
    (a, b) => (ranks.get(a.id) ?? Infinity) - (ranks.get(b.id) ?? Infinity),
  );
}
