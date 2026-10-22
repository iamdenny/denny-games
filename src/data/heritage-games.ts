import type { Game } from "./games";
const shared = {
  version: 1,
  license: "MIT",
  author: "Denny Games",
  source:
    "https://github.com/iamdenny/denny-games/tree/main/src/games/heritage",
  added: "2026-10-22",
  playModes: ["single-player"] as const,
};
export const heritageGames: Game[] = [
  {
    ...shared,
    playModes: [...shared.playModes],
    id: "amber-trail",
    category: "action",
    controlStyle: "directional",
    color: "gold",
    duration: "3–8",
    stages: 6,
    inputs: ["touch", "mouse", "keyboard", "gamepad"],
    artwork: "/art/amber-trail.svg",
    screenshot: "/art/screenshots/amber-trail.png",
    tags: ["platformer", "original", "adventure", "횡스크롤", "탐험"],
    text: {
      en: {
        title: "Amber Trail",
        subtitle: "A stone hammer. A valley full of secrets.",
        description:
          "An original six-stage prehistoric platform adventure. Leap between terraces, gather amber and strike roaming creatures before reaching the flag. No borrowed characters, maps or artwork.",
        rules: [
          "Collect at least six amber gems, then reach the flag at the far right.",
          "You have four hearts. Swing your hammer or land on an enemy to defeat it.",
          "Each of six stages changes the terraces and number of enemies. Progress saves locally.",
        ],
        controls: [
          "Touch: hold left or right; tap Jump and Strike.",
          "Keyboard: left/right move, up jumps, Space attacks. Release directions to stop.",
          "Standard gamepad: stick moves, D-pad up jumps and primary button attacks. Physical devices unverified.",
        ],
        tips: [
          "Jump while moving to reach gems on terraces.",
          "Face an enemy before striking.",
          "You can pass the flag and return for missing amber.",
        ],
      },
      ko: {
        title: "호박빛 탐험",
        subtitle: "돌망치 하나, 비밀 가득한 계곡.",
        description:
          "원시시대 계곡을 달리는 독자 횡스크롤 액션 6단계예요. 발판을 뛰어넘어 호박석을 모으고 돌아다니는 생물들을 피해 깃발에 도착하세요. 캐릭터·맵·그림을 직접 만들었어요.",
        rules: [
          "호박석을 6개 이상 모은 뒤 오른쪽 끝 깃발로 가세요.",
          "체력은 네 칸이에요. 돌망치를 휘두르거나 적 위에 착지해 물리치세요.",
          "6단계마다 발판 높이와 적 수가 달라져요. 진행은 브라우저에 저장돼요.",
        ],
        controls: [
          "터치: 좌우 버튼을 누르고 이동하세요. 점프·공격 버튼을 누르면 실행해요.",
          "키보드: 좌우 이동, 위로 점프, Space 공격. 방향키를 놓으면 멈춰요.",
          "표준 게임패드: 스틱 이동, 방향패드 위로 점프, 기본 버튼 공격. 실제 기기는 미검증이에요.",
        ],
        tips: [
          "이동하며 점프해 발판 위 호박석을 모으세요.",
          "적을 바라보고 돌망치를 휘두르세요.",
          "부족한 호박석을 찾으러 되돌아갈 수 있어요.",
        ],
      },
    },
  },
  {
    ...shared,
    playModes: [...shared.playModes],
    id: "starlight-apprentice",
    category: "simulation",
    controlStyle: "pointer",
    color: "mint",
    duration: "5–12",
    stages: 1,
    inputs: ["touch", "mouse", "keyboard", "gamepad"],
    artwork: "/art/starlight-apprentice.svg",
    screenshot: "/art/screenshots/starlight-apprentice.png",
    tags: ["raising", "choices", "original", "육성", "선택"],
    text: {
      en: {
        title: "Starlight Apprentice",
        subtitle: "Twenty-four weeks. A life of your own.",
        description:
          "Guide a village apprentice through one season of lessons, work, exploration and rest. Balance energy and coins, earn festival rewards and discover seven possible career endings in an original raising simulation.",
        rules: [
          "Choose one activity per week for 24 weeks. Lessons cost three coins and twelve energy.",
          "Working earns ten coins; resting restores 35 energy and adds two care. Festivals reward a rotating skill every four weeks.",
          "Seven endings depend on your final skills, care and savings. There is no wrong life to choose.",
        ],
        controls: [
          "Tap an activity card to spend a week. Unavailable choices are dimmed.",
          "Keyboard: Tab and Enter operate activity cards; arrows select and Enter confirms.",
          "Gamepad: direction selects, primary button confirms. Physical devices unverified.",
        ],
        tips: [
          "Rest before energy runs low. Work funds your next lessons.",
          "Train all three skills for a balanced path, or specialize.",
          "Every fourth week rewards craft, wisdom or courage in that order.",
        ],
      },
      ko: {
        title: "별빛 수습생",
        subtitle: "스물네 주, 나만의 삶을 만들어요.",
        description:
          "한 계절 동안 마을 수습생의 수업·일·탐험·휴식을 선택하세요. 기력과 동전을 관리하고 축제 보상을 받아 일곱 가지 진로 결말을 만나보는 독자 육성 시뮬레이션이에요.",
        rules: [
          "24주 동안 매주 활동 하나를 선택해요. 수업에는 동전 3개와 기력 12가 필요해요.",
          "일하면 동전 10개, 쉬면 기력 35와 배려 2를 얻어요. 4주마다 축제에서 번갈아 능력에 따른 보상을 받아요.",
          "능력·배려·저축에 따라 일곱 가지 결말이 있어요. 잘못된 삶은 없어요.",
        ],
        controls: [
          "활동 카드를 누르면 한 주가 지나가요. 선택할 수 없는 활동은 흐리게 표시돼요.",
          "키보드: Tab·Enter로 카드 실행. 방향키로 선택하고 Enter로 확인할 수도 있어요.",
          "게임패드: 방향으로 선택, 기본 버튼으로 확인. 실제 기기는 미검증이에요.",
        ],
        tips: [
          "기력이 떨어지기 전에 쉬고 다음 수업을 위해 일하세요.",
          "세 능력을 고르게 키우거나 한 분야에 집중해 보세요.",
          "4주마다 손재주·지혜·용기 순으로 축제 보상이 주어져요.",
        ],
      },
    },
  },
  {
    ...shared,
    playModes: [...shared.playModes],
    id: "beacon-quest",
    category: "strategy",
    controlStyle: "directional",
    color: "coral",
    duration: "10–20",
    stages: 1,
    inputs: ["touch", "mouse", "keyboard", "gamepad"],
    artwork: "/art/beacon-quest.svg",
    screenshot: "/art/screenshots/beacon-quest.png",
    tags: ["RPG", "turn based", "original", "탐험", "턴제"],
    text: {
      en: {
        title: "Beacon Quest",
        subtitle: "Bring the lost paths home.",
        description:
          "A complete short, original turn-based expedition across three handcrafted valleys. Find keys, trade at workshops, fight shadows and light the final beacon. Every move saves locally.",
        rules: [
          "Use the four directions to explore. Find each key (⚿) and enter the gate (▣).",
          "Shadows start a turn-based battle. Strike deals full damage; Guard halves your attack but reduces incoming damage by three.",
          "Springs heal once. Tonics cost five coins; workshops upgrade attack for ten. Defeat the final sentinel before leaving the third valley.",
        ],
        controls: [
          "Tap direction or combat buttons. The world waits for your choice.",
          "Keyboard: arrows move; Enter or Space strikes. Tab reaches Guard, Tonic and Forge.",
          "Gamepad: directions move and primary button strikes. Physical devices unverified.",
        ],
        tips: [
          "Collect treasure before buying an upgrade.",
          "Save springs for when you are hurt.",
          "Guard and tonics can turn a dangerous battle around.",
        ],
      },
      ko: {
        title: "봉화의 길",
        subtitle: "잃어버린 길에 빛을 돌려주세요.",
        description:
          "직접 만든 세 계곡을 탐험하는 짧고 완결된 독자 턴제 RPG예요. 열쇠를 찾고 공방에서 무기를 강화하며 그림자를 물리쳐 마지막 봉화를 밝히세요. 움직임마다 저장돼요.",
        rules: [
          "네 방향으로 탐험하고 열쇠(⚿)를 찾아 문(▣)으로 가세요.",
          "그림자를 만나면 턴제 전투가 시작돼요. 공격은 온전한 피해를, 방어는 절반 공격과 받는 피해 3 감소를 제공해요.",
          "샘은 한 번 회복해 줘요. 회복약은 동전 5개, 공방 강화는 10개예요. 마지막 계곡에서는 수호자도 물리쳐야 해요.",
        ],
        controls: [
          "방향·전투 버튼을 누르세요. 선택하기 전에는 시간이 흐르지 않아요.",
          "키보드: 방향키 이동, Enter·Space 공격. Tab으로 방어·회복약·강화 버튼에 접근하세요.",
          "게임패드: 방향 이동, 기본 버튼 공격. 실제 기기는 미검증이에요.",
        ],
        tips: [
          "보물을 모아 무기를 강화하세요.",
          "샘은 다쳤을 때 이용하면 좋아요.",
          "방어와 회복약을 활용하면 어려운 전투도 이길 수 있어요.",
        ],
      },
    },
  },
];
