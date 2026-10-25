---
title: "ADR 0066 — Consented catalogue-search outcomes"
summary: "Measure on-site search quality with aggregate counts after renewed consent, without collecting search terms."
read_when:
  - Changing catalogue-search analytics, event payloads or consent scope
---

# Consented catalogue-search outcomes

## Status

Accepted — 2026-10-25. Extends the event scope in [ADR 0050](0050-consented-game-analytics.md), supersedes the no-search-event clause in [ADR 0055](0055-compact-search-discovery-and-ads.md), and amends [ADR 0052](0052-player-mode-search.md) so query, filter and page state use URL fragments. Existing consent, cookie, referrer and advertising boundaries remain in force.

## Context

Search Console describes organic discovery, while the catalogue's client-side search has no measurement of whether a visitor finds any games. That leaves zero-result searches and filter friction indistinguishable from successful search sessions. Sending visitors' typed terms or selected filter values is unnecessary for measuring this basic outcome and would expose more data than the site needs.

## Decision

After the visitor explicitly accepts the expanded analytics scope, the search page may send one `catalog_search` event after the query or filters settle, or immediately after an explicit form submission. A home-page form submission may carry a short-lived, one-use session marker to the search page so its loaded result count can be measured; the marker contains no search text and is created only while analytics consent is active. Bind the delayed home event to the consent revision captured when the search page loads; any withdrawal or new consent choice before the catalogue loads cancels that event. Send at most one event for each distinct query-and-filter state during the page visit, so submitting again after live results settle does not count that state twice. Include only `search_has_query` (boolean), `search_filter_count` (integer from 0 to 4) and `search_result_count` (integer count across all result pages). Send the localized `/en/search/` or `/ko/search/` path without query parameters, plus the existing sanitized referrer origin.

Keep all catalogue-search state (`q`, filters and page) in the URL fragment, not the query string. Before analytics initialization, migrate legacy search-state query parameters into the fragment, map GA4's standard search-term aliases (`s`, `search`, `query`, `keyword`) to `q`, and remove those aliases from other localized routes. This keeps search text and selected filter values out of GA4's URL-based automatic site-search detection; fragments are excluded from GA4's default `page_location`. Preserve fragment state through reload, history, pagination and language changes. When JavaScript is unavailable, hide search forms that cannot operate and show a bilingual static-browse fallback; do not submit named filter values to the query string.

Do not send search text, selected filter values, result/game IDs, URL query strings, form input, scores, account identifiers or history. Do not emit an event for an untouched catalogue, an empty search with no filters, a restored URL/history state or pagination. Do not replay an event after consent is granted. The event requires successful catalogue loading; load failures are not zero-result searches.

The analytics choice is versioned as `granted-v3`. Previous `granted` and `granted-v2` permissions are undecided and must be renewed before the new scope runs. Existing denials remain effective, analytics remains optional for play, consent withdrawal stops future events, and advertising consent remains separate. Do not alter provider account settings in this implementation.

## Consequences

Consented GA4 reports can show the number of searches with text, active-filter counts and result counts, including zero-result searches. They cannot reveal which words visitors typed, selected filter values or specific games in results. This on-site behavior signal complements but does not replace Search Console organic query, page, country, device, impression, click, CTR and position data. Event implementation and local payload tests do not prove provider receipt or dashboard configuration.

## Verification

Unit tests verify the consent version, route restriction, numeric bounds, minimized payload and no-event cases. Browser tests verify the previous permission is renewed, legacy query URLs are normalized before tag initialization, search state stays in the fragment, search events wait for consent and settled input, the consented home form records a loaded result count once, query text is absent, filter counts are aggregate and both query-free path and result count are sent. Verify consent disclosure in English and Korean, withdrawal, ordinary search behavior, `npm run verify` and browser regressions. After deployment, a consenting Search Console/GA4 owner must separately read the GA4 event in DebugView or Realtime; no property settings or receipt are implied by the source change.

## Primary guidance

- [GA4 enhanced measurement events](https://support.google.com/analytics/answer/9216061): automatic `view_search_results` uses a URL query parameter; automatic `page_view` can listen for browser-history changes.
- [Measure pageviews](https://developers.google.com/analytics/devguides/collection/ga4/views): the default `page_location` excludes the fragment, while disabling automatic history page views requires a property-level setting in addition to `send_page_view: false`.
