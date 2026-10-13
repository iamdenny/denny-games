import type { Game, GameCopy } from "./games";
export const classicIds = [
  "gomoku",
  "reversi",
  "four-in-a-row",
  "checkers",
  "dots-and-boxes",
] as const;
const controls: Record<"en" | "ko", string[]> = {
  en: [
    "Touch or mouse: select a space, column or edge to preview, then select it again to play. Confirm move also works. Checkers: select a piece, then click a marked destination to move.",
    "Keyboard: arrows move the cursor; Enter/Space previews, then confirms. The on-screen arrows in Settings provide the same selection controls.",
    "Standard gamepad: D-pad selects, primary button previews/confirms, Start pauses. Physical controllers and Tesla browsers await testing.",
  ],
  ko: [
    "터치·마우스: 칸·열·선을 눌러 미리 보고 같은 곳을 다시 누르면 둡니다. 수 두기 버튼으로도 확정할 수 있어요. 체커는 말을 고른 뒤 표시된 목적지를 누르면 이동합니다.",
    "키보드: 방향키로 커서를 이동하고 Enter/Space로 미리보기·확정합니다. 설정 안의 방향 버튼으로도 선택할 수 있어요.",
    "표준 게임패드: 방향패드 선택, 기본 버튼 미리보기·확정, Start 정지. 실제 패드·테슬라 브라우저는 검증 전입니다.",
  ],
};
const descriptions: {
  id: (typeof classicIds)[number];
  duration: string;
  color: string;
  en: Omit<GameCopy, "controls">;
  ko: Omit<GameCopy, "controls">;
}[] = [
  {
    id: "gomoku",
    duration: "5–15",
    color: "yellow",
    en: {
      title: "Gomoku",
      subtitle: "Five stones. One winning line.",
      description:
        "Play free Gomoku against a browser AI or a friend on the same device. This 15×15 freestyle five-in-a-row game allows overlines, has no forbidden moves and saves your board locally.",
      rules: [
        "Mint moves first on the 15×15 intersections. Players alternate placing one stone in an empty space.",
        "Five or more stones in a horizontal, vertical or diagonal line wins. Overlines are allowed; there are no double-three or Renju forbidden-move rules.",
        "Before you start, choose browser AI or two players taking turns on this device. Changing the mode or level starts a new game.",
      ],
      tips: [
        "Build lines with space at both ends and watch for immediate opposing fours.",
        "A move can defend and extend your own line at the same time.",
        "Preview the displayed row and column before confirming on a phone.",
      ],
    },
    ko: {
      title: "오목",
      subtitle: "다섯 돌로 만드는 한 줄의 승리.",
      description:
        "15×15 바둑판에서 즐기는 무료 오목입니다. 브라우저 AI 또는 같은 기기의 친구와 대국하세요. 장목을 허용하고 금수가 없는 자유룰이며 진행 상태는 이 브라우저에 저장됩니다.",
      rules: [
        "15×15 교차점에 민트가 먼저 둡니다. 빈칸에 돌 하나씩 번갈아 놓으세요.",
        "가로·세로·대각선으로 다섯 개 이상 연결하면 승리합니다. 장목을 허용하며 삼삼·사사 등 렌주 금수는 적용하지 않습니다.",
        "시작 전에 브라우저 AI 또는 같은 기기에서 번갈아 두는 2인 모드를 고르세요. 방식·난이도 변경은 새 대국을 시작합니다.",
      ],
      tips: [
        "양끝이 열린 줄을 만들고 상대의 네 돌 연결부터 막으세요.",
        "수비하면서 내 연결도 늘릴 수 있는 자리를 찾아보세요.",
        "휴대폰에서는 표시된 행·열을 확인한 뒤 수를 확정하세요.",
      ],
    },
  },
  {
    id: "reversi",
    duration: "5–15",
    color: "mint",
    en: {
      title: "Reversi",
      subtitle: "A small move. A sweeping reversal.",
      description:
        "Flip bracketed discs in free 8×8 Reversi. Play a local browser AI or take turns with a friend, see legal moves, automatic passes and live disc counts, and continue your saved game later.",
      rules: [
        "Mint starts. Place a disc only where it brackets an unbroken row of opposing discs with another of your discs.",
        "Every bracketed horizontal, vertical and diagonal line flips. If a player has no legal move, the turn passes automatically.",
        "When neither player can move, the side with more discs wins; equal counts draw. The board need not be full.",
      ],
      tips: [
        "Corners cannot be flipped after capture. Plan access to them.",
        "Avoid giving an opponent an easy corner by filling adjacent spaces too soon.",
        "Early disc counts can be misleading; consider the moves you leave available.",
      ],
    },
    ko: {
      title: "리버시",
      subtitle: "작은 한 수로 뒤집는 판세.",
      description:
        "8×8 보드에서 상대 돌을 둘러싸 뒤집는 무료 리버시입니다. 로컬 AI·같은 기기 2인 대전, 가능한 수 표시, 자동 패스와 돌 개수를 지원하며 저장한 대국을 이어 할 수 있습니다.",
      rules: [
        "민트가 먼저 둡니다. 내 돌과 새 돌 사이에 상대 돌이 끊김 없이 들어가는 빈칸에 놓으세요.",
        "가로·세로·대각선에서 둘러싼 모든 줄이 뒤집힙니다. 둘 곳이 없으면 자동으로 상대에게 차례가 넘어갑니다.",
        "양쪽 모두 둘 수 없으면 돌이 많은 쪽이 승리하고 같으면 무승부입니다. 판이 꽉 차지 않아도 끝날 수 있습니다.",
      ],
      tips: [
        "한번 차지한 모서리는 다시 뒤집히지 않아요.",
        "모서리 주변을 너무 일찍 채워 상대에게 모서리를 내주지 마세요.",
        "초반 돌 개수보다 다음에 둘 수 있는 자리가 중요할 수 있어요.",
      ],
    },
  },
  {
    id: "four-in-a-row",
    duration: "2–8",
    color: "rust",
    en: {
      title: "Four in a Row",
      subtitle: "Drop a disc. Spot the connection.",
      description:
        "A free seven-column, six-row four-in-a-row game with local AI and same-device two-player modes. Select a column, preview where gravity will place your disc, then confirm your move.",
      rules: [
        "Choose one of seven columns. Your disc falls to the lowest empty space in that column.",
        "Connect four discs horizontally, vertically or diagonally before your opponent. Mint moves first.",
        "Full columns cannot be used. A full board without four connected discs is a draw.",
      ],
      tips: [
        "Central columns can contribute to more connecting lines.",
        "Block an immediate three-disc threat before building a slower plan.",
        "Remember that a diagonal winning space may need supporting discs below it.",
      ],
    },
    ko: {
      title: "사목",
      subtitle: "돌을 떨어뜨려 네 개를 연결하세요.",
      description:
        "7열·6행 보드에서 즐기는 무료 사목 게임입니다. 로컬 AI 또는 같은 기기의 친구와 대전하세요. 열을 선택하면 돌이 떨어질 위치를 미리 보고 확정할 수 있습니다.",
      rules: [
        "7개 열 중 하나를 고르면 돌이 그 열의 가장 아래 빈칸으로 떨어집니다.",
        "민트가 먼저 둡니다. 상대보다 먼저 가로·세로·대각선으로 네 개를 연결하세요.",
        "가득 찬 열에는 둘 수 없습니다. 네 개 연결 없이 보드가 가득 차면 무승부입니다.",
      ],
      tips: [
        "가운데 열은 여러 방향의 연결에 활용할 수 있어요.",
        "상대의 즉시 승리 위협을 먼저 막으세요.",
        "대각선 빈칸에 두려면 그 아래 돌이 받쳐줘야 합니다.",
      ],
    },
  },
  {
    id: "checkers",
    duration: "5–20",
    color: "mint",
    en: {
      title: "Checkers",
      subtitle: "Jump, capture and crown.",
      description:
        "Play free English checkers on an 8×8 board with AI or local two-player mode. Mandatory captures, continued jumps, kings and move previews are included. Men move and capture forward only.",
      rules: [
        "Mint starts at the bottom. Men move one diagonal space forward on dark squares. Jump over an adjacent opponent into an empty space to capture.",
        "Captures are mandatory. Continue capturing with the same piece if another jump is available. Men jump forward only; kings can move or jump in both directions.",
        "Reaching the far row crowns a king and ends that turn. A player without a legal move loses. Eighty consecutive non-capture king moves produce a draw; repetition draws are not implemented.",
      ],
      tips: [
        "Select a piece first, then one of its marked destinations.",
        "When a jump is available, ordinary moves are unavailable.",
        "Keep pieces supporting one another and look ahead through the entire jump sequence.",
      ],
    },
    ko: {
      title: "체커",
      subtitle: "뛰어넘고, 잡고, 킹이 되세요.",
      description:
        "8×8 보드에서 AI·같은 기기 2인으로 즐기는 무료 영국식 체커입니다. 강제 잡기, 연속 점프, 킹 승급과 목적지 표시를 지원합니다. 일반 말은 전진 이동·전진 잡기만 가능합니다.",
      rules: [
        "민트는 아래에서 시작합니다. 일반 말은 어두운 칸에서 대각선 앞으로 한 칸 이동하며 상대 말 너머 빈칸으로 점프해 잡습니다.",
        "잡을 수 있으면 반드시 잡아야 합니다. 같은 말로 추가 점프가 가능하면 계속 잡습니다. 일반 말은 앞으로만, 킹은 앞뒤로 이동·잡기가 가능합니다.",
        "끝줄에 도착하면 킹이 되며 그 차례는 끝납니다. 둘 수 있는 수가 없으면 패배합니다. 잡기 없는 킹 이동이 양쪽 합계 80수 이어지면 무승부이며 반복 국면 무승부는 적용하지 않습니다.",
      ],
      tips: [
        "말을 먼저 고르고 표시된 목적지를 선택하세요.",
        "잡기가 가능할 때는 일반 이동을 할 수 없어요.",
        "말끼리 서로 지켜주고 연속 점프의 마지막 위치까지 생각하세요.",
      ],
    },
  },
  {
    id: "dots-and-boxes",
    duration: "3–10",
    color: "yellow",
    en: {
      title: "Dots and Boxes",
      subtitle: "One line. A chain of little victories.",
      description:
        "Claim squares in a free 4×4 Dots and Boxes game. Draw one edge at a time against a local AI or a friend. Complete a box to score and keep your turn; one edge can finish two boxes.",
      rules: [
        "Players alternate claiming an unused horizontal or vertical edge between neighbouring dots.",
        "The player drawing a box’s fourth edge owns it and takes another turn. One edge can complete two boxes.",
        "After all sixteen boxes are claimed, the player owning more wins. Eight boxes each is a draw.",
      ],
      tips: [
        "Count a box’s sides before adding a line.",
        "Giving away a short chain can sometimes prevent a much longer chain later.",
        "Check the highlighted edge before confirming; claimed edges cannot be reused.",
      ],
    },
    ko: {
      title: "점 잇기",
      subtitle: "선 하나로 이어지는 작은 승리.",
      description:
        "4×4 사각형 보드에서 AI나 친구와 즐기는 무료 점 잇기입니다. 점 사이에 선을 긋고 사각형을 완성해 점수를 얻으세요. 사각형을 차지하면 한 번 더 두며 선 하나로 두 칸도 완성할 수 있습니다.",
      rules: [
        "차례마다 이웃한 점 사이의 사용하지 않은 가로·세로 선 하나를 선택합니다.",
        "사각형의 네 번째 선을 그으면 그 칸을 차지하고 한 번 더 둡니다. 선 하나로 두 사각형을 동시에 완성할 수도 있습니다.",
        "16개 사각형을 모두 차지하면 더 많은 칸을 가진 쪽이 이깁니다. 8칸씩이면 무승부입니다.",
      ],
      tips: [
        "선을 긋기 전에 사각형의 현재 변 개수를 세어보세요.",
        "짧은 연결을 내주는 것이 긴 연속 획득을 막는 방법이 될 수도 있어요.",
        "확정 전 강조된 선을 확인하세요. 이미 그은 선은 다시 사용할 수 없습니다.",
      ],
    },
  },
];
export const boardGames: Game[] = descriptions.map(
  ({ id, duration, color, en, ko }) => ({
    id,
    category: "board",
    classic: true,
    internalScore: true,
    duration,
    color,
    controlStyle: "pointer",
    version: 1,
    stages: 1,
    tags: [
      id,
      en.title,
      ko.title,
      "board",
      "보드게임",
      "AI",
      "2인",
      "local two-player",
      "strategy",
      "전략",
    ],
    inputs: ["touch", "keyboard", "gamepad"],
    license: "MIT · original implementation",
    author: "Denny Games",
    source: "https://github.com/iamdenny/denny-games/tree/main/src/games/board",
    added: "2026-10-12",
    artwork: `/art/${id}.svg`,
    screenshot: `/art/screenshots/${id}.png`,
    text: {
      en: {
        ...en,
        controls:
          id === "gomoku"
            ? [
                "Touch or mouse: click a space to preview, then click the same space again to place your stone. Click another space to move the preview. Confirm move also works.",
                ...controls.en.slice(1),
              ]
            : controls.en,
      },
      ko: {
        ...ko,
        controls:
          id === "gomoku"
            ? [
                "터치·마우스: 칸을 눌러 미리 보고 같은 자리를 한 번 더 누르면 돌을 놓습니다. 다른 칸을 누르면 미리보기가 이동합니다. 수 두기 버튼으로도 확정할 수 있어요.",
                ...controls.ko.slice(1),
              ]
            : controls.ko,
      },
    },
  }),
);
