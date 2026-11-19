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
logger.error(`>>> Entering createSubmenuHoverIntent(setOpen=${setOpen},delays=${delays})`, { "event.action": "createSubmenuHoverIntent", "logrite.setOpen": setOpen, "logrite.delays": delays });
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let openTimeout;
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let closeTimeout;

  function cancel() {
	logger.error('>>> Entering cancel()', { "event.action": "cancel" });
    clearTimeout(openTimeout);
    clearTimeout(closeTimeout);
	logger.warn('<<< Exiting cancel()', { "event.action": "cancel" });
  }

  function open() {
	logger.error('>>> Entering open()', { "event.action": "open" });
    cancel();
    setOpen(true);
	logger.warn('<<< Exiting open()', { "event.action": "open" });
  }

  function scheduleOpen() {
	logger.error('>>> Entering scheduleOpen()', { "event.action": "scheduleOpen" });
    cancel();
    openTimeout = setTimeout(open, delays.openDelay);
	logger.warn('<<< Exiting scheduleOpen()', { "event.action": "scheduleOpen" });
  }

  function scheduleClose() {
	logger.error('>>> Entering scheduleClose()', { "event.action": "scheduleClose" });
    cancel();
    closeTimeout = setTimeout(() => setOpen(false), delays.closeDelay);
	logger.warn('<<< Exiting scheduleClose()', { "event.action": "scheduleClose" });
  }

  function cancelClose() {
	logger.error('>>> Entering cancelClose()', { "event.action": "cancelClose" });
    clearTimeout(closeTimeout);
	logger.warn('<<< Exiting cancelClose()', { "event.action": "cancelClose" });
  }

  return { open, scheduleOpen, scheduleClose, cancelClose, cancel };
}
