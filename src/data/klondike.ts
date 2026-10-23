import type { Game } from "./games";

export const klondikeGames: Game[] = [
  {
    id: "klondike-solitaire",
    category: "puzzle",
    controlStyle: "pointer",
    duration: "5–15",
    color: "mint",
    version: 1,
    stages: 1,
    tags: [
      "solitaire",
      "klondike",
      "card game",
      "classic cards",
      "free solitaire",
      "솔리테어",
      "클론다이크",
      "카드 게임",
      "혼자 하는 카드놀이",
      "무료 카드 게임",
    ],
    artworkAlt: {
      en: "Original illustration of a green solitaire table with red and black playing cards and four suit foundations",
      ko: "빨간색·검은색 카드와 네 개의 무늬별 기초 더미가 놓인 초록 솔리테어 테이블 자체 그림",
    },
    text: {
      en: {
        title: "Klondike Solitaire",
        searchTitle: "Classic Solitaire — Free Klondike Card Game",
        subtitle: "Build four suits, one careful move at a time.",
        description:
          "Play classic Klondike Solitaire in your browser. Choose one-card or three-card draws, move descending alternating-color sequences, and build all four foundations from Ace to King. Undo a move, ask for a hint, or start a fresh shuffled deal. Your current game stays in this browser.",
        rules: [
          "The tableau has seven columns: the first starts with one face-up card, and each following column adds one face-down card before its face-up card. The remaining 24 cards form the stock.",
          "Build tableau sequences downward in alternating colors. Move a face-up sequence together, and place only a King or a sequence starting with a King in an empty column.",
          "Build each foundation upward by suit from Ace through King. Draw one or three cards from the stock; only the top waste card is available. Recycle the waste when the stock is empty. This game does not promise that every shuffled deal can be won.",
        ],
        controls: [
          "Touch or mouse: choose a face-up card or sequence, then choose its destination pile. Tap the stock to draw or recycle cards.",
          "Keyboard: Tab to a pile or card, Enter or Space to select or move. Arrow keys move focus between nearby piles; a standard gamepad uses the same focus and confirm actions.",
          "Choose Draw 1 or Draw 3 before you start. During a game, select a draw style and choose New deal to apply it. Undo, hints and progress stay in this browser.",
        ],
        tips: [
          "Turn over face-down tableau cards when a move can reveal one.",
          "Aces and low cards can open foundation paths, but check whether moving a card changes the colors available in the tableau.",
          "In Draw 3, plan around the card currently on top of the waste; the cards underneath cannot move yet.",
        ],
      },
      ko: {
        title: "클론다이크 솔리테어",
        searchTitle: "무료 솔리테어 카드 게임 — 클론다이크",
        subtitle: "한 수씩 차분히 네 무늬를 완성해요.",
        description:
          "브라우저에서 클론다이크 솔리테어를 즐겨보세요. 한 장 또는 세 장 뽑기를 고르고, 색을 번갈아 내림차순으로 쌓아 네 기초 더미를 A부터 K까지 완성합니다. 수를 되돌리거나 힌트를 보고, 카드를 다시 섞어 새 판을 시작할 수 있어요. 진행은 이 브라우저에 저장됩니다.",
        rules: [
          "테이블에는 카드 열 일곱 개가 있어요. 첫 열에는 앞면 카드 한 장, 다음 열부터는 뒷면 카드가 하나씩 더 놓인 뒤 앞면 카드가 한 장 놓입니다. 남은 24장은 덱이에요.",
          "열에는 색을 번갈아 가며 숫자가 하나씩 낮아지도록 쌓으세요. 앞면 카드 묶음은 함께 옮길 수 있고, 빈 열에는 K 또는 K로 시작하는 묶음만 놓을 수 있어요.",
          "기초 더미는 같은 무늬의 A부터 K까지 올려 쌓습니다. 덱에서 한 장이나 세 장을 뽑고 버린 카드 중 맨 위 카드만 사용할 수 있어요. 덱이 비면 버린 카드를 되돌립니다. 모든 섞인 판에서 승리를 보장하지는 않습니다.",
        ],
        controls: [
          "터치·마우스: 앞면 카드나 카드 묶음을 고른 뒤 놓을 더미를 누르세요. 덱을 누르면 카드를 뽑거나 되돌립니다.",
          "키보드: Tab으로 더미나 카드를 고르고 Enter·Space로 선택하거나 옮기세요. 방향키는 가까운 더미로 포커스를 움직입니다. 표준 게임패드도 같은 방향·확인 조작을 사용합니다.",
          "시작 전에 한 장 또는 세 장 뽑기를 고르세요. 플레이 중 방식을 바꾸려면 뽑기 방식을 선택한 뒤 ‘새 판’을 누르세요. 되돌리기·힌트·진행은 이 브라우저에 저장됩니다.",
        ],
        tips: [
          "가능하면 앞면 카드 묶음을 옮겨 뒷면 카드를 열어보세요.",
          "A나 낮은 숫자를 기초 더미에 놓기 전에 열에서 필요한 색이 막히지 않는지도 살펴보세요.",
          "세 장 뽑기에서는 버린 카드 맨 위에 있는 카드만 움직일 수 있으니 다음 차례를 생각해 보세요.",
        ],
      },
    },
    added: "2026-10-24",
    author: "Denny Games",
    license: "MIT",
    licenseAppliesToGame: true,
    licenseUrl: "https://github.com/iamdenny/denny-games/blob/main/LICENSE",
    licenseDescription: {
      en: "Original game logic, interface and card-table illustration by Denny Games; no third-party game code or card artwork is bundled.",
      ko: "데니 게임즈가 직접 만든 게임 규칙·인터페이스·카드 테이블 그림입니다. 제3자 게임 코드와 카드 그림은 포함하지 않았습니다.",
    },
    playModes: ["single-player"],
    inputs: ["touch", "mouse", "keyboard", "gamepad"],
    internalScore: true,
    source:
      "https://github.com/iamdenny/denny-games/tree/main/src/games/klondike",
    artwork: "/art/klondike-solitaire.svg",
    screenshot: "/art/screenshots/klondike-solitaire.png",
    guide: {
      path: "guides/klondike-solitaire",
      label: {
        en: "Klondike rules and strategy guide",
        ko: "클론다이크 규칙·공략 안내",
      },
    },
  },
];
