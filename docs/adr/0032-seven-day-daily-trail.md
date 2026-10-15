---
title: "Seven-day daily challenge trail"
summary: "Retain a bounded, browser-local view of daily challenge completion."
read_when:
  - Changing daily challenge history or its storage
---

# Seven-day daily challenge trail

## Status

Accepted — 2026-10-15.

## Context

ADR 0030 records only the current UTC date in the daily completion key. At the next UTC rollover, the home summary resets and the previous day's activity disappears from the interface, making it harder to pick up a recent play session.

## Decision

Keep completion buckets for the current UTC date and six preceding UTC dates in the existing browser-local key. Each bucket may contain only the three supported game IDs, positive rules versions and finite nonnegative best scores. Ignore dates outside the window, malformed records and unsupported games. Convert the existing one-day shape to the trail in memory when read and preserve its valid date and results.

Show seven noninteractive date cells and the number of supported challenges completed on each date on the home summary and daily route. Count a game only when its stored rules version matches the current registry. Use explicit UTC dates and localized labels. Describe the history as local; make no streak, ranking, reminder, reward or measured-retention claim.

This decision supersedes the single-date retention and display boundary in ADR 0030. Its rules for qualifying a completion, stage 1, local storage, UTC rollover and next-challenge navigation remain in force.

## Consequences

The record remains bounded to seven dates and needs no account or server. Existing one-day data remains visible during the window. Clearing or blocking browser storage can erase or prevent history. The trail offers a short recap; it does not prove that players return or that engagement increases.

## Verification

Unit and browser checks cover legacy-record continuity, date-window bounds, expired and future records, a real completed round across UTC rollover, English and Korean copy, narrow mobile layout, static challenge links and denied storage. Production release evidence must separately report CI, deployment and public readback; physical-device behavior and player retention remain unverified by browser automation.
