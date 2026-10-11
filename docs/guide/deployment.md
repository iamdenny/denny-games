---
title: "Deployment"
summary: "GitHub Pages workflow, domain verification and rollback."
read_when:
  - Working on deployment
---

# Deployment

Use only `ghr`, local profile iamdenny, and the existing iamdenny repository. Work on feature branches, push a PR, wait for CI, review, then squash merge. The user authorized this task through merge and public readback.

CI uses locked npm install and runs verification plus browser tests. A main-only Pages workflow builds the same checked source, uploads only `dist`, and deploys with a minimal Pages/OIDC permission job. Tests/docs/research/credentials/source maps must not enter `dist`. Deployment concurrency prevents stale overlapping releases.

DNS: `games.iamdenny.com CNAME iamdenny.github.io`. Custom domain must stay configured on this repository. Do not modify root-domain or other subdomain records. Enable HTTPS only after certificate approval; never bypass a certificate warning.

After deployment, compare the public release.json SHA with the merge SHA, inspect bilingual HTML and static assets, and read Pages certificate/enforcement state. A CI pass is not public readback.

Rollback by reverting the offending PR in a new reviewed PR and redeploying the resulting main commit. The initial setup commit is e9415ec9d777ac1d46761458af7d2431839b7e8a. If infrastructure or GitHub approval is unavailable, report that boundary without claiming launch completion.
