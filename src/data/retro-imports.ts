import type { Game } from "./games";
export const retroImports: Game[] = (["neverball", "neverputt"] as const).map(
  (id) => ({
    id,
    category: "sports",
    controlStyle: "pointer",
    color: "mint",
    imported: true,
    internalScore: true,
    duration: "5–20",
    version: 1,
    stages: 1,
    tags: ["classic", "3D", "고전", "구슬", "골프"],
    inputs: ["touch", "mouse", "keyboard"],
    license: "GPL-2.0-or-later / GPL-3.0 / font exceptions",
    author: "Neverball contributors",
    source:
      "https://github.com/Neverball/neverball/tree/b1a383a7cfc739ea165ce77fdd41268cd37ca5e5",
    licenseUrl: "/licenses/neverball/NOTICE.txt",
    added: "2026-10-22",
    artwork: `/art/${id}.svg`,
    screenshot: `/art/screenshots/${id}.png`,
    playModes: ["single-player"],
    licenseDescription: {
      en: "Engine and base assets retain GPL notices and font exceptions. The pinned corresponding source archive and host changes are in vendor/neverball in the Denny Games repository. Audio is omitted.",
      ko: "엔진·기본 자산의 GPL 고지와 폰트 예외를 유지합니다. 대응 소스 압축파일과 호스트 수정은 Denny Games 저장소 vendor/neverball에 있습니다. 음향은 제외합니다.",
    },
    text: {
      en: {
        title: id === "neverball" ? "Neverball" : "Neverputt",
        subtitle:
          id === "neverball"
            ? "Tilt the world. Find your balance."
            : "Line up a miniature world.",
        description:
          id === "neverball"
            ? "The open-source 3D rolling-ball classic, hosted locally with its official 25-map easy set. Collect coins, open the goal and balance along the course. About 33 MB on first load."
            : "The open-source miniature-golf classic, hosted locally with its official 18-hole course. Aim, set power and guide the ball to each cup. About 33 MB on first load.",
        rules:
          id === "neverball"
            ? [
                "Choose Play and a level in the game menu.",
                "Tilt the floor to collect enough coins and open the goal before time runs out.",
                "Completed-course records are saved locally; an unfinished attempt restarts after reload.",
              ]
            : [
                "Choose Play and the course in the game menu.",
                "Aim toward the cup, set shot power, and try to finish with fewer strokes.",
                "Preferences save locally. Round scores and unfinished rounds are not restored after reload.",
              ],
        controls:
          id === "neverball"
            ? [
                "Mouse or touch: use the original game menu; drag the playing surface to tilt.",
                "Keyboard: arrows navigate menus and tilt; Enter selects. Escape pauses the Denny Games player.",
                "The original interface is retained. Mobile browsers and physical devices need additional testing.",
              ]
            : [
                "Mouse or touch: select the course, aim and set the shot using the original controls.",
                "Keyboard: arrows and Enter navigate menus. Escape pauses the player.",
                "The original interface is retained. Mobile browsers and physical devices need additional testing.",
              ],
        tips: [
          "Start with the first course to learn the original controls.",
          "Use the player Pause button before leaving the page.",
          "Add-on downloads and original audio are disabled.",
        ],
      },
      ko: {
        title: id === "neverball" ? "네버볼" : "네버퍼트",
        subtitle:
          id === "neverball"
            ? "세상을 기울여, 균형을 찾으세요."
            : "작은 코스에 담긴 정교한 한 타.",
        description:
          id === "neverball"
            ? "공개 소스 3D 구슬 게임을 공식 쉬운 코스 25개와 함께 직접 제공합니다. 동전을 모아 출구를 열고 균형을 잡아 도착하세요. 최초 다운로드는 약 33 MB입니다."
            : "공개 소스 미니골프를 공식 18홀 코스와 함께 직접 제공합니다. 방향과 힘을 조절해 공을 홀로 보내세요. 최초 다운로드는 약 33 MB입니다.",
        rules:
          id === "neverball"
            ? [
                "원작 메뉴에서 Play와 레벨을 고르세요.",
                "바닥을 기울여 필요한 동전을 모으고 제한시간 안에 출구에 도착하세요.",
                "완료 코스 기록은 브라우저에 저장됩니다. 진행 중인 시도는 새로고침하면 다시 시작해요.",
              ]
            : [
                "원작 메뉴에서 Play와 코스를 고르세요.",
                "홀을 향해 조준하고 힘을 조절해 적은 타수로 마무리하세요.",
                "설정은 저장됩니다. 라운드 점수와 진행 중인 라운드는 새로고침 후 복원되지 않아요.",
              ],
        controls:
          id === "neverball"
            ? [
                "마우스·터치: 원작 메뉴를 선택하고 게임 화면을 드래그해 기울이세요.",
                "키보드: 방향키로 메뉴 선택·기울이기, Enter 확인. Escape로 플레이어를 일시정지해요.",
                "원작 화면을 유지합니다. 모바일 브라우저와 실제 기기는 추가 검증이 필요해요.",
              ]
            : [
                "마우스·터치: 코스를 선택하고 원작 조작으로 방향과 샷의 힘을 정하세요.",
                "키보드: 방향키·Enter로 메뉴를 선택해요. Escape는 일시정지예요.",
                "원작 화면을 유지합니다. 모바일 브라우저와 실제 기기는 추가 검증이 필요해요.",
              ],
        tips: [
          "첫 코스에서 원작 조작법을 익혀 보세요.",
          "페이지를 떠나기 전에 플레이어 일시정지를 누르세요.",
          "추가 콘텐츠 다운로드와 원작 음향은 비활성화했어요.",
        ],
      },
    },
  }),
);
