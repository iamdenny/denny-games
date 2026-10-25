/* ==== ENGINE START ==== */
/* 8-ball rules on top of the shared table physics in lib/cue.js (#259). Ball 0 is
   the cue ball, 1–7 solids, 8 the black, 9–15 stripes. The frame state is plain
   data, so it saves as is and the AI can try shots on copies of it. */
function EightBallEngineFactory(Cue) {
  'use strict';
  Cue = Cue || (typeof self !== 'undefined' && self.ChoganCue) || null;
  if (!Cue) throw new Error('lib/cue.js is not loaded');

  var T = Cue.table({});
  var R = T.r, HEAD = T.L * 0.25, FOOT = { x: T.L * 0.75, y: T.W / 2 };
  var DAILY_BALLS = 7, DAILY_MAX = 30;

  function group(id) { return id === 0 ? 'cue' : (id === 8 ? 'eight' : (id < 8 ? 'solid' : 'stripe')); }
  function other(g) { return g === 'solid' ? 'stripe' : 'solid'; }
  function ball(F, id) { for (var i = 0; i < F.balls.length; i++) if (F.balls[i].id === id) return F.balls[i]; return null; }
  function onTable(F, g) { return F.balls.filter(function (b) { return b.inPlay && group(b.id) === g; }).map(function (b) { return b.id; }); }

  function shuffle(a, rnd) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  // The triangle: apex on the foot spot, the 8 in the middle of the third row,
  // one solid and one stripe in the back corners, the rest at random.
  function rack(rnd) {
    var dx = (2 * R + 0.02) * Math.sqrt(3) / 2, dy = 2 * R + 0.02, slots = [];
    for (var k = 0; k < 5; k++) for (var j = 0; j <= k; j++) slots.push({ x: FOOT.x + k * dx, y: FOOT.y + (j - k / 2) * dy, k: k, j: j });
    var solids = shuffle([1, 2, 3, 4, 5, 6, 7], rnd), stripes = shuffle([9, 10, 11, 12, 13, 14, 15], rnd);
    var cornerA = solids.pop(), cornerB = stripes.pop();
    if (rnd() < 0.5) { var t = cornerA; cornerA = cornerB; cornerB = t; }
    var rest = shuffle(solids.concat(stripes), rnd), balls = [{ id: 0, x: HEAD * 0.8, y: T.W / 2, vx: 0, vy: 0, inPlay: true }];
    slots.forEach(function (s) {
      var id = s.k === 2 && s.j === 1 ? 8 : (s.k === 4 && s.j === 0 ? cornerA : (s.k === 4 && s.j === 4 ? cornerB : rest.pop()));
      balls.push({ id: id, x: s.x, y: s.y, vx: 0, vy: 0, inPlay: true });
    });
    return balls;
  }

  function newFrame(o) {
    return {
      mode: o.mode || 'ai', level: o.level || 'medium', balls: rack(o.rnd || Math.random),
      groups: [null, null], turn: o.first || 0, inHand: true, kitchen: true, isBreak: true,
      over: false, winner: null, shots: 0, fouls: [0, 0], potted: [0, 0], visit: 0, bestRun: [0, 0], daily: null, last: null
    };
  }

  // The daily table: a few balls laid out from the day's seed and the white
  // in hand, the same for everyone. Clear it in as few shots as you can.
  function newDaily(rnd, date) {
    var ids = shuffle([1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15], rnd).slice(0, DAILY_BALLS);
    var balls = [{ id: 0, x: HEAD * 0.8, y: T.W / 2, vx: 0, vy: 0, inPlay: true }], guard = 0;
    while (balls.length < DAILY_BALLS + 1 && guard++ < 5000) {
      var x = R * 5 + rnd() * (T.L - R * 10), y = R * 5 + rnd() * (T.W - R * 10), okp = true;
      for (var i = 0; i < balls.length && okp; i++) okp = Math.hypot(balls[i].x - x, balls[i].y - y) > R * 5;
      for (var k = 0; k < T.pockets.length && okp; k++) okp = Math.hypot(T.pockets[k].x - x, T.pockets[k].y - y) > 18;
      if (okp) balls.push({ id: ids[balls.length - 1], x: x, y: y, vx: 0, vy: 0, inPlay: true });
    }
    var F = newFrame({ mode: 'daily', rnd: rnd });
    F.balls = balls; F.kitchen = false; F.isBreak = false; F.daily = date || null;
    return F;
  }

  function copy(F) {
    var G = JSON.parse(JSON.stringify(F));
    return G;
  }

  function legalPlace(F, x, y) {
    return Cue.free(T, F.balls, x, y, 0) && (!F.kitchen || x <= HEAD);
  }
  // A free spot for the white: where it was asked for, else the nearest free one
  function freeSpot(F, x, y) {
    if (legalPlace(F, x, y)) return { x: x, y: y };
    for (var d = 1; d < 120; d += 1) {
      for (var a = 0; a < 16; a++) {
        var px = x + Math.cos(a * Math.PI / 8) * d, py = y + Math.sin(a * Math.PI / 8) * d;
        if (legalPlace(F, px, py)) return { x: px, y: py };
      }
    }
    return { x: R * 2, y: R * 2 };
  }
  function placeCue(F, x, y) {
    if (!F.inHand || !legalPlace(F, x, y)) return false;
    var c = ball(F, 0);
    c.x = x; c.y = y; c.inPlay = true;
    return true;
  }

  // The balls this player may hit first
  function targets(F, p) {
    if (F.mode === 'daily') return F.balls.filter(function (b) { return b.inPlay && b.id !== 0; }).map(function (b) { return b.id; });
    var g = F.groups[p];
    if (!g) return F.balls.filter(function (b) { return b.inPlay && b.id !== 0 && b.id !== 8; }).map(function (b) { return b.id; });
    var own = onTable(F, g);
    return own.length ? own : [8];
  }

  // Judge a finished shot. F is the frame before it, ev what cue.js saw.
  function judge(F, ev) {
    var p = F.turn, g = F.groups[p], potted = ev.potted;
    var scratch = potted.indexOf(0) >= 0, eight = potted.indexOf(8) >= 0;
    var res = { foul: null, scratch: scratch, first: ev.first, potted: potted.slice(), own: 0, opp: 0, assigned: null, continues: false, win: false, lose: false, respot: false };
    if (F.mode === 'daily') {
      if (ev.first === null) res.foul = 'noHit';
      if (scratch) res.foul = 'scratch';
      res.own = potted.filter(function (id) { return id !== 0; }).length;
      return res;
    }
    var cleared = !!g && onTable(F, g).length === 0;
    if (ev.first === null) res.foul = 'noHit';
    else if (!g) { if (ev.first === 8 && !F.isBreak) res.foul = 'wrongFirst'; }
    else if (cleared) { if (ev.first !== 8) res.foul = 'wrongFirst'; }
    else if (group(ev.first) !== g) res.foul = 'wrongFirst';
    if (scratch) res.foul = 'scratch';
    if (eight) {
      // Potting the 8 on the break is no loss: it goes back on its spot
      if (F.isBreak) res.respot = true;
      else if (cleared && !res.foul) res.win = true;
      else res.lose = true;
    }
    var objects = potted.filter(function (id) { return id !== 0 && id !== 8; });
    var mine = g;
    if (!g && !res.foul && objects.length && !res.lose) { mine = group(objects[0]); res.assigned = mine; }
    if (mine) {
      res.own = objects.filter(function (id) { return group(id) === mine; }).length;
      res.opp = objects.length - res.own;
    }
    res.continues = !res.foul && !res.win && !res.lose && res.own > 0;
    return res;
  }

  // Apply a judged shot to a copy of the frame
  function apply(F, sim, res) {
    var G = copy(F), p = F.turn;
    G.balls = Cue.clone(sim.balls);
    G.shots++;
    G.last = { foul: res.foul, potted: res.potted, assigned: res.assigned, respot: res.respot, by: p };
    if (F.mode === 'daily') {
      if (res.foul) G.fouls[0]++;
      G.potted[0] += res.own;
      G.isBreak = false;
      G.kitchen = false;
      G.inHand = !!res.foul;
      if (res.scratch) { var c0 = ball(G, 0), s0 = freeSpot(G, HEAD * 0.8, T.W / 2); c0.x = s0.x; c0.y = s0.y; c0.inPlay = true; }
      if (onTable(G, 'solid').length + onTable(G, 'stripe').length === 0) { G.over = true; G.winner = 0; }
      else if (G.shots >= DAILY_MAX) { G.over = true; G.winner = null; }
      return G;
    }
    if (res.respot) {
      var e8 = ball(G, 8), s8 = { x: FOOT.x, y: FOOT.y };
      for (var dx = 0; dx < T.L - FOOT.x - R && !Cue.free(T, G.balls, s8.x, s8.y, 8); dx += 0.5) s8.x = FOOT.x + dx;
      e8.x = s8.x; e8.y = s8.y; e8.inPlay = true;
    }
    if (res.assigned) { G.groups[p] = res.assigned; G.groups[1 - p] = other(res.assigned); }
    G.potted[p] += res.own;
    if (res.foul) G.fouls[p]++;
    G.isBreak = false;
    G.kitchen = false;
    if (res.win || res.lose) {
      G.over = true;
      G.winner = res.win ? p : 1 - p;
      G.inHand = false;
      return G;
    }
    if (res.continues) { G.visit += res.own; G.bestRun[p] = Math.max(G.bestRun[p], G.visit); }
    else { G.turn = 1 - p; G.visit = 0; }
    G.inHand = !!res.foul;
    if (res.scratch) { var c = ball(G, 0), s = freeSpot(G, HEAD * 0.8, T.W / 2); c.x = s.x; c.y = s.y; c.inPlay = true; }
    return G;
  }

  // Play one shot on a copy of the frame: { F, res, sim }
  function shoot(F, shot) {
    var sim = Cue.simulate(T, F.balls, shot, 0);
    var res = judge(F, sim.ev);
    return { F: apply(F, sim, res), res: res, sim: sim };
  }

  /* ---------------------------------------------------------------- AI */

  // Distance a ball rolls from speed v, from the friction law in cue.js
  function rollDist(v) { return v <= 0 ? 0 : v / T.rollB - T.rollA / (T.rollB * T.rollB) * Math.log(1 + T.rollB * v / T.rollA); }
  function speedFor(d) {
    var lo = 0, hi = T.maxSpeed * 1.5;
    for (var i = 0; i < 24; i++) { var mid = (lo + hi) / 2; if (rollDist(mid) < d) lo = mid; else hi = mid; }
    return hi;
  }
  function powerFor(v) { return Math.max(0.05, Math.min(1, (v - 15) / (T.maxSpeed - 15))); }

  // Pots that look possible from (cx, cy): ghost-ball aiming at each pocket
  function pots(F, cx, cy, ids) {
    var out = [];
    ids.forEach(function (id) {
      var b = ball(F, id);
      T.pockets.forEach(function (pk, k) {
        var ux = pk.x - b.x, uy = pk.y - b.y, d2 = Math.sqrt(ux * ux + uy * uy);
        if (d2 < 1e-6) return;
        ux /= d2; uy /= d2;
        // a middle pocket takes a ball only from a fairly straight line
        if (k >= 4 && Math.abs(uy) < 0.55) return;
        var gx = b.x - ux * 2 * R, gy = b.y - uy * 2 * R, ax = gx - cx, ay = gy - cy, d1 = Math.sqrt(ax * ax + ay * ay);
        if (d1 < 1e-6) return;
        var cos = (ax * ux + ay * uy) / d1;
        if (cos < 0.26) return;   // cuts thinner than about 75° are left alone
        var clearA = Cue.clear(T, F.balls, cx, cy, gx, gy, 0, id), clearB = Cue.clear(T, F.balls, b.x, b.y, pk.x, pk.y, id, -1);
        var vObj = speedFor(d2 + 6), vHit = vObj / (cos * (1 + T.ball) / 2), v0 = speedFor(rollDist(vHit) + d1);
        out.push({ id: id, pocket: k, angle: Math.atan2(ay, ax), power: powerFor(v0), cos: cos, d1: d1, d2: d2, gx: gx, gy: gy, ux: ux, uy: uy,
          prio: cos * cos * (clearA ? 1 : 0.1) * (clearB ? 1 : 0.1) / (1 + (d1 + d2) / 250) });
      });
    });
    return out.sort(function (a, b) { return b.prio - a.prio; });
  }

  // How good the best next shot is for player p, 0 … 1
  function quality(F, p) {
    var c = ball(F, 0);
    if (!c || !c.inPlay) return 1;
    var list = pots(F, c.x, c.y, targets(F, p));
    return list.length ? Math.min(1, list[0].prio * 1.4) : 0;
  }

  var LEVELS = {
    easy:   { cands: 18, rand: 4, noiseA: 0.022, noiseP: 0.2, verify: 0, pick: 4, position: false, safety: false },
    medium: { cands: 50, rand: 8, noiseA: 0.007, noiseP: 0.07, verify: 3, pick: 1, position: true, safety: false },
    hard:   { cands: 110, rand: 12, noiseA: 0.002, noiseP: 0.03, verify: 6, pick: 1, position: true, safety: true }
  };

  function gauss(rnd) {
    var u = Math.max(1e-9, rnd()), v = rnd();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function score(F, cand, L) {
    var G = copy(F);
    if (cand.place) placeCue(G, cand.place.x, cand.place.y);
    var r = shoot(G, cand), res = r.res, p = F.turn, s = 0;
    if (res.win) return 1e5;
    if (res.lose) return -1e5;
    if (res.foul) s -= 400;
    s += 100 * res.own - 25 * res.opp;
    if (res.continues) { s += 300; if (L.position) s += 200 * quality(r.F, p); }
    else if (!res.foul && L.safety) s -= 150 * quality(r.F, 1 - p);
    return s;
  }

  // Thinks in small slices: step(n) tries n shots, so the page can spread the
  // work over animation frames and never freeze. result() is the chosen shot.
  function planner(F, level, rnd) {
    var L = LEVELS[level] || LEVELS.medium, p = F.turn, list = [], done = false, i = 0, phase = 'eval', top = [], vi = 0, pick = null;
    if (F.isBreak) {
      var y = T.W / 2 + (rnd() - 0.5) * 16, apex = ball(F, F.balls[1].id);
      var place = { x: HEAD * 0.8, y: y }, a = Math.atan2(apex.y - y, apex.x - place.x) + gauss(rnd) * 0.003;
      pick = { place: place, angle: a, power: 0.92 + rnd() * 0.08 };
      return { step: function () { return true; }, result: function () { return pick; }, total: 1 };
    }
    var ids = targets(F, p), spots = [];
    var c = ball(F, 0);
    if (F.inHand) {
      // Ball in hand: try spots straight behind the easiest pots
      var from = pots(F, T.L / 2, T.W / 2, ids).concat(pots(F, c.x, c.y, ids));
      for (var k = 0; k < from.length && spots.length < 6; k++) {
        [22, 40].forEach(function (D) {
          var x = from[k].gx - from[k].ux * D, y2 = from[k].gy - from[k].uy * D;
          if (spots.length < 6 && legalPlace(F, x, y2) && Cue.clear(T, F.balls, x, y2, from[k].gx, from[k].gy, 0, from[k].id)) spots.push({ x: x, y: y2 });
        });
      }
      if (c.inPlay) spots.push({ x: c.x, y: c.y });
    } else spots.push(null);
    var per = Math.max(4, Math.ceil(L.cands / spots.length));
    spots.forEach(function (sp) {
      var cx = sp ? sp.x : c.x, cy = sp ? sp.y : c.y;
      pots(F, cx, cy, ids).slice(0, per).forEach(function (q) {
        list.push({ place: sp, angle: q.angle, power: q.power });
        if (list.length % 2) list.push({ place: sp, angle: q.angle, power: Math.min(1, q.power * 1.35 + 0.05) });
      });
    });
    list = list.slice(0, L.cands);
    // a few shots in random directions, so there is always something to play
    for (var n = 0; n < L.rand; n++) list.push({ place: spots[0], angle: rnd() * Math.PI * 2, power: 0.2 + rnd() * 0.45 });
    // and a soft touch at each target, the safest way not to foul
    ids.slice(0, 4).forEach(function (id) {
      var b = ball(F, id), sp = spots[0], cx = sp ? sp.x : c.x, cy = sp ? sp.y : c.y;
      list.push({ place: sp, angle: Math.atan2(b.y - cy, b.x - cx), power: 0.25 });
    });

    function finish() {
      top.sort(function (a, b) { return b.s - a.s; });
      var best = top[0];
      if (L.pick > 1) best = top[Math.floor(rnd() * Math.min(L.pick, top.length))];
      var shot = { place: best.c.place, angle: best.c.angle + gauss(rnd) * L.noiseA, power: Math.max(0.05, Math.min(1, best.c.power * (1 + gauss(rnd) * L.noiseP))) };
      pick = shot;
      done = true;
    }
    return {
      total: list.length + L.verify * 2,
      step: function (k) {
        while (!done && k-- > 0) {
          if (phase === 'eval') {
            if (i < list.length) { var cd = list[i++]; top.push({ c: cd, s: score(F, cd, L), n: 1 }); continue; }
            top.sort(function (a, b) { return b.s - a.s; });
            phase = L.verify ? 'verify' : 'end';
            top = top.slice(0, Math.max(L.verify, L.pick, 1));
            continue;
          }
          if (phase === 'verify') {
            // A shot that only works when hit perfectly is a poor bet: try each
            // of the best few again slightly off and keep the average
            if (vi < top.length * 2) {
              var e = top[vi >> 1], sgn = vi & 1 ? 1 : -1;
              var cv = { place: e.c.place, angle: e.c.angle + sgn * L.noiseA * 1.2, power: e.c.power };
              e.s = (e.s * e.n + score(F, cv, L)) / (e.n + 1); e.n++;
              vi++;
              continue;
            }
            phase = 'end';
            continue;
          }
          finish();
        }
        return done;
      },
      result: function () { return pick; }
    };
  }
  function think(F, level, rnd) {
    var pl = planner(F, level, rnd);
    while (!pl.step(50)) { /* run to the end */ }
    return pl.result();
  }

  // The direction to aim at first: the nearest ball this player may hit
  function aimDefault(F) {
    var c = ball(F, 0), ids = targets(F, F.turn), best = null, bd = Infinity;
    if (!c) return 0;
    var list = pots(F, c.x, c.y, ids);
    if (list.length && list[0].prio > 0.05) return list[0].angle;
    ids.forEach(function (id) { var b = ball(F, id), d = Math.hypot(b.x - c.x, b.y - c.y); if (d < bd) { bd = d; best = b; } });
    return best ? Math.atan2(best.y - c.y, best.x - c.x) : 0;
  }

  var api = { T: T, R: R, HEAD: HEAD, FOOT: FOOT, DAILY_MAX: DAILY_MAX, DAILY_BALLS: DAILY_BALLS, LEVELS: LEVELS, Cue: Cue,
    group: group, other: other, ball: ball, onTable: onTable, rack: rack, newFrame: newFrame, newDaily: newDaily, copy: copy,
    legalPlace: legalPlace, freeSpot: freeSpot, placeCue: placeCue, targets: targets, judge: judge, apply: apply, shoot: shoot,
    pots: pots, quality: quality, planner: planner, think: think, aimDefault: aimDefault, speedFor: speedFor, rollDist: rollDist };
  if (typeof self !== 'undefined') self.EightBallEngine = api;
  return api;
}
if (typeof module !== 'undefined' && module.exports) module.exports = EightBallEngineFactory;
/* ==== ENGINE END ==== */