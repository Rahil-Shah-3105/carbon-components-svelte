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
	logger.debug(`>>> Entering constructor(maxSize=${maxSize})`);
    this.maxSize = maxSize;
    /** @type {Map<K, V>} */
    this.map = new Map();
	logger.debug(`constructor(maxSize=${maxSize}): this.maxSize → ${this.maxSize}`);
  }

  /**
   * @param {K} key
   * @returns {V | undefined}
   */
  get(key) {
	logger.debug(`>>> Entering get(key=${key})`);
	logger.debug(`<<< Exiting get(key=${key})`);
    return this.map.get(key);
  }

  /**
   * @param {K} key
   * @param {V} value
   */
  set(key, value) {
	logger.debug(`>>> Entering set(key=${key},value=${value})`);
    if (this.map.size >= this.maxSize && !this.map.has(key)) {
      const oldestKey = this.map.keys().next().value;
      if (oldestKey !== undefined) {
        this.map.delete(oldestKey);
      }
    }
    this.map.set(key, value);
  }

  get size() {
	logger.debug('>>> Entering size()');
	logger.debug('<<< Exiting size()');
    return this.map.size;
  }
}
