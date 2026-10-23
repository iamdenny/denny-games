import { retroIds } from "./retro-discovery";
import centuryCrisp from "./century-crisp.json" with { type: "json" };
import { agenticGames } from "./agentic-games";
import { games, type Game } from "./games";
import type { Locale } from "../lib/types";
export { controlLabels, controlStyles } from "./play-styles";
export type { ControlStyle } from "./play-styles";
interface CollectionCopy {
  title: string;
  intro: string;
  criteria: string;
  question: string;
  answer: string;
}
interface GameCollection {
  id: string;
  ids: string[];
  text: Record<Locale, CollectionCopy>;
}
export const collections: GameCollection[] = [
  {
    id: "arcade-century",
    ids: [...centuryCrisp, ...agenticGames].map((game) => game.id),
    text: {
      en: {
        title: "100 more arcade challenges",
        intro:
          "Hop between barges, reverse a baseball runner, slash enemies or steer through a radar scope. Explore ninety-nine distinct games from ABA Games plus the original Signal Crossing.",
        criteria:
          "One hundred locally hosted MIT-licensed additions, with original source credits and individual rules. Each starts a fresh round when you leave; browser-local best scores are retained.",
        question: "How do these games differ?",
        answer:
          "Each title has its own timing, obstacles and scoring rules. Open its instructions before playing: a tap may jump, change direction or attack, while holding can charge, descend or move. These are separate games rather than difficulty levels of one game.",
      },
      ko: {
        title: "새로운 아케이드 도전 100가지",
        intro:
          "바지선을 건너고, 야구 주자의 방향을 바꾸고, 적을 베거나 레이더 조준경을 움직이세요. ABA Games의 서로 다른 게임 99개와 자체 제작 신호 교차로를 모았습니다.",
        criteria:
          "MIT 라이선스로 직접 호스팅하는 추가 게임 100개입니다. 게임별 원본 출처와 규칙을 안내합니다. 페이지를 떠나면 새 판으로 시작하고 최고 기록은 브라우저에 남습니다.",
        question: "게임마다 무엇이 다른가요?",
        answer:
          "타이밍과 장애물, 점수를 얻는 규칙이 각각 다릅니다. 누르기가 점프·방향 전환·공격이 되기도 하고, 길게 누르면 충전·하강·이동하기도 하므로 시작 전에 조작법을 확인하세요. 한 게임의 난이도 단계가 아닌 별개의 게임들입니다.",
      },
    },
  },
  {
    id: "logic-detectives",
    ids: ["minefield-watch", "mosaic-mystery", "traffic-escape"],
    text: {
      en: {
        title: "Mines, mosaics and traffic puzzles",
        intro:
          "Read numbered clues, reveal a hidden picture or slide cars toward an exit. Three original browser puzzles for a thoughtful break.",
        criteria:
          "Solo puzzles with touch and keyboard controls, local progress and clearly defined goals. All boards and graphics are created for Denny Games.",
        question: "Which puzzle should I choose first?",
        answer:
          "Minefield Watch asks you to uncover safe cells using nearby mine counts. Mosaic Mystery uses row and column runs to build a picture. Traffic Escape asks you to clear a route for the exit car. None requires an account or online opponents.",
      },
      ko: {
        title: "지뢰, 모자이크, 주차 퍼즐",
        intro:
          "숫자 단서를 읽고 숨겨진 그림을 완성하거나 자동차를 밀어 출구를 여세요. 차분하게 즐기는 자체 제작 퍼즐 세 종입니다.",
        criteria:
          "터치와 키보드 조작, 로컬 진행 저장, 명확한 목표가 있는 1인용 퍼즐입니다. 보드와 그래픽은 데니 게임즈가 직접 제작했습니다.",
        question: "어떤 퍼즐부터 시작하면 좋을까요?",
        answer:
          "주변 지뢰 수로 안전한 칸을 찾으려면 지뢰 감시대, 행과 열의 연속 숫자로 그림을 완성하려면 모자이크 미스터리, 출구 자동차의 길을 열려면 교통 탈출을 고르세요. 계정이나 온라인 상대가 필요하지 않습니다.",
      },
    },
  },
  {
    id: "cross-defend-roll",
    ids: ["river-hop", "meteor-guard", "pocket-bowling"],
    text: {
      en: {
        title: "Cross, defend and bowl",
        intro:
          "Find a safe crossing, intercept incoming meteors or line up a bowling shot. Three original games with different rhythms and clear round goals.",
        criteria:
          "Locally playable solo games with large primary controls, keyboard alternatives and saved progress. Simplified original arcade rules are explained on each game page.",
        question: "Which game is best for deliberate aiming?",
        answer:
          "Pocket Bowling lets you adjust each shot before rolling. Meteor Guard combines aiming with time pressure while protecting cities. River Hop focuses on timing movement between safe spaces. These are solo browser games, without online matchmaking.",
      },
      ko: {
        title: "건너고, 지키고, 굴리고",
        intro:
          "안전한 길로 강을 건너고, 떨어지는 유성을 막고, 볼링 공의 방향을 맞추세요. 서로 다른 리듬과 분명한 목표가 있는 자체 제작 게임 세 종입니다.",
        criteria:
          "큰 주요 조작 버튼, 키보드 대체 조작, 진행 저장을 제공하는 로컬 1인용 게임입니다. 간소화한 오락실 규칙은 각 게임 안내에서 설명합니다.",
        question: "천천히 조준하며 즐길 게임은 무엇인가요?",
        answer:
          "포켓 볼링은 공을 굴리기 전에 조준을 조절할 수 있습니다. 유성 방어대는 제한된 시간에 도시를 지키며 조준하고, 강 건너기는 안전한 공간 사이로 이동하는 타이밍이 중요합니다. 모두 온라인 매칭 없는 1인용 웹게임입니다.",
      },
    },
  },
  {
    id: "bumpers-and-gems",
    ids: ["star-pinball", "jewel-drop", "orbit-break"],
    text: {
      en: {
        title: "Bumpers, gems and bouncing balls",
        intro:
          "Time a pinball return, build a gem chain or aim a brick-breaking shot. Three original browser games for short solo rounds.",
        criteria:
          "Single-player games with large touch controls, keyboard input and local progress. Original tables and graphics, available without an account.",
        question:
          "Which game rewards planning rather than quick flipper timing?",
        answer:
          "Choose Jewel Drop for column placement and chain planning, Star Pinball for flipper timing, or Orbit Break for paddle aiming. All three run on this site and save locally; none uses online matchmaking.",
      },
      ko: {
        title: "핀볼, 보석, 튀어 오르는 공",
        intro:
          "핀볼을 받아치고 보석 연쇄를 만들거나 벽돌을 겨누세요. 짧게 혼자 즐기는 자체 제작 웹게임 세 종입니다.",
        criteria:
          "큰 터치 버튼, 키보드 입력, 로컬 진행 저장을 제공하는 1인용 게임입니다. 자체 제작한 테이블과 그래픽으로 계정 없이 즐깁니다.",
        question: "빠른 플리퍼 조작보다 배치를 고민하는 게임은 무엇인가요?",
        answer:
          "배치와 연쇄를 고민하려면 보석 낙하, 플리퍼 타이밍을 즐기려면 별빛 핀볼, 패들로 조준하려면 오빗 브레이크를 고르세요. 모두 이 사이트에서 실행하고 로컬에 저장하며 온라인 매칭은 사용하지 않습니다.",
      },
    },
  },
  {
    id: "cook-rally-duel",
    ids: ["snack-street", "pocket-pingpong", "ember-maze"],
    text: {
      en: {
        title: "Cook, rally or duel",
        intro:
          "Build a snack shop, climb a table tennis league or escape a chain explosion. Three original games with distinct rhythms.",
        criteria:
          "Snack Street and Pocket Table Tennis are solo campaigns. Ember Maze offers solo play and a same-device duel.",
        question: "Which of these games can I play with a friend?",
        answer:
          "Choose Ember Maze for two players sharing one device. Snack Street and Pocket Table Tennis are single-player games. All three save locally; none uses online matchmaking.",
      },
      ko: {
        title: "요리하고, 랠리하고, 대결해요",
        intro:
          "분식집을 키우고 탁구 리그에 도전하거나 연쇄 폭발을 피하세요. 서로 다른 리듬의 자체 제작 게임 세 종입니다.",
        criteria:
          "분식 골목과 포켓 탁구 리그는 혼자 하는 캠페인이고, 불씨 미로는 혼자 또는 한 기기 2인 대전을 지원해요.",
        question: "친구와 함께 할 수 있는 게임은 무엇인가요?",
        answer:
          "둘이 한 기기를 함께 쓴다면 불씨 미로를 고르세요. 분식 골목과 포켓 탁구 리그는 혼자 하는 게임입니다. 세 게임 모두 로컬 저장을 사용하며 온라인 매칭은 없어요.",
      },
    },
  },
  {
    id: "retro-arcade",
    ids: retroIds,
    text: {
      en: {
        title: "Eight original arcade games for solo and local play",
        intro:
          "Explore bomb mazes, snowball arenas, artillery duels, tank defense, splitting spheres, bubble puzzles, vertical shooting and ladder escapes. Play these original games in your browser.",
        criteria:
          "Eight independently created games with original names, graphics and stages. Four offer same-device two-player modes; four are solo games. These are not commercial classic ports or online multiplayer games.",
        question: "Which arcade games can I play with a friend?",
        answer:
          "Choose Ember Maze for a local duel, Frost Patrol or Iron Bastion for local cooperation, or Crater Duel to take turns. Two players share one device; there are no online rooms or matchmaking.",
      },
      ko: {
        title: "혼자 또는 친구와 즐기는 오락실 감성 웹게임 8종",
        intro:
          "폭탄 미로·눈덩이 액션·포격 대전·탱크 방어·공 쪼개기·버블 퍼즐·세로 슈팅·사다리 탈출을 만나보세요. 직접 만든 여덟 게임을 브라우저에서 즐길 수 있어요.",
        criteria:
          "이름·그래픽·스테이지를 직접 만든 게임 여덟 종이에요. 네 게임은 한 기기 2인 모드를, 나머지 네 게임은 혼자 하는 도전을 제공해요. 상용 고전게임의 이식판이나 온라인 다인 게임은 아니에요.",
        question: "친구와 함께 할 수 있는 오락실 게임은 무엇인가요?",
        answer:
          "불씨 미로에서 한 기기 대전, 서리 순찰대·강철 보루에서 협동, 분화구 결투에서 번갈아 하는 포격 대전을 즐기세요. 두 사람이 한 기기를 함께 사용하며 온라인 방·매칭은 없어요.",
      },
    },
  },
  {
    id: "traditional-games",
    ids: ["yutnori", "gonggi"],
    text: {
      en: {
        title: "Free Korean traditional games",
        intro:
          "Try Yutnori, a 2–4 player same-device board game, or Gonggi, a five-stage five-stones dexterity challenge. Both original games run here in your browser, with no account or installation.",
        criteria:
          "Two original browser games based on Korean traditional play. Yutnori is local pass-and-play; Gonggi is a single-player digital variation. Neither offers online matchmaking.",
        question: "Can I play Korean traditional games in my browser?",
        answer:
          "Yes. Play Yutnori with 2–4 people sharing one device, or practice the five stages of Gonggi on your own. The games are hosted on Denny Games; progress stays in this browser.",
      },
      ko: {
        title: "무료 한국 전통놀이 게임",
        intro:
          "한 기기에서 2~4명이 즐기는 윷놀이와 다섯 단계를 연습하는 공기놀이를 해보세요. 두 게임 모두 이 브라우저에서 실행되는 자체 제작 게임이며 가입·설치가 필요 없습니다.",
        criteria:
          "한국 전통놀이를 바탕으로 직접 만든 브라우저 게임 두 종입니다. 윷놀이는 한 기기에서 차례로 하는 다인 플레이, 공기놀이는 혼자 하는 디지털 변형입니다. 온라인 매칭은 제공하지 않습니다.",
        question: "한국 전통놀이를 브라우저에서 할 수 있나요?",
        answer:
          "네. 한 기기에서 2~4명이 윷놀이를 하거나 혼자 공기놀이 다섯 단계를 연습할 수 있어요. 두 게임은 데니 게임즈에서 실행되고 진행 기록은 이 브라우저에 저장돼요.",
      },
    },
  },
  {
    id: "classic-board",
    ids: [
      "gomoku",
      "reversi",
      "four-in-a-row",
      "checkers",
      "dots-and-boxes",
      "yutnori",
    ],
    text: {
      en: {
        title: "Free two-player board games to play with a friend",
        intro:
          "Play Gomoku, Reversi, Four in a Row, English checkers, Dots and Boxes or Yutnori. Five games offer browser AI or same-device two-player play; Yutnori supports 2–4 local players. No account or installation is needed.",
        criteria:
          "Six original games with explicit rules and local progress. Five have a local AI or two-player mode; Yutnori is a 2–4 player pass-and-play game without AI. None offers online matchmaking.",
        question: "How do I play with a friend on one device?",
        answer:
          "Choose a local two-player mode to take turns on one device. Five games include browser AI; Yutnori supports 2–4 people sharing one device. Progress stays in this browser; there are no online rooms or account sync.",
      },
      ko: {
        title: "친구와 하는 무료 보드게임 · 오목·사목·리버시·윷놀이",
        intro:
          "오목·리버시·사목·영국식 체커·점 잇기·윷놀이를 즐기세요. 다섯 게임은 브라우저 AI 또는 한 기기 2인 대전을, 윷놀이는 한 기기 2~4인 대전을 지원합니다. 가입·설치가 필요 없습니다.",
        criteria:
          "규칙을 안내하는 자체 구현 6종입니다. 다섯 게임은 로컬 AI·2인 대전을 지원하고 윷놀이는 AI 없는 2~4인 로컬 플레이를 제공합니다. 온라인 매칭은 없습니다.",
        question: "친구랑 한 기기에서 어떻게 2인 플레이를 하나요?",
        answer:
          "게임에서 같은 기기 2인 모드를 고르고 한 화면에서 번갈아 두세요. 윷놀이는 2~4명이 함께 할 수 있고 AI는 제공하지 않습니다. 진행 상태는 이 브라우저에 남고 온라인 매칭·방·계정 동기화는 없습니다.",
      },
    },
  },
  {
    id: "one-button",
    ids: [
      "crisp-accelb",
      "crisp-aerialbar",
      "crisp-balltour",
      "crisp-bsfish",
      "crisp-castn",
      "crisp-cleanrobo",
      "crisp-count",
      "crisp-geocent",
      "crisp-golfme",
      "crisp-parking",
      "crisp-rbdrive",
      "crisp-slalom",
    ],
    text: {
      en: {
        title: "One-button browser games",
        intro:
          "Tap, hold and release one action button in these free mini-games. Position aiming and number-key games are excluded, so you can begin without steering a pointer.",
        criteria:
          "Selected from games whose upstream controls use a button rather than a pointer or number keys. One button can trigger different actions when tapped, held or released; read the game's own instructions.",
        question: "Can I play these games with only Space?",
        answer:
          "During a round, Space supplies the press-and-release action. Start, pause and restart use the common player controls. Touch uses a press on the game area; standard gamepad A is mapped to the same action, but physical devices await testing.",
      },
      ko: {
        title: "한 버튼으로 즐기는 무료 웹게임",
        intro:
          "버튼 하나를 누르고, 길게 누르고, 떼며 즐기는 미니게임입니다. 위치 조준과 숫자 키 게임을 제외해 포인터를 움직이지 않고 시작할 수 있습니다.",
        criteria:
          "원본 조작이 위치나 숫자 키 대신 버튼을 사용하는 게임에서 골랐습니다. 한 버튼도 누르는 길이와 손을 떼는 순간에 따라 행동이 달라지므로 게임별 안내를 확인하세요.",
        question: "Space 키 하나로 플레이할 수 있나요?",
        answer:
          "라운드 중에는 Space로 누르기와 떼기를 조작합니다. 시작·정지·재시작은 공통 플레이어 버튼을 사용하세요. 터치는 게임 영역 누르기, 표준 패드는 A에 매핑했으며 실제 기기 검증은 아직입니다.",
      },
    },
  },
  {
    id: "point-and-play",
    ids: [
      "lantern-grid",
      "number-trail",
      "circuit-loop",
      "orbit-break",
      "crisp-attackchain",
      "crisp-bblast",
      "crisp-breedc",
      "crisp-crossline",
      "crisp-findastar",
      "crisp-magnetblocks",
      "crisp-makemaze",
      "crisp-pfit",
      "crisp-ringblast",
      "crisp-vhwalls",
      "bounce-back",
    ],
    text: {
      en: {
        title: "Point-and-play browser games",
        intro:
          "Choose tiles, drag objects and aim at positions in this collection of free browser games. These games need location control as well as a press, rather than a Space-only action.",
        criteria:
          "Selected for position-based interaction: tile selection, pointer aiming or dragging. Circuit Loop and Orbit Break have dedicated controls; imported games use their original pointer rules.",
        question: "Do I need a mouse?",
        answer:
          "Mouse or touch can specify a position. Bounce Back uses the left half to move and the right half to aim and throw. Its standard gamepad mapping uses one stick for movement and aiming. Phone, controller and Tesla compatibility still needs physical-device checks.",
      },
      ko: {
        title: "터치·마우스로 위치를 조작하는 웹게임",
        intro:
          "타일을 고르고, 물체를 끌고, 위치를 겨냥하는 무료 웹게임 모음입니다. Space만 누르는 방식과 달리 누를 위치나 움직임을 함께 조작합니다.",
        criteria:
          "타일 선택·포인터 조준·드래그 등 위치 조작을 기준으로 골랐습니다. 서킷 루프와 오빗 브레이크는 전용 조작을, 가져온 게임은 원본의 포인터 규칙을 사용합니다.",
        question: "마우스가 꼭 필요한가요?",
        answer:
          "마우스나 터치로 위치를 지정할 수 있습니다. Bounce Back은 왼쪽 화면을 끌어 이동하고 오른쪽을 끌어 조준·던집니다. 표준 패드에서는 한 스틱으로 이동과 조준을 함께 합니다. 휴대폰·패드·테슬라의 실제 호환성은 기기 검증이 필요합니다.",
      },
    },
  },
  {
    id: "number-puzzles",
    ids: [
      "2048",
      "crisp-bmath",
      "crisp-count",
      "crisp-digi10",
      "crisp-molen",
      "crisp-numberline",
      "crisp-sumten",
    ],
    text: {
      en: {
        title: "Free number puzzle games",
        intro:
          "Merge tiles in 2048, enter digits in DIGI10, or try short arithmetic and counting challenges. These number puzzles have different controls and pace; this is not a promise of untimed or educational play.",
        criteria:
          "Selected for a visible number, counting or arithmetic mechanic. Only 2048 is a directional tile-merging game; DIGI10 uses digits 1–9, while other titles use a button or pointer.",
        question: "Will my number puzzle continue after I leave?",
        answer:
          "2048 restores its current round in the same browser. The Crisp games in this collection save personal bests, not an unfinished round. Clearing browser storage removes locally saved data; records do not sync between devices.",
      },
      ko: {
        title: "무료 숫자 퍼즐·계산 웹게임",
        intro:
          "2048에서 숫자 타일을 합치고, DIGI10에서 숫자를 입력하거나 짧은 계산·세기 도전에 참여하세요. 게임마다 조작과 속도가 다르며 무제한 시간이나 학습 효과를 보장하는 모음은 아닙니다.",
        criteria:
          "숫자·세기·계산 규칙을 기준으로 골랐습니다. 2048은 방향 조작으로 타일을 합치고, DIGI10은 숫자 1–9를 사용합니다. 나머지는 버튼이나 위치 조작을 사용합니다.",
        question: "나갔다 돌아와도 숫자 퍼즐을 이어 할 수 있나요?",
        answer:
          "2048은 같은 브라우저에서 현재 판을 복원합니다. 이 모음의 Crisp 게임은 진행 중인 판 대신 최고 점수만 저장합니다. 브라우저 저장 공간을 지우면 로컬 기록도 사라지며 다른 기기와 동기화되지 않습니다.",
      },
    },
  },
  {
    id: "daily-challenges",
    ids: ["circuit-loop", "orbit-break", "2048"],
    text: {
      en: {
        title: "Daily browser game challenges",
        intro:
          "Play the daily Circuit Loop, Orbit Break and 2048 challenge. UTC date, game and rule version determine the shared starting seed; your scores stay in your browser without a global leaderboard.",
        criteria:
          "Only the three games with a deterministic daily seed are included. Imported games do not join daily challenges. Use the Daily challenge link to start today's seeded round.",
        question: "When does the daily challenge change?",
        answer:
          "The date changes at 00:00 UTC, which is 09:00 in Korea. Sharing a result includes its seed and rule version so a friend can open the same starting challenge. Your inputs still determine the outcome.",
      },
      ko: {
        title: "매일 도전하는 무료 브라우저 게임",
        intro:
          "서킷 루프·오빗 브레이크·2048의 오늘의 도전을 즐기세요. UTC 날짜·게임·규칙 버전으로 같은 시작 seed를 만들며 점수는 세계 순위표 없이 이 브라우저에 저장합니다.",
        criteria:
          "날짜별 동일 seed를 지원하는 세 게임만 포함합니다. 가져온 게임은 일일 도전에 포함하지 않습니다. 오늘의 도전 링크로 오늘의 판을 시작하세요.",
        question: "오늘의 도전은 몇 시에 바뀌나요?",
        answer:
          "UTC 00시, 한국 시간 오전 9시에 날짜가 바뀝니다. 결과 공유 링크에는 seed와 규칙 버전이 들어 있어 친구가 같은 시작 판을 열 수 있습니다. 이후 결과는 각자의 조작에 따라 달라집니다.",
      },
    },
  },
];
export const collectionGames = (id: string): Game[] => {
  const ids = collections.find((item) => item.id === id)?.ids ?? [];
  return ids.flatMap((id) => {
    const game = games.find((game) => game.id === id);
    return game ? [game] : [];
  });
};
export const gameCollections = (id: string) =>
  collections.filter((item) => item.ids.includes(id));
