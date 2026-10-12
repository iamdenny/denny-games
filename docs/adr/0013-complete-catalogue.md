---
title: "ADR 0013 — Complete static catalogue"
summary: "Separate home previews from the exhaustive, crawlable game catalogue."
read_when:
  - Changing catalogue navigation, pagination or published game counts
---

# Complete static catalogue

Status: Accepted · 2026-10-12

## Context

The deployed registry contains 194 unique games, but home displays 21 preview cards and the All games menu points home. Curated collections cover only selected games. That presentation makes the published count difficult to verify.

## Decision

All games navigation points to `/en/all/` or `/ko/all/`. Static routes `/all/page/N/` expose the entire registry in stable registry order, 24 per page. Show total count, current range and page, category counts, search/filter access and top/bottom native pagination. At larger scale, numbered links use a bounded window plus first/last and previous/next links. Home explicitly identifies previews and links to the complete list.

Each page is independently canonical and indexable, with reciprocal language links, unique metadata, sitemap entry and CollectionPage/ItemList matching its rendered cards. Browsing the full list requires no JavaScript or index download. Search remains the separate noindex filtered view; game engines still load only in players. Existing advertising placements and gates are unchanged.

## Verification

Build/SEO audits compare concatenated catalogue card IDs with each localized search index, in order and without duplicates. The private 1,000-entry fixture checks all 42 pages. Browser regressions follow native next links through every real game with JavaScript disabled, verify responsive layout and preserve the numbered page on language navigation. Public release SHA and both complete catalogue sequences are checked after deployment. File visibility does not certify physical devices or full-game completion.
