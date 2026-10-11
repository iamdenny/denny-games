import { expect, it } from "vitest";
import { affiliateReady, coupang } from "../../src/data/affiliate";
it("affiliate publication requires registered channel, hosting decision and issued HTTPS link", () => {
  expect(affiliateReady()).toBe(true);
  expect(affiliateReady({ ...coupang, enabled: false })).toBe(false);
  const ready = {
    ...coupang,
    enabled: true,
    channelRegistered: true,
    hostingApproved: true,
    url: "https://link.coupang.com/a/example",
  };
  expect(affiliateReady(ready)).toBe(true);
  for (const gate of [
    "enabled",
    "channelRegistered",
    "hostingApproved",
  ] as const)
    expect(affiliateReady({ ...ready, [gate]: false })).toBe(false);
  for (const url of [
    "",
    "javascript:alert(1)",
    "http://link.coupang.com/a/example",
    "https://link.coupang.com.evil.test/a/example",
    "https://user:pass@link.coupang.com/a/example",
    "https://link.coupang.com/a/",
  ])
    expect(affiliateReady({ ...ready, url })).toBe(false);
});
