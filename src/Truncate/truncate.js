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
logger.debug(`>>> Entering truncate(node=${node},options=${options})`);
  const prefix = "bx--text-truncate--";

logger.debug(`truncate(node=${node},options=${options}): prefix → ${prefix}`);
  function update(options = {}) {
	logger.debug(`>>> Entering update(options=${options})`);
    const lines = options.lines ?? 1;
    const multiline = lines > 1;

    const classes = [...node.classList]
      .filter((name) => !name.startsWith(prefix))
      .join(" ");

    let suffix;

    if (multiline) {
      suffix = "multiline";
      node.style.setProperty("--ccs-truncate-lines", String(lines));
    } else {
      suffix = options.clamp === "front" ? "front" : "end";
      node.style.removeProperty("--ccs-truncate-lines");
	logger.debug(`update(options=${options}): suffix → ${suffix}`);
    }

	logger.debug(`<<< Exiting update(options=${options})`);
    node.className = `${classes} ${prefix}${suffix}`;
  }

logger.debug(`truncate(node=${node},options=${options}): node.className → ${node.className}`);
  update(options);

logger.debug(`<<< Exiting truncate(node=${node},options=${options})`);
  return { update };
}

export default truncate;
