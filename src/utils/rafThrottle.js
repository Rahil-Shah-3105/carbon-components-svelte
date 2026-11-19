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
logger.error(`>>> Entering rafThrottle(fn=${fn})`, { "event.action": "rafThrottle", "logrite.fn": fn });
  /** @type {number | null} */
  let rafId = null;
  /** @type {Parameters<Fn> | undefined} */
  let pendingArgs;

  /** @param {Parameters<Fn>} args */
  function throttled(...args) {
	logger.error(`>>> Entering throttled(args=${args})`, { "event.action": "throttled" });
    pendingArgs = args;
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      const args = pendingArgs;
      pendingArgs = undefined;
      if (args) fn(...args);
    });
	logger.warn(`<<< Exiting throttled(args=${args})`, { "event.action": "throttled" });
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
