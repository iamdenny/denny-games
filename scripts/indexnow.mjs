export const CANONICAL_ORIGIN = "https://games.iamdenny.com";
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
export const MAX_URLS_PER_REQUEST = 10_000;
export const KEY_PATH = "/indexnow-key.txt";
export const RELEASE_PATH = "/release.json";
export const RELEASE_CHECK_ATTEMPTS = 6;
export const RELEASE_CHECK_DELAY_MS = 5_000;

const publicPageInputs = {
  "src/pages/[locale]/[...path].astro": "all",
  "src/pages/index.astro": "root",
  "src/pages/sitemap.xml.ts": "all",
  "src/layouts/Base.astro": "all",
  "src/components/AdSlot.astro": "gameCatalogue",
  "src/components/AffiliateCard.astro": "gameCatalogue",
  "src/components/CataloguePages.astro": "listings",
  "src/components/CollectionLinks.astro": "collections",
  "src/components/GameCard.astro": "gameCatalogue",
  "src/data/ads.ts": "gameCatalogue",
  "src/data/affiliate.ts": "gameCatalogue",
  "src/data/board-games.ts": "boardGames",
  "src/data/collections.ts": "collections",
  "src/data/crisp.json": "gameCatalogue",
  "src/data/discovery.ts": "categories",
  "src/data/editorial.ts": "editorial",
  "src/data/games.ts": "gameCatalogue",
  "src/data/i18n.ts": "all",
  "src/data/pages.ts": "all",
  "src/lib/catalogue.ts": "listings",
  "src/lib/routes.ts": "all",
  "src/lib/seo.ts": "all",
};

const nonIndexablePageInputs = new Set([
  "src/pages/404.astro",
  "src/pages/ads.txt.ts",
  "src/pages/llms.txt.ts",
  "src/pages/release.json.ts",
  "src/pages/robots.txt.ts",
  "src/pages/[locale]/search-index.json.ts",
  "src/components/DeviceCheck.astro",
  "src/components/Player.astro",
  "src/lib/audio.ts",
  "src/lib/device-check.ts",
  "src/lib/events.ts",
  "src/lib/input.ts",
  "src/lib/random.ts",
  "src/lib/storage.ts",
  "src/lib/types.ts",
]);

const fallbackInputScopes = [
  ["src/pages/", "all"],
  ["src/layouts/", "all"],
  ["src/data/", "all"],
  ["src/components/", "all"],
  ["src/lib/", "all"],
];

function routeMatchesScope(pathname, scope) {
  const localized = /^\/(?:en|ko)\//.test(pathname);
  const localPath = localized ? pathname.replace(/^\/(?:en|ko)\//, "") : "";
  switch (scope) {
    case "all":
      return true;
    case "root":
      return pathname === "/";
    case "home":
      return localized && localPath === "";
    case "editorial":
      return (
        localized &&
        (localPath === "" ||
          localPath === "all/" ||
          /^all\/page\/\d+\/$/.test(localPath) ||
          /^category\//.test(localPath))
      );
    case "listings":
      return localized && /^(?:all|category)\//.test(localPath);
    case "categories":
      return localized && /^category\//.test(localPath);
    case "collections":
      return (
        localized &&
        (localPath === "" || /^(?:collections|games)\//.test(localPath))
      );
    case "guides":
      return (
        localized &&
        (/^guides\//.test(localPath) ||
          localPath === "guides/" ||
          localPath === "controller-games/")
      );
    case "boardGames":
      return (
        localized &&
        (localPath === "" ||
          /^all\//.test(localPath) ||
          localPath === "all/" ||
          /^category\/board\/(?:page\/\d+\/)?$/.test(localPath) ||
          localPath === "collections/classic-board/" ||
          localPath === "guides/classic-board-games/" ||
          localPath === "guides/open-browser-games/" ||
          /^games\//.test(localPath) ||
          localPath === "daily/" ||
          localPath === "licenses/")
      );
    case "gameCatalogue":
      return (
        localized &&
        (localPath === "" ||
          /^(?:all|category|collections|games|guides|daily|licenses)\//.test(
            localPath,
          ) ||
          localPath === "all/" ||
          localPath === "daily/" ||
          localPath === "compatibility/")
      );
    default:
      return false;
  }
}

export function isEligibleChangedPath(path) {
  return getInputScope(path) !== undefined;
}

function getInputScope(path) {
  if (Object.hasOwn(publicPageInputs, path)) return publicPageInputs[path];
  if (nonIndexablePageInputs.has(path)) return undefined;
  return fallbackInputScopes.find(([prefix]) => path.startsWith(prefix))?.[1];
}

export function selectAffectedUrls(changedPaths, sitemapUrls) {
  const scopes = new Set(
    changedPaths
      .map(getInputScope)
      .filter((scope) => typeof scope === "string"),
  );
  if (scopes.has("all")) return sitemapUrls;
  return sitemapUrls.filter((url) => {
    const pathname = new URL(url).pathname;
    return [...scopes].some((scope) => routeMatchesScope(pathname, scope));
  });
}

function validSha(value) {
  return typeof value === "string" && /^[a-f\d]{40,64}$/i.test(value);
}

export function shouldNotifyIndexNow({
  eventName,
  runAttempt,
  beforeSha,
  headSha,
  changedPaths = [],
}) {
  return (
    eventName === "push" &&
    String(runAttempt) === "1" &&
    validSha(beforeSha) &&
    !/^0+$/.test(beforeSha) &&
    validSha(headSha) &&
    changedPaths.some(isEligibleChangedPath)
  );
}

export function decodeXmlEntities(value) {
  return value
    .replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (entity) => {
      const code = entity.slice(1, -1);
      const namedCode = code.toLowerCase();
      if (namedCode === "amp") return "&";
      if (namedCode === "lt") return "<";
      if (namedCode === "gt") return ">";
      if (namedCode === "quot") return '"';
      if (namedCode === "apos") return "'";
      const numeric =
        code[1]?.toLowerCase() === "x"
          ? Number.parseInt(code.slice(2), 16)
          : Number.parseInt(code.slice(1), 10);
      if (
        !Number.isInteger(numeric) ||
        numeric < 0 ||
        numeric > 0x10ffff ||
        (numeric >= 0xd800 && numeric <= 0xdfff)
      ) {
        throw new Error("Invalid XML character reference.");
      }
      return String.fromCodePoint(numeric);
    })
    .replace(/&[^\s;]+;/g, () => {
      throw new Error("Unsupported XML entity.");
    });
}

export function parseSitemapLocations(xml, origin = CANONICAL_ORIGIN) {
  if (
    typeof xml !== "string" ||
    !/<urlset\b[^>]*>[\s\S]*<\/urlset>/.test(xml)
  ) {
    throw new Error("Malformed sitemap XML.");
  }
  const openTags = [...xml.matchAll(/<loc(?:\s[^>]*)?>/g)].length;
  const closeTags = [...xml.matchAll(/<\/loc\s*>/g)].length;
  const locations = [...xml.matchAll(/<loc(?:\s[^>]*)?>([\s\S]*?)<\/loc\s*>/g)];
  if (
    openTags !== closeTags ||
    locations.length === 0 ||
    locations.length !== openTags
  ) {
    throw new Error("Malformed or empty sitemap URL list.");
  }

  const expected = new URL(origin);
  const unique = new Set();
  for (const [, rawLocation] of locations) {
    const location = decodeXmlEntities(rawLocation.trim());
    let url;
    try {
      url = new URL(location);
    } catch {
      throw new Error("Sitemap contains an invalid URL.");
    }
    if (
      url.protocol !== "https:" ||
      url.origin !== expected.origin ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    ) {
      throw new Error(
        "Sitemap contains a URL outside the canonical HTTPS host.",
      );
    }
    unique.add(url.href);
    if (unique.size > MAX_URLS_PER_REQUEST) {
      throw new Error(
        `Sitemap exceeds the ${MAX_URLS_PER_REQUEST.toLocaleString("en-US")} URL request limit.`,
      );
    }
  }
  return [...unique];
}

const failed = (message) => ({ status: "failed", message });

export async function runIndexNow({
  eventName,
  runAttempt,
  beforeSha,
  headSha,
  changedPaths = [],
  key,
  fetchImpl = fetch,
  sleepImpl = (milliseconds) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds)),
}) {
  if (
    !shouldNotifyIndexNow({
      eventName,
      runAttempt,
      beforeSha,
      headSha,
      changedPaths,
    })
  ) {
    return {
      status: "skipped",
      reason: "No eligible first-attempt page change.",
    };
  }
  if (typeof key !== "string" || !/^[A-Za-z0-9]{8,128}$/.test(key.trim())) {
    return failed("The local IndexNow public key is invalid.");
  }
  const publicKey = key.trim();
  let releaseMatches = false;
  for (let attempt = 0; attempt < RELEASE_CHECK_ATTEMPTS; attempt++) {
    try {
      const releaseResponse = await fetchImpl(
        `${CANONICAL_ORIGIN}${RELEASE_PATH}`,
        {
          signal: AbortSignal.timeout(15_000),
          cache: "no-store",
        },
      );
      if (releaseResponse.ok) {
        const release = await releaseResponse.json();
        if (release.sha === headSha) {
          releaseMatches = true;
          break;
        }
      }
    } catch {
      // A deployment may be live before the custom host serves its new release.
    }
    if (attempt + 1 < RELEASE_CHECK_ATTEMPTS) {
      await sleepImpl(RELEASE_CHECK_DELAY_MS);
    }
  }
  if (!releaseMatches) {
    return failed(
      "Public release.json does not match the deployment SHA; no IndexNow request was sent.",
    );
  }

  const sitemapUrl = `${CANONICAL_ORIGIN}/sitemap.xml`;
  const keyLocation = `${CANONICAL_ORIGIN}${KEY_PATH}`;
  let sitemapResponse;
  try {
    sitemapResponse = await fetchImpl(sitemapUrl, {
      signal: AbortSignal.timeout(15_000),
      cache: "no-store",
    });
  } catch {
    return failed("Public sitemap request failed.");
  }
  if (!sitemapResponse.ok) return failed("Public sitemap request failed.");

  let sitemapUrls;
  try {
    sitemapUrls = parseSitemapLocations(await sitemapResponse.text());
  } catch {
    return failed("Public sitemap is invalid or contains non-canonical URLs.");
  }
  const urls = selectAffectedUrls(changedPaths, sitemapUrls);
  if (urls.length === 0) {
    return failed("No sitemap URLs match the changed public page inputs.");
  }

  let keyResponse;
  try {
    keyResponse = await fetchImpl(keyLocation, {
      signal: AbortSignal.timeout(15_000),
      cache: "no-store",
    });
  } catch {
    return failed("Public IndexNow key file could not be verified.");
  }
  let publishedKey = "";
  try {
    publishedKey = keyResponse.ok ? (await keyResponse.text()).trim() : "";
  } catch {
    return failed("Public IndexNow key file could not be verified.");
  }
  if (!keyResponse.ok || publishedKey !== publicKey) {
    return failed(
      "Public IndexNow key file does not match the checked-out key.",
    );
  }

  let response;
  try {
    response = await fetchImpl(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(CANONICAL_ORIGIN).hostname,
        key: publicKey,
        keyLocation,
        urlList: urls,
      }),
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    return failed("IndexNow network request failed.");
  }
  if (response.status !== 200 && response.status !== 202) {
    return failed(`IndexNow endpoint returned HTTP ${response.status}.`);
  }
  return {
    status: "received",
    responseStatus: response.status,
    submittedUrlCount: urls.length,
  };
}
