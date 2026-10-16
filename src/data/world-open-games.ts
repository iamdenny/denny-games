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
  added?: string;
  category: Game["category"];
  controlStyle: Game["controlStyle"];
  color: string;
  inputs: Game["inputs"];
  tags: Record<Locale, string[]>;
  license: string;
  licenseDescription?: Record<Locale, string>;
  licenseUrl?: string;
  author: string;
  source: string;
  sourceLabel?: Record<Locale, string>;
  playModes?: Game["playModes"];
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

const openGamesRoot =
  "https://github.com/opengames-dev/opengames-dev.github.io";
const openGamesHost = "https://opengames-dev.github.io";
const openGamesNote: Record<Locale, string> = {
  en: "OpenGames says its six games, artwork and synthesized sounds are MIT licensed, free, ad-free and playable without an account. We checked that each linked page loads; Denny Games has not verified a complete game session or physical-device behavior.",
  ko: "OpenGames는 여섯 게임과 그림·합성 음향을 MIT 라이선스로 제공하며 무료·광고 없음·계정 없이 플레이 가능하다고 안내합니다. 링크된 각 페이지가 열리는 것은 확인했지만 전체 플레이나 실기기 동작은 검증하지 않았습니다.",
};

const darkRoomNote: Record<Locale, string> = {
  en: "This is the official browser game page. In a 390px browser check, its document width measured 920px, so mobile visitors may need to zoom or scroll horizontally. Denny Games links out only and has not verified a full game session or device support.",
  ko: "공식 브라우저 게임 페이지입니다. 390px 브라우저 확인에서 문서 가로 폭이 920px로 측정되어 모바일에서는 확대하거나 가로로 이동해야 할 수 있습니다. 데니 게임즈는 링크만 제공하며 전체 플레이와 기기 지원을 검증하지 않았습니다.",
};

const ancientBeastNote: Record<Locale, string> = {
  en: "The official host currently labels the game v0.5.1-alpha. Its mobile page asks portrait users to rotate to landscape. The code is AGPL-3.0 and artwork/audio have separate CC BY-SA terms; Denny Games reuses none of those assets and has not verified a full match, save or device behavior.",
  ko: "공식 호스트는 현재 게임을 v0.5.1-alpha로 표시합니다. 모바일 페이지는 세로 화면에서 가로로 돌리라고 안내합니다. 코드는 AGPL-3.0이고 그림·음향에는 별도의 CC BY-SA 조건이 적용됩니다. 데니 게임즈는 해당 자산을 재사용하지 않으며 전체 대전·저장·기기 동작을 검증하지 않았습니다.",
};

const blockyardNote: Record<Locale, string> = {
  en: "Blockyard's MIT-licensed project hosts a changing set of browser modes. Its current lobby offers guest play with a display name; progress lasts for that visit, while Discord sign-in keeps achievements. The host, online play and account rules are separate from Denny Games. We checked the lobby only, not a complete match or device compatibility.",
  ko: "MIT 라이선스의 Blockyard 프로젝트는 여러 브라우저 게임 모드를 호스팅합니다. 현재 로비에서는 표시 이름을 정해 게스트로 플레이할 수 있고, 진행 상황은 해당 방문 중에만 유지되며 Discord 로그인 시 업적이 저장됩니다. 호스트·온라인 플레이·계정 규칙은 데니 게임즈와 별개입니다. 로비만 확인했고 전체 대전이나 기기 호환성은 검증하지 않았습니다.",
};

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
  {
    id: "a-dark-room",
    added: "2026-10-16",
    category: "strategy",
    controlStyle: "pointer",
    color: "rust",
    inputs: ["mouse", "keyboard"],
    tags: {
      en: [
        "A Dark Room",
        "minimalist text adventure",
        "resource management game",
        "browser survival story",
        "MPL-2.0 open source game",
      ],
      ko: [
        "A Dark Room",
        "미니멀 텍스트 어드벤처",
        "자원 관리 게임",
        "브라우저 생존 이야기",
        "MPL-2.0 오픈소스 게임",
      ],
    },
    license: "MPL-2.0",
    licenseUrl:
      "https://github.com/doublespeakgames/adarkroom/blob/main/LICENSE.md",
    author: "Michael Townsend and Doublespeak Games contributors",
    source: "https://github.com/doublespeakgames/adarkroom",
    url: "https://adarkroom.doublespeakgames.com/",
    host: {
      en: "A Dark Room official browser edition",
      ko: "A Dark Room 공식 브라우저판",
    },
    hostNote: darkRoomNote,
    artworkAlt: {
      en: "Original Denny Games illustration of a small flame inside a dark room",
      ko: "어두운 방 안의 작은 불꽃을 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "A Dark Room",
        subtitle: "Light a fire. Build a village. Follow the trail beyond it.",
        description:
          "A spare text adventure that grows from tending a fire into gathering supplies, building a settlement and exploring a strange world. Its official browser edition is free and its source is published under MPL-2.0.",
        objective:
          "Keep the fire alive, gather resources and decide when your village is ready for a journey.",
        mode: "The story opens gradually as new people, buildings and places become available.",
        controls:
          "Choose the actions shown by the official game page. The host uses a compact desktop-oriented layout; mobile behavior is limited.",
        tip: "Take a moment to read each new option; small choices open the next part of the story.",
      },
      ko: {
        title: "A Dark Room",
        subtitle: "불을 밝히고, 마을을 세우고, 바깥세상으로 나아가요.",
        description:
          "불을 돌보는 일에서 시작해 자원을 모으고 마을을 꾸린 뒤 낯선 세계를 탐험하는 담백한 텍스트 어드벤처입니다. 공식 브라우저판은 무료이며 소스는 MPL-2.0으로 공개되어 있습니다.",
        objective:
          "불을 지키고 자원을 모으며 마을이 여행을 떠날 준비가 되었는지 결정하세요.",
        mode: "새로운 사람과 건물, 장소가 열릴수록 이야기가 조금씩 모습을 드러냅니다.",
        controls:
          "공식 게임 페이지에 표시되는 행동을 선택하세요. 호스트는 데스크톱에 맞춘 좁은 레이아웃이라 모바일 사용성이 제한될 수 있습니다.",
        tip: "새로운 선택지가 나타나면 잠시 읽어보세요. 작은 결정이 다음 이야기를 열어줍니다.",
      },
    },
  },
  {
    id: "ancient-beast",
    added: "2026-10-16",
    category: "strategy",
    controlStyle: "pointer",
    color: "violet",
    inputs: ["mouse", "keyboard", "touch"],
    tags: {
      en: [
        "Ancient Beast",
        "turn based tactical game",
        "creature strategy game",
        "1v1 and 2v2 browser game",
        "AGPL open source game",
      ],
      ko: [
        "Ancient Beast",
        "턴제 전술 게임",
        "크리처 전략 게임",
        "1대1 2대2 브라우저 게임",
        "AGPL 오픈소스 게임",
      ],
    },
    license:
      "AGPL-3.0 code · CC-BY-SA-4.0 artwork/audio · name and logo are trademarks",
    licenseUrl:
      "https://github.com/FreezingMoon/AncientBeast/blob/master/README.md",
    author: "Freezing Moon and Ancient Beast contributors",
    source: "https://github.com/FreezingMoon/AncientBeast",
    url: "https://play.ancientbeast.com/",
    host: {
      en: "Ancient Beast developer-hosted browser alpha",
      ko: "Ancient Beast 개발자 호스팅 브라우저 알파",
    },
    hostNote: ancientBeastNote,
    artworkAlt: {
      en: "Original Denny Games illustration of two fantasy creatures facing off",
      ko: "서로 마주 보는 판타지 크리처 둘을 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "Ancient Beast",
        subtitle: "Build a squad of creatures and outplay the other side.",
        description:
          "A turn-based tactical game about assembling a team of creatures with different abilities. The official browser host offers hotseat setup and 1v1 or 2v2 match options; the project labels this build alpha.",
        objective:
          "Choose units, manage your resources and use their abilities to defeat the opposing team.",
        mode: "Select hotseat, team size, turn time and other match settings before opening a battle.",
        controls:
          "Use the game board's unit, target and ability controls. The official page asks portrait phone users to rotate to landscape.",
        tip: "Read each unit's ability before spending materialization points on your squad.",
      },
      ko: {
        title: "Ancient Beast",
        subtitle: "크리처 부대를 구성해 상대의 수를 앞서세요.",
        description:
          "서로 다른 능력을 지닌 크리처 팀을 구성해 겨루는 턴제 전술 게임입니다. 공식 브라우저 호스트에서 핫시트 설정과 1대1·2대2 대전을 선택할 수 있으며 프로젝트는 이 빌드를 알파로 표시합니다.",
        objective:
          "유닛을 고르고 자원을 관리하며 각 능력을 활용해 상대 팀을 물리치세요.",
        mode: "대전을 열기 전에 핫시트, 팀 인원, 턴 시간과 기타 설정을 선택하세요.",
        controls:
          "게임 보드의 유닛·대상·능력 조작을 사용하세요. 공식 페이지는 세로 화면의 휴대폰을 가로로 돌리라고 안내합니다.",
        tip: "크리처를 영입하는 데 자원을 쓰기 전에 각 유닛의 능력을 확인하세요.",
      },
    },
  },
  {
    id: "opengames-labyrinth",
    added: "2026-10-16",
    category: "puzzle",
    controlStyle: "directional",
    color: "mint",
    inputs: ["touch", "keyboard", "gamepad"],
    tags: {
      en: [
        "OpenGames Labyrinth",
        "procedural maze game",
        "maze escape",
        "touch game",
        "MIT browser game",
      ],
      ko: [
        "OpenGames 미로",
        "절차 생성 미로 게임",
        "미로 탈출",
        "터치 게임",
        "MIT 브라우저 게임",
      ],
    },
    license: "MIT code, original artwork and synthesized audio",
    licenseUrl: `${openGamesRoot}/blob/main/LICENSE`,
    author: "OpenGames contributors",
    source: openGamesRoot,
    url: `${openGamesHost}/labyrinth/index.html`,
    host: { en: "OpenGames project game", ko: "OpenGames 프로젝트 게임" },
    hostNote: openGamesNote,
    artworkAlt: {
      en: "Original Denny Games maze illustration",
      ko: "데니 게임즈 자체 미로 일러스트",
    },
    copy: {
      en: {
        title: "OpenGames Labyrinth",
        subtitle: "Find the exit through a maze that changes each round.",
        description:
          "Navigate a randomly generated maze in one of three sizes. OpenGames provides touch, keyboard, on-screen arrow and standard gamepad controls.",
        objective: "Reach the maze exit and finish in as few moves as you can.",
        mode: "Choose Easy, Normal or Hard to change the maze size.",
        controls:
          "Use arrow keys, WASD, swipe gestures, the on-screen arrows or a standard gamepad.",
        tip: "Follow one wall consistently when you feel turned around.",
      },
      ko: {
        title: "OpenGames 미로",
        subtitle: "매번 달라지는 미로를 지나 출구를 찾아요.",
        description:
          "세 가지 크기 중 하나를 골라 무작위로 생성된 미로를 탐험하세요. OpenGames는 터치·키보드·화면 방향 버튼·표준 게임패드를 지원한다고 안내합니다.",
        objective: "가능한 적은 이동으로 미로의 출구에 도착하세요.",
        mode: "Easy·Normal·Hard를 골라 미로 크기를 바꾸세요.",
        controls:
          "방향키, WASD, 스와이프, 화면 방향 버튼 또는 표준 게임패드를 사용하세요.",
        tip: "길을 잃었다면 한쪽 벽을 정해 계속 따라가 보세요.",
      },
    },
  },
  {
    id: "opengames-snake",
    added: "2026-10-16",
    category: "arcade",
    controlStyle: "directional",
    color: "blue",
    inputs: ["touch", "keyboard", "gamepad"],
    tags: {
      en: [
        "OpenGames Snake",
        "classic snake game",
        "arcade snake",
        "touch snake game",
        "MIT browser game",
      ],
      ko: [
        "OpenGames 스네이크",
        "클래식 스네이크 게임",
        "아케이드 뱀 게임",
        "터치 스네이크 게임",
        "MIT 브라우저 게임",
      ],
    },
    license: "MIT code, original artwork and synthesized audio",
    licenseUrl: `${openGamesRoot}/blob/main/LICENSE`,
    author: "OpenGames contributors",
    source: openGamesRoot,
    url: `${openGamesHost}/snake/index.html`,
    host: { en: "OpenGames project game", ko: "OpenGames 프로젝트 게임" },
    hostNote: openGamesNote,
    artworkAlt: {
      en: "Original Denny Games coiled snake illustration",
      ko: "데니 게임즈 자체 뱀 일러스트",
    },
    copy: {
      en: {
        title: "OpenGames Snake",
        subtitle: "Eat, grow and leave enough room to turn.",
        description:
          "Guide a growing snake around the board, collect food and avoid its body. Pick a starting speed and keep the run going as the snake gets longer.",
        objective:
          "Collect food to grow without hitting a wall or your own tail.",
        mode: "Choose a starting speed; the game accelerates as your snake grows.",
        controls:
          "Use arrow keys, WASD, swipe gestures, on-screen arrows or a standard gamepad.",
        tip: "Leave a wide loop near the edges so you have room to turn later.",
      },
      ko: {
        title: "OpenGames 스네이크",
        subtitle: "먹이를 먹고 자라며 방향을 틀 공간을 남기세요.",
        description:
          "보드 위의 뱀을 움직여 먹이를 모으고 몸통과 부딪히지 않도록 조심하세요. 시작 속도를 고르고 몸이 길어지는 동안 달리기를 이어가세요.",
        objective:
          "벽이나 자기 꼬리에 부딪히지 않고 먹이를 모아 뱀을 키우세요.",
        mode: "시작 속도를 고를 수 있으며 뱀이 자랄수록 게임이 빨라집니다.",
        controls:
          "방향키, WASD, 스와이프, 화면 방향 버튼 또는 표준 게임패드를 사용하세요.",
        tip: "나중에 방향을 틀 수 있도록 가장자리 가까이에 넓은 회전 공간을 남겨두세요.",
      },
    },
  },
  {
    id: "opengames-memory",
    added: "2026-10-16",
    category: "puzzle",
    controlStyle: "pointer",
    color: "yellow",
    inputs: ["touch", "mouse", "keyboard"],
    tags: {
      en: [
        "OpenGames Memory",
        "memory matching game",
        "card matching puzzle",
        "concentration game",
        "MIT browser game",
      ],
      ko: [
        "OpenGames 메모리",
        "메모리 카드 맞추기",
        "카드 짝맞추기 퍼즐",
        "집중력 게임",
        "MIT 브라우저 게임",
      ],
    },
    license: "MIT code, original artwork and synthesized audio",
    licenseUrl: `${openGamesRoot}/blob/main/LICENSE`,
    author: "OpenGames contributors",
    source: openGamesRoot,
    url: `${openGamesHost}/memory/index.html`,
    host: { en: "OpenGames project game", ko: "OpenGames 프로젝트 게임" },
    hostNote: openGamesNote,
    artworkAlt: {
      en: "Original Denny Games illustration of matching cards",
      ko: "데니 게임즈 자체 짝맞추기 카드 일러스트",
    },
    copy: {
      en: {
        title: "OpenGames Memory",
        subtitle: "Turn over cards and remember where each symbol waits.",
        description:
          "Find matching pairs by remembering the symbols on face-down cards. Choose a deck with 2, 8 or 10 pairs and try to clear it in fewer turns.",
        objective: "Match every pair of cards on the board.",
        mode: "Pick the number of pairs to make the memory challenge shorter or longer.",
        controls:
          "Tap or click a card. Keyboard arrows select cards; Enter or Space turns one over.",
        tip: "Say each symbol and its position to yourself when you reveal it.",
      },
      ko: {
        title: "OpenGames 메모리",
        subtitle: "카드를 뒤집고 각 그림의 위치를 기억하세요.",
        description:
          "뒷면 카드의 그림을 기억해 짝을 찾으세요. 두 쌍·여덟 쌍·열 쌍 중 하나를 골라 더 짧거나 긴 기억력 도전을 시작할 수 있습니다.",
        objective: "보드에 놓인 모든 카드의 짝을 맞추세요.",
        mode: "카드 짝의 수를 골라 기억력 도전의 길이를 바꾸세요.",
        controls:
          "카드를 누르거나 클릭하세요. 키보드 방향키로 고르고 Enter 또는 Space로 뒤집습니다.",
        tip: "카드를 열 때 그림과 위치를 함께 소리 내어 기억해보세요.",
      },
    },
  },
  {
    id: "opengames-whac-a-mole",
    added: "2026-10-16",
    category: "arcade",
    controlStyle: "pointer",
    color: "rust",
    inputs: ["touch", "mouse", "keyboard"],
    tags: {
      en: [
        "OpenGames Whac-A-Mole",
        "whack a mole game",
        "reaction time game",
        "30 second arcade game",
        "MIT browser game",
      ],
      ko: [
        "OpenGames 두더지 잡기",
        "두더지 잡기 게임",
        "반응 속도 게임",
        "30초 아케이드",
        "MIT 브라우저 게임",
      ],
    },
    license: "MIT code, original artwork and synthesized audio",
    licenseUrl: `${openGamesRoot}/blob/main/LICENSE`,
    author: "OpenGames contributors",
    source: openGamesRoot,
    url: `${openGamesHost}/whac-a-mole/index.html`,
    host: { en: "OpenGames project game", ko: "OpenGames 프로젝트 게임" },
    hostNote: openGamesNote,
    artworkAlt: {
      en: "Original Denny Games mole popping out of a burrow",
      ko: "굴에서 고개를 내민 두더지 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "OpenGames Whac-A-Mole",
        subtitle: "Catch the moles before the thirty-second round ends.",
        description:
          "React when a mole pops up, choose a difficulty and try to beat your personal best before the short timer runs out.",
        objective: "Hit as many moles as possible during the 30-second round.",
        mode: "Choose Easy, Normal or Hard to change the reaction window.",
        controls:
          "Tap or click a mole, use keys 1–9, or select a hole with arrows and hit with Space.",
        tip: "Watch the whole board instead of staring at one hole.",
      },
      ko: {
        title: "OpenGames 두더지 잡기",
        subtitle: "30초가 끝나기 전에 두더지를 잡으세요.",
        description:
          "두더지가 나타나는 순간 반응하고 난이도를 골라 짧은 제한 시간 동안 최고 기록에 도전하세요.",
        objective: "30초 동안 가능한 많은 두더지를 잡으세요.",
        mode: "Easy·Normal·Hard를 골라 반응해야 하는 시간을 바꾸세요.",
        controls:
          "두더지를 탭하거나 클릭하세요. 1–9 키를 쓰거나 방향키로 구멍을 고른 뒤 Space를 누르세요.",
        tip: "한 구멍만 보지 말고 보드 전체를 넓게 살펴보세요.",
      },
    },
  },
  {
    id: "opengames-flap",
    added: "2026-10-16",
    category: "arcade",
    controlStyle: "directional",
    color: "mint",
    inputs: ["touch", "mouse", "keyboard", "gamepad"],
    tags: {
      en: [
        "OpenGames Flap",
        "flappy bird style game",
        "one button flying game",
        "tap to flap",
        "MIT browser game",
      ],
      ko: [
        "OpenGames 플랩",
        "날개짓 아케이드 게임",
        "원 버튼 비행 게임",
        "탭해서 날기",
        "MIT 브라우저 게임",
      ],
    },
    license: "MIT code, original artwork and synthesized audio",
    licenseUrl: `${openGamesRoot}/blob/main/LICENSE`,
    author: "OpenGames contributors",
    source: openGamesRoot,
    url: `${openGamesHost}/flap/index.html`,
    host: { en: "OpenGames project game", ko: "OpenGames 프로젝트 게임" },
    hostNote: openGamesNote,
    artworkAlt: {
      en: "Original Denny Games bird flying between gates",
      ko: "관문 사이를 나는 새를 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "OpenGames Flap",
        subtitle: "Tap to fly through the gaps without touching a post.",
        description:
          "Keep a small bird in the air through a moving series of gaps. Adjust the difficulty and try to pass one more post on every run.",
        objective:
          "Fly through the openings and avoid the ground, ceiling and posts.",
        mode: "Choose a gap size and speed; the course gets a little faster as your score grows.",
        controls:
          "Tap or click, press Space, Enter, Up or W, or use a standard gamepad.",
        tip: "Use short taps to make small corrections instead of holding the flap control.",
      },
      ko: {
        title: "OpenGames 플랩",
        subtitle: "관문에 부딪히지 않게 탭해서 날아가세요.",
        description:
          "움직이는 틈 사이로 작은 새를 날려 보내세요. 난이도를 고르고 매번 관문 하나를 더 통과하는 기록에 도전하세요.",
        objective: "땅·천장·기둥에 부딪히지 않고 열린 틈을 통과하세요.",
        mode: "틈의 크기와 속도를 고르세요. 점수가 오를수록 코스가 조금씩 빨라집니다.",
        controls:
          "탭하거나 클릭하고 Space·Enter·위쪽 방향키·W를 누르거나 표준 게임패드를 사용하세요.",
        tip: "날기 버튼을 계속 누르기보다 짧게 탭해 높이를 조금씩 조절하세요.",
      },
    },
  },
  {
    id: "opengames-blocks",
    added: "2026-10-16",
    category: "puzzle",
    controlStyle: "directional",
    color: "blue",
    inputs: ["touch", "keyboard", "gamepad"],
    tags: {
      en: [
        "OpenGames Blocks",
        "falling block puzzle",
        "line clear game",
        "touch block game",
        "MIT browser game",
      ],
      ko: [
        "OpenGames 블록",
        "낙하 블록 퍼즐",
        "줄 지우기 게임",
        "터치 블록 게임",
        "MIT 브라우저 게임",
      ],
    },
    license: "MIT code, original artwork and synthesized audio",
    licenseUrl: `${openGamesRoot}/blob/main/LICENSE`,
    author: "OpenGames contributors",
    source: openGamesRoot,
    url: `${openGamesHost}/blocks/index.html`,
    host: { en: "OpenGames project game", ko: "OpenGames 프로젝트 게임" },
    hostNote: openGamesNote,
    artworkAlt: {
      en: "Original Denny Games illustration of falling geometric blocks",
      ko: "떨어지는 기하학 블록 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "OpenGames Blocks",
        subtitle: "Fit the falling pieces together and clear full lines.",
        description:
          "Arrange falling shapes in a tall well, clear complete rows and keep pace as the level rises. The host offers touch buttons and a standard gamepad as well as keyboard controls.",
        objective: "Clear lines and keep the stack below the top of the board.",
        mode: "Choose a starting level; speed increases every ten cleared lines.",
        controls:
          "Arrows or WASD move pieces; X and Z rotate; Space drops. Swipe, on-screen buttons and gamepad controls are also documented.",
        tip: "Leave a well open for a long piece instead of filling every column evenly.",
      },
      ko: {
        title: "OpenGames 블록",
        subtitle: "떨어지는 조각을 맞춰 가로줄을 지우세요.",
        description:
          "길쭉한 보드에 도형을 놓아 가로줄을 완성하고 레벨이 오를수록 빨라지는 속도를 따라가세요. 호스트는 키보드와 함께 터치 버튼·표준 게임패드를 안내합니다.",
        objective: "줄을 지우고 블록이 보드 꼭대기까지 쌓이지 않게 하세요.",
        mode: "시작 레벨을 고를 수 있고 줄을 열 개 없앨 때마다 속도가 빨라집니다.",
        controls:
          "방향키 또는 WASD로 이동하고 X·Z로 회전, Space로 내립니다. 스와이프·화면 버튼·게임패드도 안내됩니다.",
        tip: "모든 칸을 고르게 채우기보다 긴 조각을 놓을 빈 통로를 남겨두세요.",
      },
    },
  },
  {
    id: "blockyard",
    added: "2026-10-16",
    category: "arcade",
    controlStyle: "directional",
    color: "violet",
    inputs: ["keyboard", "mouse"],
    tags: {
      en: [
        "Blockyard",
        "open browser game collection",
        "WebAssembly voxel game",
        "browser multiplayer games",
        "Arena Starfighter Skyship Bed Wars golf sandbox",
        "MIT open source game",
      ],
      ko: [
        "Blockyard",
        "오픈 브라우저 게임 모음",
        "웹어셈블리 복셀 게임",
        "브라우저 멀티플레이 게임",
        "아레나 스타파이터 스카이십 베드워즈 골프 샌드박스",
        "MIT 오픈소스 게임",
      ],
    },
    license: "MIT game and platform code · project-generated artwork",
    licenseUrl: "https://github.com/Potrock/blockyard/blob/main/LICENSE",
    author: "Potrock and Blockyard contributors",
    source: "https://github.com/Potrock/blockyard",
    url: "https://blockyard.gg/?game=arena",
    host: {
      en: "Blockyard developer-hosted browser game lobby",
      ko: "Blockyard 개발자 호스팅 브라우저 게임 로비",
    },
    hostNote: blockyardNote,
    artworkAlt: {
      en: "Original Denny Games illustration of small voxel worlds and game modes",
      ko: "작은 복셀 세계와 게임 모드를 그린 데니 게임즈 자체 일러스트",
    },
    copy: {
      en: {
        title: "Blockyard",
        subtitle: "Pick a voxel game mode and join the bots as a guest.",
        description:
          "A browser game lobby built on an open-source WebAssembly voxel engine. The live menu offers modes ranging from a wave-survival arena and starfighter to an airship, golf, obstacle course and sandbox.",
        objective:
          "Choose a mode in the host menu, enter a display name and follow that mode's goal and controls.",
        mode: "Guest progress lasts for the current visit; the host offers Discord sign-in to keep achievements.",
        controls:
          "The arena mode documents WASD movement, mouse attacks and additional keyboard actions. Check each mode's help before playing.",
        tip: "Start with the arena's bots to learn the controls before inviting friends to a private room.",
      },
      ko: {
        title: "Blockyard",
        subtitle: "복셀 게임 모드를 고르고 게스트로 봇과 겨뤄보세요.",
        description:
          "오픈소스 WebAssembly 복셀 엔진으로 만든 브라우저 게임 로비입니다. 현재 메뉴에는 웨이브 생존 아레나와 스타파이터, 비행선, 골프, 장애물 코스, 샌드박스 등 여러 모드가 있습니다.",
        objective:
          "호스트 메뉴에서 모드를 고르고 표시 이름을 입력한 뒤 해당 모드의 목표와 조작을 확인하세요.",
        mode: "게스트 진행은 현재 방문 중에만 유지되며 업적을 저장하려면 호스트에서 Discord 로그인을 제공합니다.",
        controls:
          "아레나는 WASD 이동, 마우스 공격과 추가 키보드 조작을 안내합니다. 플레이 전에 모드별 도움말을 확인하세요.",
        tip: "친구를 비공개 방에 초대하기 전에 아레나 봇과 겨뤄 조작을 익혀보세요.",
      },
    },
  },
];

type ExpandedListingSpec = {
  id: string;
  title: string;
  category: Game["category"];
  controlStyle: Game["controlStyle"];
  inputs: Game["inputs"];
  license: string;
  licenseDescription?: Record<Locale, string>;
  licenseUrl?: string;
  author: string;
  source: string;
  sourceLabel?: Record<Locale, string>;
  playModes?: Game["playModes"];
  isOpenSource?: boolean;
  url: string;
  host: Record<Locale, string>;
  hostNote: Record<Locale, string>;
  summary: Record<Locale, string>;
  controls: Record<Locale, string>;
  mode?: Record<Locale, string>;
  objective?: Record<Locale, string>;
  tip?: Record<Locale, string>;
  keywords?: Record<Locale, string[]>;
};

const mashukuiRoot = "https://github.com/mashukui/web-games";
const mashukuiPage = "https://mashukui.github.io/web-games";
const mashukuiHost = {
  en: "Author-hosted mashukui web game",
  ko: "제작자가 호스팅하는 mashukui 웹게임",
};
const mashukuiNote = {
  en: "The source project lists this game in its MIT-licensed collection of single-file HTML5 games and documents touch, mouse and keyboard input across the collection. Its linked GitHub Pages URL returned HTTP 200 on 2026-10-16. Denny Games links out only; complete gameplay and physical-device behavior were not tested.",
  ko: "소스 프로젝트는 이 게임을 MIT 라이선스 단일 파일 HTML5 게임 모음에 포함하고, 모음 전체에 터치·마우스·키보드 조작을 안내합니다. 연결된 GitHub Pages URL은 2026-10-16에 HTTP 200을 반환했습니다. 데니 게임즈는 링크만 제공하며 전체 플레이와 실기기 동작은 검증하지 않았습니다.",
};
const everyGameMadeHost = {
  en: "EveryGameMade licensed browser copy",
  ko: "EveryGameMade 라이선스 브라우저 사본",
};
const everyGameMadeNote = {
  en: "EveryGameMade says this is a copy of the named author's open-source game, served under the license shown on its page inside a sandbox. The page returned HTTP 200 on 2026-10-16. Denny Games links to that external host only; a complete session and device behavior were not tested.",
  ko: "EveryGameMade는 제작자의 오픈소스 게임 사본을 게임 페이지에 표시된 라이선스로 샌드박스 안에서 제공한다고 안내합니다. 페이지는 2026-10-16에 HTTP 200을 반환했습니다. 데니 게임즈는 외부 호스트로 연결만 하며 전체 플레이와 기기 동작은 검증하지 않았습니다.",
};
const openGamesOrgHost = {
  en: "open-games.org browser game page",
  ko: "open-games.org 브라우저 게임 페이지",
};
const openGamesOrgNote = {
  en: "The source project describes its CraftyJS HTML5 games as free and GPL-3.0 licensed. This linked page returned HTTP 200 on 2026-10-16. Denny Games links out only; gameplay and device compatibility were not tested.",
  ko: "소스 프로젝트는 CraftyJS 기반 HTML5 게임을 무료·GPL-3.0 라이선스로 안내합니다. 연결된 페이지는 2026-10-16에 HTTP 200을 반환했습니다. 데니 게임즈는 링크만 제공하며 플레이와 기기 호환성은 검증하지 않았습니다.",
};

const expandedListingSpecs: ExpandedListingSpec[] = [
  {
    id: "mashukui-ant-flap",
    title: "Ant Flap",
    category: "arcade",
    controlStyle: "buttons",
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseUrl: `${mashukuiRoot}/blob/main/LICENSE`,
    author: "mashukui",
    source: mashukuiRoot,
    url: `${mashukuiPage}/ant-flap/`,
    host: mashukuiHost,
    hostNote: mashukuiNote,
    summary: {
      en: "Guide a tiny ant through branches by timing each flap.",
      ko: "날갯짓 타이밍을 맞춰 작은 개미를 나뭇가지 사이로 안내하세요.",
    },
    controls: {
      en: "Use the host's touch, mouse or keyboard input.",
      ko: "호스트의 터치·마우스·키보드 조작을 사용하세요.",
    },
  },
  {
    id: "mashukui-ant-jump",
    title: "Ant Jump",
    category: "arcade",
    controlStyle: "directional",
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseUrl: `${mashukuiRoot}/blob/main/LICENSE`,
    author: "mashukui",
    source: mashukuiRoot,
    url: `${mashukuiPage}/ant-jump/`,
    host: mashukuiHost,
    hostNote: mashukuiNote,
    summary: {
      en: "Bounce an ant up a tower of moving, fragile and springy platforms.",
      ko: "움직이거나 부서지거나 튀어 오르는 발판을 밟아 개미를 위로 올리세요.",
    },
    controls: {
      en: "Use the host's touch, mouse or keyboard input.",
      ko: "호스트의 터치·마우스·키보드 조작을 사용하세요.",
    },
  },
  {
    id: "mashukui-block-drop",
    title: "Block Drop",
    category: "puzzle",
    controlStyle: "directional",
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseUrl: `${mashukuiRoot}/blob/main/LICENSE`,
    author: "mashukui",
    source: mashukuiRoot,
    url: `${mashukuiPage}/block-drop/`,
    host: mashukuiHost,
    hostNote: mashukuiNote,
    summary: {
      en: "Fit falling blocks together, clear rows and chase perfect clears.",
      ko: "떨어지는 블록을 맞춰 줄을 지우고 한 번에 보드를 비워 보세요.",
    },
    controls: {
      en: "Use the host's touch, mouse or keyboard input.",
      ko: "호스트의 터치·마우스·키보드 조작을 사용하세요.",
    },
  },
  {
    id: "mashukui-breakout",
    title: "Breakout",
    category: "arcade",
    controlStyle: "pointer",
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseUrl: `${mashukuiRoot}/blob/main/LICENSE`,
    author: "mashukui",
    source: mashukuiRoot,
    url: `${mashukuiPage}/breakout/`,
    host: mashukuiHost,
    hostNote: mashukuiNote,
    summary: {
      en: "Aim a paddle to break through bricks with angle-based ball physics.",
      ko: "패들을 움직여 공의 각도를 맞추고 벽돌을 깨뜨리세요.",
    },
    controls: {
      en: "Use the host's touch, mouse or keyboard input.",
      ko: "호스트의 터치·마우스·키보드 조작을 사용하세요.",
    },
  },
  {
    id: "mashukui-paddle-duel",
    title: "Paddle Duel",
    category: "sports",
    controlStyle: "pointer",
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseUrl: `${mashukuiRoot}/blob/main/LICENSE`,
    author: "mashukui",
    source: mashukuiRoot,
    url: `${mashukuiPage}/paddle-duel/`,
    host: mashukuiHost,
    hostNote: mashukuiNote,
    summary: {
      en: "Play a paddle-and-ball duel against an AI opponent in three difficulty levels.",
      ko: "세 가지 난이도 중 하나를 골라 AI 상대와 패들 대결을 펼치세요.",
    },
    controls: {
      en: "Use the host's touch, mouse or keyboard input.",
      ko: "호스트의 터치·마우스·키보드 조작을 사용하세요.",
    },
  },
  {
    id: "mashukui-stack-tower",
    title: "Stack Tower",
    category: "arcade",
    controlStyle: "buttons",
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseUrl: `${mashukuiRoot}/blob/main/LICENSE`,
    author: "mashukui",
    source: mashukuiRoot,
    url: `${mashukuiPage}/stack-tower/`,
    host: mashukuiHost,
    hostNote: mashukuiNote,
    summary: {
      en: "Drop one block at a time and line up each layer to build a taller tower.",
      ko: "블록을 한 번에 하나씩 떨어뜨려 층을 맞추며 탑을 높이 쌓으세요.",
    },
    controls: {
      en: "Use the host's touch, mouse or keyboard input.",
      ko: "호스트의 터치·마우스·키보드 조작을 사용하세요.",
    },
  },
  {
    id: "mashukui-tic-tac-toe",
    title: "Tic Tac Toe",
    category: "board",
    controlStyle: "pointer",
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseUrl: `${mashukuiRoot}/blob/main/LICENSE`,
    author: "mashukui",
    source: mashukuiRoot,
    url: `${mashukuiPage}/tic-tac-toe/`,
    host: mashukuiHost,
    hostNote: mashukuiNote,
    summary: {
      en: "Play three in a row against an AI or take turns with another player on one device.",
      ko: "AI와 삼목을 두거나 한 기기에서 다른 사람과 번갈아 플레이하세요.",
    },
    controls: {
      en: "Choose a square using the host's touch, mouse or keyboard controls.",
      ko: "호스트의 터치·마우스·키보드 조작으로 칸을 선택하세요.",
    },
  },
  {
    id: "mashukui-minesweeper",
    title: "Minesweeper",
    category: "puzzle",
    controlStyle: "pointer",
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseUrl: `${mashukuiRoot}/blob/main/LICENSE`,
    author: "mashukui",
    source: mashukuiRoot,
    url: `${mashukuiPage}/minesweeper/`,
    host: mashukuiHost,
    hostNote: mashukuiNote,
    summary: {
      en: "Reveal safe squares, flag the mines and choose among three board sizes.",
      ko: "안전한 칸을 열고 지뢰에 표시하며 세 가지 보드 크기 중에서 선택하세요.",
    },
    controls: {
      en: "Use the host's touch, mouse or keyboard input.",
      ko: "호스트의 터치·마우스·키보드 조작을 사용하세요.",
    },
  },
  {
    id: "mashukui-memory-match",
    title: "Memory Match",
    category: "puzzle",
    controlStyle: "pointer",
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseUrl: `${mashukuiRoot}/blob/main/LICENSE`,
    author: "mashukui",
    source: mashukuiRoot,
    url: `${mashukuiPage}/memory-match/`,
    host: mashukuiHost,
    hostNote: mashukuiNote,
    summary: {
      en: "Find matching card pairs by remembering their positions across three difficulties.",
      ko: "세 가지 난이도에서 카드 위치를 기억해 짝을 찾아보세요.",
    },
    controls: {
      en: "Use the host's touch, mouse or keyboard input.",
      ko: "호스트의 터치·마우스·키보드 조작을 사용하세요.",
    },
  },
  {
    id: "mashukui-star-defender",
    title: "Star Defender",
    category: "shooting",
    controlStyle: "directional",
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseUrl: `${mashukuiRoot}/blob/main/LICENSE`,
    author: "mashukui",
    source: mashukuiRoot,
    url: `${mashukuiPage}/star-defender/`,
    host: mashukuiHost,
    hostNote: mashukuiNote,
    summary: {
      en: "Move through waves of enemies, shoot, dodge and try to survive longer.",
      ko: "적의 파도를 피해 이동하고 공격하며 더 오래 살아남으세요.",
    },
    controls: {
      en: "Use the host's touch, mouse or keyboard input.",
      ko: "호스트의 터치·마우스·키보드 조작을 사용하세요.",
    },
  },
  {
    id: "mashukui-dino-run",
    title: "Dino Run",
    category: "arcade",
    controlStyle: "buttons",
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseUrl: `${mashukuiRoot}/blob/main/LICENSE`,
    author: "mashukui",
    source: mashukuiRoot,
    url: `${mashukuiPage}/dino-run/`,
    host: mashukuiHost,
    hostNote: mashukuiNote,
    summary: {
      en: "Run across the desert, jump cacti, duck birds and keep up as the pace rises.",
      ko: "사막을 달리며 선인장을 뛰어넘고 새를 피하세요. 속도는 점점 빨라집니다.",
    },
    controls: {
      en: "Use the host's touch, mouse or keyboard input.",
      ko: "호스트의 터치·마우스·키보드 조작을 사용하세요.",
    },
  },
  {
    id: "mashukui-piano-tap",
    title: "Piano Tap",
    category: "arcade",
    controlStyle: "buttons",
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseUrl: `${mashukuiRoot}/blob/main/LICENSE`,
    author: "mashukui",
    source: mashukuiRoot,
    url: `${mashukuiPage}/piano-tap/`,
    host: mashukuiHost,
    hostNote: mashukuiNote,
    summary: {
      en: "Tap the lowest black tile before it passes the board; touching white ends the run.",
      ko: "검은 타일이 보드를 지나가기 전에 누르세요. 흰 타일을 누르면 달리기가 끝납니다.",
    },
    controls: {
      en: "Use the host's touch, mouse or keyboard input.",
      ko: "호스트의 터치·마우스·키보드 조작을 사용하세요.",
    },
  },
  {
    id: "mashukui-cross-road",
    title: "Cross Road",
    category: "arcade",
    controlStyle: "directional",
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseUrl: `${mashukuiRoot}/blob/main/LICENSE`,
    author: "mashukui",
    source: mashukuiRoot,
    url: `${mashukuiPage}/cross-road/`,
    host: mashukuiHost,
    hostNote: mashukuiNote,
    summary: {
      en: "Hop across tiles, avoid traffic and ride floating logs over the river.",
      ko: "타일을 건너고 차량을 피하며 강에서는 떠다니는 통나무를 타세요.",
    },
    controls: {
      en: "Use the host's touch, mouse or keyboard input.",
      ko: "호스트의 터치·마우스·키보드 조작을 사용하세요.",
    },
  },
  {
    id: "mashukui-slide-puzzle",
    title: "Slide Puzzle",
    category: "puzzle",
    controlStyle: "pointer",
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseUrl: `${mashukuiRoot}/blob/main/LICENSE`,
    author: "mashukui",
    source: mashukuiRoot,
    url: `${mashukuiPage}/slide-puzzle/`,
    host: mashukuiHost,
    hostNote: mashukuiNote,
    summary: {
      en: "Slide numbered tiles into order using as few moves as you can.",
      ko: "숫자 타일을 밀어 순서대로 맞추고 이동 횟수를 줄여 보세요.",
    },
    controls: {
      en: "Use the host's touch, mouse or keyboard input.",
      ko: "호스트의 터치·마우스·키보드 조작을 사용하세요.",
    },
  },
  {
    id: "mashukui-fruit-slice",
    title: "Fruit Slice",
    category: "action",
    controlStyle: "pointer",
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseUrl: `${mashukuiRoot}/blob/main/LICENSE`,
    author: "mashukui",
    source: mashukuiRoot,
    url: `${mashukuiPage}/fruit-slice/`,
    host: mashukuiHost,
    hostNote: mashukuiNote,
    summary: {
      en: "Swipe through fruit, chain combos and avoid the bombs.",
      ko: "과일을 가르고 연속 콤보를 만들되 폭탄은 피하세요.",
    },
    controls: {
      en: "Use the host's touch, mouse or keyboard input.",
      ko: "호스트의 터치·마우스·키보드 조작을 사용하세요.",
    },
  },
  {
    id: "mashukui-bubble-shooter",
    title: "Bubble Shooter",
    category: "arcade",
    controlStyle: "pointer",
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseUrl: `${mashukuiRoot}/blob/main/LICENSE`,
    author: "mashukui",
    source: mashukuiRoot,
    url: `${mashukuiPage}/bubble-shooter/`,
    host: mashukuiHost,
    hostNote: mashukuiNote,
    summary: {
      en: "Aim and fire to match bubbles; clear a cluster to drop the ones beneath it.",
      ko: "거품을 조준해 같은 색을 맞추고 아래에 매달린 거품까지 떨어뜨리세요.",
    },
    controls: {
      en: "Use the host's touch, mouse or keyboard input.",
      ko: "호스트의 터치·마우스·키보드 조작을 사용하세요.",
    },
  },
  {
    id: "mashukui-sudoku",
    title: "Sudoku",
    category: "puzzle",
    controlStyle: "numbers",
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseUrl: `${mashukuiRoot}/blob/main/LICENSE`,
    author: "mashukui",
    source: mashukuiRoot,
    url: `${mashukuiPage}/sudoku/`,
    host: mashukuiHost,
    hostNote: mashukuiNote,
    summary: {
      en: "Fill a number grid at one of three difficulties; each generated puzzle has one solution.",
      ko: "세 가지 난이도의 숫자 격자를 채우세요. 생성된 퍼즐마다 해답은 하나입니다.",
    },
    controls: {
      en: "Select a cell and enter a number using the host's controls.",
      ko: "칸을 선택하고 호스트 조작으로 숫자를 입력하세요.",
    },
  },
  {
    id: "mashukui-merge-drop",
    title: "Merge Drop",
    category: "puzzle",
    controlStyle: "pointer",
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseUrl: `${mashukuiRoot}/blob/main/LICENSE`,
    author: "mashukui",
    source: mashukuiRoot,
    url: `${mashukuiPage}/merge-drop/`,
    host: mashukuiHost,
    hostNote: mashukuiNote,
    summary: {
      en: "Drop matching fruit and merge each pair into a larger one.",
      ko: "같은 과일을 떨어뜨려 합치고 더 큰 과일로 키우세요.",
    },
    controls: {
      en: "Use the host's touch, mouse or keyboard input.",
      ko: "호스트의 터치·마우스·키보드 조작을 사용하세요.",
    },
  },
  {
    id: "mashukui-water-sort",
    title: "Water Sort",
    category: "puzzle",
    controlStyle: "pointer",
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseUrl: `${mashukuiRoot}/blob/main/LICENSE`,
    author: "mashukui",
    source: mashukuiRoot,
    url: `${mashukuiPage}/water-sort/`,
    host: mashukuiHost,
    hostNote: mashukuiNote,
    summary: {
      en: "Pour colored liquid between tubes until each tube holds a single color.",
      ko: "각 시험관에 한 가지 색만 남도록 색깔 액체를 옮겨 담으세요.",
    },
    controls: {
      en: "Use the host's touch, mouse or keyboard input.",
      ko: "호스트의 터치·마우스·키보드 조작을 사용하세요.",
    },
  },
  {
    id: "mashukui-slingshot",
    title: "Slingshot",
    category: "action",
    controlStyle: "pointer",
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseUrl: `${mashukuiRoot}/blob/main/LICENSE`,
    author: "mashukui",
    source: mashukuiRoot,
    url: `${mashukuiPage}/slingshot/`,
    host: mashukuiHost,
    hostNote: mashukuiNote,
    summary: {
      en: "Pull back, follow the projected arc and release to aim for the target.",
      ko: "뒤로 당겨 예상 궤적을 보고 놓아 과녁을 맞히세요.",
    },
    controls: {
      en: "Use the host's touch, mouse or keyboard input.",
      ko: "호스트의 터치·마우스·키보드 조작을 사용하세요.",
    },
  },
  {
    id: "mashukui-helix-drop",
    title: "Helix Drop",
    category: "action",
    controlStyle: "pointer",
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseUrl: `${mashukuiRoot}/blob/main/LICENSE`,
    author: "mashukui",
    source: mashukuiRoot,
    url: `${mashukuiPage}/helix-drop/`,
    host: mashukuiHost,
    hostNote: mashukuiNote,
    summary: {
      en: "Rotate a helix tower to guide a falling ball through its gaps.",
      ko: "나선 탑을 회전해 공이 틈을 통과하도록 안내하세요.",
    },
    controls: {
      en: "Use the host's touch, mouse or keyboard input.",
      ko: "호스트의 터치·마우스·키보드 조작을 사용하세요.",
    },
  },
  {
    id: "mashukui-gem-match",
    title: "Gem Match",
    category: "puzzle",
    controlStyle: "pointer",
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseUrl: `${mashukuiRoot}/blob/main/LICENSE`,
    author: "mashukui",
    source: mashukuiRoot,
    url: `${mashukuiPage}/gem-match/`,
    host: mashukuiHost,
    hostNote: mashukuiNote,
    summary: {
      en: "Swap neighboring gems, make matches of three and build cascading combos.",
      ko: "이웃한 보석을 바꾸어 세 개 이상 맞추고 연속 콤보를 만드세요.",
    },
    controls: {
      en: "Use the host's touch, mouse or keyboard input.",
      ko: "호스트의 터치·마우스·키보드 조작을 사용하세요.",
    },
  },
  {
    id: "mashukui-maze-muncher",
    title: "Maze Muncher",
    category: "arcade",
    controlStyle: "directional",
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseUrl: `${mashukuiRoot}/blob/main/LICENSE`,
    author: "mashukui",
    source: mashukuiRoot,
    url: `${mashukuiPage}/maze-muncher/`,
    host: mashukuiHost,
    hostNote: mashukuiNote,
    summary: {
      en: "Clear every dot in a maze while four ghosts chase you; power pellets let you fight back.",
      ko: "네 유령을 피해 미로의 점을 모두 먹으세요. 파워 알약을 먹으면 반격할 수 있습니다.",
    },
    controls: {
      en: "Use the host's touch, mouse or keyboard input.",
      ko: "호스트의 터치·마우스·키보드 조작을 사용하세요.",
    },
  },
  {
    id: "mashukui-air-hockey",
    title: "Air Hockey",
    category: "sports",
    controlStyle: "pointer",
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseUrl: `${mashukuiRoot}/blob/main/LICENSE`,
    author: "mashukui",
    source: mashukuiRoot,
    url: `${mashukuiPage}/air-hockey/`,
    host: mashukuiHost,
    hostNote: mashukuiNote,
    summary: {
      en: "Drag a mallet to hit the puck; the first player to seven goals wins.",
      ko: "말렛을 움직여 퍽을 치세요. 먼저 일곱 골을 넣는 쪽이 이깁니다.",
    },
    controls: {
      en: "Use the host's touch, mouse or keyboard input.",
      ko: "호스트의 터치·마우스·키보드 조작을 사용하세요.",
    },
  },
  {
    id: "mashukui-battleship",
    title: "Battleship",
    category: "board",
    controlStyle: "pointer",
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseUrl: `${mashukuiRoot}/blob/main/LICENSE`,
    author: "mashukui",
    source: mashukuiRoot,
    url: `${mashukuiPage}/battleship/`,
    host: mashukuiHost,
    hostNote: mashukuiNote,
    summary: {
      en: "Place a fleet, then search the hidden grid to find five enemy ships.",
      ko: "함대를 배치한 뒤 숨겨진 격자를 탐색해 적 함선 다섯 척을 찾으세요.",
    },
    controls: {
      en: "Use the host's touch, mouse or keyboard input.",
      ko: "호스트의 터치·마우스·키보드 조작을 사용하세요.",
    },
  },
  {
    id: "mashukui-sokoban",
    title: "Sokoban",
    category: "puzzle",
    controlStyle: "directional",
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseUrl: `${mashukuiRoot}/blob/main/LICENSE`,
    author: "mashukui",
    source: mashukuiRoot,
    url: `${mashukuiPage}/sokoban/`,
    host: mashukuiHost,
    hostNote: mashukuiNote,
    summary: {
      en: "Push every crate onto a target across thirty levels; undo moves when needed.",
      ko: "서른 개 레벨에서 상자를 목표 지점으로 밀어 옮기세요. 필요하면 되돌릴 수 있습니다.",
    },
    controls: {
      en: "Use the host's touch, mouse or keyboard input.",
      ko: "호스트의 터치·마우스·키보드 조작을 사용하세요.",
    },
  },
  {
    id: "mashukui-lights-out",
    title: "Lights Out",
    category: "puzzle",
    controlStyle: "pointer",
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseUrl: `${mashukuiRoot}/blob/main/LICENSE`,
    author: "mashukui",
    source: mashukuiRoot,
    url: `${mashukuiPage}/lights-out/`,
    host: mashukuiHost,
    hostNote: mashukuiNote,
    summary: {
      en: "Switch off every light by tapping it and its four neighbors.",
      ko: "불을 누르면 주변 네 칸도 바뀝니다. 모든 불을 꺼 보세요.",
    },
    controls: {
      en: "Use the host's touch, mouse or keyboard input.",
      ko: "호스트의 터치·마우스·키보드 조작을 사용하세요.",
    },
  },
  {
    id: "everygamemade-afterglow",
    title: "AFTERGLOW",
    category: "arcade",
    controlStyle: "pointer",
    inputs: ["touch", "mouse"],
    license: "MIT",
    licenseUrl: "https://everygamemade.com/arcade/afterglow/LICENSE.txt",
    author: "David Linacre (DLinacre)",
    source: "https://github.com/DLinacre/afterglow",
    url: "https://everygamemade.com/arcade/afterglow/index.html",
    host: everyGameMadeHost,
    hostNote: everyGameMadeNote,
    summary: {
      en: "Paint long-exposure trails by steering glowing lights across a night sky.",
      ko: "밤하늘을 움직이는 빛으로 장노출 사진 같은 흔적을 그려 보세요.",
    },
    controls: {
      en: "Hold and drag anywhere to paint; the page also offers undo and develop actions.",
      ko: "화면을 누른 채 끌어 그리세요. 실행 취소와 현상 기능도 있습니다.",
    },
  },
  {
    id: "everygamemade-anime-dash",
    title: "Anime Dash",
    category: "action",
    controlStyle: "directional",
    inputs: ["touch", "keyboard"],
    license: "MIT",
    licenseUrl: "https://everygamemade.com/arcade/anime-dash/LICENSE.txt",
    author: "Muthu Sivasubramanian (smuthu7)",
    source: "https://github.com/smuthu7/anime-dash",
    url: "https://everygamemade.com/arcade/anime-dash/index.html",
    host: everyGameMadeHost,
    hostNote: everyGameMadeNote,
    summary: {
      en: "Turn a photo into a cel-shaded hero, then collect stars and dodge hazards for sixty seconds.",
      ko: "사진을 셀 셰이딩 영웅으로 바꾸고 60초 동안 별을 모으며 장애물을 피하세요.",
    },
    controls: {
      en: "Drag on screen or move with WASD or the arrow keys.",
      ko: "화면을 끌거나 WASD 또는 방향키로 움직이세요.",
    },
  },
  {
    id: "everygamemade-clownword-desert",
    title: "ClownWord Desert",
    category: "action",
    controlStyle: "directional",
    inputs: ["keyboard"],
    license: "MIT",
    licenseUrl: "https://everygamemade.com/arcade/clownword-desert/LICENSE.txt",
    author: "iamrichmack111",
    source: "https://github.com/iamrichmack111/clownword-desert",
    url: "https://everygamemade.com/arcade/clownword-desert/index.html",
    host: everyGameMadeHost,
    hostNote: everyGameMadeNote,
    summary: {
      en: "Explore a desert and type each highlighted sight word to clear the clown carrying it.",
      ko: "사막을 돌아다니며 선택된 광대가 든 단어를 입력해 물리치세요.",
    },
    controls: {
      en: "Move with the arrow keys, hold Shift to sprint, type the word and press Enter.",
      ko: "방향키로 이동하고 Shift를 눌러 달리세요. 단어를 입력한 뒤 Enter를 누르세요.",
    },
  },
  {
    id: "everygamemade-ink-rider",
    title: "INK RIDER III",
    category: "racing",
    controlStyle: "pointer",
    inputs: ["touch", "mouse"],
    license: "MIT",
    licenseUrl: "https://everygamemade.com/arcade/ink-rider/LICENSE.txt",
    author: "jimdo-png",
    source: "https://github.com/jimdo-png/ink-rider",
    url: "https://everygamemade.com/arcade/ink-rider/index.html",
    host: everyGameMadeHost,
    hostNote: everyGameMadeNote,
    summary: {
      en: "Draw a road with ink and guide a rider along the path in this phone-first physics game.",
      ko: "잉크로 길을 그려 자전거를 안내하는 휴대폰 우선 물리 게임입니다.",
    },
    controls: {
      en: "Press Ride, then draw the road with a pointer or finger.",
      ko: "Ride를 누른 뒤 포인터나 손가락으로 길을 그리세요.",
    },
  },
  {
    id: "everygamemade-little-sky-pilot",
    title: "Little Sky Pilot",
    category: "arcade",
    controlStyle: "directional",
    inputs: ["keyboard"],
    license: "MIT",
    licenseUrl: "https://everygamemade.com/arcade/little-sky-pilot/LICENSE.txt",
    author: "Brian A. Robinson (brobin09)",
    source: "https://github.com/brobin09/PlaneGame",
    url: "https://everygamemade.com/arcade/little-sky-pilot/index.html",
    host: everyGameMadeHost,
    hostNote: everyGameMadeNote,
    summary: {
      en: "Build takeoff power, fly a small plane, collect stars and steer around weather.",
      ko: "이륙 동력을 모아 작은 비행기를 조종하고 별을 모으며 날씨를 피하세요.",
    },
    controls: {
      en: "Hold Up, W or Space to take off; steer with arrows or WASD.",
      ko: "Up, W 또는 Space를 눌러 이륙하고 방향키나 WASD로 조종하세요.",
    },
  },
  {
    id: "everygamemade-perf-and-postmark",
    title: "Perf & Postmark",
    category: "puzzle",
    controlStyle: "host",
    inputs: [],
    license: "MIT",
    licenseUrl:
      "https://everygamemade.com/arcade/perf-and-postmark/LICENSE.txt",
    author: "peterdsouza247",
    source: "https://github.com/peterdsouza247/postmark",
    url: "https://everygamemade.com/arcade/perf-and-postmark/index.html",
    host: everyGameMadeHost,
    hostNote: everyGameMadeNote,
    summary: {
      en: "Identify stamps by reading their inscriptions, measuring perforations and judging condition.",
      ko: "우표의 글자와 구멍 간격, 보존 상태를 살펴 우표를 알아맞히세요.",
    },
    controls: {
      en: "Choose a difficulty and follow the host's on-screen prompts.",
      ko: "난이도를 고르고 호스트 화면의 안내를 따라 진행하세요.",
    },
  },
  {
    id: "everygamemade-petrichor",
    title: "Petrichor",
    category: "arcade",
    controlStyle: "pointer",
    inputs: ["touch", "mouse"],
    license: "MIT",
    licenseUrl: "https://everygamemade.com/arcade/petrichor/LICENSE.txt",
    author: "MeatPopSci1972",
    source: "https://github.com/MeatPopSci1972/petrichor",
    url: "https://everygamemade.com/arcade/petrichor/index.html",
    host: everyGameMadeHost,
    hostNote: everyGameMadeNote,
    summary: {
      en: "Launch a water drop and find a route through drifting clouds to a yellow umbrella.",
      ko: "물방울을 날려 움직이는 구름을 지나 노란 우산까지 보내세요.",
    },
    controls: {
      en: "Set the starting water on the slider, then release to begin the trip.",
      ko: "슬라이더에서 시작 물의 양을 정한 뒤 놓아 여정을 시작하세요.",
    },
  },
  {
    id: "everygamemade-pulsefield",
    title: "Pulsefield",
    category: "arcade",
    controlStyle: "pointer",
    inputs: ["touch", "mouse"],
    license: "MIT",
    licenseUrl: "https://everygamemade.com/arcade/pulsefield/LICENSE.txt",
    author: "jenschristianschroder",
    source: "https://github.com/jenschristianschroder/pulsefield",
    url: "https://everygamemade.com/arcade/pulsefield/index.html",
    host: everyGameMadeHost,
    hostNote: everyGameMadeNote,
    summary: {
      en: "Collect sparks, steer clear of a growing swarm and pulse when the field closes in.",
      ko: "빛을 모으며 무리를 피하고 포위되기 전에 펄스를 터뜨리세요.",
    },
    controls: {
      en: "Drag anywhere to steer; tap Pulse when its meter is full.",
      ko: "화면을 끌어 이동하고 게이지가 차면 Pulse를 누르세요.",
    },
  },
  {
    id: "everygamemade-seal-vault",
    title: "SEAL VAULT",
    category: "simulation",
    controlStyle: "directional",
    inputs: ["touch", "keyboard"],
    license: "MIT",
    licenseUrl: "https://everygamemade.com/arcade/seal-vault/LICENSE.txt",
    author: "royalgames0",
    source: "https://github.com/royalgames0/SealVault",
    url: "https://everygamemade.com/arcade/seal-vault/index.html",
    host: everyGameMadeHost,
    hostNote: everyGameMadeNote,
    summary: {
      en: "Name a seal, explore an icy floe and visit minigames to collect fish and unlock items.",
      ko: "물범 이름을 짓고 얼음 위를 돌아다니며 미니게임으로 물고기와 아이템을 모으세요.",
    },
    controls: {
      en: "Move with the arrow keys or on-screen pad; press A at the vault gate.",
      ko: "방향키나 화면 패드로 이동하고 보관소 문에서 A를 누르세요.",
    },
  },
  {
    id: "everygamemade-solar-system",
    title: "Solar System",
    category: "strategy",
    controlStyle: "pointer",
    inputs: ["touch", "mouse"],
    license: "MIT",
    licenseUrl: "https://everygamemade.com/arcade/solar-system/LICENSE.txt",
    author: "Noah DeMar (noahdemar)",
    source: "https://github.com/noahdemar/game_solar_system",
    url: "https://everygamemade.com/arcade/solar-system/index.html",
    host: everyGameMadeHost,
    hostNote: everyGameMadeNote,
    summary: {
      en: "Choose a home base, plan routes and build a fleet among real planets and moons.",
      ko: "기지를 정하고 실제 행성과 위성 사이의 항로를 계획해 함대를 키우세요.",
    },
    controls: {
      en: "Drag to look, pinch or scroll to zoom, and select a station to travel.",
      ko: "끌어서 둘러보고 핀치나 스크롤로 확대하며 정거장을 선택해 이동하세요.",
    },
  },
  {
    id: "everygamemade-speed-racing",
    title: "极速狂飙 (Speed Racing)",
    category: "racing",
    controlStyle: "directional",
    inputs: ["touch", "keyboard"],
    license: "MIT",
    licenseUrl: "https://everygamemade.com/arcade/speed-racing/LICENSE.txt",
    author: "SW DAI (SWDAI916)",
    source: "https://github.com/SWDAI916/Road_Game",
    url: "https://everygamemade.com/arcade/speed-racing/index.html",
    host: everyGameMadeHost,
    hostNote: everyGameMadeNote,
    summary: {
      en: "Change lanes in an endless three-lane racer; the interface is in Chinese.",
      ko: "세 갈래 도로에서 차선을 바꾸며 끝없이 달리세요. 화면은 중국어로 표시됩니다.",
    },
    controls: {
      en: "Use left and right or A and D on desktop; tap or swipe on a phone.",
      ko: "PC에서는 좌우 방향키 또는 A·D를, 휴대폰에서는 좌우 터치나 스와이프를 사용하세요.",
    },
  },
  {
    id: "everygamemade-stupid-cjp",
    title: "Stupid CJP",
    category: "arcade",
    controlStyle: "host",
    inputs: [],
    license: "Apache-2.0",
    licenseUrl: "https://everygamemade.com/arcade/stupid-cjp/LICENSE.txt",
    author: "Kushagra (anshdwivedi922-oss)",
    source: "https://github.com/anshdwivedi922-oss/CJP-",
    url: "https://everygamemade.com/arcade/stupid-cjp/index.html",
    host: everyGameMadeHost,
    hostNote: everyGameMadeNote,
    summary: {
      en: "Line up a ricochet, clear a single-screen board and try again.",
      ko: "튕겨 나갈 각도를 맞춰 한 화면의 보드를 비우고 다시 도전하세요.",
    },
    controls: {
      en: "Press Play and follow the game page's aiming instructions.",
      ko: "Play를 누르고 게임 페이지의 조준 안내를 따라 진행하세요.",
    },
  },
  {
    id: "everygamemade-tank-battle",
    title: "坦克大战 (Tank Battle)",
    category: "action",
    controlStyle: "directional",
    inputs: ["keyboard"],
    license: "MIT",
    licenseUrl: "https://everygamemade.com/arcade/tank-battle/LICENSE.txt",
    author: "Michael-Rudalx",
    source: "https://github.com/Michael-Rudalx/tank-battle",
    url: "https://everygamemade.com/arcade/tank-battle/index.html",
    host: everyGameMadeHost,
    hostNote: everyGameMadeNote,
    summary: {
      en: "Defend a base, defeat ten enemy tanks per level and break brick walls; the interface is in Chinese.",
      ko: "기지를 지키며 레벨마다 적 전차 10대를 물리치고 벽돌 벽을 부수세요. 화면은 중국어로 표시됩니다.",
    },
    controls: {
      en: "Arrows move, Space fires, P pauses and R restarts.",
      ko: "방향키로 움직이고 Space로 발사, P로 일시정지, R로 다시 시작하세요.",
    },
  },
  {
    id: "everygamemade-ward-13",
    title: "WARD 13 — Anomaly Protocol",
    category: "action",
    controlStyle: "host",
    inputs: [],
    license: "MIT",
    licenseUrl: "https://everygamemade.com/arcade/ward-13/LICENSE.txt",
    author: "Negru Gabriel (Negru-Gabriel)",
    source: "https://github.com/Negru-Gabriel/WARD-13-Anomaly-Protocol",
    url: "https://everygamemade.com/arcade/ward-13/index.html",
    host: everyGameMadeHost,
    hostNote: everyGameMadeNote,
    summary: {
      en: "Walk a first-person hospital corridor, spot changes and report anomalies across twenty-five wards.",
      ko: "1인칭 병원 복도를 걸으며 달라진 점을 찾고 25개 병동의 이상 현상을 신고하세요.",
    },
    controls: {
      en: "Choose Enter Ward to begin or Briefing to read the host's instructions.",
      ko: "Enter Ward를 선택해 시작하거나 Briefing에서 호스트 안내를 읽으세요.",
    },
  },
  {
    id: "everygamemade-welcome-to-klang",
    title: "Welcome to Klang",
    category: "racing",
    controlStyle: "pointer",
    inputs: ["touch", "mouse"],
    license: "Apache-2.0",
    licenseUrl: "https://everygamemade.com/arcade/welcome-to-klang/LICENSE.txt",
    author: "SkylineClhS",
    source: "https://github.com/SkylineClhS/WelcomeToKlang",
    url: "https://everygamemade.com/arcade/welcome-to-klang/index.html",
    host: everyGameMadeHost,
    hostNote: everyGameMadeNote,
    summary: {
      en: "Ride a bicycle for one thousand meters while avoiding potholes, vehicles and animals.",
      ko: "자전거로 1,000m를 달리며 구덩이와 차량, 동물을 피하세요.",
    },
    controls: {
      en: "Hold or drag anywhere to steer; use the up and down buttons to change pace.",
      ko: "화면을 누른 채 끌어 방향을 잡고 위·아래 버튼으로 속도를 바꾸세요.",
    },
  },
  {
    id: "open-games-org-space-shooter",
    title: "Space Shooter",
    category: "shooting",
    controlStyle: "host",
    inputs: [],
    license: "GPL-3.0",
    licenseUrl:
      "https://github.com/opengamesorg/open-games.org/blob/main/LICENSE",
    author: "open-games.org contributors",
    source: "https://github.com/opengamesorg/open-games.org",
    url: "https://www.open-games.org/games/space-shooter/",
    host: openGamesOrgHost,
    hostNote: openGamesOrgNote,
    summary: {
      en: "A browser space shooter from the open-games.org collection of CraftyJS games.",
      ko: "CraftyJS 게임 모음 open-games.org에서 제공하는 브라우저 우주 슈팅 게임입니다.",
    },
    controls: {
      en: "Open the game host's instructions to confirm controls before playing.",
      ko: "플레이 전에 게임 호스트의 안내에서 조작법을 확인하세요.",
    },
  },
  {
    id: "open-games-org-temple-exploration",
    title: "Temple Exploration",
    category: "action",
    controlStyle: "host",
    inputs: [],
    license: "GPL-3.0",
    licenseUrl:
      "https://github.com/opengamesorg/open-games.org/blob/main/LICENSE",
    author: "open-games.org contributors",
    source: "https://github.com/opengamesorg/open-games.org",
    url: "https://www.open-games.org/games/temple-exploration/",
    host: openGamesOrgHost,
    hostNote: openGamesOrgNote,
    summary: {
      en: "Explore a temple in one of the open-games.org HTML5 browser games.",
      ko: "open-games.org HTML5 브라우저 게임에서 사원을 탐험하세요.",
    },
    controls: {
      en: "Open the game host's instructions to confirm controls before playing.",
      ko: "플레이 전에 게임 호스트의 안내에서 조작법을 확인하세요.",
    },
  },
  {
    id: "open-games-org-high-school-stories",
    title: "High School Stories",
    category: "strategy",
    controlStyle: "host",
    inputs: [],
    license: "GPL-3.0",
    licenseUrl:
      "https://github.com/opengamesorg/open-games.org/blob/main/LICENSE",
    author: "open-games.org contributors",
    source: "https://github.com/opengamesorg/open-games.org",
    url: "https://www.open-games.org/games/high-school-stories/",
    host: openGamesOrgHost,
    hostNote: openGamesOrgNote,
    summary: {
      en: "Try the demo version of a high-school story game hosted by open-games.org.",
      ko: "open-games.org에서 제공하는 고등학교 이야기 게임 데모를 플레이해 보세요.",
    },
    controls: {
      en: "Open the game host's instructions to confirm controls before playing.",
      ko: "플레이 전에 게임 호스트의 안내에서 조작법을 확인하세요.",
    },
  },
  {
    id: "open-games-org-brick-breaker",
    title: "Brick Breaker",
    category: "arcade",
    controlStyle: "host",
    inputs: [],
    license: "GPL-3.0",
    licenseUrl:
      "https://github.com/opengamesorg/open-games.org/blob/main/LICENSE",
    author: "open-games.org contributors",
    source: "https://github.com/opengamesorg/open-games.org",
    url: "https://www.open-games.org/games/brick-breaker/",
    host: openGamesOrgHost,
    hostNote: openGamesOrgNote,
    summary: {
      en: "Break bricks in an HTML5 arcade game from the open-games.org collection.",
      ko: "open-games.org 게임 모음의 HTML5 아케이드에서 벽돌을 깨뜨리세요.",
    },
    controls: {
      en: "Open the game host's instructions to confirm controls before playing.",
      ko: "플레이 전에 게임 호스트의 안내에서 조작법을 확인하세요.",
    },
  },
  {
    id: "open-games-org-ghost-escape",
    title: "Ghost Escape",
    category: "action",
    controlStyle: "host",
    inputs: [],
    license: "GPL-3.0",
    licenseUrl:
      "https://github.com/opengamesorg/open-games.org/blob/main/LICENSE",
    author: "open-games.org contributors",
    source: "https://github.com/opengamesorg/open-games.org",
    url: "https://www.open-games.org/games/ghost-escape/",
    host: openGamesOrgHost,
    hostNote: openGamesOrgNote,
    summary: {
      en: "Try to escape from a ghost in another open-games.org HTML5 browser game.",
      ko: "open-games.org의 또 다른 HTML5 브라우저 게임에서 유령을 피해 탈출하세요.",
    },
    controls: {
      en: "Open the game host's instructions to confirm controls before playing.",
      ko: "플레이 전에 게임 호스트의 안내에서 조작법을 확인하세요.",
    },
  },
];

type GraphicalListingSpec = Omit<ExpandedListingSpec, "isOpenSource"> & {
  isOpenSource: boolean;
};

const graphicalWaveSpecs: GraphicalListingSpec[] = [
  {
    id: "tessel",
    isOpenSource: true,
    title: "Tessel",
    category: "puzzle",
    controlStyle: "pointer",
    inputs: ["mouse", "keyboard"],
    license: "GPL-3.0",
    licenseUrl: "https://github.com/gvtulder/tessel/blob/main/LICENSE.md",
    author: "Gijs van Tulder",
    source: "https://github.com/gvtulder/tessel",
    url: "https://play.tessel.at/",
    host: {
      en: "Tessel official browser game",
      ko: "Tessel 공식 브라우저 게임",
    },
    hostNote: {
      en: "The project describes Tessel as a free, colorful tile game and publishes its source under GPL-3.0. Its official play page returned HTTP 200 on 2026-10-16. Denny Games links out only; a complete game session and device behavior were not tested.",
      ko: "프로젝트는 Tessel을 무료 컬러 타일 게임으로 소개하고 소스를 GPL-3.0으로 공개합니다. 공식 플레이 페이지는 2026-10-16에 HTTP 200을 반환했습니다. 데니 게임즈는 링크만 제공하며 전체 플레이와 기기 동작은 검증하지 않았습니다.",
    },
    summary: {
      en: "Place colorful tiles, match their edges and form shapes to fill a board.",
      ko: "색 타일의 변을 맞춰 도형을 만들고 판을 채우세요.",
    },
    controls: {
      en: "Choose a tiling and follow the tile placement instructions shown by the host.",
      ko: "타일 모양을 고른 뒤 호스트 화면의 배치 안내를 따르세요.",
    },
    mode: {
      en: "A free, GPL-3.0 browser puzzle from the game's author; the host offers several tilings and custom games.",
      ko: "제작자가 GPL-3.0으로 공개한 무료 브라우저 퍼즐입니다. 호스트에서 여러 타일링과 사용자 게임을 고를 수 있습니다.",
    },
    keywords: {
      en: [
        "color tile puzzle",
        "tiling puzzle",
        "shape matching game",
        "Tessel online",
      ],
      ko: [
        "컬러 타일 퍼즐",
        "타일링 퍼즐",
        "도형 맞추기 게임",
        "테셀레이션 게임",
      ],
    },
  },
  {
    id: "ekoscape",
    isOpenSource: true,
    title: "EkoScape",
    category: "action",
    controlStyle: "host",
    inputs: ["keyboard"],
    license: "GPL-3.0-or-later",
    licenseUrl: "https://github.com/esotericpig/EkoScape/blob/main/LICENSE",
    author: "Bradley Whited",
    source: "https://github.com/esotericpig/EkoScape",
    url: "https://esotericpig.itch.io/ekoscape",
    host: {
      en: "EkoScape browser build on itch.io",
      ko: "itch.io의 EkoScape 브라우저 빌드",
    },
    hostNote: {
      en: "The author offers browser play and documents WebGL 2.0 support. The repository states GPL-3.0-or-later for EkoScape; bundled or third-party assets can have separate terms. The linked page returned HTTP 200 on 2026-10-16. No build or artwork is copied here, and complete play/device support was not tested.",
      ko: "제작자는 브라우저 플레이와 WebGL 2.0 지원을 안내합니다. 저장소는 EkoScape에 GPL-3.0-or-later를 적용하며 포함된 외부 자산에는 별도 조건이 있을 수 있습니다. 연결 페이지는 2026-10-16에 HTTP 200을 반환했습니다. 빌드나 그림을 복사하지 않았고 전체 플레이·기기 지원은 검증하지 않았습니다.",
    },
    summary: {
      en: "Explore a step-based 3D maze, rescue alien friends and avoid robots, with fruit and portals along the way.",
      ko: "한 칸씩 이동하는 3D 미로에서 외계인 친구를 구하고 로봇을 피하며 과일과 포털을 찾아보세요.",
    },
    controls: {
      en: "Use the keyboard controls shown by the game; the browser build requires WebGL 2.0.",
      ko: "게임 화면의 키보드 조작 안내를 확인하세요. 브라우저 빌드에는 WebGL 2.0이 필요합니다.",
    },
    mode: {
      en: "A free browser version of an open-source 3D maze game; the independent itch.io host controls its build and requirements.",
      ko: "오픈소스 3D 미로 게임의 무료 브라우저 버전입니다. itch.io 외부 호스트가 빌드와 실행 조건을 관리합니다.",
    },
    keywords: {
      en: [
        "3D maze game",
        "Emscripten game",
        "WebGL 2 game",
        "alien maze adventure",
      ],
      ko: [
        "3D 미로 게임",
        "웹어셈블리 미로",
        "WebGL 2 게임",
        "외계인 미로 모험",
      ],
    },
  },
  {
    id: "astray-2",
    isOpenSource: true,
    title: "Astray 2",
    category: "puzzle",
    controlStyle: "host",
    inputs: ["keyboard", "mouse"],
    license: "Unlicense",
    licenseUrl: "https://github.com/wwwtyro/astray-2/blob/master/LICENSE.md",
    author: "wwwtyro",
    source: "https://github.com/wwwtyro/astray-2",
    url: "https://wwwtyro.github.io/astray-2/",
    host: {
      en: "Astray 2 project browser build",
      ko: "Astray 2 프로젝트 브라우저 빌드",
    },
    hostNote: {
      en: "The author calls Astray 2 a real-time WebGL path-tracing maze proof of concept. The repository identifies its license as Unlicense. Its live page returned HTTP 200 on 2026-10-16, but a full session, performance and device behavior were not tested; expect an experimental project rather than a finished release.",
      ko: "제작자는 Astray 2를 실시간 WebGL 경로 추적 미로의 개념 증명으로 소개합니다. 저장소는 Unlicense를 표시합니다. 라이브 페이지는 2026-10-16에 HTTP 200을 반환했지만 전체 플레이·성능·기기 동작은 검증하지 않았습니다. 완성작보다 실험 프로젝트에 가깝습니다.",
    },
    summary: {
      en: "Walk through a maze rendered with real-time path tracing in this experimental WebGL project.",
      ko: "실시간 경로 추적으로 렌더링되는 미로를 탐험하는 실험적인 WebGL 프로젝트입니다.",
    },
    controls: {
      en: "Open the live page and follow its in-game prompts; the host does not provide a separate controls guide.",
      ko: "라이브 페이지를 열고 게임 안의 안내를 확인하세요. 호스트에는 별도 조작 가이드가 없습니다.",
    },
    mode: {
      en: "A free, Unlicense project and visual experiment; the author labels it a proof of concept.",
      ko: "Unlicense로 공개된 무료 시각 실험이며 제작자는 개념 증명 프로젝트로 분류합니다.",
    },
    keywords: {
      en: [
        "WebGL path tracing",
        "experimental 3D maze",
        "real-time rendered maze",
      ],
      ko: ["WebGL 경로 추적", "실험적인 3D 미로", "실시간 렌더링 미로"],
    },
  },
  {
    id: "yourcraft",
    isOpenSource: true,
    title: "YourCraft",
    category: "simulation",
    controlStyle: "host",
    inputs: ["keyboard", "mouse"],
    license: "MIT",
    licenseUrl: "https://github.com/wyzuk/yourcraft/blob/main/LICENSE",
    author: "Wyzuk",
    source: "https://github.com/wyzuk/yourcraft",
    url: "https://your-craft.netlify.app/",
    host: {
      en: "YourCraft official browser demo",
      ko: "YourCraft 공식 브라우저 데모",
    },
    hostNote: {
      en: "The project README describes free accountless browser play, procedural voxel terrain and a Three.js/WebGL renderer, and publishes the project under MIT. The live demo returned HTTP 200 on 2026-10-16. Denny Games links out only; a full game session or physical-device behavior was not tested.",
      ko: "프로젝트 README는 계정 없이 즐기는 무료 브라우저 플레이, 절차 생성 복셀 지형과 Three.js/WebGL 렌더러를 안내하고 MIT 라이선스를 표시합니다. 라이브 데모는 2026-10-16에 HTTP 200을 반환했습니다. 데니 게임즈는 링크만 제공하며 전체 플레이와 실기기 동작은 검증하지 않았습니다.",
    },
    summary: {
      en: "Explore a procedurally generated voxel world, mine and place blocks, craft tools and switch between creative and survival play.",
      ko: "절차 생성 복셀 세계를 탐험하고 블록을 캐고 놓으며 도구를 만들고 창작·생존 모드를 바꿔보세요.",
    },
    controls: {
      en: "The README lists WASD movement, mouse-look, Space to jump or fly, and mouse buttons to mine or place blocks. Pointer lock is used for the camera.",
      ko: "README는 WASD 이동, 마우스 시점 조작, Space 점프·비행, 마우스 버튼 채굴·설치를 안내합니다. 카메라에는 포인터 잠금이 사용됩니다.",
    },
    mode: {
      en: "A free, single-player voxel sandbox with procedural biomes, caves, crafting and WebGL graphics; the project source is MIT-licensed.",
      ko: "절차 생성 생물군계와 동굴, 제작 시스템, WebGL 그래픽을 갖춘 무료 싱글플레이 복셀 샌드박스이며 소스는 MIT 라이선스입니다.",
    },
    keywords: {
      en: [
        "3D voxel sandbox",
        "block building browser game",
        "procedural world game",
        "Three.js game",
      ],
      ko: [
        "3D 복셀 샌드박스",
        "블록 건축 브라우저 게임",
        "절차 생성 월드",
        "Three.js 게임",
      ],
    },
  },
  {
    id: "brakeless",
    title: "Brakeless",
    category: "racing",
    controlStyle: "directional",
    inputs: ["keyboard", "mouse"],
    isOpenSource: false,
    license: "Source license not published",
    licenseDescription: {
      en: "Source-code license not published; the official host offers free browser play.",
      ko: "소스 코드 라이선스는 공개되지 않았으며, 공식 호스트가 무료 브라우저 플레이를 제공합니다.",
    },
    author: "Brakeless developers",
    source: "https://brakeless.io/",
    sourceLabel: { en: "Official game information", ko: "공식 게임 안내" },
    url: "https://brakeless.io/",
    host: {
      en: "Brakeless official browser game",
      ko: "Brakeless 공식 브라우저 게임",
    },
    hostNote: {
      en: "The official page describes a free endless driving game with no download, installation or account required for play. The host controls ads, leaderboard and browser-storage behavior. The code license is not published on the page. Its URL returned HTTP 200 on 2026-10-16; gameplay and device compatibility were not tested.",
      ko: "공식 페이지는 다운로드·설치·계정 없이 즐기는 무료 무한 주행 게임이라고 안내합니다. 광고·랭킹·브라우저 저장은 호스트가 관리합니다. 페이지에서 코드 라이선스는 확인되지 않았습니다. URL은 2026-10-16에 HTTP 200을 반환했으며 플레이와 기기 호환성은 검증하지 않았습니다.",
    },
    summary: {
      en: "Steer a turbine-powered car through traffic in an endless 3D run where speed keeps climbing and there are no brakes.",
      ko: "속도가 계속 오르는 무한 3D 주행에서 터빈 자동차를 조종해 교통을 헤쳐 나가세요. 브레이크는 없습니다.",
    },
    controls: {
      en: "Steer with Left/Right or A/D; use M to mute. The host lists mouse input for menus.",
      ko: "왼쪽·오른쪽 화살표 또는 A/D로 방향을 바꾸고 M으로 음소거하세요. 메뉴는 마우스로 조작합니다.",
    },
    mode: {
      en: "Free-to-play browser driving with an endless 3D route and a separate classic 2D option; optional records and saves follow the host.",
      ko: "무한 3D 도로와 별도의 클래식 2D 방식을 제공하는 무료 브라우저 주행 게임입니다. 선택 기능과 저장은 호스트 정책을 따릅니다.",
    },
    keywords: {
      en: [
        "3D endless driving game",
        "no brakes racing game",
        "traffic dodging browser game",
      ],
      ko: ["3D 무한 주행 게임", "브레이크 없는 레이싱", "차량 피하기 웹게임"],
    },
  },
  {
    id: "hotlapped",
    title: "hotlapped",
    category: "racing",
    controlStyle: "host",
    inputs: ["keyboard", "gamepad"],
    isOpenSource: false,
    license: "Source license not published",
    licenseDescription: {
      en: "Source-code license not published; the host offers free browser racing.",
      ko: "소스 코드 라이선스는 공개되지 않았으며, 호스트가 무료 브라우저 레이싱을 제공합니다.",
    },
    author: "hotlapped",
    source: "https://hotlapped.com/",
    sourceLabel: { en: "Official game information", ko: "공식 게임 안내" },
    playModes: ["single-player", "multi-player"],
    url: "https://hotlapped.com/",
    host: {
      en: "hotlapped official browser game",
      ko: "hotlapped 공식 브라우저 게임",
    },
    hostNote: {
      en: "The official page calls this a free browser racer and documents JavaScript and WebGL requirements, time trials, a 3D track editor and ghost replays. Its page says sign-in is needed to save; online features and any store follow the host's terms. The code license is not published there. The URL returned HTTP 200 on 2026-10-16; no full race or device was tested.",
      ko: "공식 페이지는 무료 브라우저 레이서라고 안내하며 JavaScript·WebGL, 타임 트라이얼, 3D 트랙 편집기와 고스트 리플레이를 설명합니다. 저장에는 로그인이 필요하다고 표시합니다. 온라인 기능과 스토어는 호스트 약관을 따릅니다. 코드 라이선스는 페이지에 공개되지 않았습니다. URL은 2026-10-16에 HTTP 200을 반환했고 전체 레이스와 기기 동작은 검증하지 않았습니다.",
    },
    summary: {
      en: "Race 3D time trials, chase ghost laps and build or test tracks in the browser.",
      ko: "브라우저에서 3D 타임 트라이얼을 달리고 고스트 기록을 쫓으며 트랙을 만들고 시험하세요.",
    },
    controls: {
      en: "Use the host's keyboard or controller instructions; it also presents touch-style direction buttons on the page.",
      ko: "호스트의 키보드·컨트롤러 안내를 확인하세요. 페이지에는 터치형 방향 버튼도 표시됩니다.",
    },
    mode: {
      en: "Free browser racing with solo practice, time trials and a track editor. Sign in if you want the host to save progress.",
      ko: "솔로 연습·타임 트라이얼·트랙 편집을 제공하는 무료 브라우저 레이싱입니다. 진행을 저장하려면 호스트에 로그인해야 합니다.",
    },
    keywords: {
      en: [
        "3D browser racing game",
        "time trial racing",
        "track editor game",
        "ghost lap racing",
      ],
      ko: [
        "3D 브라우저 레이싱",
        "타임 트라이얼 레이싱",
        "트랙 편집 게임",
        "고스트 랩 레이싱",
      ],
    },
  },
  {
    id: "lextown",
    isOpenSource: true,
    title: "LEXTOWN-01",
    category: "simulation",
    controlStyle: "host",
    inputs: ["keyboard", "mouse"],
    license: "MIT",
    licenseUrl: "https://github.com/paul-codes-1/lextown/blob/main/LICENSE",
    author: "Paul Codes and contributors",
    source: "https://github.com/paul-codes-1/lextown",
    playModes: ["multi-player"],
    url: "https://playlextown.com/",
    host: {
      en: "LEXTOWN shared browser world",
      ko: "LEXTOWN 공유 브라우저 월드",
    },
    hostNote: {
      en: "The public game page describes a shared multiplayer city with chat, timed missions, cars and global leaderboards. The project repository is MIT-licensed. The host controls public-world, chat, account and moderation rules. Its URL returned HTTP 200 on 2026-10-16; no complete mission or device behavior was tested.",
      ko: "공개 게임 페이지는 채팅·시간제 미션·자동차·글로벌 기록이 있는 멀티플레이 도시를 안내합니다. 프로젝트 저장소는 MIT 라이선스입니다. 공개 월드·채팅·계정·운영 정책은 호스트가 관리합니다. URL은 2026-10-16에 HTTP 200을 반환했으며 전체 미션과 기기 동작은 검증하지 않았습니다.",
    },
    summary: {
      en: "Walk, drive and explore a stylized shared city, then take on timed missions with other visitors.",
      ko: "다른 방문자와 함께 양식화된 도시를 걷고 운전하며 탐험하고 시간제 미션에 도전하세요.",
    },
    controls: {
      en: "The host lists WASD or arrow keys to walk, Space to jump and E to enter or leave nearby vehicles; read its guide for camera and chat controls.",
      ko: "호스트는 WASD·화살표 이동, Space 점프, E로 주변 차량 승하차를 안내합니다. 카메라와 채팅 조작은 안내 페이지를 확인하세요.",
    },
    mode: {
      en: "A free multiplayer browser city with public chat and a changing set of timed missions; other players and host moderation are part of the experience.",
      ko: "공개 채팅과 여러 시간제 미션이 있는 무료 멀티플레이 브라우저 도시입니다. 다른 플레이어와 호스트 운영 정책이 플레이에 포함됩니다.",
    },
    keywords: {
      en: [
        "multiplayer city game",
        "3D browser city",
        "driving and walking game",
        "LEXTOWN missions",
      ],
      ko: [
        "멀티플레이 도시 게임",
        "3D 브라우저 도시",
        "도보·운전 게임",
        "LEXTOWN 미션",
      ],
    },
  },
  {
    id: "mingat-cozy-cafe",
    title: "Cozy Cafe 3D: Latte the Latte",
    category: "simulation",
    controlStyle: "host",
    inputs: ["keyboard", "mouse", "touch"],
    isOpenSource: false,
    license: "Source license not published",
    licenseDescription: {
      en: "No source license was confirmed; the showcase's source link returned HTTP 404 on 2026-10-16.",
      ko: "소스 라이선스를 확인하지 못했습니다. 소개 페이지의 소스 링크는 2026-10-16에 HTTP 404를 반환했습니다.",
    },
    author: "Mingat Games",
    source: "https://mingatgames.github.io/",
    sourceLabel: { en: "Developer showcase", ko: "개발자 게임 소개" },
    url: "https://mingatgames.github.io/games/cozy-cafe/",
    host: {
      en: "Mingat Games browser page",
      ko: "Mingat Games 브라우저 페이지",
    },
    hostNote: {
      en: "Mingat Games presents this as an instant-play 3D barista simulation with keyboard and touch controls. The source link from its showcase returned 404 on 2026-10-16, so no public source license was confirmed. The play page returned HTTP 200 with no payment prompt in its public page; complete play, payment terms and device behavior were not tested.",
      ko: "Mingat Games는 키보드·터치 조작을 갖춘 즉시 실행 3D 바리스타 시뮬레이션으로 소개합니다. 소개 페이지의 소스 링크는 2026-10-16에 404를 반환해 공개 소스 라이선스를 확인하지 못했습니다. 플레이 페이지는 결제 안내 없이 HTTP 200을 반환했지만 전체 플레이·결제 조건·기기 동작은 검증하지 않았습니다.",
    },
    summary: {
      en: "Play as Latte the Latte, take customer orders, prepare coffee and pastries, and grow a relaxed 3D cafe.",
      ko: "라테 바리스타가 되어 손님 주문을 받고 커피와 페이스트리를 준비하며 아늑한 3D 카페를 키워보세요.",
    },
    controls: {
      en: "The developer lists WASD and arrow keys to move, mouse movement to look around, and E or Space to interact; the page also advertises touch controls.",
      ko: "개발자는 WASD·화살표 이동, 마우스 시점 조작, E·Space 상호작용을 안내하고 페이지에서 터치 조작도 소개합니다.",
    },
    mode: {
      en: "A relaxed, timer-free 3D cafe simulation offered on the developer's browser host; source and redistribution terms are not published.",
      ko: "개발자 브라우저 호스트에서 제공하는 시간제한 없는 3D 카페 시뮬레이션입니다. 소스와 재배포 조건은 공개되지 않았습니다.",
    },
    keywords: {
      en: [
        "3D cafe simulation",
        "barista browser game",
        "cozy cafe game",
        "coffee shop simulator",
      ],
      ko: [
        "3D 카페 시뮬레이션",
        "바리스타 브라우저 게임",
        "아늑한 카페 게임",
        "커피숍 운영 게임",
      ],
    },
  },
  {
    id: "mingat-pet-daycare",
    title: "Paws & Play: 3D Pet Daycare",
    category: "simulation",
    controlStyle: "host",
    inputs: ["keyboard", "mouse", "touch"],
    isOpenSource: false,
    license: "All rights reserved; project README says private project",
    licenseDescription: {
      en: "All rights reserved; the public README says the project is private.",
      ko: "모든 권리는 개발자에게 있으며 공개 README는 비공개 프로젝트라고 안내합니다.",
    },
    licenseUrl: "https://github.com/MingatGames/pet-daycare#license",
    author: "Mingat Games",
    source: "https://github.com/MingatGames/pet-daycare",
    sourceLabel: {
      en: "Project and license page",
      ko: "프로젝트·라이선스 안내",
    },
    url: "https://mingatgames.github.io/games/pet-daycare/",
    host: {
      en: "Mingat Games browser page",
      ko: "Mingat Games 브라우저 페이지",
    },
    hostNote: {
      en: 'The developer describes a free-entry 3D pet-care game and advertises keyboard and iPad touch controls. Its public README says "Private project. All rights reserved" and does not grant an open-source license; no game assets are reused here. The play page returned HTTP 200 on 2026-10-16 with no upfront payment prompt in its public page. Full play, payment terms and device behavior were not tested.',
      ko: '개발자는 키보드·iPad 터치 조작을 소개하는 무료 입장 3D 반려동물 돌봄 게임을 제공합니다. 공개 README는 "Private project. All rights reserved"라고 밝히며 오픈소스 라이선스를 부여하지 않습니다. 게임 자산은 재사용하지 않았습니다. 플레이 페이지는 2026-10-16에 선결제 안내 없이 HTTP 200을 반환했지만 전체 플레이·결제 조건·기기 동작은 검증하지 않았습니다.',
    },
    summary: {
      en: "Feed, groom, bathe and play fetch with puppies, kittens and bunnies in a colorful 3D daycare.",
      ko: "알록달록한 3D 돌봄 센터에서 강아지·고양이·토끼에게 먹이를 주고 씻기며 공놀이를 해보세요.",
    },
    controls: {
      en: "The project README lists WASD or arrow keys, mouse-look and E, Space or on-screen actions; it also describes a touch joystick for tablets.",
      ko: "프로젝트 README는 WASD·화살표 이동, 마우스 시점 조작, E·Space·화면 버튼을 안내하고 태블릿용 터치 조이스틱도 설명합니다.",
    },
    mode: {
      en: "A free-entry browser pet-care simulation with in-game coins and upgrades; its software is proprietary and host terms apply.",
      ko: "게임 안의 코인과 업그레이드를 제공하는 무료 입장 브라우저 반려동물 돌봄 시뮬레이션입니다. 소프트웨어는 독점 소프트웨어이며 호스트 조건이 적용됩니다.",
    },
    keywords: {
      en: [
        "3D pet care game",
        "pet daycare simulator",
        "puppy and kitten game",
        "iPad browser pet game",
      ],
      ko: [
        "3D 반려동물 돌봄 게임",
        "펫 데이케어 시뮬레이터",
        "강아지·고양이 게임",
        "아이패드 브라우저 펫 게임",
      ],
    },
  },
  {
    id: "mingat-nomad-life",
    title: "Nomad Life",
    category: "simulation",
    controlStyle: "host",
    inputs: ["keyboard"],
    isOpenSource: false,
    license: "Source license not published",
    licenseDescription: {
      en: "No source license was confirmed; the showcase's source link returned HTTP 404 on 2026-10-16.",
      ko: "소스 라이선스를 확인하지 못했습니다. 소개 페이지의 소스 링크는 2026-10-16에 HTTP 404를 반환했습니다.",
    },
    author: "Mingat Games",
    source: "https://mingatgames.github.io/",
    sourceLabel: { en: "Developer showcase", ko: "개발자 게임 소개" },
    url: "https://mingatgames.github.io/games/nomad-life/",
    host: {
      en: "Mingat Games browser page",
      ko: "Mingat Games 브라우저 페이지",
    },
    hostNote: {
      en: "Mingat Games presents an open-world pastoral simulation with horse riding and animal herding. Its showcase links to a source repository that returned 404 on 2026-10-16, so no public source license was confirmed. The play page returned HTTP 200 with no payment prompt in its public page; complete gameplay, payment terms and device support were not tested.",
      ko: "Mingat Games는 말 타기와 동물 몰이가 있는 목가적 오픈월드 시뮬레이션으로 소개합니다. 소개 페이지의 소스 저장소 링크는 2026-10-16에 404를 반환해 공개 소스 라이선스를 확인하지 못했습니다. 플레이 페이지는 결제 안내 없이 HTTP 200을 반환했지만 전체 플레이·결제 조건·기기 지원은 검증하지 않았습니다.",
    },
    summary: {
      en: "Ride across an open steppe, mount horses and guide several kinds of animals around a nomad camp.",
      ko: "광활한 초원을 달리고 말을 타며 여러 동물을 유목 캠프 주변으로 이끌어보세요.",
    },
    controls: {
      en: "The host lists WASD movement, Shift to run and E to interact or mount; confirm the current controls in its guide.",
      ko: "호스트는 WASD 이동, Shift 달리기, E 상호작용·말 타기를 안내합니다. 최신 조작은 게임의 도움말에서 확인하세요.",
    },
    mode: {
      en: "A free-to-enter 3D pastoral sandbox with horse riding and simulated herds, hosted by the developer; source terms are not published.",
      ko: "개발자가 호스팅하는 말 타기와 무리 시뮬레이션을 갖춘 무료 입장 3D 목가적 샌드박스입니다. 소스 조건은 공개되지 않았습니다.",
    },
    keywords: {
      en: [
        "3D horse riding game",
        "animal herding simulator",
        "pastoral open world",
        "nomad life browser game",
      ],
      ko: [
        "3D 승마 게임",
        "동물 몰이 시뮬레이터",
        "목가적 오픈월드",
        "노마드 라이프 브라우저 게임",
      ],
    },
  },
  {
    id: "warzone-2100-web",
    isOpenSource: true,
    title: "Warzone 2100 Web Edition",
    category: "strategy",
    controlStyle: "host",
    inputs: ["mouse", "keyboard"],
    license: "GPL-2.0-or-later",
    licenseUrl:
      "https://github.com/Warzone2100/warzone2100/blob/master/COPYING",
    author: "Warzone 2100 Project",
    source: "https://github.com/Warzone2100/warzone2100",
    sourceLabel: { en: "Official source repository", ko: "공식 소스 저장소" },
    playModes: ["single-player"],
    url: "https://play.wz2100.net/latest/",
    host: {
      en: "Warzone 2100 official Web Edition",
      ko: "Warzone 2100 공식 웹 에디션",
    },
    hostNote: {
      en: "The project's Web Edition offers campaign and skirmish play. Its first visit downloads about 60 MiB and requires WebAssembly and WebGL 2; the page recommends a mouse and keyboard. This edition has no online multiplayer, and browser storage may be cleared. The page returned HTTP 200 on 2026-10-16; a complete session and device behavior were not tested.",
      ko: "프로젝트 웹 에디션은 캠페인과 스커미시를 제공합니다. 첫 방문에 약 60MiB를 내려받고 WebAssembly와 WebGL 2가 필요하며, 페이지는 마우스와 키보드를 권장합니다. 이 에디션은 온라인 멀티플레이를 제공하지 않고 브라우저 저장 내용은 지워질 수 있습니다. 페이지는 2026-10-16에 HTTP 200을 반환했으며 전체 플레이와 기기 동작은 검증하지 않았습니다.",
    },
    summary: {
      en: "Build a base, research weapons and command an army across a 3D real-time strategy campaign.",
      ko: "3D 실시간 전략 캠페인에서 기지를 세우고 무기를 연구하며 부대를 지휘하세요.",
    },
    controls: {
      en: "Use the host's mouse and keyboard instructions; check its settings before starting a campaign.",
      ko: "호스트의 마우스·키보드 안내를 따르고 캠페인 시작 전에 설정을 확인하세요.",
    },
    mode: {
      en: "A GPL-2.0-or-later real-time strategy game with a browser campaign and skirmish mode; the web edition is single-player.",
      ko: "브라우저 캠페인과 스커미시를 갖춘 GPL-2.0-or-later 실시간 전략 게임입니다. 웹 에디션은 싱글 플레이입니다.",
    },
    keywords: {
      en: [
        "3D RTS browser game",
        "real-time strategy campaign",
        "Warzone 2100 Web Edition",
      ],
      ko: ["3D RTS 브라우저 게임", "실시간 전략 캠페인", "워존 2100 웹 에디션"],
    },
  },
  {
    id: "mindustry-web",
    isOpenSource: true,
    title: "Mindustry Web Port",
    category: "strategy",
    controlStyle: "host",
    inputs: [],
    license: "GPL-3.0",
    licenseUrl: "https://github.com/khoichon/mindustry-web/blob/main/LICENSE",
    author: "Khoi Chon and Mindustry contributors",
    source: "https://github.com/khoichon/mindustry-web",
    sourceLabel: {
      en: "Community web-port source",
      ko: "커뮤니티 웹 포트 소스",
    },
    playModes: ["single-player"],
    url: "https://khoichon.dev/mindustry-web/offlinemode/build/",
    host: {
      en: "Community Mindustry TeaVM web build",
      ko: "커뮤니티 Mindustry TeaVM 웹 빌드",
    },
    hostNote: {
      en: "This is an unofficial experimental TeaVM port of Mindustry, not the project's official browser edition. The linked page is a standalone offline build; the port repository warns that builds may be rough and labels its online CheerpJ version deprecated. The page returned HTTP 200 on 2026-10-16, but the game itself, controls, save behavior and device support were not tested.",
      ko: "Mindustry 프로젝트의 공식 브라우저 에디션이 아닌 비공식 실험용 TeaVM 포트입니다. 연결된 페이지는 독립형 오프라인 빌드이며, 포트 저장소는 빌드가 불완전할 수 있다고 알리고 온라인 CheerpJ 버전을 폐기 대상으로 표시합니다. 페이지는 2026-10-16에 HTTP 200을 반환했지만 게임, 조작, 저장 동작과 기기 지원은 검증하지 않았습니다.",
    },
    summary: {
      en: "Lay out conveyors, automate production and defend an industrial base in a community browser port of Mindustry.",
      ko: "Mindustry 커뮤니티 브라우저 포트에서 컨베이어를 배치하고 생산을 자동화해 산업 기지를 지키세요.",
    },
    controls: {
      en: "The experimental port may differ from the desktop game; follow any controls shown by the host and expect rough edges.",
      ko: "실험용 포트는 데스크톱 게임과 다를 수 있습니다. 호스트가 표시하는 조작법을 따르고 미완성 동작이 있을 수 있음을 확인하세요.",
    },
    mode: {
      en: "An unofficial, experimental GPL-3.0 browser port of the open-source factory-defense game; this linked build is presented as offline play.",
      ko: "오픈소스 공장 방어 게임을 GPL-3.0으로 웹에 옮긴 비공식 실험용 포트입니다. 연결된 빌드는 오프라인 플레이용으로 제공됩니다.",
    },
    keywords: {
      en: [
        "factory tower defense",
        "conveyor automation game",
        "Mindustry browser port",
      ],
      ko: [
        "공장 타워 디펜스",
        "컨베이어 자동화 게임",
        "Mindustry 브라우저 포트",
      ],
    },
  },
  {
    id: "city-defense",
    title: "City Defense",
    category: "strategy",
    controlStyle: "host",
    inputs: [],
    isOpenSource: false,
    license: "Source license not published",
    licenseDescription: {
      en: "The developer's site does not publish a source-code license. This listing links to the free browser game only; free play does not grant reuse rights.",
      ko: "개발자 사이트에서 소스 코드 라이선스를 공개하지 않습니다. 이 목록은 무료 브라우저 게임으로 연결할 뿐이며 무료 플레이가 재사용 권한을 뜻하지 않습니다.",
    },
    author: "City Defense developers",
    source: "https://citydefense.app/en/",
    sourceLabel: { en: "Official game information", ko: "공식 게임 안내" },
    playModes: ["single-player"],
    url: "https://citydefense.app/?lang=en",
    host: {
      en: "City Defense official browser game",
      ko: "City Defense 공식 브라우저 게임",
    },
    hostNote: {
      en: "The developer offers free browser tower defense on real-world city maps without a download or account gate and says WebGL 2 is required. The game source license is not published. The host's privacy page describes self-hosted analytics and game-progress processing; map data and referenced assets have separate terms. The play page returned HTTP 200 on 2026-10-16; gameplay and device support were not tested.",
      ko: "개발자는 다운로드나 계정 관문 없이 실제 도시 지도 기반 타워 디펜스를 무료 브라우저 게임으로 제공하고 WebGL 2가 필요하다고 안내합니다. 게임 소스 라이선스는 공개되지 않았습니다. 호스트 개인정보 안내에는 자체 호스팅 분석과 게임 진행 정보 처리가 설명되어 있으며 지도 데이터와 참조 자산에는 별도 조건이 있습니다. 플레이 페이지는 2026-10-16에 HTTP 200을 반환했지만 게임과 기기 지원은 검증하지 않았습니다.",
    },
    summary: {
      en: "Place defenses along real city streets and stop waves of enemies on a map-based 3D battlefield.",
      ko: "실제 도시 도로를 따라 방어 시설을 놓고 지도 기반 3D 전장에서 적의 물결을 막으세요.",
    },
    controls: {
      en: "Check the host's current tutorial and map controls before placing towers.",
      ko: "타워를 놓기 전에 호스트의 최신 튜토리얼과 지도 조작법을 확인하세요.",
    },
    mode: {
      en: "A free browser tower-defense game using city maps. Its source-code license is unpublished, and the host's privacy and map-data terms apply.",
      ko: "도시 지도를 사용하는 무료 브라우저 타워 디펜스입니다. 소스 코드 라이선스는 공개되지 않았으며 호스트의 개인정보·지도 데이터 조건이 적용됩니다.",
    },
    keywords: {
      en: [
        "city map tower defense",
        "3D urban defense game",
        "real map browser game",
      ],
      ko: [
        "도시 지도 타워 디펜스",
        "3D 도시 방어 게임",
        "실제 지도 브라우저 게임",
      ],
    },
  },
  {
    id: "ysflight-web",
    isOpenSource: true,
    title: "YS Flight Simulator Web",
    category: "simulation",
    controlStyle: "host",
    inputs: ["keyboard", "mouse", "gamepad"],
    license: "BSD-2-Clause (web port); BSD-3-Clause (upstream)",
    licenseDescription: {
      en: "The web-port code is documented as BSD-2-Clause; the upstream YSFlight source and runtime data are BSD-3-Clause. Third-party components may keep separate terms.",
      ko: "웹 포트 코드는 BSD-2-Clause, 상류 YSFlight 소스와 실행 데이터는 BSD-3-Clause로 안내됩니다. 외부 구성요소에는 별도 조건이 적용될 수 있습니다.",
    },
    licenseUrl: "https://github.com/tomingtoming/ysflight-web",
    author: "Tomingtoming and YSFlight contributors",
    source: "https://github.com/tomingtoming/ysflight-web",
    sourceLabel: {
      en: "Web-port source and license notes",
      ko: "웹 포트 소스와 라이선스 안내",
    },
    playModes: ["single-player", "multi-player"],
    url: "https://ysflight-web.toming.app/",
    host: {
      en: "Unofficial YS Flight Simulator Web port",
      ko: "비공식 YS Flight Simulator 웹 포트",
    },
    hostNote: {
      en: "This unofficial Emscripten/WebAssembly port documents a first load of about 25 MB, keyboard/mouse and gamepad controls, and browser-to-browser multiplayer. It says a service worker can support offline use after loading. The page returned HTTP 200 on 2026-10-16; a complete flight, multiplayer session, controller and device behavior were not tested.",
      ko: "이 비공식 Emscripten/WebAssembly 포트는 최초 로드가 약 25MB이며 키보드·마우스와 게임패드 조작, 브라우저 간 멀티플레이를 안내합니다. 서비스 워커를 통해 로드 후 오프라인 사용이 가능하다고 설명합니다. 페이지는 2026-10-16에 HTTP 200을 반환했지만 전체 비행, 멀티플레이 세션, 컨트롤러와 기기 동작은 검증하지 않았습니다.",
    },
    summary: {
      en: "Take off, navigate and practice aircraft maneuvers in a long-running flight simulator adapted for WebAssembly.",
      ko: "WebAssembly로 옮긴 장수 비행 시뮬레이터에서 이륙하고 항로를 잡으며 항공기 기동을 연습하세요.",
    },
    controls: {
      en: "The port documents keyboard and mouse-as-stick controls plus gamepad or joystick support; review its current guide before flying.",
      ko: "포트는 키보드와 마우스 스틱 조작, 게임패드 또는 조이스틱 지원을 안내합니다. 비행 전에 최신 가이드를 확인하세요.",
    },
    mode: {
      en: "An unofficial BSD-licensed browser flight-simulator port with a documented peer-to-peer multiplayer option; session availability follows the host.",
      ko: "BSD 라이선스의 비공식 브라우저 비행 시뮬레이터 포트이며 P2P 멀티플레이 기능을 안내합니다. 세션 이용 가능 여부는 호스트를 따릅니다.",
    },
    keywords: {
      en: [
        "browser flight simulator",
        "WebAssembly flight game",
        "YSFlight online",
      ],
      ko: [
        "브라우저 비행 시뮬레이터",
        "WebAssembly 비행 게임",
        "YSFlight 온라인",
      ],
    },
  },
  {
    id: "netcraft",
    isOpenSource: true,
    title: "NetCraft",
    category: "simulation",
    controlStyle: "host",
    inputs: ["keyboard", "mouse"],
    license: "MIT",
    licenseUrl: "https://github.com/satoshinm/NetCraft/blob/master/LICENSE.md",
    author: "Satoshi Nakamura and contributors",
    source: "https://github.com/satoshinm/NetCraft",
    sourceLabel: {
      en: "Source repository and license",
      ko: "소스 저장소와 라이선스",
    },
    url: "https://satoshinm.github.io/NetCraft/",
    host: {
      en: "NetCraft GitHub Pages demo",
      ko: "NetCraft GitHub Pages 데모",
    },
    hostNote: {
      en: "This legacy MIT browser project describes a WebGL voxel sandbox with procedural terrain, blocks, plants and day/night changes. Its repository also discusses local persistence and optional multiplayer server support; those features were not checked in the linked demo. The page returned HTTP 200 on 2026-10-16, but gameplay, saves, multiplayer and device behavior were not tested.",
      ko: "이 오래된 MIT 브라우저 프로젝트는 절차적 지형, 블록, 식물과 낮·밤 변화가 있는 WebGL 복셀 샌드박스로 소개됩니다. 저장소는 로컬 저장과 선택형 멀티플레이 서버 기능도 설명하지만 연결된 데모에서는 확인하지 않았습니다. 페이지는 2026-10-16에 HTTP 200을 반환했지만 플레이, 저장, 멀티플레이와 기기 동작은 검증하지 않았습니다.",
    },
    summary: {
      en: "Explore a blocky procedural world, gather materials and shape a small WebGL sandbox.",
      ko: "블록으로 이루어진 절차적 세계를 탐험하고 재료를 모으며 작은 WebGL 샌드박스를 꾸며보세요.",
    },
    controls: {
      en: "Follow the demo's own keyboard and mouse guide; the linked build's current save and multiplayer behavior is unverified.",
      ko: "데모 자체의 키보드·마우스 안내를 따르세요. 연결된 빌드의 현재 저장과 멀티플레이 동작은 검증되지 않았습니다.",
    },
    mode: {
      en: "A legacy MIT-licensed WebGL voxel sandbox. Optional server features are described by the project, but are not confirmed for this hosted demo.",
      ko: "오래된 MIT 라이선스 WebGL 복셀 샌드박스입니다. 프로젝트가 선택형 서버 기능을 설명하지만 이 호스팅 데모에서는 확인되지 않았습니다.",
    },
    keywords: {
      en: [
        "WebGL voxel sandbox",
        "browser block world",
        "procedural voxel game",
      ],
      ko: ["WebGL 복셀 샌드박스", "브라우저 블록 월드", "절차적 복셀 게임"],
    },
  },
];

const categoryColors: Record<Game["category"], string> = {
  board: "blue",
  puzzle: "mint",
  arcade: "yellow",
  action: "rust",
  shooting: "rust",
  racing: "blue",
  sports: "blue",
  strategy: "mint",
  roguelike: "rust",
  simulation: "mint",
};

const categoryNames: Record<Game["category"], Record<Locale, string>> = {
  board: { en: "board game", ko: "보드게임" },
  puzzle: { en: "puzzle game", ko: "퍼즐 게임" },
  arcade: { en: "arcade game", ko: "아케이드 게임" },
  action: { en: "action game", ko: "액션 게임" },
  shooting: { en: "shooter", ko: "슈팅 게임" },
  racing: { en: "racing game", ko: "레이싱 게임" },
  sports: { en: "sports game", ko: "스포츠 게임" },
  strategy: { en: "strategy game", ko: "전략 게임" },
  roguelike: { en: "roguelike game", ko: "로그라이크 게임" },
  simulation: { en: "simulation game", ko: "시뮬레이션 게임" },
};

function expandListing(spec: ExpandedListingSpec): Listing {
  const makeCopy = (locale: Locale) => {
    const korean = locale === "ko";
    const openSource = spec.isOpenSource !== false;
    return {
      title: spec.title,
      subtitle: korean
        ? `브라우저에서 즐기는 무료 ${categoryNames[spec.category].ko}입니다.`
        : `A free ${categoryNames[spec.category].en} to play in your browser.`,
      description: `${spec.summary[locale]} ${
        korean
          ? "외부 호스트에서 실행되며 게임의 진행과 이용 조건은 해당 페이지를 따릅니다."
          : "It runs on an external host; gameplay and terms follow that page."
      }`,
      objective:
        spec.objective?.[locale] ??
        (korean
          ? "게임 화면에 표시되는 목표와 안내를 따라 진행하세요."
          : "Follow the goal and instructions shown in the game."),
      mode:
        spec.mode?.[locale] ??
        (openSource
          ? korean
            ? "데니 게임즈 바깥의 호스트에서 실행되는 오픈소스 브라우저 게임입니다."
            : "An open-source browser game running on a host outside Denny Games."
          : korean
            ? "외부 호스트에서 무료로 플레이할 수 있습니다. 소스 공개와 라이선스 여부는 위 안내를 확인하세요."
            : "Free browser play is offered by an external host; see the license note above for source availability."),
      controls: spec.controls[locale],
      tip:
        spec.tip?.[locale] ??
        (korean
          ? "처음 움직이기 전에 호스트의 도움말과 조작 안내를 확인하세요."
          : "Read the host's help and controls before your first move."),
    };
  };

  return {
    id: spec.id,
    added: "2026-10-16",
    category: spec.category,
    controlStyle: spec.controlStyle,
    color: categoryColors[spec.category],
    inputs: spec.inputs,
    tags: {
      en: [
        spec.title,
        categoryNames[spec.category].en,
        ...(spec.keywords?.en ?? []),
        spec.isOpenSource === false
          ? "free browser game"
          : "free open source browser game",
        "play online",
      ],
      ko: [
        spec.title,
        categoryNames[spec.category].ko,
        ...(spec.keywords?.ko ?? []),
        spec.isOpenSource === false
          ? "무료 플레이 브라우저 게임"
          : "무료 오픈소스 브라우저 게임",
        "온라인 게임",
      ],
    },
    license: spec.license,
    licenseDescription: spec.licenseDescription,
    licenseUrl: spec.licenseUrl,
    author: spec.author,
    source: spec.source,
    sourceLabel: spec.sourceLabel,
    playModes: spec.playModes,
    url: spec.url,
    host: spec.host,
    hostNote: spec.hostNote,
    artworkAlt: {
      en: `Original Denny Games title-card artwork for ${spec.title}; not an official game screenshot.`,
      ko: `${spec.title}의 데니 게임즈 자체 타이틀 카드 일러스트이며 공식 게임 화면이 아닙니다.`,
    },
    copy: { en: makeCopy("en"), ko: makeCopy("ko") },
  };
}

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
    licenseDescription: entry.licenseDescription,
    licenseUrl: entry.licenseUrl,
    author: entry.author,
    source: entry.source,
    sourceLabel: entry.sourceLabel,
    playModes: entry.playModes,
    externalPlay: { url: entry.url, host: entry.host, note: entry.hostNote },
    added: entry.added ?? "2026-10-15",
    artwork: `/art/open-games/${entry.id}.svg`,
    artworkAlt: entry.artworkAlt,
    text: { en: makeCopy("en"), ko: makeCopy("ko") },
  };
}

export const worldOpenGames = [
  ...listings,
  ...expandedListingSpecs.map(expandListing),
  ...graphicalWaveSpecs.map(expandListing),
].map(toGame);
