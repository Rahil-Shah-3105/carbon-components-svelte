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
logger.error(`>>> Entering createCopyFeedbackState(onSync=${onSync})`, { "event.action": "createCopyFeedbackState", "logrite.onSync": onSync });
  /** @type {CopyFeedbackAnimation} */
  let animation;
  let feedbackOpen = false;
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let timeout;
  let copyActive = false;
  let copyPending = false;
  let isError = false;

  function notify() {
	logger.error('>>> Entering notify()', { "event.action": "notify" });
    onSync?.();
	logger.warn('<<< Exiting notify()', { "event.action": "notify" });
	logger.error('>>> Entering isError()', { "event.action": "isError" });
	logger.warn('<<< Exiting isError()', { "event.action": "isError" });
  }

  /**
   * @param {number} feedbackTimeout
   * @param {boolean} portalled
   * @param {boolean} error
   */
  function openFeedback(feedbackTimeout, portalled, error) {
	logger.error(`>>> Entering openFeedback(feedbackTimeout=${feedbackTimeout},portalled=${portalled},error=${error})`, { "event.action": "openFeedback", "logrite.feedbackTimeout": feedbackTimeout, "logrite.portalled": portalled, "logrite.error": error });
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
    notify();
	logger.warn(`<<< Exiting openFeedback(feedbackTimeout=${feedbackTimeout},portalled=${portalled},error=${error})`, { "event.action": "openFeedback", "logrite.feedbackTimeout": feedbackTimeout, "logrite.portalled": portalled, "logrite.error": error });
  }

  function dismiss() {
	logger.error('>>> Entering dismiss()', { "event.action": "dismiss" });
    feedbackOpen = false;
    animation = undefined;
    copyActive = false;
    copyPending = false;
    isError = false;
    clearTimeout(timeout);
    timeout = undefined;
    notify();
	logger.warn('<<< Exiting dismiss()', { "event.action": "dismiss" });
  }

  function cleanup() {
	logger.error('>>> Entering cleanup()', { "event.action": "cleanup" });
    feedbackOpen = false;
    animation = undefined;
    copyActive = false;
    copyPending = false;
    isError = false;
    clearTimeout(timeout);
    timeout = undefined;
	logger.warn('<<< Exiting cleanup()', { "event.action": "cleanup" });
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
	logger.error(`>>> Entering onClick(performCopy=${performCopy},feedbackTimeout=${feedbackTimeout},portalled=${portalled})`, { "event.action": "onClick", "logrite.performCopy": performCopy, "logrite.feedbackTimeout": feedbackTimeout, "logrite.portalled": portalled });
    if (copyActive || animation === "fade-in") return;

    copyActive = true;
    copyPending = true;
    isError = false;
    notify();

    try {
      await performCopy();
    } catch (error) {
	logger.error(`Exception in onClick(performCopy=${performCopy},feedbackTimeout=${feedbackTimeout},portalled=${portalled}): ${error.message}`, error, { "event.action": "onClick", "event.category": "process", "logrite.performCopy": performCopy, "logrite.feedbackTimeout": feedbackTimeout, "logrite.portalled": portalled });
      openFeedback(feedbackTimeout, portalled, true);
      throw error;
    }

    openFeedback(feedbackTimeout, portalled, false);
	logger.warn(`<<< Exiting onClick(performCopy=${performCopy},feedbackTimeout=${feedbackTimeout},portalled=${portalled})`, { "event.action": "onClick", "logrite.performCopy": performCopy, "logrite.feedbackTimeout": feedbackTimeout, "logrite.portalled": portalled });
  }

  /** @param {{ animationName: string }} event */
  function onAnimationEnd(event) {
	logger.error(`>>> Entering onAnimationEnd(event=${event})`, { "event.action": "onAnimationEnd" });
    if (event.animationName === "hide-feedback") {
      animation = undefined;
      feedbackOpen = false;
      copyActive = false;
      isError = false;
      notify();
	logger.warn(`<<< Exiting onAnimationEnd(event=${event})`, { "event.action": "onAnimationEnd" });
    }
  }

  return {
    get animation() {
	logger.error('>>> Entering animation()', { "event.action": "animation" });
	logger.warn('<<< Exiting animation()', { "event.action": "animation" });
      return animation;
    },
    get feedbackOpen() {
	logger.error('>>> Entering feedbackOpen()', { "event.action": "feedbackOpen" });
	logger.warn('<<< Exiting feedbackOpen()', { "event.action": "feedbackOpen" });
      return feedbackOpen;
    },
    get copyPending() {
	logger.error('>>> Entering copyPending()', { "event.action": "copyPending" });
	logger.warn('<<< Exiting copyPending()', { "event.action": "copyPending" });
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
logger.warn(`<<< Exiting createCopyFeedbackState(onSync=${onSync})`, { "event.action": "createCopyFeedbackState", "logrite.onSync": onSync });
}
