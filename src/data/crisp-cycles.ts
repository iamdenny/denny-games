import type { Game } from "./games";

export const crispCycleGames: Game[] = [
  {
    id: "crisp-chain-drift",
    category: "arcade",
    duration: "3–5",
    controlStyle: "directional",
    color: "rust",
    version: 1,
    stages: 1,
    tags: [
      "chain reaction",
      "mine",
      "survival",
      "arcade",
      "ABA Games",
      "오픈소스",
      "연쇄 반응",
      "지뢰",
      "생존",
    ],
    inputs: ["touch", "keyboard", "gamepad"],
    license: "MIT · ABA Games",
    author: "ABA Games",
    source:
      "https://github.com/abagames/crisp-game-lib-12-games/tree/8c71950c93008235a7e63401aba66cbb67d82421/docs/chain-drift",
    added: "2026-10-14",
    imported: true,
    internalScore: true,
    notice: "/licenses/crisp/",
    artworkAlt: {
      en: "Cyan player and drifting mines linked by a glowing chain reaction",
      ko: "청록색 플레이어와 폭발 연쇄로 이어지는 지뢰",
    },
    artwork: "/art/crisp-cycle-chain-drift.png",
    text: {
      en: {
        title: "Chain Drift",
        subtitle: "Shove one mine. Set off the whole field.",
        description:
          "Shove a drifting mine to arm it, then escape its blast as the chain spreads. Read the crowded field, build a longer reaction and stay clear of the overload.",
        rules: [
          "Move close to a blue mine. The yellow marker shows which mine a shove will reach.",
          "Press PUSH to launch that mine. Its blast arms nearby mines and can start a scoring chain.",
          "Keep clear of the blast radius and watch the field-load gauge. An overloaded field can arm itself.",
        ],
        controls: [
          "Touch: use the direction pad; tap PUSH. Keyboard: Arrows/WASD move; Space, Z, X, J or K pushes.",
          "Standard gamepad: D-pad or left stick moves; A pushes; Start pauses. Physical-device testing is pending.",
          "The arcade keeps its own score table while this play page stays open. Leaving or reloading starts fresh.",
        ],
        tips: [
          "Let harmless mines drift together before you arm one for a bigger chain.",
          "Move away as soon as you push. A mine you armed can still hurt you after it launches.",
          "Capacitors redirect blasts after a short charge, so leave their marked area before it fires.",
        ],
      },
      ko: {
        title: "체인 드리프트",
        subtitle: "지뢰 하나를 밀어 연쇄 폭발을 만드세요.",
        description:
          "떠다니는 지뢰를 밀어 작동시키고, 폭발이 번지는 동안 안전한 곳으로 피하세요. 복잡해지는 필드를 읽고 더 긴 연쇄를 만들며 과부하를 조심하세요.",
        rules: [
          "파란 지뢰 가까이 이동하세요. 노란 표식이 밀기로 닿는 지뢰를 알려줘요.",
          "밀기 버튼을 누르면 지뢰를 날려요. 폭발은 주변 지뢰를 작동시켜 점수 연쇄를 만들 수 있어요.",
          "폭발 반경을 벗어나고 필드 부하 게이지를 살펴보세요. 과부하가 되면 필드가 스스로 폭발할 수 있어요.",
        ],
        controls: [
          "터치: 방향 패드로 이동하고 밀기를 누르세요. 키보드: 방향키/WASD 이동, Space·Z·X·J·K 밀기.",
          "표준 게임패드: 방향패드·왼쪽 스틱 이동, A 밀기, Start 정지. 실물 기기 검증은 아직입니다.",
          "게임 안 최고 기록은 플레이 페이지가 열려 있는 동안만 유지돼요. 나가거나 새로고침하면 새로 시작합니다.",
        ],
        tips: [
          "해가 없는 지뢰들이 모일 때까지 기다리면 더 큰 연쇄를 만들 수 있어요.",
          "민 직후 폭발에서 멀어지세요. 내가 작동시킨 지뢰도 날아간 뒤에는 위험해요.",
          "축전기는 잠시 충전한 뒤 표시된 영역의 폭발을 돌려보내요. 발사 전에 그곳을 벗어나세요.",
        ],
      },
    },
  },
  {
    id: "crisp-comet-slash",
    category: "action",
    duration: "5–10",
    controlStyle: "directional",
    color: "mint",
    version: 1,
    stages: 1,
    tags: [
      "space arcade",
      "comet",
      "sword",
      "slash",
      "survival",
      "ABA Games",
      "오픈소스",
      "우주",
      "혜성",
      "베기",
      "액션",
    ],
    inputs: ["touch", "keyboard", "gamepad"],
    license: "MIT · ABA Games",
    author: "ABA Games",
    source:
      "https://github.com/abagames/crisp-game-lib-12-games/tree/8c71950c93008235a7e63401aba66cbb67d82421/docs/comet-slash",
    added: "2026-10-14",
    imported: true,
    internalScore: true,
    notice: "/licenses/crisp/",
    artworkAlt: {
      en: "A small ship cutting a bright comet trail in a dark starfield",
      ko: "어두운 우주에서 빛나는 혜성 꼬리를 베는 작은 우주선",
    },
    artwork: "/art/crisp-cycle-comet-slash.png",
    text: {
      en: {
        title: "Comet Slash",
        subtitle: "Dodge the head. Cut the tail.",
        description:
          "Fly through a field of comets and slash their bright tails after a close pass. Read each approach, time a risky cut and clear the sixteen-wave arcade campaign.",
        rules: [
          "Move around the screen to avoid comet heads. A collision costs a life.",
          "Slash a comet's tail to score. A close pass reveals a short window for a larger redline bonus.",
          "Cut several comets with one swing for a multi-cut bonus. Clear all sixteen waves to finish the campaign.",
        ],
        controls: [
          "Touch: use the direction pad; tap SLASH. Keyboard: Arrows/WASD move; Space, Z, X, J or K slashes; Enter starts.",
          "Standard gamepad: D-pad or left stick moves; A slashes; Start pauses. Physical-device testing is pending.",
          "The game keeps its own score table while this play page stays open. Leaving or reloading starts fresh.",
        ],
        tips: [
          "A tail is safe to touch; the comet head is the threat.",
          "Wait until a close pass is confirmed before slashing to claim its risk bonus.",
          "One swing can cut multiple tails when their paths cross near you.",
        ],
      },
      ko: {
        title: "코멧 슬래시",
        subtitle: "혜성 머리를 피하고 꼬리를 베세요.",
        description:
          "혜성이 가득한 우주를 누비며 가까이 지나간 혜성의 빛나는 꼬리를 베세요. 접근 방향을 읽고 위험한 타이밍을 노려 16개 웨이브 캠페인을 완주하세요.",
        rules: [
          "화면을 움직이며 혜성 머리를 피하세요. 부딪히면 생명이 줄어요.",
          "혜성 꼬리를 베면 점수를 얻어요. 가까이 스쳐 지나가면 잠시 더 큰 레드라인 보너스를 노릴 수 있어요.",
          "한 번의 공격으로 여러 꼬리를 베면 멀티 컷 보너스를 받아요. 16개 웨이브를 모두 통과하면 완주입니다.",
        ],
        controls: [
          "터치: 방향 패드로 이동하고 베기를 누르세요. 키보드: 방향키/WASD 이동, Space·Z·X·J·K 베기, Enter 시작.",
          "표준 게임패드: 방향패드·왼쪽 스틱 이동, A 베기, Start 정지. 실물 기기 검증은 아직입니다.",
          "게임 안 최고 기록은 플레이 페이지가 열려 있는 동안만 유지돼요. 나가거나 새로고침하면 새로 시작합니다.",
        ],
        tips: [
          "혜성 꼬리는 닿아도 안전하지만 머리는 위험해요.",
          "가까이 스친 게 확인된 다음 베면 위험 보너스를 받을 수 있어요.",
          "혜성의 경로가 내 주변에서 겹칠 때 한 번에 여러 꼬리를 노려보세요.",
        ],
      },
    },
  },
  {
    id: "crisp-volt-keeper",
    category: "arcade",
    duration: "8–10",
    controlStyle: "directional",
    color: "mint",
    version: 1,
    stages: 1,
    tags: [
      "electric arcade",
      "spark",
      "survival",
      "wave campaign",
      "ABA Games",
      "오픈소스",
      "전기",
      "스파크",
      "생존",
      "웨이브",
    ],
    inputs: ["touch", "keyboard", "gamepad"],
    license: "MIT · ABA Games",
    author: "ABA Games",
    source:
      "https://github.com/abagames/crisp-game-lib-12-games/tree/8c71950c93008235a7e63401aba66cbb67d82421/docs/volt-keeper",
    added: "2026-10-14",
    imported: true,
    internalScore: true,
    notice: "/licenses/crisp/",
    artworkAlt: {
      en: "A cyan probe grounding a spark inside an electric circuit field",
      ko: "전기 회로 필드에서 스파크를 접지하는 청록색 프로브",
    },
    artwork: "/art/crisp-cycle-volt-keeper.png",
    text: {
      en: {
        title: "Volt Keeper",
        subtitle: "Ground the spark. Keep the charge alive.",
        description:
          "Steer a tiny probe through a live electric field and ground nearby sparks to recharge. Read the arrow-and-bumper circuits, meet each wave's quota and survive the seventeen-wave campaign.",
        rules: [
          "Move through the field and watch the capacitor. If its charge runs out, you lose a life.",
          "Tap GROUND near sparks to absorb them. A successful catch recharges the capacitor and builds your multiplier.",
          "Bank enough energy to meet each wave's quota. Clearing all seventeen waves completes the campaign.",
        ],
        controls: [
          "Touch: use the direction pad; tap GROUND. Keyboard: Arrows/WASD move; Space, Z, X, J or K grounds.",
          "Standard gamepad: D-pad or left stick moves; A grounds; Start pauses. Physical-device testing is pending.",
          "A full campaign takes about nine minutes in the upstream play guide. Leaving or reloading starts fresh.",
        ],
        tips: [
          "Ground shortly before a spark reaches you; the catch has a short recovery window.",
          "Arrows redirect sparks and bumpers speed them up. Watch the path before crossing it.",
          "The quota meter and wave clock share a target mark. Compare both before the surge arrives.",
        ],
      },
      ko: {
        title: "볼트 키퍼",
        subtitle: "스파크를 접지하고 충전을 지키세요.",
        description:
          "작은 프로브를 조종해 전기가 흐르는 필드에서 가까운 스파크를 접지하고 충전하세요. 화살표·범퍼 회로를 읽고 웨이브 할당량을 채워 17개 캠페인을 버티세요.",
        rules: [
          "필드를 이동하며 축전기를 확인하세요. 충전량이 바닥나면 생명을 잃어요.",
          "스파크 가까이에서 접지를 길게 눌러 흡수하세요. 성공하면 축전기가 충전되고 배율이 올라요.",
          "웨이브별 할당량만큼 에너지를 모으세요. 17개 웨이브를 모두 통과하면 완주입니다.",
        ],
        controls: [
          "터치: 방향 패드로 이동하고 접지를 누르세요. 키보드: 방향키/WASD 이동, Space·Z·X·J·K 접지.",
          "표준 게임패드: 방향패드·왼쪽 스틱 이동, A 접지, Start 정지. 실물 기기 검증은 아직입니다.",
          "원본 플레이 안내 기준 캠페인은 약 9분입니다. 페이지를 나가거나 새로고침하면 처음부터 시작합니다.",
        ],
        tips: [
          "스파크가 닿기 직전에 접지하세요. 성공 후에는 잠시 회복 시간이 있어요.",
          "화살표는 스파크를 돌리고 범퍼는 속도를 높여요. 길을 건너기 전에 궤적을 보세요.",
          "할당량 게이지와 웨이브 시계의 목표선을 비교해 급증 시점에 대비하세요.",
        ],
      },
    },
  },
];
