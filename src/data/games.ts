import type { Locale } from "../lib/types";
import crisp from "./crisp.json" with { type: "json" };
import { crispCycleGames } from "./crisp-cycles";
import { boardGames } from "./board-games";
import { editorialOrder } from "./editorial";
import type { ControlStyle } from "./collections";
export const categories = [
  "board",
  "puzzle",
  "arcade",
  "action",
  "shooting",
  "racing",
  "sports",
] as const;
export type Category = (typeof categories)[number];
export interface GameCopy {
  title: string;
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
  inputs: ("touch" | "keyboard" | "gamepad")[];
  license: string;
  author: string;
  source: string;
  added: string;
  artwork: string;
  text: Record<Locale, GameCopy>;
}
export const games: Game[] = [
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
        subtitle: "Small moves. Bigger numbers.",
        description:
          "Slide matching numbers together and build toward 2048. This clean-asset adaptation credits Gabriele Cirulli’s MIT game and adds the shared Denny Games controls.",
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
        subtitle: "작은 이동이 큰 숫자로.",
        description:
          "같은 숫자를 밀어 합치고 2048을 향해 나아가세요. Gabriele Cirulli의 MIT 게임 규칙을 바탕으로 새 화면과 공통 조작을 적용했습니다.",
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
games.push({
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
games.push({
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
games.push({
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
games.push(
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
games.push(...boardGames);
games.push(...crispCycleGames);
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
