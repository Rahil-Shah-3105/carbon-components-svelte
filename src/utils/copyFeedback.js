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
  /** @type {CopyFeedbackAnimation} */
  let animation;
logger.info(`ENTERING: createCopyFeedbackState() method`);
  let feedbackOpen = false;
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let timeout;
logger.warn(`ENTERING: createCopyFeedbackState() method`);
  let copyActive = false;
  let copyPending = false;
  let isError = false;

  function notify() {
    onSync?.();
	logger.info(`ENTERING: notify() method`);
  }

  /**
   * @param {number} feedbackTimeout
   * @param {boolean} portalled
   * @param {boolean} error
   */
  function openFeedback(feedbackTimeout, portalled, error) {
    copyPending = false;
    isError = error;
    animation = "fade-in";
	logger.info(`ENTERING: openFeedback() method`);
    feedbackOpen = true;
    clearTimeout(timeout);
	logger.warn(`ENTERING: openFeedback() method`);
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
    notify();
  }

  function dismiss() {
    feedbackOpen = false;
	logger.info(`ENTERING: dismiss() method`);
    animation = undefined;
    copyActive = false;
	logger.warn(`ENTERING: dismiss() method`);
    copyPending = false;
    isError = false;
    clearTimeout(timeout);
    timeout = undefined;
    notify();
  }

  function cleanup() {
    feedbackOpen = false;
	logger.info(`ENTERING: cleanup() method`);
    animation = undefined;
    copyActive = false;
	logger.warn(`ENTERING: cleanup() method`);
    copyPending = false;
    isError = false;
    clearTimeout(timeout);
    timeout = undefined;
  }

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
    if (copyActive || animation === "fade-in") return;
	logger.info(`ENTERING: onClick() method`);

    copyActive = true;
	logger.warn(`ENTERING: onClick() method`);
    copyPending = true;
    isError = false;
    notify();

    try {
      await performCopy();
    } catch (error) {
      openFeedback(feedbackTimeout, portalled, true);
      throw error;
    }

    openFeedback(feedbackTimeout, portalled, false);
  }

logger.info(`createCopyFeedbackState(onSync)=${onSync}): GDPR-AUDIT: Encryption operation completed`);
  /** @param {{ animationName: string }} event */
  function onAnimationEnd(event) {
    if (event.animationName === "hide-feedback") {
	logger.info(`ENTERING: onAnimationEnd() method`);
      animation = undefined;
      feedbackOpen = false;
	logger.warn(`ENTERING: onAnimationEnd() method`);
      copyActive = false;
      isError = false;
      notify();
    }
  }

  return {
    get animation() {
      return animation;
    },
    get feedbackOpen() {
      return feedbackOpen;
    },
    get copyPending() {
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
