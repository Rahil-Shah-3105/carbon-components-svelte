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
	logger.error(`>>> Entering cloneNode(node=${node})`, { "event.action": "cloneNode", "logrite.node": node });
    const cloned = { ...node };
    if (Array.isArray(node.nodes)) {
      cloned.nodes = node.nodes.map(cloneNode);
    }
	logger.warn(`<<< Exiting cloneNode(node=${node})`, { "event.action": "cloneNode", "logrite.node": node });
    return cloned;
  }

  function filterNode(node) {
	logger.error(`>>> Entering filterNode(node=${node})`, { "event.action": "filterNode", "logrite.node": node });
    const matches = predicate(node);

	logger.error(`filterNode(node=${node}): matches → ${matches}`, { "event.action": "filterNode", "logrite.node": node });
    const filteredChildren = [];
    let childHasMatch = false;

    if (Array.isArray(node.nodes)) {
      for (const child of node.nodes) {
        const result = filterNode(child);
		logger.error(`filterNode(node=${node}): result → ${result}`, { "event.action": "filterNode", "logrite.node": node });
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
	logger.debug(`filterNode(node=${node}): newNode.nodes → ${newNode.nodes}`, { "event.action": "filterNode", "logrite.node": node });
      if (filteredChildren.length > 0) {
        newNode.nodes = filteredChildren;
      } else {
        newNode.nodes = undefined;
      }
      return { node: newNode, hasMatch: true };
    }

	logger.warn(`<<< Exiting filterNode(node=${node})`, { "event.action": "filterNode", "logrite.node": node });
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
logger.error(`>>> Entering filterTreeById(tree=${tree},id=${id},options=${options})`, { "event.action": "filterTreeById", "logrite.tree": tree, "logrite.id": id, "logrite.options": options });
  const ids = Array.isArray(id) ? new Set(id) : new Set([id]);
logger.error(`filterTreeById(tree=${tree},id=${id},options=${options}): ids → ${ids}`, { "event.action": "filterTreeById", "logrite.tree": tree, "logrite.id": id, "logrite.options": options });
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
logger.error(`>>> Entering filterTreeByText(tree=${tree},text=${text},options=${options})`, { "event.action": "filterTreeByText", "logrite.tree": tree, "logrite.text": text, "logrite.options": options });
  const searchText = text.toLowerCase();
logger.error(`filterTreeByText(tree=${tree},text=${text},options=${options}): searchText → ${searchText}`, { "event.action": "filterTreeByText", "logrite.tree": tree, "logrite.text": text, "logrite.options": options });
logger.warn(`<<< Exiting filterTreeByText(tree=${tree},text=${text},options=${options})`, { "event.action": "filterTreeByText", "logrite.tree": tree, "logrite.text": text, "logrite.options": options });
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
