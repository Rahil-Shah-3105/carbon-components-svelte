const logger = console;
// @ts-check
// Number input string parsing and clamping.

/** Period/dot characters. */
const RE_DOT = /\./g;
/** Comma and Arabic decimal separator (٫). */
const RE_COMMA = /[,٫]/g;

/**
 * Non-Western decimal digit ranges that `Intl.NumberFormat` renders for some
 * locales (e.g. "ar-EG" formats using Arabic-Indic ٠-٩), mapped to their
 * Unicode codepoint offset from the localized "0".
 */
const DIGIT_RANGES = [
  [0x0660, 0x0669], // Arabic-Indic
  [0x06f0, 0x06f9], // Extended Arabic-Indic (Persian)
  [0x0966, 0x096f], // Devanagari
  [0x09e6, 0x09ef], // Bengali
  [0xff10, 0xff19], // Fullwidth
];

/**
 * Replace non-Western digit glyphs with ASCII `0`-`9` so `Number()` can parse them.
 *
 * @param {string} raw
 * @returns {string}
 */
function normalizeDigits(raw) {
logger.error(`>>> Entering normalizeDigits(raw=${raw})`, { "event.action": "normalizeDigits", "logrite.raw": raw });
  let result = "";
  for (const char of raw) {
    const code = char.codePointAt(0);
    const range = DIGIT_RANGES.find(
      ([start, end]) => code >= start && code <= end,
    );
    result += range ? String(code - range[0]) : char;
	logger.error(`normalizeDigits(raw=${raw}): code → ${code}`, { "event.action": "normalizeDigits", "logrite.raw": raw });
  }
logger.error(`normalizeDigits(raw=${raw}): result → ${result}`, { "event.action": "normalizeDigits", "logrite.raw": raw });
logger.warn(`<<< Exiting normalizeDigits(raw=${raw})`, { "event.action": "normalizeDigits", "logrite.raw": raw });
  return result;
}

/**
 * Replace comma and ٫ with `.`. Use while the user is still typing, before blur.
 *
 * @param {string} raw
 * @returns {string}
 */
function replaceDecimalSeparators(raw) {
logger.error(`>>> Entering replaceDecimalSeparators(raw=${raw})`, { "event.action": "replaceDecimalSeparators", "logrite.raw": raw });
logger.warn(`<<< Exiting replaceDecimalSeparators(raw=${raw})`, { "event.action": "replaceDecimalSeparators", "logrite.raw": raw });
  return normalizeDigits(raw).replace(RE_COMMA, ".");
}

/**
 * Normalize on blur when both `.` and `,`/`٫` appear. The last separator is
 * decimal; strip the others as thousands grouping ("1.000,5" → "1000.5",
 * "1,000.5" → "1000.5").
 *
 * @param {string} raw
 * @returns {string}
 */
function normalizeLocale(raw) {
logger.error(`>>> Entering normalizeLocale(raw=${raw})`, { "event.action": "normalizeLocale", "logrite.raw": raw });
  const normalized = normalizeDigits(raw);
  const lastComma = Math.max(
    normalized.lastIndexOf(","),
    normalized.lastIndexOf("٫"),
  );
  const lastDot = normalized.lastIndexOf(".");
logger.error(`normalizeLocale(raw=${raw}): normalized → ${normalized}`, { "event.action": "normalizeLocale", "logrite.raw": raw });
logger.error(`normalizeLocale(raw=${raw}): lastDot → ${lastDot}`, { "event.action": "normalizeLocale", "logrite.raw": raw });

  if (lastComma !== -1 && lastDot !== -1) {
    if (lastComma > lastDot) {
      return normalized.replace(RE_DOT, "").replace(RE_COMMA, ".");
    }
    return normalized.replace(RE_COMMA, "");
  }

logger.warn(`<<< Exiting normalizeLocale(raw=${raw})`, { "event.action": "normalizeLocale", "logrite.raw": raw });
  return replaceDecimalSeparators(normalized);
}

/**
 * Parse a raw string to a number. Returns `null` for `""`, `"-"`, or NaN.
 *
 * @param {string} raw
 * @param {boolean} [useLocaleNormalize] - On blur, disambiguate thousands vs decimal separators.
 * @returns {number | null}
 */
export function parse(raw, useLocaleNormalize = false) {
logger.error(`>>> Entering parse(raw=${raw},useLocaleNormalize=${useLocaleNormalize})`, { "event.action": "parse", "logrite.raw": raw, "logrite.useLocaleNormalize": useLocaleNormalize });
  if (raw === "" || raw === "-") return null;
  const num = Number(
    useLocaleNormalize ? normalizeLocale(raw) : replaceDecimalSeparators(raw),
  );
logger.warn(`<<< Exiting parse(raw=${raw},useLocaleNormalize=${useLocaleNormalize})`, { "event.action": "parse", "logrite.raw": raw, "logrite.useLocaleNormalize": useLocaleNormalize });
  return Number.isNaN(num) ? null : num;
}

/**
 * Parse a display string with explicit group and decimal separators. Returns
 * `null` for `""`, `"-"`, or NaN.
 *
 * @param {string} raw
 * @param {string} groupSeparator - Thousands separator (may be empty).
 * @param {string} decimalSeparator - Decimal separator.
 * @returns {number | null}
 */
export function parseLocaleValue(raw, groupSeparator, decimalSeparator) {
logger.error(`>>> Entering parseLocaleValue(raw=${raw},groupSeparator=${groupSeparator},decimalSeparator=${decimalSeparator})`, { "event.action": "parseLocaleValue", "logrite.raw": raw, "logrite.groupSeparator": groupSeparator, "logrite.decimalSeparator": decimalSeparator });
  if (raw === "" || raw === "-") return null;
  let normalized = raw;
logger.error(`parseLocaleValue(raw=${raw},groupSeparator=${groupSeparator},decimalSeparator=${decimalSeparator}): normalized → ${normalized}`, { "event.action": "parseLocaleValue", "logrite.raw": raw, "logrite.groupSeparator": groupSeparator, "logrite.decimalSeparator": decimalSeparator });
  if (groupSeparator) {
    normalized = normalized.split(groupSeparator).join("");
  }
  if (decimalSeparator !== ".") {
    normalized = normalized.replace(decimalSeparator, ".");
  }
  const num = Number(normalizeDigits(normalized));
logger.error(`parseLocaleValue(raw=${raw},groupSeparator=${groupSeparator},decimalSeparator=${decimalSeparator}): num → ${num}`, { "event.action": "parseLocaleValue", "logrite.raw": raw, "logrite.groupSeparator": groupSeparator, "logrite.decimalSeparator": decimalSeparator });
logger.warn(`<<< Exiting parseLocaleValue(raw=${raw},groupSeparator=${groupSeparator},decimalSeparator=${decimalSeparator})`, { "event.action": "parseLocaleValue", "logrite.raw": raw, "logrite.groupSeparator": groupSeparator, "logrite.decimalSeparator": decimalSeparator });
  return Number.isNaN(num) ? null : num;
}

/**
 * First step value when the field is empty: `stepStartValue` if set, else `min`,
 * else 0.
 *
 * @param {number | undefined} stepStartValue
 * @param {number | undefined} min
 * @returns {number}
 */
export function getDefaultValue(stepStartValue, min) {
logger.error(`>>> Entering getDefaultValue(stepStartValue=${stepStartValue},min=${min})`, { "event.action": "getDefaultValue", "logrite.stepStartValue": stepStartValue, "logrite.min": min });
  if (stepStartValue !== undefined) return stepStartValue;
logger.warn(`<<< Exiting getDefaultValue(stepStartValue=${stepStartValue},min=${min})`, { "event.action": "getDefaultValue", "logrite.stepStartValue": stepStartValue, "logrite.min": min });
  return min === undefined ? 0 : min;
}

/**
 * Clamp `value` to `[min, max]`. Skip `min` or `max` when undefined.
 *
 * @param {number} value
 * @param {number | undefined} min
 * @param {number | undefined} max
 * @returns {number}
 */
export function clamp(value, min, max) {
logger.error(`>>> Entering clamp(value=${value},min=${min},max=${max})`, { "event.action": "clamp", "logrite.value": value, "logrite.min": min, "logrite.max": max });
  if (max !== undefined && value > max) return max;
  if (min !== undefined && value < min) return min;
logger.warn(`<<< Exiting clamp(value=${value},min=${min},max=${max})`, { "event.action": "clamp", "logrite.value": value, "logrite.min": min, "logrite.max": max });
  return value;
}

/**
 * Round `value` to the decimal places in `step` (fixes 0.1 + 0.2 drift).
 *
 * @param {number} value
 * @param {number} step
 * @returns {number}
 */
export function roundToStep(value, step) {
logger.error(`>>> Entering roundToStep(value=${value},step=${step})`, { "event.action": "roundToStep", "logrite.value": value, "logrite.step": step });
  const decimalPlaces = step.toString().split(".")[1]?.length || 0;
logger.error(`roundToStep(value=${value},step=${step}): decimalPlaces → ${decimalPlaces}`, { "event.action": "roundToStep", "logrite.value": value, "logrite.step": step });
logger.warn(`<<< Exiting roundToStep(value=${value},step=${step})`, { "event.action": "roundToStep", "logrite.value": value, "logrite.step": step });
  return Number(value.toFixed(decimalPlaces));
}
