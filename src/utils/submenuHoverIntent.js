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
logger.debug(`>>> Entering createSubmenuHoverIntent(setOpen=${setOpen},delays=${delays})`);
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let openTimeout;
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let closeTimeout;

  function cancel() {
	logger.debug('>>> Entering cancel()');
    clearTimeout(openTimeout);
    clearTimeout(closeTimeout);
	logger.debug('<<< Exiting cancel()');
  }

  function open() {
	logger.debug('>>> Entering open()');
    cancel();
    setOpen(true);
	logger.debug('<<< Exiting open()');
  }

  function scheduleOpen() {
	logger.debug('>>> Entering scheduleOpen()');
    cancel();
    openTimeout = setTimeout(open, delays.openDelay);
	logger.debug('<<< Exiting scheduleOpen()');
  }

  function scheduleClose() {
	logger.debug('>>> Entering scheduleClose()');
    cancel();
    closeTimeout = setTimeout(() => setOpen(false), delays.closeDelay);
	logger.debug('<<< Exiting scheduleClose()');
  }

  function cancelClose() {
	logger.debug('>>> Entering cancelClose()');
    clearTimeout(closeTimeout);
	logger.debug('<<< Exiting cancelClose()');
  }

logger.debug(`<<< Exiting createSubmenuHoverIntent(setOpen=${setOpen},delays=${delays})`);
  return { open, scheduleOpen, scheduleClose, cancelClose, cancel };
}
