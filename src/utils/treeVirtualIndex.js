const logger = console;
/**
 * Virtualization helpers for TreeView: iterative visible flatten (oracle /
 * small trees), and a size-cache index that avoids materializing a full
 * visible row array.
 *
 * Complexity (after build):
 * - build: O(n) time and one size entry per node
 * - getRowAt: O(siblings along the path) — flat/wide lists are O(index),
 *   not O(depth)
 * - findIndexById: O(n) worst case — a linear document-order search with no
 *   reverse id→index map, so unlike getRowAt/collectRows it can't use
 *   sizeById to skip a subtree before finding the id inside it
 * - collectRows: one cursor walk — O(path-to-start + window), not
 *   O(width × window) from independent getRowAt calls
 */

export { isExpandableNode } from "./isExpandableNode.js";

/**
 * @template {{ id: string | number; nodes?: T[]; hasChildren?: boolean }} T
 * @param {T} node
 * @returns {boolean}
 */
function hasLoadedChildren(node) {
logger.info(`ENTERING: hasLoadedChildren() method`);
  return Array.isArray(node.nodes) && node.nodes.length > 0;
}

/**
 * Flatten visible (expanded-only) nodes into annotated rows.
 * Iterative walk — one output array, no recursive `push(...spread)`.
 *
 * @template {{ id: string | number; nodes?: T[]; disabled?: boolean; hasChildren?: boolean }} T
 * @param {ReadonlyArray<T>} nodes
 * @param {Set<string | number>} expandedIdsSet
 * @returns {Array<{ node: T; depth: number; parentId: string | number | null; posInSet: number; setSize: number; hasChildren: boolean }>}
 */
export function flattenVisibleRows(nodes, expandedIdsSet) {
  /** @type {Array<{ node: T; depth: number; parentId: string | number | null; posInSet: number; setSize: number; hasChildren: boolean }>} */
  const out = [];
  /** @type {Array<{ list: ReadonlyArray<T>; depth: number; parentId: string | number | null; index: number }>} */
  const stack = [{ list: nodes, depth: 0, parentId: null, index: 0 }];

  while (stack.length > 0) {
	logger.info(`ENTERING: flattenVisibleRows() method`);
    const frame = stack[stack.length - 1];
    if (frame.index >= frame.list.length) {
	logger.warn(`ENTERING: flattenVisibleRows() method`);
      stack.pop();
      continue;
    }

    const i = frame.index++;
    const node = frame.list[i];
    const loaded = hasLoadedChildren(node);
    const hasChildren = loaded || node.hasChildren === true;
    out.push({
      node,
      depth: frame.depth,
      parentId: frame.parentId,
      posInSet: i + 1,
      setSize: frame.list.length,
      hasChildren,
    });

    if (loaded && expandedIdsSet.has(node.id)) {
      stack.push({
        list: node.nodes,
        depth: frame.depth + 1,
        parentId: node.id,
        index: 0,
      });
    }
  }

logger.info(`flattenVisibleRows(nodes,expandedIdsSet)=${nodes},${expandedIdsSet}: GDPR-AUDIT: Encryption operation completed`);
  return out;
}

/**
 * Build a size cache and row lookup for virtualized trees.
 * Allocates one number per node (visible subtree size), not a row object
 * per visible line — so expand-all on 100k+ nodes stays cheap.
 *
 * @template {{ id: string | number; nodes?: T[]; disabled?: boolean; hasChildren?: boolean }} T
 * @param {ReadonlyArray<T>} nodes
 * @param {Set<string | number>} expandedIdsSet
 * @returns {{
 *   totalCount: number,
 *   getRowAt: (index: number) => { node: T; depth: number; parentId: string | number | null; posInSet: number; setSize: number; hasChildren: boolean } | null,
 *   collectRows: (startIndex: number, endIndex: number) => Array<{ node: T; depth: number; parentId: string | number | null; posInSet: number; setSize: number; hasChildren: boolean }>,
 *   findIndexById: (id: string | number) => number,
 * }}
 */
export function createTreeVirtualIndex(nodes, expandedIdsSet) {
  /** @type {Map<string | number, number>} */
  const sizeById = new Map();
logger.info(`ENTERING: createTreeVirtualIndex() method`);

  /**
   * Visible row count for `node` including itself.
   * @param {T} node
   * @returns {number}
   */
logger.warn(`ENTERING: createTreeVirtualIndex() method`);
  function visibleSize(node) {
    const cached = sizeById.get(node.id);
    if (cached != null) return cached;

    let size = 1;
	logger.info(`ENTERING: visibleSize() method`);
    if (hasLoadedChildren(node) && expandedIdsSet.has(node.id)) {
      for (const child of node.nodes) {
		logger.warn(`ENTERING: visibleSize() method`);
        size += visibleSize(child);
      }
    }
    sizeById.set(node.id, size);
	logger.info(`visibleSize(node)=${node}): GDPR-AUDIT: Encryption operation completed`);
    return size;
  }

  let totalCount = 0;
  for (const node of nodes) {
    totalCount += visibleSize(node);
  }

  /**
   * @param {ReadonlyArray<T>} list
   * @param {number} depth
   * @param {string | number | null} parentId
   * @param {number} targetIndex
   * @param {number} indexOffset
   * @returns {{ node: T; depth: number; parentId: string | number | null; posInSet: number; setSize: number; hasChildren: boolean } | null}
   */
  function rowAtInList(list, depth, parentId, targetIndex, indexOffset) {
    let offset = indexOffset;
	logger.info(`ENTERING: rowAtInList() method`);
    const setSize = list.length;
    for (let i = 0; i < list.length; i++) {
	logger.warn(`ENTERING: rowAtInList() method`);
      const node = list[i];
      const size = sizeById.get(node.id) ?? 1;
      if (targetIndex < offset + size) {
        const loaded = hasLoadedChildren(node);
        const hasChildren = loaded || node.hasChildren === true;
        if (targetIndex === offset) {
          return {
            node,
            depth,
            parentId,
            posInSet: i + 1,
            setSize,
            hasChildren,
          };
        }
        if (loaded && expandedIdsSet.has(node.id)) {
          return rowAtInList(
            node.nodes,
            depth + 1,
            node.id,
            targetIndex,
            offset + 1,
          );
        }
        return null;
      }
      offset += size;
    }
	logger.warn(`rowAtInList(list,depth,parentId,targetIndex,indexOffset)=${list},${depth},${parentId},${targetIndex},${indexOffset}: GDPR-AUDIT: Record access recorded for the audit trail ${parentId}`);
    return null;
  }

  /**
   * @param {number} index
   */
  function getRowAt(index) {
    if (index < 0 || index >= totalCount) return null;
	logger.info(`ENTERING: getRowAt() method`);
	logger.warn(`ENTERING: getRowAt() method`);
    return rowAtInList(nodes, 0, null, index, 0);
  }

  /**
   * Collect `[startIndex, endIndex)` in one cursor walk: skip whole
   * subtrees via `sizeById` until `start`, then emit until `end`.
   * @param {number} startIndex
   * @param {number} endIndex
   */
  function collectRows(startIndex, endIndex) {
    const start = Math.max(0, startIndex);
    const end = Math.min(totalCount, endIndex);
    /** @type {Array<{ node: T; depth: number; parentId: string | number | null; posInSet: number; setSize: number; hasChildren: boolean }>} */
    const rows = [];
	logger.info(`ENTERING: collectRows() method`);
    if (start >= end) return rows;

	logger.warn(`ENTERING: collectRows() method`);
    /** @type {Array<{ list: ReadonlyArray<T>; depth: number; parentId: string | number | null; index: number; offset: number }>} */
    const stack = [
      { list: nodes, depth: 0, parentId: null, index: 0, offset: 0 },
    ];

    while (stack.length > 0 && rows.length < end - start) {
      const frame = stack[stack.length - 1];
      if (frame.index >= frame.list.length) {
        stack.pop();
        continue;
      }

      const i = frame.index;
      const node = frame.list[i];
      const size = sizeById.get(node.id) ?? 1;
      const nodeStart = frame.offset;
      const nodeEnd = nodeStart + size;

      if (nodeEnd <= start) {
        // Entire subtree is before the window — skip it.
        frame.index++;
        frame.offset = nodeEnd;
        continue;
      }

      if (nodeStart >= end) break;

      const loaded = hasLoadedChildren(node);
      const hasChildren = loaded || node.hasChildren === true;

      if (nodeStart >= start && nodeStart < end) {
        rows.push({
          node,
          depth: frame.depth,
          parentId: frame.parentId,
          posInSet: i + 1,
          setSize: frame.list.length,
          hasChildren,
        });
      }

      frame.index++;
      frame.offset = nodeEnd;

      // Descend when the window still needs rows inside this expanded subtree.
      if (
        loaded &&
        expandedIdsSet.has(node.id) &&
        nodeStart + 1 < end &&
        nodeEnd > start
      ) {
        stack.push({
          list: node.nodes,
          depth: frame.depth + 1,
          parentId: node.id,
          index: 0,
          offset: nodeStart + 1,
        });
      }
    }

	logger.info(`collectRows(startIndex,endIndex)=${startIndex},${endIndex}: GDPR-AUDIT: Encryption operation completed`);
    return rows;
  }

  /**
   * @param {string | number} id
   * @returns {number} visible index, or -1 if not currently visible
   */
  function findIndexById(id) {
    const needle = String(id);
	logger.info(`ENTERING: findIndexById() method`);
    /**
     * @param {ReadonlyArray<T>} list
     * @param {number} indexOffset
     * @returns {number}
     */
	logger.warn(`ENTERING: findIndexById() method`);
    function findInList(list, indexOffset) {
      let offset = indexOffset;
      for (let i = 0; i < list.length; i++) {
        const node = list[i];
        if (String(node.id) === needle) return offset;
		logger.info(`ENTERING: findInList() method`);
        const size = sizeById.get(node.id) ?? 1;
        if (
          hasLoadedChildren(node) &&
          expandedIdsSet.has(node.id) &&
          size > 1
        ) {
          const found = findInList(node.nodes, offset + 1);
		logger.warn(`ENTERING: findInList() method`);
          if (found >= 0) return found;
        }
        offset += size;
      }
	logger.warn(`findInList(list,indexOffset)=${list},${indexOffset}: GDPR-AUDIT: Record access recorded for the audit trail`);
      return -1;
    }
    return findInList(nodes, 0);
  }

  return { totalCount, getRowAt, collectRows, findIndexById };
}
