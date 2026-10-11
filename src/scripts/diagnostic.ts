export {};
const panel = document.querySelector<HTMLElement>("#diagnostic")!;
let frame = 0;
function tick() {
  let pads: (Gamepad | null)[] = [];
  try {
    pads = [...(navigator.getGamepads?.() ?? [])];
  } catch {
    /* policy restriction */
  }
  panel.textContent = JSON.stringify(
    {
      secureContext: window.isSecureContext,
      gamepadAPI: typeof navigator.getGamepads === "function",
      touchPoints: navigator.maxTouchPoints,
      controllers: pads
        .filter((pad): pad is Gamepad => Boolean(pad))
        .map((pad) => ({
          id: pad.id,
          mapping: pad.mapping,
          index: pad.index,
          axes: pad.axes.map((v) => +v.toFixed(2)),
          pressed: pad.buttons.flatMap((button, i) =>
            button.pressed ? [i] : [],
          ),
        })),
    },
    null,
    2,
  );
  frame = requestAnimationFrame(tick);
}
tick();
window.addEventListener("pagehide", () => cancelAnimationFrame(frame), {
  once: true,
});
let taps = 0;
document.querySelector("#touch-test")?.addEventListener("click", () => {
  document.querySelector("#touch-result")!.textContent =
    `${++taps} ${document.documentElement.lang === "ko" ? "회 입력" : "inputs received"}`;
});
document
  .querySelector("#diagnostic-sound")
  ?.addEventListener("click", async () => {
    try {
      const audio = new AudioContext();
      await audio.resume();
      const osc = audio.createOscillator(),
        gain = audio.createGain();
      gain.gain.value = 0.05;
      osc.frequency.value = 440;
      osc.connect(gain).connect(audio.destination);
      osc.start();
      osc.stop(audio.currentTime + 0.15);
      osc.onended = () => {
        void audio.close();
      };
    } catch {
      document.querySelector("#touch-result")!.textContent =
        document.documentElement.lang === "ko"
          ? "소리를 사용할 수 없습니다."
          : "Sound is unavailable.";
    }
  });
