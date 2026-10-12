---
title: "Post-deployment IndexNow notifications"
summary: "Notify IndexNow after Pages deployments that change indexable page inputs."
read_when:
  - Changing search discovery submissions or post-deployment verification
status: "in-progress"
date: "2026-10-12"
base_commit: "f125b8ee43068e8955efffc64c7aa07289c8b95a"
tier: "L"
test_approach: "tdd"
---

# Post-deployment IndexNow notifications

## Overview

After a successful Pages deployment, notify IndexNow once when an allowlisted, indexable-page input changed. Confirm the public release SHA matches the deployed workflow SHA, read and validate the canonical sitemap, then submit only unique URLs mapped to the affected route family. Shared page shell, routing and SEO changes may affect the complete sitemap. Host the public verification key at `/{key}.txt`. A 200 or 202 response is a submission receipt, not evidence of crawling, indexing, ranking, visits, or AI citations.

The live public verifier also had a stale 21-home-card ceiling; replace it with counts derived from the rendered curated and category sections and check them against the full localized search index.

## Scope

- Add a dependency-free Node client with pure, unit-tested change gates, sitemap parsing/validation, request handling, and warning output.
- Skip manual dispatch, reruns, missing/zero base SHA, and diffs without allowlisted page inputs. Deleted paths count as changed inputs.
- Submit only after successful deployment and matching public release SHA. API or network failure remains visible and non-blocking to the deployment.
- Add a public 32-character hex key; it is a protocol ownership proof, not a secret.
- Update search/deployment docs and add ADR 0018.
- Correct the public home-preview verifier's hard-coded cap.

Out of scope: Google, Bing, or Naver console access; analytics; page-content changes; game/runtime changes; claims of search outcome.

## Allowlisted inputs

Page routes/template, sitemap, base layout, SEO/routes/catalogue helpers, localized site text, catalogue/game/collection/editorial/guide data, and the visible catalogue/card/link components. Exclude docs, workflow, tests, scripts, public key, assets, styles, player scripts, and game engines. Unknown files under public page, layout, data, component or library source roots conservatively map to the complete sitemap; tests cover both mapped and fallback paths.

## Behavior Sequence Matrix

| ID    | Sequence                                                                              | Expected result                                   | Evidence                            |
| ----- | ------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------- |
| BSM-1 | Deploy succeeds → eligible push diff → sitemap and key validate → API returns 200/202 | One POST and receipt-only summary                 | Unit tests and workflow logs        |
| BSM-2 | Docs/workflow/key/test/script-only diff                                               | Skip before network calls                         | Unit tests assert no fetch          |
| BSM-3 | API rejects or times out after deploy                                                 | Warning and summary; deployment remains available | Unit tests and public release SHA   |
| BSM-4 | Manual dispatch, rerun, or missing base                                               | Skip                                              | Unit tests and workflow condition   |
| BSM-5 | Pages deploy fails                                                                    | Notification job does not run                     | `needs: deploy` workflow dependency |

## Acceptance and verification

- Parse unique `<loc>` entries; require HTTPS and exact canonical origin; reject malformed/empty sitemap and more than 10,000 URLs before sending anything.
- Require public `release.json.sha` to match the workflow SHA before reading the sitemap; retry this read for a bounded period, then warn and stop if still stale.
- Map changed input families to their localized sitemap URL subsets, verify the deployed key file equals the checked-out public key, then send `{host,key,keyLocation,urlList}` once. Never log key or request body.
- Run `npm run verify`, `npm run test:e2e`, formatting check, and code review before PR. After merge, inspect workflow outcome, run the public verifier for the merge SHA, and read back key, sitemap, and bilingual home pages.
- Keep console submission, deployment, submission receipt, indexing, ranking, and citations as separate evidence states.

## Unknowns and stop conditions

- The allowlist needs maintenance if page ownership moves; tests and adjacent documentation must change with it.
- If the sitemap is invalid, non-canonical, empty, or over limit, abort the whole request and report a warning. If key verification or API submission fails, keep deployment successful and make no indexing claim.
- Do not add provider-console operations or credentials under this scope.
