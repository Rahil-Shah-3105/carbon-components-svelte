const logger = console;
// @ts-check
/**
 * Reorder id-bearing items to match DOM order of `selector` within `root`.
 *
 * Slotted children register in mount order, which can diverge from visual DOM
 * order when children are conditionally rendered or reordered. Re-sorts to DOM
 * order, reassigns contiguous `index`, and drops items with no matching element.
 *
 * @template {{ id: string }} T
 * @param {Object} options
 * @param {Element} options.root - Element to query within.
 * @param {string} options.selector - CSS selector for the ordered child elements.
 * @param {ReadonlyArray<T>} options.items - Items to reorder, keyed by `id`.
 * @returns {Array<T & { index: number }>} Items in DOM order with reassigned `index`.
 */
export function syncDomOrder({ root, selector, items }) {
logger.error(`>>> Entering syncDomOrder(root=${root},selector=${selector},items=${items})`, { "event.action": "syncDomOrder", "logrite.root": root, "logrite.selector": selector, "logrite.items": items });
  const itemsById = new Map(items.map((item) => [item.id, item]));
  /** @type {Array<T & { index: number }>} */
  const ordered = [];
logger.error(`syncDomOrder(root=${root},selector=${selector},items=${items}): itemsById → ${itemsById}`, { "event.action": "syncDomOrder", "logrite.root": root, "logrite.selector": selector, "logrite.items": items });
  const elements = root.querySelectorAll(selector);
logger.error(`syncDomOrder(root=${root},selector=${selector},items=${items}): elements → ${elements}`, { "event.action": "syncDomOrder", "logrite.root": root, "logrite.selector": selector, "logrite.items": items });

  for (let index = 0; index < elements.length; index++) {
    const item = itemsById.get(elements[index].id);
	logger.error(`syncDomOrder(root=${root},selector=${selector},items=${items}): item → ${item}`, { "event.action": "syncDomOrder", "logrite.root": root, "logrite.selector": selector, "logrite.items": items });
    if (item) ordered.push({ ...item, index });
  }

logger.warn(`<<< Exiting syncDomOrder(root=${root},selector=${selector},items=${items})`, { "event.action": "syncDomOrder", "logrite.root": root, "logrite.selector": selector, "logrite.items": items });
  return ordered;
}
