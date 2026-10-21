---
title: "ADR 0041 — Distinct home discovery previews"
summary: "Keep editor picks out of home genre previews and let each preview launch directly."
read_when:
  - Changing home editor picks or genre preview selection
  - Changing direct play actions on home game cards
---

# Distinct home discovery previews

Status: Accepted · 2026-10-21

## Context

The home page showed six editor picks followed by up to three games from each genre. Genre pages share editorial ordering, so some of the same titles appeared again immediately in the home previews. The current six picks appear in six genre rows. This reduced the number of distinct games visitors could scan in the preview area. Home genre cards also required opening a detail page before starting a game.

## Decision

Select up to six editor picks using the existing editorial order. For each genre preview, retain that genre's existing order, remove IDs selected for the editor-pick section, then show up to three remaining local games. Keep a genre heading with the exact full genre count and a link to the genre page even when no preview cards remain. Never fill a preview with duplicates or fabricated entries.

Use the existing `GameCard` direct-play action for home genre cards. Keep the title and artwork linked to the localized game detail page; the play action links to the same game's on-site player. Keep save as a separate control.

The full catalogue, category routes, default search order, random hero pool, recent-play list and collection artwork retain their own current behavior. Hero rotation may independently feature a game shown farther down the page.

## Consequences

With the current 207-game registry, the six editor picks and 21 genre-preview cards contain 27 unique IDs. The count is derived from the registry and preview rules, not stored as a product constant. Future categories or registry changes can produce fewer cards without inventing replacements. This improves visible variety; visits, play starts, retention and revenue remain unmeasured.

## Verification

Unit and browser checks assert that rendered home cards have unique IDs, genre previews exclude the selected editor picks, each preview respects its count and limit, empty previews preserve the genre route, and genre cards link directly to the correct local player. Verify Korean and English, no-JavaScript home links, mobile and tablet viewports, the complete catalogue, and the unchanged hero pool.
