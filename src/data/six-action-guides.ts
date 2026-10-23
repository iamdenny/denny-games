import type { Article } from "./pages";
import type { Locale } from "../lib/types";
export const sixActionGuides: Record<string, Record<Locale, Article>> = {
  "guides/meteor-guard": {
    en: {
      title: "Meteor Guard rules and scoring guide",
      intro:
        "Learn to lead falling meteors, place expanding interception blasts and preserve a city through all five waves. This guide explains the final-threat resolution rule, firing controls and local continuation.",
      links: [
        {
          label: "Play now",
          href: "/en/play/meteor-guard/",
        },
      ],
      sections: [
        {
          heading: "Rules and scoring",
          paragraphs: [
            "Each destroyed meteor gives 100 points. Surviving an intermediate wave adds 250 points. A meteor that reaches the skyline destroys its targeted city once.",
          ],
        },
        {
          heading: "Controls and strategy",
          paragraphs: [
            "Tap the sky to aim and fire. Alternatively adjust the horizontal and height sliders and press Fire or Space. A short reload prevents unlimited firing.",
            "Aim a little below a descending meteor so the interceptor meets it in time. Overlapping threats can be caught in one expanding blast. All remaining meteors, interceptors and blasts must resolve before the next wave or the final win.",
          ],
        },
        {
          heading: "Pause and continue",
          paragraphs: [
            "Pause freezes the simulation. Your current round stays in this browser and reload requires an explicit start. Restart begins a fresh game. These original games use local progress without an account; clearing site data removes it. Optional analytics follows your existing consent choice.",
          ],
        },
      ],
    },
    ko: {
      title: "유성 방어대 규칙·점수·조작 공략",
      intro:
        "다섯 웨이브를 통과할 때까지 도시를 지키는 요령을 알아보세요. 유성의 이동을 예측해 폭발을 배치하는 법, 마지막 위협 정리 조건과 조작·이어하기를 안내합니다.",
      links: [
        {
          label: "바로 플레이",
          href: "/ko/play/meteor-guard/",
        },
      ],
      sections: [
        {
          heading: "규칙과 점수",
          paragraphs: [
            "유성 하나를 제거하면 100점, 중간 웨이브를 넘기면 250점을 얻습니다. 지면에 닿은 유성은 목표 도시를 한 번만 파괴해요.",
          ],
        },
        {
          heading: "조작과 공략",
          paragraphs: [
            "하늘을 터치하면 조준과 발사를 함께 합니다. 가로·높이 조준 슬라이더를 움직인 뒤 발사 버튼이나 Space를 눌러도 됩니다. 짧은 재장전 시간이 있어요.",
            "내려오는 유성보다 조금 아래를 노려 요격탄의 이동 시간을 고려하세요. 가까운 유성들은 하나의 폭발로 함께 없앨 수 있어요. 마지막 유성·요격탄·폭발까지 정리되어야 다음 웨이브나 최종 승리로 넘어갑니다.",
          ],
        },
        {
          heading: "멈추고 이어하기",
          paragraphs: [
            "일시정지는 시뮬레이션을 멈춥니다. 진행은 현재 브라우저에 저장되며 새로고침한 뒤 직접 시작해야 이어집니다. 다시 시작하면 새 판을 엽니다. 계정 없이 로컬 진행을 사용하며 사이트 데이터를 지우면 기록도 삭제돼요. 선택적 분석은 기존 동의 설정을 따릅니다.",
          ],
        },
      ],
    },
  },
  "guides/pocket-bowling": {
    en: {
      title: "Pocket Bowling rules and scoring guide",
      intro:
        "Understand ten-frame scoring, read the changing visible pocket target and choose the recommended power before each roll. This guide covers unresolved bonuses, tenth-frame extra balls and local continuation.",
      links: [
        {
          label: "Play now",
          href: "/en/play/pocket-bowling/",
        },
      ],
      sections: [
        {
          heading: "Rules and scoring",
          paragraphs: [
            "An ordinary frame allows two rolls. A strike knocks down ten on the first roll and adds the next two rolls; a spare clears the rack with two rolls and adds the next roll. Unresolved bonus frames wait for later rolls before appearing in the total.",
          ],
        },
        {
          heading: "Controls and strategy",
          paragraphs: [
            "Adjust Aim and Power with touch, mouse or native slider arrow keys, then press Roll or Space. Watch the ball and pin animation before preparing the next roll. The visible target aim and power change with each roll; match the red pocket marker and the displayed power recommendation.",
            "The tenth frame grants two extra rolls for a strike or one for a spare. After a strike, another strike resets the rack; otherwise the second bonus ball uses the remaining pins. This original simplified arcade model rewards reading the visible pocket target rather than simulating full rigid-body bowling.",
          ],
        },
        {
          heading: "Pause and continue",
          paragraphs: [
            "Pause freezes the simulation. Your current round stays in this browser and reload requires an explicit start. Restart begins a fresh game. These original games use local progress without an account; clearing site data removes it. Optional analytics follows your existing consent choice.",
          ],
        },
      ],
    },
    ko: {
      title: "포켓 볼링 규칙·점수·조작 공략",
      intro:
        "10프레임 점수와 매 투구마다 달라지는 포켓 조준·권장 힘을 알아보세요. 아직 계산되지 않은 보너스, 마지막 프레임 추가 공과 이어하기를 함께 설명합니다.",
      links: [
        {
          label: "바로 플레이",
          href: "/ko/play/pocket-bowling/",
        },
      ],
      sections: [
        {
          heading: "규칙과 점수",
          paragraphs: [
            "일반 프레임은 두 번 던집니다. 첫 공에 10개를 쓰러뜨리는 스트라이크는 다음 두 투구, 두 번째 공까지 모두 정리하는 스페어는 다음 한 투구를 더합니다. 보너스가 아직 결정되지 않은 프레임 점수는 후속 투구를 기다려요.",
          ],
        },
        {
          heading: "조작과 공략",
          paragraphs: [
            "터치·마우스 또는 슬라이더 방향키로 조준과 힘을 정한 뒤 굴리기나 Space를 누르세요. 공과 핀 애니메이션이 끝나야 다음 투구를 준비할 수 있습니다. 매 투구마다 달라지는 추천 조준·힘을 확인하고 빨간 포켓 표식과 권장 힘에 맞추세요.",
            "10프레임 스트라이크는 두 번, 스페어는 한 번의 추가 투구를 얻습니다. 스트라이크 뒤 다시 스트라이크면 핀을 새로 놓고, 그렇지 않으면 남은 핀을 다음 보너스 공으로 노립니다. 실제 강체 물리 전체를 재현하기보다 일정한 포켓 조준을 보상하는 자체 아케이드 모델입니다.",
          ],
        },
        {
          heading: "멈추고 이어하기",
          paragraphs: [
            "일시정지는 시뮬레이션을 멈춥니다. 진행은 현재 브라우저에 저장되며 새로고침한 뒤 직접 시작해야 이어집니다. 다시 시작하면 새 판을 엽니다. 계정 없이 로컬 진행을 사용하며 사이트 데이터를 지우면 기록도 삭제돼요. 선택적 분석은 기존 동의 설정을 따릅니다.",
          ],
        },
      ],
    },
  },
};
