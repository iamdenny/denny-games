---
title: "SEO and AI search operations"
summary: "Discovery implementation, official guidance and separate submission evidence."
read_when:
  - Publishing games or evaluating search visibility
---

# SEO and AI search operations

## Implemented surfaces

- Game detail pages: localized titles/descriptions, rules, controls, screenshots, original author/source/license and VideoGame/WebPage/BreadcrumbList data.
- Categories: editorial genre descriptions, distinct pagination metadata, crawlable page links and an ItemList matching only the server-rendered cards on that page. Client sorting/filtering remains a convenience rather than the only discovery path.
- Site: WebSite/Organization entities, canonical URLs, reciprocal English/Korean hreflang and contextual x-default in HTML and XML sitemap, PNG sharing previews.
- Public guide: `/en/guides/open-browser-games/` and `/ko/guides/open-browser-games/`, linked from home and guides, explain what is playable, sources, redistribution, saves and device evidence.
- Play, search, library and diagnostic routes stay noindex. Robots allows crawling so the noindex directive can be observed. No private development docs are published.

`src/lib/seo.ts` owns schema generation. `src/data/discovery.ts` owns category copy. Do not add fabricated ratings, unverified hardware compatibility, arbitrary lastmod dates or hidden SEO text. Update bilingual editorial facts with catalogue changes.

## Checks

`npm run verify` includes `scripts/check-seo.mjs`. `npm run seo:check -- --base https://games.iamdenny.com` checks all sitemap pages from the deployed host with bounded concurrency. Checks cover unique metadata, canonical, H1, language pairs, valid JSON-LD, author/source/license, list-to-card agreement and exclusion boundaries. They are internal checks, not an external rich-result certificate or indexing report.

Public ownership verification tags for Bing and Naver are on the root language selector only. They are public challenge identifiers, not account credentials. Google verified automatically through existing domain-provider ownership; no DNS records were changed.

## Submission and measurement

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
