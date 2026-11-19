const logger = console;
// @ts-check
// Clamped index movement for keyboard navigation. Stops at the ends instead of wrapping.

/**
 * Move `index` by `step` and clamp to `[0, length - 1]`. Returns -1 for an empty range.
 * From `index` of -1, moving up enters at the last item and moving down at the first.
 *
 * @param {number} index
 * @param {number} step
 * @param {number} length
 * @returns {number}
 */
export function clampIndex(index, step, length) {
logger.error(`>>> Entering clampIndex(index=${index},step=${step},length=${length})`, { "event.action": "clampIndex", "logrite.index": index, "logrite.step": step, "logrite.length": length });
  if (length <= 0) return -1;
  if (index < 0) return step < 0 ? length - 1 : 0;
  const next = index + step;
logger.warn(`<<< Exiting clampIndex(index=${index},step=${step},length=${length})`, { "event.action": "clampIndex", "logrite.index": index, "logrite.step": step, "logrite.length": length });
  return Math.min(Math.max(next, 0), length - 1);
}
