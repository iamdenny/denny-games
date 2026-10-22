import type { Game } from "./games";
const shared = {
  category: "puzzle",
  controlStyle: "pointer",
  duration: "2–8",
  version: 1,
  stages: 24,
  inputs: ["touch", "mouse", "keyboard", "gamepad"],
  license: "MIT",
  author: "Denny Games",
  source: "https://github.com/iamdenny/denny-games/tree/main/src/games/logic",
  added: "2026-10-22",
  playModes: ["single-player"],
} as const;
const controls = {
  en: [
    "Touch or mouse: tap a cell. Undo reverses the last move without refunding the move count.",
    "Keyboard: arrows select a cell; Enter or Space plays it. Use Tab to reach Undo and player controls.",
    "Standard gamepad: D-pad selects and the primary button plays. Physical devices have not been tested.",
  ],
  ko: [
    "터치·마우스: 칸을 누르세요. 되돌리기로 직전 수를 취소할 수 있지만 수 횟수는 줄어들지 않아요.",
    "키보드: 방향키로 칸 선택, Enter·Space로 실행합니다. Tab으로 되돌리기와 플레이어 버튼으로 이동하세요.",
    "표준 게임패드: 방향패드로 선택하고 기본 버튼으로 실행합니다. 실제 기기 검증은 아직입니다.",
  ],
};
export const logicGames: Game[] = [
  {
    ...shared,
    inputs: [...shared.inputs],
    playModes: [...shared.playModes],
    id: "lantern-grid",
    color: "gold",
    tags: ["logic", "lights out", "불 끄기", "논리", "고전 퍼즐"],
    artwork: "/art/lantern-grid.svg",
    screenshot: "/art/screenshots/lantern-grid.png",
    text: {
      en: {
        title: "Lantern Grid",
        subtitle: "One touch. Five ripples of light.",
        description:
          "Switch off a glowing grid in this original take on the classic cross-toggle puzzle. Explore 24 solvable stages from 3×3 to 5×5, undo freely and return to your saved board without a timer.",
        rules: [
          "Tap a lantern to flip it and its up, down, left and right neighbours. Diagonals do not change.",
          "Switch every light off to finish. The star and dot distinguish lit and dark cells without relying only on colour.",
          "All 24 stages are generated from a solved board. Undo is available, but moves still count toward your score. There is no countdown.",
        ],
        controls: controls.en,
        tips: [
          "Tapping the same cell twice cancels its effect.",
          "A corner changes only three lights. Start by watching how the edges behave.",
          "There is no penalty for taking your time. Use Undo to compare two ideas.",
        ],
      },
      ko: {
        title: "랜턴 그리드",
        subtitle: "한 번의 터치로 퍼지는 다섯 갈래 빛.",
        description:
          "나와 상하좌우의 불빛을 뒤집어 모두 끄는 고전 규칙을 새롭게 구현했어요. 3×3부터 5×5까지 풀 수 있는 24개 스테이지, 되돌리기와 이어하기를 시간제한 없이 즐기세요.",
        rules: [
          "랜턴을 누르면 그 칸과 상하좌우 이웃의 불빛이 뒤집혀요. 대각선은 바뀌지 않아요.",
          "모든 불빛을 끄면 성공이에요. 켜진 칸은 별, 꺼진 칸은 점으로 표시해 색 없이도 구분할 수 있어요.",
          "완성 보드에서 만든 24개 스테이지에는 해답이 있어요. 되돌리기를 써도 움직인 횟수는 점수에 반영돼요. 시간제한은 없어요.",
        ],
        controls: controls.ko,
        tips: [
          "같은 칸을 두 번 누르면 원래대로 돌아와요.",
          "모서리는 세 칸만 바뀌어요. 가장자리의 변화를 먼저 살펴보세요.",
          "급하게 누르지 않아도 괜찮아요. 되돌리기로 두 가지 생각을 비교해 보세요.",
        ],
      },
    },
  },
  {
    ...shared,
    inputs: [...shared.inputs],
    playModes: [...shared.playModes],
    id: "number-trail",
    color: "mint",
    tags: ["sliding puzzle", "15 puzzle", "숫자 퍼즐", "슬라이딩", "logic"],
    artwork: "/art/number-trail.svg",
    screenshot: "/art/screenshots/number-trail.png",
    text: {
      en: {
        title: "Number Trail",
        subtitle: "Make space. Find your next move.",
        description:
          "Slide numbered tiles into order across 24 solvable stages. Start on a compact 3×3 board, move up to 4×4, and use the highlighted neighbours of the empty space to plan a calm route home.",
        rules: [
          "Tap a numbered tile directly beside the empty space to slide it. Diagonal tiles cannot move.",
          "Arrange numbers left to right, top to bottom, leaving the empty space in the bottom-right corner.",
          "Stages 1–12 use 3×3 boards and stages 13–24 use 4×4. Every shuffle uses legal moves from the goal; shuffle length is not a claim of minimum solution length.",
        ],
        controls: controls.en,
        tips: [
          "Build the first row before arranging the next.",
          "Keep space to circulate tiles around a small loop.",
          "The green tiles can move now. Undo helps recover from an accidental tap.",
        ],
      },
      ko: {
        title: "넘버 트레일",
        subtitle: "빈칸을 만들고, 다음 한 수를 찾으세요.",
        description:
          "숫자 타일을 순서대로 밀어 맞추는 24개 스테이지에 도전하세요. 작은 3×3 판에서 시작해 4×4 판으로 확장돼요. 빈칸 옆의 초록색 타일을 움직이고, 되돌리기와 이어하기로 차분하게 풀어보세요.",
        rules: [
          "빈칸과 상하좌우로 맞닿은 숫자를 누르면 빈칸으로 이동해요. 대각선은 움직일 수 없어요.",
          "왼쪽 위부터 오른쪽으로 숫자를 순서대로 정렬하고 오른쪽 아래를 빈칸으로 남기세요.",
          "1~12단계는 3×3, 13~24단계는 4×4예요. 정답에서 가능한 이동만으로 섞어 모든 판을 풀 수 있어요. 섞은 횟수가 최소 정답 수를 뜻하지는 않아요.",
        ],
        controls: controls.ko,
        tips: [
          "첫 번째 줄부터 완성하고 다음 줄로 넘어가 보세요.",
          "작은 원을 그리듯 타일을 돌릴 공간을 남겨두세요.",
          "지금 움직일 수 있는 타일은 초록색이에요. 잘못 눌렀다면 되돌려보세요.",
        ],
      },
    },
  },
];
