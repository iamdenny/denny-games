import { games } from "./games";
import type { Locale } from "../lib/types";
export interface Article {
  title: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
  links?: { label: string; href: string }[];
}
export const articles: Record<string, Record<Locale, Article>> = {
  "guides/yutnori-rules": {
    en: {
      title: "How to play Yutnori: throw results, shortcuts and stacking",
      intro:
        "Learn the Do, Gae, Geol, Yut and Mo results, follow the 29-space board and choose when to stack or capture. This Denny Games version is a free, local 2–4 player game; regional Yutnori rules can differ.",
      sections: [
        {
          heading: "What do Do, Gae, Geol, Yut and Mo mean?",
          paragraphs: [
            "Throw four sticks. The number of flat faces pointing up sets the move: one is Do (1 space), two Gae (2), three Geol (3), and four Yut (4). If all four rounded faces point up, the result is Mo (5). Yut and Mo grant one more throw after you move.",
            "This digital board models each stick as an even 50/50 random result. Physical sticks can have different shapes and balances, so the odds in a browser game should not be treated as a measurement of real sticks.",
          ],
        },
        {
          heading: "How does the 29-space board work?",
          paragraphs: [
            "A piece enters the outer course from the yard. At an in-run corner, choose the outer route or a diagonal shortcut. A piece that takes a diagonal follows it through the shared centre to the opposite corner; it does not turn onto the other diagonal at the centre. Choosing a route commits the move immediately.",
            "A move that would pass over the finish is unavailable in this edition. Pieces must land on the finish exactly. This is a clearly stated Denny Games house rule because families and regions use different Yutnori conventions.",
          ],
        },
        {
          heading: "When do pieces stack or get captured?",
          paragraphs: [
            "You may bring a piece out of the yard or move a piece already on the board. When your piece lands on another of your pieces, they form one stack and move together. When it lands on an opponent's stack, the whole captured stack returns to its yard and you earn another throw.",
            "Passing over another piece does not capture it; the capture happens only when the move ends on its space. Yut and Mo also grant an extra throw, so a player may move and throw again before the next player begins.",
          ],
        },
        {
          heading: "Is Back-do included?",
          paragraphs: [
            "No. This version uses the base Do–Mo results and does not include Back-do, the optional one-step-back result found in some modern house-rule sets. The National Folk Museum of Korea describes Back-do as a later variation. We leave it out so the route and stick rules stay explicit in this first release.",
          ],
        },
        {
          heading: "Can I play with a friend on one phone?",
          paragraphs: [
            "Yes. Choose two, three or four players before starting, then pass the same device after each turn. All four pieces and the current throw are saved in this browser. There is no AI, account, online room or connection to a second device.",
            "The first player to bring all four pieces to the finish wins. Use the route-choice buttons for shortcuts, the yard for unstarted pieces and the highlighted stacks for pieces already in play.",
          ],
        },
      ],
      links: [
        {
          label: "Play Yutnori free in your browser",
          href: "/en/play/yutnori/",
        },
        {
          label: "Compare the board games",
          href: "/en/collections/classic-board/",
        },
        {
          label: "National Folk Museum of Korea · Yutnori",
          href: "https://folkency.nfm.go.kr/kr/topic/detail/1595",
        },
      ],
    },
    ko: {
      title: "윷놀이 하는 법: 도·개·걸·윷·모, 지름길과 말 업기",
      intro:
        "도·개·걸·윷·모 결과를 읽고 29밭 말판을 이동하며, 말을 업거나 잡는 방법을 알아보세요. 데니 게임즈 버전은 무료 2~4인 로컬 게임입니다. 지역과 모임에 따라 윷놀이 규칙은 달라질 수 있습니다.",
      sections: [
        {
          heading: "도·개·걸·윷·모는 몇 칸인가요?",
          paragraphs: [
            "윷가락 네 개를 던져 평평한 면이 위를 향한 개수를 셉니다. 하나는 도 1칸, 둘은 개 2칸, 셋은 걸 3칸, 넷은 윷 4칸입니다. 네 개 모두 둥근 면이 위를 향하면 모 5칸입니다. 윷과 모는 이동한 뒤 한 번 더 던질 수 있습니다.",
            "이 게임은 각 윷가락 결과를 50 대 50으로 생성합니다. 실제 윷가락은 모양과 무게 중심이 다를 수 있으므로 브라우저 결과 확률을 실물 윷의 측정값으로 보면 안 됩니다.",
          ],
        },
        {
          heading: "29밭 말판의 지름길은 어떻게 타나요?",
          paragraphs: [
            "말은 대기 자리에서 바깥길로 나옵니다. 말판의 안쪽 모서리에 도착하면 바깥길 또는 대각선 지름길을 고르세요. 지름길에 들어간 말은 중앙을 지나 반대쪽 모서리까지 같은 대각선으로 이동하며, 중앙에서 다른 대각선으로 꺾지 않습니다. 경로를 고르면 이동이 바로 확정됩니다.",
            "이 버전에서는 도착점을 지나치는 이동은 선택할 수 없고, 정확한 수로 도착해야 합니다. 윷놀이는 지역·가족마다 규칙이 다르므로 이 규칙을 데니 게임즈의 적용 규칙으로 명시합니다.",
          ],
        },
        {
          heading: "말은 언제 업고 잡나요?",
          paragraphs: [
            "대기 중인 새 말을 출발시키거나 이미 말판에 나온 말을 움직일 수 있습니다. 내 말이 다른 내 말이 있는 밭에 도착하면 한 무리로 업혀 함께 이동합니다. 상대 말무리가 있는 밭에 도착하면 그 무리 전체를 대기 자리로 돌려보내고 한 번 더 던집니다.",
            "상대 말을 지나치는 것만으로는 잡지 않습니다. 이동이 끝난 밭에 도착했을 때 잡습니다. 윷·모가 나와도 한 번 더 던질 수 있으므로 다음 플레이어가 시작하기 전에 이동과 던지기를 이어갈 수 있습니다.",
          ],
        },
        {
          heading: "빽도도 있나요?",
          paragraphs: [
            "없습니다. 이 버전은 도·개·걸·윷·모를 적용하고, 일부 현대 규칙에서 사용하는 한 칸 뒤로 가는 빽도는 제외했습니다. 국립민속박물관은 빽도를 후대에 추가된 변형으로 설명합니다. 첫 버전에서는 말 경로와 윷 결과를 분명하게 유지하기 위해 빼 두었습니다.",
          ],
        },
        {
          heading: "휴대폰 하나로 친구와 할 수 있나요?",
          paragraphs: [
            "네. 시작 전에 2·3·4명 중 고르고 같은 기기를 차례로 건네며 플레이하세요. 말 네 개와 던진 결과는 이 브라우저에 저장됩니다. AI·계정·온라인 방·다른 기기 연결은 없습니다.",
            "네 말을 모두 도착시킨 플레이어가 승리합니다. 지름길은 경로 선택 버튼, 아직 출발하지 않은 말은 대기 영역, 말판의 강조된 무리는 진행 중인 말을 뜻합니다.",
          ],
        },
      ],
      links: [
        { label: "무료 윷놀이 게임 시작", href: "/ko/play/yutnori/" },
        {
          label: "보드게임 모음에서 골라보기",
          href: "/ko/collections/classic-board/",
        },
        {
          label: "국립민속박물관 한국민속대백과사전 · 윷놀이",
          href: "https://folkency.nfm.go.kr/kr/topic/detail/1595",
        },
      ],
    },
  },
  "guides/classic-board-games": {
    en: {
      title:
        "Which free board game should I play? AI and local two-player guide",
      intro:
        "Start with Four in a Row for simple column selection, Gomoku for line building, Reversi for flipping strategy, checkers for capture chains, Dots and Boxes for scoring squares or Yutnori for a 2–4 player Korean board game. All six run locally in your browser.",
      sections: [
        {
          heading: "What rules do these games use?",
          paragraphs: [
            "Gomoku uses a 15×15 freestyle board: five or more stones wins, with no forbidden moves. Reversi uses an 8×8 board and automatic passes when no legal move exists. Four in a Row uses seven columns, six rows and gravity.",
            "Checkers uses English rules: forward-only men, mandatory captures, continued jumps and crowning that ends the turn. Kings move in either diagonal direction. Eighty non-capture king plies draw; repetition draws are not implemented. Dots and Boxes uses sixteen boxes; completing a box grants another turn.",
            "Yutnori uses four sticks on a 29-space board. Do, Gae, Geol, Yut and Mo move one to five spaces; Yut and Mo grant another throw. Pieces stack on landing, captures return a whole opposing stack to its yard, and corner shortcuts pass through the centre. This edition requires an exact finish and leaves Back-do off; regional house rules vary.",
          ],
        },
        {
          heading: "How do AI and two-player modes work?",
          paragraphs: [
            "Five games offer browser AI or local two-player play. Open Settings in one of those games to choose a mode; Mint moves first and the AI plays Coral. Yutnori instead supports two to four people passing one device and has no AI. None offers online matchmaking or account sync.",
            "Easy, Normal and Hard use bounded local search. They describe search effort, not an Elo rating or guaranteed playing strength. AI calculations use a browser worker when available; the fallback uses a simpler one-step search.",
          ],
        },
        {
          heading: "How do I avoid accidental moves on a phone?",
          paragraphs: [
            "Tap a space to preview it and read the selected coordinates. In Gomoku and Reversi, tap that same space again to place your stone; tapping another space moves the preview. Confirm move also works. Checkers first selects a piece and then a legal destination. In Dots and Boxes, select the same edge again to draw; in Four in a Row, select the same column again to drop. Yutnori uses buttons to select a piece and choose its route.",
            "Arrow keys or on-screen arrows operate the five shared-engine games; Enter or Space previews and confirms. Yutnori uses standard Tab and Enter/Space button navigation and does not advertise gamepad support. Physical-device checks remain separate.",
          ],
        },
        {
          heading: "How do sound and volume work?",
          paragraphs: [
            "Turn on Sound in the player and adjust Effects volume in Settings. Stone placement, disc flips, captures and completed boxes have distinct synthesized effects, with separate win, loss and draw cues. Sound is initially off; your mute and volume choices are saved.",
            "Audio starts only after a button press. Pausing or leaving the tab stops scheduled effects. Every turn and result also appears visually, so sound is optional.",
          ],
        },
        {
          heading: "Are games saved, and where are the ads?",
          paragraphs: [
            "Board positions, Yutnori match state, modes, difficulty and completed results are stored in this browser. Pause before leaving, and use the same browser profile to continue. Clearing site data removes progress. Games pause when the page loses visibility.",
            "Catalogue and detail pages may contain clearly disclosed ad or affiliate positions. The board player has no display-ad slots. Advertising approval and serving are separate from a game being available.",
          ],
        },
      ],
      links: [
        {
          label: "Play the classic board collection",
          href: "/en/collections/classic-board/",
        },
        { label: "Read the Yutnori rules", href: "/en/guides/yutnori-rules/" },
        { label: "Browse all board games", href: "/en/category/board/" },
      ],
    },
    ko: {
      title: "무료 보드게임 고르기: AI 대전·같은 기기 2인 플레이 안내",
      intro:
        "간단한 열 선택은 사목, 줄 만들기는 오목, 뒤집기 전략은 리버시, 연속 잡기는 체커, 사각형 획득은 점 잇기, 2~4인 전통 보드게임은 윷놀이로 시작하세요. 여섯 게임 모두 브라우저에서 로컬로 실행됩니다.",
      sections: [
        {
          heading: "어떤 규칙을 사용하나요?",
          paragraphs: [
            "오목은 15×15 자유룰로 다섯 개 이상 연결하면 승리하고 금수는 없습니다. 리버시는 8×8 판과 둘 곳이 없을 때 자동 패스를 사용합니다. 사목은 7열·6행에서 돌이 아래로 떨어집니다.",
            "체커는 일반 말의 전진 이동·전진 잡기, 강제 잡기, 연속 점프와 승급 시 차례 종료를 적용하는 영국식입니다. 킹은 대각선 앞뒤로 이동합니다. 잡기 없는 킹 이동 80수는 무승부이고 반복 국면 판정은 적용하지 않습니다. 점 잇기는 16개 사각형을 차지하며 완성하면 한 번 더 둡니다.",
            "윷놀이는 네 윷가락 결과로 29밭에서 이동합니다. 도·개·걸·윷·모는 1~5칸이며 윷·모가 나오면 한 번 더 던집니다. 같은 편 말은 업고, 상대 말이 있는 밭에 도착하면 무리 전체를 잡아 대기 자리로 보냅니다. 모서리 지름길은 중앙을 지나 반대편으로 이어집니다. 이 버전은 정확한 수로 도착하고 빽도는 제외합니다. 지역 규칙은 다를 수 있습니다.",
          ],
        },
        {
          heading: "AI 대전과 2인 대전은 어떻게 하나요?",
          paragraphs: [
            "다섯 게임은 브라우저 AI 또는 같은 기기 2인을 지원합니다. 그중 하나에서 설정을 열어 방식을 고르세요. 민트가 선공이고 AI는 코랄을 맡습니다. 윷놀이는 AI 없이 2~4명이 한 기기를 함께 사용합니다. 온라인 매칭·계정 동기화는 없습니다.",
            "쉬움·보통·어려움은 로컬 탐색량이 다른 난이도입니다. Elo 등급이나 실력을 보장하는 표시는 아닙니다. AI 계산은 가능한 환경에서 브라우저 워커를 사용하며 대체 경로는 간단한 한 수 탐색을 사용합니다.",
          ],
        },
        {
          heading: "휴대폰에서 잘못 두는 것을 줄이려면?",
          paragraphs: [
            "칸을 눌러 미리 보고 표시된 좌표를 확인하세요. 오목·리버시는 같은 자리를 한 번 더 누르면 돌을 놓고, 다른 칸을 누르면 미리보기가 이동합니다. 수 두기 버튼으로도 확정할 수 있습니다. 체커는 말부터 고르고 가능한 목적지를 선택합니다. 점 잇기는 같은 선을, 사목은 같은 열을 다시 누르면 둡니다. 윷놀이는 말을 고르고 표시된 경로 버튼을 누릅니다.",
            "방향키·화면 방향 버튼으로 공용 보드의 커서를 옮기고 Enter·Space로 확정할 수 있습니다. 윷놀이는 Tab·Enter·Space로 버튼을 조작하며 게임패드를 지원한다고 표시하지 않습니다. 실제 기기 검증은 별도입니다.",
          ],
        },
        {
          heading: "소리와 음량은 어떻게 조절하나요?",
          paragraphs: [
            "플레이어에서 소리를 켜고 설정에서 효과음 음량을 조절하세요. 돌 놓기·뒤집기·말 잡기·상자 완성에 서로 다른 합성 효과음을 사용하고 승리·패배·무승부 소리도 구분합니다. 기본은 꺼짐이며 음소거·음량 선택을 저장합니다.",
            "버튼을 누른 뒤에만 오디오를 시작합니다. 일시정지하거나 탭을 떠나면 예약된 효과음도 멈춥니다. 차례와 결과는 화면에도 표시하므로 소리 없이도 플레이할 수 있습니다.",
          ],
        },
        {
          heading: "저장은 어디에 되고 광고는 어디에 있나요?",
          paragraphs: [
            "게임판·윷놀이 대국·방식·난이도·종료 결과를 이 브라우저에 저장합니다. 나가기 전에 정지하고 같은 브라우저 프로필로 돌아오세요. 사이트 데이터를 지우면 진행 상태도 삭제됩니다. 페이지가 숨겨지면 게임은 정지합니다.",
            "목록·소개 페이지에는 표시된 광고·제휴 위치가 있을 수 있습니다. 보드게임 플레이어 안에는 디스플레이 광고 슬롯이 없습니다. 게임 공개와 광고 승인·노출은 별개입니다.",
          ],
        },
      ],
      links: [
        {
          label: "클래식 보드게임 모음",
          href: "/ko/collections/classic-board/",
        },
        {
          label: "윷놀이 규칙과 말 이동 보기",
          href: "/ko/guides/yutnori-rules/",
        },
        { label: "보드게임 전체 보기", href: "/ko/category/board/" },
      ],
    },
  },
  "guides/test-your-device": {
    en: {
      title: "How to test browser games on your phone, controller or Tesla",
      intro:
        "Start with one game and your actual input device. Check loading, play, pause, sound and local saves separately; a responsive screenshot or a synthetic controller event does not prove hardware compatibility.",
      sections: [
        {
          heading: "What should I test first?",
          paragraphs: [
            "Open a game detail and read its controls. Start a round, change the game state, pause, resume and restart. On a phone, try portrait and landscape. For a controller, use the input diagnostic before testing play, then disconnect the controller and confirm the game pauses.",
          ],
        },
        {
          heading: "How do I check saving and stability?",
          paragraphs: [
            "Save a favorite and reload. Circuit Loop, Orbit Break, 2048 and classic board games support local progress; Bounce Back keeps gems and unlocked progress but restarts the active run after leaving; imported Crisp games save personal bests only. Actually play for 20 minutes before marking the long-session check passed. Record crashes, stuck controls or persistent slowdowns rather than inferring success from a short load test.",
          ],
        },
        {
          heading: "What about Tesla browsers?",
          paragraphs: [
            "Only use the browser while parked. Record the vehicle computer, firmware, browser behavior and input connection without a VIN or other identifier. Test touch before a controller; native Tesla Arcade controller support does not demonstrate controller availability in its browser. An unavailable browser capability remains a limit of that environment.",
          ],
        },
        {
          heading: "Does downloading a report certify my device?",
          paragraphs: [
            "No. The local checklist creates your observation file, leaves untested items as Not tested and never uploads the result. Official compatibility remains unverified until the environment and results have been reviewed. Do not enter personal identifiers into the report.",
          ],
        },
      ],
      links: [
        { label: "Local device checklist", href: "/en/device-check/" },
        { label: "Current compatibility evidence", href: "/en/compatibility/" },
        { label: "Tesla browser games and compatibility", href: "/en/tesla/" },
        { label: "Input diagnostic", href: "/en/gamepad-test/" },
        { label: "Choose a game collection", href: "/en/collections/" },
      ],
    },
    ko: {
      title: "휴대폰·게임패드·테슬라에서 웹게임 점검하는 방법",
      intro:
        "실제 기기와 입력 장치로 게임 하나부터 시험하세요. 로딩·조작·정지·소리·로컬 저장을 각각 확인해야 하며, 반응형 화면이나 가상 패드 입력만으로 실물 호환성을 판단하지 않습니다.",
      sections: [
        {
          heading: "무엇부터 점검하나요?",
          paragraphs: [
            "게임 상세에서 조작법을 읽고 라운드를 시작하세요. 실제로 게임 상태를 바꾸고 정지·재개·재시작을 시험합니다. 휴대폰은 세로·가로 화면을 확인하세요. 게임패드를 지원한다고 표시된 게임은 입력 진단을 먼저 확인한 뒤 플레이하고, 연결을 끊으면 자동 정지하는지 확인하세요.",
          ],
        },
        {
          heading: "저장과 안정성은 어떻게 확인하나요?",
          paragraphs: [
            "즐겨찾기를 저장하고 새로고침하세요. 서킷 루프·오빗 브레이크·2048·윷놀이와 클래식 보드게임은 로컬 진행 상태를 복원합니다. Bounce Back은 보석·해제 상태를 저장하지만 진행 중인 도전은 새로 시작하고, Crisp 게임은 최고 점수만 저장합니다. 장시간 점검은 실제로 20분 플레이한 뒤 성공으로 표시하세요. 짧게 로딩해본 것으로 성공을 추정하지 말고 충돌·입력 고착·지속적인 느려짐을 적으세요.",
          ],
        },
        {
          heading: "테슬라 브라우저는 어떻게 시험하나요?",
          paragraphs: [
            "주차 상태에서만 브라우저를 사용하세요. VIN 등 식별 정보 없이 차량 컴퓨터·펌웨어·브라우저 동작·입력 연결 방식을 적으세요. 터치를 먼저 시험한 뒤 패드를 연결합니다. 테슬라 기본 Arcade의 패드 지원이 웹브라우저의 패드 접근을 증명하지 않습니다. 사용할 수 없는 브라우저 기능은 해당 환경의 제한으로 남겨야 합니다.",
          ],
        },
        {
          heading: "결과를 내려받으면 기기 지원 인증이 되나요?",
          paragraphs: [
            "아닙니다. 로컬 체크리스트는 개인 관찰 파일을 만들고 미실행 항목을 그대로 남기며 결과를 업로드하지 않습니다. 환경과 결과를 검토하기 전에는 공식 호환성이 미검증으로 유지됩니다. 결과에 개인 식별 정보를 적지 마세요.",
          ],
        },
      ],
      links: [
        { label: "내 기기 점검 체크리스트", href: "/ko/device-check/" },
        { label: "현재 호환성 근거", href: "/ko/compatibility/" },
        { label: "테슬라 브라우저 웹게임과 호환성 안내", href: "/ko/tesla/" },
        { label: "입력 진단", href: "/ko/gamepad-test/" },
        { label: "플레이 방식별 게임 모음", href: "/ko/collections/" },
      ],
    },
  },
  "guides/open-browser-games": {
    en: {
      title: "Free browser games: sources, rules and device support",
      intro:
        "Denny Games offers " +
        games.length +
        " browser-game titles in English and Korean. Every published title launches on Denny Games. The catalogue includes 191 MIT-licensed ABA Games Crisp mini-games, Hextris under GPL-3.0-or-later, Bounce Back under GPL-2.0-or-later, an adapted 2048, original games and six classic board games, including Yutnori.",
      sections: [
        {
          heading: "What can I play?",
          paragraphs: [
            "Browse board, puzzle, arcade, action, shooting, racing and sports collections. Each published title has a Denny Games play page with its own rules and controls. Detail pages link to original project sources and license notices; those links provide provenance, while gameplay stays on Denny Games.",
          ],
        },
        {
          heading: "Are free games also open source?",
          paragraphs: [
            "Free-to-play and permission to redistribute are separate questions. The 191 ABA Games imports retain their MIT notices; Hextris and Bounce Back keep their GPL licenses and corresponding source. Hextris also publishes its bundled dependency notices. Research candidates stay out of the public catalogue until code, game data, artwork and dependencies have clear redistribution rights and pass local integration review. The catalogue does not include commercial console ROM collections. Authors retain their credits, and listing a game does not imply endorsement.",
          ],
        },
        {
          heading: "Do mobile, gamepad and Tesla browsers work?",
          paragraphs: [
            "Touch, keyboard and standard gamepad mappings are implemented for published games. Automated Chromium checks cover narrow layouts and imported game loading, input and pausing. Physical phones, controllers and Tesla browsers still require separate verification. Use vehicle browsers only while parked.",
          ],
        },
        {
          heading: "Can I save my game?",
          paragraphs: [
            "Personal best scores, favorites and recent games for Denny Games titles stay in this browser. Circuit Loop, Orbit Break, 2048 and Hextris can restore round progress. Bounce Back keeps its gems and unlocks, but starts a fresh run after reloading. Crisp games save personal bests only. Clearing browser storage removes local records.",
          ],
        },
      ],
      links: [
        { label: "Browse all categories", href: "/en/" },
        { label: "Authors and source links", href: "/en/licenses/" },
        {
          label: "Crisp MIT notices and pinned sources",
          href: "/licenses/crisp/",
        },
        {
          label: "Bounce Back GPL license and corresponding source",
          href: "/licenses/bounceback/",
        },
        {
          label: "Hextris GPL license and dependency notices",
          href: "/licenses/hextris/",
        },
        { label: "Device support boundaries", href: "/en/compatibility/" },
        { label: "Tesla browser games and compatibility", href: "/en/tesla/" },
        { label: "Gamepad input test", href: "/en/gamepad-test/" },
      ],
    },
    ko: {
      title: "무료 웹게임 안내: 출처·조작법·기기 지원",
      intro:
        "데니 게임즈는 한국어와 영어로 제공하는 웹게임 " +
        games.length +
        "개 게임 페이지를 제공합니다. 공개된 게임은 모두 데니 게임즈 안에서 실행됩니다. MIT 라이선스 ABA Games Crisp 미니게임 191개, GPL-3.0-or-later Hextris, GPL-2.0-or-later Bounce Back, 2048 수정판, 자체 게임과 윷놀이를 포함한 클래식 보드게임 6종이 있습니다.",
      sections: [
        {
          heading: "어떤 게임을 할 수 있나요?",
          paragraphs: [
            "보드 · 퍼즐 · 아케이드 · 액션 · 슈팅 · 레이싱 · 스포츠 게임을 둘러보세요. 공개된 모든 타이틀은 데니 게임즈의 플레이 페이지에서 시작합니다. 상세 페이지에서 게임 규칙과 조작법, 원본 프로젝트와 라이선스 고지를 확인할 수 있습니다.",
          ],
        },
        {
          heading: "무료 게임이면 소스도 가져올 수 있나요?",
          paragraphs: [
            "무료 플레이와 재배포 허용은 별개입니다. ABA Games 191개는 MIT 고지를, Hextris와 Bounce Back은 각 GPL 라이선스와 대응 소스를 제공합니다. Hextris 의존성 고지도 공개합니다. 코드·게임 데이터·그림·의존성의 재배포 권리를 확인하고 사이트 안에서 실행되도록 검토한 뒤에만 게임을 공개합니다. 권리가 불분명한 후보는 공개 카탈로그에 올리지 않습니다. 상용 콘솔 ROM 모음은 제공하지 않으며, 목록 등록이 원작자의 제휴·보증을 뜻하지 않습니다.",
          ],
        },
        {
          heading: "모바일·게임패드·테슬라에서 되나요?",
          paragraphs: [
            "게임 상세에 표시된 입력 배지를 확인하세요. 윷놀이는 터치·마우스와 키보드 버튼 탐색을 지원하며 게임패드를 표시하지 않습니다. Chromium 자동 검사로 좁은 화면과 일부 게임의 로딩·입력·일시정지를 확인했지만 실제 휴대폰·패드·테슬라 브라우저는 별도 검증 전입니다. 차량에서는 주차 중에만 사용하세요.",
          ],
        },
        {
          heading: "게임 기록은 저장되나요?",
          paragraphs: [
            "데니 게임즈 게임의 최고 기록·즐겨찾기·최근 게임은 이 브라우저에 저장합니다. 서킷 루프·오빗 브레이크·2048·Hextris·윷놀이는 진행 중인 판을 복원합니다. Bounce Back은 보석·해제 상태를 남기지만 새로고침하면 새 도전을 시작하고, Crisp는 최고 점수만 저장합니다. 브라우저 저장 공간을 지우면 기기 내 기록도 사라집니다.",
          ],
        },
      ],
      links: [
        { label: "전체 카테고리 보기", href: "/ko/" },
        { label: "제작자와 원본 소스", href: "/ko/licenses/" },
        { label: "Crisp MIT 라이선스와 고정 소스", href: "/licenses/crisp/" },
        {
          label: "Bounce Back GPL 라이선스와 대응 소스",
          href: "/licenses/bounceback/",
        },
        {
          label: "Hextris GPL 라이선스와 의존성 고지",
          href: "/licenses/hextris/",
        },
        { label: "기기 지원 범위", href: "/ko/compatibility/" },
        { label: "테슬라 브라우저 웹게임과 호환성 안내", href: "/ko/tesla/" },
        { label: "게임패드 입력 진단", href: "/ko/gamepad-test/" },
      ],
    },
  },

  about: {
    en: {
      title: "Small games. A better break.",
      intro:
        "Denny Games is an independent browser arcade by Denny Lim. Every published game launches here without an external gameplay host. Original project and license links are provided for attribution and rights information.",
      sections: [
        {
          heading: "A curated beginning",
          paragraphs: [
            "Explore original Circuit Loop and Orbit Break, an MIT-based 2048 adaptation, 191 ABA Games Crisp mini-games, six classic board games including Yutnori, Hextris under GPL-3.0-or-later and Bounce Back under GPL-2.0-or-later. Every published game has its own rules, controls and pause/restart flow on this site.",
            "Game candidates remain unpublished until their code, game data, artwork and dependencies are cleared for redistribution and adapted to run here. Free browser access alone is not a reuse license.",
          ],
        },
        {
          heading: "Clear about what works",
          paragraphs: [
            "Input varies by game. Yutnori supports touch, mouse and keyboard for two to four people taking turns on one device. Physical phones, controllers and vehicle browsers require separate tests; we publish those boundaries instead of a blanket compatibility promise.",
          ],
        },
      ],
    },
    ko: {
      title: "작은 게임, 더 좋은 휴식.",
      intro:
        "데니 게임즈는 Denny Lim이 만드는 독립 웹게임 사이트입니다. 공개된 게임은 외부 플레이 호스트로 이동하지 않고 이 사이트 안에서 실행됩니다. 원본 프로젝트와 라이선스 정보는 출처를 표시하기 위해 연결합니다.",
      sections: [
        {
          heading: "작지만 분명한 시작",
          paragraphs: [
            "자체 제작 서킷 루프·오빗 브레이크, MIT 기반 2048, ABA Games Crisp 미니게임 191개, 윷놀이를 포함한 클래식 보드게임 6종, GPL-3.0-or-later Hextris와 GPL-2.0-or-later 액션 로그라이트 Bounce Back을 제공합니다. 게임별 조작은 다르며, 윷놀이는 한 기기에서 터치·마우스·키보드로 2~4명이 번갈아 플레이합니다.",
            "게임 후보는 코드·게임 데이터·그림·의존성의 재배포 권리와 사이트 내 실행 가능성을 확인한 뒤에만 공개합니다. 무료로 플레이할 수 있다는 사실만으로 재사용 권한이 생기지는 않습니다.",
          ],
        },
        {
          heading: "확인한 만큼 안내합니다",
          paragraphs: [
            "공개된 게임에 터치·키보드·표준 게임패드 매핑을 구현했습니다. 실제 휴대폰·패드·차량 브라우저도 별도 검증이 필요하며 그 범위를 공개합니다.",
          ],
        },
      ],
    },
  },
  privacy: {
    en: {
      title: "Your play stays with you.",
      intro:
        "Denny Games does not require an account. Progress, preferences, saved games, recent plays and personal bests are stored locally in this browser. Published games launch on Denny Games; original project and license links may lead to their maintainers' sites.",
      sections: [
        {
          heading: "Local storage",
          paragraphs: [
            "Clearing browser storage removes these records. They are not synced between devices. Private browsing or storage restrictions may prevent persistence; games remain playable.",
            "Result sharing includes the game, seed, rule version and your score text. Review the text before using the browser share sheet. No name or email is required.",
          ],
        },
        {
          heading: "Hosting and diagnostics",
          paragraphs: [
            "GitHub Pages serves this site and may process visitor IP addresses for its operation and security. Input diagnosis displays device data locally; it is not uploaded by our code.",
            "Gameplay events are kept in a short in-memory list and emitted as browser CustomEvents. These game events are not sent to analytics.",
            "Game launches stay on Denny Games. Source and license links can open the original project's website, where that provider's privacy policy applies; gameplay sessions and game inputs remain in this browser.",
            "The device checklist keeps entered observations in the current form only and generates a local JSON download. It does not upload or automatically store the report; reloading clears the fields. Do not include personal identifiers.",
            "Bug, rights and partnership inquiries use GitHub Issues. Issues and replies are public and handled by GitHub under its privacy statement. Do not post confidential business terms, credentials or private contact details; share a business contact only if you agree to publish it.",
          ],
        },
        {
          heading: "Optional analytics",
          paragraphs: [
            "If you allow analytics, this site loads Google Analytics 4 and sends page views, the page title and path, the referring site's origin, and standard browser/device information used to estimate a broad region. Query strings and fragments are removed. Denny Games does not send typed search terms, form text, account identifiers, game inputs, scores or gameplay events.",
            "The analytics tag uses cookies scoped to games.iamdenny.com for up to 60 days. Google processes the data under its own terms and privacy policy. Your choice is saved in this browser and can be changed at any time below.",
          ],
        },
        {
          heading: "Advertising",
          paragraphs: [
            "Coupang affiliate cards, when enabled, are labeled as advertisements with a commission disclosure. They use ordinary external links without a Coupang script, image or iframe request on page load. Clicking opens Coupang, where its privacy and purchase terms apply. Purchases are optional and do not unlock game rewards.",
            "Google display and in-game ads are inactive while approval and consent requirements are pending. An AdSense account verification meta tag and public seller record identify the publisher; these do not load an advertising script.",
          ],
        },
      ],
    },
    ko: {
      title: "플레이 기록은 이 기기에.",
      intro:
        "데니 게임즈는 계정을 요구하지 않습니다. 진행 상황·환경 설정·저장한 게임·최근 플레이·최고 기록은 이 브라우저에 저장됩니다. 공개된 게임은 데니 게임즈 안에서 실행하며 원본 프로젝트·라이선스 링크는 제작자 사이트로 연결될 수 있습니다.",
      sections: [
        {
          heading: "기기 내 저장",
          paragraphs: [
            "브라우저 저장 공간을 지우면 기록도 사라지며 다른 기기와 동기화되지 않습니다. 시크릿 모드나 저장 제한이 있어도 게임은 계속할 수 있습니다.",
            "결과 공유에는 게임·시드·규칙 버전·점수 텍스트가 포함됩니다. 브라우저 공유 화면에서 내용을 확인하세요. 이름이나 이메일을 요구하지 않습니다.",
          ],
        },
        {
          heading: "호스팅과 진단",
          paragraphs: [
            "GitHub Pages가 사이트를 제공하며 운영·보안을 위해 방문 IP 등을 처리할 수 있습니다. 입력 진단의 기기 정보는 이 화면에만 표시되고 사이트 코드가 업로드하지 않습니다.",
            "게임 이벤트는 짧은 메모리 목록과 브라우저 CustomEvent로만 기록합니다. 게임 이벤트는 분석 서비스로 전송하지 않습니다.",
            "게임 실행은 데니 게임즈 안에서 이뤄집니다. 원본 소스·라이선스 링크는 제작자 사이트를 열 수 있으며 해당 사이트에는 자체 개인정보 처리방침이 적용됩니다. 게임 세션과 조작 입력은 이 브라우저에 남습니다.",
            "기기 체크리스트 입력은 현재 폼에만 유지하고 로컬 JSON 파일로 내려받습니다. 결과를 업로드하거나 자동 저장하지 않으며 새로고침하면 입력이 사라집니다. 개인 식별 정보는 포함하지 마세요.",
            "오류·권리·제휴 문의는 GitHub Issues를 이용합니다. 이슈와 답변은 공개되며 GitHub 개인정보 처리방침에 따라 관리됩니다. 비공개 계약 조건·계정 정보·개인 연락처를 올리지 마세요. 공개 게시에 동의한 사업용 연락 채널만 공유하세요.",
          ],
        },
        {
          heading: "선택형 방문 통계",
          paragraphs: [
            "분석을 허용하면 Google Analytics 4가 페이지 조회, 페이지 제목과 경로, 방문한 사이트의 출처 도메인, 대략적인 지역을 추정하는 데 쓰이는 기본 브라우저·기기 정보를 받습니다. URL의 검색어와 나머지 쿼리·해시 값은 제거합니다. 데니 게임즈는 검색어·폼 입력·계정 식별자·게임 조작·점수를 보내지 않습니다.",
            "분석 태그는 games.iamdenny.com에만 적용되는 쿠키를 최대 60일 사용합니다. Google은 자체 약관과 개인정보 처리방침에 따라 데이터를 처리합니다. 선택은 이 브라우저에 저장되며 아래에서 언제든 바꿀 수 있습니다.",
          ],
        },
        {
          heading: "광고",
          paragraphs: [
            "쿠팡 제휴 카드가 활성화되면 광고 표시와 수수료 안내를 함께 제공합니다. 페이지를 열 때 쿠팡 스크립트·이미지·iframe을 요청하지 않는 일반 외부 링크입니다. 클릭하면 쿠팡으로 이동하며 쿠팡의 개인정보·구매 정책이 적용됩니다. 구매는 선택 사항이며 게임 보상과 연결되지 않습니다.",
            "Google 배너·게임 내 광고는 승인과 동의 요건을 갖출 때까지 비활성 상태입니다. AdSense 계정 확인 메타 태그와 공개 판매자 정보만 게시하며, 이 정보는 광고 스크립트를 불러오지 않습니다.",
          ],
        },
      ],
    },
  },
  terms: {
    en: {
      title: "A few things to know.",
      intro:
        "Denny Games provides free browser games for personal play. There are no payments, accounts or global score rankings in this version.",
      sections: [
        {
          heading: "Personal records",
          paragraphs: [
            "Scores and progress are local and can be changed or erased by the browser. They are not authenticated competition results. Daily challenges change with the UTC date and the device clock.",
          ],
        },
        {
          heading: "Attribution and devices",
          paragraphs: [
            "Game code, artwork and third-party components keep their respective licenses. See Credits for authors and source. Displaying a game does not imply endorsement by its original author.",
            "Browser features may vary by device. Use vehicle browsers only while parked. Tesla is a third-party trademark; this independent site is not affiliated with Tesla.",
          ],
        },
        {
          heading: "Service changes",
          paragraphs: [
            "The catalogue may change as games are reviewed and tested. Saved-state formats are versioned; incompatible or corrupt records may be ignored to keep games playable. Contact the project for bugs or rights questions.",
          ],
        },
      ],
    },
    ko: {
      title: "플레이 전에 알아두세요.",
      intro:
        "데니 게임즈는 개인이 무료로 즐기는 웹게임을 제공합니다. 현재 결제·계정·전 세계 순위는 없습니다.",
      sections: [
        {
          heading: "개인 기록",
          paragraphs: [
            "점수와 진행 상황은 브라우저에 저장되며 변경되거나 지워질 수 있습니다. 인증된 대회 기록이 아닙니다. 일일 도전은 UTC 날짜와 기기 시계를 따릅니다.",
          ],
        },
        {
          heading: "출처와 기기",
          paragraphs: [
            "게임 코드·이미지·외부 구성요소에는 각각의 라이선스가 적용됩니다. 제작자와 소스는 출처 페이지를 확인하세요. 게임 제공이 원작자의 제휴나 보증을 뜻하지는 않습니다.",
            "브라우저 기능은 기기별로 다릅니다. 차량에서는 주차 중에만 이용하세요. Tesla는 제3자의 상표이며 이 사이트는 Tesla와 제휴하지 않습니다.",
          ],
        },
        {
          heading: "서비스 변경",
          paragraphs: [
            "권리 검토와 테스트에 따라 게임 목록이 바뀔 수 있습니다. 저장 형식은 버전으로 관리하며 호환되지 않거나 손상된 기록은 안전한 플레이를 위해 건너뛸 수 있습니다. 오류와 권리 문의는 프로젝트로 보내주세요.",
          ],
        },
      ],
    },
  },
  contact: {
    en: {
      title: "Let’s make the next round better.",
      intro:
        "Report a bug or ask a rights question through the Denny Games GitHub project.",
      sections: [
        {
          heading: "A useful bug report",
          paragraphs: [
            "Include the game, page URL, browser and OS versions, input method and steps to reproduce. Never post passwords, account tokens, personal information or a full browser storage export.",
            "For a vehicle issue, include model, computer type and firmware only if you are comfortable sharing them. Screenshots should hide personal information.",
          ],
        },
      ],
    },
    ko: {
      title: "다음 한 판을 더 좋게.",
      intro:
        "오류나 권리 문의는 Denny Games GitHub 프로젝트에서 남길 수 있습니다.",
      sections: [
        {
          heading: "이렇게 알려주세요",
          paragraphs: [
            "게임 이름·페이지 주소·브라우저와 OS 버전·조작 방식·재현 순서를 적어주세요. 비밀번호·토큰·개인정보·브라우저 저장 내용 전체는 공개하지 마세요.",
            "차량 오류라면 공유 가능한 범위에서 모델·컴퓨터 종류·펌웨어를 적어주세요. 스크린샷의 개인정보는 가려주세요.",
          ],
        },
      ],
    },
  },
  tesla: {
    en: {
      title: "Tesla games: browser game guide and compatibility checks",
      intro:
        "Looking for free Tesla browser games? Denny Games is a free browser game catalog, but Tesla vehicle compatibility is unverified. Use it only while parked.",
      sections: [
        {
          heading: "Can I play browser games on a Tesla?",
          paragraphs: [
            "Published Denny Games titles launch without an account or installation. This catalog has not been tested in a physical Tesla. Loading, touch input, performance, audio and saving remain unverified in vehicle browsers.",
          ],
        },
        {
          heading: "Can I install Denny Games or add it to Tesla Arcade?",
          paragraphs: [
            "No. Denny Games is an independent browser-game catalog, not an official Tesla Arcade title or vehicle app, and it does not include Xbox Game Pass or a cloud-gaming subscription. There is nothing to install from Denny Games; if your vehicle provides a browser, you can try to open the site there while parked. We have not tested this site in a physical Tesla, so access and gameplay remain unverified.",
            "Built-in Tesla Arcade titles and their availability are managed by Tesla and vary by vehicle and region. Check the current owner's manual for your car. A game or controller that works in Arcade does not prove an independent site works in the vehicle browser.",
          ],
        },
        {
          heading: "How to try a Tesla browser game",
          paragraphs: [
            "Only if your vehicle provides a browser, try it while parked. Start with touch and a game with simple controls: Circuit Loop rotates a tile when tapped, and 2048 also offers on-screen direction buttons in Settings. Check that the page opens, a move registers, pause and resume work, and local progress returns after a reload. Each result describes only the vehicle and software version you tested.",
            "Fullscreen may not be available. Expand falls back to a larger in-page layout, and you can pause or exit without fullscreen.",
          ],
        },
        {
          heading: "Can two people play on one screen?",
          paragraphs: [
            "Five tested classic board games—Gomoku, Reversi, Four in a Row, Checkers and Dots and Boxes—support local two-player mode, with friends taking turns on one device. They do not have online matchmaking or phone-as-controller play. Yutnori adds two-to-four player pass-and-play but does not advertise gamepad support and has not been tested in a Tesla browser. Vehicle compatibility remains unverified. Only try games while parked.",
          ],
        },
        {
          heading: "Does a Tesla game controller work in the browser?",
          paragraphs: [
            "Standard gamepad mappings are implemented for supported browsers, but no physical Tesla-browser controller result is recorded. A controller that works with Tesla Arcade may still behave differently in the browser. The input check page reports what the current browser exposes; it is not a Tesla compatibility test.",
          ],
        },
        {
          heading: "Which Tesla models have been tested?",
          paragraphs: [
            "None. We have no physical results for Model 3, Model Y, Model S, Model X or Cybertruck, and do not infer compatibility across vehicle computers, firmware or regions. A desktop preview or another owner's vehicle report is not a Denny Games certification.",
          ],
        },
        {
          heading: "Can I play while charging?",
          paragraphs: [
            "Only use games when the vehicle is parked. Follow the instructions for your specific vehicle and never interact with games while driving. Tesla's manual says entertainment options can vary with the vehicle and region; its built-in Arcade guidance is separate from third-party browser games.",
          ],
        },
      ],
      links: [
        {
          label: "Try Circuit Loop (touch controls)",
          href: "/en/games/circuit-loop/",
        },
        {
          label: "Try 2048 (touch and direction buttons)",
          href: "/en/games/2048/",
        },
        {
          label:
            "Browse the full browser-game catalog (Tesla support unverified)",
          href: "/en/all/",
        },
        {
          label: "Explore six local board games (Tesla unverified)",
          href: "/en/collections/classic-board/",
        },
        { label: "Check browser gamepad input", href: "/en/gamepad-test/" },
        {
          label: "Read the device test guide",
          href: "/en/guides/test-your-device/",
        },
        { label: "Current compatibility evidence", href: "/en/compatibility/" },
        {
          label: "Tesla Model 3 owner's manual: Theater, Arcade and Toybox",
          href: "https://www.tesla.com/ownersmanual/model3/en_kr/GUID-79A49D40-A028-435B-A7F6-8E48846AB9E9.html",
        },
      ],
    },
    ko: {
      title: "테슬라 게임: 브라우저 웹게임·호환성 점검",
      intro:
        "테슬라 게임을 찾나요? 데니 게임즈는 무료 브라우저 웹게임 모음입니다. 실차 브라우저·터치·게임패드 호환성은 아직 검증되지 않았으니 주차 중에만 시험하세요.",
      sections: [
        {
          heading: "테슬라에서 브라우저 게임을 할 수 있나요?",
          paragraphs: [
            "공개된 데니 게임즈 타이틀은 가입·설치 없이 이 사이트에서 실행됩니다. 데니 게임즈는 실차에서 시험하지 않았습니다. 차량 브라우저의 로딩·터치·속도·소리·저장은 미검증입니다.",
          ],
        },
        {
          heading: "데니 게임즈를 테슬라 Arcade에 설치하거나 추가할 수 있나요?",
          paragraphs: [
            "아니요. 데니 게임즈는 독립 브라우저 게임 모음이며 Tesla Arcade에 포함된 공식 게임이나 차량 앱이 아닙니다. Xbox Game Pass나 클라우드 게임 구독도 제공하지 않습니다. 데니 게임즈를 차량에 설치하는 대신, 차량에 브라우저가 있을 때 주차한 상태에서 사이트 접속을 시도할 수 있습니다. 실차 시험은 하지 않아 접속과 플레이 가능 여부는 검증되지 않았습니다.",
            "차량 내장 Tesla Arcade 게임과 이용 가능 여부는 Tesla가 관리하며 차량과 지역에 따라 다를 수 있습니다. 해당 차량의 최신 사용자 설명서를 확인하세요. 내장 Arcade에서 게임이나 조작기가 작동해도 데니 게임즈 사이트가 차량 브라우저에서 작동한다는 뜻은 아닙니다.",
          ],
        },
        {
          heading: "테슬라 브라우저 게임을 점검하는 순서",
          paragraphs: [
            "차량에 브라우저가 제공되는 경우에만 주차 중 시험하세요. 먼저 터치로 조작이 간단한 게임부터 확인하세요. 서킷 루프는 타일을 눌러 돌리고, 2048은 설정에서 화면 방향 버튼도 사용할 수 있습니다. 페이지 열림, 한 번의 게임 입력, 일시정지·재개, 새로고침 후 로컬 진행 상태 복원을 각각 확인하세요. 결과는 시험한 차량과 소프트웨어 버전에만 해당합니다.",
            "브라우저에서 전체화면을 사용할 수 없을 수 있습니다. 화면 확대는 페이지 안에서 크게 표시하며 전체화면 없이도 일시정지하거나 나갈 수 있습니다.",
          ],
        },
        {
          heading: "두 명이 한 화면에서 함께 할 수 있나요?",
          paragraphs: [
            "오목·리버시·사목·체커·점 잇기 다섯 게임은 한 기기에서 로컬 2인 모드를 지원합니다. 윷놀이는 별도의 2~4인 로컬 대전입니다. 온라인 매칭·휴대폰 컨트롤러 연결은 없고 차량 호환성은 미검증입니다. 게임은 주차 상태에서만 시도하세요.",
          ],
        },
        {
          heading: "테슬라 게임패드는 브라우저에서 작동하나요?",
          paragraphs: [
            "지원 브라우저에 표준 게임패드 매핑을 구현했지만, 테슬라 브라우저와 실물 패드를 연결한 결과는 없습니다. 내장 Arcade에서 작동하는 패드도 브라우저에서는 다르게 동작할 수 있습니다. 입력 진단은 현재 브라우저가 보여주는 입력을 확인할 뿐, 테슬라 호환성을 인증하지 않습니다.",
          ],
        },
        {
          heading: "어떤 테슬라 모델을 시험했나요?",
          paragraphs: [
            "아직 없습니다. 모델 3·모델 Y·모델 S·모델 X·Cybertruck에서 얻은 실차 결과가 없으며, 차량 컴퓨터·펌웨어·지역이 다른 환경으로 호환성을 확대해 추정하지 않습니다. 데스크톱 미리보기나 다른 차주의 시험 결과도 데니 게임즈의 인증이 아닙니다.",
          ],
        },
        {
          heading: "충전 중에 게임해도 되나요?",
          paragraphs: [
            "차량이 주차된 상태에서만 게임을 이용하세요. 해당 차량의 안내를 따르고 운전 중에는 게임을 조작하지 마세요. 테슬라 설명서도 엔터테인먼트 기능이 차량과 지역에 따라 다를 수 있다고 안내합니다. 내장 Arcade 정보는 데니 게임즈 사이트의 지원 근거가 아닙니다.",
          ],
        },
      ],
      links: [
        {
          label: "서킷 루프 해보기 (터치 조작)",
          href: "/ko/games/circuit-loop/",
        },
        { label: "2048 해보기 (터치·방향 버튼)", href: "/ko/games/2048/" },
        {
          label: "전체 브라우저 게임 보기 (테슬라 지원 미검증)",
          href: "/ko/all/",
        },
        {
          label: "같은 기기 로컬 보드게임 6종 보기 (테슬라 미검증)",
          href: "/ko/collections/classic-board/",
        },
        { label: "브라우저 게임패드 입력 확인", href: "/ko/gamepad-test/" },
        { label: "기기 점검 방법 읽기", href: "/ko/guides/test-your-device/" },
        { label: "현재 호환성 검증 정보", href: "/ko/compatibility/" },
        {
          label: "테슬라 모델 3 사용자 설명서: 영화관·아케이드·토이박스",
          href: "https://www.tesla.com/ownersmanual/model3/ko_kr/GUID-79A49D40-A028-435B-A7F6-8E48846AB9E9.html",
        },
      ],
    },
  },
  "controller-games": {
    en: {
      title: "Gamepad browser games: controls and connection checks",
      intro:
        "Standard gamepad mappings are implemented for navigation, the original games and the Crisp pointer/button bridge. Physical controller/browser combinations await validation.",
      sections: [
        {
          heading: "One familiar mapping",
          paragraphs: [
            "D-pad or left stick moves. The primary face button selects or acts. Start pauses or resumes. Non-standard mappings are ignored instead of guessing button meanings.",
            "A controller may appear only after a physical button press. Secure HTTPS is required by supported browsers. If the controller disconnects, the game pauses and touch or keyboard remains available.",
          ],
        },
      ],
    },
    ko: {
      title: "게임패드 웹게임: 조작법과 연결 확인",
      intro:
        "사이트 탐색과 기본 게임, Crisp 게임, Bounce Back에 표준 게임패드 매핑을 구현했습니다. 실제 패드·브라우저 조합은 별도 검증 전입니다.",
      sections: [
        {
          heading: "일관된 기본 매핑",
          paragraphs: [
            "방향패드·왼쪽 스틱으로 이동하고 기본 버튼으로 선택·행동합니다. Start는 일시정지·계속하기입니다. 비표준 매핑은 버튼 의미를 추측하지 않고 제외합니다.",
            "패드 버튼을 실제로 눌러야 브라우저에 나타날 수 있습니다. 지원 브라우저에서는 HTTPS가 필요합니다. 연결이 끊기면 게임이 멈추며 터치·키보드로 이어갈 수 있습니다.",
          ],
        },
      ],
    },
  },
  "guides/controller-not-detected": {
    en: {
      title: "Controller connected, but not visible?",
      intro:
        "First check the secure page, press a controller button and inspect the local input diagnostic. An OS connection alone does not prove browser access.",
      sections: [
        {
          heading: "Check in order",
          paragraphs: [
            "Use HTTPS and the input check page. Press a face button once; some browsers expose pads only after a gesture. Confirm the diagnostic says standard mapping.",
            "If nothing appears, reconnect in the OS and try another supported browser or connection path. Do not install unknown controller extensions. Touch and keyboard remain available.",
          ],
        },
      ],
    },
    ko: {
      title: "연결한 패드가 보이지 않나요?",
      intro:
        "먼저 HTTPS 페이지에서 패드 버튼을 누르고 입력 진단을 확인하세요. OS에서 연결됐다는 사실만으로 브라우저 접근을 확인할 수는 없습니다.",
      sections: [
        {
          heading: "순서대로 확인하세요",
          paragraphs: [
            "HTTPS와 입력 진단 페이지를 열고 패드 기본 버튼을 한 번 누르세요. 첫 입력 후에만 패드를 보여주는 브라우저가 있습니다. 표준 매핑인지 확인하세요.",
            "보이지 않으면 OS에서 재연결하고 다른 브라우저나 연결 방식을 시도하세요. 출처를 모르는 패드 확장 프로그램은 설치하지 마세요. 터치·키보드는 계속 사용할 수 있습니다.",
          ],
        },
      ],
    },
  },
  "guides/sound-and-pause": {
    en: {
      title: "A quiet game is still a good game.",
      intro:
        "Sound starts muted. Turn it on with the Sound button after starting; browser autoplay policies may still require a touch or click.",
      sections: [
        {
          heading: "Resume deliberately",
          paragraphs: [
            "Leaving the tab or window pauses the game. Returning does not restart action automatically. Use Resume when ready.",
            "If sound remains unavailable, check the browser tab and device volume. Sound is optional and never required to solve a puzzle. No audio file download is required; feedback is synthesized locally.",
          ],
        },
      ],
    },
    ko: {
      title: "소리 없이도 즐거운 한 판.",
      intro:
        "소리는 처음에 꺼져 있습니다. 시작 후 소리 버튼으로 켜세요. 브라우저 자동재생 정책에 따라 터치·클릭이 필요할 수 있습니다.",
      sections: [
        {
          heading: "준비되면 이어가세요",
          paragraphs: [
            "탭이나 창을 벗어나면 게임이 멈춥니다. 돌아왔다고 자동으로 움직이지 않습니다. 준비되면 계속하기를 누르세요.",
            "소리가 안 나면 탭 음소거와 기기 음량을 확인하세요. 소리는 선택 기능이며 퍼즐 풀이에 필요하지 않습니다. 피드백은 기기에서 합성하므로 음원 파일을 내려받지 않습니다.",
          ],
        },
      ],
    },
  },
  "guides/local-saves": {
    en: {
      title: "Pick up where you left off.",
      intro:
        "Circuit Loop, Orbit Break, 2048, Yutnori and classic board games save round progress in this browser. Bounce Back keeps gems and unlocks, but restarts the active run after reloading. Crisp mini-games save personal bests only. Records are not synced between devices.",
      sections: [
        {
          heading: "What can erase a save",
          paragraphs: [
            "Clearing site data, using another browser profile or private mode can remove records. Games do not use a cloud account and cannot restore cleared local data.",
            "A blocked or full storage area shows an in-game notice. You can still play; persistence across reloads is not guaranteed. Daily and ordinary rounds keep separate progress.",
          ],
        },
      ],
    },
    ko: {
      title: "하던 곳에서 이어가세요.",
      intro:
        "서킷 루프·오빗 브레이크·2048·윷놀이와 클래식 보드게임은 진행 상황을 이 브라우저에 저장합니다. Bounce Back은 보석·해제 상태를 남기지만 새로고침하면 진행 중인 도전을 새로 시작합니다. Crisp 미니게임은 최고 기록만 저장합니다. 다른 기기와는 동기화되지 않습니다.",
      sections: [
        {
          heading: "기록이 사라지는 경우",
          paragraphs: [
            "사이트 데이터 삭제·다른 브라우저 프로필·시크릿 모드에서는 기록이 사라질 수 있습니다. 클라우드 계정이 없어 지운 기기 기록을 복원할 수 없습니다.",
            "저장 공간이 막히거나 꽉 차면 게임에서 안내합니다. 플레이는 가능하지만 새로고침 뒤 복원은 보장할 수 없습니다. 일일 도전과 일반 모드의 진행은 따로 저장됩니다.",
          ],
        },
      ],
    },
  },
};
export const guidePaths = [
  "guides/yutnori-rules",
  "guides/classic-board-games",
  "guides/test-your-device",
  "guides/open-browser-games",
  "guides/controller-not-detected",
  "guides/sound-and-pause",
  "guides/local-saves",
];
