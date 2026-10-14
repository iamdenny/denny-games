---
title: "Hextris responsive adapter"
summary: "Pin GPL-3.0-or-later Hextris source and provide responsive touch controls, pause, local progress, and an isolated no-network runtime."
read_when:
  - Changing the Hextris import or host adapter
---

# Hextris responsive adapter

## Status

Accepted — 2026-10-14.

## Context

Hextris is a distinct, quick hexagonal block-matching puzzle with an upstream browser implementation and existing touch input. At research time its GitHub repository showed roughly 2.4k stars. Repository stars indicate developer interest, not player counts or search demand. The upstream runtime also included advertising, analytics, external score reporting, small image controls and English-only help text.

## Decision

Pin the complete upstream repository at `3f4847dc8fd7dab3d1c87e6324b9159d92fbd396`, record every file hash and retain its GPL-3.0-or-later license. Preserve the runtime's original game code and patch only checked build-time anchors. Remove upstream ads, analytics, social popups and the score-reporting request. Serve the game in an `allow-scripts` opaque-origin frame with a no-network CSP and bounded local-storage bridge.

Keep upstream tap-on-either-side rotation and add large, labeled left/right buttons in the common player controls. Map keyboard and standard gamepad left/right to the same action. The host owns start, pause, resume and restart. The opaque frame checkpoints the current board and high scores every 500 ms and after rotation or pause; in-site language switching waits for the host to confirm that the fresh checkpoint was captured and written to browser storage. If capture or persistence fails, stay on the current page and show a save error. A hard reload restores the latest completed checkpoint. Translate the opening tutorial, visible high-score and pause labels while leaving the original game artwork and bitmap title intact.

## Consequences

The catalogue grows from 201 to 202 games, with Hextris in arcade. The square stage is bounded by the available viewport and keeps the game canvas square. The shared shell does not show irrelevant sound controls. The published source page includes the exact GPL text and runtime dependency notices.

Automated Chromium evidence covers both locales, source links, sandbox isolation, no foreign requests, touch-button sizing, board rotation, pause, and save restoration. It does not establish real phone, physical controller, Tesla, or player-popularity evidence.

## Verification

`npm run verify`, the focused Hextris browser journey, and `graphify update . --no-cluster` are required. After deployment, inspect English/Korean detail and play routes, license files, source, sitemap, and the production game runtime.
