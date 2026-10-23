import type { Game } from "./games";
export const sixPuzzleGames: Game[] = [
  {
    id: "minefield-watch",
    category: "puzzle",
    controlStyle: "directional",
    duration: "3–10",
    color: "mint",
    tags: ["logic", "puzzle", "지뢰찾기", "minesweeper"],
    artworkAlt: {
      en: "Minefield Watch original illustrated puzzle board",
      ko: "지뢰 감시대 자체 제작 퍼즐판 일러스트",
    },
    text: {
      en: {
        title: "Minefield Watch",
        searchTitle: "Minefield Watch — Free Browser Logic Puzzle",
        subtitle: "Read the numbers. Mark the danger.",
        description:
          "Explore three compact minefields with a safe first reveal and its surrounding cells. Read adjacent-mine numbers, flag suspected hazards and uncover every safe square. Choose 6×6, 7×7 or 8×8 boards through the stage selector. No timer rushes your decisions; the current field stays in this browser for later.",
        rules: [
          "Choose one of three stages: 6×6 with 6 mines, 7×7 with 9 mines, or 8×8 with 12 mines.",
          "The first revealed cell and all its neighbors are safe. A number counts mines in the eight surrounding cells. Empty regions open automatically.",
          "Reveal all safe cells to win. Opening a mine ends the round. Flags are reminders and prevent opening a marked cell; their positions alone do not win.",
        ],
        controls: [
          "Select a cell with touch, mouse or arrow keys, then tap the same cell again or press Confirm, Enter or Space.",
          "Switch between Reveal and Flag with the mode button. Pause stops input; Restart resets this minefield.",
        ],
        tips: [
          "Use a completed number to rule out neighboring cells.",
          "Count flagged neighbors before deciding whether another covered cell is safe.",
          "Some fields may require a guess; first-click safety is not a guarantee of a logic-only solution.",
        ],
      },
      ko: {
        title: "지뢰 감시대",
        searchTitle: "지뢰 감시대 — 무료 웹 퍼즐 게임",
        subtitle: "숫자를 읽고 위험을 표시하세요.",
        description:
          "첫 칸과 그 주변이 안전한 세 가지 지뢰밭을 탐색하세요. 주변 지뢰 수를 읽고 위험한 곳에 깃발을 꽂아 안전한 칸을 모두 찾아내는 무료 지뢰찾기 게임입니다. 단계 선택에서 6×6, 7×7, 8×8 판을 고를 수 있으며 시간 제한 없이 생각하고 이 브라우저에 저장된 판을 이어갈 수 있어요.",
        rules: [
          "세 단계는 6×6 지뢰 6개, 7×7 지뢰 9개, 8×8 지뢰 12개입니다.",
          "처음 연 칸과 인접 칸은 안전합니다. 숫자는 주변 최대 여덟 칸의 지뢰 수이며 빈 영역은 자동으로 열립니다.",
          "안전한 칸을 모두 열면 승리합니다. 지뢰를 열면 실패하며 깃발은 실수로 여는 것을 막는 메모입니다. 깃발만 맞혀서는 승리하지 않습니다.",
        ],
        controls: [
          "터치·마우스·방향키로 칸을 고른 뒤 같은 칸을 다시 누르거나 확인·Enter·Space를 누르세요.",
          "모드 버튼으로 열기와 깃발을 바꾸세요. 일시정지하면 입력이 멈추고 다시 시작하면 지뢰밭을 초기화합니다.",
        ],
        tips: [
          "주변 지뢰 수가 확정된 숫자부터 인접 칸을 판단하세요.",
          "깃발 수와 숫자를 비교한 뒤 다른 닫힌 칸이 안전한지 살펴보세요.",
          "일부 판에서는 추측이 필요할 수 있습니다. 첫 클릭 안전은 추측 없는 해법을 보장하지 않습니다.",
        ],
      },
    },
    version: 1,
    stages: 3,
    added: "2026-10-23",
    author: "Denny Games",
    license: "MIT",
    licenseAppliesToGame: true,
    licenseUrl: "https://github.com/iamdenny/denny-games/blob/main/LICENSE",
    licenseDescription: {
      en: "Original code and artwork by Denny Games.",
      ko: "데니 게임즈가 직접 만든 코드와 그림입니다.",
    },
    playModes: ["single-player"],
    inputs: ["touch", "mouse", "keyboard"],
    internalScore: true,
    source:
      "https://github.com/iamdenny/denny-games/tree/main/src/games/minefield-watch",
    artwork: "/art/minefield-watch.svg",
    screenshot: "/art/screenshots/minefield-watch.png",
    guide: {
      path: "guides/minefield-watch",
      label: {
        en: "Rules and strategy guide",
        ko: "규칙·공략 안내",
      },
    },
  },
  {
    id: "mosaic-mystery",
    category: "puzzle",
    controlStyle: "directional",
    duration: "3–10",
    color: "rust",
    tags: ["logic", "puzzle", "네모로직", "nonogram"],
    artworkAlt: {
      en: "Mosaic Mystery original illustrated puzzle board",
      ko: "모자이크 미스터리 자체 제작 퍼즐판 일러스트",
    },
    text: {
      en: {
        title: "Mosaic Mystery",
        searchTitle: "Mosaic Mystery — Free Browser Logic Puzzle",
        subtitle: "Small clues. A hidden picture.",
        description:
          "Uncover twelve original pixel pictures in a compact nonogram collection. Row and column clues describe consecutive filled runs, with empty gaps between them. Paint squares, cross out known empty cells and correct marks freely without a timer or life limit. Every 5×5 or 6×6 puzzle has exactly one clue solution.",
        rules: [
          "Each row and column clue lists the lengths of consecutive filled groups in order. Leave at least one empty cell between groups.",
          "Paint the picture and optionally mark empty cells with crosses. Tapping an already identical mark removes it. A zero clue means every cell in that line is empty.",
          "Match every filled cell to complete a picture. Crosses are optional. The stage selector offers twelve original 5×5 and 6×6 puzzles.",
        ],
        controls: [
          "Select a cell with touch, mouse or arrow keys, then tap the same cell again or press Confirm, Enter or Space.",
          "Switch between Paint and Cross with the mode button. Pause stops input; Restart clears marks on this picture.",
        ],
        tips: [
          "Start with a clue that fills an entire line.",
          "Compare crossing row and column clues to find guaranteed overlap.",
          "Cross marks are notes, not an error check. Revisit conflicting assumptions; the game does not reveal correctness until the picture is complete.",
        ],
      },
      ko: {
        title: "모자이크 미스터리",
        searchTitle: "모자이크 미스터리 — 무료 웹 퍼즐 게임",
        subtitle: "작은 숫자 속에 숨은 그림.",
        description:
          "행과 열의 숫자로 숨은 픽셀 그림을 찾는 열두 개의 자체 제작 네모로직 퍼즐입니다. 숫자는 연속 칠한 칸의 길이를 뜻하고 덩어리 사이에는 빈칸이 필요합니다. 칠하기와 빈칸 표시를 바꾸며 시간 제한이나 목숨 제한 없이 수정하세요. 5×5·6×6 퍼즐은 각각 단 하나의 정답을 갖습니다.",
        rules: [
          "행과 열의 숫자는 순서대로 연속 칠한 덩어리의 길이입니다. 덩어리 사이에는 적어도 한 칸을 비우세요.",
          "그림을 칠하고 확실한 빈칸은 ×로 표시할 수 있습니다. 같은 표시를 다시 적용하면 지워집니다. 숫자 0은 해당 줄이 모두 빈칸이라는 뜻입니다.",
          "칠한 칸이 정답과 모두 같아지면 완성됩니다. 빈칸의 × 표시는 선택 사항입니다. 단계 선택에서 자체 제작한 5×5·6×6 퍼즐 열두 개를 고를 수 있습니다.",
        ],
        controls: [
          "터치·마우스·방향키로 칸을 고른 뒤 같은 칸을 다시 누르거나 확인·Enter·Space를 누르세요.",
          "모드 버튼으로 칠하기와 빈칸 표시를 바꾸세요. 일시정지하면 입력이 멈추고 다시 시작하면 이 그림의 표시를 지웁니다.",
        ],
        tips: [
          "줄 전체를 채우는 숫자부터 시작하세요.",
          "가로와 세로의 숫자를 함께 비교해 반드시 겹치는 칸을 찾으세요.",
          "×는 메모이며 오답 검사 기능이 아닙니다. 충돌하는 가정을 다시 살펴보세요. 완성 전에는 정답 여부를 알려주지 않습니다.",
        ],
      },
    },
    version: 1,
    stages: 12,
    added: "2026-10-23",
    author: "Denny Games",
    license: "MIT",
    licenseAppliesToGame: true,
    licenseUrl: "https://github.com/iamdenny/denny-games/blob/main/LICENSE",
    licenseDescription: {
      en: "Original code and artwork by Denny Games.",
      ko: "데니 게임즈가 직접 만든 코드와 그림입니다.",
    },
    playModes: ["single-player"],
    inputs: ["touch", "mouse", "keyboard"],
    internalScore: true,
    source:
      "https://github.com/iamdenny/denny-games/tree/main/src/games/mosaic-mystery",
    artwork: "/art/mosaic-mystery.svg",
    screenshot: "/art/screenshots/mosaic-mystery.png",
    guide: {
      path: "guides/mosaic-mystery",
      label: {
        en: "Rules and strategy guide",
        ko: "규칙·공략 안내",
      },
    },
  },
];
