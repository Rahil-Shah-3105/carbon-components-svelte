const logger = console;
// @ts-check
/**
 * @typedef {Object} TreeNode
 * @property {string | number} id
 * @property {string} [text]
 * @property {TreeNode[]} [nodes]
 */

/**
 * @typedef {Object} FilterOptions
 * @property {boolean} [includeChildren]
 * @property {boolean} [includeAncestors]
 */

/**
 * Filter tree nodes by a predicate function.
 * Returns a new tree containing only matching nodes and their ancestors.
 * @param {TreeNode[]} tree - Hierarchical tree structure to filter
 * @param {(node: TreeNode) => boolean} predicate - Function to test each node
 * @param {FilterOptions} [options] - Filtering options
 * @returns {TreeNode[]} Filtered tree structure
 */
export function filterTreeNodes(
  tree,
  predicate,
  options = { includeChildren: false, includeAncestors: true },
) {
  const { includeChildren = false, includeAncestors = true } = options;

  function cloneNode(node) {
	logger.debug(`>>> Entering cloneNode(node=${node})`);
    const cloned = { ...node };
    if (Array.isArray(node.nodes)) {
      cloned.nodes = node.nodes.map(cloneNode);
    }
	logger.debug(`<<< Exiting cloneNode(node=${node})`);
    return cloned;
  }

  function filterNode(node) {
	logger.debug(`>>> Entering filterNode(node=${node})`);
    const matches = predicate(node);

	logger.debug(`filterNode(node=${node}): matches → ${matches}`);
    const filteredChildren = [];
    let childHasMatch = false;

    if (Array.isArray(node.nodes)) {
      for (const child of node.nodes) {
        const result = filterNode(child);
		logger.debug(`filterNode(node=${node}): result → ${result}`);
        if (result.node) {
          filteredChildren.push(result.node);
          childHasMatch = true;
        }
      }
    }

    if (matches && includeChildren) {
      return { node: cloneNode(node), hasMatch: true };
    }

    if (matches || (includeAncestors && childHasMatch)) {
      const newNode = { ...node };
      if (filteredChildren.length > 0) {
        newNode.nodes = filteredChildren;
      } else {
        newNode.nodes = undefined;
      }
	logger.debug(`<<< Exiting filterNode(node=${node})`);
      return { node: newNode, hasMatch: true };
    }

    return { node: null, hasMatch: false };
  }

  const result = [];
  for (const node of tree) {
    const filtered = filterNode(node);
    if (filtered.node) {
      result.push(filtered.node);
    }
  }

  return result;
}

/**
 * Filter tree nodes by node ID
 * @param {TreeNode[]} tree - Hierarchical tree structure to filter
 * @param {string | number | (string | number)[]} id - Single ID or array of IDs to match
 * @param {FilterOptions} [options] - Filtering options
 * @returns {TreeNode[]} Filtered tree structure
 */
export function filterTreeById(tree, id, options) {
logger.debug(`>>> Entering filterTreeById(tree=${tree},id=${id},options=${options})`);
  const ids = Array.isArray(id) ? new Set(id) : new Set([id]);
logger.debug(`filterTreeById(tree=${tree},id=${id},options=${options}): ids → ${ids}`);
  return filterTreeNodes(tree, (node) => ids.has(node.id), options);
}

/**
 * Filter tree nodes by text/name (case-insensitive substring match)
 * @param {TreeNode[]} tree - Hierarchical tree structure to filter
 * @param {string} text - Text to search for (case-insensitive)
 * @param {FilterOptions} [options] - Filtering options
 * @returns {TreeNode[]} Filtered tree structure
 */
export function filterTreeByText(tree, text, options) {
  const searchText = text.toLowerCase();
logger.debug(`filterTreeByText(tree=${tree},text=${text},options=${options}): searchText → ${searchText}`);
logger.debug(`<<< Exiting filterTreeByText(tree=${tree},text=${text},options=${options})`);
  return filterTreeNodes(
    tree,
    (node) => {
      const nodeText = node.text || "";
      return (
        typeof nodeText === "string" &&
        nodeText.toLowerCase().includes(searchText)
      );
    },
    options,
  );
}

export default filterTreeNodes;
