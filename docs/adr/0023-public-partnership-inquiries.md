---
title: "Public partnership inquiries"
summary: "Use a disclosed GitHub issue form for inbound sponsorship and affiliate proposals."
read_when:
  - Changing the public partnership inquiry path
---

# Public partnership inquiries

## Status

Accepted — 2026-10-14.

## Context

Denny Games has affiliate links but no public business inquiry channel. The repository is public and GitHub Issues are enabled. No verified audience metrics or authorized business email are available for a sponsorship page.

## Decision

Offer sponsorship, advertising placement and affiliate proposals through a bilingual contact-page link to a structured public GitHub issue form. State on the page and form that the issue and replies are public. Do not request confidential business terms, credentials or private contact details. Allow a submitter to include a public business contact only if they consent to publishing it.

Do not claim traffic, audience reach, placement availability, rates or results. Review proposals individually against the product, rights, advertising and hosting rules before accepting anything.

## Consequences

The inquiry path needs no private data store, personal email publication or third-party form script. GitHub processes the issue and displays it publicly under its own service terms. This creates a way to receive proposals; it does not establish sponsor demand, an agreement or revenue.

## Verification

Browser tests cover both locale contact pages, the form URL and the public-visibility warnings. Verify the merged template is shown by GitHub before reporting the inquiry path available.
