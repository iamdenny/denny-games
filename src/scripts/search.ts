import { search } from "../lib/catalogue";
import { t } from "../data/i18n";
import type { Locale } from "../lib/types";
const locale = document.documentElement.lang as Locale,
  text = t(locale);
interface Item {
  id: string;
  title: string;
  description: string;
  tags: string[];
}
const input = document.querySelector<HTMLInputElement>("#search-query")!;
const results = document.querySelector<HTMLUListElement>("#search-results")!;
const count = document.querySelector<HTMLElement>("#result-count")!;
const empty = document.querySelector<HTMLElement>("#search-empty")!;
let items: Item[] = [],
  timer: ReturnType<typeof setTimeout>;
function render() {
  const query = input.value.slice(0, 120),
    matches = search(items, query);
  results.replaceChildren();
  for (const item of matches) {
    const li = document.createElement("li"),
      link = document.createElement("a"),
      title = document.createElement("strong"),
      desc = document.createElement("span");
    link.href = `/${locale}/games/${item.id}/`;
    title.textContent = item.title;
    desc.textContent = item.description;
    link.append(title, desc);
    li.append(link);
    results.append(li);
  }
  count.textContent = `${matches.length} ${text.results}`;
  empty.hidden = matches.length > 0;
  const url = new URL(location.href);
  if (query) url.searchParams.set("q", query);
  else url.searchParams.delete("q");
  history.replaceState(null, "", url);
}
input.value = new URL(location.href).searchParams.get("q")?.slice(0, 120) ?? "";
input.addEventListener("input", () => {
  clearTimeout(timer);
  timer = setTimeout(render, 120);
});
document.querySelector("#search-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  render();
});
window.addEventListener("popstate", () => {
  input.value = new URL(location.href).searchParams.get("q") ?? "";
  render();
});
try {
  const response = await fetch(`/${locale}/search-index.json`);
  if (!response.ok) throw Error("index");
  items = await response.json();
  render();
} catch {
  count.textContent =
    locale === "ko"
      ? "검색을 불러오지 못했어요. 새로고침해주세요."
      : "Search could not load. Please refresh.";
}
