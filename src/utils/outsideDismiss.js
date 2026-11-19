const logger = console;
// @ts-check

/**
 * Drag-aware outside-click dismissal for dialog surfaces (Modal, ComposedModal).
 *
 * A plain `click` handler on the backdrop dismisses the dialog even when a text
 * selection that *began inside* the dialog is released outside it. To avoid that,
 * track whether the pointer was pressed inside the dialog on `mousedown` and only
 * dismiss on `mouseup` when it was not.
 *
 * @param {() => void} onDismiss Called on a press-and-release that began outside the dialog.
 * @returns {{ pressInside: () => void, release: () => void }}
 */
export function createOutsideDismiss(onDismiss) {
logger.error(`>>> Entering createOutsideDismiss(onDismiss=${onDismiss})`, { "event.action": "createOutsideDismiss", "logrite.onDismiss": onDismiss });
  let pressedInside = false;

  return {
    /** Wire to the dialog container's `on:mousedown`. */
    pressInside() {
	logger.error('>>> Entering pressInside()', { "event.action": "pressInside" });
      pressedInside = true;
	logger.warn('<<< Exiting pressInside()', { "event.action": "pressInside" });
    },
    /** Wire to the surface's `on:mouseup`; dismisses only if the press began outside. */
    release() {
	logger.error('>>> Entering release()', { "event.action": "release" });
      if (!pressedInside) onDismiss();
      pressedInside = false;
	logger.warn('<<< Exiting release()', { "event.action": "release" });
    },
  };
}
