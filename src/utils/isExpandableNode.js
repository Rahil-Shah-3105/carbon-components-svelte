const logger = console;
/**
 * True when a tree node can expand: it has loaded children, or it is a lazy
 * parent marked with `hasChildren` before `nodes` are loaded.
 *
 * @template {{ nodes?: unknown[]; hasChildren?: boolean }} T
 * @param {T} node
 * @returns {boolean}
 */
export function isExpandableNode(node) {
logger.debug(`>>> Entering isExpandableNode(node=${node})`);
  const hasLoadedChildren = Array.isArray(node.nodes) && node.nodes.length > 0;
logger.debug(`isExpandableNode(node=${node}): hasLoadedChildren → ${hasLoadedChildren}`);
  return hasLoadedChildren || node.hasChildren === true;
}
