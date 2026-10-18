---
title: "ADR 0038 — Local-play-only public catalogue"
summary: "Publish games only when their player runs on Denny Games."
read_when:
  - Publishing, importing or removing a browser game
---

# Local-play-only public catalogue

Status: Accepted · 2026-10-18

## Context

The public catalogue included 149 entries whose play buttons opened another host. Visitors reasonably expected games listed on Denny Games to run here. Free browser access also does not grant redistribution rights, and several researched candidates have proprietary or unpublished code, assets, service terms or runtime requirements.

## Decision

Every entry in the public `games` registry must have an in-site `/play/{id}/` route. Exclude games that require a third-party gameplay host, remote game server or external lobby. Search results, home cards, detail actions, sitemap, `llms.txt` and catalogue totals derive from this local-play registry.

Keep source and license links for attribution on locally playable games. Research about external hosts stays in `vendor/external-browser-listings.json`; its old catalogue illustrations are archived in `vendor/external-listing-art/`, outside the public build. Neither is a public game listing or play destination. Do not copy code, assets or game data unless redistribution rights cover each component. A candidate can return to the public catalogue only after rights review, local integration and automated playable journeys pass.

## Consequences

The public catalogue has 207 playable titles and no external-play entries after this change. The 149 outbound listings are removed from public game, search and sitemap routes, and their 149 unused illustration files are removed from public asset URLs. Their research records and artwork remain in `vendor/` to guide later import decisions. Search engines will encounter removed game and artwork URLs as 404s and will no longer receive game routes from the sitemap.

This narrows the public catalogue until more candidates are imported or replaced with original games. It prevents visitors from leaving Denny Games to start a listed game and avoids presenting another host's privacy, account, save or compatibility behavior as ours. It does not prove physical-device compatibility, popularity, traffic or revenue.

## Verification

Unit tests assert that all public registry entries lack `externalPlay`, archived candidates are absent, and archived artwork is outside `public/`. Browser tests check in-site launch actions, representative retired routes, and search-index fields at phone and tablet viewport sizes. `scripts/verify-public.mjs` checks the deployed SHA, all published local routes, absence of external play metadata, and 404 responses for every archived external listing and former artwork URL.
