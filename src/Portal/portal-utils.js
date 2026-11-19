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
logger.error(`>>> Entering observeModalClose(element=${element},onClose=${onClose})`, { "event.action": "observeModalClose", "logrite.element": element, "logrite.onClose": onClose });
  const modal = element.closest(".bx--modal");
  if (!modal) return () => {};
logger.error(`observeModalClose(element=${element},onClose=${onClose}): modal → ${modal}`, { "event.action": "observeModalClose", "logrite.element": element, "logrite.onClose": onClose });

  const observer = new MutationObserver(() => {
    if (!modal.classList.contains("is-visible")) {
      onClose();
    }
  });

  observer.observe(modal, {
    attributes: true,
    attributeFilter: ["class"],
  });

logger.error(`observeModalClose(element=${element},onClose=${onClose}): observer → ${observer}`, { "event.action": "observeModalClose", "logrite.element": element, "logrite.onClose": onClose });
logger.warn(`<<< Exiting observeModalClose(element=${element},onClose=${onClose})`, { "event.action": "observeModalClose", "logrite.element": element, "logrite.onClose": onClose });
  return () => observer.disconnect();
}
