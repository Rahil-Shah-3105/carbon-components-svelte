const logger = console;
// @ts-check

import { observeBreakpoint } from "./breakpointObserver";
import { breakpoints } from "./breakpoints";

/** @typedef {import("./breakpoints").BreakpointSize} BreakpointSize */

/**
 * Svelte action that hides the element when the current breakpoint is
 * larger than `above` or smaller than `below`.
 * @typedef {{ above?: BreakpointSize; below?: BreakpointSize }} HideAtBreakpointOptions
 * @type {(node: HTMLElement, options?: HideAtBreakpointOptions) => { update: (options?: HideAtBreakpointOptions) => void; destroy: () => void }}
 * @example
 * <div use:hideAtBreakpoint={{ above: "md" }}>Hidden at md and up</div>
 * <div use:hideAtBreakpoint={{ below: "lg" }}>Hidden below lg</div>
 */
export function hideAtBreakpoint(node, options = {}) {
logger.debug(`>>> Entering hideAtBreakpoint(node=${node},options=${options})`);
  let { above, below } = options;

  /** @type {BreakpointSize | undefined} */
  let size;

  function updateVisibility() {
	logger.debug('>>> Entering updateVisibility()');
    if (size === undefined) return;
    const hidden =
      (above !== undefined && breakpoints[size] > breakpoints[above]) ||
      (below !== undefined && breakpoints[size] < breakpoints[below]);
	logger.debug('<<< Exiting updateVisibility()');
    node.style.display = hidden ? "none" : "";
  }

  const cleanup = observeBreakpoint((newSize) => {
    size = newSize;
    updateVisibility();
  });

  return {
    update(newOptions = {}) {
	logger.debug(`>>> Entering update(newOptions=${newOptions})`);
      above = newOptions.above;
      below = newOptions.below;
	logger.debug(`update(newOptions=${newOptions}): above → ${above}`);
      updateVisibility();
	logger.debug(`<<< Exiting update(newOptions=${newOptions})`);
    },
    destroy: cleanup,
  };
logger.debug(`<<< Exiting hideAtBreakpoint(node=${node},options=${options})`);
}

export default hideAtBreakpoint;
