import { describe, expect, it, vi } from "vitest";
import {
  decodeXmlEntities,
  isEligibleChangedPath,
  parseSitemapLocations,
  runIndexNow,
  selectAffectedUrls,
  shouldNotifyIndexNow,
} from "../../scripts/indexnow.mjs";

const host = "https://games.iamdenny.com";
const key = "0123456789abcdef0123456789abcdef";
const sitemap = `<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${host}/</loc></url><url><loc>${host}/en/</loc></url></urlset>`;
const eligible = {
  eventName: "push",
  runAttempt: "1",
  beforeSha: "a".repeat(40),
  headSha: "b".repeat(40),
  changedPaths: ["src/data/games.ts"],
};

describe("IndexNow change gate", () => {
  it("accepts only first-attempt pushes with a valid base and page input", () => {
    expect(shouldNotifyIndexNow(eligible)).toBe(true);
    expect(
      shouldNotifyIndexNow({ ...eligible, eventName: "workflow_dispatch" }),
    ).toBe(false);
    expect(shouldNotifyIndexNow({ ...eligible, runAttempt: "2" })).toBe(false);
    expect(
      shouldNotifyIndexNow({ ...eligible, beforeSha: "0".repeat(40) }),
    ).toBe(false);
    expect(shouldNotifyIndexNow({ ...eligible, beforeSha: "" })).toBe(false);
  });

  it("includes deleted page inputs and excludes operational-only changes", () => {
    expect(isEligibleChangedPath("src/pages/[locale]/[...path].astro")).toBe(
      true,
    );
    expect(isEligibleChangedPath("src/pages/new-guide.astro")).toBe(true);
    expect(isEligibleChangedPath("src/data/new-page-copy.ts")).toBe(true);
    expect(isEligibleChangedPath("src/components/NewListing.astro")).toBe(true);
    expect(isEligibleChangedPath("src/pages/old-guide.astro")).toBe(true);
    expect(isEligibleChangedPath("src/pages/llms.txt.ts")).toBe(false);
    expect(isEligibleChangedPath("docs/guide/search-discovery.md")).toBe(false);
    expect(isEligibleChangedPath(".github/workflows/deploy.yml")).toBe(false);
    expect(isEligibleChangedPath("public/indexnow-key.txt")).toBe(false);
    expect(isEligibleChangedPath("src/games/board/rules.ts")).toBe(false);
    expect(isEligibleChangedPath("src/lib/input.ts")).toBe(false);
    expect(
      shouldNotifyIndexNow({
        ...eligible,
        changedPaths: ["src/pages/old-guide.astro"],
      }),
    ).toBe(true);
  });
});

describe("IndexNow sitemap validation", () => {
  it("decodes XML entities and deduplicates canonical URLs", () => {
    expect(decodeXmlEntities("a&amp;b &quot;x&quot; &#x2F; &#47;")).toBe(
      'a&b "x" / /',
    );
    expect(decodeXmlEntities("&AMP;&LT;&GT;&QUOT;&APOS;")).toBe("&<>\"'");
    const duplicate = sitemap.replace(
      `</urlset>`,
      `<url><loc>${host}/en/</loc></url></urlset>`,
    );
    expect(parseSitemapLocations(duplicate)).toEqual([
      `${host}/`,
      `${host}/en/`,
    ]);
  });

  it.each([
    ["malformed XML", `<urlset><url><loc>${host}/</loc></url>`],
    ["empty sitemap", "<urlset></urlset>"],
    [
      "external host",
      `<urlset><url><loc>https://evil.example/</loc></url></urlset>`,
    ],
    [
      "non-HTTPS URL",
      `<urlset><url><loc>http://games.iamdenny.com/</loc></url></urlset>`,
    ],
    ["query URL", `<urlset><url><loc>${host}/?q=arcade</loc></url></urlset>`],
    [
      "unknown XML entity",
      `<urlset><url><loc>${host}/en/?a=&unknown;</loc></url></urlset>`,
    ],
  ])("rejects %s", (_name, xml) => {
    expect(() => parseSitemapLocations(xml)).toThrow();
  });

  it("rejects a sitemap over the IndexNow limit before submission", () => {
    const urls = Array.from(
      { length: 10001 },
      (_, i) => `<url><loc>${host}/p/${i}/</loc></url>`,
    ).join("");
    expect(() => parseSitemapLocations(`<urlset>${urls}</urlset>`)).toThrow(
      /10,000/,
    );
  });
});

describe("changed URL selection", () => {
  const urls = [
    `${host}/`,
    `${host}/en/`,
    `${host}/en/about/`,
    `${host}/en/all/`,
    `${host}/ko/all/page/2/`,
    `${host}/en/category/board/`,
    `${host}/ko/category/board/page/2/`,
    `${host}/en/games/gomoku/`,
    `${host}/en/games/circuit-loop/`,
    `${host}/ko/guides/open-browser-games/`,
    `${host}/en/collections/classic-board/`,
    `${host}/en/licenses/`,
    `${host}/ko/daily/`,
    `${host}/en/compatibility/`,
  ];

  it("selects only the routes affected by content inputs", () => {
    expect(selectAffectedUrls(["src/data/editorial.ts"], urls)).toEqual([
      `${host}/en/`,
      `${host}/en/all/`,
      `${host}/ko/all/page/2/`,
      `${host}/en/category/board/`,
      `${host}/ko/category/board/page/2/`,
    ]);
    expect(selectAffectedUrls(["src/data/discovery.ts"], urls)).toEqual([
      `${host}/en/category/board/`,
      `${host}/ko/category/board/page/2/`,
    ]);
    expect(selectAffectedUrls(["src/data/pages.ts"], urls)).toEqual(urls);
    expect(selectAffectedUrls(["src/data/games.ts"], urls)).toEqual([
      `${host}/en/`,
      `${host}/en/all/`,
      `${host}/ko/all/page/2/`,
      `${host}/en/category/board/`,
      `${host}/ko/category/board/page/2/`,
      `${host}/en/games/gomoku/`,
      `${host}/en/games/circuit-loop/`,
      `${host}/ko/guides/open-browser-games/`,
      `${host}/en/collections/classic-board/`,
      `${host}/en/licenses/`,
      `${host}/ko/daily/`,
      `${host}/en/compatibility/`,
    ]);
    expect(selectAffectedUrls(["src/data/collections.ts"], urls)).toEqual([
      `${host}/en/`,
      `${host}/en/games/gomoku/`,
      `${host}/en/games/circuit-loop/`,
      `${host}/en/collections/classic-board/`,
    ]);
    expect(selectAffectedUrls(["src/data/board-games.ts"], urls)).toEqual([
      `${host}/en/`,
      `${host}/en/all/`,
      `${host}/ko/all/page/2/`,
      `${host}/en/category/board/`,
      `${host}/ko/category/board/page/2/`,
      `${host}/en/games/gomoku/`,
      `${host}/en/games/circuit-loop/`,
      `${host}/ko/guides/open-browser-games/`,
      `${host}/en/collections/classic-board/`,
      `${host}/en/licenses/`,
      `${host}/ko/daily/`,
    ]);
    expect(
      selectAffectedUrls(["src/components/CollectionLinks.astro"], urls),
    ).toEqual([
      `${host}/en/`,
      `${host}/en/games/gomoku/`,
      `${host}/en/games/circuit-loop/`,
      `${host}/en/collections/classic-board/`,
    ]);
  });

  it("selects all sitemap URLs for site-wide and unknown page inputs", () => {
    expect(
      selectAffectedUrls(["src/pages/[locale]/[...path].astro"], urls),
    ).toEqual(urls);
    expect(selectAffectedUrls(["src/pages/new-guide.astro"], urls)).toEqual(
      urls,
    );
    expect(
      selectAffectedUrls(["src/components/NewPublicBlock.astro"], urls),
    ).toEqual(urls);
  });
});

describe("IndexNow notification", () => {
  it.each([200, 202])(
    "reports HTTP %i as a submission receipt",
    async (status) => {
      const fetchImpl = vi.fn(async (url, init) => {
        if (url === `${host}/release.json`)
          return new Response(JSON.stringify({ sha: eligible.headSha }), {
            status: 200,
          });
        if (url === `${host}/sitemap.xml`)
          return new Response(sitemap, { status: 200 });
        if (url === `${host}/indexnow-key.txt`)
          return new Response(key, { status: 200 });
        expect(url).toBe("https://api.indexnow.org/indexnow");
        expect(init.method).toBe("POST");
        expect(JSON.parse(init.body)).toEqual({
          host: "games.iamdenny.com",
          key,
          keyLocation: `${host}/indexnow-key.txt`,
          urlList: [`${host}/en/`],
        });
        return new Response("", { status });
      });
      await expect(
        runIndexNow({ ...eligible, key, fetchImpl }),
      ).resolves.toEqual({
        status: "received",
        responseStatus: status,
        submittedUrlCount: 1,
      });
      expect(fetchImpl).toHaveBeenCalledTimes(4);
    },
  );

  it("skips before network access when there are no eligible page changes", async () => {
    const fetchImpl = vi.fn();
    await expect(
      runIndexNow({ ...eligible, changedPaths: ["docs/a.md"], key, fetchImpl }),
    ).resolves.toMatchObject({ status: "skipped" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("requires the public key readback to match the checked-out key", async () => {
    const fetchImpl = vi.fn(async (url) => {
      if (url === `${host}/release.json`)
        return new Response(JSON.stringify({ sha: eligible.headSha }), {
          status: 200,
        });
      if (url === `${host}/sitemap.xml`)
        return new Response(sitemap, { status: 200 });
      return new Response("different-public-key", { status: 200 });
    });
    await expect(
      runIndexNow({ ...eligible, key, fetchImpl }),
    ).resolves.toMatchObject({ status: "failed" });
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });

  it.each([403, 429, 500])(
    "surfaces HTTP %i without retrying or exposing the key",
    async (status) => {
      const fetchImpl = vi.fn(async (url) => {
        if (url === `${host}/release.json`)
          return new Response(JSON.stringify({ sha: eligible.headSha }), {
            status: 200,
          });
        if (url === `${host}/sitemap.xml`)
          return new Response(sitemap, { status: 200 });
        if (url === `${host}/indexnow-key.txt`)
          return new Response(key, { status: 200 });
        return new Response("rejected", { status });
      });
      const result = await runIndexNow({ ...eligible, key, fetchImpl });
      expect(result).toMatchObject({ status: "failed" });
      expect(result.message).not.toContain(key);
      expect(fetchImpl).toHaveBeenCalledTimes(4);
    },
  );

  it("turns network failures into safe visible failures", async () => {
    const fetchImpl = vi.fn(async (url) => {
      if (url === `${host}/release.json`)
        return new Response(JSON.stringify({ sha: eligible.headSha }), {
          status: 200,
        });
      if (url === `${host}/sitemap.xml`)
        return new Response(sitemap, { status: 200 });
      if (url === `${host}/indexnow-key.txt`)
        return new Response(key, { status: 200 });
      throw new Error(`network error with ${key}`);
    });
    const result = await runIndexNow({ ...eligible, key, fetchImpl });
    expect(result).toMatchObject({
      status: "failed",
      message: "IndexNow network request failed.",
    });
    expect(result.message).not.toContain(key);
    expect(fetchImpl).toHaveBeenCalledTimes(4);
  });

  it("stops without fetching the sitemap while the live release is stale", async () => {
    const fetchImpl = vi.fn(
      async () =>
        new Response(JSON.stringify({ sha: eligible.beforeSha }), {
          status: 200,
        }),
    );
    const sleepImpl = vi.fn(async () => {});
    const result = await runIndexNow({
      ...eligible,
      key,
      fetchImpl,
      sleepImpl,
    });
    expect(result).toMatchObject({ status: "failed" });
    expect(result.message).toContain("does not match the deployment SHA");
    expect(fetchImpl).toHaveBeenCalledTimes(6);
    expect(sleepImpl).toHaveBeenCalledTimes(5);
  });
});
