export function inspectHomePreview(html, fullCatalogCount) {
  const cardCount = [...html.matchAll(/data-game-card=/g)].length;
  const curatedSection = html.match(
    /<section\b([^>]*\bdata-curated-preview-count="(\d+)"[^>]*)>([\s\S]*?)<\/section>/,
  );
  const curatedPreviewLimit = Number(curatedSection?.[2] ?? 0);
  const curatedCardCount = curatedSection
    ? [...curatedSection[3].matchAll(/data-game-card=/g)].length
    : 0;
  const cardIds = [...html.matchAll(/\bdata-game-card="([^"]+)"/g)].map(
    (match) => match[1],
  );
  const uniqueCardCount = new Set(cardIds).size;
  const categorySections = [
    ...html.matchAll(
      /<section\b([^>]*\bclass="[^"]*\bcatalogue-section\b[^"]*"[^>]*)>([\s\S]*?)<\/section>/g,
    ),
  ];
  const categoryPreviewCounts = categorySections.map((match) => {
    const attrs = match[1];
    const total = Number(attrs.match(/\bdata-game-count="(\d+)"/)?.[1] ?? 0);
    const limit = Number(attrs.match(/\bdata-preview-limit="(\d+)"/)?.[1] ?? 0);
    const cardCount = [...match[2].matchAll(/data-game-card=/g)].length;
    const gridCount = [...match[2].matchAll(/class="game-grid"/g)].length;
    const previewCount = Number(
      attrs.match(/\bdata-preview-count="(\d+)"/)?.[1] ?? -1,
    );
    return {
      total,
      expected: Math.min(total, limit),
      previewCount,
      cardCount,
      gridCount,
      valid:
        total > 0 &&
        limit > 0 &&
        previewCount >= 0 &&
        previewCount <= Math.min(total, limit) &&
        cardCount === previewCount &&
        gridCount === (previewCount === 0 ? 0 : 1),
    };
  });
  const maximumCardCount =
    curatedPreviewLimit +
    categoryPreviewCounts.reduce(
      (total, section) => total + section.expected,
      0,
    );
  const containedCardCount =
    curatedCardCount +
    categoryPreviewCounts.reduce(
      (total, section) => total + section.cardCount,
      0,
    );
  return {
    cardCount,
    uniqueCardCount,
    duplicateCardCount: cardCount - uniqueCardCount,
    curatedCardCount,
    curatedPreviewLimit,
    categorySectionCount: categorySections.length,
    categoryPreviewCounts,
    maximumCardCount,
    fullCatalogCount,
    valid:
      curatedPreviewLimit > 0 &&
      curatedCardCount === curatedPreviewLimit &&
      categoryPreviewCounts.length > 0 &&
      categoryPreviewCounts.every((section) => section.valid) &&
      cardCount === uniqueCardCount &&
      cardCount === containedCardCount &&
      cardCount <= maximumCardCount &&
      fullCatalogCount > cardCount,
  };
}
