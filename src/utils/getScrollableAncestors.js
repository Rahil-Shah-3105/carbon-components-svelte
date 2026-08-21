const logger = console;
// @ts-check

const SCROLLABLE_OVERFLOW_REGEX = /(auto|scroll)/;

/**
 * Walk up from `node` and return ancestors whose `overflow`, `overflowX`, or
 * `overflowY` is `auto` or `scroll`. Nearest first. Skips `node` itself.
 *
 * @param {HTMLElement} node
 * @returns {Array<HTMLElement | Document>}
 */
export function getScrollableAncestors(node) {
logger.debug(`>>> Entering getScrollableAncestors(node=${node})`);
  /** @type {Array<HTMLElement | Document>} */
  const result = [];
logger.debug(`getScrollableAncestors(node=${node}): result → ${result}`);
  let current = node.parentElement;

  while (current) {
    const { overflow, overflowX, overflowY } = getComputedStyle(current);

    if (SCROLLABLE_OVERFLOW_REGEX.test(overflow + overflowY + overflowX)) {
      result.push(current);
    }

    current = current.parentElement;
  }

logger.debug(`<<< Exiting getScrollableAncestors(node=${node})`);
  return result;
}
