import type { SoundCue } from "./audio";
export type Locale = "en" | "ko";
export type Action = "up" | "down" | "left" | "right" | "confirm";
export interface GameResult {
  score: number;
  won: boolean;
  message?: string;
  draw?: boolean;
  restored?: boolean;
}
export interface GameContext {
  host: HTMLElement;
  settingsHost?: HTMLElement;
  controlsHost?: HTMLElement;
  setupHost?: HTMLElement;
  locale: Locale;
  seed: string;
  stage: number;
  saved?: unknown;
  onChange: (score: number) => void;
  onEnd: (result: GameResult) => void;
  sound: (cue?: SoundCue) => void;
  onReady?: (size?: { width: number; height: number }) => void;
  onPause?: () => void;
  onSave?: () => boolean;
  onError?: (message: string) => void;
}
export interface GameInstance {
  start(): void;
  pause(): void;
  resume(): void;
  restart(): void;
  action(action: Action): void;
  inputState?(state: { x: number; y: number; pressed: boolean }): void;
  setSoundEnabled?(enabled: boolean): void;
  setVolume?(volume: number): void;
  serialize(): unknown;
  flush?(): Promise<boolean>;
  destroy(): void;
}
export type GameFactory = (context: GameContext) => GameInstance;
