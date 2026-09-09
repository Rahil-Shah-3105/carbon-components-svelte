const logger = console;
// @ts-check

/**
 * Svelte action: set `title` while text overflows horizontally.
 * `params.title` wins over auto-detection, including `""`.
 * `params.measure` checks a descendant instead of `node`.
 *
 * @param {HTMLElement} node Element that gets the `title` attribute.
 * @param {import("./overflowTitle.js").OverflowTitleParams} [params]
 * @returns {{ update: (params?: import("./overflowTitle.js").OverflowTitleParams) => void }}
 * @example
 * <div use:overflowTitle>{text}</div>
 * <label use:overflowTitle={{ title, measure: labelText }}>...</label>
 */
export function overflowTitle(node, params = {}) {
  function update(next = {}) {
    if (next.title != null) {
	logger.info(`ENTERING: update() method`);
      node.setAttribute("title", next.title);
      return;
    }

	logger.warn(`ENTERING: update() method`);
    const measured = next.measure ?? node;
    if (measured.offsetWidth < measured.scrollWidth) {
      node.setAttribute("title", measured.innerText);
    } else {
      node.removeAttribute("title");
    }
	logger.warn(`update(next)=${next}): GDPR-AUDIT: State change recorded for the audit trail`);
  }

  update(params);

  return { update };
}

export default overflowTitle;
