import type { GameFactory, Action } from "../../lib/types";
import { createMotion } from "../../lib/motion";
import {
  newAcademy,
  train,
  restoreAcademy,
  academyEnding,
  courses,
  type Course,
} from "./academy";
import {
  maps,
  newQuest,
  questStep,
  restoreQuest,
  type QuestAction,
} from "./quest";
import "./style.css";
const node = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  cls = "",
  text = "",
) => {
  const e = document.createElement(tag);
  e.className = cls;
  e.textContent = text;
  return e;
};
const names = {
  en: {
    craft: "Workshop",
    study: "Library",
    explore: "Trail",
    work: "Market",
    rest: "Rest",
  },
  ko: {
    craft: "공방 수업",
    study: "도서관 공부",
    explore: "숲 탐험",
    work: "시장 일손",
    rest: "휴식",
  },
};
const endings = {
  en: {
    steward: "Keeper of the Valley",
    artisan: "Master Artisan",
    scholar: "Star Scholar",
    ranger: "Forest Ranger",
    merchant: "Market Founder",
    healer: "Village Healer",
    citizen: "A New Beginning",
  },
  ko: {
    steward: "계곡의 수호자",
    artisan: "장인",
    scholar: "별을 읽는 학자",
    ranger: "숲의 길잡이",
    merchant: "시장의 개척자",
    healer: "마을의 치유사",
    citizen: "새로운 시작",
  },
};
export const mountAcademy: GameFactory = (ctx) => {
  const ko = ctx.locale === "ko";
  let s = restoreAcademy((ctx.saved as { history?: unknown })?.history),
    active = false,
    ended = false,
    selected = 0;
  const root = node("section", "heritage-surface academy");
  root.setAttribute("aria-label", ko ? "별빛 수습생" : "Starlight Apprentice");
  const label = node("div", "heritage-eyebrow"),
    title = node("h2"),
    scene = node("div", "heritage-scene");
  // Original CSS/SVG village illustration; no imported characters or scenery.
  scene.innerHTML =
    '<svg viewBox="0 0 640 200" width="100%" height="100%" aria-hidden="true"><circle cx="510" cy="45" r="24" fill="#fff1be"/><path d="M0 130 100 55 210 145 330 35 470 145 560 85 640 130V200H0" fill="#446e70"/><path d="M0 165Q140 105 300 170T640 150V200H0" fill="#254e49"/><path d="M80 170V110H190V170M260 170V100H360V170M420 170V105H540V170" fill="#e0bb88"/><path d="M60 112 135 65 210 112M240 102 310 55 380 102M400 107 480 55 560 107" fill="#9d5d4e"/><path d="M120 170V132H148V170M298 170V123H326V170M465 170V128H490V170" fill="#243d48"/><g fill="#ffe6a0"><path d="M91 121h17v20H91zM163 121h17v20h-17zM271 111h16v20h-16zM335 111h16v20h-16zM432 118h18v20h-18zM510 118h18v20h-18z"/></g><circle cx="390" cy="145" r="10" fill="#f2c391"/><path d="M379 158q11-10 22 0l5 30h-32z" fill="#a7f0e6"/><path d="M379 141q11-22 22 0" fill="#423849"/></svg>';
  const stats = node("div", "heritage-stats"),
    log = node("p", "heritage-log"),
    choices = node("div", "heritage-choices");
  log.setAttribute("role", "status");
  const buttons = courses.map((c) => {
    const b = node("button");
    b.type = "button";
    b.dataset.course = c;
    b.addEventListener("focus", () => {
      selected = courses.indexOf(c);
    });
    b.addEventListener("click", () => choose(c));
    choices.append(b);
    return b;
  });
  root.append(label, title, scene, stats, log, choices);
  ctx.host.append(root);
  const motion = createMotion(root);
  const eventNames = ko
    ? ["공방 축제", "독서 모임", "탐험가의 날"]
    : ["Workshop festival", "Reading circle", "Explorer day"];
  function render() {
    root.dataset.week = String(s.week);
    root.dataset.history = s.history.join(",");
    label.textContent = ko
      ? `별빛 마을 · ${Math.min(24, s.week + 1)} / 24주`
      : `STARLIGHT VILLAGE · WEEK ${Math.min(24, s.week + 1)} / 24`;
    title.textContent =
      s.week === 24
        ? endings[ctx.locale][academyEnding(s)]
        : ko
          ? "어떤 내일을 만들까요?"
          : "What will you become?";
    stats.replaceChildren();
    for (const [key, en, kr, max] of [
      ["craft", "Craft", "손재주", 100],
      ["wisdom", "Wisdom", "지혜", 100],
      ["courage", "Courage", "용기", 100],
      ["energy", "Energy", "기력", 100],
      ["gold", "Coins", "동전", 200],
      ["kindness", "Care", "배려", 40],
    ] as const) {
      const box = node("div", "heritage-stat", ko ? kr : en),
        v = node("strong", "", String(s[key])),
        meter = node("meter");
      meter.max = max;
      meter.value = s[key];
      meter.setAttribute("aria-label", ko ? kr : en);
      box.append(v, meter);
      stats.append(box);
    }
    buttons.forEach((b, i) => {
      const c = courses[i]!;
      b.disabled = !active || !train(s, c);
      b.replaceChildren(
        node("span", "", names[ctx.locale][c]),
        node(
          "small",
          "",
          c === "rest"
            ? ko
              ? "기력 +35 · 배려 +2"
              : "Energy +35 · Care +2"
            : c === "work"
              ? ko
                ? "동전 +10 · 기력 −12"
                : "Coins +10 · Energy −12"
              : ko
                ? "능력 +9 · 동전 −3 · 기력 −12"
                : "Skill +9 · Coins −3 · Energy −12",
        ),
      );
    });
    log.textContent =
      s.week === 24
        ? ko
          ? "계절이 끝났어요. 선택이 쌓여 당신만의 길이 되었습니다. 다시 시작해 다른 삶도 만나보세요."
          : "The season ends. Your choices have become a path of your own. Restart to discover another life."
        : s.week === 0
          ? ko
            ? "24주 동안 수습생을 이끌어 주세요. 매 4주 축제에서 해당 능력만큼 동전을 받아요."
            : "Guide an apprentice for 24 weeks. Every fourth week, a festival rewards one of your skills."
          : s.week % 4 === 0
            ? `${eventNames[(s.week / 4 - 1) % 3]} · ${ko ? "마을이 성장을 축하해요!" : "The village celebrates your growth!"}`
            : `${names[ctx.locale][s.history.at(-1)!]} · ${ko ? "한 주를 보냈어요. 다음 선택은 무엇인가요?" : "Another week complete. Choose your next step."}`;
    ctx.onChange(s.craft + s.wisdom + s.courage + s.kindness + s.gold);
  }
  function complete() {
    if (s.week === 24 && !ended) {
      ended = true;
      active = false;
      ctx.onEnd({
        won: true,
        score: s.craft + s.wisdom + s.courage + s.kindness + s.gold,
        message: endings[ctx.locale][academyEnding(s)],
      });
    }
  }
  function choose(c: Course) {
    if (!active) return;
    const n = train(s, c);
    if (!n) return;
    s = n;
    motion.finish();
    render();
    motion.run((t) => {
      t.fromTo(
        stats,
        { y: 5, opacity: 0.6 },
        { y: 0, opacity: 1, duration: 0.25 },
      );
    });
    ctx.sound();
    ctx.onSave?.();
    complete();
  }
  const activate = () => {
    active = true;
    complete();
    render();
  };
  render();
  return {
    start: activate,
    resume: activate,
    pause() {
      active = false;
      motion.finish();
      render();
    },
    restart() {
      s = newAcademy();
      ended = false;
      active = true;
      render();
    },
    action(a: Action) {
      if (!active) return;
      if (a === "confirm") choose(courses[selected]!);
      else {
        selected = (selected + (["left", "up"].includes(a) ? 4 : 1)) % 5;
        buttons[selected]!.focus({ preventScroll: true });
      }
    },
    serialize() {
      return { history: s.history };
    },
    destroy() {
      motion.destroy();
      root.remove();
    },
  };
};
const events = {
  en: {
    arrival:
      "Recover the three beacon routes. Find the key, reach the gate, and return the light to the valley.",
    step: "Explore the trail. Springs heal once; workshops trade ten coins for a stronger weapon.",
    locked:
      "The gate needs a key. In the final valley, defeat the sentinel too.",
    shop: "Workshop: spend 10 coins to strengthen your weapon (+3, maximum 15).",
    treasure: "You found twelve coins.",
    spring: "The spring restores all health.",
    key: "The gate key is yours.",
    encounter:
      "A shadow blocks the trail. Strike for damage or guard to reduce the reply.",
    victory: "The shadow fades. You collect its coins.",
    heal: "A tonic restores sixteen health.",
    upgrade: "Your weapon grows stronger.",
    guard: "You brace and counterattack.",
    strike: "You strike. The shadow answers.",
    home: "The beacon shines again. You brought the lost paths home.",
  },
  ko: {
    arrival:
      "세 봉화 길을 되찾으세요. 열쇠를 찾아 문으로 이동하고 계곡에 빛을 돌려주세요.",
    step: "샘은 한 번 체력을 회복해 줘요. 공방에서는 동전 10개로 무기를 강화해요.",
    locked: "열쇠가 필요해요. 마지막 계곡에서는 수호자도 물리쳐야 해요.",
    shop: "공방: 동전 10개로 공격력 +3 (최대 15).",
    treasure: "동전 12개를 찾았어요.",
    spring: "샘물이 체력을 모두 회복했어요.",
    key: "문의 열쇠를 찾았어요.",
    encounter: "그림자가 길을 막아요. 공격하거나 방어하며 반격하세요.",
    victory: "그림자가 사라졌어요. 동전을 얻었어요.",
    heal: "회복약으로 체력 16을 회복했어요.",
    upgrade: "무기가 더 강해졌어요.",
    guard: "공격을 막으며 반격했어요.",
    strike: "공격했어요. 그림자가 반격해요.",
    home: "봉화가 다시 빛나요. 잃어버린 길에 온기를 돌려주었습니다.",
  },
};
export const mountQuest: GameFactory = (ctx) => {
  const ko = ctx.locale === "ko";
  let { state: s, history } = restoreQuest(
      (ctx.saved as { history?: unknown })?.history,
    ),
    active = false,
    ended = false;
  const root = node("section", "heritage-surface quest"),
    heading = node("h2"),
    status = node("p"),
    grid = node("div", "quest-map"),
    note = node("p", "heritage-log"),
    battle = node("div", "quest-battle"),
    controls = node("div", "heritage-tools");
  note.setAttribute("role", "status");
  const actions: [QuestAction, string, string][] = [
    ["left", "←", "←"],
    ["up", "↑", "↑"],
    ["down", "↓", "↓"],
    ["right", "→", "→"],
    ["strike", "Strike", "공격"],
    ["guard", "Guard", "방어"],
    ["potion", "Tonic · 5", "회복약 · 5"],
    ["upgrade", "Forge · 10", "강화 · 10"],
  ];
  const buttons = actions.map(([a, en, kr]) => {
    const b = node("button", "", ko ? kr : en);
    b.type = "button";
    b.dataset.questAction = a;
    b.setAttribute(
      "aria-label",
      ko
        ? ({ left: "왼쪽", up: "위", down: "아래", right: "오른쪽" }[
            a as "left"
          ] ?? kr)
        : en,
    );
    b.addEventListener("click", () => turn(a));
    controls.append(b);
    return b;
  });
  grid.setAttribute("role", "img");
  root.append(heading, status, grid, battle, note);
  ctx.host.append(root);
  (ctx.controlsHost ?? ctx.host).append(controls);
  const motion = createMotion(root);
  const glyphs: Record<string, string> = {
    "#": "",
    "@": "",
    g: "◆",
    h: "✚",
    s: "⚒",
    k: "⚿",
    e: "♟",
    b: "♜",
    ">": "▣",
    ".": "",
  };
  function render() {
    root.dataset.chapter = String(s.chapter);
    root.dataset.position = `${s.x},${s.y}`;
    root.dataset.hp = String(s.hp);
    root.dataset.battle = String(!!s.battle);
    heading.textContent = (
      ko
        ? ["이끼 길", "안개 숲", "마지막 봉화"]
        : ["Moss Road", "Mistwood", "The Last Beacon"]
    )[s.chapter]!;
    status.textContent = `${ko ? "체력" : "HP"} ${s.hp}/30 · ${ko ? "공격" : "ATK"} ${s.attack} · ${ko ? "동전" : "Coins"} ${s.gold} · ${ko ? "열쇠" : "Key"} ${s.keys}`;
    grid.setAttribute(
      "aria-label",
      `${ko ? "현재 위치" : "Position"} ${s.x + 1}, ${s.y + 1}. ${ko ? "방향 버튼으로 이동하세요." : "Use direction controls to move."}`,
    );
    grid.replaceChildren();
    maps[s.chapter]!.forEach((row, y) =>
      [...row].forEach((tile, x) => {
        const hero = s.x === x && s.y === y,
          cell = node(
            "span",
            `quest-tile ${tile === "#" ? "wall" : ""} ${hero ? "hero" : ""}`,
            hero
              ? "▲"
              : s.cleared.includes(`${s.chapter}:${x}:${y}`)
                ? ""
                : (glyphs[tile] ?? ""),
          );
        cell.setAttribute("aria-hidden", "true");
        grid.append(cell);
      }),
    );
    note.textContent =
      events[ctx.locale][s.event as keyof typeof events.en] ??
      events[ctx.locale].step;
    battle.hidden = !s.battle;
    battle.textContent = s.battle
      ? `${s.battle.boss ? (ko ? "봉화 수호자" : "Beacon sentinel") : ko ? "길의 그림자" : "Trail shadow"} · HP ${s.battle.hp} · ${ko ? "반격" : "Reply"} ${s.battle.power}`
      : "";
    buttons.forEach((b, i) => {
      const a = actions[i]![0];
      b.disabled =
        !active ||
        (!!s.battle &&
          ["left", "up", "down", "right", "upgrade"].includes(a)) ||
        (!s.battle && ["strike", "guard"].includes(a)) ||
        (a === "potion" && (s.gold < 5 || s.hp === 30)) ||
        (a === "upgrade" &&
          (s.gold < 10 ||
            maps[s.chapter]![s.y]![s.x] !== "s" ||
            s.attack >= 15));
    });
    ctx.onChange(
      s.chapter * 100 +
        s.gold +
        s.cleared.filter((x) => x.endsWith(":7")).length * 10,
    );
  }
  function complete() {
    if ((s.won || s.lost) && !ended) {
      ended = true;
      active = false;
      ctx.onEnd({
        won: s.won,
        score: s.chapter * 100 + s.gold + (s.won ? 300 : 0),
        message: s.won
          ? events[ctx.locale].home
          : ko
            ? "봉화 길에서 쓰러졌어요. 회복약과 샘을 활용해 다시 도전하세요."
            : "The trail overcame you. Use springs and tonics on your next expedition.",
      });
    }
  }
  function turn(a: QuestAction) {
    if (!active) return;
    if (history.length >= 3000) {
      note.textContent = ko
        ? "저장 한도에 도달했어요. 다시 시작해 주세요."
        : "Save limit reached. Please restart.";
      return;
    }
    const before = s,
      n = questStep(s, a);
    if (n === s) return;
    motion.finish();
    s = n;
    history.push(a);
    render();
    const hero = grid.querySelector(".hero");
    if (hero && before.chapter === s.chapter)
      motion.run((t) => {
        t.fromTo(
          hero,
          {
            x: ((before.x - s.x) * grid.clientWidth) / 9,
            y: ((before.y - s.y) * grid.clientHeight) / 9,
          },
          { x: 0, y: 0, duration: 0.16 },
        );
      });
    ctx.sound();
    ctx.onSave?.();
    complete();
  }
  const activate = () => {
    active = true;
    complete();
    render();
  };
  render();
  return {
    start: activate,
    resume: activate,
    pause() {
      active = false;
      motion.finish();
      render();
    },
    restart() {
      s = newQuest();
      history = [];
      ended = false;
      active = true;
      render();
    },
    action(a) {
      turn(a === "confirm" ? "strike" : a);
    },
    serialize() {
      return { history };
    },
    destroy() {
      motion.destroy();
      root.remove();
      controls.remove();
    },
  };
};
