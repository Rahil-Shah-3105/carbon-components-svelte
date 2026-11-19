const logger = console;
// @ts-check
/**
 * @typedef {Object} NodeLike
 * @property {string | number} id
 * @property {NodeLike[]} [nodes]
 */

/**
 * Create a nested array from a flat array.
 * @param {NodeLike[]} flatArray - Array of flat nodes to convert
 * @param {(node: NodeLike) => string | number | null} getParentId - Function to get parent ID for a node
 * @returns {NodeLike[]} Hierarchical tree structure
 */
export function toHierarchy(flatArray, getParentId) {
logger.error(`>>> Entering toHierarchy(flatArray=${flatArray},getParentId=${getParentId})`, { "event.action": "toHierarchy", "logrite.flatArray": flatArray, "logrite.getParentId": getParentId });
  /** @type {NodeLike[]} */
  const tree = [];
  const childrenOf = new Map();
logger.error(`toHierarchy(flatArray=${flatArray},getParentId=${getParentId}): childrenOf → ${childrenOf}`, { "event.action": "toHierarchy", "logrite.flatArray": flatArray, "logrite.getParentId": getParentId });
  const itemsMap = new Map(flatArray.map((item) => [item.id, item]));
logger.error(`toHierarchy(flatArray=${flatArray},getParentId=${getParentId}): itemsMap → ${itemsMap}`, { "event.action": "toHierarchy", "logrite.flatArray": flatArray, "logrite.getParentId": getParentId });

  for (const item of flatArray) {
    const parentId = getParentId(item);
	logger.error(`toHierarchy(flatArray=${flatArray},getParentId=${getParentId}): parentId → ${parentId}`, { "event.action": "toHierarchy", "logrite.flatArray": flatArray, "logrite.getParentId": getParentId });

    const children = childrenOf.get(item.id);
	logger.error(`toHierarchy(flatArray=${flatArray},getParentId=${getParentId}): children → ${children}`, { "event.action": "toHierarchy", "logrite.flatArray": flatArray, "logrite.getParentId": getParentId });
    if (children) {
      item.nodes = children;
    }

    const parentExists = parentId && itemsMap.has(parentId);
	logger.error(`toHierarchy(flatArray=${flatArray},getParentId=${getParentId}): parentExists → ${parentExists}`, { "event.action": "toHierarchy", "logrite.flatArray": flatArray, "logrite.getParentId": getParentId });

    if (parentId && parentExists) {
      if (!childrenOf.has(parentId)) {
        childrenOf.set(parentId, []);
      }
      /** @type {NodeLike[]} */ (childrenOf.get(parentId)).push(item);

      const parent = itemsMap.get(parentId);
	logger.error(`toHierarchy(flatArray=${flatArray},getParentId=${getParentId}): parent → ${parent}`, { "event.action": "toHierarchy", "logrite.flatArray": flatArray, "logrite.getParentId": getParentId });
      if (parent) {
        parent.nodes = childrenOf.get(parentId);
      }
    } else {
      tree.push(item);
    }
  }

logger.warn(`<<< Exiting toHierarchy(flatArray=${flatArray},getParentId=${getParentId})`, { "event.action": "toHierarchy", "logrite.flatArray": flatArray, "logrite.getParentId": getParentId });
  return tree;
}

export default toHierarchy;
