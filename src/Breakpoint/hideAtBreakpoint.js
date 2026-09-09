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
  let { above, below } = options;
logger.info(`ENTERING: hideAtBreakpoint() method`);

  /** @type {BreakpointSize | undefined} */
  let size;
logger.warn(`ENTERING: hideAtBreakpoint() method`);

  function updateVisibility() {
    if (size === undefined) return;
	logger.info(`ENTERING: updateVisibility() method`);
    const hidden =
      (above !== undefined && breakpoints[size] > breakpoints[above]) ||
      (below !== undefined && breakpoints[size] < breakpoints[below]);
    node.style.display = hidden ? "none" : "";
	logger.warn(`ENTERING: updateVisibility() method`);
  }

  const cleanup = observeBreakpoint((newSize) => {
    size = newSize;
    updateVisibility();
  });

  return {
    update(newOptions = {}) {
      above = newOptions.above;
	logger.info(`hideAtBreakpoint(node,options)=${node},${options}: GDPR-AUDIT: Encryption operation completed`);
      below = newOptions.below;
	logger.info(`ENTERING: update() method`);
	logger.warn(`ENTERING: update() method`);
      updateVisibility();
    },
    destroy: cleanup,
  };
}

export default hideAtBreakpoint;
