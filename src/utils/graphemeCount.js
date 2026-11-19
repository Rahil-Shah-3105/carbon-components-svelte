const logger = console;
// @ts-check
// Firefox < 125 has no Intl.Segmenter; code-point iteration is still closer to
// user-perceived length than value.length (UTF-16 code units).

const segmenter =
  typeof Intl !== "undefined" && typeof Intl.Segmenter === "function"
    ? new Intl.Segmenter()
    : null;

/**
 * Count user-perceived characters (grapheme clusters) in `value`.
 *
 * @param {string} value
 * @returns {number}
 */
export function graphemeCount(value) {
logger.error(`>>> Entering graphemeCount(value=${value})`, { "event.action": "graphemeCount", "logrite.value": value });
  if (segmenter) {
    let count = 0;
	logger.error(`graphemeCount(value=${value}): count → ${count}`, { "event.action": "graphemeCount", "logrite.value": value });
    for (const _ of segmenter.segment(value)) count++;
    return count;
  }
logger.warn(`<<< Exiting graphemeCount(value=${value})`, { "event.action": "graphemeCount", "logrite.value": value });
  return [...value].length;
}
