import type { Locale } from "../lib/types";

export type ControlStyle =
  "buttons" | "pointer" | "numbers" | "directional" | "host";

export const controlStyles = [
  "buttons",
  "pointer",
  "numbers",
  "directional",
] as const;

export const controlLabels: Record<ControlStyle, Record<Locale, string>> = {
  buttons: { en: "One button", ko: "한 버튼" },
  pointer: { en: "Point and move", ko: "위치 조작" },
  numbers: { en: "Number keys", ko: "숫자 키" },
  directional: { en: "Directions", ko: "방향 조작" },
  host: { en: "Check host controls", ko: "호스트 조작 안내 확인" },
};
