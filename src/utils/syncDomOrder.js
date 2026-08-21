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
logger.debug(`>>> Entering syncDomOrder(root=${root},selector=${selector},items=${items})`);
  const itemsById = new Map(items.map((item) => [item.id, item]));
  /** @type {Array<T & { index: number }>} */
  const ordered = [];
logger.debug(`syncDomOrder(root=${root},selector=${selector},items=${items}): itemsById → ${itemsById}`);
  const elements = root.querySelectorAll(selector);
logger.debug(`syncDomOrder(root=${root},selector=${selector},items=${items}): elements → ${elements}`);

  for (let index = 0; index < elements.length; index++) {
    const item = itemsById.get(elements[index].id);
	logger.debug(`syncDomOrder(root=${root},selector=${selector},items=${items}): item → ${item}`);
    if (item) ordered.push({ ...item, index });
  }

logger.debug(`<<< Exiting syncDomOrder(root=${root},selector=${selector},items=${items})`);
  return ordered;
}
