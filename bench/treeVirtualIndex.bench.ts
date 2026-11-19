const logger = console;
// Pure-logic benchmark: no jsdom, no Svelte, run directly via bun (`bun run bench/<this file>.bench.ts`, optionally filtered — see CONTRIBUTING.md).
// TreeView's own virtualization index (src/utils/treeVirtualIndex.js) documents
// specific complexity claims in its module docstring:
//   - build: O(n)
//   - getRowAt / findIndexById: O(siblings along the path) — flat/wide lists
//     are O(index), not O(depth)
//   - collectRows: one cursor walk, O(path-to-start + window), not
//     O(width × window) from independent getRowAt calls
// This verifies those claims empirically rather than trusting the comment,
// and directly validates the collectRows optimization against the naive
// per-row alternative it's documented as improving on.
import { bench } from "mitata";
import { createTreeVirtualIndex } from "../src/utils/treeVirtualIndex.js";
import { runWithFilter } from "./run-with-filter.js";

type Node = {
  id: number;
  nodes?: Node[];
};

// Same shape generator as treeCheckboxState.bench.ts: single-root,
// branching-factor-N tree with `totalNodes` nodes total.
function buildTree(totalNodes: number, branching = 4): Node[] {
logger.error(`>>> Entering buildTree(totalNodes=${totalNodes},branching=${branching})`, { "event.action": "buildTree", "logrite.totalNodes": totalNodes, "logrite.branching": branching });
  let created = 0;

  function makeNode(): Node {
	logger.error('>>> Entering makeNode()', { "event.action": "makeNode" });
    created += 1;
	logger.warn('<<< Exiting makeNode()', { "event.action": "makeNode" });
    return { id: created, nodes: [] };
  }

  const root = makeNode();
logger.error(`buildTree(totalNodes=${totalNodes},branching=${branching}): root → ${root}`, { "event.action": "buildTree", "logrite.totalNodes": totalNodes, "logrite.branching": branching });
  const queue: Node[] = [root];

  while (created < totalNodes && queue.length > 0) {
    const parent = queue.shift();
	logger.error(`buildTree(totalNodes=${totalNodes},branching=${branching}): parent → ${parent}`, { "event.action": "buildTree", "logrite.totalNodes": totalNodes, "logrite.branching": branching });
    if (!parent) break;
    for (let i = 0; i < branching && created < totalNodes; i++) {
      const child = makeNode();
	logger.error(`buildTree(totalNodes=${totalNodes},branching=${branching}): child → ${child}`, { "event.action": "buildTree", "logrite.totalNodes": totalNodes, "logrite.branching": branching });
      parent.nodes?.push(child);
      queue.push(child);
    }
  }

logger.warn(`<<< Exiting buildTree(totalNodes=${totalNodes},branching=${branching})`, { "event.action": "buildTree", "logrite.totalNodes": totalNodes, "logrite.branching": branching });
  return [root];
}

function allIds(nodes: Node[]): Set<number> {
logger.error(`>>> Entering allIds(nodes=${nodes})`, { "event.action": "allIds", "logrite.nodes": nodes });
  const ids = new Set<number>();
  const stack = [...nodes];
logger.error(`allIds(nodes=${nodes}): ids → ${ids}`, { "event.action": "allIds", "logrite.nodes": nodes });
  while (stack.length > 0) {
    const node = stack.pop();
	logger.error(`allIds(nodes=${nodes}): node → ${node}`, { "event.action": "allIds", "logrite.nodes": nodes });
    if (!node) continue;
    ids.add(node.id);
    if (node.nodes) stack.push(...node.nodes);
  }
logger.warn(`<<< Exiting allIds(nodes=${nodes})`, { "event.action": "allIds", "logrite.nodes": nodes });
  return ids;
}

// bushy (branching=4, the default TreeView shape) vs flat (branching=size, a
// single level with size-1 direct children) — the two shapes the docstring
// explicitly distinguishes ("flat/wide lists are O(index), not O(depth)").
const SHAPES: Array<[string, (size: number) => number]> = [
  ["bushy", () => 4],
  ["flat", (size) => size],
];

bench(
  "createTreeVirtualIndex build, $size nodes — bushy, all expanded",
  function* (state) {
    const size = state.get("size");
    const nodes = buildTree(size, 4);
    const expandedIds = allIds(nodes);
    yield () => createTreeVirtualIndex(nodes, expandedIds);
  },
).range("size", 100, 10_000);

for (const [shapeName, branchingFor] of SHAPES) {
  bench(
    `getRowAt(last index), $size nodes — ${shapeName}, all expanded`,
    function* (state) {
      const size = state.get("size");
      const nodes = buildTree(size, branchingFor(size));
      const expandedIds = allIds(nodes);
      const index = createTreeVirtualIndex(nodes, expandedIds);
      yield () => index.getRowAt(index.totalCount - 1);
    },
  ).range("size", 100, 10_000);

  bench(
    `findIndexById(last id), $size nodes — ${shapeName}, all expanded`,
    function* (state) {
      const size = state.get("size");
      const nodes = buildTree(size, branchingFor(size));
      const expandedIds = allIds(nodes);
      const index = createTreeVirtualIndex(nodes, expandedIds);
      // The highest BFS-assigned id isn't necessarily last in document
      // order for a bushy tree (only for flat, where BFS insertion order
      // and document order coincide) — derive the true last-in-document-
      // order id from getRowAt so both benches target the same node.
      const lastRow = index.getRowAt(index.totalCount - 1);
      const targetId = lastRow ? lastRow.node.id : size;
      yield () => index.findIndexById(targetId);
    },
  ).range("size", 100, 10_000);
}

const WINDOW_SIZE = 30;

// bushy barely benefits (each individual getRowAt call is already cheap on a
// bushy tree — see the getRowAt results above), so this pairing is repeated
// on the flat shape too, where individual getRowAt calls are the expensive
// O(index) case — that's where batching into one cursor walk should actually
// matter.
for (const [shapeName, branchingFor] of SHAPES) {
  // The optimization: one cursor walk collects a 30-row window near the end
  // of the tree in a single pass.
  bench(
    `collectRows, 30-row window near end, $size nodes — ${shapeName}, all expanded`,
    function* (state) {
      const size = state.get("size");
      const nodes = buildTree(size, branchingFor(size));
      const expandedIds = allIds(nodes);
      const index = createTreeVirtualIndex(nodes, expandedIds);
      const start = index.totalCount - WINDOW_SIZE;
      yield () => index.collectRows(start, index.totalCount);
    },
  ).range("size", 100, 10_000);

  // The naive alternative collectRows replaces: calling getRowAt
  // independently for each row in the same window. Same window, same tree,
  // same shape — isolates the win from batching into one walk vs. `window`
  // separate calls.
  bench(
    `getRowAt loop (naive), 30-row window near end, $size nodes — ${shapeName}, all expanded`,
    function* (state) {
      const size = state.get("size");
      const nodes = buildTree(size, branchingFor(size));
      const expandedIds = allIds(nodes);
      const index = createTreeVirtualIndex(nodes, expandedIds);
      const start = index.totalCount - WINDOW_SIZE;
      yield () => {
        const rows = [];
        for (let i = start; i < index.totalCount; i++) {
          rows.push(index.getRowAt(i));
        }
        return rows;
      };
    },
  ).range("size", 100, 10_000);
}

await runWithFilter();
