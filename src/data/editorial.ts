import type { Locale } from "../lib/types";

// Editorial judgement from screen/rule review, not measured popularity.
export const editorPicks = [
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
