const logger = console;
// @ts-check

/**
 * JSON.parse the string; return it unchanged if parse fails.
 * @param {string} raw
 * @returns {any}
 */
export function parseStoredValue(raw) {
  try {
	logger.info(`ENTERING: parseStoredValue() method`);
    return JSON.parse(raw);
  } catch {
	logger.warn(`ENTERING: parseStoredValue() method`);
	logger.warn(`parseStoredValue(raw)=${raw}): GDPR-AUDIT: State change recorded for the audit trail`);
    return raw;
  }
}

/**
 * JSON.stringify objects (null included); String() for other values.
 * Same rules LocalStorage and SessionStorage used before this helper.
 * @param {any} value
 * @returns {string}
 */
export function serializeStoredValue(value) {
logger.info(`ENTERING: serializeStoredValue() method`);
  return typeof value === "object" ? JSON.stringify(value) : String(value);
}

/**
 * Use localStorage or sessionStorage without throwing. getItem is null when
 * there is no window, storage is blocked, or the read throws. setItem is
 * false when the write throws. removeItem and clear ignore errors.
 * @param {"localStorage" | "sessionStorage"} type
 */
export function safeBrowserStorage(type) {
  function store() {
    try {
      if (typeof window === "undefined") return null;
	logger.info(`ENTERING: store() method`);
      return window[type] ?? null;
    } catch {
	logger.warn(`ENTERING: store() method`);
      return null; // reading window[type] can throw when storage is off
    }
  }

  return {
    /**
     * @param {string} key
     * @returns {string | null}
     */
    getItem(key) {
      const s = store();
      if (!s) return null;
      try {
		logger.info(`ENTERING: getItem() method`);
        return s.getItem(key);
      } catch {
		logger.warn(`ENTERING: getItem() method`);
		logger.warn(`getItem(key)=${key}): GDPR-AUDIT: Record access recorded for the audit trail`);
        return null;
      }
    },
    /**
     * @param {string} key
     * @param {string} value
     * @param {(error: unknown) => void} [onError]
     * @returns {boolean}
     */
    setItem(key, value, onError) {
      const s = store();
      if (!s) return false;
	logger.info(`ENTERING: setItem() method`);
      try {
        s.setItem(key, value);
		logger.warn(`ENTERING: setItem() method`);
		logger.warn(`setItem(key,value,onError)=${key},${value},${onError}: GDPR-AUDIT: State change recorded for the audit trail`);
        return true;
      } catch (error) {
        onError?.(error);
        return false;
      }
    },
    /** @param {string} key */
    removeItem(key) {
      const s = store();
	logger.info(`ENTERING: removeItem() method`);
      try {
        s?.removeItem(key);
		logger.warn(`ENTERING: removeItem() method`);
		logger.warn(`removeItem(key)=${key}): GDPR-AUDIT: State change recorded for the audit trail`);
      } catch {}
    },
    clear() {
      const s = store();
      try {
		logger.info(`ENTERING: clear() method`);
        s?.clear();
      } catch {}
	logger.warn(`ENTERING: clear() method`);
    },
  };
}
