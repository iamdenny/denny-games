---
title: "IndexNow notifications"
summary: "Notify IndexNow after successful deployments that change indexable page inputs."
read_when:
  - Changing post-deployment search submission
---

# 0018 IndexNow notifications

## Status

Accepted, 2026-10-12.

## Context

Denny Games publishes an XML sitemap of canonical indexable URLs. Search consoles and indexing outcomes remain separate from successful static deployment, and the site has no private search-submission credentials.

## Decision

After a successful main push deployment, a downstream, read-only job checks the changed paths. On the first run attempt only, a page-template, localization, catalogue, guide, route or SEO input change triggers one IndexNow JSON request containing unique sitemap URLs mapped to the affected route family. Shared page-template, localization, route and SEO changes select every sitemap URL. Editorial ordering includes category pages; article copy currently selects the full sitemap because it spans guide and standalone routes. Unrecognized source files under page, layout, data, component or library roots conservatively select the full sitemap so new page dependencies are not missed. Before reading the sitemap, the job confirms public `release.json` matches the workflow SHA, with a bounded retry for host propagation. Manual dispatches, reruns, missing base commits and unrelated changes skip. The job fetches the public key file and checks it against the checked-out key before submitting. The public key is not a secret.

Treat HTTP 200/202 only as a submission receipt. Surface release, key, sitemap and endpoint failures as workflow warnings without failing or undoing Pages deployment. Do not retry the IndexNow request automatically. The first version submits affected URLs present in the current sitemap; it does not notify removed URLs.

## Consequences

The path and route-scope map and their tests need updates when page-producing inputs move. Conservative full-sitemap fallback for unknown source files may submit extra URLs; all requests remain bounded by IndexNow's 10,000 URL request limit. No analytics, runtime dependency or search-console account access is introduced.

## Verification

Unit tests cover change gating, URL validation, key readback, request limits, endpoint statuses and no-retry behavior. `npm run verify` and browser tests cover the build. After deployment, compare `release.json` with the merge SHA and inspect the public key, sitemap, bilingual pages and workflow summary. Submission does not prove indexing, ranking, traffic or citations. See [search operations](../guide/search-discovery.md) and [deployment](../guide/deployment.md).
