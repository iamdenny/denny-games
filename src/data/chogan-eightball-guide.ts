import type { Article } from "./pages";

export const choganEightballGuide: Record<"en" | "ko", Article> = {
  en: {
    title: "How to play 8-Ball Pool: aim, shoot and clear your group",
    intro:
      "Play a full local 8-ball match against three AI difficulties or another person sharing your device. The table physics and fresh ball racks make each frame different; this version does not have online matchmaking or cross-device saves.",
    sections: [
      {
        heading: "Choose a mode and difficulty",
        paragraphs: [
          "Start the game, then open New frame in the game toolbar. Choose Versus AI or Two players. Against the AI, pick Easy, Medium or Hard. In two-player mode, pass the same phone, tablet or computer after each turn.",
          "Every new frame creates a fresh rack. You can start another match whenever you like. Leaving the play page or reloading ends the current frame.",
        ],
      },
      {
        heading: "Solids, stripes and the 8",
        paragraphs: [
          "The first player to pot a solid numbered 1–7 or a stripe numbered 9–15 takes that group. The other player gets the other group. Keep shooting while you pot your own balls.",
          "Hit one of your own group first on every shot. Potting the white cue ball, failing to hit a ball, or hitting an opponent's ball first is a foul. The other player then places the cue ball. Clear your group before potting the 8 to win; potting the 8 early or with a foul loses. An 8 sunk on the break is returned to the table.",
        ],
      },
      {
        heading: "Aim and set shot power",
        paragraphs: [
          "Drag across the table to turn the aim line. Pull the power bar and release to shoot. You can also pull back from the cue ball itself. Use the buttons beside the power bar for small aim adjustments.",
          "When you have ball in hand, drag the white ball to a legal spot. On a keyboard, Left and Right aim, Up and Down change power, Space or Enter shoots, and W/A/S/D move the cue ball. Standard gamepad directions map to aiming or cue-ball placement, and the primary button shoots.",
        ],
      },
      {
        heading: "Local play and saves",
        paragraphs: [
          "Two players share one device and take turns. The game does not offer online rooms, matchmaking, accounts or cross-device play. The current frame and game records are not saved after leaving or reloading.",
          "Use the Denny Games pause control whenever you need to stop. Sound follows the site player settings. The New frame menu opens inside the game so the Denny Games page remains in control of leaving and fullscreen.",
        ],
      },
    ],
    links: [
      { label: "Play 8-Ball Pool", href: "/en/play/chogan-eightball/" },
      {
        label: "Source and MIT / OFL notices",
        href: "/licenses/chogan-eightball/",
      },
      {
        label: "Pinned Chogan source commit",
        href: "https://github.com/choganhq/chogan/tree/2c6d6d80b25aad8a6fc4987d0f347a445493780e",
      },
    ],
  },
  ko: {
    title: "8볼 풀 하는 법: 조준하고 내 공을 모두 넣기",
    intro:
      "AI 난이도 세 단계 또는 같은 기기를 쓰는 친구와 한 판 즐겨보세요. 매번 공을 새로 배열해 판마다 다르게 플레이합니다. 온라인 매칭이나 기기 간 저장은 지원하지 않아요.",
    sections: [
      {
        heading: "모드와 난이도 선택",
        paragraphs: [
          "게임을 시작한 뒤 게임 상단의 새 게임 버튼을 열어 컴퓨터와 대결 또는 두 명이 함께를 선택하세요. AI 대결은 쉬움·보통·어려움 중에서 골라요. 2인 모드에서는 한 휴대전화·태블릿·컴퓨터를 번갈아 사용하세요.",
          "새 게임을 시작할 때마다 공을 새로 배열합니다. 원할 때 다시 한 판을 시작할 수 있어요. 플레이 페이지를 나가거나 새로고침하면 진행 중인 판은 끝납니다.",
        ],
      },
      {
        heading: "단색 공, 줄무늬 공과 8번 공",
        paragraphs: [
          "먼저 단색 공 1~7번 또는 줄무늬 공 9~15번을 넣은 사람이 해당 그룹을 맡고, 상대는 다른 그룹을 맡아요. 내 공을 넣으면 한 번 더 칠 수 있습니다.",
          "매번 내 그룹 공을 먼저 맞혀야 해요. 흰 큐볼을 넣거나, 공을 맞히지 못하거나, 상대 공을 먼저 맞히면 파울입니다. 상대는 흰 공을 원하는 위치에 놓습니다. 내 그룹을 모두 넣고 나서 8번 공을 넣으면 승리해요. 8번 공을 먼저 넣거나 파울과 함께 넣으면 해당 판에서 패배합니다. 초구에 들어간 8번 공은 다시 놓여요.",
        ],
      },
      {
        heading: "조준하고 힘 조절하기",
        paragraphs: [
          "당구대 위를 드래그해 조준선을 돌리세요. 힘 조절 막대를 당겼다 놓으면 샷을 해요. 흰 큐볼에서 직접 뒤로 당겨도 됩니다. 힘 조절 막대 양쪽 버튼으로 조준을 조금씩 맞출 수 있어요.",
          "흰 공 배치 차례에는 흰 공을 합법적인 위치로 드래그하세요. 키보드는 좌우 방향키로 조준하고 위아래 방향키로 힘을 조절하며 Space 또는 Enter로 샷합니다. W/A/S/D로 흰 공을 옮겨요. 표준 게임패드 방향은 조준·흰 공 이동에, 기본 버튼은 샷에 연결됩니다.",
        ],
      },
      {
        heading: "한 기기 대전과 저장",
        paragraphs: [
          "두 명이 한 기기를 함께 사용하며 차례로 플레이합니다. 온라인 방·매칭·계정·기기 간 대전은 없어요. 페이지를 떠나거나 새로고침한 뒤에는 진행 중인 판과 게임 기록을 이어갈 수 없습니다.",
          "잠시 멈출 때는 데니 게임즈 일시정지 버튼을 누르세요. 효과음은 사이트 플레이어 설정을 따라갑니다. 새 판 선택은 게임 안에서 하고, 나가기와 전체 화면은 데니 게임즈 플레이어가 관리해요.",
        ],
      },
    ],
    links: [
      { label: "8볼 풀 플레이", href: "/ko/play/chogan-eightball/" },
      {
        label: "원본 소스와 MIT·OFL 라이선스 안내",
        href: "/licenses/chogan-eightball/",
      },
      {
        label: "고정한 Chogan 원본 커밋",
        href: "https://github.com/choganhq/chogan/tree/2c6d6d80b25aad8a6fc4987d0f347a445493780e",
      },
    ],
  },
};
