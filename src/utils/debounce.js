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
logger.debug(`>>> Entering debounce(fn=${fn},delay=${delay})`);
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let timeoutId;
  /** @type {Parameters<Fn> | undefined} */
  let pendingArgs;

  /** @param {Parameters<Fn>} args */
  function debounced(...args) {
	logger.debug(`>>> Entering debounced(args=${args})`);
    pendingArgs = args;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      const args = pendingArgs;
      pendingArgs = undefined;
      if (args) fn(...args);
    }, delay);
	logger.debug(`<<< Exiting debounced(args=${args})`);
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

logger.debug(`<<< Exiting debounce(fn=${fn},delay=${delay})`);
  return debounced;
}
