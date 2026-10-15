import type { Locale } from "../lib/types";
import type { Game } from "./games";

type Copy = {
  title: string;
  subtitle: string;
  description: string;
  objective: string;
  mode: string;
  controls: string;
  tip: string;
};

type Listing = {
  id: string;
  category: Game["category"];
  controlStyle: Game["controlStyle"];
  color: string;
  inputs: Game["inputs"];
  tags: Record<Locale, string[]>;
  license: string;
  licenseUrl: string;
  author: string;
  source: string;
  url: string;
  host: Record<Locale, string>;
  hostNote: Record<Locale, string>;
  artworkAlt: Record<Locale, string>;
  copy: Record<Locale, Copy>;
};

const libreRoot = "https://github.com/linkingtechnologies/libre-arcade";
const libreHost = "https://linkingtechnologies.github.io/libre-arcade";
const libreLicenseUrl = `${libreRoot}/blob/main/LICENSE`;
const libreSource = (slug: string) => `${libreRoot}/tree/main/${slug}`;
const libreUrl = (path: string) => `${libreHost}/${path}`;

const libreNote: Record<Locale, string> = {
  en: "This browser restoration is hosted by the Libre Arcade project on GitHub Pages. Its source repository documents the GPL-3.0 project code plus each game's upstream code and separate asset terms. Denny Games links out only; it does not host the build, game data or artwork. We have not verified a complete external game session or device compatibility.",
  ko: "Libre Arcade 프로젝트가 GitHub Pages에서 브라우저 복원판을 호스팅합니다. 소스 저장소에서 GPL-3.0 프로젝트 코드와 게임별 원본 코드·별도 자산 조건을 안내합니다. 데니 게임즈는 링크만 제공하며 빌드·게임 데이터·그림을 호스팅하지 않습니다. 외부 게임의 전체 플레이나 기기 호환성은 검증하지 않았습니다.",
};

const libreHostName: Record<Locale, string> = {
  en: "Libre Arcade project browser port",
  ko: "Libre Arcade 프로젝트 브라우저 포트",
};

const listings: Listing[] = [
  {
    id: "grugnetto-klondike",
    category: "puzzle",
    controlStyle: "pointer",
    color: "yellow",
    inputs: ["mouse", "keyboard"],
    tags: {
      en: [
        "klondike solitaire",
        "solitaire card game",
        "patience card game",
        "solvable solitaire",
        "open source card game",
        "browser solitaire",
      ],
      ko: [
        "클론다이크 솔리테어",
        "솔리테어 카드게임",
        "패이션스 카드 게임",
        "해답 보장 솔리테어",
        "오픈소스 카드게임",
        "브라우저 솔리테어",
      ],
    },
    license: "GPL-3.0 browser port · MIT source engines · CC0 card decks",
    licenseUrl: libreLicenseUrl,
    author:
      "Libre Arcade contributors; source engines by Radovan Janjic and DevilSquirrel",
    source: libreSource("klondike"),
    url: libreUrl("klondike/public/index.html"),
    host: libreHostName,
    hostNote: libreNote,
    artworkAlt: {
      en: "Original Denny Games illustration of layered playing cards",
      ko: "겹쳐 놓은 카드를 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "Grugnetto's Klondike",
        subtitle: "A familiar solitaire deal with a verified way through.",
        description:
          "Play classic Klondike solitaire with one-card or three-card stock draws. The source project says each generated deal is checked for a solvable path and stores game data locally on that host.",
        objective:
          "Move every card to the four suit foundations in ascending order from Ace to King.",
        mode: "Build tableau piles downward in alternating colors, and uncover face-down cards to open more moves.",
        controls:
          "Use the cards and stock controls shown on the game board; its menu selects one-card or three-card draws.",
        tip: "Check the stock-draw setting before starting; it changes how many cards you see at once.",
      },
      ko: {
        title: "Grugnetto's Klondike",
        subtitle: "익숙한 솔리테어를 해답이 있는 판으로 즐겨요.",
        description:
          "한 장 또는 세 장씩 뽑는 클래식 클론다이크 솔리테어입니다. 제작 프로젝트는 생성한 모든 판에 해답이 있는지 확인한다고 안내하며, 게임 데이터는 해당 호스트에 저장됩니다.",
        objective:
          "각 무늬의 카드를 에이스부터 킹까지 오름차순으로 네 기초 더미에 옮기세요.",
        mode: "색을 번갈아 내림차순으로 배열하고 뒤집힌 카드를 열어 다음 수를 만드세요.",
        controls:
          "게임 보드의 카드와 덱 조작을 이용하세요. 메뉴에서 한 장 또는 세 장씩 뽑기를 고릅니다.",
        tip: "새 판을 시작하기 전에 덱에서 몇 장을 뽑을지 확인하세요. 한 번에 볼 수 있는 카드 수가 달라집니다.",
      },
    },
  },
  {
    id: "briscola",
    category: "board",
    controlStyle: "pointer",
    color: "rust",
    inputs: ["mouse"],
    tags: {
      en: [
        "briscola",
        "Italian card game",
        "trick taking card game",
        "Italian playing cards",
        "card game AI",
        "browser card game",
      ],
      ko: [
        "브리스콜라",
        "이탈리아 카드게임",
        "트릭 테이킹 카드게임",
        "이탈리아 플레잉 카드",
        "카드게임 인공지능",
        "브라우저 카드게임",
      ],
    },
    license:
      "GPL-3.0 browser project · source AIs retain GPL, MIT and CC BY terms",
    licenseUrl: libreLicenseUrl,
    author: "Libre Arcade contributors and the credited Briscola AI authors",
    source: libreSource("briscola"),
    url: libreUrl("briscola/index.html"),
    host: libreHostName,
    hostNote: libreNote,
    artworkAlt: {
      en: "Original Denny Games illustration of a trump card and table",
      ko: "으뜸패 카드와 카드 테이블을 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "Grugnetto's Briscola",
        subtitle: "An Italian trick-taking classic with several AI styles.",
        description:
          "Play Briscola, the Italian trick-taking card game, against computer players or compare different AI approaches in the project's arena.",
        objective:
          "Win tricks containing high-value cards; the team with more than half of the 120 card points wins the hand.",
        mode: "The revealed trump suit can beat cards from other suits, while cards within a suit follow Briscola's rank order.",
        controls:
          "Choose a card from your hand with the pointer. The host page provides its own game menu and instructions.",
        tip: "Remember which high-point cards have already appeared before deciding whether to spend a trump.",
      },
      ko: {
        title: "Grugnetto's Briscola",
        subtitle: "여러 AI 스타일과 겨루는 이탈리아 트릭 테이킹 게임.",
        description:
          "컴퓨터 플레이어와 이탈리아 카드게임 브리스콜라를 겨루거나 프로젝트 아레나에서 서로 다른 AI 전략을 비교해보세요.",
        objective:
          "점수가 높은 카드를 가져오세요. 총 120점 중 절반을 넘게 얻은 쪽이 한 판을 이깁니다.",
        mode: "공개된 으뜸패 무늬는 다른 무늬를 이길 수 있고, 같은 무늬 안에서는 브리스콜라의 카드 서열을 따릅니다.",
        controls:
          "포인터로 손에 든 카드를 고르세요. 메뉴와 자세한 안내는 외부 호스트가 제공합니다.",
        tip: "으뜸패를 쓸지 결정하기 전에 점수가 높은 카드가 이미 나왔는지 기억해두세요.",
      },
    },
  },
  {
    id: "netris",
    category: "arcade",
    controlStyle: "directional",
    color: "blue",
    inputs: ["keyboard"],
    tags: {
      en: [
        "Netris",
        "1990s falling block game",
        "retro block puzzle",
        "single player blocks",
        "open source tetris-like",
        "browser block game",
      ],
      ko: [
        "네트리스",
        "1990년대 낙하 블록 게임",
        "레트로 블록 퍼즐",
        "싱글 플레이 블록 게임",
        "오픈소스 테트리스 스타일",
        "브라우저 블록 게임",
      ],
    },
    license: "GPL-3.0 browser port · original Netris source GPL-2.0-or-later",
    licenseUrl: libreLicenseUrl,
    author: "Libre Arcade contributors; original Netris by Mark H. Weaver",
    source: libreSource("netris"),
    url: libreUrl("netris/public/index.html"),
    host: libreHostName,
    hostNote: libreNote,
    artworkAlt: {
      en: "Original Denny Games illustration of falling block shapes",
      ko: "떨어지는 블록 모양을 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "Netris",
        subtitle: "A faithful single-player block game from the 1990s.",
        description:
          "A browser port of the single-player core of Netris 0.52. Its source project preserves the original's no-score, no-automatic-speed-up rules and includes an optional autopilot.",
        objective:
          "Place falling shapes to complete horizontal rows and keep the stack below the top of the board.",
        mode: "The source version has no score display or automatic speed increase; the included autopilot can play for you.",
        controls:
          "Keyboard: Left/Right or J/L move, Up or K rotates, Down or Space soft-drops, P hard-drops, S pauses, R restarts and A toggles autopilot.",
        tip: "Use the autopilot to inspect how this older version places pieces without a score or automatic speed ramp.",
      },
      ko: {
        title: "Netris",
        subtitle: "1990년대 1인용 블록 게임을 브라우저에서.",
        description:
          "Netris 0.52의 1인용 핵심 규칙을 브라우저로 옮긴 게임입니다. 원작처럼 점수와 자동 속도 상승이 없고 선택형 자동 플레이가 포함됩니다.",
        objective:
          "떨어지는 모양을 놓아 가로줄을 완성하고 블록이 보드 위까지 쌓이지 않게 하세요.",
        mode: "원본 규칙에는 점수 표시나 자동 속도 상승이 없습니다. 자동 플레이를 켜서 컴퓨터에게 맡길 수도 있습니다.",
        controls:
          "키보드: 좌우 방향키 또는 J/L 이동, 위쪽 방향키 또는 K 회전, 아래쪽 방향키 또는 Space 천천히 내리기, P 즉시 내리기, S 일시정지, R 재시작, A 자동 플레이.",
        tip: "점수와 속도 상승이 없는 이 버전의 블록 배치를 보고 싶다면 자동 플레이를 사용해보세요.",
      },
    },
  },
  {
    id: "netrok",
    category: "action",
    controlStyle: "directional",
    color: "mint",
    inputs: ["keyboard", "touch"],
    tags: {
      en: [
        "Netrok",
        "2004 platform game",
        "retro platformer",
        "20 platform levels",
        "level editor game",
        "browser platform game",
      ],
      ko: [
        "네트록",
        "2004 플랫폼 게임",
        "레트로 플랫폼 게임",
        "플랫폼 스테이지 20개",
        "레벨 편집 게임",
        "브라우저 플랫폼 게임",
      ],
    },
    license:
      "GPL-3.0 browser port · original Netrok and SFont GPL-2.0-or-later",
    licenseUrl: libreLicenseUrl,
    author: "Libre Arcade contributors; original game by Ioan-Tudor Parvulescu",
    source: libreSource("netrok"),
    url: libreUrl("netrok/index.html"),
    host: libreHostName,
    hostNote: libreNote,
    artworkAlt: {
      en: "Original Denny Games illustration of a platform path and shield",
      ko: "플랫폼 길과 방패를 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "Netrok",
        subtitle: "A classic platform adventure with a level editor.",
        description:
          "Climb ladders, cross hazards and use shields in a 2004 platform game restored for the browser. The host includes 20 original levels, checkpoints, touch controls and a level editor.",
        objective:
          "Reach the end of each level while avoiding enemies and spikes; collect shield coins to gain protection.",
        mode: "Standard runs save progress on the host. Custom levels and cheat runs are separate from normal high scores.",
        controls:
          "Keyboard: Left/Right move, Up/Down climb, Space or Alt jumps, Shift or Ctrl runs. On-screen touch controls are available from the host page.",
        tip: "Place the single checkpoint flag carefully: it costs score and cannot be moved again during that level.",
      },
      ko: {
        title: "Netrok",
        subtitle: "레벨 편집기가 있는 클래식 플랫폼 모험.",
        description:
          "사다리를 오르고 장애물을 넘으며 방패를 쓰는 2004년 플랫폼 게임의 브라우저 복원판입니다. 원래 스테이지 20개, 체크포인트, 터치 조작과 레벨 편집기가 있습니다.",
        objective:
          "적과 가시에 부딪히지 않고 각 스테이지 끝까지 이동하세요. 방패 코인을 모으면 보호막을 얻습니다.",
        mode: "일반 진행 상태는 호스트에 저장됩니다. 직접 만든 스테이지와 치트 플레이 기록은 일반 최고 점수에 포함되지 않습니다.",
        controls:
          "키보드: 좌우 이동, 위아래 사다리 오르기, Space 또는 Alt 점프, Shift 또는 Ctrl 달리기. 호스트 페이지에서 터치 버튼을 사용할 수 있습니다.",
        tip: "체크포인트 깃발은 점수를 소모하고 스테이지마다 한 번만 놓을 수 있으니 위치를 잘 고르세요.",
      },
    },
  },
  {
    id: "njam",
    category: "action",
    controlStyle: "directional",
    color: "rust",
    inputs: ["keyboard"],
    tags: {
      en: [
        "Njam",
        "Bomberman style maze game",
        "local two player maze game",
        "retro bomb arena",
        "open source arcade game",
        "browser maze game",
      ],
      ko: [
        "냠",
        "봄버맨 스타일 미로 게임",
        "로컬 2인 미로 게임",
        "레트로 폭탄 아레나",
        "오픈소스 아케이드 게임",
        "브라우저 미로 게임",
      ],
    },
    license: "GPL-3.0 browser port · Njam source GPL-2.0-or-later",
    licenseUrl: libreLicenseUrl,
    author: "Libre Arcade contributors; original game by Milan Babuskov",
    source: libreSource("njam"),
    url: libreUrl("njam/index.html"),
    host: libreHostName,
    hostNote: libreNote,
    artworkAlt: {
      en: "Original Denny Games illustration of a maze and a glowing bomb",
      ko: "미로와 빛나는 폭탄을 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "Njam 1.21",
        subtitle: "A maze arena with duel mode and a level editor.",
        description:
          "Move through maze arenas in this open-source action game. The browser port includes the classic levels, a level editor and local duel play; online host/join is not enabled in this edition.",
        objective:
          "Use the arena's bomb-and-maze rules to outlast the opposing player or clear the selected challenge.",
        mode: "Choose from the bundled level sets or open the editor to create and save a custom level file.",
        controls:
          "Keyboard controls are explained in the game's Instructions panel; the exact player keys depend on the selected mode.",
        tip: "Open Instructions before starting a duel so each player can see their assigned keys.",
      },
      ko: {
        title: "Njam 1.21",
        subtitle: "대전 모드와 레벨 편집기가 있는 미로 아레나.",
        description:
          "미로 아레나를 누비는 오픈소스 액션 게임입니다. 브라우저판에는 클래식 레벨, 편집기와 로컬 대전이 있으며 이 버전에서는 온라인 방 만들기·참가를 지원하지 않습니다.",
        objective:
          "폭탄과 미로 규칙을 이용해 상대보다 오래 버티거나 선택한 도전을 완료하세요.",
        mode: "포함된 레벨 세트에서 고르거나 편집기에서 직접 만든 레벨 파일을 저장해 플레이하세요.",
        controls:
          "키보드 조작은 게임의 Instructions 메뉴에서 확인하세요. 플레이 방식에 따라 각 플레이어의 키가 달라집니다.",
        tip: "대전을 시작하기 전에 Instructions를 열어 각 플레이어가 사용할 키를 확인하세요.",
      },
    },
  },
  {
    id: "naval-battle",
    category: "board",
    controlStyle: "pointer",
    color: "blue",
    inputs: ["mouse"],
    tags: {
      en: [
        "Naval Battle",
        "Battleship game",
        "battleship vs computer",
        "five AI difficulties",
        "classic naval strategy",
        "browser board game",
      ],
      ko: [
        "해전",
        "배틀십 게임",
        "컴퓨터와 배틀십",
        "AI 난이도 5단계",
        "클래식 해전 전략",
        "브라우저 보드게임",
      ],
    },
    license:
      "GPL-3.0 browser port · source AIs retain GPL-2.0-or-later and GPLv3 terms",
    licenseUrl: libreLicenseUrl,
    author:
      "Libre Arcade contributors; historical AI authors are credited in the game",
    source: libreSource("naval-battle"),
    url: libreUrl("naval-battle/index.html"),
    host: libreHostName,
    hostNote: libreNote,
    artworkAlt: {
      en: "Original Denny Games illustration of a naval grid and ship",
      ko: "해전 격자와 배를 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "Grugnetto's Naval Battle",
        subtitle: "Place a fleet, then search the grid for your opponent.",
        description:
          "A browser Battleship game built around historical computer opponents, with a simplified player interface and five AI difficulty settings.",
        objective:
          "Find and sink every ship in the opposing fleet before the computer finds yours.",
        mode: "Place your fleet, then take turns choosing grid cells to fire at; the selected AI level changes the opponent behavior.",
        controls:
          "Use the pointer to place ships and select a target cell. The host's game menu explains placement and turn rules.",
        tip: "Spread your searches instead of firing repeatedly into the same small area.",
      },
      ko: {
        title: "Grugnetto's Naval Battle",
        subtitle: "함대를 배치하고 격자에서 상대를 찾아보세요.",
        description:
          "역사적 컴퓨터 대국 알고리즘을 바탕으로 만든 브라우저 배틀십 게임입니다. 간결한 플레이 화면과 AI 난이도 다섯 단계가 있습니다.",
        objective:
          "컴퓨터가 내 함대를 찾기 전에 상대 함선 전체를 찾아 격침하세요.",
        mode: "함대를 배치한 다음 번갈아 격자 칸을 공격하세요. 선택한 AI 난이도에 따라 상대 행동이 달라집니다.",
        controls:
          "포인터로 배를 놓고 공격할 칸을 선택하세요. 배치와 차례 규칙은 호스트의 게임 메뉴에서 확인할 수 있습니다.",
        tip: "같은 좁은 구역을 반복해서 공격하기보다 탐색 범위를 넓게 잡아보세요.",
      },
    },
  },
  {
    id: "for-science",
    category: "strategy",
    controlStyle: "pointer",
    color: "mint",
    inputs: ["mouse", "touch"],
    tags: {
      en: [
        "For Science game",
        "turn based match 3 duel",
        "match three strategy game",
        "Dr Z puzzle battle",
        "PyWeek game",
        "browser strategy puzzle",
      ],
      ko: [
        "포 사이언스 게임",
        "턴제 매치3 대전",
        "같은 색 3개 전략 게임",
        "닥터 Z 퍼즐 전투",
        "파이위크 게임",
        "브라우저 전략 퍼즐",
      ],
    },
    license:
      "GPL-3.0-or-later source and browser port · third-party media have separate notices",
    licenseUrl: libreLicenseUrl,
    author: "Libre Arcade contributors; original game by Juan J. Martínez",
    source: libreSource("for-science"),
    url: libreUrl("for-science/public/index.html"),
    host: libreHostName,
    hostNote: libreNote,
    artworkAlt: {
      en: "Original Denny Games illustration of a match-three battle grid",
      ko: "매치3 대전 격자를 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "For Science!",
        subtitle: "Match tiles to attack a rival laboratory.",
        description:
          "A turn-based match-three duel: match cells to collect money, launch attacks or repair shields before Dr Z destroys your base.",
        objective: "Destroy Dr Z's base before the rival destroys yours.",
        mode: "On each turn, swap adjacent cells or spend an available item to change the board or protect your base.",
        controls:
          "Mouse or touch: select two neighboring cells or choose an item. The host menu includes a How to Play guide.",
        tip: "Use the demo first if you want to see how a match creates an attack or shield repair.",
      },
      ko: {
        title: "For Science!",
        subtitle: "타일을 맞춰 상대 연구 기지를 공격하세요.",
        description:
          "같은 칸을 세 개 이상 맞추는 턴제 대전입니다. 돈·공격·방패 수리를 모아 Dr Z보다 먼저 상대 기지를 무너뜨리세요.",
        objective: "상대가 내 기지를 무너뜨리기 전에 Dr Z의 기지를 파괴하세요.",
        mode: "매 턴 이웃한 칸을 바꾸거나 아이템을 사용해 보드를 바꾸고 기지를 보호하세요.",
        controls:
          "마우스 또는 터치: 인접한 두 칸을 선택하거나 아이템을 고르세요. 호스트 메뉴에서 How to Play 안내를 볼 수 있습니다.",
        tip: "같은 칸 맞추기가 공격이나 방패 회복으로 이어지는 방식을 보고 싶다면 데모부터 시작하세요.",
      },
    },
  },
  {
    id: "donkey-bolonkey",
    category: "puzzle",
    controlStyle: "pointer",
    color: "yellow",
    inputs: ["mouse", "keyboard"],
    tags: {
      en: [
        "Donkey Bolonkey",
        "color matching puzzle",
        "six level color puzzle",
        "retro puzzle game",
        "GPL browser game",
        "browser color match",
      ],
      ko: [
        "동키 볼론키",
        "색 맞추기 퍼즐",
        "색 퍼즐 6레벨",
        "레트로 퍼즐 게임",
        "GPL 브라우저 게임",
        "브라우저 색 맞추기",
      ],
    },
    license:
      "GPL-3.0-or-later browser port · original source GPL-2.0-or-later; unclear media omitted",
    licenseUrl: libreLicenseUrl,
    author: "Libre Arcade contributors; original game by David A. Capello",
    source: libreSource("donkey-bolonkey"),
    url: libreUrl("donkey-bolonkey/public/index.html"),
    host: libreHostName,
    hostNote: libreNote,
    artworkAlt: {
      en: "Original Denny Games illustration of colorful matching tiles",
      ko: "색을 맞추는 타일을 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "Donkey Bolonkey",
        subtitle: "A compact color-matching puzzle from 2001.",
        description:
          "Clear six historical color-matching levels in a restored browser port. The game uses newly drawn browser graphics because the original media bundle is not included.",
        objective:
          "Match colors on the board to complete the current level's puzzle goal.",
        mode: "The host includes six levels, a name field and local high-score saving; its How to Play panel describes the current board rules.",
        controls:
          "Use the on-screen left/right and swap controls or the keyboard actions listed in How to Play.",
        tip: "Open How to Play before the first move; each level uses the same color-matching idea with its own layout.",
      },
      ko: {
        title: "Donkey Bolonkey",
        subtitle: "2001년 색 맞추기 퍼즐을 짧게 즐겨요.",
        description:
          "브라우저 복원판에서 과거의 색 맞추기 스테이지 여섯 개를 풀어보세요. 원본 미디어 묶음은 포함하지 않고 새 브라우저 그림을 사용합니다.",
        objective: "보드에서 색을 맞춰 현재 스테이지의 퍼즐 목표를 완성하세요.",
        mode: "호스트에는 여섯 스테이지, 이름 입력과 로컬 최고 점수 저장이 있습니다. How to Play에서 현재 보드 규칙을 확인하세요.",
        controls:
          "화면의 좌우·교환 버튼을 쓰거나 How to Play에 나온 키보드 조작을 사용하세요.",
        tip: "첫 수를 두기 전에 How to Play를 여세요. 같은 색 맞추기 방식이지만 스테이지마다 배치가 다릅니다.",
      },
    },
  },
  {
    id: "psy-pong-3d",
    category: "sports",
    controlStyle: "directional",
    color: "violet",
    inputs: ["keyboard"],
    tags: {
      en: [
        "PSY PONG 3D",
        "3D pong game",
        "WebGL paddle game",
        "retro 3D sports game",
        "computer paddle opponent",
        "browser pong",
      ],
      ko: [
        "사이 퐁 3D",
        "3D 퐁 게임",
        "웹지엘 패들 게임",
        "레트로 3D 스포츠 게임",
        "컴퓨터 패들 상대",
        "브라우저 퐁",
      ],
    },
    license:
      "GPL-3.0-or-later code and browser port · original textures replaced",
    licenseUrl: libreLicenseUrl,
    author: "Libre Arcade contributors; original game by Quetzy Garcia",
    source: libreSource("psypong3d"),
    url: libreUrl("psypong3d/public/index.html"),
    host: libreHostName,
    hostNote: libreNote,
    artworkAlt: {
      en: "Original Denny Games illustration of paddles and a bouncing ball in perspective",
      ko: "원근감 있는 패들과 튀는 공을 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "PSY PONG 3D",
        subtitle: "A WebGL paddle duel with a changing perspective.",
        description:
          "Play a three-dimensional take on Pong with diagonal ball motion, paddle warps and a computer opponent that scales with the selected level.",
        objective:
          "Return the ball past the opponent's paddle and protect your own side of the court.",
        mode: "The original textures are not part of this browser port; the host uses newly created replacement graphics.",
        controls:
          "Use the displayed up/down controls or the keyboard keys shown by the game menu to move your paddle.",
        tip: "Watch the ball's diagonal path and prepare for the side-swap effect before the next return.",
      },
      ko: {
        title: "PSY PONG 3D",
        subtitle: "시점이 바뀌는 WebGL 패들 대전.",
        description:
          "대각선으로 움직이는 공, 패들 워프와 선택 난이도에 따라 달라지는 컴퓨터 상대가 있는 3차원 퐁 게임입니다.",
        objective:
          "상대 패들을 지나 공을 보내고 내 코트 쪽으로 들어오는 공을 막으세요.",
        mode: "원본 텍스처는 브라우저판에 포함되지 않았으며 호스트가 새로 만든 그림을 사용합니다.",
        controls:
          "화면에 표시된 위·아래 버튼이나 게임 메뉴가 안내하는 키보드 키로 패들을 움직이세요.",
        tip: "공의 대각선 경로를 살피고 다음 타구 전에 좌우가 바뀌는 효과를 예상하세요.",
      },
    },
  },
  {
    id: "wok",
    category: "arcade",
    controlStyle: "directional",
    color: "rust",
    inputs: ["keyboard"],
    tags: {
      en: [
        "Wok game Kenta Cho",
        "catching arcade game",
        "falling ball action",
        "combo score game",
        "BSD open source game",
        "browser arcade",
      ],
      ko: [
        "웍 게임 켄타 초",
        "받아내기 아케이드 게임",
        "떨어지는 공 액션",
        "콤보 점수 게임",
        "BSD 오픈소스 게임",
        "브라우저 아케이드",
      ],
    },
    license:
      "BSD-2-Clause-style original code/assets · GPL-3.0-or-later browser port",
    licenseUrl: libreLicenseUrl,
    author: "Libre Arcade contributors; original game by Kenta Cho",
    source: libreSource("wok"),
    url: libreUrl("wok/public/index.html"),
    host: libreHostName,
    hostNote: libreNote,
    artworkAlt: {
      en: "Original Denny Games illustration of a tilted wok catching falling objects",
      ko: "떨어지는 물체를 받는 기울어진 웍을 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "Wok",
        subtitle: "Catch falling balls and turn them into combo throws.",
        description:
          "A fast arcade game by Kenta Cho: tilt a wok to catch falling balls, then throw them back for combo points. The project's license record covers the original code and bundled art/audio.",
        objective:
          "Keep catching and returning the falling balls while building a higher combo score.",
        mode: "The browser port preserves the original game's graphics and sound under its BSD-style permission notice.",
        controls:
          "Use the keyboard movement keys shown by the game; close the host tab to quit the full-screen play view.",
        tip: "Move under a falling ball early, then time the return to keep the combo going.",
      },
      ko: {
        title: "Wok",
        subtitle: "떨어지는 공을 받고 콤보로 되돌려 보내요.",
        description:
          "켄타 초의 빠른 아케이드 게임입니다. 웍을 기울여 떨어지는 공을 받고 다시 던져 콤보 점수를 쌓으세요. 프로젝트의 BSD 스타일 허가는 원본 코드와 포함된 그림·소리를 다룹니다.",
        objective:
          "떨어지는 공을 계속 받고 되돌려 보내 더 높은 콤보 점수를 만드세요.",
        mode: "브라우저 포트는 BSD 스타일 허가에 따라 원본 그림과 소리를 유지합니다.",
        controls:
          "게임이 표시하는 키보드 이동 키를 사용하세요. 전체 화면 플레이를 끝내려면 호스트 탭을 닫으세요.",
        tip: "공이 떨어진 뒤 급히 따라가기보다 미리 밑으로 이동하고 콤보가 끊기지 않게 되돌려보세요.",
      },
    },
  },
  {
    id: "glparchis",
    category: "board",
    controlStyle: "pointer",
    color: "mint",
    inputs: ["mouse"],
    tags: {
      en: [
        "glParchis",
        "Parchis board game",
        "Parchis AI game",
        "3 4 6 8 player board",
        "Spanish race game",
        "browser board game",
      ],
      ko: [
        "글파르치스",
        "파르치스 보드게임",
        "파르치스 AI 게임",
        "3 4 6 8인 보드게임",
        "스페인식 레이스 게임",
        "브라우저 보드게임",
      ],
    },
    license: "GPL-3.0-or-later browser port · original glParchis GPL-3.0-only",
    licenseUrl: libreLicenseUrl,
    author:
      "Libre Arcade contributors; original game by Mariano Muñoz (Turulomio)",
    source: libreSource("glparchis"),
    url: libreUrl("glparchis/public/index.html"),
    host: libreHostName,
    hostNote: libreNote,
    artworkAlt: {
      en: "Original Denny Games illustration of colored race tokens on a board",
      ko: "보드 위 색색의 경주 말을 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "glParchis",
        subtitle: "A classic Parchís race with mixed human and CPU seats.",
        description:
          "Set up a Parchís board for three, four, six or eight players, mixing human seats with computer opponents. The browser restoration preserves the original probabilistic AI behavior.",
        objective:
          "Race your tokens around the board and into your home lane before the other players finish.",
        mode: "Choose the board size, player seats and computer difficulty before starting a new match.",
        controls:
          "Use the pointer to roll the die, choose a token and follow the move shown by the host.",
        tip: "Check the selected board and number of players before beginning; Parchís layouts change with the table size.",
      },
      ko: {
        title: "glParchis",
        subtitle: "사람과 컴퓨터가 함께 달리는 클래식 파르치스.",
        description:
          "3·4·6·8인용 파르치스 보드를 설정하고 사람과 컴퓨터 자리를 섞어 대국하세요. 브라우저 복원판은 원작 확률형 AI의 행동을 보존합니다.",
        objective:
          "다른 플레이어보다 먼저 말을 보드 한 바퀴 돌려 내 집으로 들여보내세요.",
        mode: "새 대국 전에 보드 크기, 플레이어 자리와 컴퓨터 난이도를 고르세요.",
        controls:
          "포인터로 주사위를 굴리고 말을 고른 뒤 호스트가 보여주는 이동을 진행하세요.",
        tip: "시작 전에 보드 종류와 인원수를 확인하세요. 파르치스는 인원수에 따라 판 모양이 달라집니다.",
      },
    },
  },
  {
    id: "game-of-the-goose",
    category: "board",
    controlStyle: "pointer",
    color: "yellow",
    inputs: ["mouse", "touch"],
    tags: {
      en: [
        "Game of the Goose",
        "Game of Goose board game",
        "European race board game",
        "two dice race game",
        "local multiplayer board game",
        "browser board game",
      ],
      ko: [
        "구스 보드게임",
        "거위 게임",
        "유럽식 레이스 보드게임",
        "주사위 두 개 레이스",
        "로컬 멀티플레이 보드게임",
        "브라우저 보드게임",
      ],
    },
    license:
      "GPL-3.0 browser port · traditional rules and public-domain board art",
    licenseUrl: libreLicenseUrl,
    author:
      "Libre Arcade contributors; based on the traditional Game of the Goose",
    source: libreSource("grugnettos-goose"),
    url: libreUrl("grugnettos-goose/public/index.html"),
    host: libreHostName,
    hostNote: libreNote,
    artworkAlt: {
      en: "Original Denny Games illustration of a goose-shaped race track and dice",
      ko: "거위 모양 경주 길과 주사위를 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "Grugnetto's Goose",
        subtitle: "A traditional 63-space race for two to four players.",
        description:
          "Race around the classic 63-space Game of the Goose board with two dice. The host supports two to four local players, exact-finish rules and special spaces such as the bridge, inn and maze.",
        objective:
          "Reach space 63 exactly; if a roll goes past the finish, move backward by the extra spaces.",
        mode: "Landing on a goose repeats the move, while several special spaces move or delay a token according to the classic rules.",
        controls:
          "Choose the player count and roll the dice with the host's on-screen controls.",
        tip: "Read the Rules panel before playing; special spaces can send you forward, backward or make you miss turns.",
      },
      ko: {
        title: "Grugnetto's Goose",
        subtitle: "두 명에서 네 명이 즐기는 63칸 전통 레이스.",
        description:
          "주사위 두 개를 굴려 전통적인 구스 보드게임의 63칸을 달려보세요. 호스트에서 2~4인 로컬 플레이와 정확히 도착하기 규칙, 다리·여관·미로 같은 특수 칸을 제공합니다.",
        objective:
          "63번 칸에 정확히 도착하세요. 결승을 넘어가면 초과한 칸 수만큼 뒤로 돌아갑니다.",
        mode: "거위 칸에 도착하면 한 번 더 이동하며 일부 특수 칸은 규칙에 따라 말을 이동시키거나 차례를 미룹니다.",
        controls: "인원수를 고르고 호스트 화면의 조작으로 주사위를 굴리세요.",
        tip: "시작 전에 Rules 패널을 읽어보세요. 특수 칸에서 앞으로 가거나 뒤로 돌아가고 차례를 쉴 수도 있습니다.",
      },
    },
  },
  {
    id: "grugnetto-go",
    category: "action",
    controlStyle: "directional",
    color: "mint",
    inputs: ["keyboard"],
    tags: {
      en: [
        "Grugnetto Go",
        "open source platformer",
        "indie browser platform game",
        "melonJS game",
        "retro inspired platformer",
        "browser action game",
      ],
      ko: [
        "그루그네토 고",
        "오픈소스 플랫폼 게임",
        "인디 브라우저 플랫폼 게임",
        "멜론JS 게임",
        "레트로풍 플랫폼 게임",
        "브라우저 액션 게임",
      ],
    },
    license:
      "GPL-3.0 project code · third-party libraries and CC0/CC assets are credited in-game",
    licenseUrl: libreLicenseUrl,
    author: "Libre Arcade contributors",
    source: libreSource("grugnetto-go"),
    url: libreUrl("grugnetto-go/public/index.html"),
    host: libreHostName,
    hostNote: libreNote,
    artworkAlt: {
      en: "Original Denny Games illustration of a platform path with a star",
      ko: "별이 있는 플랫폼 길을 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "Grugnetto Go!",
        subtitle:
          "An original platform adventure from the Libre Arcade collection.",
        description:
          "Jump through an original browser platform game built for the Libre Arcade collection. Its project credits identify the game code, third-party libraries and included art licenses.",
        objective:
          "Cross the level by jumping between platforms and avoiding the hazards shown in the game.",
        mode: "This title was created for the collection rather than ported from an older release; read its in-game controls and credits for details.",
        controls:
          "Use the keyboard bindings shown by the game menu to move, jump and pause.",
        tip: "Try a short jump first to learn the game's movement before committing to a longer gap.",
      },
      ko: {
        title: "Grugnetto Go!",
        subtitle: "Libre Arcade 컬렉션에서 만든 오리지널 플랫폼 모험.",
        description:
          "Libre Arcade 컬렉션을 위해 만든 오리지널 브라우저 플랫폼 게임에서 점프해보세요. 프로젝트 크레딧에서 게임 코드·외부 라이브러리·그림 라이선스를 안내합니다.",
        objective:
          "플랫폼을 뛰어다니며 게임에 표시된 위험 요소를 피하고 레벨을 통과하세요.",
        mode: "오래된 게임을 포팅한 작품이 아니라 컬렉션을 위해 제작한 게임입니다. 게임 안 조작법과 크레딧을 확인하세요.",
        controls:
          "이동·점프·일시정지에 사용하는 키는 게임 메뉴에서 확인하세요.",
        tip: "긴 틈을 건너기 전에 짧게 점프해 움직임을 익혀보세요.",
      },
    },
  },
  {
    id: "bubble-train",
    category: "puzzle",
    controlStyle: "pointer",
    color: "violet",
    inputs: ["mouse"],
    tags: {
      en: [
        "Bubble Train",
        "bubble shooter puzzle",
        "bubble train levels",
        "bubble chain reaction",
        "2004 bubble game",
        "browser bubble game",
      ],
      ko: [
        "버블 트레인",
        "버블 슈터 퍼즐",
        "버블 트레인 레벨",
        "버블 연쇄 반응",
        "2004 버블 게임",
        "브라우저 버블 게임",
      ],
    },
    license:
      "GPL-3.0 browser port · original level data GPL-2.0-or-later · replacement art CC0",
    licenseUrl: libreLicenseUrl,
    author:
      "Libre Arcade contributors; original game by Adam Child and Craig Marshall",
    source: libreSource("bubble-train"),
    url: libreUrl("bubble-train/public/index.html"),
    host: libreHostName,
    hostNote: libreNote,
    artworkAlt: {
      en: "Original Denny Games illustration of colored bubbles moving along a track",
      ko: "길을 따라 움직이는 색색의 거품을 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "Bubble Train",
        subtitle: "Aim at the train and set off a color-matching chain.",
        description:
          "A bubble-shooter puzzle port of the 2004 game. Aim at the moving chain, match colors and use special bubbles such as Bomb, Colour Bomb, Speed and Rainbow.",
        objective:
          "Clear the bubble train by making color matches before the chain reaches its endpoint.",
        mode: "The browser port includes 61 original levels and several special bubble types; its art and audio were replaced where provenance was unclear.",
        controls:
          "Use the pointer to aim and fire; open How to Play on the host for the exact bubble and level rules.",
        tip: "Look ahead along the train and choose a match that can split or remove a longer section.",
      },
      ko: {
        title: "Bubble Train",
        subtitle: "기차를 조준해 색 맞추기 연쇄 반응을 만들어요.",
        description:
          "2004년 게임을 브라우저로 옮긴 버블 슈터 퍼즐입니다. 움직이는 기차를 조준하고 색을 맞추며 Bomb·Colour Bomb·Speed·Rainbow 특수 거품을 활용하세요.",
        objective:
          "거품 기차가 끝까지 도달하기 전에 같은 색을 맞춰 기차를 없애세요.",
        mode: "브라우저판에는 원래 레벨 61개와 여러 특수 거품이 있습니다. 출처가 불분명한 그림과 소리는 교체했습니다.",
        controls:
          "포인터로 조준하고 발사하세요. 거품과 레벨 규칙은 호스트의 How to Play에서 확인할 수 있습니다.",
        tip: "기차 앞쪽을 살펴 더 긴 구간을 끊거나 없앨 수 있는 색 조합을 노려보세요.",
      },
    },
  },
  {
    id: "nova-pinball",
    category: "arcade",
    controlStyle: "buttons",
    color: "blue",
    inputs: ["keyboard", "touch"],
    tags: {
      en: [
        "Nova Pinball",
        "space pinball game",
        "six ball pinball",
        "pinball mission chain",
        "open source pinball",
        "browser pinball",
      ],
      ko: [
        "노바 핀볼",
        "우주 핀볼 게임",
        "6구 핀볼",
        "핀볼 미션 체인",
        "오픈소스 핀볼",
        "브라우저 핀볼",
      ],
    },
    license:
      "GPL-3.0-or-later browser port · original Nova Pinball GPL-3.0-or-later",
    licenseUrl: libreLicenseUrl,
    author: "Libre Arcade contributors; original game by Wesley Werner",
    source: libreSource("nova-pinball"),
    url: libreUrl("nova-pinball/public/index.html"),
    host: libreHostName,
    hostNote: libreNote,
    artworkAlt: {
      en: "Original Denny Games illustration of a space pinball table",
      ko: "우주 핀볼 테이블을 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "Nova Pinball",
        subtitle: "A six-ball table with a chain of space missions.",
        description:
          "Play through a space pinball table with six balls and linked missions that move from a Red Giant through a black hole and beyond.",
        objective:
          "Keep the ball in play and complete the table's mission targets to advance through NOVA.",
        mode: "The browser port replaces historical graphics, music and sound files whose redistribution terms were unclear.",
        controls:
          "Keyboard: Z/M or the arrow keys operate the flippers; Space starts or nudges the table; Esc pauses. The host also shows touch buttons.",
        tip: "Read the current mission label above the score before launching the next ball.",
      },
      ko: {
        title: "Nova Pinball",
        subtitle: "우주 미션이 이어지는 여섯 개 공의 테이블.",
        description:
          "적색거성부터 블랙홀까지 이어지는 미션을 따라 여섯 개 공으로 우주 핀볼 테이블을 공략하세요.",
        objective:
          "공을 계속 살리고 테이블 목표를 완수해 NOVA 미션을 진행하세요.",
        mode: "재배포 조건이 불분명한 과거 그림·음악·효과음은 브라우저 포트에서 교체했습니다.",
        controls:
          "키보드: Z/M 또는 방향키로 플리퍼 조작, Space로 시작·테이블 흔들기, Esc로 일시정지. 호스트에 터치 버튼도 표시됩니다.",
        tip: "다음 공을 쏘기 전에 점수 위의 현재 미션 안내를 읽어보세요.",
      },
    },
  },
  {
    id: "mechanical-night-pinball",
    category: "arcade",
    controlStyle: "buttons",
    color: "rust",
    inputs: ["keyboard", "touch"],
    tags: {
      en: [
        "Mechanical Night Pinball",
        "arcade pinball table",
        "pinball ramp bonus",
        "three ball pinball",
        "MIT table design",
        "browser pinball game",
      ],
      ko: [
        "메커니컬 나이트 핀볼",
        "아케이드 핀볼 테이블",
        "핀볼 램프 보너스",
        "3구 핀볼",
        "MIT 테이블 설계",
        "브라우저 핀볼 게임",
      ],
    },
    license: "GPL-3.0-or-later browser port · MIT table rules · clean-room art",
    licenseUrl: libreLicenseUrl,
    author:
      "Libre Arcade contributors; table and rules based on DocDonkeys/Pinup-Pinball",
    source: libreSource("mechanical-night-pinball"),
    url: libreUrl("mechanical-night-pinball/public/index.html"),
    host: libreHostName,
    hostNote: libreNote,
    artworkAlt: {
      en: "Original Denny Games illustration of a mechanical pinball table with ramps",
      ko: "램프가 있는 기계식 핀볼 테이블을 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "Mechanical Night Pinball",
        subtitle: "Light the inserts and build a ramp bonus.",
        description:
          "A three-ball arcade table with four multiplier lights, ramps, bonuses and extra-ball opportunities. The browser port uses newly drawn art and a CC0 audio loop.",
        objective:
          "Keep the ball in play, light all four inserts and complete ramps to raise the multiplier and earn bonuses.",
        mode: "The table's rules and scoring are based on the MIT-licensed Pinup-Pinball project; the port does not redistribute its uncertain historical graphics.",
        controls:
          "Keyboard: Left/Right operate flippers, Down launches; Space replays. The table also provides on-screen controls.",
        tip: "Aim for the lit inserts and ramps to raise your multiplier instead of relying only on random returns.",
      },
      ko: {
        title: "Mechanical Night Pinball",
        subtitle: "인서트를 켜고 램프 보너스를 쌓아보세요.",
        description:
          "배수 조명 네 개, 램프, 보너스와 추가 공 기회가 있는 3구 아케이드 테이블입니다. 브라우저 포트는 새 그림과 CC0 오디오 루프를 사용합니다.",
        objective:
          "공을 지키면서 인서트 네 개를 켜고 램프를 완주해 배수와 보너스를 올리세요.",
        mode: "테이블 규칙과 점수는 MIT 라이선스 Pinup-Pinball 프로젝트에 기반하며, 재배포 조건이 불분명한 과거 그림은 포함하지 않습니다.",
        controls:
          "키보드: 좌우 방향키로 플리퍼, 아래 방향키로 발사, Space로 다시 시작합니다. 테이블 안에 화면 조작도 있습니다.",
        tip: "무작위로 공을 돌리기보다 불이 켜진 인서트와 램프를 노려 배수를 높이세요.",
      },
    },
  },
  {
    id: "comet-pinball",
    category: "arcade",
    controlStyle: "buttons",
    color: "violet",
    inputs: ["keyboard", "touch"],
    tags: {
      en: [
        "Comet Pinball",
        "space pinball browser game",
        "three ball pinball",
        "Apache licensed game",
        "pinball flippers",
        "HTML5 pinball",
      ],
      ko: [
        "코멧 핀볼",
        "우주 핀볼 브라우저 게임",
        "3구 핀볼",
        "아파치 라이선스 게임",
        "핀볼 플리퍼",
        "HTML5 핀볼",
      ],
    },
    license: "Apache-2.0 original and browser port · new browser artwork/audio",
    licenseUrl: libreLicenseUrl,
    author:
      "Libre Arcade contributors; original game by Patrick Haring and Christian Bürgi",
    source: libreSource("comet-pinball"),
    url: libreUrl("comet-pinball/public/index.html"),
    host: libreHostName,
    hostNote: libreNote,
    artworkAlt: {
      en: "Original Denny Games illustration of a comet-shaped pinball lane",
      ko: "혜성 모양 핀볼 레인을 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "Comet Pinball",
        subtitle: "A compact three-ball table with a space theme.",
        description:
          "Launch three balls on a space-themed pinball table with bumpers, slingshots and obstacles. Its browser port redraws the table and synthesizes new effects.",
        objective:
          "Keep each ball in play and score from bumpers, slingshots and table obstacles.",
        mode: "The browser adaptation follows the Apache-2.0 source project; its host includes a follow-ball view and audio controls.",
        controls:
          "Left/Right or A/Z control the left flipper; Right/D/L/M control the right. Space or Down launches; P pauses.",
        tip: "Use the follow-ball view if the ball's path is hard to track on the full table.",
      },
      ko: {
        title: "Comet Pinball",
        subtitle: "우주 테마의 간결한 3구 핀볼 테이블.",
        description:
          "범퍼·슬링샷·장애물이 있는 우주 핀볼 테이블에서 공 세 개를 쏘아보세요. 브라우저 포트는 테이블을 새로 그리고 효과음을 합성합니다.",
        objective:
          "공을 계속 살리고 범퍼·슬링샷·테이블 장애물로 점수를 얻으세요.",
        mode: "브라우저판은 Apache-2.0 소스 프로젝트를 따르며 공 따라보기와 오디오 조작을 제공합니다.",
        controls:
          "좌우 방향키 또는 A/Z는 왼쪽 플리퍼, 오른쪽 방향키 또는 D/L/M은 오른쪽입니다. Space 또는 아래 방향키로 발사하고 P로 일시정지하세요.",
        tip: "전체 테이블에서 공의 경로를 놓친다면 공 따라보기 화면을 사용하세요.",
      },
    },
  },
  {
    id: "highmoon",
    category: "shooting",
    controlStyle: "directional",
    color: "blue",
    inputs: ["keyboard", "touch"],
    tags: {
      en: [
        "HighMoon",
        "space artillery duel",
        "two player space game",
        "planet gravity shooter",
        "turn based artillery",
        "browser shooting game",
      ],
      ko: [
        "하이문",
        "우주 포격 대전",
        "2인 우주 게임",
        "행성 중력 슈팅",
        "턴제 포격",
        "브라우저 슈팅 게임",
      ],
    },
    license:
      "GPL-3.0-or-later browser port · original HighMoon GPL-2.0-or-later",
    licenseUrl: libreLicenseUrl,
    author: "Libre Arcade contributors; original game by Patrick Gerdsmeier",
    source: libreSource("highmoon"),
    url: libreUrl("highmoon/public/index.html"),
    host: libreHostName,
    hostNote: libreNote,
    artworkAlt: {
      en: "Original Denny Games illustration of two ships firing across a planet",
      ko: "행성을 사이에 두고 포격하는 두 우주선을 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "HighMoon",
        subtitle: "Take turns aiming through a gravity-bent galaxy.",
        description:
          "A solo or two-player space artillery duel. Planet gravity bends shots, while storms and wormholes change where projectiles travel; computer difficulty and galaxy layouts can be selected.",
        objective:
          "Reduce the opponent ship's shield to zero with carefully aimed shots.",
        mode: "Choose Player vs CPU, Player vs Player or CPU vs CPU; collect bonuses to reinforce shields or change your weapon.",
        controls:
          "Keyboard: Up/Down move, Left/Right aim, hold Space to charge and release to fire, Enter uses a bonus, P/Esc pauses. The host provides phone buttons.",
        tip: "Account for planetary gravity: a shot can curve back toward the ship that launched it.",
      },
      ko: {
        title: "HighMoon",
        subtitle: "중력에 휘는 은하에서 차례로 조준하세요.",
        description:
          "혼자 또는 두 명이 겨루는 우주 포격 대전입니다. 행성 중력이 탄도를 휘게 하고 폭풍과 웜홀이 발사체를 바꿉니다. CPU 난이도와 은하 배치를 고를 수 있습니다.",
        objective: "정확히 조준해 상대 우주선의 방패를 0으로 만드세요.",
        mode: "플레이어 대 CPU, 2인 대전 또는 CPU 대 CPU를 고르세요. 보너스로 방패를 보강하거나 무기를 바꿀 수 있습니다.",
        controls:
          "키보드: 위아래 이동, 좌우 조준, Space를 눌러 충전 후 떼어 발사, Enter 보너스 사용, P/Esc 일시정지. 호스트에서 휴대폰 버튼을 제공합니다.",
        tip: "행성 중력을 계산하세요. 발사한 탄이 다시 내 우주선 쪽으로 휘어 돌아올 수 있습니다.",
      },
    },
  },
  {
    id: "100-square-challenge",
    category: "puzzle",
    controlStyle: "pointer",
    color: "yellow",
    inputs: ["mouse"],
    tags: {
      en: [
        "100-Square Challenge",
        "knight tour puzzle",
        "100 square number puzzle",
        "chess knight path game",
        "AGPL puzzle",
        "browser logic game",
      ],
      ko: [
        "100 스퀘어 챌린지",
        "나이트 투어 퍼즐",
        "100칸 숫자 퍼즐",
        "체스 나이트 경로 게임",
        "AGPL 퍼즐",
        "브라우저 논리 게임",
      ],
    },
    license: "AGPL-3.0-or-later original and browser port",
    licenseUrl: libreLicenseUrl,
    author: "Libre Arcade contributors; original TAJJAVA by Jasen Borisov",
    source: libreSource("100-square-challenge"),
    url: libreUrl("100-square-challenge/public/index.html"),
    host: libreHostName,
    hostNote: libreNote,
    artworkAlt: {
      en: "Original Denny Games illustration of a numbered 10 by 10 grid and knight path",
      ko: "숫자가 놓인 10×10 격자와 나이트 경로를 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "100-Square Challenge",
        subtitle: "How far can a knight's path reach across a 10 by 10 board?",
        description:
          "Fill a 10 by 10 grid by moving like a chess knight. The browser port includes 15 recorded scenarios, undo and a start-new-game option.",
        objective:
          "Continue the knight's move from square to square and try to fill all 100 spaces without getting stuck.",
        mode: "Each move follows the chess knight's two-and-one L shape; the game tracks how many of the 100 cells you have reached.",
        controls:
          "Select a legal destination on the grid with the pointer. Use Undo last move to backtrack one step.",
        tip: "Before taking a move, count the unused squares the knight can reach next; corners quickly limit your choices.",
      },
      ko: {
        title: "100-Square Challenge",
        subtitle: "체스 나이트로 10×10 보드를 얼마나 채울 수 있을까요?",
        description:
          "체스 나이트처럼 이동해 10×10 격자를 채우세요. 브라우저 포트에는 기록된 시나리오 15개, 실행 취소와 새 게임 기능이 있습니다.",
        objective:
          "나이트의 이동으로 칸을 하나씩 방문해 막히지 않고 100칸을 모두 채워보세요.",
        mode: "한 번에 두 칸과 옆 한 칸을 이동하는 나이트의 L자 규칙을 따르며, 100칸 중 방문한 수를 기록합니다.",
        controls:
          "포인터로 규칙에 맞는 목적지를 고르세요. Undo last move를 누르면 한 수 되돌립니다.",
        tip: "수를 두기 전에 다음에 갈 수 있는 미방문 칸을 세어보세요. 모서리에서는 선택지가 빠르게 줄어듭니다.",
      },
    },
  },
  {
    id: "asteroids-infinity",
    category: "shooting",
    controlStyle: "directional",
    color: "violet",
    inputs: ["keyboard", "touch"],
    tags: {
      en: [
        "Asteroids Infinity",
        "asteroid field shooter",
        "vector space shooter",
        "2009 open source game",
        "ship shield arcade",
        "browser space game",
      ],
      ko: [
        "애스터로이드 인피니티",
        "소행성 지대 슈팅",
        "벡터 우주 슈팅",
        "2009 오픈소스 게임",
        "우주선 방패 아케이드",
        "브라우저 우주 게임",
      ],
    },
    license:
      "GPL-3.0-or-later original and browser port · unclear original media omitted",
    licenseUrl: libreLicenseUrl,
    author: "Libre Arcade contributors; original game by Ben Whittaker",
    source: libreSource("asteroids-infinity"),
    url: libreUrl("asteroids-infinity/public/index.html"),
    host: libreHostName,
    hostNote: libreNote,
    artworkAlt: {
      en: "Original Denny Games illustration of a ship dodging asteroids",
      ko: "소행성을 피하는 우주선을 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "Asteroids Infinity",
        subtitle: "Fly, shoot and survive a drifting asteroid field.",
        description:
          "A retro vector space shooter restored from a 2009 Python game. Pilot a ship that keeps moving, fire into the asteroid field and use a shield to survive.",
        objective:
          "Stay alive while destroying asteroids and other hazards in the field.",
        mode: "The browser page offers a new game, pause and shield actions; uncertain original fonts and audio are not redistributed.",
        controls:
          "Keyboard: Arrow keys or WASD fly, Space fires, Ctrl activates the shield and P pauses. On-screen buttons are also present.",
        tip: "Plan your direction before thrusting; the ship does not slow down automatically.",
      },
      ko: {
        title: "Asteroids Infinity",
        subtitle: "표류하는 소행성 지대에서 비행하고 쏘며 버티세요.",
        description:
          "2009년 Python 게임을 복원한 레트로 벡터 우주 슈팅입니다. 계속 움직이는 우주선을 조종해 소행성 지대를 공격하고 방패로 버티세요.",
        objective: "지대의 소행성과 위험 요소를 파괴하며 살아남으세요.",
        mode: "브라우저 페이지에서 새 게임·일시정지·방패를 사용할 수 있습니다. 불확실한 원본 글꼴과 소리는 재배포하지 않았습니다.",
        controls:
          "키보드: 방향키 또는 WASD 비행, Space 발사, Ctrl 방패, P 일시정지. 화면 버튼도 표시됩니다.",
        tip: "추진하기 전에 방향을 계획하세요. 우주선은 자동으로 멈추지 않습니다.",
      },
    },
  },
  {
    id: "oglbricks",
    category: "puzzle",
    controlStyle: "directional",
    color: "mint",
    inputs: ["keyboard", "touch"],
    tags: {
      en: [
        "OGLBricks",
        "falling block puzzle",
        "custom block shapes",
        "adjustable board tetris style",
        "MIT open source blocks",
        "browser block puzzle",
      ],
      ko: [
        "오지엘 브릭스",
        "낙하 블록 퍼즐",
        "사용자 블록 모양",
        "보드 조정 테트리스 스타일",
        "MIT 오픈소스 블록",
        "브라우저 블록 퍼즐",
      ],
    },
    license: "GPL-3.0-or-later browser port · original game code MIT",
    licenseUrl: libreLicenseUrl,
    author: "Libre Arcade contributors; original game by Alexey Markarov",
    source: libreSource("oglbricks"),
    url: libreUrl("oglbricks/public/index.html"),
    host: libreHostName,
    hostNote: libreNote,
    artworkAlt: {
      en: "Original Denny Games illustration of varied falling block shapes",
      ko: "다양한 낙하 블록 모양을 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "OGLBricks",
        subtitle: "Tune the board size and choose which pieces can fall.",
        description:
          "A falling-block puzzle with a configurable field from 10 to 50 cells on each side and 27 source-defined piece shapes. Change the piece groups and starting speed to make a different challenge.",
        objective:
          "Move and rotate falling pieces to fill horizontal rows; complete rows disappear and score points.",
        mode: "The settings can change field width, height, speed and which piece sizes appear. Save and load a game through a file.",
        controls:
          "Keyboard: Left/Right move, Down drops faster, Up rotates, P pauses. Touch players can use the four controls under the board.",
        tip: "Choose a wider field or disable a piece group if you want to explore a less familiar block set.",
      },
      ko: {
        title: "OGLBricks",
        subtitle: "보드 크기와 떨어질 블록 모양을 직접 고르세요.",
        description:
          "가로세로 각각 10~50칸으로 조절하는 보드와 원본 코드에 정의된 블록 모양 27개가 있는 낙하 블록 퍼즐입니다. 블록 그룹과 시작 속도를 바꿔 다른 도전을 만들어보세요.",
        objective:
          "떨어지는 블록을 움직이고 돌려 가로줄을 채우세요. 줄이 완성되면 사라지고 점수를 얻습니다.",
        mode: "설정에서 가로·세로 크기, 속도와 나타날 블록 크기를 바꿀 수 있습니다. 파일로 게임을 저장하고 불러오세요.",
        controls:
          "키보드: 좌우 이동, 아래쪽 빨리 내리기, 위쪽 회전, P 일시정지. 터치에서는 보드 아래 네 버튼을 쓰세요.",
        tip: "익숙하지 않은 블록 조합을 보고 싶다면 넓은 보드를 고르거나 일부 블록 그룹을 꺼보세요.",
      },
    },
  },
  {
    id: "5ud0ku",
    category: "puzzle",
    controlStyle: "numbers",
    color: "yellow",
    inputs: ["mouse", "keyboard"],
    tags: {
      en: [
        "5ud0ku",
        "Sudoku puzzle",
        "Java ME Sudoku game",
        "custom Sudoku solver",
        "easy normal hard Sudoku",
        "browser number puzzle",
      ],
      ko: [
        "스도쿠",
        "스도쿠 퍼즐",
        "자바ME 스도쿠 게임",
        "사용자 스도쿠 풀이",
        "쉬움 보통 어려움 스도쿠",
        "브라우저 숫자 퍼즐",
      ],
    },
    license:
      "GPL-3.0-or-later browser port · original source LGPL-2.1-or-later",
    licenseUrl: libreLicenseUrl,
    author:
      "Libre Arcade contributors; original game by Ivonne Engemann and Marcus Wagner",
    source: libreSource("5ud0ku"),
    url: libreUrl("5ud0ku/public/index.html"),
    host: libreHostName,
    hostNote: libreNote,
    artworkAlt: {
      en: "Original Denny Games illustration of a Sudoku grid with pencil marks",
      ko: "연필 후보 숫자가 있는 스도쿠 격자를 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "5ud0ku",
        subtitle: "Generate a number grid or enter a puzzle of your own.",
        description:
          "Play generated Sudoku at three difficulty levels or enter a custom puzzle. Pencil marks, undo, redo, hints, conflict checks and local save slots are available on the host.",
        objective:
          "Fill every row, column and 3 by 3 box with the digits 1 through 9 without repeating a digit.",
        mode: "The solver can show a first solution, or keep the given numbers and start a playable version of your custom puzzle.",
        controls:
          "Select a cell and enter 1–9; arrow keys move, Delete clears, P toggles pencil marks, and Ctrl/Cmd+Z undoes.",
        tip: "Use pencil marks for candidates and check conflicts before asking for a hint.",
      },
      ko: {
        title: "5ud0ku",
        subtitle: "숫자판을 만들거나 직접 퍼즐을 입력하세요.",
        description:
          "난이도 세 단계의 스도쿠를 만들거나 사용자 퍼즐을 입력해보세요. 후보 숫자, 실행 취소·다시 실행, 힌트, 충돌 확인과 로컬 저장이 호스트에 있습니다.",
        objective:
          "각 가로줄·세로줄·3×3 상자에 1부터 9까지 숫자를 중복 없이 채우세요.",
        mode: "풀이기가 첫 해답을 보여주거나, 주어진 숫자를 유지한 채 사용자 퍼즐을 직접 풀도록 시작할 수 있습니다.",
        controls:
          "칸을 고르고 1–9를 입력하세요. 방향키 이동, Delete 지우기, P 후보 숫자 켜기, Ctrl/Cmd+Z 실행 취소입니다.",
        tip: "힌트를 보기 전에 후보 숫자를 적고 충돌 검사를 사용해보세요.",
      },
    },
  },
  {
    id: "lawn-mower",
    category: "arcade",
    controlStyle: "directional",
    color: "mint",
    inputs: ["keyboard", "touch"],
    tags: {
      en: [
        "Lawn Mower NES game",
        "public domain retro game",
        "grass mowing arcade",
        "ten lawn levels",
        "NES browser port",
        "browser retro game",
      ],
      ko: [
        "잔디 깎기 NES 게임",
        "퍼블릭 도메인 레트로 게임",
        "잔디 깎기 아케이드",
        "잔디 레벨 10개",
        "NES 브라우저 포트",
        "브라우저 레트로 게임",
      ],
    },
    license: "GPL-3.0 browser port · original Lawn Mower game is public domain",
    licenseUrl: libreLicenseUrl,
    author: "Libre Arcade contributors; original game by Shiru",
    source: libreSource("lawn-mower"),
    url: libreUrl("lawn-mower/public/index.html"),
    host: libreHostName,
    hostNote: libreNote,
    artworkAlt: {
      en: "Original Denny Games illustration of a mower moving across a green lawn",
      ko: "초록 잔디밭을 달리는 잔디깎이를 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "Lawn Mower",
        subtitle:
          "Mow a set of lawns while avoiding stones and watching your fuel.",
        description:
          "A public-domain NES-era mowing game restored for the browser. Cross ten lawns, collect fuel cans and avoid stones, with the original music and a hidden cheat preserved in the source game.",
        objective:
          "Mow each lawn while managing fuel and avoiding the obstacles in your path.",
        mode: "The browser restoration follows the author's 1.12 source version; the host provides directional and action buttons.",
        controls:
          "Use the on-screen direction pad and A/B buttons or the keyboard/gamepad mapping shown in the host's help.",
        tip: "Watch for fuel cans as you plan a route around stones and the uncut grass.",
      },
      ko: {
        title: "Lawn Mower",
        subtitle: "연료를 챙기고 돌을 피해 잔디밭을 깎아보세요.",
        description:
          "퍼블릭 도메인 NES 시절 잔디 깎기 게임을 브라우저로 복원했습니다. 잔디밭 열 곳을 지나며 연료통을 줍고 돌을 피하세요. 원작 음악과 숨겨진 치트도 소스에 보존되어 있습니다.",
        objective: "연료를 관리하고 길의 장애물을 피하면서 잔디밭을 깎으세요.",
        mode: "브라우저 복원판은 제작자의 1.12 소스 버전을 따르며 방향패드와 액션 버튼을 제공합니다.",
        controls:
          "화면 방향패드와 A/B 버튼을 사용하거나 호스트 도움말에서 키보드·패드 배치를 확인하세요.",
        tip: "돌과 아직 깎지 않은 잔디를 피해 경로를 계획하면서 연료통을 살펴보세요.",
      },
    },
  },
  {
    id: "pvp-arena-shooter",
    category: "action",
    controlStyle: "directional",
    color: "rust",
    inputs: ["keyboard", "mouse", "touch", "gamepad"],
    tags: {
      en: [
        "Player Versus Player game",
        "PVP arena shooter",
        "split screen FPS",
        "1 to 4 player browser shooter",
        "retro raycasting game",
        "LAN co-op browser game",
      ],
      ko: [
        "플레이어 버서스 플레이어",
        "PVP 아레나 슈터",
        "화면 분할 FPS",
        "1~4인 브라우저 슈터",
        "레트로 레이캐스팅 게임",
        "랜 협동 브라우저 게임",
      ],
    },
    license:
      "GPL-3.0 game code · repository includes separately licensed MIT components",
    licenseUrl: "https://github.com/kesiev/pvp/blob/master/COPYING",
    author: "KesieV and contributors",
    source: "https://github.com/kesiev/pvp",
    url: "https://www.kesiev.com/pvp/",
    host: {
      en: "Developer-hosted Player Versus Player web game",
      ko: "제작자가 호스팅하는 Player Versus Player 웹게임",
    },
    hostNote: {
      en: "This is the developer's browser game. The project documents keyboard, mouse, controller and touch inputs plus local split-screen play. Networked play is marked experimental and the project says internet matches may not work reliably. Denny Games links out only and has not verified a full session or device behavior.",
      ko: "게임 제작자의 브라우저 게임입니다. 프로젝트 문서에서 키보드·마우스·컨트롤러·터치와 로컬 화면 분할 플레이를 안내합니다. 네트워크 플레이는 실험 기능이며 인터넷 대전이 안정적으로 동작하지 않을 수 있다고 제작자가 설명합니다. 데니 게임즈는 링크만 제공하며 전체 플레이나 기기 동작을 검증하지 않았습니다.",
    },
    artworkAlt: {
      en: "Original Denny Games illustration of a split-screen arena with two players",
      ko: "두 플레이어가 있는 화면 분할 아레나를 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "Player Versus Player",
        subtitle: "A raycast arena shooter for solo, co-op and local matches.",
        description:
          "A browser arena shooter with classic versus and co-op modes plus a 20-mission arcade run for up to four players. Play offline in split-screen; the source project marks network play experimental.",
        objective:
          "Move through each arena, aim horizontally, fire and open doors while avoiding enemy shots.",
        mode: "The game supports one to four players and customizable controls; internet multiplayer may be unreliable according to the developer.",
        controls:
          "Keyboard: WASD move, hold F to strafe/aim, G fires and H opens doors. Mouse, joypad and touch layouts are documented by the source project.",
        tip: "Use the radar to track nearby objectives and hold the door action to slow down before a careful shot.",
      },
      ko: {
        title: "Player Versus Player",
        subtitle: "혼자·협동·로컬 대전을 지원하는 레이캐스트 슈터.",
        description:
          "클래식 대전·협동 모드와 최대 네 명이 도전하는 20개 미션 아케이드가 있는 브라우저 아레나 슈터입니다. 오프라인 화면 분할로 플레이할 수 있으며 네트워크 대전은 제작자가 실험 기능으로 안내합니다.",
        objective:
          "적의 공격을 피하며 아레나를 이동하고 수평 조준·발사·문 열기를 활용하세요.",
        mode: "1~4인 플레이와 조작 설정을 지원합니다. 제작자 설명에 따르면 인터넷 멀티플레이는 불안정할 수 있습니다.",
        controls:
          "키보드: WASD 이동, F를 누른 채 좌우 조준, G 발사, H 문 열기. 마우스·패드·터치 배치는 프로젝트 문서에서 확인하세요.",
        tip: "레이더로 가까운 목표를 찾고 정확히 쏘기 전에 문 열기 키를 눌러 속도를 늦춰보세요.",
      },
    },
  },
  {
    id: "openglad",
    category: "action",
    controlStyle: "directional",
    color: "rust",
    inputs: ["keyboard", "gamepad"],
    tags: {
      en: [
        "OpenGlad",
        "Gladiator browser game",
        "WebAssembly action RPG",
        "top down dungeon action",
        "local multiplayer arena game",
        "GPL open source game",
      ],
      ko: [
        "오픈글래드",
        "글래디에이터 브라우저 게임",
        "웹어셈블리 액션 RPG",
        "탑다운 던전 액션",
        "로컬 멀티플레이 아레나 게임",
        "GPL 오픈소스 게임",
      ],
    },
    license: "GPL-2.0 game and browser build",
    licenseUrl: "https://github.com/openglad/openglad/blob/master/LICENSE",
    author: "OpenGlad contributors; original Gladiator by FSGames",
    source: "https://github.com/openglad/openglad",
    url: "https://openglad.pages.dev/",
    host: {
      en: "OpenGlad project's WebAssembly browser build",
      ko: "OpenGlad 프로젝트 WebAssembly 브라우저 빌드",
    },
    hostNote: {
      en: "The OpenGlad project hosts this WebAssembly build. Its GPL-2.0 source describes seven campaigns, seven versus modes, local seats and a public multiplayer relay with cloud saves. Denny Games links out only and has not verified a full match, save flow or device compatibility.",
      ko: "OpenGlad 프로젝트가 WebAssembly 빌드를 호스팅합니다. GPL-2.0 소스는 캠페인 7개, 대전 방식 7개, 로컬 좌석과 클라우드 저장을 제공하는 공개 멀티플레이 중계 서버를 안내합니다. 데니 게임즈는 링크만 제공하며 전체 대전·저장·기기 호환성을 검증하지 않았습니다.",
    },
    artworkAlt: {
      en: "Original Denny Games illustration of fantasy heroes entering a dungeon",
      ko: "던전에 들어가는 판타지 영웅을 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "OpenGlad",
        subtitle: "A top-down action RPG with campaigns and arena modes.",
        description:
          "A browser WebAssembly port of the open-source Gladiator game. Explore campaigns, then try versus modes including team deathmatch, capture the flag, soccer and free-for-all.",
        objective:
          "Choose a campaign or arena mode, then use your character's class and equipment to complete its scenario.",
        mode: "The project describes seven campaigns, seven versus modes, four local players on one screen and online rooms through its relay.",
        controls:
          "Choose a named keyboard layout or joystick in the game settings; the browser build provides its own pause and input menus.",
        tip: "Start with a campaign or training scenario to learn a class before joining a multiplayer arena.",
      },
      ko: {
        title: "OpenGlad",
        subtitle: "캠페인과 아레나 모드가 있는 탑다운 액션 RPG.",
        description:
          "오픈소스 Gladiator 게임의 WebAssembly 브라우저 포트입니다. 캠페인을 탐험하고 팀 데스매치·깃발 뺏기·축구·개인전 같은 대전 모드도 즐겨보세요.",
        objective:
          "캠페인이나 아레나 방식을 고르고 캐릭터 직업과 장비를 활용해 시나리오를 완수하세요.",
        mode: "프로젝트는 캠페인 7개, 대전 방식 7개, 한 화면 로컬 4인과 중계 서버를 통한 온라인 방을 안내합니다.",
        controls:
          "게임 설정에서 이름이 있는 키보드 배치나 조이스틱을 고르세요. 브라우저판에 일시정지와 입력 메뉴가 있습니다.",
        tip: "멀티플레이 아레나에 들어가기 전에 캠페인이나 훈련 시나리오로 직업을 익혀보세요.",
      },
    },
  },
  {
    id: "sheepdog-sim",
    category: "simulation",
    controlStyle: "directional",
    color: "mint",
    inputs: ["keyboard", "touch", "gamepad"],
    tags: {
      en: [
        "Sheepdog Sim 3",
        "sheep herding browser game",
        "3D sheepdog simulator",
        "WebGL WebGPU game",
        "touch gamepad browser game",
        "AGPL open source simulation",
      ],
      ko: [
        "십독 심 3",
        "양몰이 브라우저 게임",
        "3D 양치기 시뮬레이터",
        "웹지엘 웹GPU 게임",
        "터치 게임패드 브라우저 게임",
        "AGPL 오픈소스 시뮬레이션",
      ],
    },
    license:
      "AGPL-3.0-or-later source code · runtime assets have a separate license ledger",
    licenseUrl: "https://github.com/matthew-kissinger/sds/blob/main/LICENSE",
    author: "Matthew Kissinger",
    source: "https://github.com/matthew-kissinger/sds",
    url: "https://sheepdogsim.com/",
    host: {
      en: "Developer-hosted Sheepdog Sim 3 browser game",
      ko: "개발자가 호스팅하는 Sheepdog Sim 3 브라우저 게임",
    },
    hostNote: {
      en: "This is the developer-hosted single-player version 3 client; the source says no account is required and describes optional online solo-time comparisons. Source code is AGPL-3.0-or-later, while runtime assets have a separate license ledger. Denny Games links out only and has not tested gameplay or devices.",
      ko: "개발자가 호스팅하는 싱글 플레이 버전 3입니다. 소스는 계정 없이 플레이할 수 있고 온라인 개인 기록 비교는 선택 기능이라고 안내합니다. 소스 코드는 AGPL-3.0-or-later이며 실행 자산에는 별도 라이선스 목록이 있습니다. 데니 게임즈는 링크만 제공하며 플레이와 기기를 검증하지 않았습니다.",
    },
    artworkAlt: {
      en: "Original Denny Games illustration of a sheepdog guiding a flock toward a gate",
      ko: "양 떼를 문으로 이끄는 양치기 개를 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "Sheepdog Sim 3",
        subtitle: "Guide a flock through the pasture and into the pen.",
        description:
          "A single-player 3D herding game. Choose a flock of 25, 75 or 200 sheep, get behind stragglers and use a well-timed bark to guide them through the pasture gate.",
        objective: "Guide every sheep into the pen before finishing the run.",
        mode: "The project offers an overhead Classic camera or a closer Follow view, local personal bests and optional online solo-time comparisons.",
        controls:
          "Keyboard: WASD or arrows move, Shift sprints, Space barks, C changes camera and Esc pauses. The source also documents gamepad and touch controls.",
        tip: "Move behind the flock and release Sprint when stamina runs out; the next sprint starts after you press it again.",
      },
      ko: {
        title: "Sheepdog Sim 3",
        subtitle: "목초지의 양 떼를 우리 안으로 이끄세요.",
        description:
          "싱글 플레이 3D 양몰이 게임입니다. 양 25·75·200마리 중 하나를 고르고 뒤처진 양 뒤로 이동해 적절한 순간 짖으며 목초지 문으로 안내하세요.",
        objective: "달리기가 끝나기 전에 모든 양을 우리 안으로 데려오세요.",
        mode: "위에서 보는 Classic 카메라와 가까이 따라가는 Follow 화면, 로컬 최고 기록과 선택형 온라인 개인 기록 비교가 있습니다.",
        controls:
          "키보드: WASD 또는 방향키 이동, Shift 달리기, Space 짖기, C 카메라 전환, Esc 일시정지. 소스는 게임패드와 터치 조작도 안내합니다.",
        tip: "양 떼 뒤쪽으로 이동하고 체력이 떨어지면 달리기를 놓으세요. 회복 후 다시 눌러 다음 달리기를 시작합니다.",
      },
    },
  },
];

function toGame(entry: Listing): Game {
  const makeCopy = (locale: Locale) => {
    const copy = entry.copy[locale];
    const korean = locale === "ko";
    return {
      title: copy.title,
      subtitle: copy.subtitle,
      description: copy.description,
      rules: [
        copy.objective,
        copy.mode,
        korean
          ? "세부 규칙과 다시 시작·저장 방법은 외부 호스트의 게임 메뉴에서 확인하세요."
          : "Use the external host's game menu for detailed rules and any restart or save options.",
      ],
      controls: [
        copy.controls,
        korean
          ? "모든 키와 터치 조작은 호스트의 Help 또는 Controls 안내를 확인하세요."
          : "Check the host's Help or Controls guide for every key and touch action.",
        korean
          ? "데니 게임즈는 외부 게임의 전체 플레이나 기기 호환성을 검증하지 않았습니다."
          : "Denny Games has not verified a complete external game session or device compatibility.",
      ],
      tips: [
        copy.tip,
        korean
          ? "긴 플레이를 시작하기 전에 호스트의 조작·규칙 안내를 확인하세요."
          : "Read the host's controls and rules before starting a longer run.",
      ],
    };
  };

  return {
    id: entry.id,
    category: entry.category,
    duration: "varies",
    controlStyle: entry.controlStyle,
    color: entry.color,
    version: 1,
    stages: 0,
    tags: [...entry.tags.en, ...entry.tags.ko],
    inputs: entry.inputs,
    license: entry.license,
    licenseUrl: entry.licenseUrl,
    author: entry.author,
    source: entry.source,
    externalPlay: { url: entry.url, host: entry.host, note: entry.hostNote },
    added: "2026-10-15",
    artwork: `/art/open-games/${entry.id}.svg`,
    artworkAlt: entry.artworkAlt,
    text: { en: makeCopy("en"), ko: makeCopy("ko") },
  };
}

export const worldOpenGames = listings.map(toGame);
