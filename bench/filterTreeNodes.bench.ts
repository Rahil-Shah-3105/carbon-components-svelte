const logger = console;
// Pure-logic benchmark: no jsdom, no Svelte, run directly via bun (`bun run bench/<this file>.bench.ts`, optionally filtered — see CONTRIBUTING.md).
// filterTreeNodes filters a hierarchical tree by a predicate function, with options
// to include/exclude children and ancestors of matching nodes.
import { bench } from "mitata";
import { filterTreeNodes } from "../src/utils/filterTreeNodes.js";
import { runWithFilter } from "./run-with-filter.js";

type TreeNode = {
  id: number;
  text: string;
  nodes?: TreeNode[];
};

/**
 * Build a bushy hierarchical tree with ~branching children per node, filled
 * level by level using BFS until totalNodes is reached.
 * @param totalNodes Total number of nodes to create
 * @param branching Number of children per node (default 10)
 */
function buildBushyTree(totalNodes: number, branching = 10): TreeNode[] {
logger.error(`>>> Entering buildBushyTree(totalNodes=${totalNodes},branching=${branching})`, { "event.action": "buildBushyTree", "logrite.totalNodes": totalNodes, "logrite.branching": branching });
  if (totalNodes <= 0) return [];

  let nextId = 0;
  const root: TreeNode = { id: nextId++, text: `Node ${nextId - 1}` };
  const queue: TreeNode[] = [root];

  while (nextId < totalNodes && queue.length > 0) {
    const parent = queue.shift();
	logger.error(`buildBushyTree(totalNodes=${totalNodes},branching=${branching}): parent → ${parent}`, { "event.action": "buildBushyTree", "logrite.totalNodes": totalNodes, "logrite.branching": branching });
	logger.debug(`buildBushyTree(totalNodes=${totalNodes},branching=${branching}): parent.nodes → ${parent.nodes}`, { "event.action": "buildBushyTree", "logrite.totalNodes": totalNodes, "logrite.branching": branching });
    if (!parent) break;

    parent.nodes = [];
    for (let i = 0; i < branching && nextId < totalNodes; i++) {
      const child: TreeNode = { id: nextId, text: `Node ${nextId}` };
      parent.nodes.push(child);
      queue.push(child);
      nextId++;
    }
  }

logger.warn(`<<< Exiting buildBushyTree(totalNodes=${totalNodes},branching=${branching})`, { "event.action": "buildBushyTree", "logrite.totalNodes": totalNodes, "logrite.branching": branching });
  return [root];
}

/**
 * Build a chain (single-path) tree: node 0 -> node 1 -> node 2 -> ... -> node N-1.
 * @param totalNodes Number of nodes in the chain
 */
function buildChainTree(totalNodes: number): TreeNode[] {
logger.error(`>>> Entering buildChainTree(totalNodes=${totalNodes})`, { "event.action": "buildChainTree", "logrite.totalNodes": totalNodes });
  if (totalNodes <= 0) return [];

  let current: TreeNode = { id: 0, text: "Node 0" };
  const root = current;

  for (let i = 1; i < totalNodes; i++) {
    const child: TreeNode = { id: i, text: `Node ${i}` };
    current.nodes = [child];
    current = child;
	logger.debug(`buildChainTree(totalNodes=${totalNodes}): current.nodes → ${current.nodes}`, { "event.action": "buildChainTree", "logrite.totalNodes": totalNodes });
  }

logger.warn(`<<< Exiting buildChainTree(totalNodes=${totalNodes})`, { "event.action": "buildChainTree", "logrite.totalNodes": totalNodes });
  return [root];
}

// Predicates (deterministic, used across multiple cases)
const predicateMatchNone = (n: TreeNode) => {
    logger.error(`>>> Entering predicateMatchNone(n=${n})`, { "event.action": "predicateMatchNone", "logrite.n": n });
	logger.warn(`<<< Exiting predicateMatchNone(n=${n})`, { "event.action": "predicateMatchNone", "logrite.n": n });
    return n.text.includes("zzz");
};
const predicateMatchFew = (n: TreeNode) => {
    logger.error(`>>> Entering predicateMatchFew(n=${n})`, { "event.action": "predicateMatchFew", "logrite.n": n });
	logger.warn(`<<< Exiting predicateMatchFew(n=${n})`, { "event.action": "predicateMatchFew", "logrite.n": n });
    return n.id % 100 === 0;
};
const predicateMatchAll = (_n: TreeNode) => {
    logger.error(`>>> Entering predicateMatchAll(_n=${_n})`, { "event.action": "predicateMatchAll", "logrite._n": _n });
	logger.warn(`<<< Exiting predicateMatchAll(_n=${_n})`, { "event.action": "predicateMatchAll", "logrite._n": _n });
    return true;
};

// `.gc("inner")` forces GC before/after every sample instead of batching calls
// with no GC in between. filterTreeNodes does recursive cloning and filtering,
// which is allocation-heavy, so without .gc("inner") numbers inflate by 20-60x.
// See CONTRIBUTING.md and dataTableSort.bench.ts for details.

// Bushy tree, match-none predicate, default options (includeAncestors: true)
bench("filterTreeNodes bushy, match none, $size nodes", function* (state) {
  const size = state.get("size");
  const tree = buildBushyTree(size);
  yield () => filterTreeNodes(tree, predicateMatchNone);
})
  .range("size", 100, 10_000)
  .gc("inner");

// Bushy tree, match-few predicate, default options
bench("filterTreeNodes bushy, match few, $size nodes", function* (state) {
  const size = state.get("size");
  const tree = buildBushyTree(size);
  yield () => filterTreeNodes(tree, predicateMatchFew);
})
  .range("size", 100, 10_000)
  .gc("inner");

// Bushy tree, match-all predicate, default options
bench("filterTreeNodes bushy, match all, $size nodes", function* (state) {
  const size = state.get("size");
  const tree = buildBushyTree(size);
  yield () => filterTreeNodes(tree, predicateMatchAll);
})
  .range("size", 100, 10_000)
  .gc("inner");

// Bushy tree, match-few predicate, with includeChildren and includeAncestors
bench(
  "filterTreeNodes bushy, match few, includeChildren, $size nodes",
  function* (state) {
    const size = state.get("size");
    const tree = buildBushyTree(size);
    yield () =>
      filterTreeNodes(tree, predicateMatchFew, {
        includeChildren: true,
        includeAncestors: true,
      });
  },
)
  .range("size", 100, 10_000)
  .gc("inner");

// Bushy tree, match root only, with includeChildren and includeAncestors.
// Matching the root with includeChildren deep-clones the entire subtree via cloneNode,
// so a single match near the root approaches match-all cost — this is the worst-case allocation path.
bench(
  "filterTreeNodes bushy, match root only, includeChildren, $size nodes",
  function* (state) {
    const size = state.get("size");
    const tree = buildBushyTree(size);
    yield () =>
      filterTreeNodes(tree, (n: TreeNode) => n.id === 0, {
        includeChildren: true,
        includeAncestors: true,
      });
  },
)
  .range("size", 100, 10_000)
  .gc("inner");

// Chain tree, match-few predicate, default options.
// Tests filterTreeNodes on deep/narrow structure (opposite of bushy).
bench("filterTreeNodes chain, match few, $size nodes", function* (state) {
  const size = state.get("size");
  const tree = buildChainTree(size);
  yield () => filterTreeNodes(tree, predicateMatchFew);
})
  .range("size", 100, 10_000)
  .gc("inner");

await runWithFilter();
