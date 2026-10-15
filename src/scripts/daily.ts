import { dailyHistory, dailyRounds, utcDay } from "../lib/daily";
const locale = document.documentElement.lang === "ko" ? "ko" : "en";
const ko = locale === "ko";
for (const root of document.querySelectorAll<HTMLElement>(
  "[data-daily-board]",
)) {
  const entries = JSON.parse(root.dataset.entries!) as {
    id: string;
    version: number;
  }[];
  let renderedDay = "";
  const render = () => {
    const now = new Date();
    renderedDay = utcDay(now);
    const rounds = dailyRounds(now);
    const complete = entries.filter(
      ({ id, version }) => rounds[id]?.version === version,
    ).length;
    const date = root.querySelector<HTMLElement>("[data-daily-date]")!;
    const time = date.querySelector<HTMLTimeElement>("time")!;
    time.textContent = utcDay(now);
    time.dateTime = utcDay(now);
    date.hidden = false;
    const progress = root.querySelector<HTMLElement>("[data-daily-progress]")!;
    progress.textContent =
      complete === entries.length
        ? ko
          ? `오늘의 ${entries.length}판 완료! 내일 새 판에서 만나요.`
          : `All ${entries.length} rounds complete! New challenges tomorrow.`
        : ko
          ? `오늘 ${complete} / ${entries.length}판 완료`
          : `Today: ${complete} / ${entries.length} rounds complete`;
    progress.hidden = false;
    const history = dailyHistory(now);
    const historyList = root.querySelector<HTMLOListElement>(
      "[data-daily-history]",
    )!;
    const historySummary = root.querySelector<HTMLElement>(
      "[data-daily-history-summary]",
    )!;
    let historyTotal = 0;
    historyList.replaceChildren(
      ...history.map(({ date: historyDate, results: historyResults }) => {
        const completed = entries.filter(
          ({ id, version }) => historyResults[id]?.version === version,
        ).length;
        historyTotal += completed;
        const dateValue = new Date(`${historyDate}T00:00:00.000Z`);
        const item = document.createElement("li");
        item.dataset.historyDay = historyDate;
        item.setAttribute(
          "aria-label",
          ko
            ? `${historyDate}: ${completed} / ${entries.length}판 완료`
            : `${historyDate}: ${completed} of ${entries.length} challenges completed`,
        );
        const day = document.createElement("time");
        day.dateTime = historyDate;
        day.textContent = `${new Intl.DateTimeFormat(locale, {
          weekday: "short",
          timeZone: "UTC",
        }).format(dateValue)} ${Number(historyDate.slice(-2))}`;
        const count = document.createElement("span");
        count.className = "history-count";
        count.textContent = `${completed}/${entries.length}`;
        item.append(day, count);
        return item;
      }),
    );
    historySummary.textContent = ko
      ? `최근 7일 ${historyTotal} / ${history.length * entries.length}판 완료`
      : `Last 7 days: ${historyTotal} / ${history.length * entries.length} completed`;
    historyList.hidden = false;
    historySummary.hidden = false;
    for (const { id, version } of entries) {
      const card = root.querySelector<HTMLElement>(`[data-daily-card="${id}"]`);
      if (!card) continue;
      const record = rounds[id]?.version === version ? rounds[id] : undefined;
      card.dataset.complete = String(Boolean(record));
      const note = card.querySelector<HTMLElement>("[data-daily-record]")!;
      note.textContent = record
        ? ko
          ? `✓ 한 판 완료 · 오늘 최고 ${Math.floor(record.score).toLocaleString(locale)}점`
          : `✓ Round complete · Today's best: ${Math.floor(record.score).toLocaleString(locale)}`
        : ko
          ? "아직 완료한 판이 없어요."
          : "No completed round yet.";
      note.hidden = false;
      const link = card.querySelector<HTMLAnchorElement>("[data-daily]")!;
      link.textContent = record
        ? ko
          ? "오늘 기록에 재도전 ↗"
          : "Try today's challenge again ↗"
        : ko
          ? "오늘의 도전 ↗"
          : "Daily challenge ↗";
    }
  };
  render();
  window.addEventListener("pageshow", render);
  window.addEventListener("storage", render);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) render();
  });
  // A foreground page also rolls over without requiring navigation.
  window.setInterval(() => {
    if (utcDay() !== renderedDay) render();
  }, 60_000);
}
