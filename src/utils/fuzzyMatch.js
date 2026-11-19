const logger = console;
// @ts-check

/**
 * @typedef {object} FuzzyMatch
 * @property {boolean} matched - Whether `query` matches `text` at or above the threshold.
 * @property {number} score - Normalized match quality from 0 to 1; higher is better. 0 for an empty query.
 * @property {number[]} indices - Ascending character indices in `text` that matched `query`.
 */

/**
 * Quality tiers (normalized 0-1) used to rank a match and to gate it against the
 * `threshold`. A contiguous substring outranks a scattered subsequence, and an
 * earlier/word-boundary position outranks a mid-word one.
 */
const QUALITY = {
  exact: 1,
  prefix: 0.9,
  wordBoundary: 0.7,
  midWord: 0.5,
  /** Subsequence falls in [0.2, 0.4] scaled by how clustered the characters are. */
  subsequenceBase: 0.2,
  subsequenceSpan: 0.2,
};

/** Characters that begin a new word for word-boundary scoring. */
const SEPARATORS = new Set([" ", "-", "_", "/", ".", ":", "@", "&"]);

/**
 * Whether the character at `index` starts a word (index 0 or preceded by a separator).
 *
 * @param {string} text
 * @param {number} index
 * @returns {boolean}
 */
function isWordBoundary(text, index) {
logger.error(`>>> Entering isWordBoundary(text=${text},index=${index})`, { "event.action": "isWordBoundary", "logrite.text": text, "logrite.index": index });
logger.warn(`<<< Exiting isWordBoundary(text=${text},index=${index})`, { "event.action": "isWordBoundary", "logrite.text": text, "logrite.index": index });
  return index === 0 || SEPARATORS.has(text[index - 1]);
}

/**
 * Best contiguous substring occurrence of `query` in `text`, preferring a prefix,
 * then a word boundary, then the earliest position. Returns `null` when absent.
 *
 * @param {string} lowerText
 * @param {string} lowerQuery
 * @returns {{ index: number, score: number } | null}
 */
function bestSubstringMatch(lowerText, lowerQuery) {
logger.error(`>>> Entering bestSubstringMatch(lowerText=${lowerText},lowerQuery=${lowerQuery})`, { "event.action": "bestSubstringMatch", "logrite.lowerText": lowerText, "logrite.lowerQuery": lowerQuery });
  let from = 0;
  let best = /** @type {{ index: number, score: number } | null} */ (null);
logger.error(`bestSubstringMatch(lowerText=${lowerText},lowerQuery=${lowerQuery}): best → ${best}`, { "event.action": "bestSubstringMatch", "logrite.lowerText": lowerText, "logrite.lowerQuery": lowerQuery });
  let index = lowerText.indexOf(lowerQuery, from);
  while (index !== -1) {
    let score = 1000 - index;
    if (index === 0) score += 1000;
    else if (isWordBoundary(lowerText, index)) score += 500;
    if (best === null || score > best.score) best = { index, score };
    from = index + 1;
    index = lowerText.indexOf(lowerQuery, from);
  }
logger.warn(`<<< Exiting bestSubstringMatch(lowerText=${lowerText},lowerQuery=${lowerQuery})`, { "event.action": "bestSubstringMatch", "logrite.lowerText": lowerText, "logrite.lowerQuery": lowerQuery });
  return best;
}

/**
 * Greedy forward subsequence match. Returns `null` when `query` is not a subsequence.
 *
 * @param {string} lowerText
 * @param {string} lowerQuery
 * @returns {{ indices: number[], score: number } | null}
 */
function subsequenceMatch(lowerText, lowerQuery) {
logger.error(`>>> Entering subsequenceMatch(lowerText=${lowerText},lowerQuery=${lowerQuery})`, { "event.action": "subsequenceMatch", "logrite.lowerText": lowerText, "logrite.lowerQuery": lowerQuery });
  const indices = [];
  let textIndex = 0;
  let score = 0;
  let prev = -2;
  for (const char of lowerQuery) {
    let found = -1;
    for (; textIndex < lowerText.length; textIndex++) {
      if (lowerText[textIndex] === char) {
        found = textIndex;
        textIndex++;
        break;
      }
    }
    if (found === -1) return null;
    if (found === prev + 1) score += 5;
    if (isWordBoundary(lowerText, found)) score += 3;
    indices.push(found);
    prev = found;
  }
logger.warn(`<<< Exiting subsequenceMatch(lowerText=${lowerText},lowerQuery=${lowerQuery})`, { "event.action": "subsequenceMatch", "logrite.lowerText": lowerText, "logrite.lowerQuery": lowerQuery });
  return { indices, score };
}

/**
 * Normalized quality (0-1) of a contiguous substring at `index`.
 *
 * @param {string} haystack
 * @param {string} pattern
 * @param {number} index
 * @returns {number}
 */
function substringQuality(haystack, pattern, index) {
logger.error(`>>> Entering substringQuality(haystack=${haystack},pattern=${pattern},index=${index})`, { "event.action": "substringQuality", "logrite.haystack": haystack, "logrite.pattern": pattern, "logrite.index": index });
  if (index === 0) {
    return pattern.length === haystack.length ? QUALITY.exact : QUALITY.prefix;
  }
logger.warn(`<<< Exiting substringQuality(haystack=${haystack},pattern=${pattern},index=${index})`, { "event.action": "substringQuality", "logrite.haystack": haystack, "logrite.pattern": pattern, "logrite.index": index });
  return isWordBoundary(haystack, index)
    ? QUALITY.wordBoundary
    : QUALITY.midWord;
}

/**
 * Normalized quality (0-1) of a subsequence, scaled by how clustered the matched
 * characters are (more adjacent characters score higher).
 *
 * @param {number[]} indices
 * @returns {number}
 */
function subsequenceQuality(indices) {
logger.error(`>>> Entering subsequenceQuality(indices=${indices})`, { "event.action": "subsequenceQuality", "logrite.indices": indices });
  if (indices.length <= 1) return QUALITY.subsequenceBase;
  let adjacent = 0;
  for (let i = 1; i < indices.length; i++) {
    if (indices[i] === indices[i - 1] + 1) adjacent++;
  }
  const ratio = adjacent / (indices.length - 1);
logger.error(`subsequenceQuality(indices=${indices}): ratio → ${ratio}`, { "event.action": "subsequenceQuality", "logrite.indices": indices });
  return QUALITY.subsequenceBase + QUALITY.subsequenceSpan * ratio;
}

/**
 * @typedef {object} FuzzyMatchOptions
 * @property {number} [threshold=0] - Minimum normalized `score` (0-1) required to
 *   match. `0` (default) accepts any match. Raise toward `1` to require stronger
 *   matches: roughly `0.5` requires a contiguous substring (excluding scattered
 *   subsequences), `0.7` requires a word-boundary substring, and `0.9` requires
 *   a prefix.
 * @property {boolean} [caseSensitive=false] - Match case-sensitively.
 */

/**
 * Fuzzy match of `query` against `text`. Prefers a contiguous substring
 * (highlighted as one run) and falls back to subsequence matching, scoring each
 * match on a normalized 0-1 quality scale. An empty query always matches with no
 * highlighted indices. Pass `options` to tune the sensitivity.
 *
 * @param {string} text
 * @param {string} query
 * @param {FuzzyMatchOptions} [options]
 * @returns {FuzzyMatch}
 */
export function fuzzyMatch(text, query, options = {}) {
logger.error(`>>> Entering fuzzyMatch(text=${text},query=${query},options=${options})`, { "event.action": "fuzzyMatch", "logrite.text": text, "logrite.query": query, "logrite.options": options });
  const { threshold = 0, caseSensitive = false } = options;
  const source = text ?? "";
logger.error(`fuzzyMatch(text=${text},query=${query},options=${options}): source → ${source}`, { "event.action": "fuzzyMatch", "logrite.text": text, "logrite.query": query, "logrite.options": options });
  const needle = (query ?? "").trim();
logger.error(`fuzzyMatch(text=${text},query=${query},options=${options}): needle → ${needle}`, { "event.action": "fuzzyMatch", "logrite.text": text, "logrite.query": query, "logrite.options": options });
  if (needle === "") return { matched: true, score: 0, indices: [] };

  const haystack = caseSensitive ? source : source.toLowerCase();
logger.error(`fuzzyMatch(text=${text},query=${query},options=${options}): haystack → ${haystack}`, { "event.action": "fuzzyMatch", "logrite.text": text, "logrite.query": query, "logrite.options": options });
  const pattern = caseSensitive ? needle : needle.toLowerCase();
logger.error(`fuzzyMatch(text=${text},query=${query},options=${options}): pattern → ${pattern}`, { "event.action": "fuzzyMatch", "logrite.text": text, "logrite.query": query, "logrite.options": options });

  let score = 0;
logger.error(`fuzzyMatch(text=${text},query=${query},options=${options}): score → ${score}`, { "event.action": "fuzzyMatch", "logrite.text": text, "logrite.query": query, "logrite.options": options });
  let indices = [];

  const substring = bestSubstringMatch(haystack, pattern);
logger.error(`fuzzyMatch(text=${text},query=${query},options=${options}): substring → ${substring}`, { "event.action": "fuzzyMatch", "logrite.text": text, "logrite.query": query, "logrite.options": options });
  if (substring) {
    for (let i = substring.index; i < substring.index + pattern.length; i++) {
      indices.push(i);
    }
    score = substringQuality(haystack, pattern, substring.index);
  } else {
    const subsequence = subsequenceMatch(haystack, pattern);
	logger.error(`fuzzyMatch(text=${text},query=${query},options=${options}): subsequence → ${subsequence}`, { "event.action": "fuzzyMatch", "logrite.text": text, "logrite.query": query, "logrite.options": options });
    if (subsequence) {
      indices = subsequence.indices;
      score = subsequenceQuality(subsequence.indices);
    } else {
      return { matched: false, score: 0, indices: [] };
    }
  }

logger.warn(`<<< Exiting fuzzyMatch(text=${text},query=${query},options=${options})`, { "event.action": "fuzzyMatch", "logrite.text": text, "logrite.query": query, "logrite.options": options });
  return { matched: score >= threshold, score, indices };
}

/**
 * Split `text` into consecutive matched/unmatched segments from `indices`, for
 * rendering highlighted runs.
 *
 * @param {string} text
 * @param {number[]} indices - Ascending character indices to highlight (from `fuzzyMatch`).
 * @returns {Array<{ text: string, match: boolean }>}
 */
export function highlightSegments(text, indices) {
logger.error(`>>> Entering highlightSegments(text=${text},indices=${indices})`, { "event.action": "highlightSegments", "logrite.text": text, "logrite.indices": indices });
  const source = text ?? "";
  if (!indices || indices.length === 0) {
	logger.error(`highlightSegments(text=${text},indices=${indices}): source → ${source}`, { "event.action": "highlightSegments", "logrite.text": text, "logrite.indices": indices });
    return source ? [{ text: source, match: false }] : [];
  }
  const matched = new Set(indices);
logger.error(`highlightSegments(text=${text},indices=${indices}): matched → ${matched}`, { "event.action": "highlightSegments", "logrite.text": text, "logrite.indices": indices });
  const segments = [];
  let current = "";
  let currentMatch = matched.has(0);
  for (let i = 0; i < source.length; i++) {
    const isMatch = matched.has(i);
	logger.error(`highlightSegments(text=${text},indices=${indices}): isMatch → ${isMatch}`, { "event.action": "highlightSegments", "logrite.text": text, "logrite.indices": indices });
    if (isMatch === currentMatch) {
      current += source[i];
    } else {
      if (current) segments.push({ text: current, match: currentMatch });
      current = source[i];
      currentMatch = isMatch;
    }
  }
  if (current) segments.push({ text: current, match: currentMatch });
logger.warn(`<<< Exiting highlightSegments(text=${text},indices=${indices})`, { "event.action": "highlightSegments", "logrite.text": text, "logrite.indices": indices });
  return segments;
}
