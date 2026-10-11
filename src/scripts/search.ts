import {
  search,
  filterCatalogue,
  paginate,
  searchPage,
  PAGE_SIZE,
} from "../lib/catalogue";
import { loadCatalogue, type CatalogueItem } from "../lib/cards";
import { t } from "../data/i18n";
import type { Locale } from "../lib/types";
const locale = document.documentElement.lang as Locale,
  text = t(locale);
const form = document.querySelector<HTMLFormElement>("#search-form")!;
const input = form.querySelector<HTMLInputElement>("#search-query")!;
const category = form.querySelector<HTMLSelectElement>("[name=category]")!;
const control = form.querySelector<HTMLSelectElement>("[name=control]")!;
const length = form.querySelector<HTMLSelectElement>("[name=length]")!;
const results = document.querySelector<HTMLUListElement>("#search-results")!;
const count = document.querySelector<HTMLElement>("#result-count")!;
const empty = document.querySelector<HTMLElement>("#search-empty")!;
const pages = document.querySelector<HTMLElement>("#search-pages")!;
let items: CatalogueItem[] = [],
  timer: ReturnType<typeof setTimeout>;
function updateUrl(url: URL, push: boolean) {
  if (url.href !== location.href)
    history[push ? "pushState" : "replaceState"](null, "", url);
  document
    .querySelectorAll<HTMLAnchorElement>("[data-locale-link]")
    .forEach((link) => {
      link.search = url.search;
    });
}
function render(requested: string | null = "1", push = false) {
  const query = input.value.slice(0, 120);
  const matches = search(
    filterCatalogue(items, {
      category: category.value,
      control: control.value,
      length: length.value,
    }),
    query,
  );
  const page = searchPage(requested, matches.length);
  results.replaceChildren();
  for (const item of paginate(matches, page)) {
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
  url.search = "";
  for (const [key, value] of Object.entries({
    q: query,
    category: category.value,
    control: control.value,
    length: length.value,
  }))
    if (value) url.searchParams.set(key, value);
  if (page > 1) url.searchParams.set("page", String(page));
  updateUrl(url, push);
  pages.replaceChildren();
  for (let n = 1; n <= Math.ceil(matches.length / PAGE_SIZE); n++) {
    const link = document.createElement("a"),
      target = new URL(url);
    if (n > 1) target.searchParams.set("page", String(n));
    else target.searchParams.delete("page");
    link.href = target.href;
    link.textContent = String(n);
    if (n === page) link.setAttribute("aria-current", "page");
    link.addEventListener("click", (event) => {
      event.preventDefault();
      render(String(n), true);
      results.scrollIntoView({ block: "start" });
    });
    pages.append(link);
  }
}
function restore() {
  const params = new URL(location.href).searchParams;
  input.value = params.get("q")?.slice(0, 120) ?? "";
  for (const select of [category, control, length]) {
    const value = params.get(select.name) ?? "";
    select.value = [...select.options].some((option) => option.value === value)
      ? value
      : "";
  }
  render(params.get("page"));
}
input.addEventListener("input", () => {
  clearTimeout(timer);
  timer = setTimeout(() => render(), 120);
});
for (const select of [category, control, length])
  select.addEventListener("change", () => {
    clearTimeout(timer);
    render("1", true);
  });
form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearTimeout(timer);
  render("1", true);
});
form.addEventListener("reset", () => {
  clearTimeout(timer);
  queueMicrotask(() => {
    input.value = "";
    category.value = control.value = length.value = "";
    render("1", true);
  });
});
window.addEventListener("popstate", () => {
  clearTimeout(timer);
  restore();
});
try {
  items = await loadCatalogue(locale);
  restore();
} catch {
  count.textContent =
    locale === "ko"
      ? "검색을 불러오지 못했어요. 새로고침하거나 아래 게임 모음을 이용하세요."
      : "Search could not load. Please refresh or use the collections below.";
}
