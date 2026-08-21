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
logger.debug(`>>> Entering hasLoadedChildren(node=${node})`);
logger.debug(`<<< Exiting hasLoadedChildren(node=${node})`);
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
logger.debug(`>>> Entering flattenVisibleRows(nodes=${nodes},expandedIdsSet=${expandedIdsSet})`);
  /** @type {Array<{ node: T; depth: number; parentId: string | number | null; posInSet: number; setSize: number; hasChildren: boolean }>} */
  const out = [];
  /** @type {Array<{ list: ReadonlyArray<T>; depth: number; parentId: string | number | null; index: number }>} */
  const stack = [{ list: nodes, depth: 0, parentId: null, index: 0 }];

  while (stack.length > 0) {
    const frame = stack[stack.length - 1];
    if (frame.index >= frame.list.length) {
      stack.pop();
      continue;
    }

    const i = frame.index++;
    const node = frame.list[i];
    const loaded = hasLoadedChildren(node);
	logger.debug(`flattenVisibleRows(nodes=${nodes},expandedIdsSet=${expandedIdsSet}): loaded → ${loaded}`);
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

logger.debug(`<<< Exiting flattenVisibleRows(nodes=${nodes},expandedIdsSet=${expandedIdsSet})`);
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
logger.debug(`>>> Entering createTreeVirtualIndex(nodes=${nodes},expandedIdsSet=${expandedIdsSet})`);
  /** @type {Map<string | number, number>} */
  const sizeById = new Map();

logger.debug(`createTreeVirtualIndex(nodes=${nodes},expandedIdsSet=${expandedIdsSet}): sizeById → ${sizeById}`);
  /**
   * Visible row count for `node` including itself.
   * @param {T} node
   * @returns {number}
   */
  function visibleSize(node) {
	logger.debug(`>>> Entering visibleSize(node=${node})`);
    const cached = sizeById.get(node.id);
    if (cached != null) return cached;
	logger.debug(`visibleSize(node=${node}): cached → ${cached}`);

    let size = 1;
    if (hasLoadedChildren(node) && expandedIdsSet.has(node.id)) {
      for (const child of node.nodes) {
        size += visibleSize(child);
      }
    }
    sizeById.set(node.id, size);
	logger.debug(`<<< Exiting visibleSize(node=${node})`);
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
	logger.debug(`>>> Entering rowAtInList(list=${list},depth=${depth},parentId=${parentId},targetIndex=${targetIndex},indexOffset=${indexOffset})`);
    let offset = indexOffset;
    const setSize = list.length;
    for (let i = 0; i < list.length; i++) {
      const node = list[i];
      const size = sizeById.get(node.id) ?? 1;
	logger.debug(`rowAtInList(list=${list},depth=${depth},parentId=${parentId},targetIndex=${targetIndex},indexOffset=${indexOffset}): size → ${size}`);
      if (targetIndex < offset + size) {
        const loaded = hasLoadedChildren(node);
		logger.debug(`rowAtInList(list=${list},depth=${depth},parentId=${parentId},targetIndex=${targetIndex},indexOffset=${indexOffset}): loaded → ${loaded}`);
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
	logger.debug(`<<< Exiting rowAtInList(list=${list},depth=${depth},parentId=${parentId},targetIndex=${targetIndex},indexOffset=${indexOffset})`);
    return null;
  }

  /**
   * @param {number} index
   */
  function getRowAt(index) {
	logger.debug(`>>> Entering getRowAt(index=${index})`);
    if (index < 0 || index >= totalCount) return null;
	logger.debug(`<<< Exiting getRowAt(index=${index})`);
    return rowAtInList(nodes, 0, null, index, 0);
  }

  /**
   * Collect `[startIndex, endIndex)` in one cursor walk: skip whole
   * subtrees via `sizeById` until `start`, then emit until `end`.
   * @param {number} startIndex
   * @param {number} endIndex
   */
  function collectRows(startIndex, endIndex) {
	logger.debug(`>>> Entering collectRows(startIndex=${startIndex},endIndex=${endIndex})`);
    const start = Math.max(0, startIndex);
    const end = Math.min(totalCount, endIndex);
	logger.debug(`collectRows(startIndex=${startIndex},endIndex=${endIndex}): end → ${end}`);
    /** @type {Array<{ node: T; depth: number; parentId: string | number | null; posInSet: number; setSize: number; hasChildren: boolean }>} */
    const rows = [];
    if (start >= end) return rows;

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
	logger.debug(`collectRows(startIndex=${startIndex},endIndex=${endIndex}): size → ${size}`);
      const nodeStart = frame.offset;
      const nodeEnd = nodeStart + size;

      if (nodeEnd <= start) {
        // Entire subtree is before the window — skip it.
        frame.index++;
        frame.offset = nodeEnd;
		logger.debug(`collectRows(startIndex=${startIndex},endIndex=${endIndex}): frame.offset → ${frame.offset}`);
        continue;
      }

      if (nodeStart >= end) break;

      const loaded = hasLoadedChildren(node);
	logger.debug(`collectRows(startIndex=${startIndex},endIndex=${endIndex}): loaded → ${loaded}`);
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

	logger.debug(`<<< Exiting collectRows(startIndex=${startIndex},endIndex=${endIndex})`);
    return rows;
  }

  /**
   * @param {string | number} id
   * @returns {number} visible index, or -1 if not currently visible
   */
  function findIndexById(id) {
	logger.debug(`>>> Entering findIndexById(id=${id})`);
    const needle = String(id);
    /**
     * @param {ReadonlyArray<T>} list
     * @param {number} indexOffset
     * @returns {number}
     */
    function findInList(list, indexOffset) {
	logger.debug(`>>> Entering findInList(list=${list},indexOffset=${indexOffset})`);
      let offset = indexOffset;
      for (let i = 0; i < list.length; i++) {
        const node = list[i];
        if (String(node.id) === needle) return offset;
        const size = sizeById.get(node.id) ?? 1;
        if (
          hasLoadedChildren(node) &&
          expandedIdsSet.has(node.id) &&
          size > 1
        ) {
		logger.debug(`findInList(list=${list},indexOffset=${indexOffset}): size → ${size}`);
          const found = findInList(node.nodes, offset + 1);
		logger.debug(`findInList(list=${list},indexOffset=${indexOffset}): found → ${found}`);
          if (found >= 0) return found;
        }
        offset += size;
      }
	logger.debug(`<<< Exiting findInList(list=${list},indexOffset=${indexOffset})`);
	logger.debug(`<<< Exiting findIndexById(id=${id})`);
      return -1;
    }
logger.debug(`<<< Exiting createTreeVirtualIndex(nodes=${nodes},expandedIdsSet=${expandedIdsSet})`);
    return findInList(nodes, 0);
  }

  return { totalCount, getRowAt, collectRows, findIndexById };
}
