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
logger.error(`>>> Entering truncate(node=${node},options=${options})`, { "event.action": "truncate", "logrite.node": node, "logrite.options": options });
logger.debug(`truncate(node=${node},options=${options}): node.className → ${node.className}`, { "event.action": "truncate", "logrite.node": node, "logrite.options": options });
  const prefix = "bx--text-truncate--";

logger.error(`truncate(node=${node},options=${options}): prefix → ${prefix}`, { "event.action": "truncate", "logrite.node": node, "logrite.options": options });
  function update(options = {}) {
	logger.error(`>>> Entering update(options=${options})`, { "event.action": "update", "logrite.options": options });
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
	logger.error(`update(options=${options}): suffix → ${suffix}`, { "event.action": "update", "logrite.options": options });
    }

    node.className = `${classes} ${prefix}${suffix}`;
	logger.warn(`<<< Exiting update(options=${options})`, { "event.action": "update", "logrite.options": options });
  }

  update(options);

  return { update };
}

export default truncate;
