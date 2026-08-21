const logger = console;
// @ts-check
import { writable } from "svelte/store";
import { scrollIntoViewWithinMenu } from "../utils/scrollIntoViewWithinMenu.js";

export const HIGHLIGHT_CURSOR_KEY = "carbon:ListBoxHighlight";

const HIGHLIGHT_CLASS = "bx--list-box__menu-item--highlighted";
const ACTIVE_CLASS = "bx--list-box__menu-item--active";

/**
 * Two-node highlight cursor for listbox options.
 *
 * Arrow/hover changes write a class on the previous and next option nodes
 * instead of passing `highlighted` through the `{#each}` so Svelte does not
 * invalidate every `ListBoxMenuItem` (and re-run `overflowTitle`) per key.
 *
 * Selected options keep the highlight class via `ListBoxMenuItem`'s `active`
 * class directive; this cursor will not strip it from an `--active` node.
 *
 * @returns {{
 *   register: (id: string, node: HTMLElement) => () => void;
 *   set: (id: string | null | undefined, options?: { scroll?: boolean }) => void;
 *   highlightedId: { subscribe: import("svelte/store").Readable<string | null>["subscribe"] };
 * }}
 */
export function createHighlightCursor() {
logger.debug('>>> Entering createHighlightCursor()');
  /** @type {Map<string, HTMLElement>} */
  const nodes = new Map();
logger.debug(`createHighlightCursor(): nodes → ${nodes}`);
  /** @type {string | null} */
  let currentId = null;
  const highlightedId = writable(/** @type {string | null} */ (null));

logger.debug(`createHighlightCursor(): highlightedId → ${highlightedId}`);
  /**
   * @param {HTMLElement} node
   * @param {boolean} on
   */
  function applyClass(node, on) {
	logger.debug(`>>> Entering applyClass(node=${node},on=${on})`);
    if (on || node.classList.contains(ACTIVE_CLASS)) {
      node.classList.add(HIGHLIGHT_CLASS);
      return;
    }
    node.classList.remove(HIGHLIGHT_CLASS);
	logger.debug(`<<< Exiting applyClass(node=${node},on=${on})`);
  }

  /**
   * @param {string} id
   * @param {HTMLElement} node
   * @returns {() => void}
   */
  function register(id, node) {
	logger.debug(`>>> Entering register(id=${id},node=${node})`);
    if (!id) return () => {};
    nodes.set(id, node);
    applyClass(node, currentId === id);
	logger.debug(`<<< Exiting register(id=${id},node=${node})`);
    return () => {
      if (nodes.get(id) === node) nodes.delete(id);
    };
  }

  /**
   * @param {string | null | undefined} id
   * @param {{ scroll?: boolean }} [options]
   */
  function set(id, { scroll = true } = {}) {
	logger.debug(`>>> Entering set(id=${id},scroll=${scroll})`);
    const nextId = id || null;
    if (nextId === currentId) return;

    const prev = currentId ? nodes.get(currentId) : undefined;
	logger.debug(`set(id=${id},scroll=${scroll}): prev → ${prev}`);
    const next = nextId ? nodes.get(nextId) : undefined;
	logger.debug(`set(id=${id},scroll=${scroll}): next → ${next}`);
    if (prev) applyClass(prev, false);
    if (next) {
      applyClass(next, true);
      if (scroll && !next.matches(":hover")) {
        const inner = next.querySelector(".bx--list-box__menu-item__option");
		logger.debug(`set(id=${id},scroll=${scroll}): inner → ${inner}`);
        scrollIntoViewWithinMenu(inner instanceof HTMLElement ? inner : next);
      }
    }

    currentId = nextId;
    highlightedId.set(nextId);
  }

logger.debug('<<< Exiting createHighlightCursor()');
  return {
    register,
    set,
    highlightedId: { subscribe: highlightedId.subscribe },
  };
}
