export type SoundCue =
  | "tick"
  | "stone"
  | "drop"
  | "flip"
  | "step"
  | "capture"
  | "line"
  | "box"
  | "win"
  | "lose"
  | "draw";
// Original synthesized effects: frequency, offset, duration, end frequency.
type Note = [number, number, number, number?];
const cues: Record<SoundCue, Note[]> = {
  tick: [[440, 0, 0.07]],
  stone: [
    [820, 0, 0.075, 180],
    [1600, 0, 0.025, 600],
  ],
  drop: [
    [360, 0, 0.12, 95],
    [240, 0.07, 0.07, 100],
  ],
  flip: [
    [440, 0, 0.07, 700],
    [660, 0.06, 0.09, 900],
  ],
  step: [[270, 0, 0.09, 180]],
  capture: [
    [180, 0, 0.08, 100],
    [720, 0.07, 0.13, 960],
  ],
  line: [[580, 0, 0.07, 760]],
  box: [
    [523.25, 0, 0.13],
    [659.25, 0.09, 0.13],
    [783.99, 0.18, 0.18],
  ],
  win: [
    [523.25, 0, 0.2],
    [659.25, 0.13, 0.2],
    [783.99, 0.26, 0.2],
    [1046.5, 0.39, 0.32],
  ],
  lose: [
    [392, 0, 0.2],
    [329.63, 0.16, 0.2],
    [261.63, 0.32, 0.3],
  ],
  draw: [
    [440, 0, 0.18],
    [523.25, 0.14, 0.18],
    [440, 0.28, 0.24],
  ],
};
export class GameAudio {
  private context?: AudioContext;
  private master?: GainNode;
  private voices = new Set<OscillatorNode>();
  private volume = 0.5;
  async resume() {
    this.context ??= new AudioContext();
    if (!this.master) {
      this.master = this.context.createGain();
      this.master.gain.value = this.volume;
      this.master.connect(this.context.destination);
    }
    await this.context.resume();
  }
  setVolume(value: number) {
    this.volume = Math.max(0, Math.min(1, value));
    if (this.master && this.context)
      this.master.gain.setTargetAtTime(
        this.volume,
        this.context.currentTime,
        0.015,
      );
  }
  play(cue: SoundCue = "tick") {
    const ctx = this.context;
    if (
      !ctx ||
      ctx.state !== "running" ||
      !this.master ||
      this.voices.size > 24
    )
      return;
    for (const [frequency, offset, duration, end] of cues[cue]) {
      const osc = ctx.createOscillator(),
        gain = ctx.createGain();
      const start = ctx.currentTime + offset;
      osc.type = cue === "stone" || cue === "capture" ? "triangle" : "sine";
      osc.frequency.setValueAtTime(frequency, start);
      if (end)
        osc.frequency.exponentialRampToValueAtTime(end, start + duration);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.075, start + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(gain).connect(this.master);
      this.voices.add(osc);
      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
        this.voices.delete(osc);
      };
      osc.start(start);
      osc.stop(start + duration + 0.01);
    }
  }
  async suspend() {
    // Discard scheduled notes so they cannot replay on resume.
    for (const voice of this.voices) {
      try {
        voice.stop();
      } catch {
        /* already ended */
      }
    }
    this.voices.clear();
    await this.context?.suspend();
  }
  async close() {
    await this.suspend();
    await this.context?.close();
  }
}
