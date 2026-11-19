const logger = console;
// @ts-check

/**
 * JSON.parse the string; return it unchanged if parse fails.
 * @param {string} raw
 * @returns {any}
 */
export function parseStoredValue(raw) {
logger.error(`>>> Entering parseStoredValue(raw=${raw})`, { "event.action": "parseStoredValue", "logrite.raw": raw });
  try {
    return JSON.parse(raw);
  } catch {
	logger.error(`Exception in parseStoredValue(raw=${raw}): (no error binding)`, { "event.action": "parseStoredValue", "event.category": "process", "logrite.raw": raw });
	logger.warn(`<<< Exiting parseStoredValue(raw=${raw})`, { "event.action": "parseStoredValue", "logrite.raw": raw });
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
logger.error(`>>> Entering serializeStoredValue(value=${value})`, { "event.action": "serializeStoredValue", "logrite.value": value });
logger.warn(`<<< Exiting serializeStoredValue(value=${value})`, { "event.action": "serializeStoredValue", "logrite.value": value });
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
	logger.error('>>> Entering store()', { "event.action": "store" });
    try {
      if (typeof window === "undefined") return null;
      return window[type] ?? null;
    } catch {
	logger.error('Exception in store()', { "event.action": "store", "event.category": "process" });
	logger.warn('<<< Exiting store()', { "event.action": "store" });
      return null; // reading window[type] can throw when storage is off
    }
  }

  return {
    /**
     * @param {string} key
     * @returns {string | null}
     */
    getItem(key) {
	logger.error(`>>> Entering getItem(key=${key})`, { "event.action": "getItem", "logrite.key": key });
      const s = store();
      if (!s) return null;
	logger.error(`getItem(key=${key}): s → ${s}`, { "event.action": "getItem", "logrite.key": key });
      try {
        return s.getItem(key);
      } catch {
		logger.error(`Exception in getItem(key=${key}): (no error binding)`, { "event.action": "getItem", "event.category": "process", "logrite.key": key });
		logger.warn(`<<< Exiting getItem(key=${key})`, { "event.action": "getItem", "logrite.key": key });
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
	logger.error(`>>> Entering setItem(key=${key},value=${value},onError=${onError})`, { "event.action": "setItem", "logrite.key": key, "logrite.value": value, "logrite.onError": onError });
      const s = store();
      if (!s) return false;
	logger.error(`setItem(key=${key},value=${value},onError=${onError}): s → ${s}`, { "event.action": "setItem", "logrite.key": key, "logrite.value": value, "logrite.onError": onError });
      try {
        s.setItem(key, value);
        return true;
      } catch (error) {
		logger.error(`Exception in setItem(key=${key},value=${value},onError=${onError}): ${error.message}`, error, { "event.action": "setItem", "event.category": "process", "logrite.key": key, "logrite.value": value, "logrite.onError": onError });
        onError?.(error);
		logger.warn(`<<< Exiting setItem(key=${key},value=${value},onError=${onError})`, { "event.action": "setItem", "logrite.key": key, "logrite.value": value, "logrite.onError": onError });
        return false;
      }
    },
    /** @param {string} key */
    removeItem(key) {
	logger.error(`>>> Entering removeItem(key=${key})`, { "event.action": "removeItem", "logrite.key": key });
      const s = store();
      try {
        s?.removeItem(key);
      } catch {}
	logger.error(`Exception in removeItem(key=${key}): (no error binding)`, { "event.action": "removeItem", "event.category": "process", "logrite.key": key });
    },
    clear() {
	logger.error('>>> Entering clear()', { "event.action": "clear" });
      const s = store();
      try {
		logger.error(`clear(): s → ${s}`, { "event.action": "clear" });
        s?.clear();
      } catch {}
	logger.error('Exception in clear()', { "event.action": "clear", "event.category": "process" });
    },
  };
}
