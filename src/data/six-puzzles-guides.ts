import type { Article } from "./pages";
import type { Locale } from "../lib/types";
export const sixPuzzleGuides: Record<string, Record<Locale, Article>> = {
  "guides/minefield-watch": {
    en: {
      title: "Minefield Watch rules and strategy",
      intro:
        "What do the numbers mean in Minefield Watch, and when is a covered cell safe? This guide explains the eight-neighbor count, safe first opening, flood reveal and flag mode across the three board sizes. Learn how to avoid accidental openings, finish a field and continue a saved round.",
      links: [
        {
          label: "Play now",
          href: "/en/play/minefield-watch/",
        },
      ],
      sections: [
        {
          heading: "Rules",
          paragraphs: [
            "Choose one of three stages: 6×6 with 6 mines, 7×7 with 9 mines, or 8×8 with 12 mines.",
            "The first revealed cell and all its neighbors are safe. A number counts mines in the eight surrounding cells. Empty regions open automatically.",
            "Reveal all safe cells to win. Opening a mine ends the round. Flags are reminders and prevent opening a marked cell; their positions alone do not win.",
          ],
        },
        {
          heading: "Controls and continuation",
          paragraphs: [
            "Select a cell with touch, mouse or arrow keys, then tap the same cell again or press Confirm, Enter or Space.",
            "Switch between Reveal and Flag with the mode button. Pause stops input; Restart resets this minefield.",
          ],
        },
        {
          heading: "Solving strategies",
          paragraphs: [
            "Use a completed number to rule out neighboring cells.",
            "Count flagged neighbors before deciding whether another covered cell is safe.",
            "Some fields may require a guess; first-click safety is not a guarantee of a logic-only solution.",
          ],
        },
        {
          heading: "Local saves and privacy",
          paragraphs: [
            "Progress stays in this browser, without account sync. Clearing site data removes saves. Optional analytics measures starts and completed rounds only after consent; advertising choices are separate.",
          ],
        },
      ],
    },
    ko: {
      title: "지뢰 감시대 규칙과 풀이 안내",
      intro:
        "지뢰 감시대의 숫자는 무엇을 뜻하고 닫힌 칸은 언제 안전할까요? 주변 여덟 칸의 지뢰 수, 안전한 첫 열기, 빈 영역 자동 공개와 깃발 모드를 세 가지 판 크기에 맞춰 설명합니다. 실수로 칸을 여는 일을 줄이고 판을 완료하거나 저장된 진행을 잇는 방법을 살펴보세요.",
      links: [
        {
          label: "바로 플레이",
          href: "/ko/play/minefield-watch/",
        },
      ],
      sections: [
        {
          heading: "규칙",
          paragraphs: [
            "세 단계는 6×6 지뢰 6개, 7×7 지뢰 9개, 8×8 지뢰 12개입니다.",
            "처음 연 칸과 인접 칸은 안전합니다. 숫자는 주변 최대 여덟 칸의 지뢰 수이며 빈 영역은 자동으로 열립니다.",
            "안전한 칸을 모두 열면 승리합니다. 지뢰를 열면 실패하며 깃발은 실수로 여는 것을 막는 메모입니다. 깃발만 맞혀서는 승리하지 않습니다.",
          ],
        },
        {
          heading: "조작과 이어하기",
          paragraphs: [
            "터치·마우스·방향키로 칸을 고른 뒤 같은 칸을 다시 누르거나 확인·Enter·Space를 누르세요.",
            "모드 버튼으로 열기와 깃발을 바꾸세요. 일시정지하면 입력이 멈추고 다시 시작하면 지뢰밭을 초기화합니다.",
          ],
        },
        {
          heading: "풀이 전략",
          paragraphs: [
            "주변 지뢰 수가 확정된 숫자부터 인접 칸을 판단하세요.",
            "깃발 수와 숫자를 비교한 뒤 다른 닫힌 칸이 안전한지 살펴보세요.",
            "일부 판에서는 추측이 필요할 수 있습니다. 첫 클릭 안전은 추측 없는 해법을 보장하지 않습니다.",
          ],
        },
        {
          heading: "로컬 저장과 개인정보",
          paragraphs: [
            "진행은 계정 동기화 없이 이 브라우저에 저장됩니다. 사이트 데이터를 지우면 저장도 사라집니다. 통계를 허용한 경우에만 시작·완료를 측정하며 광고 동의는 별도입니다.",
          ],
        },
      ],
    },
  },
  "guides/mosaic-mystery": {
    en: {
      title: "Mosaic Mystery rules and strategy",
      intro:
        "Read nonogram clues from left to right and top to bottom to uncover a hidden picture. This Mosaic Mystery guide explains filled runs, mandatory gaps, zero clues and optional crosses. Follow a methodical solving sequence through twelve original pictures while keeping every mark editable.",
      links: [
        {
          label: "Play now",
          href: "/en/play/mosaic-mystery/",
        },
      ],
      sections: [
        {
          heading: "Rules",
          paragraphs: [
            "Each row and column clue lists the lengths of consecutive filled groups in order. Leave at least one empty cell between groups.",
            "Paint the picture and optionally mark empty cells with crosses. Tapping an already identical mark removes it. A zero clue means every cell in that line is empty.",
            "Match every filled cell to complete a picture. Crosses are optional. The stage selector offers twelve original 5×5 and 6×6 puzzles.",
          ],
        },
        {
          heading: "Controls and continuation",
          paragraphs: [
            "Select a cell with touch, mouse or arrow keys, then tap the same cell again or press Confirm, Enter or Space.",
            "Switch between Paint and Cross with the mode button. Pause stops input; Restart clears marks on this picture.",
          ],
        },
        {
          heading: "Solving strategies",
          paragraphs: [
            "Start with a clue that fills an entire line.",
            "Compare crossing row and column clues to find guaranteed overlap.",
            "Cross marks are notes, not an error check. Revisit conflicting assumptions; the game does not reveal correctness until the picture is complete.",
          ],
        },
        {
          heading: "Local saves and privacy",
          paragraphs: [
            "Progress stays in this browser, without account sync. Clearing site data removes saves. Optional analytics measures starts and completed rounds only after consent; advertising choices are separate.",
          ],
        },
      ],
    },
    ko: {
      title: "모자이크 미스터리 규칙과 풀이 안내",
      intro:
        "가로는 왼쪽부터, 세로는 위쪽부터 숫자를 읽어 숨은 그림을 찾아보세요. 모자이크 미스터리 안내는 연속 칠한 덩어리, 반드시 필요한 빈칸, 숫자 0과 선택 사항인 × 메모를 설명합니다. 언제든 표시를 고치면서 열두 그림을 차근차근 풀어가는 순서도 알아보세요.",
      links: [
        {
          label: "바로 플레이",
          href: "/ko/play/mosaic-mystery/",
        },
      ],
      sections: [
        {
          heading: "규칙",
          paragraphs: [
            "행과 열의 숫자는 순서대로 연속 칠한 덩어리의 길이입니다. 덩어리 사이에는 적어도 한 칸을 비우세요.",
            "그림을 칠하고 확실한 빈칸은 ×로 표시할 수 있습니다. 같은 표시를 다시 적용하면 지워집니다. 숫자 0은 해당 줄이 모두 빈칸이라는 뜻입니다.",
            "칠한 칸이 정답과 모두 같아지면 완성됩니다. 빈칸의 × 표시는 선택 사항입니다. 단계 선택에서 자체 제작한 5×5·6×6 퍼즐 열두 개를 고를 수 있습니다.",
          ],
        },
        {
          heading: "조작과 이어하기",
          paragraphs: [
            "터치·마우스·방향키로 칸을 고른 뒤 같은 칸을 다시 누르거나 확인·Enter·Space를 누르세요.",
            "모드 버튼으로 칠하기와 빈칸 표시를 바꾸세요. 일시정지하면 입력이 멈추고 다시 시작하면 이 그림의 표시를 지웁니다.",
          ],
        },
        {
          heading: "풀이 전략",
          paragraphs: [
            "줄 전체를 채우는 숫자부터 시작하세요.",
            "가로와 세로의 숫자를 함께 비교해 반드시 겹치는 칸을 찾으세요.",
            "×는 메모이며 오답 검사 기능이 아닙니다. 충돌하는 가정을 다시 살펴보세요. 완성 전에는 정답 여부를 알려주지 않습니다.",
          ],
        },
        {
          heading: "로컬 저장과 개인정보",
          paragraphs: [
            "진행은 계정 동기화 없이 이 브라우저에 저장됩니다. 사이트 데이터를 지우면 저장도 사라집니다. 통계를 허용한 경우에만 시작·완료를 측정하며 광고 동의는 별도입니다.",
          ],
        },
      ],
    },
  },
};
