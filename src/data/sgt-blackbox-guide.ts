import type { Locale } from "../lib/types";
import type { Article } from "./pages";

export const sgtBlackboxGuide: Record<Locale, Article> = {
  en: {
    title: "How to play Black Box: trace the laser and find the hidden balls",
    intro:
      "Black Box is a deduction puzzle from Simon Tatham’s Portable Puzzle Collection. Fire beams from the edge of a box, read where each beam stops, reflects or emerges, and use those clues to place the hidden balls.",
    sections: [
      {
        heading: "Read the beam results",
        paragraphs: [
          "Choose a square along the outside edge to fire a beam through the grid. H means it hit a ball directly. R means it returned to its entry point after a reflection, including a deflection caused by a ball beside the entry square. A number at the entry and matching number at the exit describe one beam passing through the box.",
          "The board shows the observed path, not the ball itself. Compare results from different edges and trace which placements could explain every beam.",
        ],
      },
      {
        heading: "Mark and check your guesses",
        paragraphs: [
          "Tap or click inside the box to place a guessed ball. Tap or click the same square again to remove it. On touch screens, switch on Mark mode above the board to mark a square you know; switch Mark mode off before firing or changing guesses.",
          "When you have placed the required number of guesses, use the green check button in the game. Some different arrangements can have the same complete set of beam results, so the rules allow any arrangement that matches the clues.",
        ],
      },
      {
        heading: "Controls and saving",
        paragraphs: [
          "Touch uses tap; a mouse uses left-click to fire or guess and right-click to mark known cells. The upstream menu and status messages remain in English. The localized Mark mode is a Denny Games touch adaptation.",
          "The game runs locally in an isolated frame. Puzzle progress is not saved. Restarting or reloading opens a fresh puzzle; there is no account or online score.",
        ],
      },
    ],
    links: [
      { label: "Play Black Box", href: "/en/play/sgt-blackbox/" },
      {
        label: "Black Box source and MIT license",
        href: "/licenses/sgt-blackbox/",
      },
    ],
  },
  ko: {
    title: "블랙 박스 하는 법: 레이저 경로를 따라 숨은 구슬 찾기",
    intro:
      "블랙 박스는 Simon Tatham의 Portable Puzzle Collection에 포함된 추리 퍼즐이에요. 상자 가장자리에서 빛을 쏘고, 빛이 멈추거나 반사되거나 빠져나온 위치를 읽어 숨은 구슬을 찾아요.",
    sections: [
      {
        heading: "빛의 결과 읽기",
        paragraphs: [
          "상자 바깥 가장자리의 칸을 골라 격자 안으로 빛을 쏘세요. H는 구슬을 바로 맞혔다는 뜻이에요. R은 입구 옆 구슬 때문에 방향이 바뀌는 경우를 포함해 빛이 반사되어 입구로 돌아왔다는 뜻이에요. 입구와 출구에 같은 번호가 표시되면 한 줄기의 빛이 상자를 통과한 거예요.",
          "보드에는 관찰한 빛의 경로가 표시되고 구슬은 직접 보이지 않아요. 서로 다른 가장자리에서 쏜 결과를 비교해 모든 흔적을 설명할 수 있는 위치를 추리하세요.",
        ],
      },
      {
        heading: "추측 표시하고 확인하기",
        paragraphs: [
          "상자 안쪽 칸을 누르면 구슬을 추측해 놓을 수 있어요. 같은 칸을 다시 누르면 지워져요. 터치 화면에서는 게임 위 표시 모드를 켜서 확실한 칸을 표시하세요. 빛을 쏘거나 추측을 바꾸려면 표시 모드를 꺼주세요.",
          "필요한 개수만큼 놓았다면 게임 안의 초록색 확인 버튼을 누르세요. 서로 다른 배치가 모든 빛의 결과를 똑같이 만들 수도 있어요. 규칙상 단서와 일치하는 배치는 모두 정답으로 인정돼요.",
        ],
      },
      {
        heading: "조작과 저장",
        paragraphs: [
          "터치는 누르기, 마우스는 왼쪽 클릭으로 발사·추측하고 오른쪽 클릭으로 확실한 칸을 표시해요. 원작 메뉴와 상태 문구는 영어예요. 한국어 표시 모드는 데니 게임즈가 터치용으로 추가했어요.",
          "게임은 외부 연결이 차단된 로컬 프레임에서 실행돼요. 퍼즐 진행은 저장되지 않아요. 다시 시작하거나 새로고침하면 새 퍼즐이 열리며 계정이나 온라인 점수는 없어요.",
        ],
      },
    ],
    links: [
      { label: "블랙 박스 플레이", href: "/ko/play/sgt-blackbox/" },
      {
        label: "블랙 박스 소스와 MIT 라이선스",
        href: "/licenses/sgt-blackbox/",
      },
    ],
  },
};
