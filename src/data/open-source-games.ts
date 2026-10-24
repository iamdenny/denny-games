import type { Game } from "./games";

export const openSourceGames: Game[] = [
  {
    id: "packabunchas",
    category: "puzzle",
    duration: "5–10",
    controlStyle: "pointer",
    color: "violet",
    version: 1,
    stages: 1,
    tags: [
      "tile packing",
      "polyomino puzzle",
      "tiling puzzle",
      "block placement",
      "colorful puzzle",
      "오픈소스 게임",
      "타일 맞추기",
      "도형 퍼즐",
      "블록 배치",
      "폴리오미노 퍼즐",
    ],
    inputs: ["touch", "mouse"],
    license: "MIT + CC BY-SA 3.0/4.0 snippets",
    licenseDescription: {
      en: "The upstream PACKABUNCHAS project by Mattia Fortunati is MIT-licensed. Its source contains credited Stack Exchange snippets under CC BY-SA 3.0 and 4.0; authors, links and changes are listed in the local notices. The pinned game source has one documented local adaptation: an unverified external linear-interpolation helper was replaced with an equivalent local expression. Generated music and sound use MIT-licensed ZzFX by Frank Force and ZzFXM by Keith Clark. The game keeps its original English interface; Denny Games provides bilingual rules and host controls.",
      ko: "Mattia Fortunati의 PACKABUNCHAS 원본 프로젝트는 MIT 라이선스입니다. 원본 소스에는 CC BY-SA 3.0·4.0을 따르는 Stack Exchange 코드 조각도 포함되어 있으며 작성자, 링크와 변경 사항은 사이트 라이선스 고지에서 확인할 수 있어요. 검증할 수 없는 외부 선형 보간 함수를 같은 결과를 내는 로컬 표현으로 바꾼 내용은 고정 원본 및 변경 소스 해시와 함께 기록했어요. 생성형 음악과 효과음에는 MIT 라이선스인 Frank Force의 ZzFX와 Keith Clark의 ZzFXM이 사용됩니다. 게임 화면은 원작 영어를 유지하며 데니 게임즈가 한국어·영어 규칙과 사이트 조작 안내를 제공합니다.",
    },
    licenseUrl:
      "https://github.com/MattiaFortunati/packabunchas/blob/fc4e6331fa4b8c17cc341094e9027bccd02f463f/LICENSE",
    licenseUrlLabel: {
      en: "Upstream MIT license",
      ko: "원본 MIT 라이선스",
    },
    author: "Mattia Fortunati",
    source:
      "https://github.com/MattiaFortunati/packabunchas/tree/fc4e6331fa4b8c17cc341094e9027bccd02f463f",
    sourceLabel: {
      en: "Pinned source code and notices",
      ko: "버전을 고정한 원본 소스와 고지",
    },
    playModes: ["single-player"],
    guide: {
      path: "guides/packabunchas",
      label: {
        en: "How to play PACKABUNCHAS",
        ko: "PACKABUNCHAS 하는 법",
      },
    },
    added: "2026-10-24",
    imported: true,
    internalScore: true,
    notice: "/licenses/packabunchas/",
    artworkAlt: {
      en: "Original Denny Games artwork of colorful space puzzle blocks around a small rescue ship",
      ko: "작은 구조선을 둘러싼 알록달록한 우주 퍼즐 블록을 그린 데니 게임즈 자체 일러스트",
    },
    artwork: "/art/open-games/packabunchas.svg",
    screenshot: "/art/open-games/packabunchas-preview.png",
    text: {
      en: {
        title: "PACKABUNCHAS",
        subtitle: "Pack the shapes. Rescue the lost crew.",
        description:
          "Fit colorful block shapes into each outlined space and help Spacey rescue the lost Blockychums. Five modes offer different ways to settle into a relaxed, no-rush puzzle. The original game interface is in English; the rules and Denny Games player are available in English and Korean.",
        rules: [
          "Tap or click the title screen, then choose a mode with the left and right arrows and press Start.",
          "Drag the colorful pieces into the outlined space. Double-tap or double-click a piece to rotate it.",
          "There is no countdown. Complete the shape to move through the rescue puzzle; your mode and story progress stay in this browser.",
        ],
        controls: [
          "Touch or mouse: tap the title, choose a mode, then drag a piece into place; double-tap or double-click to rotate. Keyboard and gamepad are not available.",
          "Mouse: click the title, choose a mode, then drag and drop. Double-click a piece to rotate it.",
          "This game does not provide keyboard or gamepad controls. Use the player bar above the board to pause or leave.",
        ],
        tips: [
          "Start with a piece whose edges match a corner or narrow part of the outline.",
          "Try rotating a piece before moving it into a tight space.",
          "Choose a different mode from the in-game menu when you want another puzzle style.",
        ],
      },
      ko: {
        title: "PACKABUNCHAS",
        subtitle: "도형을 채우고, 길 잃은 대원을 구해요.",
        description:
          "알록달록한 블록 도형을 윤곽에 맞춰 스페이시와 길 잃은 블로키첨스를 구해요. 다섯 가지 모드로 서두르지 않고 퍼즐을 즐길 수 있어요. 원작 게임 화면은 영어이며, 데니 게임즈의 규칙과 플레이어 안내는 한국어와 영어로 제공해요.",
        rules: [
          "제목 화면을 누르고 좌우 화살표로 모드를 고른 뒤 Start를 누르세요.",
          "색색의 조각을 윤곽 안으로 끌어 놓으세요. 조각을 빠르게 두 번 누르거나 클릭하면 회전해요.",
          "시간제한은 없어요. 모양을 완성해 구조 퍼즐을 이어가세요. 모드와 이야기 진행은 이 브라우저에 저장돼요.",
        ],
        controls: [
          "터치·마우스로 제목을 눌러 모드를 고른 뒤 조각을 끌어 놓으세요. 두 번 누르면 회전해요. 키보드·게임패드는 지원하지 않아요.",
          "마우스: 제목을 클릭하고 모드를 고른 뒤 조각을 끌어 놓으세요. 조각을 두 번 클릭하면 회전해요.",
          "키보드와 게임패드는 지원하지 않아요. 보드 위 플레이어 막대에서 일시정지하거나 나가세요.",
        ],
        tips: [
          "윤곽의 모서리나 좁은 부분에 맞는 조각부터 찾아보세요.",
          "좁은 공간에 옮기기 전에 조각을 회전해 보세요.",
          "다른 퍼즐 방식이 궁금하면 게임 안 메뉴에서 모드를 바꿔보세요.",
        ],
      },
    },
  },
  {
    id: "gridland",
    category: "puzzle",
    duration: "5–10",
    controlStyle: "pointer",
    color: "mint",
    version: 1,
    stages: 1,
    tags: [
      "gridland",
      "match 3 survival game",
      "day and night puzzle",
      "resource match puzzle",
      "매치 3 생존 게임",
      "정착지 퍼즐",
      "낮과 밤 퍼즐",
      "자원 매치 퍼즐",
      "오픈소스 게임",
    ],
    inputs: ["touch", "mouse"],
    license: "MPL-2.0",
    licenseDescription: {
      en: "Gridland's game code and graphics are published under MPL-2.0 by Michael Townsend. Music, analytics, sharing and donation integrations are omitted; play runs locally on Denny Games.",
      ko: "Michael Townsend가 공개한 Gridland 게임 코드와 그림은 MPL-2.0을 따릅니다. 별도 허가를 확인하지 못한 음악과 분석·공유·기부 연결은 제외하고 데니 게임즈에서 직접 실행합니다.",
    },
    licenseUrl:
      "https://github.com/doublespeakgames/gridland/blob/06af02c3af7062aead04a1e6f67b6e59f3e4b6a1/LICENSE",
    licenseUrlLabel: {
      en: "MPL-2.0 source and license",
      ko: "MPL-2.0 소스와 라이선스",
    },
    author: "Michael Townsend",
    source:
      "https://github.com/doublespeakgames/gridland/tree/06af02c3af7062aead04a1e6f67b6e59f3e4b6a1",
    sourceLabel: {
      en: "Pinned upstream source and notices",
      ko: "버전을 고정한 원본 소스와 고지",
    },
    playModes: ["single-player"],
    added: "2026-10-17",
    imported: true,
    internalScore: true,
    notice: "/licenses/gridland/",
    artworkAlt: {
      en: "Original Denny Games illustration of colorful matching tiles above a settlement under a night sky",
      ko: "밤하늘 아래 정착지 위로 알록달록한 매치 타일을 그린 데니 게임즈 자체 일러스트",
    },
    artwork: "/art/open-games/gridland.svg",
    screenshot: "/art/open-games/gridland-preview.png",
    text: {
      en: {
        title: "Gridland",
        subtitle: "Match by day. Make it through the night.",
        description:
          "Match colorful tiles to gather supplies, build a tiny settlement and survive the dangers that arrive after dark. The original game runs here with local browser saves and no account.",
        rules: [
          "Drag or swipe a tile to swap it with a neighbor and match three or more of the same kind.",
          "Gather resources in daylight and spend them on buildings that help your settlement survive.",
          "Night brings enemies. Keep matching, build up your defenses and continue into the next day.",
        ],
        controls: [
          "Touch: drag a tile toward a neighboring tile. Mouse: click and drag. The game is designed around direct board gestures.",
          "Choose one of the three save slots when you start. Progress is stored in this browser on this device.",
          "Use the pause button above the game to stop the action. Music and sound are omitted in this hosted version.",
        ],
        tips: [
          "Look for a useful match before the sun sets; resources collected by day shape the next night.",
          "Prioritize buildings that support the way you are playing, then keep the board moving.",
          "Nighttime is part of the loop. Keep matching while your defenses handle the threats.",
        ],
      },
      ko: {
        title: "Gridland",
        subtitle: "낮에는 맞추고, 밤에는 버텨요.",
        description:
          "알록달록한 타일을 맞춰 물자를 모으고 작은 정착지를 지어 밤의 위협을 견디세요. 계정 없이 이 사이트에서 바로 실행하며 진행 상황은 이 브라우저에 저장됩니다.",
        rules: [
          "타일을 끌거나 밀어 이웃 타일과 바꾸고 같은 종류 세 개 이상을 맞추세요.",
          "낮에는 자원을 모으고 정착지를 지킬 건물을 지으세요.",
          "밤이 되면 적이 찾아와요. 계속 타일을 맞추고 방어를 준비해 다음 낮까지 살아남으세요.",
        ],
        controls: [
          "터치: 타일을 이웃 타일 쪽으로 끌어 옮기세요. 마우스: 누른 채 드래그하세요. 게임판을 직접 움직이는 방식으로 조작해요.",
          "시작할 때 세 저장 슬롯 중 하나를 고르세요. 진행 상황은 이 기기의 브라우저에 저장됩니다.",
          "게임 위의 일시정지 버튼으로 멈출 수 있어요. 이 호스팅 버전에서는 음악과 효과음을 제외했어요.",
        ],
        tips: [
          "해가 지기 전에 다음에 필요한 매치를 찾아보세요. 낮에 모은 자원이 밤을 준비해요.",
          "내 전략에 도움 되는 건물부터 짓고 타일을 계속 맞춰보세요.",
          "밤도 게임 흐름의 일부예요. 방어 시설이 적을 상대하는 동안 매치를 이어가세요.",
        ],
      },
    },
  },
  {
    id: "sokoban",
    category: "puzzle",
    duration: "5–10",
    controlStyle: "directional",
    color: "violet",
    version: 1,
    stages: 1,
    tags: [
      "sokoban",
      "box pushing",
      "warehouse keeper",
      "push-optimal solver",
      "deadlock detection",
      "open source",
      "창고지기",
      "상자 밀기",
      "논리 퍼즐",
      "되돌리기",
    ],
    inputs: ["touch", "keyboard", "gamepad"],
    license: "MIT",
    licenseDescription: {
      en: "MIT-licensed source and six original levels. Denny Games provides a bilingual, responsive player adapter and keeps the upstream license with the source.",
      ko: "MIT 라이선스 소스와 제작자가 만든 레벨 6개를 사용합니다. 데니 게임즈는 한국어·영어 및 반응형 플레이 어댑터를 제공하고 원본 라이선스와 소스를 함께 공개합니다.",
    },
    licenseUrl:
      "https://github.com/sen-ltd/sokoban/blob/fb38f850151476809b6c65d86789912a9b0c4776/LICENSE",
    licenseUrlLabel: {
      en: "MIT source and license",
      ko: "MIT 소스와 라이선스",
    },
    author: "sen-ltd",
    source:
      "https://github.com/sen-ltd/sokoban/tree/fb38f850151476809b6c65d86789912a9b0c4776",
    sourceLabel: {
      en: "Pinned upstream source",
      ko: "고정된 원본 소스",
    },
    playModes: ["single-player"],
    added: "2026-10-17",
    imported: true,
    internalScore: true,
    notice: "/licenses/sokoban/LICENSE.txt",
    artworkAlt: {
      en: "A blue keeper pushes a glowing amber crate toward a violet goal in a geometric maze",
      ko: "기하학 미로에서 파란 관리인이 빛나는 호박색 상자를 보라색 목표로 미는 장면",
    },
    artwork: "/art/open-games/sokoban.svg",
    screenshot: "/art/open-games/sokoban-preview.png",
    text: {
      en: {
        title: "Sokoban: Box Pushing Puzzles",
        subtitle: "Every push matters.",
        description:
          "Guide a warehouse keeper through six original box-pushing puzzles. Push every crate onto a goal, undo a bad move, reveal provably dead squares or ask the push-optimal solver for help.",
        rules: [
          "Walk around the warehouse and push every crate onto a goal. A crate cannot be pulled.",
          "A crate pushed into a dead square can never reach a goal. Turn on the dead-square view before committing to a risky push.",
          "Undo mistakes, reset a level, or watch the solver animate a solution with the fewest pushes found.",
        ],
        controls: [
          "Touch: tap the direction buttons. Keyboard: arrows or WASD. Standard gamepad: D-pad or left stick moves one tile; physical controllers are not verified.",
          "Undo, reset, solver, level selection and the dead-square view stay on this page. Completed levels are saved in this browser.",
          "No timer or account. The solver is a hint; you can keep playing after it finishes.",
        ],
        tips: [
          "Before pushing a crate, check that you can stand on the side where it needs to go.",
          "A box in a non-goal corner is stuck. Use the dead-square view to spot more traps.",
          "Undo is unlimited. Experiment, then compare the move and push counts.",
        ],
      },
      ko: {
        title: "소코반: 상자 밀기 퍼즐",
        subtitle: "상자를 밀기 전, 다음 수를 생각하세요.",
        description:
          "창고 관리인을 움직여 직접 만든 상자 밀기 퍼즐 6개를 풀어보세요. 상자를 목표 칸에 옮기고, 실수는 되돌리고, 반드시 막히는 칸을 표시하거나 최소 밀기 풀이를 확인할 수 있어요.",
        rules: [
          "창고 안을 걸어 모든 상자를 목표 칸에 밀어 넣으세요. 상자를 당길 수는 없어요.",
          "막힌 칸에 들어간 상자는 목표에 도달할 수 없어요. 위험한 수를 두기 전에 막힌 칸 표시를 켜 보세요.",
          "실수를 되돌리거나, 퍼즐을 초기화하거나, 최소 밀기 풀이를 애니메이션으로 확인하세요.",
        ],
        controls: [
          "터치: 방향 버튼을 누르세요. 키보드: 방향키 또는 WASD. 표준 게임패드: 방향패드나 왼쪽 스틱으로 한 칸씩 이동해요. 실물 컨트롤러 동작은 검증하지 않았어요.",
          "되돌리기·초기화·풀이 보기·레벨 선택·막힌 칸 표시는 이 페이지에서 쓸 수 있어요. 완료한 레벨은 이 브라우저에 저장됩니다.",
          "시간 제한이나 계정은 없어요. 풀이는 힌트이며, 완료된 뒤에도 계속 플레이할 수 있어요.",
        ],
        tips: [
          "상자를 밀기 전에 그 방향으로 밀 수 있는 자리에 설 수 있는지 확인하세요.",
          "목표가 아닌 구석에 들어간 상자는 갇혀요. 막힌 칸 표시로 다른 함정도 찾아보세요.",
          "되돌리기는 횟수 제한이 없어요. 여러 수를 시험한 뒤 이동과 밀기 횟수를 비교해 보세요.",
        ],
      },
    },
  },
];
