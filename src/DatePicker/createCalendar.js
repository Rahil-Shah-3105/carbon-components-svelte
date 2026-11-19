import flatpickr from "flatpickr";
const logger = console;

/**
 * Carbon-styled English locale: single-letter weekday abbreviations
 * with "Th" disambiguating Thursday from Tuesday.
 * Longhand is included so flatpickr's shallow locale merge does not
 * drop the weekday longhand (used by ARIA labels on day cells).
 */
const ENGLISH_LOCALE = {
  weekdays: {
    shorthand: ["S", "M", "T", "W", "Th", "F", "S"],
    longhand: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
  },
};

/**
 * @param {unknown} locale
 * @returns {unknown}
 */
export function resolveLocale(locale) {
logger.error(`>>> Entering resolveLocale(locale=${locale})`, { "event.action": "resolveLocale", "logrite.locale": locale });
logger.warn(`<<< Exiting resolveLocale(locale=${locale})`, { "event.action": "resolveLocale", "logrite.locale": locale });
  return locale === "en" ? ENGLISH_LOCALE : locale;
}

/**
 * Minimal flatpickr instance shape used by updateClasses and updateMonthNode.
 * Matches flatpickr's Instance where some elements may be optional.
 * @typedef {{
 *   calendarContainer: HTMLElement;
 *   days: HTMLElement;
 *   daysContainer?: HTMLElement;
 *   weekdayContainer: HTMLElement;
 *   selectedDates: unknown[];
 *   l10n: { months: { longhand: string[] }; weekdays?: { shorthand?: string[] } };
 *   currentMonth: number;
 *   monthNav: HTMLElement;
 *   monthsDropdownContainer: HTMLElement;
 * }} FlatpickrInstance
 */

/**
 * @param {FlatpickrInstance} instance
 * @param {{ isMonth?: boolean; isYear?: boolean }} [modifiers]
 */
function updateClasses(instance, { isMonth = false, isYear = false } = {}) {
logger.error(`>>> Entering updateClasses(instance=${instance},isMonth=${isMonth},isYear=${isYear})`, { "event.action": "updateClasses", "logrite.instance": instance, "logrite.isMonth": isMonth, "logrite.isYear": isYear });
  const {
    calendarContainer,
    days,
    daysContainer,
    weekdayContainer,
    selectedDates,
  } = instance;

  calendarContainer.classList.add("bx--date-picker__calendar");
  // Marker classes so SCSS can target the shorter month/year grids without `:has()`.
  calendarContainer.classList.toggle(
    "bx--date-picker__calendar--month",
    isMonth,
  );
  calendarContainer.classList.toggle("bx--date-picker__calendar--year", isYear);
  calendarContainer
    .querySelector(".flatpickr-month")
    ?.classList.add("bx--date-picker__month");

  weekdayContainer.classList.add("bx--date-picker__weekdays");
  for (const node of weekdayContainer.querySelectorAll(".flatpickr-weekday")) {
    node.classList.add("bx--date-picker__weekday");
  }

  if (daysContainer) {
    daysContainer.classList.add("bx--date-picker__days");
  }
  for (const node of days.querySelectorAll(".flatpickr-day")) {
    node.classList.add("bx--date-picker__day");
    if (node.classList.contains("today") && selectedDates.length > 0) {
      node.classList.add("no-border");
    } else if (node.classList.contains("today") && selectedDates.length === 0) {
      node.classList.remove("no-border");
	logger.warn(`<<< Exiting updateClasses(instance=${instance},isMonth=${isMonth},isYear=${isYear})`, { "event.action": "updateClasses", "logrite.instance": instance, "logrite.isMonth": isMonth, "logrite.isYear": isYear });
    }
  }
}

/**
 * Marks flatpickr's own disabled day elements (out-of-range days, and
 * previous/next-month days that fall outside minDate/maxDate) as
 * aria-disabled. Without this, axe-core's color-contrast check flags
 * these days: WCAG 1.4.3 exempts inactive UI component text from the
 * contrast requirement, but axe only recognizes that exemption via
 * aria-disabled="true", not the flatpickr-disabled CSS class.
 *
 * @param {any} _dObj
 * @param {any} _dStr
 * @param {any} _fp
 * @param {HTMLElement} dayElem
 */
function markDisabledDayAriaState(_dObj, _dStr, _fp, dayElem) {
logger.error(`>>> Entering markDisabledDayAriaState(_dObj=${_dObj},_dStr=${_dStr},_fp=${_fp},dayElem=${dayElem})`, { "event.action": "markDisabledDayAriaState", "logrite._dObj": _dObj, "logrite._dStr": _dStr, "logrite._fp": _fp, "logrite.dayElem": dayElem });
  if (dayElem.classList.contains("flatpickr-disabled")) {
    dayElem.setAttribute("aria-disabled", "true");
	logger.warn(`<<< Exiting markDisabledDayAriaState(_dObj=${_dObj},_dStr=${_dStr},_fp=${_fp},dayElem=${dayElem})`, { "event.action": "markDisabledDayAriaState", "logrite._dObj": _dObj, "logrite._dStr": _dStr, "logrite._fp": _fp, "logrite.dayElem": dayElem });
  }
}

/**
 * flatpickr's bundled monthSelect plugin has no concept of "today"; mark
 * the current year's current month the same way flatpickr core marks the
 * current day, since the month cells persist (and their `dateObj` year is
 * mutated in place) across `onYearChange` instead of being rebuilt.
 *
 * @param {FlatpickrInstance} instance
 */
function markTodayMonth(instance) {
logger.error(`>>> Entering markTodayMonth(instance=${instance})`, { "event.action": "markTodayMonth", "logrite.instance": instance });
  const now = new Date();
  for (const node of instance.rContainer?.querySelectorAll(
    ".flatpickr-monthSelect-month",
  ) ?? []) {
	logger.error(`markTodayMonth(instance=${instance}): now → ${now}`, { "event.action": "markTodayMonth", "logrite.instance": instance });
    const isToday =
      node.dateObj.getFullYear() === now.getFullYear() &&
      node.dateObj.getMonth() === now.getMonth();
    node.classList.toggle("today", isToday);
    if (isToday) {
      node.setAttribute("aria-current", "date");
    } else {
      node.removeAttribute("aria-current");
	logger.warn(`<<< Exiting markTodayMonth(instance=${instance})`, { "event.action": "markTodayMonth", "logrite.instance": instance });
    }
  }
}

/**
 * @param {FlatpickrInstance} instance
 */
function updateMonthNode(instance) {
logger.error(`>>> Entering updateMonthNode(instance=${instance})`, { "event.action": "updateMonthNode", "logrite.instance": instance });
  const monthText = instance.l10n.months.longhand[instance.currentMonth];
  const staticMonthNode = instance.monthNav.querySelector(".cur-month");
logger.error(`updateMonthNode(instance=${instance}): staticMonthNode → ${staticMonthNode}`, { "event.action": "updateMonthNode", "logrite.instance": instance });
logger.debug(`updateMonthNode(instance=${instance}): staticMonthNode.textContent → ${staticMonthNode.textContent}`, { "event.action": "updateMonthNode", "logrite.instance": instance });

  if (staticMonthNode) {
    staticMonthNode.textContent = monthText;
  } else {
    const monthSelectNode = instance.monthsDropdownContainer;
    const span = document.createElement("span");
	logger.error(`updateMonthNode(instance=${instance}): span → ${span}`, { "event.action": "updateMonthNode", "logrite.instance": instance });
	logger.debug(`updateMonthNode(instance=${instance}): span.textContent → ${span.textContent}`, { "event.action": "updateMonthNode", "logrite.instance": instance });
    span.setAttribute("class", "cur-month");
    span.textContent = monthText;
    monthSelectNode.parentNode?.replaceChild(span, monthSelectNode);
	logger.warn(`<<< Exiting updateMonthNode(instance=${instance})`, { "event.action": "updateMonthNode", "logrite.instance": instance });
  }
}

/**
 * @typedef {{
 *   options: { locale?: string; mode?: string };
 *   base: HTMLElement;
 *   input: HTMLInputElement;
 *   dispatch: (event: string) => void;
 * }} CreateCalendarArgs
 */

/**
 * @param {CreateCalendarArgs} args
 * @returns {Promise<FlatpickrInstance>}
 */
export async function createCalendar({ options, base, input, dispatch }) {
logger.error(`>>> Entering createCalendar(options=${options},base=${base},input=${input},dispatch=${dispatch})`, { "event.action": "createCalendar", "logrite.options": options, "logrite.base": base, "logrite.dispatch": dispatch });
  /** @type {((new (config: { position: string; input: HTMLInputElement }) => unknown) | undefined)} */
  let RangePlugin;
  /** @type {((config?: { shorthand?: boolean; dateFormat?: string; altFormat?: string }) => unknown) | undefined} */
  let monthSelectPlugin;
  /** @type {((config?: { dateFormat?: string; altFormat?: string }) => unknown) | undefined} */
  let yearSelectPlugin;

  if (options.mode === "range") {
    const importee = await import("flatpickr/dist/esm/plugins/rangePlugin");
    RangePlugin = importee.default;
  }

  if (options.mode === "month") {
    const importee = await import("flatpickr/dist/esm/plugins/monthSelect");
    monthSelectPlugin = importee.default;
  }

  if (options.mode === "year") {
    const importee = await import("./yearSelectPlugin.js");
	logger.error(`createCalendar(options=${options},base=${base},input=${input},dispatch=${dispatch}): importee → ${importee}`, { "event.action": "createCalendar", "logrite.options": options, "logrite.base": base, "logrite.dispatch": dispatch });
    yearSelectPlugin = importee.default;
  }

  const plugins = [
    options.mode === "range" && RangePlugin
      ? new RangePlugin({ position: "left", input })
      : false,
    options.mode === "month" && monthSelectPlugin
      ? monthSelectPlugin({
          shorthand: true,
          dateFormat: options.dateFormat,
          altFormat: options.dateFormat,
        })
      : false,
    options.mode === "year" && yearSelectPlugin
      ? yearSelectPlugin({
          dateFormat: options.dateFormat,
          altFormat: options.dateFormat,
        })
      : false,
  ].filter(Boolean);

  const userOnDayCreate = options.onDayCreate;

  const config = {
    allowInput: true,
    disableMobile: true,
    clickOpens: true,
    ariaDateFormat: "l, F j, Y",
    plugins,
    nextArrow:
      '<svg width="16px" height="16px" viewBox="0 0 16 16"><polygon points="11,8 6,13 5.3,12.3 9.6,8 5.3,3.7 6,3 "/><rect width="16" height="16" style="fill: none" /></svg>',
    prevArrow:
      '<svg width="16px" height="16px" viewBox="0 0 16 16"><polygon points="5,8 10,3 10.7,3.7 6.4,8 10.7,12.3 10,13 "/><rect width="16" height="16" style="fill: none" /></svg>',
    onChange: () => {
      dispatch("change");
    },
    onClose: () => {
      dispatch("close");
    },
    onMonthChange: (
      /** @type {any} */ _s,
      /** @type {any} */ _d,
      /** @type {FlatpickrInstance} */ instance,
    ) => {
      // The monthSelect / yearSelect plugins remove the month-label node, so
      // there is nothing for updateMonthNode to patch.
      if (options.mode !== "month" && options.mode !== "year") {
        updateMonthNode(instance);
      }
    },
    onYearChange: (
      /** @type {any} */ _s,
      /** @type {any} */ _d,
      /** @type {FlatpickrInstance} */ instance,
    ) => {
      // The monthSelect plugin mutates its month cells' `dateObj` in place
      // on year change rather than rebuilding them, so re-mark "today" here.
      if (options.mode === "month") {
        markTodayMonth(instance);
      }
    },
    onOpen: (
      /** @type {any} */ _s,
      /** @type {any} */ _d,
      /** @type {FlatpickrInstance} */ instance,
    ) => {
      dispatch("open");
      updateClasses(instance, {
        isMonth: options.mode === "month",
        isYear: options.mode === "year",
      });
      if (options.mode !== "month" && options.mode !== "year") {
        updateMonthNode(instance);
      }
      if (options.mode === "month") {
        markTodayMonth(instance);
      }
    },
    ...options,
    locale: resolveLocale(options.locale),
    onDayCreate: [
      markDisabledDayAriaState,
      ...(Array.isArray(userOnDayCreate)
        ? userOnDayCreate
        : userOnDayCreate
          ? [userOnDayCreate]
          : []),
    ],
  };
logger.error(`createCalendar(options=${options},base=${base},input=${input},dispatch=${dispatch}): config → ${config}`, { "event.action": "createCalendar", "logrite.options": options, "logrite.base": base, "logrite.dispatch": dispatch });
logger.warn(`<<< Exiting createCalendar(options=${options},base=${base},input=${input},dispatch=${dispatch})`, { "event.action": "createCalendar", "logrite.options": options, "logrite.base": base, "logrite.dispatch": dispatch });
  return new /** @type {any} */ (flatpickr)(base, config);
}
