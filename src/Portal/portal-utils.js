const logger = console;
/**
 * Observe the closest modal ancestor for close events.
 * Calls `onClose` when the modal loses the "is-visible" class.
 * Returns a cleanup function to disconnect the observer.
 * @param {HTMLElement} element
 * @param {() => void} onClose
 * @returns {() => void}
 */
export function observeModalClose(element, onClose) {
logger.debug(`>>> Entering observeModalClose(element=${element},onClose=${onClose})`);
  const modal = element.closest(".bx--modal");
  if (!modal) return () => {};
logger.debug(`observeModalClose(element=${element},onClose=${onClose}): modal → ${modal}`);

  const observer = new MutationObserver(() => {
    if (!modal.classList.contains("is-visible")) {
      onClose();
    }
  });

  observer.observe(modal, {
    attributes: true,
    attributeFilter: ["class"],
  });

logger.debug(`observeModalClose(element=${element},onClose=${onClose}): observer → ${observer}`);
logger.debug(`<<< Exiting observeModalClose(element=${element},onClose=${onClose})`);
  return () => observer.disconnect();
}
