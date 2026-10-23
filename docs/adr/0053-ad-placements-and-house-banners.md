---
title: "Outside-player advertisements and owned-service banners"
summary: "Visible display placements with stable original promotional images."
read_when:
  - Changing advertising placements or cross-site promotion
---

# Outside-player advertisements and owned-service banners

## Status

Accepted — 2026-10-23, following explicit owner instructions. Supersedes the no-player-route wording in ADR 0048 only for an ordinary content section outside the game.

## Decision

Keep one issued Adsterra placement per eligible page. Move the home placement after curated games and put the all-games placement after eight cards. A player route includes a separate section below the full-viewport game, never an overlay or an interruption. Moving focus to a promotion pauses play without stealing focus. The player keeps its viewport height and controls; the document can scroll to the advertisement and return. Consent, opaque iframe isolation, provider approval and category gates are unchanged. Google remains verification-only. A shortcut above the page content points to advertisement settings where that placement exists.

Use the owner's existing MODU TT and Everyday Tools image banners for first-party cross-promotion. Select once per rendered banner on page initialization, without cookies, telemetry, timers or changes while focused. Keep meaningful server-rendered fallback links. Only local images load before a visitor follows an external link, which opens a labeled new tab with noopener and noreferrer. Image containment reserves a fixed responsive area and preserves original artwork.

## Asset provenance

The owner explicitly requested reuse from <https://modutt.kr/brand> and <https://tools.iamdenny.com/ko/promo/>. Downloaded originals on 2026-10-23:

- `/house-banners/modutt-wide.png`: `https://modutt.kr/brand/modutt-wide-light.png`, 2400×600 PNG (logical 1200×300).
- `/house-banners/modutt-mobile.png`: `https://modutt.kr/brand/modutt-mobile-light.png`, 640×200 PNG (logical 320×100).
- `/house-banners/tools-banner.png`: `https://tools.iamdenny.com/promo-assets/2026-10/everyday-tools-ko-banner-1500x500.png`, 1500×500 PNG.

These are owner-authorized brand assets, not newly licensed third-party game assets. Preserve original Korean artwork, identify it on English pages and localize link labels. Destinations are the original service roots or locale homepage. No claims about traffic, revenue or endorsement are added.

## Verification

Exercise both languages and narrow/desktop viewports with intercepted provider requests. Check denied/allowed/withdrawn state, cross-tab withdrawal, placement outside player, stable first-party selection, original image ratios and overflow. Source changes do not establish advertising fill, earnings or deployment on other repositories; record release and live observations separately.
