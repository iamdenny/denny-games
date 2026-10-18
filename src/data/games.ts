import type { Locale } from "../lib/types";
import crisp from "./crisp.json" with { type: "json" };
import { crispCycleGames } from "./crisp-cycles";
import { boardGames } from "./board-games";
import { openSourceGames } from "./open-source-games";
import { editorialOrder } from "./editorial";
import { eraExternalGames } from "./external-browser-additions";
import { worldOpenGames } from "./world-open-games";
import type { ControlStyle } from "./play-styles";
export type Category =
  | "board"
  | "puzzle"
  | "arcade"
  | "action"
  | "shooting"
  | "racing"
  | "sports"
  | "strategy"
  | "roguelike"
  | "simulation";
export const categories: readonly Category[] = [
  "board",
  "puzzle",
  "arcade",
  "action",
  "shooting",
  "racing",
  "sports",
];
export interface GameCopy {
  title: string;
  searchTitle?: string;
  subtitle: string;
  description: string;
  rules: string[];
  controls: string[];
  tips: string[];
}
export interface Game {
  id: string;
  category: Category;
  screenshot?: string;
  artworkAlt?: Record<Locale, string>;
  imported?: boolean;
  internalScore?: boolean;
  classic?: boolean;
  notice?: string;
  duration: string;
  controlStyle: ControlStyle;
  color: string;
  version: number;
  stages: number;
  tags: string[];
  inputs: ("touch" | "mouse" | "keyboard" | "gamepad")[];
  license: string;
  licenseDescription?: Record<Locale, string>;
  licenseUrl?: string;
  licenseUrlLabel?: Record<Locale, string>;
  licenseAppliesToGame?: boolean;
  author: string;
  source: string;
  sourceLabel?: Record<Locale, string>;
  playModes?: ("single-player" | "multi-player")[];
  externalPlay?: {
    url: string;
    host: Record<Locale, string>;
    note: Record<Locale, string>;
    privacyNote?: Record<Locale, string>;
    privacyUrl?: string;
  };
  added: string;
  artwork: string;
  text: Record<Locale, GameCopy>;
}
const gameCandidates: Game[] = [
  {
    id: "circuit-loop",
    controlStyle: "pointer",
    category: "puzzle",
    duration: "3–5",
    color: "mint",
    version: 1,
    stages: 30,
    tags: ["logic", "circuit", "회로", "논리", "daily"],
    inputs: ["touch", "keyboard", "gamepad"],
    license: "MIT",
    author: "Denny Games",
    source:
      "https://github.com/iamdenny/denny-games/tree/main/src/games/circuit",
    added: "2026-10-11",
    screenshot: "/art/screenshots/circuit-loop.png",
    artwork: "/art/circuit-loop.svg",
    text: {
      en: {
        title: "Circuit Loop",
        subtitle: "Connect. Rotate. Find your flow.",
        description:
          "Turn scattered circuit tiles into one connected network. A quiet logic puzzle with no countdown, thirty solvable boards and a daily challenge.",
        rules: [
          "Rotate a tile clockwise to join its connectors to a neighbour.",
          "Connect every tile to the marked power source. All outward connectors must meet a neighbour.",
          "Finish in as few turns as you can. There is no time limit. A hint corrects one tile and marks your result.",
        ],
        controls: [
          "Touch: tap a tile to rotate it.",
          "Keyboard: arrow keys select; Enter or Space rotates.",
          "Standard gamepad: D-pad selects, primary button rotates; Start pauses. Physical controllers await testing.",
        ],
        tips: [
          "Begin at a corner: its connectors can only face inward.",
          "Follow the connected cyan circuit outward from the power source.",
          "Straight pieces repeat after two turns; do not rotate them unnecessarily.",
        ],
      },
      ko: {
        title: "서킷 루프",
        subtitle: "연결하고, 돌리고, 흐름을 찾아요.",
        description:
          "흩어진 회로 타일을 돌려 하나의 연결망을 완성하세요. 시간제한 없이 생각하는 퍼즐, 해답이 있는 30개 보드와 매일 새로운 도전을 만나요.",
        rules: [
          "타일을 시계 방향으로 돌려 이웃의 연결선과 맞추세요.",
          "모든 타일을 표시된 전원에 연결하세요. 연결선은 보드 밖으로 나가거나 끊기면 안 됩니다.",
          "적은 회전으로 완성할수록 좋아요. 시간제한은 없어요. 힌트는 타일 하나를 맞추고 결과에 사용 여부를 남깁니다.",
        ],
        controls: [
          "터치: 타일을 누르면 회전합니다.",
          "키보드: 방향키로 선택하고 Enter 또는 Space로 회전합니다.",
          "표준 게임패드: 방향패드로 선택, 기본 버튼으로 회전, Start로 정지합니다. 실제 패드는 검증 전입니다.",
        ],
        tips: [
          "모서리 타일부터 보세요. 연결선이 안쪽을 향해야 합니다.",
          "전원에서 시작한 청록색 연결을 따라 바깥으로 확장하세요.",
          "직선 타일은 두 번 돌리면 원래 모양으로 돌아옵니다.",
        ],
      },
    },
  },
  {
    id: "orbit-break",
    controlStyle: "pointer",
    category: "arcade",
    duration: "2–3",
    color: "rust",
    version: 1,
    stages: 12,
    tags: ["brick breaker", "벽돌깨기", "action", "반사신경", "daily"],
    inputs: ["touch", "keyboard", "gamepad"],
    license: "MIT",
    author: "Denny Games",
    source: "https://github.com/iamdenny/denny-games/tree/main/src/games/orbit",
    added: "2026-10-11",
    screenshot: "/art/screenshots/orbit-break.png",
    artwork: "/art/orbit-break.svg",
    text: {
      en: {
        title: "Orbit Break",
        subtitle: "One paddle. A little momentum.",
        description:
          "Find your rhythm in a compact brick breaker. Aim the rebound, clear a colourful orbit and try twelve distinct stage layouts.",
        rules: [
          "Move the paddle to keep the ball in play. Press launch to begin.",
          "The contact point changes the rebound angle. Break every brick to finish the stage.",
          "You have three lives. A missed ball costs one life; launch again when ready.",
        ],
        controls: [
          "Touch: drag in the lower control strip; tap the board or Launch to serve.",
          "Keyboard: Left/Right moves, Enter/Space launches.",
          "Standard gamepad: D-pad or left stick moves, primary button launches, Start pauses.",
        ],
        tips: [
          "Use the paddle edges to reach bricks near the walls.",
          "Keep your finger in the lower strip so the ball stays visible.",
          "Pause whenever you need. Returning from another tab never advances the ball.",
        ],
      },
      ko: {
        title: "오빗 브레이크",
        subtitle: "패들 하나, 기분 좋은 리듬.",
        description:
          "반사각을 조절하며 알록달록한 벽돌을 지우세요. 작고 선명한 벽돌깨기에서 12가지 스테이지와 매일 다른 배치에 도전하세요.",
        rules: [
          "패들을 움직여 공을 받아내세요. 발사 버튼으로 시작합니다.",
          "공을 받는 위치에 따라 반사각이 달라져요. 모든 벽돌을 지우면 스테이지가 끝납니다.",
          "기회는 세 번입니다. 공을 놓치면 한 번 줄어들며 준비되면 다시 발사하세요.",
        ],
        controls: [
          "터치: 아래 조작 띠에서 드래그하고 보드 또는 발사 버튼으로 시작합니다.",
          "키보드: 좌우 방향키로 이동, Enter/Space로 발사합니다.",
          "표준 게임패드: 방향패드·왼쪽 스틱으로 이동, 기본 버튼으로 발사, Start로 정지합니다.",
        ],
        tips: [
          "패들 가장자리로 받아 벽 근처 벽돌을 노려보세요.",
          "손가락은 아래 조작 띠에 두면 공을 가리지 않아요.",
          "언제든 멈추세요. 다른 탭에서 돌아와도 공이 갑자기 움직이지 않습니다.",
        ],
      },
    },
  },
  {
    id: "2048",
    controlStyle: "directional",
    category: "puzzle",
    duration: "3–5",
    color: "yellow",
    version: 1,
    stages: 1,
    tags: ["numbers", "숫자", "merge", "합치기", "2048", "daily"],
    inputs: ["touch", "keyboard", "gamepad"],
    license: "MIT · adapted from Gabriele Cirulli",
    author: "Gabriele Cirulli / Denny Games adaptation",
    source: "https://github.com/gabrielecirulli/2048",
    added: "2026-10-11",
    screenshot: "/art/screenshots/2048.png",
    artwork: "/art/2048.svg",
    text: {
      en: {
        title: "2048",
        searchTitle: "Play 2048 Online · Rules and Merge Examples",
        subtitle: "Small moves. Bigger numbers.",
        description:
          "Play free 2048 on a 4×4 board without an account or installation. Swipe or use arrow keys, learn with merge examples, and continue your saved round in this browser. Adapted from Gabriele Cirulli’s MIT game.",
        rules: [
          "Slide the board in one direction. Equal adjacent numbers merge once per move.",
          "A valid move adds a new 2 or 4 tile. A move that changes nothing adds no tile.",
          "Reach 2048 to win. The round ends if the board fills with no legal merge.",
        ],
        controls: [
          "Touch: swipe on the board. Direction buttons are available in Settings.",
          "Keyboard: use the arrow keys.",
          "Standard gamepad: D-pad or left stick slides the board. Start pauses.",
        ],
        tips: [
          "Try to keep your largest tile in a corner.",
          "Build a descending row beside that corner.",
          "Leave space for new tiles; a crowded board limits your options.",
        ],
      },
      ko: {
        title: "2048",
        searchTitle: "2048 무료 게임 · 하는 법과 숫자 합치기 예시",
        subtitle: "작은 이동이 큰 숫자로.",
        description:
          "가입·설치 없이 4×4 보드에서 즐기는 무료 2048 게임입니다. 스와이프·방향키로 숫자를 합치고, 예시로 규칙을 익히고, 같은 브라우저에서 이어 하세요. Gabriele Cirulli의 MIT 게임을 바탕으로 만들었습니다.",
        rules: [
          "한 방향으로 밀면 같은 숫자가 합쳐집니다. 한 타일은 한 번의 이동에서 한 번만 합쳐져요.",
          "보드가 바뀐 이동 뒤에는 2 또는 4가 생깁니다. 아무 변화가 없으면 새 타일도 생기지 않아요.",
          "2048을 만들면 성공입니다. 빈칸도 합칠 수 있는 숫자도 없으면 라운드가 끝납니다.",
        ],
        controls: [
          "터치: 보드에서 스와이프하세요. 방향 버튼은 설정에서 사용할 수 있습니다.",
          "키보드: 방향키로 이동합니다.",
          "표준 게임패드: 방향패드·왼쪽 스틱으로 이동, Start로 정지합니다.",
        ],
        tips: [
          "가장 큰 숫자를 한 모서리에 모아보세요.",
          "그 옆에 큰 숫자부터 차례대로 줄을 만드세요.",
          "새 숫자가 들어올 빈칸을 확보하면 선택지가 넓어집니다.",
        ],
      },
    },
  },
];
gameCandidates.push({
  id: "hextris",
  category: "arcade",
  controlStyle: "directional",
  duration: "2–5",
  color: "mint",
  version: 1,
  stages: 1,
  tags: [
    "hextris",
    "hexagonal puzzle",
    "falling blocks",
    "육각형 퍼즐",
    "블록 퍼즐",
    "오픈소스",
  ],
  inputs: ["touch", "keyboard", "gamepad"],
  license: "GPL-3.0-or-later",
  author: "Logan Engstrom, Garrett Finucane, Noah Moroze and Michael Yang",
  source:
    "https://github.com/Hextris/hextris/tree/3f4847dc8fd7dab3d1c87e6324b9159d92fbd396",
  added: "2026-10-14",
  imported: true,
  internalScore: true,
  notice: "/licenses/hextris/",
  artworkAlt: {
    en: "Colorful falling blocks arranged around a central hexagon",
    ko: "중앙 육각형을 둘러싼 알록달록한 블록",
  },
  artwork: "/art/hextris.svg",
  screenshot: "/art/screenshots/hextris.png",
  text: {
    en: {
      title: "Hextris",
      subtitle: "Match blocks. Turn the whole board.",
      description:
        "A quick arcade puzzle where falling blocks wrap around a six-sided center. Match three or more colors, rotate the hexagon and keep the outer ring clear. The original touch controls work alongside large, labeled Denny Games buttons.",
      rules: [
        "Blocks fall toward the central hexagon. Rotate the board to choose where each block lands.",
        "Make three or more blocks of the same color touch to clear them and earn points.",
        "Keep every side of the outer ring below its limit. The round ends when blocks spill beyond it.",
      ],
      controls: [
        "Touch: tap either side of the board or use the large Rotate buttons below it.",
        "Keyboard: Left/Right rotates the hexagon; Down speeds up the falling block. P pauses.",
        "Standard gamepad: D-pad or left stick rotates; Start pauses. Physical devices are unverified.",
      ],
      tips: [
        "Rotate before the block reaches the center to line up a color match.",
        "Clear a group of three or more to open space and build a combo.",
        "Watch all six sides. The busiest side is the first one likely to overflow.",
      ],
    },
    ko: {
      title: "Hextris",
      subtitle: "블록을 맞추고 육각형 판을 돌려요.",
      description:
        "중앙 육각형을 향해 떨어지는 블록을 돌려 맞추는 빠른 아케이드 퍼즐입니다. 같은 색 세 개 이상을 맞춰 지우고, 바깥쪽 선을 넘지 않도록 판을 돌려보세요. 원작 터치 조작과 함께 크고 누르기 쉬운 회전 버튼도 제공합니다.",
      rules: [
        "블록은 중앙 육각형을 향해 떨어집니다. 판을 돌려 블록이 놓일 방향을 고르세요.",
        "같은 색 블록 세 개 이상을 맞닿게 하면 사라지고 점수를 얻습니다.",
        "여섯 바깥 면의 블록을 한계 안에 두세요. 바깥 선을 넘으면 라운드가 끝납니다.",
      ],
      controls: [
        "터치: 게임판 양쪽을 누르거나 아래의 큰 회전 버튼을 사용하세요.",
        "키보드: 좌우 방향키로 회전하고 아래 방향키로 블록을 빠르게 내립니다. P로 멈춥니다.",
        "표준 게임패드: 방향패드·왼쪽 스틱으로 회전하고 Start로 멈춥니다. 실제 기기는 미검증입니다.",
      ],
      tips: [
        "블록이 중앙에 닿기 전에 돌려 같은 색을 맞춰보세요.",
        "세 개 이상을 지워 공간을 만들고 연속 조합을 노려보세요.",
        "여섯 면을 모두 살펴보세요. 가장 많이 쌓인 쪽부터 넘치기 쉽습니다.",
      ],
    },
  },
});
gameCandidates.push({
  id: "bounce-back",
  category: "action",
  controlStyle: "pointer",
  duration: "5–10",
  color: "rust",
  version: 1,
  stages: 1,
  tags: [
    "Bounce Back",
    "boomerang",
    "roguelite",
    "procedural dungeon",
    "부메랑",
    "로그라이트",
    "로그라이크",
    "절차 생성",
    "오픈소스",
  ],
  inputs: ["touch", "keyboard", "gamepad"],
  license: "GPL-2.0-or-later",
  author: "Frank Force",
  source:
    "https://github.com/KilledByAPixel/BounceBack/tree/395fd046338e6c5d5840d10e7fbd74132f90b8f6",
  added: "2026-10-14",
  imported: true,
  internalScore: true,
  notice: "/licenses/bounceback/",
  artworkAlt: {
    en: "Bounce Back original title screen",
    ko: "Bounce Back 원본 타이틀 화면",
  },
  artwork: "/art/bounce-back-title.png",
  text: {
    en: {
      title: "Bounce Back",
      subtitle: "Aim. Throw. Dodge. Dive deeper.",
      description:
        "Throw a returning boomerang through procedurally generated rooms, dodge enemies, collect gems and buy upgrades in a compact action roguelite.",
      rules: [
        "Explore each room, defeat enemies and find the exit to descend.",
        "Collect gems and buy upgrades between stages. Your saved gems stay with you after a run ends.",
        "Clear the final boss to unlock speed-run mode.",
      ],
      controls: [
        "Touch: drag on the left half to move; hold and drag on the right half to aim and throw.",
        "Keyboard and mouse: WASD moves, mouse aims, click throws and Space dashes.",
        "Standard gamepad: left stick or D-pad moves; the stick aims, A throws and Start pauses. Physical devices are unverified.",
      ],
      tips: [
        "A dash protects you from damage for a moment.",
        "The returning boomerang can hit enemies on its way out and back.",
        "Try the shop between rooms; gems are kept after a run ends.",
      ],
    },
    ko: {
      title: "Bounce Back",
      subtitle: "조준하고, 던지고, 피하며 더 깊이.",
      description:
        "부메랑을 던져 절차 생성 방을 탐험하세요. 적을 피하고 보석을 모아 강화하는 짧은 액션 로그라이트입니다.",
      rules: [
        "방을 탐험하고 적을 물리친 뒤 출구를 찾아 다음 단계로 내려가세요.",
        "보석을 모아 단계 사이 상점에서 강화하세요. 한 번의 도전이 끝나도 모은 보석은 남습니다.",
        "마지막 보스를 물리치면 스피드런 모드가 열립니다.",
      ],
      controls: [
        "터치: 왼쪽 화면을 끌어 이동하고, 오른쪽을 누른 채 끌어 조준·던지세요.",
        "키보드·마우스: WASD 이동, 마우스 조준, 클릭 던지기, Space 대시.",
        "표준 게임패드: 왼쪽 스틱·방향패드 이동, 스틱 조준, A 던지기, Start 정지. 실제 기기는 미검증입니다.",
      ],
      tips: [
        "대시는 잠시 피해를 막아줍니다.",
        "부메랑은 나갈 때와 돌아올 때 모두 적을 공격할 수 있어요.",
        "방 사이 상점을 이용하세요. 한 번의 도전이 끝나도 보석은 남습니다.",
      ],
    },
  },
});
gameCandidates.push({
  id: "underrun",
  category: "shooting",
  controlStyle: "pointer",
  duration: "5–10",
  color: "mint",
  version: 1,
  stages: 1,
  tags: [
    "UNDERRUN",
    "WebGL",
    "3D shooter",
    "twin-stick shooter",
    "사이버펑크 슈팅",
    "3D 슈팅",
    "WebGL 게임",
    "오픈소스",
  ],
  inputs: ["touch", "keyboard", "gamepad"],
  license: "MIT + Sonant-X zlib",
  author: "Dominic Szablewski",
  source:
    "https://github.com/phoboslab/underrun/tree/f933e29152d7fc1ca61d4b3eaa8b29551d7d7a62",
  added: "2026-10-14",
  imported: true,
  internalScore: true,
  notice: "/licenses/underrun/",
  artworkAlt: {
    en: "Neon green 3D facility corridor with a target reticle",
    ko: "조준점이 있는 네온 초록빛 3D 시설 복도",
  },
  artwork: "/art/underrun.png",
  text: {
    en: {
      title: "UNDERRUN",
      subtitle: "Find the systems. Bring the facility back online.",
      description:
        "Explore a pixel-lit 3D facility in this compact WebGL twin-stick shooter. Find the offline systems, fight through three levels and bring them back online.",
      rules: [
        "Search each facility level for the blue offline systems and reboot them.",
        "Keep moving, aim at nearby threats and fire before they reach you.",
        "Restore all three systems to finish the run. Leaving the game restarts the current run.",
      ],
      controls: [
        "Keyboard and mouse: WASD or arrow keys move; mouse aims; hold the left mouse button or Space to fire. P or Escape pauses.",
        "Touch: hold and drag on the left half to move; hold and drag on the right half to aim and fire.",
        "Standard gamepad: left stick moves, A fires, D-pad aims and Start pauses. Physical devices and Tesla are unverified.",
      ],
      tips: [
        "Clear the blue systems to reveal the next route.",
        "Keep distance from spiders and sentries while you aim.",
        "Later levels spawn more spiders; pause whenever you need.",
      ],
    },
    ko: {
      title: "UNDERRUN",
      subtitle: "시스템을 찾고 시설을 다시 가동하세요.",
      description:
        "픽셀 조명이 비추는 3D 시설을 탐험하는 WebGL 트윈스틱 슈팅 게임입니다. 오프라인 시스템을 찾고 세 구역의 적을 상대해 시설을 복구하세요.",
      rules: [
        "각 시설 구역에서 파란색 오프라인 시스템을 찾아 다시 가동하세요.",
        "계속 움직이며 가까운 위협을 조준하고 적이 다가오기 전에 발사하세요.",
        "세 시스템을 모두 복구하면 한 판이 끝납니다. 게임을 나가면 현재 진행은 다시 시작합니다.",
      ],
      controls: [
        "키보드·마우스: WASD 또는 방향키로 이동, 마우스로 조준, 왼쪽 버튼 또는 Space를 누르고 발사. P 또는 Escape로 정지합니다.",
        "터치: 화면 왼쪽을 누르고 끌어 이동하고, 오른쪽을 누르고 끌어 조준·발사합니다.",
        "표준 게임패드: 왼쪽 스틱 이동, A 발사, 방향패드 조준, Start 정지. 실제 기기와 Tesla는 미검증입니다.",
      ],
      tips: [
        "파란 시스템을 모두 복구하면 다음 경로가 열립니다.",
        "조준하는 동안 거미와 센트리에게 거리를 두세요.",
        "후반 구역에는 거미가 더 많이 나타납니다. 필요할 때 멈추세요.",
      ],
    },
  },
});
gameCandidates.push(
  ...crisp.map((item): Game => ({
    id: item.id,
    controlStyle: item.digits
      ? "numbers"
      : item.pointer
        ? "pointer"
        : "buttons",
    category: item.category as Category,
    duration: "1–3",
    color: (
      {
        board: "mint",
        puzzle: "yellow",
        arcade: "mint",
        action: "rust",
        shooting: "mint",
        racing: "yellow",
        sports: "rust",
        strategy: "rust",
        roguelike: "yellow",
        simulation: "rust",
      } as const
    )[item.category as Category],
    version: 1,
    stages: 1,
    tags: [
      item.title,
      item.slug,
      item.category,
      "ABA Games",
      "Crisp",
      "오픈소스",
      ...item.controlsKo,
    ],
    inputs: ["touch", "keyboard", "gamepad"],
    license: "MIT",
    author: "ABA Games",
    source: item.source,
    added: "2026-10-11",
    imported: true,
    internalScore: item.slug === "skygolf",
    notice: "/licenses/crisp/",
    artwork: `/art/crisp/${item.slug}.png`,
    text: {
      en: {
        title: item.title,
        subtitle: item.controls.join(" · "),
        description: item.summary,
        rules: item.controls,
        controls: [
          "Touch or mouse: " + item.controls.join("; "),
          item.digits
            ? "Keyboard: number keys 1–9, or use the number buttons below the game."
            : "Keyboard: hold Space to press, release to let go. Pointer games use the mouse.",
          "Standard gamepad: left stick/D-pad moves the pointer, hold A to press; Start pauses. Physical hardware unverified.",
        ],
        tips: [
          "Pause at any time with P/Escape or the Pause button.",
          item.slug === "skygolf"
            ? "This game counts strokes inside the game. Leaving the page restarts your course."
            : "This original restarts after leaving the page; only your best score is saved.",
          "Original source and MIT notices are linked below.",
        ],
      },
      ko: {
        title: item.title,
        subtitle: item.controlsKo.join(" · "),
        description: item.summaryKo,
        rules: item.controlsKo,
        controls: [
          "터치·마우스: " + item.controlsKo.join(" · "),
          item.digits
            ? "키보드: 숫자 1–9 또는 게임 아래 숫자 버튼을 누르세요."
            : "키보드: Space를 길게 눌러 조작하고 손을 떼세요. 위치 조작 게임은 마우스를 사용하세요.",
          "표준 게임패드: 왼쪽 스틱·방향패드로 포인터 이동, A 길게 누르기, Start 정지. 실제 패드는 미검증입니다.",
        ],
        tips: [
          "P/Escape 또는 정지 버튼으로 언제든 멈출 수 있어요.",
          item.slug === "skygolf"
            ? "타수는 게임 화면에서 확인하세요. 페이지를 떠나면 코스가 처음부터 시작합니다."
            : "페이지를 떠나면 라운드는 처음부터 시작합니다. 최고 점수만 저장해요.",
          "아래에서 원본 소스와 MIT 고지를 확인할 수 있어요.",
        ],
      },
    },
  })),
);
gameCandidates.push(...boardGames);
gameCandidates.push(...crispCycleGames);
const externalBrowserGames: Game[] = [
  {
    id: "freedoom",
    category: "shooting",
    duration: "varies",
    controlStyle: "directional",
    color: "rust",
    version: 1,
    stages: 0,
    tags: [
      "freedoom",
      "freedoom phase 1",
      "classic fps",
      "retro fps",
      "first person shooter",
      "free doom-style game",
      "browser shooter",
      "프리덤",
      "프리덤 페이즈 1",
      "고전 fps",
      "둠 스타일 슈팅",
      "1인칭 슈팅",
      "무료 슈팅 게임",
    ],
    inputs: ["touch", "keyboard"],
    license: "Freedoom BSD-3-Clause · Chocolate Doom GPL-2.0",
    licenseUrl:
      "https://github.com/danborden1/doom-web#what-is-in-here-and-who-owns-it",
    author: "Freedoom contributors · Chocolate Doom contributors",
    source: "https://github.com/freedoom/freedoom",
    externalPlay: {
      url: "https://danborden1.github.io/doom-web/",
      host: {
        en: "Freedoom community browser build",
        ko: "Freedoom 커뮤니티 브라우저 빌드",
      },
      note: {
        en: "This independent demo runs a Chocolate Doom WebAssembly port with Freedoom Phase 1 data. Its README says the first load is about 35 MB, identifies the engine and game-data licenses, and says it includes no proprietary id Software Doom WAD. Denny Games does not host the build or distribute WAD files; the web wrapper's terms are not stated there.",
        ko: "독립 데모에서 Chocolate Doom WebAssembly 포트와 Freedoom Phase 1 데이터를 실행합니다. 호스트 README는 첫 로딩이 약 35MB라고 안내하고 엔진·게임 데이터 라이선스를 구분하며 id Software의 상용 Doom WAD는 포함하지 않는다고 밝힙니다. 데니 게임즈는 실행물이나 WAD 파일을 호스팅·배포하지 않으며, 웹 래퍼의 별도 이용 조건은 README에 명시되지 않았습니다.",
      },
    },
    added: "2026-10-15",
    artwork: "/art/freedoom.svg",
    artworkAlt: {
      en: "Original illustration of a retro sci-fi corridor and crosshair",
      ko: "레트로 SF 복도와 조준점을 그린 자체 일러스트",
    },
    text: {
      en: {
        title: "Freedoom: Phase 1",
        subtitle: "A free, open source classic FPS.",
        description:
          "Play Freedoom Phase 1, a classic first-person shooter campaign, in a community-hosted browser port. Freedoom supplies original Doom-compatible levels, artwork and sound under BSD-3-Clause; the linked demo uses the Chocolate Doom engine. This is an external game page, not a Denny Games-hosted port.",
        rules: [
          "Explore each level, find routes forward and survive encounters with the enemies in your path.",
          "Look for doors, switches and supplies while watching your health and ammunition.",
          "The linked build opens Freedoom Phase 1. Other campaigns and multiplayer modes are not promised by this listing.",
        ],
        controls: [
          "Keyboard: arrow keys move and turn; Ctrl fires; Space opens doors; comma and period strafe; number keys switch weapons.",
          "Touch: use the controls shown below the game viewport in the external build.",
          "This page opens a third-party browser build in a new tab. Its loading time and behavior depend on that host.",
        ],
        tips: [
          "Check side rooms for switches and supplies before moving deeper.",
          "Use strafing to dodge while keeping enemies in view.",
          "The host README says the first load is about 35 MB; wait for it to finish before starting.",
        ],
      },
      ko: {
        title: "Freedoom: Phase 1",
        subtitle: "자유 라이선스로 만든 고전 FPS 캠페인.",
        description:
          "커뮤니티 브라우저 포트에서 Freedoom Phase 1 1인칭 슈팅 캠페인을 플레이하세요. Freedoom은 BSD-3-Clause에 따라 자체 제작한 Doom 호환 레벨·그림·소리를 제공하고, 연결된 데모는 Chocolate Doom 엔진을 사용합니다. 데니 게임즈가 실행물을 호스팅하는 포트는 아닙니다.",
        rules: [
          "레벨을 탐험하고 다음 길을 찾아가며 앞을 가로막는 적과 맞서세요.",
          "체력과 탄약을 살피며 문·스위치·보급품을 찾아보세요.",
          "연결된 빌드는 Freedoom Phase 1을 엽니다. 다른 캠페인이나 멀티플레이 모드는 이 목록에서 보장하지 않습니다.",
        ],
        controls: [
          "키보드: 방향키로 이동·회전, Ctrl로 발사, Space로 문 열기, 쉼표·마침표로 옆걸음, 숫자 키로 무기를 바꿉니다.",
          "터치: 외부 게임 화면 아래에 표시되는 조작 버튼을 사용하세요.",
          "이 페이지는 새 탭에서 제3자 브라우저 빌드를 엽니다. 로딩 시간과 동작은 호스트에 따라 달라집니다.",
        ],
        tips: [
          "깊이 들어가기 전에 옆방에서 스위치와 보급품을 찾아보세요.",
          "적을 바라본 채 옆걸음으로 공격을 피하세요.",
          "호스트 README는 첫 로딩이 약 35MB라고 안내하므로 시작 전 다운로드가 끝날 때까지 기다리세요.",
        ],
      },
    },
  },
  {
    id: "openttd",
    category: "strategy",
    duration: "varies",
    controlStyle: "pointer",
    color: "mint",
    version: 1,
    stages: 0,
    tags: [
      "openttd",
      "transport tycoon",
      "transport simulation",
      "railway game",
      "train game",
      "route planning",
      "business simulation",
      "browser strategy game",
      "오픈티티디",
      "트랜스포트 타이쿤",
      "교통 경영",
      "철도 경영",
      "기차 게임",
      "노선 계획",
      "경영 시뮬레이션",
    ],
    inputs: ["mouse", "keyboard"],
    license:
      "OpenTTD core GPL-2.0 · base-set licenses vary; linked browser bundle not audited",
    licenseUrl: "https://www.openttd.org/content-creators",
    author: "OpenTTD Team",
    source: "https://github.com/OpenTTD/OpenTTD",
    externalPlay: {
      url: "https://openttdonline.com/play/",
      host: {
        en: "OpenTTD Online · Overgrown Studio",
        ko: "OpenTTD Online · Overgrown Studio",
      },
      note: {
        en: "This is an independent browser host, not the official OpenTTD website. The host controls its browser build, online content and save import/export; Denny Games has not audited which basesets it supplies. OpenTTD's official guidance distinguishes free Open* basesets from original Transport Tycoon Deluxe data, so do not assume the host includes rights to commercial data.",
        ko: "공식 OpenTTD 사이트가 아닌 독립 브라우저 호스트입니다. 브라우저 빌드·온라인 콘텐츠·저장 파일 가져오기와 내보내기는 호스트가 관리하며, 데니 게임즈는 어떤 베이스셋을 제공하는지 감사하지 않았습니다. OpenTTD 공식 안내는 자유 Open* 베이스셋과 Transport Tycoon Deluxe 원본 데이터를 구분하므로 상용 원본 데이터의 권리가 포함된다고 가정하지 마세요.",
      },
    },
    added: "2026-10-15",
    artwork: "/art/openttd.svg",
    artworkAlt: {
      en: "Original illustration of a transport network with rail and road routes",
      ko: "철도와 도로 노선을 그린 교통망 자체 일러스트",
    },
    text: {
      en: {
        title: "OpenTTD",
        subtitle: "Plan routes. Connect towns. Move cargo.",
        description:
          "OpenTTD is an open source transport simulation based on Transport Tycoon Deluxe. Plan rail, road, sea and air links, carry passengers and cargo, and grow a connected network in an independent browser build.",
        rules: [
          "Connect towns and industries with transport routes that move passengers or cargo to their destinations.",
          "Buy vehicles, assign them to useful routes and maintain a network that can earn more than it costs.",
          "There is no short fixed round. Build at your own pace; the linked host manages browser saves and optional online content.",
        ],
        controls: [
          "Mouse: use the game menus, map and build tools shown in the browser version.",
          "Keyboard: the build may expose OpenTTD shortcuts; check its in-game help for the current mapping.",
          "This is a third-party browser host. Its download, save and online-content behavior is managed outside Denny Games.",
        ],
        tips: [
          "Start with a simple route between a nearby industry and the town that needs its cargo.",
          "Check vehicle orders and running costs before extending a line.",
          "Use the host's save controls if you want to keep or move a browser save.",
        ],
      },
      ko: {
        title: "OpenTTD",
        subtitle: "노선을 만들고 도시와 화물을 연결하세요.",
        description:
          "OpenTTD는 Transport Tycoon Deluxe를 바탕으로 만든 오픈소스 교통 경영 시뮬레이션입니다. 철도·도로·해상·항공 노선으로 승객과 화물을 나르고, 독립 브라우저 빌드에서 연결망을 키워보세요.",
        rules: [
          "도시와 산업 시설을 운송 노선으로 연결해 승객이나 화물을 목적지까지 옮기세요.",
          "차량을 구매하고 쓸모 있는 노선에 배정해 운영비보다 더 많은 수익을 내는 망을 만드세요.",
          "짧은 고정 라운드는 없습니다. 원하는 속도로 확장하세요. 브라우저 저장과 온라인 콘텐츠는 연결된 호스트가 관리합니다.",
        ],
        controls: [
          "마우스: 브라우저 버전에 표시되는 메뉴·지도·건설 도구를 사용하세요.",
          "키보드: 빌드에서 OpenTTD 단축키를 제공할 수 있습니다. 현재 키 배치는 게임 안 도움말을 확인하세요.",
          "제3자 브라우저 호스트를 이용합니다. 다운로드·저장·온라인 콘텐츠는 데니 게임즈 밖에서 처리됩니다.",
        ],
        tips: [
          "가까운 산업 시설과 해당 화물이 필요한 도시를 간단한 노선으로 먼저 연결하세요.",
          "노선을 늘리기 전에 차량의 운행 지시와 유지 비용을 확인하세요.",
          "브라우저 저장을 보관하거나 옮기려면 호스트의 저장 기능을 사용하세요.",
        ],
      },
    },
  },
  {
    id: "supertux",
    category: "action",
    duration: "varies",
    controlStyle: "directional",
    color: "yellow",
    version: 1,
    stages: 0,
    tags: [
      "supertux",
      "platform game",
      "platformer",
      "side scrolling",
      "jump and run",
      "classic platformer",
      "open source platform game",
      "browser platformer",
      "슈퍼턱스",
      "플랫폼 게임",
      "횡스크롤",
      "점프 액션",
      "고전 플랫폼 게임",
      "오픈소스 게임",
    ],
    inputs: ["keyboard"],
    license: "GPL-3.0-or-later code · game data has per-file terms",
    licenseUrl: "https://github.com/SuperTux/supertux/blob/master/LICENSE.txt",
    author: "SuperTux Team",
    source: "https://github.com/SuperTux/supertux",
    externalPlay: {
      url: "https://play.supertux.org/play/",
      host: {
        en: "Official SuperTux browser page",
        ko: "SuperTux 공식 브라우저 페이지",
      },
      note: {
        en: "The SuperTux project provides this browser build. The official page lists multiple versions; controls, loading and browser requirements follow the version you choose there.",
        ko: "SuperTux 프로젝트가 제공하는 브라우저 빌드입니다. 공식 페이지에서 여러 버전을 선택할 수 있으며, 조작·로딩·브라우저 요구사항은 선택한 버전에 따릅니다.",
      },
    },
    added: "2026-10-15",
    artwork: "/art/supertux.svg",
    artworkAlt: {
      en: "Original illustration of a snowy side-scrolling platform course",
      ko: "눈 덮인 횡스크롤 플랫폼 코스를 그린 자체 일러스트",
    },
    text: {
      en: {
        title: "SuperTux",
        subtitle: "A classic open source platform adventure.",
        description:
          "SuperTux is an open source 2D platform game. Guide Tux across snowy levels, jump over hazards and explore a side-scrolling adventure in the official project browser build.",
        rules: [
          "Move through a level, avoid hazards and reach its exit to continue the adventure.",
          "Collect items and use jumps carefully around enemies and gaps.",
          "The official browser page offers different game versions; this listing opens its current play page rather than hosting the files on Denny Games.",
        ],
        controls: [
          "Keyboard: read the control guide displayed by the version selected on the official browser page.",
          "Available actions and key bindings may differ between browser builds; check the game before starting a level.",
        ],
        tips: [
          "Watch an enemy's movement before jumping into its path.",
          "Look around platforms for alternate routes and collectibles.",
          "Choose a version on the official play page if the default build does not work in your browser.",
        ],
      },
      ko: {
        title: "SuperTux",
        subtitle: "오픈소스로 즐기는 고전 플랫폼 모험.",
        description:
          "SuperTux는 오픈소스 2D 플랫폼 게임입니다. 공식 프로젝트 브라우저 빌드에서 Tux를 조작해 눈 덮인 레벨을 달리고, 장애물을 뛰어넘으며 횡스크롤 모험을 즐기세요.",
        rules: [
          "레벨을 이동하며 장애물을 피하고 출구에 도달해 모험을 이어가세요.",
          "아이템을 모으고 적과 낭떠러지 주변에서 점프 타이밍을 살피세요.",
          "공식 브라우저 페이지에서 여러 버전을 고를 수 있습니다. 데니 게임즈가 파일을 직접 호스팅하지 않고 현재 플레이 페이지를 엽니다.",
        ],
        controls: [
          "키보드: 공식 브라우저 페이지에서 선택한 버전이 표시하는 조작 안내를 확인하세요.",
          "브라우저 빌드마다 동작과 키 배치가 다를 수 있으니 레벨을 시작하기 전에 게임 안에서 확인하세요.",
        ],
        tips: [
          "적의 움직임을 먼저 보고 진행 경로에 맞춰 점프하세요.",
          "다른 길과 수집 아이템이 있는지 발판 주변을 살펴보세요.",
          "기본 빌드가 브라우저에서 동작하지 않으면 공식 플레이 페이지에서 다른 버전을 선택하세요.",
        ],
      },
    },
  },
  {
    id: "nethack",
    category: "roguelike",
    duration: "varies",
    controlStyle: "directional",
    color: "rust",
    version: 1,
    stages: 0,
    tags: [
      "nethack",
      "NetHack 5",
      "roguelike",
      "rogue-like",
      "dungeon crawler",
      "dungeon crawl",
      "turn based dungeon",
      "permadeath",
      "classic roguelike",
      "browser nethack",
      "넷핵",
      "로그라이크",
      "던전 탐험",
      "턴제 던전",
      "고전 로그라이크",
      "영구 사망",
      "텍스트 게임",
    ],
    inputs: ["keyboard"],
    license: "NetHack General Public License (NGPL)",
    licenseUrl: "https://www.nethack.org/common/license.html",
    author: "NetHack DevTeam",
    source: "https://github.com/NetHack/NetHack",
    externalPlay: {
      url: "https://www.alt.org/nethack/hterm/",
      host: {
        en: "NAO Web Term · community server",
        ko: "NAO Web Term · 커뮤니티 서버",
      },
      note: {
        en: "This is a remote NetHack server with a browser terminal, not a local copy on Denny Games. The server manages accounts, game sessions and saves; read its current rules and privacy information before signing in.",
        ko: "데니 게임즈에 설치된 게임이 아니라 브라우저 터미널로 접속하는 원격 NetHack 서버입니다. 계정·플레이 세션·저장은 서버가 관리하므로 로그인 전에 최신 이용 규칙과 개인정보 안내를 확인하세요.",
      },
    },
    added: "2026-10-15",
    artwork: "/art/nethack.svg",
    artworkAlt: {
      en: "Original illustration of a text-style dungeon map and stairs",
      ko: "문자형 던전 지도와 계단을 그린 자체 일러스트",
    },
    text: {
      en: {
        title: "NetHack",
        subtitle: "A legendary turn-based dungeon roguelike.",
        description:
          "NetHack is a classic open source roguelike dungeon adventure. Explore a changing dungeon, manage food and equipment, and seek the Amulet of Yendor; a browser terminal connects to the NAO community server, where play is remote.",
        rules: [
          "Explore the dungeon, gather equipment and supplies, and search for the Amulet of Yendor.",
          "Every move and action advances the turn-based world. Enemies, hunger and limited resources make each choice matter.",
          "A character's run can end permanently. The linked NAO server stores its own game sessions and follows its own account and save rules.",
        ],
        controls: [
          "Keyboard: use the NAO web terminal's current key guide and in-game help; NetHack has many commands.",
          "This is remote play on a community server. Denny Games does not receive your account credentials or store the game session.",
        ],
        tips: [
          "Read the terminal's key reference and message line before trying unfamiliar commands.",
          "Check food, health and equipment regularly; a small mistake can cost a run.",
          "Learn the server's save and session rules before leaving a character unattended.",
        ],
      },
      ko: {
        title: "NetHack",
        subtitle: "전설적인 턴제 던전 로그라이크.",
        description:
          "NetHack은 고전 오픈소스 로그라이크 던전 모험입니다. 변화하는 던전을 탐험하고 식량과 장비를 관리해 Yendor의 부적을 찾으세요. 브라우저 터미널은 NAO 커뮤니티 서버에 원격으로 접속합니다.",
        rules: [
          "던전을 탐험하고 장비와 보급품을 모아 Yendor의 부적을 찾으세요.",
          "이동과 행동을 할 때마다 턴제 세계가 진행됩니다. 적·허기·제한된 자원 때문에 선택이 중요합니다.",
          "캐릭터의 모험은 영구히 끝날 수 있습니다. 연결된 NAO 서버가 게임 세션을 저장하며 자체 계정·저장 규칙을 적용합니다.",
        ],
        controls: [
          "키보드: 명령이 많으므로 NAO 웹 터미널의 최신 키 안내와 게임 안 도움말을 확인하세요.",
          "커뮤니티 서버에서 원격 플레이합니다. 데니 게임즈는 계정 비밀번호를 받거나 게임 세션을 저장하지 않습니다.",
        ],
        tips: [
          "익숙하지 않은 명령을 쓰기 전에 터미널의 키 안내와 메시지 줄을 읽어보세요.",
          "식량·체력·장비를 자주 확인하세요. 작은 실수가 한 번의 모험을 끝낼 수 있습니다.",
          "캐릭터를 남겨두고 나가기 전에 서버의 저장·세션 규칙을 확인하세요.",
        ],
      },
    },
  },
  {
    id: "freeciv",
    category: "strategy",
    duration: "varies",
    controlStyle: "pointer",
    color: "mint",
    version: 1,
    stages: 0,
    tags: [
      "freeciv",
      "turn based strategy",
      "4X strategy",
      "empire builder",
      "civilization game",
      "browser strategy game",
      "freeciv web",
      "프리시브",
      "턴제 전략 게임",
      "4X 전략",
      "제국 건설",
      "문명 게임",
      "브라우저 전략 게임",
      "무료 전략 게임",
    ],
    inputs: ["mouse", "keyboard"],
    license: "Freeciv server: GPL · Freeciv-web client: AGPL",
    licenseUrl:
      "https://github.com/freeciv/freeciv-web/blob/develop/LICENSE.txt",
    author: "The Freeciv Project",
    source: "https://github.com/freeciv/freeciv-web",
    externalPlay: {
      url: "https://freecivweb.com/webclient/?action=new&type=singleplayer",
      host: {
        en: "Freeciv-web community single-player setup",
        ko: "Freeciv-web 커뮤니티 싱글 플레이 설정",
      },
      note: {
        en: "This community-run Freeciv-web service opens at single-player setup. Its terms and privacy policy apply; multiplayer profiles, browser sessions and saves follow the service's current rules. Denny Games does not operate this host or store its game data.",
        ko: "커뮤니티가 운영하는 Freeciv-web 서비스의 싱글 플레이 설정 화면을 엽니다. 해당 서비스의 이용 약관과 개인정보 정책이 적용되며 멀티플레이 프로필·브라우저 세션·저장은 서비스의 최신 규칙을 따릅니다. 데니 게임즈는 이 호스트를 운영하거나 게임 데이터를 저장하지 않습니다.",
      },
    },
    added: "2026-10-15",
    artwork: "/art/freeciv.svg",
    artworkAlt: {
      en: "Original illustration of a turn-based civilization map with a walled city",
      ko: "성벽 도시가 있는 턴제 문명 전략 지도를 그린 자체 일러스트",
    },
    text: {
      en: {
        title: "Freeciv",
        subtitle: "Build a civilization, one turn at a time.",
        description:
          "Freeciv is a free, open-source turn-based strategy game with roots in the mid-1990s. Start a single-player world in your browser, found cities, research technologies and guide a civilization from early history toward the space age.",
        rules: [
          "Choose a nation and world settings in the linked single-player setup, then start a new game.",
          "Found cities, explore the map, grow your economy and research technologies while rival civilizations develop too.",
          "There is no short fixed round. The browser host supplies the current game controls, help and save options.",
        ],
        controls: [
          "Mouse: select map tiles, units and the host's city, research and production controls.",
          "Keyboard: Freeciv has many commands and shortcuts; use the in-game help for the current browser build.",
          "This is an independent Freeciv-web service. Its terms, sessions and save behavior are separate from Denny Games.",
        ],
        tips: [
          "Begin with a small settlement and check what nearby terrain can produce.",
          "Balance food, production and research before expanding too quickly.",
          "Use the host's save and privacy guidance before starting a long campaign.",
        ],
      },
      ko: {
        title: "Freeciv",
        subtitle: "한 턴씩 문명을 키우세요.",
        description:
          "Freeciv는 1990년대 중반부터 이어진 무료 오픈소스 턴제 전략 게임입니다. 브라우저에서 싱글 플레이 세계를 만들고 도시를 세워 기술을 연구하며 초기 역사부터 우주 시대까지 문명을 이끌어 보세요.",
        rules: [
          "연결된 싱글 플레이 설정에서 국가와 세계 규칙을 고른 다음 새 게임을 시작하세요.",
          "도시를 세우고 지도를 탐험하며 경제를 키우고 기술을 연구하세요. 다른 문명도 함께 발전합니다.",
          "짧게 정해진 라운드는 없습니다. 현재 브라우저 빌드의 조작·도움말·저장 메뉴는 외부 호스트가 제공합니다.",
        ],
        controls: [
          "마우스: 지도 타일·유닛과 호스트의 도시·연구·생산 메뉴를 선택하세요.",
          "키보드: 명령과 단축키가 많으므로 현재 브라우저 빌드의 게임 안 도움말을 확인하세요.",
          "독립 Freeciv-web 서비스에서 플레이합니다. 이용 약관·세션·저장 방식은 데니 게임즈와 별개입니다.",
        ],
        tips: [
          "작은 도시부터 세우고 주변 지형에서 얻을 수 있는 자원을 살펴보세요.",
          "너무 빨리 확장하기 전에 식량·생산·연구의 균형을 맞추세요.",
          "긴 캠페인을 시작하기 전에 호스트의 저장·개인정보 안내를 확인하세요.",
        ],
      },
    },
  },
  {
    id: "umoria",
    category: "roguelike",
    duration: "varies",
    controlStyle: "directional",
    color: "rust",
    version: 1,
    stages: 0,
    tags: [
      "umoria",
      "moria",
      "the dungeons of moria",
      "1983 roguelike",
      "classic roguelike",
      "dungeon crawler",
      "ascii dungeon game",
      "browser wasm game",
      "우모리아",
      "모리아",
      "1980년대 로그라이크",
      "고전 로그라이크",
      "던전 크롤러",
      "문자 던전 게임",
      "브라우저 게임",
    ],
    inputs: ["keyboard"],
    license: "GPL-3.0-or-later",
    licenseUrl:
      "https://github.com/dungeons-of-moria/umoria/blob/master/LICENSE",
    author: "Umoria contributors · browser build by Jeff Hirschberg",
    source: "https://github.com/dungeons-of-moria/umoria",
    externalPlay: {
      url: "https://umoria.org/play/",
      host: {
        en: "Umoria official browser page · WebAssembly build",
        ko: "Umoria 공식 브라우저 페이지 · WebAssembly 빌드",
      },
      note: {
        en: "The Umoria site hosts a WebAssembly build of this 1983 dungeon game. Browser saves use IndexedDB and remain in the browser profile where you play; they do not automatically move to another browser. Denny Games does not host the build or store those saves.",
        ko: "Umoria 사이트가 1983년 던전 게임의 WebAssembly 빌드를 호스팅합니다. 브라우저 저장은 플레이한 브라우저 프로필의 IndexedDB에 남으며 다른 브라우저로 자동 이동하지 않습니다. 데니 게임즈는 실행물이나 저장 데이터를 호스팅하지 않습니다.",
      },
    },
    added: "2026-10-15",
    artwork: "/art/umoria.svg",
    artworkAlt: {
      en: "Original illustration of an old-school dungeon map and descending stairs",
      ko: "고전 던전 지도와 아래로 이어지는 계단을 그린 자체 일러스트",
    },
    text: {
      en: {
        title: "Umoria",
        subtitle: "Descend into the Mines of Moria.",
        description:
          "Umoria brings the 1983 Moria dungeon crawler to a browser through a WebAssembly build. Prepare in a town, descend through a dangerous maze, gather equipment and search for the Balrog at the depths.",
        rules: [
          "Buy supplies and prepare your character in town before entering the mines.",
          "Explore one turn at a time, manage health and equipment, and descend deeper through the dungeon.",
          "A character can die permanently. The browser build stores saves in that browser's local IndexedDB, not in a Denny Games account.",
        ],
        controls: [
          "Keyboard: use the game's command keys and the included manual or in-game help; movement and actions are turn-based.",
          "This is the Umoria site's WebAssembly build. Check its page for current browser requirements and save instructions.",
        ],
        tips: [
          "Visit the town shops before descending; supplies are harder to replace below.",
          "Read unfamiliar item descriptions and watch your food and health.",
          "Back up or export a save before clearing browser data or changing browser profiles.",
        ],
      },
      ko: {
        title: "Umoria",
        subtitle: "모리아 광산 깊은 곳으로 내려가세요.",
        description:
          "Umoria는 1983년작 던전 크롤러 Moria를 WebAssembly로 브라우저에서 즐기는 게임입니다. 마을에서 준비하고 위험한 미로를 한 턴씩 탐험하며 장비를 모아 깊은 곳의 발로그를 찾아보세요.",
        rules: [
          "광산에 들어가기 전에 마을에서 장비와 보급품을 구입하세요.",
          "한 턴씩 던전을 탐험하고 체력과 장비를 관리하며 아래층으로 내려가세요.",
          "캐릭터는 영구히 사망할 수 있습니다. 브라우저 빌드의 저장은 데니 게임즈 계정이 아니라 해당 브라우저의 IndexedDB에 보관됩니다.",
        ],
        controls: [
          "키보드: 게임의 명령 키와 포함된 설명서·게임 안 도움말을 사용하세요. 이동과 행동은 턴제로 진행됩니다.",
          "Umoria 사이트의 WebAssembly 빌드입니다. 최신 브라우저 요구사항과 저장 안내는 해당 페이지에서 확인하세요.",
        ],
        tips: [
          "깊이 내려가기 전에 마을 상점에서 필요한 물품을 준비하세요.",
          "낯선 아이템의 설명을 읽고 식량과 체력을 살펴보세요.",
          "브라우저 데이터를 지우거나 프로필을 바꾸기 전에 저장 파일을 백업하거나 내보내세요.",
        ],
      },
    },
  },
  {
    id: "larn",
    category: "roguelike",
    duration: "varies",
    controlStyle: "directional",
    color: "yellow",
    version: 1,
    stages: 0,
    tags: [
      "larn",
      "ularn",
      "1986 roguelike",
      "classic dungeon game",
      "turn based dungeon crawler",
      "browser roguelike",
      "weekly challenge roguelike",
      "랜",
      "울랜",
      "1980년대 로그라이크",
      "고전 던전 게임",
      "턴제 던전 크롤러",
      "브라우저 로그라이크",
      "주간 도전 게임",
    ],
    inputs: ["keyboard", "mouse", "touch"],
    license: "MIT · JavaScript Larn/Ularn port",
    licenseUrl: "https://github.com/primeau/Larn/blob/master/LICENSE",
    author: "Jason Primeau · Larn and Ularn contributors",
    source: "https://github.com/primeau/Larn",
    externalPlay: {
      url: "https://larn.org/",
      host: {
        en: "Larn.org browser game selector",
        ko: "Larn.org 브라우저 게임 선택 화면",
      },
      note: {
        en: "The page offers browser-playable Larn and Ularn modes, graphics choices and an optional weekly challenge. It also has global scores and game replays; those features and any associated data are handled by Larn.org. Denny Games does not run the service or store its saves.",
        ko: "페이지에서 브라우저로 Larn·Ularn 모드와 그래픽 옵션, 선택형 주간 도전을 고를 수 있습니다. 전체 점수판과 게임 리플레이도 제공하며 해당 기능과 관련 데이터는 Larn.org가 관리합니다. 데니 게임즈는 서비스를 운영하거나 저장 데이터를 보관하지 않습니다.",
      },
    },
    added: "2026-10-15",
    artwork: "/art/larn.svg",
    artworkAlt: {
      en: "Original illustration of a retro dungeon, treasure and a descending staircase",
      ko: "레트로 던전과 보물, 아래로 이어지는 계단을 그린 자체 일러스트",
    },
    text: {
      en: {
        title: "Larn",
        subtitle: "A compact classic roguelike from 1986.",
        description:
          "Larn is a classic roguelike first released in 1986. Explore a dungeon, manage supplies and search for the Eye of Larn in this browser-based JavaScript port, with optional Ularn and retro graphics modes.",
        rules: [
          "Choose Larn or Ularn and a graphics mode on the host page, then start a character.",
          "Explore the dungeon, collect equipment and use shops and resources carefully on the way to the game's goal.",
          "The host also offers optional weekly challenges, public scores and replays; check its rules before sharing a run.",
        ],
        controls: [
          "Keyboard: use the Larn command keys and the help shown by the game.",
          "Mouse or touch: the browser port supports clicking its map and offers mobile support; Denny Games has not tested those devices.",
          "The browser build and any public scores or replays belong to the independent Larn.org service.",
        ],
        tips: [
          "Check your supplies and equipment before leaving town.",
          "Explore carefully and read the message area before choosing a command.",
          "Use the host's current save and replay guidance; Denny Games does not keep a copy of your run.",
        ],
      },
      ko: {
        title: "Larn",
        subtitle: "1986년부터 이어진 짧은 고전 로그라이크.",
        description:
          "Larn은 1986년에 처음 공개된 고전 로그라이크입니다. 던전을 탐험하고 보급품을 관리하며 Eye of Larn을 찾으세요. 브라우저 JavaScript 포트에서 Ularn과 레트로 그래픽 모드도 선택할 수 있습니다.",
        rules: [
          "호스트 페이지에서 Larn 또는 Ularn과 그래픽 모드를 고르고 캐릭터를 시작하세요.",
          "던전을 탐험하고 장비를 모으세요. 게임의 목표를 향해 상점과 보급품을 신중히 이용하세요.",
          "선택형 주간 도전·공개 점수판·리플레이도 제공하므로 기록을 공유하기 전에 호스트 규칙을 확인하세요.",
        ],
        controls: [
          "키보드: Larn 명령 키와 게임 안에 표시되는 도움말을 사용하세요.",
          "마우스·터치: 브라우저 포트는 지도 클릭과 모바일 지원을 안내하지만 데니 게임즈는 실제 기기에서 시험하지 않았습니다.",
          "브라우저 빌드와 공개 점수·리플레이는 독립 Larn.org 서비스가 제공합니다.",
        ],
        tips: [
          "마을을 떠나기 전에 보급품과 장비를 확인하세요.",
          "신중히 탐험하고 명령을 고르기 전에 메시지 영역을 읽으세요.",
          "호스트의 최신 저장·리플레이 안내를 확인하세요. 데니 게임즈는 플레이 기록을 보관하지 않습니다.",
        ],
      },
    },
  },
  {
    id: "neo-angband",
    category: "roguelike",
    duration: "varies",
    controlStyle: "directional",
    color: "rust",
    version: 1,
    stages: 0,
    tags: [
      "neo angband",
      "angband",
      "1990 roguelike",
      "browser angband",
      "turn based dungeon crawler",
      "procedural dungeon game",
      "classic fantasy roguelike",
      "네오 앙그반드",
      "앙그반드",
      "1990년 로그라이크",
      "브라우저 앙그반드",
      "턴제 던전 크롤러",
      "절차 생성 던전 게임",
      "고전 판타지 로그라이크",
    ],
    inputs: ["keyboard"],
    license: "GPL-2.0 or Angband License; art has separate terms",
    licenseUrl:
      "https://github.com/neostryder/neo-angband/blob/master/LICENSE.md",
    author: "Angband developers · Neo Angband community port",
    source: "https://github.com/neostryder/neo-angband",
    externalPlay: {
      url: "https://angband.rpgm.world/",
      host: {
        en: "Neo Angband community browser port",
        ko: "Neo Angband 커뮤니티 브라우저 포트",
      },
      note: {
        en: "This is an unofficial community port of Angband, not the original project's site. The host says the no-mod game targets vanilla Angband and browser saves stay in that browser's storage, scoped to this address. Denny Games has not tested gameplay parity or this host's device behavior.",
        ko: "원본 프로젝트의 공식 사이트가 아닌 Angband 커뮤니티 포트입니다. 호스트는 모드를 쓰지 않을 때 원본 Angband를 목표로 하며 브라우저 저장은 이 주소에 한정된 해당 브라우저 저장 공간에 남는다고 안내합니다. 데니 게임즈는 플레이 동등성이나 호스트의 기기 동작을 검증하지 않았습니다.",
      },
    },
    added: "2026-10-15",
    artwork: "/art/neo-angband.svg",
    artworkAlt: {
      en: "Original illustration of a shadowed mountain fortress and a lone dungeon explorer",
      ko: "어두운 산성 요새와 홀로 던전을 탐험하는 인물을 그린 자체 일러스트",
    },
    text: {
      en: {
        title: "Neo Angband",
        subtitle: "Angband's 1990 dungeon adventure, playable in a browser.",
        description:
          "Angband began in 1990 as a deep, turn-based fantasy roguelike. Neo Angband is an independent browser port based on the open-source game; the host says its default no-mod mode follows vanilla Angband and keeps saves in browser storage.",
        rules: [
          "Create a character, prepare in town and descend through a procedurally generated dungeon.",
          "Explore, fight monsters and manage equipment one turn at a time; death can permanently end a character.",
          "With no mods enabled, the community port targets the original Angband experience. Denny Games has not verified that claim against every game session.",
        ],
        controls: [
          "Keyboard: follow the port's in-game help and quick-start guide for movement, commands and character management.",
          "Your save stays in browser storage scoped to the external host address. Export it using the host's instructions before clearing browser data.",
          "Neo Angband is an independent community project and is not an official Angband website.",
        ],
        tips: [
          "Read the quick-start guide before the first descent; character creation and equipment have many choices.",
          "Check a monster and your resources before committing to a fight.",
          "Use the port's save export before changing browser profile or clearing site data.",
        ],
      },
      ko: {
        title: "Neo Angband",
        subtitle: "1990년 시작한 던전 모험을 브라우저에서.",
        description:
          "Angband는 1990년에 시작한 깊이 있는 턴제 판타지 로그라이크입니다. Neo Angband는 오픈소스 게임을 바탕으로 한 독립 브라우저 포트이며, 호스트는 모드를 끈 기본 모드가 원본 Angband를 따르고 저장은 브라우저에 남는다고 안내합니다.",
        rules: [
          "캐릭터를 만들고 마을에서 준비한 뒤 절차적으로 생성되는 던전으로 내려가세요.",
          "한 턴씩 탐험하고 몬스터와 싸우며 장비를 관리하세요. 캐릭터가 영구 사망할 수 있습니다.",
          "모드를 끈 상태에서 커뮤니티 포트는 원본 Angband 경험을 목표로 합니다. 데니 게임즈가 모든 플레이 상황에서 이를 검증하지는 않았습니다.",
        ],
        controls: [
          "키보드: 이동·명령·캐릭터 관리 방법은 포트의 게임 안 도움말과 시작 안내를 확인하세요.",
          "저장은 외부 호스트 주소에 한정된 브라우저 저장 공간에 남습니다. 브라우저 데이터를 지우기 전에 호스트 안내에 따라 내보내세요.",
          "Neo Angband는 독립 커뮤니티 프로젝트이며 공식 Angband 사이트가 아닙니다.",
        ],
        tips: [
          "첫 던전 진입 전에 시작 안내를 읽으세요. 캐릭터 생성과 장비 선택지가 많습니다.",
          "전투를 시작하기 전에 몬스터와 보유 자원을 확인하세요.",
          "브라우저 프로필을 바꾸거나 사이트 데이터를 지우기 전에 포트의 저장 내보내기를 이용하세요.",
        ],
      },
    },
  },
  {
    id: "dcss",
    category: "roguelike",
    duration: "varies",
    controlStyle: "directional",
    color: "mint",
    version: 1,
    stages: 0,
    tags: [
      "dungeon crawl stone soup",
      "dcss",
      "dungeon crawl",
      "webtiles",
      "browser roguelike",
      "turn based dungeon crawler",
      "classic roguelike sequel",
      "던전 크롤 스톤 수프",
      "던전 크롤 스톤수프",
      "웹타일즈",
      "브라우저 로그라이크",
      "턴제 던전 크롤러",
      "고전 로그라이크 후속작",
    ],
    inputs: ["keyboard"],
    license: "GPL-2.0-or-later components; some compatible licenses",
    licenseUrl: "https://github.com/crawl/crawl/blob/master/LICENSE",
    author: "Dungeon Crawl: Stone Soup Devteam",
    source: "https://github.com/crawl/crawl",
    externalPlay: {
      url: "https://crawl.nemelex.cards/",
      host: {
        en: "CNC WebTiles · South Korea server",
        ko: "CNC WebTiles · 한국 서버",
      },
      note: {
        en: "This is remote WebTiles play on the community server crawl.nemelex.cards, listed by the DCSS project for Gyeonggi, South Korea. Each server has its own account database and saves; register on the chosen server and follow its rules. Denny Games does not run the server or receive your account data.",
        ko: "DCSS 프로젝트 서버 안내에 경기 지역 서버로 올라온 crawl.nemelex.cards에서 원격 WebTiles 플레이를 엽니다. 서버마다 계정 데이터와 저장 공간이 다르므로 선택한 서버에 등록하고 자체 규칙을 확인하세요. 데니 게임즈는 서버를 운영하거나 계정 데이터를 받지 않습니다.",
      },
    },
    added: "2026-10-15",
    artwork: "/art/dcss.svg",
    artworkAlt: {
      en: "Original illustration of a tiled dungeon with a hero facing a monster",
      ko: "영웅이 몬스터와 마주한 타일형 던전을 그린 자체 일러스트",
    },
    text: {
      en: {
        title: "Dungeon Crawl: Stone Soup",
        subtitle: "A deep roguelike, one careful turn at a time.",
        description:
          "Dungeon Crawl: Stone Soup is the open-source successor to the 1990s Dungeon Crawl roguelike. Its WebTiles servers let you explore a changing dungeon in a browser, choose a character and pursue the Orb of Zot.",
        rules: [
          "Open the Korean WebTiles server, register a character name and choose the available game version or tutorial.",
          "Explore a procedurally generated dungeon, manage health, magic and equipment, and decide when to fight or retreat.",
          "Runs can end permanently. Accounts and saved characters belong to the selected community server, not Denny Games.",
        ],
        controls: [
          "Keyboard: WebTiles is designed around game commands. Check the server's help and the in-game command reference.",
          "The selected server uses a separate account and save database from other WebTiles servers.",
          "This is remote server play. Denny Games has not tested gameplay or device compatibility on this host.",
        ],
        tips: [
          "Choose the tutorial when learning the game for the first time.",
          "Read item and monster descriptions, and watch health and magic while exploring.",
          "Use a server near you and read its rules; the DCSS project lists separate public servers by region.",
        ],
      },
      ko: {
        title: "Dungeon Crawl: Stone Soup",
        subtitle: "신중하게 한 턴씩 내려가는 깊은 로그라이크.",
        description:
          "Dungeon Crawl: Stone Soup는 1990년대 Dungeon Crawl의 계보를 잇는 오픈소스 후속작입니다. WebTiles 서버에서 브라우저로 변화하는 던전을 탐험하고 캐릭터를 골라 Orb of Zot을 찾아보세요.",
        rules: [
          "한국 WebTiles 서버를 열고 캐릭터 이름을 등록한 뒤 제공되는 버전이나 튜토리얼을 고르세요.",
          "절차적으로 생성되는 던전을 탐험하고 체력·마법력·장비를 관리하며 싸우거나 물러날 때를 판단하세요.",
          "모험은 영구히 끝날 수 있습니다. 계정과 캐릭터 저장은 데니 게임즈가 아니라 선택한 커뮤니티 서버에 속합니다.",
        ],
        controls: [
          "키보드: WebTiles는 게임 명령 중심으로 조작합니다. 서버 도움말과 게임 안 명령 안내를 확인하세요.",
          "선택한 서버는 다른 WebTiles 서버와 별도 계정·저장 데이터베이스를 사용합니다.",
          "원격 서버 플레이입니다. 데니 게임즈는 이 호스트에서 실제 게임이나 기기 호환성을 시험하지 않았습니다.",
        ],
        tips: [
          "처음 시작한다면 튜토리얼을 골라 기본 조작을 익히세요.",
          "아이템과 몬스터 설명을 읽고 탐험 중 체력과 마법력을 확인하세요.",
          "가까운 서버를 선택하고 규칙을 확인하세요. DCSS 프로젝트는 지역별 공개 서버를 안내합니다.",
        ],
      },
    },
  },
];
gameCandidates.push(
  ...openSourceGames,
  ...externalBrowserGames,
  ...eraExternalGames,
  ...worldOpenGames,
);
// Publish only games that launch under the Denny Games origin. External hosts
// remain research candidates until their code and assets are imported locally.
export const games: Game[] = gameCandidates.filter(
  (game) => !game.externalPlay,
);
// Scale fixtures are local/CI-only and never part of a normal production build.
if (import.meta.env?.SCALE_TEST === "1") {
  const originals = [...games];
  games.length = 0;
  for (let i = 0; i < 1000; i++) {
    const base = originals[i % originals.length]!;
    games.push({
      ...base,
      id: `fixture-${i}`,
      category: i % 2 ? "puzzle" : "arcade",
    });
  }
}

export function gameById(id: string) {
  return games.find((game) => game.id === id);
}
export function categoryGames(category: string) {
  return editorialOrder(games.filter((game) => game.category === category));
}
