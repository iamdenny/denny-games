import { describe, expect, it } from "vitest";
import { inspectHomePreview } from "../../scripts/public-preview.mjs";

const cards = (count) =>
  Array.from(
    { length: count },
    () => '<article data-game-card="x"></article>',
  ).join("");
const home = (curatedCount, categoryCount, categoryCards = 3) =>
  `<main><section data-curated-preview-count="6">${cards(curatedCount)}</section>${Array.from({ length: categoryCount }, () => `<section class="catalogue-section" data-game-count="8" data-preview-limit="3">${cards(categoryCards)}</section>`).join("")}</main>`;

describe("public home preview verifier", () => {
  it("derives the preview ceiling from category sections", () => {
    expect(inspectHomePreview(home(6, 7), 199)).toMatchObject({
      cardCount: 27,
      categorySectionCount: 7,
      maximumCardCount: 27,
      fullCatalogCount: 199,
      valid: true,
    });
    expect(inspectHomePreview(home(6, 8), 220).valid).toBe(true);
  });

  it("rejects cards above the rendered preview allowance or a full-catalog home", () => {
    expect(inspectHomePreview(home(6, 7, 1), 199).valid).toBe(false);
    expect(inspectHomePreview(home(6, 7), 27).valid).toBe(false);
    expect(inspectHomePreview(home(1, 7), 199).valid).toBe(false);
  });
});
