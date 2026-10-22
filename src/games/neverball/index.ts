import type { GameFactory } from "../../lib/types";
type Files = Record<string, number[]>;
function validate(value: unknown): Files {
  const out: Files = {};
  if (!value || typeof value !== "object") return out;
  let size = 0;
  for (const [name, data] of Object.entries(value)) {
    if (
      !/^(?:Scores\/)?[A-Za-z0-9_.-]{1,100}$/.test(name) ||
      name.split("/").some((part) => part === "." || part === "..") ||
      !Array.isArray(data) ||
      data.length > 60000 ||
      !data.every((n) => Number.isInteger(n) && n >= 0 && n <= 255)
    )
      continue;
    size += data.length;
    if (size > 180000) break;
    out[name] = data;
  }
  return out;
}
export const createMount =
  (kind: "neverball" | "neverputt"): GameFactory =>
  (ctx) => {
    const channel = crypto.randomUUID(),
      frame = document.createElement("iframe");
    frame.className = "crisp-frame";
    const narrow = matchMedia("(max-width: 599px)");
    const layout = () => {
      const width = narrow.matches ? 600 : 800,
        height = narrow.matches ? 800 : 450;
      frame.style.aspectRatio = `${width} / ${height}`;
      frame.style.setProperty("--frame-ratio", String(width / height));
      if (ready) ctx.onReady?.({ width, height });
    };
    frame.title = kind === "neverball" ? "Neverball" : "Neverputt";
    frame.sandbox.add("allow-scripts", "allow-pointer-lock");
    frame.src = `/vendor/neverball/index.html?channel=${channel}`;
    const send = (type: string, payload: Record<string, unknown> = {}) =>
      frame.contentWindow?.postMessage({ type, channel, ...payload }, "*");
    let files = validate((ctx.saved as { files?: unknown })?.files),
      ready = false,
      active = false,
      dead = false,
      failed = false;
    layout();
    narrow.addEventListener("change", layout);
    const controller = new AbortController();
    const pending = new Map<string, (ok: boolean) => void>();
    const note = document.createElement("p");
    note.className = "heritage-note";
    note.textContent =
      ctx.locale === "ko"
        ? "공식 기본 코스 · 첫 다운로드 약 33 MB · 원작 음향 제외 · 네버볼 기록/네버퍼트 설정 저장"
        : "Official base courses · About 33 MB · Audio omitted · Neverball records / Neverputt preferences saved";
    (ctx.controlsHost ?? ctx.host).append(note);
    const fail = () => {
      if (dead || failed) return;
      failed = true;
      ready = false;
      controller.abort();
      clearTimeout(timer);
      ctx.onError?.(
        ctx.locale === "ko"
          ? "게임을 불러오지 못했어요. 네트워크와 WebGL 지원을 확인하고 새로고침해 주세요."
          : "The game could not load. Check your connection and WebGL support, then refresh.",
      );
    };
    const timer = setTimeout(fail, 90000);
    const receive = async (e: MessageEvent) => {
      if (
        e.source !== frame.contentWindow ||
        e.origin !== "null" ||
        e.data?.channel !== channel ||
        dead ||
        failed
      )
        return;
      const d = e.data;
      if (d.type === "bridge-ready") {
        try {
          const [wasm, data, easy, putt] = await Promise.all(
            [
              "neverball.wasm",
              "neverball.data",
              "set-easy.zip",
              "course-putt.zip",
            ].map(async (f) => {
              const r = await fetch("/vendor/neverball/" + f, {
                signal: controller.signal,
              });
              if (!r.ok) throw Error("fetch");
              return r.arrayBuffer();
            }),
          );
          if (!dead && !failed)
            send("init", {
              wasm,
              data,
              easy,
              putt,
              files,
              kind,
              locale: ctx.locale,
            });
        } catch {
          fail();
        }
      }
      if (d.type === "ready") {
        ready = true;
        clearTimeout(timer);
        layout();
        if (active) send("start");
      }
      if (d.type === "snapshot") {
        files = validate(d.files);
        ctx.onSave?.();
        if (typeof d.requestId === "string") {
          pending.get(d.requestId)?.(true);
          pending.delete(d.requestId);
        }
      }
      if (d.type === "pause") ctx.onPause?.();
      if (d.type === "exit") ctx.onEnd({ won: false, score: 0 });
      if (d.type === "error") fail();
    };
    window.addEventListener("message", receive);
    ctx.host.append(frame);
    return {
      start() {
        active = true;
        if (ready) send("start");
        frame.focus({ preventScroll: true });
      },
      resume() {
        active = true;
        if (ready) send("start");
        frame.focus({ preventScroll: true });
      },
      pause() {
        active = false;
        send("pause");
      },
      restart() {
        active = true;
        if (ready) send("start");
      },
      action(action) {
        if (active && ready) send("key", { action });
      },
      serialize() {
        return { files };
      },
      flush() {
        if (!ready) return Promise.resolve(false);
        return new Promise<boolean>((resolve) => {
          const id = crypto.randomUUID();
          const timeout = setTimeout(() => {
            pending.delete(id);
            resolve(false);
          }, 1500);
          pending.set(id, (ok) => {
            clearTimeout(timeout);
            resolve(ok);
          });
          send("snapshot", { requestId: id });
        });
      },
      destroy() {
        dead = true;
        controller.abort();
        narrow.removeEventListener("change", layout);
        clearTimeout(timer);
        window.removeEventListener("message", receive);
        for (const done of pending.values()) done(false);
        pending.clear();
        frame.remove();
        note.remove();
      },
    };
  };
