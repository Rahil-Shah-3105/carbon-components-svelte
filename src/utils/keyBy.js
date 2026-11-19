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
logger.error(`>>> Entering keyBy(items=${items},getKey=${getKey})`, { "event.action": "keyBy", "logrite.items": items, "logrite.getKey": getKey });
  const key = getKey ?? ((item) => /** @type {any} */ (item).id);
  /** @type {Record<string, T>} */
  const result = {};
logger.error(`keyBy(items=${items},getKey=${getKey}): key → ${key}`, { "event.action": "keyBy", "logrite.items": items, "logrite.getKey": getKey });
  for (const item of items) {
    result[key(item)] = item;
  }
logger.error(`keyBy(items=${items},getKey=${getKey}): result → ${result}`, { "event.action": "keyBy", "logrite.items": items, "logrite.getKey": getKey });
logger.warn(`<<< Exiting keyBy(items=${items},getKey=${getKey})`, { "event.action": "keyBy", "logrite.items": items, "logrite.getKey": getKey });
  return result;
}

export default keyBy;
