import { expect, it } from "vitest";
import { GET } from "../../src/pages/release.json";
import { adsterraReady } from "../../src/lib/adsterra";
it("release metadata reports configured advertising without claiming an impression", async () => {
  const release = await GET().json();
  expect(release.ads).toBe(adsterraReady() ? "adsterra-opt-in" : "off");
  expect(release.advertising.google).toBe("verification");
  expect(release.advertising.adsterra).toBe(
    adsterraReady() ? "consent-required" : "off",
  );
});
