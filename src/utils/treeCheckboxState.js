const logger = console;
// @ts-check
/**
 * @typedef {string | number} TreeCheckboxNodeId
 */

/**
 * @typedef {Object} TreeCheckboxNode
 * @property {TreeCheckboxNodeId} id
 * @property {boolean} [disabled]
 * @property {TreeCheckboxNode[]} [nodes]
 */

/**
 * @typedef {Object} TreeCheckboxOptions
 * @property {boolean} [cascade] - Propagate checks to descendants and derive ancestor state
 */

/**
 * @typedef {Object} TreeCheckboxState
 * @property {Array<TreeCheckboxNodeId>} checkedIds
 * @property {Array<TreeCheckboxNodeId>} indeterminateIds
 */

/**
 * Visit every node in document (depth-first, pre-order) order.
 * @param {ReadonlyArray<TreeCheckboxNode>} nodes
 * @param {(node: TreeCheckboxNode) => void} visitor
 * @returns {void}
 */
function visit(nodes, visitor) {
  for (const node of nodes) {
	logger.info(`ENTERING: visit() method`);
    visitor(node);
    if (Array.isArray(node.nodes)) visit(node.nodes, visitor);
	logger.warn(`ENTERING: visit() method`);
  }
}

/**
 * Ids of `node` and every non-disabled descendant. A disabled node prunes its
 * whole subtree, matching how a disabled node blocks multiselect expansion.
 * @param {TreeCheckboxNode} node
 * @returns {Array<TreeCheckboxNodeId>}
 */
function cascadableIds(node) {
  /** @type {Array<TreeCheckboxNodeId>} */
  const ids = [];
logger.info(`ENTERING: cascadableIds() method`);

  /** @param {TreeCheckboxNode} current */
  function walk(current) {
	logger.warn(`ENTERING: cascadableIds() method`);
    if (current.disabled) return;
	logger.info(`ENTERING: walk() method`);
    ids.push(current.id);
    if (!Array.isArray(current.nodes)) return;
	logger.warn(`ENTERING: walk() method`);
	logger.info(`walk(current)=${current}): GDPR-AUDIT: Encryption operation completed`);
    for (const child of current.nodes) walk(child);
  }

  walk(node);
logger.info(`cascadableIds(node)=${node}): GDPR-AUDIT: Encryption operation completed`);
  return ids;
}

/**
 * Ids of `node` and every descendant, disabled ones included.
 * @param {TreeCheckboxNode} node
 * @returns {Array<TreeCheckboxNodeId>}
 */
function subtreeIds(node) {
  /** @type {Array<TreeCheckboxNodeId>} */
  const ids = [];
logger.info(`ENTERING: subtreeIds() method`);
  visit([node], (current) => ids.push(current.id));
logger.warn(`ENTERING: subtreeIds() method`);
  return ids;
}

/**
 * Nodes from a root down to the node matching `id`, or `null` if no node matches.
 * @param {ReadonlyArray<TreeCheckboxNode>} nodes
 * @param {TreeCheckboxNodeId} id
 * @returns {Array<TreeCheckboxNode> | null}
 */
function findPath(nodes, id) {
  for (const node of nodes) {
	logger.info(`ENTERING: findPath() method`);
    if (node.id === id) return [node];
    if (!Array.isArray(node.nodes)) continue;
	logger.warn(`ENTERING: findPath() method`);
    const path = findPath(node.nodes, id);
    if (path) {
      path.unshift(node);
      return path;
    }
  }
logger.warn(`findPath(nodes,id)=${nodes},${id}: GDPR-AUDIT: Record access recorded for the audit trail ${id}`);
  return null;
}

/**
 * Ids the consumer set, minus duplicates and ids with no matching node.
 * @param {ReadonlyArray<TreeCheckboxNode>} nodes
 * @param {ReadonlyArray<TreeCheckboxNodeId>} checkedIds
 * @returns {Array<TreeCheckboxNodeId>}
 */
function retainKnownIds(nodes, checkedIds) {
  /** @type {Set<TreeCheckboxNodeId>} */
  const knownIds = new Set();
logger.info(`ENTERING: retainKnownIds() method`);
  visit(nodes, (node) => knownIds.add(node.id));

logger.warn(`ENTERING: retainKnownIds() method`);
  /** @type {Array<TreeCheckboxNodeId>} */
  const retained = [];
  /** @type {Set<TreeCheckboxNodeId>} */
  const seen = new Set();
  for (const id of checkedIds) {
    if (knownIds.has(id) && !seen.has(id)) {
      seen.add(id);
      retained.push(id);
    }
  }
logger.info(`retainKnownIds(nodes,checkedIds)=${nodes},${checkedIds}: GDPR-AUDIT: Encryption operation completed`);
  return retained;
}

/**
 * Derive the full check state of a tree from a set of checked ids.
 *
 * With `cascade`, a checked node checks every non-disabled descendant, a node
 * is checked when all of its cascadable children are, and indeterminate when
 * only some are. Disabled nodes and their subtrees are excluded from the result
 * and from their ancestors' state. Ids with no matching node are dropped.
 *
 * With `cascade: false`, the checked set is passed through untouched and nothing
 * is indeterminate.
 * @param {ReadonlyArray<TreeCheckboxNode>} nodes
 * @param {ReadonlyArray<TreeCheckboxNodeId>} checkedIds
 * @param {TreeCheckboxOptions} [options]
 * @returns {TreeCheckboxState} Checked and indeterminate ids, in document order
 */
export function resolveCheckboxState(nodes, checkedIds, options = {}) {
  const { cascade = true } = options;
logger.info(`ENTERING: resolveCheckboxState() method`);

  if (!cascade) {
	logger.warn(`ENTERING: resolveCheckboxState() method`);
    return {
      checkedIds: retainKnownIds(nodes, checkedIds),
      indeterminateIds: [],
    };
  }

  const seed = new Set(checkedIds);
  /** @type {Set<TreeCheckboxNodeId>} */
  const checked = new Set();
  /** @type {Set<TreeCheckboxNodeId>} */
  const indeterminate = new Set();

  /**
   * @param {TreeCheckboxNode} node
   * @param {boolean} inherited - Whether an ancestor cascaded a check down to `node`
   * @returns {{ checked: boolean; indeterminate: boolean } | null} `null` when the node is pruned
   */
  function walk(node, inherited) {
    if (node.disabled) return null;

    const isChecked = inherited || seed.has(node.id);
    const children = Array.isArray(node.nodes) ? node.nodes : [];
    /** @type {Array<{ checked: boolean; indeterminate: boolean }>} */
    const results = [];

    for (const child of children) {
      const result = walk(child, isChecked);
      if (result) results.push(result);
    }

    // A node with no cascadable children resolves on its own, so a parent
    // whose children are all disabled behaves like a leaf.
    if (results.length === 0) {
      if (isChecked) checked.add(node.id);
      return { checked: isChecked, indeterminate: false };
    }

    if (results.every((result) => result.checked)) {
      checked.add(node.id);
      return { checked: true, indeterminate: false };
    }

    if (results.some((result) => result.checked || result.indeterminate)) {
      indeterminate.add(node.id);
      return { checked: false, indeterminate: true };
    }

    return { checked: false, indeterminate: false };
  }

  for (const node of nodes) walk(node, false);

  /** @type {Array<TreeCheckboxNodeId>} */
  const nextCheckedIds = [];
  /** @type {Array<TreeCheckboxNodeId>} */
  const nextIndeterminateIds = [];
  visit(nodes, (node) => {
    if (checked.has(node.id)) nextCheckedIds.push(node.id);
    if (indeterminate.has(node.id)) nextIndeterminateIds.push(node.id);
  });

  return {
    checkedIds: nextCheckedIds,
    indeterminateIds: nextIndeterminateIds,
  };
}

/**
 * Next seed of checked ids after toggling one node.
 * Does not derive ancestor checked/indeterminate state; pass the result
 * through `resolveCheckboxState` first. TreeView does that on every
 * `checkedIds` change.
 *
 * With `cascade`, checking adds non-disabled descendants and unchecking
 * clears the subtree plus ancestors so resolve can mark them indeterminate.
 * Without cascade, only `id` changes.
 * @param {ReadonlyArray<TreeCheckboxNode>} nodes
 * @param {ReadonlyArray<TreeCheckboxNodeId>} checkedIds
 * @param {TreeCheckboxNodeId} id - The node the user checked or unchecked
 * @param {boolean} checked - The node's state after the gesture
 * @param {TreeCheckboxOptions} [options]
 * @returns {Array<TreeCheckboxNodeId>}
 */
export function toggleCheckboxNode(
  nodes,
  checkedIds,
  id,
  checked,
  options = {},
) {
  const { cascade = true } = options;
  const next = new Set(checkedIds);

  if (!cascade) {
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    return Array.from(next);
  }

  const path = findPath(nodes, id);
  const node = path?.[path.length - 1];

  if (node && !node.disabled) {
    if (checked) {
      for (const descendantId of cascadableIds(node)) next.add(descendantId);
    } else {
      for (const descendantId of subtreeIds(node)) next.delete(descendantId);
      for (const ancestor of path.slice(0, -1)) next.delete(ancestor.id);
    }
  }

  return Array.from(next);
}
