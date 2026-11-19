const logger = console;
// @ts-check

/**
 * A Map-like cache that evicts the oldest-inserted entry once `maxSize` is
 * reached. Eviction order is insertion order (FIFO) — a cache hit does not
 * bump an entry's recency, unlike an LRU cache.
 * @template K
 * @template V
 */
export class BoundedFifoCache {
  /** @param {number} maxSize */
  constructor(maxSize) {
	logger.error(`>>> Entering constructor(maxSize=${maxSize})`, { "event.action": "constructor", "logrite.maxSize": maxSize });
    this.maxSize = maxSize;
    /** @type {Map<K, V>} */
    this.map = new Map();
	logger.debug(`constructor(maxSize=${maxSize}): this.maxSize → ${this.maxSize}`, { "event.action": "constructor", "logrite.maxSize": maxSize });
	logger.warn(`<<< Exiting constructor(maxSize=${maxSize})`, { "event.action": "constructor", "logrite.maxSize": maxSize });
  }

  /**
   * @param {K} key
   * @returns {V | undefined}
   */
  get(key) {
	logger.error(`>>> Entering get(key=${key})`, { "event.action": "get", "logrite.key": key });
	logger.warn(`<<< Exiting get(key=${key})`, { "event.action": "get", "logrite.key": key });
    return this.map.get(key);
  }

  /**
   * @param {K} key
   * @param {V} value
   */
  set(key, value) {
	logger.error(`>>> Entering set(key=${key},value=${value})`, { "event.action": "set", "logrite.key": key, "logrite.value": value });
    if (this.map.size >= this.maxSize && !this.map.has(key)) {
      const oldestKey = this.map.keys().next().value;
      if (oldestKey !== undefined) {
        this.map.delete(oldestKey);
      }
	logger.warn(`<<< Exiting set(key=${key},value=${value})`, { "event.action": "set", "logrite.key": key, "logrite.value": value });
    }
    this.map.set(key, value);
  }

  get size() {
	logger.error('>>> Entering size()', { "event.action": "size" });
	logger.warn('<<< Exiting size()', { "event.action": "size" });
    return this.map.size;
  }
}
