import type { Game } from "./games";
const specs = [
  {
    id: "ember-maze",
    title: ["Ember Maze", "불씨 미로"],
    category: "action",
    tag: ["bomb maze", "local multiplayer", "폭탄 미로", "2인 대전"],
    subtitle: [
      "A small spark. A maze of chain reactions.",
      "작은 불씨가 만드는 연쇄 반응.",
    ],
    description: [
      "Six original bomb arenas with solo rivals or a same-device duel. Clear wooden crates, collect flame-range and bomb-capacity upgrades, and escape timed cross-shaped explosions.",
      "독창적인 폭탄 미로 여섯 곳에서 혼자 적을 상대하거나 같은 기기에서 둘이 대결하세요. 상자를 부수고 폭발 범위·폭탄 수 아이템을 모아 십자 폭발을 피하세요.",
    ],
    rules: [
      [
        "Bombs explode after about two seconds. Stone blocks stop blasts; wooden crates break and stop that blast ray.",
        "Flames ignite other bombs immediately. Gold upgrades extend range; mint upgrades increase simultaneous bombs.",
        "Solo: survive until every rival is eliminated. Local: the final survivor wins. A 180-second limit ends an unfinished round.",
      ],
      [
        "폭탄은 약 2초 뒤 터져요. 돌벽은 폭발을 막고, 나무 상자는 부서지면서 그 방향 폭발을 막아요.",
        "불길에 닿은 폭탄은 바로 터져요. 황금 아이템은 범위를, 민트 아이템은 동시에 놓는 폭탄 수를 늘려요.",
        "혼자서는 모든 적을 없애고 살아남으세요. 둘이서는 마지막 생존자가 승리해요. 180초가 지나면 미완료 판은 끝나요.",
      ],
    ],
    tips: [
      [
        "Find a turn before planting your first bomb.",
        "A chain reaction can make a long timer explode early.",
      ],
      [
        "폭탄을 놓기 전에 꺾어 피할 길부터 찾으세요.",
        "연쇄 폭발은 남은 시간을 기다리지 않아요.",
      ],
    ],
    action: ["Space drops a bomb.", "Space로 폭탄을 놓아요."],
  },
  {
    id: "frost-patrol",
    title: ["Frost Patrol", "서리 순찰대"],
    category: "action",
    tag: ["snowball", "co-op", "platformer", "눈덩이", "협동"],
    subtitle: [
      "Freeze. Kick. Clear the snowy ridge.",
      "얼리고, 굴리고, 설원을 지켜요.",
    ],
    description: [
      "Patrol six original platform arenas alone or with a same-device partner. Freeze roaming creatures with three snow shots, then kick a snowball into the crowd for a chain takedown.",
      "혼자 또는 같은 기기의 친구와 여섯 플랫폼 경기장을 순찰하세요. 눈 세 발로 돌아다니는 적을 얼리고, 눈덩이를 굴려 다른 적까지 연달아 물리치세요.",
    ],
    rules: [
      [
        "Three snow shots fully freeze a creature. Stand close and fire again to kick it into a rolling snowball.",
        "Rolling snowballs defeat creatures they touch and vanish after a short roll. Unkicked snowballs thaw after five seconds.",
        "Clear every creature before 180 seconds. Each player has three hearts; co-op continues while either player survives.",
      ],
      [
        "눈 세 발을 맞히면 적이 완전히 얼어요. 가까이 서서 다시 발사하면 눈덩이를 굴려요.",
        "굴러가는 눈덩이는 닿는 적을 쓰러뜨리고 잠시 후 사라져요. 굴리지 않은 적은 5초 뒤 녹아요.",
        "180초 안에 모든 적을 없애세요. 각 플레이어는 체력 세 칸이며 협동에서는 한 명이라도 살아 있으면 계속돼요.",
      ],
    ],
    tips: [
      [
        "Jump toward overlapping platform edges to climb the arena.",
        "Freeze a group before kicking for a chain takedown.",
      ],
      [
        "겹치는 발판 가장자리로 점프하며 올라가세요.",
        "여러 적을 얼린 뒤 굴리면 연달아 처치하기 좋아요.",
      ],
    ],
    action: [
      "Up jumps; Space throws snow or kicks a nearby frozen foe.",
      "위쪽으로 점프하고 Space로 눈을 던지거나 가까운 얼어붙은 적을 굴려요.",
    ],
  },
  {
    id: "crater-duel",
    title: ["Crater Duel", "분화구 결투"],
    category: "shooting",
    tag: ["artillery", "turn-based", "local multiplayer", "포격", "턴제"],
    subtitle: ["Read the wind. Leave your mark.", "바람을 읽고 지형을 바꿔요."],
    description: [
      "A turn-based artillery duel across six original terrain profiles. Adjust angle and power, account for wind and carve craters with each shot. Play against the computer or take turns with a friend.",
      "여섯 독창적인 지형에서 벌이는 턴제 포격 결투예요. 각도와 세기를 조절하고 바람을 고려해 매 발마다 분화구를 만드세요. 컴퓨터를 상대하거나 친구와 번갈아 플레이해요.",
    ],
    rules: [
      [
        "Adjust elevation from 15 to 85 degrees and power from 200 to 500. Wind accelerates shells sideways.",
        "Explosions damage nearby turrets and remove terrain. Each turret starts with 100 health; destroying the opponent ends the duel.",
        "Solo pits you against a computer gunner. Local mode is pass-and-play: both players use the same controls on their turn.",
      ],
      [
        "각도는 15~85도, 세기는 200~500으로 조절해요. 바람은 포탄을 옆으로 밀어요.",
        "폭발은 가까운 포대에 피해를 주고 지형을 파내요. 체력 100으로 시작하고 상대 포대를 무너뜨리면 끝나요.",
        "혼자서는 컴퓨터 포수와 대결해요. 둘이서는 자신의 차례에 같은 조작을 사용하는 번갈아 플레이 방식이에요.",
      ],
    ],
    tips: [
      [
        "Use the short dotted aiming guide to see your initial direction.",
        "Watch where the first shell lands, then change only angle or power.",
      ],
      [
        "짧은 점선으로 처음 날아가는 방향을 확인하세요.",
        "첫 포탄의 착탄 지점을 보고 각도나 세기 중 하나씩 바꿔 보세요.",
      ],
    ],
    action: [
      "Left/right adjust angle; up/down adjust power; Space fires.",
      "좌우로 각도, 위아래로 세기를 조절하고 Space로 발사해요.",
    ],
  },
  {
    id: "iron-bastion",
    title: ["Iron Bastion", "강철 보루"],
    category: "shooting",
    tag: ["tank", "base defense", "co-op", "탱크", "기지 방어"],
    subtitle: [
      "Hold the line. Keep the beacon alive.",
      "방어선을 지키고 봉화를 밝혀요.",
    ],
    description: [
      "Defend a beacon in six original tank-defense maps, alone or in same-device co-op. Destroy incoming raiders, open brick-wall firing lanes and collect repair kits before the base falls.",
      "혼자 또는 같은 기기 협동으로 여섯 독창적인 탱크 방어 지형의 봉화를 지키세요. 몰려오는 적을 막고 벽돌을 부숴 사격로를 만들며 수리 상자를 모으세요.",
    ],
    rules: [
      [
        "Protect the four-hit beacon while defeating every tank in the stage. Later stages send more raiders with stronger armor.",
        "Brick walls break under fire; steel blocks remain. Repair kits restore one player heart and one beacon hit, up to their starting limits.",
        "Each player has three hearts. Lose when the beacon falls or no player remains; co-op shares the same defense objective.",
      ],
      [
        "네 번의 피해를 견디는 봉화를 지키며 모든 적 탱크를 격파하세요. 뒤 스테이지에서는 더 많고 튼튼한 적이 와요.",
        "벽돌은 포탄에 부서지고 철벽은 남아요. 수리 상자는 플레이어 체력과 봉화 내구도를 한 칸씩 처음 한도까지 회복해요.",
        "각 플레이어는 체력 세 칸이에요. 봉화가 무너지거나 플레이어가 모두 쓰러지면 패배하며 협동은 같은 봉화를 지켜요.",
      ],
    ],
    tips: [
      [
        "Cover the center approach before chasing a distant raider.",
        "Opening every wall also opens lines for enemy shells.",
      ],
      [
        "멀리 있는 적을 쫓기 전에 중앙 진입로를 지키세요.",
        "벽을 모두 부수면 적 포탄의 길도 열려요.",
      ],
    ],
    action: [
      "Arrows move and aim; Space fires.",
      "방향키로 이동·조준하고 Space로 발사해요.",
    ],
  },
] as const;
export const retroAGames: Game[] = specs.map((v) => ({
  id: v.id,
  category: v.category,
  controlStyle: "directional",
  duration: "2–6",
  color: "gold",
  version: 1,
  stages: 6,
  tags: [...v.tag],
  inputs: ["touch", "mouse", "keyboard"],
  license: "MIT",
  licenseAppliesToGame: true,
  licenseUrl: "https://github.com/iamdenny/denny-games/blob/main/LICENSE",
  licenseDescription: {
    en: "Original rules, TypeScript, vector artwork and rendering by Denny Games.",
    ko: "규칙·TypeScript·벡터 그림·화면은 데니 게임즈가 직접 만들었어요.",
  },
  author: "Denny Games",
  source: `https://github.com/iamdenny/denny-games/tree/main/src/games/${v.id}`,
  playModes: ["single-player", "multi-player"],
  added: "2026-10-23",
  artwork: `/art/${v.id}.svg`,
  screenshot: `/art/screenshots/${v.id}.png`,
  text: {
    en: {
      title: v.title[0],
      searchTitle: `${v.title[0]} — Free Browser Arcade Game`,
      subtitle: v.subtitle[0],
      description: v.description[0],
      rules: [...v.rules[0]],
      controls: [
        v.action[0],
        "Touch or mouse: hold the labeled on-screen direction and action buttons.",
        "Choose Solo or Local 2 players in settings before starting. To change mode later, restart first. P2 uses WASD and F; artillery players can share P1 controls.",
        "Stage progress is saved in this browser. Pause, reload and language changes preserve the current round. Physical devices have not been verified.",
      ],
      tips: [...v.tips[0]],
    },
    ko: {
      title: v.title[1],
      searchTitle: `${v.title[1]} — 무료 브라우저 아케이드 게임`,
      subtitle: v.subtitle[1],
      description: v.description[1],
      rules: [...v.rules[1]],
      controls: [
        v.action[1],
        "터치·마우스: 화면의 방향·행동 버튼을 길게 누르세요.",
        "시작 전 설정에서 혼자 또는 같은 기기 2명을 고르세요. 이후 모드를 바꾸려면 먼저 다시 시작하세요. P2는 WASD와 F를 쓰고, 포격 게임은 P1 조작을 함께 써도 돼요.",
        "진행은 이 브라우저에 저장돼요. 일시정지·새로고침·언어 변경 때 현재 판을 유지해요. 실제 기기 검증은 아직입니다.",
      ],
      tips: [...v.tips[1]],
    },
  },
}));
