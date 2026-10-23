import type { Article } from "./pages";
import type { Locale } from "../lib/types";
export const retroIds = [
  "ember-maze",
  "frost-patrol",
  "crater-duel",
  "iron-bastion",
  "prism-pop",
  "bubble-harbor",
  "starfall-wing",
  "vault-runner",
];
export const retroGuide: Record<Locale, Article> = {
  en: {
    title: "Eight original arcade games: choose your next challenge",
    intro:
      "Explore eight original browser games: bomb mazes, snowball arenas, artillery duels, tank defense, splitting spheres, bubble puzzles, vertical shooting and ladder escapes. This guide compares their goals and local play options.",
    sections: [
      {
        heading: "Which game should I start with?",
        paragraphs: [
          "Ember Maze rewards planning around timed explosions. Frost Patrol combines platform movement with freezing and rolling enemies. Crater Duel is a slower contest of angle, power and wind. Iron Bastion asks you to defend a base while managing incoming tanks.",
          "For a quick solo challenge, try Prism Pop's splitting spheres or Starfall Wing's shooting stages. Bubble Harbor rewards thoughtful aiming and connected color groups. Vault Runner combines treasure routes, ladders and pursuing guards.",
        ],
      },
      {
        heading: "Can two people play together?",
        paragraphs: [
          "Ember Maze offers a same-device duel. Frost Patrol and Iron Bastion offer local cooperation. Crater Duel offers alternating turns on one device. Select the local mode in the game; these modes do not use online rooms or matchmaking.",
          "The other four games are solo challenges. Read each game's controls before starting: simultaneous local games need independent controls for each player, while artillery players share the aiming controls in turn.",
        ],
      },
      {
        heading: "Are these ports of commercial classics?",
        paragraphs: [
          "No. These are independently created games with original names, graphics and stages, drawing on familiar arcade genres. They do not contain commercial ROMs or claim an official remake license. Each detail page links to the project source and license.",
        ],
      },
      {
        heading: "How do stages and saves work?",
        paragraphs: [
          "Use the stage selector to choose a challenge. A completed stage offers the next-stage action. Pause and restart are available in the common player. Progress is stored in this browser rather than a cloud account; clearing site data can remove it.",
          "Touch controls and keyboard controls are documented on each game's detail page. Browser viewport tests are separate from testing real phones or gamepads. Reduced-motion and low-effects settings suppress optional effects while keeping essential game movement.",
        ],
      },
    ],
    links: retroIds.map((id) => ({
      label: id
        .split("-")
        .map((w) => w[0]!.toUpperCase() + w.slice(1))
        .join(" "),
      href: `/en/games/${id}/`,
    })),
  },
  ko: {
    title: "오락실 감성 게임 8종: 다음에 할 게임 고르기",
    intro:
      "폭탄 미로, 눈덩이 액션, 포격 대전, 탱크 방어, 공 쪼개기, 버블 퍼즐, 세로 슈팅, 사다리 탈출까지 직접 만든 웹게임 여덟 종을 만나보세요. 목표와 한 기기 2인 플레이 방식을 비교합니다.",
    sections: [
      {
        heading: "어떤 게임부터 해볼까요?",
        paragraphs: [
          "불씨 미로에서는 폭발 시간을 읽고 탈출로를 확보하세요. 서리 순찰대에서는 발판을 오르내리며 적을 얼리고 굴려요. 분화구 결투에서는 각도·세기·바람으로 포격을 계산해요. 강철 보루에서는 몰려오는 탱크를 막으며 기지를 지켜요.",
          "짧게 혼자 즐기려면 공을 쪼개는 프리즘 팝이나 세로 슈팅 스타폴 윙을 골라보세요. 버블 하버는 반사각과 같은 색 연결을, 볼트 러너는 보물 경로와 사다리·추격자 위치를 생각하는 게임이에요.",
        ],
      },
      {
        heading: "친구와 함께 할 수 있나요?",
        paragraphs: [
          "불씨 미로는 한 기기 2인 대전, 서리 순찰대와 강철 보루는 한 기기 협동, 분화구 결투는 번갈아 조작하는 대전을 제공해요. 게임 안에서 로컬 모드를 선택하세요. 온라인 방이나 매칭은 제공하지 않아요.",
          "나머지 네 게임은 혼자 하는 도전이에요. 동시 플레이는 두 사람의 조작이 나뉘고, 포격 대전은 같은 조작부를 차례로 사용해요. 게임별 조작 안내를 먼저 확인하세요.",
        ],
      },
      {
        heading: "상용 고전게임을 그대로 옮겼나요?",
        paragraphs: [
          "아니요. 익숙한 오락실 장르를 바탕으로 이름·그래픽·스테이지를 직접 만든 독립 게임이에요. 상용 롬을 포함하지 않으며 공식 리메이크라고 주장하지 않아요. 각 소개 페이지에서 프로젝트 소스와 라이선스를 확인할 수 있어요.",
        ],
      },
      {
        heading: "스테이지와 저장은 어떻게 되나요?",
        paragraphs: [
          "스테이지 선택에서 도전을 고르고, 성공 후 다음 스테이지로 이동하세요. 공통 플레이어에서 일시정지와 재시작을 할 수 있어요. 진행은 클라우드 계정이 아닌 이 브라우저에 저장되며 사이트 데이터를 지우면 사라질 수 있어요.",
          "각 게임 소개에 터치와 키보드 조작이 나와 있어요. 브라우저 화면 크기 검증은 실제 휴대폰·게임패드 검증과 구분해요. 동작 줄이기와 효과 줄이기는 장식 효과를 줄이고 게임에 필요한 움직임은 유지해요.",
        ],
      },
    ],
    links: retroIds.map((id, i) => ({
      label: [
        "불씨 미로",
        "서리 순찰대",
        "분화구 결투",
        "강철 보루",
        "프리즘 팝",
        "버블 하버",
        "스타폴 윙",
        "볼트 러너",
      ][i]!,
      href: `/ko/games/${id}/`,
    })),
  },
};
