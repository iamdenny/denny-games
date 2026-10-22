---
title: "Static cross-promotion banners"
summary: "Show official MODU TT and Everyday Tools banners in existing content ad positions."
read_when:
  - Changing house promotions or advertisement placements
---

# Static cross-promotion banners

## Status

Accepted — 2026-10-22.

## Context

The site owner requested banners from MODU TT's brand page and Everyday Tools' Korean promotion page, linking to each home page.

## Decision

Render both brands in the existing content ad positions with an English/Korean advertisement label and accessible home-page links. Use locally hosted, unmodified official PNGs and responsive picture sources. Keep provenance URLs, retrieval date, hashes and the scope of owner authorization with the assets.

House promotions are separate from Google display slots and require no SDK, third-party image requests, consent tracking or ad approval. Preserve the existing Google gates and hidden slot behavior. Keep the existing page boundaries: no house banners in gameplay, search, personal library or diagnostics.

## Consequences

The content pages gain visible static promotions even while Google serving is disabled. The supplied Korean artwork is preserved on both locales; alt text and link labels are localized. Links use the current tab and go to `https://modutt.kr/` and `https://tools.iamdenny.com/`. Asset use is scoped to the owner's request, not a general redistribution license.

## Verification

Check both links and image loads at 320, 390, 430 and 1440px, image source changes, absence from excluded routes and absence of requests to the promoted sites before a click. Run full verification and browser tests before merge, then read the public pages and assets after deployment.
