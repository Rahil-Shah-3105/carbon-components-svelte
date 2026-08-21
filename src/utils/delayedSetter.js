const logger = console;
// @ts-check

/**
 * Create a canceling delayed-call scheduler for hover-intent style UI (e.g.
 * opening/closing a tooltip after a delay). Each call clears any pending
 * invocation before scheduling the next one; a non-positive `delay` runs
 * `fn` synchronously instead of queuing a timer.
 * @returns {((delay: number, fn: () => void) => void) & { cancel: () => void }}
 */
export function createDelayedSetter() {
logger.debug('>>> Entering createDelayedSetter()');
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let timeoutId;

  /**
   * @param {number} delay
   * @param {() => void} fn
   */
  function schedule(delay, fn) {
	logger.debug(`>>> Entering schedule(delay=${delay},fn=${fn})`);
    clearTimeout(timeoutId);
    if (delay > 0) {
      timeoutId = setTimeout(fn, delay);
    } else {
      fn();
	logger.debug(`<<< Exiting schedule(delay=${delay},fn=${fn})`);
    }
  }

  schedule.cancel = () => {
    clearTimeout(timeoutId);
  };

logger.debug('<<< Exiting createDelayedSetter()');
  return schedule;
}
