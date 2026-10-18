---
title: "Game learning and canonical sharing"
summary: "Enrich existing game entry pages with worked rules, comparison and explicit sharing."
read_when:
  - Changing game discovery, learning content, search metadata or sharing
---

# Game learning and canonical sharing

## Status

Accepted — 2026-10-18.

## Context

Existing pages already have crawlable rules, canonical URLs, language pairs and a sitemap. Short rule lists can leave newcomers unsure how a move resolves or which same-device game to choose. The next change should help a visitor understand and introduce a game without assuming that additional catalogue pages will bring traffic. Private analytics reports remain in their authorized reporting channel.

## Decision

Enrich the existing bilingual 2048 and Gomoku detail URLs. Render 2048 move examples in static HTML using the actual merge function at build time, explicitly before a new random tile appears. Explain single-merge semantics, full-board legal moves and this version's round end. Gomoku explains freestyle lines, overlines, absent forbidden moves and the same-device mode. Add a rules-based choice list to the existing five-game classic-board collection and link to these sections from home. Keep the quick-play and collection ordering from ADR 0029.

Allow optional localized search titles in typed game copy. Keep the ordinary game name in cards and the heading; keep canonical URLs, language alternates, sitemap membership and index boundaries. Correct the number-puzzle collection's save answer to describe only its member games.

Offer sharing on game detail and collection pages. Share a build-generated canonical landing URL with no query strings, seed, score or saved state. Invoke Web Share only on a button press; fall back to copying the URL and then to a selectable manual address. Cancellation does not copy. Disable repeated clicks while a share is pending. A manual address remains accessible without JavaScript. No sharing action sends new analytics or changes progress or consent.

## Consequences

Newcomers can learn a move, choose a game and share its explanatory landing page. These are product and discovery improvements, not evidence of increased search visibility, CTR or visits. No extra indexable routes or client game-engine imports are introduced. Native sharing availability and actual delivery depend on the browser and chosen target.

## Verification

Run the repository verification and browser suite. Browser regressions cover JavaScript-disabled navigation, merge examples, bilingual narrow layouts, canonical-only sharing, native rejection, cancellation and manual recovery. Check public HTML after Pages deployment. Track subsequent Search Console impressions/clicks and consented GA4 acquisition on these existing URLs using actual completed periods; keep small samples and processing delays explicit. Account settings and manual provider submissions are outside this change.
