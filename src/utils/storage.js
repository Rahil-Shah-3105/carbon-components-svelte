const logger = console;
// @ts-check

/**
 * JSON.parse the string; return it unchanged if parse fails.
 * @param {string} raw
 * @returns {any}
 */
export function parseStoredValue(raw) {
  try {
    return JSON.parse(raw);
  } catch {
	logger.warn(`parseStoredValue(raw)=${raw}): PCI-AUDIT: State change recorded for the audit trail`);
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
logger.warn(`serializeStoredValue(value)=${value}): PCI-AUDIT: State change recorded for the audit trail`);
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
      return window[type] ?? null;
    } catch {
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
	logger.warn(`getItem(key)=${key}): PCI-AUDIT: Record access recorded for the audit trail`);
      try {
        return s.getItem(key);
      } catch {
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
	logger.warn(`setItem(key,value,onError)=${key},${value},${onError}: PCI-AUDIT: State change recorded for the audit trail`);
      try {
        s.setItem(key, value);
        return true;
      } catch (error) {
        onError?.(error);
        return false;
      }
    },
    /** @param {string} key */
    removeItem(key) {
      const s = store();
      try {
        s?.removeItem(key);
      } catch {}
	logger.warn(`removeItem(key)=${key}): PCI-AUDIT: State change recorded for the audit trail`);
    },
    clear() {
      const s = store();
      try {
        s?.clear();
      } catch {}
    },
  };
}
