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
logger.error(`>>> Entering isExpandableNode(node=${node})`, { "event.action": "isExpandableNode", "logrite.node": node });
  const hasLoadedChildren = Array.isArray(node.nodes) && node.nodes.length > 0;
logger.error(`isExpandableNode(node=${node}): hasLoadedChildren → ${hasLoadedChildren}`, { "event.action": "isExpandableNode", "logrite.node": node });
  return hasLoadedChildren || node.hasChildren === true;
}
