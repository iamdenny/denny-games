import type { Game } from "./games";
export const retroDuoGames: Game[] = [
  {
    id: "star-pinball",
    category: "arcade",
    controlStyle: "buttons",
    duration: "1–5",
    color: "mint",
    tags: ["pinball", "flippers", "bumpers", "핀볼", "오락실", "별빛"],
    artworkAlt: {
      en: "Original star pinball table with three bumpers, constellation targets and two flippers",
      ko: "범퍼 세 개와 별자리 표적, 플리퍼 두 개가 있는 자체 제작 별빛 핀볼 테이블",
    },
    text: {
      en: {
        title: "Star Pinball",
        searchTitle: "Star Pinball — Free Three-Ball Browser Pinball",
        subtitle: "Three balls. Two flippers. A sky full of points.",
        description:
          "Launch a silver ball into an original star-themed pinball table. Time the left and right flippers, bounce off bumpers and light the targets to reach 1,500 points before three balls drain. Play with large touch buttons or a keyboard and resume a saved round in this browser.",
        rules: [
          "Launch only when a ball is waiting. Use the two flippers to send a falling ball back toward bumpers and targets.",
          "Bumpers and targets award points. Watch the score and the remaining balls; a ball passing the bottom drain uses one ball.",
          "Play all three balls and finish with at least 1,500 points to win. You can keep scoring after reaching the goal; the result is decided after the third drain. This is a simplified original arcade table.",
        ],
        controls: [
          "Touch or mouse: hold the left or right flipper buttons and press Launch when a ball is ready.",
          "Keyboard: Left/Right or A/D holds each flipper; Space launches a waiting ball. Use the shared Pause button to stop the round.",
          "Pause and reload preserve progress locally. Restart begins a new three-ball round.",
        ],
        tips: [
          "Watch the ball near the flippers and time your return instead of holding both flippers throughout the round.",
          "Try sending the ball toward the upper bumpers and targets to build points.",
          "After a drain, take a breath and launch the next ball when ready.",
        ],
      },
      ko: {
        title: "별빛 핀볼",
        searchTitle: "무료 핀볼 게임 — 별빛 핀볼",
        subtitle: "공 세 개, 플리퍼 두 개, 별을 향한 한 판.",
        description:
          "직접 만든 별빛 테이블에서 은빛 공을 쏘아 올리세요. 좌우 플리퍼로 공을 받아 범퍼와 표적을 맞히고, 공 세 개를 모두 잃기 전에 1,500점에 도전하는 무료 핀볼 웹게임입니다. 큰 터치 버튼과 키보드를 지원하며 이 브라우저에 진행을 저장합니다.",
        rules: [
          "공이 대기 중일 때 발사하세요. 내려오는 공을 두 플리퍼로 받아 범퍼와 표적 쪽으로 돌려보내세요.",
          "범퍼와 표적을 맞히면 점수를 얻습니다. 공이 아래 배수구로 빠질 때마다 남은 공이 하나 줄어요.",
          "공 세 개를 모두 사용한 뒤 총점이 1,500점 이상이면 승리합니다. 목표에 도달한 뒤에도 점수를 더 쌓을 수 있으며 마지막 공이 빠지면 결과를 판정해요. 자체 제작한 간소화 아케이드 규칙입니다.",
        ],
        controls: [
          "터치·마우스: 왼쪽·오른쪽 플리퍼 버튼을 길게 누르고 공이 준비되면 발사 버튼을 누르세요.",
          "키보드: ←/→ 또는 A/D로 플리퍼를 들고 Space로 대기 중인 공을 발사하세요. 공통 일시정지 버튼으로 멈출 수 있어요.",
          "멈추거나 새로고침해도 이 브라우저의 진행을 이어갑니다. 다시 시작하면 공 세 개로 새 판을 시작해요.",
        ],
        tips: [
          "두 플리퍼를 계속 들기보다 공이 내려오는 위치를 보고 타이밍을 맞춰보세요.",
          "공을 위쪽 범퍼와 표적 쪽으로 보내 점수를 쌓으세요.",
          "공이 빠지면 서두르지 말고 다음 공을 준비한 뒤 발사하세요.",
        ],
      },
    },
    version: 1,
    stages: 1,
    added: "2026-10-23",
    author: "Denny Games",
    license: "MIT",
    licenseAppliesToGame: true,
    licenseUrl: "https://github.com/iamdenny/denny-games/blob/main/LICENSE",
    licenseDescription: {
      en: "Original code, rules and graphics by Denny Games.",
      ko: "데니 게임즈가 직접 만든 코드·규칙·그래픽입니다.",
    },
    playModes: ["single-player"],
    inputs: ["touch", "mouse", "keyboard"],
    internalScore: true,
    source:
      "https://github.com/iamdenny/denny-games/tree/main/src/games/star-pinball",
    artwork: "/art/star-pinball.svg",
    screenshot: "/art/screenshots/star-pinball.png",
    guide: {
      path: "guides/star-pinball",
      label: {
        en: "Rules and strategy guide",
        ko: "규칙·공략 안내",
      },
    },
  },
  {
    id: "jewel-drop",
    category: "puzzle",
    controlStyle: "directional",
    duration: "3–10",
    color: "rust",
    tags: [
      "falling gems",
      "match three",
      "chains",
      "보석",
      "낙하 퍼즐",
      "연쇄",
      "매치3",
    ],
    artworkAlt: {
      en: "Original illustration of falling jewel columns and a diagonal match on a dark puzzle board",
      ko: "어두운 퍼즐판에 떨어지는 보석 기둥과 대각선 연결을 표현한 자체 제작 그림",
    },
    text: {
      en: {
        title: "Jewel Drop",
        searchTitle: "Jewel Drop — Free Falling Gems and Chain Puzzle",
        subtitle: "Rotate three gems. Set up the next cascade.",
        description:
          "Guide a falling column of three gems across a six-by-twelve board. Rotate their order and match at least three equal gems horizontally, vertically or diagonally. Gravity creates chain reactions; clear 60 gems before the spawn area fills. Distinct shapes, touch buttons and local saves help you follow every move.",
        rules: [
          "Move the falling three-gem column and rotate its order before it lands. The next column preview helps you plan ahead.",
          "Lines of at least three equal gems clear in horizontal, vertical or either diagonal direction. Remaining gems fall and can create more matches.",
          "Clear 60 gems to win. A blocked spawn ends the round. Falling becomes faster as you progress; shapes distinguish the gem types as well as color.",
        ],
        controls: [
          "Touch or mouse: use Left, Right, Rotate and Drop buttons.",
          "Keyboard: Left/Right moves, Up rotates, Down lowers the column and Space drops it immediately.",
          "Pause stops falling. Reload or change language and explicitly resume the saved round; Restart clears the board.",
        ],
        tips: [
          "Look for diagonal opportunities as well as vertical stacks.",
          "Use the next preview to leave a useful gap for the following column.",
          "A match under another group can trigger a chain after gravity settles it. Keep the spawn area open.",
        ],
      },
      ko: {
        title: "보석 낙하",
        searchTitle: "보석 낙하 퍼즐 — 무료 연쇄 매치3 게임",
        subtitle: "세 보석의 순서를 바꿔 다음 연쇄를 준비해요.",
        description:
          "가로 6칸, 세로 12칸의 판에 떨어지는 보석 세 개를 움직이고 순서를 돌리세요. 같은 보석을 가로·세로·대각선으로 세 개 이상 맞추면 사라지고, 내려온 보석이 다시 맞으면 연쇄가 이어집니다. 생성 위치가 막히기 전에 60개를 지우는 무료 낙하 퍼즐입니다. 모양으로도 보석을 구분하며 이 브라우저에 진행을 저장합니다.",
        rules: [
          "떨어지는 세 보석의 기둥을 옮기고 착지 전에 순서를 돌리세요. 다음 보석 미리보기로 한 수 앞을 계획할 수 있어요.",
          "같은 보석을 가로·세로·양쪽 대각선으로 세 개 이상 이어 지웁니다. 남은 보석이 내려오면서 다시 맞으면 연쇄가 생겨요.",
          "보석 60개를 지우면 승리합니다. 생성 위치가 막히면 한 판이 끝나요. 진행에 따라 낙하가 빨라지며, 색과 모양으로 보석 종류를 구분합니다.",
        ],
        controls: [
          "터치·마우스: 왼쪽·오른쪽·회전·낙하 버튼을 사용하세요.",
          "키보드: ←/→ 이동, ↑ 순서 회전, ↓ 한 칸 내리기, Space 즉시 떨어뜨리기입니다.",
          "일시정지하면 낙하가 멈춥니다. 새로고침·언어 변경 후 시작 버튼을 눌러 저장된 판을 이어가고, 다시 시작하면 판을 비웁니다.",
        ],
        tips: [
          "세로로 쌓는 방법뿐 아니라 대각선으로 이어질 자리도 살펴보세요.",
          "다음 보석을 보고 다음 기둥을 놓을 공간을 남겨두세요.",
          "아래쪽 보석을 지우면 위 보석이 내려오며 연쇄가 생길 수 있어요. 생성 위치를 비워 두세요.",
        ],
      },
    },
    version: 1,
    stages: 1,
    added: "2026-10-23",
    author: "Denny Games",
    license: "MIT",
    licenseAppliesToGame: true,
    licenseUrl: "https://github.com/iamdenny/denny-games/blob/main/LICENSE",
    licenseDescription: {
      en: "Original code, rules and graphics by Denny Games.",
      ko: "데니 게임즈가 직접 만든 코드·규칙·그래픽입니다.",
    },
    playModes: ["single-player"],
    inputs: ["touch", "mouse", "keyboard"],
    internalScore: true,
    source:
      "https://github.com/iamdenny/denny-games/tree/main/src/games/jewel-drop",
    artwork: "/art/jewel-drop.svg",
    screenshot: "/art/screenshots/jewel-drop.png",
    guide: {
      path: "guides/jewel-drop",
      label: {
        en: "Rules and strategy guide",
        ko: "규칙·공략 안내",
      },
    },
  },
];
