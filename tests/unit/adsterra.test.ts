import { describe, expect, it } from "vitest";
import { adsterra } from "../../src/data/adsterra";
import { adsterraReady } from "../../src/lib/adsterra";
describe("Adsterra release gates", () => {
  it("requires approval, filters and exact issued script", () => {
    const ready = {
      ...adsterra,
      enabled: true,
      approved: true,
      filtersConfirmed: true,
    };
    expect(adsterraReady(ready)).toBe(true);
    for (const key of ["enabled", "approved", "filtersConfirmed"] as const)
      expect(adsterraReady({ ...ready, [key]: false })).toBe(false);
    expect(
      adsterraReady({ ...ready, scriptUrl: "https://attacker.example/ad.js" }),
    ).toBe(false);
    expect(adsterraReady({ ...ready, key: 'bad"<script>' })).toBe(false);
  });
});
