import { ads } from "../data/ads";
import { adsterra } from "../data/adsterra";
import { adsterraReady } from "../lib/adsterra";
import { version } from "../../package.json";
export function GET() {
  return new Response(
    JSON.stringify({
      sha: process.env.GITHUB_SHA ?? "local",
      version,
      builtAt: new Date().toISOString(),
      locales: ["en", "ko"],
      ads: adsterraReady() ? "adsterra-opt-in" : "off",
      advertising: {
        google: ads.mode,
        adsterra: adsterraReady() ? "consent-required" : "off",
        adsterraUnit: adsterra.unitId,
      },
    }),
    { headers: { "Content-Type": "application/json" } },
  );
}
