import type { Game } from "./games";
const common = {
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
  playModes: ["single-player"] as Game["playModes"],
  inputs: ["touch", "mouse", "keyboard"] as Game["inputs"],
  internalScore: true,
};
export const arcadeTrioGames: Game[] = [
  {
    ...common,
    id: "snack-street",
    category: "simulation",
    controlStyle: "pointer",
    duration: "5–15",
    color: "rust",
    tags: [
      "restaurant",
      "cooking",
      "tycoon",
      "분식집",
      "타이쿤",
      "요리",
      "경영",
    ],
    source:
      "https://github.com/iamdenny/denny-games/tree/main/src/games/snack-street",
    artwork: "/art/snack-street.svg",
    screenshot: "/art/screenshots/snack-street.png",
    artworkAlt: {
      en: "Original illustration of a warm snack counter with rice cakes, gimbap and fish cake skewers",
      ko: "떡볶이·김밥·어묵이 놓인 따뜻한 분식집 카운터의 자체 제작 그림",
    },
    guide: {
      path: "guides/snack-street",
      label: { en: "Cooking and upgrade guide", ko: "조리·가게 성장 안내" },
    },
    text: {
      en: {
        title: "Snack Street",
        searchTitle: "Snack Street — Free Restaurant Cooking Game",
        subtitle: "Three recipes. Five days. Your little shop.",
        description:
          "Run a tiny Korean snack shop through five increasingly busy days. Prepare rice cakes, gimbap and fish cake skewers, serve waiting customers and spend your earnings on shop upgrades. This original browser game saves your progress locally without an account.",
        rules: [
          "Choose a station and prepare the requested food. Each recipe needs a different number of preparation steps; simmered dishes take time to cook.",
          "Serve the correct ready dish before the customer's patience runs out. Successful orders earn coins and consecutive service builds a combo.",
          "Finish the day's orders, review your earnings and choose upgrades before the next day. Serve at least 24 of the 40 customers across five days to win.",
        ],
        controls: [
          "Touch or click the labeled preparation and serving buttons at each station.",
          "Use arrow keys to select a station or upgrade and Enter or Space to confirm. Pause stops cooking and customer timers.",
          "Progress stays in this browser. Reload and language changes preserve the saved shop; restarting begins a new campaign.",
        ],
        tips: [
          "Start simmering dishes before preparing a quick gimbap order.",
          "Read the order and remaining patience before serving.",
          "Spend between days to suit your bottleneck: cooking speed, patience or earnings.",
        ],
      },
      ko: {
        title: "분식 골목",
        searchTitle: "분식집 타이쿤 — 분식 골목 무료 요리 게임",
        subtitle: "세 가지 메뉴, 닷새 동안 키우는 나의 가게.",
        description:
          "작은 분식집을 맡아 점점 바빠지는 닷새를 보내세요. 떡볶이·김밥·어묵을 준비하고 기다리는 손님에게 주문대로 내어 주세요. 번 돈으로 가게를 개선하며 성장하는 자체 제작 요리·경영 웹게임입니다. 가입 없이 이 브라우저에 진행을 저장합니다.",
        rules: [
          "조리대를 고르고 주문에 맞는 음식을 준비하세요. 메뉴마다 필요한 준비 횟수가 다르고, 끓이는 음식은 조리 시간이 필요해요.",
          "손님의 기다림이 끝나기 전에 완성된 음식을 맞게 내어 주세요. 주문을 성공하면 동전을 받고 연속으로 응대하면 콤보가 쌓여요.",
          "하루 주문을 마치면 수입을 확인하고 가게를 개선한 뒤 다음 날을 시작하세요. 닷새 동안 손님 40명 중 24명 이상에게 서빙하면 승리해요.",
        ],
        controls: [
          "터치·마우스: 조리대의 준비·서빙 버튼을 누르세요.",
          "키보드: 방향키로 조리대나 업그레이드를 고르고 Enter 또는 Space로 실행하세요. 일시정지하면 조리·손님 타이머가 멈춰요.",
          "진행은 이 브라우저에 저장돼요. 새로고침·언어 변경 후 저장한 가게를 이어가며, 다시 시작하면 새 캠페인을 시작해요.",
        ],
        tips: [
          "끓이는 요리를 먼저 올린 뒤 빠르게 김밥을 준비하세요.",
          "서빙 전에 주문 메뉴와 남은 기다림을 확인하세요.",
          "하루가 끝나면 조리 속도·대기 시간·수입 중 필요한 부분을 개선하세요.",
        ],
      },
    },
  },
  {
    ...common,
    id: "pocket-pingpong",
    category: "sports",
    controlStyle: "directional",
    duration: "3–10",
    color: "mint",
    tags: [
      "table tennis",
      "ping pong",
      "league",
      "spin",
      "탁구",
      "스매시",
      "리그",
    ],
    source:
      "https://github.com/iamdenny/denny-games/tree/main/src/games/pocket-pingpong",
    artwork: "/art/pocket-pingpong.svg",
    screenshot: "/art/screenshots/pocket-pingpong.png",
    artworkAlt: {
      en: "Original illustration of a blue table tennis table with two paddles and a curving ball trail",
      ko: "파란 탁구대와 라켓 두 개, 휘어지는 공 궤적의 자체 제작 그림",
    },
    guide: {
      path: "guides/pocket-pingpong",
      label: { en: "Rally and league guide", ko: "랠리·리그 안내" },
    },
    text: {
      en: {
        title: "Pocket Table Tennis",
        searchTitle: "Pocket Table Tennis — Free Ping Pong League Game",
        subtitle: "Read the bounce. Find your winning shot.",
        description:
          "Play an original solo table tennis league against three computer opponents. Move your paddle to meet the ball, choose a controlled drive, topspin or a demanding smash, and win short five-point matches. The perspective table, bounce shadows and impact effects keep each rally readable.",
        rules: [
          "Serve to begin a rally. Align your paddle with the incoming ball for an automatic return.",
          "Select Drive, Topspin or Smash to change speed and precision. Watch the bounce and shadow to judge the ball's arrival.",
          "The first player to five points wins the match. Beat three opponents in sequence to finish the league. These are simplified arcade rules, not official tournament rules.",
        ],
        controls: [
          "Drag across the table or hold Left and Right to position your paddle; use the Serve button to begin.",
          "Keyboard: Left/Right or A/D move. Enter or Space serves or continues to the next match. Choose your shot with Up/Down, W/S or the labeled buttons.",
          "Pause, reload or change language to continue your saved league in this browser. Restart begins a new league. This game is solo against AI.",
        ],
        tips: [
          "Begin with Drive while learning where to meet the ball.",
          "Use Topspin to vary a rally; a Smash needs more precise positioning.",
          "Return to the middle after a wide shot so you can cover either side.",
        ],
      },
      ko: {
        title: "포켓 탁구 리그",
        searchTitle: "무료 탁구 게임 — 포켓 탁구 리그",
        subtitle: "바운드를 읽고, 나만의 결정구를 찾으세요.",
        description:
          "컴퓨터 상대 세 명에게 차례로 도전하는 자체 제작 탁구 리그입니다. 라켓을 공에 맞춰 움직이고 안정적인 드라이브·회전·정확도가 필요한 스매시를 선택해 5점 경기를 이기세요. 원근감 있는 탁구대와 공 그림자·타격 효과로 랠리를 즐길 수 있습니다.",
        rules: [
          "서브로 랠리를 시작하세요. 다가오는 공에 라켓을 맞추면 자동으로 받아쳐요.",
          "드라이브·회전·스매시를 골라 속도와 정확도를 조절하세요. 바운드와 그림자를 보고 공이 오는 위치를 읽으세요.",
          "먼저 5점을 얻으면 경기에서 이겨요. 상대 세 명을 차례로 이기면 리그를 완주해요. 정식 대회 규칙을 그대로 재현한 것이 아닌 간소화한 아케이드 규칙이에요.",
        ],
        controls: [
          "터치·마우스: 탁구대에서 드래그하거나 왼쪽·오른쪽 버튼을 길게 눌러 라켓을 움직이고 서브 버튼으로 시작하세요.",
          "키보드: 좌우 방향키 또는 A/D로 이동하고 Enter 또는 Space로 서브·다음 경기를 시작하세요. 구질은 위아래 방향키·W/S 또는 화면 버튼으로 고르세요.",
          "일시정지·새로고침·언어 변경 후 이 브라우저에 저장된 리그를 이어가요. 다시 시작하면 새 리그가 시작돼요. 컴퓨터와 혼자 대결하는 게임입니다.",
        ],
        tips: [
          "처음에는 드라이브로 공을 받는 위치에 익숙해지세요.",
          "회전으로 랠리에 변화를 주고 정확히 맞출 때 스매시를 노리세요.",
          "넓은 쪽으로 이동한 뒤 중앙으로 돌아오면 다음 공에 대비하기 좋아요.",
        ],
      },
    },
  },
];
