---
title: "Daily challenge sharing"
summary: "Let players invite a friend to the same current daily game."
read_when:
  - Changing daily challenge sharing or launch links
---

# Daily challenge sharing

## Status

Accepted — 2026-10-18.

## Context

The daily page links to the same three deterministic games for every visitor, but its cards did not offer a direct invitation. General game and collection shares use canonical landing pages under ADR 0036; a challenge invitation should open the selected game directly in its current daily mode.

## Decision

Add a localized share action to each supported daily challenge card. Reuse the existing native share, clipboard and manual-copy behavior. Share the same-site `/play/{id}/?daily=1&stage=1` launch URL so the player uses the current UTC daily seed and starts at stage 1. The date is resolved when the recipient opens the link; the challenge changes at 00:00 UTC.

The launch URL contains no score, identity, saved state, referral identifier or campaign tracking. The player remains noindex and its canonical omits the query. GA4 continues to send consented page views only with query strings removed; no new analytics events or remote gameplay data are added. With JavaScript disabled, the manual link remains available.

## Consequences

Players can send a friend directly to the selected on-site challenge. Sharing a link does not prove that it was delivered, opened or played. The invite is for the current UTC day, so recipients who open it after rollover receive the new day's board.

## Verification

Browser checks verify the English and Korean share title and label, exact same-site daily launch URL, native share payload, manual-copy fallback without JavaScript, successful stage-1 launch, and no horizontal overflow on phone and tablet widths.
