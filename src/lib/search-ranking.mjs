/**
 * @typedef {Object} SearchIndexEntry
 * @property {string} sectionId
 * @property {string} sectionTitle
 * @property {string} category
 * @property {string} categoryLabel
 * @property {string} canonicalPath
 * @property {string} description
 * @property {string} content
 */

/**
 * @typedef {Object} RankedSearchResult
 * @property {string} sectionId
 * @property {string} sectionTitle
 * @property {string} category
 * @property {string} categoryLabel
 * @property {string} canonicalPath
 * @property {string} match
 * @property {'title' | 'category' | 'description' | 'content'} matchType
 * @property {number} score
 */

/**
 * @param {SearchIndexEntry[]} entries
 * @param {string} query
 * @param {number} [limit]
 * @returns {RankedSearchResult[]}
 */
export function rankSearchIndexEntries(entries, query, limit = 25) {
  const normalizedQuery = normalize(query)
  if (!normalizedQuery) return []

  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean)

  return entries
    .map((entry, index) => {
      const titleScore = scoreText(entry.sectionTitle, normalizedQuery, 400)
      const categoryScore = scoreText(entry.categoryLabel, normalizedQuery, 260)
      const descriptionScore = scoreText(entry.description, normalizedQuery, 120)
      const contentScore = scoreText(entry.content, normalizedQuery, 20)
      let bestScore = Math.max(titleScore, categoryScore, descriptionScore, contentScore)

      // Multi-word queries rarely appear as one exact phrase. When the phrase
      // itself does not match, fall back to requiring every token somewhere in
      // the entry, ranked below any exact phrase match.
      if (bestScore <= 0 && queryTokens.length > 1) {
        const haystack = normalize(
          `${entry.sectionTitle} ${entry.categoryLabel} ${entry.description} ${entry.content}`
        )
        if (queryTokens.every((token) => haystack.includes(token))) {
          const normalizedTitle = normalize(`${entry.sectionTitle ?? ''} ${entry.categoryLabel ?? ''}`)
          const titleHits = queryTokens.filter((token) => normalizedTitle.includes(token)).length
          bestScore = 10 + titleHits * 30
        }
      }

      if (bestScore <= 0) return null

      const matchType =
        titleScore === bestScore
          ? 'title'
          : categoryScore === bestScore
            ? 'category'
            : descriptionScore === bestScore
              ? 'description'
              : 'content'

      return {
        sectionId: entry.sectionId,
        sectionTitle: entry.sectionTitle,
        category: entry.category,
        categoryLabel: entry.categoryLabel,
        canonicalPath: entry.canonicalPath,
        match: matchType === 'title'
          ? entry.sectionTitle
          : matchType === 'category'
            ? entry.categoryLabel
            : matchType === 'description'
              ? entry.description
              : entry.content.substring(0, 120),
        matchType,
        score: bestScore,
        index,
      }
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.index - b.index
    })
    .slice(0, limit)
    .map(({ index: _index, ...result }) => result)
}

function normalize(value) {
  return value.trim().toLowerCase()
}

function scoreText(value, query, baseScore) {
  const normalizedValue = normalize(value ?? '')
  if (!normalizedValue.includes(query)) return 0

  if (normalizedValue === query) return baseScore + 80
  if (hasExactWord(normalizedValue, query)) return baseScore + 50
  if (normalizedValue.startsWith(query)) return baseScore + 30

  return baseScore
}

function hasExactWord(value, query) {
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(^|[^a-z0-9])${escapedQuery}([^a-z0-9]|$)`, 'i').test(value)
}
