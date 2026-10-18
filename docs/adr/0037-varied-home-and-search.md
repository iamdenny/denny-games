---
title: "ADR 0037 — Varied home picks and visual search results"
summary: "Show a wider range of real game styles on home and let visitors compare and launch search matches directly."
read_when:
  - Changing home game discovery or search-result presentation
---

# Varied home picks and visual search results

Status: Accepted · 2026-10-18

The external-host result routing described below was superseded on 2026-10-18 by [ADR 0038](0038-local-play-only-catalogue.md). Published search results now contain only games with an in-site player.

## Context

The first six home picks were five board games and one arcade game. Search results exposed only a title and short text, so visitors could not scan game art, control style or expected round length, and had to open a detail page before launching an internally hosted game. Genre navigation also disappeared from the main viewport on compact layouts.

## Decision

Keep the existing six-pick editorial system and its shared ordering across home, all-games, category and default-search surfaces. Reorder the opening six picks to cover arcade, puzzle, action, shooting, sports and board games. Give each a bilingual explanation grounded in its actual controls or rules. They remain editorial choices, not popularity or engagement claims.

Place links to every published genre below the quick-play feature and before the collection cards. Use the existing real category routes, horizontally scrollable on narrow screens, with visible focus and large touch targets. Keep the quick-play picker directly below the compact introduction so its playable artwork stays near the top of the page.

Render search matches as bilingual, image-led cards with real category, description, estimated round length and play-style metadata. Preserve the landscape artwork ratio and 48px action targets at phone widths. Every published game launches from its result card on Denny Games. Preserve filter, query, URL history, pagination, no-JavaScript collection fallback and search index boundaries.

Share play-style labels through a small data module so the search page does not import the full game registry to render client-side results.

## Consequences

Visitors can scan a broader set of genres and see what a game asks of them before choosing it. In-site launch takes one step from search. The static genre routes remain crawlable and existing localized search pages remain noindex. Artwork, expected duration and editorial reasons do not prove user preference, compatibility, gameplay success or search ranking.

## Verification

Unit and browser checks assert six distinct opening genres, stable pick order, real category links without JavaScript, real artwork and play-style metadata in search results, landscape artwork and 48px actions at phone widths, direct in-site launch, and layouts without horizontal page overflow at phone widths. Repository verification, browser runs and public release readback are recorded in the release note.
