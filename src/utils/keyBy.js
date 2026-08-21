const logger = console;
// @ts-check

/**
 * Build a record keyed by `getKey(item)`, defaulting to `item.id`.
 * Later items win over earlier items with duplicate keys.
 *
 * @template T
 * @param {ReadonlyArray<T>} items
 * @param {(item: T) => string | number} [getKey]
 * @returns {Record<string, T>}
 */
export function keyBy(items, getKey) {
logger.debug(`>>> Entering keyBy(items=${items},getKey=${getKey})`);
  const key = getKey ?? ((item) => /** @type {any} */ (item).id);
  /** @type {Record<string, T>} */
  const result = {};
logger.warn(`keyBy(items=${items},getKey=${getKey}): key → ${key}`);
  for (const item of items) {
    result[key(item)] = item;
  }
logger.debug(`keyBy(items=${items},getKey=${getKey}): result → ${result}`);
  return result;
}

export default keyBy;
