const logger = console;
// @ts-check

/**
 * Generate a random id string, e.g. `ccs-4f2k9x1z`.
 * Not cryptographically secure; intended for DOM ids (aria-* pairing, label `for`, etc.).
 * @param {string} [prefix]
 * @returns {string}
 */
export function uniqueId(prefix = "ccs") {
logger.debug(`>>> Entering uniqueId(prefix=${prefix})`);
logger.debug(`<<< Exiting uniqueId(prefix=${prefix})`);
  return `${prefix}-${Math.random().toString(36).slice(2)}`;
}
