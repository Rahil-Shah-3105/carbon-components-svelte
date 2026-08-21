const logger = console;
// @ts-check

/** @typedef {'fade-in' | 'fade-out' | undefined} CopyFeedbackAnimation */

/**
 * Copy-button feedback (fade-in/out, portal tooltip).
 * `copyActive` blocks a second click before Svelte assigns `animation`.
 * On copy failure, still opens feedback (`isError`) so callers can show
 * error text in the same tooltip slot, then rethrows.
 *
 * @param {() => void} [onSync] - Run after internal state changes (sync component `let`s).
 * @returns {{
 *   get animation(): CopyFeedbackAnimation,
 *   get feedbackOpen(): boolean,
 *   get copyPending(): boolean,
 *   get isError(): boolean,
 *   dismiss: () => void,
 *   onClick: (performCopy: () => void | Promise<void>, feedbackTimeout: number, portalled?: boolean) => Promise<void>,
 *   onAnimationEnd: (event: { animationName: string }) => void,
 *   cleanup: () => void,
 * }}
 */
export function createCopyFeedbackState(onSync) {
logger.debug(`>>> Entering createCopyFeedbackState(onSync=${onSync})`);
  /** @type {CopyFeedbackAnimation} */
  let animation;
  let feedbackOpen = false;
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let timeout;
  let copyActive = false;
  let copyPending = false;
  let isError = false;

  function notify() {
	logger.debug('>>> Entering notify()');
    onSync?.();
	logger.debug('<<< Exiting notify()');
	logger.debug('>>> Entering isError()');
	logger.debug('<<< Exiting isError()');
  }

  /**
   * @param {number} feedbackTimeout
   * @param {boolean} portalled
   * @param {boolean} error
   */
  function openFeedback(feedbackTimeout, portalled, error) {
	logger.debug(`>>> Entering openFeedback(feedbackTimeout=${feedbackTimeout},portalled=${portalled},error=${error})`);
    copyPending = false;
    isError = error;
    animation = "fade-in";
    feedbackOpen = true;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (portalled) {
        feedbackOpen = false;
        animation = undefined;
        copyActive = false;
        isError = false;
      } else {
        animation = "fade-out";
      }
      notify();
    }, feedbackTimeout);
	logger.debug(`<<< Exiting openFeedback(feedbackTimeout=${feedbackTimeout},portalled=${portalled},error=${error})`);
    notify();
  }

  function dismiss() {
	logger.debug('>>> Entering dismiss()');
    feedbackOpen = false;
    animation = undefined;
    copyActive = false;
    copyPending = false;
    isError = false;
    clearTimeout(timeout);
    timeout = undefined;
	logger.debug('<<< Exiting dismiss()');
    notify();
  }

  function cleanup() {
	logger.debug('>>> Entering cleanup()');
    feedbackOpen = false;
    animation = undefined;
    copyActive = false;
    copyPending = false;
    isError = false;
    clearTimeout(timeout);
	logger.debug('<<< Exiting cleanup()');
    timeout = undefined;
  }

logger.info(`createCopyFeedbackState(onSync=${onSync}): timeout → ${timeout}`);
  /**
   * @param {() => void | Promise<void>} performCopy
   * @param {number} feedbackTimeout
   * @param {boolean} [portalled] - When `true`, close feedback directly on
   *   timeout instead of awaiting the `hide-feedback` animation. The portalled
   *   tooltip hides the feedback element, so that animation (and its
   *   `animationend`) never fires and the tooltip would otherwise stay open.
   * @returns {Promise<void>}
   */
  async function onClick(performCopy, feedbackTimeout, portalled = false) {
	logger.debug(`>>> Entering onClick(performCopy=${performCopy},feedbackTimeout=${feedbackTimeout},portalled=${portalled})`);
    if (copyActive || animation === "fade-in") return;

    copyActive = true;
    copyPending = true;
    isError = false;
    notify();

    try {
      await performCopy();
    } catch (error) {
	logger.error(`Exception in createCopyFeedbackState(onSync=${onSync}): ${error.message}`, error);
      openFeedback(feedbackTimeout, portalled, true);
	logger.error(`Exception in onClick(performCopy=${performCopy},feedbackTimeout=${feedbackTimeout},portalled=${portalled}): ${error.message}`, error);
	logger.debug(`<<< Exiting onClick(performCopy=${performCopy},feedbackTimeout=${feedbackTimeout},portalled=${portalled})`);
      throw error;
    }

    openFeedback(feedbackTimeout, portalled, false);
  }

  /** @param {{ animationName: string }} event */
  function onAnimationEnd(event) {
	logger.debug(`>>> Entering onAnimationEnd(event=${event})`);
    if (event.animationName === "hide-feedback") {
      animation = undefined;
      feedbackOpen = false;
      copyActive = false;
      isError = false;
      notify();
	logger.debug(`<<< Exiting onAnimationEnd(event=${event})`);
    }
  }

  return {
    get animation() {
	logger.debug('>>> Entering animation()');
      return animation;
    },
    get feedbackOpen() {
	logger.debug('>>> Entering feedbackOpen()');
	logger.debug('<<< Exiting feedbackOpen()');
      return feedbackOpen;
    },
    get copyPending() {
	logger.debug('>>> Entering copyPending()');
	logger.debug('<<< Exiting copyPending()');
      return copyPending;
    },
    get isError() {
      return isError;
    },
    dismiss,
    onClick,
    onAnimationEnd,
    cleanup,
  };
}
