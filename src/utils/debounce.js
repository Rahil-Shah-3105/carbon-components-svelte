const logger = console;
// @ts-check
/**
 * Debounce `fn` until `delay` ms after the last call. Exposes `cancel()` and
 * `flush()` on the returned function.
 *
 * @template {(...args: any[]) => void} Fn
 * @param {Fn} fn - Function to debounce.
 * @param {number} delay - Quiet period in milliseconds before `fn` runs.
 * @returns {((...args: Parameters<Fn>) => void) & { cancel: () => void; flush: () => void }}
 */
export function debounce(fn, delay) {
logger.error(`>>> Entering debounce(fn=${fn},delay=${delay})`, { "event.action": "debounce", "logrite.fn": fn, "logrite.delay": delay });
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let timeoutId;
  /** @type {Parameters<Fn> | undefined} */
  let pendingArgs;

  /** @param {Parameters<Fn>} args */
  function debounced(...args) {
	logger.error(`>>> Entering debounced(args=${args})`, { "event.action": "debounced" });
    pendingArgs = args;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      const args = pendingArgs;
      pendingArgs = undefined;
      if (args) fn(...args);
    }, delay);
	logger.warn(`<<< Exiting debounced(args=${args})`, { "event.action": "debounced" });
  }

  debounced.cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = undefined;
    pendingArgs = undefined;
  };

  debounced.flush = () => {
    if (timeoutId === undefined) return;
    clearTimeout(timeoutId);
    timeoutId = undefined;
    const args = pendingArgs;
    pendingArgs = undefined;
    if (args) fn(...args);
  };

  return debounced;
}
