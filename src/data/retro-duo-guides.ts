import type { Article } from "./pages";
import type { Locale } from "../lib/types";
export const retroDuoGuides: Record<string, Record<Locale, Article>> = {
  "guides/star-pinball": {
    en: {
      title: "Star Pinball rules, controls and strategy",
      intro:
        "Learn the three-ball rules of Star Pinball: launch a waiting ball, time the two flippers, collect bumper and target points, and finish the third ball with at least 1,500 points. This guide explains controls, timing and local continuation.",
      links: [
        {
          label: "Play now",
          href: "/en/play/star-pinball/",
        },
      ],
      sections: [
        {
          heading: "How does a round work?",
          paragraphs: [
            "Launch only when a ball is waiting. Use the two flippers to send a falling ball back toward bumpers and targets.",
            "Bumpers and targets award points. Watch the score and the remaining balls; a ball passing the bottom drain uses one ball.",
            "Play all three balls and finish with at least 1,500 points to win. You can keep scoring after reaching the goal; the result is decided after the third drain. This is a simplified original arcade table.",
          ],
        },
        {
          heading: "How do I control the game?",
          paragraphs: [
            "Touch or mouse: hold the left or right flipper buttons and press Launch when a ball is ready.",
            "Keyboard: Left/Right or A/D holds each flipper; Space launches a waiting ball. Use the shared Pause button to stop the round.",
            "Pause and reload preserve progress locally. Restart begins a new three-ball round.",
          ],
        },
        {
          heading: "What should I try first?",
          paragraphs: [
            "Watch the ball near the flippers and time your return instead of holding both flippers throughout the round.",
            "Try sending the ball toward the upper bumpers and targets to build points.",
            "After a drain, take a breath and launch the next ball when ready.",
          ],
        },
        {
          heading: "What is saved and measured?",
          paragraphs: [
            "Progress and best scores are stored in this browser, without an account or cross-device sync. Clearing site data removes these records. Analytics is optional: only after permission, the existing shared player measures game starts and completed rounds. Advertising choices are separate and do not prevent play.",
          ],
        },
      ],
    },
    ko: {
      title: "별빛 핀볼 규칙·조작·점수 공략",
      intro:
        "별빛 핀볼의 공 세 개 규칙과 플리퍼 조작을 알아보세요. 대기 중인 공을 발사하고 범퍼·표적으로 점수를 쌓아 세 번째 공이 끝날 때 1,500점 이상을 노립니다. 타이밍 팁과 로컬 이어하기도 안내합니다.",
      links: [
        {
          label: "바로 플레이",
          href: "/ko/play/star-pinball/",
        },
      ],
      sections: [
        {
          heading: "한 판은 어떻게 진행되나요?",
          paragraphs: [
            "공이 대기 중일 때 발사하세요. 내려오는 공을 두 플리퍼로 받아 범퍼와 표적 쪽으로 돌려보내세요.",
            "범퍼와 표적을 맞히면 점수를 얻습니다. 공이 아래 배수구로 빠질 때마다 남은 공이 하나 줄어요.",
            "공 세 개를 모두 사용한 뒤 총점이 1,500점 이상이면 승리합니다. 목표에 도달한 뒤에도 점수를 더 쌓을 수 있으며 마지막 공이 빠지면 결과를 판정해요. 자체 제작한 간소화 아케이드 규칙입니다.",
          ],
        },
        {
          heading: "어떻게 조작하나요?",
          paragraphs: [
            "터치·마우스: 왼쪽·오른쪽 플리퍼 버튼을 길게 누르고 공이 준비되면 발사 버튼을 누르세요.",
            "키보드: ←/→ 또는 A/D로 플리퍼를 들고 Space로 대기 중인 공을 발사하세요. 공통 일시정지 버튼으로 멈출 수 있어요.",
            "멈추거나 새로고침해도 이 브라우저의 진행을 이어갑니다. 다시 시작하면 공 세 개로 새 판을 시작해요.",
          ],
        },
        {
          heading: "처음에는 무엇을 노리면 좋나요?",
          paragraphs: [
            "두 플리퍼를 계속 들기보다 공이 내려오는 위치를 보고 타이밍을 맞춰보세요.",
            "공을 위쪽 범퍼와 표적 쪽으로 보내 점수를 쌓으세요.",
            "공이 빠지면 서두르지 말고 다음 공을 준비한 뒤 발사하세요.",
          ],
        },
        {
          heading: "저장과 통계는 어떻게 처리되나요?",
          paragraphs: [
            "진행과 최고 기록은 계정 없이 이 브라우저에 저장하며 다른 기기로 동기화하지 않습니다. 사이트 데이터를 지우면 기록도 사라집니다. 통계는 선택 사항으로, 허용한 경우에만 공통 플레이어가 게임 시작·완료를 측정합니다. 광고 동의는 별도이며 거절해도 게임을 할 수 있습니다.",
          ],
        },
      ],
    },
  },
  "guides/jewel-drop": {
    en: {
      title: "Jewel Drop rules, controls and strategy",
      intro:
        "Learn how to arrange three-gem columns in Jewel Drop, rotate their order and create horizontal, vertical or diagonal matches. This guide covers gravity chains, the sixty-gem goal, touch and keyboard controls, and saved rounds.",
      links: [
        {
          label: "Play now",
          href: "/en/play/jewel-drop/",
        },
      ],
      sections: [
        {
          heading: "How does a round work?",
          paragraphs: [
            "Move the falling three-gem column and rotate its order before it lands. The next column preview helps you plan ahead.",
            "Lines of at least three equal gems clear in horizontal, vertical or either diagonal direction. Remaining gems fall and can create more matches.",
            "Clear 60 gems to win. A blocked spawn ends the round. Falling becomes faster as you progress; shapes distinguish the gem types as well as color.",
          ],
        },
        {
          heading: "How do I control the game?",
          paragraphs: [
            "Touch or mouse: use Left, Right, Rotate and Drop buttons.",
            "Keyboard: Left/Right moves, Up rotates, Down lowers the column and Space drops it immediately.",
            "Pause stops falling. Reload or change language and explicitly resume the saved round; Restart clears the board.",
          ],
        },
        {
          heading: "What should I try first?",
          paragraphs: [
            "Look for diagonal opportunities as well as vertical stacks.",
            "Use the next preview to leave a useful gap for the following column.",
            "A match under another group can trigger a chain after gravity settles it. Keep the spawn area open.",
          ],
        },
        {
          heading: "What is saved and measured?",
          paragraphs: [
            "Progress and best scores are stored in this browser, without an account or cross-device sync. Clearing site data removes these records. Analytics is optional: only after permission, the existing shared player measures game starts and completed rounds. Advertising choices are separate and do not prevent play.",
          ],
        },
      ],
    },
    ko: {
      title: "보석 낙하 규칙·조작·연쇄 공략",
      intro:
        "보석 낙하에서 세 보석의 순서를 돌리고 가로·세로·대각선으로 연결하는 방법을 알아보세요. 중력으로 이어지는 연쇄, 보석 60개 목표, 터치·키보드 조작과 저장된 판 이어하기를 안내합니다.",
      links: [
        {
          label: "바로 플레이",
          href: "/ko/play/jewel-drop/",
        },
      ],
      sections: [
        {
          heading: "한 판은 어떻게 진행되나요?",
          paragraphs: [
            "떨어지는 세 보석의 기둥을 옮기고 착지 전에 순서를 돌리세요. 다음 보석 미리보기로 한 수 앞을 계획할 수 있어요.",
            "같은 보석을 가로·세로·양쪽 대각선으로 세 개 이상 이어 지웁니다. 남은 보석이 내려오면서 다시 맞으면 연쇄가 생겨요.",
            "보석 60개를 지우면 승리합니다. 생성 위치가 막히면 한 판이 끝나요. 진행에 따라 낙하가 빨라지며, 색과 모양으로 보석 종류를 구분합니다.",
          ],
        },
        {
          heading: "어떻게 조작하나요?",
          paragraphs: [
            "터치·마우스: 왼쪽·오른쪽·회전·낙하 버튼을 사용하세요.",
            "키보드: ←/→ 이동, ↑ 순서 회전, ↓ 한 칸 내리기, Space 즉시 떨어뜨리기입니다.",
            "일시정지하면 낙하가 멈춥니다. 새로고침·언어 변경 후 시작 버튼을 눌러 저장된 판을 이어가고, 다시 시작하면 판을 비웁니다.",
          ],
        },
        {
          heading: "처음에는 무엇을 노리면 좋나요?",
          paragraphs: [
            "세로로 쌓는 방법뿐 아니라 대각선으로 이어질 자리도 살펴보세요.",
            "다음 보석을 보고 다음 기둥을 놓을 공간을 남겨두세요.",
            "아래쪽 보석을 지우면 위 보석이 내려오며 연쇄가 생길 수 있어요. 생성 위치를 비워 두세요.",
          ],
        },
        {
          heading: "저장과 통계는 어떻게 처리되나요?",
          paragraphs: [
            "진행과 최고 기록은 계정 없이 이 브라우저에 저장하며 다른 기기로 동기화하지 않습니다. 사이트 데이터를 지우면 기록도 사라집니다. 통계는 선택 사항으로, 허용한 경우에만 공통 플레이어가 게임 시작·완료를 측정합니다. 광고 동의는 별도이며 거절해도 게임을 할 수 있습니다.",
          ],
        },
      ],
    },
  },
};
