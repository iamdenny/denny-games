export type Locale = "en" | "ko";
export type Action = "up" | "down" | "left" | "right" | "confirm";
export interface GameResult {
  score: number;
  won: boolean;
}
export interface GameContext {
  host: HTMLElement;
  locale: Locale;
  seed: string;
  stage: number;
  saved?: unknown;
  onChange: (score: number) => void;
  onEnd: (result: GameResult) => void;
  sound: () => void;
}
export interface GameInstance {
  start(): void;
  pause(): void;
  resume(): void;
  restart(): void;
  action(action: Action): void;
  serialize(): unknown;
  destroy(): void;
}
export type GameFactory = (context: GameContext) => GameInstance;
