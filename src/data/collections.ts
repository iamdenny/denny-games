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
    id: "classic-board",
    ids: ["gomoku", "reversi", "four-in-a-row", "checkers", "dots-and-boxes"],
    text: {
      en: {
        title: "Free two-player board games to play with a friend",
        intro:
          "Play Gomoku, Reversi, Four in a Row, English checkers and Dots and Boxes. Choose a browser AI or take turns with a friend on the same device, without an account or installation.",
        criteria:
          "Five original implementations with explicit rules, local progress and selection-before-confirmation controls. AI has three bounded search levels; this is not online matchmaking or a professional-strength engine.",
        question: "How do I play with a friend on one device?",
        answer:
          "Choose Local two-player to take turns on one device. AI also runs locally. Changing mode or difficulty starts a new game. Progress stays in this browser; there are no online rooms or account sync.",
      },
      ko: {
        title: "친구랑 하는 2인용 무료 보드게임 · 오목·사목·리버시",
        intro:
          "오목·리버시·사목·영국식 체커·점 잇기를 즐기세요. 가입·설치 없이 브라우저 AI와 대전하거나 한 기기에서 친구와 번갈아 둘 수 있습니다.",
        criteria:
          "규칙을 명확히 안내하는 자체 구현 5종입니다. 로컬 저장과 선택 후 확정 조작을 지원합니다. AI는 탐색량이 제한된 세 난이도이며 온라인 매칭·전문 기사 수준의 엔진이 아닙니다.",
        question: "친구랑 한 기기에서 어떻게 2인 플레이를 하나요?",
        answer:
          "게임에서 같은 기기 2인 모드를 고르고 한 화면에서 번갈아 두세요. AI도 브라우저에서 실행됩니다. 방식·난이도를 바꾸면 새 대국이 시작됩니다. 진행 상태는 이 브라우저에 남고 온라인 매칭·방·계정 동기화는 없습니다.",
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
