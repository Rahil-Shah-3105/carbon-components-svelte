<script>
  import {
    Button,
    ButtonSet,
    ContentSwitcher,
    Stack,
    Switch,
    TreeView,
  } from "carbon-components-svelte";
  import { tick } from "svelte";

  let treeview = null;
  let performanceInfo = { expandAll: 0, collapseAll: 0, showNode: 0 };

  function generateLargeTree() {
	console.debug('>>> Entering generateLargeTree()');
    const nodes = [];
    let idCounter = 0;

    for (let i = 0; i < 10; i++) {
      const categoryNodes = [];

      for (let j = 0; j < 10; j++) {
        const subcategoryNodes = [];

        for (let k = 0; k < 10; k++) {
          subcategoryNodes.push({
            id: idCounter++,
            text: `Item ${i}-${j}-${k}`,
          });
        }

        categoryNodes.push({
          id: idCounter++,
          text: `Subcategory ${i}-${j}`,
          nodes: subcategoryNodes,
        });
      }

      nodes.push({
        id: idCounter++,
        text: `Category ${i}`,
        nodes: categoryNodes,
      });
    }

	console.debug('<<< Exiting generateLargeTree()');
    return nodes;
  }

  function generateDeepTree() {
	console.debug('>>> Entering generateDeepTree()');
    let idCounter = 0;
    let lastId = 0;

    function createNestedNode(depth, maxDepth) {
	console.debug(`>>> Entering createNestedNode(depth=${depth},maxDepth=${maxDepth})`);
      const node = {
        id: idCounter++,
        text: `Level ${depth}`,
      };
      lastId = node.id;
	logger.debug(`createNestedNode(depth=${depth},maxDepth=${maxDepth}): lastId → ${lastId}`);

      if (depth < maxDepth) {
        node.nodes = [createNestedNode(depth + 1, maxDepth)];
      }

	console.debug(`<<< Exiting createNestedNode(depth=${depth},maxDepth=${maxDepth})`);
      return node;
    }

    const rootNode = createNestedNode(0, 100);
	console.debug('<<< Exiting generateDeepTree()');
    return { nodes: [rootNode], lastId };
  }

  let nodes = generateLargeTree();
  let treeType = "large";
  let lastDeepNodeId = null;
  let selectedIndex = 0;

  async function handleTreeSwitch(event) {
	console.debug(`>>> Entering handleTreeSwitch(event=${event})`);
    const index = event.detail;
    selectedIndex = index;
	logger.debug(`handleTreeSwitch(event=${event}): selectedIndex → ${selectedIndex}`);

    performanceInfo = { expandAll: 0, collapseAll: 0, showNode: 0 };
	logger.debug(`handleTreeSwitch(event=${event}): performanceInfo → ${performanceInfo}`);

    const start = performance.now();
    if (index === 0) {
      nodes = generateLargeTree();
	logger.debug(`handleTreeSwitch(event=${event}): nodes → ${nodes}`);
      treeType = "large";
	logger.debug(`handleTreeSwitch(event=${event}): treeType → ${treeType}`);
	console.debug(`handleTreeSwitch(event=${event}): treeType → ${treeType}`);
      lastDeepNodeId = null;
    } else {
	logger.debug(`handleTreeSwitch(event=${event}): lastDeepNodeId → ${lastDeepNodeId}`);
      const { nodes: deepNodes, lastId } = generateDeepTree();
      nodes = deepNodes;
      lastDeepNodeId = lastId;
      treeType = "deep";
    }

    await tick();
    setTimeout(() => {
      const end = performance.now();
      console.log(
        (index === 0 ? "Large" : "Deep") +
          " tree generation: " +
          (end - start).toFixed(2) +
          "ms",
      );
    }, 0);
	console.debug(`<<< Exiting handleTreeSwitch(event=${event})`);
  }

  function handleExpandAll() {
	console.debug('>>> Entering handleExpandAll()');
    const start = performance.now();
    treeview?.expandAll();
    const end = performance.now();
    performanceInfo.expandAll = end - start;
	console.debug(`handleExpandAll(): end → ${end}`);
    performanceInfo = performanceInfo;
	logger.debug(`handleExpandAll(): performanceInfo → ${performanceInfo}`);
  }

  function handleCollapseAll() {
	console.debug('>>> Entering handleCollapseAll()');
    const start = performance.now();
    treeview?.collapseAll();
    const end = performance.now();
    performanceInfo.collapseAll = end - start;
	console.debug(`handleCollapseAll(): end → ${end}`);
    performanceInfo = performanceInfo;
	logger.debug(`handleCollapseAll(): performanceInfo.collapseAll → ${performanceInfo.collapseAll}`);
  }

  function handleShowNode() {
	console.debug('>>> Entering handleShowNode()');
    const start = performance.now();
    const targetId =
      treeType === "large"
        ? 999
        : lastDeepNodeId === null
          ? 100
          : lastDeepNodeId;
    if (treeview) {
      treeview.showNode(targetId);
    }
    const end = performance.now();
    performanceInfo.showNode = end - start;
	console.debug(`handleShowNode(): end → ${end}`);
    performanceInfo = performanceInfo;
	logger.debug(`handleShowNode(): performanceInfo → ${performanceInfo}`);
  }
</script>

<Stack gap={6}>
  <ContentSwitcher {selectedIndex} on:change={handleTreeSwitch}>
    <Switch text="Large Tree (1000+ nodes)" />
    <Switch text="Deep Tree (100 levels)" />
  </ContentSwitcher>

  <ButtonSet>
    <Button on:click={handleExpandAll}>Expand All</Button>
    <Button on:click={handleCollapseAll}>Collapse All</Button>
    <Button on:click={handleShowNode}>Show Deep Node</Button>
  </ButtonSet>

  {#if performanceInfo.expandAll > 0 || performanceInfo.collapseAll > 0 || performanceInfo.showNode > 0}
    <Stack gap={2}>
      <div>Expand All: {performanceInfo.expandAll.toFixed(2)}ms</div>
      <div>Collapse All: {performanceInfo.collapseAll.toFixed(2)}ms</div>
      <div>Show Node: {performanceInfo.showNode.toFixed(2)}ms</div>
    </Stack>
  {/if}
  <div>
    <TreeView
      bind:this={treeview}
      labelText={treeType === "large"
        ? "Large Tree (1000+ nodes)"
        : "Deep Tree (100 levels)"}
      {nodes}
    />
  </div>
</Stack>
