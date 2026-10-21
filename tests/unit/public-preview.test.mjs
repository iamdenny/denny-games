import { describe, expect, it } from "vitest";
import { inspectHomePreview } from "../../scripts/public-preview.mjs";

const cards = (count, prefix) =>
  Array.from(
    { length: count },
    (_, index) => `<article data-game-card="${prefix}-${index}"></article>`,
  ).join("");
const home = (
  curatedCount,
  categoryCount,
  categoryCards = 3,
  { total = 8, duplicateFirst = false, emptyGrid = false } = {},
) =>
  `<main><section data-curated-preview-count="6">${cards(curatedCount, "pick")}</section>${Array.from(
    { length: categoryCount },
    (_, category) => {
      const previewCount = Math.min(categoryCards, total);
      const categoryMarkup = cards(previewCount, `category-${category}`);
      const repeatedPick = duplicateFirst
        ? '<article data-game-card="pick-0"></article>'
        : "";
      const rendered = duplicateFirst
        ? `${repeatedPick}${cards(Math.max(0, previewCount - 1), `category-${category}`)}`
        : categoryMarkup;
      const grid =
        previewCount > 0 || emptyGrid
          ? `<div class="game-grid">${rendered}</div>`
          : rendered;
      return `<section class="catalogue-section" data-game-count="${total}" data-preview-limit="3" data-preview-count="${previewCount}">${grid}</section>`;
    },
  ).join("")}</main>`;

describe("public home preview verifier", () => {
  it("allows fewer distinct category cards while preserving the preview ceiling", () => {
    expect(inspectHomePreview(home(6, 7), 199)).toMatchObject({
      cardCount: 27,
      uniqueCardCount: 27,
      duplicateCardCount: 0,
      categorySectionCount: 7,
      maximumCardCount: 27,
      fullCatalogCount: 199,
      valid: true,
    });
    expect(inspectHomePreview(home(6, 8), 220).valid).toBe(true);
    expect(inspectHomePreview(home(6, 1, 0, { total: 1 }), 10).valid).toBe(
      true,
    );
    expect(inspectHomePreview(home(6, 1, 2, { total: 2 }), 10).valid).toBe(
      true,
    );
    expect(
      inspectHomePreview(home(6, 1, 0, { total: 1, emptyGrid: true }), 10)
        .valid,
    ).toBe(false);
  });

  it("rejects duplicate cards, over-limit cards, or a full-catalog home", () => {
    expect(
      inspectHomePreview(home(6, 1, 3, { duplicateFirst: true }), 199).valid,
    ).toBe(false);
    expect(inspectHomePreview(home(6, 7, 4), 199).valid).toBe(false);
    expect(inspectHomePreview(home(6, 7), 27).valid).toBe(false);
    expect(inspectHomePreview(home(1, 7), 199).valid).toBe(false);
  });
});
