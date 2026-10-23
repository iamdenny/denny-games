import type { Game } from "./games";
export const sixMovementGames: Game[] = [
  {
    id: "traffic-escape",
    category: "puzzle",
    controlStyle: "directional",
    duration: "2–8",
    color: "rust",
    tags: [
      "sliding cars",
      "parking puzzle",
      "traffic",
      "주차장",
      "자동차 퍼즐",
      "교통 탈출",
    ],
    stages: 12,
    text: {
      en: {
        title: "Traffic Escape",
        searchTitle: "Traffic Escape — Free Sliding Car Puzzle",
        subtitle: "Clear a lane. Let the little coral car through.",
        description:
          "Untangle twelve original six-by-six parking lots. Select a car, slide it only along its lane and clear a route for coral car A to the right exit. Every layout has a verified solution, with undo and saved progress in this browser.",
        rules: [
          "Car A is the coral horizontal car in the exit row. Move it to the right edge to finish the parking lot.",
          "Cars slide one square at a time along their own orientation. They cannot turn, overlap or leave the lot.",
          "There are twelve distinct solvable layouts. Undo restores an earlier position, but does not refund the move count; there is no time limit.",
        ],
        controls: [
          "Click or tap a car to select it, then use the direction buttons. The Next car button cycles through all seven cars.",
          "Keyboard arrows move the selected car along its lane; Enter or Space selects the next car. Use Tab to reach Undo and player controls.",
          "Pause and reload preserve the selected car, positions and undo history. Restart resets the current stage.",
        ],
        tips: [
          "Inspect the two vertical cars that can block the exit row before moving car A.",
          "A car may need to move away from the exit so another car can pass. Clear space rather than only moving the target.",
          "Use Undo to compare a route, and watch the move count if you want to improve your score.",
        ],
      },
      ko: {
        title: "교통 탈출",
        searchTitle: "교통 탈출 — 무료 자동차 슬라이딩 퍼즐",
        subtitle: "길을 비워 산호빛 자동차를 출구로 보내요.",
        description:
          "가로·세로 여섯 칸의 주차장 12개를 풀어보세요. 차를 선택해 정해진 방향으로 밀고 산호빛 A차가 오른쪽 출구로 나갈 길을 만듭니다. 모든 배치에 해답이 있으며 되돌리기와 이 브라우저의 진행 저장을 지원해요.",
        rules: [
          "A차는 출구 줄의 산호빛 가로 차량입니다. 오른쪽 끝까지 옮기면 해당 주차장을 완료해요.",
          "차는 놓인 방향을 따라 한 칸씩만 움직입니다. 회전하거나 겹치거나 주차장을 벗어날 수 없어요.",
          "풀 수 있는 서로 다른 배치 12개가 있습니다. 되돌리기는 위치를 복원하지만 이동 횟수를 줄이지 않으며 시간제한은 없어요.",
        ],
        controls: [
          "차를 눌러 선택한 뒤 방향 버튼으로 움직이세요. 다음 차량 버튼은 일곱 차를 차례로 선택합니다.",
          "키보드 방향키는 선택한 차를 움직이고 Enter·Space는 다음 차를 선택합니다. Tab으로 되돌리기와 공통 버튼에 접근할 수 있어요.",
          "일시정지·새로고침 후 선택한 차, 위치, 되돌리기 기록을 이어갑니다. 다시 시작은 현재 스테이지를 초기화해요.",
        ],
        tips: [
          "A차를 움직이기 전에 출구 줄을 막는 세로 차 두 대를 살펴보세요.",
          "다른 차가 지나가도록 출구 반대쪽으로 차를 움직여야 할 수도 있어요. 목표 차뿐 아니라 빈 공간을 만드세요.",
          "되돌리기로 경로를 비교하고 더 높은 점수를 원한다면 이동 횟수를 줄여보세요.",
        ],
      },
    },
    artwork: "/art/traffic-escape.svg",
    screenshot: "/art/screenshots/traffic-escape.png",
    artworkAlt: {
      en: "Original overhead parking puzzle with seven pastel cars and a right-hand exit",
      ko: "파스텔 차량 일곱 대와 오른쪽 출구가 있는 자체 제작 주차 퍼즐 그림",
    },
    version: 1,
    added: "2026-10-23",
    author: "Denny Games",
    license: "MIT",
    licenseAppliesToGame: true,
    licenseUrl: "https://github.com/iamdenny/denny-games/blob/main/LICENSE",
    licenseDescription: {
      en: "Original code, layouts and artwork by Denny Games.",
      ko: "데니 게임즈가 직접 만든 코드·배치·그림입니다.",
    },
    playModes: ["single-player"],
    inputs: ["touch", "mouse", "keyboard"],
    internalScore: true,
    source:
      "https://github.com/iamdenny/denny-games/tree/main/src/games/traffic-escape",
    guide: {
      path: "guides/traffic-escape",
      label: { en: "Rules and parking strategy", ko: "규칙·주차장 공략" },
    },
  },
  {
    id: "river-hop",
    category: "arcade",
    controlStyle: "directional",
    duration: "2–6",
    color: "mint",
    tags: [
      "lane crossing",
      "river",
      "logs",
      "강 건너기",
      "통나무",
      "길 건너기",
    ],
    stages: 5,
    text: {
      en: {
        title: "River Hop",
        searchTitle: "River Hop — Free Road and River Crossing Game",
        subtitle: "Wait for a gap. Catch a log. Reach the flowers.",
        description:
          "Guide an original little woodland bird across roads and moving logs to the flower bank. Five stages increase the lane speed. Each stage starts with three lives, safe resting banks and saved progress; there is no countdown.",
        rules: [
          "Reach the flower bank at the top to complete a stage. The five stages use faster traffic and logs as you progress.",
          "Avoid cars on the three road lanes. Water is safe only while your bird is fully supported by a floating log; logs carry you sideways.",
          "A collision, water gap or drifting beyond the river edge costs one life and returns you to the start bank. Each stage begins with three lives. Safe banks allow you to wait without a countdown.",
        ],
        controls: [
          "Use the four large direction buttons or keyboard arrows to hop one space. A short hop cooldown prevents accidental double moves.",
          "Wait on a grassy bank to observe the traffic and log positions. Inputs do not advance the world while paused.",
          "Reload restores the current stage, lane timing and lives. Press Start to resume; Restart gives the current stage three new lives.",
        ],
        tips: [
          "Cross the road one lane at a time, using the grassy islands as resting places.",
          "A log moves your bird even while you wait. Choose a landing spot with room before hopping again.",
          "Watch the next lane, not only the lane beneath the bird. Higher stages need shorter waits near river edges.",
        ],
      },
      ko: {
        title: "강 건너기",
        searchTitle: "강 건너기 — 무료 통나무·도로 횡단 게임",
        subtitle: "차 사이를 기다리고 통나무를 타고 꽃밭으로.",
        description:
          "직접 만든 작은 숲새를 움직여 도로와 흐르는 통나무를 건너 위쪽 꽃밭에 도착하세요. 다섯 스테이지에서 차와 통나무가 점점 빨라집니다. 각 단계는 목숨 세 개로 시작하며 안전한 둔치와 진행 저장을 제공하고 제한시간은 없어요.",
        rules: [
          "맨 위 꽃밭에 도착하면 스테이지를 완료합니다. 다섯 단계에서 차와 통나무 속도가 점점 빨라져요.",
          "도로 세 줄에서는 차를 피하세요. 물에서는 새가 통나무 위에 온전히 올라 있어야 하며 통나무가 새를 옆으로 이동시킵니다.",
          "차 충돌, 통나무 사이 물, 강 가장자리 밖으로 떠밀리면 목숨 하나를 잃고 출발 둔치로 돌아옵니다. 각 단계는 목숨 세 개로 시작하며 풀밭에서는 시간제한 없이 기다릴 수 있어요.",
        ],
        controls: [
          "큰 방향 버튼 네 개 또는 키보드 방향키로 한 칸씩 뛰세요. 짧은 도약 간격이 실수로 두 번 움직이는 것을 막아요.",
          "풀밭에서 기다리며 차와 통나무 위치를 살펴보세요. 일시정지 중에는 시간이 흐르거나 이동하지 않아요.",
          "새로고침하면 현재 단계·차선 시간·목숨을 복원합니다. 시작을 눌러 이어가며 다시 시작하면 현재 단계의 목숨이 세 개로 초기화돼요.",
        ],
        tips: [
          "풀밭을 쉬는 곳으로 삼아 도로를 한 줄씩 건너세요.",
          "기다려도 통나무가 새를 움직입니다. 다음 도약 전까지 여유가 있는 자리를 고르세요.",
          "새가 있는 줄뿐 아니라 다음 줄도 보세요. 뒤쪽 스테이지일수록 강 가장자리에서 오래 기다리지 마세요.",
        ],
      },
    },
    artwork: "/art/river-hop.svg",
    screenshot: "/art/screenshots/river-hop.png",
    artworkAlt: {
      en: "Original bird crossing a blue river on warm wooden logs between green banks",
      ko: "초록 둔치 사이 푸른 강의 통나무를 건너는 자체 제작 숲새 그림",
    },
    version: 1,
    added: "2026-10-23",
    author: "Denny Games",
    license: "MIT",
    licenseAppliesToGame: true,
    licenseUrl: "https://github.com/iamdenny/denny-games/blob/main/LICENSE",
    licenseDescription: {
      en: "Original code, lane layouts and artwork by Denny Games.",
      ko: "데니 게임즈가 직접 만든 코드·차선 배치·그림입니다.",
    },
    playModes: ["single-player"],
    inputs: ["touch", "mouse", "keyboard"],
    internalScore: true,
    source:
      "https://github.com/iamdenny/denny-games/tree/main/src/games/river-hop",
    guide: {
      path: "guides/river-hop",
      label: {
        en: "Crossing rules and timing tips",
        ko: "횡단 규칙·타이밍 공략",
      },
    },
  },
];
