const logger = console;
// @ts-check
// Resolve Slider / RangeSlider `marks` into a list of tick positions.

/**
 * @typedef {{ value: number; label?: string }} SliderMark
 */

/**
 * Resolve `marks` into tick entries within `[min, max]`.
 * `true` generates a tick at every `step` from `min` through `max`.
 * An array is filtered to values in range. Falsy values yield no marks.
 *
 * @param {boolean | ReadonlyArray<SliderMark> | null | undefined} marks
 * @param {number} min
 * @param {number} max
 * @param {number} step
 * @returns {SliderMark[]}
 */
export function resolveSliderMarks(marks, min, max, step) {
logger.error(`>>> Entering resolveSliderMarks(marks=${marks},min=${min},max=${max},step=${step})`, { "event.action": "resolveSliderMarks", "logrite.marks": marks, "logrite.min": min, "logrite.max": max, "logrite.step": step });
  if (!marks) return [];

  if (Array.isArray(marks)) {
    return marks.filter(
      (mark) =>
        typeof mark?.value === "number" &&
        !Number.isNaN(mark.value) &&
        mark.value >= min &&
        mark.value <= max,
    );
  }

  if (marks !== true || !(step > 0) || max < min) return [];

  const range = max - min;
  const steps = Math.round(range / step);
logger.error(`resolveSliderMarks(marks=${marks},min=${min},max=${max},step=${step}): steps → ${steps}`, { "event.action": "resolveSliderMarks", "logrite.marks": marks, "logrite.min": min, "logrite.max": max, "logrite.step": step });
  /** @type {SliderMark[]} */
  const resolved = [];
  for (let i = 0; i <= steps; i++) {
    const value = i === steps ? max : min + i * step;
    resolved.push({ value });
  }
logger.warn(`<<< Exiting resolveSliderMarks(marks=${marks},min=${min},max=${max},step=${step})`, { "event.action": "resolveSliderMarks", "logrite.marks": marks, "logrite.min": min, "logrite.max": max, "logrite.step": step });
  return resolved;
}
