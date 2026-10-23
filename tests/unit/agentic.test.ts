import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { agenticGames } from "../../src/data/agentic-games";
const provenance = JSON.parse(
  readFileSync("vendor/agentic/provenance.json", "utf8"),
);
describe("pinned Agentic editions", () => {
  it("retains all source bytes and notices", () => {
    expect(provenance.commit).toBe("f30b52a1707282b1559f7bae1fc301925612f5a6");
    for (const file of provenance.files) {
      expect(existsSync(file.path), file.path).toBe(true);
      expect(
        createHash("sha256").update(readFileSync(file.path)).digest("hex"),
        file.path,
      ).toBe(file.sha256);
    }
    expect(
      readFileSync("public/licenses/agentic/LICENSE.txt", "utf8"),
    ).toContain("MIT");
  });
  it("admits eleven distinct source-specific games with bilingual instructions", () => {
    expect(agenticGames).toHaveLength(11);
    expect(new Set(agenticGames.map((g) => g.id)).size).toBe(11);
    for (const game of agenticGames) {
      expect(game.source).toContain(provenance.commit);
      expect(game.stages).toBe(1);
      for (const locale of ["en", "ko"] as const) {
        expect(game.text[locale].rules[1]!.length).toBeGreaterThan(50);
        expect(game.text[locale].controls[0]!.length).toBeGreaterThan(30);
      }
    }
  });
  it("builds constrained local frames with pinned lifecycle hooks", () => {
    for (const game of agenticGames) {
      const html = readFileSync(
        `public/vendor/agentic/${game.id.slice(8)}.html`,
        "utf8",
      );
      expect(html).toContain("connect-src 'none'");
      expect(html).toContain("noindex,nofollow");
      // Upstream Wreckfall adds thumb-space inline margins; the host owns frame sizing.
      expect(html).toContain("canvas{margin:0!important;width:100%!important;");
      expect(html).toContain("window.__agenticSetup(");
      expect(html).toContain("e.origin!==parentOrigin");
      expect(html).toContain("window.setInterval=");
      expect(html).not.toMatch(/<script[^>]+src=/);
    }
  });
});

import { runInNewContext } from "node:vm";
function bridgeHarness() {
  const listeners = new Map<string, Array<(event: any) => void>>(),
    messages: any[] = [],
    raf: Array<(time: number) => void> = [];
  const parent = {
    postMessage: (message: any, origin: string) =>
      messages.push({ ...message, origin }),
  };
  const event = (type: string, data: any = {}) => {
    for (const fn of listeners.get(type) ?? [])
      fn({ type, preventDefault() {}, stopImmediatePropagation() {}, ...data });
  };
  class FakeEvent {
    type: string;
    constructor(type: string, data: any = {}) {
      this.type = type;
      Object.assign(this, data);
    }
  }
  const canvas = {
    width: 320,
    height: 240,
    dispatchEvent: (e: any) => event(e.type, e),
  };
  const context: any = {
    URL,
    URLSearchParams,
    Map,
    Set,
    WeakMap,
    Proxy,
    Promise,
    Number,
    Math,
    Object,
    Event: FakeEvent,
    KeyboardEvent: FakeEvent,
    PointerEvent: FakeEvent,
    MouseEvent: FakeEvent,
    parent,
    location: { search: "?channel=secret", origin: "https://games.test" },
    performance: { now: () => 0 },
    document: {
      referrer: "https://games.test/en/play/",
      body: { dataset: {} },
      querySelector: () => canvas,
      addEventListener() {},
    },
    requestAnimationFrame: (fn: any) => raf.push(fn),
    addEventListener: (type: string, fn: any) => {
      listeners.set(type, [...(listeners.get(type) ?? []), fn]);
    },
    dispatchEvent: (e: any) => event(e.type, e),
  };
  context.window = context;
  runInNewContext(readFileSync("vendor/agentic/bridge.js", "utf8"), context);
  return {
    context,
    messages,
    event,
    frame(time: number) {
      const fn = raf.shift();
      fn?.(time);
    },
    send(data: any, origin = "https://games.test", source = parent) {
      event("message", {
        source,
        origin,
        data: { channel: "secret", ...data },
      });
    },
  };
}
describe("Agentic lifecycle bridge", () => {
  it("freezes RAF, performance time and timers until an authenticated explicit resume", () => {
    const h = bridgeHarness();
    let steps = 0,
      timers = 0;
    h.context.__agenticSetup({
      start() {
        const step = () => {
          steps++;
          h.context.requestAnimationFrame(step);
        };
        h.context.requestAnimationFrame(step);
        h.context.setInterval(() => timers++, 20);
      },
      read: () => ({ score: 0, phase: "play", ended: false }),
    });
    h.frame(0);
    h.send({ type: "run", running: true }, "https://evil.test");
    h.frame(100);
    expect(steps).toBe(1);
    expect(timers).toBe(0);
    h.send({ type: "run", running: true });
    h.frame(120);
    h.frame(140);
    expect(steps).toBe(3);
    expect(timers).toBe(2);
    h.send({ type: "run", running: false });
    const time = h.context.performance.now();
    h.frame(900);
    h.frame(1200);
    expect(steps).toBe(3);
    expect(timers).toBe(2);
    expect(h.context.performance.now()).toBe(time);
    h.send({ type: "run", running: true });
    h.frame(1220);
    expect(steps).toBe(4);
    expect(timers).toBe(3);
  });
  it("reports a real terminal state once and prevents resume after ending", () => {
    const h = bridgeHarness();
    let terminal = false;
    h.context.__agenticSetup({
      start() {},
      read: () => ({ score: 120, phase: "over", ended: terminal, won: true }),
    });
    h.send({ type: "run", running: true });
    h.frame(0);
    terminal = true;
    h.frame(20);
    h.send({ type: "run", running: true });
    h.frame(40);
    expect(h.messages.filter((m) => m.type === "end")).toEqual([
      {
        channel: "secret",
        type: "end",
        score: 120,
        won: true,
        origin: "https://games.test",
      },
    ]);
  });
});

describe("Agentic native held input", () => {
  it("releases upstream keyboard aliases when pause takes focus away", () => {
    const h = bridgeHarness();
    let left = false;
    h.context.addEventListener("keydown", (e: { code: string }) => {
      if (e.code === "KeyA") left = true;
    });
    h.context.addEventListener("keyup", (e: { code: string }) => {
      if (e.code === "KeyA") left = false;
    });
    h.context.__agenticSetup({
      start() {},
      read: () => ({ score: 0, ended: false }),
    });
    h.send({ type: "run", running: true });
    h.event("keydown", { code: "KeyA" });
    expect(left).toBe(true);
    h.send({ type: "run", running: false });
    expect(left).toBe(false);
    h.send({ type: "run", running: true });
    expect(left).toBe(false);
  });
});
