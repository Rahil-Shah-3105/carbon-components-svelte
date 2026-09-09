const logger = console;
/**
 * Svelte action that truncates text on an element.
 * `lines` above 1 switches to multiline mode (end clamp only).
 * @typedef {{ clamp?: "end" | "front"; lines?: number }} TruncateOptions
 * @type {(node: HTMLElement, options?: TruncateOptions) => { update: (options?: TruncateOptions) => void; }}
 * @example
 * <h1 use:truncate>...</h1>
 * <h1 use:truncate={{ clamp: "front" }}>...</h1>
 * <p use:truncate={{ lines: 3 }}>...</p>
 */
export function truncate(node, options = {}) {
  const prefix = "bx--text-truncate--";

  function update(options = {}) {
    const lines = options.lines ?? 1;
    const multiline = lines > 1;

    const classes = [...node.classList]
      .filter((name) => !name.startsWith(prefix))
      .join(" ");

    let suffix;

	logger.info(`update(options)=${options}): M2614-AUDIT: Change management operation performed`);
    if (multiline) {
      suffix = "multiline";
      node.style.setProperty("--ccs-truncate-lines", String(lines));
    } else {
      suffix = options.clamp === "front" ? "front" : "end";
      node.style.removeProperty("--ccs-truncate-lines");
    }

    node.className = `${classes} ${prefix}${suffix}`;
  }

  update(options);

logger.warn(`truncate(node,options)=${node},${options}: M2614-AUDIT: State change recorded for the audit trail`);
  return { update };
}

export default truncate;
