import { test, expect } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

test("GA4 stays unloaded until the visitor allows it and strips URL details", async ({
  page,
}) => {
  await page.goto("/ko/?q=private-search-term#private-fragment");
  expect(await page.evaluate(() => location.search)).toBe("");

  const panel = page.locator("[data-analytics-consent]");
  await expect(panel).toBeVisible();
  await expect(panel).toContainText(
    "검색어 원문·폼 입력·게임 점수는 보내지 않으며",
  );
  await expect(
    page.locator('script[src*="googletagmanager.com/gtag/js"]'),
  ).toHaveCount(0);
  expect(
    await page.evaluate(
      () => (window as Window & { dataLayer?: IArguments[] }).dataLayer,
    ),
  ).toBeUndefined();

  await page.getByRole("button", { name: "분석 허용" }).click();
  await expect(panel).toBeHidden();
  expect(
    await page.evaluate(() =>
      localStorage.getItem("denny-games.analytics-consent"),
    ),
  ).toBe("granted-v3");

  const commands = await page.evaluate(() => {
    const dataLayer =
      (window as Window & { dataLayer?: IArguments[] }).dataLayer ?? [];
    return {
      types: dataLayer.map((command) =>
        Object.prototype.toString.call(command),
      ),
      values: dataLayer.map((command) => Array.from(command)),
    };
  });
  expect(commands.types).toEqual(["[object Arguments]", "[object Arguments]"]);
  const config = commands.values.find(
    (command) => Array.isArray(command) && command[0] === "config",
  ) as unknown[] | undefined;
  expect(config?.[1]).toBe("G-5NZLTVBG5Y");
  expect(config?.[2]).toMatchObject({
    page_location: `${new URL(page.url()).origin}/ko/`,
    page_referrer: "",
    cookie_domain: "games.iamdenny.com",
    cookie_prefix: "dennygames",
    cookie_expires: 5_184_000,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
});

for (const locale of ["en", "ko"] as const) {
  test(`${locale}: analytics choice describes aggregate search measurement`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/search/`);
    const panel = page.locator("[data-analytics-consent]");
    await expect(panel).toBeVisible();
    await expect(panel).toContainText(
      locale === "ko"
        ? "검색어 입력 여부·필터 수·결과 수"
        : "whether text was entered, filter count and result count",
    );
    await page.goto(`/${locale}/privacy/`);
    await expect(page.locator("main")).toContainText(
      locale === "ko"
        ? "카탈로그 검색어 입력 여부·활성 필터 수·일치한 게임 수"
        : "aggregate catalogue-search outcomes: whether a query was entered",
    );
  });
}

test("visitors can decline or withdraw analytics from the privacy page", async ({
  page,
}) => {
  await page.goto("/en/");
  await page.getByRole("button", { name: "Decline", exact: true }).click();
  await expect(page.locator("[data-analytics-consent]")).toBeHidden();
  expect(
    await page.evaluate(() =>
      localStorage.getItem("denny-games.analytics-consent"),
    ),
  ).toBe("denied");
  expect(
    await page.evaluate(
      () => (window as Window & { dataLayer?: IArguments[] }).dataLayer,
    ),
  ).toBeUndefined();

  await page.goto("/en/privacy/");
  await expect(page.locator("[data-analytics-consent]")).toBeHidden();
  await page.getByRole("button", { name: "Manage analytics choice" }).click();
  await expect(page.locator("[data-analytics-consent]")).toBeVisible();
  await page.getByRole("button", { name: "Allow analytics" }).click();
  await expect(page.locator("[data-analytics-consent]")).toBeHidden();

  await page.getByRole("button", { name: "Manage analytics choice" }).click();
  await page.getByRole("button", { name: "Decline", exact: true }).click();
  expect(
    await page.evaluate(
      () =>
        (window as unknown as Record<string, unknown>)[
          "ga-disable-G-5NZLTVBG5Y"
        ],
    ),
  ).toBe(true);
  expect(
    await page.evaluate(() =>
      localStorage.getItem("denny-games.analytics-consent"),
    ),
  ).toBe("denied");

  await page.goto("/ko/");
  await expect(page.locator("[data-analytics-consent]")).toBeHidden();
  await expect(
    page.locator('script[src*="googletagmanager.com/gtag/js"]'),
  ).toHaveCount(0);
});

test("consent choices synchronize across open tabs", async ({ context }) => {
  const firstTab = await context.newPage();
  const secondTab = await context.newPage();
  await firstTab.goto("/en/");
  await secondTab.goto("/ko/");

  await firstTab.getByRole("button", { name: "Allow analytics" }).click();
  await expect(secondTab.locator("[data-analytics-consent]")).toBeHidden();
  expect(
    await secondTab.evaluate(
      () => (window as Window & { dataLayer?: IArguments[] }).dataLayer?.length,
    ),
  ).toBe(2);

  await firstTab.goto("/en/privacy/");
  await firstTab
    .getByRole("button", { name: "Manage analytics choice" })
    .click();
  await firstTab.getByRole("button", { name: "Decline", exact: true }).click();
  await expect(secondTab.locator("[data-analytics-consent]")).toBeHidden();
  expect(
    await secondTab.evaluate(
      () =>
        (window as unknown as Record<string, unknown>)[
          "ga-disable-G-5NZLTVBG5Y"
        ],
    ),
  ).toBe(true);
});

test("previous game-only permission is renewed before analytics resumes", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("denny-games.analytics-consent", "granted-v2"),
  );
  await page.goto("/en/play/2048/");
  await expect(page.locator("[data-analytics-consent]")).toBeVisible();
  await expect(
    page.locator('script[src*="googletagmanager.com/gtag/js"]'),
  ).toHaveCount(0);
  await page.locator("[data-analytics-allow]").click();
  const events = () =>
    page.evaluate(() =>
      (window.dataLayer ?? [])
        .map((entry) => Array.from(entry))
        .filter((entry) => entry[0] === "event"),
    );
  expect(await events()).toEqual([]);
  await page.locator("#start-button").click();
  await page.locator("#pause-button").click();
  await page.locator("#start-button").click();
  expect(await events()).toEqual([
    [
      "event",
      "game_start",
      {
        send_to: "G-5NZLTVBG5Y",
        game_id: "2048",
        page_location: `${new URL(page.url()).origin}/en/play/2048/`,
        page_referrer: "",
      },
    ],
  ]);
});

test("restored terminal rounds do not create a phantom game start", async ({
  page,
}) => {
  const { newPop } = await import("../../src/games/prism-pop/rules");
  const saved = newPop(1);
  saved.status = "won";
  saved.balls = [];
  saved.score = 1000;
  await page.addInitScript((state) => {
    localStorage.setItem("denny-games.analytics-consent", "granted-v3");
    localStorage.setItem(
      "denny-games:v1:progress:prism-pop:v1:prism-pop:v1:normal:1",
      JSON.stringify(state),
    );
  }, saved);
  await page.goto("/en/play/prism-pop/");
  await page.locator("#start-button").click();
  await expect(page.locator("#next-stage")).toBeVisible();
  expect(
    await page.evaluate(() =>
      (window.dataLayer ?? [])
        .map((x) => Array.from(x))
        .filter((x) => x[0] === "event"),
    ),
  ).toEqual([]);
});

test("search telemetry is consented, delayed and limited to aggregate outcomes", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("denny-games.analytics-consent", "granted-v2"),
  );
  await page.goto("/ko/search/?q=private-url-term#private-fragment");
  const initialUrl = await page.evaluate(() => ({
    search: location.search,
    hash: location.hash,
  }));
  expect(initialUrl.search).not.toContain("private-url-term");
  expect(initialUrl.search).not.toContain("mode=");
  expect(initialUrl.hash).toContain("q=private-url-term");
  const panel = page.locator("[data-analytics-consent]");
  await expect(panel).toBeVisible();
  await expect(panel).toContainText("검색어 입력 여부·필터 수·결과 수");

  const events = () =>
    page.evaluate(() =>
      (window.dataLayer ?? [])
        .map((entry) => Array.from(entry))
        .filter((entry) => entry[0] === "event"),
    );
  expect(await events()).toEqual([]);
  await page.locator("#search-query").fill("query-before-consent-zzzxqv");
  await page.locator("[data-analytics-allow]").click();
  await page.waitForTimeout(900);
  expect(await events()).toEqual([]);

  await page.locator("#search-query").fill("zzzxqv-no-matching-game-8241");
  await expect(page.locator("#result-count")).toContainText("0");
  await expect.poll(async () => (await events()).length).toBe(1);
  const first = (await events())[0];
  expect(first).toEqual([
    "event",
    "catalog_search",
    {
      send_to: "G-5NZLTVBG5Y",
      search_has_query: true,
      search_filter_count: 0,
      search_result_count: 0,
      page_location: `${new URL(page.url()).origin}/ko/search/`,
      page_referrer: "",
    },
  ]);
  expect(JSON.stringify(await events())).not.toContain(
    "zzzxqv-no-matching-game-8241",
  );
  await page.locator('#search-form button[type="submit"]').click();
  await page.waitForTimeout(900);
  expect(await events()).toHaveLength(1);

  await page.locator("#search-query").fill("revoked-before-send-5814");
  await page.evaluate(() => {
    const key = "denny-games.analytics-consent";
    for (const value of ["denied", "granted-v3"]) {
      localStorage.setItem(key, value);
      window.dispatchEvent(
        new StorageEvent("storage", { key, newValue: value }),
      );
    }
  });
  await page.waitForTimeout(900);
  expect(await events()).toHaveLength(1);

  await page.locator("#search-query").fill("");
  await page.locator('[name="category"]').selectOption("board");
  await expect.poll(async () => (await events()).length).toBe(2);
  expect((await events())[1]?.[2]).toMatchObject({
    search_has_query: false,
    search_filter_count: 1,
  });
  expect(
    await page.evaluate(() =>
      localStorage.getItem("denny-games.analytics-consent"),
    ),
  ).toBe("granted-v3");
});

test("search history restoration cancels pending aggregate measurement", async ({
  page,
}) => {
  await page.goto("/en/search/?category=board");
  await page.locator("[data-analytics-allow]").click();
  await page.locator('[name="category"]').selectOption("sports");
  await expect(page.locator('[name="category"]')).toHaveValue("sports");
  await expect(page).toHaveURL(/category=sports/);
  await page.goBack();
  await expect(page.locator('[name="category"]')).toHaveValue("board");
  await page.waitForTimeout(900);
  expect(
    await page.evaluate(() =>
      (window.dataLayer ?? [])
        .map((entry) => Array.from(entry))
        .filter((entry) => entry[0] === "event"),
    ),
  ).toEqual([]);
});

test("a consented home search records one aggregate result after navigation", async ({
  page,
}) => {
  const requestedUrls: string[] = [];
  page.on("request", (request) => requestedUrls.push(request.url()));
  await page.goto("/ko/");
  await page.locator("[data-analytics-allow]").click();
  await page.locator(".home-search input").fill("home-search-private-7621");
  await page.locator(".home-search button").click();
  await expect(page).toHaveURL(/\/ko\/search\/#q=home-search-private-7621/);
  expect(new URL(page.url()).search).toBe("");
  await expect(page.locator("#result-count")).toContainText("0");

  const events = await page.evaluate(() =>
    (window.dataLayer ?? [])
      .map((entry) => Array.from(entry))
      .filter((entry) => entry[0] === "event"),
  );
  expect(events).toEqual([
    [
      "event",
      "catalog_search",
      {
        send_to: "G-5NZLTVBG5Y",
        search_has_query: true,
        search_filter_count: 0,
        search_result_count: 0,
        page_location: `${new URL(page.url()).origin}/ko/search/`,
        page_referrer: new URL(page.url()).origin,
      },
    ],
  ]);
  expect(JSON.stringify(events)).not.toContain("home-search-private-7621");
  expect(requestedUrls.join("\n")).not.toContain("home-search-private-7621");
});

test("search forms without JavaScript are replaced by static browse guidance", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const requestedUrls: string[] = [];
  page.on("request", (request) => requestedUrls.push(request.url()));

  for (const [locale, homeFallback, searchFallback] of [
    ["en", "Search needs JavaScript", "static collections below"],
    ["ko", "JavaScript가 필요해요", "게임 모음"],
  ] as const) {
    await page.goto(`/${locale}/`);
    await expect(page.locator(".home-search")).toBeHidden();
    await expect(
      page.locator(".home-actions .no-js-search-fallback"),
    ).toContainText(homeFallback);
    await page.locator(`.sidebar a[href="/${locale}/search/"]`).click();
    await expect(page).toHaveURL(`/${locale}/search/`);
    await expect(page.locator("#search-form")).toBeHidden();
    await expect(page.locator(".no-js-search-fallback")).toContainText(
      searchFallback,
    );
  }
  expect(new URL(page.url()).search).toBe("");
  expect(requestedUrls.join("\n")).not.toMatch(
    /[?&](?:q|category|control|length|mode)=/,
  );
  await context.close();
});

test("fragment search state wins over a conflicting legacy query", async ({
  page,
}) => {
  await page.goto("/en/search/?q=legacy-private-value#q=fragment-value");
  await expect(page.locator("#search-query")).toHaveValue("fragment-value");
  expect(new URL(page.url()).search).toBe("");
  expect(new URL(page.url()).hash).toContain("q=fragment-value");
});

test("a search typed during catalogue loading is measured after results arrive", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("denny-games.analytics-consent", "granted-v3"),
  );

  let releaseCatalogue: (() => void) | undefined;
  let announceCatalogueRequest: () => void = () => {};
  const catalogueStarted = new Promise<void>((resolve) => {
    announceCatalogueRequest = resolve;
  });
  await page.route("**/en/search-index.json", async (route) => {
    announceCatalogueRequest();
    await new Promise<void>((resolve) => {
      releaseCatalogue = resolve;
    });
    await route.continue();
  });

  try {
    await page.goto("/en/search/");
    await catalogueStarted;
    await page.locator("#search-query").fill("2048");
    await page.waitForTimeout(900);
    const pendingEvents = await page.evaluate(() =>
      (window.dataLayer ?? [])
        .map((entry) => Array.from(entry))
        .filter(
          (entry) => entry[0] === "event" && entry[1] === "catalog_search",
        ),
    );
    expect(pendingEvents).toEqual([]);

    releaseCatalogue?.();
    await expect(page.locator("#result-count")).not.toContainText("0");
    await expect
      .poll(async () =>
        page.evaluate(
          () =>
            (window.dataLayer ?? [])
              .map((entry) => Array.from(entry))
              .filter(
                (entry) =>
                  entry[0] === "event" && entry[1] === "catalog_search",
              ).length,
        ),
      )
      .toBe(1);
    const event = await page.evaluate(() =>
      (window.dataLayer ?? [])
        .map((entry) => Array.from(entry))
        .find((entry) => entry[0] === "event" && entry[1] === "catalog_search"),
    );
    expect(event?.[2]).toMatchObject({
      search_has_query: true,
      search_result_count: expect.any(Number),
    });
    expect(
      (event?.[2] as { search_result_count: number }).search_result_count,
    ).toBeGreaterThan(0);
    expect(JSON.stringify(event)).not.toContain("2048");
  } finally {
    releaseCatalogue?.();
    await page.unroute("**/en/search-index.json");
  }
});

test("a home search is discarded if consent changes while results load", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("denny-games.analytics-consent", "granted-v3"),
  );
  let holdCatalogue = false;
  let releaseCatalogue: (() => void) | undefined;
  let announceCatalogueRequest: () => void = () => {};
  const catalogueStarted = new Promise<void>((resolve) => {
    announceCatalogueRequest = resolve;
  });
  await page.route("**/en/search-index.json", async (route) => {
    if (!holdCatalogue) return route.continue();
    announceCatalogueRequest();
    await new Promise<void>((resolve) => {
      releaseCatalogue = resolve;
    });
    await route.continue();
  });

  try {
    await page.goto("/en/");
    holdCatalogue = true;
    await page.locator(".home-search input").fill("2048");
    await page.locator(".home-search button[type=submit]").click();
    await expect(page).toHaveURL(/\/en\/search\/#q=2048/);
    await catalogueStarted;
    await page.evaluate(() => {
      const key = "denny-games.analytics-consent";
      for (const value of ["denied", "granted-v3"]) {
        localStorage.setItem(key, value);
        window.dispatchEvent(
          new StorageEvent("storage", { key, newValue: value }),
        );
      }
    });

    releaseCatalogue?.();
    await expect(page.locator("#result-count")).not.toContainText("0");
    await page.waitForTimeout(100);
    const events = await page.evaluate(() =>
      (window.dataLayer ?? [])
        .map((entry) => Array.from(entry))
        .filter(
          (entry) => entry[0] === "event" && entry[1] === "catalog_search",
        ),
    );
    expect(events).toEqual([]);
  } finally {
    releaseCatalogue?.();
    await page.unroute("**/en/search-index.json");
  }
});

test("each distinct search state is measured at most once per page visit", async ({
  page,
}) => {
  await page.goto("/en/search/");
  await page.locator("[data-analytics-allow]").click();
  const query = page.locator("#search-query");
  const eventCount = () =>
    page.evaluate(
      () =>
        (window.dataLayer ?? [])
          .map((entry) => Array.from(entry))
          .filter((entry) => entry[0] === "event").length,
    );

  await query.fill("first-distinct-search-417");
  await expect.poll(eventCount).toBe(1);
  await query.fill("second-distinct-search-852");
  await expect.poll(eventCount).toBe(2);
  await query.fill("first-distinct-search-417");
  await page.waitForTimeout(900);
  expect(await eventCount()).toBe(2);

  await page.locator('#search-form button[type="reset"]').click();
  await expect(query).toHaveValue("");
  await query.fill("first-distinct-search-417");
  await page.waitForTimeout(900);
  expect(await eventCount()).toBe(2);
  const serializedEvents = await page.evaluate(() =>
    JSON.stringify(
      (window.dataLayer ?? [])
        .map((entry) => Array.from(entry))
        .filter((entry) => entry[0] === "event"),
    ),
  );
  expect(serializedEvents).not.toContain("first-distinct-search-417");
  expect(serializedEvents).not.toContain("second-distinct-search-852");
});

test("legacy GA search-term aliases move to the fragment before analytics starts", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("denny-games.analytics-consent", "granted-v3"),
  );
  for (const alias of ["s", "search", "query", "keyword"]) {
    const term = `private-${alias}-term`;
    await page.goto(`/en/search/?${alias}=${term}`);
    await expect(page.locator("#search-query")).toHaveValue(term);
    const url = await page.evaluate(() => ({
      search: location.search,
      hash: location.hash,
    }));
    expect(url.search).toBe("");
    expect(url.hash).toContain(`q=${term}`);
    const commands = await page.evaluate(() =>
      JSON.stringify(window.dataLayer ?? []),
    );
    expect(commands).not.toContain(term);
  }
});
