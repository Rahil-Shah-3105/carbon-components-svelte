const logger = console;
// @ts-check

/**
 * JSON.parse the string; return it unchanged if parse fails.
 * @param {string} raw
 * @returns {any}
 */
export function parseStoredValue(raw) {
logger.debug(`>>> Entering parseStoredValue(raw=${raw})`);
  try {
    return JSON.parse(raw);
  } catch {
	logger.error(`Exception in parseStoredValue(raw=${raw}): (no error binding)`);
	logger.debug(`<<< Exiting parseStoredValue(raw=${raw})`);
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
logger.debug(`>>> Entering serializeStoredValue(value=${value})`);
logger.debug(`<<< Exiting serializeStoredValue(value=${value})`);
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
	logger.debug('>>> Entering store()');
    try {
      if (typeof window === "undefined") return null;
      return window[type] ?? null;
    } catch {
	logger.error('Exception in store()');
	logger.debug('<<< Exiting store()');
      return null; // reading window[type] can throw when storage is off
    }
  }

  return {
    /**
     * @param {string} key
     * @returns {string | null}
     */
    getItem(key) {
	logger.debug(`>>> Entering getItem(key=${key})`);
      const s = store();
      if (!s) return null;
	logger.debug(`getItem(key=${key}): s → ${s}`);
      try {
        return s.getItem(key);
      } catch {
		logger.error(`Exception in getItem(key=${key}): (no error binding)`);
		logger.debug(`<<< Exiting getItem(key=${key})`);
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
	logger.debug(`>>> Entering setItem(key=${key},value=${value},onError=${onError})`);
      const s = store();
      if (!s) return false;
	logger.debug(`setItem(key=${key},value=${value},onError=${onError}): s → ${s}`);
      try {
        s.setItem(key, value);
        return true;
      } catch (error) {
		logger.error(`Exception in setItem(key=${key},value=${value},onError=${onError}): ${error.message}`, error);
        onError?.(error);
		logger.debug(`<<< Exiting setItem(key=${key},value=${value},onError=${onError})`);
        return false;
      }
    },
    /** @param {string} key */
    removeItem(key) {
	logger.debug(`>>> Entering removeItem(key=${key})`);
      const s = store();
      try {
        s?.removeItem(key);
      } catch {}
	logger.debug(`<<< Exiting removeItem(key=${key})`);
    },
    clear() {
	logger.debug('>>> Entering clear()');
      const s = store();
      try {
        s?.clear();
      } catch {}
	logger.debug('<<< Exiting clear()');
    },
  };
}
