import type { Article } from "./pages";
import type { Locale } from "../lib/types";
export const arcadeTrioGuides: Record<string, Record<Locale, Article>> = {
  "guides/snack-street": {
    en: {
      title: "Snack Street: cooking, customers and shop upgrades",
      links: [{ label: "Play now", href: "/en/play/snack-street/" }],
      intro:
        "Snack Street is an original single-player restaurant game. Run a small Korean snack counter through five days, with three recipes and local browser saves.",
      sections: [
        {
          heading: "What do I cook?",
          paragraphs: [
            "Prepare tteokbokki, gimbap and fish cake skewers at three independent stations. Each recipe needs its own preparation steps. Tteokbokki and fish cake need cooking time, while gimbap is ready after preparation.",
            "Check the waiting order before serving. The stations can work at the same time, so starting a simmer before preparing gimbap keeps the counter moving.",
          ],
        },
        {
          heading: "How does the shop grow?",
          paragraphs: [
            "Correct orders earn coins and consecutive service builds a combo. A customer's patience falls while the shop is running. Serve in time and use the day-end upgrade choices to improve your shop.",
            "The campaign lasts five days with forty customers; serve at least twenty-four to win. The game shows the actual day, orders and earnings; it has no real-money purchases, account or global leaderboard.",
          ],
        },
        {
          heading: "Can I pause or continue later?",
          paragraphs: [
            "Pause freezes cooking and customer timers. The shared player saves progress in this browser, including current orders and upgrades. Reload or change language, then explicitly start or resume to continue.",
            "Restart begins a new campaign. Clearing site data removes the local save. There is no cloud or cross-device synchronization.",
          ],
        },
      ],
    },
    ko: {
      title: "분식집 타이쿤: 분식 골목 조리·손님·업그레이드 안내",
      links: [{ label: "바로 플레이", href: "/ko/play/snack-street/" }],
      intro:
        "분식 골목은 혼자 즐기는 자체 제작 요리·경영 게임입니다. 세 가지 메뉴를 만들며 작은 분식집의 닷새를 보내고, 이 브라우저에 진행을 저장합니다.",
      sections: [
        {
          heading: "어떤 음식을 만드나요?",
          paragraphs: [
            "세 조리대에서 떡볶이·김밥·어묵을 준비합니다. 메뉴마다 준비 횟수가 다르며 떡볶이와 어묵은 끓이는 시간이 필요합니다. 김밥은 준비를 마치면 바로 완성됩니다.",
            "음식을 내기 전에 기다리는 주문을 확인하세요. 조리대는 동시에 작동하므로 끓이는 요리를 먼저 올리고 김밥을 준비하면 좋습니다.",
          ],
        },
        {
          heading: "가게는 어떻게 성장하나요?",
          paragraphs: [
            "맞는 주문을 내면 동전을 받고 연속으로 성공하면 콤보가 쌓입니다. 가게가 열려 있는 동안 손님의 기다림이 줄어듭니다. 하루를 마치면 업그레이드를 선택해 가게를 개선하세요.",
            "캠페인은 닷새 동안 손님 40명을 상대하며, 24명 이상에게 서빙하면 승리합니다. 실제 진행한 날짜·주문·수입을 표시하며 현금 결제·계정·전 세계 순위는 없습니다.",
          ],
        },
        {
          heading: "멈췄다가 이어 할 수 있나요?",
          paragraphs: [
            "일시정지하면 조리와 손님 타이머가 멈춥니다. 공통 플레이어가 주문·업그레이드 등 진행을 이 브라우저에 저장합니다. 새로고침하거나 언어를 바꾼 뒤 시작·계속 버튼을 눌러 이어가세요.",
            "다시 시작은 새 캠페인을 만듭니다. 사이트 데이터를 지우면 저장도 사라지며, 클라우드나 다른 기기와 동기화하지 않습니다.",
          ],
        },
      ],
    },
  },
  "guides/pocket-pingpong": {
    en: {
      title: "Pocket Table Tennis: serves, shots and the three-opponent league",
      links: [{ label: "Play now", href: "/en/play/pocket-pingpong/" }],
      intro:
        "This original solo arcade game turns table tennis into short first-to-five matches. It uses simplified rules, not a simulation of official tournament scoring.",
      sections: [
        {
          heading: "How do I return the ball?",
          paragraphs: [
            "Serve to begin. Drag across the table or use Left/Right to align your paddle with the incoming ball. Contact happens automatically when you are in position. The ball's shadow and bounce show its path.",
            "Drive is the forgiving starting shot. Topspin changes the pace, while Smash is faster and requires more precise contact. Choose with the labeled shot buttons.",
          ],
        },
        {
          heading: "How do I win the league?",
          paragraphs: [
            "Win a match by reaching five points before the computer. Continue through three opponents with different tracking speeds. Losing ends the attempt; restart to try the league again.",
            "This is single-player against the computer. There is no online matchmaking or same-device opponent mode in this game.",
          ],
        },
        {
          heading: "What is saved?",
          paragraphs: [
            "Your league, score and current rally are saved in this browser by the shared player. Pause stops play. Reload or switch language and explicitly resume your saved game. Clearing site data removes progress.",
          ],
        },
      ],
    },
    ko: {
      title: "포켓 탁구 리그: 서브·구질·세 상대 공략",
      links: [{ label: "바로 플레이", href: "/ko/play/pocket-pingpong/" }],
      intro:
        "짧은 5점 경기로 즐기는 자체 제작 1인 탁구 아케이드입니다. 정식 대회의 득점 체계를 그대로 재현하지 않고 간소화한 규칙을 사용합니다.",
      sections: [
        {
          heading: "공은 어떻게 받아치나요?",
          paragraphs: [
            "서브로 시작한 뒤 탁구대에서 드래그하거나 좌우 버튼으로 라켓을 다가오는 공에 맞추세요. 위치가 맞으면 자동으로 받아칩니다. 공의 그림자와 바운드를 보며 궤적을 읽으세요.",
            "드라이브는 처음 익히기 좋은 구질입니다. 회전으로 속도에 변화를 주고, 더 빠르지만 정확한 접촉이 필요한 스매시를 시도하세요. 화면의 구질 버튼으로 선택합니다.",
          ],
        },
        {
          heading: "리그는 어떻게 우승하나요?",
          paragraphs: [
            "컴퓨터보다 먼저 5점을 얻으면 한 경기에서 이깁니다. 움직임이 다른 세 상대에게 차례로 도전하세요. 지면 도전이 끝나며 다시 시작해 리그에 재도전할 수 있습니다.",
            "혼자 컴퓨터와 대결하는 게임입니다. 온라인 매칭이나 같은 기기 2인 대전은 제공하지 않습니다.",
          ],
        },
        {
          heading: "어디까지 저장되나요?",
          paragraphs: [
            "공통 플레이어가 리그·점수·현재 랠리를 이 브라우저에 저장합니다. 일시정지하면 진행이 멈춥니다. 새로고침이나 언어 변경 뒤 직접 계속하기를 눌러 이어가세요. 사이트 데이터를 지우면 기록도 사라집니다.",
          ],
        },
      ],
    },
  },
};
