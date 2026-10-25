import type { Locale } from "../lib/types";
import type { Article } from "./pages";

export const freedoom2Guide: Record<Locale, Article> = {
  en: {
    title:
      "How to play Freedoom Phase 2: controls, keys and the 32-map campaign",
    intro:
      "Freedoom Phase 2 is a free, single-player first-person shooter campaign. This browser version uses the Freedoom 0.13.0 game data with a locally hosted Chocolate Doom engine. The official campaign has 32 maps; no commercial Doom data is included.",
    sections: [
      {
        heading: "Move through the campaign",
        paragraphs: [
          "The first map starts when the game loads. Explore each level, collect keys, use doors and switches, and find the exit to continue. The 32 maps are part of this one game; they are not separate catalogue entries.",
          "The original game menu and status messages are in English. The Denny Games game page and this guide are available in English and Korean.",
        ],
      },
      {
        heading: "Keyboard and touch controls",
        paragraphs: [
          "On a keyboard, Up and Down move forward and back, Left and Right turn, Ctrl fires, Space uses doors and switches, and Shift runs. Hold a key to keep performing the action.",
          "On touch screens, use the direction buttons to move and turn, then hold Fire, Use or Run as needed. Pause from the Denny Games player bar. The touch layout is browser-emulated and has not been certified on a physical phone or tablet.",
        ],
      },
      {
        heading: "Download, restart and progress",
        paragraphs: [
          "The first play downloads about 12.4 MiB (13 MB) of local game and engine files. The game data is expanded in memory after download. Later loads may use the browser cache. The runtime makes no external game request.",
          "Progress is kept only in the running game session. Restart returns to the first map, and reloading or leaving the page resets the campaign. The in-game save format was not enabled for browser persistence.",
        ],
      },
      {
        heading: "Source and licenses",
        paragraphs: [
          "Freedoom game data is BSD-3-Clause. The Chocolate Doom engine is GPL-2.0-or-later, with SDL2 and Emscripten notices. The local notice page publishes the pinned runtime hashes, corresponding engine source archive, build notes and credits.",
        ],
      },
    ],
    links: [
      { label: "Play Freedoom Phase 2", href: "/en/play/freedoom-2/" },
      { label: "Source, licenses and credits", href: "/licenses/freedoom/" },
    ],
  },
  ko: {
    title: "프리둠 페이즈 2 하는 법: 조작과 32개 맵 캠페인",
    intro:
      "프리둠 페이즈 2는 무료 싱글 플레이 1인칭 슈팅 캠페인이에요. 이 브라우저 버전은 Freedoom 0.13.0 게임 데이터와 데니 게임즈가 직접 제공하는 Chocolate Doom 엔진으로 실행해요. 공식 캠페인에는 32개 맵이 있으며 상업용 둠 데이터는 포함하지 않아요.",
    sections: [
      {
        heading: "캠페인 진행하기",
        paragraphs: [
          "게임이 열리면 첫 맵이 시작돼요. 맵을 탐험하고 열쇠와 스위치를 찾아 문을 열어 출구로 가면 다음 맵으로 이어집니다. 32개 맵은 한 게임 안의 캠페인이며 카탈로그에 각각 따로 등록된 게임이 아니에요.",
          "원작 게임 메뉴와 상태 문구는 영어예요. 데니 게임즈의 게임 안내와 이 글은 영어와 한국어로 제공돼요.",
        ],
      },
      {
        heading: "키보드와 터치 조작",
        paragraphs: [
          "키보드에서는 위·아래 방향키로 앞뒤로 이동하고 왼쪽·오른쪽 방향키로 회전해요. Ctrl은 발사, Space는 문과 스위치 사용, Shift는 달리기예요. 키를 누르고 있으면 동작을 유지해요.",
          "터치 화면에서는 방향 버튼으로 이동·회전하고 발사·사용·달리기 버튼을 누르고 있으세요. 데니 게임즈 플레이어 막대에서 일시정지할 수 있어요. 터치 배치는 브라우저에서 확인하며 실제 휴대전화·태블릿 검증은 완료되지 않았어요.",
        ],
      },
      {
        heading: "다운로드, 다시 시작과 진행 저장",
        paragraphs: [
          "처음 플레이할 때 로컬 게임과 엔진 파일 약 12.4 MiB(약 13 MB)를 내려받아요. 게임 데이터는 메모리에서 압축을 풀어요. 이후에는 브라우저 캐시를 사용할 수 있어요. 게임 실행 중 외부 게임 서버에 연결하지 않아요.",
          "진행은 현재 실행 중인 게임에만 남아요. 다시 시작하면 첫 맵으로 돌아가고 페이지를 새로고침하거나 나가면 캠페인이 초기화돼요. 게임 안 저장 기능은 브라우저 저장용으로 제공하지 않아요.",
        ],
      },
      {
        heading: "소스와 라이선스",
        paragraphs: [
          "Freedoom 게임 데이터는 BSD-3-Clause예요. Chocolate Doom 엔진은 GPL-2.0-or-later이며 SDL2와 Emscripten 고지도 함께 제공해요. 로컬 라이선스 페이지에서 버전을 고정한 런타임 해시, 대응 엔진 소스, 빌드 안내와 크레딧을 확인할 수 있어요.",
        ],
      },
    ],
    links: [
      { label: "프리둠 페이즈 2 플레이", href: "/ko/play/freedoom-2/" },
      { label: "소스·라이선스·크레딧", href: "/licenses/freedoom/" },
    ],
  },
};
