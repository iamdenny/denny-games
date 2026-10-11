export const deviceChecks = [
  {
    id: "start",
    title: { en: "Open and start", ko: "열기·시작" },
    steps: {
      en: "Open a game detail, start playing and confirm a board appears without an error.",
      ko: "게임 상세에서 플레이를 시작하고 오류 없이 게임판이 나타나는지 확인하세요.",
    },
  },
  {
    id: "input",
    title: { en: "Play and restart", ko: "조작·재시작" },
    steps: {
      en: "Use the listed touch, keyboard or controller controls to change the game, then restart. Record the input method above.",
      ko: "안내된 터치·키보드·패드로 게임 상태를 바꾸고 재시작하세요. 위에 사용한 입력 방식을 적으세요.",
    },
  },
  {
    id: "pause",
    title: { en: "Pause and resume", ko: "정지·복귀" },
    steps: {
      en: "Pause, wait, resume and verify the round continues. Hide and reopen the tab; it should wait for you to resume.",
      ko: "정지한 뒤 기다렸다 재개해 이어지는지 확인하세요. 탭을 숨겼다 돌아왔을 때 자동 정지 상태로 기다리는지 확인하세요.",
    },
  },
  {
    id: "disconnect",
    title: { en: "Controller disconnect", ko: "패드 연결 해제" },
    steps: {
      en: "With a physical controller in use, disconnect it and check that play pauses. Reconnect or switch to touch. Choose Not applicable if you have no controller.",
      ko: "실물 패드 사용 중 연결을 끊어 자동 정지하는지 확인하세요. 다시 연결하거나 터치로 전환하세요. 패드가 없으면 해당 없음을 선택하세요.",
    },
  },
  {
    id: "audio",
    title: { en: "Sound toggle", ko: "소리 전환" },
    steps: {
      en: "Enable sound after a gesture, trigger a game sound, mute it and check that it stops.",
      ko: "조작 후 소리를 켜고 게임 효과음을 발생시킨 뒤 음소거하면 멈추는지 확인하세요.",
    },
  },
  {
    id: "storage",
    title: { en: "Local save", ko: "로컬 저장" },
    steps: {
      en: "Save a favorite and reload. In original games, pause and reload to check progress. Imported games restart rounds and retain personal bests only.",
      ko: "즐겨찾기를 저장한 뒤 새로고침하세요. 자체 게임에서는 정지 후 새로고침해 진행 복원을 확인하세요. 가져온 게임은 라운드가 재시작되며 최고 점수만 저장합니다.",
    },
  },
  {
    id: "layout",
    title: { en: "Screen and rotation", ko: "화면·회전" },
    steps: {
      en: "Check that buttons remain reachable at your screen size and after rotating a phone. Do not rotate or operate a vehicle while moving.",
      ko: "화면 크기와 휴대폰 회전 후에도 버튼을 누를 수 있는지 확인하세요. 이동 중에는 차량 화면을 조작하지 마세요.",
    },
  },
  {
    id: "soak",
    title: { en: "20-minute play", ko: "20분 연속 플레이" },
    steps: {
      en: "Actually play for 20 minutes. Note crashes, stuck controls, excessive heat or sustained slowdowns. Leave Not tested if you did not run this check.",
      ko: "실제로 20분 동안 플레이하세요. 충돌·입력 고착·과열·지속적인 느려짐을 기록하세요. 실행하지 않았다면 미실행으로 두세요.",
    },
  },
] as const;
export type CheckResult = "not-tested" | "pass" | "fail" | "not-applicable";
export function makeDeviceReport(
  form: FormData,
  releaseSha: string | null,
  gameIds: readonly string[],
  now = new Date(),
) {
  const value = (key: string, max: number) =>
    String(form.get(key) ?? "").slice(0, max);
  const gameId = value("game", 100);
  if (!gameIds.includes(gameId)) throw new Error("game-required");
  const checks = Object.fromEntries(
    deviceChecks.map(({ id }) => {
      const result = value(id, 30);
      return [
        id,
        ["pass", "fail", "not-applicable"].includes(result)
          ? result
          : "not-tested",
      ];
    }),
  );
  return {
    schemaVersion: 1,
    source: "user-observation",
    certified: false,
    site: "https://games.iamdenny.com",
    checkedAt: now.toISOString(),
    releaseSha:
      releaseSha && /^[a-f0-9]{40}$/.test(releaseSha) ? releaseSha : null,
    gameId,
    environment: value("environment", 200),
    notes: value("notes", 1000),
    checks,
  };
}
