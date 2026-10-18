for (const root of document.querySelectorAll<HTMLElement>(
  "[data-share-link]",
)) {
  const button = root.querySelector<HTMLButtonElement>("[data-share-button]");
  const status = root.querySelector<HTMLElement>("[data-share-status]");
  const fallback = root.querySelector<HTMLDetailsElement>(
    "[data-share-fallback]",
  );
  const input = root.querySelector<HTMLInputElement>("[data-share-url]");
  const url = root.dataset.url;
  if (!button || !status || !fallback || !input || !url) continue;
  const ko = root.dataset.locale === "ko";
  button.hidden = false;
  button.addEventListener("click", async () => {
    button.disabled = true;
    status.textContent = "";
    try {
      if (navigator.share) {
        try {
          await navigator.share({ title: root.dataset.title, url });
          status.textContent = ko
            ? "공유 창을 열었습니다."
            : "Share sheet opened.";
          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError")
            return;
        }
      }
      try {
        if (!navigator.clipboard?.writeText)
          throw Error("clipboard-unavailable");
        await navigator.clipboard.writeText(url);
        status.textContent = ko ? "링크를 복사했습니다." : "Link copied.";
      } catch {
        fallback.open = true;
        input.focus();
        input.select();
        status.textContent = ko
          ? "아래 주소를 직접 복사해 주세요."
          : "Copy the address below.";
      }
    } finally {
      button.disabled = false;
    }
  });
}
