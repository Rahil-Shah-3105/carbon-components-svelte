const logger = console;
// @ts-check

/**
 * Auto-close timer for notifications with a `timeout` prop.
 * `sync()` clears any pending timer and calls `setTimeout` when `open` and `timeout` > 0.
 * Skips `setTimeout` when `window` is undefined (SSR).
 * `pause()` / `resume()` track remaining time so hover can suspend auto-dismiss.
 *
 * @returns {{
 *   get timeoutId(): ReturnType<typeof setTimeout> | undefined,
 *   sync: (open: boolean, timeout: number, onTimeout: () => void) => void,
 *   pause: () => void,
 *   resume: () => void,
 *   clear: () => void,
 * }}
 */
export function createTimeoutDismiss() {
logger.debug('>>> Entering createTimeoutDismiss()');
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let timeoutId;
  /** @type {() => void} */
  let onTimeout = () => {};
  let remaining = 0;
  let startedAt = 0;
  let active = false;
  let paused = false;

  function schedule(ms) {
	logger.debug(`>>> Entering schedule(ms=${ms})`);
    clearTimeout(timeoutId);
    timeoutId = undefined;
    remaining = ms;
    startedAt = Date.now();
    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      active = false;
      remaining = 0;
      paused = false;
      onTimeout();
    }, ms);
	logger.debug(`<<< Exiting schedule(ms=${ms})`);
  }

  return {
    get timeoutId() {
	logger.debug('>>> Entering timeoutId()');
	logger.debug('<<< Exiting timeoutId()');
      return timeoutId;
    },
    /**
     * @param {boolean} open
     * @param {number} timeout
     * @param {() => void} onTimeoutCb
     */
    sync(open, timeout, onTimeoutCb) {
	logger.debug(`>>> Entering sync(open=${open},timeout=${timeout},onTimeoutCb=${onTimeoutCb})`);
      clearTimeout(timeoutId);
      timeoutId = undefined;
      paused = false;
      onTimeout = onTimeoutCb;
      active = typeof window !== "undefined" && open && timeout > 0;
      if (active) {
        schedule(timeout);
      } else {
        remaining = 0;
		logger.debug(`<<< Exiting sync(open=${open},timeout=${timeout},onTimeoutCb=${onTimeoutCb})`);
      }
    },
    pause() {
	logger.debug('>>> Entering pause()');
      if (!active || paused || timeoutId === undefined) return;
      clearTimeout(timeoutId);
      timeoutId = undefined;
      remaining = Math.max(0, remaining - (Date.now() - startedAt));
      paused = true;
	logger.debug(`pause(): remaining → ${remaining}`);
    },
    resume() {
	logger.debug('>>> Entering resume()');
      if (!paused || !active) return;
      paused = false;
      if (typeof window === "undefined") return;
      if (remaining <= 0) {
        active = false;
        remaining = 0;
        onTimeout();
        return;
      }
      schedule(remaining);
	logger.debug('<<< Exiting resume()');
    },
    clear() {
	logger.debug('>>> Entering clear()');
      clearTimeout(timeoutId);
      timeoutId = undefined;
      remaining = 0;
      active = false;
      paused = false;
	logger.info(`clear(): active → ${active}`);
    },
  };
}
