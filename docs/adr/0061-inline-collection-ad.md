---
title: "Inline advertising in long game collections"
summary: "Place one consent-gated display ad after the first eight cards in longer collections."
read_when:
  - Changing advertising placement in game collections
---

# Inline advertising in long game collections

## Status

Accepted — 2026-10-24.

## Context

Long curated collections can contain 100 game cards. Placing the optional advertisement after the full list leaves it too far from the start of the page to be discoverable.

## Decision

For collection pages with at least eight games, insert the existing single Adsterra banner after the eighth card in the game grid. Preserve the separate optional consent choice, immediate withdrawal, provider gates, responsive frame and one-placement-per-page rule. Short collections remain ad-free, and ads remain outside live gameplay.

## Consequences

Visitors can reach the existing ad and its privacy choice after browsing the first eight games instead of scrolling through the entire collection. This changes placement only; it does not increase ad frequency or prove provider fill, impressions or revenue.

## Verification

Check that both locales render exactly one banner after eight collection cards at phone, tablet and desktop widths; verify no horizontal overflow and no provider request before consent. Run repository verification and browser tests, then read back the deployed collection page. Ads are still subject to provider fill and browser blocking.
