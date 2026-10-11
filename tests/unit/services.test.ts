import { describe, it, expect } from "vitest";
import { read, write } from "../../src/lib/storage";
import { canServe, eligibleBreak, requestBreak } from "../../src/lib/ads";
import { ads } from "../../src/data/ads";
import { paginate, search } from "../../src/lib/catalogue";
describe("storage", () => {
  it("corrupt or denied storage does not stop play and retains in-memory progress", () => {
    const store = {
      getItem: () => "{broken",
      setItem: () => {
        throw Error("quota");
      },
    };
    expect(read("test", 23, store)).toBe(23);
    expect(write("test", 42, store)).toBe(false);
    expect(read("test", 23, store)).toBe(42);
  });
});
describe("advertising", () => {
  it("requires every serving gate and explicit consent", () => {
    const live = {
      ...ads,
      mode: "live" as const,
      approved: true,
      cmpCertified: true,
      hostingApproved: true,
      publisher: "ca-pub-1234567890",
    };
    expect(canServe(true)).toBe(false);
    expect(canServe(false, live)).toBe(false);
    expect(canServe(true, live)).toBe(true);
    for (const gate of ["approved", "cmpCertified", "hostingApproved"] as const)
      expect(canServe(true, { ...live, [gate]: false })).toBe(false);
  });
  it("limits frequency and disables vehicle opportunities", () => {
    expect(eligibleBreak(2, 180000, 0, false)).toBe(true);
    expect(eligibleBreak(1, 180000, 0, false)).toBe(false);
    expect(eligibleBreak(2, 179999, 0, false)).toBe(false);
    expect(eligibleBreak(2, 180000, 0, true)).toBe(false);
  });
  it("ad blocker, SDK error and no-fill recover without resuming gameplay", async () => {
    let after = 0,
      before = 0;
    expect(
      await requestBreak(
        undefined,
        () => before++,
        () => after++,
      ),
    ).toBe("not-ready");
    expect(before).toBe(0);
    expect(
      await requestBreak(
        () => {
          throw Error("sdk");
        },
        () => before++,
        () => after++,
      ),
    ).toBe("failed");
    expect(after).toBe(1);
    expect(
      await requestBreak(
        (options) => options.adBreakDone({ breakStatus: "noAdPreloaded" }),
        () => before++,
        () => after++,
      ),
    ).toBe("dismissed");
    expect(after).toBe(2);
  });
  it("playing ad has no watchdog and after callback is idempotent", async () => {
    let after = 0;
    expect(
      await requestBreak(
        (options) => {
          options.beforeAd();
          options.afterAd();
          options.adBreakDone({ breakStatus: "viewed" });
          options.adBreakDone({ breakStatus: "viewed" });
        },
        () => {},
        () => after++,
      ),
    ).toBe("completed");
    expect(after).toBe(1);
  });
});
it("1,000 entries paginate without loss and search works in both languages", () => {
  const items = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    title: `Game ${i}`,
    description: i % 2 ? "회로 퍼즐" : "arcade",
    tags: ["daily"],
  }));
  const collected = Array.from({ length: 42 }, (_, i) =>
    paginate(items, i + 1),
  ).flat();
  expect(collected).toEqual(items);
  expect(search(items, "회로 DAILY")).toHaveLength(500);
  expect(search(items, "Game 999")[0]?.id).toBe(999);
  expect(paginate(items, 0)).toEqual([]);
});
