import { adsterra } from "../data/adsterra";
const consentKey = "denny-games.adsterra-consent.v1";
export function adsterraReady(config = adsterra): boolean {
  return (
    config.enabled &&
    config.approved &&
    config.filtersConfirmed &&
    /^[a-f0-9]{32}$/.test(config.key) &&
    config.scriptUrl === `https://bauval.org/22/${config.key}`
  );
}
export function adsterraDocument(): string {
  if (!adsterraReady()) throw new Error("Adsterra placement is not ready");
  const options = JSON.stringify({
    key: adsterra.key,
    format: "iframe",
    height: 250,
    width: 300,
    params: {},
  });
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="referrer" content="no-referrer"><base href="https://bauval.org/"><style>html,body{margin:0;width:300px;height:250px;overflow:hidden}</style></head><body><script>window.atOptions=${options};</script><script src="${adsterra.scriptUrl}"></script></body></html>`;
}
export function initAdsterra(): void {
  if (!adsterraReady() || document.body.classList.contains("play-page")) return;
  const banners = [
    ...document.querySelectorAll<HTMLElement>("[data-adsterra]"),
  ];
  if (!banners.length) return;
  function resize(surface: HTMLElement) {
    const frame = surface.querySelector("iframe");
    if (!frame || surface.hidden) return;
    const scale = Math.min(1, surface.getBoundingClientRect().width / 300);
    frame.style.transformOrigin = "top left";
    frame.style.transform = `scale(${scale})`;
    surface.style.height = `${250 * scale}px`;
  }
  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) resize(entry.target as HTMLElement);
  });
  for (const banner of banners)
    observer.observe(
      banner.querySelector<HTMLElement>("[data-adsterra-surface]")!,
    );
  const eligibilityObserver = new MutationObserver((entries) => {
    if (entries.some((entry) => entry.attributeName === "hidden")) render();
  });
  let allowed = false;
  let denied = false;
  try {
    allowed = localStorage.getItem(consentKey) === "allowed";
    denied = localStorage.getItem(consentKey) === "denied";
  } catch {
    /* session choice works without storage */
  }
  function render() {
    for (const banner of banners) {
      const choice = banner.querySelector<HTMLElement>(
        "[data-adsterra-choice]",
      )!;
      const surface = banner.querySelector<HTMLElement>(
        "[data-adsterra-surface]",
      )!;
      const status = banner.querySelector<HTMLElement>(
        "[data-adsterra-status]",
      )!;
      const revoke = banner.querySelector<HTMLElement>(
        "[data-adsterra-revoke]",
      )!;
      const eligible = !banner.hidden;
      choice.hidden = allowed;
      banner.querySelector<HTMLElement>("[data-adsterra-declined]")!.hidden =
        !denied;
      surface.hidden = status.hidden = revoke.hidden = !allowed || !eligible;
      if (!allowed || !eligible) {
        surface.replaceChildren();
        continue;
      }
      if (surface.childElementCount) continue;
      const frame = document.createElement("iframe");
      frame.title =
        document.documentElement.lang === "ko"
          ? "Adsterra 광고"
          : "Adsterra advertisement";
      // A data URL has an opaque origin even with allow-same-origin. Never use srcdoc here.
      frame.sandbox.add(
        "allow-scripts",
        "allow-same-origin",
        "allow-popups",
        "allow-popups-to-escape-sandbox",
      );
      frame.referrerPolicy = "no-referrer";
      frame.setAttribute(
        "allow",
        "camera 'none'; microphone 'none'; geolocation 'none'",
      );
      frame.src = `data:text/html;charset=utf-8,${encodeURIComponent(adsterraDocument())}`;
      surface.append(frame);
      resize(surface);
    }
  }
  function setChoice(value: boolean) {
    allowed = value;
    denied = !value;
    try {
      localStorage.setItem(consentKey, value ? "allowed" : "denied");
    } catch {
      /* keep this page's choice */
    }
    render();
  }
  for (const banner of banners) {
    if (banner.hasAttribute("data-adsterra-category"))
      eligibilityObserver.observe(banner, {
        attributes: true,
        attributeFilter: ["hidden"],
      });
    banner
      .querySelector("[data-adsterra-allow]")
      ?.addEventListener("click", () => setChoice(true));
    banner
      .querySelector("[data-adsterra-deny]")
      ?.addEventListener("click", () => setChoice(false));
    banner
      .querySelector("[data-adsterra-revoke]")
      ?.addEventListener("click", () => setChoice(false));
  }
  window.addEventListener("storage", (event) => {
    if (event.key === consentKey || event.key === null) {
      allowed = event.key === consentKey && event.newValue === "allowed";
      denied = event.key === consentKey && event.newValue === "denied";
      render();
    }
  });
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    try {
      allowed = localStorage.getItem(consentKey) === "allowed";
      denied = localStorage.getItem(consentKey) === "denied";
    } catch {
      allowed = false;
    }
    render();
  });
  render();
}
