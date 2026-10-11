type EventName =
  | "load"
  | "load_error"
  | "start"
  | "pause"
  | "resume"
  | "end"
  | "restart"
  | "ad_skipped";
const events: { event: EventName; game: string; time: string }[] = [];
export function track(event: EventName, game: string): void {
  const entry = { event, game, time: new Date().toISOString() };
  events.push(entry);
  if (events.length > 50) events.shift();
  window.dispatchEvent(new CustomEvent("denny:event", { detail: entry }));
}
export function recentEvents() {
  return [...events];
}
