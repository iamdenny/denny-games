---
title: "ADR 0059 — Original Jegi Rally game"
summary: "A three-round, locally played Jegichagi timing game with distinct footwork sequences."
read_when:
  - Developing or reviewing Jegi Rally
---

# Original Jegi Rally game

Status: Accepted · 2026-10-24

## Context

The locally playable catalogue already contains JUGGLING ACT and JUGGLING CHAIN. A generic repeated-tap keep-up game would overlap those entries. Korean cultural references describe multiple Jegichagi styles, including keeping one foot raised, alternating feet, using one foot only, and kicking backward. Rules vary by region and group. These references provide cultural context, not evidence of an unserved market or search demand.

## Decision

Create `jegi-rally` as an original MIT TypeScript/Canvas game with project-authored vector art. Import no third-party source, assets, fonts or sounds, and make no runtime requests. Use the lazy player loader, standard directional and confirm actions, consented player lifecycle, browser-local saves and existing ad placements.

Provide three short rounds:

1. Choose a foot and use it for six successful kicks.
2. Choose either starting foot, then alternate feet for eight successful kicks.
3. Follow a fixed left-foot, right-foot, back-foot sequence for ten successful kicks.

Each round has a visible, timed flight gate, progressively narrower timing windows, accuracy-based points and a three-miss limit. The stage count is finite and selected by the shared shell. Pausing freezes the current flight. Saved progress stores completed hits and score, not a monotonic timer; a reload starts a fresh flight. Terminal restores report the result once.

Publish original English/Korean game copy, a Jegichagi guide, and add the game to the existing traditional-games collection alongside Yutnori and Gonggi. The guide cites the [Ministry of Culture](https://www.mcst.go.kr/usr/child/enter/play/jegichagi.jsp) and [National Folk Museum of Korea](https://www.nfm.go.kr/kids/elecontents/view.do?topic=13) as cultural references. The foot sequence, timing gate, scoring and miss policy are Denny Games digital rules, not a claim about every physical version.

## Consequences

The repository registry grows from 334 to 335 locally playable games and the traditional-games collection grows from two to three entries. The bilingual guide and `llms.txt` add canonical discovery paths. These changes improve owned content coverage; they do not demonstrate indexing, ranking, traffic, retention, advertising approval or revenue.

The timing and illustrated flight make this an arcade interpretation rather than a physical simulation. Touch, mouse and browser key/gamepad mappings are covered by automated or code-level evidence as recorded in testing; real phone, tablet and controller behavior requires separate device verification. No new analytics event, score telemetry, in-player ad or ad-provider configuration is introduced.

## Verification

Pure rules tests cover all stage sequences, timing grades, misses, finite results and save validation. Browser tests cover both locales, the three-round gameplay and terminal restoration, pause/resume, keyboard input, local guide/collection/search discovery and phone/tablet/desktop layouts. A gameplay screenshot is captured from the running local game. Require the repository verification and Chromium suite before review, passing reviewed CI before merge, and a successful Pages deployment plus public English/Korean game, guide, collection, sitemap and `llms.txt` readback before calling the release published. Search and physical-device evidence remain separate.
