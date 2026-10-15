---
title: "Opt-in GA4 page views"
summary: "Measure page views only after consent, with URL and cookie scope limits."
read_when:
  - Changing website analytics or consent behavior
---

# Opt-in GA4 page views

## Status

Accepted — 2026-10-15.

## Context

Denny Games had no visitor analytics, and its privacy page promised that no remote analytics provider was configured. The site needs basic visit and page-view counts without collecting game activity or query text.

## Decision

Use the dedicated Denny Games GA4 property and the `games.iamdenny.com` web stream. Load the Google tag only after an explicit local choice to allow analytics. An undecided or declined choice sends no request to Google. A visitor can change the choice from the privacy page; withdrawal disables the tag and clears only the Denny Games-prefixed analytics cookies.

Send the default page-view event only. Override page location with the origin and path, and referrer with its origin. Do not enable Enhanced Measurement, Google Signals, advertising personalization, or gameplay events. Scope cookies to `games.iamdenny.com`, give them the `dennygames` prefix, and set a 60-day expiry. Keep the measurement ID public configuration; it is not a credential.

## Consequences

New and returning visitors who have not opted in are absent from GA4. Static full-page navigation supplies page views. Client-side catalogue filters do not count as separate pages. Query strings, fragments, search terms, form values, account identifiers, game inputs, scores and game events are excluded from the tag.

The site displays an English/Korean consent choice without blocking play. Advertising consent remains separate and the advertising script stays behind its existing certified-CMP and approval gates.

## Verification

Check that a fresh browser sends no Google Analytics request before consent and after decline, while an accepted production visit appears in GA4 Realtime. Confirm the request uses the intended measurement ID and a query-free `page_location`. Run the consent browser scenarios, repository verification and deployed public readback. See [search discovery](../guide/search-discovery.md) and the [2026-10-15 release record](../releases/2026-10-15-ga4-analytics.md).
