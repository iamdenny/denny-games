---
title: "Provider verification and affiliate links"
summary: "Separate AdSense ownership metadata from live ads and Coupang affiliate publication."
read_when:
  - Configuring advertising providers or publishing affiliate links
---

# Provider verification and affiliate links

## Status

Accepted — 2026-10-11.

## Context

The user requested AdSense and Coupang monetization. The existing AdSense account lists iamdenny.com as under review and its ads.txt as authorized. Ordinary subdomains are not separate AdSense site entries. The user completed Coupang authentication and explicitly confirmed the channel compliance declaration. The games domain was saved to the existing account and a gamepad-search link was issued.

## Decision

Publish the observed public AdSense publisher ID and seller record in verification mode. This emits metadata only, with no SDK, Auto ads, slot requests or H5 requests. Preserve root iamdenny.com sellers without modifying that separate property.

Publish a static Coupang card on home and game detail pages, plus Korean controller-intent pages: the local gamepad diagnostic, controller-games guide and controller-not-detected guide. Keep every card separate from gameplay. A real provider-issued HTTPS link, registered channel and documented hosting decision are mandatory. The registered games channel and issued link are configured. No third-party embed, image or script loads before a click; each visible card includes the advertisement label, commission disclosure and sponsored link relationship. A purchase never grants game rewards. English controller routes do not show the card because the provider link targets a Korean shopping service.

## Consequences

AdSense parent-domain review remains pending. CMP and Google site approval remain false, as in ADR 0007. Coupang channel registration, link issuance, final approval and settlement are distinct external states. For the limited static affiliate placements, hosting suitability is an internal assessment: the primary experience is free open browser games and editorial information, with no store, checkout, paid access or commercial SaaS. The disclosed text affiliate placements remain incidental and do not make facilitating transactions the primary purpose. This is not GitHub authorization or a blanket allowance for a commercial business; re-evaluate and move the same static artifact to suitable free hosting if the product becomes primarily commercial or the host objects. The Google display/H5 hosting gate remains false until the broader live-ad rollout is assessed.

## Amendment — 2026-10-14

The earlier home/detail-only placement left the most relevant controller discovery and diagnostic paths without a purchase link. Add the same disclosed static card to the three Korean controller-intent routes above; do not add it to gameplay, search, library, or unrelated guides. This is a contextual link placement, not a product recommendation or device-compatibility claim. The hosting assessment remains incidental to the free arcade experience.

## Verification

Build auditing rejects affiliate cards in players. Unit tests reject unregistered channels and unsafe/unissued link hosts. Browser tests confirm metadata, exact seller record, Korean-only controller-intent placement and no provider network requests in verification mode. Release requires fresh channel readback, bilingual disclosures and narrow-layout checks. Provider final approval and revenue remain unverified.

## References

- [AdSense site management and subdomains](https://support.google.com/adsense/answer/12170421?hl=en)
- [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [Coupang Partners](https://partners.coupang.com/)
