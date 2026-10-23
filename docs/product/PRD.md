---
title: "Denny Games PRD"
summary: "English/Korean static arcade requirements and current delivery decisions."
read_when:
  - Implementing product behavior or reviewing release scope
---

# Current delivery decisions — 2026-10-11

This repository carries the original research requirements below. The following decisions supersede conflicting draft recommendations:

- Brand Denny Games / 데니 게임즈; games.iamdenny.com; iamdenny/denny-games.
- English and Korean only. No Japanese routes in this delivery.
- Root visits open the first supported browser language automatically (`ko` or `en`, English fallback). Explicit locale URLs and manual language switching remain authoritative. See [ADR 0019](../adr/0019-browser-language-entry.md).
- Play-style collection cards show three real member-game thumbnails alongside localized titles, descriptions and exact counts on home, collections, related game details and guides. Artwork and card titles link to the same collection; mobile uses one column. See [DESIGN](../../DESIGN.md).
- Home's introductory slogan uses a compact 1.5–2rem title with natural wrapping and less vertical spacing before game discovery. Place the exact-count catalogue link beside search, remove the duplicate tagline, long introductory notice and pagination explanation, and show the quick-play picker immediately below and collections after it (ADR 0029). The home spotlight randomly rotates through every locally hosted registry game, with pause/resume, manual next, mood filters, reduced-motion support and a static no-JavaScript fallback (ADR 0040). Apply this to both languages and all viewport widths; preserve search and catalogue actions. See [DESIGN](../../DESIGN.md).
- Compact navigation and board-stage priority follow [ADR 0020](../adr/0020-compact-navigation-and-board-stage.md): a single-row menu header through 1100px, no separate category row, and classic-board controls beside the stage from 600px. Optional arrows live in settings; preserve touch, keyboard and gamepad confirmation and round state.
- Apply full-stage sizing to every game through [ADR 0021](../adr/0021-maximized-all-game-stages.md). Remove width caps and inline-control reservations, keep logical aspect ratios, and choose side or bottom tools by the larger available game scale. Keep primary hint/launch/number actions reachable; 2048 arrows live in settings. Verify every imported canvas at phone and landscape browser sizes.
- Public source repository already created with user authorization; only dist is deployed. See ADR-0002.
- Astro + strict TypeScript + lightweight Canvas/DOM modules; Phaser is deferred until justified.
- Initial games: Circuit Loop (30 deterministic solvable boards), Orbit Break (12 stage layouts), and MIT 2048 adaptation. Existing-game candidates require individual rights review.
- Catalogue, categories, search, favorites/recent, daily challenges, player lifecycle, diagnostic/guides and advertising gates are in the implementation scope.
- Ad integration is P0; site/H5 approval, certified CMP and serving credentials are external gates. Default mode off.
- Mobile responsive and browser automation are tested; actual iOS/Android/pads/Tesla, 20-minute device soak, field p75 metrics, search registration/indexing and legal/provider review are separately pending until evidence exists.
- No fake games, fake compatibility or 90-day experiment plan.

> Catalogue expansion (2026-10-11): 191 pinned Crisp games join the initial three titles in six categories. See [inventory](../guide/open-game-inventory.md) and [ADR 0009](../adr/0009-imported-games.md). Imported rounds restart on leaving; daily challenges remain limited to the original three. Candidate status does not imply playable release or device certification.

## Classic board release — 2026-10-12

See [Classic board games PRD](CLASSIC-BOARD-GAMES.md) for five original games, the Board category, local AI/two-player modes, mobile confirmation controls and bilingual SEO/GEO acceptance. The catalogue grows from 194 to 199 games; daily challenges remain the original three.

## Open-source roguelite import — 2026-10-14

Add Bounce Back as the 200th playable title and a highlighted action game. Keep the GPL-2.0-or-later source, tile art, screenshot and complete license; keep the upstream debug console out of the served runtime. Run the game in a separate opaque-origin sandbox with a no-network CSP, a pinned message channel, lifecycle pause/resume, bilingual controls, touch movement/aiming, standard gamepad mapping and validated local progress. Automated browser evidence does not establish physical phone, controller or Tesla support. See [ADR 0024](../adr/0024-bounce-back-gpl-adapter.md) and [release record](../releases/2026-10-14-bounce-back.md).

## Open-source WebGL shooter import — 2026-10-14

Add UNDERRUN as the 201st playable title in shooting. Pin and hash the complete upstream repository snapshot; retain its MIT license, the separate modified Sonant-X zlib notice, and music attribution. Serve the WebGL game in an allow-scripts-only opaque-origin iframe with no network, a validated parent channel, pause/resume and mute/volume control. Map touch movement/aim/fire and standard gamepad left-stick movement, A fire, D-pad aim, and Start pause. The three in-game levels remain a single shell stage; leaving the frame restarts the run. Chromium automation is not physical phone, controller, Tesla, full-campaign, or revenue evidence. See [ADR 0025](../adr/0025-underrun-webgl-adapter.md) and [release record](../releases/2026-10-14-underrun-webgl.md).

Add Hextris as the 202nd playable title in arcade. Pin and hash the GPL-3.0-or-later upstream source and retain dependency notices. Remove upstream ads, analytics, social popups and external score reporting from the served runtime. Add a no-network opaque-origin frame, bounded local save bridge, bilingual labels, touch rotation buttons, keyboard/gamepad mapping and common pause/restart. Checkpoint the current board during play, confirm browser-storage persistence before in-site locale changes, and restore the latest completed checkpoint after reload. Block locale navigation with a save error if capture or persistence fails. Browser automation is not physical-device or player-popularity evidence. See [ADR 0026](../adr/0026-hextris-responsive-adapter.md) and [release record](../releases/2026-10-14-hextris.md).

## Next development release

See [다음 릴리스 PRD](NEXT-RELEASE.md) for play-style collections, combined search filters, local device checks, SEO/GEO acceptance and the explicit remaining game-supply targets.

The first country experiment is South Korea, narrowed to Korean searches for free two-player games shared on one device. This is a low-cost product-fit test, not a proven competitive advantage. Keep the existing English and Korean routes; do not add thin country-only duplicates. See [market focus](MARKET-FOCUS.md) for competitor evidence, scope and measurement boundaries.

Home discovery follows [홈 게임 탐색 개선 PRD](HOME-DISCOVERY.md) and [ADR 0041](../adr/0041-distinct-home-discovery-previews.md): editor picks are excluded from genre previews, and genre cards offer direct play.

Multi-stage games show stage progress and a next-stage action after wins; daily challenge routes keep their existing next-challenge flow. See [ADR 0042](../adr/0042-visible-multi-stage-progression.md) and [player UX](PLAYER-UX.md).

## Complete catalogue visibility — 2026-10-12

The home page showed 21 preview cards while its “All games” navigation returned to that same preview. Provide `/en/all/` and `/ko/all/` as complete, static catalogues: 24 real games per page, every published registry entry exactly once across the sequence, total count and visible range, category counts, search/filter link, and previous/next/number links above and below the grid. Navigation must lead to these catalogues. Home distinguishes curated and category previews through their section headings and links explicitly to the complete catalogue in its compact search/action row. No game is added or removed by this change.

Each numbered page has its own title, description, canonical, language pair, sitemap entry and visible-card ItemList. JavaScript-disabled mobile navigation must reach the final game. Validate exact registry coverage in both languages and with the private 1,000-game fixture; verify 320–430px and desktop layouts, then PR, merge and read back the deployed release. See [ADR 0013](../adr/0013-complete-catalogue.md).

## Acceptance traceability

### Casual visual polish and editorial order — 2026-10-12

The user selected a clean, clear casual style. Refresh the playable boards of Orbit Break, 2048 and Circuit Loop: rounded pastel bricks/paddle with a bounded ball trail, tactile number tiles with brief changed-tile feedback, and higher-contrast circuit paths with connected tile surfaces. Preserve rules, collision dimensions, seeds, save versions and input handling. Reduced motion and low-effects disable optional trails/tile animation. Capture new actual-board screenshots.

Use 12 explicit editor picks with bilingual reasons based on screen/rule review. Promote the same stable order in home, complete catalogue, categories and default search; preserve all 194 titles and unpicked order. Home features Orbit Break and six picks. Clearly distinguish this selection from measured popularity or user-tested fun. Retain original imported game pixels/source/provenance; improve their catalogue framing without presenting it as an in-game remake. See [ADR 0014](../adr/0014-editorial-and-visual-polish.md).

| Requirement | Owning module / evidence |
| --- | --- |
| F01–F08 input, pause, persistence | player shell, input/storage services, browser tests |
| F09 daily/share | seed helpers, daily route, rules tests |
| F10 English/Korean | locale data and static routes |
| F11 honest compatibility | compatibility and diagnostic pages |
| F12–F13 ads | ad config/adapter, failure recovery tests |
| F14 SEO/GEO | static editorial HTML, canonical/hreflang/sitemap |
| F15 observability | local event ring and diagnostics; renewed opt-in GA4 page views and minimal game starts/completions; no query strings, inputs or scores sent remotely |
| F19 scale | typed registry, real pagination, 1,000-entry build fixture |
| F20 mobile | responsive browser tests; physical-device signoff pending |
| F21 slots | shared component, no display slots in play |

## Quick discovery and replay — 2026-10-15

Home offers quick-reflex, thinking and same-screen two-player picks with direct play and rules links, actual game imagery and browser-local recent games. Real shell results offer a score record comparison where appropriate and a next-game action. Keep all controls usable on phones and iPad layouts; provide static fallback, reduced motion and honest local-save wording. This improves discovery and replay opportunities; increased fun or retention needs actual player evidence. See [ADR 0029](../adr/0029-quick-play-and-replay.md).

## Daily completion and return — 2026-10-15

Daily challenges start at stage 1 and show the current UTC day, actual completed-round count and browser-local records. A finished round counts regardless of winning; opening, pausing, normal seeds and other stages do not. A daily result leads to the next remaining challenge or the daily summary. No global ranking or retention claim is introduced. See [ADR 0030](../adr/0030-daily-completion-and-return.md).

## Seven-day daily trail — 2026-10-15

Home and the daily route show each of the last seven UTC dates and the number of supported challenges completed that day. Keep only those date buckets in browser storage, preserve existing one-day records on upgrade, and disclose that this is local history. Do not imply a streak, ranking, reminder or measured retention. See [ADR 0032](../adr/0032-seven-day-daily-trail.md).


Daily challenge cards also offer a friend-share action that opens the selected local game with today's UTC seed at stage 1. The date resolves when the recipient opens the link; no score, identity, tracking value or gameplay event is shared. See [ADR 0039](../adr/0039-daily-challenge-sharing.md).

## Game entry learning and sharing — 2026-10-18

Enrich the existing 2048 and Gomoku pages with static worked rules and beginner guidance. Home links to these sections and the five-game same-device board comparison. Share game and collection landing pages through native sharing, clipboard or a manual address, using only canonical URLs. No new game routes, gameplay tracking or search success claims are introduced. See [ADR 0036](../adr/0036-game-learning-and-sharing.md).

## Original research draft (historical recommendations)

# Denny Games — 무료 브라우저 미니 아케이드 PRD

> **games.iamdenny.com · 기획안 v1.1 · 조사 기준 2026-10-10**
> 상태: 리서치 및 개발 요구사항 작성 완료. 구현·실차 검증·광고 승인·배포는 아직 진행하지 않음.

> **확장 방향 반영:** 디자인은 3안 Arcade Press를 기반으로 발전시킨다. 카테고리별 100개 이상·전체 1,000개 이상을 수용할 카탈로그와 모바일 터치 게임 지원을 설계한다. 상세 화면·광고 슬롯·제작 구조는 [Arcade Press v2 확장 설계](../../DESIGN.md)를 따른다. 초기 2종은 첫 개발 범위이며 장기 게임 수 제한이 아니다.

## 1. 먼저 읽는 제품 방향

**설치와 가입 없이 짧게 즐기고, 터치·키보드·게임패드로 편하게 조작하는 무료 게임 사이트를 만든다.** PC와 모바일에서 이용할 수 있고, 주차·충전 중인 테슬라에서는 실제 검증한 게임과 조작 방법을 안내한다. 게임 이용료는 무료로 유지하고 광고로 수익을 얻는다.

이용 조건은 실행 위치에 따라 구분한다. 데니 게임즈가 호스팅하는 게임은 이 사이트 안에서 실행하며 공통 계정 없이 제공한다. 고전 오픈소스 게임을 외부 링크로 소개할 때는 새 탭의 독립 호스트로 안내하고, 계정·조작·저장·개인정보 조건과 데니 게임즈의 미검증 범위를 게임 페이지에 표시한다. 외부 빌드나 게임 자산을 임베드하거나 복사하지 않는다.

자체 제작 게임을 카테고리별로 지속 확장하면서 **빠른 시작, 일관된 조작, 큰 화면 사용성, 믿을 수 있는 호환성 정보**를 공통 품질로 유지한다. 초기에는 두 게임으로 공통 구조를 완성하고, 데이터 기반 등록 방식으로 카테고리별 100개 이상을 수용한다. 테슬라는 초기 차별화 대상이지만 사이트 전체를 특정 자동차 브랜드에 종속시키지 않는다.

| 결정 항목 | 권장안 |
| --- | --- |
| 서비스명 | Denny Games — 가칭, 도메인은 `games.iamdenny.com` |
| 대표 문구 | “잠깐의 여유, 바로 한 판.” / “A quick break. A good game.” |
| 초기 이용자 | 짧은 무료 게임을 찾는 PC·모바일 이용자, 게임패드 이용자, 주차·충전 중인 테슬라 이용자 |
| 첫 출시 | 자체 제작 2D 게임 2종 + 일일 도전 + 호환성 안내 + 광고 + 검색 유입용 콘텐츠 |
| 확장 구조 | 8~10개 장르, 카테고리별 100개 이상·총 1,000개 이상 설계 용량. 제작 수량·기간은 별도 |
| 디자인 | 3안 Arcade Press의 색·타이포 유지, 검색·카테고리·게임 그리드 중심으로 확장 |
| 모바일 | 자체 제작 게임은 터치로 시작·플레이·종료 가능한 것을 기본 출시 조건으로 적용 |
| 게임 길이 | 기본 한 판 2~5분, 반복 플레이로 10분 이상도 가능 |
| 조작 | 모든 출시 게임에 터치·키보드·패드 입력 설계. 실제 지원 표시는 환경별 검증 결과에 따름 |
| 광고 | **AdSense 디스플레이 광고를 첫 출시 필수 범위에 포함.** H5 게임 광고 연동도 준비하고 별도 승인 후 활성화 |
| 인프라 | **무료 정적 호스팅. GitHub Pages 우선**, 서버·DB 없는 구성 |
| 언어 | 한국어·영어 동시 출시. 일본어는 번역 및 실제 조작 안내 검수 후 추가 |
| 확산 | 게임별 검색 페이지 + 테슬라·패드 호환성 자료 + 짧은 플레이 영상 + 커뮤니티 공유 |

**이 문서는 출시 제품과 실행 순서를 정의한다. 별도의 90일 실험 계획은 포함하지 않는다.** 기간·용량·성능 수치는 제안하는 개발 목표이며, 조사로 입증된 사용자 성과가 아니다.

### 판단에 가장 중요한 세 가지

1. **게임패드 지원 자체는 새롭지 않다.** 사이트 탐색, 게임 시작, 일시정지, 재시작까지 이어지는 사용성과 테스트 이력을 차별점으로 삼는다.
2. **테슬라 내장 Arcade와 웹브라우저는 별도 환경이다.** 차량에 패드를 연결할 수 있다는 사실만으로 웹게임 패드 지원을 약속하지 않는다.
3. **무료 인프라와 광고 수익화를 함께 설계한다.** GitHub Pages에 기술적으로 배포할 수 있어도, 광고 수익 사업에 대한 이용 정책 적합성은 따로 확인해야 한다. 호스팅 부분은 8절에서 다룬다.

## 2. 시장 조사와 차별화 기회

### 2.1 경쟁 서비스에서 확인한 것

아래는 공식 서비스 페이지와 문서를 검토한 결과다. 경쟁 사이트 전체의 실제 플레이·실차·패드 사용성을 전수 테스트한 결과는 아니다.

| 서비스 | 확인한 강점·제공 방식 | 우리 제품에 주는 시사점 |
| --- | --- | --- |
| **Poki** | 공식 FAQ 기준 약 1,700개 게임, 광고 기반 무료 플레이, 개발사와의 라이선스 관계를 안내한다. 월 이용자 1억 명 이상은 서비스의 자체 발표 수치다. | 게임 수나 “무료·무설치”만으로 경쟁하기 어렵다. 우리 게임의 독자적 재미와 기기 사용성을 보여줘야 한다. [Poki FAQ](https://poki.com/en/c/faq) |
| **CrazyGames** | 컨트롤러 지원 게임을 별도 카테고리로 제공한다. | “패드 지원”이라는 태그만으로는 차별화가 부족하다. 메뉴까지 패드로 쓰는 흐름과 검증 범위를 명확히 해야 한다. [Controller games](https://www.crazygames.com/t/controller) |
| **itch.io** | 제작자가 HTML5 게임을 업로드해 브라우저에서 실행하도록 배포할 수 있다. | 초기 자체 게임의 외부 발견 채널로 활용할 수 있다. 통합 사이트 경험과 직접 유입은 별도 구축한다. [HTML5 배포 문서](https://itch.io/docs/creators/html5) |
| **AirConsole** | 휴대폰을 컨트롤러로 사용한다. 차량 지원은 제조사·모델·OS 등의 조건을 명시한다. | 자동차 게임과 휴대폰 컨트롤러는 이미 존재한다. 휴대폰 연결을 첫 진입 필수 단계로 만들지 않는 간편함에 집중한다. [공식 연결 안내](https://airconsole.zendesk.com/hc/en-us/articles/360014511400-How-to-Connect), [지원 차량](https://airconsole.zendesk.com/hc/en-us/articles/9713377143196-Supported-Cars-and-Requirements) |
| **Tesla Arcade** | 내장 게임과 Bluetooth/USB 컨트롤러를 안내한다. 차량 구성·지역에 따른 차이가 있다. | 사용자가 차 안에서 게임하는 경험은 이미 익숙할 수 있다. 웹 서비스의 장점은 링크로 접근하고 PC·폰에서도 같은 게임을 즐기는 데 있다. [Tesla 매뉴얼](https://www.tesla.com/ownersmanual/model3/en_qa/GUID-79A49D40-A028-435B-A7F6-8E48846AB9E9.html) |
| **Tesla Game Zone 등 차량용 웹 포털** | Tesla Game Zone 사이트와 제작자의 공개 소개에서 차량용 웹게임 모음이라는 선행 사례를 확인했다. 현재 개별 게임·패드 호환성은 검증하지 못했다. | “테슬라에서 여는 게임 사이트”만으로 최초·독점이라고 주장할 수 없다. [사이트](https://tesla.apirobots.pro/), [제작자 소개](https://www.reddit.com/r/SideProject/comments/1hz9o13/) |

**리서치에 근거한 제안:** 기존 공급은 충분하다. 우리가 공략할 자리는 “짧은 시간에 편하게 시작하고, 어떤 조작이 되는지 미리 알 수 있는 소형 아케이드”다. 이 조합의 실제 수요 규모나 경쟁사 대비 전환율은 아직 확인하지 않았다.

### 2.2 제품 차별점 네 가지

| 차별점 | 사용자가 체감하는 가치 | 구현 결과물 |
| --- | --- | --- |
| **끝까지 패드로** | 게임을 바꾸거나 다시 시작할 때 마우스를 찾지 않아도 된다. | 일관된 포커스 이동, 결정·취소·일시정지, 연결 해제 복구, 조작 안내 |
| **짧게 끝나는 자체 게임** | 배우는 데 오래 걸리지 않고 기다리는 시간에 한 판을 마친다. | 2~5분 규칙, 첫 행동 안에 튜토리얼, 즉시 재도전 |
| **검증한 호환성 공개** | “테슬라 지원”이라는 모호한 문구 대신 내 환경에 맞는 정보를 본다. | 차량·펌웨어·패드·입력 방식·테스트 날짜가 있는 호환성 표 |
| **게임 흐름을 지키는 광고** | 무료로 즐기면서 조작 중 광고를 잘못 누르거나 갑자기 다른 페이지로 가지 않는다. | 콘텐츠 광고와 게임 실행 화면 분리, 라운드 경계의 H5 광고, 실패 시 즉시 복귀 |

초기 방어력은 크지 않다. 장기적으로 쌓이는 자산은 자체 게임의 완성도, 공통 입력 시스템, 실제 기기 테스트 기록, 일일 도전과 재방문 습관이다.

## 3. 사용자와 핵심 이용 흐름

### 3.1 사용 상황

| 사용자 | 원하는 것 | 제품 응답 |
| --- | --- | --- |
| PC에서 잠깐 쉬는 사람 | 설치·가입 없이 한 판 | 게임 페이지에서 한 번 눌러 실행 |
| 폰으로 접속한 사람 | 작은 화면에서도 조작하기 쉬운 게임 | 세로 화면 대응, 넓은 터치 영역, 복잡한 가상 버튼 최소화 |
| 패드를 연결한 사람 | 메뉴도 게임처럼 조작 | 첫 패드 입력을 감지하고 끝까지 동일한 입력 체계 유지 |
| 테슬라에서 주차·충전 중인 사람 | 큰 화면에서 편하게 즐기고 바로 그만두기 | 큰 화면 모드, 중단·복구, 터치 기본, 검증된 패드만 지원 표기 |

### 3.2 기본 흐름

**검색·공유 링크 → 게임 소개와 플레이 버튼 → 실행 → 한 판 종료 → 재시작·오늘의 도전·다른 게임**

홈은 검색·카테고리·추천·최근 플레이·오늘의 도전·장르별 게임 선반으로 구성한다. 첫 두 게임 단계에서는 채워진 영역만 공개하며 빈 카테고리와 가짜 미래 수량을 노출하지 않는다. 게임이 늘어나면 같은 구조에서 탐색 영역을 확장한다. 목록은 기본 24개 단위로 페이지를 나누고 지원 입력·예상 시간·즐겨찾기를 제공한다.

게임 소개 페이지에는 플레이 버튼, 짧은 규칙, 조작법, 실제 스크린샷, 호환성, FAQ를 제공한다. 광고는 충분한 본문이 있는 영역에 놓고 플레이 버튼과 떨어뜨린다. 실행 화면에서는 게임과 필수 조작에 집중한다.

### 3.3 화면 구성

| 화면 | 핵심 내용 | 광고 |
| --- | --- | --- |
| 홈 | 게임 2종, 오늘의 도전, 최근 플레이, 입력 안내 | 게임 카드·버튼과 떨어진 본문 영역 1개 |
| 게임 소개 | 플레이 버튼, 규칙, 조작, 스크린샷, 호환성, FAQ | 본문 아래 1개. 넓은 화면의 추가 슬롯은 공간 기준을 통과할 때만 |
| 게임 실행 | 게임판, 점수, 일시정지, 소리, 나가기 | 일반 디스플레이 광고 없음. 승인된 H5 광고만 적절한 휴식 지점에 |
| 라운드 결과 | 점수, 개인 최고 기록, 재시작, 공유, 다음 게임 | H5 광고 기회 판단. 결과 팝업에 일반 배너를 억지로 삽입하지 않음 |
| 호환성·가이드 | 실제 테스트 조건, 지원 범위, 해결 방법 | 본문을 가리지 않는 디스플레이 광고 |
| 입력 진단 | 패드 버튼·축, 터치, 소리, 화면 크기 테스트 | 광고 없음 |

## 4. 첫 출시 게임

**자체 제작 2종을 권장한다.** 타사 게임을 무단 iframe으로 모으는 방식은 채택하지 않는다. 같은 런타임과 입력 시스템을 사용해 게임 추가 비용을 낮춘다. 아래 이름은 상표·도메인 가용성을 확인하지 않은 가칭이다.

### A. Circuit Loop — 회로 연결 퍼즐

타일을 회전해 시작점에서 목적지까지 회로를 연결한다. 몇 개의 선택 목표를 함께 연결하면 더 좋은 기록을 얻는다.

| 항목 | 요구사항 |
| --- | --- |
| 한 판 | 3~5분 목표. 시간제한 없는 일반 모드 |
| 기본 조작 | 터치로 타일 회전 / 방향키·패드 D-pad로 이동 후 결정 버튼으로 회전 |
| 재미의 중심 | 최소 회전 수, 선택 목표, 점점 커지는 보드 |
| 초기 콘텐츠 | 손으로 검수한 30개 퍼즐 + 검증 가능한 규칙의 일일 퍼즐 |
| 난도 | 작은 보드에서 시작, 새 규칙은 한 번에 하나만 추가 |
| 차량 적합성 | 정밀 드래그·동시 터치·빠른 반응을 요구하지 않음 |
| 일일 도전 | 같은 UTC 날짜·규칙 버전이면 같은 보드. 날짜 경계 안내 |
| 완료 기준 | 모든 제공 보드에 해답 존재, 재개 시 상태 동일, 색상 외 기호로 연결 상태 구분 |

일일 퍼즐은 무작위 배치 후 방치하지 않는다. 완성 상태에서 섞거나 솔버로 해답을 검증한다. 기록 공유는 결과 텍스트·링크로 제공하며 공식 순위라고 표시하지 않는다.

### B. Orbit Break — 짧은 벽돌 깨기

좌우로 패들을 움직여 공을 튕기고, 제한된 한 판 안에 목표를 깨는 2D 아케이드다. 공을 받아치는 위치로 반사 방향을 조절하고 연속 파괴로 점수를 얻는다.

| 항목 | 요구사항 |
| --- | --- |
| 한 판 | 약 2~3분. 종료 후 한 번의 입력으로 재시작 |
| 기본 조작 | 터치 드래그 / 키보드 좌우 / 패드 D-pad·스틱 |
| 재미의 중심 | 반사각 조절, 짧은 콤보, 매일 바뀌는 배치 |
| 초기 콘텐츠 | 서로 다른 목표와 배치의 12개 스테이지 |
| 차량 적합성 | 낮은 이펙트 모드, 가로 화면 최적화, 즉시 일시정지 |
| 난도 보정 | 초반 공 속도 완화, 패드 dead zone, 터치 손가락이 공을 가리지 않는 조작 영역 |
| 완료 기준 | 30/60fps 환경에서 게임 속도 일관, 백그라운드 복귀 시 순간이동·시간 건너뛰기 없음 |

초기 게임 수 확대보다 이 두 게임의 튜토리얼, 재시작 속도, 소리·진동 피드백, 난도 곡선을 먼저 다듬는다. 세 번째 게임은 **한 화면에서 번갈아 두는 2인 턴제 게임**이 자연스럽지만 첫 출시 범위에는 넣지 않는다.

## 5. 기능 요구사항과 완료 기준

P0는 첫 출시 필수, P1은 후속 추가다. 광고는 P0다.

| ID | 우선순위 | 요구사항 | 완료 기준 |
| --- | --- | --- | --- |
| F01 | P0 | 가입 없는 게임 시작 | 계정·이메일·권한 팝업 없이 기본 게임 실행. 필요한 동의는 목적별로 처리 |
| F02 | P0 | 공통 입력 계층 | 게임이 개별 장치 대신 이동·결정·취소·일시정지 같은 공통 동작을 받음 |
| F03 | P0 | 패드 내비게이션 | 홈·게임 소개·설정·결과 화면에 보이는 포커스가 있고 패드로 이동 가능 |
| F04 | P0 | 연결 변경 대응 | 패드 해제 시 자동 일시정지, 재연결 또는 터치로 계속 가능 |
| F05 | P0 | 터치·키보드 | 모든 핵심 동작에 대체 입력 존재. hover만으로 드러나는 필수 기능 없음 |
| F06 | P0 | 큰 화면 모드 | 큰 글자·큰 버튼·단순 레이아웃. 사용자 선택으로 켜고 끌 수 있음 |
| F07 | P0 | 저장·복원 | 설정·진행·최고 점수를 기기에 저장. 저장 실패여도 플레이 가능 |
| F08 | P0 | 일시정지 | 화면 숨김·포커스 상실·광고 시작 시 정지. 복귀 후 사용자가 재개 |
| F09 | P0 | 일일 도전·공유 | 동일 seed·규칙 버전으로 동일 문제. 공유 실패 시 텍스트 복사 대안 |
| F10 | P0 | 한국어·영어 | 게임 UI·규칙·조작·오류 메시지 모두 번역, 언어 전환으로 게임 상태를 잃지 않음 |
| F11 | P0 | 호환성 데이터 | 검증·사용자 제보·미검증을 구분하고 테스트 날짜 표시 |
| F12 | P0 | AdSense 연동 | 승인 상태와 동의·페이지·모드에 따라 요청 제어. 미게재·차단에도 게임 정상 |
| F13 | P0 | H5 광고 연결부 | 전후 일시정지·소리·포커스 복구, 별도 승인 전 실제 요청 비활성 |
| F14 | P0 | SEO·GEO 기본 | 정적 본문, canonical, hreflang, sitemap, robots, 고유 게임 설명 |
| F15 | P0 | 오류 및 이용 지표 | 실행 실패·로딩·플레이 시작·종료·재시작을 구분해 관찰 가능 |
| F16 | P1 | 일본어 | 번역과 실제 화면 검수 완료 후 언어 페이지 공개 |
| F17 | P1 | 2인 게임 | 같은 화면의 턴제부터 지원. 실시간 원격 대전은 별도 설계 |
| F18 | P1 | 제한적 오프라인 | 실제 지원 브라우저에서만 저장된 게임 제공. 광고는 오프라인 캐시하지 않음 |
| F19 | P0 | 확장형 카탈로그 | 등록 데이터로 카드·상세·카테고리·검색 생성. 1,000개 비공개 더미 데이터로 빌드·탐색 검증 |
| F20 | P0 | 모바일 게임 출시 기준 | 실제 iOS Safari·Android Chrome에서 터치로 시작·플레이·일시정지·재시작·종료 검증 |
| F21 | P0 | 목록·상세 광고 슬롯 | 홈·카테고리·상세의 배치·상한·미게재 대응을 공통 컴포넌트로 관리 |

### 초기 범위에서 제외

계정·클라우드 세이브·전 세계 리더보드·채팅·유저 업로드·실시간 온라인 멀티플레이·휴대폰 원격 컨트롤러·유료 결제·3D 대형 게임은 제외한다. 무료 정적 인프라에서 서버 운영과 악용 대응을 만들지 않기 위한 범위 결정이다.

## 6. 테슬라·게임패드 최적화

### 6.1 지원을 약속하는 기준

Tesla 공식 문서는 내장 Arcade의 컨트롤러 사용과 차량별 차이를 설명한다. 이것은 외부 웹사이트에 Gamepad API가 동일하게 노출된다는 보장이 아니다. 인터넷 연결도 Wi-Fi·차량 연결 상품·구성에 따라 확인해야 한다. [Tesla 엔터테인먼트](https://www.tesla.com/ownersmanual/model3/en_qa/GUID-79A49D40-A028-435B-A7F6-8E48846AB9E9.html), [Connectivity](https://www.tesla.com/support/connectivity)

따라서 차량 지원을 **① 사이트 열림 ② 터치 플레이 ③ 패드 플레이 ④ 소리 ⑤ 저장·재개 ⑥ 광고 후 복귀**로 나누어 검증한다. “테슬라 전체 지원” 배지는 사용하지 않는다.

| 대상 | 첫 출시 목표 | 현재 증거 상태 |
| --- | --- | --- |
| PC Chrome·Edge + Xbox 계열 패드 | 메뉴부터 게임 종료까지 지원 | 구현·실기기 테스트 전 |
| PC/Mac + DualSense | 표준 매핑·실제 버튼 표시 검증 | 구현·실기기 테스트 전 |
| iPhone Safari·Android Chrome | 터치 기본, 패드는 해당 OS·브라우저 조합별 검증 | 구현·실기기 테스트 전 |
| Tesla AMD Ryzen 계열 전면 화면 | 터치 플레이 우선, 패드·광고·복구 별도 검증 | 실차 테스트 전 |
| Tesla Intel Atom 계열 전면 화면 | 저사양 모드와 퍼즐 우선 검증 | 실차 테스트 전 |
| 다른 EV·후석 화면·TV 브라우저 | 큰 화면 모드는 제공하되 검증 범위를 따로 표시 | 최초 지원 약속에서 제외 |

차량 컴퓨터 종류는 연식만으로 확정하지 않고 해당 차량에서 확인한다. 테스트 차량 한 대의 결과를 전체 Model 3/Y에 일반화하지 않는다.

### 6.2 차량 UX

- 큰 화면 모드의 주요 버튼은 최소 56 CSS px, 본문 기본 20px를 목표로 시작해 실차 거리에서 조정한다.
- 화면의 실제 사용 가능 영역을 기준으로 배치한다. 차량의 물리 패널 해상도와 웹 viewport를 동일하게 취급하지 않는다.
- 중요한 버튼과 점수는 화면 가장자리에 붙이지 않는다. 주소창·차량 UI가 남아도 게임을 완료할 수 있어야 한다.
- Fullscreen API가 실패하면 현재 브라우저 영역 안에서 확장한다. 특정 영상 서비스로 우회하는 전체화면 트릭에 의존하지 않는다. [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API/Guide)
- 소리는 명시적인 시작·소리 켜기 동작 이후 활성화하고 항상 음소거를 제공한다. 브라우저 정책상 첫 터치·클릭이 필요하면 안내한다.
- 주차·충전 중 사용을 안내한다. 일반 웹사이트가 차량의 기어·속도·충전 완료를 신뢰성 있게 알고 있다고 가정하지 않는다. 차량 주행 제한 우회나 충전 종료 자동 감지는 범위에 넣지 않는다.
- 네트워크가 끊겨도 이미 로드한 한 판은 가능한 한 계속한다. 재접속·다음 게임·광고를 위해 무한 로딩하지 않는다.

### 6.3 패드 구현 원칙

Gamepad API의 연결 이벤트와 `navigator.getGamepads()`를 사용한다. 이미 연결된 패드도 버튼을 눌러야 브라우저가 페이지에 노출하는 경우를 처리한다. HTTPS를 기본으로 한다. [MDN Gamepad](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API), [Secure contexts](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Secure_Contexts/features_restricted_to_secure_contexts)

표준 매핑을 우선하고 미지정 장치는 진단 화면에서 버튼을 확인하도록 한다. D-pad는 메뉴 이동, 결정 버튼은 시작·선택, 취소 버튼은 뒤로, 메뉴 버튼은 일시정지를 맡는다. 장치에 따라 확인하지 않은 버튼 글자를 단정하지 않는다.

스틱에는 조정 가능한 dead zone을 적용하고 메뉴 이동 반복 속도를 제한한다. 입력 방식이 바뀌면 안내 아이콘도 바뀐다. 방향키·스틱 입력을 광고 클릭으로 변환하지 않는다. 제3자 광고·CMP 내부는 패드로 제어할 수 있다고 보장하지 않고 터치·마우스 대안을 표시한다.

### 6.4 실기기 테스트 기록 양식

`게임 버전 / 차량 모델 / 인포테인먼트 종류 / 차량 SW / 브라우저 정보 / viewport / 패드 모델 / 연결 방식 / 네트워크 / 날짜 / 항목별 결과 / 알려진 제한`

영상과 결과는 별도로 보관하고 개인정보·차량 식별번호는 공개하지 않는다. 사용자 제보는 자체 검증 기록과 분리한다. OTA 이후 동작이 달라지면 기존 검증 날짜를 남기고 재확인 대기로 바꾼다.

## 7. 광고 수익화 — 첫 출시 필수

### 7.1 광고 상품 선택

| 구분 | 역할 | 출시 요구사항 |
| --- | --- | --- |
| **AdSense 디스플레이** | 홈·게임 소개·가이드의 광고 수익 | P0 구현. 실제 계정·사이트 승인 및 동의 조건 충족 후 게재 |
| **AdSense H5 Games Ads** | 게임 사이 전면 광고·선택형 보상 광고 | P0에 연동 구조와 테스트 포함. 별도 이용 승인 후 활성화 |
| 다른 광고 공급자 | AdSense 사용이 어려운 경우 대안 | 같은 슬롯 인터페이스로 교체 가능하게 설계. 첫 출시에서 여러 업체 동시 연동은 하지 않음 |

H5 Games Ads는 신청형 상품이며 승인된 AdSense 계정이 필요하다. 일반 AdSense 승인과 H5 사용 승인을 별개로 기록한다. [Google H5 신청 안내](https://support.google.com/adsense/answer/1705831?hl=en)

### 7.2 화면별 게재 규칙

**디스플레이 광고는 실제 콘텐츠가 있는 페이지에 수동 슬롯으로 배치한다. 게임 실행 페이지는 별도 URL로 분리한다.** Google은 게임과 일반 콘텐츠 광고의 간격을 최소 150px 두거나 게임 페이지에서 제거하는 방식을 강하게 권장한다. 이 제품은 실행 화면에서 일반 디스플레이 광고를 제거하는 설계를 택한다. [게임 페이지 광고 가이드](https://support.google.com/adsense/answer/2768340?hl=en)

| 화면·상태 | 기본 정책 |
| --- | --- |
| 홈 | 충분한 게임 설명·콘텐츠 다음에 1개. 첫 플레이 버튼 앞을 광고로 막지 않음 |
| 게임 소개 | 규칙·스크린샷 아래 1개. 플레이 버튼 주변에 광고를 둘러싸지 않음 |
| 가이드·호환성 | 실제 본문 사이 또는 끝. 짧은 페이지에 여러 광고를 강제로 넣지 않음 |
| 실제 플레이 중 | 광고 삽입·새로고침·팝업 없음 |
| 라운드 사이 | H5 승인 및 환경 검증 후 API를 통한 광고 기회 요청 |
| 차량 큰 화면 모드 | 디스플레이는 소개·가이드에서 허용. H5 영상은 해당 차량의 재생·종료·입력 복귀 검증 후 활성화 |
| 광고 차단·미게재·동의 미충족 | 게임 그대로 이용. 다른 공급자 광고로 동의 선택을 우회하지 않음 |

Auto ads는 게임 실행 경로에 적용하지 않는다. 일반 콘텐츠에서도 초기에는 자동 전면·앵커 광고 대신 수동 슬롯으로 시작한다. 페이지 제외는 URL 경로 기준으로 설정하며 쿼리나 해시만으로 실행 모드를 구분하지 않는다. [Auto ads 페이지 제외](https://support.google.com/adsense/answer/9262311?hl=en)

Coupang affiliate cards remain clearly labeled static links on home and game detail pages. To match purchase intent, the Korean gamepad diagnostic and controller-games / controller-troubleshooting guides may also show the same disclosed gamepad search link; English controller routes do not because the provider link targets a Korean shopping service. No affiliate card appears during play, in search or library results, or as a claimed compatibility recommendation.

The bilingual contact page may accept sponsorship and affiliate proposals through a public GitHub issue form. The page and form must say that submissions and replies are public, must not request confidential details, and must not claim audience size, reach or placement guarantees. A public business contact is optional and only shared at the submitter's discretion.

### 7.3 H5 광고 흐름

기본안은 **첫 플레이 전 강제 광고 없음 → 최소 두 판을 마친 뒤 다음 라운드 진입 시 광고 기회 → 앱 측 최소 3분 간격**이다. 이는 자체 빈도 상한안이며, 실제 표시 여부·추가 제한은 광고 공급자의 API와 정책을 따른다. 사용자가 단순히 일시정지할 때마다 광고를 호출하지 않는다.

광고 시작 전 게임·오디오·게임 입력을 정지하고, 종료 콜백에서 결과 화면으로 복귀한다. 사용자 재개 입력을 받은 후 게임을 시작한다. 광고를 보여주지 못하면 즉시 정상 흐름으로 진행한다. 광고가 실제 재생 중일 때 자체 타이머로 강제 제거하지 않고 SDK의 완료·실패 처리 규약을 따른다.

선택형 보상 광고는 “광고를 보고 일반 모드 힌트 1회”처럼 행동과 보상을 미리 알린다. 명시적으로 선택한 경우에만 요청하고 보상 완료 콜백 후 지급한다. 일일 도전 기록은 보상 사용 여부를 분리하거나 보상 기능을 제공하지 않는다. [H5 상품 설명](https://adsense.google.com/start/h5-games-ads/), [Google H5 정책 지침](https://services.google.com/fh/files/helpcenter/h5_games_policy_best_practices_infographic.pdf)

Ad Placement API·광고 태그·게임 canvas는 같은 문서에 두는 구조를 사용한다. 광고 DOM을 직접 수정하거나 그 위에 패드 클릭 오버레이를 만들지 않는다. [H5 게임 구조](https://developers.google.com/ad-placement/docs/html5-game-structure)

### 7.4 `iamdenny.com`과 서브도메인 설정

**`games.iamdenny.com`만 새 사이트로 등록하면 된다고 가정하면 안 된다.** 일반 서브도메인은 AdSense 사이트 목록에서 별도 관리하는 대상이 아니므로, 선택한 계정의 `iamdenny.com` 사이트 상태·게시자 ID·기존 설정을 먼저 확인한다. 기존 `tools.iamdenny.com`의 계정이나 승인 상태를 그대로 추정하지 않는다. [AdSense 사이트 관리](https://support.google.com/adsense/answer/12170421?hl=en)

`ads.txt`는 루트 `https://iamdenny.com/ads.txt`를 기준으로 설계한다. 루트와 판매자·게시자 ID가 같으면 루트의 승인 판매자 목록을 확인한다. 서브도메인의 판매자 구성이 다르면 루트에 `subdomain=games.iamdenny.com`을 선언하고 해당 서브도메인의 `/ads.txt`로 연결하는 방식을 적용한다. 기존 다른 사이트의 판매자 행을 덮어쓰지 않는다. [공식 ads.txt FAQ](https://support.google.com/adsense/answer/9785052?hl=en)

현재 계정 상태, 루트 도메인 호스팅, 게시자 ID는 이번 조사에서 확인하지 않았다. 개발 착수 시 확인할 입력값이다.

### 7.5 동의·운영·검증

EEA·영국·스위스 이용자에게 Google 광고를 제공할 때 요구되는 Google 인증 CMP를 적용한다. 비개인화 광고를 선택했다는 이유로 필요한 동의 처리를 생략하지 않는다. CMP가 차량에서 조작 불가능하면 광고보다 동의 선택과 기본 플레이 접근을 우선한다. [Google 동의 정책 안내](https://www.google.com/about/company/user-consent-policy-help/)

운영 설정은 다음을 지원한다.

- `off / verification / live` 상태. 검증용 태그와 실제 광고 슬롯 동작을 구분한다.
- 디스플레이·H5 각각의 켜기/끄기, 슬롯 ID, 페이지 허용 목록, 차량 모드 제한.
- 슬롯 공간 사전 확보와 미게재 처리. 로딩된 광고가 버튼을 밀어 오클릭을 유발하지 않게 한다.
- 광고 장애 시 게임 정상 진행. 광고 승인·요청·실제 표시·수익 발생을 별도 상태로 관리한다.
- 개발·자동화에서는 테스트 모드·가짜 어댑터 사용. 실제 광고를 테스트 목적으로 클릭하지 않는다.

완료 증거는 **설정 완료 → 승인 상태 확인 → 배포된 태그 확인 → 허용된 환경에서 실제 게재 확인 → 공급자 리포트 수익 확인**으로 구분한다. 코드가 있다는 이유로 광고 수익화 완료라고 보고하지 않는다.

### 7.6 수익을 보는 방법

주요 지표는 광고가 있는 콘텐츠의 페이지 RPM, H5 실제 노출수·eCPM, 국가·기기별 게재율, 광고 이후 게임 복귀율이다. 슬롯이 화면에 만들어졌다는 이벤트를 광고 노출로 계산하지 않는다. 노출·수익은 공급자 리포트와 제공 API를 기준으로 본다.

계산식은 `콘텐츠 페이지뷰 ÷ 1,000 × 페이지 RPM + H5 광고 노출수 ÷ 1,000 × H5 eCPM`이다. 두 항목의 리포트 범위를 분리해 중복 합산하지 않는다. 아직 트래픽·승인·단가 근거가 없으므로 예상 월수익은 제시하지 않는다.

## 8. 개발 구조와 무료 배포

### 8.1 권장 구조

**Astro 정적 페이지 + TypeScript + Phaser 2D 게임 + GitHub Pages**를 기준안으로 한다. 게임 소개와 가이드는 완성된 HTML로 배포하고, 플레이할 때 필요한 게임 코드만 로드한다. Astro는 정적 사전 렌더링을 지원하고, Phaser는 WebGL·Canvas 기반의 브라우저 2D 게임 개발을 지원한다. [Astro 렌더링](https://docs.astro.build/en/guides/on-demand-rendering/), [Phaser 문서](https://docs.phaser.io/)

정확한 프레임워크 버전은 구현 시 안정 버전과 실차 프로토타입 결과로 고정한다. Canvas fallback을 제공하려면 WebGL 전용 효과를 피하고 실제 fallback 실행을 확인한다. 설정 하나만으로 모든 시각 효과가 동일하게 동작한다고 가정하지 않는다.

```text
비공개 소스 저장소
  ├─ 사이트·번역·게임·테스트·운영 설정
  └─ 로컬 또는 무료 사용량 내 CI에서 정적 빌드
          ↓ 파일·크기·비밀정보·링크 검증
공개 배포 산출물 저장소
          ↓ GitHub Pages
https://games.iamdenny.com
          ├─ HTML·JS·이미지·음원·sitemap
          ├─ 브라우저 내부 게임 실행 및 로컬 저장
          └─ 외부 광고·동의·분석 서비스의 브라우저 연동
```

소스·문서·테스트는 비공개, 공개 저장소에는 배포 산출물만 둔다. 이는 기존 프로젝트의 소스/산출물 분리 방식에 맞춘 권장안이며 새 저장소를 만든 상태는 아니다. 브라우저에 배포되는 JS·이미지 자체는 공개적으로 다운로드할 수 있다.

### 8.2 GitHub Pages에 맞춘 기능 설계

| 기능 | 서버 없이 구현하는 방식 |
| --- | --- |
| 게임·소개·가이드 | 빌드 시 HTML과 정적 자산 생성 |
| 일일 도전 | 날짜 + 게임 ID + 규칙 버전으로 브라우저에서 결정적 생성 |
| 개인 기록·이어하기 | 게임별 버전이 있는 localStorage 또는 IndexedDB |
| 공유 | seed·규칙 버전이 담긴 URL 및 결과 텍스트. 인증된 기록이라고 주장하지 않음 |
| 콘텐츠·호환성 수정 | 파일 수정 → 검증 → 정적 재배포 |
| 광고 운영 | 빌드 설정·정적 구성 파일. 비밀키를 브라우저에 넣지 않음 |
| 장애 대응 | 게임/광고별 비활성화 설정을 재배포하고 이전 산출물로 롤백 |

계정·DB·API 서버·WebSocket·스케줄러를 첫 출시에 요구하지 않는다. 매일 도전을 바꾸기 위해 매일 사이트를 빌드할 필요도 없다. 클라이언트 시계·저장 데이터는 조작 가능하므로 공식 경쟁 순위의 근거로 사용하지 않는다.

### 8.3 무료 운영의 실제 범위

GitHub Free에서는 공개 저장소로 Pages를 사용할 수 있다. 공식 문서는 게시 사이트 1GB, 월 대역폭 100GB soft limit, 배포 10분 제한 등을 안내한다. 따라서 무제한 호스팅으로 간주하지 않는다. [GitHub Pages 제한](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)

| 항목 | 제품의 초기 관리 기준 |
| --- | --- |
| 게시 산출물 | 전체 200MB 이하를 내부 목표로 설정 |
| 첫 게임 다운로드 | 공통 런타임 포함 압축 전송량 2MB 이하 목표. 음원·추가 스테이지 지연 로드 |
| 자산 정책 | 대형 배경영상·불필요한 폰트·고해상도 원본 제외 |
| 대역폭 | 실제 전송량을 추정하고 성장 시 재평가. 2MB × 50,000회만으로도 약 100GB이므로 작은 게임이 중요 |
| CI 비용 | 비공개 저장소 Actions는 현재 계정 무료 할당량 안에서 사용. 초과 유료 사용 금지, 필요 시 로컬 빌드 |
| 도메인 | 기존 `iamdenny.com`의 하위 도메인 활용. 기존 도메인 갱신비는 무료 호스팅과 별개 |

2MB 예시는 HTML·다른 게임·추가 자산·봇 트래픽을 제외한 산술 예시이며 수용 가능한 방문자 수 보장이 아니다. 캐시 적중에 따라서도 전송량은 달라진다.

### 8.4 광고와 GitHub Pages 정책의 충돌 가능성

GitHub는 Pages를 온라인 사업, 전자상거래, 상업 거래 중심 사이트 또는 상업용 SaaS의 무료 호스팅으로 사용하는 것을 제한한다. 공식 문구만으로 모든 광고 포함 사이트가 일괄 금지라고 단정할 수는 없지만, **이 PRD처럼 광고 수익을 핵심 모델로 삼은 게임 서비스가 허용된다고도 확정할 수 없다.** [GitHub 이용 제한](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)

따라서 개발은 Pages 호환 정적 산출물을 기준으로 진행하되, 광고 수익 서비스의 실제 운영 적합성을 출시 전에 확인한다. 적합성이 확인되지 않으면 유료 서버 대신 **같은 정적 산출물을 Cloudflare Pages 무료 요금제로 옮기는 대안**을 사용한다. 해당 서비스의 적용 약관과 광고 운영 적합성도 전환 시 확인한다. 현재 무료 제한은 월 500회 빌드, 20,000개 파일, 단일 자산 25MiB 등이다. [Cloudflare Pages 제한](https://developers.cloudflare.com/pages/platform/limits/)

이 대안은 서버 기능을 추가하는 계획이 아니다. **무료 인프라 유지가 필수 조건, GitHub Pages는 우선 선택**이다. Pages 정책 적합성 확인이나 무료 한도 초과 때문에 광고 기능을 제품에서 삭제하지 않는다.

### 8.5 배포 완료 기준

`games` CNAME은 실제 배포 계정의 `<owner>.github.io`를 향하도록 설정하고, Pages 사용자 지정 도메인과 HTTPS를 검증한다. 루트 `iamdenny.com`의 기존 호스팅을 임의로 바꾸지 않는다. [GitHub 사용자 지정 도메인](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

모든 하위 경로는 실제 `index.html`로 생성한다. SPA 404 우회에 의존하지 않는다. 게임 코드·자산은 파일명 해시를 사용하고, 공개 저장소에 소스맵·환경 파일·내부 문서·비밀정보가 들어가지 않도록 검사한다. 배포 후 HTML·게임 자산·robots·sitemap·ads.txt 관련 경로의 응답과 canonical을 읽어 확인한다.

## 9. SEO — 플레이하려는 검색을 잡는다

### 9.1 검색 의도별 페이지

아래 키워드는 콘텐츠 방향을 정하기 위한 후보이며 검색량·경쟁도·순위가 검증된 목록은 아니다.

| 의도 | 한국어 예시 | 영어 예시 | 대응 페이지 |
| --- | --- | --- | --- |
| 게임 바로 하기 | 회로 연결 퍼즐, 무료 벽돌깨기 | circuit puzzle online, brick breaker browser game | 개별 게임 소개 |
| 입력 장치 | 게임패드 웹게임, 패드로 하는 무료 게임 | browser games with controller support | 컨트롤러 컬렉션·조작 안내 |
| 사용 상황 | 5분 게임, 설치 없는 짧은 게임 | quick browser games, 5 minute games | 홈 및 충분한 게임이 모인 후 시간별 컬렉션 |
| 차량 사용 | 테슬라 브라우저 게임, 테슬라 게임패드 웹게임 | Tesla browser games, Tesla browser controller test | 실제 검증 정보가 있는 Tesla 가이드 |
| 문제 해결 | 테슬라 웹게임 소리 안남, 브라우저 패드 인식 | gamepad not detected in browser | 증상별 진단 가이드 |

일반적인 “무료 게임” 대형 키워드에만 의존하지 않는다. 게임 규칙·입력·사용 환경이 결합된 구체적인 의도부터 대응한다. 같은 게임 두 개만 보여주는 유사 카테고리 수십 개를 생성하지 않는다.

### 9.2 URL과 색인 정책

```text
/                                  언어 선택·브랜드 홈
/ko/                               한국어 홈
/en/                               영어 홈
/ko/games/circuit-loop/             게임 소개·규칙·플레이 진입
/ko/games/orbit-break/
/ko/play/circuit-loop/              게임 실행 전용
/ko/play/orbit-break/
/ko/daily/                          오늘의 도전 설명·진입
/ko/controller-games/               패드 지원 범위·조작·게임 목록
/ko/tesla/                          검증된 차량 브라우저 가이드
/ko/compatibility/                  테스트 조건과 결과
/ko/gamepad-test/                   입력 진단 도구
/ko/guides/.../                     실제 문제 해결 글
/ko/about/ · /ko/privacy/ · /ko/terms/ · /ko/contact/
```

영어는 동일한 구조로 제공한다. `/play/`는 `noindex`하고 사이트맵에서 제외해 내용 있는 게임 소개 URL로 검색 유입을 모은다. `noindex`를 읽을 수 있도록 해당 URL을 robots로 동시에 차단하지 않는다. 일일 seed·개인 결과·단순 필터 쿼리를 별도 검색 페이지로 증식시키지 않는다.

언어별 자기 자신을 가리키는 canonical, 상호 연결된 hreflang, 언어 선택 루트의 `x-default`를 설정한다. 아직 번역하지 않은 일본어 페이지를 자동 생성하지 않는다. [Google 다국어 페이지 안내](https://developers.google.com/search/docs/specialty/international/localized-versions)

### 9.3 게임 페이지의 콘텐츠 기준

각 게임에는 고유 소개, 실제 규칙, 입력별 조작법, 목표·실패 조건, 자체 스크린샷, 초보자 팁, 실제 호환성, 업데이트 날짜를 작성한다. 긴 글 분량을 채우기 위한 반복 문구는 넣지 않는다. 본문은 게임 JS가 실행되지 않아도 읽을 수 있어야 한다.

구조화 데이터는 실제 내용에 맞는 `VideoGame`, `BreadcrumbList`, 사이트·제작자 정보를 사용한다. `VideoGame`에 게임명·플랫폼·플레이 모드 등을 기술할 수 있다. 가짜 평점·후기·테스트 결과는 만들지 않고, 스키마 사용 자체가 Google의 게임 전용 리치 결과를 보장한다고 설명하지 않는다. [Schema.org VideoGame](https://schema.org/VideoGame)

### 9.4 검색 등록과 운영

출시 시 Google Search Console, Bing Webmaster Tools, Naver Search Advisor에 소유권과 사이트맵을 설정한다. 신규·변경된 canonical URL은 지원 검색엔진에 IndexNow로 알린다. IndexNow 접수는 크롤링·색인·상위 노출 완료와 다르다. [IndexNow FAQ](https://www.indexnow.org/faq)

확인 항목은 색인 가능 여부, 대표 URL 색인, 검색어별 노출·클릭, 게임 시작 전환이다. 구글·빙·네이버에서 순위를 언급할 때는 날짜·지역·기기·쿼리를 함께 기록한다. 기존 도메인의 명성이나 다른 서브도메인의 성과가 자동으로 이전된다고 가정하지 않는다.

## 10. GEO — AI가 인용할 만한 근거를 제공한다

여기서 GEO는 생성형 검색·답변에서 발견되고 인용되도록 콘텐츠를 준비하는 의미다. **우리만의 테스트 결과를 검색 가능한 문장과 표로 공개하는 것**을 핵심으로 한다.

Google은 AI Overviews·AI Mode에도 기존 SEO 원칙이 적용되고 별도의 AI 파일·특수 스키마가 필수가 아니라고 설명한다. `llms.txt`를 만드는 일을 핵심 콘텐츠보다 앞세우지 않는다. [Google AI 검색 안내](https://developers.google.com/search/docs/appearance/ai-features)

| 공개 자료 | 답해 줄 수 있는 질문 | 작성 기준 |
| --- | --- | --- |
| 차량 호환성 표 | “내 테슬라에서 어떤 게임을 할 수 있나?” | 모델·컴퓨터·SW·입력·검증 날짜를 함께 제공 |
| 패드 호환성 표 | “이 브라우저에서 Xbox/DualSense가 되나?” | OS·브라우저·연결 방식까지 명시 |
| 게임 한눈에 보기 | “가입 없이 5분 동안 할 만한 패드 게임은?” | 길이·규칙·입력·무료 이용·광고 여부를 첫 화면에서 요약 |
| 문제 해결 안내 | “패드가 연결됐는데 게임에서 안 보인다” | 직접 재현한 증상, 확인 순서, 실패 시 대안을 제시 |
| 측정 방법 | “지원된다는 근거는 무엇인가?” | 테스트 항목과 통과 기준, 제한 사항 공개 |

각 문서의 첫 문단은 질문에 직접 답하고, 뒤에 방법·표·스크린샷·날짜를 붙인다. 자체 확인과 사용자 제보를 구별하고 제작자 정보·변경 이력을 제공한다. AI가 읽는 본문과 사용자가 읽는 본문은 동일하게 유지한다.

공개 페이지는 검색 크롤러가 접근 가능하게 하고 OpenAI 검색 노출을 원하면 OAI-SearchBot 허용 여부를 확인한다. 검색용 OAI-SearchBot과 학습용 GPTBot 설정은 독립적이다. [OpenAI 크롤러 문서](https://developers.openai.com/api/docs/bots)

성과는 AI 서비스별 실제 유입과 인용을 나눠 본다. Bing Webmaster의 AI Performance는 지원되는 Microsoft·파트너 경험에서 인용된 페이지와 추이를 보여준다. 이를 전체 ChatGPT·Gemini 노출 지표로 해석하지 않는다. [Bing AI Performance](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c)

## 11. 배포 이후 확산 준비

장기 실험 일정 대신 **출시할 때 갖추고 배포할 자료**를 정한다.

| 채널 | 준비할 자료·활동 | 사이트로 연결하는 방식 |
| --- | --- | --- |
| 테슬라·EV 커뮤니티 | 실제 주차 상태의 20~40초 플레이 영상, 테스트 차량·SW·알려진 제한 | `/ko/tesla/` 또는 해당 게임으로 직접 연결 |
| 게임패드·웹게임 커뮤니티 | 마우스 없이 홈→게임→재시작하는 영상 | 컨트롤러 페이지로 연결 |
| YouTube Shorts·짧은 SNS 영상 | 게임 하나의 규칙을 바로 이해할 수 있는 한 판 장면 | 게임별 URL·설명 고정 |
| itch.io | 직접 만든 게임의 플레이 가능한 배포판, 제작자 정보, 개발 이야기 | 허용된 프로젝트 소개 영역에서 공식 사이트 안내 |
| 기존 iamdenny 서비스 | 실제 관련 있는 소개·푸터의 브랜드 링크 | 무관한 모든 페이지에 키워드 링크를 반복하지 않음 |
| 자체 공유 | 오늘의 퍼즐 결과·개인 최고 기록·친구와 같은 판 | seed·규칙 버전 링크, 개인정보 없이 공유 |

커뮤니티별 홍보 규칙을 확인하고 제작자임을 밝힌다. Tesla 공식 제휴·인증으로 오인할 표현이나 로고 중심 브랜드는 사용하지 않는다. 이번 작업은 PRD 작성이며 외부 게시·메시지 발송은 하지 않았다.

출시 기본 콘텐츠는 **게임 소개 2개 + 컨트롤러 안내 + Tesla 가이드 + 호환성 방법·결과 + 대표 문제 해결 글 3개**로 구성한다. 결과가 없는 호환성 페이지에는 가상의 성공 데이터를 채우지 않는다. 새 기기 검증이나 실제 오류 해결이 생길 때 해당 자료를 갱신한다.

## 12. 품질·성능·출시 조건

### 12.1 성능 목표

| 대상 | 제안 기준 | 확인 방법 |
| --- | --- | --- |
| 일반 콘텐츠 페이지 | p75 LCP ≤2.5초, INP ≤200ms, CLS ≤0.1 | 출시 전 실험실 검사, 출시 후 실제 사용자 지표 |
| 게임 첫 실행 | 10Mbps·왕복 지연 100ms·캐시 없는 기준에서 준비까지 p75 5초 이내 목표 | 최소 20회 반복 측정, 동의·광고 대기 시간은 별도 기록 |
| 재시작 | 이미 로드한 게임은 1초 이내 | 실제 브라우저에서 반복 확인 |
| 게임 프레임 | 일반 기기 60fps 목표, 저사양 모드 30fps 목표 | 실제 기기별 프레임 간격·끊김 확인 |
| 안정성 | 20분 연속 플레이에서 충돌·입력 고착·지속 메모리 증가 없음 | 기기별 장시간 시나리오 |

웹 핵심 지표의 좋은 기준은 Google 문서에 근거한다. 다른 수치는 제품의 개발 목표다. Lighthouse 점수는 실차 게임 조작이나 실제 사용자 INP를 대신하지 않는다. [Web Vitals](https://web.dev/articles/vitals)

### 12.2 필수 테스트

게임 규칙·퍼즐 해답·일일 seed는 자동 테스트한다. 홈에서 플레이·일시정지·복귀·저장·재시작까지 브라우저 자동화로 확인한다. 패드 매핑과 차량·모바일 조작은 실제 장치에서 확인한다. 광고 어댑터는 미게재·거절·실패·정상 종료·포커스 복귀를 테스트한다.

브라우저 저장 공간이 삭제되면 기록이 사라질 수 있음을 안내한다. 저장 스키마가 바뀌면 이전 상태를 안전하게 읽거나 명확히 안내한다. 게임 하나의 초기화가 다른 게임의 기록을 지우지 않도록 한다.

### 12.3 출시 전에 정리할 사항

| 항목 | 필요한 결과 |
| --- | --- |
| 국내 게임 등급분류 | 게임의 제공·수익 구조에 따른 적용 경로와 필요한 절차 확인 |
| 콘텐츠 권리 | 코드·그래픽·음원·폰트의 상업 이용·웹 배포 권리 기록 |
| 광고 | 선택 계정·루트 도메인 상태·ads.txt·CMP·게재 방식 확인 |
| 호스팅 | 광고 수익 서비스의 Pages 이용 적합성, 무료 사용 한도와 대안 확인 |
| 차량 표현 | 직접 테스트한 범위만 지원으로 표시 |
| 운영 정보 | 제작자·문의·개인정보·이용약관·광고 및 로컬 저장 안내 |

국내 게임 유통·이용 제공에는 등급분류 제도가 있으므로 “무료 웹게임이니 자동 면제”라고 가정하지 않는다. 구체적 적용과 절차는 첫 게임의 실제 내용·서비스 구조를 기준으로 확인한다. [정부 생활법령: 온라인 게임과 등급분류](https://www.easylaw.go.kr/CSP/CnpClsMain.laf?ccfNo=1&cciNo=1&cnpClsNo=1&csmSeq=2858)

## 13. 개발 순서와 산출물

일정은 1인 개발자와 AI 개발 보조, 주 25~35시간 투입을 가정한 **6~8주 초안**이다. 실차 확보·광고 심사·등급분류 관련 외부 절차의 대기 기간은 별도다.

| 순서 | 작업 | 완료 산출물 |
| --- | --- | --- |
| 1. 기반 확인 | 무료 배포 구조, 도메인·광고 계정 상태, 국내 제공 절차, 실차 확보 | 결정 기록과 저장소·배포 설계 |
| 2. 기술 프로토타입 | 간단한 게임판에서 터치·패드·소리·저장·차량 viewport 확인 | 입력 진단 화면, 실차별 초기 결과 |
| 3. 사이트 공통부 | 정적 페이지·다국어·메뉴·큰 화면·로컬 저장·공통 입력 | 홈·게임 소개·플레이 프레임 |
| 4. 게임 2종 | 퍼즐과 아케이드 규칙·콘텐츠·튜토리얼·일일 도전 | 플레이 가능한 출시 후보 |
| 5. 광고 연동 | 디스플레이 슬롯, H5 어댑터, CMP, 실패 복구, 도메인 설정 | 광고 통합 및 승인 준비. 실제 승인 여부는 별도 |
| 6. 검색·확산 자료 | SEO·GEO 본문, 호환성 표, 영상·스크린샷 | 언어별 검색 페이지와 배포 자료 |
| 7. 검증·배포 | 실제 기기·성능·저장·광고 복구·공개 URL 확인 | 출시 버전, 테스트 기록, 롤백 산출물 |

광고 승인 준비는 완성된 사이트가 갖춰지는 즉시 진행하며 마지막 단계까지 미루지 않는다. 구현 완료·사이트 승인·H5 승인·실제 광고 게재를 각각 기록한다. 광고 심사가 지연되더라도 광고 기능을 후속 선택 기능으로 낮추지 않는다.

## 14. 구현 착수용 최종 체크리스트

- [ ] 무료 정적 사이트로 설계하고 GitHub Pages를 우선 배포 대상으로 선택한다.
- [ ] Pages의 광고 수익 서비스 운영 적합성을 확인하고, 필요 시 동일 산출물의 무료 호스팅 대안을 사용한다.
- [ ] 자체 게임 2종과 공통 입력·저장·일시정지 기능을 구현한다.
- [ ] 광고는 P0로 구현하고 소개·가이드의 AdSense와 게임 내부 H5를 구분한다.
- [ ] `iamdenny.com` 계정·사이트·ads.txt 구성을 확인하고 기존 서비스 설정을 보존한다.
- [ ] 실차의 터치·패드·소리·저장·광고 후 복귀 결과를 항목별로 남긴다.
- [ ] 한국어·영어 검색용 본문과 호환성 자료를 준비한다.
- [ ] 서버를 요구하는 계정·순위·원격 멀티플레이는 첫 출시에서 제외한다.
- [ ] 정책·권리·국내 제공 절차 확인 후 공개 서비스와 광고 게재 상태를 각각 검증한다.

---

### 조사 범위와 미확인 사항

공식 제품·기술·검색·광고·호스팅 문서를 우선 확인했다. 차량용 소규모 서비스는 사이트와 제작자 공개 소개를 보조 자료로 사용했다. 관련 근거 링크는 각 주장 옆에 넣었다.

이번 조사에서 **직접 측정하지 않은 것**은 키워드 검색량·경쟁사 매출·서비스 전환율·실차 브라우저 동작·현재 AdSense 계정 상태·도메인 DNS·실제 광고 단가다. 현재 제품 지표나 확정 수익으로 해석할 숫자는 제시하지 않았다.

기존 Everyday Tools 기록에서는 비공개 소스/공개 산출물 분리와 검색 제출·색인·노출의 구분만 참고했다. 기존 사이트의 현재 배포·승인·광고 운영 상태는 이 프로젝트의 확인된 사실로 사용하지 않았다.

See [Player interaction and viewport](PLAYER-UX.md) for default in-page game presentation and direct board actions.

## Original logic campaigns — 2026-10-22

Add Lantern Grid and Number Trail as locally implemented bilingual puzzle games, bringing the public registry to 209 games. Each provides 24 solvable seeded stages, undo, local resume, keyboard and pointer controls, and visible next-stage progression. Original project-authored code and artwork use MIT; no third-party game assets are imported. Daily challenges remain the existing three games. See [ADR 0043](../adr/0043-original-logic-pack.md) for scope and validation boundaries.

## Game motion polish — 2026-10-22

Preserve immediate input, rules and saves while adding GSAP tile/stone movement to directly controlled games and shared score/result feedback across the catalogue. Load a bounded Three.js celebration only for eligible wins. Respect reduced motion and low effects, and clean up graphics on lifecycle changes. Scope and engine-by-engine coverage are recorded in [ADR 0044](../adr/0044-game-motion-system.md).

## Classic campaign expansion

The local catalogue includes the original Amber Trail, Starlight Apprentice and Beacon Quest campaigns, plus the reviewed Neverball easy set and Neverputt original course. Scope and remaining requested ports are tracked in [classic expansion](../guide/classic-expansion.md). Original campaigns must not be marketed as licensed remakes. Native data downloads are disclosed before play; native record persistence is distinct from mid-attempt saving.

## Promotional banner kit — 2026-10-22

Provide a footer-linked bilingual promotional download page with ten PNG sizes for desktop, mobile and social placements, exact dimensions, responsive previews and selectable embed HTML. Use original brand artwork without audience or advertising-approval claims. See [ADR 0046](../adr/0046-promotional-banners.md).

## Korean market catalogue extension — 2026-10-22

Add Yutnori as a locally playable Korean board game to strengthen the existing Korean-language board-game entry. The game supports 2–4 people sharing one browser, four pieces per player, the five base throw results, diagonal shortcuts, stacking, capture and extra throws. It has no AI, online matchmaking or external play site. Its exact-finish and no-Back-do rules are labeled as this edition's choices because regional rules can differ.

Register English and Korean game copy, a Korean rules guide with an English equivalent, original MIT code and illustration, accurate multiplayer-only metadata, a direct local play route and links from the existing classic-board collection. Add search-intent coverage for 윷놀이 게임/규칙/하는 법 and English Yutnori queries without claiming search volume or first-page position. The public game count becomes 215 after merge.

Acceptance requires pure rules coverage for throw mapping, paths, exact finish, stack movement, capture, extra turns and save validation; browser journeys for 2–4 players, pause/reload/restart, both locales and 320–430px phone plus iPad/desktop widths; regenerated actual-game screenshot; docs/SEO/catalogue parity; and the repository verification pipeline. A passing build or emulator does not verify physical phones, gamepads, Tesla browsers, external indexing, rank, traffic or revenue. See [ADR 0047](../adr/0047-original-yutnori.md).

## Optional Adsterra display integration — 2026-10-23

The owner requested Adsterra activation. Use one consent-gated 300×250 banner on home and game details in each language, with no gameplay advertising. Google-specific approval/CMP gates remain unchanged; Adsterra has its own explicit choice and provider/filter readiness gates. See [ADR 0048](../adr/0048-adsterra-banners.md).

## Original arcade expansion — 2026-10-23

Add eight original games covering bomb mazes, snowball arenas, artillery, tank defense, splitting spheres, bubble puzzles, vertical shooting and ladder escapes. Four support same-device two-player play; four are solo. Publish bilingual game details, controls, a comparison guide and a curated collection, with generated canonical/schema/search/sitemap coverage and `llms.txt` links. Use original code, names and visual content; no commercial ROM or licensed-remake claim is permitted. See [ADR 0051](../adr/0051-original-retro-eight.md).

Expand optional GA4 measurement to consented game starts and completed rounds using only the game ID and sanitized page context. Renew the earlier page-view-only permission, do not replay historical activity, and keep analytics optional for play. Provider receipt, search indexing and AI discovery remain separately verified outcomes; see [ADR 0050](../adr/0050-consented-game-analytics.md).

## Visible placements and owned-service promotion — 2026-10-23

Use one consented Adsterra slot after home picks, inside the all-games list, and below the full-viewport player. Original MODU TT and Tools image banners promote owned services without ad-provider requests. See [ADR 0053](../adr/0053-ad-placements-and-house-banners.md), which supersedes the earlier no-player-route restriction only outside the game surface.
## Solo and same-device search — 2026-10-23

Search integration follows [ADR 0055](../adr/0055-compact-search-discovery-and-ads.md): compact mobile filter controls, visible selection answers in the canonical bilingual board guide and llms.txt, existing consented GA4 coverage without search terms, and one consented Adsterra placement below a search page with at least eight results. Search remains noindex; Google advertising remains verification-only until its separate approval gates pass.

Search offers a bilingual player filter for solo or together on one device. Derive membership from the registry's explicit play modes and existing classic-board default; Yutnori is multiplayer-only. Show supported modes on each result and combine the filter with query, genre, controls and length. Preserve it through pagination, reload, browser history and language changes, and clear invalid values. Explain that together means sharing one device without online matchmaking. Search stays noindex with static collection fallbacks. See [ADR 0052](../adr/0052-player-mode-search.md).
