---
title: "Documentation conventions"
summary: "Maintain truthful PRD, ADR, codemap and evidence."
read_when:
  - Working on documentation conventions
---

# Documentation conventions

Repository docs are developer-facing; English/Korean product copy lives in source data. Every guide, product document, release record and ADR has title, summary and read_when frontmatter. README, codemap and DESIGN.md are exempt. Root AGENTS.md is a concise navigation page.

## ADR format

Use sequential `NNNN-kebab-case.md` filenames with Status, Context, Decision, Consequences and Verification sections. Accepted ADRs are append-only decisions: supersede explicitly rather than silently rewriting history. Record actual tradeoffs and external gates; avoid speculative requirements. Add entries to the ADR index.

## Updates

Change behavior and its owning documentation in the same PR. Update command tables when package scripts change and codemap when module responsibilities move. Run docs:check and docs:lint. Release records distinguish local checks, CI, merge, Pages deployment, public readback, physical devices and third-party approvals. Never label planned tests as passed.

The /docs init and update workflow is adapted to this small Astro repository: plain Markdown with deterministic checks replaces a separate VitePress documentation application. Only public/ and Astro-generated pages enter deployment.
