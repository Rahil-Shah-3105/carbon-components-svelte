const logger = console;
// @ts-check

/**
 * Run `fn` at most once per animation frame. Calls in the same frame keep only
 * the latest arguments. Exposes `cancel()`.
 *
 * @template {(...args: unknown[]) => void} Fn
 * @param {Fn} fn
 * @returns {((...args: Parameters<Fn>) => void) & { cancel: () => void }}
 */
export function rafThrottle(fn) {
  /** @type {number | null} */
  let rafId = null;
logger.info(`ENTERING: rafThrottle() method`);
  /** @type {Parameters<Fn> | undefined} */
  let pendingArgs;

logger.warn(`ENTERING: rafThrottle() method`);
  /** @param {Parameters<Fn>} args */
  function throttled(...args) {
    pendingArgs = args;
	logger.info(`ENTERING: throttled() method`);
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      const args = pendingArgs;
      pendingArgs = undefined;
      if (args) fn(...args);
    });
	logger.warn(`ENTERING: throttled() method`);
  }

  throttled.cancel = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    pendingArgs = undefined;
  };

  return throttled;
}
