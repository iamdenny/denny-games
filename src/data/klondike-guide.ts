import type { Article } from "./pages";
import type { Locale } from "../lib/types";

export const klondikeGuide: Record<Locale, Article> = {
  en: {
    title: "How to play Klondike Solitaire: rules, draws and tips",
    intro:
      "Play free Klondike Solitaire on Denny Games. This guide explains the seven tableau columns, four foundations, one-card and three-card draws, legal moves, undo, hints and browser-local saves.",
    links: [
      {
        label: "Play Klondike Solitaire",
        href: "/en/play/klondike-solitaire/",
      },
      {
        label: "Browse every free puzzle game",
        href: "/en/category/puzzle/",
      },
    ],
    sections: [
      {
        heading: "What is the goal of Klondike Solitaire?",
        paragraphs: [
          "Move all 52 cards into four suit foundations. Each foundation starts with an Ace and builds upward through its suit to King. The seven tableau columns are where most sorting happens; face-down cards turn over when uncovered.",
          "The game begins with one face-up card in the first column and one additional face-down card in each following column. The other 24 cards form the stock. This is a standard Klondike layout with Denny Games' own code, interface and illustration.",
        ],
      },
      {
        heading: "Which moves are legal?",
        paragraphs: [
          "Build down in alternating colors in the tableau: for example, place a red 7 on a black 8. You can move an entire face-up sequence together. Only a King or a sequence beginning with a King can fill an empty column.",
          "Move an Ace to an empty foundation, then add the next card of the same suit. This version keeps foundation cards in place. A move can uncover a face-down card, which flips face up automatically.",
        ],
      },
      {
        heading: "What is the difference between Draw 1 and Draw 3?",
        paragraphs: [
          "Draw 1 reveals one stock card at a time. Draw 3 reveals up to three cards, but only the top card of the waste can be played. When the stock is empty, tap it again to return the waste cards and continue. This version allows repeated passes through the stock.",
          "Choose a draw style before starting. During a round, choosing another style does not change the current board; press New deal to begin a newly shuffled game with the selected style. A random deal is not guaranteed to be solvable.",
        ],
      },
      {
        heading: "How do I select and move cards?",
        paragraphs: [
          "On a phone or tablet, tap a face-up card or sequence, then tap the destination column or foundation. A highlighted selection shows which cards will move. Use the stock, Undo and Hint controls below the board when needed.",
          "With a keyboard, Tab to a card or pile, then press Enter or Space. Arrow keys move focus between nearby piles. A standard gamepad can use the same directional and confirm actions. These browser controls are implemented in the game; physical-device compatibility is not certified by this page.",
        ],
      },
      {
        heading: "Are games saved, timed or scored?",
        paragraphs: [
          "The board, move count and undo history are stored in this browser so you can resume after a reload or language change. The board shows how many cards have reached the foundations; there is no timer or online leaderboard. Clearing browser storage removes the saved round.",
        ],
      },
    ],
  },
  ko: {
    title: "클론다이크 솔리테어 하는 법: 규칙·뽑기·공략",
    intro:
      "데니 게임즈에서 무료 클론다이크 솔리테어를 플레이하세요. 카드 열 일곱 개와 기초 더미 네 개, 한 장·세 장 뽑기, 가능한 이동, 되돌리기·힌트와 브라우저 저장을 안내합니다.",
    links: [
      {
        label: "클론다이크 솔리테어 플레이",
        href: "/ko/play/klondike-solitaire/",
      },
      { label: "무료 퍼즐 게임 모두 보기", href: "/ko/category/puzzle/" },
    ],
    sections: [
      {
        heading: "클론다이크 솔리테어의 목표는 무엇인가요?",
        paragraphs: [
          "52장의 카드를 무늬별 기초 더미 네 곳에 모두 쌓으면 돼요. 각 더미는 A부터 시작해 같은 무늬의 K까지 오름차순으로 완성합니다. 일곱 개의 카드 열에서 주로 카드를 정리하고, 가려진 카드가 드러나면 앞면으로 뒤집혀요.",
          "처음에는 첫 열에 앞면 카드 한 장, 다음 열부터는 뒷면 카드가 하나씩 더 놓인 뒤 앞면 카드가 한 장 놓입니다. 남은 24장은 덱이에요. 표준 클론다이크 배열을 데니 게임즈가 직접 만든 코드·인터페이스·그림으로 구현했습니다.",
        ],
      },
      {
        heading: "어떤 카드 이동이 가능한가요?",
        paragraphs: [
          "카드 열에는 색을 번갈아 가며 숫자가 하나씩 낮아지도록 쌓으세요. 예를 들어 검은색 8 위에 빨간색 7을 놓을 수 있어요. 앞면으로 놓인 연속된 카드 묶음은 함께 옮길 수 있습니다. 빈 열은 K 또는 K로 시작하는 묶음으로만 채울 수 있어요.",
          "A는 빈 기초 더미에 놓고 같은 무늬의 다음 숫자를 올려요. 이 버전에서는 기초 더미의 카드를 다시 열로 가져올 수 없습니다. 카드를 옮겨 뒷면 카드가 드러나면 자동으로 앞면이 돼요.",
        ],
      },
      {
        heading: "한 장 뽑기와 세 장 뽑기는 어떻게 다른가요?",
        paragraphs: [
          "한 장 뽑기는 덱에서 한 장씩 확인합니다. 세 장 뽑기는 최대 세 장을 한 번에 뒤집지만, 버린 카드 맨 위에 있는 카드만 사용할 수 있어요. 덱이 비면 다시 눌러 버린 카드를 되돌려 계속 진행하세요. 이 버전은 덱을 여러 번 다시 돌릴 수 있습니다.",
          "시작 전에 뽑기 방식을 고르세요. 한 판 중에 방식을 바꾸면 현재 보드는 그대로 유지됩니다. 선택한 방식으로 새로 섞은 판을 시작하려면 ‘새 판’을 누르세요. 무작위로 섞은 모든 판에서 승리를 보장하지는 않습니다.",
        ],
      },
      {
        heading: "카드를 고르고 옮기는 방법은 무엇인가요?",
        paragraphs: [
          "휴대폰이나 태블릿에서는 앞면 카드나 묶음을 누른 다음 놓을 열 또는 기초 더미를 누르세요. 강조된 카드가 함께 움직일 카드입니다. 필요하면 보드 아래의 덱·되돌리기·힌트 조작을 사용하세요.",
          "키보드는 Tab으로 카드나 더미에 포커스를 옮기고 Enter·Space를 누릅니다. 방향키로 가까운 더미 사이를 이동할 수 있어요. 표준 게임패드도 같은 방향·확인 입력을 사용할 수 있습니다. 페이지에 설명된 브라우저 조작은 게임 코드에서 구현했으며, 실제 기기 호환 인증을 뜻하지는 않습니다.",
        ],
      },
      {
        heading: "시간 제한이나 점수, 저장이 있나요?",
        paragraphs: [
          "보드와 이동 수, 되돌리기 내역을 이 브라우저에 저장해 새로고침하거나 언어를 바꾼 뒤 이어갈 수 있어요. 화면에는 기초 더미에 놓은 카드 수를 표시합니다. 시간 제한과 온라인 순위표는 없습니다. 브라우저 데이터를 지우면 저장된 판도 사라집니다.",
        ],
      },
    ],
  },
};
