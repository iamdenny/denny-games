---
title: "Search and AI discovery"
summary: "Static, attributed bilingual content with honest search evidence."
read_when:
  - Changing SEO or AI discovery
---

# 0010 Search and AI discovery

## Status

Accepted, 2026-10-11.

## Context

The expanded catalogue needs distinct paginated metadata, contextual language alternates and useful attribution. Search and AI citation eligibility depend on crawlable content; implementation alone cannot prove indexing or citation.

## Decision

Keep rules, controls, authors and source links in static HTML. Generate WebSite, Organization, WebPage, VideoGame, BreadcrumbList and page-local ItemList nodes from the same registry as visible content. Use page-specific titles, descriptions and canonical URLs. Deep x-default links go to the equivalent English page; language home pages use the language selector. Repeat reciprocal language links in the sitemap. Preserve noindex on play, search, library and diagnostics, allowing crawlers to read that directive.

Add an attributed bilingual catalogue guide with clear free-play, redistribution, saving and device-support boundaries. Do not invent ratings, device certification or publication/update dates. Raster share previews use actual game screenshots where available. Related titles come from the same category.

Do not introduce AI-only keyword pages, special bot cloaking or claims that an llms.txt file guarantees discovery. No new tracking provider is required. Search-console ownership and sitemap submissions are recorded separately from deployment and observed indexing/citations.

## Consequences

Static HTML and sitemap checks run at every build, including uniqueness across locales and pagination. Schema communicates entities but does not imply rich-result eligibility. Editorial descriptions need to stay aligned with the catalogue. The approach remains free on GitHub Pages.

## Verification

`npm run verify`, browser regressions and `npm run seo:check -- --base https://games.iamdenny.com` verify output and public delivery. Console submissions and search outcomes require independent evidence. See [search operations](../guide/search-discovery.md).
