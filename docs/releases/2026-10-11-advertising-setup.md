---
title: "Advertising provider setup"
summary: "AdSense verification metadata and registered Coupang integration with publication gates."
read_when:
  - Reviewing advertising setup delivery evidence
---

# Advertising provider setup — 2026-10-11

## Changes

- Configure the observed AdSense public publisher ID in verification mode and publish its seller record at the games subdomain's ads.txt.
- Publish a responsive static Coupang affiliate card for home/detail pages, requiring registered channel, issued link and hosting suitability. The link targets gamepad search, without product-price or device compatibility promises.
- Explain verification and optional affiliate purchases in English/Korean privacy pages. Keep all third-party ad scripts inactive and players free of affiliate/display placements.

## External state

AdSense iamdenny.com is already under review, with ads.txt authorized. No new review request is necessary for an ordinary subdomain. Coupang MFA was completed by the user, who explicitly authorized the compliance declaration. Channel registration and link issuance completed. Final provider approval and revenue are not established. Live display/H5 approval, certified consent, Google live-ad hosting suitability and actual Google serving are pending. The incidental static affiliate hosting assessment is recorded in ADR 0011.

## Verification

`npm run verify` passed (19 unit tests, types, docs, scale, static artifact and 441-page SEO audit). All 210 Chromium tests passed, including provider-network isolation and affiliate overflow checks at 320/390/430px. Desktop card was visually checked in Chrome. Verify the exact publisher meta tag and ads.txt in the public deployment, plus absence of ad scripts and presence of one labeled affiliate card on home/detail only. Preserve existing parent-domain seller records. Record CI, merge and deployment evidence outside the public site; no account credentials enter the repository.

## Deployment-discovered pause regression

The first main CI and Pages build each failed an existing imported-game pause test (FORFOUR / G PRESS). Trace and a controlled delayed pointer click reproduced a pre-existing focus race: frame blur pauses the game between pointer-down and click, so the click toggled back to running. Player/bridge sources were unchanged by the advertising PR. The fix captures pause/resume intent at pointer-down while preserving keyboard activation and automatic focus pausing. A regression fails on the prior build and passes with the fix; no retry or timeout increase hides the defect.
