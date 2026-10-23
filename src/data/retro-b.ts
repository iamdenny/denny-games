import type { Game } from "./games";
const original = {
  version: 1,
  license: "MIT",
  licenseDescription: {
    en: "Original TypeScript rules, synthesized interface sounds and vector artwork by Denny Games.",
    ko: "데니 게임즈가 직접 만든 TypeScript 규칙·화면 효과음·벡터 그림입니다.",
  },
  licenseUrl: "https://github.com/iamdenny/denny-games/blob/main/LICENSE",
  licenseAppliesToGame: true,
  author: "Denny Games",
  added: "2026-10-23",
  classic: true,
  inputs: ["touch", "mouse", "keyboard"] as Game["inputs"],
  playModes: ["single-player"] as Game["playModes"],
};
export const retroBGames: Game[] = [
  {
    ...original,
    id: "prism-pop",
    category: "arcade",
    controlStyle: "directional",
    color: "mint",
    duration: "2–4",
    stages: 8,
    artwork: "/art/prism-pop.svg",
    screenshot: "/art/screenshots/prism-pop.png",
    source:
      "https://github.com/iamdenny/denny-games/tree/main/src/games/prism-pop",
    tags: ["harpoon", "bouncing balls", "arcade", "작살", "구슬", "아케이드"],
    text: {
      en: {
        title: "Prism Pop",
        searchTitle: "Prism Pop — Free Harpoon and Bouncing Sphere Game",
        subtitle: "One harpoon. A cascade of color.",
        description:
          "Clear eight original arenas by splitting bouncing spheres with vertical harpoons. Large spheres divide into two smaller ones, while pillars redirect their paths. Move beneath a safe opening, fire and protect your three lives.",
        rules: [
          "A harpoon splits a large or medium sphere into two. Small spheres disappear when hit.",
          "Clear every sphere before the timer expires. Touching a sphere costs one of three lives and grants brief protection.",
          "Stone pillars redirect spheres. Your runner moves along the foreground below them; harpoons reach upward through the arena.",
          "Progress and the current arena save locally in this browser.",
        ],
        controls: [
          "Move with Left/Right or A/D; hold Space or J to fire. Touch users can hold the arrow and Harpoon buttons.",
          "Pause and restart use the player toolbar. Gamepad and physical-device compatibility are not verified.",
        ],
        tips: [
          "Fire just after a sphere passes over you instead of chasing it.",
          "Small spheres bounce lower. Clear them before splitting another large sphere.",
        ],
      },
      ko: {
        title: "프리즘 팝",
        searchTitle: "프리즘 팝 — 무료 작살 구슬 터뜨리기 게임",
        subtitle: "작살 하나로 펼치는 색색의 연쇄 파열",
        description:
          "독창적인 경기장 8개에서 통통 튀는 구슬을 수직 작살로 쪼개세요. 큰 구슬은 두 개로 나뉘고 기둥에 닿으면 방향을 바꿉니다. 안전한 틈으로 이동하며 세 번의 기회를 지켜 보세요.",
        rules: [
          "큰 구슬과 중간 구슬은 맞으면 두 개로 갈라지고 가장 작은 구슬은 사라집니다.",
          "제한 시간 안에 모든 구슬을 없애세요. 구슬에 닿으면 목숨 하나를 잃고 잠깐 보호받습니다.",
          "기둥은 구슬의 방향을 바꿉니다. 캐릭터는 기둥 앞쪽 바닥을 따라 움직이고 작살은 위로 뻗습니다.",
          "진행 상황과 현재 경기장은 이 브라우저에 저장됩니다.",
        ],
        controls: [
          "←/→ 또는 A/D로 이동하고 Space 또는 J를 누르고 있으면 발사합니다. 터치에서는 방향·작살 버튼을 누르세요.",
          "플레이어 도구 모음에서 일시정지·다시 시작할 수 있습니다. 실물 기기와 게임패드는 검증하지 않았습니다.",
        ],
        tips: [
          "구슬을 쫓기보다 머리 위를 지나간 직후 작살을 쏘세요.",
          "작은 구슬은 낮게 튑니다. 큰 구슬을 더 쪼개기 전에 작은 것부터 정리하세요.",
        ],
      },
    },
  },
  {
    ...original,
    id: "bubble-harbor",
    category: "puzzle",
    controlStyle: "pointer",
    color: "lavender",
    duration: "3–6",
    stages: 12,
    artwork: "/art/bubble-harbor.svg",
    screenshot: "/art/screenshots/bubble-harbor.png",
    source:
      "https://github.com/iamdenny/denny-games/tree/main/src/games/bubble-harbor",
    tags: [
      "bubble shooter",
      "color match",
      "wall bounce",
      "버블",
      "구슬 퍼즐",
      "색 맞추기",
    ],
    text: {
      en: {
        title: "Bubble Harbor",
        searchTitle: "Bubble Harbor — Free Bubble Shooter with 12 Boards",
        subtitle: "Bank a shot. Clear the harbor.",
        description:
          "Aim colorful bubbles into twelve original opening layouts. Match at least three of the same color, bounce shots off the walls and drop clusters that lose their connection to the ceiling. Symbols distinguish the four colors.",
        rules: [
          "Shoot a bubble into the hexagonal grid. A connected group of three or more matching colors disappears.",
          "Bubbles no longer connected to the ceiling fall away for bonus points. Clear the whole board to win.",
          "Every five shots that fail to make a match lower the board. Reaching the marked line ends the round.",
          "Swap the current and next bubble before shooting. Current board and flight save in this browser.",
        ],
        controls: [
          "Point or tap above the launcher to aim and shoot; use the Shoot button to fire at the current angle.",
          "Left/Right or A/D adjust aim, Space or Enter fires, and X or Down swaps bubbles.",
        ],
        tips: [
          "Use the dotted guide to plan a reflected shot off a wall.",
          "Remove a narrow ceiling connection to drop several colors at once.",
        ],
      },
      ko: {
        title: "버블 하버",
        searchTitle: "버블 하버 — 12개 보드의 무료 버블 슈터",
        subtitle: "벽을 맞혀 항구를 비우세요",
        description:
          "직접 구성한 12개 보드에서 색 구슬을 조준하세요. 같은 색을 세 개 이상 연결하고 벽 반사로 틈을 노리세요. 천장과 연결이 끊긴 구슬은 한꺼번에 떨어집니다. 네 가지 색에 서로 다른 기호도 표시합니다.",
        rules: [
          "육각 격자에 구슬을 붙여 같은 색 세 개 이상을 연결하면 사라집니다.",
          "천장과 연결이 끊어진 구슬은 떨어져 보너스 점수가 됩니다. 전부 없애면 성공입니다.",
          "매치하지 못한 발사가 다섯 번 쌓이면 보드가 내려옵니다. 표시된 선에 닿으면 종료됩니다.",
          "쏘기 전에 현재 구슬과 다음 구슬을 바꿀 수 있습니다. 보드와 날아가는 구슬도 브라우저에 저장됩니다.",
        ],
        controls: [
          "발사대 위를 마우스나 터치로 지정하면 조준·발사합니다. 발사 버튼으로 현재 각도에 쏠 수도 있습니다.",
          "←/→ 또는 A/D로 조준, Space·Enter로 발사, X·↓로 교환합니다.",
        ],
        tips: [
          "점선 조준선을 보고 벽 반사 경로를 확인하세요.",
          "천장으로 이어지는 좁은 연결 부분을 지우면 여러 색을 한꺼번에 떨어뜨릴 수 있어요.",
        ],
      },
    },
  },
  {
    ...original,
    id: "starfall-wing",
    category: "shooting",
    controlStyle: "directional",
    color: "blue",
    duration: "2–5",
    stages: 6,
    artwork: "/art/starfall-wing.svg",
    screenshot: "/art/screenshots/starfall-wing.png",
    source:
      "https://github.com/iamdenny/denny-games/tree/main/src/games/starfall-wing",
    tags: ["vertical shooter", "space", "boss", "슈팅", "우주", "보스"],
    text: {
      en: {
        title: "Starfall Wing",
        searchTitle: "Starfall Wing — Free Space Shooter with Six Boss Stages",
        subtitle: "Thread the stars. Break the guardian.",
        description:
          "Pilot an original starfighter through six sectors of enemy formations and guardian battles. Collect weapon upgrades, dodge readable bullet patterns and spend two Nova charges to clear danger. Each stage starts with a fresh ship.",
        rules: [
          "Your ship fires automatically. Defeat formations, then destroy the sector guardian to complete the stage.",
          "Collect P capsules for up to three parallel shots. Losing a life reduces weapon power and grants temporary protection.",
          "Two Nova charges per stage clear enemy bullets and damage nearby forces and the guardian.",
          "Three lost lives end the run. Your current stage state saves locally in this browser.",
        ],
        controls: [
          "Move with arrows or WASD, or drag on the game area. Touch direction buttons are also available.",
          "X or Left Shift activates Nova; Space toggles automatic fire. Use the toolbar to pause.",
        ],
        tips: [
          "Your hit area is smaller than the wings. Focus on the ship center when threading bullets.",
          "Save a Nova for an overlapping boss pattern instead of spending both early.",
        ],
      },
      ko: {
        title: "스타폴 윙",
        searchTitle: "스타폴 윙 — 보스 스테이지 6개의 무료 우주 슈팅",
        subtitle: "별 사이를 뚫고 수호선을 격파하세요",
        description:
          "독창적인 전투기로 여섯 구역의 적 편대와 수호선에 맞서세요. 무기 업그레이드를 모으고 탄막의 틈을 피하며 두 번의 노바로 위기를 넘기세요. 각 스테이지는 새 기체로 시작합니다.",
        rules: [
          "기체는 자동으로 발사합니다. 적 편대가 지나간 뒤 등장하는 수호선을 파괴하면 성공입니다.",
          "P 캡슐을 모으면 최대 세 줄로 발사합니다. 목숨을 잃으면 무기가 한 단계 내려가고 잠깐 보호받습니다.",
          "스테이지마다 노바 두 번을 쓸 수 있습니다. 적 탄을 지우고 적과 수호선에 피해를 줍니다.",
          "목숨 세 개를 모두 잃으면 종료됩니다. 현재 스테이지 상태는 브라우저에 저장됩니다.",
        ],
        controls: [
          "방향키·WASD 또는 게임 화면 드래그로 이동하세요. 터치 방향 버튼도 있습니다.",
          "X 또는 왼쪽 Shift로 노바를 사용하고 Space로 자동발사를 전환합니다. 도구 모음에서 일시정지하세요.",
        ],
        tips: [
          "실제 피격 범위는 날개보다 작습니다. 탄 사이를 지날 때 기체 중심을 보세요.",
          "보스 탄막이 겹칠 때를 위해 노바 하나를 남겨 두세요.",
        ],
      },
    },
  },
  {
    ...original,
    id: "vault-runner",
    category: "puzzle",
    controlStyle: "directional",
    color: "amber",
    duration: "2–4",
    stages: 12,
    artwork: "/art/vault-runner.svg",
    screenshot: "/art/screenshots/vault-runner.png",
    source:
      "https://github.com/iamdenny/denny-games/tree/main/src/games/vault-runner",
    tags: [
      "ladder",
      "treasure",
      "chase",
      "dig",
      "사다리",
      "보물",
      "추격",
      "땅파기",
    ],
    text: {
      en: {
        title: "Vault Runner",
        searchTitle: "Vault Runner — Free Ladder and Treasure Puzzle, 12 Maps",
        subtitle: "Take the treasure. Leave a trap.",
        description:
          "Explore twelve original vaults connected by ladders. Gather every gem, dig temporary holes to trap pursuing guards and reach the top-right exit. Plan a route across the platforms before the three-minute clock runs out.",
        rules: [
          "Collect every gem to unlock the exit at the upper right. Reach it before time runs out.",
          "Ladders connect floors, and unsupported characters fall. Guards follow routes toward you.",
          "Dig a brick diagonally below you to create a temporary hole. Trapped guards disappear when the hole closes; a player still inside loses.",
          "Climb up to escape a hole. Catching a guard is optional; treasure and the exit are the objective.",
        ],
        controls: [
          "Move and climb with arrows or WASD. Touch users have four direction buttons.",
          "Z digs below-left; X or Space digs below-right. Progress, holes and guard positions save in this browser.",
        ],
        tips: [
          "Climb a different ladder to lead a guard away from the treasure route.",
          "Dig before a guard reaches you. A hole closes after 4.5 seconds.",
        ],
      },
      ko: {
        title: "볼트 러너",
        searchTitle: "볼트 러너 — 사다리·보물 퍼즐 무료 게임 12개 맵",
        subtitle: "보물을 챙기고 함정을 남기세요",
        description:
          "사다리로 이어진 독창적인 금고 12개를 탐험하세요. 보석을 모두 모으고 임시 구멍으로 추격하는 경비를 가둔 뒤 오른쪽 위 출구로 탈출하세요. 3분 안에 발판을 잇는 경로를 찾아야 합니다.",
        rules: [
          "보석을 모두 모으면 오른쪽 위 출구가 열립니다. 제한 시간 안에 도착하세요.",
          "사다리로 층을 이동하고 발판이 없으면 떨어집니다. 경비는 이동 경로를 따라 쫓아옵니다.",
          "대각선 아래 벽돌을 파면 임시 구멍이 생깁니다. 구멍이 닫힐 때 갇힌 경비는 사라지고 플레이어가 안에 있으면 실패합니다.",
          "구멍 안에서는 위로 올라와 탈출할 수 있습니다. 경비를 모두 잡을 필요는 없습니다.",
        ],
        controls: [
          "방향키·WASD 또는 터치 방향 버튼으로 이동하고 사다리를 오르세요.",
          "Z로 왼쪽 아래, X·Space로 오른쪽 아래를 팝니다. 진행·구멍·경비 위치는 이 브라우저에 저장됩니다.",
        ],
        tips: [
          "다른 사다리를 올라 경비를 보물 경로 반대편으로 유도하세요.",
          "경비가 닿기 전에 구멍을 파세요. 구멍은 4.5초 뒤 닫힙니다.",
        ],
      },
    },
  },
];
