---
title: "Browser language entry"
summary: "Root visitors open the first supported browser language automatically, with English fallback and explicit locale URLs preserved."
read_when:
  - Changing initial locale selection or root navigation
---

# Browser language entry

## Status

Accepted — 2026-10-12. Extends ADR 0003 for root entry behavior; its static language pairs, canonicals and indexing boundaries remain in force.

## Context

The root language selector adds an unnecessary step before browsing games. Static GitHub Pages hosting cannot negotiate a response using request headers.

## Decision

Run a small inline script in the root document head before rendering the selector. Read `navigator.languages` in preference order, falling back to `navigator.language` when the list is unavailable or empty. Match `ko` and `en` case-insensitively, including regional tags. Open the first supported language's home; use English if none matches.

Use `location.replace` to avoid a back-button redirect loop and preserve query parameters and the fragment. Only `/` performs automatic selection. Explicit `/en/` and `/ko/` routes and language links retain the visitor's chosen URL. Do not require storage, cookies or a network language-detection service.

Keep the root static HTML, canonical, x-default, ownership verification metadata and bilingual links available for JavaScript-disabled visitors and static readers.

## Consequences

Normal first visits go straight to a localized catalogue home. With JavaScript disabled, visitors can still choose either language manually. This requires one client navigation on static hosting and does not add server-side redirects or additional translated languages.

## Verification

`tests/e2e/locale-entry.spec.ts` covers real browser locale settings, ordered preferences, regional/case matching, unsupported/empty language fallback, query/fragment preservation, explicit routes, manual switching, back navigation and JavaScript-disabled links/metadata. Run the repository verification and Chromium browser suite before release; read back the deployed root with both supported browser locales afterward.
