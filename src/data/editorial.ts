import type { Locale } from "../lib/types";

// Editorial judgement from screen/rule review, not measured popularity.
export const editorPicks = [
  {
    id: "orbit-break",
    reason: {
      en: "Read the rebound, clear twelve colourful brick layouts and keep the rally alive.",
      ko: "반사각을 읽고 알록달록한 벽돌 12개 배치를 깨며 랠리를 이어가요.",
    },
  },
  {
    id: "circuit-loop",
    reason: {
      en: "Rotate the loose tiles into a complete circuit across thirty calm boards.",
      ko: "흩어진 타일을 돌려 30개 보드에서 회로를 완성하는 차분한 퍼즐.",
    },
  },
  {
    id: "bounce-back",
    reason: {
      en: "Throw a returning boomerang, dodge roomfuls of enemies and collect upgrades.",
      ko: "되돌아오는 부메랑을 던지고 적을 피하며 강화 아이템을 모아요.",
    },
  },
  {
    id: "underrun",
    reason: {
      en: "Explore a pixel-lit 3D facility, restore systems and dodge incoming fire.",
      ko: "픽셀 조명 3D 시설을 탐색하고 설비를 복구하며 적의 공격을 피하세요.",
    },
  },
  {
    id: "crisp-skygolf",
    reason: {
      en: "Pick a three, six or nine-hole course and set each shot's power.",
      ko: "3·6·9홀 코스를 고르고 샷의 세기를 조절해 코스를 돌아요.",
    },
  },
  {
    id: "gomoku",
    reason: {
      en: "Read a clear 15×15 board, preview a move and line up five stones.",
      ko: "15×15 판에서 수를 미리 보고 돌 다섯 개를 한 줄로 이어요.",
    },
  },
  {
    id: "lantern-grid",
    reason: {
      en: "Switch off a glowing board across 24 solvable stages with undo and saved progress.",
      ko: "불빛을 뒤집어 모두 끄는 24개 스테이지. 되돌리기와 이어하기로 차분하게 풀어요.",
    },
  },
  {
    id: "number-trail",
    reason: {
      en: "Slide numbers into order on 24 boards, growing from 3×3 to 4×4.",
      ko: "3×3부터 4×4까지, 숫자를 밀어 맞추는 24개 보드에 도전하세요.",
    },
  },
  {
    id: "hextris",
    reason: {
      en: "Match blocks on a six-sided board and rotate the whole playfield.",
      ko: "육각형 판에서 블록을 맞추고 게임판 전체를 돌려요.",
    },
  },
  {
    id: "reversi",
    reason: {
      en: "Use legal-move hints and turn a small advantage into a sweeping reversal.",
      ko: "가능한 수를 살피고 작은 우세를 판 전체의 역전으로 바꿔요.",
    },
  },
  {
    id: "four-in-a-row",
    reason: {
      en: "Drop a disc into one of seven columns and connect four before your rival.",
      ko: "일곱 열 중 하나에 돌을 떨어뜨려 상대보다 먼저 넷을 이어요.",
    },
  },
  {
    id: "checkers",
    reason: {
      en: "Plan capture chains, watch the highlighted destinations and crown a king.",
      ko: "표시된 목적지를 따라 연속으로 잡고 킹 승급을 노려요.",
    },
  },
  {
    id: "dots-and-boxes",
    reason: {
      en: "Claim a square, set a trap and turn one line into a chain of boxes.",
      ko: "선을 그어 칸을 차지하고 한 번의 연결로 사각형을 이어가요.",
    },
  },
  {
    id: "2048",
    reason: {
      en: "Slide matching number tiles together and plan the next move on a 4×4 board.",
      ko: "4×4 판에서 같은 숫자 타일을 밀어 합치고 다음 수를 계획해요.",
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
