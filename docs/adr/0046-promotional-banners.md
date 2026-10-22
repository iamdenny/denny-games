---
title: "Promotional banner kit"
summary: "Bilingual static PNG banners and a footer-linked download page."
read_when:
  - Updating promotional assets or the banner download page
---

# Promotional banner kit

## Status

Accepted — 2026-10-22.

## Context

Site owners need ready-to-use Denny Games banners for external websites, mobile placements and social posts.

## Decision

Publish `/en/promote/` and `/ko/promote/` through the shared static route registry and link them from the site footer. Supply ten exact-pixel PNG sizes per language: 728×90, 970×250, 300×250, 336×280, 160×600, 300×600, 320×50, 320×100, 1080×1080 and 1080×1920. Provide responsive previews, native download links and selectable embed HTML without requiring JavaScript.

Use original typography and geometric numbered tiles in the Arcade Press palette. These illustrations are promotional graphics, not gameplay screenshots. No third-party game artwork, popularity metrics or compatibility claims are included. The destination is the matching localized home page.

## Consequences

Committed PNG assets work without runtime rendering or external fonts. `node scripts/generate-promo.mjs` rebuilds them using installed Playwright Chromium and local system fonts; font rendering can differ between systems. These assets may be used to promote Denny Games while preserving branding and without implying endorsement. Publisher acceptance and upload limits remain publisher-specific.

## Verification

Check both localized pages, footer navigation, PNG dimensions, downloads, embed destinations and overflow at desktop and 320–430px widths. Local browser checks do not prove advertising-network acceptance or a deployed release.
