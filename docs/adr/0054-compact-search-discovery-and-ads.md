---
title: "ADR 0054 — Compact search, discovery and optional ads"
summary: "Prioritize mobile game results while connecting canonical answers, consented GA4 and bounded search advertising."
read_when:
  - Changing search filters, discovery answers or search advertising
---

# Compact search, discovery and optional ads

## Status

Accepted — 2026-10-23. Supersedes the search-ad exclusion in ADR 0048; retains the search indexing contract in ADR 0052 and one-placement/consent rules in ADR 0053.

## Context

Four expanded search filters push mobile game results below the initial viewport. The owner also requires SEO, GEO, Google Analytics and advertising to accompany product improvements. Existing GA4 instrumentation already covers consented page views and game starts/completions; Google ads remain verification-only, while Adsterra uses separate optional consent.

## Decision

Use a native details disclosure for all four filters. It starts closed below 700px and open on larger screens, with the count of active filters visible when closed. Keep native keyboard operation, no-JavaScript access, URL state, history and language changes. Submitting on a phone closes the controls so results are easy to reach. Do not force disclosure changes when the viewport resizes.

Enrich the existing canonical bilingual board-game guide with visible solo/shared-device answers and direct filtered search links. Link that guide from search and describe its answer scope in llms.txt. Keep search noindex and preserve canonical/hreflang, sitemap and truthful structured data on indexable content. Do not add thin landing pages, keyword stuffing or invented popularity claims.

Retain the existing GA4 destination and consent scope. Check that search page-view commands exclude query strings/fragments and that advertising permission does not grant analytics permission. Do not send search terms, filter values or extra custom events. Google approval gates remain unchanged.

Add at most one existing Adsterra placement below search results. It begins ineligible, including with saved consent, and becomes eligible only after a successful search renders at least eight games on the current page. Sparse, empty, failed and no-JavaScript searches remain ineligible. Hiding eligibility removes the ad frame; withdrawal continues to stop future requests. No advertisement appears above the search results or inside game controls. Update bilingual privacy and guide wording to match this scope.

## Consequences

The mobile search shows games earlier, canonical guides answer selection questions, and sufficiently populated search pages can offer optional advertising. Source integration and synthetic request tests do not prove Google approval, real ad fill/revenue, GA4 dashboard receipt, indexing, ranking or AI citations.

## Verification

Exercise collapsed/expanded keyboard controls, active counts, URL state, mobile submit and initial result position. Test both guide languages and index boundaries, GA4 consent/payload sanitization, separate ad consent, sparse results, initial loading errors and frame removal using intercepted provider requests. Run existing search, advertising and analytics regressions, repository verification, CI and post-deployment public readback. Physical-device and provider-console results remain separate evidence.
