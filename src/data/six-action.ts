import type { Game } from "./games";
export const sixActionGames: Game[] = [
  {
    id: "meteor-guard",
    category: "arcade",
    controlStyle: "pointer",
    duration: "2–4",
    color: "mint",
    version: 1,
    stages: 1,
    tags: ["Meteor Guard", "유성 방어대", "original", "arcade"],
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseAppliesToGame: true,
    licenseUrl: "https://github.com/iamdenny/denny-games/blob/main/LICENSE",
    licenseDescription: {
      en: "Original code, rules and graphics by Denny Games.",
      ko: "데니 게임즈가 직접 만든 코드·규칙·그래픽입니다.",
    },
    author: "Denny Games",
    source:
      "https://github.com/iamdenny/denny-games/tree/main/src/games/meteor-guard",
    added: "2026-10-23",
    artwork: "/art/meteor-guard.svg",
    screenshot: "/art/screenshots/meteor-guard.png",
    artworkAlt: {
      en: "Meteor Guard original game illustration",
      ko: "유성 방어대 자체 제작 게임 일러스트",
    },
    playModes: ["single-player"],
    internalScore: true,
    guide: {
      path: "guides/meteor-guard",
      label: {
        en: "Rules and strategy",
        ko: "규칙과 공략",
      },
    },
    text: {
      en: {
        title: "Meteor Guard",
        searchTitle: "Meteor Guard — Free Browser Game",
        subtitle: "Aim carefully. Make every shot count.",
        description:
          "Protect three stationary cities across five waves of falling meteors. Aim an interceptor at a point ahead of a threat and let the expanding blast catch nearby meteors. Survive with at least one city intact; every wave lasts 20 seconds plus time to resolve the remaining threats.",
        rules: [
          "Each destroyed meteor gives 100 points. Surviving an intermediate wave adds 250 points. A meteor that reaches the skyline destroys its targeted city once.",
          "Aim a little below a descending meteor so the interceptor meets it in time. Overlapping threats can be caught in one expanding blast. All remaining meteors, interceptors and blasts must resolve before the next wave or the final win.",
        ],
        controls: [
          "Tap the sky to aim and fire. Alternatively adjust the horizontal and height sliders and press Fire or Space. A short reload prevents unlimited firing.",
        ],
        tips: [
          "Aim a little below a descending meteor so the interceptor meets it in time. Overlapping threats can be caught in one expanding blast. All remaining meteors, interceptors and blasts must resolve before the next wave or the final win.",
        ],
      },
      ko: {
        title: "유성 방어대",
        searchTitle: "유성 방어대 — 무료 웹게임",
        subtitle: "조준을 가다듬고 한 발씩 도전하세요.",
        description:
          "고정된 도시 세 곳을 지키며 다섯 차례의 유성 파도를 견디세요. 유성이 내려오는 방향 앞쪽에 요격탄을 쏘면 넓어지는 폭발이 주변 유성을 제거합니다. 각 웨이브는 20초와 남은 위협 정리 시간으로 구성되며 도시가 한 곳 이상 남으면 승리해요.",
        rules: [
          "유성 하나를 제거하면 100점, 중간 웨이브를 넘기면 250점을 얻습니다. 지면에 닿은 유성은 목표 도시를 한 번만 파괴해요.",
          "내려오는 유성보다 조금 아래를 노려 요격탄의 이동 시간을 고려하세요. 가까운 유성들은 하나의 폭발로 함께 없앨 수 있어요. 마지막 유성·요격탄·폭발까지 정리되어야 다음 웨이브나 최종 승리로 넘어갑니다.",
        ],
        controls: [
          "하늘을 터치하면 조준과 발사를 함께 합니다. 가로·높이 조준 슬라이더를 움직인 뒤 발사 버튼이나 Space를 눌러도 됩니다. 짧은 재장전 시간이 있어요.",
        ],
        tips: [
          "내려오는 유성보다 조금 아래를 노려 요격탄의 이동 시간을 고려하세요. 가까운 유성들은 하나의 폭발로 함께 없앨 수 있어요. 마지막 유성·요격탄·폭발까지 정리되어야 다음 웨이브나 최종 승리로 넘어갑니다.",
        ],
      },
    },
  },
  {
    id: "pocket-bowling",
    category: "sports",
    controlStyle: "pointer",
    duration: "2–5",
    color: "mint",
    version: 1,
    stages: 1,
    tags: ["Pocket Bowling", "포켓 볼링", "original", "arcade"],
    inputs: ["touch", "mouse", "keyboard"],
    license: "MIT",
    licenseAppliesToGame: true,
    licenseUrl: "https://github.com/iamdenny/denny-games/blob/main/LICENSE",
    licenseDescription: {
      en: "Original code, rules and graphics by Denny Games.",
      ko: "데니 게임즈가 직접 만든 코드·규칙·그래픽입니다.",
    },
    author: "Denny Games",
    source:
      "https://github.com/iamdenny/denny-games/tree/main/src/games/pocket-bowling",
    added: "2026-10-23",
    artwork: "/art/pocket-bowling.svg",
    screenshot: "/art/screenshots/pocket-bowling.png",
    artworkAlt: {
      en: "Pocket Bowling original game illustration",
      ko: "포켓 볼링 자체 제작 게임 일러스트",
    },
    playModes: ["single-player"],
    internalScore: true,
    guide: {
      path: "guides/pocket-bowling",
      label: {
        en: "Rules and strategy",
        ko: "규칙과 공략",
      },
    },
    text: {
      en: {
        title: "Pocket Bowling",
        searchTitle: "Pocket Bowling — Free Browser Game",
        subtitle: "Aim carefully. Make every shot count.",
        description:
          "Play one complete ten-frame bowling game with aim and power controls, a moving ball and falling pins. Standard strike and spare bonuses determine the score, including the extra rolls in frame ten. Reach 100 points by the end of the game.",
        rules: [
          "An ordinary frame allows two rolls. A strike knocks down ten on the first roll and adds the next two rolls; a spare clears the rack with two rolls and adds the next roll. Unresolved bonus frames wait for later rolls before appearing in the total.",
          "The tenth frame grants two extra rolls for a strike or one for a spare. After a strike, another strike resets the rack; otherwise the second bonus ball uses the remaining pins. This original simplified arcade model rewards reading the visible pocket target rather than simulating full rigid-body bowling.",
        ],
        controls: [
          "Adjust Aim and Power with touch, mouse or native slider arrow keys, then press Roll or Space. Watch the ball and pin animation before preparing the next roll. The visible target aim and power change with each roll; match the red pocket marker and the displayed power recommendation.",
        ],
        tips: [
          "The tenth frame grants two extra rolls for a strike or one for a spare. After a strike, another strike resets the rack; otherwise the second bonus ball uses the remaining pins. This original simplified arcade model rewards reading the visible pocket target rather than simulating full rigid-body bowling.",
        ],
      },
      ko: {
        title: "포켓 볼링",
        searchTitle: "포켓 볼링 — 무료 웹게임",
        subtitle: "조준을 가다듬고 한 발씩 도전하세요.",
        description:
          "조준과 힘을 조절해 공을 굴리고 핀을 쓰러뜨리는 10프레임 볼링입니다. 스트라이크·스페어 보너스와 10프레임 추가 투구까지 계산합니다. 한 경기를 마쳤을 때 100점 이상이면 승리해요.",
        rules: [
          "일반 프레임은 두 번 던집니다. 첫 공에 10개를 쓰러뜨리는 스트라이크는 다음 두 투구, 두 번째 공까지 모두 정리하는 스페어는 다음 한 투구를 더합니다. 보너스가 아직 결정되지 않은 프레임 점수는 후속 투구를 기다려요.",
          "10프레임 스트라이크는 두 번, 스페어는 한 번의 추가 투구를 얻습니다. 스트라이크 뒤 다시 스트라이크면 핀을 새로 놓고, 그렇지 않으면 남은 핀을 다음 보너스 공으로 노립니다. 실제 강체 물리 전체를 재현하기보다 일정한 포켓 조준을 보상하는 자체 아케이드 모델입니다.",
        ],
        controls: [
          "터치·마우스 또는 슬라이더 방향키로 조준과 힘을 정한 뒤 굴리기나 Space를 누르세요. 공과 핀 애니메이션이 끝나야 다음 투구를 준비할 수 있습니다. 매 투구마다 달라지는 추천 조준·힘을 확인하고 빨간 포켓 표식과 권장 힘에 맞추세요.",
        ],
        tips: [
          "10프레임 스트라이크는 두 번, 스페어는 한 번의 추가 투구를 얻습니다. 스트라이크 뒤 다시 스트라이크면 핀을 새로 놓고, 그렇지 않으면 남은 핀을 다음 보너스 공으로 노립니다. 실제 강체 물리 전체를 재현하기보다 일정한 포켓 조준을 보상하는 자체 아케이드 모델입니다.",
        ],
      },
    },
  },
];
