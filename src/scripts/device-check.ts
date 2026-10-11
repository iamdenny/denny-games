import { makeDeviceReport } from "../lib/device-check";
import { loadCatalogue } from "../lib/cards";
import type { Locale } from "../lib/types";
const locale = document.documentElement.lang as Locale;
const ko = locale === "ko";
const form = document.querySelector<HTMLFormElement>("#device-check-form")!;
const select = form.querySelector<HTMLSelectElement>("#device-game")!;
const download = form.querySelector<HTMLButtonElement>("#device-download")!;
const status = document.querySelector<HTMLElement>("#device-result")!;
let ids: string[] = [],
  releaseSha: string | null = null;
void loadCatalogue(locale)
  .then((games) => {
    ids = games.map((item) => item.id);
    for (const game of games) {
      const option = document.createElement("option");
      option.value = game.id;
      option.textContent = game.title;
      select.append(option);
    }
    const requested = new URL(location.href).searchParams.get("game");
    if (requested && ids.includes(requested)) select.value = requested;
    download.disabled = false;
  })
  .catch(() => {
    status.textContent = ko
      ? "게임 목록을 불러오지 못했어요. 새로고침해주세요."
      : "Could not load games. Please refresh.";
  });
void fetch("/release.json")
  .then(async (response) => {
    if (!response.ok) throw Error("release");
    const release = await response.json();
    if (/^[a-f0-9]{40}$/.test(release.sha)) releaseSha = release.sha;
  })
  .catch(() => {})
  .finally(() => {
    document.querySelector("#device-release")!.textContent = releaseSha
      ? `${ko ? "점검 대상 버전" : "Release to check"}: ${releaseSha.slice(0, 12)}`
      : ko
        ? "배포 버전을 확인하지 못했습니다. 결과에는 미확인으로 기록합니다."
        : "Release could not be read. The report will mark it as unknown.";
  });
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!ids.includes(select.value)) {
    status.textContent = ko
      ? "점검한 게임을 선택하세요."
      : "Choose the game you tested.";
    select.focus();
    return;
  }
  const report = makeDeviceReport(new FormData(form), releaseSha, ids);
  const blob = new Blob([JSON.stringify(report, null, 2) + "\n"], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob),
    link = document.createElement("a");
  link.href = url;
  link.download = `denny-games-device-check-${report.gameId}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent = ko
    ? "점검 결과 파일을 생성했습니다. 업로드하거나 공개 인증으로 등록하지 않았습니다."
    : "Your report was created locally. It was not uploaded or registered as verified compatibility.";
});
