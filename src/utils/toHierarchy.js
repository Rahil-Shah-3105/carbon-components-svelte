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
logger.debug(`>>> Entering toHierarchy(flatArray=${flatArray},getParentId=${getParentId})`);
  /** @type {NodeLike[]} */
  const tree = [];
  const childrenOf = new Map();
logger.debug(`toHierarchy(flatArray=${flatArray},getParentId=${getParentId}): childrenOf → ${childrenOf}`);
  const itemsMap = new Map(flatArray.map((item) => [item.id, item]));
logger.debug(`toHierarchy(flatArray=${flatArray},getParentId=${getParentId}): itemsMap → ${itemsMap}`);

  for (const item of flatArray) {
    const parentId = getParentId(item);
	logger.debug(`toHierarchy(flatArray=${flatArray},getParentId=${getParentId}): parentId → ${parentId}`);

    const children = childrenOf.get(item.id);
	logger.debug(`toHierarchy(flatArray=${flatArray},getParentId=${getParentId}): children → ${children}`);
    if (children) {
      item.nodes = children;
	logger.debug(`toHierarchy(flatArray=${flatArray},getParentId=${getParentId}): item.nodes → ${item.nodes}`);
    }

    const parentExists = parentId && itemsMap.has(parentId);
	logger.debug(`toHierarchy(flatArray=${flatArray},getParentId=${getParentId}): parentExists → ${parentExists}`);

    if (parentId && parentExists) {
      if (!childrenOf.has(parentId)) {
        childrenOf.set(parentId, []);
      }
      /** @type {NodeLike[]} */ (childrenOf.get(parentId)).push(item);

      const parent = itemsMap.get(parentId);
	logger.debug(`toHierarchy(flatArray=${flatArray},getParentId=${getParentId}): parent → ${parent}`);
      if (parent) {
        parent.nodes = childrenOf.get(parentId);
      }
    } else {
      tree.push(item);
    }
  }

logger.debug(`<<< Exiting toHierarchy(flatArray=${flatArray},getParentId=${getParentId})`);
  return tree;
}

export default toHierarchy;
