import type { Article } from "./pages";
import type { Locale } from "../lib/types";
import { sixMovementGames } from "./six-movement";
/** Text-only discovery content; no game module is imported into editorial routes. */
export const sixMovementGuides: Record<
  string,
  Record<Locale, Article>
> = Object.fromEntries(
  sixMovementGames.map((game) => [
    `guides/${game.id}`,
    Object.fromEntries(
      (["en", "ko"] as const).map((locale) => {
        const ko = locale === "ko",
          copy = game.text[locale];
        return [
          locale,
          {
            title: ko
              ? `${copy.title} 규칙과 단계별 공략`
              : `${copy.title} rules and stage strategy`,
            intro:
              game.id === "traffic-escape"
                ? ko
                  ? "교통 탈출의 12개 주차장을 푸는 방법을 알아보세요. 차량의 이동 방향, 출구를 막는 차의 순서, 되돌리기와 점수 규칙을 설명합니다. 시간을 재촉하지 않고 빈 공간을 만드는 슬라이딩 퍼즐입니다."
                  : "Learn how to untangle the twelve Traffic Escape parking lots. This guide explains each car’s movement axis, clearing blockers, undo and move-based scoring. Plan the empty spaces without a countdown."
                : ko
                  ? "강 건너기의 다섯 단계를 준비하세요. 차를 피하는 도로와 통나무를 타는 강의 차이, 안전한 둔치에서 기다리는 법, 목숨과 단계별 저장을 설명합니다. 옆으로 흐르는 통나무의 움직임을 다음 도약에 활용해 보세요."
                  : "Prepare for all five River Hop stages. Learn the difference between road hazards and log-supported water lanes, how to wait on safe banks, and how lives and stage saves work. Use the moving logs to prepare your next hop.",
            links: [
              {
                label: ko ? "지금 플레이" : "Play now",
                href: `/${locale}/play/${game.id}/`,
              },
            ],
            sections: [
              {
                heading: ko
                  ? "무엇을 하면 완료하나요?"
                  : "What completes a stage?",
                paragraphs: copy.rules,
              },
              {
                heading: ko
                  ? "어떻게 조작하나요?"
                  : "How do the controls work?",
                paragraphs: copy.controls,
              },
              {
                heading: ko ? "막혔을 때 살펴볼 것" : "What should I look for?",
                paragraphs: copy.tips,
              },
              {
                heading: ko
                  ? "진행 저장과 개인정보"
                  : "Saved progress and privacy",
                paragraphs: [
                  ko
                    ? "현재 단계의 진행과 개인 기록은 이 브라우저에 저장됩니다. 사이트 데이터를 지우면 기록도 사라지며 다른 기기로 자동 동기화하지 않습니다. 분석을 허용한 경우에만 공통 플레이어가 시작·완료 이벤트를 기록합니다. 차량 위치, 이동 경로와 키 입력은 분석으로 전송하지 않습니다."
                    : "Stage progress and personal records are stored in this browser. Clearing site data removes them; there is no automatic sync across devices. Only after analytics permission does the shared player record start and completion events. Car positions, movement routes and key inputs are not sent as analytics.",
                ],
              },
            ],
          } satisfies Article,
        ];
      }),
    ),
  ]),
) as Record<string, Record<Locale, Article>>;
