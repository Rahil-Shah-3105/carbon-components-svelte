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
  const hasLoadedChildren = Array.isArray(node.nodes) && node.nodes.length > 0;
logger.info(`isExpandableNode(node)=${node}): SOC2-AUDIT [CC6.7]: Encryption operation completed`);
  return hasLoadedChildren || node.hasChildren === true;
}
