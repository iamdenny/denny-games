---
title: "SEO and AI search operations"
summary: "Discovery implementation, official guidance and separate submission evidence."
read_when:
  - Publishing games or evaluating search visibility
---

# SEO and AI search operations

## Implemented surfaces

- Complete catalogue: `/en/all/` and `/ko/all/`, with static 24-game numbered pages, exact registry coverage, explicit totals/ranges, native previous/next links, independent canonicals and visible-card CollectionPage/ItemList. Home previews and global All games links lead here.
- Game detail pages: localized titles/descriptions, rules, controls, screenshots, original author/source/license and VideoGame/WebPage/BreadcrumbList data.
- Categories: editorial genre descriptions, distinct pagination metadata, crawlable page links and an ItemList matching only the server-rendered cards on that page. Client sorting/filtering remains a convenience rather than the only discovery path.
- Site: WebSite/Organization entities, canonical URLs, reciprocal English/Korean hreflang and contextual x-default in HTML and XML sitemap, PNG sharing previews.
- Public guide: `/en/guides/open-browser-games/` and `/ko/guides/open-browser-games/`, linked from home and guides, explain what is playable, sources, redistribution, saves and device evidence.
- Play, search, library and diagnostic routes stay noindex. Robots allows crawling so the noindex directive can be observed. No private development docs are published.

`src/lib/seo.ts` owns schema generation. `src/data/discovery.ts` owns category copy. Do not add fabricated ratings, unverified hardware compatibility, arbitrary lastmod dates or hidden SEO text. Update bilingual editorial facts with catalogue changes.

## Checks

`npm run verify` includes `scripts/check-seo.mjs`. `npm run seo:check -- --base https://games.iamdenny.com` checks all sitemap pages from the deployed host with bounded concurrency. Checks cover unique metadata, canonical, H1, language pairs, valid JSON-LD, author/source/license, list-to-card agreement and exclusion boundaries. They are internal checks, not an external rich-result certificate or indexing report.

Public ownership verification tags for Bing and Naver remain in the root static HTML. JavaScript-enabled root visits open the preferred supported browser language; static readers and JavaScript-disabled visitors retain the bilingual selector (ADR 0019). The tags are public challenge identifiers, not account credentials. Google verified automatically through existing domain-provider ownership; no DNS records were changed.

## Submission and measurement

After a successful Pages push deployment, the `indexnow` workflow job compares the push base and head. A first-attempt push that changes a page template, SEO/routing helper, localization or public catalogue/guide data notifies `https://api.indexnow.org/indexnow` with unique canonical sitemap URLs for the affected route family. Shared page-shell, routing and SEO changes affect every sitemap URL. Editorial ordering selects home, all-catalogue and category pages; collection and game inputs select their localized route families; article copy currently selects the full sitemap because it spans guide and standalone pages. Unknown files under public page, layout, data, component or library source roots conservatively select the full sitemap so new page dependencies are not silently missed. The job first checks that public `release.json` matches the deployed SHA, retrying that read briefly if the custom host is still catching up. Documentation, tests, scripts, workflow, key-only, artwork/style and game-runtime changes do not trigger a request. Manual dispatches and reruns skip. The public `/{key}.txt` file is IndexNow's site ownership proof; it is not a private credential.

An HTTP 200 or 202 is recorded only as a submission receipt. HTTP 202 can mean that key validation is pending. It does not show that a crawler visited or indexed a URL, or that rankings, traffic or AI citations changed. Release-SHA, sitemap, key-readback and API failures appear as workflow warnings and do not undo a completed Pages deployment. Deleted URLs are not included because the current sitemap contains only published URLs.

1. Verify the exact games URL-prefix property in Google Search Console, or use an owned parent domain property covering the subdomain. Submit `https://games.iamdenny.com/sitemap.xml`; inspect representative home/category/game/guide URLs. Record submission receipt and live retrieval separately.
2. In Bing Webmaster Tools, add/import this site and submit the same sitemap. Importing from Google may require account authorization; do not infer successful registration from a logged-in landing page.
3. For Korean discovery, add the exact host in Naver Search Advisor, verify ownership and submit the sitemap. Keep existing tools/modutt properties untouched.
4. Record observed indexed URLs, search impressions/clicks and Bing AI Performance citations only when dashboards show them. A submitted sitemap, successful fetch, indexed page, ranking and AI citation are different states. Do not promise timing or rank.

No analytics provider was added. Existing privacy disclosures remain accurate. If analytics is introduced, document provider, consent and data collection before enabling it.

## Primary guidance

- [Google AI features and your website](https://developers.google.com/search/docs/appearance/ai-features): existing SEO and accessible textual content remain relevant; special AI files/schema are unnecessary and inclusion is not guaranteed.
- [Google localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions): reciprocal alternate language URLs.
- [Google pagination](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading): links must be crawlable.
- [Google structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies): markup must represent visible, accurate content.
- [Bing webmaster guidelines](https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a): discovery and content clarity support search and AI eligibility.
- [Bing AI Performance](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c): use dashboard citation evidence when available.

Reviewed 2026-10-11. Deployment and actual submission receipts belong in release evidence, not predictions in this guide.

## Play-style discovery release

`/en/collections/` and `/ko/collections/` link to one-button, point-and-play, number-puzzles and daily-challenges pages. Each has original bilingual selection criteria and a practical question/answer, source/save boundaries, explicit hardware limits, and CollectionPage/ItemList/BreadcrumbList data matching visible games. Home and matching game details link back to these collections. `/guides/test-your-device/` provides the indexable physical test method; `/device-check/` is a noindex local observation form. Filter URLs on `/search/` also stay noindex and canonicalize to the base search route. No FAQ rich-result eligibility or AI citation is claimed.

## Classic board discovery

Five game-detail pages per locale document the exact implemented variants, AI/local modes, selection controls and strategy tips. The Board category, classic-board collection and linked comparison guide provide distinct visible content and canonical/hreflang/sitemap coverage. VideoGame schema lists single-player and multiplayer for same-device two-player games without implying online rooms. `llms.txt` links to these authoritative HTML pages; publishing it does not establish crawler adoption, indexing, ranking or AI citations.

## Tesla browser-game keyword map

The indexable `/en/tesla/` and `/ko/tesla/` articles target users looking for browser games in a Tesla and answer the compatibility question directly. The phrase inventory below groups spelling and wording variants by intent; it is not a claim of search volume or ranking opportunity. Use natural language in the page title, description, headings, visible copy and internal links. Do not paste the inventory into page copy, metadata keywords, image alt text or hidden content.

| Intent                  | Korean query variants                                                                                                                                                              | English query variants                                                                                                                                            | Page / treatment                                                                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Core discovery          | 테슬라 게임, 테슬라 무료 게임, 테슬라 온라인 게임, 테슬라 게임 사이트, 테슬라 웹게임, 테슬라 브라우저 게임, 테슬라 인터넷 게임, 테슬라 게임 링크                                   | Tesla games, free Tesla games, Tesla games online, Tesla game site, Tesla web games, Tesla browser games, browser games for Tesla                                 | Tesla guide; state physical compatibility is unverified                                                                                           |
| How to play             | 테슬라에서 게임하기, 테슬라에서 웹게임하기, 테슬라 브라우저에서 게임, 테슬라 차량 브라우저 게임, 테슬라 게임 하는 법                                                               | play games on a Tesla, play browser games in a Tesla, games in Tesla browser, Tesla browser game guide                                                            | Tesla guide; explain parked-only test steps                                                                                                       |
| Time and screen         | 테슬라 주차 중 게임, 테슬라 충전 중 게임, 테슬라 기다릴 때 게임, 전기차 충전 중 게임, 테슬라 터치스크린 게임, 테슬라 큰 화면 게임                                                  | Tesla games while parked, games while charging Tesla, Tesla touchscreen games, Tesla big-screen games                                                             | Tesla guide; never imply driving use                                                                                                              |
| Controls                | 테슬라 게임패드, 테슬라 게임패드 추천, 테슬라 게임패드 연결, 테슬라 컨트롤러 게임, 테슬라 브라우저 게임패드, 테슬라 웹브라우저 패드, 테슬라 블루투스 게임패드, 테슬라 USB 게임패드 | Tesla games controller, Tesla gamepad browser, Tesla browser controller, controller games for Tesla, Tesla Bluetooth controller games, Tesla USB controller games | Tesla and controller guides; distinguish native Arcade from browser input                                                                         |
| Native / install intent | 테슬라 게임 종류, 테슬라 게임 설치, 테슬라 게임 추가, 테슬라 게임패스, 테슬라 게임패드 연결                                                                                        | Tesla games in car, Tesla games list, games to play in Tesla, best games to play in Tesla                                                                         | Tesla guide; distinguish built-in Arcade, subscriptions and independent browser games; do not claim Denny Games can be installed in a vehicle     |
| Shared-screen play      | 테슬라 2인 게임, 테슬라 2인용 게임, 테슬라 멀티플레이어 게임, 테슬라 보드게임 2인                                                                                                  | Tesla two-player games, Tesla 2 player games, Tesla multiplayer browser games                                                                                     | Tesla guide; describe five local same-device board modes, distinguish them from online matchmaking, and state Tesla browser support is unverified |
| Models                  | 테슬라 모델 3 게임, 테슬라 모델 Y 게임, 테슬라 모델 S 게임, 테슬라 모델 X 게임, 사이버트럭 게임                                                                                    | Tesla Model 3 games, Tesla Model Y games, Tesla Model S games, Tesla Model X games, Cybertruck games                                                              | Mention only to disclose that each model is untested; no compatibility claim                                                                      |
| Game type               | 테슬라 퍼즐 게임, 테슬라 보드게임, 테슬라 아케이드 게임, 테슬라 2048                                                                                                               | Tesla puzzle games, Tesla browser board games, Tesla Arcade games, Tesla 2048                                                                                     | Adjacent intent; link actual game pages and clarify that browser play is unverified                                                               |

Do not target “Tesla Arcade games” as if Denny Games were part of Tesla's built-in Arcade. The Tesla guide links to touch-control examples, the local gamepad input page, the device-test guide, the compatibility table and Tesla's owner's manual. None of those links establishes that the site has been tested in a vehicle. The same rule applies to phrases such as “Tesla-compatible games,” “Tesla Model 3 supported,” “Tesla controller supported,” “best Tesla games” and “Tesla games recommendation”: only use them as questions with an explicit unverified answer until direct, dated vehicle evidence exists.

Google Autocomplete suggestions sampled on 2026-10-14 for `테슬라 게임` and `Tesla games` included native-game, installation, controller and in-car intents such as `테슬라 게임 종류`, `테슬라 게임 설치`, `테슬라 게임패드 추천`, `테슬라 게임패드 연결`, `Tesla games in car`, and `games to play in Tesla`. These suggestions are query-discovery clues only; they do not establish search volume, indexing or ranking.

In a public search sample on 2026-10-14, results included built-in Tesla Arcade references and third-party Tesla browser-game collections, including shared-screen multiplayer offers. Denny Games can describe five tested same-device board-game modes, but these results establish neither demand nor Tesla compatibility. Search volume, impressions, CTR and position require current provider data; do not infer them from result snippets.
