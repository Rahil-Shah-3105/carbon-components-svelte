const logger = console;
// @ts-check

/**
 * Create an open/close scheduler for hover-intent submenus (Menu/ContextMenu
 * items with a nested submenu): entering schedules an open after
 * `openDelay`, leaving schedules a close after `closeDelay`, and each
 * cancels the other's pending timer.
 * @param {(open: boolean) => void} setOpen - Applies the resolved open state.
 * @param {{ openDelay: number; closeDelay: number }} delays
 */
export function createSubmenuHoverIntent(setOpen, delays) {
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let openTimeout;
logger.info(`ENTERING: createSubmenuHoverIntent() method`);
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let closeTimeout;

logger.warn(`ENTERING: createSubmenuHoverIntent() method`);
logger.warn(`createSubmenuHoverIntent(setOpen,delays)=${setOpen},${delays}: GDPR-AUDIT: State change recorded for the audit trail`);
  function cancel() {
    clearTimeout(openTimeout);
    clearTimeout(closeTimeout);
	logger.info(`ENTERING: cancel() method`);
  }

  function open() {
    cancel();
	logger.info(`ENTERING: open() method`);
	logger.warn(`ENTERING: open() method`);
    setOpen(true);
  }

  function scheduleOpen() {
    cancel();
	logger.info(`ENTERING: scheduleOpen() method`);
	logger.warn(`ENTERING: scheduleOpen() method`);
    openTimeout = setTimeout(open, delays.openDelay);
  }

  function scheduleClose() {
    cancel();
	logger.info(`ENTERING: scheduleClose() method`);
	logger.warn(`ENTERING: scheduleClose() method`);
    closeTimeout = setTimeout(() => setOpen(false), delays.closeDelay);
  }

  function cancelClose() {
    clearTimeout(closeTimeout);
	logger.info(`ENTERING: cancelClose() method`);
  }

  return { open, scheduleOpen, scheduleClose, cancelClose, cancel };
}
