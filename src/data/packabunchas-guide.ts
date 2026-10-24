import type { Locale } from "../lib/types";
import type { Article } from "./pages";

export const packabunchasGuide = {
  en: {
    title: "How to play PACKABUNCHAS: a five-mode space packing puzzle",
    intro:
      "PACKABUNCHAS is a colorful, no-rush tile-packing puzzle by Mattia Fortunati. Choose one of five modes, fit the shapes into each outline and help a space rescue crew find its way home. The original game's interface and story are in English; this guide explains the controls in English and Korean.",
    sections: [
      {
        heading: "What do you do in PACKABUNCHAS?",
        paragraphs: [
          "You guide Spacey and a group of space rangers by packing polyomino-style pieces into the target shapes. The game has five modes: CLASSIC, PENTA, MIX, KIDS and EZPZ. They are modes in one game, not separate titles or shell stages.",
          "There is no countdown. Take time to inspect the outline, move a piece and rotate it when its edges do not fit.",
        ],
      },
      {
        heading: "How do I start a mode?",
        paragraphs: [
          "Start the game from the Denny Games player, tap or click the title screen, then use the arrows on the next screen to choose a mode. Select Start to open its puzzle.",
          "The creator's in-game labels remain in English. CLASSIC, PENTA, MIX, KIDS and EZPZ retain their original names in both language routes.",
        ],
      },
      {
        heading: "How do I move and rotate pieces?",
        paragraphs: [
          "On a touchscreen, drag a piece into the outlined space. Double-tap a piece to rotate it. On a computer, click and drag; double-click to rotate.",
          "The game does not include keyboard or gamepad controls. Its save data is kept locally in this browser. The Denny Games pause control stops the game's animation, timers and background music while paused.",
        ],
      },
      {
        heading: "Does it work on phones and tablets?",
        paragraphs: [
          "The upstream game includes touch input and was tested by its creator in mobile browsers. Denny Games checks the hosted frame in automated phone and iPad-sized browser layouts, but that does not replace testing a physical device.",
          "The board is portrait-shaped. A landscape tablet may leave empty space beside it; use the player's larger-screen view when you want the game to fill more of the display.",
        ],
      },
    ],
    links: [
      { label: "Play PACKABUNCHAS", href: "/en/play/packabunchas/" },
      {
        label: "PACKABUNCHAS source and MIT license",
        href: "https://github.com/MattiaFortunati/packabunchas/tree/fc4e6331fa4b8c17cc341094e9027bccd02f463f",
      },
    ],
  },
  ko: {
    title: "PACKABUNCHAS 하는 법: 다섯 모드 우주 도형 퍼즐",
    intro:
      "PACKABUNCHAS는 Mattia Fortunati가 만든 알록달록한 도형 채우기 퍼즐이에요. 다섯 모드 중 하나를 골라 조각을 윤곽에 맞추고 우주 구조대가 길을 찾도록 도와주세요. 원작 게임 화면과 이야기는 영어이며, 이 안내에서 조작법을 한국어와 영어로 설명해요.",
    sections: [
      {
        heading: "PACKABUNCHAS에서는 무엇을 하나요?",
        paragraphs: [
          "스페이시와 우주 구조대가 폴리오미노 모양 조각을 목표 도형에 맞춰 채우도록 도와요. CLASSIC, PENTA, MIX, KIDS, EZPZ 다섯 모드가 있어요. 다섯 개의 별도 게임이나 사이트 진행 단계가 아니라 한 게임 안의 모드예요.",
          "시간제한은 없어요. 윤곽을 살펴보고 조각을 옮겨보세요. 방향이 맞지 않으면 회전하면 돼요.",
        ],
      },
      {
        heading: "모드는 어떻게 시작하나요?",
        paragraphs: [
          "데니 게임즈 플레이어에서 게임을 시작한 다음 제목 화면을 눌러주세요. 다음 화면의 좌우 화살표로 모드를 고르고 Start를 누르면 퍼즐이 열려요.",
          "게임 안 원작 표시는 영어로 유지돼요. 두 언어 페이지 모두 CLASSIC, PENTA, MIX, KIDS, EZPZ라는 원래 이름을 사용해요.",
        ],
      },
      {
        heading: "조각은 어떻게 옮기고 회전하나요?",
        paragraphs: [
          "터치 화면에서는 조각을 윤곽 안으로 끌어 놓으세요. 조각을 두 번 빠르게 누르면 회전해요. 컴퓨터에서는 클릭한 채로 끌고, 두 번 클릭해 회전해요.",
          "키보드와 게임패드 조작은 없어요. 저장 내용은 이 브라우저에만 남아요. 데니 게임즈 일시정지 버튼을 누르면 게임 애니메이션과 타이머, 배경 음악이 멈춰요.",
        ],
      },
      {
        heading: "휴대폰과 태블릿에서 쓸 수 있나요?",
        paragraphs: [
          "원작에는 터치 조작이 포함되어 있고 제작자는 모바일 브라우저에서 확인했다고 안내해요. 데니 게임즈도 자동화 브라우저에서 휴대폰과 아이패드 크기의 화면을 확인하지만 실제 기기 점검을 대신하지는 않아요.",
          "게임판은 세로형이에요. 가로로 둔 태블릿에서는 옆에 빈 공간이 남을 수 있어요. 더 넓게 보고 싶으면 플레이어의 큰 화면 보기를 사용하세요.",
        ],
      },
    ],
    links: [
      { label: "PACKABUNCHAS 플레이", href: "/ko/play/packabunchas/" },
      {
        label: "PACKABUNCHAS 원본 소스와 MIT 라이선스",
        href: "https://github.com/MattiaFortunati/packabunchas/tree/fc4e6331fa4b8c17cc341094e9027bccd02f463f",
      },
    ],
  },
} satisfies Record<Locale, Article>;
