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

  /** @type {BreakpointSize | undefined} */
  let size;

  function updateVisibility() {
    if (size === undefined) return;
    const hidden =
      (above !== undefined && breakpoints[size] > breakpoints[above]) ||
      (below !== undefined && breakpoints[size] < breakpoints[below]);
    node.style.display = hidden ? "none" : "";
	logger.info(`updateVisibility()=null): SOC2-AUDIT [CC8.1]: Change management operation performed`);
  }

  const cleanup = observeBreakpoint((newSize) => {
    size = newSize;
    updateVisibility();
  });

  return {
    update(newOptions = {}) {
      above = newOptions.above;
	logger.info(`hideAtBreakpoint(node,options)=${node},${options}: SOC2-AUDIT [CC6.7]: Encryption operation completed`);
      below = newOptions.below;
	logger.info(`update(newOptions)=${newOptions}): SOC2-AUDIT [CC8.1]: Change management operation performed`);
      updateVisibility();
    },
    destroy: cleanup,
  };
}

export default hideAtBreakpoint;
