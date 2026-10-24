---
title: "Inline advertising in category results"
summary: "Keep one consent-gated banner beside the first eight rendered category results."
read_when:
  - Changing Adsterra placement in category pages
---

# Inline advertising in category results

## Status

Accepted — 2026-10-24.

## Context

Category pages can show 24 games per page and let visitors sort or filter those results. The single Adsterra banner was placed after the entire grid, so it required scrolling past every result and did not follow the current result order.

## Decision

Place the existing category banner after the eighth result currently rendered on the page. Reposition it when sorting or filtering rebuilds the result grid. Hide it when fewer than eight results remain or the catalogue cannot load. Keep the same provider-issued code, separate optional consent, immediate withdrawal and one-placement-per-page limit.

## Consequences

Visitors encounter the existing consent choice and banner earlier in long category lists. This changes placement only; it does not add an Adsterra code or prove provider fill, impressions or revenue.

## Verification

In both locales at phone, tablet and desktop widths, verify that the banner follows exactly eight current results before and after sorting, causes no horizontal overflow, and does not reload the provider frame during sorting. Keep the existing sparse-filter and catalogue-error checks to verify that ineligible pages hide the banner and stop its frame.
