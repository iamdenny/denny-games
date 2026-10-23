---
title: "Optional Adsterra banners"
summary: "Provider-specific display consent and isolated home/detail banners."
read_when:
  - Working on Adsterra or advertising choices
---

# Optional Adsterra banners

## Status

Accepted — 2026-10-23, following the owner's explicit Adsterra integration request.

## Context

The prior Google integration is verification-only. Adsterra has now approved games.iamdenny.com (6142646) and its 300×250 banner (31868961). The earlier support filters covered other domains, not Games. The owner authorized a separate Games filter request for gambling, betting, casino and adult advertisements. Support confirmed the Games-specific request completed on 2026-10-23 KST. Support also confirmed the later authorized account-wide gambling block completed, with adult/erotic ads disabled at website level.

## Decision

Keep Google approval and certified-CMP gates unchanged. This provider-specific decision supersedes the generic wording of ADR 0007 only for Adsterra: use a separate, explicit opt-in for its isolated banner, never analytics consent. This is not a Google-certified CMP or a representation of legal certification. No provider requests occur before that choice. Withdrawal removes the frame, stops future loads and propagates to open tabs. Storage failure permits an in-page choice without requiring persistence.

Use the exact issued public key and HTTPS script, with no more than one Adsterra placement per page until a distinct provider-issued code is available for another slot. Coverage includes home, game information, category and all-games catalogues, collections, and general guides. Do not place banners in gameplay, search, device-check or gamepad-diagnostic pages, or the library. Keep labels and privacy explanations bilingual. No popunder, Social Bar, redirect, reward or automated ad click. The frame uses an opaque data URL, no referrer and denied camera/microphone/geolocation; its origin cannot access game storage or page content. Never substitute a same-origin URL or srcdoc while allow-same-origin is present.

The current 300×250 code is reused once on each eligible route and must never be duplicated on the same page. Adsterra recommends a unique code for each same-size placement so reporting stays attributable; request a separate code before adding another Adsterra slot to a page. The current zone's dashboard totals therefore combine its eligible routes.

Require site approval and separately confirmed Games category filtering before emitting the banner. Do not treat an unanswered support request as filter completion. Public seller records are added only if the provider issues an exact record; no guessed Adsterra ads.txt line.

The hosting assessment extends the limited incidental monetization assessment in ADR 0011 to this single optional banner: the primary service remains a free static arcade, with no checkout, paid access or store. This is an internal assessment, not GitHub approval; move hosting if the host objects or the service becomes primarily commercial.

## Verification

Intercept provider requests in automation. Check no requests before consent or after withdrawal, separate analytics state, storage failure, cross-tab revocation, absence from players, narrow widths and no-fill. Distinguish build, deployed adapter, actual creative, category filter confirmation and revenue evidence.

## References

- [Adsterra privacy policy](https://adsterra.com/privacy-policy/)
- [Adsterra publisher guidance](https://adsterra.com/blog/monetize-website/)
- [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
