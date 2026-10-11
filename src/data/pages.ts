import { games } from "./games";
import type { Locale } from "../lib/types";
export interface Article {
  title: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
  links?: { label: string; href: string }[];
}
export const articles: Record<string, Record<Locale, Article>> = {
  "guides/open-browser-games": {
    en: {
      title: "Free browser games: sources, rules and device support",
      intro: `Denny Games offers ${games.length} playable browser games in English and Korean, without an account or installation. The catalogue includes 191 MIT-licensed ABA Games Crisp mini-games, an adapted 2048 and two original games.`,
      sections: [
        {
          heading: "What can I play?",
          paragraphs: [
            "Browse puzzle, arcade, action, shooting, racing and sports collections. Each game has a detail page with its rules, controls, author and source. Racing includes steering challenges as well as driving games; these are short mini-games rather than full console releases.",
          ],
        },
        {
          heading: "Are free games also open source?",
          paragraphs: [
            "Free-to-play and permission to redistribute are separate questions. These imports have reviewed source and asset provenance and retained MIT notices. The catalogue does not include commercial console ROM collections. Original authors retain their credits, and listing a game does not imply their endorsement.",
          ],
        },
        {
          heading: "Do mobile, gamepad and Tesla browsers work?",
          paragraphs: [
            "Touch, keyboard and standard gamepad mappings are implemented. Automated Chromium checks cover narrow layouts and imported game loading, input and pausing. Physical phones, controllers and Tesla browsers still require separate verification. Use vehicle browsers only while parked; test controller access with the local input diagnostic.",
          ],
        },
        {
          heading: "Can I save my game?",
          paragraphs: [
            "Personal best scores, favorites and recent games stay in this browser. The three original-platform games can also restore round progress. Crisp games start a fresh round after reloading. Clearing browser storage removes local records.",
          ],
        },
      ],
      links: [
        { label: "Browse all categories", href: "/en/" },
        { label: "Authors and source links", href: "/en/licenses/" },
        {
          label: "Crisp MIT notices and pinned sources",
          href: "/licenses/crisp/",
        },
        { label: "Device support boundaries", href: "/en/compatibility/" },
        { label: "Gamepad input test", href: "/en/gamepad-test/" },
      ],
    },
    ko: {
      title: "무료 웹게임 안내: 출처·조작법·기기 지원",
      intro: `데니 게임즈는 가입·설치 없이 한국어와 영어로 즐기는 웹게임 ${games.length}개를 제공합니다. MIT 라이선스 ABA Games Crisp 미니게임 191개, 2048을 수정한 게임과 자체 제작 게임 2개가 있습니다.`,
      sections: [
        {
          heading: "어떤 게임을 할 수 있나요?",
          paragraphs: [
            "퍼즐·아케이드·액션·슈팅·레이싱·스포츠에서 골라보세요. 모든 게임의 소개 페이지에 규칙·조작법·제작자·원본 소스를 제공합니다. 레이싱에는 운전뿐 아니라 방향 조작 도전도 포함하며, 대형 콘솔 게임보다 짧게 즐기는 미니게임 중심입니다.",
          ],
        },
        {
          heading: "무료 게임이면 소스도 가져올 수 있나요?",
          paragraphs: [
            "무료 플레이와 재배포 허용은 별개입니다. 등록한 공개 게임은 소스와 자산의 출처·권리를 검토하고 MIT 고지를 유지합니다. 상용 콘솔 ROM 모음은 제공하지 않습니다. 원작자 이름을 보존하며 게임 등록이 원작자의 제휴·보증을 뜻하지 않습니다.",
          ],
        },
        {
          heading: "모바일·게임패드·테슬라에서 되나요?",
          paragraphs: [
            "터치·키보드·표준 게임패드 매핑을 구현했습니다. Chromium 자동 검사로 좁은 화면과 가져온 게임의 로딩·입력·일시정지를 확인했습니다. 실제 휴대폰·패드·테슬라 브라우저는 별도 검증 전입니다. 차량에서는 주차 중에만 사용하고 패드 접근은 입력 진단에서 확인하세요.",
          ],
        },
        {
          heading: "게임 기록은 저장되나요?",
          paragraphs: [
            "최고 기록·즐겨찾기·최근 게임은 이 브라우저에 저장합니다. 초기 플랫폼 게임 3개는 진행 중인 판도 복원할 수 있습니다. Crisp 게임은 새로고침하면 새 판을 시작합니다. 브라우저 저장 공간을 지우면 기기 내 기록도 사라집니다.",
          ],
        },
      ],
      links: [
        { label: "전체 카테고리 보기", href: "/ko/" },
        { label: "제작자와 원본 소스", href: "/ko/licenses/" },
        { label: "Crisp MIT 라이선스와 고정 소스", href: "/licenses/crisp/" },
        { label: "기기 지원 범위", href: "/ko/compatibility/" },
        { label: "게임패드 입력 진단", href: "/ko/gamepad-test/" },
      ],
    },
  },

  about: {
    en: {
      title: "Small games. A better break.",
      intro:
        "Denny Games is an independent browser arcade by Denny Lim. Games are free to play, without an account or installation.",
      sections: [
        {
          heading: "A curated beginning",
          paragraphs: [
            "Explore original Circuit Loop and Orbit Break, an MIT-based 2048 adaptation and 191 ABA Games Crisp mini-games. Every game has rules, controls and a common pause/restart flow.",
            "We are building a larger catalogue through individually reviewed open games and original titles. Research candidates are not listed as playable games until integrated.",
          ],
        },
        {
          heading: "Clear about what works",
          paragraphs: [
            "Touch, keyboard and standard gamepad mappings are implemented. Physical phones, controllers and vehicle browsers require separate tests; we publish those boundaries instead of a blanket compatibility promise.",
          ],
        },
      ],
    },
    ko: {
      title: "작은 게임, 더 좋은 휴식.",
      intro:
        "데니 게임즈는 Denny Lim이 만드는 독립 웹게임 사이트입니다. 가입하거나 설치하지 않고 무료로 플레이할 수 있습니다.",
      sections: [
        {
          heading: "작지만 분명한 시작",
          paragraphs: [
            "자체 제작 서킷 루프·오빗 브레이크, MIT 기반 2048, ABA Games의 Crisp 미니게임 191개를 제공합니다. 게임별 규칙·조작법과 일관된 일시정지·재시작 흐름을 안내합니다.",
            "개별 권리를 검토한 공개 게임과 자체 게임으로 목록을 늘립니다. 조사 후보를 구현된 게임처럼 목록에 넣지 않습니다.",
          ],
        },
        {
          heading: "확인한 만큼 안내합니다",
          paragraphs: [
            "터치·키보드·표준 게임패드 매핑을 구현했습니다. 실제 휴대폰·패드·차량 브라우저는 별도 검증이 필요하며 그 범위를 공개합니다.",
          ],
        },
      ],
    },
  },
  privacy: {
    en: {
      title: "Your play stays with you.",
      intro:
        "The site does not require an account. Progress, preferences, saved games, recent plays and personal bests are stored locally in this browser.",
      sections: [
        {
          heading: "Local storage",
          paragraphs: [
            "Clearing browser storage removes these records. They are not synced between devices. Private browsing or storage restrictions may prevent persistence; games remain playable.",
            "Result sharing includes the game, seed, rule version and your score text. Review the text before using the browser share sheet. No name or email is required.",
          ],
        },
        {
          heading: "Hosting and diagnostics",
          paragraphs: [
            "GitHub Pages serves this site and may process visitor IP addresses for its operation and security. Input diagnosis displays device data locally; it is not uploaded by our code.",
            "Gameplay events are kept in a short in-memory list and emitted as browser CustomEvents. No remote analytics service is configured.",
          ],
        },
        {
          heading: "Advertising",
          paragraphs: [
            "Advertising is currently inactive. Enabling a provider will require updated disclosures and, where applicable, a certified consent platform. No advertising request is made by the inactive configuration.",
          ],
        },
      ],
    },
    ko: {
      title: "플레이 기록은 이 기기에.",
      intro:
        "계정이 필요하지 않습니다. 진행 상황·환경 설정·저장한 게임·최근 플레이·최고 기록은 이 브라우저에 저장됩니다.",
      sections: [
        {
          heading: "기기 내 저장",
          paragraphs: [
            "브라우저 저장 공간을 지우면 기록도 사라지며 다른 기기와 동기화되지 않습니다. 시크릿 모드나 저장 제한이 있어도 게임은 계속할 수 있습니다.",
            "결과 공유에는 게임·시드·규칙 버전·점수 텍스트가 포함됩니다. 브라우저 공유 화면에서 내용을 확인하세요. 이름이나 이메일을 요구하지 않습니다.",
          ],
        },
        {
          heading: "호스팅과 진단",
          paragraphs: [
            "GitHub Pages가 사이트를 제공하며 운영·보안을 위해 방문 IP 등을 처리할 수 있습니다. 입력 진단의 기기 정보는 이 화면에만 표시되고 사이트 코드가 업로드하지 않습니다.",
            "게임 이벤트는 짧은 메모리 목록과 브라우저 CustomEvent로만 기록합니다. 원격 분석 서비스는 연결하지 않았습니다.",
          ],
        },
        {
          heading: "광고",
          paragraphs: [
            "현재 광고는 비활성 상태입니다. 공급자를 활성화할 때 안내를 갱신하고 필요한 지역에는 인증된 동의 관리 도구를 적용합니다. 비활성 설정에서는 광고를 요청하지 않습니다.",
          ],
        },
      ],
    },
  },
  terms: {
    en: {
      title: "A few things to know.",
      intro:
        "Denny Games provides free browser games for personal play. There are no payments, accounts or global score rankings in this version.",
      sections: [
        {
          heading: "Personal records",
          paragraphs: [
            "Scores and progress are local and can be changed or erased by the browser. They are not authenticated competition results. Daily challenges change with the UTC date and the device clock.",
          ],
        },
        {
          heading: "Attribution and devices",
          paragraphs: [
            "Game code, artwork and third-party components keep their respective licenses. See Credits for authors and source. Displaying a game does not imply endorsement by its original author.",
            "Browser features may vary by device. Use vehicle browsers only while parked. Tesla is a third-party trademark; this independent site is not affiliated with Tesla.",
          ],
        },
        {
          heading: "Service changes",
          paragraphs: [
            "The catalogue may change as games are reviewed and tested. Saved-state formats are versioned; incompatible or corrupt records may be ignored to keep games playable. Contact the project for bugs or rights questions.",
          ],
        },
      ],
    },
    ko: {
      title: "플레이 전에 알아두세요.",
      intro:
        "데니 게임즈는 개인이 무료로 즐기는 웹게임을 제공합니다. 현재 결제·계정·전 세계 순위는 없습니다.",
      sections: [
        {
          heading: "개인 기록",
          paragraphs: [
            "점수와 진행 상황은 브라우저에 저장되며 변경되거나 지워질 수 있습니다. 인증된 대회 기록이 아닙니다. 일일 도전은 UTC 날짜와 기기 시계를 따릅니다.",
          ],
        },
        {
          heading: "출처와 기기",
          paragraphs: [
            "게임 코드·이미지·외부 구성요소에는 각각의 라이선스가 적용됩니다. 제작자와 소스는 출처 페이지를 확인하세요. 게임 제공이 원작자의 제휴나 보증을 뜻하지는 않습니다.",
            "브라우저 기능은 기기별로 다릅니다. 차량에서는 주차 중에만 이용하세요. Tesla는 제3자의 상표이며 이 사이트는 Tesla와 제휴하지 않습니다.",
          ],
        },
        {
          heading: "서비스 변경",
          paragraphs: [
            "권리 검토와 테스트에 따라 게임 목록이 바뀔 수 있습니다. 저장 형식은 버전으로 관리하며 호환되지 않거나 손상된 기록은 안전한 플레이를 위해 건너뛸 수 있습니다. 오류와 권리 문의는 프로젝트로 보내주세요.",
          ],
        },
      ],
    },
  },
  contact: {
    en: {
      title: "Let’s make the next round better.",
      intro:
        "Report a bug or ask a rights question through the Denny Games GitHub project.",
      sections: [
        {
          heading: "A useful bug report",
          paragraphs: [
            "Include the game, page URL, browser and OS versions, input method and steps to reproduce. Never post passwords, account tokens, personal information or a full browser storage export.",
            "For a vehicle issue, include model, computer type and firmware only if you are comfortable sharing them. Screenshots should hide personal information.",
          ],
        },
      ],
    },
    ko: {
      title: "다음 한 판을 더 좋게.",
      intro:
        "오류나 권리 문의는 Denny Games GitHub 프로젝트에서 남길 수 있습니다.",
      sections: [
        {
          heading: "이렇게 알려주세요",
          paragraphs: [
            "게임 이름·페이지 주소·브라우저와 OS 버전·조작 방식·재현 순서를 적어주세요. 비밀번호·토큰·개인정보·브라우저 저장 내용 전체는 공개하지 마세요.",
            "차량 오류라면 공유 가능한 범위에서 모델·컴퓨터 종류·펌웨어를 적어주세요. 스크린샷의 개인정보는 가려주세요.",
          ],
        },
      ],
    },
  },
  tesla: {
    en: {
      title: "A parked-car break, honestly described.",
      intro:
        "Tesla browser compatibility is not yet physically verified. Ordinary browser support and native Tesla Arcade controller support are separate facts.",
      sections: [
        {
          heading: "Start with touch",
          paragraphs: [
            "While parked, open a game, choose Large screen and try touch controls. Circuit Loop requires no fast reaction or precise drag. Use the input check before relying on a controller.",
            "Browser fullscreen may not be available. Expand falls back to a larger in-page layout. You can always pause and exit without fullscreen.",
          ],
        },
        {
          heading: "What a verified result needs",
          paragraphs: [
            "We record the vehicle model, computer type, firmware, viewport, controller and connection method. Open, touch, controller, audio, saving and return from an approved ad are separate test items.",
            "There are currently no physical vehicle results. A working desktop preview is not a Tesla support badge.",
          ],
        },
      ],
    },
    ko: {
      title: "주차 중의 휴식, 확인한 만큼만.",
      intro:
        "테슬라 브라우저는 아직 실차 검증 전입니다. 일반 브라우저 동작과 Tesla 내장 Arcade의 패드 지원은 서로 다른 정보입니다.",
      sections: [
        {
          heading: "터치부터 시작하세요",
          paragraphs: [
            "주차 중에 게임을 열고 큰 화면 모드에서 터치를 시도하세요. 서킷 루프는 빠른 반응이나 정밀한 드래그가 필요하지 않습니다. 패드는 입력 진단에서 먼저 확인하세요.",
            "브라우저 전체화면이 허용되지 않으면 화면 확대는 페이지 안에서 확장됩니다. 전체화면 없이도 일시정지하고 나갈 수 있습니다.",
          ],
        },
        {
          heading: "검증 결과에 필요한 정보",
          paragraphs: [
            "모델·컴퓨터 종류·펌웨어·사용 가능 화면·패드·연결 방식을 기록합니다. 사이트 열림·터치·패드·소리·저장·승인된 광고 후 복귀는 따로 확인합니다.",
            "현재 공개할 실차 결과는 없습니다. 데스크톱 화면이 열린 사실만으로 테슬라 지원 배지를 붙이지 않습니다.",
          ],
        },
      ],
    },
  },
  "controller-games": {
    en: {
      title: "From the menu to the next round.",
      intro:
        "Standard gamepad mappings are implemented for navigation, the original games and the Crisp pointer/button bridge. Physical controller/browser combinations await validation.",
      sections: [
        {
          heading: "One familiar mapping",
          paragraphs: [
            "D-pad or left stick moves. The primary face button selects or acts. Start pauses or resumes. Non-standard mappings are ignored instead of guessing button meanings.",
            "A controller may appear only after a physical button press. Secure HTTPS is required by supported browsers. If the controller disconnects, the game pauses and touch or keyboard remains available.",
          ],
        },
      ],
    },
    ko: {
      title: "메뉴부터 다음 한 판까지.",
      intro:
        "사이트 탐색과 기본 게임과 Crisp 게임에 표준 게임패드 매핑을 구현했습니다. 실제 패드·브라우저 조합은 별도 검증 전입니다.",
      sections: [
        {
          heading: "일관된 기본 매핑",
          paragraphs: [
            "방향패드·왼쪽 스틱으로 이동하고 기본 버튼으로 선택·행동합니다. Start는 일시정지·계속하기입니다. 비표준 매핑은 버튼 의미를 추측하지 않고 제외합니다.",
            "패드 버튼을 실제로 눌러야 브라우저에 나타날 수 있습니다. 지원 브라우저에서는 HTTPS가 필요합니다. 연결이 끊기면 게임이 멈추며 터치·키보드로 이어갈 수 있습니다.",
          ],
        },
      ],
    },
  },
  "guides/controller-not-detected": {
    en: {
      title: "Controller connected, but not visible?",
      intro:
        "First check the secure page, press a controller button and inspect the local input diagnostic. An OS connection alone does not prove browser access.",
      sections: [
        {
          heading: "Check in order",
          paragraphs: [
            "Use HTTPS and the input check page. Press a face button once; some browsers expose pads only after a gesture. Confirm the diagnostic says standard mapping.",
            "If nothing appears, reconnect in the OS and try another supported browser or connection path. Do not install unknown controller extensions. Touch and keyboard remain available.",
          ],
        },
      ],
    },
    ko: {
      title: "연결한 패드가 보이지 않나요?",
      intro:
        "먼저 HTTPS 페이지에서 패드 버튼을 누르고 입력 진단을 확인하세요. OS에서 연결됐다는 사실만으로 브라우저 접근을 확인할 수는 없습니다.",
      sections: [
        {
          heading: "순서대로 확인하세요",
          paragraphs: [
            "HTTPS와 입력 진단 페이지를 열고 패드 기본 버튼을 한 번 누르세요. 첫 입력 후에만 패드를 보여주는 브라우저가 있습니다. 표준 매핑인지 확인하세요.",
            "보이지 않으면 OS에서 재연결하고 다른 브라우저나 연결 방식을 시도하세요. 출처를 모르는 패드 확장 프로그램은 설치하지 마세요. 터치·키보드는 계속 사용할 수 있습니다.",
          ],
        },
      ],
    },
  },
  "guides/sound-and-pause": {
    en: {
      title: "A quiet game is still a good game.",
      intro:
        "Sound starts muted. Turn it on with the Sound button after starting; browser autoplay policies may still require a touch or click.",
      sections: [
        {
          heading: "Resume deliberately",
          paragraphs: [
            "Leaving the tab or window pauses the game. Returning does not restart action automatically. Use Resume when ready.",
            "If sound remains unavailable, check the browser tab and device volume. Sound is optional and never required to solve a puzzle. No audio file download is required; feedback is synthesized locally.",
          ],
        },
      ],
    },
    ko: {
      title: "소리 없이도 즐거운 한 판.",
      intro:
        "소리는 처음에 꺼져 있습니다. 시작 후 소리 버튼으로 켜세요. 브라우저 자동재생 정책에 따라 터치·클릭이 필요할 수 있습니다.",
      sections: [
        {
          heading: "준비되면 이어가세요",
          paragraphs: [
            "탭이나 창을 벗어나면 게임이 멈춥니다. 돌아왔다고 자동으로 움직이지 않습니다. 준비되면 계속하기를 누르세요.",
            "소리가 안 나면 탭 음소거와 기기 음량을 확인하세요. 소리는 선택 기능이며 퍼즐 풀이에 필요하지 않습니다. 피드백은 기기에서 합성하므로 음원 파일을 내려받지 않습니다.",
          ],
        },
      ],
    },
  },
  "guides/local-saves": {
    en: {
      title: "Pick up where you left off.",
      intro:
        "Circuit Loop, Orbit Break and 2048 save round progress in this browser. Crisp mini-games save personal best scores, but do not restore a round after reloading. Records are not synced between devices.",
      sections: [
        {
          heading: "What can erase a save",
          paragraphs: [
            "Clearing site data, using another browser profile or private mode can remove records. Games do not use a cloud account and cannot restore cleared local data.",
            "A blocked or full storage area shows an in-game notice. You can still play; persistence across reloads is not guaranteed. Daily and ordinary rounds keep separate progress.",
          ],
        },
      ],
    },
    ko: {
      title: "하던 곳에서 이어가세요.",
      intro:
        "서킷 루프·오빗 브레이크·2048은 진행 상황을 이 브라우저에 저장합니다. Crisp 미니게임은 최고 기록을 저장하지만 새로고침 뒤 진행 중인 판을 복원하지 않습니다. 다른 기기와는 동기화되지 않습니다.",
      sections: [
        {
          heading: "기록이 사라지는 경우",
          paragraphs: [
            "사이트 데이터 삭제·다른 브라우저 프로필·시크릿 모드에서는 기록이 사라질 수 있습니다. 클라우드 계정이 없어 지운 기기 기록을 복원할 수 없습니다.",
            "저장 공간이 막히거나 꽉 차면 게임에서 안내합니다. 플레이는 가능하지만 새로고침 뒤 복원은 보장할 수 없습니다. 일일 도전과 일반 모드의 진행은 따로 저장됩니다.",
          ],
        },
      ],
    },
  },
};
export const guidePaths = [
  "guides/open-browser-games",
  "guides/controller-not-detected",
  "guides/sound-and-pause",
  "guides/local-saves",
];
