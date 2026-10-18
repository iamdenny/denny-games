import type { Category } from "./games";
import type { Locale } from "../lib/types";

// Editorial category descriptions must describe the actual catalogue.
export const categoryCopy: Record<Category, Record<Locale, string>> = {
  board: {
    en: "Play Gomoku, Reversi, checkers, Four in a Row and Dots and Boxes with local opponents or on one shared device. Every published board game launches on Denny Games.",
    ko: "오목·리버시·체커·사목·점과 상자 게임을 로컬 상대 또는 한 기기에서 함께 즐겨보세요. 공개된 보드게임은 모두 데니 게임즈에서 실행됩니다.",
  },
  puzzle: {
    en: "Follow circuit paths, combine number tiles and solve quick logic challenges. Every published puzzle starts on Denny Games, with its rules and controls on the game page.",
    ko: "회로를 연결하고 숫자 타일을 합치며 짧은 논리 퍼즐에 도전해보세요. 공개된 퍼즐은 모두 데니 게임즈에서 실행되며, 규칙과 조작법은 게임 페이지에서 확인할 수 있습니다.",
  },
  arcade: {
    en: "Take a short break with quick reflex games, block challenges and classic arcade action. Every published arcade game launches right here on Denny Games.",
    ko: "짧은 반사 신경 게임과 블록 도전, 고전 아케이드 액션으로 잠깐 쉬어가세요. 공개된 아케이드 게임은 모두 데니 게임즈에서 바로 플레이할 수 있습니다.",
  },
  action: {
    en: "Move, dodge and react in action games built for quick rounds or longer runs. Each title has its own player page on Denny Games with rules and controls ready before you start.",
    ko: "짧은 라운드부터 긴 도전까지, 움직이고 피하며 반응하는 액션 게임을 즐겨보세요. 모든 게임은 데니 게임즈 안에 전용 플레이 페이지와 규칙·조작 안내가 있습니다.",
  },
  shooting: {
    en: "Aim, dodge and survive in fast shooting challenges. Every published shooter runs on Denny Games, and each game page explains how to play before launch.",
    ko: "빠른 슈팅 도전에서 조준하고 피하며 살아남아 보세요. 공개된 슈팅 게임은 모두 데니 게임즈에서 실행되며, 시작 전에 게임 페이지에서 조작법을 확인할 수 있습니다.",
  },
  racing: {
    en: "Park, steer and race through short driving challenges. Every listed racing game plays on Denny Games, with its controls shown on the detail page.",
    ko: "주차하고 방향을 조작하며 짧은 운전 도전에 참여해보세요. 공개된 레이싱 게임은 모두 데니 게임즈에서 플레이할 수 있고 상세 페이지에서 조작법을 확인할 수 있습니다.",
  },
  sports: {
    en: "Try golf, ball and table challenges in a few minutes. Every published sports game launches on Denny Games, with scoring and controls explained on its page.",
    ko: "골프와 공, 테이블 스포츠 도전을 짧게 즐겨보세요. 공개된 스포츠 게임은 모두 데니 게임즈에서 실행되며, 점수 규칙과 조작법은 각 페이지에 안내되어 있습니다.",
  },
  strategy: {
    en: "Strategy games will be listed here when a locally playable selection is ready.",
    ko: "사이트 안에서 플레이할 수 있는 전략 게임을 준비하면 이곳에 소개합니다.",
  },
  roguelike: {
    en: "Roguelike games will be listed here when a locally playable selection is ready.",
    ko: "사이트 안에서 플레이할 수 있는 로그라이크 게임을 준비하면 이곳에 소개합니다.",
  },
  simulation: {
    en: "Simulation games will be listed here when a locally playable selection is ready.",
    ko: "사이트 안에서 플레이할 수 있는 시뮬레이션 게임을 준비하면 이곳에 소개합니다.",
  },
};
