const measurementId = "G-5NZLTVBG5Y";
const consentKey = "denny-games.analytics-consent";
const disabledKey = `ga-disable-${measurementId}`;
const cookiePrefix = "dennygames";

type Consent = "granted" | "denied" | null;
declare global {
  interface Window {
    dataLayer?: IArguments[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;
let activeGame: string | null = null;

function readConsent(): Consent {
  try {
    const value = localStorage.getItem(consentKey);
    return value === "granted-v2"
      ? "granted"
      : value === "denied"
        ? "denied"
        : null;
  } catch {
    return null;
  }
}

function saveConsent(value: Exclude<Consent, null>): boolean {
  try {
    localStorage.setItem(
      consentKey,
      value === "granted" ? "granted-v2" : value,
    );
    return true;
  } catch {
    return false;
  }
}

function clearAnalyticsCookies(): void {
  const names = document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("=", 1)[0] ?? "")
    .filter((name) => name.startsWith(cookiePrefix));

  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure`;
    document.cookie = `${name}=; Max-Age=0; Path=/; Domain=games.iamdenny.com; SameSite=Lax; Secure`;
  }
}

function sanitizedReferrer(): string {
  if (!document.referrer) return "";
  try {
    return new URL(document.referrer).origin;
  } catch {
    return "";
  }
}

function startAnalytics(): void {
  const win = window;
  if (initialized) return;
  initialized = true;
  (win as unknown as Record<string, unknown>)[disabledKey] = false;
  win.dataLayer ??= [];
  win.gtag ??= function () {
    win.dataLayer!.push(arguments);
  };
  win.gtag("js", new Date());
  win.gtag("config", measurementId, {
    page_location: `${location.origin}${location.pathname}`,
    page_referrer: sanitizedReferrer(),
    page_title: document.title,
    cookie_domain: "games.iamdenny.com",
    cookie_prefix: cookiePrefix,
    cookie_expires: 60 * 24 * 60 * 60,
    cookie_update: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  if (
    location.protocol === "https:" &&
    location.hostname === "games.iamdenny.com"
  ) {
    const script = document.createElement("script");
    script.async = true;
    script.dataset.googleAnalytics = measurementId;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.append(script);
  }
}

function stopAnalytics(): void {
  activeGame = null;
  (window as unknown as Record<string, unknown>)[disabledKey] = true;
  document
    .querySelectorAll<HTMLScriptElement>("script[data-google-analytics]")
    .forEach((script) => script.remove());
  clearAnalyticsCookies();
  initialized = false;
}

export function initAnalytics(): void {
  const panel = document.querySelector<HTMLElement>("[data-analytics-consent]");
  if (!panel) return;

  const message = panel.querySelector<HTMLElement>(
    "[data-analytics-consent-message]",
  );
  const allow = panel.querySelector<HTMLButtonElement>(
    "[data-analytics-allow]",
  );
  const deny = panel.querySelector<HTMLButtonElement>("[data-analytics-deny]");
  if (!allow || !deny) return;

  const locale = document.documentElement.lang;
  const showStorageError = () => {
    if (message) {
      message.textContent =
        locale === "ko"
          ? "이 브라우저에 선택을 저장할 수 없어 분석은 시작하지 않았어요. 브라우저 저장 설정을 확인해 주세요."
          : "Analytics stayed off because this browser could not save your choice. Check its storage settings and try again.";
    }
  };

  const choose = (choice: Exclude<Consent, null>) => {
    if (!saveConsent(choice)) {
      if (choice === "granted") {
        showStorageError();
        return;
      }
      stopAnalytics();
    } else if (choice === "granted") {
      startAnalytics();
    } else {
      stopAnalytics();
    }
    panel.hidden = true;
  };

  allow.addEventListener("click", () => choose("granted"));
  deny.addEventListener("click", () => choose("denied"));

  document
    .querySelectorAll<HTMLButtonElement>("[data-analytics-consent-open]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        panel.hidden = false;
        panel.scrollIntoView({ block: "nearest" });
        allow.focus();
      });
    });

  window.addEventListener("storage", (event) => {
    if (event.key !== consentKey && event.key !== null) return;
    const nextConsent = readConsent();
    panel.hidden = nextConsent !== null;
    if (nextConsent === "granted") startAnalytics();
    else stopAnalytics();
  });

  const consent = readConsent();
  panel.hidden = consent !== null;
  if (consent === "granted") startAnalytics();
  else stopAnalytics();
}

/** Only the shell's actual start/end lifecycle can contribute aggregate counts. */
export function trackGameAnalytics(event: string, game: string): void {
  if (event === "restart" || event === "load" || event === "load_error") {
    activeGame = null;
    return;
  }
  if (!initialized || readConsent() !== "granted") {
    activeGame = null;
    return;
  }
  const player = document.querySelector<HTMLElement>("#player");
  if (!player || player.dataset.id !== game || !/^[a-z0-9-]{1,80}$/.test(game))
    return;
  if (event === "start") {
    if (activeGame === game) return;
    activeGame = game;
  } else if (event === "end") {
    if (activeGame !== game) return;
    activeGame = null;
  } else return;
  window.gtag?.("event", event === "start" ? "game_start" : "game_complete", {
    send_to: measurementId,
    game_id: game,
    page_location: `${location.origin}${location.pathname}`,
    page_referrer: sanitizedReferrer(),
  });
}
