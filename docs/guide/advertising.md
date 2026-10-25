---
title: "Advertising"
summary: "Separate Google AdSense gates, optional Adsterra placements and owned-service promotions."
read_when:
  - Working on advertising
---

# Advertising

## Google AdSense and H5 ads

Google AdSense remains in `verification` mode in `src/data/ads.ts`. The site has no configured display slot IDs, and approval, certified-CMP, H5-approval and hosting gates are false, so `canServe()` blocks Google display and H5 requests. `AdSlot` stays hidden. Verification mode may add only configured verification metadata; it does not request ads.

If Google live serving is considered later, requests require configured publisher/slot IDs, site approval, verified Google-certified CMP integration and an affirmative policy decision from that CMP. A simple local consent toggle is not a substitute. If the CMP signal is missing, ads remain disabled.

The H5 callback contract is implemented, but H5 requests remain disabled until the approval and serving gates pass. If enabled later, offer them only between rounds, after two completed rounds and at least three minutes since the previous opportunity. Pause the game and mute before the request; recover to an explicit-resume state for completed, rejected, failed or no-fill callbacks. Do not use a timeout to remove a playing advertisement. Never programmatically click ads. Vehicle large-screen mode disables H5 until a recorded device test permits it.

`ads.txt` contains only explicitly authorized seller lines. The current Google seller line is configured in `src/data/ads.ts`; Adsterra did not supply a seller line, so none is guessed. Preserve existing iamdenny.com root sellers; root-domain approval and `ads.txt` delegation are separate operations. Account/site approval, H5 approval, CMP certification, actual serving and revenue remain separate evidence. GitHub Pages commercial-hosting suitability must be resolved before enabling Google live monetization.

## References

- [Google Ad Placement API callback sequence](https://developers.google.com/ad-placement/apis)
- [Google H5 game page code](https://support.google.com/adsense/answer/9955214?hl=en)

The API callback contract is implemented and tested locally; these links do not imply account approval. Never enable Auto ads or overlay formats on gameplay. Load the H5 SDK only after its gates pass; an unavailable SDK skips the placement. A script-loading timeout cannot dismiss an already playing advertisement.

## Provider setup — 2026-10-11

AdSense uses public publisher `ca-pub-3539037484563455`. The existing `iamdenny.com` site is under review; ads.txt authorization is already approved in the provider dashboard. Ordinary subdomains cannot be added independently. `games.iamdenny.com` now publishes verification metadata and its own exact seller record; the parent domain's two sellers and existing tools subdomain line are untouched. Verification is not live ad delivery.

The user completed Coupang MFA and authorized the compliance declaration. The games domain was saved to the existing channel list, preserving tools and modutt entries. `src/data/affiliate.ts` contains the provider-issued gamepad-search link and enabled gates. `AffiliateCard.astro` appears on home and game detail pages in both languages, and on the Korean gamepad diagnostic, controller-games guide and controller-not-detected guide. It remains absent from gameplay, search, library and English controller routes. This follows the Korean-market Coupang link and adds no tracking script. The limited hosting assessment is documented in ADR 0011 and is not a host endorsement. Do not put API keys in source. Capture the deployed visible placement for provider review. Maintain advertisement and commission notices in both languages; the footer distinguishes affiliate links from inactive Google ads.

The English/Korean contact pages also link to a structured public GitHub partnership inquiry for sponsorship, advertising placement and affiliate proposals. The form states that submissions and replies are public, requests no confidential business data, and makes any public contact channel optional. Do not publish audience figures, guaranteed reach, rates or campaign performance without evidence and approval.

See [ADR 0011](../adr/0011-provider-verification-and-affiliate.md). Provider approval, real requests, impressions and revenue must be recorded separately. This release does not claim any of them.

## Adsterra — 2026-10-23

See [ADR 0048](../adr/0048-adsterra-banners.md) for the provider-specific amendment to the earlier Google-only gates. Games site 6142646 and banner 31868961 are approved/active in the dashboard. The issued public code is in `src/data/adsterra.ts`. Adult ads were disabled on registration. Support confirmed completion of the owner-authorized Games-specific gambling/betting/casino/adult filter request, identifying site 6142646 and banner 31868961; `filtersConfirmed` is true. Support also confirmed the separately authorized account-wide gambling block completed; adult/erotic restrictions are website-level, not an account-wide adult filter. This is separate from approval and serving.

The adapter offers separate optional advertising consent on home, game details, category and all-games catalogues, collections with at least eight games and general guide pages, with immediate removal on withdrawal. Long collection pages place their single Adsterra banner after the first eight game cards. Category pages place it after the eighth currently rendered result; sorting and filtering keep it with the results, while pages with fewer than eight results or a catalogue error hide it. Short collections remain ad-free, and one issued Adsterra code is used per eligible page. Search may show a banner after at least eight successfully rendered results. A player page may show a separate banner below the full-height game surface; no ad overlays game controls. Device checks, gamepad diagnostics and library views remain ad-free. Google consent/approval and the existing static Coupang cards are unchanged. The frame loads only after Adsterra consent and may remain empty on no-fill or blocking; requests are not counted as rendered creatives. No Adsterra seller line was supplied, so existing `ads.txt` records are preserved.

`release.json` reports `adsterra-opt-in` when configured readiness gates pass, and separates the Google verification-only state from Adsterra consent-required state. These are configuration states, never proof of impressions or revenue.

## Outside-player display and original house banners

[ADR 0055](../adr/0055-compact-search-discovery-and-ads.md) supersedes the earlier search-route exclusion. One existing Adsterra placement may appear below at least eight successfully rendered results on the current search page. It stays hidden during loading, empty/sparse/error states and without JavaScript, even with saved consent. Result changes remove ineligible frames. Advertising consent stays separate from GA4; Google approval gates are unchanged.

[ADR 0053](../adr/0053-ad-placements-and-house-banners.md) permits a separate display placement below the full-viewport player and moves home/catalogue placements into visible content. It supersedes the earlier route-level exclusion; no advertisement covers game controls. The one-code-per-page rule and consent/provider gates remain. Existing original MODU TT and Tools images are served locally for random first-party promotion without third-party scripts.
