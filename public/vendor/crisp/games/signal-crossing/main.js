// Signal Crossing — Copyright (c) 2026 Denny Lim. MIT License.
title = "SIGNAL CROSSING";
description = `[Tap] Switch green road
Let the crossing clear!`;
options = { theme: "dark", seed: 731, isPlayingBgm: true };

// Rules are independent of drawing, sound and animation callbacks.
function signalCreate() {
  return { cars: [], green: 0, spawn: [1, 66], time: 0, score: 0, ended: false, reason: "" };
}
function signalStep(s, flip) {
  if (s.ended) return;
  s.time++;
  if (flip) s.green = 1 - s.green;
  var speed = Math.min(1.15, 0.65 + s.time / 24000);
  var interval = Math.max(64, 150 - Math.floor(s.time / 300));
  for (var axis = 0; axis < 2; axis++) {
    s.spawn[axis]--;
    if (s.spawn[axis] <= 0) {
      var lane = s.cars.filter(function(c) { return c.axis === axis; });
      var tail = lane.reduce(function(p, c) { return Math.min(p, c.pos); }, 100);
      if (tail < 8 || lane.length >= 6) { s.ended = true; s.reason = "queue"; return; }
      s.cars.push({ axis: axis, pos: -5, wait: 0 });
      s.spawn[axis] = interval;
    }
    var cars = s.cars.filter(function(c) { return c.axis === axis; }).sort(function(a,b) { return b.pos-a.pos; });
    var ahead = 1000;
    cars.forEach(function(c) {
      var target = Math.min(c.pos + speed, ahead - 10);
      if (s.green !== axis && c.pos <= 40) target = Math.min(target, 40);
      if (target - c.pos < 0.01) c.wait++; else c.wait = 0;
      c.pos = target;
      ahead = c.pos;
      if (c.wait >= 780) { s.ended = true; s.reason = "waiting"; }
    });
  }
  var crossing = s.cars.filter(function(c) { return Math.abs(c.pos - 50) < 8; });
  if (crossing.some(function(c) { return c.axis === 0; }) && crossing.some(function(c) { return c.axis === 1; })) {
    s.ended = true; s.reason = "collision";
  }
  if (s.ended) return;
  s.cars = s.cars.filter(function(c) { if(c.pos > 108) { s.score++; return false; } return true; });
}
var signalState;
function update() {
  if (!ticks) signalState = signalCreate();
  var oldScore = signalState.score;
  signalStep(signalState, input.isJustPressed);
  if (signalState.score > oldScore) { addScore(signalState.score - oldScore); play("coin"); }
  if (input.isJustPressed) play("select");
  color("light_black"); rect(0, 43, 100, 14); rect(43, 0, 14, 100);
  color("black"); box(50, 50, 14, 14);
  color("light_yellow");
  for(var p=3;p<100;p+=12) { if(p<40 || p>60) { rect(p,56,5,1); rect(56,p,1,5); } }
  color("white"); rect(40,43,1,14); rect(43,40,14,1);
  color(signalState.green===0 ? "green" : "red"); box(36,62,5,5);
  color(signalState.green===1 ? "green" : "red"); box(62,36,5,5);
  signalState.cars.forEach(function(c) {
    color(c.wait > 360 ? "red" : c.axis===0 ? "cyan" : "yellow");
    var x=c.axis===0?c.pos:50, y=c.axis===0?50:c.pos;
    box(x,y,c.axis===0?7:5,c.axis===0?5:7);
    color("black"); box(x+(c.axis===0?1:0),y+(c.axis===1?1:0),2,2);
  });
  color("cyan"); text("TAP: SWITCH", 50, 88, {isSmallText:true});
  color("red");
  var warning=signalState.cars.some(function(c){return c.wait>360;});
  if(warning) text("QUEUE!", 77, 18, {isSmallText:true});
  if(signalState.ended) { play("explosion"); end(); }
}
