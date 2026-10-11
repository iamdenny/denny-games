import { ads } from "../data/ads";
export type AdOutcome = "completed" | "dismissed" | "failed" | "not-ready";
export type AdBreak = (options: {
  type: "next";
  name: string;
  beforeAd: () => void;
  afterAd: () => void;
  adBreakDone: (placement: { breakStatus: string }) => void;
}) => void;
declare global {
  interface Window {
    adBreak?: AdBreak;
    adsbygoogle?: unknown[];
    dennyCmp?: { certified: boolean; canRequestAds: () => boolean };
  }
}
export function canServe(consent: boolean, config = ads): boolean {
  return (
    config.mode === "live" &&
    config.approved &&
    config.cmpCertified &&
    config.hostingApproved &&
    /^ca-pub-\d+$/.test(config.publisher) &&
    consent
  );
}
export function eligibleBreak(
  rounds: number,
  now: number,
  last: number,
  vehicle: boolean,
): boolean {
  return rounds >= 2 && now - last >= 180000 && !vehicle;
}
export async function requestBreak(
  api: AdBreak | undefined,
  before: () => void,
  after: () => void,
): Promise<AdOutcome> {
  if (!api) return "not-ready";
  return new Promise((resolve) => {
    let finished = false,
      afterCalled = false;
    const finishAfter = () => {
      if (!afterCalled) {
        afterCalled = true;
        after();
      }
    };
    const done = (outcome: AdOutcome) => {
      if (!finished) {
        finished = true;
        finishAfter();
        resolve(outcome);
      }
    };
    try {
      api({
        type: "next",
        name: "between-rounds",
        beforeAd: before,
        afterAd: finishAfter,
        adBreakDone: (placement) =>
          done(placement.breakStatus === "viewed" ? "completed" : "dismissed"),
      });
    } catch {
      done("failed");
    }
  });
}
let sdk: Promise<boolean> | undefined;
function consentGranted(): boolean {
  try {
    return (
      window.dennyCmp?.certified === true && window.dennyCmp.canRequestAds()
    );
  } catch {
    return false;
  }
}
function loadSdk(): Promise<boolean> {
  sdk ??= new Promise((resolve) => {
    const script = document.createElement("script");
    script.dataset.adLoader = "";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.adClient = ads.publisher;
    script.dataset.adFrequencyHint = "180s";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ads.publisher}`;
    // This timeout only covers script loading, before an ad API exists or an ad can play.
    const timeout = setTimeout(() => resolve(false), 10000);
    script.onload = () => {
      clearTimeout(timeout);
      resolve(true);
    };
    script.onerror = () => {
      clearTimeout(timeout);
      resolve(false);
    };
    document.head.append(script);
  });
  return sdk;
}
export async function initH5Ads(): Promise<void> {
  const vehicle =
    /Tesla/i.test(navigator.userAgent) ||
    document.body.classList.contains("large-screen");
  if (!ads.h5Approved || vehicle || !canServe(consentGranted())) {
    window.adBreak = undefined;
    return;
  }
  if (!(await loadSdk()) || !canServe(consentGranted())) return;
  window.adBreak = (options) => {
    (window.adsbygoogle ??= []).push(options);
  };
  (window.adsbygoogle ??= []).push({ preloadAdBreaks: "on", sound: "off" });
}
export function initDisplayAds(): void {
  if (!canServe(consentGranted())) return;
  const slots = [
    ...document.querySelectorAll<HTMLElement>("[data-ad-slot]"),
  ].filter((slot) => ads.slots[slot.dataset.adSlot ?? ""]);
  if (!slots.length) return;
  void loadSdk();
  for (const slot of slots) {
    const id = ads.slots[slot.dataset.adSlot ?? ""];
    if (!id || slot.dataset.initialized) continue;
    slot.dataset.initialized = "true";
    slot.hidden = false;
    const ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.display = "block";
    ins.dataset.adClient = ads.publisher;
    ins.dataset.adSlot = id;
    ins.dataset.adFormat = "auto";
    ins.dataset.fullWidthResponsive = "true";
    slot.append(ins);
    (window.adsbygoogle ??= []).push({});
  }
}
